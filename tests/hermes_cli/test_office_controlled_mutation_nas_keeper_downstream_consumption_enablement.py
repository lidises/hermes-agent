"""Tests for bounded downstream consumption enablement records after preflight."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_preflight import (
    _seed_enablement,
)


def _consumption_enablement_payload(preflight: dict[str, object]) -> dict[str, object]:
    dto = preflight["dto"]
    return {
        "consumption_enablement_ref": "consumptionenable-20260521170000-bafe8001",
        "selection_profile": "latest_written",
        "source_consumption_preflight_decision_sha256": dto["consumption_preflight_decision_sha256"],
        "source_preflight_decision_sha256": dto["source_preflight_decision_sha256"],
        "enablement_ref": dto["enablement_ref"],
        "enablement_record_sha256": dto["enablement_record_sha256"],
        "manual_review_ref": dto["manual_review_ref"],
        "manual_review_record_sha256": dto["manual_review_record_sha256"],
        "checksum_set_sha256": dto["checksum_set_sha256"],
        "selected_item_count": dto["selected_item_count"],
        "enabled_by": "agent_orchestrator",
        "enabled_at": "2026-05-21T17:00:00Z",
        "operator_confirmation": "confirmed-enable-downstream-consumption-readiness-only",
        "safe_summary": "Consumption enablement safe-ref record only; actual consumption remains disabled.",
        "evidence_refs": [f"consumptionpreflight:{dto['consumption_preflight_decision_sha256']}", f"enablement:{dto['enablement_record_sha256']}"],
    }


def _seed_consumption_preflight(queue_dir, root, review_store, enablement_store):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight,
    )

    _seed_enablement(queue_dir, root, review_store, enablement_store)
    return get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=review_store,
        enablement_store_path=enablement_store,
    )


def test_downstream_consumption_enablement_record_writes_safe_ref_without_consuming(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_records,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    review_store = tmp_path / "review-records.jsonl"
    enablement_store = tmp_path / "enablement-records.jsonl"
    consumption_enablement_store = tmp_path / "consumption-enablements.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    preflight = _seed_consumption_preflight(queue_dir, root, review_store, enablement_store)
    assert preflight["dto"]["consumption_preflight_passed"] is True

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record(
        _consumption_enablement_payload(preflight),
        queue_dir=queue_dir,
        review_store_path=review_store,
        enablement_store_path=enablement_store,
        store_path=consumption_enablement_store,
    )

    assert result["stored"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record"
    assert dto["downstream_consumption_enablement_recorded"] is True
    assert dto["consumption_enablement_ref"] == "consumptionenable-20260521170000-bafe8001"
    assert dto["consumption_preflight_verified"] is True
    assert dto["enablement_ref"] == preflight["dto"]["enablement_ref"]
    assert dto["enablement_record_sha256"] == preflight["dto"]["enablement_record_sha256"]
    assert dto["source_consumption_preflight_decision_sha256"] == preflight["dto"]["consumption_preflight_decision_sha256"]
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert len(dto["consumption_enablement_record_sha256"]) == 64
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["repeat_execution_replay_allowed"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["capabilities"]["downstream_consumption_enablement_recording_enabled"] is True
    assert dto["capabilities"]["downstream_consumption_enabled"] is False

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_records(
        store_path=consumption_enablement_store,
        consumption_enablement_ref="consumptionenable-20260521170000-bafe8001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["consumption_enablement_ref"] == "consumptionenable-20260521170000-bafe8001"
    assert readback["dto"]["downstream_use_enabled"] is True
    assert readback["dto"]["downstream_consumption_enabled"] is False

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_enablement_record_rejects_without_preflight_or_unsafe_payload(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record,
    )

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record(
        {
            "consumption_enablement_ref": "../../Users/lidises/private",
            "selection_profile": "latest_written",
            "source_consumption_preflight_decision_sha256": "0" * 64,
            "source_preflight_decision_sha256": "0" * 64,
            "enablement_ref": "enablement-20260521163100-aafe7001",
            "enablement_record_sha256": "0" * 64,
            "manual_review_ref": "manualreview-20260521163000-aafe7001",
            "manual_review_record_sha256": "0" * 64,
            "checksum_set_sha256": "0" * 64,
            "selected_item_count": 1,
            "enabled_by": "agent_orchestrator",
            "enabled_at": "2026-05-21T17:00:00Z",
            "operator_confirmation": "please-consume-downstream-now",
            "safe_summary": "Consumption enablement record only.",
            "evidence_refs": ["/Users/lidises/private"],
            "raw_root_path": "/Users/lidises/private",
            "credential": "***",
        },
        queue_dir=tmp_path / "missing-queue",
        review_store_path=tmp_path / "missing-review.jsonl",
        enablement_store_path=tmp_path / "missing-enablements.jsonl",
        store_path=tmp_path / "consumption-enablements.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    assert {tuple(error.values()) for error in result["errors"]} >= {
        ("consumption_enablement_ref", "unsupported_ref_shape"),
        ("consumption_preflight", "consumption_preflight_not_ready"),
        ("operator_confirmation", "unsupported_confirmation"),
        ("evidence_refs", "invalid_opaque_ref"),
    }
    serialized = json.dumps(result, sort_keys=True)
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
    assert "please-consume-downstream-now" not in serialized


def test_downstream_consumption_enablement_record_api_is_protected_and_readback_safe(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import _nas_keeper_handoff_queue_file
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    review_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_manual_review_records.jsonl"
    enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_use_enablement_records.jsonl"
    preflight = _seed_consumption_preflight(queue_dir, root, review_store, enablement_store)
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements",
        json=_consumption_enablement_payload(preflight),
    )
    assert unauth.status_code == 401

    authed = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=_consumption_enablement_payload(preflight),
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["stored"] is True
    assert body["dto"]["downstream_consumption_enablement_recorded"] is True
    assert body["dto"]["downstream_consumption_enabled"] is False

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements?consumption_enablement_ref=consumptionenable-20260521170000-bafe8001",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    dto = readback.json()["dto"]
    assert dto["record_count"] == 1
    assert dto["latest_record"]["consumption_enablement_ref"] == "consumptionenable-20260521170000-bafe8001"
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    serialized = json.dumps(readback.json(), sort_keys=True)
    assert "Safe body" not in serialized
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
