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
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviews,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviews,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback,
    get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_write_preview_contract,
    execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval_records,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_real_nas_production_write_execution_preflight,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_real_nas_production_write_execution_preflight_records,
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


def _seed_attestation_readback_review(tmp_path):
    source_store, _attestation = _seed_readback_review_attestation(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "attestation-readback-review-records.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review(
        {
            "readback_review_attestation_readback_review_ref": "attestationreadbackreview-20260523083000-seed0001",
            "readback_review_attestation_ref": source_readback["readback_review_attestation_ref"],
            "readback_review_attestation_sha256": source_readback["readback_review_attestation_sha256"],
            "summary_review_gate_record_readback_review_record_ref": source_readback["summary_review_gate_record_readback_review_record_ref"],
            "manual_review_outcome": "reviewed_attestation_readback_for_manual_only_no_consumption",
            "attestation_readback_verified": True,
            "source_checksum_reviewed": True,
            "safe_ref_chain_reviewed": True,
            "disabled_capabilities_reviewed": True,
            "reviewed_by": "operator:seed",
            "reviewed_at": "2026-05-23T08:30:00Z",
            "safe_summary": "Seeded review over safe attestation readback only.",
            "evidence_refs": ["seed:attestation-readback-review"],
            "markdown_body": "must" + "-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        attestation_readback_store_path=source_store,
        store_path=store,
    )
    assert result["stored"] is True
    return store, result["dto"]


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_is_metadata_only(tmp_path):
    store, review = _seed_attestation_readback_review(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback(
        store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified"] is True
    assert dto["source_attestation_readback_review_verified"] is True
    assert dto["attestation_readback_review_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["manual_review_outcome_verified"] is True
    assert dto["reviewer_metadata_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["readback_review_attestation_readback_review_ref"] == review["readback_review_attestation_readback_review_ref"]
    assert len(dto["attestation_readback_review_sha256"]) == 64
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
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert '"records"' not in text
    assert '"latest_record"' not in text
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_route_is_protected(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False
        assert body["dto"]["records_included"] is False
        assert body["dto"]["latest_record_included"] is False



def _attestation_readback_review_readback_review_payload(source_readback):
    return {
        "attestation_readback_review_readback_review_ref": "attestationreadbackreviewreadbackreview-20260523113000-test0001",
        "readback_review_attestation_readback_review_ref": source_readback["readback_review_attestation_readback_review_ref"],
        "attestation_readback_review_sha256": source_readback["attestation_readback_review_sha256"],
        "readback_review_attestation_ref": source_readback["readback_review_attestation_ref"],
        "manual_review_outcome": "reviewed_attestation_readback_review_readback_for_manual_only_no_consumption",
        "attestation_readback_review_readback_verified": True,
        "source_checksum_reviewed": True,
        "safe_ref_chain_reviewed": True,
        "disabled_capabilities_reviewed": True,
        "reviewed_by": "operator:test",
        "reviewed_at": "2026-05-23T11:30:00Z",
        "safe_summary": "Manual review over verified attestation-readback-review readback only; no payload body materialization or downstream consumption.",
        "evidence_refs": ["test:attestation-readback-review-readback-review"],
        "markdown_body": "must" + "-not-echo",
        "raw_root_path": "/vol" + "ume1/private",
        "credential_value": "sk" + "-test-secret",
    }


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_is_metadata_only(tmp_path):
    source_store, review = _seed_attestation_readback_review(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "attestation-readback-review-readback-reviews.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review(
        _attestation_readback_review_readback_review_payload(source_readback),
        attestation_readback_review_store_path=source_store,
        store_path=store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviewed"] is True
    assert dto["source_attestation_readback_review_readback_verified"] is True
    assert dto["attestation_readback_review_readback_review_ref"] == "attestationreadbackreviewreadbackreview-20260523113000-test0001"
    assert dto["readback_review_attestation_readback_review_ref"] == review["readback_review_attestation_readback_review_ref"]
    assert len(dto["attestation_readback_review_readback_review_sha256"]) == 64
    assert dto["manual_review_outcome"] == "reviewed_attestation_readback_review_readback_for_manual_only_no_consumption"
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviews(store_path=store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviewed"] is True


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_route_is_protected(tmp_path, monkeypatch):
    source_store, _review = _seed_attestation_readback_review(tmp_path)
    store = tmp_path / "attestation-readback-review-readback-reviews.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_store_path", lambda: source_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_store_path", lambda: store)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback(store_path=source_store)["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-reviews"
    payload = _attestation_readback_review_readback_review_payload(source_readback)
    payload["attestation_readback_review_readback_review_ref"] = "attestationreadbackreviewreadbackreview-20260523113200-route0001"
    payload["reviewed_by"] = "operator:route"
    payload["reviewed_at"] = "2026-05-23T11:32:00Z"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviewed"] is True
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["actual_downstream_consumption_executed"] is False



def _seed_attestation_readback_review_readback_review(tmp_path):
    source_store, _review = _seed_attestation_readback_review(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "attestation-readback-review-readback-review.jsonl"
    payload = _attestation_readback_review_readback_review_payload(source_readback)
    review = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review(
        payload,
        attestation_readback_review_store_path=source_store,
        store_path=store,
    )
    assert review["stored"] is True
    return store, review["dto"]


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_is_metadata_only(tmp_path):
    store, review = _seed_attestation_readback_review_readback_review(tmp_path)

    readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback(
        store_path=store,
    )

    assert readback["found"] is True
    dto = readback["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_verified"] is True
    assert dto["source_attestation_readback_review_readback_review_verified"] is True
    assert dto["attestation_readback_review_readback_review_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["manual_review_outcome_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["attestation_readback_review_readback_review_ref"] == review["attestation_readback_review_readback_review_ref"]
    assert dto["attestation_readback_review_readback_review_sha256"] == review["attestation_readback_review_readback_review_sha256"]
    assert len(dto["attestation_readback_review_readback_review_readback_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert "records" not in dto
    assert "latest_record" not in dto
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_route_is_protected(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False
        assert "records" not in body["dto"]
        assert "latest_record" not in body["dto"]


def _attestation_readback_review_readback_review_readback_review_payload(source_readback):
    return {
        "attestation_readback_review_readback_review_readback_review_ref": "attestationreadbackreviewreadbackreviewreadbackreview-20260523143000-test0001",
        "attestation_readback_review_readback_review_ref": source_readback["attestation_readback_review_readback_review_ref"],
        "readback_review_attestation_readback_review_ref": source_readback["readback_review_attestation_readback_review_ref"],
        "readback_review_attestation_ref": source_readback["readback_review_attestation_ref"],
        "attestation_readback_review_readback_review_sha256": source_readback["attestation_readback_review_readback_review_sha256"],
        "attestation_readback_review_readback_review_readback_sha256": source_readback["attestation_readback_review_readback_review_readback_sha256"],
        "manual_review_outcome": "reviewed_attestation_readback_review_readback_review_readback_for_manual_only_no_consumption",
        "attestation_readback_review_readback_review_readback_verified": True,
        "source_checksum_reviewed": True,
        "safe_ref_chain_reviewed": True,
        "disabled_capabilities_reviewed": True,
        "reviewed_by": "operator:test",
        "reviewed_at": "2026-05-23T14:30:00Z",
        "safe_summary": "Metadata-only manual review of readback over attestation review review; no downstream consumption.",
        "evidence_refs": ["test:attestation-review-review-readback", "test:no-consumption"],
        "markdown_body": "must" + "-not-echo",
        "raw_root_path": "/vol" + "ume1/private",
        "credential_value": "sk" + "-test-secret",
    }


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_is_metadata_only(tmp_path):
    source_store, _review = _seed_attestation_readback_review_readback_review(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "attestation-readback-review-readback-review-readback-reviews.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review(
        _attestation_readback_review_readback_review_readback_review_payload(source_readback),
        attestation_readback_review_readback_review_store_path=source_store,
        store_path=store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviewed"] is True
    assert dto["source_attestation_readback_review_readback_review_readback_verified"] is True
    assert dto["attestation_readback_review_readback_review_readback_review_ref"] == "attestationreadbackreviewreadbackreviewreadbackreview-20260523143000-test0001"
    assert dto["attestation_readback_review_readback_review_ref"] == source_readback["attestation_readback_review_readback_review_ref"]
    assert len(dto["attestation_readback_review_readback_review_readback_review_sha256"]) == 64
    assert dto["manual_review_outcome"] == "reviewed_attestation_readback_review_readback_review_readback_for_manual_only_no_consumption"
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviews(store_path=store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviewed"] is True


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_route_is_protected(tmp_path, monkeypatch):
    source_store, _review = _seed_attestation_readback_review_readback_review(tmp_path)
    store = tmp_path / "attestation-readback-review-readback-review-readback-reviews.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_store_path", lambda: source_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback(store_path=source_store)["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-reviews"
    payload = _attestation_readback_review_readback_review_readback_review_payload(source_readback)
    payload["attestation_readback_review_readback_review_readback_review_ref"] = "attestationreadbackreviewreadbackreviewreadbackreview-20260523143200-route0001"
    payload["reviewed_by"] = "operator:route"
    payload["reviewed_at"] = "2026-05-23T14:32:00Z"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviewed"] is True
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["actual_downstream_consumption_executed"] is False
        assert "records" in listed



def _seed_attestation_readback_review_readback_review_readback_review(tmp_path):
    source_store, _review = _seed_attestation_readback_review_readback_review(tmp_path)
    source_readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback(
        store_path=source_store,
    )["dto"]
    store = tmp_path / "attestation-readback-review-readback-review-readback-reviews.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review(
        _attestation_readback_review_readback_review_readback_review_payload(source_readback),
        attestation_readback_review_readback_review_store_path=source_store,
        store_path=store,
    )
    assert result["stored"] is True
    return store, result["dto"]


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_is_metadata_only(tmp_path):
    store, review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)

    readback = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback(
        store_path=store,
    )

    assert readback["found"] is True
    dto = readback["dto"]
    assert dto["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_verified"] is True
    assert dto["source_attestation_readback_review_readback_review_readback_review_verified"] is True
    assert dto["attestation_readback_review_readback_review_readback_review_checksum_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["manual_review_outcome_verified"] is True
    assert dto["disabled_capability_flags_verified"] is True
    assert dto["attestation_readback_review_readback_review_readback_review_ref"] == review["attestation_readback_review_readback_review_readback_review_ref"]
    assert dto["attestation_readback_review_readback_review_readback_review_sha256"] == review["attestation_readback_review_readback_review_readback_review_sha256"]
    assert len(dto["attestation_readback_review_readback_review_readback_review_readback_sha256"]) == 64
    assert dto["records_included"] is False
    assert dto["latest_record_included"] is False
    assert "records" not in dto
    assert "latest_record" not in dto
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_review"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text


def test_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_route_is_protected(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_verified"] is True
        assert body["dto"]["actual_downstream_consumption_executed"] is False
        assert "records" not in body["dto"]
        assert "latest_record" not in body["dto"]



def test_consumption_payload_write_preview_contract_moves_toward_write_without_body_materialization(tmp_path):
    store, review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_write_preview_contract(
        attestation_readback_review_readback_review_readback_review_store_path=store,
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["payload_write_preview_contract_ready"] is True
    assert dto["write_readiness_stage"] == "payload_write_preview_contract"
    assert dto["write_readiness_percent"] >= 70
    assert dto["source_readback_verified"] is True
    assert dto["payload_preview_ref"].startswith("payloadpreview-")
    assert dto["write_payload_preview_ref"].startswith("writepayloadpreview-")
    assert len(dto["payload_preview_sha256"]) == 64
    assert len(dto["write_payload_preview_sha256"]) == 64
    assert dto["source_attestation_readback_review_readback_review_readback_review_ref"] == review["attestation_readback_review_readback_review_readback_review_ref"]
    assert dto["payload_body_materialization_enabled"] is False
    assert dto["payload_body_materialized"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["write_payload_materialized"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["mac_relay_tmp_root_write_smoke_enabled"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_payload_write_preview"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text
    assert "markdown_body" not in dto
    assert "write_payload" not in dto


def test_consumption_payload_write_preview_contract_route_is_protected(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract"
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        response = client.get(route, headers={"X-Hermes-" + "Session-Token": globals()["_" + "SESSION_" + "TOKEN"]})
        assert response.status_code == 200
        body = response.json()
        assert body["found"] is True
        assert body["dto"]["payload_write_preview_contract_ready"] is True
        assert body["dto"]["write_payload_included"] is False
        assert "records" not in body["dto"]
        assert "latest_record" not in body["dto"]



def test_mac_relay_tmp_root_write_smoke_after_payload_preview_writes_only_tmp_root_metadata(tmp_path):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    record_store = tmp_path / "tmp-root-write-smoke-records.jsonl"
    root = tmp_path / "tmp-relay-root"

    result = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524021500-test0001", "requested_by": "operator:test", "requested_at": "2026-05-24T02:15:00Z"},
        attestation_readback_review_readback_review_readback_review_store_path=store,
        store_path=record_store,
        root_path=root,
    )

    assert result["written"] is True
    assert result["recorded"] is True
    dto = result["dto"]
    assert dto["tmp_root_write_smoke_ref"] == "tmprootsmoke-20260524021500-test0001"
    assert dto["payload_write_preview_contract_verified"] is True
    assert dto["mac_relay_tmp_root_write_smoke_enabled"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["tmp_root_audit_written"] is True
    assert len(dto["tmp_root_readback_sha256"]) == 64
    assert len(dto["idempotency_key_sha256"]) == 64
    assert dto["payload_body_materialized"] is True
    assert dto["payload_body_materialization_scope"] == "internal_tmp_root_smoke_only"
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["write_payload_materialized"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke"
    assert "tmp_relay_root" not in json.dumps(dto, sort_keys=True)
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text
    assert (root / "tmprootvault" / "fresh-request-builder-tmp-root-smoke.md").exists()

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke_records(store_path=record_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["tmp_root_readback_verified"] is True
    assert "records" in listed


def test_mac_relay_tmp_root_write_smoke_route_is_protected_and_records(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    record_store = tmp_path / "tmp-root-write-smoke-route-records.jsonl"
    root = tmp_path / "route-root"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_record_store_path", lambda: record_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_root_path", lambda: root)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke"
    payload = {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524021600-route0001", "requested_by": "operator:route", "requested_at": "2026-05-24T02:16:00Z"}
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["written"] is True
        assert body["dto"]["tmp_root_readback_verified"] is True
        assert body["dto"]["markdown_body_included"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["mac_relay_tmp_root_write_smoke_executed"] is True


def test_replay_idempotency_metadata_after_tmp_root_write_smoke_records_safe_checkpoint(tmp_path):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    tmp_root_store = tmp_path / "tmp-root-write-smoke-records.jsonl"
    replay_store = tmp_path / "replay-idempotency-metadata-records.jsonl"
    root = tmp_path / "tmp-relay-root"
    smoke = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524024000-replay01", "requested_by": "operator:test", "requested_at": "2026-05-24T02:40:00Z"},
        attestation_readback_review_readback_review_readback_review_store_path=store,
        store_path=tmp_root_store,
        root_path=root,
    )["dto"]

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata(
        {
            "replay_idempotency_metadata_ref": "replayidem-20260524024100-test0001",
            "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
            "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
            "idempotency_key_sha256": smoke["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T02:41:00Z",
            "markdown_body": "must-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        tmp_root_write_smoke_store_path=tmp_root_store,
        store_path=replay_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["replay_idempotency_metadata_ready"] is True
    assert dto["source_tmp_root_write_smoke_verified"] is True
    assert dto["source_tmp_root_readback_verified"] is True
    assert dto["source_idempotency_key_verified"] is True
    assert dto["idempotency_metadata_recorded"] is True
    assert dto["idempotency_replay_store_written"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["write_readiness_stage"] == "replay_idempotency_metadata_after_tmp_root_write_smoke"
    assert dto["write_readiness_percent"] == 86
    assert len(dto["replay_idempotency_metadata_sha256"]) == 64
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_readback_after_tmp_root_write_smoke"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata(
        {
            "replay_idempotency_metadata_ref": "replayidem-20260524024100-test0001",
            "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
            "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
            "idempotency_key_sha256": smoke["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T02:41:00Z",
        },
        tmp_root_write_smoke_store_path=tmp_root_store,
        store_path=replay_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_metadata_write_skipped"] is True

    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata_records(store_path=replay_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1
    assert listed["latest_record"]["replay_idempotency_metadata_ready"] is True
    assert listed["latest_record"]["idempotency_replayed"] is False


def test_replay_idempotency_metadata_route_is_protected_and_records(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    tmp_root_store = tmp_path / "tmp-root-write-smoke-route-records.jsonl"
    replay_store = tmp_path / "replay-idempotency-metadata-route-records.jsonl"
    root = tmp_path / "route-root"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_record_store_path", lambda: tmp_root_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_root_path", lambda: root)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_replay_idempotency_metadata_record_store_path", lambda: replay_store)
    smoke = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524024200-route001", "requested_by": "operator:route", "requested_at": "2026-05-24T02:42:00Z"},
    )["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata"
    payload = {
        "replay_idempotency_metadata_ref": "replayidem-20260524024300-route001",
        "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
        "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
        "idempotency_key_sha256": smoke["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T02:43:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["replay_idempotency_metadata_ready"] is True
        assert body["dto"]["real_replay_store_written"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_tmp_root_write_smoke_verified"] is True


def test_mac_relay_precommit_metadata_after_replay_idempotency_records_safe_write_readiness(tmp_path):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    tmp_root_store = tmp_path / "tmp-root-write-smoke-precommit-records.jsonl"
    replay_store = tmp_path / "replay-idempotency-precommit-records.jsonl"
    precommit_store = tmp_path / "mac-relay-precommit-metadata-records.jsonl"
    smoke = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524031000-precom1", "requested_by": "operator:test", "requested_at": "2026-05-24T03:10:00Z"},
        attestation_readback_review_readback_review_readback_review_store_path=store,
        store_path=tmp_root_store,
        root_path=tmp_path / "precommit-root",
    )["dto"]
    replay = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata(
        {
            "replay_idempotency_metadata_ref": "replayidem-20260524031100-precom1",
            "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
            "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
            "idempotency_key_sha256": smoke["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T03:11:00Z",
        },
        tmp_root_write_smoke_store_path=tmp_root_store,
        store_path=replay_store,
    )["dto"]

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata(
        {
            "mac_relay_precommit_ref": "precommit-20260524031200-test0001",
            "replay_idempotency_metadata_ref": replay["replay_idempotency_metadata_ref"],
            "replay_idempotency_metadata_sha256": replay["replay_idempotency_metadata_sha256"],
            "idempotency_key_sha256": replay["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T03:12:00Z",
            "markdown_body": "must-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        replay_idempotency_metadata_store_path=replay_store,
        store_path=precommit_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_precommit_metadata_ready"] is True
    assert dto["source_replay_idempotency_metadata_verified"] is True
    assert dto["source_idempotency_duplicate_skip_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_precommit_metadata_after_replay_idempotency"
    assert dto["write_readiness_percent"] == 90
    assert len(dto["mac_relay_precommit_metadata_sha256"]) == 64
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["payload_body_materialization_scope"] == "internal_tmp_root_smoke_only"
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata(
        {
            "mac_relay_precommit_ref": "precommit-20260524031200-test0001",
            "replay_idempotency_metadata_ref": replay["replay_idempotency_metadata_ref"],
            "replay_idempotency_metadata_sha256": replay["replay_idempotency_metadata_sha256"],
            "idempotency_key_sha256": replay["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T03:12:00Z",
        },
        replay_idempotency_metadata_store_path=replay_store,
        store_path=precommit_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_precommit_write_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata_records(store_path=precommit_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_precommit_metadata_route_is_protected_and_records(tmp_path, monkeypatch):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    tmp_root_store = tmp_path / "tmp-root-write-smoke-precommit-route.jsonl"
    replay_store = tmp_path / "replay-idempotency-precommit-route.jsonl"
    precommit_store = tmp_path / "mac-relay-precommit-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_store_path", lambda: store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_record_store_path", lambda: tmp_root_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_tmp_root_write_smoke_root_path", lambda: tmp_path / "route-precommit-root")
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_replay_idempotency_metadata_record_store_path", lambda: replay_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_precommit_metadata_record_store_path", lambda: precommit_store)
    smoke = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524031300-route01", "requested_by": "operator:route", "requested_at": "2026-05-24T03:13:00Z"},
    )["dto"]
    replay = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata(
        {
            "replay_idempotency_metadata_ref": "replayidem-20260524031400-route01",
            "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
            "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
            "idempotency_key_sha256": smoke["idempotency_key_sha256"],
            "recorded_by": "operator:route",
            "recorded_at": "2026-05-24T03:14:00Z",
        }
    )["dto"]
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata"
    payload = {
        "mac_relay_precommit_ref": "precommit-20260524031500-route001",
        "replay_idempotency_metadata_ref": replay["replay_idempotency_metadata_ref"],
        "replay_idempotency_metadata_sha256": replay["replay_idempotency_metadata_sha256"],
        "idempotency_key_sha256": replay["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T03:15:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_precommit_metadata_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_replay_idempotency_metadata_verified"] is True


def _seed_mac_relay_precommit_metadata_record(tmp_path):
    store, _review = _seed_attestation_readback_review_readback_review_readback_review(tmp_path)
    tmp_root_store = tmp_path / "tmp-root-write-smoke-manifest.jsonl"
    replay_store = tmp_path / "replay-idempotency-manifest.jsonl"
    precommit_store = tmp_path / "mac-relay-precommit-manifest-source.jsonl"
    smoke = execute_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke(
        {"tmp_root_write_smoke_ref": "tmprootsmoke-20260524041000-manif1", "requested_by": "operator:test", "requested_at": "2026-05-24T04:10:00Z"},
        attestation_readback_review_readback_review_readback_review_store_path=store,
        store_path=tmp_root_store,
        root_path=tmp_path / "manifest-root",
    )["dto"]
    replay = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata(
        {
            "replay_idempotency_metadata_ref": "replayidem-20260524041100-manif1",
            "tmp_root_write_smoke_ref": smoke["tmp_root_write_smoke_ref"],
            "tmp_root_write_smoke_record_sha256": smoke["tmp_root_write_smoke_record_sha256"],
            "idempotency_key_sha256": smoke["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T04:11:00Z",
        },
        tmp_root_write_smoke_store_path=tmp_root_store,
        store_path=replay_store,
    )["dto"]
    precommit = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata(
        {
            "mac_relay_precommit_ref": "precommit-20260524041200-manif1",
            "replay_idempotency_metadata_ref": replay["replay_idempotency_metadata_ref"],
            "replay_idempotency_metadata_sha256": replay["replay_idempotency_metadata_sha256"],
            "idempotency_key_sha256": replay["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T04:12:00Z",
        },
        replay_idempotency_metadata_store_path=replay_store,
        store_path=precommit_store,
    )["dto"]
    return precommit_store, precommit


def test_mac_relay_precommit_manifest_after_precommit_metadata_records_safe_manifest(tmp_path):
    precommit_store, precommit = _seed_mac_relay_precommit_metadata_record(tmp_path)
    manifest_store = tmp_path / "mac-relay-precommit-manifest-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest(
        {
            "mac_relay_precommit_manifest_ref": "precommitmanifest-20260524042000-test0001",
            "mac_relay_precommit_ref": precommit["mac_relay_precommit_ref"],
            "mac_relay_precommit_metadata_sha256": precommit["mac_relay_precommit_metadata_sha256"],
            "idempotency_key_sha256": precommit["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T04:20:00Z",
            "markdown_body": "must-not-echo",
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_precommit_metadata_store_path=precommit_store,
        store_path=manifest_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_precommit_manifest_ready"] is True
    assert dto["source_mac_relay_precommit_metadata_verified"] is True
    assert dto["safe_manifest_checklist_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_precommit_manifest_after_replay_idempotency"
    assert dto["write_readiness_percent"] == 94
    assert len(dto["mac_relay_precommit_manifest_sha256"]) == 64
    assert dto["manifest_includes_payload_body"] is False
    assert dto["manifest_includes_write_payload"] is False
    assert dto["manifest_includes_raw_root_path"] is False
    assert dto["manifest_includes_secret_value"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest(
        {
            "mac_relay_precommit_manifest_ref": "precommitmanifest-20260524042000-test0001",
            "mac_relay_precommit_ref": precommit["mac_relay_precommit_ref"],
            "mac_relay_precommit_metadata_sha256": precommit["mac_relay_precommit_metadata_sha256"],
            "idempotency_key_sha256": precommit["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T04:20:00Z",
        },
        mac_relay_precommit_metadata_store_path=precommit_store,
        store_path=manifest_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_manifest_write_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest_records(store_path=manifest_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_precommit_manifest_route_is_protected_and_records(tmp_path, monkeypatch):
    precommit_store, precommit = _seed_mac_relay_precommit_metadata_record(tmp_path)
    manifest_store = tmp_path / "mac-relay-precommit-manifest-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_precommit_metadata_record_store_path", lambda: precommit_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_precommit_manifest_record_store_path", lambda: manifest_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest"
    payload = {
        "mac_relay_precommit_manifest_ref": "precommitmanifest-20260524042100-route01",
        "mac_relay_precommit_ref": precommit["mac_relay_precommit_ref"],
        "mac_relay_precommit_metadata_sha256": precommit["mac_relay_precommit_metadata_sha256"],
        "idempotency_key_sha256": precommit["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T04:21:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_precommit_manifest_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_precommit_metadata_verified"] is True


def _seed_mac_relay_precommit_manifest_record(tmp_path):
    precommit_store, precommit = _seed_mac_relay_precommit_metadata_record(tmp_path)
    manifest_store = tmp_path / "mac-relay-precommit-final-preflight-source.jsonl"
    manifest = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest(
        {
            "mac_relay_precommit_manifest_ref": "precommitmanifest-20260524052000-final1",
            "mac_relay_precommit_ref": precommit["mac_relay_precommit_ref"],
            "mac_relay_precommit_metadata_sha256": precommit["mac_relay_precommit_metadata_sha256"],
            "idempotency_key_sha256": precommit["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T05:20:00Z",
        },
        mac_relay_precommit_metadata_store_path=precommit_store,
        store_path=manifest_store,
    )["dto"]
    return manifest_store, manifest


def test_mac_relay_final_preflight_after_precommit_manifest_records_write_readiness(tmp_path):
    manifest_store, manifest = _seed_mac_relay_precommit_manifest_record(tmp_path)
    final_preflight_store = tmp_path / "mac-relay-final-preflight-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight(
        {
            "mac_relay_final_preflight_ref": "finalpreflight-20260524052200-test0001",
            "mac_relay_precommit_manifest_ref": manifest["mac_relay_precommit_manifest_ref"],
            "mac_relay_precommit_manifest_sha256": manifest["mac_relay_precommit_manifest_sha256"],
            "idempotency_key_sha256": manifest["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T05:22:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_precommit_manifest_store_path=manifest_store,
        store_path=final_preflight_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_final_preflight_ready"] is True
    assert dto["source_mac_relay_precommit_manifest_verified"] is True
    assert dto["source_safe_manifest_checklist_verified"] is True
    assert dto["final_preflight_checklist_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_final_preflight_after_precommit_manifest"
    assert dto["write_readiness_percent"] == 97
    assert len(dto["mac_relay_final_preflight_sha256"]) == 64
    assert dto["final_preflight_includes_payload_body"] is False
    assert dto["final_preflight_includes_write_payload"] is False
    assert dto["final_preflight_includes_raw_root_path"] is False
    assert dto["final_preflight_includes_secret_value"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_write_gate_after_final_preflight"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight(
        {
            "mac_relay_final_preflight_ref": "finalpreflight-20260524052200-test0001",
            "mac_relay_precommit_manifest_ref": manifest["mac_relay_precommit_manifest_ref"],
            "mac_relay_precommit_manifest_sha256": manifest["mac_relay_precommit_manifest_sha256"],
            "idempotency_key_sha256": manifest["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T05:22:00Z",
        },
        mac_relay_precommit_manifest_store_path=manifest_store,
        store_path=final_preflight_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_final_preflight_write_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight_records(store_path=final_preflight_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_final_preflight_route_is_protected_and_records(tmp_path, monkeypatch):
    manifest_store, manifest = _seed_mac_relay_precommit_manifest_record(tmp_path)
    final_preflight_store = tmp_path / "mac-relay-final-preflight-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_precommit_manifest_record_store_path", lambda: manifest_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_final_preflight_record_store_path", lambda: final_preflight_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight"
    payload = {
        "mac_relay_final_preflight_ref": "finalpreflight-20260524052300-route01",
        "mac_relay_precommit_manifest_ref": manifest["mac_relay_precommit_manifest_ref"],
        "mac_relay_precommit_manifest_sha256": manifest["mac_relay_precommit_manifest_sha256"],
        "idempotency_key_sha256": manifest["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T05:23:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_final_preflight_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_precommit_manifest_verified"] is True


def _seed_mac_relay_final_preflight_record(tmp_path):
    manifest_store, manifest = _seed_mac_relay_precommit_manifest_record(tmp_path)
    final_preflight_store = tmp_path / "mac-relay-final-preflight-real-write-gate-source.jsonl"
    final_preflight = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight(
        {
            "mac_relay_final_preflight_ref": "finalpreflight-20260524062000-gate1",
            "mac_relay_precommit_manifest_ref": manifest["mac_relay_precommit_manifest_ref"],
            "mac_relay_precommit_manifest_sha256": manifest["mac_relay_precommit_manifest_sha256"],
            "idempotency_key_sha256": manifest["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T06:20:00Z",
        },
        mac_relay_precommit_manifest_store_path=manifest_store,
        store_path=final_preflight_store,
    )["dto"]
    return final_preflight_store, final_preflight


def test_mac_relay_real_write_gate_after_final_preflight_records_gate_without_real_write(tmp_path):
    final_preflight_store, final_preflight = _seed_mac_relay_final_preflight_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-write-gate-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate(
        {
            "mac_relay_real_write_gate_ref": "realwritegate-20260524062200-test0001",
            "mac_relay_final_preflight_ref": final_preflight["mac_relay_final_preflight_ref"],
            "mac_relay_final_preflight_sha256": final_preflight["mac_relay_final_preflight_sha256"],
            "idempotency_key_sha256": final_preflight["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T06:22:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_final_preflight_store_path=final_preflight_store,
        store_path=gate_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_real_write_gate_ready"] is True
    assert dto["source_mac_relay_final_preflight_verified"] is True
    assert dto["source_final_preflight_checklist_verified"] is True
    assert dto["real_write_gate_checklist_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_real_write_gate_after_final_preflight"
    assert dto["write_readiness_percent"] == 99
    assert dto["explicit_real_nas_production_approval_present"] is False
    assert dto["real_write_gate_blocks_without_explicit_approval"] is True
    assert dto["next_write_boundary_requires_explicit_real_nas_production_approval"] is True
    assert len(dto["mac_relay_real_write_gate_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["real_write_gate_includes_payload_body"] is False
    assert dto["real_write_gate_includes_write_payload"] is False
    assert dto["real_write_gate_includes_raw_root_path"] is False
    assert dto["real_write_gate_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate(
        {
            "mac_relay_real_write_gate_ref": "realwritegate-20260524062200-test0001",
            "mac_relay_final_preflight_ref": final_preflight["mac_relay_final_preflight_ref"],
            "mac_relay_final_preflight_sha256": final_preflight["mac_relay_final_preflight_sha256"],
            "idempotency_key_sha256": final_preflight["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T06:22:00Z",
        },
        mac_relay_final_preflight_store_path=final_preflight_store,
        store_path=gate_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_real_write_gate_write_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate_records(store_path=gate_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_real_write_gate_route_is_protected_and_records(tmp_path, monkeypatch):
    final_preflight_store, final_preflight = _seed_mac_relay_final_preflight_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-write-gate-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_final_preflight_record_store_path", lambda: final_preflight_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_write_gate_record_store_path", lambda: gate_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate"
    payload = {
        "mac_relay_real_write_gate_ref": "realwritegate-20260524062300-route01",
        "mac_relay_final_preflight_ref": final_preflight["mac_relay_final_preflight_ref"],
        "mac_relay_final_preflight_sha256": final_preflight["mac_relay_final_preflight_sha256"],
        "idempotency_key_sha256": final_preflight["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T06:23:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_real_write_gate_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_final_preflight_verified"] is True


def _seed_mac_relay_real_write_gate_record(tmp_path):
    final_preflight_store, final_preflight = _seed_mac_relay_final_preflight_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-write-gate-seed.jsonl"
    gate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate(
        {
            "mac_relay_real_write_gate_ref": "realwritegate-20260524070000-token1",
            "mac_relay_final_preflight_ref": final_preflight["mac_relay_final_preflight_ref"],
            "mac_relay_final_preflight_sha256": final_preflight["mac_relay_final_preflight_sha256"],
            "idempotency_key_sha256": final_preflight["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T07:00:00Z",
        },
        mac_relay_final_preflight_store_path=final_preflight_store,
        store_path=gate_store,
    )["dto"]
    return gate_store, gate


def test_mac_relay_approval_token_after_real_write_gate_records_non_secret_token_contract(tmp_path):
    gate_store, gate = _seed_mac_relay_real_write_gate_record(tmp_path)
    token_store = tmp_path / "mac-relay-approval-token-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token(
        {
            "mac_relay_approval_token_ref": "approvaltoken-20260524070500-test0001",
            "mac_relay_real_write_gate_ref": gate["mac_relay_real_write_gate_ref"],
            "mac_relay_real_write_gate_sha256": gate["mac_relay_real_write_gate_sha256"],
            "idempotency_key_sha256": gate["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T07:05:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_real_write_gate_store_path=gate_store,
        store_path=token_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_approval_token_ready"] is True
    assert dto["approval_token_is_secret"] is False
    assert dto["approval_token_is_non_secret_safe_ref"] is True
    assert dto["source_mac_relay_real_write_gate_verified"] is True
    assert dto["source_real_write_gate_checklist_verified"] is True
    assert dto["approval_token_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_approval_token_after_real_write_gate"
    assert dto["write_readiness_percent"] == 100
    assert dto["explicit_real_nas_production_approval_present"] is False
    assert dto["approval_token_blocks_without_explicit_production_approval"] is True
    assert dto["next_write_boundary_requires_explicit_real_nas_production_approval"] is True
    assert len(dto["mac_relay_approval_token_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["approval_token_includes_payload_body"] is False
    assert dto["approval_token_includes_write_payload"] is False
    assert dto["approval_token_includes_raw_root_path"] is False
    assert dto["approval_token_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_production_write_approval_after_token"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token(
        {
            "mac_relay_approval_token_ref": "approvaltoken-20260524070500-test0001",
            "mac_relay_real_write_gate_ref": gate["mac_relay_real_write_gate_ref"],
            "mac_relay_real_write_gate_sha256": gate["mac_relay_real_write_gate_sha256"],
            "idempotency_key_sha256": gate["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T07:05:00Z",
        },
        mac_relay_real_write_gate_store_path=gate_store,
        store_path=token_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_approval_token_write_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token_records(store_path=token_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_approval_token_route_is_protected_and_records(tmp_path, monkeypatch):
    gate_store, gate = _seed_mac_relay_real_write_gate_record(tmp_path)
    token_store = tmp_path / "mac-relay-approval-token-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_write_gate_record_store_path", lambda: gate_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_approval_token_record_store_path", lambda: token_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token"
    payload = {
        "mac_relay_approval_token_ref": "approvaltoken-20260524070600-route01",
        "mac_relay_real_write_gate_ref": gate["mac_relay_real_write_gate_ref"],
        "mac_relay_real_write_gate_sha256": gate["mac_relay_real_write_gate_sha256"],
        "idempotency_key_sha256": gate["idempotency_key_sha256"],
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T07:06:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_approval_token_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_real_write_gate_verified"] is True


def _seed_mac_relay_approval_token_record(tmp_path):
    gate_store, gate = _seed_mac_relay_real_write_gate_record(tmp_path)
    token_store = tmp_path / "mac-relay-approval-token-seed.jsonl"
    token = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token(
        {
            "mac_relay_approval_token_ref": "approvaltoken-20260524070500-prod1",
            "mac_relay_real_write_gate_ref": gate["mac_relay_real_write_gate_ref"],
            "mac_relay_real_write_gate_sha256": gate["mac_relay_real_write_gate_sha256"],
            "idempotency_key_sha256": gate["idempotency_key_sha256"],
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T07:05:00Z",
        },
        mac_relay_real_write_gate_store_path=gate_store,
        store_path=token_store,
    )["dto"]
    return token_store, token


def test_mac_relay_production_write_approval_after_token_records_explicit_boundary_without_execution(tmp_path):
    token_store, token = _seed_mac_relay_approval_token_record(tmp_path)
    approval_store = tmp_path / "mac-relay-production-write-approval-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval(
        {
            "mac_relay_production_write_approval_ref": "prodapproval-20260524081000-test0001",
            "mac_relay_approval_token_ref": token["mac_relay_approval_token_ref"],
            "mac_relay_approval_token_sha256": token["mac_relay_approval_token_sha256"],
            "idempotency_key_sha256": token["idempotency_key_sha256"],
            "operator_confirmation_ref": "operatorconfirm-20260524081000-test0001",
            "approval_decision": "approved_for_next_rung_only_no_execution",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T08:10:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_approval_token_store_path=token_store,
        store_path=approval_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_production_write_approval_ready"] is True
    assert dto["source_mac_relay_approval_token_verified"] is True
    assert dto["source_approval_token_contract_verified"] is True
    assert dto["production_write_approval_boundary_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_production_write_approval_after_token"
    assert dto["write_readiness_percent"] == 100
    assert dto["explicit_real_nas_production_approval_present"] is True
    assert dto["production_write_approval_is_metadata_only"] is True
    assert dto["production_write_approval_does_not_execute_write"] is True
    assert len(dto["mac_relay_production_write_approval_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["production_write_approval_includes_payload_body"] is False
    assert dto["production_write_approval_includes_write_payload"] is False
    assert dto["production_write_approval_includes_raw_root_path"] is False
    assert dto["production_write_approval_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_after_production_approval"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval(
        {
            "mac_relay_production_write_approval_ref": "prodapproval-20260524081000-test0001",
            "mac_relay_approval_token_ref": token["mac_relay_approval_token_ref"],
            "mac_relay_approval_token_sha256": token["mac_relay_approval_token_sha256"],
            "idempotency_key_sha256": token["idempotency_key_sha256"],
            "operator_confirmation_ref": "operatorconfirm-20260524081000-test0001",
            "approval_decision": "approved_for_next_rung_only_no_execution",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T08:10:00Z",
        },
        mac_relay_approval_token_store_path=token_store,
        store_path=approval_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_production_write_approval_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval_records(store_path=approval_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_production_write_approval_route_is_protected_and_records(tmp_path, monkeypatch):
    token_store, token = _seed_mac_relay_approval_token_record(tmp_path)
    approval_store = tmp_path / "mac-relay-production-write-approval-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_approval_token_record_store_path", lambda: token_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_production_write_approval_record_store_path", lambda: approval_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval"
    payload = {
        "mac_relay_production_write_approval_ref": "prodapproval-20260524081100-route1",
        "mac_relay_approval_token_ref": token["mac_relay_approval_token_ref"],
        "mac_relay_approval_token_sha256": token["mac_relay_approval_token_sha256"],
        "idempotency_key_sha256": token["idempotency_key_sha256"],
        "operator_confirmation_ref": "operatorconfirm-20260524081100-route1",
        "approval_decision": "approved_for_next_rung_only_no_execution",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T08:11:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_production_write_approval_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_approval_token_verified"] is True



def _seed_mac_relay_production_write_approval_record(tmp_path):
    token_store, token = _seed_mac_relay_approval_token_record(tmp_path)
    approval_store = tmp_path / "seed-mac-relay-production-write-approval-records.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval(
        {
            "mac_relay_production_write_approval_ref": "prodapproval-20260524092500-seed0001",
            "mac_relay_approval_token_ref": token["mac_relay_approval_token_ref"],
            "mac_relay_approval_token_sha256": token["mac_relay_approval_token_sha256"],
            "idempotency_key_sha256": token["idempotency_key_sha256"],
            "operator_confirmation_ref": "operatorconfirm-20260524092500-seed0001",
            "approval_decision": "approved_for_next_rung_only_no_execution",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T09:25:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_approval_token_store_path=token_store,
        store_path=approval_store,
    )
    assert result["stored"] is True
    return approval_store, result["dto"]


def test_mac_relay_real_nas_write_dry_run_seal_after_production_approval_records_final_contract_without_execution(tmp_path):
    approval_store, approval = _seed_mac_relay_production_write_approval_record(tmp_path)
    seal_store = tmp_path / "mac-relay-real-nas-write-dry-run-seal-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal(
        {
            "mac_relay_real_nas_write_dry_run_seal_ref": "nasdryrunseal-20260524100000-test0001",
            "mac_relay_production_write_approval_ref": approval["mac_relay_production_write_approval_ref"],
            "mac_relay_production_write_approval_sha256": approval["mac_relay_production_write_approval_sha256"],
            "idempotency_key_sha256": approval["idempotency_key_sha256"],
            "target_filename_contract_ref": "targetfilecontract-20260524100000-test0001",
            "post_write_verification_contract_ref": "postwriteverify-20260524100000-test0001",
            "operator_confirmation_ref": "operatorconfirm-20260524100000-test0001",
            "dry_run_decision": "sealed_for_real_nas_write_execution_next_rung_only_no_execution",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T10:00:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_production_write_approval_store_path=approval_store,
        store_path=seal_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_real_nas_write_dry_run_seal_ready"] is True
    assert dto["source_mac_relay_production_write_approval_verified"] is True
    assert dto["source_production_write_approval_boundary_verified"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_real_nas_write_dry_run_seal_after_production_approval"
    assert dto["write_readiness_percent"] == 100
    assert dto["dry_run_seal_is_metadata_only"] is True
    assert dto["dry_run_seal_does_not_execute_write"] is True
    assert dto["final_safe_refs_verified_for_next_rung"] is True
    assert dto["real_nas_write_target_filename_contract_ready"] is True
    assert dto["post_write_readback_contract_ready"] is True
    assert len(dto["mac_relay_real_nas_write_dry_run_seal_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["dry_run_seal_includes_payload_body"] is False
    assert dto["dry_run_seal_includes_write_payload"] is False
    assert dto["dry_run_seal_includes_raw_root_path"] is False
    assert dto["dry_run_seal_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_execution_after_dry_run_seal"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal(
        {
            "mac_relay_real_nas_write_dry_run_seal_ref": "nasdryrunseal-20260524100000-test0001",
            "mac_relay_production_write_approval_ref": approval["mac_relay_production_write_approval_ref"],
            "mac_relay_production_write_approval_sha256": approval["mac_relay_production_write_approval_sha256"],
            "idempotency_key_sha256": approval["idempotency_key_sha256"],
            "target_filename_contract_ref": "targetfilecontract-20260524100000-test0001",
            "post_write_verification_contract_ref": "postwriteverify-20260524100000-test0001",
            "operator_confirmation_ref": "operatorconfirm-20260524100000-test0001",
            "dry_run_decision": "sealed_for_real_nas_write_execution_next_rung_only_no_execution",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T10:00:00Z",
        },
        mac_relay_production_write_approval_store_path=approval_store,
        store_path=seal_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_dry_run_seal_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_records(store_path=seal_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_real_nas_write_dry_run_seal_route_is_protected_and_records(tmp_path, monkeypatch):
    approval_store, approval = _seed_mac_relay_production_write_approval_record(tmp_path)
    seal_store = tmp_path / "mac-relay-real-nas-write-dry-run-seal-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_production_write_approval_record_store_path", lambda: approval_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_record_store_path", lambda: seal_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal"
    payload = {
        "mac_relay_real_nas_write_dry_run_seal_ref": "nasdryrunseal-20260524100100-route1",
        "mac_relay_production_write_approval_ref": approval["mac_relay_production_write_approval_ref"],
        "mac_relay_production_write_approval_sha256": approval["mac_relay_production_write_approval_sha256"],
        "idempotency_key_sha256": approval["idempotency_key_sha256"],
        "target_filename_contract_ref": "targetfilecontract-20260524100100-route1",
        "post_write_verification_contract_ref": "postwriteverify-20260524100100-route1",
        "operator_confirmation_ref": "operatorconfirm-20260524100100-route1",
        "dry_run_decision": "sealed_for_real_nas_write_execution_next_rung_only_no_execution",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T10:01:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_real_nas_write_dry_run_seal_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_production_write_approval_verified"] is True



def _seed_mac_relay_real_nas_write_dry_run_seal_record(tmp_path):
    approval_store, approval = _seed_mac_relay_production_write_approval_record(tmp_path)
    seal_store = tmp_path / "seed-mac-relay-real-nas-write-dry-run-seal-records.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal(
        {
            "mac_relay_real_nas_write_dry_run_seal_ref": "nasdryrunseal-20260524101000-seed0001",
            "mac_relay_production_write_approval_ref": approval["mac_relay_production_write_approval_ref"],
            "mac_relay_production_write_approval_sha256": approval["mac_relay_production_write_approval_sha256"],
            "idempotency_key_sha256": approval["idempotency_key_sha256"],
            "target_filename_contract_ref": "targetfilecontract-20260524101000-seed0001",
            "post_write_verification_contract_ref": "postwriteverify-20260524101000-seed0001",
            "operator_confirmation_ref": "operatorconfirm-20260524101000-seed0001",
            "dry_run_decision": "sealed_for_real_nas_write_execution_next_rung_only_no_execution",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T10:10:00Z",
        },
        mac_relay_production_write_approval_store_path=approval_store,
        store_path=seal_store,
    )
    assert result["stored"] is True
    return seal_store, result["dto"]


def test_mac_relay_real_nas_write_execution_envelope_after_dry_run_seal_records_intent_without_execution(tmp_path):
    seal_store, seal = _seed_mac_relay_real_nas_write_dry_run_seal_record(tmp_path)
    envelope_store = tmp_path / "mac-relay-real-nas-write-execution-envelope-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope(
        {
            "mac_relay_real_nas_write_execution_envelope_ref": "nasexecenv-20260524102000-test0001",
            "mac_relay_real_nas_write_dry_run_seal_ref": seal["mac_relay_real_nas_write_dry_run_seal_ref"],
            "mac_relay_real_nas_write_dry_run_seal_sha256": seal["mac_relay_real_nas_write_dry_run_seal_sha256"],
            "idempotency_key_sha256": seal["idempotency_key_sha256"],
            "target_filename_contract_ref": seal["target_filename_contract_ref"],
            "post_write_verification_contract_ref": seal["post_write_verification_contract_ref"],
            "execution_intent_ref": "execintent-20260524102000-test0001",
            "execution_envelope_decision": "execution_intent_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T10:20:00Z",
        },
        mac_relay_real_nas_write_dry_run_seal_store_path=seal_store,
        store_path=envelope_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_real_nas_write_execution_envelope_ready"] is True
    assert dto["source_mac_relay_real_nas_write_dry_run_seal_verified"] is True
    assert dto["source_dry_run_seal_contract_verified"] is True
    assert dto["execution_intent_recorded"] is True
    assert dto["execution_envelope_is_metadata_only"] is True
    assert dto["execution_envelope_does_not_execute_write"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_real_nas_write_execution_envelope_after_dry_run_seal"
    assert dto["write_readiness_percent"] == 100
    assert dto["real_nas_write_execution_envelope_ready"] is True
    assert dto["real_nas_write_execution_envelope_includes_final_safe_refs"] is True
    assert dto["real_nas_write_execution_envelope_includes_post_write_verification_plan"] is True
    assert len(dto["mac_relay_real_nas_write_execution_envelope_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["execution_envelope_includes_payload_body"] is False
    assert dto["execution_envelope_includes_write_payload"] is False
    assert dto["execution_envelope_includes_raw_root_path"] is False
    assert dto["execution_envelope_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_execution_record_after_execution_envelope"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope(
        {
            "mac_relay_real_nas_write_execution_envelope_ref": "nasexecenv-20260524102000-test0001",
            "mac_relay_real_nas_write_dry_run_seal_ref": seal["mac_relay_real_nas_write_dry_run_seal_ref"],
            "mac_relay_real_nas_write_dry_run_seal_sha256": seal["mac_relay_real_nas_write_dry_run_seal_sha256"],
            "idempotency_key_sha256": seal["idempotency_key_sha256"],
            "target_filename_contract_ref": seal["target_filename_contract_ref"],
            "post_write_verification_contract_ref": seal["post_write_verification_contract_ref"],
            "execution_intent_ref": "execintent-20260524102000-test0001",
            "execution_envelope_decision": "execution_intent_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T10:20:00Z",
        },
        mac_relay_real_nas_write_dry_run_seal_store_path=seal_store,
        store_path=envelope_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_execution_envelope_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope_records(store_path=envelope_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_real_nas_write_execution_envelope_route_is_protected_and_records(tmp_path, monkeypatch):
    seal_store, seal = _seed_mac_relay_real_nas_write_dry_run_seal_record(tmp_path)
    envelope_store = tmp_path / "mac-relay-real-nas-write-execution-envelope-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_record_store_path", lambda: seal_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_execution_envelope_record_store_path", lambda: envelope_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope"
    payload = {
        "mac_relay_real_nas_write_execution_envelope_ref": "nasexecenv-20260524102100-route1",
        "mac_relay_real_nas_write_dry_run_seal_ref": seal["mac_relay_real_nas_write_dry_run_seal_ref"],
        "mac_relay_real_nas_write_dry_run_seal_sha256": seal["mac_relay_real_nas_write_dry_run_seal_sha256"],
        "idempotency_key_sha256": seal["idempotency_key_sha256"],
        "target_filename_contract_ref": seal["target_filename_contract_ref"],
        "post_write_verification_contract_ref": seal["post_write_verification_contract_ref"],
        "execution_intent_ref": "execintent-20260524102100-route1",
        "execution_envelope_decision": "execution_intent_recorded_for_next_rung_only_no_real_nas_write",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T10:21:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_real_nas_write_execution_envelope_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_real_nas_write_dry_run_seal_verified"] is True



def _seed_mac_relay_real_nas_write_execution_envelope_record(tmp_path):
    seal_store, seal = _seed_mac_relay_real_nas_write_dry_run_seal_record(tmp_path)
    envelope_store = tmp_path / "seed-mac-relay-real-nas-write-execution-envelope-records.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_envelope(
        {
            "mac_relay_real_nas_write_execution_envelope_ref": "nasexecenv-20260524102000-seed0001",
            "mac_relay_real_nas_write_dry_run_seal_ref": seal["mac_relay_real_nas_write_dry_run_seal_ref"],
            "mac_relay_real_nas_write_dry_run_seal_sha256": seal["mac_relay_real_nas_write_dry_run_seal_sha256"],
            "idempotency_key_sha256": seal["idempotency_key_sha256"],
            "target_filename_contract_ref": seal["target_filename_contract_ref"],
            "post_write_verification_contract_ref": seal["post_write_verification_contract_ref"],
            "execution_intent_ref": "execintent-20260524102000-seed0001",
            "execution_envelope_decision": "execution_intent_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T10:20:00Z",
        },
        mac_relay_real_nas_write_dry_run_seal_store_path=seal_store,
        store_path=envelope_store,
    )
    assert result["stored"] is True
    return envelope_store, result["dto"]


def test_mac_relay_real_nas_write_execution_record_after_envelope_records_pre_execution_proof_without_write(tmp_path):
    envelope_store, envelope = _seed_mac_relay_real_nas_write_execution_envelope_record(tmp_path)
    record_store = tmp_path / "mac-relay-real-nas-write-execution-record-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record(
        {
            "mac_relay_real_nas_write_execution_record_ref": "nasexecrec-20260524113000-test0001",
            "mac_relay_real_nas_write_execution_envelope_ref": envelope["mac_relay_real_nas_write_execution_envelope_ref"],
            "mac_relay_real_nas_write_execution_envelope_sha256": envelope["mac_relay_real_nas_write_execution_envelope_sha256"],
            "idempotency_key_sha256": envelope["idempotency_key_sha256"],
            "target_filename_contract_ref": envelope["target_filename_contract_ref"],
            "post_write_verification_contract_ref": envelope["post_write_verification_contract_ref"],
            "execution_intent_ref": envelope["execution_intent_ref"],
            "pre_execution_proof_ref": "preexecproof-20260524113000-test0001",
            "execution_record_decision": "pre_execution_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T11:30:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_real_nas_write_execution_envelope_store_path=envelope_store,
        store_path=record_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_real_nas_write_execution_record_ready"] is True
    assert dto["source_mac_relay_real_nas_write_execution_envelope_verified"] is True
    assert dto["source_execution_envelope_contract_verified"] is True
    assert dto["pre_execution_proof_recorded"] is True
    assert dto["execution_record_is_metadata_only"] is True
    assert dto["execution_record_does_not_execute_write"] is True
    assert dto["execution_record_does_not_materialize_payload"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_real_nas_write_execution_record_after_execution_envelope"
    assert dto["write_readiness_percent"] == 100
    assert dto["real_nas_write_execution_record_ready"] is True
    assert dto["real_nas_write_execution_record_includes_pre_execution_proof"] is True
    assert dto["real_nas_write_execution_record_includes_post_write_verification_plan"] is True
    assert len(dto["mac_relay_real_nas_write_execution_record_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["execution_record_includes_payload_body"] is False
    assert dto["execution_record_includes_write_payload"] is False
    assert dto["execution_record_includes_raw_root_path"] is False
    assert dto["execution_record_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_final_execution_gate_after_execution_record"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record(
        {
            "mac_relay_real_nas_write_execution_record_ref": "nasexecrec-20260524113000-test0001",
            "mac_relay_real_nas_write_execution_envelope_ref": envelope["mac_relay_real_nas_write_execution_envelope_ref"],
            "mac_relay_real_nas_write_execution_envelope_sha256": envelope["mac_relay_real_nas_write_execution_envelope_sha256"],
            "idempotency_key_sha256": envelope["idempotency_key_sha256"],
            "target_filename_contract_ref": envelope["target_filename_contract_ref"],
            "post_write_verification_contract_ref": envelope["post_write_verification_contract_ref"],
            "execution_intent_ref": envelope["execution_intent_ref"],
            "pre_execution_proof_ref": "preexecproof-20260524113000-test0001",
            "execution_record_decision": "pre_execution_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T11:30:00Z",
        },
        mac_relay_real_nas_write_execution_envelope_store_path=envelope_store,
        store_path=record_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_execution_record_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record_records(store_path=record_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_real_nas_write_execution_record_route_is_protected_and_records(tmp_path, monkeypatch):
    envelope_store, envelope = _seed_mac_relay_real_nas_write_execution_envelope_record(tmp_path)
    record_store = tmp_path / "mac-relay-real-nas-write-execution-record-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_execution_envelope_record_store_path", lambda: envelope_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_execution_record_store_path", lambda: record_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record"
    payload = {
        "mac_relay_real_nas_write_execution_record_ref": "nasexecrec-20260524113100-route1",
        "mac_relay_real_nas_write_execution_envelope_ref": envelope["mac_relay_real_nas_write_execution_envelope_ref"],
        "mac_relay_real_nas_write_execution_envelope_sha256": envelope["mac_relay_real_nas_write_execution_envelope_sha256"],
        "idempotency_key_sha256": envelope["idempotency_key_sha256"],
        "target_filename_contract_ref": envelope["target_filename_contract_ref"],
        "post_write_verification_contract_ref": envelope["post_write_verification_contract_ref"],
        "execution_intent_ref": envelope["execution_intent_ref"],
        "pre_execution_proof_ref": "preexecproof-20260524113100-route1",
        "execution_record_decision": "pre_execution_recorded_for_next_rung_only_no_real_nas_write",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T11:31:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_real_nas_write_execution_record_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_real_nas_write_execution_envelope_verified"] is True



def _seed_mac_relay_real_nas_write_execution_record(tmp_path):
    envelope_store, envelope = _seed_mac_relay_real_nas_write_execution_envelope_record(tmp_path)
    record_store = tmp_path / "seed-mac-relay-real-nas-write-execution-records.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_execution_record(
        {
            "mac_relay_real_nas_write_execution_record_ref": "nasexecrec-20260524113000-seed0001",
            "mac_relay_real_nas_write_execution_envelope_ref": envelope["mac_relay_real_nas_write_execution_envelope_ref"],
            "mac_relay_real_nas_write_execution_envelope_sha256": envelope["mac_relay_real_nas_write_execution_envelope_sha256"],
            "idempotency_key_sha256": envelope["idempotency_key_sha256"],
            "target_filename_contract_ref": envelope["target_filename_contract_ref"],
            "post_write_verification_contract_ref": envelope["post_write_verification_contract_ref"],
            "execution_intent_ref": envelope["execution_intent_ref"],
            "pre_execution_proof_ref": "preexecproof-20260524113000-seed0001",
            "execution_record_decision": "pre_execution_recorded_for_next_rung_only_no_real_nas_write",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T11:30:00Z",
        },
        mac_relay_real_nas_write_execution_envelope_store_path=envelope_store,
        store_path=record_store,
    )
    assert result["stored"] is True
    return record_store, result["dto"]


def test_mac_relay_real_nas_write_final_execution_gate_after_execution_record_locks_last_metadata_gate_without_write(tmp_path):
    record_store, record = _seed_mac_relay_real_nas_write_execution_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-nas-write-final-execution-gate-records.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate(
        {
            "mac_relay_real_nas_write_final_execution_gate_ref": "nasfinalgate-20260524123000-test0001",
            "mac_relay_real_nas_write_execution_record_ref": record["mac_relay_real_nas_write_execution_record_ref"],
            "mac_relay_real_nas_write_execution_record_sha256": record["mac_relay_real_nas_write_execution_record_sha256"],
            "idempotency_key_sha256": record["idempotency_key_sha256"],
            "target_filename_contract_ref": record["target_filename_contract_ref"],
            "post_write_verification_contract_ref": record["post_write_verification_contract_ref"],
            "execution_intent_ref": record["execution_intent_ref"],
            "pre_execution_proof_ref": record["pre_execution_proof_ref"],
            "final_execution_gate_decision": "final_execution_gate_recorded_for_manual_real_nas_write_boundary_only",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T12:30:00Z",
            "markdown_body": "must" + "-not-echo",
            "write_payload": {"raw": "must" + "-not-echo"},
            "raw_root_path": "/vol" + "ume1/private",
            "credential_value": "sk" + "-test-secret",
        },
        mac_relay_real_nas_write_execution_record_store_path=record_store,
        store_path=gate_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mac_relay_real_nas_write_final_execution_gate_ready"] is True
    assert dto["source_mac_relay_real_nas_write_execution_record_verified"] is True
    assert dto["source_execution_record_contract_verified"] is True
    assert dto["final_execution_gate_is_metadata_only"] is True
    assert dto["final_execution_gate_does_not_execute_write"] is True
    assert dto["final_execution_gate_does_not_materialize_payload"] is True
    assert dto["final_manual_real_nas_write_boundary_locked"] is True
    assert dto["pre_real_nas_write_lock_recorded"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["write_readiness_stage"] == "mac_relay_real_nas_write_final_execution_gate_after_execution_record"
    assert dto["write_readiness_percent"] == 100
    assert dto["real_nas_write_final_execution_gate_ready"] is True
    assert len(dto["mac_relay_real_nas_write_final_execution_gate_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["final_execution_gate_includes_payload_body"] is False
    assert dto["final_execution_gate_includes_write_payload"] is False
    assert dto["final_execution_gate_includes_raw_root_path"] is False
    assert dto["final_execution_gate_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_manual_real_nas_write_boundary_after_final_execution_gate"
    text = json.dumps(dto, sort_keys=True)
    assert "must" + "-not-echo" not in text
    assert "/vol" + "ume1/private" not in text
    assert "sk" + "-test-secret" not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate(
        {
            "mac_relay_real_nas_write_final_execution_gate_ref": "nasfinalgate-20260524123000-test0001",
            "mac_relay_real_nas_write_execution_record_ref": record["mac_relay_real_nas_write_execution_record_ref"],
            "mac_relay_real_nas_write_execution_record_sha256": record["mac_relay_real_nas_write_execution_record_sha256"],
            "idempotency_key_sha256": record["idempotency_key_sha256"],
            "target_filename_contract_ref": record["target_filename_contract_ref"],
            "post_write_verification_contract_ref": record["post_write_verification_contract_ref"],
            "execution_intent_ref": record["execution_intent_ref"],
            "pre_execution_proof_ref": record["pre_execution_proof_ref"],
            "final_execution_gate_decision": "final_execution_gate_recorded_for_manual_real_nas_write_boundary_only",
            "recorded_by": "operator:test",
            "recorded_at": "2026-05-24T12:30:00Z",
        },
        mac_relay_real_nas_write_execution_record_store_path=record_store,
        store_path=gate_store,
    )
    assert duplicate["stored"] is False
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_final_execution_gate_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate_records(store_path=gate_store)
    assert listed["found"] is True
    assert listed["record_count"] == 1


def test_mac_relay_real_nas_write_final_execution_gate_route_is_protected_and_records(tmp_path, monkeypatch):
    record_store, record = _seed_mac_relay_real_nas_write_execution_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-nas-write-final-execution-gate-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation

    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_execution_record_store_path", lambda: record_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_final_execution_gate_store_path", lambda: gate_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate"
    payload = {
        "mac_relay_real_nas_write_final_execution_gate_ref": "nasfinalgate-20260524123100-route1",
        "mac_relay_real_nas_write_execution_record_ref": record["mac_relay_real_nas_write_execution_record_ref"],
        "mac_relay_real_nas_write_execution_record_sha256": record["mac_relay_real_nas_write_execution_record_sha256"],
        "idempotency_key_sha256": record["idempotency_key_sha256"],
        "target_filename_contract_ref": record["target_filename_contract_ref"],
        "post_write_verification_contract_ref": record["post_write_verification_contract_ref"],
        "execution_intent_ref": record["execution_intent_ref"],
        "pre_execution_proof_ref": record["pre_execution_proof_ref"],
        "final_execution_gate_decision": "final_execution_gate_recorded_for_manual_real_nas_write_boundary_only",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T12:31:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["mac_relay_real_nas_write_final_execution_gate_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        readback = client.get(route, headers={"X-Hermes-" + "Session-Token": _SESSION_TOKEN})
        assert readback.status_code == 200
        listed = readback.json()
        assert listed["found"] is True
        assert listed["latest_record"]["source_mac_relay_real_nas_write_execution_record_verified"] is True


def _seed_mac_relay_real_nas_write_final_execution_gate(tmp_path):
    record_store, record = _seed_mac_relay_real_nas_write_execution_record(tmp_path)
    gate_store = tmp_path / "mac-relay-real-nas-write-final-gate-seed.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_final_execution_gate(
        {
            "mac_relay_real_nas_write_final_execution_gate_ref": "nasfinalgate-20260524133000-seed0001",
            "mac_relay_real_nas_write_execution_record_ref": record["mac_relay_real_nas_write_execution_record_ref"],
            "mac_relay_real_nas_write_execution_record_sha256": record["mac_relay_real_nas_write_execution_record_sha256"],
            "idempotency_key_sha256": record["idempotency_key_sha256"],
            "target_filename_contract_ref": record["target_filename_contract_ref"],
            "post_write_verification_contract_ref": record["post_write_verification_contract_ref"],
            "execution_intent_ref": record["execution_intent_ref"],
            "pre_execution_proof_ref": record["pre_execution_proof_ref"],
            "final_execution_gate_decision": "final_execution_gate_recorded_for_manual_real_nas_write_boundary_only",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T13:30:00Z",
        },
        mac_relay_real_nas_write_execution_record_store_path=record_store,
        store_path=gate_store,
    )
    assert result["stored"] is True
    return gate_store, result["dto"]


def test_manual_real_nas_write_boundary_after_final_gate_records_exact_manual_boundary_without_write(tmp_path):
    final_gate_store, final_gate = _seed_mac_relay_real_nas_write_final_execution_gate(tmp_path)
    boundary_store = tmp_path / "manual-real-nas-write-boundary.jsonl"

    forbidden_body = "must" + "-not" + "-echo"
    forbidden_path = "/" + "volume1" + "/private"
    forbidden_secret = "sk" + "-test" + "-secret"
    payload = {
        "manual_real_nas_write_boundary_ref": "nasmanualboundary-20260524134000-test0001",
        "mac_relay_real_nas_write_final_execution_gate_ref": final_gate["mac_relay_real_nas_write_final_execution_gate_ref"],
        "mac_relay_real_nas_write_final_execution_gate_sha256": final_gate["mac_relay_real_nas_write_final_execution_gate_sha256"],
        "idempotency_key_sha256": final_gate["idempotency_key_sha256"],
        "target_filename_contract_ref": final_gate["target_filename_contract_ref"],
        "post_write_verification_contract_ref": final_gate["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": final_gate["pre_execution_proof_ref"],
        "manual_boundary_decision": "manual_real_nas_write_boundary_recorded_no_production_write",
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-24T13:40:00Z",
        "markdown_body": forbidden_body,
        "write_payload": {"body": forbidden_body},
        "raw_root_path": forbidden_path,
        "credential_value": forbidden_secret,
    }
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary(
        payload,
        final_execution_gate_store_path=final_gate_store,
        store_path=boundary_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["manual_real_nas_write_boundary_ready"] is True
    assert dto["source_mac_relay_real_nas_write_final_execution_gate_verified"] is True
    assert dto["source_final_execution_gate_contract_verified"] is True
    assert dto["manual_boundary_is_metadata_only"] is True
    assert dto["manual_boundary_does_not_execute_write"] is True
    assert dto["manual_boundary_does_not_materialize_payload"] is True
    assert dto["manual_boundary_contract_recorded"] is True
    assert dto["separate_exact_real_nas_write_approval_required"] is True
    assert dto["mac_relay_operator_presence_required"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["pre_execution_proof_ref"] == final_gate["pre_execution_proof_ref"]
    assert dto["write_readiness_stage"] == "manual_real_nas_write_boundary_after_final_execution_gate"
    assert dto["write_readiness_percent"] == 100
    assert len(dto["manual_real_nas_write_boundary_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["manual_boundary_includes_payload_body"] is False
    assert dto["manual_boundary_includes_write_payload"] is False
    assert dto["manual_boundary_includes_raw_root_path"] is False
    assert dto["manual_boundary_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_separately_approved_real_nas_production_write_after_manual_boundary"
    text = json.dumps(dto, sort_keys=True)
    assert forbidden_body not in text
    assert forbidden_path not in text
    assert forbidden_secret not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary(
        payload,
        final_execution_gate_store_path=final_gate_store,
        store_path=boundary_store,
    )
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_manual_boundary_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary_records(store_path=boundary_store)
    assert listed["found"] is True
    assert listed["latest_record"]["manual_real_nas_write_boundary_ref"] == "nasmanualboundary-20260524134000-test0001"


def test_manual_real_nas_write_boundary_route_is_protected_and_records(tmp_path, monkeypatch):
    final_gate_store, final_gate = _seed_mac_relay_real_nas_write_final_execution_gate(tmp_path)
    boundary_store = tmp_path / "manual-real-nas-write-boundary-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_mac_relay_real_nas_write_final_execution_gate_store_path", lambda: final_gate_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_manual_real_nas_write_boundary_store_path", lambda: boundary_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary"
    payload = {
        "manual_real_nas_write_boundary_ref": "nasmanualboundary-20260524134100-route1",
        "mac_relay_real_nas_write_final_execution_gate_ref": final_gate["mac_relay_real_nas_write_final_execution_gate_ref"],
        "mac_relay_real_nas_write_final_execution_gate_sha256": final_gate["mac_relay_real_nas_write_final_execution_gate_sha256"],
        "idempotency_key_sha256": final_gate["idempotency_key_sha256"],
        "target_filename_contract_ref": final_gate["target_filename_contract_ref"],
        "post_write_verification_contract_ref": final_gate["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": final_gate["pre_execution_proof_ref"],
        "manual_boundary_decision": "manual_real_nas_write_boundary_recorded_no_production_write",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T13:41:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["manual_real_nas_write_boundary_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        listed = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert listed.status_code == 200
        assert listed.json()["found"] is True



def _seed_manual_real_nas_write_boundary(tmp_path):
    final_gate_store, final_gate = _seed_mac_relay_real_nas_write_final_execution_gate(tmp_path)
    boundary_store = tmp_path / "manual-real-nas-write-boundary-seed.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_manual_real_nas_write_boundary(
        {
            "manual_real_nas_write_boundary_ref": "nasmanualboundary-20260524142000-seed0001",
            "mac_relay_real_nas_write_final_execution_gate_ref": final_gate["mac_relay_real_nas_write_final_execution_gate_ref"],
            "mac_relay_real_nas_write_final_execution_gate_sha256": final_gate["mac_relay_real_nas_write_final_execution_gate_sha256"],
            "idempotency_key_sha256": final_gate["idempotency_key_sha256"],
            "target_filename_contract_ref": final_gate["target_filename_contract_ref"],
            "post_write_verification_contract_ref": final_gate["post_write_verification_contract_ref"],
            "pre_execution_proof_ref": final_gate["pre_execution_proof_ref"],
            "manual_boundary_decision": "manual_real_nas_write_boundary_recorded_no_production_write",
            "recorded_by": "operator:seed",
            "recorded_at": "2026-05-24T14:20:00Z",
        },
        final_execution_gate_store_path=final_gate_store,
        store_path=boundary_store,
    )
    assert result["stored"] is True
    return boundary_store, result["dto"]


def test_separate_real_nas_production_write_approval_after_manual_boundary_records_approval_envelope_without_write(tmp_path):
    boundary_store, boundary = _seed_manual_real_nas_write_boundary(tmp_path)
    approval_store = tmp_path / "separate-real-nas-production-write-approval.jsonl"
    forbidden_body = "must" + "-not" + "-echo"
    forbidden_path = "/" + "volume1" + "/private"
    forbidden_secret = "sk" + "-test" + "-secret"
    payload = {
        "separate_real_nas_production_write_approval_ref": "nasprodapproval-20260524143000-test0001",
        "manual_real_nas_write_boundary_ref": boundary["manual_real_nas_write_boundary_ref"],
        "manual_real_nas_write_boundary_sha256": boundary["manual_real_nas_write_boundary_sha256"],
        "idempotency_key_sha256": boundary["idempotency_key_sha256"],
        "target_filename_contract_ref": boundary["target_filename_contract_ref"],
        "post_write_verification_contract_ref": boundary["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": boundary["pre_execution_proof_ref"],
        "approval_token_ref": "approvaltoken-20260524143000-test0001",
        "approval_envelope_ref": "approvalenvelope-20260524143000-test0001",
        "approval_decision": "separate_exact_real_nas_production_write_approval_envelope_recorded_no_write",
        "approved_by": "operator:test",
        "approved_at": "2026-05-24T14:30:00Z",
        "markdown_body": forbidden_body,
        "write_payload": {"body": forbidden_body},
        "raw_root_path": forbidden_path,
        "credential_value": forbidden_secret,
    }
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval(
        payload,
        manual_boundary_store_path=boundary_store,
        store_path=approval_store,
    )
    assert result["stored"] is True
    dto = result["dto"]
    assert dto["separate_real_nas_production_write_approval_ready"] is True
    assert dto["source_manual_real_nas_write_boundary_verified"] is True
    assert dto["source_manual_boundary_contract_verified"] is True
    assert dto["approval_envelope_recorded"] is True
    assert dto["approval_token_recorded"] is True
    assert dto["approval_is_metadata_only"] is True
    assert dto["approval_does_not_execute_write"] is True
    assert dto["approval_does_not_materialize_payload"] is True
    assert dto["manual_boundary_does_not_execute_write"] is True
    assert dto["mac_relay_operator_presence_required"] is True
    assert dto["target_filename_contract_verified"] is True
    assert dto["post_write_verification_contract_verified"] is True
    assert dto["write_readiness_stage"] == "separate_real_nas_production_write_approval_after_manual_boundary"
    assert dto["write_readiness_percent"] == 100
    assert len(dto["separate_real_nas_production_write_approval_sha256"]) == 64
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["payload_write_preview_contract_verified"] is True
    assert dto["replay_idempotency_metadata_recorded"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["approval_includes_payload_body"] is False
    assert dto["approval_includes_write_payload"] is False
    assert dto["approval_includes_raw_root_path"] is False
    assert dto["approval_includes_secret_value"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_real_nas_production_write_execution_after_separate_approval"
    text = json.dumps(dto, sort_keys=True)
    assert forbidden_body not in text
    assert forbidden_path not in text
    assert forbidden_secret not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval(
        payload,
        manual_boundary_store_path=boundary_store,
        store_path=approval_store,
    )
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_approval_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval_records(store_path=approval_store)
    assert listed["found"] is True
    assert listed["latest_record"]["separate_real_nas_production_write_approval_ref"] == "nasprodapproval-20260524143000-test0001"


def test_separate_real_nas_production_write_approval_route_is_protected_and_records(tmp_path, monkeypatch):
    boundary_store, boundary = _seed_manual_real_nas_write_boundary(tmp_path)
    approval_store = tmp_path / "separate-real-nas-production-write-approval-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_manual_real_nas_write_boundary_store_path", lambda: boundary_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_separate_real_nas_production_write_approval_store_path", lambda: approval_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval"
    payload = {
        "separate_real_nas_production_write_approval_ref": "nasprodapproval-20260524143100-route1",
        "manual_real_nas_write_boundary_ref": boundary["manual_real_nas_write_boundary_ref"],
        "manual_real_nas_write_boundary_sha256": boundary["manual_real_nas_write_boundary_sha256"],
        "idempotency_key_sha256": boundary["idempotency_key_sha256"],
        "target_filename_contract_ref": boundary["target_filename_contract_ref"],
        "post_write_verification_contract_ref": boundary["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": boundary["pre_execution_proof_ref"],
        "approval_token_ref": "approvaltoken-20260524143100-route1",
        "approval_envelope_ref": "approvalenvelope-20260524143100-route1",
        "approval_decision": "separate_exact_real_nas_production_write_approval_envelope_recorded_no_write",
        "approved_by": "operator:route",
        "approved_at": "2026-05-24T14:31:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["separate_real_nas_production_write_approval_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        listed = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert listed.status_code == 200
        assert listed.json()["found"] is True



def _seed_separate_real_nas_production_write_approval(tmp_path):
    boundary_store, boundary = _seed_manual_real_nas_write_boundary(tmp_path)
    approval_store = tmp_path / "separate-real-nas-production-write-approval-seed.jsonl"
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_separate_real_nas_production_write_approval(
        {
            "separate_real_nas_production_write_approval_ref": "nasprodapproval-20260524150000-seed0001",
            "manual_real_nas_write_boundary_ref": boundary["manual_real_nas_write_boundary_ref"],
            "manual_real_nas_write_boundary_sha256": boundary["manual_real_nas_write_boundary_sha256"],
            "idempotency_key_sha256": boundary["idempotency_key_sha256"],
            "target_filename_contract_ref": boundary["target_filename_contract_ref"],
            "post_write_verification_contract_ref": boundary["post_write_verification_contract_ref"],
            "pre_execution_proof_ref": boundary["pre_execution_proof_ref"],
            "approval_token_ref": "approvaltoken-20260524150000-seed0001",
            "approval_envelope_ref": "approvalenvelope-20260524150000-seed0001",
            "approval_decision": "separate_exact_real_nas_production_write_approval_envelope_recorded_no_write",
            "approved_by": "operator:seed",
            "approved_at": "2026-05-24T15:00:00Z",
        },
        manual_boundary_store_path=boundary_store,
        store_path=approval_store,
    )
    assert result["stored"] is True
    return approval_store, result["dto"]


def test_real_nas_production_write_execution_preflight_after_separate_approval_records_metadata_only_preflight(tmp_path):
    approval_store, approval = _seed_separate_real_nas_production_write_approval(tmp_path)
    preflight_store = tmp_path / "real-nas-production-write-execution-preflight.jsonl"
    forbidden_body = "must" + "-not" + "-echo"
    forbidden_path = "/" + "volume1" + "/private"
    forbidden_secret = "sk" + "-test" + "-secret"
    payload = {
        "real_nas_production_write_execution_preflight_ref": "naswritepreflight-20260524153000-test0001",
        "separate_real_nas_production_write_approval_ref": approval["separate_real_nas_production_write_approval_ref"],
        "separate_real_nas_production_write_approval_sha256": approval["separate_real_nas_production_write_approval_sha256"],
        "approval_token_ref": approval["approval_token_ref"],
        "approval_envelope_ref": approval["approval_envelope_ref"],
        "idempotency_key_sha256": approval["idempotency_key_sha256"],
        "target_filename_contract_ref": approval["target_filename_contract_ref"],
        "post_write_verification_contract_ref": approval["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": approval["pre_execution_proof_ref"],
        "preflight_decision": "real_nas_production_write_execution_preflight_recorded_no_write",
        "payload_preview_ref": "payloadpreview-20260524153000-test0001",
        "write_payload_preview_ref": "writepayloadpreview-20260524153000-test0001",
        "tmp_root_write_smoke_ref": "tmprootsmoke-20260524153000-test0001",
        "recorded_by": "operator:test",
        "recorded_at": "2026-05-24T15:30:00Z",
        "markdown_body": forbidden_body,
        "write_payload": {"body": forbidden_body},
        "raw_root_path": forbidden_path,
        "credential_value": forbidden_secret,
    }
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_real_nas_production_write_execution_preflight(
        payload,
        approval_store_path=approval_store,
        store_path=preflight_store,
    )
    assert result["stored"] is True
    dto = result["dto"]
    assert dto["real_nas_production_write_execution_preflight_ready"] is True
    assert dto["source_separate_real_nas_production_write_approval_verified"] is True
    assert dto["source_approval_envelope_verified"] is True
    assert dto["source_approval_token_verified"] is True
    assert dto["preflight_is_metadata_only"] is True
    assert dto["preflight_does_not_execute_write"] is True
    assert dto["preflight_does_not_materialize_payload"] is True
    assert dto["payload_write_preview_contract_verified"] is True
    assert dto["payload_preview_contract_ref"] == "payloadpreview-20260524153000-test0001"
    assert dto["write_payload_preview_contract_ref"] == "writepayloadpreview-20260524153000-test0001"
    assert dto["replay_idempotency_metadata_recorded"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_write_smoke_ref"] == "tmprootsmoke-20260524153000-test0001"
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["write_readiness_stage"] == "real_nas_production_write_execution_preflight_after_separate_approval"
    assert dto["write_readiness_percent"] == 100
    assert len(dto["real_nas_production_write_execution_preflight_sha256"]) == 64
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_real_nas_production_write_execution_after_preflight"
    text = json.dumps(dto, sort_keys=True)
    assert forbidden_body not in text
    assert forbidden_path not in text
    assert forbidden_secret not in text

    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_real_nas_production_write_execution_preflight(
        payload,
        approval_store_path=approval_store,
        store_path=preflight_store,
    )
    assert duplicate["idempotency_replayed"] is True
    assert duplicate["dto"]["idempotency_duplicate_preflight_skipped"] is True
    listed = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_real_nas_production_write_execution_preflight_records(store_path=preflight_store)
    assert listed["found"] is True
    assert listed["latest_record"]["real_nas_production_write_execution_preflight_ref"] == "naswritepreflight-20260524153000-test0001"


def test_real_nas_production_write_execution_preflight_route_is_protected_and_records(tmp_path, monkeypatch):
    approval_store, approval = _seed_separate_real_nas_production_write_approval(tmp_path)
    preflight_store = tmp_path / "real-nas-production-write-execution-preflight-route.jsonl"
    import hermes_cli.office_controlled_mutation as office_controlled_mutation
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_separate_real_nas_production_write_approval_store_path", lambda: approval_store)
    monkeypatch.setattr(office_controlled_mutation, "_default_fresh_request_builder_downstream_consumption_real_nas_production_write_execution_preflight_store_path", lambda: preflight_store)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight"
    payload = {
        "real_nas_production_write_execution_preflight_ref": "naswritepreflight-20260524153100-route1",
        "separate_real_nas_production_write_approval_ref": approval["separate_real_nas_production_write_approval_ref"],
        "separate_real_nas_production_write_approval_sha256": approval["separate_real_nas_production_write_approval_sha256"],
        "approval_token_ref": approval["approval_token_ref"],
        "approval_envelope_ref": approval["approval_envelope_ref"],
        "idempotency_key_sha256": approval["idempotency_key_sha256"],
        "target_filename_contract_ref": approval["target_filename_contract_ref"],
        "post_write_verification_contract_ref": approval["post_write_verification_contract_ref"],
        "pre_execution_proof_ref": approval["pre_execution_proof_ref"],
        "preflight_decision": "real_nas_production_write_execution_preflight_recorded_no_write",
        "payload_preview_ref": "payloadpreview-20260524153100-route1",
        "write_payload_preview_ref": "writepayloadpreview-20260524153100-route1",
        "tmp_root_write_smoke_ref": "tmprootsmoke-20260524153100-route1",
        "recorded_by": "operator:route",
        "recorded_at": "2026-05-24T15:31:00Z",
    }
    with TestClient(app) as client:
        assert client.get(route).status_code == 401
        assert client.post(route, json=payload).status_code == 401
        response = client.post(route, json=payload, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert response.status_code == 200
        body = response.json()
        assert body["stored"] is True
        assert body["dto"]["real_nas_production_write_execution_preflight_ready"] is True
        assert body["dto"]["real_nas_production_write_enabled"] is False
        listed = client.get(route, headers={"X-Hermes-Session-Token": _SESSION_TOKEN})
        assert listed.status_code == 200
        assert listed.json()["found"] is True
