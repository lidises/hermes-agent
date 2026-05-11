from __future__ import annotations

import subprocess
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parents[1]
GENERATOR = ROOT / "scripts" / "ai_office" / "generate_paperclip_manifest.py"
VALIDATOR = ROOT / "scripts" / "ai_office" / "validate_paperclip_manifest.py"


def run_generator(*args: str) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(GENERATOR), *args],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def validate_manifest(path: Path) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        [sys.executable, str(VALIDATOR), str(path)],
        cwd=ROOT,
        text=True,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        check=False,
    )


def test_generator_requires_explicit_input_dir() -> None:
    result = run_generator("--source-id", "paperclip:test-source", "--tag", "source:test-source")

    assert result.returncode != 0
    assert "input-dir" in result.stderr


def test_generator_dry_run_counts_extension_buckets_without_full_path(tmp_path: Path) -> None:
    input_dir = tmp_path / "paperclip-private-source"
    input_dir.mkdir()
    (input_dir / "note.md").write_text("raw body must not be read", encoding="utf-8")
    (input_dir / "paper.pdf").write_bytes(b"%PDF")
    (input_dir / "image.png").write_bytes(b"png")
    (input_dir / "data.bin").write_bytes(b"bin")
    (input_dir / ".hidden.md").write_text("ignored", encoding="utf-8")

    result = run_generator(
        "--input-dir",
        str(input_dir),
        "--source-id",
        "paperclip:test-source",
        "--relay",
        "MacBook",
        "--tag",
        "source:test-source",
        "--path-bucket",
        "macbook-local",
    )

    assert result.returncode == 0, result.stderr
    assert str(input_dir) not in result.stdout
    assert "raw body" not in result.stdout
    manifest = yaml.safe_load(result.stdout)
    assert manifest["item_count"] == 4
    assert manifest["extension_buckets"] == {"markdown": 1, "pdf": 1, "image": 1, "other": 1}
    assert manifest["path_bucket"] == "macbook-local"
    assert manifest["tags"] == ["source:test-source"]


def test_generator_output_validates_with_validator(tmp_path: Path) -> None:
    input_dir = tmp_path / "source"
    input_dir.mkdir()
    (input_dir / "note.md").write_text("not emitted", encoding="utf-8")
    output = tmp_path / "manifest.yaml"

    result = run_generator(
        "--input-dir",
        str(input_dir),
        "--source-id",
        "paperclip:test-source",
        "--tag",
        "source:test-source",
        "--output",
        str(output),
    )

    assert result.returncode == 0, result.stderr
    assert output.exists()
    validation = validate_manifest(output)
    assert validation.returncode == 0, validation.stderr + validation.stdout


def test_generator_rejects_symlinks_by_default(tmp_path: Path) -> None:
    input_dir = tmp_path / "source"
    input_dir.mkdir()
    target = input_dir / "target.md"
    target.write_text("safe", encoding="utf-8")
    (input_dir / "link.md").symlink_to(target)

    result = run_generator("--input-dir", str(input_dir), "--source-id", "paperclip:test-source", "--tag", "source:test-source")

    assert result.returncode != 0
    assert "symlink" in result.stderr
    assert str(target) not in result.stderr


def test_generator_rejects_invalid_tag_without_echoing_value(tmp_path: Path) -> None:
    input_dir = tmp_path / "source"
    input_dir.mkdir()
    (input_dir / "note.md").write_text("safe", encoding="utf-8")

    result = run_generator("--input-dir", str(input_dir), "--source-id", "paperclip:test-source", "--tag", "raw prompt must not appear")

    assert result.returncode != 0
    assert "invalid source tag" in result.stderr
    assert "raw prompt" not in result.stderr
