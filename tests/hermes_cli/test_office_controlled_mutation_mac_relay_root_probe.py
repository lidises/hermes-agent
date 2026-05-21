from pathlib import Path


def test_mac_relay_root_readiness_probe_reports_sanitized_configured_root(tmp_path):
    from hermes_cli.office_controlled_mutation import probe_office_controlled_mutation_mac_relay_root_readiness

    result = probe_office_controlled_mutation_mac_relay_root_readiness(root_path=tmp_path)

    assert result["probed"] is True
    assert result["errors"] == []
    dto = result["dto"]
    assert dto["mode"] == "mac_local_relay_root_readiness_probe"
    assert dto["root_configured"] is True
    assert dto["root_readable"] is True
    assert isinstance(dto["root_writable"], bool)
    assert dto["safe_probe_ref"].startswith("mac_relay_root_probe::")
    assert dto["sanitized_root_label"] == "configured_local_root"
    assert dto["redaction_policy_version"] == 1
    assert dto["write_payload_included"] is False
    assert dto["raw_root_path_included"] is False
    assert dto["credential_value_included"] is False
    assert dto["capabilities"]["probe_read_only"] is True
    assert dto["capabilities"]["actual_nas_write_enabled"] is False
    assert dto["capabilities"]["vps_nas_mount_enabled"] is False
    assert str(tmp_path) not in str(dto)


def test_mac_relay_root_readiness_probe_missing_root_does_not_leak_path(tmp_path):
    from hermes_cli.office_controlled_mutation import probe_office_controlled_mutation_mac_relay_root_readiness

    missing = tmp_path / "private-root"
    result = probe_office_controlled_mutation_mac_relay_root_readiness(root_path=missing)

    assert result["probed"] is True
    dto = result["dto"]
    assert dto["root_configured"] is True
    assert dto["root_readable"] is False
    assert dto["root_writable"] is False
    assert dto["probe_errors"] == ["root_not_directory"]
    assert str(missing) not in str(dto)


def test_mac_relay_root_readiness_probe_unconfigured():
    from hermes_cli.office_controlled_mutation import probe_office_controlled_mutation_mac_relay_root_readiness

    result = probe_office_controlled_mutation_mac_relay_root_readiness(root_path=None)

    assert result["probed"] is True
    dto = result["dto"]
    assert dto["root_configured"] is False
    assert dto["root_readable"] is False
    assert dto["root_writable"] is False
    assert dto["safe_probe_ref"] == "mac_relay_root_probe::unconfigured"
    assert dto["sanitized_root_label"] == "unconfigured"
    assert dto["probe_errors"] == ["mac_relay_root_not_configured"]
    assert dto["write_payload_included"] is False
