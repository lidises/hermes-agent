"""RED tests for the future NAS runtime boundary capability contract.

This file is intentionally N1-only: it describes the next runtime boundary
without adding production helper, route, storage, filesystem, or NAS access.
"""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


RUNTIME_SCHEMA_ROUTE = "/api/office/controlled-mutation/nas-runtime/schema"


def test_nas_runtime_boundary_contract_is_non_executable_by_default():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_runtime_boundary_contract

    contract = build_office_controlled_mutation_nas_runtime_boundary_contract()

    assert contract["schema_version"] == 1
    assert contract["mode"] == "nas_runtime_capability_contract_only"
    assert contract["gate"] == "N2_runtime_capability_contract"
    assert contract["approved_gate"] == "N2_runtime_capability_contract"
    assert contract["runtime"] == {
        "contract_enabled": True,
        "path_validation_enabled": False,
        "local_path_mapping_enabled": False,
        "runtime_path_resolution_enabled": False,
        "vault_mapping_enabled": False,
        "mount_discovery_enabled": False,
        "mount_health_check_enabled": False,
        "nas_mount_access_enabled": False,
        "filesystem_read_enabled": False,
        "filesystem_write_enabled": False,
        "evidence_package_files_dry_run_enabled": False,
        "evidence_file_persistence_enabled": False,
        "rollback_point_creation_enabled": False,
        "single_package_write_enabled": False,
        "nas_write_enabled": False,
    }
    assert contract["redaction"] == {
        "raw_excluded": True,
        "allowlisted_fields_only": True,
        "opaque_refs_only": True,
        "raw_paths_echoed": False,
        "unsupported_values_echoed": False,
    }
    assert contract["runtime_endpoints"] == []
    assert contract["mount_endpoints"] == []
    assert contract["filesystem_endpoints"] == []
    assert contract["write_endpoints"] == []
    assert all(value is False for value in contract["capabilities"].values())


def test_nas_runtime_boundary_contract_ignores_raw_private_material_and_paths():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_runtime_boundary_contract

    contract = build_office_controlled_mutation_nas_runtime_boundary_contract(
        unsafe_examples={
            "prompt": "raw runtime prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private runtime transcript",
            "local_path": "/Users/lidises/nas/private/wiki.md",
            "linux_mount_path": "/mnt/nas/private/wiki.md",
            "smb_url": "smb://private-nas/share/wiki.md",
            "mount_command": "mount -t smbfs //user:pass@host/share /mnt/nas",
            "source_body": "raw source body must not echo",
            "provider": "private-provider-id",
            "token": "sk-redacted-runtime-token",
            "credential": "credential material must not echo",
            "numeric_topic_id": "17585",
        }
    )

    serialized = str(contract).lower()
    assert "raw runtime prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "smb://" not in serialized
    assert "mount -t" not in serialized
    assert "raw source body" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-redacted-runtime-token" not in serialized
    assert "credential material" not in serialized
    assert "17585" not in serialized


def test_nas_runtime_boundary_schema_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.get(RUNTIME_SCHEMA_ROUTE)

    assert resp.status_code == 401


def test_nas_runtime_boundary_schema_api_is_protected_json_contract_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    assert RUNTIME_SCHEMA_ROUTE not in _PUBLIC_API_PATHS
    assert not RUNTIME_SCHEMA_ROUTE.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get(RUNTIME_SCHEMA_ROUTE, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert resp.status_code == 200
    assert resp.headers.get("content-type", "").startswith("application/json")
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "nas_runtime_capability_contract_only"
    assert payload["runtime"]["runtime_path_resolution_enabled"] is False
    assert payload["runtime"]["mount_health_check_enabled"] is False
    assert payload["runtime"]["nas_mount_access_enabled"] is False
    assert payload["runtime"]["filesystem_read_enabled"] is False
    assert payload["runtime"]["filesystem_write_enabled"] is False
    assert payload["runtime"]["nas_write_enabled"] is False
    assert payload["capabilities"]["credential_access_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
    assert payload["runtime_endpoints"] == []
    assert payload["mount_endpoints"] == []
    assert payload["filesystem_endpoints"] == []
    assert payload["write_endpoints"] == []


def test_nas_runtime_boundary_schema_api_rejects_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method(RUNTIME_SCHEMA_ROUTE, headers=headers)
        assert resp.status_code in {404, 405}
