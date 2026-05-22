"""Tests for bounded downstream consumption replay-store write contract readback."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_noop_replay_probe import (
    _probe_payload,
    _seed_execution_gate,
)


def _seed_noop_replay_probe(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record

    gate, gate_store = _seed_execution_gate(tmp_path)
    probe_store = tmp_path / "noop-replay-probes.jsonl"
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record(
        _probe_payload(gate),
        execution_gate_store_path=gate_store,
        store_path=probe_store,
    )
    assert stored["stored"] is True
    return stored["dto"], probe_store


def test_downstream_consumption_replay_store_write_contract_is_readonly_and_keyed_by_noop_probe(tmp_path):
    from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract

    probe, probe_store = _seed_noop_replay_probe(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_store_path=probe_store,
        noop_replay_probe_ref=probe["noop_replay_probe_ref"],
    )

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract"
    assert dto["replay_store_contract_ready"] is True
    assert dto["noop_replay_probe_record_verified"] is True
    assert dto["noop_replay_probe_ref"] == "noopreplay-20260522133000-cafe2002"
    assert dto["noop_replay_probe_record_sha256"] == probe["noop_replay_probe_record_sha256"]
    assert dto["safe_ref_chain_verified"] is True
    assert dto["idempotency_probe_key_verified"] is True
    assert dto["replay_store_key_ref"] == probe["idempotency_probe_key_ref"]
    assert dto["contract_write_shape_version"] == "safe_replay_store_contract_v1"
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["capabilities"]["replay_store_contract_readback_enabled"] is True
    assert dto["capabilities"]["real_replay_store_write_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_replay_store_metadata_write"
    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_replay_store_write_contract_rejects_unsupported_ref_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract

    _, probe_store = _seed_noop_replay_probe(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_store_path=probe_store,
        noop_replay_probe_ref="/Users/lidises/private/sk-test-raw",
    )

    assert result["found"] is False
    assert result["dto"] is None
    assert result["errors"] == [{"field": "noop_replay_probe_ref", "code": "unsupported_ref_shape"}]
    assert "/Users/lidises/private" not in json.dumps(result, sort_keys=True)
    assert "sk-test-raw" not in json.dumps(result, sort_keys=True)


def test_downstream_consumption_replay_store_write_contract_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import _seed_consumption_enablement
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_exact_approval import _exact_approval_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_execution_gate import _gate_payload

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
    probe = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record(_probe_payload(gate["dto"]))
    assert probe["stored"] is True
    client = TestClient(app)

    unauth = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-write-contract"
    )
    assert unauth.status_code == 401

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-write-contract?noop_replay_probe_ref=noopreplay-20260522133000-cafe2002",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["replay_store_contract_ready"] is True
    assert dto["noop_replay_probe_record_verified"] is True
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
