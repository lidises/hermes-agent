# AI Office runtime command execution noop record — 2026-05-21

## Scope

User approved continuing from runtime-command inclusion into the next bounded write rung.

This pass hardened the live `/office` regression for the protected manual runtime command execution record panel and exercised the existing protected runtime-command-execution noop/idempotency POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualRuntimeCommandExecutionRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Add cumulative uniqueness regression for the execution panel.
- Use the existing protected runtime command execution POST route against an existing bounded inclusion record.
- Store only noop-probe execution metadata and idempotency metadata.
- Set `runtime_command_executed=true` only for the approved noop probe lane.
- Read back the stored execution record through the protected GET route.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Adapter binding or dispatch.
- Rollback execution.
- Target mutation.
- Kanban mutation.
- NAS save/write.
- VPS file/service/git mutation beyond the approved dashboard deploy/docs sync.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.
- Real target dispatch execution.

## Code/test change

Commit:

- `c9c4dd43 test(office): harden runtime command execution panel placement`

Files changed:

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert `ManualRuntimeCommandExecutionRecordStatusPanel` has no second duplicate occurrence.

Note: the execution panel was already live-visible and unique before this slice, so the added regression passed immediately. No production source change was required for visibility.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py`
  - `31 passed`
- Frontend tests in `web/`:
  - focused placement test passed
  - `src/lib/api.test.ts`
  - `src/pages/OfficePage.rpg.test.tsx`
  - `145 passed`
- `npm run build` in `web/`:
  - passed
  - existing Vite large chunk warning only
- `git diff --check`:
  - passed
- added-line sentinel scan:
  - no newly added raw path/token/provider sentinels

## VPS deploy

- Synced both worktrees to `c9c4dd43`:
  - dashboard worktree
  - core Hermes worktree
- Rsynced local built `hermes_cli/web_dist/` to both worktrees.
- Restarted:
  - `hermes-agent-dashboard.service`
- Did not restart:
  - `hermes-gateway.service`
- Final services:
  - dashboard active
  - gateway active

## VPS protected API smoke

URL shell:

- `http://100.122.57.85:8765/office?runtime-execution=c9c4dd43`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing inclusion source:

- `cmd-2cedb274-live-smoke-1320`

New execution record refs:

- `runtime_execution_ref=exec-c9c4dd43-live-smoke-1405`
- `idempotency_key=idem-c9c4dd43-live-smoke-1405`

POST `/api/office/controlled-mutation/manual-runtime-command-execution-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_runtime_command_execution_record`
- runtime_command_ref=`cmd-2cedb274-live-smoke-1320`
- runtime_execution_ref=`exec-c9c4dd43-live-smoke-1405`
- idempotency_key=`idem-c9c4dd43-live-smoke-1405`
- runtime_command_executed=true
- idempotency_replay_store_written=true
- runtime_execution_result=`noop_probe_succeeded`
- target_mutation_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed
- shell command / credential fields were not included in the DTO

GET `/api/office/controlled-mutation/manual-runtime-command-execution-record-status?runtime_execution_ref=exec-c9c4dd43-live-smoke-1405`:

- unauth=401
- mode=`stored_manual_runtime_command_execution_records_readback`
- runtime_command_execution_record_count=1 for the queried ref
- latest ref=`exec-c9c4dd43-live-smoke-1405`
- latest runtime_command_executed=true
- risky capabilities false:
  - adapter_dispatch_enabled=false
  - adapter_binding_enabled=false
  - target_mutation_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
  - real_dispatch_execution_enabled=false
  - service_restart_enabled=false
  - git_push_enabled=false
  - vps_file_change_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?runtime-execution=c9c4dd43`:

- `data-office-manual-runtime-command-execution-record-status="true"`
  - exists=true
  - controls=0
  - count=10 global profile-scoped records
  - page body includes the safe execution smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual runtime command execution path has now crossed the bounded noop-probe execution write rung. An execution record was written on the private VPS and read back. This sets `runtime_command_executed=true` and `idempotency_replay_store_written=true` only for the safe noop probe lane; it did not dispatch adapters, rollback, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_target_mutation_readiness_record` only if the next prompt keeps bounded write approval.

This next rung should project or store target mutation readiness metadata after noop execution. It must still avoid actual target mutation, adapter dispatch, Kanban/NAS/VPS mutation, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority.

Last updated: 2026-05-21 14:08 KST
