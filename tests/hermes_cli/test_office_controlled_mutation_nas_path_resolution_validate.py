"""Tests for validate-only NAS path resolution DTO boundary."""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_payload():
    return {
        "path_resolution_ref": "pathres_20260516_demo",
        "package_ref": "pkg_20260516_demo",
        "target_vault_ref": "vault_personal_operating_wiki",
        "proposed_path_ref": "path_wiki_safe_demo",
        "safe_title": "Safe wiki package title",
        "safe_slug": "safe-wiki-package-title",
        "path_policy_ref": "policy_no_raw_path_projection",
        "created_by": "agent_nas_keeper",
        "created_at": "2026-05-16T04:08:00Z",
    }


def test_validate_nas_path_resolution_accepts_safe_payload_without_runtime():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_path_resolution

    result = validate_office_controlled_mutation_nas_path_resolution(safe_payload())

    assert result["valid"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["schema_version"] == 1
    assert dto["mode"] == "validated_nas_path_resolution"
    assert dto["path_resolution_ref"] == "pathres_20260516_demo"
    assert dto["safe_slug"] == "safe-wiki-package-title"
    assert dto["capabilities"] == {
        "validation_enabled": True,
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
        "storage_write_enabled": False,
        "credential_access_enabled": False,
        "audit_write_enabled": False,
        "event_append_enabled": False,
        "target_mutation_enabled": False,
        "authority_binding_enabled": False,
        "dry_run_execution_enabled": False,
    }


def test_validate_nas_path_resolution_rejects_raw_paths_without_echo():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_path_resolution

    payload = safe_payload()
    payload.update(
        {
            "proposed_path_ref": "/Users/lidises/nas/private/wiki.md",
            "safe_title": "raw /mnt/nas/private title",
            "safe_slug": "../../private/wiki",
            "raw_path": "/Users/lidises/nas/private/wiki.md",
            "mount_command": "mount -t smbfs //user:pass@host/share /mnt/nas",
            "token": "sk-redacted-value",
        }
    )

    result = validate_office_controlled_mutation_nas_path_resolution(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    fields = {error["field"] for error in result["errors"]}
    assert "unsupported_fields" in fields
    assert "proposed_path_ref" in fields
    assert "safe_title" in fields
    assert "safe_slug" in fields
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "mount -t" not in serialized
    assert "sk-redacted" not in serialized


def test_validate_nas_path_resolution_requires_fields_and_types():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_path_resolution

    payload = safe_payload()
    del payload["path_policy_ref"]
    payload["created_at"] = "not-a-timestamp"
    payload["safe_slug"] = "Not Safe Slug"

    result = validate_office_controlled_mutation_nas_path_resolution(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert {tuple(error.items()) for error in result["errors"]} >= {
        (("field", "path_policy_ref"), ("code", "missing_field")),
        (("field", "created_at"), ("code", "invalid_timestamp")),
        (("field", "safe_slug"), ("code", "invalid_safe_slug")),
    }


def test_validate_nas_path_resolution_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.post("/api/office/controlled-mutation/nas-path-resolution/validate", json=safe_payload())

    assert resp.status_code == 401


def test_validate_nas_path_resolution_api_is_protected_validate_only_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-path-resolution/validate"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_payload())

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["dto"]["mode"] == "validated_nas_path_resolution"
    assert payload["dto"]["capabilities"]["validation_enabled"] is True
    assert payload["dto"]["capabilities"]["path_resolution_enabled"] is False
    assert payload["dto"]["capabilities"]["mount_access_enabled"] is False
    assert payload["dto"]["capabilities"]["filesystem_read_enabled"] is False
    assert payload["dto"]["capabilities"]["filesystem_write_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_write_enabled"] is False
    assert payload["dto"]["capabilities"]["credential_access_enabled"] is False


def test_validate_nas_path_resolution_api_does_not_create_schema_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    schema_route = "/api/office/controlled-mutation/nas-path-resolution/schema"

    for method in (client.post, client.put, client.patch):
        resp = method(schema_route, headers=headers, json=safe_payload())
        assert resp.status_code in {404, 405}
    resp = client.delete(schema_route, headers=headers)
    assert resp.status_code in {404, 405}
