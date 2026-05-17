"""Tests for pure/local NAS path resolution preview boundary."""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def safe_payload():
    return {
        "path_resolution_ref": "pathres_20260516_preview",
        "package_ref": "pkg_20260516_preview",
        "target_vault_ref": "vault_personal_operating_wiki",
        "proposed_path_ref": "path_wiki_preview_demo",
        "safe_title": "Safe wiki package title",
        "safe_slug": "safe-wiki-package-title",
        "path_policy_ref": "policy_no_raw_path_projection",
        "created_by": "agent_nas_keeper",
        "created_at": "2026-05-16T13:40:00Z",
    }


def test_preview_nas_path_resolution_builds_safe_preview_without_filesystem_access():
    from hermes_cli.office_controlled_mutation import preview_office_controlled_mutation_nas_path_resolution

    result = preview_office_controlled_mutation_nas_path_resolution(safe_payload())

    assert result["valid"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["schema_version"] == 1
    assert dto["mode"] == "previewed_nas_path_resolution"
    assert dto["path_resolution_ref"] == "pathres_20260516_preview"
    assert dto["validated_mode"] == "validated_nas_path_resolution"
    assert dto["safe_logical_path"] == "vault_personal_operating_wiki::safe-wiki-package-title.md"
    assert dto["safe_display_path"] == "Personal Operating Wiki / safe-wiki-package-title.md"
    assert dto["path_preview"] == {
        "target_vault_ref": "vault_personal_operating_wiki",
        "proposed_path_ref": "path_wiki_preview_demo",
        "safe_slug": "safe-wiki-package-title",
        "extension": ".md",
        "raw_path_material_included": False,
    }
    assert dto["capabilities"] == {
        "validation_enabled": True,
        "path_resolution_preview_enabled": True,
        "path_resolution_runtime_enabled": False,
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


def test_preview_nas_path_resolution_rejects_invalid_payload_without_echo():
    from hermes_cli.office_controlled_mutation import preview_office_controlled_mutation_nas_path_resolution

    payload = safe_payload()
    payload.update(
        {
            "safe_slug": "../../secret",
            "target_vault_ref": "/Users/lidises/nas/private",
            "raw_path": "/mnt/nas/private/wiki.md",
            "mount_command": "mount -t smbfs //user:pass@host/share /mnt/nas",
            "token": "sk-redacted-preview",
        }
    )

    result = preview_office_controlled_mutation_nas_path_resolution(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    fields = {error["field"] for error in result["errors"]}
    assert "unsupported_fields" in fields
    assert "safe_slug" in fields
    assert "target_vault_ref" in fields
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "mount -t" not in serialized
    assert "sk-redacted-preview" not in serialized


def test_preview_nas_path_resolution_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.post("/api/office/controlled-mutation/nas-path-resolution/preview", json=safe_payload())

    assert resp.status_code == 401


def test_preview_nas_path_resolution_api_is_protected_preview_only_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-path-resolution/preview"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_payload())

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["dto"]["mode"] == "previewed_nas_path_resolution"
    assert payload["dto"]["safe_logical_path"] == "vault_personal_operating_wiki::safe-wiki-package-title.md"
    assert payload["dto"]["capabilities"]["path_resolution_preview_enabled"] is True
    assert payload["dto"]["capabilities"]["path_resolution_runtime_enabled"] is False
    assert payload["dto"]["capabilities"]["mount_access_enabled"] is False
    assert payload["dto"]["capabilities"]["filesystem_read_enabled"] is False
    assert payload["dto"]["capabilities"]["filesystem_write_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_write_enabled"] is False
    assert payload["dto"]["capabilities"]["credential_access_enabled"] is False


def test_preview_nas_path_resolution_does_not_add_persistence_or_readback_routes():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    resp = client.get("/api/office/controlled-mutation/nas-path-resolutions", headers=headers)
    assert resp.status_code in {200, 404, 405}
    assert "application/json" not in resp.headers.get("content-type", "")
    for method in (client.put, client.patch):
        resp = method("/api/office/controlled-mutation/nas-path-resolution/preview", headers=headers, json=safe_payload())
        assert resp.status_code in {404, 405}
    resp = client.delete("/api/office/controlled-mutation/nas-path-resolution/preview", headers=headers)
    assert resp.status_code in {404, 405}
