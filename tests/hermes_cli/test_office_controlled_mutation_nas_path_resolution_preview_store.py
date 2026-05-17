"""Tests for local metadata-only NAS path preview store/readback boundary."""

import json

import pytest

fastapi = pytest.importorskip("fastapi")
from starlette.testclient import TestClient


@pytest.fixture
def safe_nas_path_preview_payload():
    return {
        "path_resolution_ref": "path_resolution_20260516_demo",
        "package_ref": "pkg_20260516_demo",
        "target_vault_ref": "vault_personal_wiki_demo",
        "proposed_path_ref": "path_wiki_article_demo",
        "safe_title": "Safe path preview title",
        "safe_slug": "safe-path-preview-demo",
        "path_policy_ref": "policy_no_raw_path_projection",
        "created_by": "agent_nas_keeper",
        "created_at": "2026-05-16T13:50:00Z",
    }


def test_nas_path_preview_append_and_readback_records_safe_preview_only(tmp_path, safe_nas_path_preview_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_path_resolution_preview_event,
        list_office_controlled_mutation_nas_path_resolution_preview_events,
    )

    store_path = tmp_path / "nas-path-resolution-previews.jsonl"
    raw_result = append_office_controlled_mutation_nas_path_resolution_preview_event(
        {**safe_nas_path_preview_payload, "raw_path": "/Users/lidises/nas/private/wiki.md"}, store_path=store_path
    )

    assert raw_result == {
        "stored": False,
        "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}],
        "dto": None,
    }
    assert not store_path.exists()

    stored = append_office_controlled_mutation_nas_path_resolution_preview_event(
        safe_nas_path_preview_payload, store_path=store_path
    )

    assert stored["stored"] is True
    assert stored["errors"] == []
    assert stored["dto"]["mode"] == "previewed_nas_path_resolution"
    assert stored["dto"]["safe_logical_path"] == "vault_personal_wiki_demo::safe-path-preview-demo.md"
    assert stored["dto"]["path_preview"]["raw_path_material_included"] is False
    capabilities = stored["dto"]["capabilities"]
    assert capabilities["validation_enabled"] is True
    assert capabilities["path_resolution_preview_enabled"] is True
    assert capabilities["path_preview_persistence_enabled"] is True
    assert capabilities["path_preview_readback_enabled"] is False
    assert capabilities["path_resolution_runtime_enabled"] is False
    assert capabilities["vault_mapping_enabled"] is False
    assert capabilities["mount_discovery_enabled"] is False
    assert capabilities["mount_access_enabled"] is False
    assert capabilities["filesystem_read_enabled"] is False
    assert capabilities["filesystem_write_enabled"] is False
    assert capabilities["nas_write_enabled"] is False
    assert capabilities["storage_write_enabled"] is False
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_nas_path_resolution_preview_events(store_path=store_path)
    assert readback["mode"] == "stored_nas_path_resolution_previews_readback"
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["path_preview_readback_enabled"] is True
    assert readback["capabilities"]["path_resolution_runtime_enabled"] is False
    assert readback["capabilities"]["mount_access_enabled"] is False
    assert readback["capabilities"]["filesystem_read_enabled"] is False
    assert readback["capabilities"]["filesystem_write_enabled"] is False
    assert readback["capabilities"]["nas_write_enabled"] is False


def test_nas_path_preview_append_rejects_duplicate_safe_logical_path_without_second_write(
    tmp_path, safe_nas_path_preview_payload
):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_path_resolution_preview_event

    store_path = tmp_path / "nas-path-resolution-previews.jsonl"
    first = append_office_controlled_mutation_nas_path_resolution_preview_event(
        safe_nas_path_preview_payload, store_path=store_path
    )
    duplicate = append_office_controlled_mutation_nas_path_resolution_preview_event(
        {**safe_nas_path_preview_payload, "safe_title": "Duplicate preview must not write."},
        store_path=store_path,
    )

    assert first["stored"] is True
    assert duplicate == {
        "stored": False,
        "errors": [{"field": "safe_logical_path", "code": "duplicate_safe_logical_path"}],
        "dto": None,
    }
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_nas_path_preview_readback_filters_and_skips_malformed_without_raw_echo(
    tmp_path, safe_nas_path_preview_payload
):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_path_resolution_preview_event,
        list_office_controlled_mutation_nas_path_resolution_preview_events,
    )

    store_path = tmp_path / "nas-path-resolution-previews.jsonl"
    append_office_controlled_mutation_nas_path_resolution_preview_event(
        safe_nas_path_preview_payload, store_path=store_path
    )
    append_office_controlled_mutation_nas_path_resolution_preview_event(
        {
            **safe_nas_path_preview_payload,
            "package_ref": "pkg_20260516_other",
            "safe_slug": "safe-other-path-preview",
        },
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write('{"prompt":"raw prompt must not echo","path":"/Users/lidises/nas/private/wiki.md"}\n')
        handle.write("not-json with /Users/lidises/nas/private/wiki.md\n")

    result = list_office_controlled_mutation_nas_path_resolution_preview_events(
        store_path=store_path,
        package_ref=safe_nas_path_preview_payload["package_ref"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["package_ref"] == safe_nas_path_preview_payload["package_ref"]
    assert result["events"][0]["safe_slug"] == safe_nas_path_preview_payload["safe_slug"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized


def test_nas_path_preview_api_is_protected_records_and_reads_under_hermes_home(
    monkeypatch, tmp_path, safe_nas_path_preview_payload
):
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-path-resolution/preview-store"

    unauthenticated = client.post(route, json=safe_nas_path_preview_payload)
    assert unauthenticated.status_code == 401

    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_nas_path_preview_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["path_preview_persistence_enabled"] is True
    assert body["dto"]["capabilities"]["path_resolution_runtime_enabled"] is False
    assert body["dto"]["capabilities"]["mount_access_enabled"] is False
    assert body["dto"]["capabilities"]["filesystem_write_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "nas-path-resolution-previews.jsonl"
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = client.get(
        f"/api/office/controlled-mutation/nas-path-resolution/previews?package_ref={safe_nas_path_preview_payload['package_ref']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["safe_slug"] == safe_nas_path_preview_payload["safe_slug"]
    assert payload["capabilities"]["nas_write_enabled"] is False


def test_nas_path_preview_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_nas_path_preview_payload):
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/nas-path-resolution/preview-store",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_nas_path_preview_payload,
            "raw_path": "/Users/lidises/nas/private/wiki.md",
            "provider": "private-provider-id",
            "token": "tok_1234567890abcdef",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {
        "stored": False,
        "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}],
        "dto": None,
    }
    assert not (tmp_path / "office" / "controlled-mutation" / "nas-path-resolution-previews.jsonl").exists()
    serialized = str(body).lower()
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized
    assert "tok_1234567890abcdef" not in serialized


def test_nas_path_preview_readback_rejects_invalid_filter_without_echo(tmp_path):
    from hermes_cli.office_controlled_mutation import list_office_controlled_mutation_nas_path_resolution_preview_events

    result = list_office_controlled_mutation_nas_path_resolution_preview_events(
        store_path=tmp_path / "nas-path-resolution-previews.jsonl",
        package_ref="/Users/lidises/nas/private/wiki.md",
    )

    assert result["count"] == 0
    assert result["errors"] == [{"field": "package_ref", "code": "invalid_opaque_id"}]
    assert result["package_ref"] is None
    assert "/users/lidises" not in json.dumps(result, sort_keys=True).lower()
