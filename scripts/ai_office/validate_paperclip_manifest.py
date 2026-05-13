#!/usr/bin/env python3
"""Validate AI Office Paperclip safe manifest files.

The validator intentionally reports field paths and error categories only. It does
not echo suspicious manifest values, because validation errors may involve secret
or private path patterns.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path
from typing import Any

try:
    import yaml
except ImportError:  # pragma: no cover - project dependency should provide PyYAML
    yaml = None  # type: ignore[assignment]

ALLOWED_SOURCE_TYPES = {"paperclip", "nas_manifest", "session_tag", "relay_projection"}
ALLOWED_RELAYS = {"MacBook", "WSL", "VPS", "unknown"}
ALLOWED_STATUSES = {"ok", "partial", "missing", "unavailable", "error"}
FORBIDDEN_KEYS = {
    "prompt",
    "transcript",
    "body",
    "result",
    "script",
    "args",
    "log",
    "path",
    "absolute_path",
    "full_path",
    "secret",
    "token",
    "password",
    "credential",
    "auth",
    "env",
}
SOURCE_TAG_RE = re.compile(r"^source:[a-z0-9][a-z0-9_-]{1,80}$")
SAFE_ID_RE = re.compile(r"^(paperclip|nas|session|relay):[a-z0-9][a-z0-9_.:-]{1,96}$")
PRIVATE_PATH_RE = re.compile(
    r"(?:/Users/|/home/|/Volumes/|/private/|[A-Za-z]:\\|\\\\[^\\]+\\[^\\]+)",
    re.IGNORECASE,
)
SECRET_LIKE_RE = re.compile(
    r"(?:token|secret|password|credential|api[_-]?key)\s*[:=]\s*\S{8,}|sk-[A-Za-z0-9_-]{8,}",
    re.IGNORECASE,
)
RAW_TEXT_RE = re.compile(r"\b(?:raw prompt|raw transcript|raw body|raw log)\b", re.IGNORECASE)


class ValidationError(Exception):
    def __init__(self, field_path: str, category: str) -> None:
        super().__init__(f"{field_path}: {category}")
        self.field_path = field_path
        self.category = category


def load_manifest(path: Path) -> Any:
    if yaml is None:
        raise ValidationError("manifest", "PyYAML is required")
    try:
        with path.open("r", encoding="utf-8") as handle:
            return yaml.safe_load(handle)
    except OSError as exc:
        raise ValidationError("manifest", f"cannot read file ({exc.__class__.__name__})") from exc
    except yaml.YAMLError as exc:
        raise ValidationError("manifest", f"invalid yaml ({exc.__class__.__name__})") from exc


def path_join(base: str, key: str | int) -> str:
    if isinstance(key, int):
        return f"{base}[{key}]"
    return f"{base}.{key}" if base else key


def validate_no_forbidden_material(value: Any, field_path: str = "") -> list[ValidationError]:
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
            errors.append(ValidationError(field_path or "manifest", "private path pattern"))
        if SECRET_LIKE_RE.search(value):
            errors.append(ValidationError(field_path or "manifest", "secret-like value"))
        if RAW_TEXT_RE.search(value):
            errors.append(ValidationError(field_path or "manifest", "raw text marker"))
    return errors


def require_type(data: dict[str, Any], key: str, expected_type: type, errors: list[ValidationError]) -> None:
    if key not in data:
        errors.append(ValidationError(key, "missing required field"))
        return
    if not isinstance(data[key], expected_type):
        errors.append(ValidationError(key, f"expected {expected_type.__name__}"))


def validate_manifest(data: Any) -> list[ValidationError]:
    errors: list[ValidationError] = []
    if not isinstance(data, dict):
        return [ValidationError("manifest", "expected mapping")]

    errors.extend(validate_no_forbidden_material(data))

    required_types: list[tuple[str, type]] = [
        ("schema_version", int),
        ("id", str),
        ("source_type", str),
        ("relay", str),
        ("status", str),
        ("checked_at", str),
        ("item_count", int),
        ("warning_count", int),
        ("tags", list),
        ("redaction", dict),
    ]
    for key, expected_type in required_types:
        require_type(data, key, expected_type, errors)

    if isinstance(data.get("schema_version"), int) and data["schema_version"] != 1:
        errors.append(ValidationError("schema_version", "unsupported schema version"))
    if isinstance(data.get("id"), str) and not SAFE_ID_RE.match(data["id"]):
        errors.append(ValidationError("id", "invalid safe source id"))
    if isinstance(data.get("source_type"), str) and data["source_type"] not in ALLOWED_SOURCE_TYPES:
        errors.append(ValidationError("source_type", "invalid source_type"))
    if isinstance(data.get("relay"), str) and data["relay"] not in ALLOWED_RELAYS:
        errors.append(ValidationError("relay", "invalid relay"))
    if isinstance(data.get("status"), str) and data["status"] not in ALLOWED_STATUSES:
        errors.append(ValidationError("status", "invalid status"))
    for count_key in ("item_count", "warning_count"):
        if isinstance(data.get(count_key), int) and data[count_key] < 0:
            errors.append(ValidationError(count_key, "expected non-negative integer"))
    if isinstance(data.get("tags"), list):
        for index, tag in enumerate(data["tags"]):
            field_path = f"tags[{index}]"
            if not isinstance(tag, str) or not SOURCE_TAG_RE.match(tag):
                errors.append(ValidationError(field_path, "invalid source tag"))

    redaction = data.get("redaction")
    if isinstance(redaction, dict):
        if not isinstance(redaction.get("policy_version"), int):
            errors.append(ValidationError("redaction.policy_version", "expected int"))
        omitted = redaction.get("omitted_sections")
        if not isinstance(omitted, list):
            errors.append(ValidationError("redaction.omitted_sections", "expected list"))
        elif not all(isinstance(item, str) for item in omitted):
            errors.append(ValidationError("redaction.omitted_sections", "expected string labels"))

    return errors


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Validate an AI Office Paperclip safe manifest")
    parser.add_argument("manifest", type=Path, help="Path to manifest YAML")
    args = parser.parse_args(argv)

    try:
        data = load_manifest(args.manifest)
        errors = validate_manifest(data)
    except ValidationError as exc:
        errors = [exc]

    if errors:
        for error in errors:
            print(f"ERROR: {error.field_path}: {error.category}", file=sys.stderr)
        return 1

    print("OK: safe Paperclip manifest")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
