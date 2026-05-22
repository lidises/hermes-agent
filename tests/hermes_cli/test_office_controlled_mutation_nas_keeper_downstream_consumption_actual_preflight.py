"""Tests for actual downstream consumption preflight after exact approval."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_exact_approval import (
    _exact_approval_payload,
    _seed_boundary_design,
)


def _seed_exact_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
    )

    design, consumption_enablement_store = _seed_boundary_design(tmp_path)
    approval_store = tmp_path / "exact-approvals.jsonl"
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record(
        _exact_approval_payload(design),
        consumption_enablement_store_path=consumption_enablement_store,
        store_path=approval_store,
    )
    assert stored["stored"] is True
    return stored, approval_store


def test_downstream_consumption_actual_preflight_reads_exact_approval_without_consuming(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
    )

    stored, approval_store = _seed_exact_approval(tmp_path)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight(
        exact_approval_store_path=approval_store,
        exact_approval_ref="exactapproval-20260522120000-cafe9001",
    )

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight"
    assert dto["actual_consumption_preflight_ready"] is True
    assert dto["exact_approval_record_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["exact_approval_ref"] == stored["dto"]["exact_approval_ref"]
    assert dto["exact_approval_record_sha256"] == stored["dto"]["exact_approval_record_sha256"]
    assert dto["boundary_design_sha256"] == stored["dto"]["boundary_design_sha256"]
    assert dto["target_allowlist_verified"] is True
    assert dto["idempotency_replay_lookup_required"] is True
    assert dto["disable_switch_required"] is True
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["replay_store_write_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["capabilities"]["actual_consumption_preflight_readback_enabled"] is True
    assert dto["capabilities"]["actual_downstream_consumption_enabled"] is False
    assert dto["capabilities"]["replay_store_write_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_gate"

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_actual_preflight_waits_without_exact_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight(
        exact_approval_store_path=tmp_path / "missing-exact-approvals.jsonl",
    )

    assert result["found"] is False
    dto = result["dto"]
    assert dto["actual_consumption_preflight_ready"] is False
    assert dto["exact_approval_record_verified"] is False
    assert dto["safe_ref_chain_verified"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_one_shot_exact_approval"


def test_downstream_consumption_actual_preflight_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import (
        _seed_consumption_enablement,
    )

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    review_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_manual_review_records.jsonl"
    use_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_use_enablement_records.jsonl"
    consumption_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_consumption_enablement_records.jsonl"
    _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store)
    design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design()
    stored = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record(
        _exact_approval_payload(design),
    )
    assert stored["stored"] is True
    client = TestClient(app)

    unauth = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-preflight"
    )
    assert unauth.status_code == 401

    authed = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-preflight?exact_approval_ref=exactapproval-20260522120000-cafe9001",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert authed.status_code == 200
    dto = authed.json()["dto"]
    assert dto["actual_consumption_preflight_ready"] is True
    assert dto["exact_approval_record_verified"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    serialized = json.dumps(authed.json(), sort_keys=True)
    assert "Safe body" not in serialized
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
