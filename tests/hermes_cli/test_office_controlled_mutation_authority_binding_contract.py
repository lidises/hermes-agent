"""Tests for AI Office controlled-mutation authority binding design contract."""


def test_authority_binding_contract_exposes_non_binding_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_binding_contract

    contract = build_office_controlled_mutation_authority_binding_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "authority_binding_contract_only",
        "binding": {
            "implementation_enabled": False,
            "binding_enabled": False,
            "dispatch_enabled": False,
            "credential_access_enabled": False,
            "adapter_registry_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_binding_fields": [
            "binding_candidate_ref",
            "authority_candidate_ref",
            "adapter_contract_ref",
            "request_ref",
            "decision_ref",
            "audit_ref",
            "actor_ref",
            "risk_class",
            "scope",
            "expires_at",
            "blocked_reasons",
        ],
        "allowed_binding_scopes": ["single_action", "read_only_projection"],
        "required_adapter_fields": [
            "adapter_ref",
            "adapter_kind",
            "permission_posture",
            "credential_posture",
            "dispatch_posture",
            "target_posture",
        ],
        "allowed_adapter_kinds": ["kanban_comment", "status_note", "read_only_projection"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "capabilities": {
            "adapter_implementation_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "adapter_registry_enabled": False,
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
        "binding_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future authority adapter binding shape only; no adapter is implemented, registered, or bound",
            "adapter implementation, credential access, dispatch, target mutation, storage, and audit write require separate approval",
        ],
    }


def test_authority_binding_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_binding_contract

    contract = build_office_controlled_mutation_authority_binding_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "path": "/Users/lidises/private/adapter.log",
            "provider": "private-provider-id",
            "token": "sk-private-token",
            "api_key": "api key hunter2",
            "authorization": "authorization bearer hunter2",
            "credential": "credential material must not echo",
            "target": "raw target body must not echo",
            "numeric_topic_id": "123456789",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "api key hunter2" not in serialized
    assert "authorization bearer hunter2" not in serialized
    assert "credential material" not in serialized
    assert "raw target body" not in serialized
    assert "123456789" not in serialized


def test_authority_binding_contract_has_no_route_storage_or_enabled_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_binding_contract

    contract = build_office_controlled_mutation_authority_binding_contract()

    assert contract["adapter_endpoints"] == []
    assert contract["binding_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert all(value is False for value in contract["capabilities"].values())
    assert all(value is False for value in contract["binding"].values())
