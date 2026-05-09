# Stage 14-I — Safe flow pulse bands

Date: 2026-05-09 17:43 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a small DeskRPG-like spatial motion layer to `/office`: safe flow pulse bands over the existing CSS/SVG map. The layer should make changed safe room flows visible as moving route energy without reading raw labels, adding a renderer, or changing backend data.

## Scope

Implemented as a frontend-only, read-only Stage 14-I slice:

- `OfficeSafeFlowPulseBand`
- `OfficeSafeFlowPulseBands`
- `buildOfficeSafeFlowPulseBands(delta)`
- map overlay hook: `data-office-safe-flow-pulse-bands="true"`
- per-flow hook: `data-office-safe-flow-pulse-band="sessions-to-work|work-to-automation|..."`
- compact rail hook: `data-office-safe-flow-pulse-rail="true"`
- reduced-motion CSS fallback for the pulse-band dash animation

## Derivation rules

The helper derives only from existing safe delta aggregates:

1. Read `OfficeStateDelta.changedFlows` only.
2. Ignore raw changed-flow labels.
3. Use generated Korean room labels from known room IDs.
4. Use fixed known map coordinates for the four room IDs.
5. Generate deterministic `id`, `label`, `detail`, tone, and intensity.
6. Return no fabricated bands when `changedFlows` is empty.

## Safety contract

Stage 14-I must not read or expose:

- raw prompt/transcript/task body/script/log text
- raw changed-flow labels or raw badge labels
- recent-change labels/details
- model/provider identity
- individual task identity
- auth fields, secrets, tokens, passwords, API keys

Stage 14-I also remains:

- frontend-only
- read-only
- CSS/SVG/DOM-only
- no renderer dependency
- no backend/API/schema changes
- no mutation controls
- no persistent browser storage

## TDD record

RED was verified first:

- Added a focused helper test for `buildOfficeSafeFlowPulseBands(delta)`.
- The first run failed with `TypeError: buildOfficeSafeFlowPulseBands is not a function`.

GREEN target:

- Helper returns generated non-interactive decorative pulse bands from changed safe flows.
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

- `/office?stage14i=safe-flow-pulse-bands`
- flow pulse overlay exists
- flow pulse rail exists
- empty first-snapshot state is explicit if no changed safe flows exist
- Stage 14-H room beacons still exist
- Stage 14-G attention strip still exists
- Stage 14-F focus lane still exists
- route compass, breadcrumb, pulse timeline still exist
- raw leak regex false
- console JS errors none

## Next candidate

If continuing after Stage 14-I, prefer another small safe/read-only layer that improves map comprehension from the same safe aggregates, such as a safe tactical minimap legend or room pressure dial. Do not add renderer dependencies, sprites, persistent state, backend/API changes, or mutation controls.
