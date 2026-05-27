"""Tests for selected durable contract sourced tmp-root write smoke."""

import hashlib
import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_preview_payload,
)


def selected_contract_payload(**overrides):
    payload = {
        **safe_preview_payload(),
        "selected_contract_ref": "selected_contract_tmp_root_smoke",
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T03:10:00Z",
        "operator_approval_checked": False,
        "execution_requested": False,
    }
    payload.update(overrides)
    return payload


def tmp_root_smoke_payload(**overrides):
    payload = {
        **safe_preview_payload(),
        "selected_contract_ref": "selected_contract_tmp_root_smoke",
        "tmp_root_smoke_ref": "tmp_root_smoke_selected_contract_20260527",
        "requested_by": "agent_nas_keeper",
        "requested_at": "2026-05-27T03:11:00Z",
    }
    payload.update(overrides)
    return payload


def test_selected_contract_tmp_root_smoke_writes_reads_back_records_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "isolated-mac-relay-root"
    contract_store = tmp_path / "selected-contracts.jsonl"
    smoke_store = tmp_path / "tmp-root-smokes.jsonl"
    prepare_authorized_handoff(queue_dir)
    contract = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(), queue_dir=queue_dir, store_path=contract_store
    )
    assert contract["recorded"] is True
    before_queue = (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")

    result = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=contract_store,
        smoke_store_path=smoke_store,
        root_path=root,
    )
    replay = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=contract_store,
        smoke_store_path=smoke_store,
        root_path=root,
    )

    assert (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8") == before_queue
    assert result["executed"] is True
    assert result["written"] is True
    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["executed"] is False
    assert replay["written"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_selected_durable_tmp_root_write_smoke"
    assert dto["selected_contract_ref"] == "selected_contract_tmp_root_smoke"
    assert dto["selected_contract_verified"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["tmp_root_audit_written"] is True
    assert dto["payload_body_materialized"] is True
    assert dto["payload_body_materialization_scope"] == "internal_tmp_root_smoke_only"
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["write_payload_materialized"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["tmp_root_readback_sha256"] == hashlib.sha256(
        "# Usable AI Office preview demo\n\nThis safe note is ready for a later relay execution boundary.\n".encode("utf-8")
    ).hexdigest()
    assert len(dto["idempotency_key_sha256"]) == 64
    assert replay["dto"]["tmp_root_smoke_record_sha256"] == dto["tmp_root_smoke_record_sha256"]
    assert len(smoke_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay}, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "markdown_body\":" not in serialized
    assert "write_payload\":" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_selected_contract_tmp_root_smoke_fails_closed_without_selected_contract_or_root(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)
    missing_root = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(), queue_dir=queue_dir, contract_store_path=tmp_path / "missing.jsonl"
    )
    assert missing_root["executed"] is False
    assert missing_root["written"] is False
    assert missing_root["recorded"] is False
    assert missing_root["errors"] == [{"field": "mac_relay_tmp_root", "code": "mac_relay_tmp_root_not_configured"}]

    missing_contract = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=tmp_path / "missing.jsonl",
        root_path=tmp_path / "root",
    )
    assert missing_contract["executed"] is False
    assert missing_contract["written"] is False
    assert missing_contract["recorded"] is False
    assert missing_contract["errors"] == [{"field": "selected_contract_ref", "code": "selected_contract_not_found"}]


def test_selected_contract_tmp_root_smoke_api_requires_session_token_and_tmp_root(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-durable-tmp-root-write-smoke"

    unauthenticated = client.post(route, json=tmp_root_smoke_payload())
    assert unauthenticated.status_code == 401
    not_configured = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=tmp_root_smoke_payload())
    assert not_configured.status_code == 200
    assert not_configured.json()["errors"] == [{"field": "mac_relay_tmp_root", "code": "mac_relay_tmp_root_not_configured"}]

    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    executed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=tmp_root_smoke_payload())
    assert executed.status_code == 200
    body = executed.json()
    assert body["executed"] is True
    assert body["dto"]["tmp_root_readback_verified"] is True
    assert body["dto"]["real_nas_production_write_enabled"] is False
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["tmp_root_smoke_ref"] == "tmp_root_smoke_selected_contract_20260527"
