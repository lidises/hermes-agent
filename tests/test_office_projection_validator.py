from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "ai_office" / "validate_office_projection.py"
EXAMPLE = ROOT / "tests" / "fixtures" / "office_projection" / "valid_bundle"


def run_validator(bundle_path: Path, *args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), *args, str(bundle_path)],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def valid_manifest() -> dict:
    return {
        "schema_version": "office_projection_manifest.v1",
        "bundle_id": "pcwb-safe-001",
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
            "summary": {"safe_item_count": 3, "attention_count": 0, "rooms": ["sources", "work"]},
        },
    }


def valid_payload() -> dict:
    return {
        "schema_version": "office_projection_payload.v1",
        "bundle_id": "pcwb-safe-001",
        "source_kind": "paperclip",
        "generated_at": "2026-05-12T07:15:00Z",
        "redacted": True,
        "items": [
            {"id": "manifest-card", "kind": "summary_card", "label": "검증된 매니페스트", "status": "ok", "count": 3}
        ],
        "summary": {"safe_item_count": 3, "attention_count": 0},
        "display": {"cards": ["manifests", "privateDashboard", "relayPosture"]},
    }


def write_bundle(tmp_path: Path, manifest: dict | None = None, payload: dict | None = None) -> Path:
    bundle = tmp_path / "bundle"
    bundle.mkdir()
    (bundle / "manifest.json").write_text(json.dumps(manifest or valid_manifest(), ensure_ascii=False), encoding="utf-8")
    (bundle / "payload.json").write_text(json.dumps(payload or valid_payload(), ensure_ascii=False), encoding="utf-8")
    return bundle


def test_valid_example_projection_bundle_passes() -> None:
    result = run_validator(EXAMPLE)

    assert result.returncode == 0, result.stderr + result.stdout
    assert "OK: safe Office projection bundle" in result.stdout


def test_valid_projection_bundle_passes(tmp_path: Path) -> None:
    bundle = write_bundle(tmp_path)

    result = run_validator(bundle)

    assert result.returncode == 0, result.stderr + result.stdout
    assert "OK: safe Office projection bundle" in result.stdout


def test_json_output_reports_safe_pass_result(tmp_path: Path) -> None:
    bundle = write_bundle(tmp_path)

    result = run_validator(bundle, "--json")

    assert result.returncode == 0, result.stderr + result.stdout
    report = json.loads(result.stdout)
    assert report == {
        "ok": True,
        "error_count": 0,
        "errors": [],
        "rejection": None,
    }


def test_json_output_reports_safe_rejection_metadata_without_echoing_values(tmp_path: Path) -> None:
    payload = valid_payload()
    payload["summary"]["note"] = "/Users/example/nas/private/raw/path token=abc123456789SECRET"
    bundle = write_bundle(tmp_path, payload=payload)

    result = run_validator(bundle, "--json")

    assert result.returncode != 0
    report = json.loads(result.stdout)
    assert report["ok"] is False
    assert report["error_count"] == 2
    assert report["errors"] == [
        {"field_path": "payload.summary.note", "category": "private path pattern"},
        {"field_path": "payload.summary.note", "category": "secret-like value"},
    ]
    assert report["rejection"] == {
        "status": "rejected",
        "reason_count": 2,
        "reasons": ["private path pattern", "secret-like value"],
        "field_paths": ["payload.summary.note"],
    }
    assert "/Users/example" not in result.stdout
    assert "abc123456789SECRET" not in result.stdout
    assert result.stderr == ""


def test_raw_excluded_must_be_true(tmp_path: Path) -> None:
    manifest = valid_manifest()
    manifest["redaction"]["raw_excluded"] = False
    bundle = write_bundle(tmp_path, manifest=manifest)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "manifest.redaction.raw_excluded" in result.stderr
    assert "must be true" in result.stderr


def test_unknown_generated_by_and_source_kind_fail(tmp_path: Path) -> None:
    manifest = valid_manifest()
    manifest["generated_by"] = "nas"
    manifest["source_kind"] = "raw_export"
    bundle = write_bundle(tmp_path, manifest=manifest)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "manifest.generated_by" in result.stderr
    assert "manifest.source_kind" in result.stderr


def test_private_paths_and_token_values_fail_without_echoing_values(tmp_path: Path) -> None:
    payload = valid_payload()
    payload["summary"]["note"] = "/Users/example/nas/private/raw/path token=abc123456789SECRET"
    bundle = write_bundle(tmp_path, payload=payload)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "payload.summary.note" in result.stderr
    assert "private path pattern" in result.stderr
    assert "secret-like value" in result.stderr
    assert "/Users/example" not in result.stderr
    assert "abc123456789SECRET" not in result.stderr


def test_payload_must_match_manifest_identity(tmp_path: Path) -> None:
    payload = valid_payload()
    payload["bundle_id"] = "different-safe-id"
    bundle = write_bundle(tmp_path, payload=payload)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "payload.bundle_id" in result.stderr
    assert "must match manifest.bundle_id" in result.stderr


def test_validator_safe_summary_is_bounded_and_screened(tmp_path: Path) -> None:
    manifest = valid_manifest()
    manifest["validator"]["safe_summary"] = "x" * 241
    bundle = write_bundle(tmp_path, manifest=manifest)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "manifest.validator.safe_summary" in result.stderr
    assert "too long" in result.stderr


def test_projection_payload_items_are_bounded(tmp_path: Path) -> None:
    payload = valid_payload()
    payload["items"] = [
        {"id": f"item-{index}", "kind": "summary_card", "label": "safe", "status": "ok"}
        for index in range(101)
    ]
    bundle = write_bundle(tmp_path, payload=payload)

    result = run_validator(bundle)

    assert result.returncode != 0
    assert "payload.items" in result.stderr
    assert "too many items" in result.stderr
