# Stage 14-H — Safe room beacons

Date: 2026-05-09 17:37 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add one more tiny DeskRPG-like dynamic tracking layer to `/office`: decorative room beacons over the existing CSS/SVG map. The beacons should make safe focus density feel spatial and alive without adding a renderer, backend changes, storage, mutation controls, or raw record projection.

## Scope

Implemented as a frontend-only, read-only Stage 14-H slice:

- `OfficeSafeRoomBeaconIntensity`
- `OfficeSafeRoomBeacon`
- `OfficeSafeRoomBeacons`
- `buildOfficeSafeRoomBeacons(delta)`
- map overlay hook: `data-office-safe-room-beacons="true"`
- per-room beacon hook: `data-office-safe-room-beacon="sessions|work|automation|routing"`
- compact rail hook: `data-office-safe-room-beacon-rail="true"`
- reduced-motion CSS fallback for the beacon pulse ring

## Derivation rules

The helper derives only from already-safe dynamic aggregates:

1. Reuse `buildOfficeSafeFocusLane(delta)`.
2. Convert each known room item into a generated beacon label/detail.
3. Use fixed known map coordinates for the four room IDs.
4. Map safe focus weight to intensity:
   - `high`: weight >= 4
   - `medium`: weight >= 2
   - `low`: weight > 0
   - `idle`: weight = 0
5. Keep ordering identical to the safe focus lane so negative/warning density remains visually prioritized.

## Safety contract

Stage 14-H must not read or expose:

- raw prompt/transcript/task body/script/log text
- raw changed-flow labels or raw badge labels
- model/provider identity
- individual task identity
- auth fields, secrets, tokens, passwords, API keys

Stage 14-H also remains:

- frontend-only
- read-only
- CSS/SVG/DOM-only
- no renderer dependency
- no backend/API/schema changes
- no mutation controls
- no persistent browser storage

## TDD record

RED was verified first:

- Added a focused helper test for `buildOfficeSafeRoomBeacons(delta)`.
- The first run failed with `TypeError: buildOfficeSafeRoomBeacons is not a function`.

GREEN target:

- Helper returns four generated non-interactive decorative beacons.
- Helper output excludes raw/sensitive strings.
- Focused frontend test passes.

## Verification target

Run before commit:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Browser smoke:

- `/office?stage14h=safe-room-beacons`
- room beacons exist
- per-room beacon hooks include `sessions`, `work`, `automation`, `routing`
- beacon rail exists
- Stage 14-G attention strip still exists
- Stage 14-F focus lane still exists
- route compass, breadcrumb, pulse timeline still exist
- raw leak regex false
- console JS errors none

## Next candidate

If continuing after Stage 14-H, prefer another small safe/read-only layer that improves DeskRPG-like comprehension without new data reads, such as a safe route pulse summary or static map minimap legend derived from the same safe aggregates.
