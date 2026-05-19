def test_concrete_runtime_single_dispatch_slice_design_projects_envelope_without_dispatch_or_target_mutation():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_concrete_runtime_single_dispatch_slice_design

    status = build_office_controlled_mutation_concrete_runtime_single_dispatch_slice_design(
        unsafe_examples={
            "target_path": "/home/hermes/private-target.json",
            "token": "sk-private-runtime-token",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
            "raw_command": "python /home/hermes/run-target.py",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "concrete_runtime_single_dispatch_slice_design"
    assert status["concrete_runtime_single_dispatch_slice_design_complete"] is True
    assert status["source_approval_lane"] == "explicit_runtime_dispatch_approval_status"
    assert status["next_manual_lane"] == "approved_one_shot_runtime_dispatch"
    assert status["one_shot_envelope"] == {
        "single_dispatch_only": True,
        "operator_confirmation_required": True,
        "runtime_dispatch_created": False,
        "runtime_command_included": False,
        "adapter_dispatch_created": False,
        "target_mutation_created": False,
    }
    assert status["target_allowlist"] == {
        "allowlist_required": True,
        "allowlist_locked": False,
        "opaque_target_refs_only": True,
        "raw_paths_excluded": True,
    }
    assert status["rollback_plan"] == {
        "rollback_required": True,
        "disable_command_required": True,
        "rollback_verified": False,
        "service_restart_required": False,
    }
    assert status["dry_run_evidence_requirements"] == {
        "dry_run_result_required": True,
        "audit_event_required": True,
        "human_review_required": True,
        "evidence_locked": False,
    }
    assert status["idempotency"] == {
        "idempotency_key_required": True,
        "idempotency_key_issued": False,
        "repeat_dispatch_blocked": True,
    }
    assert status["disabled_runtime_gate"] == {
        "disabled_by_default": True,
        "runtime_gate_open": False,
        "automation_activation_requested": False,
        "watcher_or_cron_allowed": False,
    }
    assert status["capabilities"]["single_dispatch_slice_design_readback_enabled"] is True
    assert status["capabilities"]["one_shot_envelope_metadata_enabled"] is True
    assert status["capabilities"]["target_allowlist_readback_enabled"] is True
    assert status["capabilities"]["rollback_plan_readback_enabled"] is True
    assert status["capabilities"]["dry_run_evidence_requirements_readback_enabled"] is True
    assert status["capabilities"]["idempotency_key_readback_enabled"] is True
    assert status["capabilities"]["disabled_runtime_gate_readback_enabled"] is True
    assert status["capabilities"]["adapter_binding_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["runtime_command_execution_enabled"] is False
    assert status["capabilities"]["watcher_daemon_enabled"] is False
    assert status["capabilities"]["cron_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["vps_file_change_enabled"] is False
    assert status["capabilities"]["service_restart_enabled"] is False
    assert status["capabilities"]["git_push_enabled"] is False
    assert status["capabilities"]["credential_access_enabled"] is False
    assert status["capabilities"]["public_exposure_enabled"] is False
    assert "adapter_dispatch" in status["forbidden_boundaries"]
    assert "target_mutation" in status["forbidden_boundaries"]
    assert "runtime_command_execution" in status["forbidden_boundaries"]
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized
    assert "run-target" not in serialized


def test_concrete_runtime_single_dispatch_slice_design_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/concrete-runtime-single-dispatch-slice-design"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "concrete_runtime_single_dispatch_slice_design"
    assert payload["concrete_runtime_single_dispatch_slice_design_complete"] is True
    assert payload["capabilities"]["single_dispatch_slice_design_readback_enabled"] is True
    assert payload["capabilities"]["one_shot_envelope_metadata_enabled"] is True
    assert payload["capabilities"]["target_allowlist_readback_enabled"] is True
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
