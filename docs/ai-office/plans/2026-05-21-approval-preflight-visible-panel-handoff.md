# AI Office approval preflight visible panel — 2026-05-21

## Scope

User approved continuing from disabled-executor visible panels with bounded write authority.

This pass made the protected manual approval-recording preflight/readback panel visible in the live `/office` DOM while preserving refusal-only and display-only behavior.

## Boundary

Allowed:

- Move the existing protected manual approval-recording preflight status panel out of legacy diagnostic-only gating.
- Keep the panel display-only with stable DOM hooks and zero controls.
- Exercise the existing preflight POST route only as safe refusal metadata.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Real approval record write.
- Dispatch gate open.
- Runtime command materialization or execution.
- Adapter binding or dispatch.
- Target mutation.
- Kanban mutation.
- NAS save/write.
- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.

## Code change

Commit:

- `67cae610 feat(office): surface approval preflight status panel`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved `ManualApprovalRecordingPreflightStatusPanel` before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so it is live-visible.
  - Removed its duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended the cumulative placement regression to assert the preflight panel is before the legacy diagnostic gate.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - `tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_preflight.py`
  - `4 passed`
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

- Synced both worktrees to `67cae610`:
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

- `http://100.122.57.85:8765/office?approval-preflight=67cae610`

Protected route called with `X-Hermes-Session-Token` from the SPA shell:

- `/api/office/controlled-mutation/manual-approval-recording-preflight`
  - unauth=401
  - auth mode=`manual_approval_recording_preflight_status`
  - complete=true
  - errors=[]
  - risky capabilities all false

Refusal-only POST route smoke:

- `/api/office/controlled-mutation/manual-approval-recording-preflight/preflight`
  - mode=`manual_approval_recording_preflight_refusal`
  - refusal_code=`approval_recording_disabled_by_default`
  - accepted=false
  - approval_record_written=false
  - dispatch_gate_open=false
  - runtime_command_executed=false
  - target_mutation_created=false
  - idempotency_replay_store_written=false
  - unsafe extra sentinel was not echoed

## VPS live DOM smoke

Browser DOM at `/office?approval-preflight=67cae610`:

- `data-office-manual-approval-recording-preflight="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - approval-recording-enabled=false
  - real-dispatch-enabled=false
  - replay-store-write-enabled=false
  - target-mutation-enabled=false

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The manual approval-recording preflight/refusal-only readiness path is now visible in live `/office` via stable display-only DOM hooks and protected API readback. The existing preflight POST route was exercised only for safe refusal metadata and did not write an approval record, open a dispatch gate, execute runtime commands, write replay-store metadata, or mutate targets.

## Next recommended rung

Continue to `manual_approval_recording_draft_persistence`, the first bounded draft-only write/readback rung.

The draft-only write may store only allowlisted safe refs and explicit `draft_status=draft_only`, while keeping real approval record write, dispatch gate open, runtime command inclusion/execution, adapter binding/dispatch, replay-store write, rollback execution, target/Kanban/NAS/VPS mutation, service/git/credential/public authority, watcher/cron, gateway restart, and direct VPS NAS authority false.

Last updated: 2026-05-21 12:11 KST
