def test_manual_one_shot_runtime_dry_run_status_projects_metadata_only_dry_run_without_runtime_activation():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_manual_one_shot_runtime_dry_run_status

    status = build_office_controlled_mutation_manual_one_shot_runtime_dry_run_status(
        unsafe_examples={
            "raw_command": "python private_adapter.py --token sk-private",
            "target_path": "/home/hermes/private-target.md",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "manual_one_shot_runtime_dry_run_status"
    assert status["manual_one_shot_runtime_dry_run_complete"] is True
    assert status["source_runtime_preflight_lane"] == "runtime_preflight_status"
    assert status["next_manual_lane"] == "adapter_binding_dry_run_status"
    assert status["operator_trigger"] == {
        "trigger_mode": "operator_manual_once",
        "repeat_enabled": False,
        "watcher_daemon_required": False,
        "cron_required": False,
    }
    assert status["dry_run_scope"] == {
        "metadata_result_write_allowed": True,
        "audit_event_write_allowed": True,
        "runtime_command_execution_allowed": False,
        "adapter_dispatch_allowed": False,
        "target_mutation_allowed": False,
    }
    assert status["capabilities"]["manual_one_shot_runtime_dry_run_readback_enabled"] is True
    assert status["capabilities"]["metadata_result_write_enabled"] is True
    assert status["capabilities"]["audit_event_write_enabled"] is True
    assert status["capabilities"]["runtime_command_execution_enabled"] is False
    assert status["capabilities"]["watcher_daemon_enabled"] is False
    assert status["capabilities"]["cron_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["vps_file_change_enabled"] is False
    assert status["capabilities"]["service_restart_enabled"] is False
    assert status["capabilities"]["git_push_enabled"] is False
    assert status["capabilities"]["credential_access_enabled"] is False
    assert status["capabilities"]["public_exposure_enabled"] is False
    assert "watcher_daemon_activation" in status["forbidden_boundaries"]
    assert "cron_job_installation" in status["forbidden_boundaries"]
    assert "runtime_command_execution" in status["forbidden_boundaries"]
    assert "target_mutation" in status["forbidden_boundaries"]
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized


def test_manual_one_shot_runtime_dry_run_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/manual-one-shot-runtime-dry-run-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "manual_one_shot_runtime_dry_run_status"
    assert payload["manual_one_shot_runtime_dry_run_complete"] is True
    assert payload["capabilities"]["manual_one_shot_runtime_dry_run_readback_enabled"] is True
    assert payload["capabilities"]["metadata_result_write_enabled"] is True
    assert payload["capabilities"]["audit_event_write_enabled"] is True
    assert payload["capabilities"]["runtime_command_execution_enabled"] is False
    assert payload["capabilities"]["watcher_daemon_enabled"] is False
    assert payload["capabilities"]["cron_enabled"] is False
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
