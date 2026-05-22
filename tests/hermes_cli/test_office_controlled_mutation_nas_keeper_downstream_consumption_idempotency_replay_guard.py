"""Tests for the one-shot downstream-consumption idempotency replay guard."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_disabled_readback import (
    _seed_replay_store_metadata,
)
from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_operator_execution_approval import (
    _operator_execution_approval_payload,
)


def _seed_operator_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design,
    )

    metadata, metadata_store = _seed_replay_store_metadata(tmp_path)
    design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design(
        replay_store_metadata_store_path=metadata_store,
        replay_store_entry_ref=metadata["replay_store_entry_ref"],
    )
    approval_store = tmp_path / "operator-execution-approvals.jsonl"
    approval = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record(
        _operator_execution_approval_payload(design),
        replay_store_metadata_store_path=metadata_store,
        store_path=approval_store,
    )
    assert approval["stored"] is True
    return approval["dto"], approval_store


def _guard_payload(approval):
    return {
        "idempotency_replay_guard_ref": "idempotencyguard-20260522173000-test",
        "operator_execution_approval_ref": approval["operator_execution_approval_ref"],
        "operator_execution_approval_record_sha256": approval["operator_execution_approval_record_sha256"],
        "replay_store_entry_ref": approval["replay_store_entry_ref"],
        "replay_store_metadata_record_sha256": approval["replay_store_metadata_record_sha256"],
        "execution_design_sha256": approval["execution_design_sha256"],
        "replay_guard_scope": "one_shot_actual_downstream_consumption_idempotency_guard",
        "guarded_by": "operator-safe-ref",
        "guarded_at": "2026-05-22T17:30:00Z",
        "operator_confirmation": "confirmed-guard-one-shot-actual-downstream-consumption-before-execution",
        "safe_summary": "Guard one approved downstream consumption attempt before any execution opening.",
        "evidence_refs": ["approval:operator-execution"],
    }


def test_idempotency_replay_guard_records_metadata_only_and_blocks_duplicates(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_records,
    )

    approval, approval_store = _seed_operator_approval(tmp_path)
    guard_store = tmp_path / "idempotency-replay-guards.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record(
        _guard_payload(approval),
        operator_execution_approval_store_path=approval_store,
        store_path=guard_store,
    )

    assert result["stored"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record"
    assert dto["idempotency_replay_guard_recorded"] is True
    assert dto["operator_execution_approval_record_verified"] is True
    assert dto["execution_design_verified"] is True
    assert dto["replay_store_metadata_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["duplicate_execution_design_blocked"] is True
    assert dto["duplicate_replay_store_entry_blocked"] is True
    assert dto["duplicate_operator_execution_approval_blocked"] is True
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["real_replay_store_written"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert len(dto["idempotency_replay_guard_record_sha256"]) == 64

    duplicate_payload = _guard_payload(approval)
    duplicate_payload["idempotency_replay_guard_ref"] = "idempotencyguard-20260522173100-test"
    duplicate = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record(
        duplicate_payload,
        operator_execution_approval_store_path=approval_store,
        store_path=guard_store,
    )
    assert duplicate["stored"] is False
    assert {(error["field"], error["code"]) for error in duplicate["errors"]} >= {
        ("execution_design_sha256", "duplicate_execution_design_guard"),
        ("replay_store_entry_ref", "duplicate_replay_store_entry_guard"),
        ("operator_execution_approval_ref", "duplicate_operator_execution_approval_guard"),
    }

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_records(
        store_path=guard_store,
        idempotency_replay_guard_ref=dto["idempotency_replay_guard_ref"],
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["idempotency_replay_guard_record_sha256"] == dto["idempotency_replay_guard_record_sha256"]
    assert readback["dto"]["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_execution_opening_after_idempotency_guard"
    serialized = json.dumps(readback, sort_keys=True)
    assert "write payload" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_idempotency_replay_guard_rejects_mismatched_operator_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record,
    )

    approval, approval_store = _seed_operator_approval(tmp_path)
    payload = _guard_payload(approval)
    payload["operator_execution_approval_record_sha256"] = "0" * 64

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record(
        payload,
        operator_execution_approval_store_path=approval_store,
        store_path=tmp_path / "idempotency-replay-guards.jsonl",
    )

    assert result["stored"] is False
    assert {(error["field"], error["code"]) for error in result["errors"]} >= {
        ("operator_execution_approval_record_sha256", "operator_execution_approval_mismatch")
    }


def test_idempotency_replay_guard_api_is_protected_and_metadata_only(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_replay_probe_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import _seed_consumption_enablement
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_exact_approval import _exact_approval_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_execution_gate import _gate_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_noop_replay_probe import _probe_payload
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_replay_store_metadata import _replay_store_payload

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
    contract = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract(noop_replay_probe_ref=probe["dto"]["noop_replay_probe_ref"])
    metadata = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(_replay_store_payload(contract))
    assert metadata["stored"] is True
    execution_design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design()
    approval = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record(_operator_execution_approval_payload(execution_design))
    assert approval["stored"] is True

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-idempotency-replay-guards"
    payload = _guard_payload(approval["dto"])
    payload["idempotency_replay_guard_ref"] = "idempotencyguard-20260522173200-api"
    payload["raw_root_path"] = "/volume1/private"
    payload["markdown_body"] = "write payload should not be echoed"
    payload["credential_value"] = "***"

    assert client.post(route, json=payload).status_code == 401
    posted = client.post(route, json=payload, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert posted.status_code == 200
    post_json = posted.json()
    assert post_json["stored"] is True
    dto = post_json["dto"]
    assert dto["idempotency_replay_guard_recorded"] is True
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["actual_downstream_consumption_executed"] is False
    assert dto["real_replay_store_written"] is False

    assert client.get(route).status_code == 401
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    readback_json = readback.json()
    assert readback_json["found"] is True
    assert readback_json["dto"]["record_count"] == 1
    serialized = json.dumps(readback_json, sort_keys=True)
    assert "write payload" not in serialized
    assert "/volume1/private" not in serialized
    assert "***" not in serialized
