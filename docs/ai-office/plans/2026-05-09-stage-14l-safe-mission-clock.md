# Stage 14-L — Safe Mission Clock

Date: 2026-05-09 18:13 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact DeskRPG-like mission clock to `/office` so the dashboard exposes browser-local tracking posture as a readable HUD element without adding backend state, persistence, renderer dependencies, or new source reads.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeMissionClockOptions`
- `OfficeSafeMissionClockItem`
- `OfficeSafeMissionClock`
- `buildOfficeSafeMissionClock(options)`

The helper derives only from browser-local posture:

- live tracking enabled/disabled;
- tab visibility;
- consecutive local read failures;
- whether the latest browser-local safe delta has changes.

## UI hooks

- `data-office-safe-mission-clock="true"`
- `data-office-safe-mission-clock-headline="true"`
- `data-office-safe-mission-clock-item="mode|cadence|safety|pulse"`

## Derivation rules

- Live mode headline: `실시간 · 표시/숨김 탭 · N초`.
- Manual mode headline: `수동 · 표시/숨김 탭 · 대기`.
- Cadence uses the existing safe interval resolver `resolveOfficeLiveTrackingInterval`.
- Safety item is fixed generated copy: `브라우저 로컬 · 읽기 전용`.
- Pulse item only reflects whether the latest safe delta has browser-local changes.

## Safety contract

Stage 14-L must not expose or derive visible copy from prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, or recent-change details.

No backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeMissionClock is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Keep output browser-posture-only and raw-term-free.
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

- `/office?stage14l=safe-mission-clock`

Smoke assertions:

- mission clock present;
- headline present;
- items: `mode`, `cadence`, `safety`, `pulse`;
- Stage 14-K/J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-L, consider another tiny safe aggregate-only layer only if it is not visually duplicative. Candidate: a safe “command deck”/HUD summary that groups mission clock, tactical ticker, and source health into one compact read-only status row.
