# Stage 15-B — Duplicate Signal Reduction

Date: 2026-05-09 22:23 KST
Branch: `ai-office-stage15-consolidation-20260509`
Base: Stage 15-A commit `08e148cc`

## Goal

Continue Stage 15 consolidation by reducing repeated safe summary copy in the `/office` safety panel stack. Stage 14-P scan index previously repeated the full Stage 14-O status snapshot headline, which made the panel stack harder to scan.

Stage 15-B keeps the same safe ownership and tone propagation but changes the scan index copy to point back to the status snapshot instead of duplicating its full headline.

## Scope

Changed:

- `buildOfficeSafeScanIndex(state, delta, missionOptions)`
- Stage 14-P scan-index focused expectations
- Added a Stage 15-B regression test for duplicate-signal reduction

New scan-index copy:

- headline: `스캔 N칸 · snapshot 기준`
- snapshot item detail: `상태 snapshot 참조`
- rail item detail remains `N개 안전 칸`
- mode item detail remains browser-local posture

## Safety constraints

Preserved:

- frontend-only
- read-only
- no backend/API/schema changes
- no mutation controls
- no persistent browser storage
- no raw prompt/transcript/task_body/script/log/provider/model/secret/token/task identity projection
- tone still comes from the existing safe snapshot/floor/mode items

## RED/GREEN trail

RED:

- Added focused test: `reduces duplicate Stage 15-B scan copy while preserving safe ownership`
- Initial run failed as expected because the old scan-index headline still repeated the full snapshot summary:
  - expected `스캔 4칸 · snapshot 기준`
  - received `스캔 4칸 · 소스 주의 · 활성 0 · 대기 4 · 흐름 0`

GREEN:

- Updated scan-index headline/detail copy.
- Updated the older Stage 14-P test to reflect the new Stage 15-B consolidated copy.
- Focused test + ESLint passed:
  - `OfficePage.test.ts` 48 passed

## Verification plan

```bash
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check
```

Browser smoke:

- `/office?stage15b=duplicate-signal-reduction`
- scan index present
- scan index headline contains `snapshot 기준`
- scan index no longer repeats active/idle/flow summary in its headline
- Stage 15-A hierarchy and prior Stage 14 hooks still present
- raw leak false
- console JS errors none

## Next

Stage 15-C should refresh the readiness checklist and decide whether this Stage 15 consolidation branch is ready for PR/merge or needs a small evidence-driven visual polish pass first.
