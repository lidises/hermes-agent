# AI Office dispatch readiness visible panels — 2026-05-21

## Scope

User approved continuing from runtime-readiness visible panels with bounded write authority.

This pass made the next protected dispatch-readiness/readback ladder visible in the live `/office` DOM while keeping every panel display-only and keeping all real runtime/adapter/target/Kanban/NAS/public/credential boundaries closed.

## Boundary

Allowed:

- Move existing protected status/design panels out of legacy diagnostic-only gating.
- Keep panels display-only with stable DOM hooks and zero controls.
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

- `5507b16c feat(office): surface dispatch readiness status panels`

Files changed:

- `web/src/pages/OfficePage.tsx`
  - Moved these panels before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES` so they are live-visible:
    - `AdapterBindingDryRunStatusPanel`
    - `HumanReviewedSingleDispatchStatusPanel`
    - `ExplicitRuntimeDispatchApprovalStatusPanel`
    - `ConcreteRuntimeSingleDispatchSliceDesignPanel`
  - Removed their duplicate legacy-only placement.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extended placement regression to assert the four dispatch-readiness panels are before the legacy diagnostic gate.

## Local verification

- Backend py_compile:
  - `hermes_cli/office_controlled_mutation.py`
  - `hermes_cli/web_server.py`
  - passed
- Focused backend tests:
  - adapter binding dry-run status
  - human-reviewed single dispatch status
  - explicit runtime dispatch approval status
  - concrete runtime single-dispatch slice design
  - `8 passed`
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

- Synced both worktrees to `5507b16c`:
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

- `http://100.122.57.85:8765/office?dispatch-panels=5507b16c`

Protected routes called with `X-Hermes-Session-Token` from the SPA shell:

- `/api/office/controlled-mutation/adapter-binding-dry-run-status`
  - unauth=401
  - auth mode=`adapter_binding_dry_run_status`
  - complete=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/human-reviewed-single-dispatch-status`
  - unauth=401
  - auth mode=`human_reviewed_single_dispatch_status`
  - complete=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/explicit-runtime-dispatch-approval-status`
  - unauth=401
  - auth mode=`explicit_runtime_dispatch_approval_status`
  - complete=true
  - errors=[]
  - risky capabilities all false
- `/api/office/controlled-mutation/concrete-runtime-single-dispatch-slice-design`
  - unauth=401
  - auth mode=`concrete_runtime_single_dispatch_slice_design`
  - complete=true
  - errors=[]
  - risky capabilities all false

## VPS live DOM smoke

Browser DOM at `/office?dispatch-panels=5507b16c`:

- `data-office-adapter-binding-dry-run-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - registry/plan metadata enabled=true
  - binding/dispatch/runtime/target/Kanban/NAS/VPS-file/service/git/credential/public/watcher/cron false
- `data-office-human-reviewed-single-dispatch-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - candidate/approval metadata enabled=true
  - binding/dispatch/runtime/target/Kanban/NAS/VPS-file/service/git/credential/public/watcher/cron false
- `data-office-explicit-runtime-dispatch-approval-status="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - criteria/runtime-boundary readback enabled=true
  - binding/dispatch/runtime/target/Kanban/NAS/VPS-file/service/git/credential/public/watcher/cron false
- `data-office-concrete-runtime-single-dispatch-slice-design="true"`
  - exists=true
  - controls=0
  - complete=true
  - readback-enabled=true
  - envelope/allowlist/rollback/evidence/idempotency/runtime-gate metadata enabled=true
  - binding/dispatch/runtime/target/Kanban/NAS/VPS-file/service/git/credential/public/watcher/cron false

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## Result

The dispatch-readiness design chain is now visible in live `/office` via stable display-only DOM hooks and protected API readback. It is still not an activation or execution boundary. Real adapter binding, adapter dispatch, runtime execution, target/Kanban/NAS mutation, direct VPS NAS authority, public exposure, and gateway restart remain closed.

## Next recommended rung

Continue to the next protected readback/status lane after the concrete single-dispatch design. The immediate safe candidate is the disabled one-shot runtime dispatch executor skeleton visibility/readback path, preserving refusal-only behavior and zero executable controls.

Do not activate watcher/cron/daemon, open adapter dispatch, write target/Kanban/NAS mutation, add direct VPS NAS authority, change public exposure, or restart gateway without a separate exact approval/rollback/kill-switch boundary.

Last updated: 2026-05-21 11:47 KST
