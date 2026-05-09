# Stage 14-O — Safe Status Snapshot

Date: 2026-05-09 18:46 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact safe status snapshot to the `/office` safety panel so the DeskRPG-like dashboard has one consolidated read on mission/deck posture, floor activity, source availability, and projection guardrails.

## Scope

Frontend-only, read-only, CSS/DOM-only slice.

Implemented view-model target:

- `OfficeSafeStatusSnapshotItem`
- `OfficeSafeStatusSnapshot`
- `buildOfficeSafeStatusSnapshot(state, delta, missionOptions)`

The helper derives only from already safe helpers/aggregates:

- `buildOfficeSafeCommandDeck(state, delta, missionOptions)`;
- `buildOfficeSafeFloorLegend(delta)`;
- `buildOfficeSourceHealthSummary(state)`;
- fixed generated guardrail copy.

## UI hooks

- `data-office-safe-status-snapshot="true"`
- `data-office-safe-status-snapshot-headline="true"`
- `data-office-safe-status-snapshot-item="deck|floor|source|guard"`

## Safety contract

Stage 14-O must not expose prompt, transcript, task body, script, log, auth material, secret, token, provider/model identity, individual task identity, raw changed-flow label, raw badge label, recent-change details, or adapter error strings.

It does not add backend/API/schema changes, mutation controls, persistent browser storage, renderer dependencies, canvas, Phaser/Pixi, sprite assets, or DeskRPG copied assets/code.

## TDD record

RED first:

- `npm test -- --run OfficePage.test.ts`
- Expected failure observed: `TypeError: buildOfficeSafeStatusSnapshot is not a function`.

GREEN target:

- Add helper/types in `officeView.ts`.
- Compose only command deck, floor legend, source health, and fixed safety copy.
- Wire React/CSS only after helper GREEN.

## Implementation notes

The snapshot renders four generated items:

- `deck`: safe command-deck mission posture;
- `floor`: safe floor-legend summary;
- `source`: reported source availability count;
- `guard`: fixed `읽기 전용 · 원문 제외` copy.

Example headline:

- `소스 주의 · 활성 2 · 대기 2 · 흐름 1`

The UI is decorative/non-mutating and lives in the safety panel near the mission clock and command deck.

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

- `/office?stage14o=safe-status-snapshot`

Smoke assertions:

- status snapshot present;
- headline present;
- items: `deck`, `floor`, `source`, `guard`;
- Stage 14-N/M/L/K/J/I/H/G/F/E/D/C hooks still present;
- raw leak regex false;
- console JS errors none.

## Next candidate

After Stage 14-O, stop visual accretion unless a small consolidation/readability stage has a clear scanability win. Renderer/dependency work remains closed without explicit approval.
