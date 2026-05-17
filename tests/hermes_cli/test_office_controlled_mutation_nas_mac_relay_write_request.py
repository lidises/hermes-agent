"""Tests for NAS Keeper -> Mac relay write request preparation."""

import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_mac_relay_payload():
    return {
        "relay_request_ref": "relay_req_20260517_demo",
        "write_ref": "write_20260517_demo",
        "package_ref": "pkg_20260517_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-demo",
        "safe_title": "Usable AI Office demo",
        "markdown_body": "# Usable AI Office demo\n\nThis safe note should be written by the NAS Keeper through the Mac relay.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T15:30:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
    }


def test_mac_relay_write_request_prepares_safe_envelope_without_writing(tmp_path):
    from hermes_cli.office_controlled_mutation import prepare_office_controlled_mutation_nas_mac_relay_write_request

    result = prepare_office_controlled_mutation_nas_mac_relay_write_request(safe_mac_relay_payload())

    assert result["prepared"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    capabilities = dto["capabilities"]
    assert isinstance(capabilities, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_write_request_prepared"
    assert dto["execution_path"] == ["ai_office_request", "nas_keeper", "mac_relay", "real_nas"]
    assert dto["safe_logical_path"] == "vault_personal_wiki_demo::usable-ai-office-demo.md"
    assert capabilities["nas_keeper_required"] is True
    assert capabilities["mac_relay_required"] is True
    assert capabilities["vps_nas_mount_enabled"] is False
    assert capabilities["vps_credential_access_enabled"] is False
    assert capabilities["direct_vps_nas_write_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert dto["next_required_boundary"] == "mac_relay_authenticated_execution"
    serialized = json.dumps(dto, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "credential" in serialized  # posture label only, not a secret value


def test_mac_relay_write_request_rejects_raw_paths_tokens_and_unsupported_fields():
    from hermes_cli.office_controlled_mutation import prepare_office_controlled_mutation_nas_mac_relay_write_request

    payload = {
        **safe_mac_relay_payload(),
        "markdown_body": "# Bad\n\n/" + "Users/" + "lidises/nas/private " + "sk-" + "redacted token\n",
        "unsafe_path": "/" + "Users/" + "lidises/nas/private",
    }
    result = prepare_office_controlled_mutation_nas_mac_relay_write_request(payload)

    assert result["prepared"] is False
    assert result["dto"] is None
    assert {item["code"] for item in result["errors"]} >= {"unsupported_field", "raw_marker_detected"}
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "sk-redacted" not in serialized


def test_mac_relay_write_request_api_requires_session_token():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/mac-relay-write-request"

    unauthenticated = client.post(route, json=safe_mac_relay_payload())
    assert unauthenticated.status_code == 401

    prepared = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_mac_relay_payload())
    assert prepared.status_code == 200
    body = prepared.json()
    assert body["prepared"] is True
    assert body["dto"]["execution_path"] == ["ai_office_request", "nas_keeper", "mac_relay", "real_nas"]
    assert body["dto"]["capabilities"]["direct_vps_nas_write_enabled"] is False
