"""Tests for NAS path resolution contract-only boundary."""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def test_nas_path_resolution_contract_is_contract_only_and_non_runtime():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_path_resolution_contract

    contract = build_office_controlled_mutation_nas_path_resolution_contract()

    assert contract["schema_version"] == 1
    assert contract["mode"] == "nas_path_resolution_contract_only"
    assert contract["required_path_fields"] == [
        "path_resolution_ref",
        "package_ref",
        "target_vault_ref",
        "proposed_path_ref",
        "safe_title",
        "safe_slug",
        "path_policy_ref",
        "created_by",
        "created_at",
    ]
    assert contract["path_resolution"] == {
        "contract_enabled": True,
        "path_validation_enabled": False,
        "path_resolution_enabled": False,
        "vault_mapping_enabled": False,
        "mount_discovery_enabled": False,
        "mount_access_enabled": False,
        "filesystem_read_enabled": False,
        "filesystem_write_enabled": False,
        "nas_save_preparation_enabled": False,
        "nas_save_enabled": False,
        "nas_write_enabled": False,
        "evidence_file_persistence_enabled": False,
        "rollback_point_creation_enabled": False,
        "database_migration_required": False,
    }
    assert contract["redaction"] == {
        "raw_excluded": True,
        "allowlisted_fields_only": True,
        "opaque_refs_only": True,
        "safe_path_refs_only": True,
        "unsupported_values_echoed": False,
    }
    assert contract["capabilities"]["nas_path_resolution_enabled"] is False
    assert contract["capabilities"]["nas_mount_access_enabled"] is False
    assert contract["capabilities"]["filesystem_read_enabled"] is False
    assert contract["capabilities"]["filesystem_write_enabled"] is False
    assert contract["capabilities"]["nas_save_enabled"] is False
    assert contract["capabilities"]["nas_write_enabled"] is False
    assert contract["capabilities"]["credential_access_enabled"] is False
    assert contract["path_resolution_endpoints"] == []
    assert contract["mount_endpoints"] == []
    assert contract["filesystem_endpoints"] == []
    assert all(value is False for value in contract["capabilities"].values())


def test_nas_path_resolution_contract_ignores_raw_paths_and_credentials():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_path_resolution_contract

    contract = build_office_controlled_mutation_nas_path_resolution_contract(
        unsafe_examples={
            "prompt": "raw path resolution prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private path resolver transcript",
            "nas_path": "/Users/lidises/nas/private/wiki.md",
            "linux_mount_path": "/mnt/nas/private/wiki.md",
            "smb_url": "smb://private-nas/share/wiki.md",
            "mount_command": "mount -t smbfs //user:pass@host/share /mnt/nas",
            "provider": "private-provider-id",
            "token": "sk-redacted-value",
            "credential": "credential material must not echo",
        }
    )

    serialized = str(contract).lower()
    assert "raw path resolution prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "smb://" not in serialized
    assert "mount -t" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-redacted" not in serialized
    assert "credential material" not in serialized


def test_nas_path_resolution_schema_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.get("/api/office/controlled-mutation/nas-path-resolution/schema")

    assert resp.status_code == 401


def test_nas_path_resolution_schema_api_is_protected_contract_only_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-path-resolution/schema"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert resp.status_code == 200
    assert resp.headers.get("content-type", "").startswith("application/json")
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "nas_path_resolution_contract_only"
    assert payload["path_resolution"]["path_resolution_enabled"] is False
    assert payload["path_resolution"]["mount_access_enabled"] is False
    assert payload["path_resolution"]["filesystem_read_enabled"] is False
    assert payload["path_resolution"]["filesystem_write_enabled"] is False
    assert payload["capabilities"]["nas_path_resolution_enabled"] is False
    assert payload["capabilities"]["nas_mount_access_enabled"] is False
    assert payload["capabilities"]["nas_write_enabled"] is False
    assert payload["capabilities"]["credential_access_enabled"] is False
    assert payload["path_resolution_endpoints"] == []
    assert payload["mount_endpoints"] == []
    assert payload["filesystem_endpoints"] == []


def test_nas_path_resolution_schema_api_rejects_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    route = "/api/office/controlled-mutation/nas-path-resolution/schema"

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method(route, headers=headers)
        assert resp.status_code in {404, 405}
