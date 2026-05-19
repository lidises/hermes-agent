def test_explicit_runtime_dispatch_approval_status_projects_approval_without_dispatch_or_target_mutation():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_explicit_runtime_dispatch_approval_status

    status = build_office_controlled_mutation_explicit_runtime_dispatch_approval_status(
        unsafe_examples={
            "target_path": "/home/hermes/private-target.json",
            "token": "sk-private-runtime-dispatch-token",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "explicit_runtime_dispatch_approval_status"
    assert status["explicit_runtime_dispatch_approval_complete"] is True
    assert status["source_human_review_lane"] == "human_reviewed_single_dispatch_status"
    assert status["next_manual_lane"] == "concrete_runtime_single_dispatch_slice"
    assert status["approval_status"] == {
        "explicit_runtime_dispatch_approval_recorded": False,
        "operator_final_approval_required": True,
        "single_dispatch_scope_locked": True,
        "target_allowlist_locked": False,
        "rollback_plan_locked": False,
        "dry_run_evidence_locked": False,
        "automation_activation_requested": False,
    }
    assert status["runtime_boundary"] == {
        "runtime_dispatch_ready": False,
        "adapter_dispatch_created": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "approval_status_only": True,
    }
    assert status["capabilities"]["explicit_runtime_dispatch_approval_readback_enabled"] is True
    assert status["capabilities"]["approval_criteria_readback_enabled"] is True
    assert status["capabilities"]["runtime_boundary_readback_enabled"] is True
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
    assert "watcher_daemon_activation" in status["forbidden_boundaries"]
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized


def test_explicit_runtime_dispatch_approval_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/explicit-runtime-dispatch-approval-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "explicit_runtime_dispatch_approval_status"
    assert payload["explicit_runtime_dispatch_approval_complete"] is True
    assert payload["capabilities"]["explicit_runtime_dispatch_approval_readback_enabled"] is True
    assert payload["capabilities"]["approval_criteria_readback_enabled"] is True
    assert payload["capabilities"]["runtime_boundary_readback_enabled"] is True
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
