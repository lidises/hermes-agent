"""Tests for NAS Keeper -> Mac relay handoff queue semantics."""

import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_handoff_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_demo",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-17T21:35:00Z",
        "relay_request_ref": "relay_req_20260517_demo",
        "write_ref": "write_20260517_demo",
        "package_ref": "pkg_20260517_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-handoff-demo",
        "safe_title": "Usable AI Office handoff demo",
        "markdown_body": "# Usable AI Office handoff demo\n\nNAS Keeper should route this through the Mac relay.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T21:35:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
    }
    payload.update(overrides)
    return payload


def test_nas_keeper_handoff_queue_appends_safe_request_without_execution(tmp_path):
    from hermes_cli.office_controlled_mutation import enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff

    result = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(), queue_dir=tmp_path
    )

    assert result["queued"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_handoff_queued"
    assert dto["queue_status"] == "pending_nas_keeper_authorization"
    assert dto["handoff_path"] == ["vps_ai_office_queue", "nas_keeper_review", "mac_relay_execution", "real_nas"]
    assert dto["next_required_boundary"] == "nas_keeper_authorizes_mac_relay_execution"
    assert "markdown_body" not in dto
    capabilities = dto["capabilities"]
    assert capabilities["queue_append_enabled"] is True
    assert capabilities["vps_nas_mount_enabled"] is False
    assert capabilities["vps_credential_access_enabled"] is False
    assert capabilities["direct_vps_nas_write_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False

    queue_file = tmp_path / "mac-relay-write-queue.jsonl"
    rows = [json.loads(line) for line in queue_file.read_text(encoding="utf-8").splitlines()]
    assert len(rows) == 1
    assert rows[0]["handoff_ref"] == "handoff_20260517_demo"
    assert rows[0]["markdown_body"].startswith("# Usable AI Office")
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_nas_keeper_handoff_queue_rejects_duplicate_and_raw_markers(tmp_path):
    from hermes_cli.office_controlled_mutation import enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff

    first = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(), queue_dir=tmp_path
    )
    assert first["queued"] is True
    duplicate = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(), queue_dir=tmp_path
    )
    assert duplicate["queued"] is False
    assert duplicate["errors"] == [{"field": "handoff_ref", "code": "duplicate_handoff_ref"}]

    raw_home = "/" + "Users/" + "lidises/nas/private"
    raw = enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(handoff_ref="handoff_20260517_raw", markdown_body=f"# Bad\n\n{raw_home} sk-" + "redacted\n"),
        queue_dir=tmp_path,
    )
    assert raw["queued"] is False
    assert raw["dto"] is None
    errors = raw["errors"]
    assert isinstance(errors, list)
    assert {item["code"] for item in errors} >= {"raw_marker_detected"}
    serialized = json.dumps(raw, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "sk-redacted" not in serialized


def test_nas_keeper_handoff_queue_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-enqueue"

    unauthenticated = client.post(route, json=safe_handoff_payload())
    assert unauthenticated.status_code == 401

    queued = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_handoff_payload())
    assert queued.status_code == 200
    body = queued.json()
    assert body["queued"] is True
    assert body["dto"]["queue_status"] == "pending_nas_keeper_authorization"
    assert body["dto"]["capabilities"]["direct_vps_nas_write_enabled"] is False
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
