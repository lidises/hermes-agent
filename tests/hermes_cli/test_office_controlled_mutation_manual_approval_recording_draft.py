"""Tests for safe manual approval-record draft persistence."""


def _valid_payload() -> dict[str, object]:
    return {
        "approval_record_ref": "approval-office-dispatch-1",
        "exact_target_allowlist_ref": "allowlist-office-target-1",
        "idempotency_key": "idem-office-dispatch-1",
        "replay_lookup_ref": "replay-office-dispatch-1",
        "rollback_disable_ref": "rollback-office-dispatch-1",
        "dry_run_evidence_ref": "dryrun-office-dispatch-1",
        "operator_confirmation": "confirmed-draft-record-only",
        "requested_by": "actor:ai_office_operator",
        "requested_at": "2026-05-19T04:00:00Z",
        "safe_summary": "Draft approval record stored for review only; dispatch gate remains closed.",
        "evidence_refs": ["plan:manual_approval_recording_preflight", "dryrun:dryrun-office-dispatch-1"],
    }


def test_manual_approval_recording_draft_append_stores_safe_record_without_opening_dispatch(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_approval_recording_draft

    result = append_office_controlled_mutation_manual_approval_recording_draft(
        {
            **_valid_payload(),
            "raw_command": "python /home/hermes/private/run.py",
            "token": "sk-tes...pear",
        },
        store_path=tmp_path / "approval_record_drafts.jsonl",
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_approval_recording_draft"
    assert dto["approval_record_ref"] == "approval-office-dispatch-1"
    assert dto["draft_status"] == "draft_only"
    assert dto["approval_record_written"] is False
    assert dto["dispatch_gate_open"] is False
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["idempotency_replay_store_written"] is False
    assert dto["capabilities"]["approval_record_draft_storage_enabled"] is True
    assert dto["capabilities"]["approval_recording_enabled"] is False
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    rendered = repr(result)
    assert "/home/hermes" not in rendered
    assert "sk-test" not in rendered
    assert "raw_command" not in rendered


def test_manual_approval_recording_draft_rejects_invalid_refs_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_approval_recording_draft

    result = append_office_controlled_mutation_manual_approval_recording_draft(
        {
            **_valid_payload(),
            "approval_record_ref": "/Users/lidises/private/approval.json",
            "exact_target_allowlist_ref": "bad target",
            "operator_confirmation": "please execute now",
            "safe_summary": "raw /home/hermes/path should be rejected",
        },
        store_path=tmp_path / "approval_record_drafts.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    errors = {(item["field"], item["code"]) for item in result["errors"]}
    assert ("approval_record_ref", "unsupported_ref_shape") in errors
    assert ("exact_target_allowlist_ref", "unsupported_ref_shape") in errors
    assert ("operator_confirmation", "unsupported_confirmation") in errors
    assert ("safe_summary", "invalid_safe_text") in errors
    rendered = repr(result)
    assert "/Users/lidises" not in rendered
    assert "/home/hermes" not in rendered
    assert "please execute" not in rendered


def test_manual_approval_recording_draft_readback_counts_and_duplicate_blocks(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_recording_draft,
        list_office_controlled_mutation_manual_approval_recording_drafts,
    )

    store_path = tmp_path / "approval_record_drafts.jsonl"
    first = append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=store_path)
    duplicate = append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=store_path)
    readback = list_office_controlled_mutation_manual_approval_recording_drafts(
        store_path=store_path,
        approval_record_ref="approval-office-dispatch-1",
    )

    assert first["stored"] is True
    assert duplicate == {"stored": False, "errors": [{"field": "approval_record_ref", "code": "duplicate_approval_record_ref"}], "dto": None}
    assert readback["mode"] == "stored_manual_approval_recording_drafts_readback"
    assert readback["draft_count"] == 1
    assert readback["latest_refs"] == {"approval_record_ref": "approval-office-dispatch-1", "idempotency_key": "idem-office-dispatch-1"}
    assert readback["capabilities"]["approval_record_draft_readback_enabled"] is True
    assert readback["capabilities"]["approval_recording_enabled"] is False
    assert readback["capabilities"]["dispatch_gate_open"] is False


def test_manual_approval_recording_draft_api_is_protected_and_writes_draft_only(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-approval-recording-draft"
    get_path = "/api/office/controlled-mutation/manual-approval-recording-draft-status?approval_record_ref=approval-office-dispatch-1"

    assert client.post(post_path, json=_valid_payload()).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=_valid_payload())
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["draft_status"] == "draft_only"
    assert body["dto"]["approval_record_written"] is False
    assert body["dto"]["dispatch_gate_open"] is False

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["draft_count"] == 1
    assert payload["latest_refs"]["approval_record_ref"] == "approval-office-dispatch-1"
    assert payload["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_approval_recording_draft_review_status_projects_promotion_readiness_without_real_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_recording_draft,
        build_office_controlled_mutation_manual_approval_recording_draft_review_status,
    )

    store_path = tmp_path / "approval_record_drafts.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=store_path)

    status = build_office_controlled_mutation_manual_approval_recording_draft_review_status(
        store_path=store_path,
        approval_record_ref="approval-office-dispatch-1",
        unsafe_examples={"raw_command": "python /Users/lidises/private.py", "unsafe_ref": "secret-like-value"},
    )

    assert status["mode"] == "manual_approval_recording_draft_review_status"
    assert status["manual_approval_recording_draft_review_complete"] is True
    assert status["review"]["draft_present"] is True
    assert status["review"]["draft_status"] == "draft_only"
    assert status["review"]["ready_for_manual_operator_review"] is True
    assert status["review"]["ready_for_real_approval_record_write"] is False
    assert status["execution_boundary"]["approval_record_written"] is False
    assert status["execution_boundary"]["dispatch_gate_open"] is False
    assert status["execution_boundary"]["runtime_command_executed"] is False
    assert status["execution_boundary"]["target_mutation_created"] is False
    assert status["capabilities"]["approval_record_draft_readback_enabled"] is True
    assert status["capabilities"]["approval_recording_enabled"] is False
    assert status["capabilities"]["real_dispatch_execution_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    rendered = repr(status)
    assert "/Users/lidises" not in rendered
    assert "secret-like-value" not in rendered
    assert "raw_command" not in rendered


def test_manual_approval_recording_draft_review_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_approval_recording_draft

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload())
    client = TestClient(web_server.app)
    path = "/api/office/controlled-mutation/manual-approval-recording-draft-review-status?approval_record_ref=approval-office-dispatch-1"

    assert client.get(path).status_code == 401
    response = client.get(path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})

    assert response.status_code == 200
    payload = response.json()
    assert payload["manual_approval_recording_draft_review_complete"] is True
    assert payload["review"]["draft_present"] is True
    assert payload["review"]["ready_for_real_approval_record_write"] is False
    assert payload["capabilities"]["approval_recording_enabled"] is False
    assert payload["capabilities"]["dispatch_gate_open"] is False
    assert payload["errors"] == []


def test_manual_approval_record_write_gate_promotes_existing_draft_without_dispatch(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_approval_record,
        list_office_controlled_mutation_manual_approval_records,
    )

    draft_store = tmp_path / "approval_record_drafts.jsonl"
    approval_store = tmp_path / "approval_records.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)

    result = append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:30:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1", "dryrun:dryrun-office-dispatch-1"],
            "raw_command": "python /home/hermes/private/run.py",
            "unsafe_ref": "secret-like-value",
        },
        draft_store_path=draft_store,
        store_path=approval_store,
    )
    readback = list_office_controlled_mutation_manual_approval_records(store_path=approval_store)

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_approval_record"
    assert dto["approval_status"] == "recorded_manual_approval"
    assert dto["source_draft_status"] == "draft_only"
    assert dto["approval_record_ref"] == "approval-office-dispatch-1"
    assert dto["approval_record_written"] is True
    assert dto["dispatch_gate_open"] is False
    assert dto["runtime_command_included"] is False
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["capabilities"]["approval_recording_enabled"] is True
    assert dto["capabilities"]["dispatch_gate_open"] is False
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    assert readback["approval_record_count"] == 1
    assert readback["latest_refs"]["approval_record_ref"] == "approval-office-dispatch-1"
    rendered = repr(result)
    assert "/home/hermes" not in rendered
    assert "secret-like-value" not in rendered
    assert "raw_command" not in rendered


def test_manual_approval_record_write_gate_requires_existing_draft_and_blocks_duplicates(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_approval_record,
    )

    draft_store = tmp_path / "approval_record_drafts.jsonl"
    approval_store = tmp_path / "approval_records.jsonl"
    missing = append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:30:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1"],
        },
        draft_store_path=draft_store,
        store_path=approval_store,
    )
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)
    first = append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:30:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1"],
        },
        draft_store_path=draft_store,
        store_path=approval_store,
    )
    duplicate = append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:31:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1"],
        },
        draft_store_path=draft_store,
        store_path=approval_store,
    )

    assert missing == {"stored": False, "errors": [{"field": "approval_record_ref", "code": "draft_not_found"}], "dto": None}
    assert first["stored"] is True
    assert duplicate == {"stored": False, "errors": [{"field": "approval_record_ref", "code": "duplicate_approval_record_ref"}], "dto": None}


def test_manual_approval_record_write_gate_api_is_protected_and_readback_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_approval_recording_draft

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload())
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-approval-record"
    get_path = "/api/office/controlled-mutation/manual-approval-record-status?approval_record_ref=approval-office-dispatch-1"
    body = {
        "approval_record_ref": "approval-office-dispatch-1",
        "operator_confirmation": "confirmed-real-approval-record-write-only",
        "approved_by": "actor:ai_office_operator",
        "approved_at": "2026-05-19T04:30:00Z",
        "approval_evidence_refs": ["approval:approval-office-dispatch-1"],
        "raw_command": "python /Users/lidises/private/run.py",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["approval_record_written"] is True
    assert payload["dto"]["dispatch_gate_open"] is False
    assert payload["dto"]["runtime_command_executed"] is False
    assert "/Users/lidises" not in repr(payload)
    assert "raw_command" not in repr(payload)

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["mode"] == "stored_manual_approval_records_readback"
    assert readback_body["approval_record_count"] == 1
    assert readback_body["capabilities"]["approval_recording_enabled"] is True
    assert readback_body["capabilities"]["dispatch_gate_open"] is False
    assert readback_body["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_approval_dispatch_gate_readiness_projects_closed_gate_from_approval_record(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
        build_office_controlled_mutation_manual_approval_dispatch_gate_readiness_status,
    )

    draft_store = tmp_path / "approval_record_drafts.jsonl"
    approval_store = tmp_path / "approval_records.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)
    append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:30:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1", "dryrun:dryrun-office-dispatch-1"],
            "raw_command": "unsafe-runtime-command-redacted",
        },
        draft_store_path=draft_store,
        store_path=approval_store,
    )

    status = build_office_controlled_mutation_manual_approval_dispatch_gate_readiness_status(
        approval_store_path=approval_store,
        approval_record_ref="approval-office-dispatch-1",
        unsafe_examples={"raw_command": "unsafe-runtime-command-redacted", "unsafe_ref": "secret-like-value"},
    )

    assert status["mode"] == "manual_approval_dispatch_gate_readiness_status"
    assert status["manual_approval_dispatch_gate_readiness_complete"] is True
    assert status["readiness"]["approval_record_present"] is True
    assert status["readiness"]["approval_record_written"] is True
    assert status["readiness"]["ready_for_dispatch_gate_open"] is False
    assert status["readiness"]["ready_for_runtime_dispatch_execution"] is False
    assert status["readiness"]["exact_target_allowlist_ref"] == "allowlist-office-target-1"
    assert status["readiness"]["idempotency_key"] == "idem-office-dispatch-1"
    assert status["readiness"]["rollback_disable_ref"] == "rollback-office-dispatch-1"
    assert status["execution_boundary"]["dispatch_gate_open"] is False
    assert status["execution_boundary"]["runtime_command_included"] is False
    assert status["execution_boundary"]["runtime_command_executed"] is False
    assert status["execution_boundary"]["target_mutation_created"] is False
    assert status["execution_boundary"]["kanban_mutation_created"] is False
    assert status["execution_boundary"]["nas_save_created"] is False
    assert status["capabilities"]["approval_recording_enabled"] is True
    assert status["capabilities"]["dispatch_gate_open"] is False
    assert status["capabilities"]["real_dispatch_execution_enabled"] is False
    rendered = repr(status)
    assert "/home/hermes" not in rendered
    assert "/Users/lidises" not in rendered
    assert "secret-like-value" not in rendered
    assert "raw_command" not in rendered


def test_manual_approval_dispatch_gate_readiness_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
    )

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload())
    append_office_controlled_mutation_manual_approval_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "operator_confirmation": "confirmed-real-approval-record-write-only",
            "approved_by": "actor:ai_office_operator",
            "approved_at": "2026-05-19T04:30:00Z",
            "approval_evidence_refs": ["approval:approval-office-dispatch-1"],
        }
    )
    client = TestClient(web_server.app)
    path = "/api/office/controlled-mutation/manual-approval-dispatch-gate-readiness-status?approval_record_ref=approval-office-dispatch-1"

    assert client.get(path).status_code == 401
    response = client.get(path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})

    assert response.status_code == 200
    payload = response.json()
    assert payload["manual_approval_dispatch_gate_readiness_complete"] is True
    assert payload["readiness"]["approval_record_present"] is True
    assert payload["readiness"]["ready_for_dispatch_gate_open"] is False
    assert payload["execution_boundary"]["dispatch_gate_open"] is False
    assert payload["execution_boundary"]["runtime_command_executed"] is False
    assert payload["capabilities"]["real_dispatch_execution_enabled"] is False
    assert payload["errors"] == []
