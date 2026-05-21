"""Tests for recording NAS Keeper -> Mac relay queue execution state."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_preview_payload,
)


def safe_execution_state_payload(**overrides):
    payload = {
        "handoff_ref": "handoff_20260517_preview_demo",
        "execution_record_ref": "exec_record_20260518_success_demo",
        "relay_execution_ref": "relay_exec_20260517_preview_demo",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-18T02:10:00Z",
        "execution_status": "succeeded",
        "safe_summary": "Mac relay write completed and readback was verified.",
        "evidence_refs": ["audit:mac_relay_exec_smoke", "readback:sha256_verified"],
    }
    payload.update(overrides)
    return payload


def test_execution_state_recording_marks_authorized_handoff_succeeded_without_body_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import record_office_controlled_mutation_nas_keeper_mac_relay_execution_state

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)

    result = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(), queue_dir=queue_dir
    )

    assert result["recorded"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_execution_state_recorded"
    assert dto["execution_record_ref"] == "exec_record_20260518_success_demo"
    assert dto["queue_status_before"] == "authorized_for_mac_relay_execution"
    assert dto["queue_status_after"] == "mac_relay_execution_succeeded"
    assert dto["execution_status"] == "succeeded"
    assert dto["execution_state_path"] == [
        "authorized_queue_item_read",
        "execution_state_recorded",
        "manual_evidence_refs_attached",
        "queue_closed_without_automation",
    ]
    assert dto["evidence_refs"] == ["audit:mac_relay_exec_smoke", "readback:sha256_verified"]
    capabilities = dto["capabilities"]
    assert capabilities["queue_mutation_enabled"] is True
    assert capabilities["execution_state_recording_enabled"] is True
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["watcher_enabled"] is False
    assert capabilities["cron_enabled"] is False
    assert capabilities["dispatch_enabled"] is False
    assert capabilities["authority_adapter_binding_enabled"] is False

    queue_item = json.loads((queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8"))
    assert queue_item["queue_status"] == "mac_relay_execution_succeeded"
    assert queue_item["execution_record_ref"] == "exec_record_20260518_success_demo"
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert dto["markdown_body_included"] is False
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_execution_state_recording_supports_failed_and_manual_evidence_without_writing_nas(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        record_office_controlled_mutation_nas_keeper_mac_relay_execution_state,
    )
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
        safe_authorize_payload,
        safe_handoff_payload,
    )

    failed_dir = tmp_path / "failed"
    prepare_authorized_handoff(failed_dir)
    failed = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(
            execution_record_ref="exec_record_20260518_failed_demo",
            execution_status="failed",
            safe_summary="Mac relay execution failed safely before write confirmation.",
            evidence_refs=["error:mac_relay_root_missing"],
        ),
        queue_dir=failed_dir,
    )
    assert failed["recorded"] is True
    assert failed["dto"]["queue_status_after"] == "mac_relay_execution_failed"
    assert failed["dto"]["capabilities"]["actual_nas_write_enabled"] is False

    guarded_dir = tmp_path / "guarded"
    prepare_authorized_handoff(guarded_dir)
    guarded = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(
            execution_record_ref="exec_record_20260518_failed_guarded_demo",
            execution_status="failed_guarded",
            safe_summary="Mac relay execution guard failed safely before write because relay root was not configured.",
            evidence_refs=["guard:mac_relay_root_not_configured", "relayexec:guarded_failure_smoke"],
        ),
        queue_dir=guarded_dir,
    )
    assert guarded["recorded"] is True
    assert guarded["dto"]["execution_status"] == "failed_guarded"
    assert guarded["dto"]["queue_status_after"] == "mac_relay_execution_failed_guarded"
    assert guarded["dto"]["capabilities"]["mac_relay_write_enabled"] is False
    assert guarded["dto"]["capabilities"]["actual_nas_write_enabled"] is False
    assert guarded["dto"]["next_required_boundary"] == "none_terminal_execution_state_recorded"

    manual_dir = tmp_path / "manual"
    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_handoff_payload(handoff_ref="handoff_20260518_manual_demo", relay_request_ref="relay_req_20260518_manual_demo"),
        queue_dir=manual_dir,
    )
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
        safe_authorize_payload(handoff_ref="handoff_20260518_manual_demo"), queue_dir=manual_dir
    )
    manual = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(
            handoff_ref="handoff_20260518_manual_demo",
            execution_record_ref="exec_record_20260518_manual_demo",
            execution_status="manual_review_required",
            safe_summary="Manual readback evidence is pending NAS Keeper review.",
            evidence_refs=["manual:readback_pending"],
        ),
        queue_dir=manual_dir,
    )
    assert manual["recorded"] is True
    assert manual["dto"]["queue_status_after"] == "mac_relay_execution_manual_review_required"
    assert manual["dto"]["next_required_boundary"] == "manual_nas_keeper_execution_evidence_review"


def test_execution_state_recording_rejects_raw_fields_mismatches_and_duplicate_state(tmp_path):
    from hermes_cli.office_controlled_mutation import record_office_controlled_mutation_nas_keeper_mac_relay_execution_state

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)

    unsupported = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        {**safe_execution_state_payload(), "raw_path": "/" + "Users/lidises/private", "recorded_by": "bad/path"},
        queue_dir=queue_dir,
    )
    assert unsupported["recorded"] is False
    assert unsupported["dto"] is None
    assert {item["code"] for item in unsupported["errors"]} >= {"unsupported_field", "invalid_opaque_id"}
    assert "/users/lidises" not in json.dumps(unsupported, sort_keys=True).lower()

    mismatch = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(relay_node_ref="mac_relay_secondary"), queue_dir=queue_dir
    )
    assert mismatch["recorded"] is False
    assert mismatch["errors"] == [{"field": "relay_node_ref", "code": "relay_node_mismatch"}]

    first = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(), queue_dir=queue_dir
    )
    assert first["recorded"] is True
    duplicate = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
        safe_execution_state_payload(execution_record_ref="exec_record_20260518_second_demo"), queue_dir=queue_dir
    )
    assert duplicate["recorded"] is False
    assert duplicate["errors"] == [{"field": "queue_status", "code": "handoff_not_open_for_execution_state_recording"}]


def test_execution_state_recording_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff,
        enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN
    from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
        safe_authorize_payload,
        safe_handoff_payload,
    )

    enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_handoff_payload())
    authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(safe_authorize_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-state"

    unauthenticated = client.post(route, json=safe_execution_state_payload())
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_execution_state_payload())
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["recorded"] is True
    assert body["dto"]["queue_status_after"] == "mac_relay_execution_succeeded"
    assert body["dto"]["capabilities"]["watcher_enabled"] is False
