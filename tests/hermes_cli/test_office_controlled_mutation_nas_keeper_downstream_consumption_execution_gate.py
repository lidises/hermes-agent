"""Tests for bounded downstream consumption execution gate records."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_preflight import _seed_exact_approval


def _gate_payload(preflight):
    dto = preflight["dto"]
    return {
        "execution_gate_ref": "executiongate-20260522125000-cafe1001",
        "selection_profile": "latest_written",
        "exact_approval_ref": dto["exact_approval_ref"],
        "exact_approval_record_sha256": dto["exact_approval_record_sha256"],
        "boundary_design_sha256": dto["boundary_design_sha256"],
        "approved_by": "operator-ai-office",
        "approved_at": "2026-05-22T03:50:00Z",
        "operator_confirmation": "confirmed-open-downstream-consumption-execution-gate-boundary-only",
        "safe_summary": "Safe execution gate metadata only; actual consumption remains disabled.",
        "evidence_refs": ["evidence:actual-preflight", "evidence:exact-approval"],
    }


def test_downstream_consumption_execution_gate_write_and_readback_is_metadata_only(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_records,
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
    dto = stored["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_execution_gate_record"
    assert dto["execution_gate_opened"] is True
    assert dto["execution_gate_ref"] == "executiongate-20260522125000-cafe1001"
    assert dto["actual_consumption_preflight_verified"] is True
    assert dto["exact_approval_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert len(dto["execution_gate_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_noop_replay_probe"

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_records(
        store_path=gate_store,
        execution_gate_ref="executiongate-20260522125000-cafe1001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["execution_gate_ref"] == "executiongate-20260522125000-cafe1001"
    serialized = json.dumps(readback, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_execution_gate_rejects_mismatched_preflight(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
    )

    _, approval_store = _seed_exact_approval(tmp_path)
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight(
        exact_approval_store_path=approval_store,
    )
    payload = _gate_payload(preflight)
    payload["exact_approval_record_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record(
        payload,
        exact_approval_store_path=approval_store,
        store_path=tmp_path / "execution-gates.jsonl",
    )

    assert result["stored"] is False
    assert {error["field"] for error in result["errors"]} >= {"exact_approval_record_sha256"}


def test_downstream_consumption_execution_gate_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
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
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates",
        json=_gate_payload(preflight),
    )
    assert unauth.status_code == 401

    stored = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates",
        json=_gate_payload(preflight),
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert stored.status_code == 200
    assert stored.json()["stored"] is True

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates?execution_gate_ref=executiongate-20260522125000-cafe1001",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["record_count"] == 1
    assert dto["latest_record"]["execution_gate_opened"] is True
    assert dto["latest_record"]["downstream_consumption_enabled"] is False
    assert dto["latest_record"]["actual_downstream_consumption_allowed"] is False
