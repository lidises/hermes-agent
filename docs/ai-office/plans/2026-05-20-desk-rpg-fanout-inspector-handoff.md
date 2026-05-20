# AI Office Desk RPG fan-out inspector detail handoff — 2026-05-20

## Baseline

- Branch: `main`
- Code/deploy commit: `bb1bb84c` (`feat(office): refine desk rpg fanout inspector`)
- Scope: frontend-only/read-only `/office` Desk RPG runtime fan-out detail refinement, plus approved commit/push and private VPS dashboard-only deploy.

## What changed

- `buildOfficeRpgRuntimeFanoutDrilldown(scene)` now adds `inspectorDetails` for the five aggregate fan-out lanes.
- `OfficeRpgRuntimeFanoutDrilldownPanel` now renders a read-only aggregate inspector detail section under the existing lane cards.
- New stable hooks:
  - `data-office-rpg-runtime-fanout-inspector="true"`
  - `data-office-rpg-runtime-fanout-inspector-detail="representative_actors|hidden_workers|board_rows|automation_rows|source_rows"`
  - `data-office-rpg-runtime-fanout-inspector-suppressed-count`
  - `data-office-rpg-runtime-fanout-inspector-safe-projection-only="true"`
  - `data-office-rpg-runtime-fanout-inspector-raw-rows-visible="false"`
  - `data-office-rpg-runtime-fanout-inspector-write-enabled="false"`
- The map remains bounded to the representative actor set; hidden fan-out stays aggregate/detail-only.

## Verification

Local:

- RED focused test failed on missing `inspectorDetails` and inspector hooks.
- Focused runtime fan-out tests: 2 passed.
- Combined Office frontend tests: 254 passed.
- ESLint: 0 errors, existing Fast Refresh warnings only.
- Build: passed, existing Vite large chunk warning only.
- `git diff --check`: passed.
- Added-line safety scan: no production `fetch`, storage, beacon, `<form>`, private path/provider/token-like leak additions.
- Local browser smoke at `/office?fanout-inspector-local=1`:
  - panel=true
  - lanes=5
  - inspector=true
  - details=5
  - hidden suppressed count=47 on current live data
  - enabledControls=0
  - inspectorControls=0
  - writeEnabled=false
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - sprites=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0

Private VPS deploy/smoke:

- `/home/hermes/.hermes/ai-office-dashboard` synced to `bb1bb84c3882fe34b95f09864e7737dff067f2ae` and clean.
- `/home/hermes/.hermes/hermes-agent` synced to `bb1bb84c3882fe34b95f09864e7737dff067f2ae` from the user fork and clean.
- Mac-built `hermes_cli/web_dist/` rsynced to both worktrees.
- Relative content hash matched local and both VPS copies:
  - `93813e211efd3d5a06ce9dc0c3f4db8853e378424c5609366ef2221c790153cd`
  - 22 files
- Restarted `hermes-agent-dashboard.service` only.
- Did not restart `hermes-gateway.service`.
- Final services: dashboard active, gateway active.
- Listener remained on private Tailscale address `100.122.57.85:8765`.
- Private `/office?fanout-inspector=bb1bb84c` HTTP 200.
- Live browser DOM smoke:
  - panel=true
  - lanes=5
  - inspector=true
  - details=5
  - hidden suppressed count=47
  - enabledControls=0
  - inspectorControls=0
  - writeEnabled=false
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - sprites=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0
- Vision smoke confirmed representative-avatar Desk RPG map and read-only aggregate/inspector posture without obvious form controls.

## Boundaries preserved

Not done and intentionally still closed:

- Direct worker/facility mutation controls
- Backend write routes for this slice
- Kanban mutation
- NAS write
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
3. `docs/ai-office/plans/2026-05-20-desk-rpg-fanout-inspector-handoff.md`

Recommended next work: move from aggregate visualization toward the controlled-mutation request/approval event path, not direct worker buttons. The next safe slice should define a read-only request/approval event posture or approval-envelope detail that can later support stronger write gates. Keep actual Kanban transitions, NAS writes, watcher/cron activation, dispatcher/authority binding, direct VPS NAS authority, public exposure, and gateway restart behind separate explicit boundaries.
