# AI Office Desk RPG fan-out approval event bridge handoff — 2026-05-20

## Baseline

- Branch: `main`
- Code/deploy commit: `d0bd86cc31be481677eb0c31028a3fd08e680648` (`feat(office): bridge rpg fanout approval event posture`)
- Scope: frontend-only/read-only `/office` Desk RPG bridge from aggregate runtime fan-out posture toward the controlled request/approval event path.

## What changed

- Added `OfficeRpgFanoutApprovalEventBridge` DTO and `buildOfficeRpgFanoutApprovalEventBridge(fanout, route)`.
- The bridge connects existing safe aggregate fan-out drill-down data to the existing approval request route detail posture.
- Added `RpgFanoutApprovalEventBridgePanel` and mounted it under the Desk RPG runtime fan-out drill-down inside `OfficeRpgMap`.
- Stable hooks:
  - `data-office-rpg-fanout-approval-event-bridge="true"`
  - `data-office-rpg-fanout-approval-event-bridge-card="aggregate_fanout|request_envelope|approval_event_gate|write_boundary"`
  - `data-office-rpg-fanout-approval-event-bridge-enabled-controls="0"`
  - `data-office-rpg-fanout-approval-event-bridge-request-creation-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-approval-event-creation-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-event-persistence-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-kanban-write-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-dispatch-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-audit-write-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-nas-save-enabled="false"`
  - `data-office-rpg-fanout-approval-event-bridge-safe-projection-only="true"`
  - `data-office-rpg-fanout-approval-event-bridge-raw-excluded="true"`
- The bridge deliberately names the future request/approval event gate but creates no request rows, approval events, persisted event payloads, Kanban writes, dispatch, audit writes, or NAS saves.

## Verification

Local:

- RED focused tests initially failed on the missing fanout approval event bridge builder/panel contract.
- Focused bridge helper test passed: `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx -t "Fanout Approval Event Bridge"` → 1 passed.
- Focused bridge panel test passed: `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "fanout-to-approval"` → 1 passed.
- Combined Office frontend tests passed: `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx` → 256 passed.
- ESLint: 0 errors, existing Fast Refresh warnings only.
- Build: passed, existing Vite large chunk warning only.
- `git diff --check`: passed.
- Added-line safety scan: no production `fetch`, storage, beacon, private-path, or token-like additions; only a test assertion mentions `<form`.
- Local browser smoke at `/office?fanout-approval-event-local=1`:
  - bridge=true
  - cards=4
  - enabledControls=0
  - requestCreation=false
  - approvalEventCreation=false
  - eventPersistence=false
  - kanbanWrite=false
  - dispatch=false
  - auditWrite=false
  - nasSave=false
  - safeProjectionOnly=true
  - rawExcluded=true
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - sprites=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0

Private VPS deploy/smoke:

- `/home/hermes/.hermes/ai-office-dashboard` reset to `d0bd86cc31be481677eb0c31028a3fd08e680648` and clean before docs commit.
- `/home/hermes/.hermes/hermes-agent` reset to user-fork `lidises/main` at `d0bd86cc31be481677eb0c31028a3fd08e680648` and clean before docs commit.
- Mac-built `hermes_cli/web_dist/` rsynced to both worktrees.
- Relative content hash matched local and both VPS copies with `LC_ALL=C`:
  - `e111de66f5383dbfda0db17920c21a37733f172176d8b0e0c7e6cc607a2d4c11`
  - 22 files
- Restarted `hermes-agent-dashboard.service` only.
- Did not restart `hermes-gateway.service`.
- Final service status during smoke: dashboard active, gateway active.
- Private `/office?fanout-approval-event=d0bd86cc` HTTP 200.
- Live browser DOM smoke:
  - bridge=true
  - cards=4
  - enabledControls=0
  - requestCreation=false
  - approvalEventCreation=false
  - eventPersistence=false
  - kanbanWrite=false
  - dispatch=false
  - auditWrite=false
  - nasSave=false
  - safeProjectionOnly=true
  - rawExcluded=true
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - mapRooms=6
  - sprites=8
  - bubbles=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0

## Boundaries preserved

Not done and intentionally still closed:

- Request row creation
- Approval event creation
- Event persistence/store/schema
- Direct worker/facility mutation controls
- Backend write routes for this slice
- Kanban mutation
- NAS write/save
- watcher/cron/daemon activation
- dispatcher/authority-adapter binding
- target mutation
- direct VPS NAS authority
- public exposure change
- gateway restart

## Recommended next starter prompt

Continue AI Office Desk RPG from repo evidence. First read:

1. `docs/ai-office/NEXT.md`
2. `docs/ai-office/STATUS.md`
3. `docs/ai-office/plans/2026-05-20-desk-rpg-fanout-approval-event-bridge-handoff.md`

Recommended next work: deepen the request/approval event path as read-only only. A safe next slice could add an approval-event envelope/detail that enumerates required future fields, idempotency keys, readback/audit checks, and blocked capabilities, while keeping actual request creation, event persistence, Kanban mutation, NAS writes, watcher/cron activation, dispatcher/authority binding, direct VPS NAS authority, public exposure, and gateway restart behind separate explicit approval.
