# AI Office approval dispatch readiness visible panel — 2026-05-21

## Scope

User approved continuing from the bounded manual approval-record write into the next recommended rung.

This pass made the protected manual approval dispatch-gate readiness/readback panel visible in live `/office` as display-only UI. It reads the stored bounded approval record and projects readiness metadata only.

## Boundary

Allowed:

- Move the existing protected `ManualApprovalDispatchGateReadinessPanel` out of legacy diagnostic-only gating.
- Keep the panel display-only with stable DOM hooks and zero UI controls.
- Read the existing bounded manual approval record through the protected GET route.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Dispatch gate open write.
- Runtime command materialization, inclusion, or execution.
- Adapter binding or dispatch.
- Idempotency replay-store write.
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

## Code change

Commit:

- `b295a5f5 feat(office): surface approval dispatch readiness panel`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved `ManualApprovalDispatchGateReadinessPanel` before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so it is live-visible.
  - Removed its duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the dispatch readiness panel is before the legacy diagnostic gate.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py`
  - `31 passed`
- Frontend tests in `web/`:
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

- Synced both worktrees to `b295a5f5`:
  - `/home/hermes/.hermes/ai-office-dashboard`
  - `/home/hermes/.hermes/hermes-agent`
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

- `http://100.122.57.85:8765/office?dispatch-readiness=b295a5f5`

Protected route called with `X-Hermes-Session-Token` from the SPA shell.

Existing approval record source:

- `approval-b81c79ee-live-smoke-1224`

GET `/api/office/controlled-mutation/manual-approval-dispatch-gate-readiness-status?approval_record_ref=approval-b81c79ee-live-smoke-1224`:

- unauth=401
- mode=`manual_approval_dispatch_gate_readiness_status`
- manual_approval_dispatch_gate_readiness_complete=true
- readiness.approval_record_present=true
- readiness.approval_record_written=true
- readiness.ready_for_dispatch_gate_open=false
- readiness.ready_for_runtime_dispatch_execution=false
- readiness.exact_target_allowlist_ref=`allowlist-b81c79ee-live-smoke-1224`
- readiness.idempotency_key=`idem-b81c79ee-live-smoke-1224`
- execution boundary false:
  - dispatch_gate_open=false
  - runtime_command_included=false
  - runtime_command_executed=false
  - target_mutation_created=false
  - kanban_mutation_created=false
  - nas_save_created=false
  - watcher_or_cron_created=false
  - vps_file_change_created=false
- risky capabilities false:
  - real_dispatch_execution_enabled=false
  - adapter_binding_enabled=false
  - adapter_dispatch_enabled=false
  - idempotency_replay_store_write_enabled=false
  - rollback_execution_enabled=false
  - target_mutation_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - service_restart_enabled=false
  - git_push_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?dispatch-readiness=b295a5f5`:

- `data-office-manual-approval-dispatch-gate-readiness-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - approval-record-present=true
  - ready-for-gate-open=false
  - runtime-execution-ready=false
  - dispatch-gate-open=false
  - real-dispatch-enabled=false
  - page body includes the safe smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual approval dispatch-gate readiness path is now visible in live `/office`. It reads the bounded approval record and projects readiness metadata only. It did not open the dispatch gate, include or execute runtime commands, bind/dispatch adapters, write replay-store state, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_dispatch_gate_open_record` only if the next prompt keeps bounded write approval.

This next rung is a stronger write boundary: it may record dispatch-gate-open metadata, but must still keep runtime command inclusion/execution=false, adapter binding/dispatch=false, replay-store write=false, rollback execution=false, target/Kanban/NAS/VPS mutation=false, service/git/credential/public authority=false, watcher/cron=false, gateway restart=false, and direct VPS NAS authority=false.

Last updated: 2026-05-21 12:49 KST
