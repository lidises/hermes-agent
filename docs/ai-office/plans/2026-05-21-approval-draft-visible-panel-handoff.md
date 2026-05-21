# AI Office approval draft visible panel — 2026-05-21

## Scope

User approved continuing from approval-preflight visible panel with bounded write authority.

This pass made the protected manual approval-recording draft persistence/readback panel visible in the live `/office` DOM and exercised the existing draft-only write/readback route on the private VPS.

## Boundary

Allowed:

- Move the existing protected manual approval-recording draft status panel out of legacy diagnostic-only gating.
- Keep the panel display-only with stable DOM hooks and zero UI controls.
- Use the existing protected draft-only POST route to store one allowlisted safe-ref smoke record.
- Read back the stored draft through the protected GET route.
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

- `b81c79ee feat(office): surface approval draft status panel`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved `ManualApprovalRecordingDraftStatusPanel` before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so it is live-visible.
  - Removed its duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the draft panel is before the legacy diagnostic gate.

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

- Synced both worktrees to `b81c79ee`:
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

- `http://100.122.57.85:8765/office?approval-draft=b81c79ee`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell:

- POST `/api/office/controlled-mutation/manual-approval-recording-draft`
  - unauth=401
  - stored=true
  - dto.mode=`stored_manual_approval_recording_draft`
  - draft_status=`draft_only`
  - approval_record_written=false
  - dispatch_gate_open=false
  - unsafe extra sentinel was not echoed

- GET `/api/office/controlled-mutation/manual-approval-recording-draft-status?approval_record_ref=approval-b81c79ee-live-smoke-1224`
  - unauth=401
  - mode=`stored_manual_approval_recording_drafts_readback`
  - draft_count=1 for the queried ref
  - latest_refs.approval_record_ref=`approval-b81c79ee-live-smoke-1224`
  - risky capabilities false:
    - approval_recording_enabled=false
    - dispatch_gate_open=false
    - real_dispatch_execution_enabled=false
    - idempotency_replay_store_write_enabled=false
    - target_mutation_enabled=false
    - kanban_mutation_enabled=false
    - nas_save_enabled=false

## VPS live DOM smoke

Browser DOM at `/office?approval-draft=b81c79ee`:

- `data-office-manual-approval-recording-draft-status="true"`
  - exists=true
  - controls=0
  - draft-count=10 in global live readback
  - storage-enabled=true
  - readback-enabled=true
  - approval-recording-enabled=false
  - dispatch-gate-open=false
  - real-dispatch-enabled=false
  - replay-store-write-enabled=false
  - target-mutation-enabled=false
  - kanban-mutation-enabled=false
  - nas-save-enabled=false
  - body includes the safe smoke ref

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual approval-recording draft persistence/readback path is now visible in live `/office` via stable display-only DOM hooks. One bounded draft-only safe-ref record was written on the private VPS and read back. This did not write a real approval record, open a dispatch gate, write replay-store state, execute runtime commands, mutate targets, mutate Kanban, or write NAS.

## Next recommended rung

Continue to `manual_approval_recording_draft_review_status` visibility/readback.

Keep the review panel display-only. It may read the stored draft and project readiness for manual operator review, but `ready_for_real_approval_record_write` remains false until a separate exact approval/rollback gate. Continue to keep dispatch gate open, runtime command inclusion/execution, adapter binding/dispatch, replay-store write, rollback execution, target/Kanban/NAS/VPS mutation, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority false.

Last updated: 2026-05-21 12:24 KST
