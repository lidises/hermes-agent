# Stage 14-J — Safe Tactical Minimap

Date: 2026-05-09 17:57 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a tiny DeskRPG-like tactical minimap summary to `/office` so the existing safe room beacons and flow pulse bands read as one compact tactical layer.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeTacticalMinimapCell`
- `OfficeSafeTacticalMinimap`
- `buildOfficeSafeTacticalMinimap(delta)`

The helper composes existing safe dynamic-tracking helpers:

- `buildOfficeSafeRoomBeacons(delta)`
- `buildOfficeSafeFlowPulseBands(delta)`

The UI renders:

- `data-office-safe-tactical-minimap="true"`
- `data-office-safe-tactical-minimap-summary="true"`
- `data-office-safe-tactical-minimap-cell="sessions|work|automation|routing"`
- cell intensity/active/weight hooks for browser smoke.

## Derivation rules

- Room order is fixed: `sessions`, `work`, `automation`, `routing`.
- Labels are generated Korean known-room labels only.
- Cell details are generated from safe beacon tone and weight only, e.g. `주의 · 밀도 4`.
- Summary is aggregate-only, e.g. `활성 방 3개 · 흐름 2개`.
- Changed-flow raw labels are ignored.
- Recent-change labels/details are ignored.
- Raw badge labels are ignored.

## Safety contract

Stage 14-J must not expose or derive visible copy from:

- prompt, transcript, task body, script, log, or generated task content;
- secret, token, API key, password, auth material;
- provider/model identity;
- individual task identity;
- raw changed-flow labels, raw badge labels, or recent-change details.

No backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeTacticalMinimap is not a function`.

GREEN target:

- Add the helper/types in `officeView.ts`.
- Keep expected helper output raw-term-free.
- Then wire React/CSS after helper GREEN.

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

- `/office?stage14j=safe-tactical-minimap`

Smoke assertions:

- tactical minimap present;
- summary present;
- cells: `sessions`, `work`, `automation`, `routing`;
- Stage 14-I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-J, consider another tiny safe dynamic tracking/readability slice only if it composes existing safe DTO/delta aggregates without new source reads or raw projection. Candidate: a safe “status ticker” that summarizes tactical minimap changes over the detached rail, still generated and aggregate-only.
