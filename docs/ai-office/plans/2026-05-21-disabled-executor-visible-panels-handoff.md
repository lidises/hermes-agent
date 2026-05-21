# AI Office disabled executor visible panels — 2026-05-21

## Scope

User approved continuing from dispatch-readiness visible panels with bounded write authority.

This pass made the next protected executor-readiness/readback panels visible in the live `/office` DOM while preserving refusal-only and display-only behavior.

## Boundary

Allowed:

- Move existing protected readback/design panels out of legacy diagnostic-only gating.
- Keep panels display-only with stable DOM hooks and zero controls.
- Exercise the existing disabled executor POST route only as safe refusal metadata.
- Rebuild dashboard assets, deploy to the VPS dashboard, and restart only `hermes-agent-dashboard.service`.
- Smoke private `/office` DOM and protected APIs.

Still not done / still closed:

- Watcher/cron/daemon activation.
- Systemd unit or cron file creation.
- Adapter binding.
- Adapter dispatch.
- Real dispatch approval recording.
- Runtime command materialization/execution.
- Target mutation.
- Kanban mutation.
- NAS save/write.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Gateway restart.

## Code change

Commit:

- `5676ba6d feat(office): surface disabled executor status panels`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved these panels before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so they are live-visible:
    - `DisabledOneShotRuntimeDispatchExecutorSkeletonPanel`
    - `ApprovedRealOneShotDispatchGateDesignPanel`
  - Removed their duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended placement regression to assert these panels are before the legacy diagnostic gate.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - disabled one-shot runtime dispatch executor skeleton
  - approved real one-shot dispatch gate design
  - `7 passed`
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

- Synced both worktrees to `5676ba6d`:
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

- `http://100.122.57.85:8765/office?disabled-executor=5676ba6d`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell:

- `/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton`
  - unauth=401
  - auth mode=`disabled_one_shot_runtime_dispatch_executor_skeleton`
  - complete=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/approved-real-one-shot-dispatch-gate-design`
  - unauth=401
  - auth mode=`approved_real_one_shot_dispatch_gate_design`
  - complete=true
  - errors=[]
  - risky capabilities all false

Refusal-only POST route smoke:

- `/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton/execute`
  - mode=`disabled_one_shot_runtime_dispatch_executor_refusal`
  - refusal_code=`runtime_dispatch_disabled_by_default`
  - accepted=false
  - dispatch_created=false
  - runtime_command_executed=false
  - target_mutation_created=false
  - unsafe extra sentinel was not echoed

## VPS live DOM smoke

Browser DOM at `/office?disabled-executor=5676ba6d`:

- `data-office-disabled-one-shot-runtime-dispatch-executor-skeleton="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - endpoint-present=true
  - refusal-validation-enabled=true
  - runtime-gate-open=false
  - dispatch-approved=false
  - binding/dispatch/runtime/target/Kanban/NAS/VPS-file/service/git/credential/public/watcher/cron false
- `data-office-approved-real-one-shot-dispatch-gate-design="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - real-dispatch-enabled=false
  - approval-recording-enabled=false
  - replay-store-write-enabled=false
  - target-mutation-enabled=false

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The disabled executor/refusal-only readiness path is now visible in live `/office` via stable display-only DOM hooks and protected API readback. The existing executor POST route was exercised only for safe refusal metadata and did not create dispatch, execute runtime commands, or mutate targets.

The approved real one-shot dispatch gate design is also visible as a design/readback panel only. It is not approval recording and not dispatch.

## Next recommended rung

Continue to `manual_approval_recording_preflight_status` visibility/readback/refusal-only verification, keeping it display-only in the page and refusal-only in protected POST behavior.

Do not activate watcher/cron/daemon, open adapter dispatch, write target/Kanban/NAS mutation, add direct VPS NAS authority, change public exposure, or restart gateway without a separate exact approval/rollback/kill-switch boundary.

Last updated: 2026-05-21 11:57 KST
