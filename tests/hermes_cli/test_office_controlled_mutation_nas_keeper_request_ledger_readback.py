"""Tests for sanitized operator request-builder ledger readback."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def builder_payload(stamp: str = "20260521233000", *, approve: bool = True) -> dict[str, object]:
    return {
        "operator_intent_ref": f"intent_ledger_{stamp}",
        "target_vault_ref": "Hermes",
        "safe_slug_base": "ledger-readback",
        "safe_title": "Ledger readback safe title",
        "markdown_body": "Ledger readback safe body with refs only.\n",
        "requested_by": "agent_orchestrator",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "approve_actual_write": approve,
    }


def test_request_builder_ledger_lists_sanitized_outcomes_and_ordering(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback,
    )

    root = tmp_path / "nas-root"
    queue = tmp_path / "queue"
    root.mkdir()
    queue.mkdir()

    built = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        builder_payload(),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T14:30:00Z",
        nonce="abc12345",
    )
    assert built["built"] is True
    assert built["written"] is True

    ledger = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(queue_dir=queue)

    assert ledger["found"] is True
    assert ledger["errors"] == []
    dto = ledger["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_readback"
    assert dto["count"] == 1
    assert dto["dry_review_before_write_verified"] is True
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["repeat_execution_replay_allowed"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False

    item = dto["items"][0]
    assert item["operator_request_outcome"] == "written"
    assert item["handoff_ref"] == "handoff_ledger_readback_20260521143000_abc12345"
    assert item["authorization_ref"] == "authz_ledger_readback_20260521143000_abc12345"
    assert item["relay_execution_ref"] == "relay_exec_ledger_readback_20260521143000_abc12345"
    assert item["execution_record_ref"] == "exec_record_ledger_readback_20260521143000_abc12345"
    assert item["dry_reviewed_at"] == "2026-05-21T14:30:00Z"
    assert item["dry_review_before_write_verified"] is True
    assert len(item["markdown_body_sha256"]) == 64
    assert item["readback_verified"] is True
    encoded = json.dumps(ledger, ensure_ascii=False)
    assert "Ledger readback safe body" not in encoded
    assert str(root) not in encoded
    assert "markdown_body" not in item


def test_request_builder_ledger_is_empty_safe_readback_when_no_records(tmp_path):
    from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(queue_dir=tmp_path)

    assert result["found"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["count"] == 0
    assert dto["items"] == []
    assert dto["dry_review_before_write_verified"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_outcome_write"


def test_request_builder_ledger_route_is_protected_and_sanitized(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    client = TestClient(app)
    unauth = client.get("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger")
    assert unauth.status_code == 401

    auth = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert auth.status_code == 200
    body = auth.json()
    assert body["found"] is False
    assert body["dto"]["markdown_body_included"] is False
    assert body["dto"]["raw_root_path_included"] is False
