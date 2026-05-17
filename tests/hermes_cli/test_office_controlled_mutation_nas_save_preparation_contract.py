"""RED tests for AI Office controlled-mutation NAS save/write preparation boundary.

These tests intentionally define the next NAS preparation contract before
production implementation. They must fail until the non-writing helper and
protected schema route are separately approved and implemented.
"""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def test_nas_save_preparation_contract_is_prepare_only_and_non_writing():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_save_preparation_contract

    contract = build_office_controlled_mutation_nas_save_preparation_contract()

    assert contract == {
        "schema_version": 1,
        "mode": "nas_save_preparation_contract_only",
        "required_preparation_fields": [
            "preparation_ref",
            "request_ref",
            "decision_ref",
            "source_manifest_ref",
            "target_vault_ref",
            "proposed_path_ref",
            "safe_title",
            "safe_summary",
            "evidence_refs",
            "rollback_plan_ref",
            "requested_by",
            "requested_at",
        ],
        "allowed_write_policies": ["prepare_only", "human_approved_later"],
        "preparation": {
            "contract_enabled": True,
            "nas_write_preparation_enabled": False,
            "nas_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "evidence_package_persistence_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "authority_binding_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
        },
        "preparation_endpoints": [],
        "storage_endpoints": [],
        "nas_endpoints": [],
        "contract_notes": [
            "contract describes future NAS save/write preparation shape only; no NAS path is resolved and no NAS write is prepared",
            "actual NAS write preparation, path resolution, evidence package persistence, rollback point creation, and NAS save require separate approval",
        ],
    }


def test_nas_save_preparation_contract_ignores_raw_nas_material():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_nas_save_preparation_contract

    contract = build_office_controlled_mutation_nas_save_preparation_contract(
        unsafe_examples={
            "prompt": "raw prompt must not echo",
            "task_body": "raw task body must not echo",
            "transcript": "Traceback private transcript must not echo",
            "nas_path": "/Users/lidises/nas/private/wiki.md",
            "linux_mount_path": "/mnt/nas/private/wiki.md",
            "source_body": "raw source body must not echo",
            "provider": "private-provider-id",
            "token": "sk-redacted-test",
            "credential": "credential material must not echo",
        }
    )

    serialized = str(contract).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "raw source body" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-redacted" not in serialized
    assert "credential material" not in serialized


def test_nas_save_preparation_schema_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.get("/api/office/controlled-mutation/nas-save-preparation/schema")

    assert resp.status_code == 401


def test_nas_save_preparation_schema_api_is_protected_contract_only_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-save-preparation/schema"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})

    assert resp.status_code == 200
    assert resp.headers.get("content-type", "").startswith("application/json")
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "nas_save_preparation_contract_only"
    assert payload["capabilities"]["nas_save_preparation_enabled"] is False
    assert payload["capabilities"]["nas_save_enabled"] is False
    assert payload["capabilities"]["nas_write_enabled"] is False
    assert payload["capabilities"]["credential_access_enabled"] is False
    assert payload["redaction"]["raw_excluded"] is True


def test_nas_save_preparation_schema_api_rejects_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    route = "/api/office/controlled-mutation/nas-save-preparation/schema"

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method(route, headers=headers)
        assert resp.status_code in {404, 405}
