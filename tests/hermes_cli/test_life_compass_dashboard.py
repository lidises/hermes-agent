"""Tests for the read-only Life Compass dashboard integration."""

import json

from fastapi.testclient import TestClient


def test_life_compass_status_is_public_bounded_and_read_only(tmp_path, monkeypatch):
    from hermes_cli import web_server

    site = tmp_path / "site"
    site.mkdir()
    (site / "Life Compass.html").write_text("<html><body>study</body></html>")
    (site / "snapshot-manifest.json").write_text(
        json.dumps(
            {
                "schema_version": 1,
                "snapshot_id": "snap-1",
                "generated_at": "2026-05-18T00:00:00Z",
                "source_label": "Life Compass",
                "file_count": 2,
                "total_bytes": 123,
                "raw_path": "/secret/nas/path",
                "files": ["should-not-leak.html"],
            }
        )
    )
    monkeypatch.setattr(web_server, "LIFE_COMPASS_SITE", site)

    response = TestClient(web_server.app).get("/api/life-compass/status")

    assert response.status_code == 200
    data = response.json()
    assert data["available"] is True
    assert data["entrypoint"] == "/life-compass-site/Life%20Compass.html"
    assert data["missing"] == []
    assert data["safety"] == {
        "mode": "vps-local-read-only-snapshot",
        "raw_html_in_api": False,
        "nas_mounted_on_vps": False,
    }
    manifest = data["snapshot"]["manifest"]
    assert manifest["snapshot_id"] == "snap-1"
    assert "raw_path" not in manifest
    assert "files" not in manifest
    assert "study" not in json.dumps(data)


def test_life_compass_status_reports_missing_snapshot(tmp_path, monkeypatch):
    from hermes_cli import web_server

    monkeypatch.setattr(web_server, "LIFE_COMPASS_SITE", tmp_path / "missing")

    response = TestClient(web_server.app).get("/api/life-compass/status")

    assert response.status_code == 200
    data = response.json()
    assert data["available"] is False
    assert data["entrypoint"] is None
    assert "site_root" in data["missing"]
    assert "Life Compass.html" in data["missing"]
