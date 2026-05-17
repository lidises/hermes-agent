"""Tests for AI Office controlled-mutation dry-run evidence contract."""


def test_dry_run_evidence_contract_exposes_non_executing_design_shape():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dry_run_evidence_contract

    contract = build_office_controlled_mutation_dry_run_evidence_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "dry_run_evidence_contract_only",
        "dry_run_engine": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "result_recording_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_evidence_fields": [
            "dry_run_ref",
            "request_ref",
            "authority_candidate_ref",
            "started_at",
            "completed_at",
            "result",
            "risk_class",
            "simulated_steps",
            "rollback_preview_ref",
            "evidence_refs",
        ],
        "allowed_results": ["would_succeed", "would_fail", "blocked", "unknown"],
        "required_step_fields": [
            "step_ref",
            "operation_kind",
            "target_ref",
            "expected_effect_summary",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "warning_count", "evidence_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "dry_run_execution_enabled": False,
            "dry_run_result_recording_enabled": False,
            "dry_run_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "dry_run_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future dry-run evidence shape only; no dry-run is executed",
            "dry-run engine, result recording, readback, and audit write require separate approval",
        ],
    }


def test_dry_run_evidence_contract_ignores_unsafe_examples():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dry_run_evidence_contract

    contract = build_office_controlled_mutation_dry_run_evidence_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private dry-run transcript must not echo",
            "path": "/Users/lidises/private/dry-run.log",
            "provider": "private-provider-id",
            "token": "sk-private-token",
            "target": "raw target body must not echo",
            "numeric_topic_id": "123456789",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-private-token" not in serialized
    assert "raw target body" not in serialized
    assert "123456789" not in serialized


def test_dry_run_evidence_contract_has_no_execution_route_storage_or_mutation_capability():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dry_run_evidence_contract

    contract = build_office_controlled_mutation_dry_run_evidence_contract()

    assert contract["dry_run_endpoints"] == []
    assert contract["storage_endpoints"] == []
    assert contract["dry_run_engine"]["execution_enabled"] is False
    assert contract["dry_run_engine"]["result_recording_enabled"] is False
    assert contract["dry_run_engine"]["durable_storage_enabled"] is False
    assert contract["capabilities"]["dry_run_execution_enabled"] is False
    assert contract["capabilities"]["dry_run_result_recording_enabled"] is False
    assert contract["capabilities"]["target_mutation_enabled"] is False
