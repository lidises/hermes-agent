# AI Office NAS-save live surface handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raises risk exactly one rung after Kanban mutation:

- existing protected NAS-save marker metadata store/API/readback already exists;
- this slice makes the NAS-save status panel live-visible on production `/office`;
- local/VPS smoke may append one bounded NAS-save marker metadata record backed by the prerequisite Kanban-mutation chain.

## Safety boundary

Allowed in this slice:

- NAS-save marker metadata write/readback only.
- `nas_save_created=true` marker record only after a verified Kanban-mutation record.
- Display-only `/office` status panel.

Explicitly not allowed / not done:

- Real NAS execution.
- Direct VPS NAS authority, mount, or credentials.
- Mac relay write.
- Rollback execution.
- Real dispatch.
- Watcher/cron/daemon activation.
- Gateway restart.
- Credential access.
- Public exposure changes.
- Raw markdown body, NAS path, NAS payload, provider, filesystem path, or credential projection.

## Implementation notes

- Added/extended placement regression test so these live status panels remain outside `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`:
  - `ManualDispatchGateOpenRecordStatusPanel`
  - `ManualRuntimeCommandPreviewRecordStatusPanel`
  - `ManualRuntimeCommandInclusionRecordStatusPanel`
  - `ManualRuntimeCommandExecutionRecordStatusPanel`
  - `ManualTargetMutationReadinessRecordStatusPanel`
  - `ManualTargetMutationRecordStatusPanel`
  - `ManualAdapterDispatchRecordStatusPanel`
  - `ManualKanbanMutationRecordStatusPanel`
  - `ManualNasSaveRecordStatusPanel`
- Moved `ManualNasSaveRecordStatusPanel` to the live-visible block before legacy diagnostic lanes.

## TDD evidence

RED:

- `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "NAS-save status panels live-visible"`
- Failed because NAS-save panel was after `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.

GREEN:

- Same focused test passed after moving the panel.

## Current verification status

In progress at handoff creation time:

- Focused GREEN passed.
- Full local verification and local API/browser smoke passed.
- Commit/push and VPS dashboard-only deploy/live smoke pending.

## Next recommended gate after completion

If this slice is fully verified/deployed and the user again approves the recommended next shortest path, the next rung is NAS Keeper/Mac relay handoff queue marker gate:

- NAS-save-backed NAS Keeper handoff queue marker record;
- still no real NAS execution, direct VPS NAS authority, Mac relay write, watcher/cron, real dispatch, public exposure, or gateway restart.

Last updated: 2026-05-21 00:34 KST


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

Local API smoke on source-launched temp dashboard `127.0.0.1:9132`:

- protected API chain stored through NAS-save marker.
- filtered NAS-save readback:
  - count=1
  - nas=true
  - result=`safe_nas_save_marker_written`
  - kanban=true
  - direct_vps_nas=false
  - real_nas=false
  - real_dispatch=false
  - raw markdown/NAS path/provider leak=false

Local browser smoke:

- URL: `http://127.0.0.1:9132/office?nassave-local-browser=1`
- DOM:
  - NAS-save panel present=true
  - count=1
  - nas=true
  - vps direct authority=false
  - real NAS execution=false
  - scoped controls=0
  - raw markdown/NAS path/provider leak=false
  - console JS errors=0

Local verification updated: 2026-05-21 00:37 KST
