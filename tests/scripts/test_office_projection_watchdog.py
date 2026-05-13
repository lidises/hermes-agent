from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

from tests.hermes_cli.test_office_projection_cache import write_bundle


SCRIPT = Path("scripts/ai_office/office_projection_watchdog.py")


def run_watchdog(tmp_path: Path, *args: str) -> subprocess.CompletedProcess[str]:
    env = {"HERMES_HOME": str(tmp_path / "hermes")}
    return subprocess.run(
        [sys.executable, str(SCRIPT), *args],
        text=True,
        capture_output=True,
        env=env,
        check=False,
    )


def test_projection_watchdog_is_disabled_by_default_and_does_not_scan(tmp_path):
    home = tmp_path / "hermes"
    write_bundle(home / "office" / "projections" / "incoming", "pcwb-safe-watch")

    result = run_watchdog(tmp_path)

    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload["status"] == "disabled"
    assert payload["enabled"] is False
    assert payload["mode"] == "dry-run-only"
    assert payload["promotion_allowed"] is False
    assert payload["incoming_count"] == 1
    assert payload["results"] == []
    assert not (home / "office" / "projections" / "active" / "pcwb-safe-watch").exists()


def test_projection_watchdog_enabled_mode_is_dry_run_only(tmp_path):
    home = tmp_path / "hermes"
    write_bundle(home / "office" / "projections" / "incoming", "pcwb-safe-watch")

    result = run_watchdog(tmp_path, "--enabled")

    assert result.returncode == 0
    payload = json.loads(result.stdout)
    assert payload["status"] == "checked"
    assert payload["enabled"] is True
    assert payload["mode"] == "dry-run-only"
    assert payload["promotion_allowed"] is False
    assert payload["results"][0]["status"] == "would_promote"
    assert payload["results"][0]["dry_run"] is True
    assert not (home / "office" / "projections" / "active" / "pcwb-safe-watch").exists()


def test_projection_watchdog_omits_unsafe_bundle_names(tmp_path):
    incoming = tmp_path / "hermes" / "office" / "projections" / "incoming"
    write_bundle(incoming, "pcwb-safe-watch")
    (incoming / "bad name with spaces").mkdir()

    result = run_watchdog(tmp_path, "--enabled")

    assert result.returncode == 0
    payload = json.loads(result.stdout)
    rendered = json.dumps(payload, ensure_ascii=False)
    assert payload["incoming_count"] == 1
    assert "pcwb-safe-watch" in rendered
    assert "bad name" not in rendered
