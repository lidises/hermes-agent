#!/usr/bin/env python3
"""Generate a dry-run Paperclip safe manifest from filesystem metadata only.

This script counts files and broad extension buckets. It does not read file body
content and it does not emit full input paths.
"""

from __future__ import annotations

import argparse
import sys
from datetime import UTC, datetime
from pathlib import Path
from typing import Any

import yaml

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from validate_paperclip_manifest import (  # noqa: E402
    ALLOWED_RELAYS,
    ALLOWED_SOURCE_TYPES,
    SOURCE_TAG_RE,
    validate_manifest,
)

MARKDOWN_EXTENSIONS = {".md", ".markdown", ".mdx", ".txt"}
PDF_EXTENSIONS = {".pdf"}
IMAGE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".heic"}
SAFE_PATH_BUCKETS = {"macbook-local", "wsl-relay", "nas-personal-ledger", "unknown"}


class GeneratorError(Exception):
    pass


def extension_bucket(path: Path) -> str:
    suffix = path.suffix.lower()
    if suffix in MARKDOWN_EXTENSIONS:
        return "markdown"
    if suffix in PDF_EXTENSIONS:
        return "pdf"
    if suffix in IMAGE_EXTENSIONS:
        return "image"
    return "other"


def iter_visible_files(input_dir: Path, allow_symlinks: bool) -> list[Path]:
    files: list[Path] = []
    for path in sorted(input_dir.rglob("*")):
        relative_parts = path.relative_to(input_dir).parts
        if any(part.startswith(".") for part in relative_parts):
            continue
        if path.is_symlink() and not allow_symlinks:
            raise GeneratorError("symlink rejected; rerun with --allow-symlinks only after local review")
        if path.is_file():
            files.append(path)
    return files


def build_manifest(args: argparse.Namespace) -> dict[str, Any]:
    input_dir = args.input_dir
    if input_dir is None:
        raise GeneratorError("--input-dir is required")
    input_dir = input_dir.expanduser()
    if not input_dir.exists() or not input_dir.is_dir():
        raise GeneratorError("input-dir must be an existing directory")
    if args.source_type not in ALLOWED_SOURCE_TYPES:
        raise GeneratorError("invalid source_type")
    if args.relay not in ALLOWED_RELAYS:
        raise GeneratorError("invalid relay")
    if args.path_bucket not in SAFE_PATH_BUCKETS:
        raise GeneratorError("invalid path_bucket")
    if not args.tags:
        raise GeneratorError("at least one --tag is required")
    for tag in args.tags:
        if not SOURCE_TAG_RE.match(tag):
            raise GeneratorError("invalid source tag")

    files = iter_visible_files(input_dir, args.allow_symlinks)
    buckets = {"markdown": 0, "pdf": 0, "image": 0, "other": 0}
    for file_path in files:
        buckets[extension_bucket(file_path)] += 1

    manifest: dict[str, Any] = {
        "schema_version": 1,
        "id": args.source_id,
        "label": args.label or args.source_id.split(":", 1)[-1][:48],
        "source_type": args.source_type,
        "relay": args.relay,
        "status": args.status,
        "checked_at": datetime.now(UTC).replace(microsecond=0).isoformat().replace("+00:00", "Z"),
        "item_count": len(files),
        "warning_count": 0,
        "tags": list(dict.fromkeys(args.tags)),
        "path_bucket": args.path_bucket,
        "extension_buckets": buckets,
        "provenance_summary": "dry-run metadata-only safe manifest",
        "redaction": {
            "policy_version": 1,
            "omitted_sections": ["raw_documents", "raw_paths", "file_bodies", "credentials"],
        },
    }
    errors = validate_manifest(manifest)
    if errors:
        first = errors[0]
        raise GeneratorError(f"generated manifest failed validation at {first.field_path}: {first.category}")
    return manifest


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a Paperclip safe manifest from directory metadata only")
    parser.add_argument("--input-dir", type=Path, required=True, help="Directory to summarize; file bodies are not read")
    parser.add_argument("--source-id", required=True, help="Safe source id such as paperclip:demo-source")
    parser.add_argument("--source-type", default="paperclip", choices=sorted(ALLOWED_SOURCE_TYPES))
    parser.add_argument("--relay", default="unknown", choices=sorted(ALLOWED_RELAYS))
    parser.add_argument("--status", default="partial", choices=["ok", "partial", "missing", "unavailable", "error"])
    parser.add_argument("--tag", action="append", dest="tags", default=[], help="Safe source:<slug> tag; repeatable")
    parser.add_argument("--path-bucket", default="unknown", choices=sorted(SAFE_PATH_BUCKETS))
    parser.add_argument("--label", default="", help="Optional sanitized display label")
    parser.add_argument("--output", type=Path, help="Optional output file. Omit for dry-run stdout")
    parser.add_argument("--allow-symlinks", action="store_true", help="Include symlinked files after local review")
    return parser.parse_args(argv)


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        manifest = build_manifest(args)
    except GeneratorError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    output = yaml.safe_dump(manifest, sort_keys=False, allow_unicode=True)
    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8")
        print(f"OK: wrote safe Paperclip manifest to {args.output.name}")
    else:
        print(output, end="")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
