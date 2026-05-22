"""Tests for bounded actual execution record after contract."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_contract import (
    _seed_noop_probe,
)
from hermes_cli.office_controlled_mutation import (
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_contract,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_post_execution_record_readback,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_records,
)
from hermes_cli.web_server import _SESSION_TOKEN, app


def _execution_payload(contract):
    return {
        "actual_execution_ref": "actualexec-20260522100100-test0001",
        "noop_execution_probe_ref": contract["noop_execution_probe_ref"],
        "noop_execution_probe_record_sha256": contract["noop_execution_probe_record_sha256"],
        "execution_contract_sha256": contract["execution_contract_sha256"],
        "operator_confirmation_ref": "operatorconfirm-20260522100100-test0001",
        "execution_result_status": "metadata_only_execution_recorded_no_consumption",
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-22T10:01:00Z",
        "safe_summary": "Metadata-only actual execution record; no downstream consumption performed.",
        "evidence_refs": ["test:actualexec", "contract:test"],
        "markdown_body": "must-not-echo",
        "raw_root_path": "/vol" + "ume1/private",
        "credential_value": "sk" + "-test-secret",
    }


def test_actual_execution_record_write_readback_is_metadata_only(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    store = tmp_path / "actual_execution_records.jsonl"

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=store,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["actual_execution_recorded"] is True
    assert dto["actual_execution_record_ready"] is True
    assert dto["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert dto["noop_execution_probe_record_verified"] is True
    assert dto["execution_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["execution_result_status"] == "metadata_only_execution_recorded_no_consumption"
    assert len(dto["actual_execution_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_post_execution_record_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_records(
        store_path=store,
        actual_execution_ref="actualexec-20260522100100-test0001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert readback["dto"]["actual_downstream_consumption_executed"] is False


def test_actual_execution_record_rejects_contract_mismatch(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    payload = _execution_payload(contract)
    payload["execution_contract_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        payload,
        noop_execution_probe_store_path=probe_store,
        store_path=tmp_path / "records.jsonl",
    )

    assert result["stored"] is False
    assert {error["code"] for error in result["errors"]} >= {"actual_execution_contract_mismatch"}


def test_actual_execution_record_route_is_protected_and_roundtrips(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    record_store = tmp_path / "actual_execution_records.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_noop_execution_probe_record_store_path", lambda: probe_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_actual_execution_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-execution-records"
    with TestClient(app) as client:
        assert client.post(route, json=_execution_payload(contract)).status_code == 401
        stored = client.post(route, json=_execution_payload(contract), headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert stored.status_code == 200
        assert stored.json()["stored"] is True
        assert stored.json()["dto"]["actual_execution_recorded"] is True
        readback = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        assert readback.json()["dto"]["record_count"] == 1


def test_post_execution_record_readback_projects_safe_verified_record_without_consuming(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    store = tmp_path / "actual_execution_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=store,
    )

    readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_post_execution_record_readback(
        actual_execution_record_store_path=store,
    )

    assert readback["found"] is True
    dto = readback["dto"]
    assert dto["post_execution_record_readback_ready"] is True
    assert dto["actual_execution_record_verified"] is True
    assert dto["execution_contract_verified"] is True
    assert dto["noop_execution_probe_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert len(dto["actual_execution_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_contract_after_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text


def test_post_execution_record_readback_route_is_protected(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    record_store = tmp_path / "actual_execution_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=record_store,
    )
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_actual_execution_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-post-execution-record-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["post_execution_record_readback_ready"] is True
        assert body["dto"]["actual_execution_record_verified"] is True


def test_consumption_payload_contract_projects_safe_metadata_from_verified_readback(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    store = tmp_path / "actual_execution_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=store,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_contract(
        actual_execution_record_store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["consumption_payload_contract_ready"] is True
    assert dto["post_execution_record_readback_verified"] is True
    assert dto["actual_execution_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["payload_contract_shape_version"] == "safe_consumption_payload_contract_v1"
    assert len(dto["payload_contract_sha256"]) == 64
    assert dto["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert dto["source_actual_execution_record_sha256"] == dto["actual_execution_record_sha256"]
    assert dto["allowed_payload_fields"] == [
        "actual_execution_ref",
        "actual_execution_record_sha256",
        "execution_contract_sha256",
        "noop_execution_probe_record_sha256",
        "payload_contract_sha256",
        "payload_contract_shape_version",
        "payload_materialization_status",
    ]
    assert dto["payload_materialization_status"] == "contract_only_no_body_materialized"
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_readiness_after_contract"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_contract_requires_verified_post_execution_readback(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_contract(
        actual_execution_record_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["consumption_payload_contract_ready"] is False
    assert dto["post_execution_record_readback_verified"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_post_execution_record_readback"


def test_consumption_payload_contract_route_is_protected(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    record_store = tmp_path / "actual_execution_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=record_store,
    )
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_actual_execution_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-contract"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["consumption_payload_contract_ready"] is True
        assert body["dto"]["post_execution_record_readback_verified"] is True
