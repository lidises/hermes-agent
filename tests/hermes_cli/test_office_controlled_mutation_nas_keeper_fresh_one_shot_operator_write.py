"""Tests for fresh-ref one-shot Mac relay operator writes."""

import json
from pathlib import Path

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def fresh_payload(**overrides):
    base = {
        "handoff_ref": "handoff_fresh_one_shot_20260521201000",
        "queued_by": "agent_orchestrator",
        "queued_at": "2026-05-21T11:10:00Z",
        "relay_request_ref": "relay_req_fresh_one_shot_20260521201000",
        "write_ref": "write_fresh_one_shot_20260521201000",
        "package_ref": "pkg_fresh_one_shot_20260521201000",
        "target_vault_ref": "Hermes",
        "safe_slug": "fresh-one-shot-20260521201000",
        "safe_title": "Fresh one shot 20260521201000",
        "markdown_body": "Fresh one-shot write body with safe refs only.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-21T11:10:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "authorization_ref": "authz_fresh_one_shot_20260521201000",
        "authorized_by": "agent_nas_keeper",
        "authorized_at": "2026-05-21T11:10:01Z",
        "relay_execution_ref": "relay_exec_fresh_one_shot_20260521201000",
        "relay_authorized_by": "agent_nas_keeper",
        "relay_authorized_at": "2026-05-21T11:10:02Z",
        "execution_record_ref": "exec_record_fresh_one_shot_20260521201000",
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-21T11:10:03Z",
    }
    base.update(overrides)
    return base


def test_fresh_one_shot_operator_write_executes_records_and_returns_safe_readback(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write

    queue_dir = tmp_path / "queue"
    root = tmp_path / "root"
    root.mkdir()

    result = execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write(
        fresh_payload(), queue_dir=queue_dir, root_path=root
    )

    assert result["executed"] is True
    assert result["written"] is True
    assert result["recorded"] is True
    assert result["fresh_refs_verified"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_mac_relay_fresh_one_shot_operator_write_completed"
    assert dto["handoff_ref"] == "handoff_fresh_one_shot_20260521201000"
    assert dto["relay_execution_ref"] == "relay_exec_fresh_one_shot_20260521201000"
    assert dto["execution_record_ref"] == "exec_record_fresh_one_shot_20260521201000"
    assert dto["readback_verified"] is True
    assert dto["queue_status"] == "mac_relay_execution_succeeded"
    assert dto["repeat_execution_replay_allowed"] is False
    assert dto["fresh_handoff_required_per_write"] is True
    assert dto["fresh_authorization_required_per_write"] is True
    assert dto["fresh_execution_ref_required_per_write"] is True
    assert dto["capabilities"]["fresh_one_shot_operator_write_enabled"] is True
    assert dto["capabilities"]["watcher_enabled"] is False
    assert dto["capabilities"]["cron_enabled"] is False
    assert dto["capabilities"]["dispatch_enabled"] is False
    assert dto["capabilities"]["authority_adapter_binding_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert (root / "Hermes" / "fresh-one-shot-20260521201000.md").exists()
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "fresh one-shot write body" not in serialized
    assert "/users/" not in serialized
    assert "/home/" not in serialized
    assert "sk-" not in serialized


def test_fresh_one_shot_operator_write_fails_closed_on_reused_refs_before_write(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write

    queue_dir = tmp_path / "queue"
    root = tmp_path / "root"
    root.mkdir()
    first = execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write(
        fresh_payload(), queue_dir=queue_dir, root_path=root
    )
    assert first["written"] is True

    reused = execute_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_write(
        fresh_payload(safe_slug="fresh-one-shot-20260521201100", write_ref="write_fresh_one_shot_20260521201100"),
        queue_dir=queue_dir,
        root_path=root,
    )

    assert reused["executed"] is False
    assert reused["written"] is False
    assert reused["recorded"] is False
    assert reused["fresh_refs_verified"] is False
    assert {tuple(err.items()) for err in reused["errors"]} >= {
        tuple({"field": "handoff_ref", "code": "reused_handoff_ref"}.items()),
        tuple({"field": "authorization_ref", "code": "reused_authorization_ref"}.items()),
        tuple({"field": "relay_execution_ref", "code": "reused_relay_execution_ref"}.items()),
        tuple({"field": "execution_record_ref", "code": "reused_execution_record_ref"}.items()),
    }
    assert not (root / "Hermes" / "fresh-one-shot-20260521201100.md").exists()
    assert reused["dto"] is None


def test_fresh_one_shot_operator_write_route_is_protected_and_safe(monkeypatch, tmp_path):
    from hermes_cli import office_controlled_mutation as mutation
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = tmp_path / "queue"
    root = tmp_path / "root"
    root.mkdir()
    monkeypatch.setattr(
        mutation,
        "_nas_keeper_handoff_queue_file",
        lambda queue_dir=None: queue_dir / "mac-relay-write-queue.jsonl" if queue_dir is not None else queue_dir_path / "mac-relay-write-queue.jsonl",
    )
    queue_dir_path = queue_dir
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT", str(root))

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-operator-write"
    unauthenticated = client.post(route, json=fresh_payload())
    assert unauthenticated.status_code == 401

    response = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=fresh_payload())
    assert response.status_code == 200
    body = response.json()
    assert body["executed"] is True
    assert body["written"] is True
    assert body["dto"]["repeat_execution_replay_allowed"] is False
    serialized = json.dumps(body).lower()
    assert "fresh one-shot write body" not in serialized
    assert "/users/" not in serialized
    assert "/home/" not in serialized
