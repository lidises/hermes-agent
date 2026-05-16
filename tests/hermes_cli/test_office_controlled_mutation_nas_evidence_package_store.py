"""Tests for local metadata-only NAS evidence package store/readback boundary."""

import json

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
        "safe_summary": "Store safe evidence metadata only without NAS path access.",
        "rollback_plan_ref": "rollback:plan_demo",
        "created_by": "actor:nas_keeper",
        "created_at": "2026-05-16T03:17:00Z",
    }


def test_nas_evidence_package_append_and_readback_records_safe_dto_only(tmp_path, safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_evidence_package_event,
        list_office_controlled_mutation_nas_evidence_package_events,
    )

    store_path = tmp_path / "nas-evidence-packages.jsonl"
    raw_result = append_office_controlled_mutation_nas_evidence_package_event(
        {**safe_nas_evidence_package_payload, "prompt": "raw prompt must not echo"}, store_path=store_path
    )

    assert raw_result == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not store_path.exists()

    stored = append_office_controlled_mutation_nas_evidence_package_event(
        safe_nas_evidence_package_payload, store_path=store_path
    )

    assert stored["stored"] is True
    assert stored["errors"] == []
    assert stored["dto"]["mode"] == "validated_nas_evidence_package"
    assert stored["dto"]["capabilities"]["package_persistence_enabled"] is True
    assert stored["dto"]["capabilities"]["evidence_persistence_enabled"] is False
    assert stored["dto"]["capabilities"]["storage_write_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_path_resolution_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_mount_access_enabled"] is False
    assert stored["dto"]["capabilities"]["nas_save_enabled"] is False
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = list_office_controlled_mutation_nas_evidence_package_events(store_path=store_path)
    assert readback["count"] == 1
    assert readback["events"] == [stored["dto"]]
    assert readback["capabilities"]["package_readback_enabled"] is True
    assert readback["capabilities"]["nas_path_resolution_enabled"] is False
    assert readback["capabilities"]["nas_mount_access_enabled"] is False
    assert readback["capabilities"]["nas_write_enabled"] is False


def test_nas_evidence_package_append_rejects_duplicates_without_second_write(tmp_path, safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import append_office_controlled_mutation_nas_evidence_package_event

    store_path = tmp_path / "nas-evidence-packages.jsonl"
    first = append_office_controlled_mutation_nas_evidence_package_event(
        safe_nas_evidence_package_payload, store_path=store_path
    )
    duplicate = append_office_controlled_mutation_nas_evidence_package_event(
        {**safe_nas_evidence_package_payload, "safe_summary": "Duplicate package must not write."},
        store_path=store_path,
    )

    assert first["stored"] is True
    assert duplicate == {
        "stored": False,
        "errors": [{"field": "package_ref", "code": "duplicate_package_ref"}],
        "dto": None,
    }
    assert store_path.read_text(encoding="utf-8").count("\n") == 1


def test_nas_evidence_package_readback_filters_and_skips_malformed_without_raw_echo(tmp_path, safe_nas_evidence_package_payload):
    from hermes_cli.office_controlled_mutation import (
        append_office_controlled_mutation_nas_evidence_package_event,
        list_office_controlled_mutation_nas_evidence_package_events,
    )

    store_path = tmp_path / "nas-evidence-packages.jsonl"
    append_office_controlled_mutation_nas_evidence_package_event(safe_nas_evidence_package_payload, store_path=store_path)
    append_office_controlled_mutation_nas_evidence_package_event(
        {**safe_nas_evidence_package_payload, "package_ref": "pkg_20260516_other", "request_ref": "request:req_20260516_other"},
        store_path=store_path,
    )
    with store_path.open("a", encoding="utf-8") as handle:
        handle.write('{"prompt":"raw prompt must not echo","path":"/Users/lidises/nas/private/wiki.md"}\n')
        handle.write("not-json with /Users/lidises/nas/private/wiki.md\n")

    result = list_office_controlled_mutation_nas_evidence_package_events(
        store_path=store_path,
        request_ref=safe_nas_evidence_package_payload["request_ref"],
        limit=999,
    )

    assert result["limit"] == 200
    assert result["count"] == 1
    assert result["skipped_count"] == 2
    assert result["request_ref"] == safe_nas_evidence_package_payload["request_ref"]
    assert result["events"][0]["package_ref"] == safe_nas_evidence_package_payload["package_ref"]
    serialized = json.dumps(result, sort_keys=True).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized


def test_nas_evidence_package_api_is_protected_records_and_reads_under_hermes_home(monkeypatch, tmp_path, safe_nas_evidence_package_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    route = "/api/office/controlled-mutation/nas-evidence-package"

    unauthenticated = client.post(route, json=safe_nas_evidence_package_payload)
    assert unauthenticated.status_code == 401

    stored = client.post(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN}, json=safe_nas_evidence_package_payload)
    assert stored.status_code == 200
    body = stored.json()
    assert body["stored"] is True
    assert body["dto"]["capabilities"]["package_persistence_enabled"] is True
    assert body["dto"]["capabilities"]["nas_path_resolution_enabled"] is False
    assert body["dto"]["capabilities"]["nas_mount_access_enabled"] is False

    store_path = tmp_path / "office" / "controlled-mutation" / "nas-evidence-packages.jsonl"
    assert store_path.exists()
    assert store_path.read_text(encoding="utf-8").count("\n") == 1

    readback = client.get(
        f"/api/office/controlled-mutation/nas-evidence-packages?request_ref={safe_nas_evidence_package_payload['request_ref']}&limit=999",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
    )
    assert readback.status_code == 200
    payload = readback.json()
    assert payload["limit"] == 200
    assert payload["count"] == 1
    assert payload["events"][0]["package_ref"] == safe_nas_evidence_package_payload["package_ref"]
    assert payload["capabilities"]["nas_write_enabled"] is False


def test_nas_evidence_package_api_rejects_raw_without_write_or_echo(monkeypatch, tmp_path, safe_nas_evidence_package_payload):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)
    resp = client.post(
        "/api/office/controlled-mutation/nas-evidence-package",
        headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
        json={
            **safe_nas_evidence_package_payload,
            "prompt": "raw prompt must not echo",
            "path": "/Users/lidises/nas/private/wiki.md",
            "provider": "private-provider-id",
        },
    )

    assert resp.status_code == 200
    body = resp.json()
    assert body == {"stored": False, "errors": [{"field": "unsupported_fields", "code": "unsupported_field"}], "dto": None}
    assert not (tmp_path / "office" / "controlled-mutation" / "nas-evidence-packages.jsonl").exists()
    serialized = str(body).lower()
    assert "raw prompt" not in serialized
    assert "/users/lidises" not in serialized
    assert "private-provider-id" not in serialized


def test_nas_evidence_package_readback_api_requires_dashboard_session_token(monkeypatch, tmp_path):
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app

    monkeypatch.setenv("HERMES_HOME", str(tmp_path))
    client = TestClient(app)

    resp = client.get("/api/office/controlled-mutation/nas-evidence-packages")

    assert resp.status_code == 401
