def test_adapter_binding_dry_run_status_projects_registry_without_binding_or_dispatch():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_adapter_binding_dry_run_status

    status = build_office_controlled_mutation_adapter_binding_dry_run_status(
        unsafe_examples={
            "adapter_path": "/home/hermes/private_adapter.py",
            "token": "sk-private-adapter-token",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "adapter_binding_dry_run_status"
    assert status["adapter_binding_dry_run_complete"] is True
    assert status["source_manual_one_shot_lane"] == "manual_one_shot_runtime_dry_run_status"
    assert status["next_manual_lane"] == "human_reviewed_single_dispatch_status"
    assert status["adapter_registry"] == {
        "registry_readback_enabled": True,
        "candidate_adapter_ref": "adapter_candidate_manual_runtime_dry_run",
        "binding_mode": "dry_run_only",
        "binding_created": False,
        "dispatch_created": False,
    }
    assert status["binding_scope"] == {
        "adapter_registry_readback_allowed": True,
        "binding_plan_metadata_allowed": True,
        "adapter_binding_allowed": False,
        "adapter_dispatch_allowed": False,
        "target_mutation_allowed": False,
    }
    assert status["capabilities"]["adapter_binding_dry_run_readback_enabled"] is True
    assert status["capabilities"]["adapter_registry_readback_enabled"] is True
    assert status["capabilities"]["binding_plan_metadata_enabled"] is True
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
    assert "adapter_binding" in status["forbidden_boundaries"]
    assert "adapter_dispatch" in status["forbidden_boundaries"]
    assert "target_mutation" in status["forbidden_boundaries"]
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized


def test_adapter_binding_dry_run_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/adapter-binding-dry-run-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "adapter_binding_dry_run_status"
    assert payload["adapter_binding_dry_run_complete"] is True
    assert payload["capabilities"]["adapter_binding_dry_run_readback_enabled"] is True
    assert payload["capabilities"]["adapter_registry_readback_enabled"] is True
    assert payload["capabilities"]["binding_plan_metadata_enabled"] is True
    assert payload["capabilities"]["adapter_binding_enabled"] is False
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
