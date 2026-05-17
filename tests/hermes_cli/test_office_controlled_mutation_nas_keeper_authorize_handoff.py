"""Tests for NAS Keeper authorization recording of Mac relay handoffs."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_handoff_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_authorize_demo",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-17T22:20:00Z",
        "relay_request_ref": "relay_req_20260517_authorize_demo",
        "write_ref": "write_20260517_authorize_demo",
        "package_ref": "pkg_20260517_authorize_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-authorize-demo",
        "safe_title": "Usable AI Office authorize demo",
        "markdown_body": "# Usable AI Office authorize demo\n\nThis safe note is prepared for later relay review only.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T22:20:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
    }
    payload.update(overrides)
    return payload


def safe_authorize_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_authorize_demo",
        "authorization_ref": "authz_20260517_demo",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "authorized_by": "agent_nas_keeper",
        "authorized_at": "2026-05-17T22:21:00Z",
        "authorization_decision": "authorize_mac_relay_execution",
    }
    payload.update(overrides)
    return payload


def test_authorize_handoff_records_queue_state_without_executing_or_exposing_markdown(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )

    queued = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(), queue_dir=tmp_path
    )
    assert queued["queued"] is True

    result = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(), queue_dir=tmp_path
    )

    assert result["authorized"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_handoff_authorized"
    assert dto["queue_status_before"] == "pending_nas_keeper_authorization"
    assert dto["queue_status_after"] == "authorized_for_mac_relay_execution"
    assert dto["authorization_decision"] == "authorize_mac_relay_execution"
    assert dto["authorization_path"] == [
        "nas_keeper_review",
        "authorization_recorded",
        "mac_relay_execution_pending",
        "no_real_nas_write",
    ]
    assert "markdown_body" not in dto
    capabilities = dto["capabilities"]
    assert capabilities["queue_read_enabled"] is True
    assert capabilities["queue_mutation_enabled"] is True
    assert capabilities["nas_keeper_authorization_recording_enabled"] is True
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    assert capabilities["authority_adapter_binding_enabled"] is False

    rows = [json.loads(line) for line in (tmp_path / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8").splitlines()]
    assert len(rows) == 1
    assert rows[0]["queue_status"] == "authorized_for_mac_relay_execution"
    assert rows[0]["authorization_ref"] == "authz_20260517_demo"
    assert rows[0]["markdown_body"].startswith("# Usable AI Office")
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "authorization recording should not execute" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_authorize_handoff_rejects_duplicate_mismatches_and_unsupported_fields_without_raw_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )

    missing = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(), queue_dir=tmp_path
    )
    assert missing["errors"] == [{"field": "queue", "code": "queue_not_found"}]

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=tmp_path)
    relay_mismatch = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(relay_node_ref="mac_relay_secondary"), queue_dir=tmp_path
    )
    assert relay_mismatch["errors"] == [{"field": "relay_node_ref", "code": "relay_node_mismatch"}]

    nas_keeper_mismatch = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(nas_keeper_ref="agent_other_keeper"), queue_dir=tmp_path
    )
    assert nas_keeper_mismatch["errors"] == [{"field": "nas_keeper_ref", "code": "nas_keeper_mismatch"}]

    unsafe_path = "/" + "Users/" + "lidises/nas/private"
    unsupported = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        {**safe_authorize_payload(authorization_ref="authz_bad_demo"), "raw_path": unsafe_path, "authorized_by": "bad/path"},
        queue_dir=tmp_path,
    )
    assert unsupported["authorized"] is False
    assert unsupported["dto"] is None
    errors = unsupported["errors"]
    assert isinstance(errors, list)
    assert {item["code"] for item in errors} >= {"unsupported_field", "invalid_opaque_id"}
    assert "/users/lidises" not in json.dumps(unsupported, sort_keys=True).lower()

    authorized = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(), queue_dir=tmp_path
    )
    assert authorized["authorized"] is True
    duplicate = authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(authorization_ref="authz_second_demo"), queue_dir=tmp_path
    )
    assert duplicate["errors"] == [{"field": "queue_status", "code": "unsupported_queue_status"}]


def test_authorize_handoff_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize"

    unauthenticated = client.post(route, json=safe_authorize_payload())
    assert unauthenticated.status_code == 401

    authorized = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_authorize_payload())
    assert authorized.status_code == 200
    body = authorized.json()
    assert body["authorized"] is True
    assert body["dto"]["queue_status_after"] == "authorized_for_mac_relay_execution"
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
