# AI Office target-mutation live surface handoff — 2026-05-20

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raises risk exactly one rung after target-readiness:

- existing protected target-mutation metadata store/API/readback already exists;
- this slice makes the target-mutation status panel live-visible on production `/office`;
- local/VPS smoke may append one bounded target-mutation marker metadata record backed by the prerequisite target-readiness chain.

## Safety boundary

Allowed in this slice:

- Target-mutation marker metadata write/readback only.
- `target_mutation_created=true` marker record only after a verified target-readiness record.
- Display-only `/office` status panel.

Explicitly not allowed / not done:

- Adapter dispatch.
- Kanban mutation.
- NAS save/write/direct VPS NAS authority.
- Rollback execution.
- Real dispatch.
- Watcher/cron/daemon activation.
- Gateway restart.
- Credential access.
- Public exposure changes.
- Raw target/provider/card/NAS/path/credential projection.

## Implementation notes

- Added/extended placement regression test so these live status panels remain outside `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`:
  - `ManualDispatchGateOpenRecordStatusPanel`
  - `ManualRuntimeCommandPreviewRecordStatusPanel`
  - `ManualRuntimeCommandInclusionRecordStatusPanel`
  - `ManualRuntimeCommandExecutionRecordStatusPanel`
  - `ManualTargetMutationReadinessRecordStatusPanel`
  - `ManualTargetMutationRecordStatusPanel`
- Moved `ManualTargetMutationRecordStatusPanel` to the live-visible block before legacy diagnostic lanes.

## TDD evidence

RED:

- `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "target-mutation status panels live-visible"`
- Failed because target-mutation panel was after `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.

GREEN:

- Same focused test passed after moving the panel.

## Current verification status

In progress at handoff creation time:

- Focused GREEN passed.
- Full local verification, commit/push, VPS dashboard-only sync/restart, protected API smoke, and browser smoke passed.

## Next recommended gate after completion

If this slice is fully verified/deployed and the user again approves the recommended next shortest path, the next rung is adapter-dispatch marker gate:

- target-mutation-backed adapter-dispatch marker record;
- still no Kanban mutation, NAS save/write, watcher/cron, direct VPS NAS authority, public exposure, or gateway restart.

Last updated: 2026-05-20 23:16 KST


## Local verification evidence

Commands/checks passed:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py tests/hermes_cli/test_office_controlled_mutation_approval_event_envelope.py tests/hermes_cli/test_office_api.py -q -o 'addopts='`
  - 46 passed
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `npm test -- --run src/lib/api.test.ts src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 302 passed
- `npx eslint src/pages/OfficePage.tsx src/pages/OfficePage.rpg.test.tsx src/lib/api.ts`
  - 0 errors; existing Fast Refresh warnings only
- `npm run build`
  - passed; existing Vite large chunk warning only
- `git diff --check`
  - passed
- added-line safety scan
  - passed

Local API smoke on temp dashboard `127.0.0.1:9126`:

- protected API chain stored through target-mutation marker.
- filtered target-mutation readback:
  - count=1
  - target_mutation=true
  - result=`safe_target_marker_written`
  - readiness=true
  - allowlist=true
  - executed=true
  - replay=true
  - adapter=false
  - Kanban=false
  - NAS=false
  - real_dispatch=false
  - raw target/path leak=false

Local browser smoke:

- URL: `http://127.0.0.1:9126/office?targetmut-local-browser=1`
- DOM:
  - target-mutation panel present=true
  - count=1
  - targetMutation=true
  - Kanban=false
  - scoped controls=0
  - raw target/path leak=false
  - console JS errors=0

Local verification updated: 2026-05-20 23:18 KST


## Deployment verification

Code/docs commit pushed:

- `543d9724 feat(office): surface target mutation status`
- full commit: `543d9724c88da51b67171c4fbfaa6dabb8a335f9`

VPS sync/restart:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `543d9724c88da51b67171c4fbfaa6dabb8a335f9`.
- `/home/hermes/.hermes/hermes-agent` reset to `543d9724c88da51b67171c4fbfaa6dabb8a335f9` via user-fork `lidises/main`.
- `hermes_cli/web_dist` rsynced to both worktrees.
- Relative content hash matched local/dashboard/agent:
  - `7aeee75e2908623463ec29007e0029f1d80d73a2e51ef2a0c5c15e4216ebf2d8`
  - file count: 22
- Restarted dashboard only:
  - `hermes-agent-dashboard.service`: active
  - `hermes-gateway.service`: active and untouched

VPS API smoke:

- URL base: `http://100.122.57.85:8765`
- protected API chain stored through target-mutation marker.
- filtered readback for `targetmut-office-vps-targetmut-543d9724`:
  - count=1
  - target_mutation=true
  - result=`safe_target_marker_written`
  - readiness=true
  - allowlist=true
  - executed=true
  - replay=true
  - adapter=false
  - Kanban=false
  - NAS=false
  - real_dispatch=false
  - raw target/path leak=false

VPS browser smoke:

- URL: `http://100.122.57.85:8765/office?targetmut-vps-browser=543d9724`
- DOM:
  - target-mutation panel present=true
  - live panel total count=2 (includes prior safe smoke records)
  - targetMutation=true
  - Kanban=false
  - NAS=false
  - realDispatch=false
  - scoped controls=0
  - raw target/path leak=false
  - console JS errors=0

Final boundary preserved:

- Target-mutation marker metadata only.
- Adapter dispatch, Kanban mutation, NAS save/write/direct VPS NAS authority, rollback execution, real dispatch, watcher/cron, credential access, public exposure, and gateway restart were not performed.

Final updated: 2026-05-20 23:21 KST
