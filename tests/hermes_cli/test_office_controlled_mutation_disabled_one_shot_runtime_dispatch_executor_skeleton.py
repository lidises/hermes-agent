def test_disabled_one_shot_runtime_dispatch_executor_skeleton_projects_refusal_guards_without_execution():
    from hermes_cli.office_controlled_mutation import build_office_controlled_mutation_disabled_one_shot_runtime_dispatch_executor_skeleton

    status = build_office_controlled_mutation_disabled_one_shot_runtime_dispatch_executor_skeleton(
        unsafe_examples={
            "target_path": "/home/hermes/private-target.json",
            "token": "sk-private-runtime-token",
            "provider_id": "private-runtime-provider",
            "traceback": "Traceback (most recent call last)",
            "raw_command": "python /home/hermes/run-target.py",
        }
    )

    assert status["schema_version"] == 1
    assert status["mode"] == "disabled_one_shot_runtime_dispatch_executor_skeleton"
    assert status["disabled_one_shot_runtime_dispatch_executor_skeleton_complete"] is True
    assert status["source_design_lane"] == "concrete_runtime_single_dispatch_slice_design"
    assert status["next_manual_lane"] == "approved_one_shot_runtime_dispatch_execution"
    assert status["executor_gate"] == {
        "disabled_by_default": True,
        "runtime_gate_open": False,
        "execution_endpoint_present": True,
        "execution_refuses_by_default": True,
        "actual_dispatch_approved": False,
    }
    assert status["required_inputs"] == {
        "exact_target_allowlist_required": True,
        "idempotency_key_required": True,
        "rollback_disable_plan_required": True,
        "dry_run_evidence_required": True,
        "operator_final_confirmation_required": True,
    }
    assert status["execution_boundary"] == {
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "refusal_validation_only": True,
    }
    assert status["capabilities"]["disabled_executor_skeleton_readback_enabled"] is True
    assert status["capabilities"]["refusal_validation_enabled"] is True
    assert status["capabilities"]["execution_endpoint_present"] is True
    assert status["capabilities"]["adapter_binding_enabled"] is False
    assert status["capabilities"]["adapter_dispatch_enabled"] is False
    assert status["capabilities"]["runtime_command_execution_enabled"] is False
    assert status["capabilities"]["watcher_daemon_enabled"] is False
    assert status["capabilities"]["cron_enabled"] is False
    assert status["capabilities"]["target_mutation_enabled"] is False
    assert status["capabilities"]["kanban_mutation_enabled"] is False
    assert status["capabilities"]["nas_save_enabled"] is False
    assert status["capabilities"]["vps_file_change_enabled"] is False
    assert status["capabilities"]["service_restart_enabled"] is False
    assert status["capabilities"]["git_push_enabled"] is False
    assert status["capabilities"]["credential_access_enabled"] is False
    assert status["capabilities"]["public_exposure_enabled"] is False
    assert "runtime_command_execution" in status["forbidden_boundaries"]
    assert "target_mutation" in status["forbidden_boundaries"]
    assert status["redaction"]["raw_excluded"] is True
    serialized = repr(status)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "private-runtime-provider" not in serialized
    assert "Traceback" not in serialized
    assert "run-target" not in serialized


def test_disabled_one_shot_runtime_dispatch_executor_skeleton_refuses_execute_requests_without_echoing_raw_values():
    from hermes_cli.office_controlled_mutation import refuse_office_controlled_mutation_disabled_one_shot_runtime_dispatch

    result = refuse_office_controlled_mutation_disabled_one_shot_runtime_dispatch(
        {
            "target_ref": "office-target-1",
            "idempotency_key": "idem-1",
            "rollback_plan_ref": "rollback-1",
            "dry_run_evidence_ref": "dryrun-1",
            "operator_confirmation": True,
            "target_path": "/home/hermes/private-target.json",
            "token": "sk-private-runtime-token",
            "raw_command": "python /home/hermes/run-target.py",
        }
    )

    assert result["schema_version"] == 1
    assert result["mode"] == "disabled_one_shot_runtime_dispatch_executor_refusal"
    assert result["accepted"] is False
    assert result["dispatch_created"] is False
    assert result["runtime_command_executed"] is False
    assert result["target_mutation_created"] is False
    assert result["refusal_code"] == "runtime_dispatch_disabled_by_default"
    assert result["safe_validation"] == {
        "exact_target_allowlist_present": False,
        "idempotency_key_present": True,
        "rollback_disable_plan_present": True,
        "dry_run_evidence_present": True,
        "operator_confirmation_present": True,
    }
    assert result["missing_requirements"] == ["exact_target_allowlist"]
    serialized = repr(result)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
    assert "run-target" not in serialized


def test_disabled_one_shot_runtime_dispatch_executor_skeleton_api_is_protected_and_refuses_execution():
    from starlette.testclient import TestClient
    from hermes_cli.web_server import app, _SESSION_HEADER_NAME, _SESSION_TOKEN

    route = "/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton"
    execute_route = f"{route}/execute"
    with TestClient(app) as client:
        unauthenticated = client.get(route)
        assert unauthenticated.status_code == 401
        unauthenticated_execute = client.post(execute_route, json={"target_ref": "office-target-1"})
        assert unauthenticated_execute.status_code == 401

        authenticated = client.get(route, headers={_SESSION_HEADER_NAME: _SESSION_TOKEN})
        assert authenticated.status_code == 200
        refused = client.post(
            execute_route,
            headers={_SESSION_HEADER_NAME: _SESSION_TOKEN},
            json={
                "target_ref": "office-target-1",
                "idempotency_key": "idem-1",
                "rollback_plan_ref": "rollback-1",
                "dry_run_evidence_ref": "dryrun-1",
                "operator_confirmation": True,
                "target_path": "/home/hermes/private-target.json",
                "token": "sk-private-runtime-token",
            },
        )
        assert refused.status_code == 200

    payload = authenticated.json()
    assert payload["mode"] == "disabled_one_shot_runtime_dispatch_executor_skeleton"
    assert payload["disabled_one_shot_runtime_dispatch_executor_skeleton_complete"] is True
    assert payload["capabilities"]["execution_endpoint_present"] is True
    assert payload["capabilities"]["runtime_command_execution_enabled"] is False
    assert payload["capabilities"]["target_mutation_enabled"] is False

    result = refused.json()
    assert result["mode"] == "disabled_one_shot_runtime_dispatch_executor_refusal"
    assert result["accepted"] is False
    assert result["runtime_command_executed"] is False
    assert result["target_mutation_created"] is False
    serialized = repr(result)
    assert "sk-private" not in serialized
    assert "/home/hermes" not in serialized
