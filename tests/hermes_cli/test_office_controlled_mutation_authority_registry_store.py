"""Tests for AI Office controlled-mutation authority adapter safe registry store."""

import pytest


@pytest.fixture
def safe_registry_payload():
    return {
        "adapter_ref": "adapter_20260516_demo",
        "adapter_kind": "kanban_comment",
        "authority_candidate_ref": "authority_20260516_demo",
        "registered_by": "actor:orchestrator",
        "permission_posture": "metadata_only",
        "credential_posture": "not_configured",
        "dispatch_posture": "blocked",
        "target_posture": "blocked",
        "safe_summary": "Registry stores adapter metadata only.",
        "evidence_refs": ["audit:authority-binding-contract"],
        "registered_at": "2026-05-16T10:00:00Z",
    }


def test_authority_registry_validation_accepts_safe_payload(safe_registry_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_authority_adapter_registry_event

    result = validate_office_controlled_mutation_authority_adapter_registry_event(safe_registry_payload)

    assert result["valid"] is True
    assert result["errors"] == []
    assert result["dto"]["mode"] == "validated_authority_adapter_registry_event"
    assert result["dto"]["capabilities"] == {
        "adapter_registry_storage_enabled": False,
        "adapter_registry_readback_enabled": False,
        "adapter_implementation_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "credential_access_enabled": False,
        "target_mutation_enabled": False,
        "dry_run_execution_enabled": False,
        "audit_write_enabled": False,
        "nas_save_enabled": False,
    }


def test_authority_registry_validation_rejects_raw_or_credential_fields_without_echo(safe_registry_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_authority_adapter_registry_event

    result = validate_office_controlled_mutation_authority_adapter_registry_event(
        {
            **safe_registry_payload,
            "credential": "api key hunter2",
            "token": "sk-private-token",
            "path": "/Users/lidises/private/adapter.log",
            "provider": "private-provider-id",
            "dispatch_url": "https://example.invalid/dispatch",
        }
    )

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "hunter2" not in serialized
    assert "sk-private-token" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_authority_registry_validation_rejects_credential_like_allowlisted_values_without_echo(safe_registry_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_authority_adapter_registry_event

    summary = validate_office_controlled_mutation_authority_adapter_registry_event(
        {**safe_registry_payload, "safe_summary": "authorization bearer hunter2 should not store"}
    )
    ref = validate_office_controlled_mutation_authority_adapter_registry_event(
        {**safe_registry_payload, "evidence_refs": ["api_key:hunter2"]}
    )

    assert summary == {
        "valid": False,
        "errors": [{"field": "safe_summary", "code": "invalid_safe_text"}],
        "dto": None,
    }
    assert ref == {
        "valid": False,
        "errors": [{"field": "evidence_refs", "code": "invalid_opaque_ref"}],
        "dto": None,
    }
    serialized = str([summary, ref]).lower()
    assert "hunter2" not in serialized
    assert "authorization" not in serialized
    assert "api_key" not in serialized


def test_authority_registry_validation_rejects_private_markers_in_stored_ids_without_echo(safe_registry_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_authority_adapter_registry_event

    result = validate_office_controlled_mutation_authority_adapter_registry_event(
        {
            **safe_registry_payload,
            "adapter_ref": "secret_hunter2_adapter",
            "authority_candidate_ref": "token_hunter2_auth",
        }
    )

    assert result == {
        "valid": False,
        "errors": [
            {"field": "adapter_ref", "code": "invalid_opaque_id"},
            {"field": "authority_candidate_ref", "code": "invalid_opaque_id"},
        ],
        "dto": None,
    }
    serialized = str(result).lower()
    assert "hunter2" not in serialized
    assert "secret" not in serialized
    assert "token" not in serialized


def test_authority_registry_append_and_readback_store_safe_dto_only(tmp_path, safe_registry_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_authority_adapter_registry_event,
        list_office_controlled_mutation_authority_adapter_registry_events,
    )

    store_path = tmp_path / "authority_adapters.jsonl"
    raw = append_office_controlled_mutation_authority_adapter_registry_event(
        {**safe_registry_payload, "credential": "secret hunter2"}, store_path=store_path
    )
    assert raw == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not store_path.exists()

    stored = append_office_controlled_mutation_authority_adapter_registry_event(safe_registry_payload, store_path=store_path)
    assert stored["stored"] is True
    assert stored["dto"]["capabilities"]["adapter_registry_storage_enabled"] is True
    assert stored["dto"]["capabilities"]["adapter_registry_readback_enabled"] is True
    assert stored["dto"]["capabilities"]["adapter_implementation_enabled"] is False
    assert stored["dto"]["capabilities"]["adapter_binding_enabled"] is False
    assert stored["dto"]["capabilities"]["adapter_dispatch_enabled"] is False
    assert stored["dto"]["capabilities"]["credential_access_enabled"] is False
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_authority_adapter_registry_events(store_path=store_path)
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["adapter_registry_readback_enabled"] is True
    assert readback["capabilities"]["adapter_dispatch_enabled"] is False
    assert readback["capabilities"]["credential_access_enabled"] is False


def test_authority_registry_append_rejects_duplicate_adapter_ref_without_second_write(tmp_path, safe_registry_payload):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_authority_adapter_registry_event

    store_path = tmp_path / "authority_adapters.jsonl"
    first = append_office_controlled_mutation_authority_adapter_registry_event(safe_registry_payload, store_path=store_path)
    duplicate = append_office_controlled_mutation_authority_adapter_registry_event(
        {**safe_registry_payload, "safe_summary": "Duplicate adapter must not write."}, store_path=store_path
    )

    assert first["stored"] is True
    assert duplicate == {"stored": False, "errors": [{"field": "adapter_ref", "code": "duplicate_adapter_ref"}], "dto": None}
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_authority_registry_readback_filters_and_skips_raw_without_echo(tmp_path, safe_registry_payload):
    import json
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_authority_adapter_registry_event,
        list_office_controlled_mutation_authority_adapter_registry_events,
    )

    store_path = tmp_path / "authority_adapters.jsonl"
    append_office_controlled_mutation_authority_adapter_registry_event(safe_registry_payload, store_path=store_path)
    append_office_controlled_mutation_authority_adapter_registry_event(
        {**safe_registry_payload, "adapter_ref": "adapter_20260516_other", "adapter_kind": "status_note"},
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps({"credential": "api key hunter2", "path": "/Users/lidises/private/adapter.log"}) + "\n")
        handle.write("not-json with /Users/lidises/private/adapter.log\n")

    result = list_office_controlled_mutation_authority_adapter_registry_events(
        store_path=store_path,
        adapter_kind=safe_registry_payload["adapter_kind"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["adapter_kind"] == safe_registry_payload["adapter_kind"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "hunter2" not in serialized
    assert "/users/lidises" not in serialized


def test_authority_registry_api_is_protected_records_and_reads_under_hermes_home(monkeypatch, tmp_path, safe_registry_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/authority-adapter-registry"

    assert client.post(route, json=safe_registry_payload).status_code == 401
    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_registry_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["adapter_registry_storage_enabled"] is True
    assert body["dto"]["capabilities"]["adapter_dispatch_enabled"] is False
    assert body["dto"]["capabilities"]["target_mutation_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "authority_adapters.jsonl"
    assert store_path.exists()

    readback = client.get(
        f"{route}?adapter_kind={safe_registry_payload['adapter_kind']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["adapter_ref"] == safe_registry_payload["adapter_ref"]
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["credential_access_enabled"] is False
