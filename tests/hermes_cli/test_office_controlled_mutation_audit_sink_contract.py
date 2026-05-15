"""Tests for AI Office controlled-mutation audit sink contract."""


def test_audit_sink_contract_exposes_non_writing_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_audit_sink_contract

    contract = build_office_controlled_mutation_audit_sink_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "audit_sink_contract_only",
        "audit_sink": {
            "implementation_enabled": False,
            "write_enabled": False,
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
        "result_postures": ["info", "warning", "blocked", "success"],
        "required_audit_fields": [
            "audit_ref",
            "event_at",
            "event_kind",
            "result_posture",
            "safe_summary",
        ],
        "optional_safe_refs": ["request_ref", "dry_run_ref", "decision_ref", "action_kind"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "audit_write_enabled": False,
            "audit_append_enabled": False,
            "audit_readback_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "audit_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future audit sink shape only; no audit event is written",
            "audit storage, append route, retention, and readback require separate approval",
        ],
    }


def test_audit_sink_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_audit_sink_contract

    contract = build_office_controlled_mutation_audit_sink_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private transcript must not echo",
            "path": "/Users/lidises/private/audit.log",
            "provider": "private-provider-id",
            "token": "sk-private-token",
            "numeric_topic_id": "123456789",
            "log_line": "SECRET audit payload",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "123456789" not in serialized
    assert "secret audit payload" not in serialized


def test_audit_sink_contract_has_no_route_storage_or_write_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_audit_sink_contract

    contract = build_office_controlled_mutation_audit_sink_contract()

    assert contract["audit_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert contract["audit_sink"]["write_enabled"] is False
    assert contract["audit_sink"]["append_enabled"] is False
    assert contract["audit_sink"]["durable_storage_enabled"] is False
    assert contract["capabilities"]["audit_write_enabled"] is False
    assert contract["capabilities"]["audit_append_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
