"""Tests for AI Office dispatcher/authority dry-run-only design surface."""


def test_dispatcher_authority_dry_run_surface_projects_safe_plan_only():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dispatcher_authority_dry_run_surface

    surface = build_office_controlled_mutation_dispatcher_authority_dry_run_surface(
        request_id="req_20260518_dispatcher_dryrun",
        correlation_id="corr_20260518_dispatcher_dryrun",
        authority_ref="authority_20260518_status_note",
        unsafe_examples={
            "raw_path": "/Users/lidises/private-note.md",
            "provider": "private-authority-provider",
            "token": "sk-token-shaped-value",
            "traceback": "Traceback (most recent call last)",
            "markdown_body": "raw markdown body must not leak",
        },
    )

    assert surface["mode"] == "dispatcher_authority_dry_run_surface"
    assert surface["request_id"] == "req_20260518_dispatcher_dryrun"
    assert surface["correlation_id"] == "corr_20260518_dispatcher_dryrun"
    assert surface["authority_ref"] == "authority_20260518_status_note"
    assert surface["dry_run_plan"]["plan_ref"] == "plan_req_20260518_dispatcher_dryrun"
    assert surface["dry_run_plan"]["would_dispatch"] is False
    assert surface["dry_run_plan"]["would_bind_authority_adapter"] is False
    assert surface["dry_run_plan"]["would_mutate_target"] is False
    assert surface["dry_run_plan"]["would_write_nas"] is False
    assert surface["dry_run_plan"]["would_start_daemon"] is False
    assert surface["dry_run_plan"]["next_boundary"] == "explicit_dispatcher_authority_execution_approval_required"
    assert [step["step_ref"] for step in surface["dry_run_plan"]["steps"]] == [
        "read_authority_metadata_checkpoint",
        "select_safe_authority_candidate",
        "prepare_simulated_dispatch_envelope",
        "record_manual_dry_run_result_only_after_separate_approval",
        "stop_before_execution_boundary",
    ]
    assert surface["capabilities"]["dry_run_design_surface_enabled"] is True
    assert surface["capabilities"]["adapter_dispatch_enabled"] is False
    assert surface["capabilities"]["adapter_binding_enabled"] is False
    assert surface["capabilities"]["target_mutation_enabled"] is False
    assert surface["capabilities"]["dry_run_execution_enabled"] is False
    assert surface["capabilities"]["nas_save_enabled"] is False
    assert surface["capabilities"]["watcher_daemon_enabled"] is False
    assert surface["capabilities"]["cron_enabled"] is False
    assert surface["capabilities"]["vps_direct_nas_authority_enabled"] is False
    serialized = str(surface)
    assert "/Users/lidises" not in serialized
    assert "private-authority-provider" not in serialized
    assert "sk-token-shaped-value" not in serialized
    assert "Traceback" not in serialized
    assert "raw markdown body" not in serialized


def test_dispatcher_authority_dry_run_surface_rejects_raw_filters_without_echo():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dispatcher_authority_dry_run_surface

    result = build_office_controlled_mutation_dispatcher_authority_dry_run_surface(
        request_id="/home/hermes/not-safe",
        correlation_id="corr_20260518_safe_dispatcher",
        authority_ref="private-authority-provider",
    )

    assert result["mode"] == "dispatcher_authority_dry_run_surface"
    assert result["dry_run_plan"]["ready"] is False
    assert result["errors"] == [
        {"field": "authority_ref", "code": "invalid_opaque_id"},
        {"field": "request_id", "code": "invalid_opaque_id"},
    ]
    serialized = str(result)
    assert "/home/hermes/not-safe" not in serialized
    assert "private-authority-provider" not in serialized
    assert result["capabilities"]["adapter_dispatch_enabled"] is False


def test_dispatcher_authority_dry_run_surface_api_is_protected(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/dispatcher-authority-dry-run?request_id=req_20260518_dispatcher_dryrun&correlation_id=corr_20260518_dispatcher_dryrun"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "dispatcher_authority_dry_run_surface"
    assert payload["request_id"] == "req_20260518_dispatcher_dryrun"
    assert payload["dry_run_plan"]["would_dispatch"] is False
    assert payload["capabilities"]["adapter_binding_enabled"] is False
