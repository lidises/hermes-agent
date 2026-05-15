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
