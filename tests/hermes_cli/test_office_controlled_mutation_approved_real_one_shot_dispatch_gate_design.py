def test_approved_real_one_shot_dispatch_gate_design_projects_required_gate_without_execution():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_approved_real_one_shot_dispatch_gate_design

    dto = build_office_controlled_mutation_approved_real_one_shot_dispatch_gate_design(
        unsafe_examples={
            "raw_command": "python /tmp/private/run.py",
            "token": "sk-test-should-not-appear",
            "path": "/Users/lidises/private",
        }
    )

    assert dto["schema_version"] == 1
    assert dto["mode"] == "approved_real_one_shot_dispatch_gate_design"
    assert dto["approved_real_one_shot_dispatch_gate_design_complete"] is True
    assert dto["source_design_lane"] == "disabled_executor_contract_hardening"
    assert dto["next_manual_lane"] == "manual_real_one_shot_dispatch_gate_approval"
    assert dto["approval_gate"] == {
        "approval_record_required": True,
        "exact_target_allowlist_required": True,
        "rollback_disable_switch_required": True,
        "idempotency_replay_store_required": True,
        "operator_final_confirmation_required": True,
        "runtime_gate_still_disabled_by_default": True,
        "approval_recorded": False,
    }
    assert dto["runtime_command_envelope"] == {
        "runtime_command_shape_defined": True,
        "runtime_command_materialized": False,
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "command_args_echoed": False,
    }
    assert dto["replay_store"] == {
        "idempotency_key_format_required": True,
        "replay_lookup_required": True,
        "replay_write_required_after_success": True,
        "replay_store_bound": False,
        "replay_state_mutated": False,
    }
    assert dto["rollback_disable"] == {
        "disable_switch_required": True,
        "rollback_plan_ref_required": True,
        "rollback_verified_before_dispatch_required": True,
        "disable_switch_bound": False,
        "rollback_executed": False,
    }
    assert dto["execution_boundary"]["design_only"] is True
    assert dto["execution_boundary"]["dispatch_gate_open"] is False
    assert dto["execution_boundary"]["runtime_command_executed"] is False
    assert dto["execution_boundary"]["target_mutation_created"] is False
    assert dto["capabilities"]["approved_gate_design_readback_enabled"] is True
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    assert dto["capabilities"]["approval_recording_enabled"] is False
    assert dto["capabilities"]["idempotency_replay_store_write_enabled"] is False
    assert dto["capabilities"]["rollback_execution_enabled"] is False
    assert dto["capabilities"]["target_mutation_enabled"] is False
    assert dto["redaction"]["raw_excluded"] is True
    assert dto["redaction"]["unsupported_values_echoed"] is False
    assert "runtime_command_execution" in dto["forbidden_boundaries"]
    assert "target_mutation" in dto["forbidden_boundaries"]
    rendered = repr(dto)
    assert "sk-test" not in rendered
    assert "/tmp/private" not in rendered
    assert "/Users/lidises" not in rendered


def test_approved_real_one_shot_dispatch_gate_design_api_is_protected():
    from fastapi.testclient import TestClient
    import hermes_cli.web_server as web_server

    client = TestClient(web_server.app)
    path = "/api/office/controlled-mutation/approved-real-one-shot-dispatch-gate-design"

    unauthorized = client.get(path)
    assert unauthorized.status_code == 401

    response = client.get(path, headers={web_server._SESSION_HEADER_NAME: web_server._SESSION_TOKEN})
    assert response.status_code == 200
    dto = response.json()
    assert dto["mode"] == "approved_real_one_shot_dispatch_gate_design"
    assert dto["approved_real_one_shot_dispatch_gate_design_complete"] is True
    assert dto["capabilities"]["approved_gate_design_readback_enabled"] is True
    assert dto["capabilities"]["real_dispatch_execution_enabled"] is False
    assert dto["capabilities"]["target_mutation_enabled"] is False
    assert dto["execution_boundary"]["design_only"] is True
