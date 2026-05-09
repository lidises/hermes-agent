# Stage 15-A — Safe HUD Hierarchy Audit

Date: 2026-05-09 22:18 KST
Branch: `ai-office-stage15-consolidation-20260509`
Base: `main` at `632b993f`

## Goal

Start Stage 15 consolidation by making the `/office` safety panel scan order explicit. This is not another decorative Stage 14 layer. It is a small hierarchy strip that tells the viewer which existing safe HUD panels to read first.

## Scope

Implemented:

- `OfficeSafeHudHierarchyOptions`
- `OfficeSafeHudHierarchySection`
- `OfficeSafeHudHierarchy`
- `buildOfficeSafeHudHierarchy(options)`
- React/CSS rendering near the existing safety panel stack
- Stable smoke hooks

Inputs are only existing safe aggregate panel outputs:

- status snapshot tone and item count
- scan index tone and item count
- HUD readability tone and item count

## UI hooks

- `data-office-safe-hud-hierarchy="true"`
- `data-office-safe-hud-hierarchy-headline="true"`
- `data-office-safe-hud-hierarchy-summary="true"`
- `data-office-safe-hud-hierarchy-section="primary|secondary|diagnostic"`

## Safety constraints

Preserved:

- frontend-only
- read-only
- CSS/DOM-only
- no backend/API/schema changes
- no mutation controls
- no persistent browser storage
- no renderer dependency
- no DeskRPG code/assets
- no raw prompt/transcript/task_body/script/log/provider/model/secret/token/task identity projection

## RED/GREEN trail

RED:

- Added focused test: `builds safe Stage 15-A HUD hierarchy from existing safe panels`
- Initial run failed as expected:
  - `TypeError: buildOfficeSafeHudHierarchy is not a function`

GREEN:

- Added the minimal helper/type block in `officeView.ts`.
- Focused test passed:
  - `OfficePage.test.ts` 47 passed

## Verification checklist

Planned final verification:

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke:

- `/office?stage15a=hud-hierarchy`
- hierarchy present
- headline present
- summary present
- sections `primary|secondary|diagnostic` present
- prior Stage 14 hooks still present
- raw leak false
- console JS errors none

## Next

Stage 15-B should reduce duplicate safe signal copy across command deck, status snapshot, scan index, HUD hierarchy, and HUD readability without adding new data sources.
