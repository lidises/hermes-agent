"""Tests for bounded downstream consumption noop replay probe records."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_execution_gate import _gate_payload
from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_preflight import _seed_exact_approval


def _seed_execution_gate(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
    )

    _, approval_store = _seed_exact_approval(tmp_path)
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight(
        exact_approval_store_path=approval_store,
    )
    gate_store = tmp_path / "execution-gates.jsonl"
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record(
        _gate_payload(preflight),
        exact_approval_store_path=approval_store,
        store_path=gate_store,
    )
    assert stored["stored"] is True
    return stored["dto"], gate_store


def _probe_payload(gate):
    return {
        "noop_replay_probe_ref": "noopreplay-20260522133000-cafe2002",
        "execution_gate_ref": gate["execution_gate_ref"],
        "execution_gate_record_sha256": gate["execution_gate_record_sha256"],
        "selection_profile": "latest_written",
        "idempotency_probe_key_ref": "probe-key-20260522133000-cafe2002",
        "probe_mode": "noop_replay_probe_only",
        "approved_by": "operator-ai-office",
        "approved_at": "2026-05-22T04:30:00Z",
        "operator_confirmation": "confirmed-noop-replay-probe-boundary-only",
        "safe_summary": "Safe noop replay probe metadata only; actual consumption remains disabled.",
        "evidence_refs": ["evidence:execution-gate", "evidence:actual-preflight"],
    }


def test_downstream_consumption_noop_replay_probe_write_and_readback_is_metadata_only(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_records,
    )

    gate, gate_store = _seed_execution_gate(tmp_path)
    probe_store = tmp_path / "noop-replay-probes.jsonl"

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record(
        _probe_payload(gate),
        execution_gate_store_path=gate_store,
        store_path=probe_store,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_noop_replay_probe_record"
    assert dto["noop_replay_probe_recorded"] is True
    assert dto["noop_replay_probe_ref"] == "noopreplay-20260522133000-cafe2002"
    assert dto["execution_gate_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["idempotency_probe_key_verified"] is True
    assert dto["noop_probe_result"] == "noop_probe_succeeded"
    assert len(dto["noop_replay_probe_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_replay_store_write_contract"

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_records(
        store_path=probe_store,
        noop_replay_probe_ref="noopreplay-20260522133000-cafe2002",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["noop_replay_probe_ref"] == "noopreplay-20260522133000-cafe2002"
    serialized = json.dumps(readback, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_noop_replay_probe_rejects_mismatched_execution_gate(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record

    gate, gate_store = _seed_execution_gate(tmp_path)
    payload = _probe_payload(gate)
    payload["execution_gate_record_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record(
        payload,
        execution_gate_store_path=gate_store,
        store_path=tmp_path / "noop-replay-probes.jsonl",
    )

    assert result["stored"] is False
    assert {error["field"] for error in result["errors"]} >= {"execution_gate_record_sha256"}


def test_downstream_consumption_noop_replay_probe_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import _seed_consumption_enablement
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_exact_approval import _exact_approval_payload

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    base = tmp_path / "home" / "office" / "controlled-mutation"
    _seed_consumption_enablement(
        queue_dir,
        root,
        base / "fresh_request_builder_manual_review_records.jsonl",
        base / "fresh_request_builder_downstream_use_enablement_records.jsonl",
        base / "fresh_request_builder_downstream_consumption_enablement_records.jsonl",
    )
    design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design()
    assert append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record(_exact_approval_payload(design))["stored"] is True
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight()
    gate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record(_gate_payload(preflight))
    assert gate["stored"] is True
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-replay-probes",
        json=_probe_payload(gate["dto"]),
    )
    assert unauth.status_code == 401

    stored = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-replay-probes",
        json=_probe_payload(gate["dto"]),
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert stored.status_code == 200
    assert stored.json()["stored"] is True

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-replay-probes?noop_replay_probe_ref=noopreplay-20260522133000-cafe2002",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["record_count"] == 1
    assert dto["latest_record"]["noop_replay_probe_recorded"] is True
    assert dto["latest_record"]["downstream_consumption_enabled"] is False
    assert dto["latest_record"]["actual_downstream_consumption_allowed"] is False
