"""Tests for human-reviewed dispatcher execution simulation checkpoint readback."""


def test_dispatcher_execution_simulation_status_reads_safe_checkpoint(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_dry_run_result_event,
        build_office_controlled_mutation_dispatcher_execution_simulation_status,
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

    status = build_office_controlled_mutation_dispatcher_execution_simulation_status(
        store_paths={"dry_run_results": dry_run_path, "audit_events": audit_path},
        limit=5,
    )

    assert status["mode"] == "dispatcher_execution_simulation_status"
    assert status["request_id"] == request_id
    assert status["correlation_id"] == correlation_id
    assert status["simulation_checkpoint_complete"] is True
    assert status["simulation_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert status["latest_refs"] == {
        "dry_run_result": "dryrun_20260518_1255_dispatcher_execution_simulation",
        "audit": "audit_20260518_1255_dispatcher_execution_simulation",
    }
    assert status["checkpoint_status"] == "blocked"
    assert status["next_manual_lane"] == "dispatcher_execution_readback_review_only"
    assert status["capabilities"]["simulation_status_readback_enabled"] is True
    assert status["capabilities"]["dry_run_execution_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    serialized = str(status)
    assert "/Users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "Traceback" not in serialized
    assert "sk-" not in serialized
    assert "private-authority-provider" not in serialized


def test_dispatcher_execution_simulation_status_api_is_protected(monkeypatch, tmp_path):
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
    route = "/api/office/controlled-mutation/dispatcher-execution-simulation-status?limit=5"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "dispatcher_execution_simulation_status"
    assert payload["simulation_checkpoint_complete"] is True
    assert payload["simulation_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert payload["capabilities"]["simulation_status_readback_enabled"] is True
    assert payload["capabilities"]["dry_run_execution_enabled"] is False
