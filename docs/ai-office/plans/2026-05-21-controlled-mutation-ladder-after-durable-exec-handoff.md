# AI Office controlled-mutation ladder after durable NAS Keeper execution — 2026-05-21

## Scope

User approved continuing from the recommended post-durable-execution rung and allowed bounded writes with slightly stronger authority.

This pass used the existing controlled-mutation local-profile helpers and advanced the ladder from metadata-only dispatch gate through runtime preview/inclusion/noop execution, exact target readiness, target marker, adapter-dispatch marker, Kanban marker, NAS-save marker, and NAS Keeper handoff queue marker.

## Safety boundary

Allowed in this pass:

- Local-profile controlled-mutation metadata writes.
- Bounded runtime-command inclusion and noop execution record.
- Marker records for target mutation, adapter dispatch, Kanban mutation, and NAS save.
- NAS Keeper handoff queue marker with a safe queued markdown body.
- Docs-only commit/push and VPS docs-only worktree sync.

Still not done / still closed:

- Watcher/cron/daemon activation.
- Real adapter dispatch beyond marker metadata.
- Real Kanban card transition or external Kanban mutation.
- Extra Mac relay real NAS execution of the new handoff item.
- Direct VPS NAS authority, mount, credentials, or direct write.
- Public exposure changes.
- Dashboard/gateway restart.
- Raw command, provider, target path, card body, markdown body, NAS path, credential, or token projection.

## Live precheck

Local:

- branch: `main`
- local HEAD before pass: `597d8e1af27461b18ab6d0f73fd1dfa5d9980ace`
- origin/main: `597d8e1af27461b18ab6d0f73fd1dfa5d9980ace`
- local git clean before metadata writes

Existing controlled-mutation local-profile store line counts before this pass:

- approval_record_drafts: 1
- approval_records: 1
- dispatch_gate_open_records: 1
- runtime_command_preview_records: 1
- runtime_command_inclusion_records: 1
- runtime_command_execution_records: 1
- target_mutation_readiness_records: 1
- target_mutation_records: 1
- adapter_dispatch_records: 1
- kanban_mutation_records: 1
- nas_save_records: 1

VPS read-only precheck:

- dashboard HEAD: `597d8e1a`
- dashboard dirty count: 0
- agent HEAD: `597d8e1af`
- agent dirty count: 0
- dashboard service: active
- gateway service: active

## New safe refs

Suffix: `durable-exec-20260521-014337`

- approval: `approval-durable-exec-20260521-014337`
- gate: `gate-durable-exec-20260521-014337`
- cmdpreview: `cmdpreview-durable-exec-20260521-014337`
- cmd: `cmd-durable-exec-20260521-014337`
- exec: `exec-durable-exec-20260521-014337`
- targetready: `targetready-durable-exec-20260521-014337`
- targetmut: `targetmut-durable-exec-20260521-014337`
- adapterdispatch: `adapterdispatch-durable-exec-20260521-014337`
- kanbanmut: `kanbanmut-durable-exec-20260521-014337`
- nassave: `nassave-durable-exec-20260521-014337`
- handoff: `handoff-durable-exec-20260521-014337`

## Records written

All writes used existing local-profile helpers.

1. Approval draft
   - stored=true
   - mode=`stored_manual_approval_recording_draft`
2. Bounded approval record
   - stored=true
   - mode=`stored_manual_approval_record`
3. Dispatch-gate-open metadata
   - stored=true
   - mode=`stored_manual_dispatch_gate_open_record`
   - dispatch_gate_open=true
4. Runtime-command preview checksum metadata
   - stored=true
   - mode=`stored_manual_runtime_command_preview_record`
   - runtime_command_preview_created=true
5. Runtime-command inclusion metadata
   - stored=true
   - mode=`stored_manual_runtime_command_inclusion_record`
   - runtime_command_included=true
6. Noop runtime execution record
   - stored=true
   - mode=`stored_manual_runtime_command_execution_record`
   - runtime_command_executed=true
   - idempotency_replay_store_written=true
7. Exact target readiness record
   - stored=true
   - mode=`stored_manual_target_mutation_readiness_record`
   - target_mutation_readiness_verified=true
8. Target mutation marker
   - stored=true
   - mode=`stored_manual_target_mutation_record`
   - target_mutation_created=true
9. Adapter dispatch marker
   - stored=true
   - mode=`stored_manual_adapter_dispatch_record`
   - adapter_dispatch_created=true
10. Kanban mutation marker
    - stored=true
    - mode=`stored_manual_kanban_mutation_record`
    - kanban_mutation_created=true
11. NAS save marker
    - stored=true
    - mode=`stored_manual_nas_save_record`
    - nas_save_created=true
    - vps_direct_nas_authority_enabled=false
    - real_nas_execution_enabled=false
    - real_dispatch_execution_enabled=false
12. NAS Keeper handoff queue marker
    - queued=true
    - mode=`manual_nas_keeper_handoff_queued`
    - nas_keeper_handoff_queued=true
    - actual_nas_write_enabled=false

## Readback verification

Filtered readback counts for the new refs:

- drafts: 1
- approvals: 1
- gates: 1
- previews: 1
- inclusions: 1
- executions: 1
- target readiness: 1
- target mutations: 1
- adapter dispatch: 1
- Kanban mutations: 1
- NAS saves: 1
- NAS Keeper handoffs: 1

Key readback flags:

- dispatch_gate_open=true
- runtime_command_preview_created=true
- runtime_command_included=true
- runtime_command_executed=true
- idempotency_replay_store_written=true
- target_mutation_readiness_verified=true
- target_mutation_created=true
- adapter_dispatch_created=true
- kanban_mutation_created=true
- nas_save_created=true
- nas_keeper_handoff_queued=true
- actual_nas_write_enabled=false
- vps_direct_nas_authority_enabled=false
- real_nas_execution_enabled=false
- real_dispatch_execution_enabled=false

Safety scan:

- refined raw-value leak scan passed.
- no unsafe raw command/provider/target/card/markdown/NAS path/token sentinel values appeared in readback.
- field-name-only redaction metadata was not treated as a value leak.

## Regression checks

- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` passed.
- `PYTHONPATH=. .venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py -q -o 'addopts='` passed: 31 passed.
- `git diff --check` passed.

## Result

The bounded controlled-mutation marker ladder is now complete through NAS Keeper handoff queue marker for the post-durable-execution chain. This is still metadata/marker/queue handoff only at the final rung: the newly queued handoff item has not been authorized for Mac relay execution and has not been executed against NAS.

## Next recommended rung

If continuing with bounded write authority, the next rung is NAS Keeper authorization + execution payload preview for the new handoff item:

1. authorize `handoff-durable-exec-20260521-014337` for Mac relay execution review;
2. preview the Mac relay execution payload with markdown body excluded;
3. verify queue status/readback and raw-leak flags;
4. stop before watcher/cron/daemon activation, direct VPS NAS authority, public exposure, or gateway restart.

Last updated: 2026-05-21 10:48 KST
