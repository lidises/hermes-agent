# AI Office approval draft review visible panel — 2026-05-21

## Scope

User approved continuing from approval-draft visible panel with bounded write authority.

This pass made the protected manual approval-recording draft review/readiness panel visible in the live `/office` DOM and exercised the existing protected readback route against the previously stored draft-only smoke record.

## Boundary

Allowed:

- Move the existing protected manual approval-recording draft review status panel out of legacy diagnostic-only gating.
- Keep the panel display-only with stable DOM hooks and zero UI controls.
- Read the existing draft-only smoke record through the protected review GET route.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Real approval record write.
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

- `e9564d9f feat(office): surface approval draft review panel`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved `ManualApprovalRecordingDraftReviewStatusPanel` before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so it is live-visible.
  - Removed its duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the draft review panel is before the legacy diagnostic gate.

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

- Synced both worktrees to `e9564d9f`:
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

- `http://100.122.57.85:8765/office?approval-draft-review=e9564d9f`

Protected route called with `X-Hermes-Session-Token` from the SPA shell:

- GET `/api/office/controlled-mutation/manual-approval-recording-draft-review-status?approval_record_ref=approval-b81c79ee-live-smoke-1224`
  - unauth=401
  - mode=`manual_approval_recording_draft_review_status`
  - complete=true
  - errors=[]
  - review.draft_present=true
  - review.draft_status=`draft_only`
  - review.ready_for_manual_operator_review=true
  - review.ready_for_real_approval_record_write=false
  - execution_boundary.approval_record_written=false
  - execution_boundary.dispatch_gate_open=false
  - execution_boundary.runtime_command_executed=false
  - execution_boundary.target_mutation_created=false
  - risky capabilities false

## VPS live DOM smoke

Browser DOM at `/office?approval-draft-review=e9564d9f`:

- `data-office-manual-approval-recording-draft-review-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - draft-present=true
  - manual-review-ready=true
  - real-write-ready=false
  - approval-recording-enabled=false
  - dispatch-gate-open=false
  - real-dispatch-enabled=false
  - target-mutation-enabled=false
  - page body includes the safe smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual approval-recording draft review/readiness path is now visible in live `/office` via stable display-only DOM hooks. It reads an existing draft-only safe-ref record and projects manual review readiness while keeping real approval record write and all dispatch/runtime/target/Kanban/NAS authorities closed.

## Next recommended rung

Continue to `manual_approval_record_write_gate` only if the user wants to cross the next stronger write boundary.

The next rung may write a real approval record from an existing draft, but it must still keep dispatch gate open=false, runtime command inclusion/execution=false, adapter binding/dispatch=false, replay-store write=false, rollback execution=false, target/Kanban/NAS/VPS mutation=false, service/git/credential/public authority=false, watcher/cron=false, gateway restart=false, and direct VPS NAS authority=false. Require exact approval wording before promoting a draft to a real approval record.

Last updated: 2026-05-21 12:31 KST
