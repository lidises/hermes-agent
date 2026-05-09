# Stage 14-C Safe Pulse Timeline

> Continue the DeskRPG-like dynamic tracking loop after Stage 14-B. Keep the renderer decision closed: CSS/SVG/DOM only, no new runtime dependency.

## Goal

Make safe browser-local deltas feel more alive by adding a compact pulse timeline that summarizes room badges, room-to-room flow changes, and recent safe changes without exposing raw records.

## Stage 14-C slice

Add a small safe helper and UI layer:

1. `OfficeSafePulseTimeline` and `OfficeSafePulseTimelineItem` types.
2. `buildOfficeSafePulseTimeline(delta)` in `web/src/pages/officeView.ts`.
3. Timeline items are derived only from already-safe `OfficeStateDelta` fields:
   - `nodeBadges`
   - `changedFlows`
   - `recentChanges`
4. Labels must be generated Korean labels, not copied raw change details:
   - `세션 변화`
   - `세션 → 작업`
   - `최근 안전 변화 1`
5. React renders a compact text/pulse rail with:
   - `data-office-safe-pulse-timeline="true"`
   - per item `data-office-safe-pulse-item`
   - decorative dots only; no controls.
6. CSS remains dependency-free and disables pulse animation under `prefers-reduced-motion: reduce`.

## Safety constraints

- No backend/API/schema changes.
- No mutation controls.
- No persistent browser storage.
- No Phaser/PixiJS/canvas/sprite assets.
- No DeskRPG code/assets copy.
- No raw prompt/transcript/task body/cron script/log/auth/secret/token/model/provider identity/individual task identity.
- Use only safe browser-local `OfficeStateDelta`.

## TDD tasks

1. RED test: import/use `buildOfficeSafePulseTimeline` before implementation. Assert generated labels, safe tones, non-interactivity, and raw-term exclusion.
2. GREEN helper: implement deterministic safe timeline.
3. UI: render the Stage 14-C rail in the existing map legend.
4. CSS: subtle pulse-dot animation with reduced-motion fallback.
5. Verify focused tests/lint/build/backend/browser/diff.

## Browser smoke URL

`http://127.0.0.1:8765/office?stage14c=safe-pulse-timeline`

Smoke checks:

- `[data-office-safe-pulse-timeline="true"]` exists.
- `[data-office-safe-pulse-item]` count is greater than 0.
- Stage 14-A tracking cues and Stage 14-B room meters still exist.
- raw leak regex false.
- console JS errors none.

## Implementation notes

Stage 14-C implementation completed in code before final commit:

- `officeView.ts`: added `OfficeSafePulseTimeline`, `OfficeSafePulseTimelineItem`, and `buildOfficeSafePulseTimeline`.
- `OfficePage.tsx`: renders a Stage 14-C safe pulse timeline in the map legend with per-item smoke hooks.
- `index.css`: adds safe pulse dot styling and reduced-motion fallback.
- `OfficePage.test.ts`: adds a RED/GREEN helper test for generated Korean labels, safe tones, non-interactivity, and raw-term exclusion.

Observed TDD cycle:

- RED: focused test failed because `buildOfficeSafePulseTimeline` did not exist.
- GREEN: focused suite passed with 32 tests.
- Focused ESLint passed for touched TS/TSX/test files.
- Build passed with the existing Vite large-chunk warning. Build output: JS 1,264.70 kB / gzip 369.56 kB; CSS 132.48 kB / gzip 21.33 kB.
- Backend focused office tests passed: 18 passed in 1.02s.
- `git diff --check` passed.
- Browser smoke passed on `/office?stage14c=safe-pulse-timeline`: pulse timeline exists, pulse item count 1, Stage 14-A tracking cues 11, Stage 14-B room meters 4, raw leak regex false, console JS errors none.

Final verification before commit:

- `npm test -- --run OfficePage.test.ts` -> 32 passed.
- ESLint for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts` passed.
- `npm run build` passed with the existing Vite large-chunk warning.
- Backend focused office tests -> 18 passed in 1.02s.
- `git diff --check` passed.
- Browser smoke `/office?stage14c=safe-pulse-timeline` passed.
