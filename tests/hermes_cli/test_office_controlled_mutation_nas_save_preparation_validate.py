"""Tests for validate-only NAS save/write preparation DTO boundary."""

import pytest


@pytest.fixture
def safe_nas_preparation_payload():
    return {
        "preparation_ref": "prep_20260516_demo",
        "request_ref": "request:req_20260516_demo",
        "decision_ref": "decision:dec_20260516_demo",
        "source_manifest_ref": "manifest:source_tag_demo",
        "target_vault_ref": "vault:personal_wiki_demo",
        "proposed_path_ref": "path:wiki_article_demo",
        "safe_title": "Safe wiki article title",
        "safe_summary": "Prepare a safe NAS Keeper save package without resolving paths.",
        "evidence_refs": ["paperclip:source_tag_demo", "projection:cache_demo"],
        "rollback_plan_ref": "rollback:plan_demo",
        "requested_by": "actor:user_boss",
        "requested_at": "2026-05-16T02:39:00Z",
    }


def test_nas_preparation_validation_accepts_safe_allowlisted_payload(safe_nas_preparation_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_save_preparation

    result = validate_office_controlled_mutation_nas_save_preparation(safe_nas_preparation_payload)

    assert result["valid"] is True
    assert result["errors"] == []
    assert result["dto"] == {
        "schema_version": 1,
        "mode": "validated_nas_save_preparation",
        **safe_nas_preparation_payload,
        "capabilities": {
            "validation_enabled": True,
            "request_creation_enabled": False,
            "persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "evidence_package_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
    }


def test_nas_preparation_validation_rejects_raw_or_unallowlisted_fields_without_echo(safe_nas_preparation_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_save_preparation

    payload = {
        **safe_nas_preparation_payload,
        "prompt": "raw prompt must not echo",
        "task_body": "raw task body must not echo",
        "transcript": "Traceback private transcript must not echo",
        "nas_path": "/Users/lidises/nas/private/wiki.md",
        "linux_mount_path": "/mnt/nas/private/wiki.md",
        "provider": "private-provider-id",
        "token": "***",
        "credential": "credential material must not echo",
    }

    result = validate_office_controlled_mutation_nas_save_preparation(payload)

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "private-provider-id" not in serialized
    assert "credential material" not in serialized
    assert "prompt" not in serialized
    assert "provider" not in serialized


def test_nas_preparation_validation_rejects_path_like_or_credential_like_allowlisted_values(safe_nas_preparation_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_save_preparation

    payload = {
        **safe_nas_preparation_payload,
        "preparation_ref": "../bad",
        "proposed_path_ref": "/Users/lidises/nas/private/wiki.md",
        "safe_summary": "password hunter2 should not echo",
        "evidence_refs": ["paperclip:ok", "auth:hunter2"],
    }

    result = validate_office_controlled_mutation_nas_save_preparation(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert result["errors"] == [
        {"field": "evidence_refs", "code": "invalid_opaque_ref"},
        {"field": "preparation_ref", "code": "invalid_opaque_id"},
        {"field": "proposed_path_ref", "code": "invalid_opaque_ref"},
        {"field": "safe_summary", "code": "invalid_safe_text"},
    ]
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "hunter2" not in serialized


def test_nas_preparation_validation_rejects_malformed_top_level_payloads():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_save_preparation

    expected = {"valid": False, "errors": [{"field": "payload", "code": "invalid_payload_type"}], "dto": None}
    for payload in (None, [], "raw prompt must not echo", 7):
        assert validate_office_controlled_mutation_nas_save_preparation(payload) == expected


def test_nas_preparation_validate_api_requires_dashboard_session_token(safe_nas_preparation_payload):
    pytest.importorskip("fastapi")
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    client = TestClient(app)
    resp = client.post("/api/office/controlled-mutation/nas-save-preparation/validate", json=safe_nas_preparation_payload)

    assert resp.status_code == 401


def test_nas_preparation_validate_api_is_protected_validate_only_route(safe_nas_preparation_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-save-preparation/validate"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_nas_preparation_payload)

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["dto"]["mode"] == "validated_nas_save_preparation"
    assert payload["dto"]["capabilities"]["validation_enabled"] is True
    assert payload["dto"]["capabilities"]["persistence_enabled"] is False
    assert payload["dto"]["capabilities"]["storage_write_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_path_resolution_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_mount_access_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_save_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_write_enabled"] is False


def test_nas_preparation_validate_api_rejects_raw_values_without_echo(safe_nas_preparation_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/nas-save-preparation/validate",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_nas_preparation_payload,
            "prompt": "raw prompt must not echo",
            "nas_path": "/Users/lidises/nas/private/wiki.md",
            "provider": "private-provider-id",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(body).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "prompt" not in serialized


def test_nas_preparation_validate_api_handles_non_object_json_without_echo():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-save-preparation/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    expected = {"valid": False, "errors": [{"field": "payload", "code": "invalid_payload_type"}], "dto": None}
    for payload in (None, ["/Users/lidises/nas/private/wiki.md"], "raw prompt must not echo", 7):
        resp = client.post(route, headers=headers, json=payload)
        assert resp.status_code == 200
        assert resp.json() == expected
        serialized = str(resp.json()).lower()
        assert "/users/lidises" not in serialized
        assert "raw prompt" not in serialized


def test_nas_preparation_validate_api_rejects_non_validate_methods(safe_nas_preparation_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-save-preparation/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    for method in (client.put, client.patch, client.delete):
        resp = method(route, headers=headers)
        assert resp.status_code in {404, 405}
