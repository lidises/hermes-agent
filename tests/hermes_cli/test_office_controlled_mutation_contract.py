"""RED tests for the AI Office controlled mutation approval boundary.

These tests intentionally define the next backend/schema/API boundary before
production implementation. They must fail until the controlled-mutation contract
module and protected schema route are implemented.
"""

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


def test_controlled_mutation_contract_schema_is_safe_and_non_executable():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_contract_schema

    payload = build_office_controlled_mutation_contract_schema()

    assert payload["schema_version"] == 1
    assert payload["mode"] == "contract_only"
    assert payload["authority_levels"] == [
        "display_only",
        "request_only",
        "dry_run_only",
        "human_approved_execute",
        "break_glass_admin",
    ]
    assert payload["allowed_action_kinds"] == [
        "kanban_transition",
        "kanban_comment",
        "projection_promote",
        "projection_reject",
        "nas_save_request",
        "watcher_enable_request",
        "service_restart_request",
    ]
    assert payload["event_kinds"] == [
        "action_requested",
        "dry_run_completed",
        "human_decision_recorded",
        "execution_started",
        "execution_completed",
        "execution_blocked",
    ]
    assert payload["capabilities"] == {
        "request_creation_enabled": False,
        "dry_run_execution_enabled": False,
        "human_decision_recording_enabled": False,
        "authority_adapter_enabled": False,
        "target_mutation_enabled": False,
        "audit_write_enabled": False,
        "nas_save_enabled": False,
    }
    assert payload["redaction"] == {
        "raw_excluded": True,
        "allowlisted_fields_only": True,
        "opaque_refs_only": True,
    }
    assert "mutation_endpoints" not in payload or payload["mutation_endpoints"] == []


def test_controlled_mutation_contract_schema_rejects_raw_material():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_contract_schema

    payload = build_office_controlled_mutation_contract_schema(
        unsafe_examples={
            "prompt": "raw user instruction prompt must not leak",
            "task_body": "raw task body must not leak",
            "transcript": "Traceback private transcript must not leak",
            "path": "/Users/lidises/private/ai-office.md",
            "provider": "private-provider-id",
            "token": "sk-controlled-mutation-red-test",
        }
    )

    serialized = str(payload).lower()
    assert "raw user instruction" not in serialized
    assert "raw task body" not in serialized
    assert "traceback" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "sk-controlled" not in serialized
    assert "token" not in serialized


def test_controlled_mutation_schema_api_requires_dashboard_session_token():
    from hermes_cli.web_server import app

    unauth_client = TestClient(app)
    resp = unauth_client.get("/api/office/controlled-mutation/schema")

    assert resp.status_code == 401


def test_controlled_mutation_schema_api_is_protected_contract_only_route():
    from hermes_cli.web_server import app, _PUBLIC_API_PATHS, _SESSION_HEADER_NAME, _SESSION_TOKEN

    assert "/api/office/controlled-mutation/schema" not in _PUBLIC_API_PATHS
    assert not "/api/office/controlled-mutation/schema".startswith("/api/plugins/")

    client = TestClient(app)
    resp = client.get(
        "/api/office/controlled-mutation/schema",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )

    assert resp.status_code == 200
    assert resp.headers.get("content-type", "").startswith("application/json")
    payload = resp.json()
    assert payload["schema_version"] == 1
    assert payload["mode"] == "contract_only"
    assert payload["capabilities"]["request_creation_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False
    assert payload["capabilities"]["audit_write_enabled"] is False
    assert payload["capabilities"]["nas_save_enabled"] is False
    assert payload["redaction"]["raw_excluded"] is True
    assert payload["redaction"]["allowlisted_fields_only"] is True
    assert "prompt" not in str(payload).lower()
    assert "transcript" not in str(payload).lower()
    assert "provider" not in str(payload).lower()
    assert "token" not in str(payload).lower()


def test_controlled_mutation_schema_api_rejects_common_mutation_methods():
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    client = TestClient(app)
    headers = {_SESSION_HEADER_NAME: _SESSION_TOKEN}

    for method in (client.post, client.put, client.patch, client.delete):
        resp = method("/api/office/controlled-mutation/schema", headers=headers)
        assert resp.status_code in {404, 405}
