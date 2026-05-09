# Stage 14-B Room Activity Meters

> Continue the DeskRPG-like dynamic tracking loop after Stage 14-A. Keep the renderer decision closed: CSS/SVG/DOM only, no new runtime dependency.

## Goal

Make each office room feel like a live RPG zone by adding safe room-level activity meters derived from safe room counts, generated characters, and browser-local delta. This should help the user read “where activity is happening” without exposing raw records.

## Stage 14-B slice

Add a small safe helper and UI layer:

1. `OfficeRoomActivityMeter` type.
2. `buildOfficeRoomActivityMeters(nodes, characters, delta)` in `web/src/pages/officeView.ts`.
3. One meter per `OfficeMapNode`.
4. Meter intensity is safe and coarse:
   - `quiet` for no count, no visible character, no delta.
   - `active` for count/characters.
   - `busy` for high count or multiple visible characters.
   - `changed` for rooms touched by node/flow delta.
5. Labels must be Korean and safe:
   - `조용함`, `활동`, `분주함`, `변화 감지`.
6. React renders small non-interactive room meters on the map with:
   - `data-office-room-activity="true"`
   - `data-office-room-activity-level`
   - `aria-hidden="true"`
7. Text-equivalent rail is added near the existing legend so meaning is not animation-only.
8. CSS is dependency-free and honors reduced motion.

## Safety constraints

- No backend/API/schema changes.
- No mutation controls.
- No persistent browser storage.
- No Phaser/PixiJS/canvas/sprite assets.
- No DeskRPG code/assets copy.
- No raw prompt/transcript/task body/cron script/log/auth/secret/model/provider identity/individual task identity.
- Use only safe generated `OfficeMapNode[]`, `OfficeCharacter[]`, and `OfficeStateDelta`.

## TDD tasks

1. RED test: import/use `buildOfficeRoomActivityMeters` before implementation. Assert one meter per node, safe labels, changed room priority, no raw terms.
2. GREEN helper: implement deterministic safe meters.
3. UI: render meters near room nodes and text rail.
4. CSS: subtle meter bar/pulse, reduced-motion fallback.
5. Verify focused tests/lint/build/backend/browser/diff.

## Browser smoke URL

`http://127.0.0.1:8765/office?stage14b=room-activity`

Smoke checks:

- `[data-office-room-activity="true"]` count is 4.
- `[data-office-room-activity-rail="true"]` exists.
- raw leak regex false.
- console JS errors none.
- Character inspect buttons and Stage 14-A tracking cues still exist.

## Implementation notes

Stage 14-B implementation completed in code before final commit:

- `officeView.ts`: added `OfficeRoomActivityLevel`, `OfficeRoomActivityMeter`, and `buildOfficeRoomActivityMeters`.
- `OfficePage.tsx`: renders non-interactive room meter bars and a Stage 14-B text rail.
- `index.css`: adds subtle room meter styling and reduced-motion fallback.
- `OfficePage.test.ts`: adds a RED/GREEN helper test for safe level derivation, changed-room priority, detail copy, non-interactivity, and raw-term exclusion.

Observed TDD cycle:

- RED: focused test failed because `buildOfficeRoomActivityMeters` did not exist.
- GREEN: focused suite passed with 31 tests.
- Focused ESLint passed for touched TS/TSX/test files.
- Full Stage 14-B verification passed: focused web tests/lint/build, backend focused office tests, `git diff --check`, and browser smoke.
