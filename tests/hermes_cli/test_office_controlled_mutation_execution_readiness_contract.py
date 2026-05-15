"""Tests for AI Office controlled-mutation execution readiness contract."""


def test_execution_readiness_contract_exposes_non_executing_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_execution_readiness_contract

    contract = build_office_controlled_mutation_execution_readiness_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "execution_readiness_contract_only",
        "execution": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "dispatch_enabled": False,
            "target_mutation_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_readiness_fields": [
            "readiness_ref",
            "request_ref",
            "authority_candidate_ref",
            "dry_run_ref",
            "decision_ref",
            "audit_preview_ref",
            "rollback_preview_ref",
            "risk_class",
            "gate_status",
            "blocked_reasons",
            "required_confirmations",
        ],
        "allowed_gate_statuses": ["blocked", "ready_pending_approval", "ready_read_only", "not_evaluated"],
        "required_gate_fields": [
            "gate_ref",
            "gate_kind",
            "status",
            "evidence_ref",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "gate_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "execution_implementation_enabled": False,
            "execution_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_implementation_enabled": False,
            "authority_adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "execution_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future execution readiness shape only; no execution is implemented",
            "execution implementation, dispatch, target mutation, storage, and audit write require separate approval",
        ],
    }


def test_execution_readiness_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_execution_readiness_contract

    contract = build_office_controlled_mutation_execution_readiness_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "private execution transcript must not echo",
            "path": "/Users/lidises/private/execution.log",
            "provider": "private-provider-id",
            "token": "sk-private-token",
            "credential": "credential material must not echo",
            "target": "raw target body must not echo",
            "numeric_topic_id": "123456789",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "private execution transcript" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "credential material" not in serialized
    assert "raw target body" not in serialized
    assert "123456789" not in serialized


def test_execution_readiness_contract_has_no_route_storage_or_execution_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_execution_readiness_contract

    contract = build_office_controlled_mutation_execution_readiness_contract()

    assert contract["execution_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert contract["execution"]["implementation_enabled"] is False
    assert contract["execution"]["execution_enabled"] is False
    assert contract["execution"]["dispatch_enabled"] is False
    assert contract["execution"]["target_mutation_enabled"] is False
    assert contract["capabilities"]["execution_implementation_enabled"] is False
    assert contract["capabilities"]["execution_dispatch_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
    assert all(value is False for value in contract["capabilities"].values())
