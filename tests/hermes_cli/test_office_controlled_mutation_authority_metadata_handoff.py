"""Tests for AI Office authority metadata handoff status readback."""


def test_authority_metadata_handoff_status_summarizes_safe_store_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_audit_event,
        append_office_controlled_mutation_authority_adapter_registry_event,
        append_office_controlled_mutation_decision_event,
        append_office_controlled_mutation_dry_run_result_event,
        append_office_controlled_mutation_request_event,
        build_office_controlled_mutation_authority_metadata_handoff_status,
    )

    request_id = "req_20260518_1801_handoff"
    correlation_id = "corr_20260518_1801_handoff"
    paths = {
        "requests": tmp_path / "requests.jsonl",
        "decisions": tmp_path / "decisions.jsonl",
        "dry_run_results": tmp_path / "dry_run_results.jsonl",
        "audit_events": tmp_path / "audit_events.jsonl",
        "authority_registry": tmp_path / "authority_adapters.jsonl",
    }

    append_office_controlled_mutation_request_event(
        {
            "request_id": request_id,
            "correlation_id": correlation_id,
            "actor_ref": "actor:operator",
            "intent_kind": "action_requested",
            "action_kind": "kanban_comment",
            "authority_level": "request_only",
            "risk_class": "low",
            "target_ref": "target:office-status-note",
            "reason_code": "authority_metadata_checkpoint",
            "safe_summary": "Record safe authority handoff metadata only.",
            "evidence_refs": ["evidence:authority-metadata-checkpoint"],
            "requested_at": "2026-05-18T09:01:00Z",
        },
        store_path=paths["requests"],
    )
    append_office_controlled_mutation_decision_event(
        {
            "decision_id": "decision_20260518_1801_handoff",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "decision": "approve",
            "decided_by": "actor:operator",
            "safe_reason_summary": "Approved metadata-only handoff note.",
            "evidence_refs": ["request:req_20260518_1801_handoff"],
            "decided_at": "2026-05-18T09:02:00Z",
        },
        store_path=paths["decisions"],
    )
    append_office_controlled_mutation_dry_run_result_event(
        {
            "result_id": "dryrun_20260518_1801_handoff",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "simulated_by": "actor:orchestrator",
            "simulation_status": "blocked",
            "safe_summary": "No dispatch or target mutation executed.",
            "evidence_refs": ["decision:decision_20260518_1801_handoff"],
            "completed_at": "2026-05-18T09:03:00Z",
        },
        store_path=paths["dry_run_results"],
    )
    append_office_controlled_mutation_audit_event(
        {
            "audit_id": "audit_20260518_1801_handoff",
            "request_id": request_id,
            "correlation_id": correlation_id,
            "event_kind": "execution_blocked",
            "actor_ref": "actor:orchestrator",
            "safe_summary": "Authority handoff stays metadata-only.",
            "evidence_refs": ["dryrun:dryrun_20260518_1801_handoff"],
            "recorded_at": "2026-05-18T09:04:00Z",
        },
        store_path=paths["audit_events"],
    )
    append_office_controlled_mutation_authority_adapter_registry_event(
        {
            "adapter_ref": "adapter_20260518_handoff",
            "adapter_kind": "status_note",
            "authority_candidate_ref": "authority_20260518_handoff",
            "registered_by": "actor:orchestrator",
            "permission_posture": "metadata_only",
            "credential_posture": "not_configured",
            "dispatch_posture": "blocked",
            "target_posture": "blocked",
            "safe_summary": "Status-note candidate only; no binding.",
            "evidence_refs": ["audit:audit_20260518_1801_handoff"],
            "registered_at": "2026-05-18T09:05:00Z",
        },
        store_path=paths["authority_registry"],
    )

    status = build_office_controlled_mutation_authority_metadata_handoff_status(
        request_id=request_id,
        correlation_id=correlation_id,
        store_paths=paths,
    )

    assert status["mode"] == "authority_metadata_handoff_status"
    assert status["request_id"] == request_id
    assert status["correlation_id"] == correlation_id
    assert status["chain_counts"] == {
        "requests": 1,
        "decisions": 1,
        "dry_run_results": 1,
        "audit_events": 1,
        "authority_registry": 1,
    }
    assert status["checkpoint_complete"] is True
    assert status["next_manual_lane"] == "manual_status_note_authority_handoff"
    assert status["capabilities"]["metadata_readback_enabled"] is True
    assert status["capabilities"]["status_note_lane_enabled"] is True
    assert status["capabilities"]["adapter_binding_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["credential_access_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False


def test_authority_metadata_handoff_status_rejects_raw_filter_values_without_echo():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_authority_metadata_handoff_status

    result = build_office_controlled_mutation_authority_metadata_handoff_status(
        request_id="/Users/lidises/private/raw-task.md",
        correlation_id="token_hunter2_corr",
    )

    assert result["checkpoint_complete"] is False
    assert result["errors"] == [
        {"field": "correlation_id", "code": "invalid_opaque_id"},
        {"field": "request_id", "code": "invalid_opaque_id"},
    ]
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "hunter2" not in serialized
    assert "token" not in serialized


def test_authority_metadata_handoff_status_api_is_protected(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_request_event
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    request_id = "req_20260518_1802_handoff"
    correlation_id = "corr_20260518_1802_handoff"
    append_office_controlled_mutation_request_event(
        {
            "request_id": request_id,
            "correlation_id": correlation_id,
            "actor_ref": "actor:operator",
            "intent_kind": "action_requested",
            "action_kind": "kanban_comment",
            "authority_level": "request_only",
            "risk_class": "low",
            "target_ref": "target:office-status-note",
            "reason_code": "authority_metadata_checkpoint",
            "safe_summary": "Record safe authority handoff metadata only.",
            "evidence_refs": ["evidence:authority-metadata-checkpoint"],
            "requested_at": "2026-05-18T09:02:00Z",
        }
    )
    client = TestClient(app)
    route = f"/api/office/controlled-mutation/authority-metadata-handoff?request_id={request_id}&correlation_id={correlation_id}"

    assert client.get(route).status_code == 401
    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "authority_metadata_handoff_status"
    assert payload["chain_counts"]["requests"] == 1
    assert payload["capabilities"]["adapter_dispatch_enabled"] is False
