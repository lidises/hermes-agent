def test_runtime_preflight_status_projects_readiness_without_enabling_runtime():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_runtime_preflight_status

    status = build_office_controlled_mutation_runtime_preflight_status(
        unsafe_examples={
            "unit_path": "/home/hermes/.config/systemd/user/private.service",
            "token": "***",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "runtime_preflight_status"
    assert status["runtime_preflight_complete"] is True
    assert status["source_runtime_activation_lane"] == "runtime_activation_review_status"
    assert status["next_manual_lane"] == "manual_one_shot_runtime_dry_run"
    assert status["preflight_decisions"] == {
        "systemd_unit_draft": "draft_required_not_created",
        "cron_schedule_draft": "draft_required_not_installed",
        "env_gate": "disabled_by_default_required",
        "rollback_disable_command": "required_before_activation",
        "target_allowlist": "required_before_dispatch",
        "adapter_dry_run": "required_before_dispatch",
        "audit_sink": "metadata_only_required_before_dispatch",
    }
    assert status["readiness"] == {
        "systemd_unit_ready": False,
        "cron_schedule_ready": False,
        "env_gate_ready": False,
        "rollback_ready": False,
        "target_allowlist_ready": False,
        "adapter_dry_run_ready": False,
        "audit_sink_ready": False,
        "runtime_activation_ready": False,
    }
    assert status["capabilities"]["runtime_preflight_readback_enabled"] is True
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
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "/home/hermes" not in serialized
    assert "***" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized


def test_runtime_preflight_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/runtime-preflight-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "runtime_preflight_status"
    assert payload["runtime_preflight_complete"] is True
    assert payload["capabilities"]["runtime_preflight_readback_enabled"] is True
    assert payload["readiness"]["runtime_activation_ready"] is False
    assert payload["capabilities"]["watcher_daemon_enabled"] is False
    assert payload["capabilities"]["cron_enabled"] is False
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
