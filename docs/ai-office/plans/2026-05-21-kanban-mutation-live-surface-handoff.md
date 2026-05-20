# AI Office Kanban-mutation live surface handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raises risk exactly one rung after adapter dispatch:

- existing protected Kanban-mutation metadata store/API/readback already exists;
- this slice makes the Kanban-mutation status panel live-visible on production `/office`;
- local/VPS smoke may append one bounded Kanban-mutation marker metadata record backed by the prerequisite adapter-dispatch chain.

## Safety boundary

Allowed in this slice:

- Kanban-mutation marker metadata write/readback only.
- `kanban_mutation_created=true` marker record only after a verified adapter-dispatch record.
- Display-only `/office` status panel.

Explicitly not allowed / not done:

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
  - `ManualKanbanMutationRecordStatusPanel`
- Moved `ManualKanbanMutationRecordStatusPanel` to the live-visible block before legacy diagnostic lanes.

## TDD evidence

RED:

- `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "Kanban-mutation status panels live-visible"`
- Failed because Kanban-mutation panel was after `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.

GREEN:

- Same focused test passed after moving the panel.

## Current verification status

In progress at handoff creation time:

- Focused GREEN passed.
- Full local verification, commit/push, VPS dashboard-only sync/restart, protected API smoke, and browser smoke passed.

## Next recommended gate after completion

If this slice is fully verified/deployed and the user again approves the recommended next shortest path, the next rung is NAS-save marker gate:

- Kanban-mutation-backed NAS-save marker record;
- still no real NAS execution, direct VPS NAS authority, watcher/cron, real dispatch, public exposure, or gateway restart.

Last updated: 2026-05-21 00:21 KST


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

Local API smoke on source-launched temp dashboard `127.0.0.1:9131`:

- protected API chain stored through Kanban-mutation marker.
- filtered Kanban-mutation readback:
  - count=1
  - kanban=true
  - result=`safe_kanban_marker_written`
  - adapter=true
  - NAS=false
  - real_dispatch=false
  - raw card/provider/path leak=false

Local browser smoke:

- URL: `http://127.0.0.1:9131/office?kanbanmut-local-browser=1`
- DOM:
  - Kanban-mutation panel present=true
  - count=1
  - kanban=true
  - NAS=false
  - realDispatch=false
  - scoped controls=0
  - raw card/provider/path leak=false
  - console JS errors=0

Local verification updated: 2026-05-21 00:23 KST


## Deployment verification

Code/docs commit pushed:

- `e8181319 feat(office): surface kanban mutation status`
- full commit: `e8181319b7d968da63dbec2b3f752896370903c0`

VPS sync/restart:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `e8181319b7d968da63dbec2b3f752896370903c0`.
- `/home/hermes/.hermes/hermes-agent` reset to `e8181319b7d968da63dbec2b3f752896370903c0` via user-fork `lidises/main`.
- `hermes_cli/web_dist` rsynced to both worktrees.
- Relative content hash matched local/dashboard/agent:
  - `59eb20befa282315312adc307ee646b9e4c8690211a5d230cd9b9630a5a11cf5`
  - file count: 22
- Restarted dashboard only:
  - `hermes-agent-dashboard.service`: active
  - `hermes-gateway.service`: active and untouched

VPS API smoke:

- URL base: `http://100.122.57.85:8765`
- protected API chain stored through Kanban-mutation marker.
- filtered readback for `kanbanmut-office-vps-kanbanmut-e8181319`:
  - count=1
  - kanban=true
  - result=`safe_kanban_marker_written`
  - adapter=true
  - NAS=false
  - real_dispatch=false
  - raw card/provider/path leak=false

VPS browser smoke:

- URL: `http://100.122.57.85:8765/office?kanbanmut-vps-browser=e8181319`
- DOM:
  - Kanban-mutation panel present=true
  - live panel total count=2 (includes prior safe smoke records)
  - kanban=true
  - NAS=false
  - realDispatch=false
  - scoped controls=0
  - raw card/provider/path leak=false
  - console JS errors=0

Final boundary preserved:

- Kanban-mutation marker metadata only.
- NAS save/write/direct VPS NAS authority, rollback execution, real dispatch, watcher/cron, credential access, public exposure, and gateway restart were not performed.

Final updated: 2026-05-21 00:26 KST
