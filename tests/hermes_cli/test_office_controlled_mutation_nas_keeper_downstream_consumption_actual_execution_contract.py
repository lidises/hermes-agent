"""Tests for actual execution contract after noop execution probe."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_noop_execution_probe import (
    _probe_payload,
    _seed_opening,
)
from hermes_cli.office_controlled_mutation import (
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract,
)
from hermes_cli.web_server import _SESSION_TOKEN, app


def _seed_noop_probe(tmp_path):
    opening, opening_store = _seed_opening(tmp_path)
    probe_store = tmp_path / "noop_probe.jsonl"
    probe = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record(
        _probe_payload(opening),
        execution_opening_store_path=opening_store,
        store_path=probe_store,
    )["dto"]
    return probe, probe_store


def test_actual_execution_contract_projects_contract_only_after_noop_probe(tmp_path):
    probe, probe_store = _seed_noop_probe(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["actual_execution_contract_ready"] is True
    assert dto["noop_execution_probe_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["noop_execution_probe_ref"] == probe["noop_execution_probe_ref"]
    assert dto["noop_execution_probe_record_sha256"] == probe["noop_execution_probe_record_sha256"]
    assert dto["execution_contract_shape_version"] == "safe_actual_execution_contract_v1"
    assert dto["allowed_execution_fields"] == [
        "actual_execution_ref",
        "noop_execution_probe_ref",
        "noop_execution_probe_record_sha256",
        "execution_contract_sha256",
        "operator_confirmation_ref",
        "execution_result_status",
        "evidence_refs",
    ]
    assert len(dto["execution_contract_sha256"]) == 64
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
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_actual_execution_record_after_contract"
    text = json.dumps(dto, sort_keys=True)
    assert "must-not-echo" not in text
    assert "/volume1/private" not in text


def test_actual_execution_contract_requires_noop_probe(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    assert result["dto"]["actual_execution_contract_ready"] is False
    assert result["dto"]["downstream_consumption_enabled"] is False
    assert result["dto"]["actual_downstream_consumption_executed"] is False
    assert {error["code"] for error in result["errors"]} == {"noop_execution_probe_not_found"}


def test_actual_execution_contract_route_is_protected_and_readbacks(tmp_path, monkeypatch):
    probe, probe_store = _seed_noop_probe(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_noop_execution_probe_record_store_path", lambda: probe_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-execution-contract"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        readback = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        body = readback.json()
        assert body["found"] is True
        assert body["dto"]["actual_execution_contract_ready"] is True
        assert body["dto"]["noop_execution_probe_ref"] == probe["noop_execution_probe_ref"]
