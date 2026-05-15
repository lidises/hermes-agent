"""Tests for AI Office controlled-mutation approval decision contract."""


def test_approval_decision_contract_exposes_non_recording_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_approval_decision_contract

    contract = build_office_controlled_mutation_approval_decision_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "approval_decision_contract_only",
        "decision_store": {
            "implementation_enabled": False,
            "recording_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "allowed_decisions": ["approve", "reject", "defer"],
        "approval_scope": "single_action_only",
        "required_decision_fields": [
            "decision_ref",
            "request_ref",
            "dry_run_ref",
            "decided_at",
            "decision",
            "decided_by",
            "approval_scope",
            "expires_at",
        ],
        "optional_safe_fields": ["comment_summary"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "human_decision_recording_enabled": False,
            "decision_append_enabled": False,
            "decision_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "decision_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future human decision shape only; no decision is recorded",
            "decision route, storage, expiry enforcement, and audit write require separate approval",
        ],
    }


def test_approval_decision_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_approval_decision_contract

    contract = build_office_controlled_mutation_approval_decision_contract(
        unsafe_examples={
            "comment": "raw approval comment must not echo",
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private transcript must not echo",
            "path": "/Users/lidises/private/decision.md",
            "provider": "private-provider-id",
            "token": "sk-private-token",
            "numeric_topic_id": "123456789",
        }
    )

    serialized = str(contract).lower()
    assert "raw approval comment" not in serialized
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "123456789" not in serialized


def test_approval_decision_contract_has_no_route_storage_or_recording_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_approval_decision_contract

    contract = build_office_controlled_mutation_approval_decision_contract()

    assert contract["decision_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert contract["decision_store"]["recording_enabled"] is False
    assert contract["decision_store"]["append_enabled"] is False
    assert contract["decision_store"]["durable_storage_enabled"] is False
    assert contract["capabilities"]["human_decision_recording_enabled"] is False
    assert contract["capabilities"]["decision_append_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
