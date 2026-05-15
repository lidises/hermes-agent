"""Tests for AI Office controlled-mutation human decision recording store."""

import pytest


@pytest.fixture
def safe_decision_payload():
    return {
        "decision_id": "dec_20260516_demo",
        "request_id": "req_20260515_demo",
        "correlation_id": "corr_20260515_demo",
        "decision": "hold",
        "decided_by": "actor:user-boss",
        "safe_reason_summary": "Hold until request evidence is reviewed.",
        "evidence_refs": ["paperclip:source-tag-demo", "projection:active-cache-demo"],
        "decided_at": "2026-05-16T08:50:00Z",
    }


def test_decision_validation_accepts_safe_approve_reject_hold_payload(safe_decision_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_decision_event

    for decision in ("approve", "reject", "hold"):
        result = validate_office_controlled_mutation_decision_event({**safe_decision_payload, "decision": decision})

        assert result["valid"] is True
        assert result["errors"] == []
        assert result["dto"]["mode"] == "validated_human_decision_event"
        assert result["dto"]["decision"] == decision
        assert result["dto"]["capabilities"] == {
            "human_decision_recording_enabled": False,
            "decision_append_enabled": False,
            "decision_readback_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }


def test_decision_validation_rejects_raw_or_unallowlisted_fields_without_echo(safe_decision_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_decision_event

    payload = {
        **safe_decision_payload,
        "comment": "raw approval comment must not echo",
        "prompt": "raw prompt must not echo",
        "path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
        "token": "sk-secret-token",
    }

    result = validate_office_controlled_mutation_decision_event(payload)

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "raw approval" not in serialized
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-secret-token" not in serialized
    assert "prompt" not in serialized


def test_decision_append_and_readback_records_safe_dto_only(tmp_path, safe_decision_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_decision_event,
        list_office_controlled_mutation_decision_events,
    )

    store_path = tmp_path / "decisions.jsonl"
    raw_result = append_office_controlled_mutation_decision_event(
        {**safe_decision_payload, "comment": "raw approval comment must not echo"},
        store_path=store_path,
    )

    assert raw_result == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not store_path.exists()

    stored = append_office_controlled_mutation_decision_event(safe_decision_payload, store_path=store_path)

    assert stored["stored"] is True
    assert stored["errors"] == []
    assert stored["dto"]["mode"] == "validated_human_decision_event"
    assert stored["dto"]["capabilities"]["human_decision_recording_enabled"] is True
    assert stored["dto"]["capabilities"]["decision_append_enabled"] is True
    assert stored["dto"]["capabilities"]["decision_readback_enabled"] is True
    assert stored["dto"]["capabilities"]["audit_write_enabled"] is False
    assert stored["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert stored["dto"]["capabilities"]["target_mutation_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_save_enabled"] is False
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_decision_events(store_path=store_path)
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["decision_readback_enabled"] is True
    assert readback["capabilities"]["audit_write_enabled"] is False
    assert readback["capabilities"]["target_mutation_enabled"] is False


def test_decision_append_rejects_duplicate_decision_or_request_without_write(tmp_path, safe_decision_payload):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_decision_event

    store_path = tmp_path / "decisions.jsonl"
    first = append_office_controlled_mutation_decision_event(safe_decision_payload, store_path=store_path)
    duplicate_decision = append_office_controlled_mutation_decision_event(
        {**safe_decision_payload, "safe_reason_summary": "Duplicate id must not write."},
        store_path=store_path,
    )
    duplicate_request = append_office_controlled_mutation_decision_event(
        {
            **safe_decision_payload,
            "decision_id": "dec_20260516_other",
            "safe_reason_summary": "Second request decision must not write.",
        },
        store_path=store_path,
    )

    assert first["stored"] is True
    assert duplicate_decision == {
        "stored": False,
        "errors": [{"field": "decision_id", "code": "duplicate_decision_id"}],
        "dto": None,
    }
    assert duplicate_request == {
        "stored": False,
        "errors": [{"field": "request_id", "code": "duplicate_request_decision"}],
        "dto": None,
    }
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_decision_readback_filters_by_safe_request_and_correlation_without_raw_echo(tmp_path, safe_decision_payload):
    import json
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_decision_event,
        list_office_controlled_mutation_decision_events,
    )

    store_path = tmp_path / "decisions.jsonl"
    append_office_controlled_mutation_decision_event(safe_decision_payload, store_path=store_path)
    append_office_controlled_mutation_decision_event(
        {
            **safe_decision_payload,
            "decision_id": "dec_20260516_other",
            "request_id": "req_20260515_other",
            "correlation_id": "corr_20260515_other",
        },
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write('{"comment":"raw approval comment must not echo","path":"/Users/lidises/private/source.md"}\n')
        handle.write("not-json with /Users/lidises/private/source.md\n")

    result = list_office_controlled_mutation_decision_events(
        store_path=store_path,
        request_id=safe_decision_payload["request_id"],
        correlation_id=safe_decision_payload["correlation_id"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["request_id"] == safe_decision_payload["request_id"]
    assert result["correlation_id"] == safe_decision_payload["correlation_id"]
    assert result["events"][0]["decision_id"] == safe_decision_payload["decision_id"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "raw approval" not in serialized
    assert "/users/lidises" not in serialized


def test_decision_api_is_protected_records_and_reads_under_hermes_home(monkeypatch, tmp_path, safe_decision_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/decision"

    unauthenticated = client.post(route, json=safe_decision_payload)
    assert unauthenticated.status_code == 401

    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_decision_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["human_decision_recording_enabled"] is True
    assert body["dto"]["capabilities"]["audit_write_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "decisions.jsonl"
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = client.get(
        f"/api/office/controlled-mutation/decisions?request_id={safe_decision_payload['request_id']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["decision_id"] == safe_decision_payload["decision_id"]
    assert payload["capabilities"]["audit_write_enabled"] is False


def test_decision_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_decision_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/decision",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_decision_payload,
            "comment": "raw approval comment must not echo",
            "path": "/Users/lidises/private/source.md",
            "provider": "private-provider-id",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not (tmp_path / "office" / "controlled-mutation" / "decisions.jsonl").exists()
    serialized = str(body).lower()
    assert "raw approval" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_decision_readback_api_requires_dashboard_session_token(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)

    resp = client.get("/api/office/controlled-mutation/decisions")

    assert resp.status_code == 401
