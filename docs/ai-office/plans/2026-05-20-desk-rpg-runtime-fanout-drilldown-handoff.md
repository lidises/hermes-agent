# AI Office Desk RPG runtime fan-out drill-down handoff — 2026-05-20

## Baseline

- Branch: `main`
- Code/deploy commit: `c617660d` (`feat(office): add desk rpg runtime fanout drilldown`)
- Final docs commit: to be recorded after this handoff is committed.
- Scope: frontend-only/read-only `/office` Desk RPG visual continuation.

## What changed

- Added `buildOfficeRpgRuntimeFanoutDrilldown(scene)` in `web/src/pages/officeView.ts`.
- Added `OfficeRpgRuntimeFanoutDrilldownPanel` in `web/src/pages/OfficePage.tsx`.
- Added focused helper and SSR markup tests in `web/src/pages/OfficePage.rpg.test.tsx`.
- Updated `docs/ai-office/NEXT.md` and `docs/ai-office/STATUS.md`.

## UI contract

The Desk RPG rendered SVG map stays bounded to representative role avatars:

- User/Boss
- Orchestrator
- Search Worker visible clones capped at 3
- Reviewer
- Wiki Writer
- NAS Keeper

Runtime fan-out is no longer expressed by adding more map characters. It is summarized in a read-only aggregate drill-down with these lane hooks:

- `data-office-rpg-runtime-fanout-drilldown="true"`
- `data-office-rpg-runtime-fanout-lane="representative_actors"`
- `data-office-rpg-runtime-fanout-lane="hidden_workers"`
- `data-office-rpg-runtime-fanout-lane="board_rows"`
- `data-office-rpg-runtime-fanout-lane="automation_rows"`
- `data-office-rpg-runtime-fanout-lane="source_rows"`

Capability flags remain closed:

- `data-office-rpg-runtime-fanout-enabled-controls="0"`
- `data-office-rpg-runtime-fanout-assignment-enabled="false"`
- `data-office-rpg-runtime-fanout-dispatch-enabled="false"`
- `data-office-rpg-runtime-fanout-backend-write-enabled="false"`

## Verification

Local verification before deploy:

- `npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "runtime fan-out"`
  - 2 passed
- `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 254 passed
- `npx eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 0 errors
  - existing Fast Refresh warnings only
- `npm run build`
  - passed
  - existing Vite large chunk warning only
- `git diff --check`
  - passed
- Local browser DOM smoke at `/office?runtime-fanout-drilldown=local`
  - panel=true
  - lanes=5
  - hiddenCount=47 on current local live data
  - enabledControls=0
  - assignment=false
  - dispatch=false
  - backendWrite=false
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - characterSprite hooks=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0

Private VPS deploy/smoke:

- Dashboard and companion source worktrees synced to `c617660d` from the user fork.
- Mac-built `hermes_cli/web_dist/` rsynced to both worktrees.
- Relative `web_dist` content hash matched both VPS copies:
  - `a5879df500be1fac295411aaf206e68d8d4b57d9ade18dc14f3fb7485f12cd0f`
  - 22 files
- Restarted `hermes-agent-dashboard.service` only.
- Did not restart `hermes-gateway.service`.
- Private `/office?runtime-fanout-drilldown=c617660d` HTTP 200 after listener readiness.
- VPS browser DOM smoke:
  - panel=true
  - lanes=5
  - hiddenCount=47 on live VPS data
  - enabledControls=0
  - assignment=false
  - dispatch=false
  - backendWrite=false
  - scopedControls=0
  - visualMap=1
  - mapSvg=1
  - sprites=8
  - fallbackRows=8
  - rawLeak=false
  - console JS errors=0
- Vision smoke confirmed the Desk RPG view is read-only with aggregate/drill-down posture and no obvious form controls in the fan-out panel.

## Boundaries preserved

Not done and intentionally still closed:

- Kanban mutation
- NAS write
- watcher/cron/daemon activation
- dispatcher/authority-adapter binding
- target mutation
- direct VPS NAS authority
- public exposure change
- gateway restart
- backend/API/storage write route for this slice

## Recommended next starter prompt

Continue AI Office Desk RPG from repo evidence. First read:

1. `docs/ai-office/NEXT.md`
2. `docs/ai-office/STATUS.md`
3. `docs/ai-office/plans/2026-05-20-desk-rpg-runtime-fanout-drilldown-handoff.md`

Then verify live git/VPS state read-only before any mutation. Recommended next work is not another map fan-out expansion; keep the map representative-avatar based. The next safe step should be either a small read-only inspector/detail refinement for the aggregate lanes, or a controlled-mutation approval/event design slice. Do not add direct worker buttons, Kanban transitions, NAS writes, watcher/cron activation, gateway restart, public exposure, or direct VPS NAS authority without a separate explicit approval boundary.
