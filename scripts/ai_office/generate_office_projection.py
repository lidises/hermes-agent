#!/usr/bin/env python3
"""Generate manual AI Office safe projection bundles.

This producer is intended for MacBook/WSL relay dry-runs. It reads already
validated safe manifests and emits an Office projection bundle containing only
allowlisted display metadata. It does not transfer files, read raw source
bodies, start watchers, or mutate the VPS cache.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import UTC, datetime, timedelta
from pathlib import Path
from typing import Any

SCRIPT_DIR = Path(__file__).resolve().parent
if str(SCRIPT_DIR) not in sys.path:
    sys.path.insert(0, str(SCRIPT_DIR))

from validate_office_projection import (  # noqa: E402
    BUNDLE_ID_RE,
    MANIFEST_SCHEMA,
    MAX_PAYLOAD_ITEMS,
    PAYLOAD_SCHEMA,
    error_report,
    validate_bundle,
    validate_manifest as validate_projection_manifest,
    validate_payload as validate_projection_payload,
)
from validate_paperclip_manifest import (  # noqa: E402
    ValidationError as PaperclipValidationError,
    load_manifest as load_paperclip_manifest,
    validate_manifest as validate_paperclip_manifest,
)

ALLOWED_GENERATED_BY = {"mac", "wsl", "manual", "scheduler"}
ALLOWED_SOURCE_KINDS = {"paperclip"}
SAFE_ROOM_IDS = ["sources", "work"]
MANIFEST_FILE_NAME = "manifest.json"
PAYLOAD_FILE_NAME = "payload.json"
SOURCE_TAG_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{1,40}$")


class ProjectionGeneratorError(Exception):
    pass


def _utc_now() -> datetime:
    return datetime.now(UTC).replace(microsecond=0)


def _utc_text(value: datetime) -> str:
    return value.isoformat().replace("+00:00", "Z")


def _safe_source_tag(tag: str) -> str | None:
    normalized = tag.removeprefix("source:").strip().lower().replace("_", "-")
    if SOURCE_TAG_RE.match(normalized):
        return normalized
    return None


def _load_valid_paperclip_manifest(path: Path) -> dict[str, Any]:
    try:
        data = load_paperclip_manifest(path)
        errors = validate_paperclip_manifest(data)
    except PaperclipValidationError as exc:
        errors = [exc]
        data = None
    if errors:
        first = errors[0]
        raise ProjectionGeneratorError(
            f"paperclip manifest failed validation at {first.field_path}: {first.category}"
        )
    if not isinstance(data, dict):
        raise ProjectionGeneratorError("paperclip manifest failed validation at manifest: expected mapping")
    return data


def _build_paperclip_payload_items(manifests: list[dict[str, Any]]) -> list[dict[str, Any]]:
    items: list[dict[str, Any]] = []
    for index, manifest in enumerate(manifests, start=1):
        status = str(manifest.get("status") or "partial")
        tags = [_safe_source_tag(str(tag)) for tag in manifest.get("tags", []) if isinstance(tag, str)]
        safe_tags = [tag for tag in tags if tag]
        items.append(
            {
                "id": f"paperclip-manifest-{index}",
                "kind": "summary_card",
                "label": "검증된 Paperclip 안전 매니페스트",
                "status": status,
                "count": int(manifest.get("item_count") or 0),
                "warning_count": int(manifest.get("warning_count") or 0),
                "source_tags": safe_tags[:8],
                "relay": str(manifest.get("relay") or "unknown"),
                "path_bucket": str(manifest.get("path_bucket") or "unknown"),
            }
        )
    return items


def _validate_generation_args(args: argparse.Namespace) -> None:
    if args.source_kind not in ALLOWED_SOURCE_KINDS:
        raise ProjectionGeneratorError("invalid source kind")
    if args.generated_by not in ALLOWED_GENERATED_BY:
        raise ProjectionGeneratorError("invalid generated_by")
    if not BUNDLE_ID_RE.match(args.bundle_id):
        raise ProjectionGeneratorError("invalid bundle id")
    if args.valid_for_seconds <= 0:
        raise ProjectionGeneratorError("valid seconds must be positive")
    if args.hard_expire_seconds <= 0:
        raise ProjectionGeneratorError("hard expire seconds must be positive")
    if not args.paperclip_manifest:
        raise ProjectionGeneratorError("at least one --paperclip-manifest is required")
    if len(args.paperclip_manifest) > MAX_PAYLOAD_ITEMS:
        raise ProjectionGeneratorError(f"too many paperclip manifests; maximum is {MAX_PAYLOAD_ITEMS}")


def build_projection_bundle(args: argparse.Namespace) -> dict[str, dict[str, Any]]:
    _validate_generation_args(args)
    paperclip_manifests = [_load_valid_paperclip_manifest(path) for path in args.paperclip_manifest]
    now = _utc_now()
    stale_after = now + timedelta(seconds=args.valid_for_seconds)
    hard_expire_after = now + timedelta(seconds=args.hard_expire_seconds)
    if hard_expire_after < stale_after:
        raise ProjectionGeneratorError("hard expire seconds must be >= valid seconds")

    items = _build_paperclip_payload_items(paperclip_manifests)
    attention_count = sum(1 for item in items if item.get("status") in {"missing", "unavailable", "error"}) + sum(
        int(item.get("warning_count") or 0) for item in items
    )
    source_tags = list(
        dict.fromkeys(
            tag
            for manifest in paperclip_manifests
            for raw_tag in manifest.get("tags", [])
            if isinstance(raw_tag, str)
            for tag in [_safe_source_tag(raw_tag)]
            if tag
        )
    )
    for default_tag in ("paperclip", "safe-manifest"):
        if default_tag not in source_tags:
            source_tags.append(default_tag)

    generated_at = _utc_text(now)
    checked_at = generated_at
    summary = {"safe_item_count": len(items), "attention_count": attention_count, "rooms": SAFE_ROOM_IDS}
    display = {"cards": ["manifests", "privateDashboard", "relayPosture"]}
    payload = {
        "schema_version": PAYLOAD_SCHEMA,
        "bundle_id": args.bundle_id,
        "source_kind": args.source_kind,
        "generated_at": generated_at,
        "redacted": True,
        "items": items,
        "summary": summary,
        "display": display,
    }
    manifest = {
        "schema_version": MANIFEST_SCHEMA,
        "bundle_id": args.bundle_id,
        "generated_at": generated_at,
        "generated_by": args.generated_by,
        "source_kind": args.source_kind,
        "source_tags": source_tags[:12],
        "freshness": {
            "valid_for_seconds": args.valid_for_seconds,
            "stale_after": _utc_text(stale_after),
            "hard_expire_after": _utc_text(hard_expire_after),
            "policy": "show-last-known-good-with-stale-label",
        },
        "redaction": {
            "guarantee": "raw_excluded_and_allowlisted_fields_only",
            "raw_excluded": True,
            "excluded_classes": [
                "prompts",
                "transcripts",
                "task_bodies",
                "task_results",
                "logs",
                "scripts",
                "tool_args",
                "full_private_paths",
                "tokens",
                "provider_model_identity",
                "raw_adapter_errors",
            ],
        },
        "validator": {
            "name": "office_projection_validator",
            "version": "v1",
            "result": "pass",
            "checked_at": checked_at,
            "safe_summary": f"{len(items)} safe paperclip manifest cards, raw fields excluded",
        },
        "payload": {
            "file": PAYLOAD_FILE_NAME,
            "content_type": "application/json",
            "summary": {**summary, "display_cards": display["cards"]},
        },
    }

    errors = validate_projection_manifest(manifest) + validate_projection_payload(payload, manifest)
    if errors:
        first = errors[0]
        raise ProjectionGeneratorError(f"generated projection failed validation at {first.field_path}: {first.category}")
    return {"manifest": manifest, "payload": payload}


def parse_args(argv: list[str] | None = None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Generate a manual AI Office safe projection bundle")
    parser.add_argument("--source-kind", default="paperclip", choices=sorted(ALLOWED_SOURCE_KINDS))
    parser.add_argument("--paperclip-manifest", type=Path, action="append", default=[], help="Validated Paperclip safe manifest YAML; repeatable")
    parser.add_argument("--bundle-id", required=True, help="Safe bundle id such as pcwb-safe-001")
    parser.add_argument("--generated-by", required=True, choices=sorted(ALLOWED_GENERATED_BY))
    parser.add_argument("--output-dir", type=Path, required=True, help="Local output bundle directory")
    parser.add_argument("--valid-for-seconds", type=int, default=86400)
    parser.add_argument("--hard-expire-seconds", type=int, default=604800)
    parser.add_argument("--dry-run", action="store_true", help="Print bundle JSON to stdout instead of writing files")
    return parser.parse_args(argv)


def _write_projection_bundle(output_dir: Path, bundle: dict[str, dict[str, Any]]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / MANIFEST_FILE_NAME).write_text(
        json.dumps(bundle["manifest"], ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )
    (output_dir / PAYLOAD_FILE_NAME).write_text(
        json.dumps(bundle["payload"], ensure_ascii=False, indent=2, sort_keys=True) + "\n",
        encoding="utf-8",
    )


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        bundle = build_projection_bundle(args)
    except ProjectionGeneratorError as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        return 1

    if args.dry_run:
        print(json.dumps(bundle, ensure_ascii=False, sort_keys=True))
        return 0

    output_dir = args.output_dir
    try:
        _write_projection_bundle(output_dir, bundle)
    except OSError as exc:
        print(f"ERROR: failed to write projection bundle ({exc.__class__.__name__})", file=sys.stderr)
        return 1

    errors = validate_bundle(output_dir)
    report = error_report(errors)
    if not report["ok"]:
        first = errors[0]
        print(f"ERROR: written bundle failed validation at {first.field_path}: {first.category}", file=sys.stderr)
        return 1
    print(f"OK: wrote safe Office projection bundle {args.bundle_id}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
