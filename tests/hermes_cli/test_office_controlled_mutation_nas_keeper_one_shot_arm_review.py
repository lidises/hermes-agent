"""Tests for arming/reviewing one-shot Mac relay write payloads without executing writes."""

import json

import pytest

pytest.importorskip("fastapi")
from starlette.testclient import TestClient

from tests.hermes_cli.test_office_controlled_mutation_nas_keeper_execution_payload_preview import (
    prepare_authorized_handoff,
    safe_preview_payload,
)


def test_one_shot_write_payload_arm_review_requires_safe_preview_and_ready_root_without_body_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm

    queue_dir = tmp_path / "queue"
    root = tmp_path / "mac-relay-root"
    root.mkdir()
    prepare_authorized_handoff(queue_dir)

    result = review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm(
        safe_preview_payload(), queue_dir=queue_dir, root_path=root
    )

    assert result["armed"] is True
    assert result["ready_for_one_shot_write"] is True
    assert result["executed"] is False
    assert result["written"] is False
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_keeper_mac_relay_one_shot_write_payload_arm_review"
    assert dto["one_shot_write_payload_armed"] is True
    assert dto["execution_payload_reviewed"] is True
    assert dto["root_configured"] is True
    assert dto["root_readable"] is True
    assert dto["root_writable"] is True
    assert dto["write_payload_included"] is False
    assert dto["markdown_body_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["execution_payload_preview"]["relay_execution_ref"] == "relay_exec_20260517_preview_demo"
    assert "markdown_body" not in dto["execution_payload_preview"]
    assert dto["next_required_boundary"] == "mac_local_relay_one_shot_write_execution"
    capabilities = dto["capabilities"]
    assert capabilities["mac_relay_write_enabled"] is False
    assert capabilities["actual_nas_write_enabled"] is False
    assert capabilities["one_shot_write_execution_enabled"] is False
    assert capabilities["vps_nas_mount_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "this safe note is ready" not in serialized
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized
    assert "sk-" not in serialized


def test_one_shot_write_payload_arm_review_fails_closed_when_root_not_ready(tmp_path):
    from hermes_cli.office_controlled_mutation import review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm

    queue_dir = tmp_path / "queue"
    prepare_authorized_handoff(queue_dir)

    result = review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm(
        safe_preview_payload(), queue_dir=queue_dir, root_path=None
    )

    assert result["armed"] is False
    assert result["ready_for_one_shot_write"] is False
    assert result["executed"] is False
    assert result["written"] is False
    assert result["errors"] == [{"field": "mac_relay_root", "code": "mac_relay_root_not_configured"}]
    dto = result["dto"]
    assert dto["one_shot_write_payload_armed"] is False
    assert dto["root_configured"] is False
    assert dto["write_payload_included"] is False
    assert dto["capabilities"]["actual_nas_write_enabled"] is False


def test_one_shot_write_payload_arm_review_rejects_unsupported_raw_extras_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm

    queue_dir = tmp_path / "queue"
    root = tmp_path / "mac-relay-root"
    root.mkdir()
    prepare_authorized_handoff(queue_dir)

    result = review_office_controlled_mutation_nas_keeper_one_shot_write_payload_arm(
        {**safe_preview_payload(), "raw_path": "/" + "Users/lidises/private", "credential": "sk-" + "secret"},
        queue_dir=queue_dir,
        root_path=root,
    )

    assert result["armed"] is False
    assert result["ready_for_one_shot_write"] is False
    assert result["errors"] == [{"field": "unsupported_fields", "code": "unsupported_field"}]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "sk-secret" not in serialized


def test_one_shot_write_payload_arm_review_route_is_protected_and_safe(monkeypatch, tmp_path):
    from hermes_cli import office_controlled_mutation as mutation
    from hermes_cli.web_server import _SESSION_HEADER_NAME, _SESSION_TOKEN, app

    queue_dir = tmp_path / "queue"
    root = tmp_path / "mac-relay-root"
    root.mkdir()
    prepare_authorized_handoff(queue_dir)
    monkeypatch.setattr(mutation, "_nas_keeper_handoff_queue_file", lambda queue_dir=None: queue_dir / "mac-relay-write-queue.jsonl" if queue_dir is not None else tmp_path / "queue" / "mac-relay-write-queue.jsonl")
    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT", str(root))

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/nas-keeper-one-shot-write-payload-arm-review"
    unauthenticated = client.post(route, json=safe_preview_payload())
    assert unauthenticated.status_code == 401

    armed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_preview_payload())
    assert armed.status_code == 200
    body = armed.json()
    assert body["armed"] is True
    assert body["ready_for_one_shot_write"] is True
    assert body["dto"]["write_payload_included"] is False
    assert body["dto"]["capabilities"]["actual_nas_write_enabled"] is False
    assert "this safe note is ready" not in json.dumps(body).lower()
    assert "/users/lidises" not in json.dumps(body).lower()
