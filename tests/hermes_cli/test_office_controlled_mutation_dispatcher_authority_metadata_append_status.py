"""Tests for dispatcher/authority metadata append checkpoint readback status."""


def test_dispatcher_authority_metadata_append_status_reads_safe_checkpoint(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_dry_run_result_event,
        build_office_controlled_mutation_dispatcher_authority_metadata_append_status,
    )

    dry_run_path = tmp_path / "dry_run_results.jsonl"
    audit_path = tmp_path / "audit_events.jsonl"
    request_id = "req_20260518_1218_dispatcher_metadata_append"
    correlation_id = "corr_20260518_1218_dispatcher_metadata_append"

    dry_run = append_office_controlled_mutation_dry_run_result_event(
        {
            "result_id": "dryrun_20260518_1218_dispatcher_metadata_append",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "simulated_by": "actor:dispatcher_authority_dry_run_surface",
            "simulation_status": "passed",
            "safe_summary": "Dispatcher authority dry-run metadata recorded; execution boundary remains closed.",
            "evidence_refs": ["plan:req_20260518_1218_dispatcher_metadata_append"],
            "completed_at": "2026-05-18T12:18:00Z",
        },
        store_path=dry_run_path,
    )
    audit = append_office_controlled_mutation_audit_event(
        {
            "audit_id": "audit_20260518_1218_dispatcher_metadata_append",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "event_kind": "dry_run_result_recorded",
            "actor_ref": "actor:dispatcher_authority_dry_run_surface",
            "safe_summary": "Dry-run result metadata appended; no dispatch, binding, target mutation, NAS save, daemon, auth access, or public exposure.",
            "evidence_refs": ["dryrun:dryrun_20260518_1218_dispatcher_metadata_append"],
            "recorded_at": "2026-05-18T12:18:00Z",
        },
        store_path=audit_path,
    )
    assert dry_run["stored"] is True
    assert audit["stored"] is True

    status = build_office_controlled_mutation_dispatcher_authority_metadata_append_status(
        request_id=request_id,
        correlation_id=correlation_id,
        store_paths={"dry_run_results": dry_run_path, "audit_events": audit_path},
        limit=5,
    )

    assert status["mode"] == "dispatcher_authority_metadata_append_status"
    assert status["append_checkpoint_complete"] is True
    assert status["append_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert status["latest_refs"] == {
        "dry_run_result": "dryrun_20260518_1218_dispatcher_metadata_append",
        "audit": "audit_20260518_1218_dispatcher_metadata_append",
    }
    assert status["request_id"] == request_id
    assert status["correlation_id"] == correlation_id
    assert status["next_manual_lane"] == "human_reviewed_dispatcher_execution_simulation_boundary"
    assert status["capabilities"]["metadata_append_readback_enabled"] is True
    assert status["capabilities"]["dry_run_result_storage_enabled"] is True
    assert status["capabilities"]["audit_write_enabled"] is True
    assert status["capabilities"]["dry_run_execution_enabled"] is False
    assert status["capabilities"]["adapter_binding_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    serialized = str(status)
    assert "/Users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "Traceback" not in serialized
    assert "sk-" not in serialized
    assert "private-authority-provider" not in serialized


def test_dispatcher_authority_metadata_append_status_rejects_raw_filters_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        build_office_controlled_mutation_dispatcher_authority_metadata_append_status,
    )

    status = build_office_controlled_mutation_dispatcher_authority_metadata_append_status(
        request_id="/home/hermes/not-safe",
        correlation_id="corr_20260518_safe_append",
        store_paths={"dry_run_results": tmp_path / "dry_run_results.jsonl", "audit_events": tmp_path / "audit_events.jsonl"},
    )

    assert status["mode"] == "dispatcher_authority_metadata_append_status"
    assert status["append_checkpoint_complete"] is False
    assert status["append_counts"] == {"dry_run_results": 0, "audit_events": 0}
    assert status["errors"] == [{"field": "request_id", "code": "invalid_opaque_id"}]
    serialized = str(status)
    assert "/home/hermes/not-safe" not in serialized


def test_dispatcher_authority_metadata_append_status_api_is_protected(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_dry_run_result_event,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    request_id = "req_20260518_1218_dispatcher_metadata_append"
    correlation_id = "corr_20260518_1218_dispatcher_metadata_append"
    append_office_controlled_mutation_dry_run_result_event(
        {
            "result_id": "dryrun_20260518_1218_dispatcher_metadata_append",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "simulated_by": "actor:dispatcher_authority_dry_run_surface",
            "simulation_status": "passed",
            "safe_summary": "Dispatcher authority dry-run metadata recorded; execution boundary remains closed.",
            "evidence_refs": ["plan:req_20260518_1218_dispatcher_metadata_append"],
            "completed_at": "2026-05-18T12:18:00Z",
        }
    )
    append_office_controlled_mutation_audit_event(
        {
            "audit_id": "audit_20260518_1218_dispatcher_metadata_append",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "event_kind": "dry_run_result_recorded",
            "actor_ref": "actor:dispatcher_authority_dry_run_surface",
            "safe_summary": "Dry-run result metadata appended; no dispatch, binding, target mutation, NAS save, daemon, auth access, or public exposure.",
            "evidence_refs": ["dryrun:dryrun_20260518_1218_dispatcher_metadata_append"],
            "recorded_at": "2026-05-18T12:18:00Z",
        }
    )
    client = TestClient(app)
    route = f"/api/office/controlled-mutation/dispatcher-authority-metadata-append-status?request_id={request_id}&correlation_id={correlation_id}&limit=5"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "dispatcher_authority_metadata_append_status"
    assert payload["append_checkpoint_complete"] is True
    assert payload["append_counts"] == {"dry_run_results": 1, "audit_events": 1}
    assert payload["capabilities"]["metadata_append_readback_enabled"] is True
    assert payload["capabilities"]["dry_run_execution_enabled"] is False
