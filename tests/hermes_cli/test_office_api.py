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
