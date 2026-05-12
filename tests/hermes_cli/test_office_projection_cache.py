from __future__ import annotations

import json
from pathlib import Path


def valid_manifest(bundle_id: str = "pcwb-safe-001") -> dict:
    return {
        "schema_version": "office_projection_manifest.v1",
        "bundle_id": bundle_id,
        "generated_at": "2026-05-12T07:15:00Z",
        "generated_by": "mac",
        "source_kind": "paperclip",
        "source_tags": ["paperclip", "clinic-growth", "safe-manifest"],
        "freshness": {
            "valid_for_seconds": 86400,
            "stale_after": "2026-05-13T07:15:00Z",
            "hard_expire_after": "2026-05-19T07:15:00Z",
            "policy": "show-last-known-good-with-stale-label",
        },
        "redaction": {
            "guarantee": "raw_excluded_and_allowlisted_fields_only",
            "raw_excluded": True,
            "excluded_classes": ["prompts", "transcripts", "task_bodies", "logs", "credentials", "tokens"],
        },
        "validator": {
            "name": "office_projection_validator",
            "version": "v1",
            "result": "pass",
            "checked_at": "2026-05-12T07:15:05Z",
            "safe_summary": "3 safe display cards, 0 raw fields, 0 secret sentinels",
        },
        "payload": {
            "file": "payload.json",
            "content_type": "application/json",
            "summary": {"safe_item_count": 1, "attention_count": 0, "rooms": ["sources", "work"]},
        },
    }


def valid_payload(bundle_id: str = "pcwb-safe-001") -> dict:
    return {
        "schema_version": "office_projection_payload.v1",
        "bundle_id": bundle_id,
        "source_kind": "paperclip",
        "generated_at": "2026-05-12T07:15:00Z",
        "redacted": True,
        "items": [
            {"id": "manifest-card", "kind": "summary_card", "label": "검증된 매니페스트", "status": "ok", "count": 3}
        ],
        "summary": {"safe_item_count": 1, "attention_count": 0},
        "display": {"cards": ["manifests", "privateDashboard", "relayPosture"]},
    }


def write_bundle(root: Path, bundle_id: str = "pcwb-safe-001") -> Path:
    bundle = root / bundle_id
    bundle.mkdir(parents=True)
    (bundle / "manifest.json").write_text(json.dumps(valid_manifest(bundle_id), ensure_ascii=False), encoding="utf-8")
    (bundle / "payload.json").write_text(json.dumps(valid_payload(bundle_id), ensure_ascii=False), encoding="utf-8")
    return bundle


def test_read_active_projection_reports_missing_without_cache(tmp_path, monkeypatch):
    monkeypatch.setenv("HERMES_HOME", str(tmp_path / "hermes"))

    from hermes_cli.office_projection import read_office_projection_cache

    projection = read_office_projection_cache()

    assert projection["status"] == "missing"
    assert projection["active"] is None
    assert projection["rejected"] == {"count": 0, "recent": []}
    assert projection["redacted"] is True


def test_read_active_projection_returns_safe_last_known_good(tmp_path, monkeypatch):
    home = tmp_path / "hermes"
    monkeypatch.setenv("HERMES_HOME", str(home))
    active_bundle = write_bundle(home / "office" / "projections" / "active", "pcwb-safe-001")

    from hermes_cli.office_projection import read_office_projection_cache

    projection = read_office_projection_cache()

    assert projection["status"] == "active"
    assert projection["active"]["bundle_id"] == "pcwb-safe-001"
    assert projection["active"]["generated_by"] == "mac"
    assert projection["active"]["source_kind"] == "paperclip"
    assert projection["active"]["source_tags"] == ["paperclip", "clinic-growth", "safe-manifest"]
    assert projection["active"]["payload_summary"] == {"safe_item_count": 1, "attention_count": 0}
    assert projection["active"]["display"] == {"cards": ["manifests", "privateDashboard", "relayPosture"]}
    assert projection["active"]["bundle_path"] == active_bundle.name
    assert json.dumps(projection, ensure_ascii=False).find(str(home)) == -1


def test_ingest_promotes_valid_bundle_and_preserves_safe_rejection_metadata(tmp_path, monkeypatch):
    home = tmp_path / "hermes"
    monkeypatch.setenv("HERMES_HOME", str(home))
    incoming = home / "office" / "projections" / "incoming"
    valid = write_bundle(incoming, "pcwb-safe-001")
    invalid = write_bundle(incoming, "pcwb-safe-raw")
    payload = valid_payload("pcwb-safe-raw")
    payload["summary"]["note"] = "/Users/example/raw token=abc123456789SECRET"
    (invalid / "payload.json").write_text(json.dumps(payload), encoding="utf-8")

    from hermes_cli.office_projection import ingest_office_projection_bundle, read_office_projection_cache

    promoted = ingest_office_projection_bundle(valid)
    rejected = ingest_office_projection_bundle(invalid)
    projection = read_office_projection_cache()

    assert promoted["status"] == "promoted"
    assert rejected["status"] == "rejected"
    assert projection["status"] == "active"
    assert projection["active"]["bundle_id"] == "pcwb-safe-001"
    assert projection["rejected"]["count"] == 1
    rejection_json = json.dumps(projection["rejected"], ensure_ascii=False)
    assert "private path pattern" in rejection_json
    assert "secret-like value" in rejection_json
    assert "/Users/example" not in rejection_json
    assert "abc123456789SECRET" not in rejection_json
