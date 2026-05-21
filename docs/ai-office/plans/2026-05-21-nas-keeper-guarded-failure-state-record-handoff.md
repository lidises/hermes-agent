# AI Office NAS keeper guarded failure execution-state record — 2026-05-21

## Scope

User approved continuing from execution-from-preview guarded failure into the next bounded metadata-write rung.

This pass records the guarded failure as a safe queue execution-state/evidence record. The write is queue metadata only: it records `execution_status=failed_guarded` and transitions the handoff queue status to `mac_relay_execution_failed_guarded`. It does not execute a Mac relay write, write a NAS file, mount NAS on the VPS, expose credentials, start automation, restart gateway, or dispatch externally.

## Boundary

Allowed:

- Add `failed_guarded` as a supported safe execution-state status.
- Add `mac_relay_execution_failed_guarded` as a terminal queue status.
- POST one bounded protected execution-state record from the live dashboard after the guarded failure evidence exists.
- Read back the queue and render the safe terminal record live-visible with stable DOM hooks and zero controls.
- Rebuild dashboard assets, deploy to the private VPS dashboard, and restart only `hermes-agent-dashboard.service`.

Still not done / still closed:

- Mac relay write execution.
- Actual NAS file write.
- Direct VPS NAS authority, mount, credentials, raw path, or real write.
- Real NAS execution.
- Watcher/cron/daemon activation.
- Public exposure changes.
- Gateway restart.
- Real external dispatch execution.

## Code/test changes

Commit:

- `a4d3fb25 feat(office): record guarded nas keeper failure`

Files changed:

- `hermes_cli/office_controlled_mutation.py`
  - Added execution status `failed_guarded`.
  - Added terminal queue status `mac_relay_execution_failed_guarded`.
- `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_state_record.py`
  - Added RED/GREEN coverage for recording `failed_guarded` without enabling Mac relay/NAS writes.
- `web/src/lib/api.ts`
  - Added `failed_guarded` to `OfficeNasKeeperExecutionStatePayload.execution_status`.
- `web/src/pages/OfficePage.tsx`
  - Added `buildNasKeeperGuardedFailureExecutionStatePayload`.
  - Added `NasKeeperGuardedFailureExecutionStateRecordStatusPanel`.
  - Added live effect to record safe `failed_guarded` state after the protected execution-from-preview guard returns `mac_relay_root_not_configured`.
  - Added readback synthesis so a terminal `mac_relay_execution_failed_guarded` queue item remains visible on fresh page loads.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added display-only guarded failure execution-state record panel test.
  - Extended live-visible placement/uniqueness regression.

## Local verification

- RED:
  - Backend failed first: `failed_guarded` was unsupported.
  - Frontend failed first: `NasKeeperGuardedFailureExecutionStateRecordStatusPanel` was missing.
- GREEN:
  - focused backend test passed.
  - focused frontend panel test passed.
  - placement/uniqueness test passed.
- Backend:
  - `py_compile` passed for `hermes_cli/office_controlled_mutation.py` and `hermes_cli/web_server.py`.
  - Focused NAS Keeper execution-state/readback tests passed: `8 passed`.
- Frontend:
  - combined `src/lib/api.test.ts` + `src/pages/OfficePage.rpg.test.tsx`: `153 passed`.
  - `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- added-line sentinel scan found no new raw path/token/provider sentinels.

## VPS deploy

- Synced both VPS worktrees to latest code commit `a4d3fb25`:
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

## VPS live DOM smoke

Browser DOM at `/office?failed-guarded=a4d3fb25`:

- `data-office-nas-keeper-guarded-failure-execution-state-record-status="true"`
  - exists=true
  - controls=0
  - `data-office-nas-keeper-guarded-failure-execution-state-recorded="true"`
  - `data-office-nas-keeper-guarded-failure-execution-state-queue-mutation="true"`
  - `data-office-nas-keeper-guarded-failure-execution-state-mac-relay-write="false"`
  - `data-office-nas-keeper-guarded-failure-execution-state-actual-write="false"`
  - `data-office-nas-keeper-guarded-failure-execution-state-vps-nas-mount="false"`
  - page body includes `failed_guarded`
  - page body includes `mac_relay_execution_failed_guarded`

Raw leak sentinels:

- none found in page body
- browser console messages/errors after smoke: 0

## VPS protected readback smoke

Protected queue GET used `X-Hermes-Session-Token` from the SPA shell.

GET `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue?handoff_ref=handoff%3Afbb4275f.live.smoke.1511`:

- unauth=401
- authenticated HTTP 200
- count=1
- latest handoff_ref=`handoff:fbb4275f.live.smoke.1511`
- latest queue_status=`mac_relay_execution_failed_guarded`
- latest execution_status=`failed_guarded`
- latest execution_record_ref=`execrecord_relayexec_auth_780a0c24_live_smoke_1551_failed_guarded`
- latest relay_execution_ref=`relayexec-auth-780a0c24-live-smoke-1551`
- latest execution_safe_summary=`Mac relay execution guard failed safely before write because relay root was not configured.`
- latest execution_evidence_refs=`guard:relayexec_auth_780a0c24_live_smoke_1551`, `guard:mac_relay_root_not_configured`
- markdown_body_included=false
- raw leak sentinels absent

## Result

The guarded failure execution-state metadata-write rung is complete. The live dashboard recorded the closed-root guard failure as terminal safe queue evidence, with execution and NAS writes still closed.

## Next recommended rung

Continue to `nas_keeper_terminal_execution_state_readback_completion_review` / terminal evidence completion review.

This next rung should verify and present the terminal `failed_guarded` state as completion evidence, decide whether the current queue path is intentionally complete/closed, and document the next branch. Actual NAS write requires a Mac-local relay root/authority branch; direct VPS NAS authority remains excluded.

Last updated: 2026-05-21 16:36 KST
