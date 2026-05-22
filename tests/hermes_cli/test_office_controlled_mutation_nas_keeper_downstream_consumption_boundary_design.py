"""Tests for display-only downstream consumption one-shot boundary design."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_downstream_consumption_enablement import (
    _consumption_enablement_payload,
    _seed_consumption_preflight,
)


def _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record,
    )

    preflight = _seed_consumption_preflight(queue_dir, root, review_store, use_enablement_store)
    result = append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_record(
        _consumption_enablement_payload(preflight),
        queue_dir=queue_dir,
        review_store_path=review_store,
        enablement_store_path=use_enablement_store,
        store_path=consumption_enablement_store,
    )
    assert result["stored"] is True
    return result


def test_downstream_consumption_one_shot_boundary_design_uses_safe_refs_without_execution(tmp_path):
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
    enablement = _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design(
        consumption_enablement_store_path=consumption_enablement_store,
    )

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design"
    assert dto["boundary_design_ready"] is True
    assert dto["source_consumption_enablement_ref"] == enablement["dto"]["consumption_enablement_ref"]
    assert dto["source_consumption_enablement_record_sha256"] == enablement["dto"]["consumption_enablement_record_sha256"]
    assert dto["safe_ref_chain_verified"] is True
    assert dto["target_allowlist_shape"]["safe_ref_only"] is True
    assert dto["idempotency_replay_guard_design"]["required"] is True
    assert dto["rollback_disable_posture"]["required"] is True
    assert dto["approval_boundary"]["explicit_human_approval_required"] is True
    assert dto["downstream_use_enabled"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["downstream_consumed"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    assert dto["watcher_enabled"] is False
    assert dto["cron_enabled"] is False
    assert dto["dispatch_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["vps_nas_mount_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert len(dto["boundary_design_sha256"]) == 64
    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "/volume1" not in serialized
    assert "sk-test" not in serialized


def test_downstream_consumption_one_shot_boundary_design_waits_without_enablement(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design(
        consumption_enablement_store_path=tmp_path / "missing.jsonl",
    )
    assert result["found"] is False
    assert result["dto"]["boundary_design_ready"] is False
    assert result["dto"]["downstream_consumption_enabled"] is False
    assert result["dto"]["next_required_boundary"] == "fresh_request_builder_downstream_consumption_enablement"


def test_downstream_consumption_one_shot_boundary_design_api_is_protected(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import _nas_keeper_handoff_queue_file
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    review_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_manual_review_records.jsonl"
    use_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_use_enablement_records.jsonl"
    consumption_enablement_store = tmp_path / "home" / "office" / "controlled-mutation" / "fresh_request_builder_downstream_consumption_enablement_records.jsonl"
    _seed_consumption_enablement(queue_dir, root, review_store, use_enablement_store, consumption_enablement_store)
    client = TestClient(app)

    unauth = client.get("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design")
    assert unauth.status_code == 401

    authed = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert authed.status_code == 200
    dto = authed.json()["dto"]
    assert dto["boundary_design_ready"] is True
    assert dto["downstream_consumption_enabled"] is False
    assert dto["actual_downstream_consumption_allowed"] is False
    serialized = json.dumps(authed.json(), sort_keys=True)
    assert "Safe body" not in serialized
    assert "lidises" not in serialized
    assert "sk-test" not in serialized
