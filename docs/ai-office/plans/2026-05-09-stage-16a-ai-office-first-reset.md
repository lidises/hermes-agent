# Stage 16-A — AI Office-first Layout Reset

Date: 2026-05-09 22:43 KST
Branch: `ai-office-stage16a-office-first-reset-20260509`
Base: `main` at `ff33c3ff`

## Why

The Stage 14/15 work built a safe read-only HUD stack, but user review exposed the product gap:

1. The office scene feels like decorative floating objects rather than a working office.
2. Character hover/title information is too hidden and too complex.
3. The page does not feel truthfully tracked; current tracking is mostly browser-local snapshot delta.
4. `/office` should show AI Office first, not a generic Hermes dashboard page with many debug/status strips.

## Goal

Reset `/office` toward an AI Office-first product surface without adding backend/API/schema changes or a renderer dependency.

## Scope

Stage 16-A implements five linked moves:

1. **AI Office-first layout**
   - Scene/office map becomes the first major surface.
   - Mission/status/diagnostic HUD moves into a secondary rail/drawer posture.
   - User-facing stage labels become less dominant.

2. **Click-first character inspector**
   - Hover/title copy is shortened.
   - Clicking a bot/character produces immediate visible selection and a persistent inspector card.
   - Selected character is visually highlighted in the map.

3. **Tracking truthfulness pass**
   - UI states clearly that current tracking is snapshot/delta-based unless a real event stream exists.
   - Avoids implying that floating idle motion equals real live agent work.

4. **Safe event substrate planning**
   - Documents next substrate needed for real tracking: redacted event categories, not raw logs/prompts/tool args.
   - No backend event stream is implemented in Stage 16-A.

5. **Visual system pass**
   - Introduces an Office-first surface treatment: scene, inspector, timeline, diagnostics.
   - Keeps CSS/DOM/SVG only.

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

## Implementation plan

### TDD helpers

Add pure helper tests first in `web/src/pages/OfficePage.test.ts`:

- `buildOfficeFirstLayoutPlan(...)`
  - classifies scene as primary and diagnostics as secondary/collapsed.
  - produces Korean-first copy: `AI Office 먼저 보기`.

- `buildOfficeTrackingTruthPlan(...)`
  - labels current mode as `snapshot-delta` when tracking is browser-local.
  - explains that motion is decorative unless safe deltas/events exist.

- `buildOfficeSelectedCharacterFocus(...)`
  - produces selected character id, safe title, room/action summary, highlight selector metadata.
  - never uses raw labels/details/prompts/logs/model/provider identity.

### React/CSS

Modify `web/src/pages/OfficePage.tsx` and `web/src/index.css`:

- Add scene-first shell wrapper: `data-office-first-layout="true"`.
- Add tracking truth strip: `data-office-tracking-truth="true"`.
- Move major map surface above diagnostic HUD stack.
- Add selected-character state using existing browser-local React state only.
- Add selected visual class/hook on character markers:
  - `data-office-character-selected="true|false"`.
- Add persistent inspector card near the scene:
  - `data-office-selected-character-panel="true"`.
- Shorten title/hover content to role + status + action only.
- Keep existing safe inspector and diagnostics available but secondary.

### Docs

Update:

- `docs/ai-office/STATUS.md`
- `docs/ai-office/NEXT.md`

Document:

- current tracking truth
- safe event substrate as next backend planning boundary
- no renderer dependency adopted

## Verification plan

Frontend:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build
```

Backend/safety:

```bash
cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke:

- `/office?stage16a=office-first-reset`
- office-first layout exists
- scene appears before diagnostic HUD in DOM order
- tracking truth strip exists and says snapshot/delta based
- clicking a character marks it selected
- selected character panel updates immediately
- hover/title text is short and safe
- diagnostics still present but secondary
- raw leak false
- console JS errors none

## Implementation record

Completed in Stage 16-A branch:

- RED confirmed first: focused `OfficePage.test.ts` failed while Stage 16-A helpers were missing.
- Added safe helper/view-model coverage for office-first layout, tracking truth, and selected-character focus.
- Connected React UI:
  - map/scene renders first in `/office`.
  - `data-office-first-layout="true"` wraps the scene-first surface.
  - `data-office-tracking-truth="true"` states the current snapshot/delta tracking mode.
  - character buttons use browser-local click selection and expose `data-office-character-selected="true|false"`.
  - `data-office-selected-character-panel="true"` shows the persistent safe selected-character summary.
  - Stage 14/15 HUD remains available in `data-office-diagnostics-drawer="true"` as secondary diagnostics.
- CSS remains dependency-free and only adds selected-character emphasis plus a light office-first surface shadow.

Documentation:

- `docs/ai-office/STATUS.md` records Stage 16-A implementation posture and safe event substrate boundary.
- `docs/ai-office/NEXT.md` now points fresh sessions to Stage 16-A verification/commit first, then Stage 16-B event-substrate decision only if approved.

## Final verification record

2026-05-09 22:58 KST:

- `npm test -- --run OfficePage.test.ts` passed: 50 tests.
- ESLint passed for `src/pages/OfficePage.tsx`, `src/pages/officeView.ts`, and `src/pages/OfficePage.test.ts`.
- `npm run build` passed with existing Vite large chunk warning only.
- Backend focused office tests passed: 18 passed in 1.05s.
- `git diff --check` passed.
- Browser smoke `/office?stage16a=office-first-reset` passed:
  - office-first layout exists.
  - tracking truth strip exists and states snapshot/delta posture.
  - character click marks one marker selected and updates the selected-character panel.
  - diagnostics drawer exists.
  - prior Stage 14 route compass, focus lane, breadcrumb, and pulse timeline hooks remain present.
  - raw leak false.
  - console JS errors none.

## Next after Stage 16-A

Do not add more HUD. The likely next step is Stage 16-B only if needed:

- safe event substrate design or implementation, depending on approval.
- It must expose redacted event categories/counts only, never raw logs/prompts/tool args.
