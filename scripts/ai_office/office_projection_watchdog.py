#!/usr/bin/env python3
"""Disabled-by-default dry-run watcher for AI Office projection bundles.

This script is safe to run from cron because it performs no promotion and emits
only compact, allowlisted metadata. It never reads NAS/raw source material; it
only inspects already-transferred VPS projection bundles under
$HERMES_HOME/office/projections/incoming.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any

PROJECT_ROOT = Path(__file__).resolve().parents[2]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from hermes_cli.config import get_hermes_home  # noqa: E402
from hermes_cli.office_projection import ingest_office_projection_bundle, read_office_projection_cache  # noqa: E402

SAFE_BUNDLE_NAME_RE = re.compile(r"^[a-z0-9][a-z0-9_.:-]{1,96}$")


def _projection_root() -> Path:
    return get_hermes_home() / "office" / "projections"


def _safe_incoming_bundles(incoming: Path, limit: int) -> list[Path]:
    if not incoming.exists():
        return []
    bundles: list[Path] = []
    for child in sorted(incoming.iterdir(), key=lambda path: path.name):
        if not child.is_dir():
            continue
        if SAFE_BUNDLE_NAME_RE.match(child.name):
            bundles.append(child)
        if len(bundles) >= limit:
            break
    return bundles


def _summarize_result(result: dict[str, Any]) -> dict[str, Any]:
    summary: dict[str, Any] = {
        "bundle_path": result.get("bundle_path"),
        "status": result.get("status"),
        "ok": result.get("ok"),
        "dry_run": result.get("dry_run"),
        "action": result.get("action"),
    }
    if "gates" in result:
        summary["gates"] = result.get("gates")
    errors = result.get("errors")
    if isinstance(errors, list):
        summary["error_count"] = len(errors)
        summary["error_categories"] = sorted(
            {str(item.get("category")) for item in errors if isinstance(item, dict) and item.get("category")}
        )[:8]
    return summary


def build_watchdog_report(*, enabled: bool, limit: int) -> dict[str, Any]:
    root = _projection_root()
    incoming = root / "incoming"
    active = read_office_projection_cache(root)
    bundles = _safe_incoming_bundles(incoming, limit)

    report: dict[str, Any] = {
        "schema_version": 1,
        "watcher": "office_projection_watchdog",
        "enabled": enabled,
        "mode": "dry-run-only",
        "promotion_allowed": False,
        "root": "HERMES_HOME/office/projections",
        "incoming_count": len(bundles),
        "active_status": active.get("status"),
        "active_bundle_id": (active.get("active") or {}).get("bundle_id") if isinstance(active.get("active"), dict) else None,
        "results": [],
    }
    if not enabled:
        report["status"] = "disabled"
        report["message"] = "watcher disabled; pass --enabled for explicit dry-run scan"
        return report

    report["status"] = "checked"
    report["results"] = [
        _summarize_result(ingest_office_projection_bundle(bundle, root=root, dry_run=True)) for bundle in bundles
    ]
    return report


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Dry-run AI Office projection watcher; disabled by default.")
    parser.add_argument("--enabled", action="store_true", help="Run explicit dry-run checks. Without this, report disabled.")
    parser.add_argument("--limit", type=int, default=10, help="Maximum safe incoming bundle directories to inspect.")
    args = parser.parse_args(argv)
    if args.limit <= 0 or args.limit > 50:
        print(json.dumps({"ok": False, "status": "invalid_limit"}, sort_keys=True), file=sys.stderr)
        return 2

    report = build_watchdog_report(enabled=args.enabled, limit=args.limit)
    print(json.dumps(report, ensure_ascii=False, sort_keys=True))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
