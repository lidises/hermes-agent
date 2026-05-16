"""Tests for AI Office controlled-mutation dry-run result storage boundary."""

import pytest


@pytest.fixture
def safe_dry_run_result_payload():
    return {
        "result_id": "dryrun_20260516_demo",
        "request_id": "req_20260515_demo",
        "correlation_id": "corr_20260515_demo",
        "simulated_by": "actor:orchestrator",
        "simulation_status": "blocked",
        "safe_summary": "Simulation result says target mutation remains blocked.",
        "evidence_refs": ["paperclip:source-tag-demo", "projection:active-cache-demo"],
        "completed_at": "2026-05-16T09:20:00Z",
    }


def test_dry_run_result_validation_accepts_safe_status_payload(safe_dry_run_result_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_dry_run_result_event

    for status in ("passed", "blocked", "warning"):
        result = validate_office_controlled_mutation_dry_run_result_event(
            {**safe_dry_run_result_payload, "simulation_status": status}
        )

        assert result["valid"] is True
        assert result["errors"] == []
        assert result["dto"]["mode"] == "validated_dry_run_result_event"
        assert result["dto"]["simulation_status"] == status
        assert result["dto"]["capabilities"] == {
            "dry_run_result_storage_enabled": False,
            "dry_run_result_readback_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }


def test_dry_run_result_validation_rejects_raw_or_unallowlisted_fields_without_echo(safe_dry_run_result_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_dry_run_result_event

    payload = {
        **safe_dry_run_result_payload,
        "raw_output": "raw dry run output must not echo",
        "command": "python /Users/lidises/private/target.py",
        "target_path": "/Users/lidises/private/source.md",
        "provider": "private-provider-id",
        "token": "***",
    }

    result = validate_office_controlled_mutation_dry_run_result_event(payload)

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "raw dry run" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "***" not in serialized
    assert "command" not in serialized


def test_dry_run_result_append_and_readback_records_safe_dto_only(tmp_path, safe_dry_run_result_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_dry_run_result_event,
        list_office_controlled_mutation_dry_run_result_events,
    )

    store_path = tmp_path / "dry_run_results.jsonl"
    raw_result = append_office_controlled_mutation_dry_run_result_event(
        {**safe_dry_run_result_payload, "raw_output": "raw dry run output must not echo"},
        store_path=store_path,
    )

    assert raw_result == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not store_path.exists()

    stored = append_office_controlled_mutation_dry_run_result_event(safe_dry_run_result_payload, store_path=store_path)

    assert stored["stored"] is True
    assert stored["errors"] == []
    assert stored["dto"]["mode"] == "validated_dry_run_result_event"
    assert stored["dto"]["capabilities"]["dry_run_result_storage_enabled"] is True
    assert stored["dto"]["capabilities"]["dry_run_result_readback_enabled"] is True
    assert stored["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert stored["dto"]["capabilities"]["target_mutation_enabled"] is False
    assert stored["dto"]["capabilities"]["audit_write_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_save_enabled"] is False
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_dry_run_result_events(store_path=store_path)
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["dry_run_result_readback_enabled"] is True
    assert readback["capabilities"]["dry_run_execution_enabled"] is False
    assert readback["capabilities"]["audit_write_enabled"] is False
    assert readback["capabilities"]["target_mutation_enabled"] is False


def test_dry_run_result_append_rejects_duplicate_result_or_request_without_write(tmp_path, safe_dry_run_result_payload):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_dry_run_result_event

    store_path = tmp_path / "dry_run_results.jsonl"
    first = append_office_controlled_mutation_dry_run_result_event(safe_dry_run_result_payload, store_path=store_path)
    duplicate_result = append_office_controlled_mutation_dry_run_result_event(
        {**safe_dry_run_result_payload, "safe_summary": "Duplicate id must not write."},
        store_path=store_path,
    )
    duplicate_request = append_office_controlled_mutation_dry_run_result_event(
        {
            **safe_dry_run_result_payload,
            "result_id": "dryrun_20260516_other",
            "safe_summary": "Second request result must not write.",
        },
        store_path=store_path,
    )

    assert first["stored"] is True
    assert duplicate_result == {
        "stored": False,
        "errors": [{"field": "result_id", "code": "duplicate_result_id"}],
        "dto": None,
    }
    assert duplicate_request == {
        "stored": False,
        "errors": [{"field": "request_id", "code": "duplicate_request_dry_run_result"}],
        "dto": None,
    }
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_dry_run_result_readback_filters_by_safe_request_and_correlation_without_raw_echo(tmp_path, safe_dry_run_result_payload):
    import json
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_dry_run_result_event,
        list_office_controlled_mutation_dry_run_result_events,
    )

    store_path = tmp_path / "dry_run_results.jsonl"
    append_office_controlled_mutation_dry_run_result_event(safe_dry_run_result_payload, store_path=store_path)
    append_office_controlled_mutation_dry_run_result_event(
        {
            **safe_dry_run_result_payload,
            "result_id": "dryrun_20260516_other",
            "request_id": "req_20260515_other",
            "correlation_id": "corr_20260515_other",
        },
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write('{"raw_output":"raw dry run output must not echo","path":"/Users/lidises/private/source.md"}\n')
        handle.write("not-json with /Users/lidises/private/source.md\n")

    result = list_office_controlled_mutation_dry_run_result_events(
        store_path=store_path,
        request_id=safe_dry_run_result_payload["request_id"],
        correlation_id=safe_dry_run_result_payload["correlation_id"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["request_id"] == safe_dry_run_result_payload["request_id"]
    assert result["correlation_id"] == safe_dry_run_result_payload["correlation_id"]
    assert result["events"][0]["result_id"] == safe_dry_run_result_payload["result_id"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "raw dry run" not in serialized
    assert "/users/lidises" not in serialized


def test_dry_run_result_api_is_protected_records_and_reads_under_hermes_home(monkeypatch, tmp_path, safe_dry_run_result_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/dry-run-result"

    unauthenticated = client.post(route, json=safe_dry_run_result_payload)
    assert unauthenticated.status_code == 401

    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_dry_run_result_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["dry_run_result_storage_enabled"] is True
    assert body["dto"]["capabilities"]["dry_run_execution_enabled"] is False
    assert body["dto"]["capabilities"]["target_mutation_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "dry_run_results.jsonl"
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = client.get(
        f"/api/office/controlled-mutation/dry-run-results?request_id={safe_dry_run_result_payload['request_id']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["result_id"] == safe_dry_run_result_payload["result_id"]
    assert payload["capabilities"]["dry_run_execution_enabled"] is False
    assert payload["capabilities"]["audit_write_enabled"] is False


def test_dry_run_result_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_dry_run_result_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/dry-run-result",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_dry_run_result_payload,
            "raw_output": "raw dry run output must not echo",
            "path": "/Users/lidises/private/source.md",
            "provider": "private-provider-id",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not (tmp_path / "office" / "controlled-mutation" / "dry_run_results.jsonl").exists()
    serialized = str(body).lower()
    assert "raw dry run" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_dry_run_result_readback_api_requires_dashboard_session_token(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)

    resp = client.get("/api/office/controlled-mutation/dry-run-results")

    assert resp.status_code == 401
