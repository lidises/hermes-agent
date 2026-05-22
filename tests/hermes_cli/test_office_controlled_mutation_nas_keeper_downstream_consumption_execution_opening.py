"""Tests for opening a one-shot execution boundary after idempotency guard."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_idempotency_replay_guard import (
    _guard_payload,
    _seed_operator_approval,
)
from hermes_cli.office_controlled_mutation import (
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record,
    append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record,
    list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_records,
)
from hermes_cli.web_server import _SESSION_TOKEN, app


def _seed_guard(tmp_path):
    approval, approval_store = _seed_operator_approval(tmp_path)
    guard_store = tmp_path / "guard.jsonl"
    guard = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record(
        _guard_payload(approval),
        operator_execution_approval_store_path=approval_store,
        store_path=guard_store,
    )
    assert guard["stored"] is True
    return guard["dto"], guard_store


def _opening_payload(guard_record):
    return {
        "execution_opening_ref": "executionopen-20260522083000-test0001",
        "idempotency_replay_guard_ref": guard_record["idempotency_replay_guard_ref"],
        "idempotency_replay_guard_record_sha256": guard_record["idempotency_replay_guard_record_sha256"],
        "operator_execution_approval_ref": guard_record["operator_execution_approval_ref"],
        "operator_execution_approval_record_sha256": guard_record["operator_execution_approval_record_sha256"],
        "replay_store_entry_ref": guard_record["replay_store_entry_ref"],
        "replay_store_metadata_record_sha256": guard_record["replay_store_metadata_record_sha256"],
        "execution_design_sha256": guard_record["execution_design_sha256"],
        "execution_opening_scope": "one_shot_actual_downstream_consumption_execution_opening_after_idempotency_guard",
        "opened_by": "operator-safe-ref",
        "opened_at": "2026-05-22T08:30:00Z",
        "operator_confirmation": "confirmed-open-one-shot-execution-boundary-after-idempotency-guard",
        "safe_summary": "Open one-shot execution boundary after guard without executing consumption.",
        "evidence_refs": ["guard:idempotency", "code:test"],
        "raw_root_path": "/volume1/private",
        "markdown_body": "must-not-echo-write-payload",
        "credential_value": "must-not-echo-secret",
    }


def test_execution_opening_record_is_metadata_only_and_keeps_execution_closed(tmp_path):
    guard, guard_store = _seed_guard(tmp_path)
    opening_store = tmp_path / "opening.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record(
        _opening_payload(guard),
        idempotency_replay_guard_store_path=guard_store,
        store_path=opening_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["execution_opening_recorded"] is True
    assert dto["idempotency_replay_guard_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["execution_opening_ready"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["secret_value_included"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_noop_execution_probe_after_opening"
    serialized = json.dumps(dto, sort_keys=True)
    assert "must-not-echo" not in serialized
    assert "/volume1/private" not in serialized

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_records(
        store_path=opening_store,
        execution_opening_ref=dto["execution_opening_ref"],
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["execution_opening_record_sha256"] == dto["execution_opening_record_sha256"]


def test_execution_opening_rejects_guard_mismatch_without_echoing_payload(tmp_path):
    guard, guard_store = _seed_guard(tmp_path)
    payload = _opening_payload(guard)
    payload["idempotency_replay_guard_record_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record(
        payload,
        idempotency_replay_guard_store_path=guard_store,
        store_path=tmp_path / "opening.jsonl",
    )

    assert result["stored"] is False
    assert {(e["field"], e["code"]) for e in result["errors"]} >= {
        ("idempotency_replay_guard_record_sha256", "idempotency_replay_guard_mismatch")
    }
    serialized = json.dumps(result, sort_keys=True)
    assert "must-not-echo" not in serialized
    assert "/volume1/private" not in serialized


def test_execution_opening_route_is_protected_and_readbacks(tmp_path, monkeypatch):
    guard, guard_store = _seed_guard(tmp_path)
    opening_store = tmp_path / "opening.jsonl"
    monkeypatch.setattr(
        "hermes_cli.office_controlled_mutation._default_fresh_request_builder_downstream_consumption_idempotency_replay_guard_record_store_path",
        lambda: guard_store,
    )
    monkeypatch.setattr(
        "hermes_cli.office_controlled_mutation._default_fresh_request_builder_downstream_consumption_execution_opening_record_store_path",
        lambda: opening_store,
    )

    with TestClient(app) as client:
        assert client.post(
            "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-openings",
            json=_opening_payload(guard),
        ).status_code == 401
        token = _SESSION_TOKEN
        headers = {"X-Hermes-Session-Token": token}
        stored = client.post(
            "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-openings",
            json=_opening_payload(guard),
            headers=headers,
        )
        assert stored.status_code == 200
        assert stored.json()["stored"] is True
        readback = client.get(
            "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-openings",
            headers=headers,
        )
        assert readback.status_code == 200
        body = readback.json()
        assert body["found"] is True
        assert body["dto"]["latest_record"]["execution_opening_ready"] is True
        assert body["dto"]["latest_record"]["actual_downstream_consumption_executed"] is False
