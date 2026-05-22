"""Tests for bounded exact approval records for downstream consumption boundary design."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_boundary_design import (
    _seed_consumption_enablement,
)


def _exact_approval_payload(design: dict[str, object]) -> dict[str, object]:
    dto = design["dto"]
    return {
        "exact_approval_ref": "exactapproval-20260522120000-cafe9001",
        "selection_profile": "latest_written",
        "source_consumption_enablement_ref": dto["source_consumption_enablement_ref"],
        "source_consumption_enablement_record_sha256": dto["source_consumption_enablement_record_sha256"],
        "boundary_design_sha256": dto["boundary_design_sha256"],
        "approved_by": "agent_orchestrator",
        "approved_at": "2026-05-22T12:00:00Z",
        "operator_confirmation": "confirmed-approve-one-shot-downstream-consumption-boundary-only",
        "safe_summary": "Exact approval metadata for the one-shot consumption boundary only; actual consumption remains disabled.",
        "evidence_refs": [
            f"boundary-design:{dto['boundary_design_sha256']}",
            f"consumption-enable:{dto['source_consumption_enablement_record_sha256']}",
        ],
    }


def _seed_boundary_design(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    review_store = tmp_path / "review-records.jsonl"
    use_enablement_store = tmp_path / "use-enablements.jsonl"
    consumption_enablement_store = tmp_path / "consumption-enablements.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store)
    design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design(
        consumption_enablement_store_path=consumption_enablement_store,
    )
    assert design["found"] is True
    return design, consumption_enablement_store


def test_downstream_consumption_exact_approval_writes_safe_ref_without_consuming(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_records,
    )

    design, consumption_enablement_store = _seed_boundary_design(tmp_path)
    approval_store = tmp_path / "exact-approvals.jsonl"

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record(
        _exact_approval_payload(design),
        consumption_enablement_store_path=consumption_enablement_store,
        store_path=approval_store,
    )

    assert result["stored"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_exact_approval_record"
    assert dto["exact_approval_recorded"] is True
    assert dto["boundary_design_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["exact_approval_ref"] == "exactapproval-20260522120000-cafe9001"
    assert dto["boundary_design_sha256"] == design["dto"]["boundary_design_sha256"]
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["approval_record_write_enabled"] is True
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
    assert dto["capabilities"]["one_shot_exact_approval_recording_enabled"] is True
    assert dto["capabilities"]["actual_downstream_consumption_enabled"] is False
    assert len(dto["exact_approval_record_sha256"]) == 64

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_records(
        store_path=approval_store,
        exact_approval_ref="exactapproval-20260522120000-cafe9001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["exact_approval_ref"] == "exactapproval-20260522120000-cafe9001"
    assert readback["dto"]["downstream_consumption_enabled"] is False
    assert readback["dto"]["actual_downstream_consumption_allowed"] is False

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_exact_approval_rejects_without_design_or_unsafe_payload(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record,
    )

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_exact_approval_record(
        {
            "exact_approval_ref": "../../Users/lidises/private",
            "selection_profile": "latest_written",
            "source_consumption_enablement_ref": "consumptionenable-20260521170000-bafe8001",
            "source_consumption_enablement_record_sha256": "0" * 64,
            "boundary_design_sha256": "0" * 64,
            "approved_by": "agent_orchestrator",
            "approved_at": "2026-05-22T12:00:00Z",
            "operator_confirmation": "please-consume-downstream-now",
            "safe_summary": "Exact approval only.",
            "evidence_refs": ["/Users/lidises/private"],
            "raw_root_path": "/Users/lidises/private",
            "credential": "sk-test-secret",
        },
        consumption_enablement_store_path=tmp_path / "missing-enablements.jsonl",
        store_path=tmp_path / "exact-approvals.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    assert {tuple(error.values()) for error in result["errors"]} >= {
        ("boundary_design", "boundary_design_not_ready"),
        ("exact_approval_ref", "unsupported_ref_shape"),
        ("operator_confirmation", "unsupported_confirmation"),
        ("evidence_refs", "invalid_opaque_ref"),
    }
    serialized = json.dumps(result, sort_keys=True)
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
    assert "please-consume-downstream-now" not in serialized


def test_downstream_consumption_exact_approval_api_is_protected_and_readback_safe(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    review_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_manual_review_records.jsonl"
    use_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_use_enablement_records.jsonl"
    consumption_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_consumption_enablement_records.jsonl"
    _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store)
    design = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design()
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-exact-approvals",
        json=_exact_approval_payload(design),
    )
    assert unauth.status_code == 401

    authed = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-exact-approvals",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=_exact_approval_payload(design),
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["stored"] is True
    assert body["dto"]["exact_approval_recorded"] is True
    assert body["dto"]["downstream_consumption_enabled"] is False

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-exact-approvals?exact_approval_ref=exactapproval-20260522120000-cafe9001",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["record_count"] == 1
    assert dto["latest_record"]["exact_approval_ref"] == "exactapproval-20260522120000-cafe9001"
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    serialized = json.dumps(readback.json(), sort_keys=True)
    assert "Safe body" not in serialized
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
