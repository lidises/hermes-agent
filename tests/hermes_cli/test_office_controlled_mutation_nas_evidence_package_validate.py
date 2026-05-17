"""Tests for validate-only NAS evidence package DTO boundary."""

import pytest


@pytest.fixture
def safe_nas_evidence_package_payload():
    return {
        "package_ref": "pkg_20260516_demo",
        "preparation_ref": "prep_20260516_demo",
        "request_ref": "request:req_20260516_demo",
        "decision_ref": "decision:dec_20260516_demo",
        "source_manifest_refs": ["manifest:source_tag_demo", "manifest:projection_cache_demo"],
        "review_evidence_refs": ["review:search_worker_demo", "review:wiki_writer_demo"],
        "wiki_draft_ref": "wiki_draft:article_demo",
        "target_vault_ref": "vault:personal_wiki_demo",
        "proposed_path_ref": "path:wiki_article_demo",
        "safe_title": "Safe evidence package title",
        "safe_summary": "Validate a safe NAS evidence package without resolving or writing paths.",
        "rollback_plan_ref": "rollback:plan_demo",
        "created_by": "actor:nas_keeper",
        "created_at": "2026-05-16T03:17:00Z",
    }


def test_nas_evidence_package_validation_accepts_safe_allowlisted_payload(safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_evidence_package

    result = validate_office_controlled_mutation_nas_evidence_package(safe_nas_evidence_package_payload)

    assert result["valid"] is True
    assert result["errors"] == []
    assert result["dto"] == {
        "schema_version": 1,
        "mode": "validated_nas_evidence_package",
        **safe_nas_evidence_package_payload,
        "capabilities": {
            "validation_enabled": True,
            "package_creation_enabled": False,
            "package_persistence_enabled": False,
            "evidence_persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
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


def test_nas_evidence_package_validation_rejects_raw_or_unallowlisted_fields_without_echo(safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_evidence_package

    payload = {
        **safe_nas_evidence_package_payload,
        "prompt": "raw prompt must not echo",
        "task_body": "raw task body must not echo",
        "transcript": "Traceback private transcript must not echo",
        "nas_path": "/Users/lidises/nas/private/wiki.md",
        "linux_mount_path": "/mnt/nas/private/wiki.md",
        "provider": "private-provider-id",
        "token": "sk-redacted-token-shaped-value",
        "credential": "credential material must not echo",
        "reviewer_comment": "raw reviewer comment must not echo",
    }

    result = validate_office_controlled_mutation_nas_evidence_package(payload)

    assert result == {"valid": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    serialized = str(result).lower()
    assert "raw prompt" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "/mnt/nas" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-redacted" not in serialized
    assert "credential material" not in serialized
    assert "raw reviewer comment" not in serialized
    assert "prompt" not in serialized
    assert "provider" not in serialized


def test_nas_evidence_package_validation_rejects_path_like_or_credential_like_allowlisted_values(safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_evidence_package

    payload = {
        **safe_nas_evidence_package_payload,
        "package_ref": "../bad",
        "proposed_path_ref": "/Users/lidises/nas/private/wiki.md",
        "safe_summary": "password hunter2 should not echo",
        "source_manifest_refs": ["manifest:ok", "token:sk-redacted-token-shaped-value"],
        "review_evidence_refs": ["review:ok", "auth:hunter2"],
    }

    result = validate_office_controlled_mutation_nas_evidence_package(payload)

    assert result["valid"] is False
    assert result["dto"] is None
    assert result["errors"] == [
        {"field": "package_ref", "code": "invalid_opaque_id"},
        {"field": "proposed_path_ref", "code": "invalid_opaque_ref"},
        {"field": "review_evidence_refs", "code": "invalid_opaque_ref"},
        {"field": "safe_summary", "code": "invalid_safe_text"},
        {"field": "source_manifest_refs", "code": "invalid_opaque_ref"},
    ]
    serialized = str(result).lower()
    assert "/users/lidises" not in serialized
    assert "hunter2" not in serialized
    assert "sk-redacted" not in serialized


def test_nas_evidence_package_validation_rejects_malformed_top_level_payloads():
    from hermes_cli.office_controlled_mutation import validate_office_controlled_mutation_nas_evidence_package

    expected = {"valid": False, "errors": [{"field": "payload", "code": "invalid_payload_type"}], "dto": None}
    for payload in (None, [], "raw prompt must not echo", 7):
        assert validate_office_controlled_mutation_nas_evidence_package(payload) == expected


def test_nas_evidence_package_validate_api_requires_dashboard_session_token(safe_nas_evidence_package_payload):
    pytest.importorskip("fastapi")
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    client = TestClient(app)
    resp = client.post("/api/office/controlled-mutation/nas-evidence-package/validate", json=safe_nas_evidence_package_payload)

    assert resp.status_code == 401


def test_nas_evidence_package_validate_api_is_protected_validate_only_route(safe_nas_evidence_package_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/nas-evidence-package/validate"
    assert route not in _PUBLIC_API_PATHS
    assert not route.startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_nas_evidence_package_payload)

    assert resp.status_code == 200
    payload = resp.json()
    assert payload["valid"] is True
    assert payload["dto"]["mode"] == "validated_nas_evidence_package"
    assert payload["dto"]["capabilities"]["validation_enabled"] is True
    assert payload["dto"]["capabilities"]["package_persistence_enabled"] is False
    assert payload["dto"]["capabilities"]["evidence_persistence_enabled"] is False
    assert payload["dto"]["capabilities"]["storage_write_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_path_resolution_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_mount_access_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_save_enabled"] is False
    assert payload["dto"]["capabilities"]["nas_write_enabled"] is False


def test_nas_evidence_package_validate_api_rejects_raw_values_without_echo(safe_nas_evidence_package_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/nas-evidence-package/validate",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_nas_evidence_package_payload,
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


def test_nas_evidence_package_validate_api_handles_non_object_json_without_echo():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-evidence-package/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    expected = {"valid": False, "errors": [{"field": "payload", "code": "invalid_payload_type"}], "dto": None}
    for payload in (None, ["/Users/lidises/nas/private/wiki.md"], "raw prompt must not echo", 7):
        resp = client.post(route, headers=headers, json=payload)
        assert resp.status_code == 200
        assert resp.json() == expected
        serialized = str(resp.json()).lower()
        assert "/users/lidises" not in serialized
        assert "raw prompt" not in serialized


def test_nas_evidence_package_validate_api_rejects_non_validate_methods(safe_nas_evidence_package_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-evidence-package/validate"
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}
    for method in (client.put, client.patch, client.delete):
        resp = method(route, headers=headers)
        assert resp.status_code in {404, 405}
