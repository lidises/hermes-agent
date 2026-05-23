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
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_readiness,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_contract,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_request,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record_summary,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_records,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_records,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_reviews,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviews,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_post_execution_record_readback,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_records,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_records,
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


def test_consumption_payload_readiness_projects_contract_without_materializing_payload(tmp_path):
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

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_readiness(
        actual_execution_record_store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["consumption_payload_readiness_ready"] is True
    assert dto["payload_contract_verified"] is True
    assert dto["consumption_payload_contract_ready"] is True
    assert dto["readiness_shape_version"] == "safe_consumption_payload_readiness_v1"
    assert len(dto["payload_readiness_sha256"]) == 64
    assert len(dto["payload_contract_sha256"]) == 64
    assert dto["payload_materialization_status"] == "readiness_only_no_body_materialized"
    assert dto["readiness_decision"] == "ready_for_bounded_manual_payload_materialization_review"
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
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_contract_after_readiness"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_readiness_requires_verified_contract(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_readiness(
        actual_execution_record_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["consumption_payload_readiness_ready"] is False
    assert dto["payload_contract_verified"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_contract_after_readback"


def test_consumption_payload_readiness_route_is_protected(tmp_path, monkeypatch):
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
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-readiness"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["consumption_payload_readiness_ready"] is True
        assert body["dto"]["payload_contract_verified"] is True



def test_consumption_payload_materialization_contract_projects_allowlist_without_body(tmp_path):
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

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_contract(
        actual_execution_record_store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["consumption_payload_materialization_contract_ready"] is True
    assert dto["payload_readiness_verified"] is True
    assert dto["payload_contract_verified"] is True
    assert dto["materialization_contract_shape_version"] == "safe_consumption_payload_materialization_contract_v1"
    assert len(dto["payload_materialization_contract_sha256"]) == 64
    assert dto["payload_materialization_status"] == "contract_only_no_body_materialized"
    assert dto["materialization_contract_decision"] == "ready_for_bounded_manual_body_materialization_request_contract"
    assert dto["allowed_materialization_fields"] == [
        "actual_execution_ref",
        "payload_contract_sha256",
        "payload_readiness_sha256",
        "payload_materialization_contract_sha256",
        "materialization_contract_shape_version",
        "payload_materialization_status",
        "body_ref_placeholder",
        "body_sha256_placeholder",
        "body_bytes_placeholder",
    ]
    assert dto["body_ref_placeholder"] == "future_safe_body_ref_required"
    assert dto["body_sha256_placeholder"] == "future_body_sha256_required"
    assert dto["body_bytes_placeholder"] == 0
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
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_request_after_contract"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_contract_requires_verified_readiness(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_contract(
        actual_execution_record_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["consumption_payload_materialization_contract_ready"] is False
    assert dto["payload_readiness_verified"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_readiness_after_contract"


def test_consumption_payload_materialization_contract_route_is_protected(tmp_path, monkeypatch):
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
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-contract"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["consumption_payload_materialization_contract_ready"] is True
        assert body["dto"]["payload_readiness_verified"] is True


def test_consumption_payload_materialization_request_projects_request_shape_without_body(tmp_path):
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

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_request(
        actual_execution_record_store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["consumption_payload_materialization_request_ready"] is True
    assert dto["payload_materialization_contract_verified"] is True
    assert dto["payload_readiness_verified"] is True
    assert dto["materialization_request_shape_version"] == "safe_consumption_payload_materialization_request_v1"
    assert len(dto["payload_materialization_request_sha256"]) == 64
    assert dto["payload_materialization_request_status"] == "request_only_no_body_materialized"
    assert dto["materialization_request_decision"] == "ready_for_bounded_manual_body_materialization_write_gate"
    assert dto["requested_materialization_fields"] == [
        "actual_execution_ref",
        "payload_materialization_contract_sha256",
        "payload_materialization_request_sha256",
        "body_ref_placeholder",
        "body_sha256_placeholder",
        "body_bytes_placeholder",
    ]
    assert dto["body_ref_placeholder"] == "future_safe_body_ref_required"
    assert dto["body_sha256_placeholder"] == "future_body_sha256_required"
    assert dto["body_bytes_placeholder"] == 0
    assert dto["manual_body_materialization_required"] is True
    assert dto["payload_body_materialization_enabled"] is False
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
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_write_gate_after_request"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_request_requires_contract(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_request(
        actual_execution_record_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["consumption_payload_materialization_request_ready"] is False
    assert dto["payload_materialization_contract_verified"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_contract_after_readiness"


def test_consumption_payload_materialization_write_gate_projects_gate_without_body_write(tmp_path):
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

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=record_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["consumption_payload_materialization_write_gate_ready"] is True
    assert dto["payload_materialization_request_verified"] is True
    assert dto["payload_materialization_contract_verified"] is True
    assert dto["payload_readiness_verified"] is True
    assert dto["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert dto["materialization_write_gate_shape_version"] == "safe_consumption_payload_materialization_write_gate_v1"
    assert len(dto["payload_materialization_write_gate_sha256"]) == 64
    assert len(dto["payload_materialization_request_sha256"]) == 64
    assert len(dto["payload_materialization_contract_sha256"]) == 64
    assert dto["payload_materialization_write_gate_status"] == "write_gate_only_no_body_materialized"
    assert dto["materialization_write_gate_decision"] == "ready_for_bounded_manual_body_materialization_record"
    assert dto["body_ref_placeholder"] == "future_safe_body_ref_required"
    assert dto["body_sha256_placeholder"] == "future_body_sha256_required"
    assert dto["body_bytes_placeholder"] == 0
    assert dto["manual_body_materialization_required"] is True
    assert dto["payload_body_materialization_write_gate_open"] is True
    assert dto["payload_body_materialization_enabled"] is False
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
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_after_write_gate"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_write_gate_requires_request(tmp_path):
    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=tmp_path / "missing.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["consumption_payload_materialization_write_gate_ready"] is False
    assert dto["payload_materialization_request_verified"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_request_after_contract"


def test_consumption_payload_materialization_request_route_is_protected(tmp_path, monkeypatch):
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
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-request"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["consumption_payload_materialization_request_ready"] is True
        assert body["dto"]["payload_materialization_contract_verified"] is True


def test_consumption_payload_materialization_write_gate_route_is_protected(tmp_path, monkeypatch):
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
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-write-gate"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["consumption_payload_materialization_write_gate_ready"] is True
        assert body["dto"]["payload_materialization_request_verified"] is True


def _payload_materialization_record_payload(write_gate):
    return {
        "payload_materialization_record_ref": "payloadmat-20260522103000-test0001",
        "actual_execution_ref": write_gate["actual_execution_ref"],
        "payload_materialization_write_gate_sha256": write_gate["payload_materialization_write_gate_sha256"],
        "payload_materialization_request_sha256": write_gate["payload_materialization_request_sha256"],
        "payload_materialization_contract_sha256": write_gate["payload_materialization_contract_sha256"],
        "payload_readiness_sha256": write_gate["payload_readiness_sha256"],
        "body_ref": "bodyref-20260522103000-test0001",
        "body_sha256": "1" * 64,
        "body_bytes": 128,
        "materialization_result_status": "metadata_only_body_materialization_recorded_no_body_payload",
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-22T10:30:00Z",
        "safe_summary": "Metadata-only payload materialization record; no markdown/body payload included.",
        "evidence_refs": ["test:payloadmat", "writegate:test"],
        "markdown_body": "must" + "-not-echo",
        "write_payload": {"body": "must" + "-not-echo"},
        "raw_root_path": "/vol" + "ume1/private",
        "credential_value": "sk" + "-test-secret",
    }


def test_consumption_payload_materialization_record_write_readback_is_metadata_only(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["payload_materialization_recorded"] is True
    assert dto["payload_materialization_record_ready"] is True
    assert dto["write_gate_verified"] is True
    assert dto["actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert dto["payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["body_ref"] == "bodyref-20260522103000-test0001"
    assert len(dto["body_sha256"]) == 64
    assert len(dto["payload_materialization_record_sha256"]) == 64
    assert dto["body_bytes"] == 128
    assert dto["materialization_result_status"] == "metadata_only_body_materialization_recorded_no_body_payload"
    assert dto["payload_body_materialization_recorded"] is True
    assert dto["payload_body_materialization_enabled"] is False
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
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_readback_after_write"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_records(
        store_path=materialization_store,
        payload_materialization_record_ref="payloadmat-20260522103000-test0001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert readback["dto"]["actual_downstream_consumption_executed"] is False


def test_consumption_payload_materialization_record_rejects_write_gate_mismatch(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    payload = _payload_materialization_record_payload(write_gate)
    payload["payload_materialization_write_gate_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        payload,
        actual_execution_record_store_path=actual_store,
        store_path=tmp_path / "payload_materialization_records.jsonl",
    )

    assert result["stored"] is False
    assert {error["code"] for error in result["errors"]} >= {"materialization_write_gate_mismatch"}


def test_consumption_payload_materialization_record_route_is_protected_and_roundtrips(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_actual_execution_record_store_path", lambda: actual_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_record_store_path", lambda: materialization_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-records"
    with TestClient(app) as client:
        assert client.post(route, json=_payload_materialization_record_payload(write_gate)).status_code == 401
        stored = client.post(route, json=_payload_materialization_record_payload(write_gate), headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert stored.status_code == 200
        assert stored.json()["stored"] is True
        assert stored.json()["dto"]["payload_materialization_recorded"] is True
        readback = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        assert readback.json()["dto"]["record_count"] == 1


def test_consumption_payload_materialization_record_summary_is_safe_read_only_projection(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record_summary(
        store_path=materialization_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record_summary"
    assert dto["payload_materialization_record_summary_ready"] is True
    assert dto["record_count"] == 1
    assert dto["skipped_count"] == 0
    assert dto["latest_payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["latest_actual_execution_ref"] == "actualexec-20260522100100-test0001"
    assert dto["latest_body_ref"] == "bodyref-20260522103000-test0001"
    assert dto["body_bytes_total"] == 128
    assert dto["unique_actual_execution_ref_count"] == 1
    assert dto["unique_body_ref_count"] == 1
    assert len(dto["latest_payload_materialization_record_sha256"]) == 64
    assert dto["all_records_metadata_only"] is True
    assert dto["all_write_gates_verified"] is True
    assert dto["payload_body_materialization_enabled"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_summary_review_after_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_record_summary_route_is_protected(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_record_store_path", lambda: materialization_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-record-summary"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_record_summary_ready"] is True
        assert body["dto"]["record_count"] == 1
        assert body["dto"]["records_included"] is False


def test_consumption_payload_materialization_summary_review_gate_verifies_summary_without_records(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate(
        store_path=materialization_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate"
    assert dto["payload_materialization_summary_review_gate_ready"] is True
    assert dto["source_summary_verified"] is True
    assert dto["summary_readiness_verified"] is True
    assert dto["aggregate_counts_verified"] is True
    assert dto["metadata_only_flags_verified"] is True
    assert dto["write_gate_summary_verified"] is True
    assert dto["safe_latest_refs_verified"] is True
    assert dto["review_gate_decision"] == "ready_for_bounded_manual_payload_materialization_review_gate_only"
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert dto["latest_payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["payload_body_materialization_enabled"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_route_is_protected(tmp_path, monkeypatch):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_record_store_path", lambda: materialization_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_ready"] is True
        assert body["dto"]["source_summary_verified"] is True
        assert body["dto"]["records_included"] is False
        assert body["dto"]["latest_record_included"] is False



def _seed_payload_materialization_record(tmp_path):
    _probe, probe_store = _seed_noop_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_execution_contract(
        noop_execution_probe_store_path=probe_store,
    )["dto"]
    actual_store = tmp_path / "actual_execution_records.jsonl"
    materialization_store = tmp_path / "payload_materialization_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record(
        _execution_payload(contract),
        noop_execution_probe_store_path=probe_store,
        store_path=actual_store,
    )
    write_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_consumption_payload_materialization_write_gate(
        actual_execution_record_store_path=actual_store,
    )["dto"]
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record(
        _payload_materialization_record_payload(write_gate),
        actual_execution_record_store_path=actual_store,
        store_path=materialization_store,
    )
    return materialization_store


def _summary_review_gate_record_payload(review_gate):
    return {
        "summary_review_gate_record_ref": "summaryreview-20260522104000-test0001",
        "payload_materialization_summary_review_gate_sha256": review_gate["payload_materialization_summary_review_gate_sha256"],
        "review_gate_decision": review_gate["review_gate_decision"],
        "source_record_count": review_gate["source_record_count"],
        "source_body_bytes_total": review_gate["source_body_bytes_total"],
        "latest_payload_materialization_record_ref": review_gate["latest_payload_materialization_record_ref"],
        "latest_actual_execution_ref": review_gate["latest_actual_execution_ref"],
        "latest_body_ref": review_gate["latest_body_ref"],
        "latest_payload_materialization_record_sha256": review_gate["latest_payload_materialization_record_sha256"],
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-22T10:40:00Z",
        "safe_summary": "Metadata-only summary review gate record; no payload body materialized.",
        "evidence_refs": ["test:summary-review", "payloadmat:test"],
        "records": [{"markdown_body": "must" + "-not-echo"}],
        "latest_record": {"raw_root_path": "/vol" + "ume1/private"},
        "write_payload": {"secret": "sk" + "-test-secret"},
    }


def test_consumption_payload_materialization_summary_review_gate_record_write_readback_is_metadata_only(tmp_path):
    materialization_store = _seed_payload_materialization_record(tmp_path)
    review_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate(
        store_path=materialization_store,
    )["dto"]
    record_store = tmp_path / "summary_review_gate_records.jsonl"

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record(
        _summary_review_gate_record_payload(review_gate),
        payload_materialization_record_store_path=materialization_store,
        store_path=record_store,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["payload_materialization_summary_review_gate_recorded"] is True
    assert dto["payload_materialization_summary_review_gate_record_ready"] is True
    assert dto["source_review_gate_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert dto["latest_payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert len(dto["payload_materialization_summary_review_gate_record_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["payload_body_materialization_enabled"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_records(
        store_path=record_store,
        summary_review_gate_record_ref="summaryreview-20260522104000-test0001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert readback["dto"]["actual_downstream_consumption_executed"] is False


def test_consumption_payload_materialization_summary_review_gate_record_route_is_protected_and_roundtrips(tmp_path, monkeypatch):
    materialization_store = _seed_payload_materialization_record(tmp_path)
    review_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate(
        store_path=materialization_store,
    )["dto"]
    record_store = tmp_path / "summary_review_gate_records.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_record_store_path", lambda: materialization_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-records"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        post = client.post(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN}, json=_summary_review_gate_record_payload(review_gate))
        assert post.status_code == 200
        assert post.json()["stored"] is True
        assert post.json()["dto"]["payload_materialization_summary_review_gate_record_ready"] is True
        readback = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        assert readback.json()["found"] is True
        assert readback.json()["dto"]["record_count"] == 1



def _seed_summary_review_gate_record(tmp_path):
    materialization_store = _seed_payload_materialization_record(tmp_path)
    review_gate = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate(
        store_path=materialization_store,
    )["dto"]
    record_store = tmp_path / "summary_review_gate_records.jsonl"
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record(
        _summary_review_gate_record_payload(review_gate),
        payload_materialization_record_store_path=materialization_store,
        store_path=record_store,
    )
    return record_store


def test_consumption_payload_materialization_summary_review_gate_record_readback_verifies_latest_record_metadata_only(tmp_path):
    record_store = _seed_summary_review_gate_record(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback(
        store_path=record_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_verified"] is True
    assert dto["source_record_readback_verified"] is True
    assert dto["record_checksum_verified"] is True
    assert dto["source_review_gate_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["aggregate_counts_verified"] is True
    assert dto["review_gate_decision_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert dto["latest_payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert len(dto["payload_materialization_summary_review_gate_sha256"]) == 64
    assert len(dto["payload_materialization_summary_review_gate_record_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_route_is_protected(tmp_path, monkeypatch):
    record_store = _seed_summary_review_gate_record(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False



def test_consumption_payload_materialization_summary_review_gate_record_readback_review_is_read_only_metadata(tmp_path):
    record_store = _seed_summary_review_gate_record(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        store_path=record_store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_ready"] is True
    assert dto["source_readback_verification_reviewed"] is True
    assert dto["checksum_review_passed"] is True
    assert dto["safe_ref_review_passed"] is True
    assert dto["aggregate_count_review_passed"] is True
    assert dto["decision_review_passed"] is True
    assert dto["disabled_flag_review_passed"] is True
    assert dto["review_outcome"] == "ready_for_manual_readback_review_only_no_consumption"
    assert dto["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert dto["latest_payload_materialization_record_ref"] == "payloadmat-20260522103000-test0001"
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert len(dto["payload_materialization_summary_review_gate_record_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_record"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_route_is_protected(tmp_path, monkeypatch):
    record_store = _seed_summary_review_gate_record(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_ready"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False



def _readback_review_record_payload(review):
    return {
        "summary_review_gate_record_readback_review_record_ref": "reviewrecord-20260522105000-test0001",
        "summary_review_gate_record_ref": review["summary_review_gate_record_ref"],
        "payload_materialization_summary_review_gate_record_sha256": review["payload_materialization_summary_review_gate_record_sha256"],
        "review_outcome": review["review_outcome"],
        "source_readback_verification_reviewed": review["source_readback_verification_reviewed"],
        "checksum_review_passed": review["checksum_review_passed"],
        "safe_ref_review_passed": review["safe_ref_review_passed"],
        "aggregate_count_review_passed": review["aggregate_count_review_passed"],
        "decision_review_passed": review["decision_review_passed"],
        "disabled_flag_review_passed": review["disabled_flag_review_passed"],
        "source_record_count": review["source_record_count"],
        "source_body_bytes_total": review["source_body_bytes_total"],
        "latest_payload_materialization_record_ref": review["latest_payload_materialization_record_ref"],
        "latest_actual_execution_ref": review["latest_actual_execution_ref"],
        "latest_body_ref": review["latest_body_ref"],
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-22T10:50:00Z",
        "safe_summary": "Metadata-only readback review record; no downstream consumption performed.",
        "evidence_refs": ["test:readback-review-record", "summaryreview:test"],
        "markdown_body": "must" + "-not-echo",
        "raw_root_path": "/vol" + "ume1/private",
        "credential_value": "sk" + "-test-secret",
    }


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_record_is_metadata_only(tmp_path):
    source_store = _seed_summary_review_gate_record(tmp_path)
    review = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "summary_review_gate_readback_review_records.jsonl"

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record(
        _readback_review_record_payload(review),
        summary_review_gate_record_store_path=source_store,
        store_path=store,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_recorded"] is True
    assert dto["readback_review_record_ready"] is True
    assert dto["source_readback_review_verified"] is True
    assert dto["summary_review_gate_record_readback_review_record_ref"] == "reviewrecord-20260522105000-test0001"
    assert dto["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert dto["review_outcome"] == "ready_for_manual_readback_review_only_no_consumption"
    assert dto["checksum_review_passed"] is True
    assert dto["safe_ref_review_passed"] is True
    assert dto["aggregate_count_review_passed"] is True
    assert dto["decision_review_passed"] is True
    assert dto["disabled_flag_review_passed"] is True
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert len(dto["summary_review_gate_record_readback_review_record_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_records(store_path=store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["summary_review_gate_record_readback_review_record_ref"] == "reviewrecord-20260522105000-test0001"


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_record_route_is_protected(tmp_path, monkeypatch):
    source_store = _seed_summary_review_gate_record(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_store_path", lambda: source_store)
    review = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "summary_review_gate_readback_review_records.jsonl"
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-records"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.post(route, json=_readback_review_record_payload(review), headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        assert response.json()["stored"] is True
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["latest_record"]["readback_review_record_ready"] is True
        assert body["latest_record"]["actual_downstream_consumption_executed"] is False



def _seed_readback_review_record(tmp_path):
    source_store = _seed_summary_review_gate_record(tmp_path)
    review = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "summary_review_gate_readback_review_records.jsonl"
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record(
        _readback_review_record_payload(review),
        summary_review_gate_record_store_path=source_store,
        store_path=store,
    )
    assert stored["stored"] is True
    return store, stored["dto"]


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback_is_metadata_only(tmp_path):
    store, stored_record = _seed_readback_review_record(tmp_path)

    readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback(
        store_path=store,
    )

    assert readback["found"] is True
    dto = readback["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_record_readback_verified"] is True
    assert dto["source_readback_review_record_verified"] is True
    assert dto["record_checksum_verified"] is True
    assert dto["source_review_record_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["aggregate_counts_verified"] is True
    assert dto["review_outcome_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["summary_review_gate_record_readback_review_record_ref"] == stored_record["summary_review_gate_record_readback_review_record_ref"]
    assert dto["summary_review_gate_record_ref"] == "summaryreview-20260522104000-test0001"
    assert len(dto["summary_review_gate_record_readback_review_record_sha256"]) == 64
    assert dto["review_outcome"] == "ready_for_manual_readback_review_only_no_consumption"
    assert dto["source_record_count"] == 1
    assert dto["source_body_bytes_total"] == 128
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback_route_is_protected(tmp_path, monkeypatch):
    store, _stored_record = _seed_readback_review_record(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-record-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_record_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_is_metadata_only(tmp_path):
    source_store, source_record = _seed_readback_review_record(tmp_path)
    store = tmp_path / "readback-review-attestations.jsonl"
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback(
        store_path=source_store,
    )["dto"]

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        {
            "readback_review_attestation_ref": "readbackreview-20260523031000-test0001",
            "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
            "summary_review_gate_record_readback_review_record_sha256": source_readback["summary_review_gate_record_readback_review_record_sha256"],
            "payload_materialization_summary_review_gate_record_sha256": source_readback["payload_materialization_summary_review_gate_record_sha256"],
            "manual_attestation_outcome": "attested_for_manual_review_only_no_consumption",
            "readback_verified": True,
            "source_checksum_attested": True,
            "safe_ref_chain_attested": True,
            "aggregate_counts_attested": True,
            "disabled_capabilities_attested": True,
            "attested_by": "operator:test",
            "attested_at": "2026-05-23T03:10:00Z",
            "safe_summary": "Manual attestation over verified readback only; no payload body materialization or downstream consumption.",
            "evidence_refs": ["test:attestation", "readback:test"],
            "markdown_body": "must" + "-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        readback_review_record_store_path=source_store,
        store_path=store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attested"] is True
    assert dto["source_readback_review_record_readback_verified"] is True
    assert dto["readback_review_attestation_ref"] == "readbackreview-20260523031000-test0001"
    assert dto["summary_review_gate_record_readback_review_record_ref"] == source_record["summary_review_gate_record_readback_review_record_ref"]
    assert len(dto["readback_review_attestation_sha256"]) == 64
    assert dto["manual_attestation_outcome"] == "attested_for_manual_review_only_no_consumption"
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_reviews(
        store_path=store,
    )
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["readback_review_attestation_ref"] == "readbackreview-20260523031000-test0001"


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_route_is_protected(tmp_path, monkeypatch):
    source_store, _source_record = _seed_readback_review_record(tmp_path)
    store = tmp_path / "readback-review-attestations.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_store_path", lambda: source_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_store_path", lambda: store)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback(
        store_path=source_store,
    )["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestations"
    payload = {
        "readback_review_attestation_ref": "readbackreview-20260523031200-route0001",
        "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
        "summary_review_gate_record_readback_review_record_sha256": source_readback["summary_review_gate_record_readback_review_record_sha256"],
        "payload_materialization_summary_review_gate_record_sha256": source_readback["payload_materialization_summary_review_gate_record_sha256"],
        "manual_attestation_outcome": "attested_for_manual_review_only_no_consumption",
        "readback_verified": True,
        "source_checksum_attested": True,
        "safe_ref_chain_attested": True,
        "aggregate_counts_attested": True,
        "disabled_capabilities_attested": True,
        "attested_by": "operator:route",
        "attested_at": "2026-05-23T03:12:00Z",
        "safe_summary": "Route attestation over safe metadata readback only.",
        "evidence_refs": ["route:attestation"],
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        post = client.post(route, json=payload, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert post.status_code == 200
        assert post.json()["stored"] is True
        response = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["latest_record"]["payload_materialization_summary_review_gate_record_readback_review_attested"] is True
        assert body["latest_record"]["actual_downstream_consumption_executed"] is False


def _seed_readback_review_attestation(tmp_path):
    source_store, source_record = _seed_readback_review_record(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "readback-review-attestations.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review(
        {
            "readback_review_attestation_ref": "readbackreview-20260523035000-seed0001",
            "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
            "summary_review_gate_record_readback_review_record_sha256": source_readback["summary_review_gate_record_readback_review_record_sha256"],
            "payload_materialization_summary_review_gate_record_sha256": source_readback["payload_materialization_summary_review_gate_record_sha256"],
            "manual_attestation_outcome": "attested_for_manual_review_only_no_consumption",
            "readback_verified": True,
            "source_checksum_attested": True,
            "safe_ref_chain_attested": True,
            "aggregate_counts_attested": True,
            "disabled_capabilities_attested": True,
            "attested_by": "operator:seed",
            "attested_at": "2026-05-23T03:50:00Z",
            "safe_summary": "Seeded attestation over verified metadata-only readback.",
            "evidence_refs": ["seed:attestation", "readback:seed"],
            "markdown_body": "must" + "-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        readback_review_record_store_path=source_store,
        store_path=store,
    )
    assert result["stored"] is True
    return store, result["dto"]


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_is_metadata_only(tmp_path):
    store, attestation = _seed_readback_review_attestation(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback(
        store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified"] is True
    assert dto["source_readback_review_attestation_verified"] is True
    assert dto["attestation_checksum_verified"] is True
    assert dto["source_review_record_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["manual_attestation_outcome_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["readback_review_attestation_ref"] == attestation["readback_review_attestation_ref"]
    assert len(dto["readback_review_attestation_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_route_is_protected(tmp_path, monkeypatch):
    store, _attestation = _seed_readback_review_attestation(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False
        assert body["dto"]["records_included"] is False
        assert body["dto"]["latest_record_included"] is False



def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_is_metadata_only(tmp_path):
    source_store, _attestation = _seed_readback_review_attestation(tmp_path)
    store = tmp_path / "attestation-readback-reviews.jsonl"
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback(
        store_path=source_store,
    )["dto"]

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review(
        {
            "readback_review_attestation_readback_review_ref": "attestationreadbackreview-20260523051000-test0001",
            "readback_review_attestation_ref": source_readback["readback_review_attestation_ref"],
            "readback_review_attestation_sha256": source_readback["readback_review_attestation_sha256"],
            "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
            "manual_review_outcome": "reviewed_attestation_readback_for_manual_only_no_consumption",
            "attestation_readback_verified": True,
            "source_checksum_reviewed": True,
            "safe_ref_chain_reviewed": True,
            "disabled_capabilities_reviewed": True,
            "reviewed_by": "operator:test",
            "reviewed_at": "2026-05-23T05:10:00Z",
            "safe_summary": "Manual review over verified attestation readback only; no payload materialization or downstream consumption.",
            "evidence_refs": ["test:attestation-readback-review"],
            "markdown_body": "must" + "-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        attestation_readback_store_path=source_store,
        store_path=store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviewed"] is True
    assert dto["source_attestation_readback_verified"] is True
    assert dto["readback_review_attestation_ref"] == source_readback["readback_review_attestation_ref"]
    assert len(dto["attestation_readback_review_sha256"]) == 64
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviews(store_path=store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviewed"] is True


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_route_is_protected(tmp_path, monkeypatch):
    source_store, _attestation = _seed_readback_review_attestation(tmp_path)
    store = tmp_path / "attestation-readback-reviews.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_store_path", lambda: source_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_store_path", lambda: store)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback(store_path=source_store)["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-reviews"
    payload = {
        "readback_review_attestation_readback_review_ref": "attestationreadbackreview-20260523051200-route0001",
        "readback_review_attestation_ref": source_readback["readback_review_attestation_ref"],
        "readback_review_attestation_sha256": source_readback["readback_review_attestation_sha256"],
        "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
        "manual_review_outcome": "reviewed_attestation_readback_for_manual_only_no_consumption",
        "attestation_readback_verified": True,
        "source_checksum_reviewed": True,
        "safe_ref_chain_reviewed": True,
        "disabled_capabilities_reviewed": True,
        "reviewed_by": "operator:route",
        "reviewed_at": "2026-05-23T05:12:00Z",
        "safe_summary": "Route review over safe attestation readback only.",
        "evidence_refs": ["route:attestation-readback-review"],
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviewed"] is True
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["actual_downstream_consumption_executed"] is False
