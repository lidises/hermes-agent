"""Tests for AI Office controlled-mutation authority adapter contract."""


def test_authority_adapter_contract_exposes_non_implementing_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_adapter_contract

    contract = build_office_controlled_mutation_authority_adapter_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "authority_adapter_contract_only",
        "adapter": {
            "implementation_enabled": False,
            "dispatch_enabled": False,
            "binding_enabled": False,
            "credential_access_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_authority_fields": [
            "authority_candidate_ref",
            "request_ref",
            "dry_run_ref",
            "decision_ref",
            "actor_ref",
            "risk_class",
            "scope",
            "expires_at",
            "required_capabilities",
        ],
        "allowed_authority_scopes": [
            "single_action",
            "bounded_batch",
            "read_only_projection",
        ],
        "required_capability_fields": [
            "capability_ref",
            "operation_kind",
            "target_ref",
            "permission_posture",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "capability_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "adapter_implementation_enabled": False,
            "adapter_dispatch_enabled": False,
            "adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "adapter_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future authority adapter shape only; no adapter is implemented or bound",
            "adapter implementation, dispatch, credential access, storage, and audit write require separate approval",
        ],
    }


def test_authority_adapter_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_adapter_contract

    contract = build_office_controlled_mutation_authority_adapter_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "private dispatch transcript must not echo",
            "path": "/Users/lidises/private/adapter.log",
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
    assert "private dispatch transcript" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "credential material" not in serialized
    assert "raw target body" not in serialized
    assert "123456789" not in serialized


def test_authority_adapter_contract_has_no_adapter_route_storage_or_dispatch_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_adapter_contract

    contract = build_office_controlled_mutation_authority_adapter_contract()

    assert contract["adapter_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert contract["adapter"]["implementation_enabled"] is False
    assert contract["adapter"]["dispatch_enabled"] is False
    assert contract["adapter"]["binding_enabled"] is False
    assert contract["adapter"]["credential_access_enabled"] is False
    assert contract["capabilities"]["adapter_implementation_enabled"] is False
    assert contract["capabilities"]["adapter_dispatch_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
