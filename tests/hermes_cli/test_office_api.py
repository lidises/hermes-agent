"""Tests for the protected AI Office dashboard API."""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def test_office_state_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)

    resp = unauth_client.get("/api/office/state")

    assert resp.status_code == 401


def test_office_events_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)

    resp = unauth_client.get("/api/office/events")

    assert resp.status_code == 401


def test_office_projection_dry_run_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)

    resp = unauth_client.post("/api/office/projection/ingest-dry-run", json={"bundle_path": "pcwb-safe-001"})

    assert resp.status_code == 401


def test_office_projection_dry_run_is_protected_and_does_not_mutate_cache(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from tests.hermes_cli.test_office_projection_cache import write_bundle
    from hermes_cli.office_projection import read_office_projection_cache
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    home = tmp_path / "hermes"
    write_bundle(home / "office" / "projections" / "incoming", "pcwb-safe-dryrun")
    assert "/api/office/projection/ingest-dry-run" not in _PUBLIC_API_PATHS

    client = TestClient(app)
    resp = client.post(
        "/api/office/projection/ingest-dry-run",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={"bundle_path": "pcwb-safe-dryrun"},
    )

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["status"] == "would_promote"
    assert payload["dry_run"] is True
    assert payload["action"] == "projection_ingest_promote"
    assert payload["bundle_path"] == "pcwb-safe-dryrun"
    assert read_office_projection_cache()["status"] == "missing"
    assert not (home / "office" / "projections" / "active" / "pcwb-safe-dryrun").exists()


def test_office_projection_dry_run_rejects_path_traversal_without_echoing_value(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    resp = client.post(
        "/api/office/projection/ingest-dry-run",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={"bundle_path": "../secret/.env"},
    )

    assert resp.status_code == 400
    assert resp.json() == {"detail": "Unsupported office projection bundle"}
    assert "secret" not in str(resp.json()).lower()
    assert ".env" not in str(resp.json()).lower()


def test_office_state_is_protected_builtin_route_and_returns_read_only_dto():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    assert "/api/office/state" not in _PUBLIC_API_PATHS
    assert not "/api/office/state".startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get("/api/office/state", headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "read_only"
    assert payload["display_mode"] == "localhost"
    assert payload["capabilities"]["read_only"] is True
    assert payload["capabilities"]["mutations_enabled"] is False
    assert payload["capabilities"]["remote_mode"] == "unsupported"
    assert payload["redactions"]["policy_version"] == 1
    assert payload["projection_cache"] == {
        "schema_version": 1,
        "status": "missing",
        "redacted": True,
        "cache_layout": {
            "incoming": "incoming",
            "active": "active",
            "archive": "archive",
            "rejected": "rejected",
        },
        "active": None,
        "rejected": {"count": 0, "recent": []},
    }
    assert {source["status"] for source in payload["data_sources"]} == {"missing"}


def test_office_events_is_protected_builtin_route_and_returns_safe_stream_shape():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    assert "/api/office/events" not in _PUBLIC_API_PATHS
    assert not "/api/office/events".startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get("/api/office/events", headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "read_only"
    assert payload["stream"] == "safe_snapshot_events"
    assert payload["redacted"] is True
    assert payload["fallback"] == "frontend_safe_projection"
    assert isinstance(payload["generated_at"], str)
    assert payload["events"]
    first = payload["events"][0]
    assert set(first) == {"id", "category", "room_id", "tone", "count", "generated_at", "redacted"}
    assert first["category"] in {"snapshot_static", "source_health_changed", "workload_changed", "attention_changed"}
    assert first["room_id"] in {"sessions", "work", "automation", "routing"}
    assert first["tone"] in {"neutral", "positive", "warning", "negative"}
    assert first["redacted"] is True
    assert "prompt" not in str(payload).lower()
    assert "transcript" not in str(payload).lower()
    assert "provider" not in str(payload).lower()
    assert "model" not in str(payload).lower()


def test_office_api_rejects_ambiguous_repeated_display_mode_values():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    for path in ("/api/office/state", "/api/office/events"):
        resp = client.get(f"{path}?mode=remote&mode=localhost", headers=headers)
        assert resp.status_code == 400
        payload = resp.json()
        assert payload == {"detail": "Unsupported office display mode"}
        assert "remote" not in str(payload).lower()
        assert "localhost" not in str(payload).lower()


def test_office_events_rejects_common_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method("/api/office/events", headers=headers)
        assert resp.status_code in {404, 405}


def test_office_state_rejects_common_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method("/api/office/state", headers=headers)
        assert resp.status_code in {404, 405}


def test_kanban_office_state_exposes_only_safe_renderer_fields(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))

    from hermes_cli import kanban_db as kb
    from hermes_cli.office_adapters import collect_kanban_office_state

    kb.create_board("ai-office", name="AI Office")
    with kb.connect(board="ai-office") as conn:
        parent_id = kb.create_task(
            conn,
            title="secret parent title",
            body="raw body token must not leak",
            assignee="ai-office-orchestrator",
            tenant="ai-office",
            priority=7,
        )
        child_id = kb.create_task(
            conn,
            title="secret child title",
            body="raw prompt transcript must not leak",
            assignee="renderer-worker sk-testsecret123",
            tenant="/Users/lidises/nas/private-ai-office",
            parents=[parent_id],
        )
        kb.complete_task(conn, parent_id, result="raw result secret must not leak")

    result = collect_kanban_office_state()

    assert result.source.status in {"ok", "partial"}
    tasks = {item["task_ref"]: item for item in result.work_items if item.get("board_id") == "ai-office"}
    assert set(tasks) == {parent_id, child_id}
    assert tasks[parent_id]["assignee"] == "ai-office-orchestrator"
    assert tasks[parent_id]["tenant"] == "ai-office"
    assert tasks[parent_id]["dependency_counts"] == {"parents": 0, "children": 1}
    assert tasks[parent_id]["child_task_refs"] == [child_id]
    assert tasks[parent_id]["parent_task_refs"] == []
    assert "graph_parent" in tasks[parent_id]["badges"]
    assert tasks[child_id]["parent_task_refs"] == [parent_id]
    assert tasks[child_id]["assignee"] == "renderer-worker [REDACTED]"
    assert tasks[child_id]["tenant"] == "[REDACTED]"
    assert "graph_child" in tasks[child_id]["badges"]
    assert result.redactions.redacted_field_count >= 2
    serialized = str(result.to_payload()).lower()
    assert "secret parent title" not in serialized
    assert "secret child title" not in serialized
    assert "raw body" not in serialized
    assert "raw result" not in serialized
    assert "prompt" not in serialized
    assert "transcript" not in serialized
    assert "sk-testsecret123" not in serialized
    assert "/users/lidises/nas" not in serialized
