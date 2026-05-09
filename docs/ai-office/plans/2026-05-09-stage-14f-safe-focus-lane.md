# Stage 14-F — safe focus lane

Date: 2026-05-09
Branch: ai-office-stage14-dynamic-tracking-20260509

## Goal

Add a compact safe focus lane that ranks the rooms by browser-local safe delta density so the next area to inspect is visible without exposing raw work content.

## Constraints

- Frontend-only dashboard slice.
- CSS/SVG/DOM only; no renderer dependency, canvas, sprites, Phaser, PixiJS, or DeskRPG code/assets.
- No backend/API/schema changes.
- No mutation controls.
- No persistent browser storage.
- Do not project raw prompts, transcripts, task bodies, scripts, logs, auth fields, secrets, tokens, provider/model identity, or individual task identity.

## Implementation

- `web/src/pages/officeView.ts`
  - Added `OfficeSafeFocusLaneItem`, `OfficeSafeFocusLane`, and `buildOfficeSafeFocusLane(delta)`.
  - The helper ranks known rooms by safe badge/flow density and emits generated Korean room labels/details only.
  - Items remain decorative/non-interactive via `ariaHidden: true` and `interactive: false`.

- `web/src/pages/OfficePage.tsx`
  - Derives `safeFocusLane` from `latestDelta` inside the existing office map.
  - Adds Stage 14-F legend copy and a compact rail with `data-office-safe-focus-lane="true"`, per-room hooks, and safe weight attributes.

- `web/src/index.css`
  - Adds compact focus-lane rail/item/bar styles using existing tone classes.

- `web/src/pages/OfficePage.test.ts`
  - Adds RED/GREEN helper coverage for density ordering, generated labels, decorative flags, and raw-term exclusion.

## Verification target

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Browser smoke URL:

```text
http://127.0.0.1:8765/office?stage14f=safe-focus-lane
```

Expected smoke checks:

- focus lane exists
- focus lane items: 4
- route compass exists with 3 points
- breadcrumb exists
- pulse timeline exists
- Stage 14-A tracking cues remain present
- Stage 14-B room activity meters remain present
- raw leak regex false
- console JS errors none
