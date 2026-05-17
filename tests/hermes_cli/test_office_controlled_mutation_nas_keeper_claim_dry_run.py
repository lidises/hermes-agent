"""Tests for NAS Keeper -> Mac relay handoff claim dry-run semantics."""

import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_handoff_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_claim_demo",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-17T22:00:00Z",
        "relay_request_ref": "relay_req_20260517_claim_demo",
        "write_ref": "write_20260517_claim_demo",
        "package_ref": "pkg_20260517_claim_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-claim-demo",
        "safe_title": "Usable AI Office claim demo",
        "markdown_body": "# Usable AI Office claim demo\n\nMac relay claim should be dry-run only.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T22:00:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
    }
    payload.update(overrides)
    return payload


def safe_claim_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_claim_demo",
        "claim_ref": "claim_20260517_demo",
        "relay_node_ref": "mac_relay_primary",
        "claimed_by": "mac_relay_primary",
        "claimed_at": "2026-05-17T22:01:00Z",
    }
    payload.update(overrides)
    return payload


def test_mac_relay_claim_dry_run_reads_queue_without_mutating_or_executing(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )

    queued = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(), queue_dir=tmp_path
    )
    assert queued["queued"] is True
    before = (tmp_path / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")

    result = dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim(
        safe_claim_payload(), queue_dir=tmp_path
    )

    after = (tmp_path / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")
    assert after == before
    assert result["claimed"] is False
    assert result["dry_run"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_handoff_claim_dry_run"
    assert dto["claim_status"] == "would_claim"
    assert dto["queue_status_before"] == "pending_nas_keeper_authorization"
    assert dto["queue_status_after"] == "pending_nas_keeper_authorization"
    assert "markdown_body" not in dto
    assert dto["safe_logical_path"] == "vault_personal_wiki_demo::usable-ai-office-claim-demo.md"
    assert dto["claim_path"] == ["mac_relay_reads_queue", "nas_keeper_authorization_pending", "dry_run_only", "no_real_nas_write"]
    capabilities = dto["capabilities"]
    assert capabilities["queue_read_enabled"] is True
    assert capabilities["claim_dry_run_enabled"] is True
    assert capabilities["queue_mutation_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_mac_relay_claim_dry_run_rejects_missing_queue_mismatch_and_unsupported_fields(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )

    missing = dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim(
        safe_claim_payload(), queue_dir=tmp_path
    )
    assert missing["errors"] == [{"field": "queue", "code": "queue_not_found"}]

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=tmp_path)
    mismatch = dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim(
        safe_claim_payload(relay_node_ref="mac_relay_secondary"), queue_dir=tmp_path
    )
    assert mismatch["errors"] == [{"field": "relay_node_ref", "code": "relay_node_mismatch"}]

    unsafe_path = "/" + "Users/" + "lidises/nas/private"
    unsupported = dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim(
        {**safe_claim_payload(claim_ref="claim_20260517_bad"), "raw_path": unsafe_path, "claimed_by": "bad/path"},
        queue_dir=tmp_path,
    )
    assert unsupported["claimed"] is False
    assert unsupported["dto"] is None
    errors = unsupported["errors"]
    assert isinstance(errors, list)
    assert {item["code"] for item in errors} >= {"unsupported_field", "invalid_opaque_id"}
    serialized = json.dumps(unsupported, sort_keys=True).lower()
    assert "/users/lidises" not in serialized


def test_mac_relay_claim_dry_run_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-claim-dry-run"

    unauthenticated = client.post(route, json=safe_claim_payload())
    assert unauthenticated.status_code == 401

    claimed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_claim_payload())
    assert claimed.status_code == 200
    body = claimed.json()
    assert body["claimed"] is False
    assert body["dry_run"] is True
    assert body["dto"]["claim_status"] == "would_claim"
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
