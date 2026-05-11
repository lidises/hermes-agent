from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
VALIDATOR = ROOT / "scripts" / "ai_office" / "validate_paperclip_manifest.py"
EXAMPLE = ROOT / "docs" / "ai-office" / "examples" / "paperclip-source.example.yaml"


def run_validator(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(path)],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def write_manifest(tmp_path: Path, data: dict) -> Path:
    path = tmp_path / "manifest.yaml"
    path.write_text(yaml.safe_dump(data, sort_keys=False, allow_unicode=True), encoding="utf-8")
    return path


def valid_manifest() -> dict:
    return {
        "schema_version": 1,
        "id": "paperclip:test-source",
        "label": "test-source",
        "source_type": "paperclip",
        "relay": "MacBook",
        "status": "partial",
        "checked_at": "2026-05-11T09:00:00Z",
        "item_count": 4,
        "warning_count": 1,
        "tags": ["source:test-source"],
        "path_bucket": "nas-personal-ledger",
        "redaction": {"policy_version": 1, "omitted_sections": ["raw_documents"]},
    }


def test_valid_example_manifest_passes() -> None:
    result = run_validator(EXAMPLE)

    assert result.returncode == 0, result.stderr + result.stdout
    assert "OK: safe Paperclip manifest" in result.stdout


def test_forbidden_keys_fail_recursively_without_echoing_secret_value(tmp_path: Path) -> None:
    data = valid_manifest()
    data["nested"] = {"token": "sk-secret-value-that-must-not-be-printed"}
    path = write_manifest(tmp_path, data)

    result = run_validator(path)

    assert result.returncode != 0
    combined = result.stdout + result.stderr
    assert "nested.token" in combined
    assert "forbidden key" in combined
    assert "sk-secret-value" not in combined


def test_invalid_source_tag_fails(tmp_path: Path) -> None:
    data = valid_manifest()
    data["tags"] = ["source:valid-tag", "raw prompt must not appear"]
    path = write_manifest(tmp_path, data)

    result = run_validator(path)

    assert result.returncode != 0
    assert "tags[1]" in result.stderr
    assert "invalid source tag" in result.stderr
    assert "raw prompt" not in result.stderr


def test_invalid_relay_and_source_type_fail(tmp_path: Path) -> None:
    data = valid_manifest()
    data["relay"] = "NAS"
    data["source_type"] = "raw_export"
    path = write_manifest(tmp_path, data)

    result = run_validator(path)

    assert result.returncode != 0
    assert "relay" in result.stderr
    assert "source_type" in result.stderr


def test_full_private_path_in_values_fails_without_echoing_path(tmp_path: Path) -> None:
    data = valid_manifest()
    data["provenance_summary"] = "/Users/example/nas/private/raw/path"
    path = write_manifest(tmp_path, data)

    result = run_validator(path)

    assert result.returncode != 0
    assert "provenance_summary" in result.stderr
    assert "private path pattern" in result.stderr
    assert "/Users/example" not in result.stderr


def test_token_like_value_fails_without_echoing_value(tmp_path: Path) -> None:
    data = valid_manifest()
    data["provenance_summary"] = "token=abc123456789SECRET"
    path = write_manifest(tmp_path, data)

    result = run_validator(path)

    assert result.returncode != 0
    assert "provenance_summary" in result.stderr
    assert "secret-like value" in result.stderr
    assert "abc123456789SECRET" not in result.stderr
