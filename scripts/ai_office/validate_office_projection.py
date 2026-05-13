#!/usr/bin/env python3
"""Validate AI Office safe projection bundles.

The validator reports field paths and error categories only. It never echoes
suspicious values, because incoming projection bundles may contain raw paths,
tokens, prompts, transcripts, logs, or other material that must not reach the
conversation, dashboard, or rejection metadata.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

MANIFEST_SCHEMA = "office_projection_manifest.v1"
PAYLOAD_SCHEMA = "office_projection_payload.v1"
ALLOWED_GENERATED_BY = {"mac", "wsl", "manual", "scheduler"}
ALLOWED_SOURCE_KINDS = {"paperclip", "kanban", "obsidian", "schedule", "status"}
ALLOWED_VALIDATOR_RESULTS = {"pass", "fail", "warning"}
MAX_SAFE_SUMMARY_LENGTH = 240
MAX_PAYLOAD_ITEMS = 100
BUNDLE_ID_RE = re.compile(r"^[a-z0-9][a-z0-9_.:-]{1,96}$")
SOURCE_TAG_RE = re.compile(r"^[a-z0-9][a-z0-9_-]{1,40}$")
PRIVATE_PATH_RE = re.compile(
    r"(?:/Users/|/home/|/Volumes/|/private/|[A-Za-z]:\\|\\\\[^\\]+\\[^\\]+)",
    re.IGNORECASE,
)
SECRET_LIKE_RE = re.compile(
    r"(?:token|secret|password|credential|api[_-]?key)\s*[:=]\s*\S{8,}|sk-[A-Za-z0-9_-]{8,}",
    re.IGNORECASE,
)
RAW_TEXT_RE = re.compile(
    r"\b(?:raw prompt|raw transcript|raw body|raw log|task body|task result)\b",
    re.IGNORECASE,
)
FORBIDDEN_KEYS = {
    "prompt",
    "prompts",
    "transcript",
    "transcripts",
    "body",
    "task_body",
    "task_bodies",
    "task_result",
    "task_results",
    "script",
    "scripts",
    "args",
    "tool_args",
    "log",
    "logs",
    "path",
    "absolute_path",
    "full_path",
    "secret",
    "token",
    "password",
    "credential",
    "credentials",
    "auth",
    "env",
    "provider",
    "model",
    "provider_model_identity",
    "raw_adapter_error",
    "raw_adapter_errors",
}


class ValidationError(Exception):
    def __init__(self, field_path: str, category: str) -> None:
        super().__init__(f"{field_path}: {category}")
        self.field_path = field_path
        self.category = category


def path_join(base: str, key: str | int) -> str:
    if isinstance(key, int):
        return f"{base}[{key}]"
    return f"{base}.{key}" if base else key


def load_json(path: Path, label: str) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise ValidationError(label, f"cannot read file ({exc.__class__.__name__})") from exc
    except json.JSONDecodeError as exc:
        raise ValidationError(label, f"invalid json ({exc.__class__.__name__})") from exc


def parse_utc(value: str) -> datetime | None:
    if not isinstance(value, str) or not value.endswith("Z"):
        return None
    try:
        return datetime.fromisoformat(value.removesuffix("Z") + "+00:00").astimezone(timezone.utc)
    except ValueError:
        return None


def validate_no_forbidden_material(value: Any, field_path: str) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if isinstance(value, dict):
        for key, child in value.items():
            key_text = str(key)
            child_path = path_join(field_path, key_text)
            if key_text.lower() in FORBIDDEN_KEYS:
                errors.append(ValidationError(child_path, "forbidden key"))
                continue
            errors.extend(validate_no_forbidden_material(child, child_path))
    elif isinstance(value, list):
        for index, child in enumerate(value):
            errors.extend(validate_no_forbidden_material(child, path_join(field_path, index)))
    elif isinstance(value, str):
        if PRIVATE_PATH_RE.search(value):
            errors.append(ValidationError(field_path, "private path pattern"))
        if SECRET_LIKE_RE.search(value):
            errors.append(ValidationError(field_path, "secret-like value"))
        if RAW_TEXT_RE.search(value):
            errors.append(ValidationError(field_path, "raw text marker"))
    return errors


def require_type(data: dict[str, Any], field_path: str, key: str, expected_type: type, errors: list[ValidationError]) -> None:
    if key not in data:
        errors.append(ValidationError(path_join(field_path, key), "missing required field"))
        return
    if not isinstance(data[key], expected_type):
        errors.append(ValidationError(path_join(field_path, key), f"expected {expected_type.__name__}"))


def validate_manifest(data: Any) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if not isinstance(data, dict):
        return [ValidationError("manifest", "expected mapping")]

    errors.extend(validate_no_forbidden_material(data, "manifest"))
    required_types: list[tuple[str, type]] = [
        ("schema_version", str),
        ("bundle_id", str),
        ("generated_at", str),
        ("generated_by", str),
        ("source_kind", str),
        ("source_tags", list),
        ("freshness", dict),
        ("redaction", dict),
        ("validator", dict),
        ("payload", dict),
    ]
    for key, expected_type in required_types:
        require_type(data, "manifest", key, expected_type, errors)

    if isinstance(data.get("schema_version"), str) and data["schema_version"] != MANIFEST_SCHEMA:
        errors.append(ValidationError("manifest.schema_version", "unsupported schema version"))
    if isinstance(data.get("bundle_id"), str) and not BUNDLE_ID_RE.match(data["bundle_id"]):
        errors.append(ValidationError("manifest.bundle_id", "invalid bundle id"))
    if isinstance(data.get("generated_by"), str) and data["generated_by"] not in ALLOWED_GENERATED_BY:
        errors.append(ValidationError("manifest.generated_by", "invalid generated_by"))
    if isinstance(data.get("source_kind"), str) and data["source_kind"] not in ALLOWED_SOURCE_KINDS:
        errors.append(ValidationError("manifest.source_kind", "invalid source_kind"))
    if isinstance(data.get("generated_at"), str) and parse_utc(data["generated_at"]) is None:
        errors.append(ValidationError("manifest.generated_at", "expected UTC timestamp"))

    source_tags = data.get("source_tags")
    if isinstance(source_tags, list):
        for index, tag in enumerate(source_tags):
            if not isinstance(tag, str) or not SOURCE_TAG_RE.match(tag):
                errors.append(ValidationError(f"manifest.source_tags[{index}]", "invalid source tag"))

    freshness = data.get("freshness")
    if isinstance(freshness, dict):
        require_type(freshness, "manifest.freshness", "valid_for_seconds", int, errors)
        require_type(freshness, "manifest.freshness", "stale_after", str, errors)
        require_type(freshness, "manifest.freshness", "hard_expire_after", str, errors)
        stale_after = parse_utc(freshness.get("stale_after", ""))
        hard_expire_after = parse_utc(freshness.get("hard_expire_after", ""))
        if stale_after is None:
            errors.append(ValidationError("manifest.freshness.stale_after", "expected UTC timestamp"))
        if hard_expire_after is None:
            errors.append(ValidationError("manifest.freshness.hard_expire_after", "expected UTC timestamp"))
        if stale_after and hard_expire_after and hard_expire_after < stale_after:
            errors.append(ValidationError("manifest.freshness.hard_expire_after", "must be after stale_after"))
        if isinstance(freshness.get("valid_for_seconds"), int) and freshness["valid_for_seconds"] <= 0:
            errors.append(ValidationError("manifest.freshness.valid_for_seconds", "expected positive integer"))

    redaction = data.get("redaction")
    if isinstance(redaction, dict):
        if redaction.get("raw_excluded") is not True:
            errors.append(ValidationError("manifest.redaction.raw_excluded", "must be true"))
        require_type(redaction, "manifest.redaction", "guarantee", str, errors)
        require_type(redaction, "manifest.redaction", "excluded_classes", list, errors)

    validator = data.get("validator")
    if isinstance(validator, dict):
        require_type(validator, "manifest.validator", "name", str, errors)
        require_type(validator, "manifest.validator", "version", str, errors)
        require_type(validator, "manifest.validator", "result", str, errors)
        require_type(validator, "manifest.validator", "checked_at", str, errors)
        require_type(validator, "manifest.validator", "safe_summary", str, errors)
        if isinstance(validator.get("result"), str) and validator["result"] not in ALLOWED_VALIDATOR_RESULTS:
            errors.append(ValidationError("manifest.validator.result", "invalid validator result"))
        if isinstance(validator.get("checked_at"), str) and parse_utc(validator["checked_at"]) is None:
            errors.append(ValidationError("manifest.validator.checked_at", "expected UTC timestamp"))
        if (
            isinstance(validator.get("safe_summary"), str)
            and len(validator["safe_summary"]) > MAX_SAFE_SUMMARY_LENGTH
        ):
            errors.append(ValidationError("manifest.validator.safe_summary", "too long"))

    payload = data.get("payload")
    if isinstance(payload, dict):
        if payload.get("file") != "payload.json":
            errors.append(ValidationError("manifest.payload.file", "must be payload.json"))
        if payload.get("content_type") != "application/json":
            errors.append(ValidationError("manifest.payload.content_type", "must be application/json"))

    return errors


def validate_payload(data: Any, manifest: dict[str, Any]) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if not isinstance(data, dict):
        return [ValidationError("payload", "expected mapping")]

    errors.extend(validate_no_forbidden_material(data, "payload"))
    required_types: list[tuple[str, type]] = [
        ("schema_version", str),
        ("bundle_id", str),
        ("source_kind", str),
        ("generated_at", str),
        ("redacted", bool),
        ("items", list),
        ("summary", dict),
        ("display", dict),
    ]
    for key, expected_type in required_types:
        require_type(data, "payload", key, expected_type, errors)

    if isinstance(data.get("schema_version"), str) and data["schema_version"] != PAYLOAD_SCHEMA:
        errors.append(ValidationError("payload.schema_version", "unsupported schema version"))
    if data.get("bundle_id") != manifest.get("bundle_id"):
        errors.append(ValidationError("payload.bundle_id", "must match manifest.bundle_id"))
    if data.get("source_kind") != manifest.get("source_kind"):
        errors.append(ValidationError("payload.source_kind", "must match manifest.source_kind"))
    if isinstance(data.get("generated_at"), str) and parse_utc(data["generated_at"]) is None:
        errors.append(ValidationError("payload.generated_at", "expected UTC timestamp"))
    if data.get("redacted") is not True:
        errors.append(ValidationError("payload.redacted", "must be true"))
    items = data.get("items")
    if isinstance(items, list) and len(items) > MAX_PAYLOAD_ITEMS:
        errors.append(ValidationError("payload.items", "too many items"))
    return errors


def validate_bundle(bundle_path: Path) -> list[ValidationError]:
    manifest_path = bundle_path / "manifest.json"
    payload_path = bundle_path / "payload.json"
    errors: list[ValidationError] = []

    if not bundle_path.is_dir():
        return [ValidationError("bundle", "expected directory")]
    if not manifest_path.exists():
        errors.append(ValidationError("manifest", "missing manifest.json"))
    if not payload_path.exists():
        errors.append(ValidationError("payload", "missing payload.json"))
    if errors:
        return errors

    try:
        manifest = load_json(manifest_path, "manifest")
    except ValidationError as exc:
        return [exc]
    try:
        payload = load_json(payload_path, "payload")
    except ValidationError as exc:
        return [exc]

    manifest_errors = validate_manifest(manifest)
    errors.extend(manifest_errors)
    if isinstance(manifest, dict):
        errors.extend(validate_payload(payload, manifest))
    return errors


def error_report(errors: list[ValidationError]) -> dict[str, Any]:
    error_entries = [
        {"field_path": error.field_path, "category": error.category}
        for error in errors
    ]
    reasons = list(dict.fromkeys(error.category for error in errors))
    field_paths = list(dict.fromkeys(error.field_path for error in errors))
    return {
        "ok": not errors,
        "error_count": len(errors),
        "errors": error_entries,
        "rejection": None
        if not errors
        else {
            "status": "rejected",
            "reason_count": len(errors),
            "reasons": reasons,
            "field_paths": field_paths,
        },
    }


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate an AI Office safe projection bundle")
    parser.add_argument("--json", action="store_true", help="Print safe machine-readable validation metadata")
    parser.add_argument("bundle", type=Path, help="Directory containing manifest.json and payload.json")
    args = parser.parse_args(argv)

    errors = validate_bundle(args.bundle)
    if args.json:
        print(json.dumps(error_report(errors), ensure_ascii=False, sort_keys=True))
        return 1 if errors else 0

    if errors:
        for error in errors:
            print(f"ERROR: {error.field_path}: {error.category}", file=sys.stderr)
        return 1

    print("OK: safe Office projection bundle")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
