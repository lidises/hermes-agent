from __future__ import annotations

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from hermes_cli.office_controlled_mutation import (
    rehearse_office_controlled_mutation_nas_keeper_durable_queue,
)


def _payload(suffix: str = "001") -> dict[str, str]:
    return {
        "handoff_ref": f"handoff_durable_rehearsal_{suffix}",
        "relay_request_ref": f"relay_request_durable_rehearsal_{suffix}",
        "relay_execution_ref": f"relay_execution_durable_rehearsal_{suffix}",
        "write_ref": f"write_durable_rehearsal_{suffix}",
        "package_ref": f"package_durable_rehearsal_{suffix}",
        "target_vault_ref": "ai_office_write_smoke",
        "safe_slug": f"durable-rehearsal-{suffix}",
        "safe_title": "Durable Rehearsal Smoke",
        "markdown_body": "# Durable rehearsal\n\nBody must stay out of public DTOs.\n",
        "requested_by": "operator_durable_rehearsal",
        "requested_at": "2026-05-27T02:30:00Z",
        "nas_keeper_ref": "nas_keeper_durable_rehearsal",
        "relay_node_ref": "mac_relay_durable_rehearsal",
        "queued_by": "operator_durable_rehearsal",
        "queued_at": "2026-05-27T02:30:01Z",
        "authorization_ref": f"authz_durable_rehearsal_{suffix}",
        "authorized_by": "nas_keeper_durable_rehearsal",
        "authorized_at": "2026-05-27T02:30:02Z",
        "relay_authorized_by": "nas_keeper_durable_rehearsal",
        "relay_authorized_at": "2026-05-27T02:30:03Z",
    }


def test_durable_queue_rehearsal_appends_authorizes_and_previews_without_write(tmp_path):
    result = rehearse_office_controlled_mutation_nas_keeper_durable_queue(_payload(), queue_dir=tmp_path)

    assert result["rehearsed"] is True
    assert result["queued"] is True
    assert result["authorized"] is True
    assert result["previewed"] is True
    assert result["executed"] is False
    assert result["written"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_durable_queue_rehearsal"
    assert dto["queue_storage_ref"] == "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue"
    assert dto["queue_status"] == "authorized_for_mac_relay_execution"
    assert dto["durable_queue_mutation_enabled"] is True
    assert dto["execution_payload_previewed"] is True
    assert dto["execution_payload_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["target_exists_after_rehearsal"] is False
    assert dto["capabilities"]["queue_append_enabled"] is True
    assert dto["capabilities"]["nas_keeper_authorization_recording_enabled"] is True
    assert dto["capabilities"]["execution_payload_preview_enabled"] is True
    assert dto["capabilities"]["actual_nas_write_enabled"] is False
    assert dto["capabilities"]["mac_relay_write_enabled"] is False
    assert dto["capabilities"]["direct_vps_nas_write_enabled"] is False
    assert dto["capabilities"]["watcher_enabled"] is False
    assert dto["capabilities"]["cron_enabled"] is False
    assert dto["capabilities"]["dispatch_enabled"] is False
    assert dto["capabilities"]["authority_adapter_binding_enabled"] is False
    serialized = json.dumps(dto, ensure_ascii=False, sort_keys=True)
    assert "Body must stay out" not in serialized
    assert "markdown_body" not in dto
    assert "execution_payload_preview" not in dto


def test_durable_queue_rehearsal_is_idempotent_for_existing_authorized_item(tmp_path):
    first = rehearse_office_controlled_mutation_nas_keeper_durable_queue(_payload("002"), queue_dir=tmp_path)
    second = rehearse_office_controlled_mutation_nas_keeper_durable_queue(_payload("002"), queue_dir=tmp_path)

    assert first["rehearsed"] is True
    assert second["rehearsed"] is True
    assert second["queued"] is False
    assert second["authorized"] is False
    assert second["previewed"] is True
    assert second["idempotent_replay"] is True
    assert second["errors"] == []
    dto = second["dto"]
    assert dto["idempotency_status"] == "existing_authorized_handoff_reused"
    queue_file = tmp_path / "mac-relay-write-queue.jsonl"
    assert len(queue_file.read_text(encoding="utf-8").splitlines()) == 1


def test_durable_queue_rehearsal_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-durable-queue-rehearsal"

    unauthenticated = client.post(route, json=_payload("004"))
    assert unauthenticated.status_code == 401

    response = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=_payload("004"))
    assert response.status_code == 200
    body = response.json()
    assert body["rehearsed"] is True
    assert body["executed"] is False
    assert body["written"] is False
    assert body["dto"]["mode"] == "nas_keeper_durable_queue_rehearsal"
    assert body["dto"]["markdown_body_included"] is False
    assert body["dto"]["write_payload_included"] is False
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False


def test_durable_queue_rehearsal_rejects_raw_path_or_secret_fields(tmp_path):
    payload = _payload("003")
    payload["raw_root_path"] = "/private/nas"
    result = rehearse_office_controlled_mutation_nas_keeper_durable_queue(payload, queue_dir=tmp_path)

    assert result["rehearsed"] is False
    assert result["executed"] is False
    assert result["written"] is False
    assert result["dto"] is None
    assert {error["field"] for error in result["errors"]} == {"unsupported_fields"}
