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
    assert "unsafe-runtime-command-redacted" not in repr(payload)
    assert "raw_command" not in payload["dto"]

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


def test_manual_dispatch_gate_open_record_writes_gate_metadata_without_runtime(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_dispatch_gate_open_record,
        list_office_controlled_mutation_manual_dispatch_gate_open_records,
    )

    draft_store = tmp_path / "approval_record_drafts.jsonl"
    approval_store = tmp_path / "approval_records.jsonl"
    gate_store = tmp_path / "dispatch_gate_open_records.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)
    append_office_controlled_mutation_manual_approval_record(
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

    result = append_office_controlled_mutation_manual_dispatch_gate_open_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "operator_confirmation": "confirmed-dispatch-gate-open-metadata-only",
            "opened_by": "actor:ai_office_operator",
            "opened_at": "2026-05-19T05:20:00Z",
            "gate_evidence_refs": ["approval:approval-office-dispatch-1", "readiness:approval-office-dispatch-1"],
            "raw_command": "unsafe-runtime-command-redacted",
        },
        approval_store_path=approval_store,
        store_path=gate_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_dispatch_gate_open_record"
    assert dto["dispatch_gate_ref"] == "gate-office-dispatch-1"
    assert dto["approval_record_ref"] == "approval-office-dispatch-1"
    assert dto["dispatch_gate_open"] is True
    assert dto["runtime_command_included"] is False
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "unsafe-runtime-command-redacted" not in repr(dto)
    assert "raw_command" not in dto

    readback = list_office_controlled_mutation_manual_dispatch_gate_open_records(store_path=gate_store)
    assert readback["mode"] == "stored_manual_dispatch_gate_open_records_readback"
    assert readback["dispatch_gate_open_record_count"] == 1
    assert readback["records"][0]["dispatch_gate_open"] is True
    assert readback["capabilities"]["dispatch_gate_open"] is True
    assert readback["capabilities"]["runtime_command_execution_enabled"] is False
    assert readback["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_dispatch_gate_open_record_api_is_protected_and_safe(monkeypatch, tmp_path):
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
    post_path = "/api/office/controlled-mutation/manual-dispatch-gate-open-record"
    get_path = "/api/office/controlled-mutation/manual-dispatch-gate-open-record-status?dispatch_gate_ref=gate-office-dispatch-1"
    body = {
        "approval_record_ref": "approval-office-dispatch-1",
        "dispatch_gate_ref": "gate-office-dispatch-1",
        "operator_confirmation": "confirmed-dispatch-gate-open-metadata-only",
        "opened_by": "actor:ai_office_operator",
        "opened_at": "2026-05-19T05:20:00Z",
        "gate_evidence_refs": ["approval:approval-office-dispatch-1", "readiness:approval-office-dispatch-1"],
        "raw_command": "unsafe-runtime-command-redacted",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["dispatch_gate_open"] is True
    assert payload["dto"]["runtime_command_included"] is False
    assert payload["dto"]["runtime_command_executed"] is False
    assert payload["dto"]["target_mutation_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "unsafe-runtime-command-redacted" not in repr(payload)
    assert "raw_command" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["mode"] == "stored_manual_dispatch_gate_open_records_readback"
    assert readback_body["dispatch_gate_open_record_count"] == 1
    assert readback_body["records"][0]["dispatch_gate_open"] is True
    assert readback_body["capabilities"]["dispatch_gate_open"] is True
    assert readback_body["capabilities"]["runtime_command_execution_enabled"] is False
    assert readback_body["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_runtime_command_preview_record_writes_checksum_only_without_execution(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_dispatch_gate_open_record,
        append_office_controlled_mutation_manual_runtime_command_preview_record,
        list_office_controlled_mutation_manual_runtime_command_preview_records,
    )

    controlled_mutation_store = tmp_path / "office" / "controlled-mutation"
    draft_store = controlled_mutation_store / "approval_record_drafts.jsonl"
    approval_store = controlled_mutation_store / "approval_records.jsonl"
    gate_store = controlled_mutation_store / "dispatch_gate_open_records.jsonl"
    preview_store = controlled_mutation_store / "runtime_command_preview_records.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)
    append_office_controlled_mutation_manual_approval_record(
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
    append_office_controlled_mutation_manual_dispatch_gate_open_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "operator_confirmation": "confirmed-dispatch-gate-open-metadata-only",
            "opened_by": "actor:ai_office_operator",
            "opened_at": "2026-05-19T05:20:00Z",
            "gate_evidence_refs": ["approval:approval-office-dispatch-1"],
        },
        approval_store_path=approval_store,
        store_path=gate_store,
    )

    result = append_office_controlled_mutation_manual_runtime_command_preview_record(
        {
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
            "command_envelope_ref": "envelope-office-dispatch-1",
            "command_intent_ref": "intent-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-preview-only",
            "materialized_by": "actor:ai_office_operator",
            "materialized_at": "2026-05-19T05:40:00Z",
            "preview_evidence_refs": ["gate:gate-office-dispatch-1"],
            "raw_command": "unsafe-runtime-command-redacted",
        },
        gate_store_path=gate_store,
        store_path=preview_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_runtime_command_preview_record"
    assert dto["dispatch_gate_ref"] == "gate-office-dispatch-1"
    assert dto["runtime_command_preview_ref"] == "cmdpreview-office-dispatch-1"
    assert dto["runtime_command_preview_created"] is True
    assert dto["runtime_command_included"] is False
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert len(dto["runtime_command_preview_checksum_sha256"]) == 64
    assert "unsafe-runtime-command-redacted" not in repr(dto)
    assert "raw_command" not in dto
    assert "unsafe-runtime-command" not in repr(dto)

    readback = list_office_controlled_mutation_manual_runtime_command_preview_records(store_path=preview_store)
    assert readback["mode"] == "stored_manual_runtime_command_preview_records_readback"
    assert readback["runtime_command_preview_record_count"] == 1
    assert readback["records"][0]["runtime_command_preview_created"] is True
    assert readback["capabilities"]["runtime_command_preview_enabled"] is True
    assert readback["capabilities"]["runtime_command_execution_enabled"] is False
    assert readback["capabilities"]["target_mutation_enabled"] is False


def _seed_runtime_command_preview_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_dispatch_gate_open_record,
        append_office_controlled_mutation_manual_runtime_command_preview_record,
    )

    controlled_mutation_store = tmp_path / "office" / "controlled-mutation"
    draft_store = controlled_mutation_store / "approval_record_drafts.jsonl"
    approval_store = controlled_mutation_store / "approval_records.jsonl"
    gate_store = controlled_mutation_store / "dispatch_gate_open_records.jsonl"
    preview_store = controlled_mutation_store / "runtime_command_preview_records.jsonl"
    append_office_controlled_mutation_manual_approval_recording_draft(_valid_payload(), store_path=draft_store)
    append_office_controlled_mutation_manual_approval_record(
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
    append_office_controlled_mutation_manual_dispatch_gate_open_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "operator_confirmation": "confirmed-dispatch-gate-open-metadata-only",
            "opened_by": "actor:ai_office_operator",
            "opened_at": "2026-05-19T05:20:00Z",
            "gate_evidence_refs": ["approval:approval-office-dispatch-1"],
        },
        approval_store_path=approval_store,
        store_path=gate_store,
    )
    append_office_controlled_mutation_manual_runtime_command_preview_record(
        {
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
            "command_envelope_ref": "envelope-office-dispatch-1",
            "command_intent_ref": "intent-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-preview-only",
            "materialized_by": "actor:ai_office_operator",
            "materialized_at": "2026-05-19T05:40:00Z",
            "preview_evidence_refs": ["gate:gate-office-dispatch-1"],
        },
        gate_store_path=gate_store,
        store_path=preview_store,
    )
    return preview_store


def test_manual_runtime_command_inclusion_record_writes_safe_body_without_execution(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_runtime_command_inclusion_record,
        list_office_controlled_mutation_manual_runtime_command_inclusion_records,
    )

    preview_store = _seed_runtime_command_preview_chain(tmp_path)
    inclusion_store = tmp_path / "runtime_command_inclusion_records.jsonl"
    result = append_office_controlled_mutation_manual_runtime_command_inclusion_record(
        {
            "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
            "runtime_command_ref": "cmd-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-inclusion-no-execute",
            "included_by": "actor:ai_office_operator",
            "included_at": "2026-05-19T06:00:00Z",
            "command_kind": "office_controlled_mutation_single_dispatch_noop_probe",
            "command_body": {
                "target_ref": "target-office-dispatch-1",
                "dry_run_evidence_ref": "dryrun-office-dispatch-1",
                "rollback_disable_ref": "rollback-office-dispatch-1",
            },
            "inclusion_evidence_refs": ["cmdpreview:cmdpreview-office-dispatch-1"],
            "shell_command": "python /home/hermes/private/run.py",
            "credential_value": "redacted-placeholder",
        },
        preview_store_path=preview_store,
        store_path=inclusion_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_runtime_command_inclusion_record"
    assert dto["runtime_command_included"] is True
    assert dto["runtime_command_executed"] is False
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert dto["command_body"]["target_ref"] == "target-office-dispatch-1"
    assert len(dto["runtime_command_body_checksum_sha256"]) == 64
    rendered = repr(dto)
    assert "/home/hermes" not in rendered
    assert "sk-test" not in rendered
    assert "shell_command" not in dto
    assert "credential_value" not in dto

    readback = list_office_controlled_mutation_manual_runtime_command_inclusion_records(store_path=inclusion_store)
    assert readback["mode"] == "stored_manual_runtime_command_inclusion_records_readback"
    assert readback["runtime_command_inclusion_record_count"] == 1
    assert readback["records"][0]["runtime_command_ref"] == "cmd-office-dispatch-1"
    assert readback["records"][0]["runtime_command_included"] is True
    assert readback["capabilities"]["runtime_command_inclusion_record_storage_enabled"] is True
    assert readback["capabilities"]["runtime_command_execution_enabled"] is False


def test_manual_runtime_command_inclusion_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_runtime_command_preview_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-runtime-command-inclusion-record"
    get_path = "/api/office/controlled-mutation/manual-runtime-command-inclusion-record-status?runtime_command_ref=cmd-office-dispatch-1"
    body = {
        "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
        "runtime_command_ref": "cmd-office-dispatch-1",
        "operator_confirmation": "confirmed-runtime-command-inclusion-no-execute",
        "included_by": "actor:ai_office_operator",
        "included_at": "2026-05-19T06:00:00Z",
        "command_kind": "office_controlled_mutation_single_dispatch_noop_probe",
        "command_body": {
            "target_ref": "target-office-dispatch-1",
            "dry_run_evidence_ref": "dryrun-office-dispatch-1",
            "rollback_disable_ref": "rollback-office-dispatch-1",
        },
        "inclusion_evidence_refs": ["cmdpreview:cmdpreview-office-dispatch-1"],
        "shell_command": "python /home/hermes/private/run.py",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["runtime_command_included"] is True
    assert payload["dto"]["runtime_command_executed"] is False
    assert payload["dto"]["target_mutation_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "/home/hermes" not in repr(payload)
    assert "shell_command" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["runtime_command_inclusion_record_count"] == 1
    assert readback_body["records"][0]["runtime_command_ref"] == "cmd-office-dispatch-1"
    assert readback_body["records"][0]["runtime_command_executed"] is False
    assert readback_body["capabilities"]["runtime_command_included"] is True
    assert readback_body["capabilities"]["runtime_command_execution_enabled"] is False


def _seed_runtime_command_inclusion_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_runtime_command_inclusion_record

    preview_store = _seed_runtime_command_preview_chain(tmp_path)
    inclusion_store = tmp_path / "office" / "controlled-mutation" / "runtime_command_inclusion_records.jsonl"
    append_office_controlled_mutation_manual_runtime_command_inclusion_record(
        {
            "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
            "runtime_command_ref": "cmd-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-inclusion-no-execute",
            "included_by": "actor:ai_office_operator",
            "included_at": "2026-05-19T06:00:00Z",
            "command_kind": "office_controlled_mutation_single_dispatch_noop_probe",
            "command_body": {
                "target_ref": "target-office-dispatch-1",
                "dry_run_evidence_ref": "dryrun-office-dispatch-1",
                "rollback_disable_ref": "rollback-office-dispatch-1",
            },
            "inclusion_evidence_refs": ["cmdpreview:cmdpreview-office-dispatch-1"],
        },
        preview_store_path=preview_store,
        store_path=inclusion_store,
    )
    return inclusion_store


def test_manual_runtime_command_execution_record_executes_noop_and_writes_replay_without_target_mutation(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_runtime_command_execution_record,
        list_office_controlled_mutation_manual_runtime_command_execution_records,
    )

    inclusion_store = _seed_runtime_command_inclusion_chain(tmp_path)
    execution_store = tmp_path / "runtime_command_execution_records.jsonl"
    result = append_office_controlled_mutation_manual_runtime_command_execution_record(
        {
            "runtime_command_ref": "cmd-office-dispatch-1",
            "runtime_execution_ref": "exec-office-dispatch-1",
            "idempotency_key": "idem-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-execute-noop-probe-only",
            "executed_by": "actor:ai_office_operator",
            "executed_at": "2026-05-19T06:20:00Z",
            "execution_evidence_refs": ["cmd:cmd-office-dispatch-1"],
            "shell_command": "python private-runtime.py",
        },
        inclusion_store_path=inclusion_store,
        store_path=execution_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_runtime_command_execution_record"
    assert dto["runtime_command_executed"] is True
    assert dto["runtime_execution_result"] == "noop_probe_succeeded"
    assert dto["idempotency_replay_store_written"] is True
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["adapter_dispatch_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "shell_command" not in dto
    assert "private-runtime" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_runtime_command_execution_record(
        {
            "runtime_command_ref": "cmd-office-dispatch-1",
            "runtime_execution_ref": "exec-office-dispatch-2",
            "idempotency_key": "idem-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-execute-noop-probe-only",
            "executed_by": "actor:ai_office_operator",
            "executed_at": "2026-05-19T06:21:00Z",
            "execution_evidence_refs": ["cmd:cmd-office-dispatch-1"],
        },
        inclusion_store_path=inclusion_store,
        store_path=execution_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "idempotency_key", "code": "duplicate_idempotency_key"}]

    readback = list_office_controlled_mutation_manual_runtime_command_execution_records(store_path=execution_store)
    assert readback["mode"] == "stored_manual_runtime_command_execution_records_readback"
    assert readback["runtime_command_execution_record_count"] == 1
    assert readback["records"][0]["runtime_command_executed"] is True
    assert readback["capabilities"]["runtime_command_execution_enabled"] is True
    assert readback["capabilities"]["target_mutation_enabled"] is False


def test_manual_runtime_command_execution_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_runtime_command_inclusion_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-runtime-command-execution-record"
    get_path = "/api/office/controlled-mutation/manual-runtime-command-execution-record-status?runtime_execution_ref=exec-office-dispatch-1"
    body = {
        "runtime_command_ref": "cmd-office-dispatch-1",
        "runtime_execution_ref": "exec-office-dispatch-1",
        "idempotency_key": "idem-office-dispatch-1",
        "operator_confirmation": "confirmed-runtime-command-execute-noop-probe-only",
        "executed_by": "actor:ai_office_operator",
        "executed_at": "2026-05-19T06:20:00Z",
        "execution_evidence_refs": ["cmd:cmd-office-dispatch-1"],
        "shell_command": "python private-runtime.py",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["runtime_command_executed"] is True
    assert payload["dto"]["idempotency_replay_store_written"] is True
    assert payload["dto"]["target_mutation_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "private-runtime" not in repr(payload)
    assert "shell_command" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["runtime_command_execution_record_count"] == 1
    assert readback_body["records"][0]["runtime_execution_ref"] == "exec-office-dispatch-1"
    assert readback_body["capabilities"]["runtime_command_execution_enabled"] is True
    assert readback_body["capabilities"]["target_mutation_enabled"] is False


def _seed_runtime_command_execution_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_runtime_command_execution_record

    inclusion_store = _seed_runtime_command_inclusion_chain(tmp_path)
    execution_store = tmp_path / "office" / "controlled-mutation" / "runtime_command_execution_records.jsonl"
    append_office_controlled_mutation_manual_runtime_command_execution_record(
        {
            "runtime_command_ref": "cmd-office-dispatch-1",
            "runtime_execution_ref": "exec-office-dispatch-1",
            "idempotency_key": "idem-office-dispatch-1",
            "operator_confirmation": "confirmed-runtime-command-execute-noop-probe-only",
            "executed_by": "actor:ai_office_operator",
            "executed_at": "2026-05-19T06:20:00Z",
            "execution_evidence_refs": ["cmd:cmd-office-dispatch-1"],
        },
        inclusion_store_path=inclusion_store,
        store_path=execution_store,
    )
    return execution_store


def test_manual_target_mutation_readiness_record_verifies_exact_target_without_mutation(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_target_mutation_readiness_record,
        list_office_controlled_mutation_manual_target_mutation_readiness_records,
    )

    execution_store = _seed_runtime_command_execution_chain(tmp_path)
    readiness_store = tmp_path / "target_mutation_readiness_records.jsonl"
    result = append_office_controlled_mutation_manual_target_mutation_readiness_record(
        {
            "runtime_execution_ref": "exec-office-dispatch-1",
            "target_mutation_readiness_ref": "targetready-office-dispatch-1",
            "exact_target_allowlist_ref": "allowlist-office-target-1",
            "target_ref": "target-office-dispatch-1",
            "dry_run_evidence_ref": "dryrun-office-dispatch-1",
            "rollback_disable_ref": "rollback-office-dispatch-1",
            "operator_confirmation": "confirmed-target-mutation-readiness-no-mutate",
            "verified_by": "actor:ai_office_operator",
            "verified_at": "2026-05-19T06:40:00Z",
            "readiness_evidence_refs": ["exec:exec-office-dispatch-1"],
            "raw_target_path": "/home/hermes/private-target",
        },
        execution_store_path=execution_store,
        store_path=readiness_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_target_mutation_readiness_record"
    assert dto["target_mutation_readiness_verified"] is True
    assert dto["exact_target_allowlist_verified"] is True
    assert dto["runtime_command_executed"] is True
    assert dto["target_mutation_created"] is False
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["adapter_dispatch_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "raw_target_path" not in dto
    assert "private-target" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_target_mutation_readiness_record(
        {
            "runtime_execution_ref": "exec-office-dispatch-1",
            "target_mutation_readiness_ref": "targetready-office-dispatch-2",
            "exact_target_allowlist_ref": "allowlist-office-target-1",
            "target_ref": "target-office-dispatch-1",
            "dry_run_evidence_ref": "dryrun-office-dispatch-1",
            "rollback_disable_ref": "rollback-office-dispatch-1",
            "operator_confirmation": "confirmed-target-mutation-readiness-no-mutate",
            "verified_by": "actor:ai_office_operator",
            "verified_at": "2026-05-19T06:41:00Z",
            "readiness_evidence_refs": ["exec:exec-office-dispatch-1"],
        },
        execution_store_path=execution_store,
        store_path=readiness_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "runtime_execution_ref", "code": "duplicate_runtime_execution_ref"}]

    readback = list_office_controlled_mutation_manual_target_mutation_readiness_records(store_path=readiness_store)
    assert readback["mode"] == "stored_manual_target_mutation_readiness_records_readback"
    assert readback["target_mutation_readiness_record_count"] == 1
    assert readback["records"][0]["target_mutation_readiness_verified"] is True
    assert readback["capabilities"]["target_mutation_readiness_enabled"] is True
    assert readback["capabilities"]["target_mutation_enabled"] is False


def test_manual_target_mutation_readiness_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_runtime_command_execution_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-target-mutation-readiness-record"
    get_path = "/api/office/controlled-mutation/manual-target-mutation-readiness-record-status?target_mutation_readiness_ref=targetready-office-dispatch-1"
    body = {
        "runtime_execution_ref": "exec-office-dispatch-1",
        "target_mutation_readiness_ref": "targetready-office-dispatch-1",
        "exact_target_allowlist_ref": "allowlist-office-target-1",
        "target_ref": "target-office-dispatch-1",
        "dry_run_evidence_ref": "dryrun-office-dispatch-1",
        "rollback_disable_ref": "rollback-office-dispatch-1",
        "operator_confirmation": "confirmed-target-mutation-readiness-no-mutate",
        "verified_by": "actor:ai_office_operator",
        "verified_at": "2026-05-19T06:40:00Z",
        "readiness_evidence_refs": ["exec:exec-office-dispatch-1"],
        "raw_target_path": "/home/hermes/private-target",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["target_mutation_readiness_verified"] is True
    assert payload["dto"]["target_mutation_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "private-target" not in repr(payload)
    assert "raw_target_path" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["target_mutation_readiness_record_count"] == 1
    assert readback_body["records"][0]["target_mutation_readiness_ref"] == "targetready-office-dispatch-1"
    assert readback_body["capabilities"]["target_mutation_readiness_enabled"] is True
    assert readback_body["capabilities"]["target_mutation_enabled"] is False


def _seed_target_mutation_readiness_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_target_mutation_readiness_record

    execution_store = _seed_runtime_command_execution_chain(tmp_path)
    readiness_store = tmp_path / "office" / "controlled-mutation" / "target_mutation_readiness_records.jsonl"
    append_office_controlled_mutation_manual_target_mutation_readiness_record(
        {
            "runtime_execution_ref": "exec-office-dispatch-1",
            "target_mutation_readiness_ref": "targetready-office-dispatch-1",
            "exact_target_allowlist_ref": "allowlist-office-target-1",
            "target_ref": "target-office-dispatch-1",
            "dry_run_evidence_ref": "dryrun-office-dispatch-1",
            "rollback_disable_ref": "rollback-office-dispatch-1",
            "operator_confirmation": "confirmed-target-mutation-readiness-no-mutate",
            "verified_by": "actor:ai_office_operator",
            "verified_at": "2026-05-19T06:40:00Z",
            "readiness_evidence_refs": ["exec:exec-office-dispatch-1"],
        },
        execution_store_path=execution_store,
        store_path=readiness_store,
    )
    return readiness_store


def test_manual_target_mutation_record_creates_exact_target_without_kanban_or_nas(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_target_mutation_record,
        list_office_controlled_mutation_manual_target_mutation_records,
    )

    readiness_store = _seed_target_mutation_readiness_chain(tmp_path)
    mutation_store = tmp_path / "target_mutation_records.jsonl"
    result = append_office_controlled_mutation_manual_target_mutation_record(
        {
            "target_mutation_readiness_ref": "targetready-office-dispatch-1",
            "target_mutation_ref": "targetmut-office-dispatch-1",
            "operator_confirmation": "confirmed-target-mutation-write-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:00:00Z",
            "mutation_evidence_refs": ["targetready:targetready-office-dispatch-1"],
            "raw_target_path": "/home/hermes/private-target",
        },
        readiness_store_path=readiness_store,
        store_path=mutation_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_target_mutation_record"
    assert dto["target_mutation_created"] is True
    assert dto["target_mutation_result"] == "safe_target_marker_written"
    assert dto["target_mutation_readiness_verified"] is True
    assert dto["exact_target_allowlist_verified"] is True
    assert dto["runtime_command_executed"] is True
    assert dto["idempotency_replay_store_written"] is True
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["adapter_dispatch_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "raw_target_path" not in dto
    assert "private-target" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_target_mutation_record(
        {
            "target_mutation_readiness_ref": "targetready-office-dispatch-1",
            "target_mutation_ref": "targetmut-office-dispatch-2",
            "operator_confirmation": "confirmed-target-mutation-write-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:01:00Z",
            "mutation_evidence_refs": ["targetready:targetready-office-dispatch-1"],
        },
        readiness_store_path=readiness_store,
        store_path=mutation_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "target_mutation_readiness_ref", "code": "duplicate_target_mutation_readiness_ref"}]

    readback = list_office_controlled_mutation_manual_target_mutation_records(store_path=mutation_store)
    assert readback["mode"] == "stored_manual_target_mutation_records_readback"
    assert readback["target_mutation_record_count"] == 1
    assert readback["records"][0]["target_mutation_created"] is True
    assert readback["capabilities"]["target_mutation_enabled"] is True
    assert readback["capabilities"]["kanban_mutation_enabled"] is False
    assert readback["capabilities"]["nas_write_enabled"] is False


def test_manual_target_mutation_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_target_mutation_readiness_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-target-mutation-record"
    get_path = "/api/office/controlled-mutation/manual-target-mutation-record-status?target_mutation_ref=targetmut-office-dispatch-1"
    body = {
        "target_mutation_readiness_ref": "targetready-office-dispatch-1",
        "target_mutation_ref": "targetmut-office-dispatch-1",
        "operator_confirmation": "confirmed-target-mutation-write-only",
        "mutated_by": "actor:ai_office_operator",
        "mutated_at": "2026-05-19T07:00:00Z",
        "mutation_evidence_refs": ["targetready:targetready-office-dispatch-1"],
        "raw_target_path": "/home/hermes/private-target",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["target_mutation_created"] is True
    assert payload["dto"]["kanban_mutation_created"] is False
    assert payload["dto"]["nas_save_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "private-target" not in repr(payload)
    assert "raw_target_path" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["target_mutation_record_count"] == 1
    assert readback_body["records"][0]["target_mutation_ref"] == "targetmut-office-dispatch-1"
    assert readback_body["capabilities"]["target_mutation_enabled"] is True
    assert readback_body["capabilities"]["kanban_mutation_enabled"] is False
    assert readback_body["capabilities"]["nas_write_enabled"] is False


def _seed_target_mutation_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_target_mutation_record

    readiness_store = _seed_target_mutation_readiness_chain(tmp_path)
    mutation_store = tmp_path / "office" / "controlled-mutation" / "target_mutation_records.jsonl"
    append_office_controlled_mutation_manual_target_mutation_record(
        {
            "target_mutation_readiness_ref": "targetready-office-dispatch-1",
            "target_mutation_ref": "targetmut-office-dispatch-1",
            "operator_confirmation": "confirmed-target-mutation-write-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:00:00Z",
            "mutation_evidence_refs": ["targetready:targetready-office-dispatch-1"],
        },
        readiness_store_path=readiness_store,
        store_path=mutation_store,
    )
    return mutation_store


def test_manual_adapter_dispatch_record_dispatches_adapter_without_kanban_or_nas(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_adapter_dispatch_record,
        list_office_controlled_mutation_manual_adapter_dispatch_records,
    )

    target_mutation_store = _seed_target_mutation_chain(tmp_path)
    adapter_store = tmp_path / "adapter_dispatch_records.jsonl"
    result = append_office_controlled_mutation_manual_adapter_dispatch_record(
        {
            "target_mutation_ref": "targetmut-office-dispatch-1",
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
            "adapter_ref": "adapter-office-dispatch-1",
            "operator_confirmation": "confirmed-adapter-dispatch-record-only",
            "dispatched_by": "actor:ai_office_operator",
            "dispatched_at": "2026-05-19T07:20:00Z",
            "dispatch_evidence_refs": ["targetmut:targetmut-office-dispatch-1"],
            "provider": "private-provider-redacted",
        },
        target_mutation_store_path=target_mutation_store,
        store_path=adapter_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_adapter_dispatch_record"
    assert dto["target_mutation_created"] is True
    assert dto["adapter_dispatch_created"] is True
    assert dto["adapter_dispatch_result"] == "safe_adapter_dispatch_marker_written"
    assert dto["kanban_mutation_created"] is False
    assert dto["nas_save_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "provider" not in dto
    assert "private-provider" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_adapter_dispatch_record(
        {
            "target_mutation_ref": "targetmut-office-dispatch-1",
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-2",
            "adapter_ref": "adapter-office-dispatch-1",
            "operator_confirmation": "confirmed-adapter-dispatch-record-only",
            "dispatched_by": "actor:ai_office_operator",
            "dispatched_at": "2026-05-19T07:21:00Z",
            "dispatch_evidence_refs": ["targetmut:targetmut-office-dispatch-1"],
        },
        target_mutation_store_path=target_mutation_store,
        store_path=adapter_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "target_mutation_ref", "code": "duplicate_target_mutation_ref"}]

    readback = list_office_controlled_mutation_manual_adapter_dispatch_records(store_path=adapter_store)
    assert readback["mode"] == "stored_manual_adapter_dispatch_records_readback"
    assert readback["adapter_dispatch_record_count"] == 1
    assert readback["records"][0]["adapter_dispatch_created"] is True
    assert readback["capabilities"]["adapter_dispatch_enabled"] is True
    assert readback["capabilities"]["kanban_mutation_enabled"] is False
    assert readback["capabilities"]["nas_write_enabled"] is False


def test_manual_adapter_dispatch_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_target_mutation_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-adapter-dispatch-record"
    get_path = "/api/office/controlled-mutation/manual-adapter-dispatch-record-status?adapter_dispatch_ref=adapterdispatch-office-dispatch-1"
    body = {
        "target_mutation_ref": "targetmut-office-dispatch-1",
        "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
        "adapter_ref": "adapter-office-dispatch-1",
        "operator_confirmation": "confirmed-adapter-dispatch-record-only",
        "dispatched_by": "actor:ai_office_operator",
        "dispatched_at": "2026-05-19T07:20:00Z",
        "dispatch_evidence_refs": ["targetmut:targetmut-office-dispatch-1"],
        "provider": "private-provider-redacted",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["adapter_dispatch_created"] is True
    assert payload["dto"]["kanban_mutation_created"] is False
    assert payload["dto"]["nas_save_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "private-provider" not in repr(payload)
    assert "provider" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["adapter_dispatch_record_count"] == 1
    assert readback_body["records"][0]["adapter_dispatch_ref"] == "adapterdispatch-office-dispatch-1"
    assert readback_body["capabilities"]["adapter_dispatch_enabled"] is True
    assert readback_body["capabilities"]["kanban_mutation_enabled"] is False
    assert readback_body["capabilities"]["nas_write_enabled"] is False


def _seed_adapter_dispatch_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_adapter_dispatch_record

    target_mutation_store = _seed_target_mutation_chain(tmp_path)
    adapter_store = tmp_path / "office" / "controlled-mutation" / "adapter_dispatch_records.jsonl"
    append_office_controlled_mutation_manual_adapter_dispatch_record(
        {
            "target_mutation_ref": "targetmut-office-dispatch-1",
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
            "adapter_ref": "adapter-office-dispatch-1",
            "operator_confirmation": "confirmed-adapter-dispatch-record-only",
            "dispatched_by": "actor:ai_office_operator",
            "dispatched_at": "2026-05-19T07:20:00Z",
            "dispatch_evidence_refs": ["targetmut:targetmut-office-dispatch-1"],
        },
        target_mutation_store_path=target_mutation_store,
        store_path=adapter_store,
    )
    return adapter_store


def test_manual_kanban_mutation_record_mutates_kanban_without_nas_or_real_dispatch(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_kanban_mutation_record,
        list_office_controlled_mutation_manual_kanban_mutation_records,
    )

    adapter_store = _seed_adapter_dispatch_chain(tmp_path)
    kanban_store = tmp_path / "kanban_mutation_records.jsonl"
    result = append_office_controlled_mutation_manual_kanban_mutation_record(
        {
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
            "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
            "kanban_card_ref": "card-office-dispatch-1",
            "operator_confirmation": "confirmed-kanban-mutation-record-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:40:00Z",
            "mutation_evidence_refs": ["adapterdispatch:adapterdispatch-office-dispatch-1"],
            "raw_card_body": "secret provider sk-test-redacted",
        },
        adapter_dispatch_store_path=adapter_store,
        store_path=kanban_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_kanban_mutation_record"
    assert dto["adapter_dispatch_created"] is True
    assert dto["kanban_mutation_created"] is True
    assert dto["kanban_mutation_result"] == "safe_kanban_marker_written"
    assert dto["nas_save_created"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "raw_card_body" not in dto
    assert "sk-test" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_kanban_mutation_record(
        {
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
            "kanban_mutation_ref": "kanbanmut-office-dispatch-2",
            "kanban_card_ref": "card-office-dispatch-1",
            "operator_confirmation": "confirmed-kanban-mutation-record-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:41:00Z",
            "mutation_evidence_refs": ["adapterdispatch:adapterdispatch-office-dispatch-1"],
        },
        adapter_dispatch_store_path=adapter_store,
        store_path=kanban_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "adapter_dispatch_ref", "code": "duplicate_adapter_dispatch_ref"}]

    readback = list_office_controlled_mutation_manual_kanban_mutation_records(store_path=kanban_store)
    assert readback["mode"] == "stored_manual_kanban_mutation_records_readback"
    assert readback["kanban_mutation_record_count"] == 1
    assert readback["records"][0]["kanban_mutation_created"] is True
    assert readback["capabilities"]["kanban_mutation_enabled"] is True
    assert readback["capabilities"]["nas_write_enabled"] is False
    assert readback["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_kanban_mutation_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_adapter_dispatch_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-kanban-mutation-record"
    get_path = "/api/office/controlled-mutation/manual-kanban-mutation-record-status?kanban_mutation_ref=kanbanmut-office-dispatch-1"
    body = {
        "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
        "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
        "kanban_card_ref": "card-office-dispatch-1",
        "operator_confirmation": "confirmed-kanban-mutation-record-only",
        "mutated_by": "actor:ai_office_operator",
        "mutated_at": "2026-05-19T07:40:00Z",
        "mutation_evidence_refs": ["adapterdispatch:adapterdispatch-office-dispatch-1"],
        "raw_card_body": "secret provider sk-test-redacted",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["kanban_mutation_created"] is True
    assert payload["dto"]["nas_save_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "sk-test" not in repr(payload)
    assert "raw_card_body" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["kanban_mutation_record_count"] == 1
    assert readback_body["records"][0]["kanban_mutation_ref"] == "kanbanmut-office-dispatch-1"
    assert readback_body["capabilities"]["kanban_mutation_enabled"] is True
    assert readback_body["capabilities"]["nas_write_enabled"] is False


def _seed_kanban_mutation_chain(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_manual_kanban_mutation_record

    adapter_store = _seed_adapter_dispatch_chain(tmp_path)
    kanban_store = tmp_path / "office" / "controlled-mutation" / "kanban_mutation_records.jsonl"
    append_office_controlled_mutation_manual_kanban_mutation_record(
        {
            "adapter_dispatch_ref": "adapterdispatch-office-dispatch-1",
            "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
            "kanban_card_ref": "card-office-dispatch-1",
            "operator_confirmation": "confirmed-kanban-mutation-record-only",
            "mutated_by": "actor:ai_office_operator",
            "mutated_at": "2026-05-19T07:40:00Z",
            "mutation_evidence_refs": ["adapterdispatch:adapterdispatch-office-dispatch-1"],
        },
        adapter_dispatch_store_path=adapter_store,
        store_path=kanban_store,
    )
    return kanban_store


def test_manual_nas_save_record_saves_nas_marker_without_real_dispatch_or_vps_authority(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_nas_save_record,
        list_office_controlled_mutation_manual_nas_save_records,
    )

    kanban_store = _seed_kanban_mutation_chain(tmp_path)
    nas_store = tmp_path / "nas_save_records.jsonl"
    result = append_office_controlled_mutation_manual_nas_save_record(
        {
            "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
            "nas_save_ref": "nassave-office-dispatch-1",
            "nas_note_ref": "nasnote-office-dispatch-1",
            "operator_confirmation": "confirmed-nas-save-record-only",
            "saved_by": "actor:ai_office_operator",
            "saved_at": "2026-05-19T08:00:00Z",
            "save_evidence_refs": ["kanbanmut:kanbanmut-office-dispatch-1"],
            "raw_markdown_body": "secret provider sk-test should not leak",
            "raw_nas_path": "/Users/lidises/private/nas/path.md",
        },
        kanban_mutation_store_path=kanban_store,
        store_path=nas_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "stored_manual_nas_save_record"
    assert dto["kanban_mutation_created"] is True
    assert dto["nas_save_created"] is True
    assert dto["nas_save_result"] == "safe_nas_save_marker_written"
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["real_nas_execution_enabled"] is False
    assert dto["real_dispatch_execution_enabled"] is False
    assert "raw_markdown_body" not in dto
    assert "raw_nas_path" not in dto
    assert "sk-test" not in repr(dto)
    assert "/Users/lidises" not in repr(dto)

    duplicate = append_office_controlled_mutation_manual_nas_save_record(
        {
            "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
            "nas_save_ref": "nassave-office-dispatch-2",
            "nas_note_ref": "nasnote-office-dispatch-1",
            "operator_confirmation": "confirmed-nas-save-record-only",
            "saved_by": "actor:ai_office_operator",
            "saved_at": "2026-05-19T08:01:00Z",
            "save_evidence_refs": ["kanbanmut:kanbanmut-office-dispatch-1"],
        },
        kanban_mutation_store_path=kanban_store,
        store_path=nas_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["errors"] == [{"field": "kanban_mutation_ref", "code": "duplicate_kanban_mutation_ref"}]

    readback = list_office_controlled_mutation_manual_nas_save_records(store_path=nas_store)
    assert readback["mode"] == "stored_manual_nas_save_records_readback"
    assert readback["nas_save_record_count"] == 1
    assert readback["records"][0]["nas_save_created"] is True
    assert readback["capabilities"]["nas_write_enabled"] is True
    assert readback["capabilities"]["vps_direct_nas_authority_enabled"] is False
    assert readback["capabilities"]["real_nas_execution_enabled"] is False
    assert readback["capabilities"]["real_dispatch_execution_enabled"] is False


def test_manual_nas_save_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    _seed_kanban_mutation_chain(tmp_path)
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-nas-save-record"
    get_path = "/api/office/controlled-mutation/manual-nas-save-record-status?nas_save_ref=nassave-office-dispatch-1"
    body = {
        "kanban_mutation_ref": "kanbanmut-office-dispatch-1",
        "nas_save_ref": "nassave-office-dispatch-1",
        "nas_note_ref": "nasnote-office-dispatch-1",
        "operator_confirmation": "confirmed-nas-save-record-only",
        "saved_by": "actor:ai_office_operator",
        "saved_at": "2026-05-19T08:00:00Z",
        "save_evidence_refs": ["kanbanmut:kanbanmut-office-dispatch-1"],
        "raw_markdown_body": "secret provider sk-test should not leak",
        "raw_nas_path": "/Users/lidises/private/nas/path.md",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["nas_save_created"] is True
    assert payload["dto"]["kanban_mutation_created"] is True
    assert payload["dto"]["vps_direct_nas_authority_enabled"] is False
    assert payload["dto"]["real_nas_execution_enabled"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "sk-test" not in repr(payload)
    assert "/Users/lidises" not in repr(payload)
    assert "raw_markdown_body" not in payload["dto"]
    assert "raw_nas_path" not in payload["dto"]

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["nas_save_record_count"] == 1
    assert readback_body["records"][0]["nas_save_ref"] == "nassave-office-dispatch-1"
    assert readback_body["capabilities"]["nas_write_enabled"] is True
    assert readback_body["capabilities"]["vps_direct_nas_authority_enabled"] is False
    assert readback_body["capabilities"]["real_nas_execution_enabled"] is False


def test_manual_runtime_command_preview_record_api_is_protected_and_safe(monkeypatch, tmp_path):
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_manual_approval_record,
        append_office_controlled_mutation_manual_approval_recording_draft,
        append_office_controlled_mutation_manual_dispatch_gate_open_record,
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
    append_office_controlled_mutation_manual_dispatch_gate_open_record(
        {
            "approval_record_ref": "approval-office-dispatch-1",
            "dispatch_gate_ref": "gate-office-dispatch-1",
            "operator_confirmation": "confirmed-dispatch-gate-open-metadata-only",
            "opened_by": "actor:ai_office_operator",
            "opened_at": "2026-05-19T05:20:00Z",
            "gate_evidence_refs": ["approval:approval-office-dispatch-1"],
        }
    )
    client = TestClient(web_server.app)
    post_path = "/api/office/controlled-mutation/manual-runtime-command-preview-record"
    get_path = "/api/office/controlled-mutation/manual-runtime-command-preview-record-status?runtime_command_preview_ref=cmdpreview-office-dispatch-1"
    body = {
        "dispatch_gate_ref": "gate-office-dispatch-1",
        "runtime_command_preview_ref": "cmdpreview-office-dispatch-1",
        "command_envelope_ref": "envelope-office-dispatch-1",
        "command_intent_ref": "intent-office-dispatch-1",
        "operator_confirmation": "confirmed-runtime-command-preview-only",
        "materialized_by": "actor:ai_office_operator",
        "materialized_at": "2026-05-19T05:40:00Z",
        "preview_evidence_refs": ["gate:gate-office-dispatch-1"],
        "raw_command": "unsafe-runtime-command-redacted",
    }

    assert client.post(post_path, json=body).status_code == 401
    assert client.get(get_path).status_code == 401

    stored = client.post(post_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN}, json=body)
    assert stored.status_code == 200
    payload = stored.json()
    assert payload["stored"] is True
    assert payload["dto"]["runtime_command_preview_created"] is True
    assert payload["dto"]["runtime_command_included"] is False
    assert payload["dto"]["runtime_command_executed"] is False
    assert payload["dto"]["target_mutation_created"] is False
    assert payload["dto"]["real_dispatch_execution_enabled"] is False
    assert "unsafe-runtime-command-redacted" not in repr(payload)
    assert "raw_command" not in payload["dto"]
    assert "unsafe-runtime-command" not in repr(payload)

    readback = client.get(get_path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["mode"] == "stored_manual_runtime_command_preview_records_readback"
    assert readback_body["runtime_command_preview_record_count"] == 1
    assert readback_body["records"][0]["runtime_command_preview_created"] is True
    assert readback_body["capabilities"]["runtime_command_execution_enabled"] is False
    assert readback_body["capabilities"]["real_dispatch_execution_enabled"] is False
