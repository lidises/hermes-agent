"""Tests for bounded noop execution probe after execution opening."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_execution_opening import (
    _opening_payload,
    _seed_guard,
)
from hermes_cli.office_controlled_mutation import (
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_records,
)
from hermes_cli.web_server import _SESSION_TOKEN, app


def _seed_opening(tmp_path):
    guard, guard_store = _seed_guard(tmp_path)
    opening_store = tmp_path / "opening.jsonl"
    opening = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record(
        _opening_payload(guard),
        idempotency_replay_guard_store_path=guard_store,
        store_path=opening_store,
    )["dto"]
    return opening, opening_store


def _probe_payload(opening):
    return {
        "noop_execution_probe_ref": "noopexec-20260522090000-test0001",
        "execution_opening_ref": opening["execution_opening_ref"],
        "execution_opening_record_sha256": opening["execution_opening_record_sha256"],
        "idempotency_replay_guard_ref": opening["idempotency_replay_guard_ref"],
        "idempotency_replay_guard_record_sha256": opening["idempotency_replay_guard_record_sha256"],
        "operator_execution_approval_ref": opening["operator_execution_approval_ref"],
        "operator_execution_approval_record_sha256": opening["operator_execution_approval_record_sha256"],
        "replay_store_entry_ref": opening["replay_store_entry_ref"],
        "replay_store_metadata_record_sha256": opening["replay_store_metadata_record_sha256"],
        "execution_design_sha256": opening["execution_design_sha256"],
        "probe_mode": "noop_execution_probe_after_opening_only",
        "probe_result": "noop_execution_probe_succeeded",
        "probed_by": "operator-safe-ref",
        "probed_at": "2026-05-22T09:00:00Z",
        "safe_summary": "Bounded noop execution probe after opening without downstream consumption.",
        "evidence_refs": ["code:959ce20f"],
        "raw_root_path": "/volume1/private",
        "markdown_body": "must-not-echo-write-payload",
        "credential_value": "must-not-echo-secret",
    }


def test_noop_execution_probe_writes_metadata_only_and_keeps_real_execution_disabled(tmp_path):
    opening, opening_store = _seed_opening(tmp_path)
    store = tmp_path / "probe.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record(
        _probe_payload(opening),
        execution_opening_store_path=opening_store,
        store_path=store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["noop_execution_probe_recorded"] is True
    assert dto["noop_execution_probe_ready"] is True
    assert dto["noop_execution_probe_result"] == "noop_execution_probe_succeeded"
    assert dto["execution_opening_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert len(dto["noop_execution_probe_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    text = json.dumps(dto, sort_keys=True)
    assert "must-not-echo" not in text
    assert "/volume1/private" not in text


def test_noop_execution_probe_readback_filters_safe_ref_and_blocks_reuse(tmp_path):
    opening, opening_store = _seed_opening(tmp_path)
    store = tmp_path / "probe.jsonl"
    payload = _probe_payload(opening)
    first = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record(
        payload,
        execution_opening_store_path=opening_store,
        store_path=store,
    )
    assert first["stored"] is True

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record(
        dict(payload, noop_execution_probe_ref="noopexec-20260522090001-test0002"),
        execution_opening_store_path=opening_store,
        store_path=store,
    )

    assert duplicate["stored"] is False
    assert {error["code"] for error in duplicate["errors"]} >= {"duplicate_execution_opening_probe", "duplicate_execution_design_probe"}
    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_records(
        store_path=store,
        noop_execution_probe_ref=payload["noop_execution_probe_ref"],
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["noop_execution_probe_ref"] == payload["noop_execution_probe_ref"]
    assert readback["dto"]["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_actual_execution_contract_after_noop_probe"


def test_noop_execution_probe_route_is_protected_and_readbacks(tmp_path, monkeypatch):
    opening, opening_store = _seed_opening(tmp_path)
    store = tmp_path / "probe.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_execution_opening_record_store_path", lambda: opening_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_noop_execution_probe_record_store_path", lambda: store)
    with TestClient(app) as client:
        route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-execution-probes"
        assert client.post(route, json=_probe_payload(opening)).status_code == 401
        assert client.get(route).status_code == 401
        headers = {"X-Hermes-Session-Token": _SESSION_TOKEN}
        stored = client.post(route, json=_probe_payload(opening), headers=headers)
        assert stored.status_code == 200
        assert stored.json()["stored"] is True
        readback = client.get(route, headers=headers)
        assert readback.status_code == 200
        assert readback.json()["found"] is True
        assert readback.json()["dto"]["latest_record"]["noop_execution_probe_ready"] is True
