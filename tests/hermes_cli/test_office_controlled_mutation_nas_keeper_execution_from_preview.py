"""Tests for executing an authorized NAS Keeper handoff from its previewed payload."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_preview_payload,
)


def test_execution_from_preview_writes_to_mac_local_root_without_queue_mutation_or_body_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview

    queue_dir = tmp_path / "queue"
    root = tmp_path / "mac-relay-root"
    prepare_authorized_handoff(queue_dir)
    before = (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")

    result = execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview(
        safe_preview_payload(), queue_dir=queue_dir, root_path=root
    )

    after = (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")
    assert after == before
    assert result["executed"] is True
    assert result["written"] is True
    assert result["errors"] == []
    target = root / "vault_personal_wiki_demo" / "usable-ai-office-preview-demo.md"
    assert target.read_text(encoding="utf-8").startswith("# Usable AI Office preview demo")
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_execution_from_preview_completed"
    assert dto["handoff_ref"] == "handoff_20260517_preview_demo"
    assert dto["previewed_payload_verified"] is True
    assert dto["readback_verified"] is True
    assert dto["markdown_body_included"] is False
    assert dto["markdown_body_sha256"]
    assert dto["execution_bridge_path"] == [
        "authorized_queue_item_read",
        "safe_execution_payload_previewed",
        "mac_local_root_checked",
        "mac_relay_execution_completed",
    ]
    capabilities = dto["capabilities"]
    assert capabilities["vps_nas_mount_enabled"] is False
    assert capabilities["vps_credential_access_enabled"] is False
    assert capabilities["direct_vps_nas_write_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is True
    assert capabilities["actual_nas_write_enabled"] is True
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    assert capabilities["authority_adapter_binding_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_execution_from_preview_fails_closed_without_mac_root_and_rejects_mismatches(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)

    not_configured = execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview(
        safe_preview_payload(), queue_dir=queue_dir
    )
    assert not_configured["executed"] is False
    assert not_configured["written"] is False
    assert not_configured["errors"] == [{"field": "mac_relay_root", "code": "mac_relay_root_not_configured"}]
    assert not_configured["dto"] is None

    mismatch = execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview(
        safe_preview_payload(relay_node_ref="mac_relay_secondary"), queue_dir=queue_dir, root_path=tmp_path / "root"
    )
    assert mismatch["executed"] is False
    assert mismatch["written"] is False
    assert mismatch["errors"] == [{"field": "relay_node_ref", "code": "relay_node_mismatch"}]

    unsupported = execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview(
        {**safe_preview_payload(), "raw_path": "/" + "Users/lidises/private"}, queue_dir=queue_dir, root_path=tmp_path / "root"
    )
    assert unsupported["executed"] is False
    assert unsupported["dto"] is None
    assert {item["code"] for item in unsupported["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(unsupported, sort_keys=True).lower()


def test_execution_from_preview_api_requires_session_token_and_mac_local_root(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
        safe_authorize_payload,
        safe_handoff_payload,
    )

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_authorize_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview"

    unauthenticated = client.post(route, json=safe_preview_payload())
    assert unauthenticated.status_code == 401

    not_configured = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_preview_payload())
    assert not_configured.status_code == 200
    assert not_configured.json()["errors"] == [{"field": "mac_relay_root", "code": "mac_relay_root_not_configured"}]

    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT", str(tmp_path / "mac-root"))
    executed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_preview_payload())
    assert executed.status_code == 200
    body = executed.json()
    assert body["executed"] is True
    assert body["dto"]["previewed_payload_verified"] is True
    assert body["dto"]["markdown_body_included"] is False
    assert (tmp_path / "mac-root" / "vault_personal_wiki_demo" / "usable-ai-office-preview-demo.md").exists()
