"""Tests for repeat-safe last successful Mac relay write readback."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_last_successful_mac_relay_write


def succeeded_queue_item(**overrides):
    base = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_queue_item",
        "handoff_ref": "handoff_one_shot_write_20260521103124",
        "queue_ref": "queue:handoff_one_shot_write_20260521103124",
        "queue_status": "mac_relay_execution_succeeded",
        "relay_request_ref": "relay_req_one_shot_write_20260521103124",
        "write_ref": "write_one_shot_write_20260521103124",
        "package_ref": "pkg_one_shot_write_20260521103124",
        "target_vault_ref": "Hermes",
        "safe_slug": "controlled-mutation-one-shot-write-20260521103124",
        "safe_title": "AI Office controlled mutation one shot write 20260521103124",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-21T10:31:24Z",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-21T10:31:24Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "safe_logical_path": "vault:Hermes/controlled-mutation-one-shot-write-20260521103124.md",
        "safe_display_path": "Hermes / controlled-mutation-one-shot-write-20260521103124.md",
        "payload_bytes": 226,
        "markdown_body_sha256": "25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
        "next_required_boundary": "manual_nas_keeper_execution_evidence_review_if_needed",
        "authorization_ref": "authz_one_shot_write_20260521103124",
        "authorization_decision": "authorize_mac_relay_execution",
        "authorized_by": "agent_nas_keeper",
        "authorized_at": "2026-05-21T10:31:24Z",
        "relay_execution_ref": "relay_exec_one_shot_write_20260521103124",
        "execution_record_ref": "exec_record_one_shot_write_20260521103124",
        "execution_status": "succeeded",
        "execution_recorded_by": "agent_nas_keeper",
        "execution_recorded_at": "2026-05-21T10:31:24Z",
        "execution_safe_summary": "Mac relay write completed and safe readback evidence was recorded.",
        "execution_evidence_refs": [
            "readback:25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
            "markdown:25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
        ],
    }
    base.update(overrides)
    return base


def test_last_successful_mac_relay_write_readback_is_sanitized(tmp_path):
    queue_dir = tmp_path / "queue"
    queue_dir.mkdir()
    queue_file = queue_dir / "mac-relay-write-queue.jsonl"
    queue_file.write_text(json.dumps(succeeded_queue_item()) + "\n", encoding="utf-8")

    result = get_office_controlled_mutation_nas_keeper_last_successful_mac_relay_write(queue_dir=queue_dir)

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_mac_relay_last_successful_bounded_write_readback"
    assert dto["last_successful_write_found"] is True
    assert dto["handoff_ref"] == "handoff_one_shot_write_20260521103124"
    assert dto["relay_execution_ref"] == "relay_exec_one_shot_write_20260521103124"
    assert dto["execution_record_ref"] == "exec_record_one_shot_write_20260521103124"
    assert dto["safe_display_path"] == "Hermes / controlled-mutation-one-shot-write-20260521103124.md"
    assert dto["readback_sha256"] == "25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1"
    assert dto["readback_verified"] is True
    assert dto["fresh_handoff_required_per_write"] is True
    assert dto["fresh_authorization_required_per_write"] is True
    assert dto["fresh_execution_ref_required_per_write"] is True
    assert dto["capabilities"]["repeat_execution_replay_enabled"] is False
    assert dto["capabilities"]["watcher_enabled"] is False
    assert dto["capabilities"]["cron_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    serialized = json.dumps(dto).lower()
    assert "/users/" not in serialized
    assert "/home/" not in serialized
    assert "password" not in serialized
    assert "secret" not in serialized


def test_last_successful_mac_relay_write_chooses_latest_success(tmp_path):
    queue_dir = tmp_path / "queue"
    queue_dir.mkdir()
    old = succeeded_queue_item(
        handoff_ref="handoff_one_shot_write_20260521100000",
        relay_execution_ref="relay_exec_one_shot_write_20260521100000",
        execution_record_ref="exec_record_one_shot_write_20260521100000",
        execution_recorded_at="2026-05-21T10:00:00Z",
        safe_slug="controlled-mutation-one-shot-write-20260521100000",
        safe_display_path="Hermes / controlled-mutation-one-shot-write-20260521100000.md",
    )
    latest = succeeded_queue_item()
    (queue_dir / "mac-relay-write-queue.jsonl").write_text(
        json.dumps(old) + "\n" + json.dumps(latest) + "\n", encoding="utf-8"
    )

    dto = get_office_controlled_mutation_nas_keeper_last_successful_mac_relay_write(queue_dir=queue_dir)["dto"]

    assert dto["handoff_ref"] == "handoff_one_shot_write_20260521103124"
    assert dto["last_success_rank"] == 1


def test_last_successful_mac_relay_write_route_is_protected_and_safe(tmp_path, monkeypatch):
    from hermes_cli import office_controlled_mutation as mutation
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = tmp_path / "queue"
    queue_dir.mkdir()
    (queue_dir / "mac-relay-write-queue.jsonl").write_text(json.dumps(succeeded_queue_item()) + "\n", encoding="utf-8")
    monkeypatch.setattr(
        mutation,
        "_nas_keeper_handoff_queue_file",
        lambda queue_dir=None: queue_dir / "mac-relay-write-queue.jsonl" if queue_dir is not None else tmp_path / "queue" / "mac-relay-write-queue.jsonl",
    )

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-last-successful-mac-relay-write"
    unauthenticated = client.get(route)
    assert unauthenticated.status_code == 401

    response = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert response.status_code == 200
    body = response.json()
    assert body["found"] is True
    assert body["dto"]["repeat_execution_replay_allowed"] is False
    serialized = json.dumps(body).lower()
    assert "/users/" not in serialized
    assert "/home/" not in serialized
    assert "secret" not in serialized
