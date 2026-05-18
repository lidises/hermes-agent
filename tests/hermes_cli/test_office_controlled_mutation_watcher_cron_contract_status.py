"""Tests for post-target-dispatch watcher/cron contract status lane."""


def test_watcher_cron_contract_status_projects_disabled_scheduler_contract_without_daemon():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_watcher_cron_contract_status

    status = build_office_controlled_mutation_watcher_cron_contract_status(
        unsafe_examples={
            "path": "/Users/lidises/private/watch.py",
            "provider": "private-watcher-provider",
            "token": "sk-watch...cret",
            "raw_body": "raw watcher cron body must not leak",
        }
    )

    assert status["mode"] == "watcher_cron_contract_status"
    assert status["watcher_cron_contract_complete"] is True
    assert status["source_target_dispatch_lane"] == "target_dispatch_contract_status"
    assert status["next_manual_lane"] == "watcher_cron_runtime_approval_required"
    assert status["scheduler_options"] == ["manual_poll", "operator_trigger", "disabled_cron_draft"]
    assert status["required_scheduler_fields"] == [
        "schedule_ref",
        "dispatch_contract_ref",
        "target_ref",
        "poll_interval_seconds",
        "max_items_per_tick",
        "dry_run_ref",
        "safe_summary",
        "evidence_refs",
        "expires_at",
    ]
    assert status["capabilities"]["watcher_cron_contract_readback_enabled"] is True
    assert status["capabilities"]["watcher_daemon_enabled"] is False
    assert status["capabilities"]["cron_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["service_restart_enabled"] is False
    assert status["capabilities"]["git_push_enabled"] is False
    assert status["redaction"]["raw_excluded"] is True
    serialized = str(status)
    assert "/Users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "raw watcher cron" not in serialized
    assert "sk-" not in serialized
    assert "private-watcher-provider" not in serialized


def test_watcher_cron_contract_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/watcher-cron-contract-status"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "watcher_cron_contract_status"
    assert payload["watcher_cron_contract_complete"] is True
    assert payload["capabilities"]["watcher_cron_contract_readback_enabled"] is True
    assert payload["capabilities"]["watcher_daemon_enabled"] is False
    assert payload["capabilities"]["cron_enabled"] is False
