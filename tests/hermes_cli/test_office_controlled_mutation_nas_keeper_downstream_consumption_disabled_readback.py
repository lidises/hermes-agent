"""Tests for actual downstream consumption disabled readback after replay-store metadata."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_replay_store_contract import (
    _seed_noop_replay_probe,
)
from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_replay_store_metadata import (
    _replay_store_payload,
)


def _seed_replay_store_metadata(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract,
    )

    probe, probe_store = _seed_noop_replay_probe(tmp_path)
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(
        noop_replay_probe_store_path=probe_store,
        noop_replay_probe_ref=probe["noop_replay_probe_ref"],
    )
    metadata_store = tmp_path / "replay-store-metadata.jsonl"
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(
        _replay_store_payload(contract),
        noop_replay_probe_store_path=probe_store,
        store_path=metadata_store,
    )
    assert stored["stored"] is True
    return stored["dto"], metadata_store


def test_actual_consumption_disabled_readback_proves_metadata_chain_without_consuming(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_disabled_readback,
    )

    metadata, metadata_store = _seed_replay_store_metadata(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_disabled_readback(
        replay_store_metadata_store_path=metadata_store,
        replay_store_entry_ref=metadata["replay_store_entry_ref"],
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_disabled_readback"
    assert dto["actual_consumption_disabled_readback_ready"] is True
    assert dto["replay_store_metadata_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["replay_store_entry_ref"] == metadata["replay_store_entry_ref"]
    assert dto["replay_store_metadata_record_sha256"] == metadata["replay_store_metadata_record_sha256"]
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["capabilities"]["actual_downstream_consumption_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_design_if_approved"
    serialized = json.dumps(result, sort_keys=True)
    assert "metadata_recorded_only" in serialized
    assert "write payload" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_actual_consumption_disabled_readback_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record,
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
    metadata = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(_replay_store_payload(contract))
    assert metadata["stored"] is True

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-disabled-readback"

    assert client.get(route).status_code == 401
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["actual_consumption_disabled_readback_ready"] is True
    assert dto["replay_store_metadata_record_verified"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["real_replay_store_written"] is False
