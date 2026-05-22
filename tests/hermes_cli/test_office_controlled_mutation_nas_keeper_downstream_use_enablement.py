"""Tests for gated downstream-use enablement records after manual review."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def _payload(label: str) -> dict[str, object]:
    return {
        "operator_intent_ref": f"intent_{label}",
        "target_vault_ref": "Hermes",
        "safe_slug_base": label.replace("_", "-"),
        "safe_title": f"Safe {label}",
        "markdown_body": f"Safe body for {label}.\n",
        "requested_by": "agent_orchestrator",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "approve_actual_write": True,
    }


def _seed(queue, root):
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request

    result = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        _payload("downstream_enablement"),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T16:30:00Z",
        nonce="aafe7001",
    )
    assert result["written"] is True


def _manual_review_payload(preflight: dict[str, object]) -> dict[str, object]:
    dto = preflight["dto"]
    return {
        "manual_review_ref": "manualreview-20260521163000-aafe7001",
        "selection_profile": "latest_written",
        "preflight_decision_sha256": dto["preflight_decision_sha256"],
        "checksum_set_sha256": dto["checksum_set_sha256"],
        "selected_item_count": dto["selected_item_count"],
        "reviewed_by": "agent_orchestrator",
        "reviewed_at": "2026-05-21T16:30:30Z",
        "operator_confirmation": "confirmed-selected-export-safe-ref-review-only",
        "safe_summary": "Manual operator reviewed safe refs for downstream enablement boundary.",
        "evidence_refs": [f"preflight:{dto['preflight_decision_sha256']}", f"checksum:{dto['checksum_set_sha256']}"],
    }


def _enablement_payload(preflight: dict[str, object], manual: dict[str, object]) -> dict[str, object]:
    dto = preflight["dto"]
    mdto = manual["dto"]
    return {
        "enablement_ref": "enablement-20260521163100-aafe7001",
        "selection_profile": "latest_written",
        "source_preflight_decision_sha256": dto["preflight_decision_sha256"],
        "manual_review_ref": mdto["manual_review_ref"],
        "manual_review_record_sha256": mdto["manual_review_record_sha256"],
        "checksum_set_sha256": dto["checksum_set_sha256"],
        "selected_item_count": dto["selected_item_count"],
        "enabled_by": "agent_orchestrator",
        "enabled_at": "2026-05-21T16:31:00Z",
        "operator_confirmation": "confirmed-enable-downstream-use-readiness-only",
        "safe_summary": "Enablement prerequisite record only; downstream consumption remains disabled.",
        "evidence_refs": [f"manualreview:{mdto['manual_review_record_sha256']}", f"checksum:{dto['checksum_set_sha256']}"],
    }


def _seed_manual_review(queue_dir, root, review_store):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight,
    )

    _seed(queue_dir, root)
    before = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=review_store,
    )
    manual = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record(
        _manual_review_payload(before),
        queue_dir=queue_dir,
        store_path=review_store,
    )
    assert manual["stored"] is True
    after = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=review_store,
    )
    assert after["dto"]["manual_operator_review_record_present"] is True
    return after, manual


def test_downstream_use_enablement_record_writes_safe_ref_without_consumption(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_records,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    review_store = tmp_path / "review-records.jsonl"
    enablement_store = tmp_path / "enablement-records.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    preflight, manual = _seed_manual_review(queue_dir, root, review_store)

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record(
        _enablement_payload(preflight, manual),
        queue_dir=queue_dir,
        review_store_path=review_store,
        store_path=enablement_store,
    )

    assert result["stored"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record"
    assert dto["downstream_use_enablement_recorded"] is True
    assert dto["enablement_ref"] == "enablement-20260521163100-aafe7001"
    assert dto["manual_review_record_verified"] is True
    assert dto["manual_review_ref"] == "manualreview-20260521163000-aafe7001"
    assert dto["downstream_use_enabled"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert len(dto["enablement_record_sha256"]) == 64
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
    assert dto["capabilities"]["downstream_use_enablement_recording_enabled"] is True
    assert dto["capabilities"]["downstream_use_enabled"] is False

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_records(
        store_path=enablement_store,
        enablement_ref="enablement-20260521163100-aafe7001",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["enablement_ref"] == "enablement-20260521163100-aafe7001"
    assert readback["dto"]["downstream_use_enabled"] is False
    assert readback["dto"]["downstream_consumption_enabled"] is False

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_use_enablement_record_rejects_without_manual_review_or_unsafe_payload(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    queue_dir.mkdir()
    root.mkdir()
    _seed(queue_dir, root)
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=tmp_path / "missing-review.jsonl",
    )
    payload = {
        "enablement_ref": "../../Users/lidises/private",
        "selection_profile": "latest_written",
        "source_preflight_decision_sha256": preflight["dto"]["preflight_decision_sha256"],
        "manual_review_ref": "manualreview-20260521163000-aafe7001",
        "manual_review_record_sha256": "0" * 64,
        "checksum_set_sha256": preflight["dto"]["checksum_set_sha256"],
        "selected_item_count": preflight["dto"]["selected_item_count"],
        "enabled_by": "agent_orchestrator",
        "enabled_at": "2026-05-21T16:31:00Z",
        "operator_confirmation": "please-consume-downstream-now",
        "safe_summary": "Enablement record only.",
        "evidence_refs": ["/Users/lidises/private"],
        "raw_root_path": "/Users/lidises/private",
        "credential": "sk-test-secret",
    }

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record(
        payload,
        queue_dir=queue_dir,
        review_store_path=tmp_path / "missing-review.jsonl",
        store_path=tmp_path / "enablement-records.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    assert {tuple(error.values()) for error in result["errors"]} >= {
        ("enablement_ref", "unsupported_ref_shape"),
        ("manual_review", "manual_review_record_not_found"),
        ("operator_confirmation", "unsupported_confirmation"),
        ("evidence_refs", "invalid_opaque_ref"),
    }
    serialized = json.dumps(result, sort_keys=True)
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
    assert "please-consume-downstream-now" not in serialized


def test_downstream_use_enablement_record_api_is_protected_and_readback_safe(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    _seed(queue_dir, root)
    before = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(profile="latest_written")
    manual = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record(
        _manual_review_payload(before),
    )
    assert manual["stored"] is True
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(profile="latest_written")
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements",
        json=_enablement_payload(preflight, manual),
    )
    assert unauth.status_code == 401

    authed = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=_enablement_payload(preflight, manual),
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["stored"] is True
    assert body["dto"]["downstream_use_enablement_recorded"] is True
    assert body["dto"]["downstream_use_enabled"] is False

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements?enablement_ref=enablement-20260521163100-aafe7001",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["found"] is True
    assert readback_body["dto"]["record_count"] == 1
    assert readback_body["dto"]["latest_record"]["downstream_consumption_enabled"] is False
    assert "Safe body" not in json.dumps(readback_body)
