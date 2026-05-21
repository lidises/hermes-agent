# AI Office runtime readiness visible panels — 2026-05-21

## Scope

User approved continuing from the protected API runtime-readiness evidence pass with bounded write authority.

This pass made the runtime-readiness evidence visible in the live `/office` DOM while keeping the panels display-only and keeping all runtime/automation/mutation/public/credential boundaries closed.

## Boundary

Allowed:

- Move existing runtime-readiness status panels out of legacy diagnostic-only gating.
- Keep panels display-only with stable DOM hooks and zero controls.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Adapter dispatch.
- Authority-adapter binding.
- Target mutation.
- Kanban mutation.
- NAS save/write.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.

## Code change

Commit:

- `b603b5d3 feat(office): surface runtime readiness status panels`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved these panels before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so they are live-visible:
    - `RuntimeActivationReviewStatusPanel`
    - `RuntimePreflightStatusPanel`
    - `ManualOneShotRuntimeDryRunStatusPanel`
  - Removed their duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended placement regression to assert the three runtime-readiness panels are before the legacy diagnostic gate.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - runtime activation review
  - runtime preflight
  - manual one-shot runtime dry-run
  - `6 passed`
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

- Synced both worktrees to `b603b5d3`:
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

- `http://100.122.57.85:8765/office?runtime-panels=b603b5d3`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell:

- `/api/office/controlled-mutation/runtime-activation-review-status`
  - unauth=401
  - auth mode=`runtime_activation_review_status`
  - complete=true
  - raw_excluded=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/runtime-preflight-status`
  - unauth=401
  - auth mode=`runtime_preflight_status`
  - complete=true
  - raw_excluded=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/manual-one-shot-runtime-dry-run-status`
  - unauth=401
  - auth mode=`manual_one_shot_runtime_dry_run_status`
  - complete=true
  - errors=[]
  - risky capabilities all false

## VPS live DOM smoke

Browser DOM at `/office?runtime-panels=b603b5d3`:

- `data-office-runtime-activation-review-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - watcher/cron/dispatch/target/Kanban/NAS/VPS-file/service/git/credential/public all false
  - raw-excluded=true
- `data-office-runtime-preflight-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - runtime-ready=false
  - watcher/cron/dispatch/target/Kanban/NAS/VPS-file/service/git/credential/public all false
  - raw-excluded=true
- `data-office-manual-one-shot-runtime-dry-run-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - runtime-execution=false
  - watcher/cron/dispatch/target/Kanban/NAS/VPS-file/service/git/credential/public all false

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The runtime-readiness evidence is now visible in live `/office` via stable display-only DOM hooks and protected API readback. It remains explicitly not ready for runtime activation, and every risky capability remains false.

## Next recommended rung

Continue only through protected readback/status or bounded metadata-write rungs already in the ladder. Do not activate watcher/cron/daemon or open adapter dispatch/target/Kanban/NAS mutation yet.

A possible next bounded rung is to continue with the next protected status/readback lane after the runtime-readiness panels, preserving:

- no runtime command execution unless the lane is the already-approved noop-probe-only execution rung;
- no adapter dispatch unless an explicit dispatch boundary is named;
- no target/Kanban/NAS mutation without separate exact approval and rollback;
- no direct VPS NAS authority;
- no public exposure or gateway restart.

Last updated: 2026-05-21 11:36 KST
