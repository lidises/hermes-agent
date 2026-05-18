"""Tests for dispatcher authority handoff completion review status lane."""


def _append_completion_review_fixture(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_dry_run_result_event,
    )

    dry_run_path = tmp_path / "dry_run_results.jsonl"
    audit_path = tmp_path / "audit_events.jsonl"
    request_id = "req_20260518_1255_dispatcher_execution_simulation"
    correlation_id = "corr_20260518_1255_dispatcher_execution_simulation"
    append_office_controlled_mutation_dry_run_result_event(
        {
            "result_id": "dryrun_20260518_1255_dispatcher_execution_simulation",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "simulated_by": "actor:human_reviewed_dispatcher_execution_simulation",
            "simulation_status": "blocked",
            "safe_summary": "Human-reviewed dispatcher execution simulation recorded as blocked; execution boundary remains closed.",
            "evidence_refs": ["request:req_20260518_1255_dispatcher_execution_simulation"],
            "completed_at": "2026-05-18T12:55:00Z",
        },
        store_path=dry_run_path,
    )
    append_office_controlled_mutation_audit_event(
        {
            "audit_id": "audit_20260518_1255_dispatcher_execution_simulation",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "event_kind": "execution_blocked",
            "actor_ref": "actor:human_reviewed_dispatcher_execution_simulation",
            "safe_summary": "Dispatcher execution simulation metadata appended; no adapter dispatch, binding, target mutation, NAS save, daemon, Kanban mutation, or public exposure.",
            "evidence_refs": ["dryrun:dryrun_20260518_1255_dispatcher_execution_simulation"],
            "recorded_at": "2026-05-18T12:55:00Z",
        },
        store_path=audit_path,
    )
    return {"dry_run_results": dry_run_path, "audit_events": audit_path}


def test_dispatcher_completion_review_status_summarizes_blocked_checkpoint(tmp_path):
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_dispatcher_completion_review_status

    status = build_office_controlled_mutation_dispatcher_completion_review_status(
        store_paths=_append_completion_review_fixture(tmp_path),
        limit=5,
    )

    assert status["mode"] == "dispatcher_completion_review_status"
    assert status["completion_review_complete"] is True
    assert status["execution_checkpoint_status"] == "blocked"
    assert status["review_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert status["latest_refs"] == {
        "dry_run_result": "dryrun_20260518_1255_dispatcher_execution_simulation",
        "audit": "audit_20260518_1255_dispatcher_execution_simulation",
    }
    assert status["completed_lanes"] == [
        "dispatcher_authority_dry_run_surface",
        "dispatcher_metadata_recording_draft",
        "dispatcher_metadata_append_checkpoint",
        "dispatcher_execution_simulation_status",
    ]
    assert status["next_manual_lane"] == "authority_handoff_completion_review_only"
    assert status["capabilities"]["completion_review_readback_enabled"] is True
    assert status["capabilities"]["dry_run_execution_enabled"] is False
    assert status["capabilities"]["adapter_binding_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["watcher_daemon_enabled"] is False
    assert status["capabilities"]["cron_enabled"] is False
    serialized = str(status)
    assert "/Users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "Traceback" not in serialized
    assert "sk-" not in serialized
    assert "private-authority-provider" not in serialized


def test_dispatcher_completion_review_status_api_is_protected(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_dry_run_result_event,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    request_id = "req_20260518_1255_dispatcher_execution_simulation"
    correlation_id = "corr_20260518_1255_dispatcher_execution_simulation"
    append_office_controlled_mutation_dry_run_result_event(
        {
            "result_id": "dryrun_20260518_1255_dispatcher_execution_simulation",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "simulated_by": "actor:human_reviewed_dispatcher_execution_simulation",
            "simulation_status": "blocked",
            "safe_summary": "Human-reviewed dispatcher execution simulation recorded as blocked; execution boundary remains closed.",
            "evidence_refs": ["request:req_20260518_1255_dispatcher_execution_simulation"],
            "completed_at": "2026-05-18T12:55:00Z",
        }
    )
    append_office_controlled_mutation_audit_event(
        {
            "audit_id": "audit_20260518_1255_dispatcher_execution_simulation",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "event_kind": "execution_blocked",
            "actor_ref": "actor:human_reviewed_dispatcher_execution_simulation",
            "safe_summary": "Dispatcher execution simulation metadata appended; no adapter dispatch, binding, target mutation, NAS save, daemon, Kanban mutation, or public exposure.",
            "evidence_refs": ["dryrun:dryrun_20260518_1255_dispatcher_execution_simulation"],
            "recorded_at": "2026-05-18T12:55:00Z",
        }
    )
    client = TestClient(app)
    route = "/api/office/controlled-mutation/dispatcher-completion-review-status?limit=5"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "dispatcher_completion_review_status"
    assert payload["completion_review_complete"] is True
    assert payload["review_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert payload["capabilities"]["completion_review_readback_enabled"] is True
    assert payload["capabilities"]["dry_run_execution_enabled"] is False
