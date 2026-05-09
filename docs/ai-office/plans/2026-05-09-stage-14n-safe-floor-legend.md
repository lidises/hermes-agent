# Stage 14-N — Safe Floor Legend

Date: 2026-05-09 18:39 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact DeskRPG-like floor legend below the map HUD so `/office` can explain active rooms, idle rooms, safe flow count, and projection safety at a glance without exposing raw records.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeFloorLegendItem`
- `OfficeSafeFloorLegend`
- `buildOfficeSafeFloorLegend(delta)`

The helper derives only from already safe helpers/aggregates:

- `buildOfficeSafeTacticalMinimap(delta)`;
- `buildOfficeSafeFlowPulseBands(delta)`;
- generated room labels from existing minimap cells;
- fixed generated safety copy.

## UI hooks

- `data-office-safe-floor-legend="true"`
- `data-office-safe-floor-legend-summary="true"`
- `data-office-safe-floor-legend-item="active|idle|flow|safety"`

## Safety contract

Stage 14-N must not expose prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, recent-change details, or adapter error strings.

It does not add backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeFloorLegend is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Use tactical minimap cells and flow pulse counts only.
- Wire React/CSS only after helper GREEN.

## Implementation notes

The legend renders four generated items:

- `active`: generated active room labels;
- `idle`: generated idle room labels;
- `flow`: generated safe flow count;
- `safety`: fixed `집계 전용` projection copy.

Example summary:

- `활성 2 · 대기 2 · 흐름 1`

The legend is decorative/non-mutating and uses stable DOM hooks for browser smoke.

## Verification target

Run before commit:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke URL:

- `/office?stage14n=safe-floor-legend`

Smoke assertions:

- floor legend present;
- summary present;
- items: `active`, `idle`, `flow`, `safety`;
- Stage 14-M/L/K/J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-N, prefer a consolidation/readability pass before adding more visual rails. If continuing, Stage 14-O should be a small safe consolidation/status snapshot layer derived from existing safe helper outputs, not a new renderer or data source.
