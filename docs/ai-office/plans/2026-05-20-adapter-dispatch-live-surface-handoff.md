# AI Office adapter-dispatch live surface handoff — 2026-05-20

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raises risk exactly one rung after target mutation:

- existing protected adapter-dispatch metadata store/API/readback already exists;
- this slice makes the adapter-dispatch status panel live-visible on production `/office`;
- local/VPS smoke may append one bounded adapter-dispatch marker metadata record backed by the prerequisite target-mutation chain.

## Safety boundary

Allowed in this slice:

- Adapter-dispatch marker metadata write/readback only.
- `adapter_dispatch_created=true` marker record only after a verified target-mutation record.
- Display-only `/office` status panel.

Explicitly not allowed / not done:

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
  - `ManualAdapterDispatchRecordStatusPanel`
- Moved `ManualAdapterDispatchRecordStatusPanel` to the live-visible block before legacy diagnostic lanes.

## TDD evidence

RED:

- `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "adapter-dispatch status panels live-visible"`
- Failed because adapter-dispatch panel was after `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.

GREEN:

- Same focused test passed after moving the panel.

## Current verification status

In progress at handoff creation time:

- Focused GREEN passed.
- Full local verification and local API/browser smoke passed.
- Commit/push and VPS dashboard-only deploy/live smoke pending.

## Next recommended gate after completion

If this slice is fully verified/deployed and the user again approves the recommended next shortest path, the next rung is Kanban-mutation marker gate:

- adapter-dispatch-backed Kanban-mutation marker record;
- still no NAS save/write, watcher/cron, direct VPS NAS authority, public exposure, real dispatch, or gateway restart.

Last updated: 2026-05-20 23:42 KST


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

Local API smoke on source-launched temp dashboard `127.0.0.1:9130`:

- protected API chain stored through adapter-dispatch marker.
- filtered adapter-dispatch readback:
  - count=1
  - adapter=true
  - result=`safe_adapter_dispatch_marker_written`
  - target_mutation=true
  - Kanban=false
  - NAS=false
  - real_dispatch=false
  - raw provider/path leak=false

Local browser smoke:

- URL: `http://127.0.0.1:9130/office?adapterdispatch-local-browser=1`
- DOM:
  - adapter-dispatch panel present=true
  - count=1
  - adapter=true
  - Kanban=false
  - NAS=false
  - realDispatch=false
  - scoped controls=0
  - raw provider/path leak=false
  - console JS errors=0

Local verification updated: 2026-05-20 23:46 KST
