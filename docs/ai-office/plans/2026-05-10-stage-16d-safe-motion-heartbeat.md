# Stage 16-D — Safe Motion Heartbeat

Date: 2026-05-10 00:41 KST
Branch: `ai-office-stage16d-safe-motion-heartbeat-20260510`
Base: `4ab297bb` (`feat(office): add read-only safe event stream`)

## Why

Stage 16-C added a protected read-only safe event endpoint and frontend fallback posture. To make `/office` visibly feel more alive without exposing raw data or adding a renderer, Stage 16-D adds a browser-local safe polling/heartbeat layer over the same allowlisted event shape.

## Goal

Make the office show a clear live-safe movement cadence:

- safe endpoint polling status;
- last safe tick bucket;
- active motion intensity derived only from safe event count/tone;
- visible CSS-only heartbeat/scan cues;
- no fabricated task history or raw event content.

## Scope

1. Frontend heartbeat helper
   - Add a pure helper that maps stream posture + browser-local tick metadata into a generated heartbeat plan.
   - Inputs: safe stream mode, safe event count/tone, poll status, tick count, failure count.
   - Outputs: Korean generated labels, cadence bucket, intensity, aria/decorative flags.

2. UI/CSS
   - Poll `/api/office/events` periodically while the page is visible.
   - Render a compact heartbeat rail near Stage 16-C event substrate.
   - Add CSS scan/heartbeat animation with reduced-motion fallback.

3. Tests
   - Helper test must RED before implementation and GREEN after.
   - Existing office tests remain green.

## Safety contract

Preserved unless separately approved:

- read-only only;
- no mutation controls;
- no persistent browser storage;
- no raw prompt/transcript/task_body/script/log/provider/model/secret/token/adapter error/task identity;
- no renderer dependency;
- no SSE/WebSocket in this slice; browser-local safe polling only.

## Implementation record

Completed so far:

- RED verified: `OfficePage.test.ts` failed with `TypeError: buildOfficeSafeMotionHeartbeat is not a function` before helper implementation.
- Added `OfficeSafeMotionHeartbeat`, `OfficeSafeMotionHeartbeatItem`, `OfficeSafeMotionHeartbeatOptions`, and `buildOfficeSafeMotionHeartbeat(...)`.
- Helper derives only from safe stream posture, safe event count/tone, browser-local poll status, tick count, failure count, and reduced-motion preference.
- `/office` now polls `/api/office/events` every 5 seconds while the tab is visible; successful safe-event fetches increment a browser-local safe tick, failures keep local fallback.
- Added heartbeat rail and hooks:
  - `data-office-safe-motion-heartbeat="true"`
  - `data-office-safe-motion-heartbeat-mode`
  - `data-office-safe-motion-heartbeat-phase`
  - `data-office-safe-motion-heartbeat-intensity`
  - `data-office-safe-motion-heartbeat-enabled`
  - `data-office-safe-motion-heartbeat-item="stream|cadence|motion"`
- Added CSS-only heartbeat/scan cues and reduced-motion fallback.

Verification so far:

- `npm test -- --run OfficePage.test.ts`: 54 passed after helper implementation.
- Focused UI/CSS pass: `OfficePage.test.ts` 54 passed and ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.

Final verification 2026-05-10 00:52 KST:

- `npm test -- --run OfficePage.test.ts`: 54 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.
- `npm run build` passed with the existing Vite large chunk warning only.
- Backend focused office tests passed: 21 passed in 1.02s.
- `git diff --check` passed.
- Browser smoke `/office?stage16d=safe-motion-heartbeat` passed: safe event substrate present, stream status present, safe motion heartbeat present, heartbeat mode/phase/intensity/enabled hooks present, heartbeat items `stream|cadence|motion`, motion lane present, raw leak false, console JS errors none.

## Verification target

Frontend:

```bash
cd web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts src/lib/api.ts
npm run build
```

Backend:

```bash
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Browser smoke:

- `/office?stage16d=safe-motion-heartbeat`
- safe event substrate present;
- safe stream status present;
- safe motion heartbeat present;
- heartbeat phase/intensity hooks present;
- motion lane still present;
- raw leak false;
- console JS errors none.
