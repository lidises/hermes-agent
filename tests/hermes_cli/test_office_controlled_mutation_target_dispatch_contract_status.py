"""Tests for post-completion target dispatch contract status lane."""


def test_target_dispatch_contract_status_projects_blocked_next_lane_without_execution():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_target_dispatch_contract_status

    status = build_office_controlled_mutation_target_dispatch_contract_status(
        unsafe_examples={
            "path": "/Users/lidises/private/target.md",
            "provider": "private-target-dispatch-provider",
            "token": "sk-target-dispatch-secret",
            "raw_body": "raw target dispatch body must not leak",
        }
    )

    assert status["mode"] == "target_dispatch_contract_status"
    assert status["target_dispatch_contract_complete"] is True
    assert status["source_completion_review_lane"] == "dispatcher_completion_review_status"
    assert status["next_manual_lane"] == "target_dispatch_runtime_approval_required"
    assert status["dispatch_options"] == ["kanban_comment", "status_note", "read_only_projection"]
    assert status["required_dispatch_fields"] == [
        "dispatch_ref",
        "binding_candidate_ref",
        "authority_candidate_ref",
        "request_ref",
        "decision_ref",
        "target_ref",
        "operation_kind",
        "dry_run_ref",
        "safe_summary",
        "evidence_refs",
        "expires_at",
    ]
    assert status["capabilities"]["target_dispatch_contract_readback_enabled"] is True
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["vps_file_change_enabled"] is False
    assert status["capabilities"]["service_restart_enabled"] is False
    assert status["capabilities"]["git_push_enabled"] is False
    assert status["redaction"]["raw_excluded"] is True
    serialized = str(status)
    assert "/Users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "raw target dispatch" not in serialized
    assert "sk-" not in serialized
    assert "private-target-dispatch-provider" not in serialized


def test_target_dispatch_contract_status_api_is_protected():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/target-dispatch-contract-status"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "target_dispatch_contract_status"
    assert payload["target_dispatch_contract_complete"] is True
    assert payload["capabilities"]["target_dispatch_contract_readback_enabled"] is True
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
