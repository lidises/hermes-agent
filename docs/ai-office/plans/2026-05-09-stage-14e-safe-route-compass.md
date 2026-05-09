# Stage 14-E — safe route compass

Date: 2026-05-09
Branch: ai-office-stage14-dynamic-tracking-20260509

## Goal

Add a compact safe route compass that ties together:

- Stage 14-B room activity meters
- Stage 14-C safe pulse timeline
- Stage 14-D safe breadcrumb trail

The compass should make the CSS/SVG AI Office map easier to scan at a glance while staying read-only, frontend-only, and privacy-safe.

## Constraints

- Frontend-only dashboard slice.
- CSS/SVG/DOM only; no renderer dependency, Phaser, PixiJS, canvas, sprites, or DeskRPG code/assets.
- No backend/API/schema changes.
- No mutation controls.
- No persistent browser storage.
- No cron/Kanban/topic/gateway/NAS/Obsidian writes.
- Do not project raw prompts, transcripts, task bodies, scripts, logs, auth fields, secrets, tokens, provider/model identity, or individual task identity.
- Derive visible labels only from safe `OfficeStateDelta` aggregates and known room labels.

## Implementation

- `web/src/pages/officeView.ts`
  - Added `OfficeSafeRouteCompassPoint`, `OfficeSafeRouteCompass`, `routeCompassTone(delta)`, `ROUTE_COMPASS_HEADING`, and `buildOfficeSafeRouteCompass(delta)`.
  - Tone priority is `negative > warning > positive > neutral` across room badges, changed flows, and recent changes.
  - Direction labels reuse the safe breadcrumb helper so the compass describes known room labels only.
  - Points are decorative/non-interactive and expose `ariaHidden: true` / `interactive: false`.

- `web/src/pages/OfficePage.tsx`
  - Imports and derives `buildOfficeSafeRouteCompass(latestDelta)` inside the office map.
  - Adds Stage 14-E summary text to the detached map legend.
  - Renders a compact rail with `data-office-safe-route-compass="true"` and per-point hooks `data-office-safe-route-compass-point="direction|signal|summary"`.

- `web/src/index.css`
  - Adds compact route-compass styles and reuses the existing safe pulse tone classes.

- `web/src/pages/OfficePage.test.ts`
  - Adds focused helper coverage that injects raw-looking labels/details into changed flows, room badges, and recent changes, then verifies the compass emits only safe generated labels.

## Verification target

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Browser smoke URL:

```text
http://127.0.0.1:8765/office?stage14e=safe-route-compass
```

Expected smoke checks:

- route compass exists
- compass points: 3
- breadcrumb exists
- pulse timeline exists
- Stage 14-A tracking cues remain present
- Stage 14-B room activity meters remain present
- raw leak regex false for fixture raw fields/secrets
- console JS errors none

## Next candidate

Stage 14-F can add another small safe readability layer only if it remains frontend-only/CSS-only/read-only. A good candidate is a compact “change density minimap” or “safe focus lane” derived from the same safe delta aggregates, with the same privacy boundary.
