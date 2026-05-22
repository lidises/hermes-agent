"""Tests for bounded downstream consumption replay-store metadata records."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_replay_store_contract import (
    _seed_noop_replay_probe,
)


def _replay_store_payload(contract):
    dto = contract["dto"] if "dto" in contract else contract
    return {
        "replay_store_entry_ref": "replaystore-20260522142000-cafe3003",
        "noop_replay_probe_ref": dto["noop_replay_probe_ref"],
        "noop_replay_probe_record_sha256": dto["noop_replay_probe_record_sha256"],
        "replay_store_key_ref": dto["replay_store_key_ref"],
        "source_record_sha256": dto["noop_replay_probe_record_sha256"],
        "contract_write_shape_version": "safe_replay_store_contract_v1",
        "result_status": "metadata_recorded_only",
        "recorded_by": "operator-ai-office",
        "recorded_at": "2026-05-22T05:20:00Z",
        "operator_confirmation": "confirmed-replay-store-metadata-only",
        "safe_summary": "Safe replay-store metadata record only; actual downstream consumption remains disabled.",
        "evidence_refs": ["evidence:noop-replay-probe", "evidence:replay-store-contract"],
    }


def test_downstream_consumption_replay_store_metadata_write_and_readback_is_safe_ref_only(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_records,
    )

    probe, probe_store = _seed_noop_replay_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_store_path=probe_store,
        noop_replay_probe_ref=probe["noop_replay_probe_ref"],
    )
    store_path = tmp_path / "replay-store-metadata.jsonl"

    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(
        _replay_store_payload(contract),
        noop_replay_probe_store_path=probe_store,
        store_path=store_path,
    )

    assert stored["stored"] is True
    dto = stored["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_metadata_record"
    assert dto["replay_store_metadata_recorded"] is True
    assert dto["replay_store_entry_ref"] == "replaystore-20260522142000-cafe3003"
    assert dto["noop_replay_probe_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["contract_write_shape_version_verified"] is True
    assert dto["source_record_sha256_verified"] is True
    assert dto["result_status"] == "metadata_recorded_only"
    assert len(dto["replay_store_metadata_record_sha256"]) == 64
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["replay_store_write_enabled"] is True
    assert dto["real_replay_store_written"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback"

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_records(
        store_path=store_path,
        replay_store_entry_ref="replaystore-20260522142000-cafe3003",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    latest = readback["dto"]["latest_record"]
    assert latest["replay_store_metadata_recorded"] is True
    assert latest["noop_replay_probe_ref"] == probe["noop_replay_probe_ref"]
    serialized = json.dumps(readback, sort_keys=True)
    assert "Safe body" not in serialized
    assert "markdown_body_ref" not in serialized
    assert "markdown_body_sha256" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_replay_store_metadata_rejects_mismatched_probe_sha_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract,
    )

    probe, probe_store = _seed_noop_replay_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_store_path=probe_store,
        noop_replay_probe_ref=probe["noop_replay_probe_ref"],
    )
    payload = _replay_store_payload(contract)
    payload["noop_replay_probe_record_sha256"] = "0" * 64
    payload["raw_path"] = "/Users/lidises/private/sk-test-raw"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(
        payload,
        noop_replay_probe_store_path=probe_store,
        store_path=tmp_path / "replay-store-metadata.jsonl",
    )

    assert result["stored"] is False
    assert {error["field"] for error in result["errors"]} >= {"noop_replay_probe_record_sha256", "unsupported_fields"}
    serialized = json.dumps(result, sort_keys=True)
    assert "/Users/lidises/private" not in serialized
    assert "sk-test-raw" not in serialized


def test_downstream_consumption_replay_store_metadata_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import _seed_consumption_enablement
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_exact_approval import _exact_approval_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_execution_gate import _gate_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_noop_replay_probe import _probe_payload

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
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_ref=probe["dto"]["noop_replay_probe_ref"],
    )
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-metadata-records"

    assert client.post(route, json=_replay_store_payload(contract)).status_code == 401
    stored = client.post(route, json=_replay_store_payload(contract), headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert stored.status_code == 200
    assert stored.json()["stored"] is True

    readback = client.get(
        f"{route}?replay_store_entry_ref=replaystore-20260522142000-cafe3003",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["record_count"] == 1
    assert dto["latest_record"]["replay_store_metadata_recorded"] is True
    assert dto["latest_record"]["real_replay_store_written"] is False
    assert dto["latest_record"]["actual_downstream_consumption_allowed"] is False
