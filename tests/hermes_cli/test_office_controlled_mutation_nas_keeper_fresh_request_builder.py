"""Tests for operator-side fresh one-shot write request builder."""

import json
import re

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def intent_payload(**overrides):
    base = {
        "operator_intent_ref": "intent_fresh_builder_20260521230000",
        "target_vault_ref": "Hermes",
        "safe_slug_base": "fresh-builder-intent",
        "safe_title": "Fresh builder intent",
        "markdown_body": "Fresh builder safe body with refs only.\n",
        "requested_by": "agent_orchestrator",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "approve_actual_write": False,
    }
    base.update(overrides)
    return base


def test_fresh_one_shot_request_builder_dry_reviews_unique_safe_refs_without_write(tmp_path):
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request

    result = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        intent_payload(), queue_dir=tmp_path / "queue", now_utc="2026-05-21T14:00:00Z", nonce="abc12345"
    )

    assert result["built"] is True
    assert result["dry_reviewed"] is True
    assert result["executed"] is False
    assert result["written"] is False
    assert result["approval_required"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_one_shot_operator_request_builder_review"
    assert dto["operator_intent_ref"] == "intent_fresh_builder_20260521230000"
    assert dto["approve_actual_write"] is False
    assert dto["request_payload_ready"] is True
    assert dto["fresh_refs_verified"] is True
    assert dto["safe_slug"] == "fresh-builder-intent-20260521140000-abc12345"
    assert dto["handoff_ref"] == "handoff_fresh_builder_intent_20260521140000_abc12345"
    assert dto["authorization_ref"] == "authz_fresh_builder_intent_20260521140000_abc12345"
    assert dto["relay_execution_ref"] == "relay_exec_fresh_builder_intent_20260521140000_abc12345"
    assert dto["execution_record_ref"] == "exec_record_fresh_builder_intent_20260521140000_abc12345"
    assert dto["markdown_body_sha256"]
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["repeat_execution_replay_allowed"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert not (tmp_path / "root" / "Hermes" / "fresh-builder-intent-20260521140000-abc12345.md").exists()
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "fresh builder safe body" not in serialized
    assert "/users/" not in serialized
    assert "sk-" not in serialized


def test_fresh_one_shot_request_builder_requires_explicit_approval_for_actual_write(tmp_path):
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request

    root = tmp_path / "root"
    root.mkdir()
    dry = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        intent_payload(approve_actual_write=False),
        queue_dir=tmp_path / "queue",
        root_path=root,
        now_utc="2026-05-21T14:01:00Z",
        nonce="def67890",
    )
    assert dry["written"] is False
    assert not (root / "Hermes" / "fresh-builder-intent-20260521140100-def67890.md").exists()

    approved = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        intent_payload(approve_actual_write=True),
        queue_dir=tmp_path / "queue",
        root_path=root,
        now_utc="2026-05-21T14:02:00Z",
        nonce="fedcba98",
    )
    assert approved["executed"] is True
    assert approved["written"] is True
    assert approved["approval_required"] is False
    assert approved["dto"]["write_result"]["readback_verified"] is True
    assert (root / "Hermes" / "fresh-builder-intent-20260521140200-fedcba98.md").exists()


def test_fresh_one_shot_request_builder_route_is_protected_and_never_echoes_body(monkeypatch, tmp_path):
    from hermes_cli import office_controlled_mutation as mutation
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir_path = tmp_path / "queue"
    root = tmp_path / "root"
    root.mkdir()
    monkeypatch.setattr(
        mutation,
        "_nas_keeper_handoff_queue_file",
        lambda queue_dir=None: queue_dir_path / "mac-relay-write-queue.jsonl",
    )
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT", str(root))

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-request-builder"
    unauthenticated = client.post(route, json=intent_payload())
    assert unauthenticated.status_code == 401

    response = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=intent_payload(approve_actual_write=True))
    assert response.status_code == 200
    body = response.json()
    assert body["built"] is True
    assert body["written"] is True
    assert body["dto"]["request_payload_ready"] is True
    assert body["dto"]["write_result"]["readback_verified"] is True
    assert re.fullmatch(r"[a-f0-9]{64}", body["dto"]["markdown_body_sha256"])
    serialized = json.dumps(body, sort_keys=True).lower()
    assert "fresh builder safe body" not in serialized
    assert "/users/" not in serialized
    assert "/home/" not in serialized
    assert "sk-" not in serialized
