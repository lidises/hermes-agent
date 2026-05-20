"""Tests for safe approval-event envelope metadata persistence."""


def _approval_record_draft_payload() -> dict[str, object]:
    return {
        "approval_record_ref": "approval-office-event-1",
        "exact_target_allowlist_ref": "allowlist-office-target-1",
        "idempotency_key": "idem-office-event-1",
        "replay_lookup_ref": "replay-office-event-1",
        "rollback_disable_ref": "rollback-office-event-1",
        "dry_run_evidence_ref": "dryrun-office-event-1",
        "operator_confirmation": "confirmed-draft-record-only",
        "requested_by": "actor:ai_office_operator",
        "requested_at": "2026-05-20T11:42:44Z",
        "safe_summary": "Draft approval record stored for approval-event envelope metadata only.",
        "evidence_refs": ["plan:approval_event_envelope", "dryrun:dryrun-office-event-1"],
    }


def _approval_record_payload() -> dict[str, object]:
    return {
        "approval_record_ref": "approval-office-event-1",
        "operator_confirmation": "confirmed-real-approval-record-write-only",
        "approved_by": "actor:ai_office_operator",
        "approved_at": "2026-05-20T11:43:00Z",
        "approval_evidence_refs": ["approval:approval-office-event-1", "plan:approval_event_envelope"],
    }


def _approval_event_payload() -> dict[str, object]:
    return {
        "approval_event_ref": "event-office-approval-1",
        "approval_record_ref": "approval-office-event-1",
        "event_envelope_ref": "envelope-office-approval-1",
        "event_kind": "manual_approval_recorded",
        "idempotency_key": "idem-event-office-approval-1",
        "operator_confirmation": "confirmed-approval-event-envelope-metadata-only",
        "created_by": "actor:ai_office_operator",
        "created_at": "2026-05-20T11:44:00Z",
        "safe_summary": "Approval-event envelope metadata recorded; dispatch remains closed.",
        "evidence_refs": ["approval:approval-office-event-1", "envelope:envelope-office-approval-1"],
    }


def _seed_approval_record(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
    )

    draft_store = tmp_path / "approval_record_drafts.jsonl"
    approval_store = tmp_path / "approval_records.jsonl"
    assert append_office_controlled_mutation_manual_approval_recording_draft(
        _approval_record_draft_payload(), store_path=draft_store
    )["stored"] is True
    assert append_office_controlled_mutation_manual_approval_record(
        _approval_record_payload(), draft_store_path=draft_store, store_path=approval_store
    )["stored"] is True
    return approval_store


def test_approval_event_envelope_append_stores_safe_metadata_without_opening_dispatch(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_approval_event_envelope

    approval_store = _seed_approval_record(tmp_path)
    result = append_office_controlled_mutation_approval_event_envelope(
        {
            **_approval_event_payload(),
            "raw_prompt": "please run python /home/hermes/private/dispatch.py",
            "provider": "private-provider",
            "token": "sk-test-approval-event-token",
        },
        approval_store_path=approval_store,
        store_path=tmp_path / "approval_event_envelopes.jsonl",
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_approval_event_envelope"
    assert dto["approval_event_ref"] == "event-office-approval-1"
    assert dto["approval_record_ref"] == "approval-office-event-1"
    assert dto["event_envelope_ref"] == "envelope-office-approval-1"
    assert dto["approval_event_envelope_written"] is True
    assert dto["dispatch_gate_open"] is False
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["capabilities"]["approval_event_envelope_storage_enabled"] is True
    assert dto["capabilities"]["approval_record_readback_enabled"] is True
    assert dto["capabilities"]["dispatch_gate_open"] is False
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    rendered = repr(result)
    assert "/home/hermes" not in rendered
    assert "raw_prompt" not in rendered
    assert "private-provider" not in rendered
    assert "sk-test" not in rendered


def test_approval_event_envelope_rejects_invalid_refs_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_approval_event_envelope

    approval_store = _seed_approval_record(tmp_path)
    result = append_office_controlled_mutation_approval_event_envelope(
        {
            **_approval_event_payload(),
            "approval_event_ref": "/Users/lidises/private/event.json",
            "event_envelope_ref": "bad envelope",
            "event_kind": "execute_dispatch_now",
            "operator_confirmation": "please execute now",
            "safe_summary": "raw /home/hermes/path should be rejected",
        },
        approval_store_path=approval_store,
        store_path=tmp_path / "approval_event_envelopes.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    errors = {(item["field"], item["code"]) for item in result["errors"]}
    assert ("approval_event_ref", "unsupported_ref_shape") in errors
    assert ("event_envelope_ref", "unsupported_ref_shape") in errors
    assert ("event_kind", "unsupported_event_kind") in errors
    assert ("operator_confirmation", "unsupported_confirmation") in errors
    assert ("safe_summary", "invalid_safe_text") in errors
    rendered = repr(result)
    assert "/Users/lidises" not in rendered
    assert "/home/hermes" not in rendered
    assert "please execute" not in rendered


def test_approval_event_envelope_readback_counts_and_duplicate_blocks(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_approval_event_envelope,
        list_office_controlled_mutation_approval_event_envelopes,
    )

    approval_store = _seed_approval_record(tmp_path)
    store_path = tmp_path / "approval_event_envelopes.jsonl"
    first = append_office_controlled_mutation_approval_event_envelope(
        _approval_event_payload(), approval_store_path=approval_store, store_path=store_path
    )
    duplicate = append_office_controlled_mutation_approval_event_envelope(
        _approval_event_payload(), approval_store_path=approval_store, store_path=store_path
    )
    readback = list_office_controlled_mutation_approval_event_envelopes(
        store_path=store_path,
        approval_event_ref="event-office-approval-1",
    )

    assert first["stored"] is True
    assert duplicate == {"stored": False, "errors": [{"field": "approval_event_ref", "code": "duplicate_approval_event_ref"}], "dto": None}
    assert readback["mode"] == "stored_approval_event_envelopes_readback"
    assert readback["approval_event_envelope_count"] == 1
    assert readback["latest_refs"] == {
        "approval_event_ref": "event-office-approval-1",
        "approval_record_ref": "approval-office-event-1",
        "event_envelope_ref": "envelope-office-approval-1",
        "idempotency_key": "idem-event-office-approval-1",
    }
    assert readback["capabilities"]["approval_event_envelope_readback_enabled"] is True
    assert readback["capabilities"]["dispatch_gate_open"] is False
    assert readback["capabilities"]["real_dispatch_execution_enabled"] is False


def test_approval_event_envelope_api_is_protected_and_writes_metadata_only(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(web_server.app)
    draft_path = "/api/office/controlled-mutation/manual-approval-recording-draft"
    approval_path = "/api/office/controlled-mutation/manual-approval-record"
    post_path = "/api/office/controlled-mutation/approval-event-envelope"
    get_path = "/api/office/controlled-mutation/approval-event-envelope-status?approval_event_ref=event-office-approval-1"

    assert client.post(post_path, json=_approval_event_payload()).status_code == 401
    assert client.get(get_path).status_code == 401

    headers = {web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}
    assert client.post(draft_path, headers=headers, json=_approval_record_draft_payload()).json()["stored"] is True
    assert client.post(approval_path, headers=headers, json=_approval_record_payload()).json()["stored"] is True

    stored = client.post(post_path, headers=headers, json=_approval_event_payload())
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["approval_event_envelope_written"] is True
    assert body["dto"]["dispatch_gate_open"] is False
    assert body["dto"]["runtime_command_executed"] is False

    readback = client.get(get_path, headers=headers)
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["approval_event_envelope_count"] == 1
    assert payload["latest_refs"]["approval_event_ref"] == "event-office-approval-1"
    assert payload["capabilities"]["approval_event_envelope_readback_enabled"] is True
    assert payload["capabilities"]["real_dispatch_execution_enabled"] is False
