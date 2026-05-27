"""Tests for selected durable NAS Keeper item preview/record contract."""

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
        "selected_contract_ref": "selected_contract_20260527_durable_preview_demo",
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T03:00:00Z",
        "operator_approval_checked": False,
        "execution_requested": False,
    }
    payload.update(overrides)
    return payload


def test_selected_durable_item_preview_record_contract_stores_metadata_only_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
    )

    queue_dir = tmp_path / "queue"
    store_path = tmp_path / "records.jsonl"
    prepare_authorized_handoff(queue_dir)

    result = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(), queue_dir=queue_dir, store_path=store_path
    )

    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert result["executed"] is False
    assert result["written"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_selected_durable_item_preview_record_contract"
    assert dto["selected_contract_ref"] == "selected_contract_20260527_durable_preview_demo"
    assert dto["handoff_ref"] == "handoff_20260517_preview_demo"
    assert dto["queue_status"] == "authorized_for_mac_relay_execution"
    assert dto["operator_approval_checked"] is False
    assert dto["execution_requested"] is False
    assert dto["execution_disabled_by_default"] is True
    assert dto["metadata_only_record_written"] is True
    assert dto["execution_payload_previewed"] is True
    assert dto["payload_contract_ready"] is True
    assert dto["execution_payload_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert len(dto["payload_contract_sha256"]) == 64
    assert len(dto["selected_contract_record_sha256"]) == 64
    capabilities = dto["capabilities"]
    assert capabilities["selected_durable_item_preview_recording_enabled"] is True
    assert capabilities["execution_payload_preview_enabled"] is True
    assert capabilities["execution_from_preview_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["direct_vps_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    assert capabilities["authority_adapter_binding_enabled"] is False

    stored_lines = store_path.read_text(encoding="utf-8").splitlines()
    assert len(stored_lines) == 1
    stored = json.loads(stored_lines[0])
    assert stored["selected_contract_record_sha256"] == dto["selected_contract_record_sha256"]

    replay = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(), queue_dir=queue_dir, store_path=store_path
    )
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    assert replay["dto"]["selected_contract_record_sha256"] == dto["selected_contract_record_sha256"]
    assert len(store_path.read_text(encoding="utf-8").splitlines()) == 1

    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "markdown_body" not in dto
    assert "execution_payload_preview" not in dto
    assert "write_payload" not in dto
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_selected_durable_item_preview_record_contract_fails_closed_for_approval_or_raw_fields(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
    )

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)

    approved = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(operator_approval_checked=True), queue_dir=queue_dir, store_path=tmp_path / "records.jsonl"
    )
    assert approved["recorded"] is False
    assert approved["executed"] is False
    assert approved["written"] is False
    assert approved["errors"] == [{"field": "operator_approval_checked", "code": "must_remain_false_for_preview_contract"}]

    unsafe_path = "/" + "Users/" + "lidises/private"
    raw = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        {**selected_contract_payload(), "raw_root_path": unsafe_path}, queue_dir=queue_dir, store_path=tmp_path / "records.jsonl"
    )
    assert raw["recorded"] is False
    assert raw["dto"] is None
    assert {item["code"] for item in raw["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_selected_durable_item_preview_record_contract_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
        safe_authorize_payload,
        safe_handoff_payload,
    )

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_authorize_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-durable-item-preview-contract"

    unauthenticated = client.post(route, json=selected_contract_payload())
    assert unauthenticated.status_code == 401

    response = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=selected_contract_payload())
    assert response.status_code == 200
    body = response.json()
    assert body["recorded"] is True
    assert body["executed"] is False
    assert body["written"] is False
    assert body["dto"]["metadata_only_record_written"] is True
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
