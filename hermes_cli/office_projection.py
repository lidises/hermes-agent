"""Safe cache reader and manual ingest helpers for AI Office projections.

The VPS projection cache stores validator-passing, redacted bundles only. This
module deliberately returns small allowlisted metadata for the dashboard and
safe rejection summaries; it never returns raw bundle values or absolute paths.
"""

from __future__ import annotations

import json
import shutil
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from hermes_constants import get_hermes_home
from scripts.ai_office.validate_office_projection import error_report, validate_bundle

PROJECTION_SCHEMA_VERSION = 1
PROJECTION_ROOT_PARTS = ("office", "projections")


def _utc_now_compact() -> str:
    return datetime.now(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def projection_root() -> Path:
    return get_hermes_home().joinpath(*PROJECTION_ROOT_PARTS)


def _read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def _safe_bundle_dir_name(bundle_dir: Path) -> str:
    # Display/cache metadata must not reveal absolute local/VPS paths.
    return bundle_dir.name[:120]


def _active_bundle_dirs(root: Path) -> list[Path]:
    active = root / "active"
    if not active.exists():
        return []
    candidates = [path for path in active.iterdir() if path.is_dir() and (path / "manifest.json").exists()]
    return sorted(candidates, key=lambda path: path.stat().st_mtime, reverse=True)


def _safe_active_bundle(bundle_dir: Path) -> dict[str, object] | None:
    try:
        manifest = _read_json(bundle_dir / "manifest.json")
        payload = _read_json(bundle_dir / "payload.json")
    except Exception:
        return None
    if not isinstance(manifest, dict) or not isinstance(payload, dict):
        return None

    freshness = manifest.get("freshness") if isinstance(manifest.get("freshness"), dict) else {}
    validator = manifest.get("validator") if isinstance(manifest.get("validator"), dict) else {}
    redaction = manifest.get("redaction") if isinstance(manifest.get("redaction"), dict) else {}
    payload_summary = payload.get("summary") if isinstance(payload.get("summary"), dict) else {}
    display = payload.get("display") if isinstance(payload.get("display"), dict) else {}

    return {
        "bundle_id": str(manifest.get("bundle_id") or payload.get("bundle_id") or bundle_dir.name)[:120],
        "generated_at": str(manifest.get("generated_at") or payload.get("generated_at") or ""),
        "generated_by": str(manifest.get("generated_by") or "manual"),
        "source_kind": str(manifest.get("source_kind") or payload.get("source_kind") or "status"),
        "source_tags": [str(tag)[:48] for tag in manifest.get("source_tags", [])[:12] if isinstance(tag, str)],
        "freshness": {
            "stale_after": str(freshness.get("stale_after") or ""),
            "hard_expire_after": str(freshness.get("hard_expire_after") or ""),
            "policy": str(freshness.get("policy") or "show-last-known-good-with-stale-label"),
        },
        "validator": {
            "result": str(validator.get("result") or "unknown"),
            "checked_at": str(validator.get("checked_at") or ""),
            "safe_summary": str(validator.get("safe_summary") or "")[:240],
        },
        "redaction": {
            "raw_excluded": redaction.get("raw_excluded") is True,
            "guarantee": str(redaction.get("guarantee") or ""),
        },
        "payload_summary": dict(payload_summary),
        "display": dict(display),
        "bundle_path": _safe_bundle_dir_name(bundle_dir),
    }


def _read_rejections(root: Path) -> dict[str, object]:
    rejected_root = root / "rejected"
    if not rejected_root.exists():
        return {"count": 0, "recent": []}
    metadata_paths = sorted(rejected_root.glob("*/rejection.json"), key=lambda path: path.stat().st_mtime, reverse=True)
    recent: list[dict[str, object]] = []
    for path in metadata_paths[:5]:
        try:
            data = _read_json(path)
        except Exception:
            continue
        if not isinstance(data, dict):
            continue
        recent.append(
            {
                "bundle_path": _safe_bundle_dir_name(path.parent),
                "status": "rejected",
                "reason_count": int(data.get("reason_count") or 0),
                "reasons": [str(reason)[:80] for reason in data.get("reasons", [])[:8] if isinstance(reason, str)],
                "field_paths": [str(field)[:120] for field in data.get("field_paths", [])[:12] if isinstance(field, str)],
                "checked_at": str(data.get("checked_at") or ""),
            }
        )
    return {"count": len(metadata_paths), "recent": recent}


def read_office_projection_cache(root: Path | None = None) -> dict[str, object]:
    """Return dashboard-safe last-known-good projection cache metadata."""

    cache_root = root or projection_root()
    active_bundle = next((_safe_active_bundle(path) for path in _active_bundle_dirs(cache_root)), None)
    status = "active" if active_bundle else "missing"
    return {
        "schema_version": PROJECTION_SCHEMA_VERSION,
        "status": status,
        "redacted": True,
        "cache_layout": {
            "incoming": "incoming",
            "active": "active",
            "archive": "archive",
            "rejected": "rejected",
        },
        "active": active_bundle,
        "rejected": _read_rejections(cache_root),
    }


def _copy_bundle(src: Path, dst: Path) -> None:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)


def ingest_office_projection_bundle(bundle_dir: str | Path, root: Path | None = None, *, dry_run: bool = False) -> dict[str, object]:
    """Validate and manually promote/reject one candidate projection bundle.

    When ``dry_run`` is true, return the safe action outcome without copying,
    archiving, promoting, or writing rejection metadata.
    """

    src = Path(bundle_dir)
    cache_root = root or projection_root()
    active_root = cache_root / "active"
    archive_root = cache_root / "archive"
    rejected_root = cache_root / "rejected"
    errors = validate_bundle(src)
    report = error_report(errors)
    stamp = _utc_now_compact()
    safe_name = _safe_bundle_dir_name(src)

    if report["ok"]:
        if dry_run:
            return {
                "status": "would_promote",
                "bundle_path": safe_name,
                "ok": True,
                "dry_run": True,
                "action": "projection_ingest_promote",
                "gates": ["validator_pass", "safe_metadata_only", "active_cache_atomic", "rollback_archive"],
            }
        target_name = safe_name
        for directory in (active_root, archive_root):
            directory.mkdir(parents=True, exist_ok=True)
        active_target = active_root / target_name
        if active_target.exists():
            archive_target = archive_root / f"{stamp}__{target_name}"
            shutil.move(str(active_target), str(archive_target))
        temp_target = active_root / f".{target_name}.tmp-{stamp}"
        _copy_bundle(src, temp_target)
        temp_target.rename(active_target)
        return {"status": "promoted", "bundle_path": target_name, "ok": True}

    rejection = report.get("rejection") or {"status": "rejected", "reason_count": 0, "reasons": [], "field_paths": []}
    if dry_run:
        return {
            "status": "would_reject",
            "bundle_path": safe_name,
            "ok": False,
            "dry_run": True,
            "action": "projection_ingest_promote",
            "rejection": rejection,
        }
    rejected_root.mkdir(parents=True, exist_ok=True)
    rejected_target = rejected_root / f"{stamp}__{safe_name}"
    _copy_bundle(src, rejected_target)
    rejection_meta = dict(rejection)
    rejection_meta["checked_at"] = datetime.now(timezone.utc).isoformat()
    (rejected_target / "rejection.json").write_text(json.dumps(rejection_meta, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"status": "rejected", "bundle_path": rejected_target.name, "ok": False, "rejection": rejection_meta}
