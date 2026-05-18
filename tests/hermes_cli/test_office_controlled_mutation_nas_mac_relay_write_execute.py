"""Tests for authenticated NAS Keeper -> Mac relay write execution."""

import hashlib
import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_mac_relay_execute_payload(**overrides):
    payload = {
        "relay_request_ref": "relay_req_20260517_exec",
        "relay_execution_ref": "relay_exec_20260517_exec",
        "write_ref": "write_20260517_exec",
        "package_ref": "pkg_20260517_exec",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-mac-relay-exec",
        "safe_title": "Usable AI Office Mac relay execution",
        "markdown_body": "# Usable AI Office Mac relay execution\n\nThis safe note is written by the Mac relay.\n",
        "requested_by": "agent_orchestrator",
        "requested_at": "2026-05-17T15:45:00Z",
        "nas_keeper_ref": "agent_nas_keeper",
        "relay_node_ref": "mac_relay_primary",
        "relay_authorized_by": "agent_nas_keeper",
        "relay_authorized_at": "2026-05-17T15:46:00Z",
    }
    payload.update(overrides)
    return payload


def test_mac_relay_write_execute_writes_reads_back_and_audits(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_mac_relay_write

    payload = safe_mac_relay_execute_payload()
    result = execute_office_controlled_mutation_nas_mac_relay_write(payload, root_path=tmp_path)

    assert result["executed"] is True
    assert result["written"] is True
    assert result["errors"] == []
    target = tmp_path / "vault_personal_wiki_demo" / "usable-ai-office-mac-relay-exec.md"
    assert target.read_text(encoding="utf-8") == payload["markdown_body"]
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["mode"] == "nas_keeper_mac_relay_write_completed"
    assert dto["execution_path"] == ["ai_office_request", "nas_keeper", "mac_relay", "real_nas"]
    assert dto["safe_logical_path"] == "vault_personal_wiki_demo::usable-ai-office-mac-relay-exec.md"
    assert dto["readback_verified"] is True
    assert dto["readback_first_line"] == "# Usable AI Office Mac relay execution"
    assert dto["readback_sha256"] == hashlib.sha256(payload["markdown_body"].encode("utf-8")).hexdigest()
    assert dto["audit_written"] is True
    assert dto["rollback_created"] is False
    capabilities = dto["capabilities"]
    assert isinstance(capabilities, dict)
    assert capabilities["direct_vps_nas_write_enabled"] is False
    assert capabilities["vps_nas_mount_enabled"] is False
    assert capabilities["vps_credential_access_enabled"] is False
    assert capabilities["mac_relay_write_enabled"] is True
    assert capabilities["actual_nas_write_enabled"] is True
    audit_path = tmp_path / "vault_personal_wiki_demo" / ".ai-office-audit" / "write_20260517_exec.json"
    audit = json.loads(audit_path.read_text(encoding="utf-8"))
    assert audit["safe_logical_path"] == dto["safe_logical_path"]
    serialized = json.dumps(dto, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "/home/hermes" not in serialized


def test_mac_relay_write_execute_creates_rollback_on_replace(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_mac_relay_write

    first = safe_mac_relay_execute_payload(markdown_body="# First\n")
    second = safe_mac_relay_execute_payload(
        relay_execution_ref="relay_exec_20260517_replace",
        write_ref="write_20260517_replace",
        markdown_body="# Second\n",
    )

    assert execute_office_controlled_mutation_nas_mac_relay_write(first, root_path=tmp_path)["executed"] is True
    result = execute_office_controlled_mutation_nas_mac_relay_write(second, root_path=tmp_path)

    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["rollback_created"] is True
    assert dto["rollback_ref"] == "rollback_write_20260517_replace"
    assert dto["readback_first_line"] == "# Second"
    rollback = tmp_path / ".ai-office-rollbacks" / "write_20260517_replace" / "usable-ai-office-mac-relay-exec.md"
    assert rollback.read_text(encoding="utf-8") == "# First\n"


def test_mac_relay_write_execute_fails_closed_when_readback_unavailable(tmp_path, monkeypatch):
    from pathlib import Path

    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_mac_relay_write

    real_read_text = Path.read_text

    def fail_target_readback(self, *args, **kwargs):
        if self.name == "usable-ai-office-mac-relay-exec.md":
            raise OSError("/Users/lidises/nas/private readback failed")
        return real_read_text(self, *args, **kwargs)

    monkeypatch.setattr(Path, "read_text", fail_target_readback)
    result = execute_office_controlled_mutation_nas_mac_relay_write(safe_mac_relay_execute_payload(), root_path=tmp_path)

    assert result == {
        "executed": False,
        "written": True,
        "errors": [{"field": "readback", "code": "readback_unavailable"}],
        "dto": None,
    }
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "readback failed" not in serialized
    assert "traceback" not in serialized


def test_mac_relay_write_execute_treats_audit_os_errors_as_nonfatal_safe_metadata(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_mac_relay_write

    audit_path_parent = tmp_path / "vault_personal_wiki_demo" / ".ai-office-audit"
    audit_path_parent.parent.mkdir(parents=True)
    audit_path_parent.write_text("not a directory", encoding="utf-8")

    result = execute_office_controlled_mutation_nas_mac_relay_write(safe_mac_relay_execute_payload(), root_path=tmp_path)

    assert result["executed"] is True
    assert result["written"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert isinstance(dto, dict)
    assert dto["audit_written"] is False
    assert dto["audit_ref"] is None
    assert dto["capabilities"]["audit_write_enabled"] is False
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "traceback" not in serialized


def test_mac_relay_write_execute_requires_local_root_and_auth_fields():
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_mac_relay_write

    assert execute_office_controlled_mutation_nas_mac_relay_write(safe_mac_relay_execute_payload())["errors"] == [
        {"field": "mac_relay_root", "code": "mac_relay_root_not_configured"}
    ]
    bad = safe_mac_relay_execute_payload(relay_authorized_by="bad/path")
    result = execute_office_controlled_mutation_nas_mac_relay_write(bad, root_path=".")
    assert result["executed"] is False
    errors = result["errors"]
    assert isinstance(errors, list)
    assert {item["code"] for item in errors} >= {"invalid_opaque_id"}


def test_mac_relay_write_execute_api_requires_session_token_and_local_root(tmp_path, monkeypatch):
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute"

    unauthenticated = client.post(route, json=safe_mac_relay_execute_payload())
    assert unauthenticated.status_code == 401

    not_configured = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_mac_relay_execute_payload())
    assert not_configured.status_code == 200
    assert not_configured.json()["errors"] == [{"field": "mac_relay_root", "code": "mac_relay_root_not_configured"}]

    monkeypatch.setenv("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT", str(tmp_path))
    executed = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_mac_relay_execute_payload())
    assert executed.status_code == 200
    body = executed.json()
    assert body["executed"] is True
    assert body["dto"]["capabilities"]["direct_vps_nas_write_enabled"] is False
    assert (tmp_path / "vault_personal_wiki_demo" / "usable-ai-office-mac-relay-exec.md").exists()
