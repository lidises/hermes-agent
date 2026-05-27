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


def cleanup_hold_payload(**overrides):
    payload = {
        "cleanup_hold_ref": "cleanuphold-20260527-artifact-retention-1",
        "cleanup_gate_ref": "cleanupgate-20260527-retention-plan-1",
        "requested_by": "agent_nas_keeper",
        "requested_at": "2026-05-27T08:45:00Z",
        "operator_confirmation": "dry-run-hold-only-no-delete-no-move-no-write",
        "candidate_actions": [
            {
                "candidate_ref": "candidate:fresh-write-20260527071608-rollback",
                "artifact_ref": "artifact:fresh-write-20260527071608-rollback",
                "safe_logical_ref": "rollback::rollback_write_fresh_20260527071608_2",
                "proposed_action": "hold_cleanup_candidate",
                "terminal_status": "rollback_verified",
            }
        ],
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def test_cleanup_execution_hold_records_dry_run_only_and_is_idempotent(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
    )

    plan_path = tmp_path / "retention-plans.jsonl"
    gate_path = tmp_path / "cleanup-gates.jsonl"
    hold_path = tmp_path / "cleanup-holds.jsonl"
    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(), store_path=plan_path
    )
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]), plan_store_path=plan_path, gate_store_path=gate_path
    )

    first = append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(
        cleanup_hold_payload(), gate_store_path=gate_path, hold_store_path=hold_path
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(
        cleanup_hold_payload(), gate_store_path=gate_path, hold_store_path=hold_path
    )

    assert first["stored"] is True
    assert first["idempotent_replay"] is False
    assert first["errors"] == []
    dto = first["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_execution_dry_run_hold_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["dry_run"] is True
    assert dto["cleanup_execution_opened"] is False
    assert dto["candidate_count"] == 1
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    serialized = json.dumps(first, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(hold_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_execution_hold_requires_existing_gate_and_rejects_raw_candidate_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_hold

    missing = append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(
        cleanup_hold_payload(), gate_store_path=tmp_path / "missing-gates.jsonl", hold_store_path=tmp_path / "holds.jsonl"
    )
    assert missing["stored"] is False
    assert missing["dto"] is None
    assert missing["errors"] == [{"field": "cleanup_gate_ref", "code": "cleanup_gate_not_found"}]

    raw = append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(
        cleanup_hold_payload(
            candidate_actions=[
                {
                    "candidate_ref": "candidate:bad",
                    "artifact_ref": "artifact:bad",
                    "safe_logical_ref": "/" + "Users/lidises/private.md",
                    "proposed_action": "hold_cleanup_candidate",
                    "terminal_status": "rollback_verified",
                }
            ]
        ),
        gate_store_path=tmp_path / "missing-gates.jsonl",
        hold_store_path=tmp_path / "holds.jsonl",
    )
    assert raw["stored"] is False
    assert {item["code"] for item in raw["errors"]} >= {"invalid_cleanup_hold"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_cleanup_execution_hold_api_requires_session_and_stays_dry_run_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-execution-hold"

    unauthenticated = client.post(route, json=cleanup_hold_payload())
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=cleanup_hold_payload())
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["dry_run"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_move_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1


def cleanup_manifest_payload(**overrides):
    payload = {
        "cleanup_manifest_ref": "cleanupmanifest-20260527-artifact-retention-1",
        "cleanup_hold_ref": "cleanuphold-20260527-artifact-retention-1",
        "prepared_by": "agent_nas_keeper",
        "prepared_at": "2026-05-27T09:05:00Z",
        "operator_confirmation": "metadata-only-cleanup-manifest-no-delete-no-move-no-write",
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def seed_cleanup_hold(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
    )

    plan_path = tmp_path / "retention-plans.jsonl"
    gate_path = tmp_path / "cleanup-gates.jsonl"
    hold_path = tmp_path / "cleanup-holds.jsonl"
    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(
        safe_plan_payload(), store_path=plan_path
    )
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(
        cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]), plan_store_path=plan_path, gate_store_path=gate_path
    )
    append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(
        cleanup_hold_payload(), gate_store_path=gate_path, hold_store_path=hold_path
    )
    return hold_path


def test_cleanup_execution_manifest_preflight_records_candidate_checksums_and_is_idempotent(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight

    hold_path = seed_cleanup_hold(tmp_path)
    manifest_path = tmp_path / "cleanup-manifests.jsonl"

    first = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(
        cleanup_manifest_payload(), hold_store_path=hold_path, manifest_store_path=manifest_path
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(
        cleanup_manifest_payload(), hold_store_path=hold_path, manifest_store_path=manifest_path
    )

    assert first["stored"] is True
    assert first["idempotent_replay"] is False
    assert first["errors"] == []
    dto = first["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_execution_manifest_preflight_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["preflight_passed"] is True
    assert dto["cleanup_execution_opened"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["candidate_action_count"] == 1
    assert len(dto["candidate_action_checksums"][0]["candidate_action_sha256"]) == 64
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    serialized = json.dumps(first, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(manifest_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_execution_manifest_preflight_requires_existing_hold_and_rejects_raw_fields_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight

    missing = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(
        cleanup_manifest_payload(), hold_store_path=tmp_path / "missing-holds.jsonl", manifest_store_path=tmp_path / "manifests.jsonl"
    )
    assert missing["stored"] is False
    assert missing["dto"] is None
    assert missing["errors"] == [{"field": "cleanup_hold_ref", "code": "cleanup_hold_not_found"}]

    raw = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(
        cleanup_manifest_payload(raw_root_path="/" + "Users/lidises/private"),
        hold_store_path=tmp_path / "missing-holds.jsonl",
        manifest_store_path=tmp_path / "manifests.jsonl",
    )
    assert raw["stored"] is False
    assert {item["code"] for item in raw["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_cleanup_execution_manifest_preflight_api_requires_session_and_stays_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]))
    append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(cleanup_hold_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-execution-manifest-preflight"

    unauthenticated = client.post(route, json=cleanup_manifest_payload())
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=cleanup_manifest_payload())
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["preflight_passed"] is True
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_move_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    duplicate = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=cleanup_manifest_payload())
    assert duplicate.status_code == 200
    assert duplicate.json()["idempotent_replay"] is True

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1


def cleanup_final_approval_payload(manifest_checksum: str, **overrides):
    payload = {
        "cleanup_final_approval_ref": "cleanupfinal-20260527-artifact-retention-1",
        "cleanup_manifest_ref": "cleanupmanifest-20260527-artifact-retention-1",
        "cleanup_manifest_sha256": manifest_checksum,
        "approved_by": "agent_nas_keeper",
        "approved_at": "2026-05-27T09:20:00Z",
        "approval_token_ref": "approvaltoken-cleanupmanifest-20260527-artifact-retention-1",
        "operator_confirmation": "metadata-only-final-cleanup-approval-no-delete-no-move-no-write",
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def seed_cleanup_manifest(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight

    hold_path = seed_cleanup_hold(tmp_path)
    manifest_path = tmp_path / "cleanup-manifests.jsonl"
    manifest = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(
        cleanup_manifest_payload(), hold_store_path=hold_path, manifest_store_path=manifest_path
    )
    return manifest_path, manifest


def test_cleanup_final_approval_records_token_and_exact_manifest_checksum_idempotently(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_final_approval

    manifest_path, manifest = seed_cleanup_manifest(tmp_path)
    final_path = tmp_path / "cleanup-final-approvals.jsonl"
    manifest_checksum = manifest["dto"]["cleanup_manifest_sha256"]

    first = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest_checksum),
        manifest_store_path=manifest_path,
        final_store_path=final_path,
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest_checksum),
        manifest_store_path=manifest_path,
        final_store_path=final_path,
    )

    assert first["stored"] is True
    assert first["idempotent_replay"] is False
    assert first["errors"] == []
    dto = first["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_final_approval_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["manifest_checksum_matched"] is True
    assert dto["approval_token_recorded"] is True
    assert dto["cleanup_execution_opened"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_archive_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    serialized = json.dumps(first, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(final_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_final_approval_requires_exact_manifest_checksum_and_rejects_raw_fields_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_final_approval

    manifest_path, manifest = seed_cleanup_manifest(tmp_path)
    final_path = tmp_path / "cleanup-final-approvals.jsonl"

    mismatch = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload("0" * 64), manifest_store_path=manifest_path, final_store_path=final_path
    )
    assert mismatch["stored"] is False
    assert mismatch["dto"] is None
    assert mismatch["errors"] == [{"field": "cleanup_manifest_sha256", "code": "cleanup_manifest_checksum_mismatch"}]

    raw = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest["dto"]["cleanup_manifest_sha256"], raw_root_path="/" + "Users/lidises/private"),
        manifest_store_path=manifest_path,
        final_store_path=final_path,
    )
    assert raw["stored"] is False
    assert {item["code"] for item in raw["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_cleanup_final_approval_api_requires_session_and_stays_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]))
    append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(cleanup_hold_payload())
    manifest = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(cleanup_manifest_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-final-approval"
    payload = cleanup_final_approval_payload(manifest["dto"]["cleanup_manifest_sha256"])

    unauthenticated = client.post(route, json=payload)
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["approval_token_recorded"] is True
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_move_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    duplicate = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert duplicate.status_code == 200
    assert duplicate.json()["idempotent_replay"] is True

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1


def cleanup_package_receipt_payload(final_checksum: str, **overrides):
    payload = {
        "cleanup_package_ref": "cleanuppackage-20260527-artifact-retention-1",
        "cleanup_final_approval_ref": "cleanupfinal-20260527-artifact-retention-1",
        "cleanup_final_approval_sha256": final_checksum,
        "packaged_by": "agent_nas_keeper",
        "packaged_at": "2026-05-27T09:40:00Z",
        "operator_confirmation": "metadata-only-cleanup-package-receipt-no-delete-no-move-no-write",
        "package_items": [
            {
                "package_item_ref": "packageitem:fresh-write-20260527071608-rollback",
                "candidate_ref": "candidate:fresh-write-20260527071608-rollback",
                "artifact_ref": "artifact:fresh-write-20260527071608-rollback",
                "safe_logical_ref": "rollback::rollback_write_fresh_20260527071608_2",
                "intended_action": "retain_for_manual_cleanup_receipt",
                "terminal_status": "packaged_metadata_only",
            }
        ],
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def seed_cleanup_final_approval(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_final_approval

    manifest_path, manifest = seed_cleanup_manifest(tmp_path)
    final_path = tmp_path / "cleanup-final-approvals.jsonl"
    final = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest["dto"]["cleanup_manifest_sha256"]),
        manifest_store_path=manifest_path,
        final_store_path=final_path,
    )
    return final_path, final


def test_cleanup_execution_package_receipt_records_safe_package_and_is_idempotent(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt

    final_path, final = seed_cleanup_final_approval(tmp_path)
    package_path = tmp_path / "cleanup-package-receipts.jsonl"
    final_checksum = final["dto"]["cleanup_final_approval_sha256"]

    first = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload(final_checksum),
        final_store_path=final_path,
        package_store_path=package_path,
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload(final_checksum),
        final_store_path=final_path,
        package_store_path=package_path,
    )

    assert first["stored"] is True
    assert first["idempotent_replay"] is False
    assert first["errors"] == []
    dto = first["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_execution_package_receipt_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["final_approval_checksum_matched"] is True
    assert dto["package_item_count"] == 1
    assert len(dto["package_item_checksums"][0]["package_item_sha256"]) == 64
    assert len(dto["cleanup_package_sha256"]) == 64
    assert dto["cleanup_execution_opened"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_archive_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    serialized = json.dumps(first, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(package_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_execution_package_receipt_requires_exact_final_checksum_and_rejects_raw_fields_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt

    final_path, final = seed_cleanup_final_approval(tmp_path)
    package_path = tmp_path / "cleanup-package-receipts.jsonl"

    mismatch = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload("0" * 64), final_store_path=final_path, package_store_path=package_path
    )
    assert mismatch["stored"] is False
    assert mismatch["dto"] is None
    assert mismatch["errors"] == [{"field": "cleanup_final_approval_sha256", "code": "cleanup_final_approval_checksum_mismatch"}]

    raw = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload(final["dto"]["cleanup_final_approval_sha256"], raw_root_path="/" + "Users/lidises/private"),
        final_store_path=final_path,
        package_store_path=package_path,
    )
    assert raw["stored"] is False
    assert {item["code"] for item in raw["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_cleanup_execution_package_receipt_api_requires_session_and_stays_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight,
        append_office_controlled_mutation_nas_keeper_cleanup_final_approval,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]))
    append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(cleanup_hold_payload())
    manifest = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(cleanup_manifest_payload())
    final = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest["dto"]["cleanup_manifest_sha256"])
    )
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-execution-package-receipt"
    payload = cleanup_package_receipt_payload(final["dto"]["cleanup_final_approval_sha256"])

    unauthenticated = client.post(route, json=payload)
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["package_item_count"] == 1
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_move_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    duplicate = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert duplicate.status_code == 200
    assert duplicate.json()["idempotent_replay"] is True

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1


def cleanup_disabled_run_receipt_payload(package_checksum: str, **overrides):
    payload = {
        "cleanup_disabled_run_ref": "cleanupdisabled-20260527-artifact-retention-1",
        "cleanup_package_ref": "cleanuppackage-20260527-artifact-retention-1",
        "cleanup_package_sha256": package_checksum,
        "preflighted_by": "agent_nas_keeper",
        "preflighted_at": "2026-05-27T11:10:00Z",
        "operator_confirmation": "metadata-only-disabled-cleanup-run-no-delete-no-move-no-write",
        "disabled_reason": "actual-cleanup-requires-separate-exact-approval",
        "evidence_refs": ["sha:fdd01554e34264a023efbf4c3ad1b76bf4dd73cb97db1a8190e43640a1f1111e"],
    }
    payload.update(overrides)
    return payload


def seed_cleanup_package_receipt(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt

    final_path, final = seed_cleanup_final_approval(tmp_path)
    package_path = tmp_path / "cleanup-package-receipts.jsonl"
    package = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload(final["dto"]["cleanup_final_approval_sha256"]),
        final_store_path=final_path,
        package_store_path=package_path,
    )
    return package_path, package


def test_cleanup_disabled_run_receipt_records_terminal_preflight_and_is_idempotent(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt

    package_path, package = seed_cleanup_package_receipt(tmp_path)
    disabled_path = tmp_path / "cleanup-disabled-run-receipts.jsonl"
    package_checksum = package["dto"]["cleanup_package_sha256"]

    first = append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt(
        cleanup_disabled_run_receipt_payload(package_checksum),
        package_store_path=package_path,
        disabled_store_path=disabled_path,
    )
    second = append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt(
        cleanup_disabled_run_receipt_payload(package_checksum),
        package_store_path=package_path,
        disabled_store_path=disabled_path,
    )

    assert first["stored"] is True
    assert first["idempotent_replay"] is False
    assert first["errors"] == []
    dto = first["dto"]
    assert dto["mode"] == "nas_keeper_cleanup_disabled_run_receipt_recorded"
    assert dto["metadata_only_record_write"] is True
    assert dto["package_checksum_matched"] is True
    assert dto["disabled_run_terminal"] is True
    assert len(dto["cleanup_disabled_run_sha256"]) == 64
    assert dto["cleanup_execution_opened"] is False
    assert dto["actual_nas_delete_enabled"] is False
    assert dto["actual_nas_move_enabled"] is False
    assert dto["actual_nas_archive_enabled"] is False
    assert dto["actual_nas_write_enabled"] is False
    assert dto["direct_vps_nas_write_enabled"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert second["stored"] is False
    assert second["idempotent_replay"] is True
    serialized = json.dumps(first, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "fresh approved" not in serialized
    assert '"write_payload":' not in serialized
    assert "sk-" not in serialized
    assert len(disabled_path.read_text(encoding="utf-8").splitlines()) == 1


def test_cleanup_disabled_run_receipt_requires_exact_package_checksum_and_rejects_raw_fields_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt

    package_path, package = seed_cleanup_package_receipt(tmp_path)
    disabled_path = tmp_path / "cleanup-disabled-run-receipts.jsonl"

    mismatch = append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt(
        cleanup_disabled_run_receipt_payload("0" * 64),
        package_store_path=package_path,
        disabled_store_path=disabled_path,
    )
    assert mismatch["stored"] is False
    assert mismatch["dto"] is None
    assert mismatch["errors"] == [{"field": "cleanup_package_sha256", "code": "cleanup_package_checksum_mismatch"}]

    raw = append_office_controlled_mutation_nas_keeper_cleanup_disabled_run_receipt(
        cleanup_disabled_run_receipt_payload(package["dto"]["cleanup_package_sha256"], raw_root_path="/" + "Users/lidises/private"),
        package_store_path=package_path,
        disabled_store_path=disabled_path,
    )
    assert raw["stored"] is False
    assert {item["code"] for item in raw["errors"]} >= {"unsupported_field"}
    assert "/users/lidises" not in json.dumps(raw, sort_keys=True).lower()


def test_cleanup_disabled_run_receipt_api_requires_session_and_stays_metadata_only(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_artifact_retention_plan,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_gate,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_hold,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight,
        append_office_controlled_mutation_nas_keeper_cleanup_final_approval,
        append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    plan = append_office_controlled_mutation_nas_keeper_artifact_retention_plan(safe_plan_payload())
    append_office_controlled_mutation_nas_keeper_cleanup_execution_gate(cleanup_gate_payload(plan["dto"]["retention_plan_sha256"]))
    append_office_controlled_mutation_nas_keeper_cleanup_execution_hold(cleanup_hold_payload())
    manifest = append_office_controlled_mutation_nas_keeper_cleanup_execution_manifest_preflight(cleanup_manifest_payload())
    final = append_office_controlled_mutation_nas_keeper_cleanup_final_approval(
        cleanup_final_approval_payload(manifest["dto"]["cleanup_manifest_sha256"])
    )
    package = append_office_controlled_mutation_nas_keeper_cleanup_execution_package_receipt(
        cleanup_package_receipt_payload(final["dto"]["cleanup_final_approval_sha256"])
    )
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-cleanup-disabled-run-receipt"
    payload = cleanup_disabled_run_receipt_payload(package["dto"]["cleanup_package_sha256"])

    unauthenticated = client.post(route, json=payload)
    assert unauthenticated.status_code == 401

    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert recorded.status_code == 200
    body = recorded.json()
    assert body["stored"] is True
    assert body["dto"]["metadata_only_record_write"] is True
    assert body["dto"]["disabled_run_terminal"] is True
    assert body["dto"]["cleanup_execution_opened"] is False
    assert body["dto"]["actual_nas_delete_enabled"] is False
    assert body["dto"]["actual_nas_move_enabled"] is False
    assert body["dto"]["actual_nas_write_enabled"] is False

    duplicate = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=payload)
    assert duplicate.status_code == 200
    assert duplicate.json()["idempotent_replay"] is True

    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["dto"]["record_count"] == 1
