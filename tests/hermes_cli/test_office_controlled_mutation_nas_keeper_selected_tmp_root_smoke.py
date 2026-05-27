"""Tests for selected durable contract sourced tmp-root write smoke."""

import hashlib
import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_preview_payload,
)


def selected_contract_payload(**overrides):
    payload = {
        **safe_preview_payload(),
        "selected_contract_ref": "selected_contract_tmp_root_smoke",
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T03:10:00Z",
        "operator_approval_checked": False,
        "execution_requested": False,
    }
    payload.update(overrides)
    return payload


def tmp_root_smoke_payload(**overrides):
    payload = {
        **safe_preview_payload(),
        "selected_contract_ref": "selected_contract_tmp_root_smoke",
        "tmp_root_smoke_ref": "tmp_root_smoke_selected_contract_20260527",
        "requested_by": "agent_nas_keeper",
        "requested_at": "2026-05-27T03:11:00Z",
    }
    payload.update(overrides)
    return payload


def test_selected_contract_tmp_root_smoke_writes_reads_back_records_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "isolated-mac-relay-root"
    contract_store = tmp_path / "selected-contracts.jsonl"
    smoke_store = tmp_path / "tmp-root-smokes.jsonl"
    prepare_authorized_handoff(queue_dir)
    contract = record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(), queue_dir=queue_dir, store_path=contract_store
    )
    assert contract["recorded"] is True
    before_queue = (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8")

    result = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=contract_store,
        smoke_store_path=smoke_store,
        root_path=root,
    )
    replay = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=contract_store,
        smoke_store_path=smoke_store,
        root_path=root,
    )

    assert (queue_dir / "mac-relay-write-queue.jsonl").read_text(encoding="utf-8") == before_queue
    assert result["executed"] is True
    assert result["written"] is True
    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["executed"] is False
    assert replay["written"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_selected_durable_tmp_root_write_smoke"
    assert dto["selected_contract_ref"] == "selected_contract_tmp_root_smoke"
    assert dto["selected_contract_verified"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["tmp_root_filesystem_write_executed"] is True
    assert dto["tmp_root_readback_verified"] is True
    assert dto["tmp_root_audit_written"] is True
    assert dto["payload_body_materialized"] is True
    assert dto["payload_body_materialization_scope"] == "internal_tmp_root_smoke_only"
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["write_payload_materialized"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["tmp_root_readback_sha256"] == hashlib.sha256(
        "# Usable AI Office preview demo\n\nThis safe note is ready for a later relay execution boundary.\n".encode("utf-8")
    ).hexdigest()
    assert len(dto["idempotency_key_sha256"]) == 64
    assert replay["dto"]["tmp_root_smoke_record_sha256"] == dto["tmp_root_smoke_record_sha256"]
    assert len(smoke_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay}, sort_keys=True).lower()
    assert "this safe " + "note is ready" not in serialized
    assert "markdown_body" + '\":' not in serialized
    assert '"write_' + 'payload":' not in serialized
    assert "/users" + "/lidises" not in serialized
    assert "/home" + "/hermes" not in serialized
    assert "sk" + "-" not in serialized


def test_selected_contract_tmp_root_smoke_fails_closed_without_selected_contract_or_root(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)
    missing_root = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(), queue_dir=queue_dir, contract_store_path=tmp_path / "missing.jsonl"
    )
    assert missing_root["executed"] is False
    assert missing_root["written"] is False
    assert missing_root["recorded"] is False
    assert missing_root["errors"] == [{"field": "mac_relay_tmp_root", "code": "mac_relay_tmp_root_not_configured"}]

    missing_contract = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=tmp_path / "missing.jsonl",
        root_path=tmp_path / "root",
    )
    assert missing_contract["executed"] is False
    assert missing_contract["written"] is False
    assert missing_contract["recorded"] is False
    assert missing_contract["errors"] == [{"field": "selected_contract_ref", "code": "selected_contract_not_found"}]


def test_selected_contract_tmp_root_smoke_api_requires_session_token_and_tmp_root(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    from hermes_cli.office_controlled_mutation import record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-durable-tmp-root-write-smoke"

    unauthenticated = client.post(route, json=tmp_root_smoke_payload())
    assert unauthenticated.status_code == 401
    not_configured = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=tmp_root_smoke_payload())
    assert not_configured.status_code == 200
    assert not_configured.json()["errors"] == [{"field": "mac_relay_tmp_root", "code": "mac_relay_tmp_root_not_configured"}]

    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    executed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=tmp_root_smoke_payload())
    assert executed.status_code == 200
    body = executed.json()
    assert body["executed"] is True
    assert body["dto"]["tmp_root_readback_verified"] is True
    assert body["dto"]["real_nas_production_write_enabled"] is False
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["tmp_root_smoke_ref"] == "tmp_root_smoke_selected_contract_20260527"


def replay_metadata_payload(smoke_dto, **overrides):
    payload = {
        "replay_metadata_ref": "replay_metadata_selected_tmp_root_20260527",
        "selected_contract_ref": smoke_dto["selected_contract_ref"],
        "selected_contract_record_sha256": smoke_dto["selected_contract_record_sha256"],
        "tmp_root_smoke_ref": smoke_dto["tmp_root_smoke_ref"],
        "tmp_root_smoke_record_sha256": smoke_dto["tmp_root_smoke_record_sha256"],
        "idempotency_key_sha256": smoke_dto["idempotency_key_sha256"],
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T03:35:00Z",
    }
    payload.update(overrides)
    return payload


def _record_selected_tmp_root_smoke(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "isolated-mac-relay-root"
    contract_store = tmp_path / "selected-contracts.jsonl"
    smoke_store = tmp_path / "tmp-root-smokes.jsonl"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(
        selected_contract_payload(), queue_dir=queue_dir, store_path=contract_store
    )
    smoke = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(
        tmp_root_smoke_payload(),
        queue_dir=queue_dir,
        contract_store_path=contract_store,
        smoke_store_path=smoke_store,
        root_path=root,
    )
    assert smoke["recorded"] is True
    return smoke["dto"], smoke_store


def test_selected_tmp_root_replay_metadata_records_safe_source_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata,
        get_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata_readback,
    )

    smoke_dto, smoke_store = _record_selected_tmp_root_smoke(tmp_path)
    replay_store = tmp_path / "selected-tmp-root-replay-metadata.jsonl"

    result = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(
        replay_metadata_payload(smoke_dto), smoke_store_path=smoke_store, replay_store_path=replay_store
    )
    replay = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(
        replay_metadata_payload(smoke_dto), smoke_store_path=smoke_store, replay_store_path=replay_store
    )
    readback = get_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata_readback(
        store_path=replay_store
    )

    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata"
    assert dto["replay_idempotency_metadata_ready"] is True
    assert dto["source_selected_contract_verified"] is True
    assert dto["source_tmp_root_write_smoke_verified"] is True
    assert dto["source_tmp_root_readback_verified"] is True
    assert dto["source_idempotency_key_verified"] is True
    assert dto["idempotency_duplicate_skip_verified"] is True
    assert dto["metadata_record_written"] is True
    assert dto["replay_store_write_enabled"] is True
    assert dto["real_replay_store_written"] is True
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert len(dto["replay_metadata_record_sha256"]) == 64
    assert readback["found"] is True
    assert readback["latest"]["replay_metadata_record_sha256"] == dto["replay_metadata_record_sha256"]
    assert len(replay_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay, "readback": readback}, sort_keys=True).lower()
    assert "this safe " + "note is ready" not in serialized
    assert "markdown_body" + '\":' not in serialized
    assert '"write_' + 'payload":' not in serialized
    assert "/users" + "/lidises" not in serialized
    assert "/home" + "/hermes" not in serialized
    assert "sk" + "-" not in serialized


def test_selected_tmp_root_replay_metadata_rejects_cross_source_replay(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata

    smoke_dto, smoke_store = _record_selected_tmp_root_smoke(tmp_path)
    bad_ref = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(
        replay_metadata_payload(smoke_dto, tmp_root_smoke_ref="different_tmp_root_smoke_ref"),
        smoke_store_path=smoke_store,
        replay_store_path=tmp_path / "replay.jsonl",
    )
    bad_sha = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(
        replay_metadata_payload(smoke_dto, tmp_root_smoke_record_sha256="0" * 64),
        smoke_store_path=smoke_store,
        replay_store_path=tmp_path / "replay.jsonl",
    )

    assert bad_ref["recorded"] is False
    assert bad_ref["errors"] == [{"field": "tmp_root_smoke_ref", "code": "source_smoke_record_not_found"}]
    assert bad_sha["recorded"] is False
    assert bad_sha["errors"] == [{"field": "tmp_root_smoke_record_sha256", "code": "checksum_mismatch"}]


def test_selected_tmp_root_replay_metadata_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    smoke = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(tmp_root_smoke_payload(), root_path=tmp_path / "tmp-root")
    assert smoke["recorded"] is True
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-durable-tmp-root-replay-idempotency-metadata"
    client = TestClient(app)

    unauthenticated = client.post(route, json=replay_metadata_payload(smoke["dto"]))
    assert unauthenticated.status_code == 401
    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=replay_metadata_payload(smoke["dto"]))
    assert recorded.status_code == 200
    assert recorded.json()["recorded"] is True
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["tmp_root_smoke_ref"] == smoke["dto"]["tmp_root_smoke_ref"]


def selected_precommit_payload(replay_dto, **overrides):
    payload = {
        "mac_relay_precommit_ref": "precommit_selected_tmp_root_20260527",
        "replay_metadata_ref": replay_dto["replay_metadata_ref"],
        "replay_metadata_record_sha256": replay_dto["replay_metadata_record_sha256"],
        "selected_contract_ref": replay_dto["selected_contract_ref"],
        "tmp_root_smoke_ref": replay_dto["tmp_root_smoke_ref"],
        "idempotency_key_sha256": replay_dto["idempotency_key_sha256"],
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T03:55:00Z",
    }
    payload.update(overrides)
    return payload


def _record_selected_replay_metadata(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata

    smoke_dto, smoke_store = _record_selected_tmp_root_smoke(tmp_path)
    replay_store = tmp_path / "selected-tmp-root-replay-metadata.jsonl"
    replay = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(
        replay_metadata_payload(smoke_dto), smoke_store_path=smoke_store, replay_store_path=replay_store
    )
    assert replay["recorded"] is True
    return replay["dto"], replay_store


def test_selected_tmp_root_precommit_metadata_records_safe_source_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata,
        get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata_readback,
    )

    replay_dto, replay_store = _record_selected_replay_metadata(tmp_path)
    precommit_store = tmp_path / "selected-precommit-metadata.jsonl"

    result = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(
        selected_precommit_payload(replay_dto), replay_store_path=replay_store, precommit_store_path=precommit_store
    )
    replay = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(
        selected_precommit_payload(replay_dto), replay_store_path=replay_store, precommit_store_path=precommit_store
    )
    readback = get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata_readback(
        store_path=precommit_store
    )

    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_selected_tmp_root_mac_relay_precommit_metadata"
    assert dto["mac_relay_precommit_metadata_ready"] is True
    assert dto["source_replay_idempotency_metadata_verified"] is True
    assert dto["source_selected_contract_ref_verified"] is True
    assert dto["source_tmp_root_smoke_ref_verified"] is True
    assert dto["source_replay_metadata_record_sha256_verified"] is True
    assert dto["source_idempotency_key_verified"] is True
    assert dto["metadata_record_written"] is True
    assert dto["precommit_duplicate_write_skipped"] is False
    assert dto["write_readiness_stage"] == "mac_relay_precommit_metadata_after_selected_tmp_root_replay_idempotency"
    assert dto["write_readiness_percent"] == 88
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_cron_dispatcher_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert len(dto["mac_relay_precommit_metadata_record_sha256"]) == 64
    assert replay["dto"]["precommit_duplicate_write_skipped"] is True
    assert replay["dto"]["mac_relay_precommit_metadata_record_sha256"] == dto["mac_relay_precommit_metadata_record_sha256"]
    assert readback["found"] is True
    assert readback["latest"]["mac_relay_precommit_ref"] == "precommit_selected_tmp_root_20260527"
    assert len(precommit_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay, "readback": readback}, sort_keys=True).lower()
    assert "this safe " + "note is ready" not in serialized
    assert "markdown_body" + '\":' not in serialized
    assert '"write_' + 'payload":' not in serialized
    assert "/users" + "/lidises" not in serialized
    assert "/home" + "/hermes" not in serialized
    assert "sk" + "-" not in serialized


def test_selected_tmp_root_precommit_metadata_rejects_cross_source_replay(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata

    replay_dto, replay_store = _record_selected_replay_metadata(tmp_path)
    bad_ref = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(
        selected_precommit_payload(replay_dto, replay_metadata_ref="different_replay_metadata_ref"),
        replay_store_path=replay_store,
        precommit_store_path=tmp_path / "precommit.jsonl",
    )
    bad_sha = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(
        selected_precommit_payload(replay_dto, replay_metadata_record_sha256="0" * 64),
        replay_store_path=replay_store,
        precommit_store_path=tmp_path / "precommit.jsonl",
    )

    assert bad_ref["recorded"] is False
    assert bad_ref["errors"] == [{"field": "replay_metadata_ref", "code": "source_replay_metadata_not_found"}]
    assert bad_sha["recorded"] is False
    assert bad_sha["errors"] == [{"field": "replay_metadata_record_sha256", "code": "checksum_mismatch"}]


def test_selected_tmp_root_precommit_metadata_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
        append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    smoke = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(tmp_root_smoke_payload(), root_path=tmp_path / "tmp-root")
    replay = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(replay_metadata_payload(smoke["dto"]))
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-tmp-root-mac-relay-precommit-metadata"
    client = TestClient(app)

    unauthenticated = client.post(route, json=selected_precommit_payload(replay["dto"]))
    assert unauthenticated.status_code == 401
    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=selected_precommit_payload(replay["dto"]))
    assert recorded.status_code == 200
    assert recorded.json()["recorded"] is True
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["replay_metadata_ref"] == replay["dto"]["replay_metadata_ref"]


def selected_precommit_manifest_payload(precommit_dto, **overrides):
    payload = {
        "mac_relay_precommit_manifest_ref": "precommit_manifest_selected_tmp_root_20260527",
        "mac_relay_precommit_ref": precommit_dto["mac_relay_precommit_ref"],
        "mac_relay_precommit_metadata_record_sha256": precommit_dto["mac_relay_precommit_metadata_record_sha256"],
        "replay_metadata_ref": precommit_dto["replay_metadata_ref"],
        "selected_contract_ref": precommit_dto["selected_contract_ref"],
        "tmp_root_smoke_ref": precommit_dto["tmp_root_smoke_ref"],
        "idempotency_key_sha256": precommit_dto["idempotency_key_sha256"],
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T04:20:00Z",
    }
    payload.update(overrides)
    return payload


def _record_selected_precommit_metadata(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata

    replay_dto, replay_store = _record_selected_replay_metadata(tmp_path)
    precommit_store = tmp_path / "selected-precommit-metadata.jsonl"
    precommit = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(
        selected_precommit_payload(replay_dto), replay_store_path=replay_store, precommit_store_path=precommit_store
    )
    assert precommit["recorded"] is True
    return precommit["dto"], precommit_store


def test_selected_tmp_root_precommit_manifest_records_safe_source_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest,
        get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest_readback,
    )

    precommit_dto, precommit_store = _record_selected_precommit_metadata(tmp_path)
    manifest_store = tmp_path / "selected-precommit-manifest.jsonl"

    result = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(
        selected_precommit_manifest_payload(precommit_dto),
        precommit_store_path=precommit_store,
        manifest_store_path=manifest_store,
    )
    replay = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(
        selected_precommit_manifest_payload(precommit_dto),
        precommit_store_path=precommit_store,
        manifest_store_path=manifest_store,
    )
    readback = get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest_readback(
        store_path=manifest_store
    )

    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_selected_tmp_root_mac_relay_precommit_manifest"
    assert dto["mac_relay_precommit_manifest_ready"] is True
    assert dto["source_mac_relay_precommit_metadata_verified"] is True
    assert dto["source_precommit_metadata_record_sha256_verified"] is True
    assert dto["safe_manifest_checklist_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["manifest_duplicate_write_skipped"] is False
    assert dto["write_readiness_stage"] == "mac_relay_precommit_manifest_after_selected_tmp_root_precommit_metadata"
    assert dto["write_readiness_percent"] == 94
    assert dto["next_write_boundary"] == "mac_relay_final_preflight_after_precommit_manifest"
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["manifest_includes_payload_body"] is False
    assert dto["manifest_includes_write_payload"] is False
    assert dto["manifest_includes_raw_root_path"] is False
    assert dto["manifest_includes_secret_value"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_cron_dispatcher_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert len(dto["mac_relay_precommit_manifest_record_sha256"]) == 64
    assert replay["dto"]["manifest_duplicate_write_skipped"] is True
    assert replay["dto"]["mac_relay_precommit_manifest_record_sha256"] == dto["mac_relay_precommit_manifest_record_sha256"]
    assert readback["found"] is True
    assert readback["latest"]["mac_relay_precommit_manifest_ref"] == "precommit_manifest_selected_tmp_root_20260527"
    assert len(manifest_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay, "readback": readback}, sort_keys=True).lower()
    assert "this safe " + "note is ready" not in serialized
    assert "markdown_body" + '\":' not in serialized
    assert '"write_' + 'payload":' not in serialized
    assert "/users" + "/lidises" not in serialized
    assert "/home" + "/hermes" not in serialized
    assert "sk" + "-" not in serialized


def test_selected_tmp_root_precommit_manifest_rejects_cross_source_precommit(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest

    precommit_dto, precommit_store = _record_selected_precommit_metadata(tmp_path)
    bad_ref = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(
        selected_precommit_manifest_payload(precommit_dto, mac_relay_precommit_ref="different_precommit_ref"),
        precommit_store_path=precommit_store,
        manifest_store_path=tmp_path / "manifest.jsonl",
    )
    bad_sha = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(
        selected_precommit_manifest_payload(precommit_dto, mac_relay_precommit_metadata_record_sha256="0" * 64),
        precommit_store_path=precommit_store,
        manifest_store_path=tmp_path / "manifest.jsonl",
    )

    assert bad_ref["recorded"] is False
    assert bad_ref["errors"] == [{"field": "mac_relay_precommit_ref", "code": "source_precommit_metadata_not_found"}]
    assert bad_sha["recorded"] is False
    assert bad_sha["errors"] == [{"field": "mac_relay_precommit_metadata_record_sha256", "code": "checksum_mismatch"}]


def test_selected_tmp_root_precommit_manifest_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
        append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata,
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    smoke = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(tmp_root_smoke_payload(), root_path=tmp_path / "tmp-root")
    replay = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(replay_metadata_payload(smoke["dto"]))
    precommit = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(selected_precommit_payload(replay["dto"]))
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-tmp-root-mac-relay-precommit-manifest"
    client = TestClient(app)

    unauthenticated = client.post(route, json=selected_precommit_manifest_payload(precommit["dto"]))
    assert unauthenticated.status_code == 401
    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=selected_precommit_manifest_payload(precommit["dto"]))
    assert recorded.status_code == 200
    assert recorded.json()["recorded"] is True
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["mac_relay_precommit_ref"] == precommit["dto"]["mac_relay_precommit_ref"]


def selected_final_preflight_payload(manifest_dto, **overrides):
    payload = {
        "mac_relay_final_preflight_ref": "final_preflight_selected_tmp_root_20260527",
        "mac_relay_precommit_manifest_ref": manifest_dto["mac_relay_precommit_manifest_ref"],
        "mac_relay_precommit_manifest_record_sha256": manifest_dto["mac_relay_precommit_manifest_record_sha256"],
        "mac_relay_precommit_ref": manifest_dto["mac_relay_precommit_ref"],
        "mac_relay_precommit_metadata_record_sha256": manifest_dto["mac_relay_precommit_metadata_record_sha256"],
        "replay_metadata_ref": manifest_dto["replay_metadata_ref"],
        "selected_contract_ref": manifest_dto["selected_contract_ref"],
        "tmp_root_smoke_ref": manifest_dto["tmp_root_smoke_ref"],
        "idempotency_key_sha256": manifest_dto["idempotency_key_sha256"],
        "recorded_by": "agent_nas_keeper",
        "recorded_at": "2026-05-27T04:40:00Z",
    }
    payload.update(overrides)
    return payload


def _record_selected_precommit_manifest(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest

    precommit_dto, precommit_store = _record_selected_precommit_metadata(tmp_path)
    manifest_store = tmp_path / "selected-precommit-manifest.jsonl"
    manifest = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(
        selected_precommit_manifest_payload(precommit_dto),
        precommit_store_path=precommit_store,
        manifest_store_path=manifest_store,
    )
    assert manifest["recorded"] is True
    return manifest["dto"], manifest_store


def test_selected_tmp_root_final_preflight_records_safe_source_and_replays(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight,
        get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight_readback,
    )

    manifest_dto, manifest_store = _record_selected_precommit_manifest(tmp_path)
    final_store = tmp_path / "selected-final-preflight.jsonl"

    result = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight(
        selected_final_preflight_payload(manifest_dto),
        manifest_store_path=manifest_store,
        final_preflight_store_path=final_store,
    )
    replay = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight(
        selected_final_preflight_payload(manifest_dto),
        manifest_store_path=manifest_store,
        final_preflight_store_path=final_store,
    )
    readback = get_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight_readback(
        store_path=final_store
    )

    assert result["recorded"] is True
    assert result["idempotent_replay"] is False
    assert replay["recorded"] is False
    assert replay["idempotent_replay"] is True
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_selected_tmp_root_mac_relay_final_preflight"
    assert dto["mac_relay_final_preflight_ready"] is True
    assert dto["source_mac_relay_precommit_manifest_verified"] is True
    assert dto["source_precommit_manifest_record_sha256_verified"] is True
    assert dto["final_preflight_checklist_verified"] is True
    assert dto["safe_ref_chain_verified"] is True
    assert dto["final_preflight_ref_chain_includes_precommit_manifest"] is True
    assert dto["final_preflight_ref_chain_includes_precommit_metadata"] is True
    assert dto["final_preflight_ref_chain_includes_replay_metadata"] is True
    assert dto["final_preflight_ref_chain_includes_tmp_root_smoke"] is True
    assert dto["final_preflight_duplicate_write_skipped"] is False
    assert dto["write_readiness_stage"] == "mac_relay_final_preflight_after_precommit_manifest"
    assert dto["write_readiness_percent"] == 97
    assert dto["next_write_boundary"] == "mac_relay_real_write_gate_after_final_preflight"
    assert dto["next_write_boundary_requires_explicit_real_nas_production_approval"] is True
    assert dto["metadata_only_record_write_executed"] is True
    assert dto["mac_relay_tmp_root_write_smoke_executed"] is True
    assert dto["final_preflight_includes_payload_body"] is False
    assert dto["final_preflight_includes_write_payload"] is False
    assert dto["final_preflight_includes_raw_root_path"] is False
    assert dto["final_preflight_includes_secret_value"] is False
    assert dto["real_nas_production_write_enabled"] is False
    assert dto["real_nas_production_write_executed"] is False
    assert dto["vps_direct_nas_authority_enabled"] is False
    assert dto["watcher_cron_dispatcher_enabled"] is False
    assert dto["authority_adapter_binding_enabled"] is False
    assert dto["public_exposure_enabled"] is False
    assert dto["gateway_restart_required"] is False
    assert len(dto["mac_relay_final_preflight_record_sha256"]) == 64
    assert replay["dto"]["final_preflight_duplicate_write_skipped"] is True
    assert replay["dto"]["mac_relay_final_preflight_record_sha256"] == dto["mac_relay_final_preflight_record_sha256"]
    assert readback["found"] is True
    assert readback["latest"]["mac_relay_final_preflight_ref"] == "final_preflight_selected_tmp_root_20260527"
    assert len(final_store.read_text(encoding="utf-8").splitlines()) == 1
    serialized = json.dumps({"result": result, "replay": replay, "readback": readback}, sort_keys=True).lower()
    assert "this safe " + "note is ready" not in serialized
    assert "markdown_body" + '\":' not in serialized
    assert '"write_' + 'payload":' not in serialized
    assert "/users" + "/lidises" not in serialized
    assert "/home" + "/hermes" not in serialized
    assert "sk" + "-" not in serialized


def test_selected_tmp_root_final_preflight_rejects_cross_source_manifest(tmp_path):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight

    manifest_dto, manifest_store = _record_selected_precommit_manifest(tmp_path)
    bad_ref = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight(
        selected_final_preflight_payload(manifest_dto, mac_relay_precommit_manifest_ref="different_manifest_ref"),
        manifest_store_path=manifest_store,
        final_preflight_store_path=tmp_path / "final-preflight.jsonl",
    )
    bad_sha = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_final_preflight(
        selected_final_preflight_payload(manifest_dto, mac_relay_precommit_manifest_record_sha256="0" * 64),
        manifest_store_path=manifest_store,
        final_preflight_store_path=tmp_path / "final-preflight.jsonl",
    )

    assert bad_ref["recorded"] is False
    assert bad_ref["errors"] == [{"field": "mac_relay_precommit_manifest_ref", "code": "source_precommit_manifest_not_found"}]
    assert bad_sha["recorded"] is False
    assert bad_sha["errors"] == [{"field": "mac_relay_precommit_manifest_record_sha256", "code": "checksum_mismatch"}]


def test_selected_tmp_root_final_preflight_api_requires_session_token(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_TMP_ROOT", str(tmp_path / "tmp-root"))
    from hermes_cli.office_controlled_mutation import (
        record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract,
        execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke,
        append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata,
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata,
        append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest,
    )
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    queue_dir = tmp_path / "hermes" / "ai-office" / "nas-keeper-handoff"
    prepare_authorized_handoff(queue_dir)
    record_office_controlled_mutation_nas_keeper_selected_durable_item_preview_contract(selected_contract_payload())
    smoke = execute_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_write_smoke(tmp_root_smoke_payload(), root_path=tmp_path / "tmp-root")
    replay = append_office_controlled_mutation_nas_keeper_selected_durable_tmp_root_replay_idempotency_metadata(replay_metadata_payload(smoke["dto"]))
    precommit = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_metadata(selected_precommit_payload(replay["dto"]))
    manifest = append_office_controlled_mutation_nas_keeper_selected_tmp_root_mac_relay_precommit_manifest(selected_precommit_manifest_payload(precommit["dto"]))
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-selected-tmp-root-mac-relay-final-preflight"
    client = TestClient(app)

    unauthenticated = client.post(route, json=selected_final_preflight_payload(manifest["dto"]))
    assert unauthenticated.status_code == 401
    recorded = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=selected_final_preflight_payload(manifest["dto"]))
    assert recorded.status_code == 200
    assert recorded.json()["recorded"] is True
    readback = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert readback.status_code == 200
    assert readback.json()["found"] is True
    assert readback.json()["latest"]["mac_relay_precommit_manifest_ref"] == manifest["dto"]["mac_relay_precommit_manifest_ref"]
