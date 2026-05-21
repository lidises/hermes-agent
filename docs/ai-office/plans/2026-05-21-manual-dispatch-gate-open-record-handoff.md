# AI Office manual dispatch gate open record — 2026-05-21

## Scope

User approved continuing from approval-backed dispatch-gate readiness into the next bounded write rung.

This pass hardened the live `/office` placement for the protected manual dispatch gate open record panel and exercised the existing protected dispatch-gate-open metadata-only POST/GET routes on the private VPS.

## Boundary

Allowed:

- Keep `ManualDispatchGateOpenRecordStatusPanel` live-visible before the legacy diagnostic gate.
- Remove the duplicate legacy-only panel instance so the live surface has one canonical placement.
- Use the existing protected dispatch-gate-open metadata-only POST route against an existing bounded approval record.
- Read back the stored gate-open record through the protected GET route.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

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

- `8d774767 feat(office): harden dispatch gate open panel placement`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Removed the duplicate legacy-only `ManualDispatchGateOpenRecordStatusPanel` placement.
  - The canonical panel remains live-visible before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the manual dispatch gate open record panel has no second duplicate occurrence.

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

- Synced both worktrees to `8d774767`:
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

- `http://100.122.57.85:8765/office?gate-open=8d774767`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell.

Existing approval record source:

- `approval-b81c79ee-live-smoke-1224`

New gate-open metadata ref:

- `gate-8d774767-live-smoke-1255`

POST `/api/office/controlled-mutation/manual-dispatch-gate-open-record`:

- unauth=401
- stored=true
- dto.mode=`stored_manual_dispatch_gate_open_record`
- dispatch_gate_ref=`gate-8d774767-live-smoke-1255`
- approval_record_ref=`approval-b81c79ee-live-smoke-1224`
- dispatch_gate_open=true
- runtime_command_included=false
- runtime_command_executed=false
- target_mutation_created=false
- kanban_mutation_created=false
- nas_save_created=false
- real_dispatch_execution_enabled=false
- unsafe extra sentinel was not echoed

GET `/api/office/controlled-mutation/manual-dispatch-gate-open-record-status?dispatch_gate_ref=gate-8d774767-live-smoke-1255`:

- unauth=401
- mode=`stored_manual_dispatch_gate_open_records_readback`
- dispatch_gate_open_record_count=1 for the queried ref
- latest ref=`gate-8d774767-live-smoke-1255`
- capabilities.dispatch_gate_open=true
- risky capabilities false:
  - runtime_command_execution_enabled=false
  - real_dispatch_execution_enabled=false
  - adapter_dispatch_enabled=false
  - target_mutation_enabled=false
  - kanban_mutation_enabled=false
  - nas_save_enabled=false
  - rollback_execution_enabled=false
  - credential_access_enabled=false
  - public_exposure_enabled=false
- raw leak sentinels absent

## VPS live DOM smoke

Browser DOM at `/office?gate-open=8d774767`:

- `data-office-manual-dispatch-gate-open-record-status="true"`
  - exists=true
  - controls=0
  - gate-open=true
  - runtime-executed=false
  - real-dispatch-enabled=false
  - page body includes the safe gate smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual dispatch gate open record path has now crossed the bounded metadata-only write rung. A gate-open metadata record was written on the private VPS and read back. This sets `dispatch_gate_open=true` only for the metadata boundary; it did not include or execute runtime commands, dispatch adapters, write replay-store state, rollback, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_runtime_command_preview_record` only if the next prompt keeps bounded write approval.

This next rung may store runtime-command preview metadata/checksum only. It must still keep raw command inclusion=false, runtime execution=false, adapter dispatch=false, replay-store write=false, rollback=false, target/Kanban/NAS/VPS mutation=false, service/git/credential/public authority=false, watcher/cron=false, gateway restart=false, and direct VPS NAS authority=false.

Last updated: 2026-05-21 12:58 KST
