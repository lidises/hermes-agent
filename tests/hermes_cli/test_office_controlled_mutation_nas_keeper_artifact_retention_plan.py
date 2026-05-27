"""Tests for metadata-only NAS Keeper artifact retention/cleanup planning."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_plan_payload(**overrides):
    payload = {
        "cleanup_plan_ref": "cleanupplan-20260527-fresh-write-artifacts",
        "planned_by": "agent_nas_keeper",
        "planned_at": "2026-05-27T07:30:00Z",
        "selection_profile": "completed_smoke_and_fresh_write_artifacts",
        "operator_confirmation": "metadata-only-retention-plan-no-delete-no-write",
        "safe_summary": "Retain latest evidence and mark older smoke artifacts as cleanup candidates.",
        "artifact_refs": [
            {
                "artifact_ref": "artifact:fresh-write-20260527071608-note",
                "artifact_type": "smoke_note",
                "safe_logical_ref": "Inbox::ai-office-nas-keeper-fresh-write-20260527071608.md",
                "terminal_status": "mac_relay_execution_succeeded",
                "retention_decision": "retain_latest_evidence",
            },
            {
                "artifact_ref": "artifact:fresh-write-20260527071608-rollback",
                "artifact_type": "rollback_artifact",
                "safe_logical_ref": "rollback::rollback_write_fresh_20260527071608_2",
                "terminal_status": "rollback_verified",
                "retention_decision": "retain_until_cleanup_approval",
            },
        ],
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def test_artifact_retention_plan_records_metadata_only_without_paths_or_delete(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_artifact_retention_plan

    store_path = tmp_path / "retention-plans.jsonl"
    result = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(), store_path=store_path
    )

    assert result["stored"] is True
    assert result["idempotent_replay"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_artifact_retention_plan_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["artifact_count"] == 2
    assert dto["cleanup_execution_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    lines = store_path.read_text(encoding="utf-8").splitlines()
    assert len(lines) == 1
    stored = json.loads(lines[0])
    assert stored["cleanup_plan_ref"] == "cleanupplan-20260527-fresh-write-artifacts"
    assert "raw_path" not in stored
    assert "markdown_body" not in stored


def test_artifact_retention_plan_replays_same_plan_idempotently(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_artifact_retention_plan

    store_path = tmp_path / "retention-plans.jsonl"
    first = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload(), store_path=store_path)
    second = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload(), store_path=store_path)

    assert first["stored"] is True
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    assert second["dto"]["cleanup_plan_ref"] == "cleanupplan-20260527-fresh-write-artifacts"
    assert len(store_path.read_text(encoding="utf-8").splitlines()) == 1


def test_artifact_retention_plan_rejects_raw_values_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_artifact_retention_plan

    result = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(
            artifact_refs=[
                {
                    "artifact_ref": "artifact:bad",
                    "artifact_type": "smoke_note",
                    "safe_logical_ref": "/" + "Users/lidises/private.md",
                    "terminal_status": "mac_relay_execution_succeeded",
                    "retention_decision": "retain_latest_evidence",
                }
            ]
        ),
        store_path=tmp_path / "retention-plans.jsonl",
    )

    assert result["stored"] is False
    assert result["dto"] is None
    assert {item["code"] for item in result["errors"]} >= {"invalid_artifact_ref"}
    assert "/users/lidises" not in json.dumps(result, sort_keys=True).lower()


def test_artifact_retention_plan_api_requires_session_and_records_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-artifact-retention-plan"
    unauthenticated = client.post(route, json=safe_plan_payload())
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_plan_payload())
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    readback_body = readback.json()
    assert readback_body["dto"]["record_count"] == 1
    assert len(readback_body["dto"]["latest_record"]["retention_plan_sha256"]) == 64
def cleanup_gate_payload(plan_checksum: str, **overrides):
    payload = {
        "cleanup_gate_ref": "cleanupgate-20260527-retention-plan-1",
        "cleanup_plan_ref": "cleanupplan-20260527-fresh-write-artifacts",
        "cleanup_plan_sha256": plan_checksum,
        "approved_by": "agent_nas_keeper",
        "approved_at": "2026-05-27T08:20:00Z",
        "operator_confirmation": "metadata-only-cleanup-gate-no-delete-no-move-no-write",
        "intended_cleanup_action": "hold_for_separate_execution_approval",
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def test_cleanup_execution_gate_records_metadata_only_when_plan_checksum_matches(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
    )

    plan_path = tmp_path / "retention-plans.jsonl"
    gate_path = tmp_path / "cleanup-gates.jsonl"
    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(), store_path=plan_path
    )
    plan_checksum = plan["dto"]["retention_plan_sha256"]

    result = append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload(plan_checksum), plan_store_path=plan_path, gate_store_path=gate_path
    )

    assert result["stored"] is True
    assert result["idempotent_replay"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_execution_gate_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["cleanup_plan_ref"] == "cleanupplan-20260527-fresh-write-artifacts"
    assert dto["retention_plan_checksum_matched"] is True
    assert dto["cleanup_execution_opened"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(gate_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_execution_gate_requires_exact_plan_checksum_and_replays_idempotently(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
    )

    plan_path = tmp_path / "retention-plans.jsonl"
    gate_path = tmp_path / "cleanup-gates.jsonl"
    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(), store_path=plan_path
    )
    plan_checksum = plan["dto"]["retention_plan_sha256"]

    mismatch = append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload("0" * 64), plan_store_path=plan_path, gate_store_path=gate_path
    )
    assert mismatch["stored"] is False
    assert mismatch["dto"] is None
    assert mismatch["errors"] == [{"field": "cleanup_plan_sha256", "code": "cleanup_plan_checksum_mismatch"}]

    first = append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload(plan_checksum), plan_store_path=plan_path, gate_store_path=gate_path
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload(plan_checksum), plan_store_path=plan_path, gate_store_path=gate_path
    )
    assert first["stored"] is True
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    assert len(gate_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_execution_gate_api_requires_session_and_stays_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_artifact_retention_plan
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-execution-gate"
    payload = cleanup_gate_payload(plan["dto"]["retention_plan_sha256"])

    unauthenticated = client.post(route, json=payload)
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1
