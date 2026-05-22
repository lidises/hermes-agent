"""Tests for gated downstream consumption preflight after downstream-use enablement."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_use_enablement import (
    _enablement_payload,
    _seed_manual_review,
)


def _seed_enablement(queue_dir, root, review_store, enablement_store):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record,
    )

    preflight, manual = _seed_manual_review(queue_dir, root, review_store)
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_record(
        _enablement_payload(preflight, manual),
        queue_dir=queue_dir,
        review_store_path=review_store,
        store_path=enablement_store,
    )
    assert result["stored"] is True
    return result


def test_downstream_consumption_preflight_recognizes_enablement_but_keeps_consumption_disabled(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    review_store = tmp_path / "review-records.jsonl"
    enablement_store = tmp_path / "enablement-records.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    enablement = _seed_enablement(queue_dir, root, review_store, enablement_store)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=review_store,
        enablement_store_path=enablement_store,
    )

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    latest = enablement["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight"
    assert dto["selection_profile"] == "latest_written"
    assert dto["selected_export_review_passed"] is True
    assert dto["manual_operator_review_record_present"] is True
    assert dto["downstream_use_enablement_record_present"] is True
    assert dto["enablement_ref"] == latest["enablement_ref"]
    assert dto["enablement_record_sha256"] == latest["enablement_record_sha256"]
    assert dto["source_preflight_decision_sha256"] == latest["source_preflight_decision_sha256"]
    assert dto["checksum_set_sha256"] == latest["checksum_set_sha256"]
    assert dto["selected_item_count"] == latest["selected_item_count"]
    assert dto["consumption_preflight_passed"] is True
    assert len(dto["consumption_preflight_decision_sha256"]) == 64
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed_after_preflight"] is False
    assert dto["blocked_reason"] == "actual_downstream_consumption_boundary_not_approved"
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
    assert dto["capabilities"]["downstream_consumption_preflight_enabled"] is True
    assert dto["capabilities"]["downstream_consumption_enabled"] is False
    assert dto["next_required_boundary"] == "fresh_request_builder_downstream_consumption_enablement"

    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_preflight_is_blocked_without_enablement_record(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    review_store = tmp_path / "review-records.jsonl"
    queue_dir.mkdir()
    root.mkdir()
    _seed_manual_review(queue_dir, root, review_store)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight(
        queue_dir=queue_dir,
        profile="latest_written",
        review_store_path=review_store,
        enablement_store_path=tmp_path / "missing-enablements.jsonl",
    )

    assert result["found"] is True
    dto = result["dto"]
    assert dto["selected_export_review_passed"] is True
    assert dto["manual_operator_review_record_present"] is True
    assert dto["downstream_use_enablement_record_present"] is False
    assert dto["consumption_preflight_passed"] is False
    assert dto["downstream_use_enabled"] is False
    assert dto["downstream_consumption_enabled"] is False
    assert dto["blocked_reason"] == "downstream_use_enablement_record_not_found"


def test_downstream_consumption_preflight_api_is_protected_and_safe(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import _nas_keeper_handoff_queue_file
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    review_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_manual_review_records.jsonl"
    enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_use_enablement_records.jsonl"
    _seed_enablement(queue_dir, root, review_store, enablement_store)

    client = TestClient(app)
    unauth = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight?profile=latest_written&limit=20"
    )
    assert unauth.status_code == 401

    authed = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight?profile=latest_written&limit=20",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["found"] is True
    assert body["dto"]["downstream_use_enablement_record_present"] is True
    assert body["dto"]["downstream_use_enabled"] is True
    assert body["dto"]["downstream_consumption_enabled"] is False
    assert body["dto"]["downstream_consumed"] is False
    serialized = json.dumps(body, sort_keys=True)
    assert "Safe body" not in serialized
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
