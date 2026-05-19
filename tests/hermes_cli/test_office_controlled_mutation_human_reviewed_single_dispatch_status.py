def test_human_reviewed_single_dispatch_status_projects_candidate_without_dispatch_or_target_mutation():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_human_reviewed_single_dispatch_status

    status = build_office_controlled_mutation_human_reviewed_single_dispatch_status(
        unsafe_examples={
            "target_path": "/home/hermes/private-target.json",
            "token": "sk-private-dispatch-token",
            "provider_id": "private-dispatch-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "human_reviewed_single_dispatch_status"
    assert status["human_reviewed_single_dispatch_complete"] is True
    assert status["source_adapter_binding_lane"] == "adapter_binding_dry_run_status"
    assert status["next_manual_lane"] == "explicit_runtime_dispatch_approval"
    assert status["dispatch_candidate"] == {
        "candidate_ref": "dispatch_candidate_human_reviewed_single",
        "human_review_required": True,
        "human_review_recorded": True,
        "single_dispatch_only": True,
        "dispatch_created": False,
        "target_mutation_created": False,
    }
    assert status["approval_requirements"] == {
        "operator_review_required": True,
        "adapter_binding_review_required": True,
        "target_allowlist_review_required": True,
        "rollback_review_required": True,
        "runtime_dispatch_approval_granted": False,
    }
    assert status["capabilities"]["human_reviewed_single_dispatch_readback_enabled"] is True
    assert status["capabilities"]["dispatch_candidate_metadata_enabled"] is True
    assert status["capabilities"]["approval_requirements_readback_enabled"] is True
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
    assert "private-dispatch-provider" not in serialized
    assert "Traceback" not in serialized


def test_human_reviewed_single_dispatch_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/human-reviewed-single-dispatch-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "human_reviewed_single_dispatch_status"
    assert payload["human_reviewed_single_dispatch_complete"] is True
    assert payload["capabilities"]["human_reviewed_single_dispatch_readback_enabled"] is True
    assert payload["capabilities"]["dispatch_candidate_metadata_enabled"] is True
    assert payload["capabilities"]["approval_requirements_readback_enabled"] is True
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
