# Stage 14-M — Safe Command Deck

Date: 2026-05-09 18:20 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact DeskRPG-like command deck to `/office` so the safety panel can show one readable command HUD that summarizes mission clock, tactical ticker, source health, and safety posture without exposing raw records.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeCommandDeckCard`
- `OfficeSafeCommandDeck`
- `buildOfficeSafeCommandDeck(state, delta, missionOptions)`

The helper derives only from already safe helpers/aggregates:

- `buildOfficeSafeMissionClock(options)`;
- `buildOfficeSafeTacticalTicker(delta)`;
- `buildOfficeSourceHealthSummary(state)`;
- fixed generated safety copy.

## UI hooks

- `data-office-safe-command-deck="true"`
- `data-office-safe-command-deck-headline="true"`
- `data-office-safe-command-deck-card="mission|tactical|sources|safety"`

## Safety contract

Stage 14-M must not expose prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, recent-change details, or adapter error strings.

It does not add backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeCommandDeck is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Use mission/tactical/source safety summaries only.
- Wire React/CSS only after helper GREEN.

## Implementation notes

The deck renders four cards:

- `mission`: mission clock headline;
- `tactical`: tactical ticker headline;
- `sources`: generated source health detail;
- `safety`: fixed generated copy `읽기 전용 · 로컬 표시 · 원문 제외`.

The deck headline joins mission-clock headline with source-health label, for example:

- `수동 · 표시 탭 · 대기 · 주의 필요`

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

- `/office?stage14m=safe-command-deck`

Smoke assertions:

- command deck present;
- headline present;
- cards: `mission`, `tactical`, `sources`, `safety`;
- Stage 14-L/K/J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-M, consider stopping visual accretion and doing a safe consolidation/readability pass, or adding one last tiny safe "floor legend" layer only if it improves scanability without duplicating the deck.
