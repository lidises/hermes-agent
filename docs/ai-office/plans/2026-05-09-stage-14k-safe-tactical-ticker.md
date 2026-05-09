# Stage 14-K — Safe Tactical Ticker

Date: 2026-05-09 18:03 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact tactical ticker to `/office` so the DeskRPG-like dynamic tracking stack has a one-line operational readout derived only from safe minimap and attention signals.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeTacticalTickerItem`
- `OfficeSafeTacticalTicker`
- `buildOfficeSafeTacticalTicker(delta)`

The helper composes existing safe helpers:

- `buildOfficeSafeTacticalMinimap(delta)`
- `buildOfficeSafeAttentionStrip(delta)`

The UI renders:

- `data-office-safe-tactical-ticker="true"`
- `data-office-safe-tactical-ticker-headline="true"`
- `data-office-safe-tactical-ticker-item="focus|map|cells"`

## Derivation rules

- Headline is generated from safe attention heading plus tactical minimap summary.
- `focus` item reuses the safe attention focus chip detail.
- `map` item reuses the safe tactical minimap aggregate summary.
- `cells` item compresses active minimap cells into generated room-label/weight pairs.
- Raw badge labels, raw changed-flow labels, recent-change labels/details, and source records are ignored.

## Safety contract

Stage 14-K must not expose or derive visible copy from prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, or recent-change details.

No backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeTacticalTicker is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Keep output aggregate-only and raw-term-free.
- Wire React/CSS only after helper GREEN.

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

- `/office?stage14k=safe-tactical-ticker`

Smoke assertions:

- tactical ticker present;
- headline present;
- items: `focus`, `map`, `cells`;
- Stage 14-J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-K, consider stopping for user review or continuing with another tiny safe aggregate-only layer if it is not visually duplicative. Candidate: a safe “mission clock” summarizing refresh/manual/live mode posture from existing browser-local state only.
