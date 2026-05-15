"""RED tests for AI Office controlled-mutation event persistence contract.

These tests define the next persistence boundary without adding storage or write
path implementation. They should fail until the future pure contract helper is
approved and implemented.
"""


def test_event_persistence_contract_exposes_non_writing_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_event_persistence_contract

    contract = build_office_controlled_mutation_event_persistence_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "event_persistence_contract_only",
        "event_store": {
            "implementation_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "accepted_event_kinds": [
            "action_requested",
            "dry_run_completed",
            "human_decision_recorded",
            "execution_started",
            "execution_completed",
            "execution_blocked",
        ],
        "required_envelope_fields": [
            "event_id",
            "correlation_id",
            "request_id",
            "event_kind",
            "actor_ref",
            "target_ref",
            "safe_summary",
            "evidence_refs",
            "created_at",
        ],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "event_append_enabled": False,
            "audit_write_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future persistence only; no event is appended",
            "storage backend, migration, retention, and audit sink require separate approval",
        ],
    }


def test_event_persistence_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_event_persistence_contract

    contract = build_office_controlled_mutation_event_persistence_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private transcript must not echo",
            "path": "/Users/lidises/private/source.md",
            "provider": "private-provider-id",
            "token": "***",
            "numeric_topic_id": "123456789",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "***" not in serialized
    assert "123456789" not in serialized


def test_event_persistence_contract_has_no_write_or_route_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_event_persistence_contract

    contract = build_office_controlled_mutation_event_persistence_contract()

    assert contract["storage_endpoints"] == []
    assert contract["event_store"]["append_enabled"] is False
    assert contract["event_store"]["durable_storage_enabled"] is False
    assert contract["capabilities"]["event_append_enabled"] is False
    assert contract["capabilities"]["audit_write_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
