from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
GENERATOR = ROOT / "scripts" / "ai_office" / "generate_office_projection.py"
VALIDATOR = ROOT / "scripts" / "ai_office" / "validate_office_projection.py"


def run_generator(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(GENERATOR), *args],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def run_validator(bundle_path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(bundle_path)],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def write_paperclip_manifest(path: Path, **overrides: object) -> Path:
    manifest: dict[str, object] = {
        "schema_version": 1,
        "id": "paperclip:test-source",
        "label": "테스트 소스",
        "source_type": "paperclip",
        "relay": "MacBook",
        "status": "partial",
        "checked_at": "2026-05-12T07:15:00Z",
        "item_count": 4,
        "warning_count": 1,
        "tags": ["source:test-source"],
        "path_bucket": "macbook-local",
        "extension_buckets": {"markdown": 2, "pdf": 1, "image": 0, "other": 1},
        "provenance_summary": "dry-run metadata-only safe manifest",
        "redaction": {
            "policy_version": 1,
            "omitted_sections": ["raw_documents", "raw_paths", "file_bodies", "credentials"],
        },
    }
    manifest.update(overrides)
    path.write_text(yaml.safe_dump(manifest, sort_keys=False, allow_unicode=True), encoding="utf-8")
    return path


def test_projection_generator_creates_validator_passing_paperclip_bundle(tmp_path: Path) -> None:
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml")
    output_dir = tmp_path / "projection"

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "pcwb-safe-test-001",
        "--generated-by",
        "mac",
        "--output-dir",
        str(output_dir),
    )

    assert result.returncode == 0, result.stderr + result.stdout
    assert "OK: wrote safe Office projection bundle" in result.stdout
    assert str(tmp_path) not in result.stdout
    validation = run_validator(output_dir)
    assert validation.returncode == 0, validation.stderr + validation.stdout

    manifest = json.loads((output_dir / "manifest.json").read_text(encoding="utf-8"))
    payload = json.loads((output_dir / "payload.json").read_text(encoding="utf-8"))
    assert manifest["bundle_id"] == "pcwb-safe-test-001"
    assert manifest["generated_by"] == "mac"
    assert manifest["source_kind"] == "paperclip"
    assert manifest["source_tags"] == ["test-source", "paperclip", "safe-manifest"]
    assert manifest["redaction"]["raw_excluded"] is True
    assert payload["summary"] == {"safe_item_count": 1, "attention_count": 1, "rooms": ["sources", "work"]}
    assert payload["display"]["cards"] == ["manifests", "privateDashboard", "relayPosture"]
    serialized = json.dumps({"manifest": manifest, "payload": payload}, ensure_ascii=False)
    assert str(tmp_path) not in serialized
    assert "raw_documents" not in serialized
    assert "file_bodies" not in serialized


def test_projection_generator_dry_run_stdout_is_safe_and_does_not_write(tmp_path: Path) -> None:
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml")
    output_dir = tmp_path / "projection"

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "pcwb-safe-test-002",
        "--generated-by",
        "wsl",
        "--output-dir",
        str(output_dir),
        "--dry-run",
    )

    assert result.returncode == 0, result.stderr + result.stdout
    assert not output_dir.exists()
    assert str(tmp_path) not in result.stdout
    dry_run = json.loads(result.stdout)
    assert sorted(dry_run) == ["manifest", "payload"]
    assert dry_run["manifest"]["generated_by"] == "wsl"
    assert dry_run["payload"]["redacted"] is True


def test_projection_generator_rejects_raw_paperclip_manifest_without_echoing_value(tmp_path: Path) -> None:
    raw_value = "/Users/example/nas/private/raw prompt token=abc123456789SECRET"
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml", provenance_summary=raw_value)

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "pcwb-safe-test-003",
        "--generated-by",
        "mac",
        "--output-dir",
        str(tmp_path / "projection"),
    )

    assert result.returncode != 0
    assert "paperclip manifest failed validation" in result.stderr
    assert "provenance_summary" in result.stderr
    assert "/Users/example" not in result.stderr
    assert "abc123456789SECRET" not in result.stderr


def test_projection_generator_rejects_invalid_bundle_id_without_echoing_args(tmp_path: Path) -> None:
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml")

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "raw prompt /Users/example token=abc123456789SECRET",
        "--generated-by",
        "mac",
        "--output-dir",
        str(tmp_path / "projection"),
    )

    assert result.returncode != 0
    assert "invalid bundle id" in result.stderr
    assert "raw prompt" not in result.stderr
    assert "/Users/example" not in result.stderr
    assert "abc123456789SECRET" not in result.stderr


def test_projection_generator_rejects_non_positive_freshness_without_writing(tmp_path: Path) -> None:
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml")
    output_dir = tmp_path / "projection"

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "pcwb-safe-test-004",
        "--generated-by",
        "mac",
        "--output-dir",
        str(output_dir),
        "--valid-for-seconds",
        "0",
    )

    assert result.returncode != 0
    assert not output_dir.exists()
    assert "valid seconds must be positive" in result.stderr
    assert "Traceback" not in result.stderr


def test_projection_generator_reports_output_write_errors_without_private_paths(tmp_path: Path) -> None:
    paperclip_manifest = write_paperclip_manifest(tmp_path / "paperclip.yaml")
    output_dir = tmp_path / "projection"
    output_dir.write_text("not a directory", encoding="utf-8")

    result = run_generator(
        "--source-kind",
        "paperclip",
        "--paperclip-manifest",
        str(paperclip_manifest),
        "--bundle-id",
        "pcwb-safe-test-005",
        "--generated-by",
        "mac",
        "--output-dir",
        str(output_dir),
    )

    assert result.returncode != 0
    assert "failed to write projection bundle" in result.stderr
    assert "FileExistsError" in result.stderr
    assert str(tmp_path) not in result.stderr
    assert "Traceback" not in result.stderr
