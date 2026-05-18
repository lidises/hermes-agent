def test_runtime_activation_review_status_projects_disabled_runtime_activation_without_daemon():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_runtime_activation_review_status

    status = build_office_controlled_mutation_runtime_activation_review_status(
        unsafe_examples={
            "path": "/Users/lidises/private/runtime.py",
            "token": "sk-live-secret",
            "provider_id": "private-provider",
            "traceback": "Traceback (most recent call last)",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "runtime_activation_review_status"
    assert status["runtime_activation_review_complete"] is True
    assert status["source_watcher_cron_lane"] == "watcher_cron_contract_status"
    assert status["next_manual_lane"] == "runtime_activation_still_disabled"
    assert status["reviewed_activation_targets"] == [
        "watcher_daemon",
        "cron_job_activation",
        "adapter_dispatch",
        "target_mutation",
    ]
    assert status["activation_decisions"] == {
        "watcher_daemon": "disabled_requires_explicit_runtime_approval",
        "cron_job_activation": "disabled_requires_explicit_runtime_approval",
        "adapter_dispatch": "disabled_requires_explicit_runtime_approval",
        "target_mutation": "disabled_requires_explicit_runtime_approval",
    }
    assert "runtime_activation" in status["forbidden_boundaries"]
    assert "vps_file_change" in status["forbidden_boundaries"]
    assert status["capabilities"]["runtime_activation_review_readback_enabled"] is True
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
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "/Users/lidises" not in serialized
    assert "sk-live-secret" not in serialized
    assert "private-provider" not in serialized
    assert "Traceback" not in serialized


def test_runtime_activation_review_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/runtime-activation-review-status"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "runtime_activation_review_status"
    assert payload["runtime_activation_review_complete"] is True
    assert payload["capabilities"]["runtime_activation_review_readback_enabled"] is True
    assert payload["capabilities"]["watcher_daemon_enabled"] is False
    assert payload["capabilities"]["cron_enabled"] is False
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
