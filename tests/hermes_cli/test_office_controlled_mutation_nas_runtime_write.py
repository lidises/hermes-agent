"""Tests for approved local NAS runtime single-file write with rollback."""

import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_write_payload():
    return {
        "write_ref": "write_20260517_demo",
        "package_ref": "pkg_20260517_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "safe_slug": "usable-ai-office-demo",
        "safe_title": "Usable AI Office demo",
        "markdown_body": "# Usable AI Office demo\n\nThis safe note was written through the controlled mutation runtime.\n",
        "requested_by": "agent_nas_keeper",
        "requested_at": "2026-05-17T12:20:00Z",
    }


def test_nas_runtime_single_file_write_creates_markdown_and_rollback_metadata(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=root_path)

    assert result["written"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "nas_single_file_write_completed"
    assert dto["write_ref"] == "write_20260517_demo"
    assert dto["safe_logical_path"] == "vault_personal_wiki_demo::usable-ai-office-demo.md"
    assert dto["safe_display_path"] == "vault_personal_wiki_demo / usable-ai-office-demo.md"
    assert dto["bytes_written"] == len(safe_write_payload()["markdown_body"].encode("utf-8"))
    assert dto["rollback_created"] is False
    assert dto["capabilities"]["single_package_write_enabled"] is True
    assert dto["capabilities"]["filesystem_write_enabled"] is True
    assert dto["capabilities"]["nas_write_enabled"] is True
    assert dto["capabilities"]["credential_access_enabled"] is False
    assert dto["capabilities"]["target_mutation_enabled"] is False

    target = root_path / "vault_personal_wiki_demo" / "usable-ai-office-demo.md"
    assert target.read_text(encoding="utf-8") == safe_write_payload()["markdown_body"]
    serialized = json.dumps(dto, sort_keys=True).lower()
    assert str(root_path).lower() not in serialized
    assert "/users/lidises" not in serialized


def test_nas_runtime_single_file_write_replaces_existing_file_and_creates_rollback(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    target = root_path / "vault_personal_wiki_demo" / "usable-ai-office-demo.md"
    target.parent.mkdir(parents=True)
    target.write_text("# Previous safe note\n", encoding="utf-8")

    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=root_path)

    assert result["written"] is True
    dto = result["dto"]
    assert dto["rollback_created"] is True
    assert dto["rollback_ref"] == "rollback_write_20260517_demo"
    rollback = root_path / ".ai-office-rollbacks" / "write_20260517_demo" / "usable-ai-office-demo.md"
    assert rollback.read_text(encoding="utf-8") == "# Previous safe note\n"
    assert target.read_text(encoding="utf-8") == safe_write_payload()["markdown_body"]


def test_nas_runtime_single_file_write_falls_back_to_vault_local_rollback_when_root_sidecar_unwritable(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    target = root_path / "vault_personal_wiki_demo" / "usable-ai-office-demo.md"
    target.parent.mkdir(parents=True)
    target.write_text("# Previous safe note\n", encoding="utf-8")
    root_path.chmod(0o555)
    try:
        result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=root_path)
    finally:
        root_path.chmod(0o755)

    assert result["written"] is True
    dto = result["dto"]
    assert dto["rollback_created"] is True
    assert dto["rollback_ref"] == "rollback_write_20260517_demo"
    rollback = target.parent / ".ai-office-rollbacks" / "write_20260517_demo" / "usable-ai-office-demo.md"
    assert rollback.read_text(encoding="utf-8") == "# Previous safe note\n"
    assert target.read_text(encoding="utf-8") == safe_write_payload()["markdown_body"]
    serialized = json.dumps(dto, sort_keys=True).lower()
    assert str(root_path).lower() not in serialized


def test_nas_runtime_single_file_write_rejects_raw_paths_and_tokens_without_write_or_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    payload = {
        **safe_write_payload(),
        "safe_slug": "../private",
        "markdown_body": "# Bad\n\n/Users/lidises/nas/private sk-redacted token\n",
    }
    result = execute_office_controlled_mutation_nas_single_file_write(payload, root_path=root_path)

    assert result["written"] is False
    assert result["dto"] is None
    assert {item["code"] for item in result["errors"]} >= {"invalid_safe_slug", "raw_marker_detected"}
    assert not root_path.exists()
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "sk-redacted" not in serialized


def test_nas_runtime_single_file_write_fails_closed_when_target_parent_unavailable(tmp_path):
    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    root_path.mkdir()
    (root_path / "vault_personal_wiki_demo").write_text("not a directory", encoding="utf-8")

    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=root_path)

    assert result == {
        "written": False,
        "errors": [{"field": "write_target", "code": "write_target_unavailable"}],
        "dto": None,
    }
    serialized = json.dumps(result, sort_keys=True).lower()
    assert str(root_path).lower() not in serialized
    assert "/users/lidises" not in serialized
    assert "traceback" not in serialized


def test_nas_runtime_single_file_write_fails_closed_when_atomic_temp_write_fails(tmp_path, monkeypatch):
    from pathlib import Path

    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    real_write_text = Path.write_text

    def fail_temp_write(self, data, *args, **kwargs):
        if self.name.startswith(".usable-ai-office-demo.md.") and self.name.endswith(".tmp"):
            raise OSError("/Users/lidises/nas/private write failed")
        return real_write_text(self, data, *args, **kwargs)

    monkeypatch.setattr(Path, "write_text", fail_temp_write)
    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=tmp_path / "nas-root")

    assert result == {
        "written": False,
        "errors": [{"field": "write_target", "code": "write_target_unavailable"}],
        "dto": None,
    }
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "write failed" not in serialized
    assert "traceback" not in serialized


def test_nas_runtime_single_file_write_fails_closed_when_atomic_replace_fails(tmp_path, monkeypatch):
    from pathlib import Path

    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    real_replace = Path.replace

    def fail_temp_replace(self, target):
        if self.name.startswith(".usable-ai-office-demo.md.") and self.name.endswith(".tmp"):
            raise OSError("/Users/lidises/nas/private replace failed")
        return real_replace(self, target)

    monkeypatch.setattr(Path, "replace", fail_temp_replace)
    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=tmp_path / "nas-root")

    assert result == {
        "written": False,
        "errors": [{"field": "write_target", "code": "write_target_unavailable"}],
        "dto": None,
    }
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "replace failed" not in serialized
    assert "traceback" not in serialized


def test_nas_runtime_single_file_write_fails_closed_when_rollback_copy_fails(tmp_path, monkeypatch):
    from pathlib import Path

    from hermes_cli.office_controlled_mutation import execute_office_controlled_mutation_nas_single_file_write

    root_path = tmp_path / "nas-root"
    target = root_path / "vault_personal_wiki_demo" / "usable-ai-office-demo.md"
    target.parent.mkdir(parents=True)
    target.write_text("# Previous safe note\n", encoding="utf-8")
    real_write_bytes = Path.write_bytes

    def fail_rollback_write(self, data):
        if ".ai-office-rollbacks" in self.parts:
            raise OSError("/Users/lidises/nas/private rollback failed")
        return real_write_bytes(self, data)

    monkeypatch.setattr(Path, "write_bytes", fail_rollback_write)
    result = execute_office_controlled_mutation_nas_single_file_write(safe_write_payload(), root_path=root_path)

    assert result == {
        "written": False,
        "errors": [{"field": "rollback", "code": "rollback_unavailable"}],
        "dto": None,
    }
    assert target.read_text(encoding="utf-8") == "# Previous safe note\n"
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "/users/lidises" not in serialized
    assert "rollback failed" not in serialized
    assert "traceback" not in serialized


def test_nas_runtime_single_file_write_api_requires_root_and_session_token(monkeypatch, tmp_path):
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.delenv("HERMES_AI_OFFICE_NAS_WRITE_ROOT", raising=False)
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-runtime/single-file-write"

    unauthenticated = client.post(route, json=safe_write_payload())
    assert unauthenticated.status_code == 401

    blocked = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_write_payload())
    assert blocked.status_code == 200
    assert blocked.json() == {
        "written": False,
        "errors": [{"field": "write_root", "code": "write_root_not_configured"}],
        "dto": None,
    }

    write_root = tmp_path / "configured-nas-root"
    monkeypatch.setenv("HERMES_AI_OFFICE_NAS_WRITE_ROOT", str(write_root))
    written = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_write_payload())

    assert written.status_code == 200
    body = written.json()
    assert body["written"] is True
    assert body["dto"]["safe_logical_path"] == "vault_personal_wiki_demo::usable-ai-office-demo.md"
    assert (write_root / "vault_personal_wiki_demo" / "usable-ai-office-demo.md").exists()
