"""Tests for read-only NAS Keeper -> Mac relay queue state readback."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_state_record import (
    safe_execution_state_payload,
)
from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_authorize_payload,
    safe_handoff_payload,
)


def test_queue_readback_lists_safe_state_summaries_without_body_or_mutation(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue,
        record_office_controlled_mutation_nas_keeper_mac_relay_execution_state,
    )

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(), queue_dir=queue_dir
    )
    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(
            handoff_ref="handoff_20260518_manual_readback",
            relay_request_ref="relay_req_20260518_manual_readback",
        ),
        queue_dir=queue_dir,
    )
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(handoff_ref="handoff_20260518_manual_readback"), queue_dir=queue_dir
    )
    record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(
            handoff_ref="handoff_20260518_manual_readback",
            execution_record_ref="exec_record_20260518_manual_readback",
            execution_status="manual_review_required",
            safe_summary="Manual evidence review is waiting for NAS Keeper.",
            evidence_refs=["manual:readback_waiting"],
        ),
        queue_dir=queue_dir,
    )

    result = list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(queue_dir=queue_dir)

    assert result["listed"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_mac_relay_handoff_queue_readback"
    assert dto["count"] == 2
    assert dto["skipped_count"] == 0
    assert dto["markdown_body_included"] is False
    assert dto["capabilities"]["queue_read_enabled"] is True
    assert dto["capabilities"]["queue_mutation_enabled"] is False
    assert dto["capabilities"]["mac_relay_write_enabled"] is False
    assert dto["capabilities"]["actual_nas_write_enabled"] is False
    assert dto["capabilities"]["watcher_enabled"] is False
    assert dto["capabilities"]["cron_enabled"] is False
    assert dto["capabilities"]["dispatch_enabled"] is False
    assert dto["capabilities"]["authority_adapter_binding_enabled"] is False
    statuses = {item["queue_status"] for item in dto["items"]}
    assert statuses == {"mac_relay_execution_succeeded", "mac_relay_execution_manual_review_required"}
    manual = next(item for item in dto["items"] if item["queue_status"] == "mac_relay_execution_manual_review_required")
    assert manual["next_required_boundary"] == "manual_nas_keeper_execution_evidence_review"
    assert manual["execution_evidence_refs"] == ["manual:readback_waiting"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "\"markdown_body\":" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_queue_readback_filters_by_status_handoff_and_limit_without_raw_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue,
    )

    queue_dir = tmp_path / "queue"
    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=queue_dir)
    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(
            handoff_ref="handoff_20260518_second_readback",
            relay_request_ref="relay_req_20260518_second_readback",
        ),
        queue_dir=queue_dir,
    )

    by_status = list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(
        {"queue_status": "pending_nas_keeper_authorization", "limit": 1}, queue_dir=queue_dir
    )
    assert by_status["listed"] is True
    assert by_status["dto"]["count"] == 1
    assert by_status["dto"]["effective_limit"] == 1
    assert by_status["dto"]["available_count"] == 2
    assert by_status["dto"]["filters"] == {"queue_status": "pending_nas_keeper_authorization"}

    by_handoff = list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(
        {"handoff_ref": "handoff_20260518_second_readback"}, queue_dir=queue_dir
    )
    assert by_handoff["dto"]["count"] == 1
    assert by_handoff["dto"]["items"][0]["handoff_ref"] == "handoff_20260518_second_readback"

    invalid = list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(
        {"handoff_ref": "/" + "Users/lidises/private", "raw_path": "/" + "home/hermes/private"},
        queue_dir=queue_dir,
    )
    assert invalid["listed"] is False
    assert {item["code"] for item in invalid["errors"]} >= {"unsupported_field", "invalid_opaque_id"}
    serialized = json.dumps(invalid, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized


def test_queue_readback_skips_malformed_or_raw_stored_lines_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue,
    )

    queue_dir = tmp_path / "queue"
    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload(), queue_dir=queue_dir)
    queue_file = queue_dir / "mac-relay-write-queue.jsonl"
    valid_item = json.loads(queue_file.read_text(encoding="utf-8").splitlines()[0])
    unsafe_queue_ref_item = dict(valid_item)
    unsafe_queue_ref_item["handoff_ref"] = "handoff_unsafe_queue_ref"
    unsafe_queue_ref_item["queue_ref"] = "/" + "home/hermes/private/token.log"
    unsafe_decision_item = dict(valid_item)
    unsafe_decision_item["handoff_ref"] = "handoff_unsafe_decision"
    unsafe_decision_item["authorization_decision"] = "/" + "home/hermes/private/sk-secret"
    unsafe_status_item = dict(valid_item)
    unsafe_status_item["handoff_ref"] = "handoff_unsafe_status"
    unsafe_status_item["execution_status"] = "/" + "Users/lidises/private"
    with queue_file.open("a", encoding="utf-8") as handle:
        handle.write("{not json\n")
        handle.write(json.dumps({"handoff_ref": "handoff_bad", "queue_status": "pending_nas_keeper_authorization", "safe_title": "/" + "Users/lidises/private"}) + "\n")
        handle.write(json.dumps(unsafe_queue_ref_item) + "\n")
        handle.write(json.dumps(unsafe_decision_item) + "\n")
        handle.write(json.dumps(unsafe_status_item) + "\n")

    result = list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(queue_dir=queue_dir)

    assert result["listed"] is True
    assert result["dto"]["count"] == 1
    assert result["dto"]["skipped_count"] == 5
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-secret" not in serialized
    assert "{not json" not in serialized


def test_queue_readback_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue"

    unauthenticated = client.get(route)
    assert unauthenticated.status_code == 401

    listed = client.get(
        route,
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        params={"queue_status": "pending_nas_keeper_authorization", "limit": "10"},
    )
    assert listed.status_code == 200
    body = listed.json()
    assert body["listed"] is True
    assert body["dto"]["count"] == 1
    assert body["dto"]["items"][0]["queue_status"] == "pending_nas_keeper_authorization"
    assert body["dto"]["markdown_body_included"] is False
