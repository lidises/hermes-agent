# AI Office manual approval record visible panel — 2026-05-21

## Scope

User's standing goal approved continuing from approval-draft-review visibility into the next bounded write rung.

This pass made the protected manual approval-record write/readback panel visible in live `/office` and exercised the existing protected approval-record-only POST/GET routes on the private VPS against the existing draft-only smoke record.

## Boundary

Allowed:

- Move the existing protected manual approval record status panel out of legacy diagnostic-only gating.
- Keep the panel display-only with stable DOM hooks and zero UI controls.
- Use the existing protected approval-record-only POST route to promote one existing draft-only safe-ref record into a bounded manual approval record.
- Read back the stored approval record through the protected GET route.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Dispatch gate open.
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

- `cde041cb feat(office): surface manual approval record panel`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved `ManualApprovalRecordStatusPanel` before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so it is live-visible.
  - Removed its duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the manual approval record panel is before the legacy diagnostic gate.

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

- Synced both worktrees to `cde041cb`:
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

- `http://100.122.57.85:8765/office?manual-approval-record=cde041cb`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing draft source:

- `approval-b81c79ee-live-smoke-1224`

POST `/api/office/controlled-mutation/manual-approval-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_approval_record`
- approval_status=`recorded_manual_approval`
- approval_record_written=true
- dispatch_gate_open=false
- runtime_command_included=false
- runtime_command_executed=false
- target_mutation_created=false
- unsafe extra sentinel was not echoed

GET `/api/office/controlled-mutation/manual-approval-record-status?approval_record_ref=approval-b81c79ee-live-smoke-1224`:

- unauth=401
- mode=`stored_manual_approval_records_readback`
- approval_record_count=1 for the queried ref
- latest_refs.approval_record_ref=`approval-b81c79ee-live-smoke-1224`
- approval_recording_enabled=true
- risky capabilities false:
  - dispatch_gate_open=false
  - real_dispatch_execution_enabled=false
  - target_mutation_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - idempotency_replay_store_write_enabled=false
  - adapter_dispatch_enabled=false
  - runtime_command_execution_enabled=false

## VPS live DOM smoke

Browser DOM at `/office?manual-approval-record=cde041cb`:

- `data-office-manual-approval-record-status="true"`
  - exists=true
  - controls=0
  - approval-record-count=10 in global live readback
  - approval-record-written=true
  - dispatch-gate-open=false
  - real-dispatch-enabled=false
  - target-mutation-enabled=false
  - page body includes the safe smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual approval record write/readback path is now visible in live `/office` via stable display-only DOM hooks. One bounded approval-record-only safe-ref record was written on the private VPS from an existing draft and read back. This wrote `approval_record_written=true` only; it did not open dispatch, include/execute runtime commands, dispatch adapters, write replay-store state, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_approval_dispatch_gate_readiness_status` visibility/readback.

This next rung should read the stored bounded approval record and project dispatch-gate readiness only. It must keep `ready_for_dispatch_gate_open=false`, `ready_for_runtime_dispatch_execution=false`, dispatch gate open=false, runtime command inclusion/execution=false, adapter binding/dispatch=false, replay-store write=false, rollback execution=false, target/Kanban/NAS/VPS mutation=false, service/git/credential/public authority=false, watcher/cron=false, gateway restart=false, and direct VPS NAS authority=false.

Last updated: 2026-05-21 12:39 KST
