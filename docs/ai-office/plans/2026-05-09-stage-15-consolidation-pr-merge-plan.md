# Stage 15 — Consolidation / PR Merge Plan

Date: 2026-05-09 22:04 KST
Branch before merge: `ai-office-stage14-dynamic-tracking-20260509`
Base: `main`

## Goal

Close the long Stage 14 safe dynamic-tracking/HUD phase and move into a short consolidation phase. Stage 15 should not keep adding decorative HUD layers by default. It should make the existing `/office` dashboard easier to review, merge, and maintain.

## Why Stage 14 Ends at 14-Q

Stage 14 delivered the safe dynamic-tracking/HUD stack:

- safe delta rails, pulse timeline, breadcrumb, route compass, focus lane, attention strip
- map beacons, flow pulse bands, tactical minimap, tactical ticker
- mission clock, command deck, floor legend, status snapshot, scan index
- HUD readability strip and warning/error audit

The phase now has enough dynamic affordances. Further 14-R/S/T slices would likely duplicate summary signals rather than improve the product. Stage 15 therefore starts as consolidation, hierarchy, review readiness, and merge hygiene.

## Non-Goals

Do not use Stage 15 to add any of the following without explicit new approval:

- backend/API/schema changes
- mutation controls
- persistent browser storage
- PixiJS, Phaser, canvas renderer, sprite assets, or DeskRPG code/assets
- remote exposure or gateway/cron/Kanban mutations
- raw prompt/transcript/task body/script/log/provider/model/secret/token/task identity projection
- new source adapters or live backend push/SSE

## Stage 15 Proposed Slices

### Stage 15-A — HUD hierarchy audit

Objective: make the safety panel scan order explicit without adding new data sources.

Tasks:

1. Inspect current `OfficePage.tsx` safety panel order:
   - mission clock
   - command deck
   - status snapshot
   - scan index
   - HUD readability
2. Decide display hierarchy:
   - Primary: command deck or status snapshot
   - Secondary: scan index / floor context
   - Diagnostic: mission clock / HUD readability
3. Add a pure helper only if useful, for example:
   - `buildOfficeSafeHudHierarchy(...)`
   - Inputs must be existing safe helper outputs only.
4. Add focused test before implementation if a helper is added.
5. Keep UI CSS-only and read-only.
6. Verify:
   - `npm test -- --run OfficePage.test.ts`
   - ESLint for OfficePage/officeView/test
   - `npm run build`
   - backend focused office tests + `git diff --check`
   - browser smoke `/office?stage15a=hud-hierarchy`

Acceptance:

- Viewer can tell what to read first.
- No raw data exposure.
- No new renderer/dependency.
- Existing Stage 14 hooks remain stable unless intentionally documented.

### Stage 15-B — Duplicate signal reduction

Objective: reduce repeated phrases/counts across command deck, status snapshot, scan index, and HUD readability.

Tasks:

1. Inventory repeated visible text in `/office` safety panel.
2. Identify which element owns each concept:
   - live/manual posture
   - source health
   - active/idle room posture
   - flow count
   - safety/no-raw guarantee
3. Adjust generated labels/details only where repetition hurts readability.
4. Add/adjust focused tests for changed helper strings.
5. Verify with the same frontend/backend/browser checklist.

Acceptance:

- Less repeated copy.
- Same or better safety posture.
- No hidden behavior changes.

### Stage 15-C — PR/readiness checklist refresh

Objective: make the merged dashboard branch reviewable and easy to continue from main.

Tasks:

1. Update PR/handoff documentation with:
   - Stage 14 final boundary at 14-Q
   - Stage 15 consolidation plan
   - known warning: Vite large chunk warning
   - safety guarantees and non-goals
2. Confirm `STATUS.md` / `NEXT.md` point to Stage 15-A rather than continuing Stage 14.
3. Run final focused verification after docs-only changes.
4. If already merged, ensure `main` contains this plan.

Acceptance:

- Fresh session can start from main and know Stage 15 next steps.
- No ambiguity that Stage 14 is closed.

### Stage 15-D — Visual polish only if evidence demands it

Objective: small CSS polish only after hierarchy/duplicate reduction evidence.

Possible tasks:

- spacing/contrast tweaks in safety panel
- mobile overflow check
- reduced-motion posture check
- keeping the map readable under summary/standard/detail modes

Do not implement unless Stage 15-A/B smoke identifies a concrete readability issue.

## Merge Plan for Current Branch

1. Confirm branch is clean and pushed.
2. Create PR from `ai-office-stage14-dynamic-tracking-20260509` to `main`.
3. PR title:
   - `feat(office): add safe dynamic office dashboard layers`
4. PR body should summarize:
   - Korean-first `/office`
   - DeskRPG-like CSS/SVG office map
   - safe dynamic tracking Stage 14-A through 14-Q
   - read-only/frontend-only/no raw projection constraints
   - verification commands and known Vite chunk warning
   - Stage 15 next plan
5. Check PR status/checks.
6. Merge with squash if allowed, then delete remote branch if safe.
7. Pull `main` locally and verify HEAD.

## Verification Baseline Before Merge

Already verified at Stage 14-Q:

- `OfficePage.test.ts` 46 passed
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`
- `npm run build` passed with existing Vite large chunk warning
- backend focused office tests passed: 18 passed
- `git diff --check` passed
- browser smoke `/office?stage14q=safe-hud-readability`: raw leak false, no console JS errors

## Stage 15 Start Rule

After merge, Stage 15 must start from updated `main` or a new branch from `main`, not by continuing the old Stage 14 branch. First implementation slice should be Stage 15-A HUD hierarchy audit unless the PR/CI reveals a blocker that must be fixed first.
