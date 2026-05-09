# Stage 16-B — Safe Event Substrate Motion

Date: 2026-05-09 23:11 KST
Branch: `ai-office-stage16-safe-realtime-motion-20260509`
Base: `161f16a2` (`feat(office): add AI office-first layout reset`)

## Why

Stage 16-A made `/office` honest: current motion is CSS decoration plus browser-local snapshot/delta. The next product gap is making the office feel like it reacts when work enters or changes, without exposing raw commands, prompts, task bodies, tool args, logs, provider/model identity, credentials, or individual task identity.

## Goal

Add a frontend-only safe event substrate projection that turns existing safe snapshot/delta aggregates into redacted event categories and visible office motion cues.

This is not a backend SSE/WebSocket implementation. It is the safe contract and visual substrate that a later backend stream can feed.

## Scope

1. Safe event model
   - Build `OfficeSafeEvent` records from already-safe `OfficeStateDelta` and character counts.
   - Events carry only category, room, tone, count, lane, and generated Korean copy.
   - No raw labels/details from badges, flows, recent changes, prompt/transcript/task/log/provider/model fields.

2. Motion command plan
   - Convert safe events into small generated motion commands for scene reaction.
   - Examples: pulse sessions room, move sessions→work lane, raise warning attention, show queue density.
   - Output remains CSS/DOM/SVG only.

3. UI
   - Add a compact event substrate strip near the Stage 16-A tracking truth area.
   - Add a “movement lane” rail showing what the office would animate from the safe events.
   - Add map-level data attributes so CSS can subtly react when safe event density exists.

4. Documentation
   - STATUS/NEXT should describe Stage 16-B as a safe event substrate, not raw real-time tracking.
   - Stage 16-C, if needed, can later connect an approved backend SSE endpoint to the same event shape.

## Safety contract

Preserved:

- frontend-only
- read-only
- no backend/API/schema changes
- no mutation controls
- no persistent browser storage
- no renderer dependency
- no copied DeskRPG code/assets
- no raw prompt/transcript/task_body/script/log/provider/model/secret/token/task identity projection

## TDD plan

Add focused helper tests first in `web/src/pages/OfficePage.test.ts`:

- `buildOfficeSafeEventSubstrate(delta, options)`
  - first snapshot with no delta returns a `snapshot_static` / static posture event, not fabricated history.
  - safe node/flow deltas produce generated categories such as `room_density_changed`, `flow_changed`, and `attention_changed`.
  - injected raw-looking labels/details are ignored.

- `buildOfficeSafeMotionCommands(events)`
  - converts events into generated movement commands such as `pulse-room`, `route-lane`, and `attention-spark`.
  - commands expose safe room/lane/tone/count only.

## Implementation record

Completed so far:

- RED verified: focused `OfficePage.test.ts` failed while `buildOfficeSafeEventSubstrate` was missing.
- Added `OfficeSafeEvent`, `OfficeSafeEventSubstrate`, and `buildOfficeSafeEventSubstrate(delta, options)`.
- Added `OfficeSafeMotionCommand` and `buildOfficeSafeMotionCommands(events)`.
- Event categories are allowlisted and generated:
  - `snapshot_static`
  - `room_density_changed`
  - `flow_changed`
  - `attention_changed`
- Motion commands are generated from safe events:
  - `idle-glow`
  - `pulse-room`
  - `route-lane`
  - `attention-spark`
- React UI connects the substrate near the Stage 16-A tracking truth strip with hooks:
  - `data-office-safe-event-substrate="true"`
  - `data-office-safe-event-item`
  - `data-office-safe-motion-lane="true"`
  - `data-office-safe-motion-command`
- CSS adds subtle scanning motion for generated command chips and disables it under `prefers-reduced-motion`.

Final verification 2026-05-09 23:20 KST:

- `npm test -- --run OfficePage.test.ts`: 52 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, and `OfficePage.test.ts`.
- `npm run build` passed with the existing Vite large chunk warning only.
- Backend focused office tests passed: 18 passed in 0.98s.
- `git diff --check` passed.
- Browser smoke `/office?stage16b=safe-event-substrate-motion`: safe event substrate present, safe event item present, safe motion lane present, selected-character click still works, Stage 16-A office-first layout and Stage 14 hooks still present, raw leak false, console JS errors none.

## Browser smoke target

`/office?stage16b=safe-event-substrate-motion`

Expected:

- `data-office-safe-event-substrate="true"` exists.
- `data-office-safe-event-item` exists, including static posture on first snapshot.
- `data-office-safe-motion-lane="true"` exists.
- no raw leak.
- console JS errors none.
- Stage 16-A office-first layout and selected-character panel still work.
