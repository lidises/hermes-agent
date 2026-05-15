"""Tests for pure AI Office controlled-mutation request DTO validation."""

import pytest


@pytest.fixture
def safe_request_event_payload():
    return {
        "request_id": "req_20260515_demo",
        "correlation_id": "corr_20260515_demo",
        "actor_ref": "actor:user-boss",
        "intent_kind": "action_requested",
        "action_kind": "kanban_comment",
        "authority_level": "request_only",
        "risk_class": "low",
        "target_ref": "kanban:task-demo",
        "reason_code": "status_note_requested",
        "safe_summary": "Request a board status note using safe summary only.",
        "evidence_refs": ["paperclip:source-tag-demo", "projection:active-cache-demo"],
        "requested_at": "2026-05-15T10:15:00Z",
    }


def test_request_event_validation_accepts_safe_allowlisted_payload(safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_request_event

    result = validate_office_controlled_mutation_request_event(safe_request_event_payload)

    assert result["valid"] is True
    assert result["errors"] == []
    assert result["dto"] == {
        "schema_version": 1,
        "mode": "validated_request_event",
        "request_id": "req_20260515_demo",
        "correlation_id": "corr_20260515_demo",
        "actor_ref": "actor:user-boss",
        "intent_kind": "action_requested",
        "action_kind": "kanban_comment",
        "authority_level": "request_only",
        "risk_class": "low",
        "target_ref": "kanban:task-demo",
        "reason_code": "status_note_requested",
        "safe_summary": "Request a board status note using safe summary only.",
        "evidence_refs": ["paperclip:source-tag-demo", "projection:active-cache-demo"],
        "requested_at": "2026-05-15T10:15:00Z",
        "capabilities": {
            "request_creation_enabled": False,
            "persistence_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
        },
    }


def test_request_event_validation_rejects_raw_or_unallowlisted_fields(safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_request_event

    payload = {
        **safe_request_event_payload,
        "prompt": "raw prompt must not be echoed",
        "task_body": "raw task body must not be echoed",
        "transcript": "Traceback private transcript must not leak",
        "path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
        "token": "sk-test-secret",
        "extra": "unexpected extra should not be echoed",
    }

    result = validate_office_controlled_mutation_request_event(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert result["errors"] == [
        {"field": "unsupported_fields", "code": "unsupported_field"},
    ]
    serialized = str(result).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "***" not in serialized
    assert "prompt" not in serialized
    assert "provider" not in serialized
    assert "task_body" not in serialized


def test_request_event_validation_rejects_malformed_top_level_payloads():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_request_event

    for payload in (None, [], "not-a-mapping"):
        result = validate_office_controlled_mutation_request_event(payload)
        assert result == {
            "valid": False,
            "errors": [{"field": "payload", "code": "invalid_payload_type"}],
            "dto": None,
        }


def test_request_event_validation_rejects_executable_or_persistence_authority(safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_request_event

    payload = {
        **safe_request_event_payload,
        "authority_level": "human_approved_execute",
        "action_kind": "service_restart_request",
    }

    result = validate_office_controlled_mutation_request_event(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert result["errors"] == [
        {"field": "action_kind", "code": "unsupported_request_event_action"},
        {"field": "authority_level", "code": "unsupported_request_event_authority"},
    ]


def test_request_event_validation_rejects_bad_opaque_refs(safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_request_event

    payload = {
        **safe_request_event_payload,
        "request_id": "../bad",
        "target_ref": "/Users/lidises/private/source.md",
        "evidence_refs": ["paperclip:ok", "https://example.com/raw-source"],
    }

    result = validate_office_controlled_mutation_request_event(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert result["errors"] == [
        {"field": "evidence_refs", "code": "invalid_opaque_ref"},
        {"field": "request_id", "code": "invalid_opaque_id"},
        {"field": "target_ref", "code": "invalid_opaque_ref"},
    ]
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "https://example.com" not in serialized


def test_request_event_validate_api_requires_dashboard_session_token(safe_request_event_payload):
    fastapi = pytest.importorskip("fastapi")
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    assert fastapi is not None
    client = TestClient(app)
    resp = client.post("/api/office/controlled-mutation/request/validate", json=safe_request_event_payload)

    assert resp.status_code == 401


def test_request_event_validate_api_is_protected_validate_only_route(safe_request_event_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/request/validate"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_request_event_payload)

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["dto"]["mode"] == "validated_request_event"
    assert payload["dto"]["capabilities"]["request_creation_enabled"] is False
    assert payload["dto"]["capabilities"]["persistence_enabled"] is False
    assert payload["dto"]["capabilities"]["audit_write_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_save_enabled"] is False
    assert "mutation_id" not in str(payload).lower()


def test_request_event_validate_api_rejects_raw_values_without_echo(safe_request_event_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    payload = {
        **safe_request_event_payload,
        "prompt": "raw prompt must not be echoed",
        "path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
    }
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/request/validate",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=payload,
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(body).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "prompt" not in serialized


def test_request_event_validate_api_handles_non_object_json_without_echo():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/request/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    expected = {
        "valid": False,
        "errors": [{"field": "payload", "code": "invalid_payload_type"}],
        "dto": None,
    }
    for payload in (None, ["/Users/lidises/private/source.md"], "raw prompt must not echo", 7):
        resp = client.post(route, headers=headers, json=payload)
        assert resp.status_code == 200
        assert resp.json() == expected
        serialized = str(resp.json()).lower()
        assert "/users/lidises" not in serialized
        assert "raw prompt" not in serialized


def test_request_event_validate_api_does_not_echo_malformed_json_body():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/request/validate",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN, "content-type": "application/json"},
        content='{"prompt":"raw prompt must not echo","path":"/Users/lidises/private/source.md"',
    )

    assert resp.status_code == 422
    serialized = resp.text.lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized


def test_request_event_validate_api_rejects_non_validate_methods(safe_request_event_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/request/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    for method in (client.put, client.patch, client.delete):
        resp = method(route, headers=headers)
        assert resp.status_code in {404, 405}


def test_request_event_append_and_readback_store_safe_dto_only(tmp_path, safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_request_event,
        list_office_controlled_mutation_request_events,
    )

    store_path = tmp_path / "requests.jsonl"
    result = append_office_controlled_mutation_request_event(
        {
            **safe_request_event_payload,
            "prompt": "raw prompt must not be echoed",
            "path": "/Users/lidises/private/source.md",
        },
        store_path=store_path,
    )

    assert result == {
        "stored": False,
        "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}],
        "dto": None,
    }
    assert not store_path.exists()

    result = append_office_controlled_mutation_request_event(safe_request_event_payload, store_path=store_path)

    assert result["stored"] is True
    assert result["errors"] == []
    assert result["dto"]["mode"] == "validated_request_event"
    assert result["dto"]["capabilities"]["request_creation_enabled"] is True
    assert result["dto"]["capabilities"]["persistence_enabled"] is True
    assert result["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert result["dto"]["capabilities"]["target_mutation_enabled"] is False
    assert result["dto"]["capabilities"]["audit_write_enabled"] is False
    assert result["dto"]["capabilities"]["nas_save_enabled"] is False
    assert store_path.exists()

    events = list_office_controlled_mutation_request_events(store_path=store_path)
    assert events["count"] == 1
    assert events["events"] == [result["dto"]]
    assert events["capabilities"] == {
        "readback_enabled": True,
        "dry_run_execution_enabled": False,
        "human_decision_recording_enabled": False,
        "authority_adapter_enabled": False,
        "target_mutation_enabled": False,
        "audit_write_enabled": False,
        "nas_save_enabled": False,
    }
    serialized = str(events).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized


def test_request_event_append_api_is_protected_and_writes_under_hermes_home(monkeypatch, tmp_path, safe_request_event_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/request"

    unauthenticated = client.post(route, json=safe_request_event_payload)
    assert unauthenticated.status_code == 401

    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_request_event_payload)
    assert resp.status_code == 200
    body = resp.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["persistence_enabled"] is True
    assert body["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert body["dto"]["capabilities"]["target_mutation_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "requests.jsonl"
    assert store_path.exists()
    assert store_path.read_text().count("\n") == 1

    readback = client.get("/api/office/controlled-mutation/requests", headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["count"] == 1
    assert payload["events"][0]["request_id"] == safe_request_event_payload["request_id"]
    assert payload["capabilities"]["readback_enabled"] is True
    assert payload["capabilities"]["audit_write_enabled"] is False
    assert payload["capabilities"]["nas_save_enabled"] is False


def test_request_event_append_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_request_event_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    payload = {
        **safe_request_event_payload,
        "prompt": "raw prompt must not be echoed",
        "path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
    }

    resp = client.post(
        "/api/office/controlled-mutation/request",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=payload,
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not (tmp_path / "office" / "controlled-mutation" / "requests.jsonl").exists()
    serialized = str(body).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_request_event_readback_skips_tampered_raw_jsonl_entries(tmp_path, safe_request_event_payload):
    import json
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_request_event,
        list_office_controlled_mutation_request_events,
    )

    store_path = tmp_path / "requests.jsonl"
    append_office_controlled_mutation_request_event(safe_request_event_payload, store_path=store_path)
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps({"prompt": "raw prompt must not be echoed", "path": "/Users/lidises/private/source.md"}) + "\n")

    result = list_office_controlled_mutation_request_events(store_path=store_path)

    assert result["count"] == 1
    assert result["events"][0]["request_id"] == safe_request_event_payload["request_id"]
    serialized = str(result).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized


def test_request_event_readback_limit_zero_returns_no_events(tmp_path, safe_request_event_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_request_event,
        list_office_controlled_mutation_request_events,
    )

    store_path = tmp_path / "requests.jsonl"
    append_office_controlled_mutation_request_event(safe_request_event_payload, store_path=store_path)

    result = list_office_controlled_mutation_request_events(store_path=store_path, limit=0)

    assert result["count"] == 0
    assert result["events"] == []


def test_request_event_readback_api_requires_dashboard_session_token(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)

    resp = client.get("/api/office/controlled-mutation/requests")

    assert resp.status_code == 401
