"""Tests for AI Office controlled-mutation audit append/readback boundary."""

import pytest


@pytest.fixture
def safe_audit_payload():
    return {
        "audit_id": "audit_20260516_demo",
        "request_id": "req_20260515_demo",
        "correlation_id": "corr_20260515_demo",
        "event_kind": "dry_run_result_recorded",
        "actor_ref": "actor:orchestrator",
        "safe_summary": "Audit records safe dry run result storage only.",
        "evidence_refs": ["paperclip:source-tag-demo", "projection:active-cache-demo"],
        "recorded_at": "2026-05-16T09:30:00Z",
    }


def test_audit_event_validation_accepts_safe_event_kinds(safe_audit_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_audit_event

    for event_kind in ("request_recorded", "decision_recorded", "dry_run_result_recorded", "execution_blocked"):
        result = validate_office_controlled_mutation_audit_event({**safe_audit_payload, "event_kind": event_kind})

        assert result["valid"] is True
        assert result["errors"] == []
        assert result["dto"]["mode"] == "validated_audit_event"
        assert result["dto"]["event_kind"] == event_kind
        assert result["dto"]["capabilities"] == {
            "audit_append_enabled": False,
            "audit_readback_enabled": False,
            "audit_write_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        }


def test_audit_event_validation_rejects_raw_or_unallowlisted_fields_without_echo(safe_audit_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_audit_event

    payload = {
        **safe_audit_payload,
        "raw_log": "raw audit log must not echo",
        "command": "python /Users/lidises/private/target.py",
        "target_path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
        "token": "***",
    }

    result = validate_office_controlled_mutation_audit_event(payload)

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "raw audit" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "***" not in serialized
    assert "command" not in serialized


def test_audit_event_validation_rejects_secret_like_allowlisted_values_without_echo(safe_audit_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_audit_event

    secret_summary = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "safe_summary": "password hunter2 should not be stored"}
    )
    secret_ref = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "evidence_refs": ["secret:hunter2"]}
    )
    api_key_summary = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "safe_summary": "api key hunter2 should not be stored"}
    )
    bearer_summary = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "safe_summary": "authorization bearer hunter2 should not be stored"}
    )
    api_key_ref = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "evidence_refs": ["api_key:hunter2"]}
    )
    auth_ref = validate_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "evidence_refs": ["auth:hunter2"]}
    )

    assert secret_summary == {
        "valid": False,
        "errors": [{"field": "safe_summary", "code": "invalid_safe_text"}],
        "dto": None,
    }
    for result in (api_key_summary, bearer_summary):
        assert result == {
            "valid": False,
            "errors": [{"field": "safe_summary", "code": "invalid_safe_text"}],
            "dto": None,
        }
    for result in (secret_ref, api_key_ref, auth_ref):
        assert result == {
            "valid": False,
            "errors": [{"field": "evidence_refs", "code": "invalid_opaque_ref"}],
            "dto": None,
        }
    serialized = str([secret_summary, secret_ref, api_key_summary, bearer_summary, api_key_ref, auth_ref]).lower()
    assert "hunter2" not in serialized
    assert "password" not in serialized
    assert "secret" not in serialized
    assert "api key" not in serialized
    assert "authorization" not in serialized


def test_audit_append_and_readback_records_safe_dto_only(tmp_path, safe_audit_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        list_office_controlled_mutation_audit_events,
    )

    store_path = tmp_path / "audit_events.jsonl"
    raw_result = append_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "raw_log": "raw audit log must not echo"},
        store_path=store_path,
    )

    assert raw_result == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not store_path.exists()

    stored = append_office_controlled_mutation_audit_event(safe_audit_payload, store_path=store_path)

    assert stored["stored"] is True
    assert stored["errors"] == []
    assert stored["dto"]["mode"] == "validated_audit_event"
    assert stored["dto"]["capabilities"]["audit_append_enabled"] is True
    assert stored["dto"]["capabilities"]["audit_readback_enabled"] is True
    assert stored["dto"]["capabilities"]["audit_write_enabled"] is True
    assert stored["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert stored["dto"]["capabilities"]["target_mutation_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_save_enabled"] is False
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_audit_events(store_path=store_path)
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["audit_readback_enabled"] is True
    assert readback["capabilities"]["dry_run_execution_enabled"] is False
    assert readback["capabilities"]["target_mutation_enabled"] is False


def test_audit_append_rejects_duplicate_audit_id_without_second_write(tmp_path, safe_audit_payload):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_audit_event

    store_path = tmp_path / "audit_events.jsonl"
    first = append_office_controlled_mutation_audit_event(safe_audit_payload, store_path=store_path)
    duplicate = append_office_controlled_mutation_audit_event(
        {**safe_audit_payload, "safe_summary": "Duplicate audit id must not write."},
        store_path=store_path,
    )

    assert first["stored"] is True
    assert duplicate == {
        "stored": False,
        "errors": [{"field": "audit_id", "code": "duplicate_audit_id"}],
        "dto": None,
    }
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_audit_readback_filters_by_safe_request_correlation_and_event_kind_without_raw_echo(tmp_path, safe_audit_payload):
    import json
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        list_office_controlled_mutation_audit_events,
    )

    store_path = tmp_path / "audit_events.jsonl"
    append_office_controlled_mutation_audit_event(safe_audit_payload, store_path=store_path)
    append_office_controlled_mutation_audit_event(
        {
            **safe_audit_payload,
            "audit_id": "audit_20260516_other",
            "request_id": "req_20260515_other",
            "correlation_id": "corr_20260515_other",
            "event_kind": "decision_recorded",
        },
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write('{"raw_log":"raw audit log must not echo","path":"/Users/lidises/private/source.md"}\n')
        handle.write("not-json with /Users/lidises/private/source.md\n")

    result = list_office_controlled_mutation_audit_events(
        store_path=store_path,
        request_id=safe_audit_payload["request_id"],
        correlation_id=safe_audit_payload["correlation_id"],
        event_kind=safe_audit_payload["event_kind"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["request_id"] == safe_audit_payload["request_id"]
    assert result["correlation_id"] == safe_audit_payload["correlation_id"]
    assert result["event_kind"] == safe_audit_payload["event_kind"]
    assert result["events"][0]["audit_id"] == safe_audit_payload["audit_id"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "raw audit" not in serialized
    assert "/users/lidises" not in serialized


def test_audit_api_is_protected_records_and_reads_under_hermes_home(monkeypatch, tmp_path, safe_audit_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/audit"

    unauthenticated = client.post(route, json=safe_audit_payload)
    assert unauthenticated.status_code == 401

    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_audit_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["audit_append_enabled"] is True
    assert body["dto"]["capabilities"]["audit_write_enabled"] is True
    assert body["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert body["dto"]["capabilities"]["target_mutation_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "audit_events.jsonl"
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = client.get(
        f"/api/office/controlled-mutation/audit?request_id={safe_audit_payload['request_id']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["audit_id"] == safe_audit_payload["audit_id"]
    assert payload["capabilities"]["dry_run_execution_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False


def test_audit_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_audit_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/audit",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_audit_payload,
            "raw_log": "raw audit log must not echo",
            "path": "/Users/lidises/private/source.md",
            "provider": "private-provider-id",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not (tmp_path / "office" / "controlled-mutation" / "audit_events.jsonl").exists()
    serialized = str(body).lower()
    assert "raw audit" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_audit_readback_api_requires_dashboard_session_token(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)

    resp = client.get("/api/office/controlled-mutation/audit")

    assert resp.status_code == 401
