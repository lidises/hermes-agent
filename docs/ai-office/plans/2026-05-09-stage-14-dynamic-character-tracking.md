# Stage 14-A Dynamic Character Tracking Cues

> For Hermes: continue the DeskRPG-like AI Office direction with dependency-free, read-only, safe DTO-only UI slices. Use TDD for any code change.

## Goal

Make `/office` feel more continuously trackable without adding a renderer, sprites, canvas, backend schema/API changes, mutation controls, persistent browser storage, or raw record projection.

## Evidence and design input

- DeskRPG and WorkAdventure-style virtual offices emphasize a readable 2D map, avatars, room zones, routes, and live presence.
- For Hermes AI Office, the safe equivalent is not chat/proximity/avatar identity. It is a browser-local observability layer: generated role characters, visible activity state, route/change hints, text-equivalent rails, and safe inspection.
- Stage 11 closed renderer adoption for now; CSS/SVG remains the primary path until a measured blocker appears.

## Stage 14-A slice

Add a safe character tracking cue layer:

1. Pure helper in `web/src/pages/officeView.ts`:
   - `OfficeCharacterTrackingCue`
   - `buildOfficeCharacterTrackingCues(characters, delta)`
2. The helper derives only from generated `OfficeCharacter[]` and `OfficeStateDelta`.
3. It must not inspect or project prompts, transcripts, task bodies, cron scripts, logs, auth fields, secrets, model/provider identities, individual task identities, or raw record labels.
4. It should output Korean tracking labels such as:
   - `세션 순찰`
   - `작업 추적`
   - `자동화 감시`
   - `라우팅 확인`
   - `변화 감지`
5. React renders small decorative tracking rings/trails behind character markers with:
   - `data-office-character-tracking="true"`
   - `data-office-character-tracking-tone`
   - `aria-hidden="true"`
   - `pointer-events: none`
6. Add a text-equivalent Stage 14-A tracking rail/legend near the map legend so reduced-motion users still receive the same meaning.
7. CSS remains dependency-free and honors `prefers-reduced-motion: reduce`.

## TDD tasks

### Task 1: RED helper test

Modify `web/src/pages/OfficePage.test.ts` to import `buildOfficeCharacterTrackingCues` before it exists and assert:

- one cue per visible safe character;
- characters in rooms touched by safe node/flow delta are labeled `변화 감지` and use an alert tone;
- ordinary model/worker/automation/router rooms use safe Korean room tracking labels;
- output contains CSS variable style values and no raw-looking terms.

Expected RED failure: export/function does not exist.

### Task 2: GREEN helper implementation

Modify `web/src/pages/officeView.ts` to add the types and helper. Keep it deterministic and side-effect free.

### Task 3: UI integration

Modify `web/src/pages/OfficePage.tsx` to compute cues from `densityPlan.visibleCharacters` and `latestDelta`, then render decorative tracking cues behind character markers plus a compact text rail.

### Task 4: CSS integration

Modify `web/src/index.css` to add ring/trail animations and reduced-motion fallback.

### Task 5: Verification

Run:

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

`http://127.0.0.1:8765/office?stage14a=tracking`

Smoke checks:

- `[data-office-character-tracking="true"]` count matches visible character count.
- `[data-office-character-tracking-rail="true"]` exists.
- character inspect buttons still exist.
- raw leak regex false for raw content/credential terms.
- console JS errors none.
- reduced-motion meaning is present in text rail/labels, not animation only.

## Non-goals

- No PixiJS/Phaser/canvas/sprite assets.
- No DeskRPG code/assets copy.
- No backend/API/schema change.
- No mutation controls.
- No persistent browser storage.
- No cron/Kanban/topic/gateway/NAS/Obsidian writes.
- No generated dialogue, speech bubbles, hidden thoughts, or individual task identity.

## Implementation notes

Stage 14-A implementation completed in code before final commit:

- `officeView.ts`: added `OfficeCharacterTrackingCue`, `OfficeCharacterTrackingStyle`, and `buildOfficeCharacterTrackingCues`.
- `OfficePage.tsx`: renders decorative tracking cues behind visible character markers and adds a Korean text-equivalent tracking rail.
- `index.css`: adds dependency-free tracking pulse styles and reduced-motion fallback.
- `OfficePage.test.ts`: adds a RED/GREEN helper test proving safe labels, delta-aware alert cues, deterministic CSS variables, non-interactivity, and raw-term exclusion.

Observed TDD cycle:

- RED: focused test failed because `buildOfficeCharacterTrackingCues` did not exist.
- GREEN: focused suite passed with 30 tests.
- Focused ESLint passed for touched TS/TSX test files.
- Full Stage 14-A verification passed: focused web tests/lint/build, backend focused office tests, `git diff --check`, and browser smoke.
