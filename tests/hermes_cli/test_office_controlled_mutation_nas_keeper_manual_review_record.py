"""Tests for bounded manual operator review records for selected ledger exports."""

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
        _payload("manual_review_record_written"),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T16:10:00Z",
        nonce="9afe6101",
    )
    assert result["written"] is True


def _review_payload(preflight: dict[str, object], *, ref: str = "manualreview-20260521161000-9afe6101") -> dict[str, object]:
    dto = preflight["dto"]
    return {
        "manual_review_ref": ref,
        "selection_profile": "latest_written",
        "preflight_decision_sha256": dto["preflight_decision_sha256"],
        "checksum_set_sha256": dto["checksum_set_sha256"],
        "selected_item_count": dto["selected_item_count"],
        "reviewed_by": "agent_orchestrator",
        "reviewed_at": "2026-05-21T16:10:30Z",
        "operator_confirmation": "confirmed-selected-export-safe-ref-review-only",
        "safe_summary": "Manual operator reviewed selected export checksum set for downstream preflight only.",
        "evidence_refs": [f"preflight:{dto['preflight_decision_sha256']}", f"checksum:{dto['checksum_set_sha256']}"],
    }


def test_manual_review_record_writes_safe_ref_record_and_updates_preflight_readback(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight,
        list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_records,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    store = tmp_path / "review-records.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    _seed(queue_dir, root)
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        limit=10,
        review_store_path=store,
    )
    assert preflight["dto"]["manual_operator_review_record_present"] is False

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record(
        _review_payload(preflight),
        queue_dir=queue_dir,
        store_path=store,
    )

    assert result["stored"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_manual_review_record"
    assert dto["manual_operator_review_record_written"] is True
    assert dto["manual_review_ref"] == "manualreview-20260521161000-9afe6101"
    assert dto["source_preflight_decision_sha256"] == preflight["dto"]["preflight_decision_sha256"]
    assert dto["checksum_set_sha256"] == preflight["dto"]["checksum_set_sha256"]
    assert dto["selected_item_count"] == 1
    assert len(dto["manual_review_record_sha256"]) == 64
    assert dto["downstream_use_enabled"] is False
    assert dto["downstream_consumed"] is False
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
    assert dto["capabilities"]["manual_operator_review_recording_enabled"] is True
    assert dto["capabilities"]["downstream_use_enabled"] is False

    readback = list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_records(
        store_path=store,
        manual_review_ref="manualreview-20260521161000-9afe6101",
    )
    assert readback["found"] is True
    assert readback["dto"]["record_count"] == 1
    assert readback["dto"]["latest_record"]["manual_review_ref"] == "manualreview-20260521161000-9afe6101"

    after = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        limit=10,
        review_store_path=store,
    )
    assert after["dto"]["manual_operator_review_record_present"] is True
    assert after["dto"]["downstream_use_blocked_reason"] == "downstream_use_disabled_pending_enablement_boundary"
    assert after["dto"]["downstream_use_enabled"] is False

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_manual_review_record_rejects_mismatched_or_unsafe_payload_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record,
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
    )
    payload = _review_payload(preflight)
    payload.update(
        {
            "manual_review_ref": "../../Users/lidises/private",
            "checksum_set_sha256": "0" * 64,
            "operator_confirmation": "please-run-downstream-now",
            "raw_root_path": "/Users/lidises/private",
            "credential": "sk-test-secret",
        }
    )

    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_manual_review_record(
        payload,
        queue_dir=queue_dir,
        store_path=tmp_path / "review-records.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    assert {tuple(error.values()) for error in result["errors"]} >= {
        ("manual_review_ref", "unsupported_ref_shape"),
        ("checksum_set_sha256", "preflight_checksum_mismatch"),
        ("operator_confirmation", "unsupported_confirmation"),
    }
    serialized = json.dumps(result, sort_keys=True)
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
    assert "please-run-downstream-now" not in serialized


def test_manual_review_record_api_is_protected_and_readback_safe(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import (
        _nas_keeper_handoff_queue_file,
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight,
    )
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    _seed(queue_dir, root)
    preflight = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_preflight(profile="latest_written")
    client = TestClient(app)

    unauth = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-manual-review-record",
        json=_review_payload(preflight),
    )
    assert unauth.status_code == 401

    authed = client.post(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-manual-review-record",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json=_review_payload(preflight),
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["stored"] is True
    assert body["dto"]["manual_operator_review_record_written"] is True
    assert body["dto"]["downstream_use_enabled"] is False

    readback = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-manual-review-record?manual_review_ref=manualreview-20260521161000-9afe6101",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["found"] is True
    assert readback_body["dto"]["record_count"] == 1
    assert readback_body["dto"]["latest_record"]["manual_review_ref"] == "manualreview-20260521161000-9afe6101"
    assert readback_body["dto"]["downstream_use_enabled"] is False
    assert "Safe body" not in json.dumps(readback_body)
