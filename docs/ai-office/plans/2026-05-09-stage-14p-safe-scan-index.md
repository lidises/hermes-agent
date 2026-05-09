# Stage 14-P — Safe Scan Index

Date: 2026-05-09 18:56 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact safe scan index to the `/office` safety panel so the DeskRPG-like dashboard can show a quick three-cell read of snapshot posture, safe rail count, and browser-local tracking mode.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeScanIndexItem`
- `OfficeSafeScanIndex`
- `buildOfficeSafeScanIndex(state, delta, missionOptions)`

The helper derives only from already safe helpers/aggregates:

- `buildOfficeSafeStatusSnapshot(state, delta, missionOptions)`;
- `buildOfficeSafeFloorLegend(delta)`;
- browser-local mission options;
- fixed generated labels/details.

## UI hooks

- `data-office-safe-scan-index="true"`
- `data-office-safe-scan-index-headline="true"`
- `data-office-safe-scan-index-item="snapshot|rail|mode"`

## Safety contract

Stage 14-P must not expose prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, recent-change details, or adapter error strings.

It does not add backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeScanIndex is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Compose only status snapshot, floor legend, rail count, and browser-local tracking mode.
- Wire React/CSS only after helper GREEN.

## Implementation notes

The scan index renders three generated items:

- `snapshot`: safe status snapshot headline;
- `rail`: generated safe rail count;
- `mode`: browser-local live/manual + visible/hidden posture.

Example headline:

- `스캔 4칸 · 소스 주의 · 활성 3 · 대기 1 · 흐름 1`

The UI is decorative/non-mutating and lives in the safety panel below Stage 14-O.

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

- `/office?stage14p=safe-scan-index`

Smoke assertions:

- scan index present;
- headline present;
- items: `snapshot`, `rail`, `mode`;
- Stage 14-O/N/M/L/K/J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-P, prefer consolidation and readability. New visual accretion should only continue if it meaningfully improves scanability under the existing safety contract.
