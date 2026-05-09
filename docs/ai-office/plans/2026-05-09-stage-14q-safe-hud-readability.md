# Stage 14-Q — Safe HUD Readability

Date: 2026-05-09 21:58 KST
Branch: `ai-office-stage14-dynamic-tracking-20260509`

## Goal

Add a compact safe HUD readability strip to `/office` so the growing Stage 14 safety panel can report layout/motion/density/tracking posture without exposing raw records or reopening the renderer decision.

## Scope

Stage 14-Q is a frontend-only, read-only, CSS/DOM-only slice.

Allowed inputs:

- Browser-local viewport width.
- Browser-local reduced-motion preference.
- Count of already-rendered safe HUD panels/items.
- Browser-local live/manual tracking posture.

Explicitly excluded:

- Raw prompts, transcripts, task bodies, scripts, logs, adapter error detail, source payloads, provider/model identity, auth fields, secrets, tokens, API keys, passwords, and individual task identity.
- Backend/API/schema changes.
- Renderer adoption, canvas, PixiJS, Phaser, sprites, or DeskRPG code/assets.
- Mutation controls or persistent browser storage.

## TDD Record

RED:

- Added `buildOfficeSafeHudReadabilityPlan` import and focused helper test in `OfficePage.test.ts`.
- Confirmed the test failed because `buildOfficeSafeHudReadabilityPlan` was not implemented.

GREEN:

- Added `OfficeSafeHudReadabilityPlanOptions`, `OfficeSafeHudReadabilityPlanItem`, `OfficeSafeHudReadabilityPlan`, and `buildOfficeSafeHudReadabilityPlan(options)` in `officeView.ts`.
- Helper emits generated safe Korean labels/details only:
  - `layout` / `배치`
  - `motion` / `모션`
  - `density` / `밀도`
  - `tracking` / `추적`
- Helper marks items decorative/non-interactive with `ariaHidden: true` and `interactive: false`.

UI/CSS:

- `OfficePage.tsx` derives `safeHudReadability` from browser-local posture and safe panel count.
- Safety panel renders a compact Stage 14-Q strip with stable hooks:
  - `data-office-safe-hud-readability="true"`
  - `data-office-safe-hud-readability-summary="true"`
  - `data-office-safe-hud-readability-item="layout|motion|density|tracking"`
- `index.css` adds compact CSS-only HUD readability styling.

## Warning/Error Audit

Before final docs/commit, warning/error paths were checked first:

- Found and fixed one active frontend issue:
  - `buildOfficeSafeHudReadabilityPlan` / `safeHudReadability` was unused while Stage 14-Q UI was only partially wired.
  - Fixed by rendering the Stage 14-Q HUD readability strip and adding CSS.
- Remaining build warning is the existing Vite large-chunk warning only.
- Browser console produced no messages or JS errors during smoke.

## Verification

Final verification target:

```text
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke target:

```text
http://127.0.0.1:8765/office?stage14q=safe-hud-readability
```

Expected smoke posture:

- HUD readability strip present.
- Summary present.
- Items `layout|motion|density|tracking` present.
- Stage 14-P/O/N/M/L/K/J/I/H/G/F/E/D/C hooks still present.
- Raw leak regex false.
- Console JS errors none.

## Safety Notes

Stage 14-Q remains generated-summary-only. It does not read or project raw record strings, does not mutate any state, and does not introduce a renderer dependency. It is a readability/status affordance for the already-safe HUD layers.
