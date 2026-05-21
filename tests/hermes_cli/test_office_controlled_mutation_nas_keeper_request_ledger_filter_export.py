"""Tests for safe filtering/export of fresh request-builder ledger readback."""

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
        _payload("filter_written"),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T15:01:00Z",
        nonce="aaa11111",
    )
    reviewed = build_office_controlled_mutation_nas_keeper_fresh_one_shot_operator_request(
        _payload("filter_reviewed", approve=False),
        queue_dir=queue,
        root_path=root,
        now_utc="2026-05-21T15:02:00Z",
        nonce="bbb22222",
    )
    assert written["written"] is True
    assert reviewed["written"] is False


def test_request_builder_ledger_filters_by_outcome_status_ref_and_time_window(tmp_path):
    from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback

    root = tmp_path / "nas-root"
    queue = tmp_path / "queue"
    root.mkdir()
    queue.mkdir()
    _seed(queue, root)

    filtered = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(
        queue_dir=queue,
        outcome="written",
        queue_status="mac_relay_execution_succeeded",
        ref_prefix="handoff_filter_written",
        since="2026-05-21T15:00:00Z",
        until="2026-05-21T15:01:30Z",
        export_safe=True,
    )

    assert filtered["found"] is True
    assert filtered["errors"] == []
    dto = filtered["dto"]
    assert dto["count"] == 1
    assert dto["filters_applied"] == {
        "outcome": "written",
        "queue_status": "mac_relay_execution_succeeded",
        "ref_prefix": "handoff_filter_written",
        "since": "2026-05-21T15:00:00Z",
        "until": "2026-05-21T15:01:30Z",
    }
    assert dto["safe_export_enabled"] is True
    assert dto["safe_export"]["format"] == "fresh_request_builder_safe_export_v1"
    assert dto["safe_export"]["count"] == 1
    exported = dto["safe_export"]["items"][0]
    assert exported["handoff_ref"] == "handoff_filter_written_20260521150100_aaa11111"
    assert exported["operator_request_outcome"] == "written"
    assert exported["queue_status"] == "mac_relay_execution_succeeded"
    assert len(exported["readback_sha256"]) == 64
    encoded = json.dumps(filtered, ensure_ascii=False)
    assert "Safe body for filter_written" not in encoded
    assert str(root) not in encoded
    assert "markdown_body" not in exported
    assert "write_payload" not in exported


def test_request_builder_ledger_filter_rejects_unsafe_values(tmp_path):
    from hermes_cli.office_controlled_mutation import get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback

    result = get_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_readback(
        queue_dir=tmp_path,
        outcome="written; rm -rf /",
        queue_status="mac_relay_execution_succeeded",
        ref_prefix="/Users/lidises/private",
        since="not-a-date",
        export_safe=True,
    )

    assert result["found"] is False
    assert result["dto"] is None
    assert {error["field"] for error in result["errors"]} >= {"outcome", "ref_prefix", "since"}
    assert "/Users/lidises/private" not in json.dumps(result, ensure_ascii=False)


def test_request_builder_ledger_filter_route_is_protected(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "home"))
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    client = TestClient(app)
    path = "/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger?outcome=written&export_safe=true"
    unauth = client.get(path)
    assert unauth.status_code == 401

    auth = client.get(path, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
    assert auth.status_code == 200
    body = auth.json()
    assert body["dto"]["safe_export_enabled"] is True
    assert body["dto"]["safe_export"]["format"] == "fresh_request_builder_safe_export_v1"
    assert body["dto"]["markdown_body_included"] is False
