"""Tests for display-only selected export review of the fresh request-builder ledger."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def _payload(label: str, *, approve: bool = True) -> dict[str, object]:
    return {
        "operator_intent_ref": f"intent_{label}",
        "target_vault_ref": "Hermes",
        "safe_slug_base": label.replace("_", "-"),
        "safe_title": f"Safe {label}",
        "markdown_body": f"Safe body for {label}.\n",
        "requested_by": "agent_orchestrator",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "approve_actual_write": approve,
    }


def _seed(queue, root):
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request

    written = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        _payload("select_written"),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T15:09:00Z",
        nonce="7afe4001",
    )
    reviewed = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        _payload("select_reviewed", approve=False),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T15:10:00Z",
        nonce="8afe4002",
    )
    assert written["written"] is True
    assert reviewed["written"] is False


def test_selection_review_summarizes_one_safe_profile_without_sensitive_fields(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_export_selection_review,
    )

    queue_dir = tmp_path / "queue"
    root = tmp_path / "nas-root"
    queue_dir.mkdir()
    root.mkdir()
    _seed(queue_dir, root)

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_export_selection_review(
        queue_dir=queue_dir,
        profile="latest_written",
        limit=10,
    )

    assert result["found"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_fresh_request_builder_ledger_export_selection_review"
    assert dto["selection_profile"] == "latest_written"
    assert dto["selected_item_count"] == 1
    assert dto["export_item_count_verified"] is True
    assert dto["checksum_set_verified"] is True
    assert len(dto["checksum_set_sha256"]) == 64
    assert dto["downstream_use_enabled"] is False
    assert dto["downstream_use_ready"] is True
    assert dto["selected_safe_export"]["format"] == "fresh_request_builder_safe_export_v1"
    assert dto["selected_safe_export"]["count"] == 1
    assert dto["selected_checksum_set"][0]["handoff_ref"] == "handoff_select_written_20260521150900_7afe4001"
    assert dto["selected_checksum_set"][0]["readback_sha256"] == dto["selected_checksum_set"][0]["markdown_body_sha256"]
    assert dto["markdown_body_included"] is False
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    serialized = json.dumps(result, sort_keys=True)
    assert "Safe body" not in serialized
    assert "/Users/" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-test" not in serialized


def test_selection_review_rejects_unknown_profile_without_echoing_raw_value(tmp_path):
    from hermes_cli.office_controlled_mutation import (
        get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_export_selection_review,
    )

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_export_selection_review(
        queue_dir=tmp_path,
        profile="../../Users/lidises/private",
    )

    assert result["found"] is False
    assert result["dto"] is None
    assert result["errors"] == [{"field": "profile", "code": "unsupported_selection_profile"}]
    assert "lidises" not in json.dumps(result)


def test_selection_review_api_is_protected_and_returns_safe_export(monkeypatch, tmp_path):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.office_controlled_mutation import _nas_keeper_handoff_queue_file
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = _nas_keeper_handoff_queue_file().parent
    root = tmp_path / "nas-root"
    root.mkdir()
    _seed(queue_dir, root)

    client = TestClient(app)
    unauth = client.get("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-export-selection-review")
    assert unauth.status_code == 401

    authed = client.get(
        "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-export-selection-review?profile=latest_written&limit=5",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert authed.status_code == 200
    body = authed.json()
    assert body["found"] is True
    assert body["dto"]["selected_item_count"] == 1
    assert body["dto"]["downstream_use_enabled"] is False
    assert body["dto"]["capabilities"]["selected_export_review_enabled"] is True
    assert body["dto"]["capabilities"]["downstream_use_enabled"] is False
