"""Tests for dispatcher/authority dry-run result/audit metadata recording draft surface."""


def test_dispatcher_authority_metadata_recording_draft_projects_safe_payloads_only():
    from hermes_cli.office_controlled_mutation import (
        build_office_controlled_mutation_dispatcher_authority_metadata_recording_draft,
    )

    draft = build_office_controlled_mutation_dispatcher_authority_metadata_recording_draft(
        request_id="req_20260518_dispatcher_dryrun",
        correlation_id="corr_20260518_dispatcher_dryrun",
        authority_ref="authority_20260518_status_note",
        result_id="dryrun_20260518_dispatcher_metadata",
        audit_id="audit_20260518_dispatcher_metadata",
        recorded_at="2026-05-18T11:45:00Z",
        unsafe_examples={
            "raw_path": "/Users/lidises/private-note.md",
            "provider": "private-authority-provider",
            "token": "sk-tok...alue",
            "traceback": "Traceback (most recent call last)",
            "markdown_body": "raw markdown body must not leak",
        },
    )

    assert draft["mode"] == "dispatcher_authority_metadata_recording_draft"
    assert draft["ready"] is True
    assert draft["request_id"] == "req_20260518_dispatcher_dryrun"
    assert draft["correlation_id"] == "corr_20260518_dispatcher_dryrun"
    assert draft["authority_ref"] == "authority_20260518_status_note"
    assert draft["dry_run_result_payload"] == {
        "result_id": "dryrun_20260518_dispatcher_metadata",
        "request_id": "req_20260518_dispatcher_dryrun",
        "correlation_id": "corr_20260518_dispatcher_dryrun",
        "simulated_by": "actor:dispatcher_authority_dry_run_surface",
        "simulation_status": "passed",
        "safe_summary": "Dispatcher authority dry-run metadata recorded; execution boundary remains closed.",
        "evidence_refs": [
            "plan:req_20260518_dispatcher_dryrun",
            "authority:authority_20260518_status_note",
        ],
        "completed_at": "2026-05-18T11:45:00Z",
    }
    assert draft["audit_payload"] == {
        "audit_id": "audit_20260518_dispatcher_metadata",
        "request_id": "req_20260518_dispatcher_dryrun",
        "correlation_id": "corr_20260518_dispatcher_dryrun",
        "event_kind": "dry_run_result_recorded",
        "actor_ref": "actor:dispatcher_authority_dry_run_surface",
        "safe_summary": "Dry-run result metadata prepared for manual append only; no dispatch, binding, target mutation, NAS save, daemon, auth access, or public exposure.",
        "evidence_refs": [
            "dryrun:dryrun_20260518_dispatcher_metadata",
            "authority:authority_20260518_status_note",
        ],
        "recorded_at": "2026-05-18T11:45:00Z",
    }
    assert draft["capabilities"]["metadata_recording_draft_enabled"] is True
    assert draft["capabilities"]["dry_run_result_storage_enabled"] is False
    assert draft["capabilities"]["audit_write_enabled"] is False
    assert draft["capabilities"]["dry_run_execution_enabled"] is False
    assert draft["capabilities"]["adapter_binding_enabled"] is False
    assert draft["capabilities"]["target_mutation_enabled"] is False
    assert draft["capabilities"]["nas_save_enabled"] is False
    serialized = str(draft)
    assert "/Users/lidises" not in serialized
    assert "private-authority-provider" not in serialized
    assert "sk-tok...alue" not in serialized
    assert "Traceback" not in serialized
    assert "raw markdown body" not in serialized


def test_dispatcher_authority_metadata_recording_draft_rejects_raw_filters_without_echo():
    from hermes_cli.office_controlled_mutation import (
        build_office_controlled_mutation_dispatcher_authority_metadata_recording_draft,
    )

    result = build_office_controlled_mutation_dispatcher_authority_metadata_recording_draft(
        request_id="/home/hermes/not-safe",
        correlation_id="corr_20260518_safe_dispatcher",
        authority_ref="private-authority-provider",
        result_id="dryrun_20260518_safe",
        audit_id="audit_20260518_safe",
        recorded_at="2026-05-18T11:45:00Z",
    )

    assert result["mode"] == "dispatcher_authority_metadata_recording_draft"
    assert result["ready"] is False
    assert result["dry_run_result_payload"] is None
    assert result["audit_payload"] is None
    assert result["errors"] == [
        {"field": "authority_ref", "code": "invalid_opaque_id"},
        {"field": "request_id", "code": "invalid_opaque_id"},
    ]
    serialized = str(result)
    assert "/home/hermes/not-safe" not in serialized
    assert "private-authority-provider" not in serialized


def test_dispatcher_authority_metadata_recording_draft_api_is_protected(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/dispatcher-authority-metadata-recording-draft?request_id=req_20260518_dispatcher_dryrun&correlation_id=corr_20260518_dispatcher_dryrun&authority_ref=authority_20260518_status_note&result_id=dryrun_20260518_dispatcher_metadata&audit_id=audit_20260518_dispatcher_metadata&recorded_at=2026-05-18T11:45:00Z"

    unauthorized = client.get(route)
    assert unauthorized.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    payload = response.json()
    assert payload["mode"] == "dispatcher_authority_metadata_recording_draft"
    assert payload["ready"] is True
    assert payload["dry_run_result_payload"]["result_id"] == "dryrun_20260518_dispatcher_metadata"
    assert payload["audit_payload"]["event_kind"] == "dry_run_result_recorded"
    assert payload["capabilities"]["metadata_recording_draft_enabled"] is True
    assert payload["capabilities"]["dry_run_result_storage_enabled"] is False
    assert payload["capabilities"]["audit_write_enabled"] is False
