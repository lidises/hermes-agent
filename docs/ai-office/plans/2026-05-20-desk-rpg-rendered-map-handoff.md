# AI Office Desk RPG rendered-map handoff — 2026-05-20

## Purpose

Use this handoff to start a new session from durable repo evidence after the B안 Desk RPG visual slice. The important correction is that the RPG/DeskRPG visual goal is now about actual visible map + character rendering, not status cards or DTO counts.

## Current baseline

- Local repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Code commit deployed and smoked: `b5c18596` (`feat(office): render desk rpg map sprites`)
- Local `origin/main` after code push: `b5c18596`
- VPS dashboard worktree: `/home/hermes/.hermes/ai-office-dashboard`
- VPS dashboard worktree after deploy: `b5c18596`, clean
- Dashboard service: `hermes-agent-dashboard.service=active`
- Gateway service: `hermes-gateway.service=active`; gateway was not restarted for this slice
- Dashboard listener after restart: `100.122.57.85:8765`
- Gateway listener after deploy: `100.122.57.85:8766`

## What was implemented

B안 was implemented as a local/frontend Desk RPG visual slice and then deployed to the private VPS dashboard.

Changed files in the code commit:

- `web/src/pages/OfficePage.tsx`
  - Adds a real SVG-rendered RPG map section under `/office`.
  - Renders 6 room regions from the safe `OfficeRpgScene` DTO.
  - Renders floor tile grid, furniture, doors, and path lines.
  - Renders one SVG character sprite per visible RPG entity.
  - Adds state bubbles on each sprite.
  - Keeps sprite inspection read-only and connected to the existing safe inspector flow.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Extends the read-only RPG room-map test to require actual SVG/map/sprite hooks, not just text/status panels.
- `web/src/index.css`
  - Adds scoped styles for the SVG visual map and character sprite focus/hover posture.

Stable hooks added/verified:

- `data-office-rpg-visual-map="true"`
- `data-office-rpg-map-svg="true"`
- `data-office-rpg-map-room`
- `data-office-rpg-map-tile`
- `data-office-rpg-map-door`
- `data-office-rpg-map-furniture`
- `data-office-rpg-map-path`
- `data-office-rpg-character-sprite`
- `data-office-rpg-character-bubble`

## Verification performed before deploy

Local verification before commit/push:

- `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 2 test files passed
  - 248 tests passed
- `npx eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 0 errors
  - 2 existing Fast Refresh warnings in `OfficePage.tsx`
- `npm run build`
  - passed
  - existing Vite large chunk warning only
- `git diff --check`
  - passed
- Local browser smoke against source dashboard:
  - visual map mounted
  - SVG map mounted
  - rooms/tiles/doors/furniture/paths rendered
  - character sprites and bubbles rendered
  - text fallback rows rendered
  - raw leak probe false
  - console JS errors 0
  - sprite click opened the safe inspector

## Deploy performed

Approved scope from user: `commit/push/VPS sync/restart까지 승인. 이후 새 세션에서 시작할 수 있도록 준비해줘.`

Actions taken under that approval:

1. Committed code: `b5c18596 feat(office): render desk rpg map sprites`
2. Pushed `main` to `origin/main`
3. VPS dashboard worktree fetched and reset to `origin/main` at `b5c18596`
4. Local built `hermes_cli/web_dist/` was rsynced to `/home/hermes/.hermes/ai-office-dashboard/hermes_cli/web_dist/`
5. Local/remote web_dist content hash matched using relative-path content hashing:
   - `dcd81c339657467222a8f5ef361604efb1f722de836839a1c55b4cac5882d7cc`
6. Restarted `hermes-agent-dashboard.service` only
7. Did not restart `hermes-gateway.service`

## VPS live smoke evidence

Private `/office` smoke URL used:

- `http://100.122.57.85:8765/office?desk-rpg-rendered-map=b5c18596`

HTTP/service evidence:

- dashboard service active
- gateway service active
- dashboard worktree HEAD `b5c18596`
- dashboard worktree clean
- private `/office` HTTP 200

Browser DOM smoke evidence on VPS live page:

- `hasRpgRoot=true`
- `visualMap=1`
- `mapSvg=1`
- `mapRooms=6`
- `mapTiles=7`
- `mapDoors=3`
- `mapFurniture=5`
- `mapPaths=2`
- `sprites=51` on the live VPS data set
- `bubbles=51`
- `fallbackRows=51`
- `scopedVisualSvg=1`
- `formsInVisual=0`
- `rawLeak=false`
- after a second click probe, `inspectorOpened=true` and `selectedSprites=1`
- browser console after smoke: 0 messages, 0 JS errors

Vision smoke confirmed the central `/office` area shows:

- `RENDERED RPG MAP / 실제 SVG 지도`
- room regions `CMD`, `AGT`, `BRD`, `CRON`, `SRC`, `REV`
- furniture/objects
- doors/connectors
- path lines
- multiple character sprites
- state labels such as `working`, `completed`, `waiting`, `warning`, `blocked`

## Important boundaries still closed

The following were not done in this slice and remain separately approval-gated:

- No Kanban mutation
- No NAS write
- No watcher/cron/daemon activation
- No dispatcher/authority-adapter binding
- No target mutation
- No VPS direct NAS mount/credential/write authority
- No public exposure change
- No gateway restart
- No core Hermes checkout mutation for runtime authority

## Current completion interpretation

The previous "goal complete" claim was corrected because the live page lacked actual map/character rendering. After `b5c18596`, the private `/office` page now has an actual SVG Desk RPG visual slice with visible room map and character sprites.

This means the minimal visual completion guardrail for map + character rendering is satisfied for the deployed private dashboard:

- actual visual map hook exists
- actual SVG map exists
- character sprite hooks exist and match the live safe DTO visible entity count
- visual evidence confirms rooms/furniture/doors/paths/sprites/bubbles
- text fallback remains present
- raw leak false
- console errors 0
- no write-capable controls added to the visual map section

It does not mean autonomous AI Office operations are complete.

## Recommended next session starter prompt

Copy/paste this into the next session:

```text
Start from docs/ai-office/plans/2026-05-20-desk-rpg-rendered-map-handoff.md. First revalidate live state read-only: local git HEAD/status, origin/main, VPS dashboard worktree HEAD/status, dashboard/gateway service status, and private /office DOM hooks for data-office-rpg-visual-map/map-svg/character-sprite. Do not implement, restart services, mutate VPS files, commit/push, mutate Kanban, or write NAS until I approve the next step. Then tell me the smallest 2-3 next options for improving the Desk RPG experience.
```

## Likely next options

1. Visual polish/readability only
   - Improve sprite overlap, labels, room spacing, responsive sizing, and selected-state feedback.
   - Keep frontend-only/read-only.

2. Interaction polish only
   - Make click/keyboard inspection clearer, add better focus rings and selected entity detail anchoring.
   - Keep frontend-only/read-only.

3. Product integration
   - Decide whether this rendered map should become the primary top-of-page `/office` view or remain inside the RPG Visualizer section.
   - This is UX/IA work, not backend authority work.

Any move toward real dispatcher actions, Kanban writes, NAS writes, watcher/cron automation, or authority adapter binding requires separate approval and a safety design.
