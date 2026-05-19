def test_manual_approval_recording_preflight_status_projects_refusal_only_contract():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_manual_approval_recording_preflight_status

    dto = build_office_controlled_mutation_manual_approval_recording_preflight_status(
        unsafe_examples={
            "raw_command": "python /tmp/private/approve.py",
            "token": "sk-tes...pear",
            "path": "/Users/lidises/private",
        }
    )

    assert dto["schema_version"] == 1
    assert dto["mode"] == "manual_approval_recording_preflight_status"
    assert dto["manual_approval_recording_preflight_complete"] is True
    assert dto["source_design_lane"] == "approved_real_one_shot_dispatch_gate_design"
    assert dto["next_manual_lane"] == "manual_real_approval_recording"
    assert dto["preflight_contract"] == {
        "approval_record_shape_required": True,
        "exact_target_allowlist_ref_required": True,
        "idempotency_key_required": True,
        "replay_lookup_required": True,
        "rollback_disable_ref_required": True,
        "rollback_readiness_required": True,
        "dry_run_evidence_ref_required": True,
        "operator_final_confirmation_required": True,
        "refusal_only_default": True,
    }
    assert dto["execution_boundary"]["preflight_only"] is True
    assert dto["execution_boundary"]["approval_record_written"] is False
    assert dto["execution_boundary"]["dispatch_gate_open"] is False
    assert dto["execution_boundary"]["runtime_command_executed"] is False
    assert dto["execution_boundary"]["target_mutation_created"] is False
    assert dto["capabilities"]["manual_approval_recording_preflight_readback_enabled"] is True
    assert dto["capabilities"]["approval_recording_enabled"] is False
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    assert dto["capabilities"]["idempotency_replay_store_write_enabled"] is False
    assert dto["capabilities"]["target_mutation_enabled"] is False
    rendered = repr(dto)
    assert "sk-test" not in rendered
    assert "/tmp/private" not in rendered
    assert "/Users/lidises" not in rendered


def test_refuse_manual_approval_recording_preflight_validates_safe_refs_without_writing_record():
    from hermes_cli.office_controlled_mutation import refuse_office_controlled_mutation_manual_approval_recording_preflight

    result = refuse_office_controlled_mutation_manual_approval_recording_preflight(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "exact_target_allowlist_ref": "allowlist-office-target-1",
            "idempotency_key": "idem-office-dispatch-1",
            "replay_lookup_ref": "replay-office-dispatch-1",
            "rollback_disable_ref": "rollback-office-dispatch-1",
            "dry_run_evidence_ref": "dryrun-office-dispatch-1",
            "operator_confirmation": "confirmed-manual-preflight-only",
            "raw_command": "python /home/hermes/private/run.py",
            "token": "sk-tes...pear",
        }
    )

    assert result["mode"] == "manual_approval_recording_preflight_refusal"
    assert result["accepted"] is False
    assert result["approval_record_written"] is False
    assert result["dispatch_gate_open"] is False
    assert result["runtime_command_executed"] is False
    assert result["target_mutation_created"] is False
    assert result["refusal_code"] == "approval_recording_disabled_by_default"
    assert result["safe_validation"] == {
        "approval_record_ref_present": True,
        "approval_record_ref_valid": True,
        "exact_target_allowlist_ref_present": True,
        "exact_target_allowlist_ref_valid": True,
        "idempotency_key_present": True,
        "idempotency_key_valid": True,
        "replay_lookup_ref_present": True,
        "replay_lookup_ref_valid": True,
        "replay_lookup_seen": False,
        "rollback_disable_ref_present": True,
        "rollback_disable_ref_valid": True,
        "rollback_ready": False,
        "dry_run_evidence_ref_present": True,
        "dry_run_evidence_ref_valid": True,
        "operator_confirmation_present": True,
        "operator_confirmation_valid": True,
    }
    assert result["validation_errors"] == []
    rendered = repr(result)
    assert "/home/hermes" not in rendered
    assert "sk-test" not in rendered
    assert "raw_command" not in rendered


def test_refuse_manual_approval_recording_preflight_returns_field_codes_for_invalid_refs():
    from hermes_cli.office_controlled_mutation import refuse_office_controlled_mutation_manual_approval_recording_preflight

    result = refuse_office_controlled_mutation_manual_approval_recording_preflight(
        {
            "approval_record_ref": "/Users/lidises/private/approval.json",
            "exact_target_allowlist_ref": "bad target",
            "idempotency_key": "wrong-prefix",
            "replay_lookup_ref": "replay-../../unsafe",
            "rollback_disable_ref": "rollback-ok_1",
            "dry_run_evidence_ref": "dryrun-ok_1",
            "operator_confirmation": "please execute now",
            "unsupported_extra": "sk-tes...pear",
        }
    )

    errors = {(item["field"], item["code"]) for item in result["validation_errors"]}
    assert ("approval_record_ref", "unsupported_ref_shape") in errors
    assert ("exact_target_allowlist_ref", "unsupported_ref_shape") in errors
    assert ("idempotency_key", "unsupported_ref_shape") in errors
    assert ("replay_lookup_ref", "unsupported_ref_shape") in errors
    assert ("operator_confirmation", "unsupported_confirmation") in errors
    assert result["safe_validation"]["rollback_disable_ref_valid"] is True
    assert result["safe_validation"]["dry_run_evidence_ref_valid"] is True
    rendered = repr(result)
    assert "/Users/lidises" not in rendered
    assert "sk-test" not in rendered
    assert "please execute" not in rendered


def test_manual_approval_recording_preflight_api_is_protected_and_refusal_only():
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    client = TestClient(web_server.app)
    path = "/api/office/controlled-mutation/manual-approval-recording-preflight"
    execute_path = f"{path}/preflight"

    assert client.get(path).status_code == 401
    assert client.post(execute_path, json={}).status_code == 401

    response = client.get(path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert response.status_code == 200
    dto = response.json()
    assert dto["mode"] == "manual_approval_recording_preflight_status"
    assert dto["manual_approval_recording_preflight_complete"] is True
    assert dto["capabilities"]["approval_recording_enabled"] is False

    refused = client.post(
        execute_path,
        headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN},
        json={"approval_record_ref": "approval-safe-1", "operator_confirmation": "confirmed-manual-preflight-only"},
    )
    assert refused.status_code == 200
    body = refused.json()
    assert body["mode"] == "manual_approval_recording_preflight_refusal"
    assert body["accepted"] is False
    assert body["approval_record_written"] is False
    assert body["runtime_command_executed"] is False
    assert body["target_mutation_created"] is False
