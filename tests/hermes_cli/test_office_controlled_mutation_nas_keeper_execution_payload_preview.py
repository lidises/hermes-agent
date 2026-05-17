"""Tests for authorized NAS Keeper handoff execution-payload preview."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_handoff_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_preview_demo",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-17T22:35:00Z",
        "relay_request_ref": "relay_req_20260517_preview_demo",
        "write_ref": "write_20260517_preview_demo",
        "package_ref": "pkg_20260517_preview_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-preview-demo",
        "safe_title": "Usable AI Office preview demo",
        "markdown_body": "# Usable AI Office preview demo\n\nThis safe note is ready for a later relay execution boundary.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T22:35:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
    }
    payload.update(overrides)
    return payload


def safe_authorize_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_preview_demo",
        "authorization_ref": "authz_20260517_preview_demo",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "authorized_by": "agent_nas_keeper",
        "authorized_at": "2026-05-17T22:36:00Z",
        "authorization_decision": "authorize_mac_relay_execution",
    }
    payload.update(overrides)
    return payload


def safe_preview_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_preview_demo",
        "relay_execution_ref": "relay_exec_20260517_preview_demo",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "relay_authorized_by": "agent_nas_keeper",
        "relay_authorized_at": "2026-05-17T22:37:00Z",
    }
    payload.update(overrides)
    return payload


def prepare_authorized_handoff(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )

    queued = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=tmp_path)
    assert queued["queued"] is True
    authorized = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_authorize_payload(), queue_dir=tmp_path)
    assert authorized["authorized"] is True


def test_execution_payload_preview_reads_authorized_handoff_without_mutating_or_exposing_body(tmp_path):
    from hermes_cli.office_controlled_mutation import preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload

    prepare_authorized_handoff(tmp_path)
    before = (tmp_path / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")

    result = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(), queue_dir=tmp_path
    )

    after = (tmp_path / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")
    assert after == before
    assert result["previewed"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_execution_payload_preview"
    assert dto["queue_status"] == "authorized_for_mac_relay_execution"
    assert dto["markdown_body_included"] is False
    assert dto["markdown_body_bytes"] > 0
    assert len(dto["markdown_body_sha256"]) == 64
    assert dto["payload_preview_path"] == [
        "authorized_queue_item_read",
        "safe_execution_payload_previewed",
        "mac_relay_execution_pending",
        "no_real_nas_write",
    ]
    preview = dto["execution_payload_preview"]
    assert isinstance(preview, dict)
    assert preview["relay_execution_ref"] == "relay_exec_20260517_preview_demo"
    assert preview["write_ref"] == "write_20260517_preview_demo"
    assert "markdown_body" not in preview
    capabilities = dto["capabilities"]
    assert capabilities["queue_read_enabled"] is True
    assert capabilities["execution_payload_preview_enabled"] is True
    assert capabilities["queue_mutation_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    assert capabilities["authority_adapter_binding_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_execution_payload_preview_rejects_unauthorized_mismatches_and_raw_fields(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload,
    )

    missing = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(), queue_dir=tmp_path
    )
    assert missing["errors"] == [{"field": "queue", "code": "queue_not_found"}]

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=tmp_path)
    not_authorized = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(), queue_dir=tmp_path
    )
    assert not_authorized["errors"] == [{"field": "queue_status", "code": "handoff_not_authorized"}]

    prepare_authorized_handoff(tmp_path / "authorized")
    relay_mismatch = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(relay_node_ref="mac_relay_secondary"), queue_dir=tmp_path / "authorized"
    )
    assert relay_mismatch["errors"] == [{"field": "relay_node_ref", "code": "relay_node_mismatch"}]

    keeper_mismatch = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(nas_keeper_ref="agent_other_keeper"), queue_dir=tmp_path / "authorized"
    )
    assert keeper_mismatch["errors"] == [{"field": "nas_keeper_ref", "code": "nas_keeper_mismatch"}]

    actor_mismatch = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        safe_preview_payload(relay_authorized_by="agent_other_keeper"), queue_dir=tmp_path / "authorized"
    )
    assert actor_mismatch["errors"] == [{"field": "relay_authorized_by", "code": "authorization_actor_mismatch"}]

    unsafe_path = "/" + "Users/" + "lidises/nas/private"
    unsupported = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
        {**safe_preview_payload(relay_execution_ref="relay_exec_bad_demo"), "raw_path": unsafe_path, "relay_authorized_by": "bad/path"},
        queue_dir=tmp_path / "authorized",
    )
    assert unsupported["previewed"] is False
    assert unsupported["dto"] is None
    errors = unsupported["errors"]
    assert isinstance(errors, list)
    assert {item["code"] for item in errors} >= {"unsupported_field", "invalid_opaque_id"}
    assert "/users/lidises" not in json.dumps(unsupported, sort_keys=True).lower()


def test_execution_payload_preview_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_authorize_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-payload-preview"

    unauthenticated = client.post(route, json=safe_preview_payload())
    assert unauthenticated.status_code == 401

    previewed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_preview_payload())
    assert previewed.status_code == 200
    body = previewed.json()
    assert body["previewed"] is True
    assert body["dto"]["queue_status"] == "authorized_for_mac_relay_execution"
    assert body["dto"]["markdown_body_included"] is False
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
