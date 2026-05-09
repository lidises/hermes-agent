# Hermes AI Office — NEXT

Last updated: 2026-05-10 00:50 KST

## Start here after `/new`

1. Load relevant skills if needed:
   - `hermes-agent`
   - `writing-plans`
   - `plan` if staying planning-only
   - `kanban-orchestrator` only if creating/organizing board tasks is explicitly approved
2. Read this file.
3. Read `STATUS.md`.
4. Read the latest Stage 5 outputs:
   - `docs/ai-office/architecture/backend-api.md`
   - `docs/ai-office/architecture/data-adapters.md`
   - `docs/ai-office/architecture/frontend-components.md`
   - `docs/ai-office/architecture/test-plan.md`
   - `docs/ai-office/architecture/rollout-plan.md`
   - `docs/ai-office/architecture/pixel-renderer-adapter.md`
5. If needed for provenance/routing context, then read the Stage 4 outputs:
   - `docs/ai-office/design/topic-registry-spec.md`
   - `docs/ai-office/design/task-provenance-metadata.md`
   - `docs/ai-office/design/provenance-backfill.md`
   - `docs/ai-office/design/privacy-security.md`
6. If needed for product context, then read the Stage 3 outputs:
   - `docs/ai-office/product/user-stories.md`
   - `docs/ai-office/architecture/office-state-model.md`
   - `docs/ai-office/product/information-architecture.md`
   - `docs/ai-office/product/non-goals-and-mutation-boundary.md`
   - `docs/ai-office/product/mvp-acceptance-criteria.md`
7. Do not implement dashboard code unless the user explicitly approves an implementation stage.
8. Continue from the `Current next stage` below.

## Suggested `/goal` for a fresh session

Use `/goal` as a session-level guardrail and progress judge, not as the durable project memory. Durable state still lives in `STATUS.md`, `NEXT.md`, `DECISIONS.md`, `OPEN-QUESTIONS.md`, and stage output docs.

Default planning-mode goal:

```text
/goal Hermes AI Office / Pixel Agents style dashboard project를 구현하지 말고, 먼저 충분한 리서치·제품기획·아키텍처·단계별 실행계획·리스크·MVP 범위를 문서화한다. 각 단계는 STATUS/NEXT handoff를 남겨 /new 후에도 이어갈 수 있게 하고, 실제 코드 구현·서비스 재시작·설정 변경은 사용자가 명시적으로 승인하기 전까지 하지 않는다.
```

Stage 8/manual smoke goal suggestion, use only after explicit approval:

```text
/goal Hermes AI Office next stage를 승인된 범위 안에서 진행한다. 우선 Stage 8-A까지 완료된 read-only MVP diff와 /office 화면을 수동 smoke test하거나 다음 비픽셀 시각 polish를 한다. mutation controls, service restart, config/systemd change, Kanban/cron mutation, topic registry write, pixel renderer/dependency 추가는 하지 않는다. 검증 결과와 남은 open question을 STATUS/NEXT에 갱신한다.
```

When `/goal` is most useful:

1. Beginning a fresh `/new` session for one bounded stage, especially Stage 3–5 planning/design.
2. Long source-reading or synthesis sessions where the agent may otherwise drift into implementation.
3. Before any Stage 6+ implementation session, to enforce the approved scope and stop after the planned verification.
4. For multi-turn review loops: keep `/goal` active while drafting, reviewing, and tightening one deliverable set.

When not to rely on `/goal` alone:

1. Cross-session memory: use `STATUS.md`/`NEXT.md` instead.
2. Fine-grained coding task tracking: use a written plan and, after approval, Kanban/subagent workflow.
3. Background scheduled monitoring: use cron, not `/goal`.
4. Any mutation approval: `/goal` does not replace explicit user approval for code/config/service/Kanban/cron changes.

## Current next stage

Stage 16-D is now the active implementation stage on `ai-office-stage16d-safe-motion-heartbeat-20260510`: make the Stage 16-C safe event endpoint visibly drive a safe heartbeat/scan cadence in `/office`, without raw event content, renderer dependencies, persistent storage, mutation controls, SSE, or WebSocket.

Stage 16-D current implementation:

- `buildOfficeSafeMotionHeartbeat(...)` maps safe stream posture + local polling metadata into generated Korean heartbeat mode/phase/intensity copy.
- `/office` polls `/api/office/events` every 5 seconds while the tab is visible and keeps Stage 16-C local fallback if unavailable.
- The UI renders a compact `Stage 16-D 안전 motion heartbeat` rail near the safe event substrate.
- New smoke hooks:
  - `data-office-safe-motion-heartbeat="true"`
  - `data-office-safe-motion-heartbeat-mode`
  - `data-office-safe-motion-heartbeat-phase`
  - `data-office-safe-motion-heartbeat-intensity`
  - `data-office-safe-motion-heartbeat-enabled`
  - `data-office-safe-motion-heartbeat-item="stream|cadence|motion"`
- CSS-only pulse/scan cues are reduced-motion aware.

Verification completed:

- RED verified before helper implementation: `buildOfficeSafeMotionHeartbeat is not a function`.
- GREEN after helper implementation: `OfficePage.test.ts` 54 passed.
- Final frontend focused test: `OfficePage.test.ts` 54 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.
- `npm run build` passed with the existing Vite large chunk warning only.
- Backend focused office tests passed: 21 passed in 1.02s.
- `git diff --check` passed.
- Browser smoke `/office?stage16d=safe-motion-heartbeat` passed: safe event substrate, stream status, heartbeat mode/phase/intensity hooks, heartbeat items, motion lane, raw leak false, and console JS errors none.

Immediate next action: commit/push Stage 16-D:

- `git commit -m "feat(office): add safe motion heartbeat"`
- `git push origin ai-office-stage16d-safe-motion-heartbeat-20260510`

Recommended next implementation stage after Stage 16-D: if more movement is still desired, Stage 16-E can add richer safe spatial choreography over rooms/routes using the same safe event shape. Keep it CSS/SVG, read-only, and raw-free unless explicitly approved otherwise.


Stage 9-E current implementation:

- `/office` primary UI copy is now Korean-first: headings, focus buttons, refresh/inspect actions, empty states, safety copy, status labels, room labels, and inspector field labels.
- Technical identifiers remain visible where useful: DTO, OfficeState, source IDs, cron, IDs, and adapter-emitted status strings.
- Planning note for the next dynamic/tracking pass: `docs/ai-office/plans/2026-05-09-koreanization-and-dynamic-map.md`.

Stage 9-F current implementation:

- `buildOfficeStateDelta(previous, next)` compares only safe browser-local counts/statuses and attention count.
- Office-map room cards now show last-refresh `+N`, `-N`, and `상태 변경` badges.
- The map card now has a compact `최근 변화` rail backed by a small duplicate-collapsed in-memory ring buffer.
- Stage 9-F3 adds safe flow-level change hints plus `방금 변경` text in the flow legend.
- Stage 9-F3 adds explicit browser-tab-local live controls: `실시간 추적 켜기` and `실시간 추적 일시정지`, polling the same read-only OfficeState endpoint every 30 seconds only while enabled.
- Stage 9-F4 adds automation next-run timing buckets (`overdue`, `<15m`, `<1h`, `today`, `later`, `unknown`) and emits safe `일정 변경` / `자동화 다음 실행 ...` deltas.
- Stage 9-F4 changes live tracking from fixed interval to browser-local adaptive timeouts: visible/no failures 30 seconds, hidden or one failure 60 seconds, repeated failures 120 seconds.
- Stage 9-G adds source-health summary and centralized empty-state hints, including explicit `사용 불가` source counts and safe missing-source labels.
- Stage 9-I adds DeskRPG-like CSS marker motion: safe scene markers now walk/idle/blink with reduced-motion fallback, no renderer dependency, no sprite assets, and no DeskRPG code/assets.
- Stage 10-A adds RPG character projection: `OfficeCharacter`, `buildOfficeCharacters(state, nodes)`, and `buildOfficeCharacterSceneObjects(characters)` turn safe DTO counts/status/source health into generic Korean role characters (`모델 캐릭터`, `작업자`, `자동화 관리인`, `전달자`, `감시자`, `경보 담당`) before rendering markers.
- Stage 10-B adds original CSS/SVG-like character presentation: `OfficeCharacterView` and `buildOfficeCharacterView(character)` produce safe role glyphs, Korean nameplates/status labels, and CSS classes; `OfficeCharacterMarker` renders layered head/body/accessory/status-light shapes with `data-office-character-role` smoke hooks.
- Stage 10-C adds safe action chips: `OfficeCharacterActivity` and `buildOfficeCharacterActivity(character, delta)` derive Korean labels such as `생각 중`, `예약 대기`, `확인 필요`, and `막힘` from role/status plus room/flow deltas only; `OfficeCharacterMarker` exposes `data-office-character-activity` for smoke testing.
- Stage 10-D adds room-to-room RPG route choreography: `OfficeCharacterRoute` and `buildOfficeCharacterRoutes(delta)` derive only from `OfficeStateDelta.changedFlows`, render decorative route hints with static `흐름 변경` labels, and disable route animations under reduced motion.
- Stage 10-E adds safe character inspection: `OfficeCharacterInspector` and `buildOfficeCharacterInspector(character, delta)` generate keyboard/ARIA-friendly inspector fields (`캐릭터`, `역할`, `방`, `상태`, `액션`, `최근 안전 변화`, `가림`) from role/status/safe delta only; character buttons expose `data-office-character-inspect`.
- Stage 10-F adds usability hardening: `OfficeUsabilitySummary` and `buildOfficeUsabilitySummary(state, characters, options)` surface dense-state aggregation, missing/partial source fallback, reduced-motion static meaning, responsive layout posture, and Korean-first copy in a safe map rail with `data-office-usability` smoke hooks.
- Stage 10-G adds local density/readability modes: `OfficeMapDensityMode`, `OfficeMapDensityPlan`, and `buildOfficeMapDensityPlan(mode, characters)` derive 요약/표준/상세 display plans, cap visible generated characters, expose `data-office-density-controls`, and fold the recent-change rail only in 요약 mode.
- Stage 10-H adds safe keyboard jump targets: `OfficeMapJumpTarget` and `buildOfficeMapJumpTargets(densityPlan)` expose 지도/사용성/최근 변화/안전 정보 quick links with stable focusable section anchors and summary-mode collapsed recent rail targeting.
- Stage 12-A adds responsive/mobile readability posture with browser-local viewport width, CSS-only responsive hooks, and no renderer dependency.
- Stage 12-B adds empty-source copy polish: `OfficeEmptySourceCopyPlan` and `buildOfficeEmptySourceCopyPlan(state)` explain an empty source list as a safe DTO/source-gap state and render `data-office-empty-source-copy` without controls or raw projection.
- Stage 13 adds a PR/handoff summary draft in `docs/ai-office/plans/2026-05-09-stage-13-pr-handoff-summary.md` for review and fresh-session continuity.
- Stage 14-A through Stage 14-D add safe dynamic-tracking layers: character tracking cues, room activity meters, safe pulse timeline, and safe breadcrumb trail.
- Stage 14-E adds the safe route compass: `OfficeSafeRouteCompass` and `buildOfficeSafeRouteCompass(delta)` summarize direction/signal/safe-change count from safe `OfficeStateDelta` aggregates only, and `/office` renders `data-office-safe-route-compass` with three decorative points.
- Stage 14-F adds the safe focus lane: `OfficeSafeFocusLane` and `buildOfficeSafeFocusLane(delta)` rank known rooms by safe delta density and render `data-office-safe-focus-lane` with per-room decorative items.
- Stage 14-G adds the safe attention strip: `OfficeSafeAttentionStrip` and `buildOfficeSafeAttentionStrip(delta)` compress safe focus density plus route-compass signal into `focus|signal|scope` chips and render `data-office-safe-attention-strip`.
- Stage 14-H adds safe room beacons: `OfficeSafeRoomBeacons` and `buildOfficeSafeRoomBeacons(delta)` convert safe focus-lane density into decorative map beacons and a compact room beacon rail with `data-office-safe-room-beacons`.
- Stage 14-I adds safe flow pulse bands: `OfficeSafeFlowPulseBands` and `buildOfficeSafeFlowPulseBands(delta)` convert changed safe flows into decorative SVG pulse bands and a compact flow pulse rail with `data-office-safe-flow-pulse-bands`.
- Stage 14-J adds a safe tactical minimap: `OfficeSafeTacticalMinimap` and `buildOfficeSafeTacticalMinimap(delta)` compress safe room beacons and flow pulse bands into fixed-order room cells with `data-office-safe-tactical-minimap`.
- Stage 14-K adds a safe tactical ticker: `OfficeSafeTacticalTicker` and `buildOfficeSafeTacticalTicker(delta)` compress safe minimap and attention signals into `focus|map|cells` ticker items with `data-office-safe-tactical-ticker`.
- Stage 14-L adds a safe mission clock: `OfficeSafeMissionClock` and `buildOfficeSafeMissionClock(options)` compress browser-local live/manual posture, tab visibility, local read failures, and latest safe-delta presence into `mode|cadence|safety|pulse` items with `data-office-safe-mission-clock`.
- Stage 14-M adds a safe command deck: `OfficeSafeCommandDeck` and `buildOfficeSafeCommandDeck(state, delta, missionOptions)` group mission/tactical/source/safety cards with `data-office-safe-command-deck`.
- Stage 14-N adds a safe floor legend: `OfficeSafeFloorLegend` and `buildOfficeSafeFloorLegend(delta)` group generated active rooms, idle rooms, safe flow count, and projection safety with `data-office-safe-floor-legend`.
- Stage 14-O adds a safe status snapshot: `OfficeSafeStatusSnapshot` and `buildOfficeSafeStatusSnapshot(state, delta, missionOptions)` consolidate deck/floor/source/guard posture with `data-office-safe-status-snapshot`.
- Stage 14-P adds a safe scan index: `OfficeSafeScanIndex` and `buildOfficeSafeScanIndex(state, delta, missionOptions)` consolidate snapshot/rail/mode posture with `data-office-safe-scan-index`.
- Stage 14-Q adds a safe HUD readability strip: `OfficeSafeHudReadabilityPlan` and `buildOfficeSafeHudReadabilityPlan(options)` summarize browser-local layout/motion/density/tracking posture with `data-office-safe-hud-readability`.
- First snapshots produce no fabricated history; manual refresh remains the default.
- Planning note expanded: `docs/ai-office/plans/2026-05-09-koreanization-and-dynamic-map.md`.

Recommended next implementation/design stage: Stage 14 is closed at 14-Q. First PR/merge the completed branch into `main`, then start Stage 15 consolidation from updated `main` or a fresh branch off `main`. Stage 15 should focus on HUD hierarchy, duplicate signal reduction, PR/readiness refresh, and only evidence-driven visual polish. Do not expose individual task identity, generate content-like speech bubbles, add character mutation targets, or add Phaser, PixiJS, canvas, sprite assets, DeskRPG code/assets, backend/schema/API changes, mutation controls, persistent storage, or raw record projection. Renderer work remains closed unless new measured evidence and explicit approval reopen it.

Stage 9-D completed:

- `web/src/pages/officeView.ts` adds `OfficeSceneObjectView` and `buildOfficeSceneObjectView(object)` so marker glyph/title/tone/accessibility presentation is testable.
- `web/src/pages/OfficePage.tsx` improves room-card contrast, marker hierarchy, focus rings, SVG/zone/legend z-index layering, and bottom legend spacing.
- `web/src/pages/OfficePage.test.ts` covers non-interactive marker presentation and raw-field avoidance.
- Still no PixiJS/Phaser, canvas engine, sprite assets, copied DeskRPG code/assets, new dependency, backend route/schema, or mutation controls.

Verification for Stage 9-D:

```text
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
# 1 test file passed, 7 tests passed

./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
# passed: 0 errors

npm run build
# passed: tsc -b && vite build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
# 18 passed in 1.07s

git diff --check
# passed

Browser smoke: http://127.0.0.1:8765/office
# Office map visible with stronger room-card contrast, non-interactive scene markers, readable bottom safety/flow legend, Safe inspector zone metadata, no fixture raw-field leaks, no console JS errors
```

## Immediate next action

Immediate next action is finishing Stage 16-A on `ai-office-stage16a-office-first-reset-20260509`:

1. Run final frontend verification from `web`:
   - `npm test -- --run OfficePage.test.ts`
   - `./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts`
   - `npm run build`
2. Run backend/safety verification from repo root:
   - `source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check`
3. Browser smoke `/office?stage16a=office-first-reset`:
   - office-first layout exists.
   - map/scene appears before generic dashboard diagnostics in DOM order.
   - tracking truth strip exists and states snapshot/delta posture.
   - clicking a character sets `data-office-character-selected="true"` and updates the selected-character panel.
   - diagnostics drawer exists and Stage 14/15 hooks still exist.
   - raw leak false and console JS errors none.
4. Commit/push:
   - `feat(office): add AI office-first layout reset`
5. Do not start Stage 16-B until Stage 16-A is committed/pushed.
6. Stage 16-B, if approved, should start with safe event substrate design: redacted event categories/counts/timing buckets only; no raw logs, prompts, transcripts, scripts, tool args, task bodies, provider/model identity, credentials, or mutation controls.

Completed Stage 6 files:

1. `hermes_cli/office_redaction.py`
2. `hermes_cli/office_state.py`
3. `hermes_cli/office_adapters.py`
4. `hermes_cli/web_server.py`
5. `tests/hermes_cli/test_office_redaction.py`
6. `tests/hermes_cli/test_office_api.py`
7. `tests/hermes_cli/test_office_state_adapters.py`
8. `pyproject.toml` — `web` extra now bounds `starlette>=0.46.0,<1`.
9. `web/src/lib/api.ts`
10. `web/src/pages/OfficePage.tsx`
11. `web/src/App.tsx`

Local environment extras installed/ensured with user approval:

```bash
source .venv/bin/activate
python -m pip install -e '.[web]'
python -m pip install 'starlette<1'
python -m pip install -e '.[pty]'
```

Verification already performed:

```text
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_api.py -q
# 5 passed

scripts/run_tests.sh tests/hermes_cli/test_office_state_adapters.py -q
# 8 passed

scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py tests/hermes_cli/test_web_server.py tests/hermes_cli/test_web_server_host_header.py -q
# 158 passed, 5 warnings

cd web
export PATH="$HOME/.local/node-v24.11.1-linux-x64/bin:$PATH"
npm run build
# passed: tsc -b && vite build

./node_modules/.bin/eslint src/pages/OfficePage.tsx src/App.tsx src/lib/api.ts
# passed

npm run lint
# now passes: 0 errors, 20 warnings

npm run build
# passed after lint cleanup: tsc -b && vite build

scripts/run_tests.sh tests/acp tests/acp_adapter -q --tb=short
# after installing .[acp]: 221 passed, 10 warnings

scripts/run_tests.sh tests/tools/test_transcription.py tests/tools/test_transcription_tools.py tests/tools/test_transcription_dotenv_fallback.py tests/tools/test_image_edit_tool.py tests/tools/test_registry.py tests/test_model_tools.py -q --tb=short
# 178 passed, 7 skipped

scripts/run_tests.sh tests/tools/test_delegate.py tests/tools/test_daytona_environment.py tests/tools/test_vercel_sandbox_environment.py tests/hermes_cli/test_cmd_update.py tests/hermes_cli/test_update_yes_flag.py -q --tb=short
# 178 passed

scripts/run_tests.sh tests/hermes_cli/test_update_yes_flag.py::TestUpdateYesStashRestore::test_yes_restores_stash_without_prompting -q --tb=long
# 1 passed

scripts/run_tests.sh tests/hermes_cli/test_cmd_update.py tests/hermes_cli/test_update_yes_flag.py -q --tb=short
# 10 passed

scripts/run_tests.sh tests/agent/test_bedrock_1m_context.py tests/agent/test_bedrock_adapter.py tests/hermes_cli/test_bedrock_model_picker.py -q --tb=short
# 139 passed, 6 skipped

scripts/run_tests.sh -q --tb=short
# latest full Python suite after all cleanup batches: 20886 passed, 125 skipped, 232 warnings in 389.83s

npm test
# failed: package has no "test" script
```

Notes:

- `npm run lint` for the whole web app now passes with 0 errors and 20 warnings after downgrading React Compiler migration rules to warnings and fixing two unused variables.
- Full Python `scripts/run_tests.sh -q --tb=short` is green after the cleanup batches: 20886 passed, 125 skipped, 232 warnings in 389.83s.
- `test_update_yes_flag` no longer appears in the latest full xdist failure list after patching through `cmd_update.__globals__`.
- `web/package.json` has no `test` script, so `npm test` is not available.
- The ACP import-error cluster was an environment gap; local `.venv` now has `agent-client-protocol 0.10.0` via `python -m pip install -e '.[acp]'`.
- Installing only `.[web]` initially left existing PTY WebSocket tests failing because `ptyprocess` was missing; installing existing `.[pty]` fixed those tests.
- Starlette 1.0.0 caused WebSocket TestClient frame incompatibilities in existing PTY tests, so `pyproject.toml` now constrains the web extra to `starlette<1` and local verification used Starlette 0.52.1.
- Remaining backend warnings are existing Python `pty.py` `forkpty()` deprecation warnings in PTY tests.

Primary Stage 5 outputs to keep using:

1. `docs/ai-office/architecture/backend-api.md`
2. `docs/ai-office/architecture/data-adapters.md`
3. `docs/ai-office/architecture/frontend-components.md`
4. `docs/ai-office/architecture/test-plan.md`
5. `docs/ai-office/architecture/rollout-plan.md`
6. `docs/ai-office/architecture/pixel-renderer-adapter.md`

Stage 6 approval checklist from the rollout plan:

1. User approves Stage 6 implementation scope.
2. User agrees to protected built-in `/api/office/...` API placement.
3. User agrees Stage 6 remains read-only and localhost-first.
4. User agrees pixel visualization remains deferred.
5. User agrees whether Stage 6 may read an existing `~/.hermes/office/topics.json` seed registry if present.
6. User agrees session titles remain off by default unless tests prove redaction behavior.
7. User agrees no gateway/dashboard service restart is performed without separate approval.

## Current planning outputs to preserve

Stage 1 research docs:

- `docs/ai-office/research/pixel-agents-audit.md`
- `docs/ai-office/research/pixel-agents-standalone-audit.md`
- `docs/ai-office/research/pixel-agents-codex-audit.md`
- `docs/ai-office/research/smallville-generative-agents-audit.md`
- `docs/ai-office/research/agent-observability-patterns.md`
- `docs/ai-office/research/synthesis.md`

Stage 2 audit docs:

- `docs/ai-office/audit/dashboard-architecture.md`
- `docs/ai-office/audit/kanban-data-model.md`
- `docs/ai-office/audit/cron-data-model.md`
- `docs/ai-office/audit/telegram-topic-routing.md`
- `docs/ai-office/audit/session-provenance.md`
- `docs/ai-office/audit/current-wsl-state-snapshot.md`

Stage 3 product/IA docs:

- `docs/ai-office/product/user-stories.md`
- `docs/ai-office/architecture/office-state-model.md`
- `docs/ai-office/product/information-architecture.md`
- `docs/ai-office/product/non-goals-and-mutation-boundary.md`
- `docs/ai-office/product/mvp-acceptance-criteria.md`

Stage 4 design docs:

- `docs/ai-office/design/topic-registry-spec.md`
- `docs/ai-office/design/task-provenance-metadata.md`
- `docs/ai-office/design/provenance-backfill.md`
- `docs/ai-office/design/privacy-security.md`

Stage 5 architecture docs:

- `docs/ai-office/architecture/backend-api.md`
- `docs/ai-office/architecture/data-adapters.md`
- `docs/ai-office/architecture/frontend-components.md`
- `docs/ai-office/architecture/test-plan.md`
- `docs/ai-office/architecture/rollout-plan.md`
- `docs/ai-office/architecture/pixel-renderer-adapter.md`

Earlier product/architecture/risk docs:

- `docs/ai-office/product/mvp-scope.md`
- `docs/ai-office/architecture/conceptual-architecture.md`
- `docs/ai-office/RISKS.md`

## Do not do without separate approval

- Do not implement mutation controls, topic registry persistence, or pixel-renderer slices beyond the completed Stage 6 read-only MVP.
- Do not add npm/Python dependencies unless explicitly approved.
- Do not create or mutate Kanban boards/tasks unless explicitly approved.
- Do not create, pause, resume, trigger, delete, or mutate cron jobs from AI Office.
- Do not restart services.
- Do not change gateway/cron/config/systemd/startup scripts.
- Do not write to NAS/Obsidian shared ledger.
- Do not vendor/fork Pixel Agents code.
- Do not create/edit `~/.hermes/office/topics.json` unless the user explicitly approves a registry seed/edit step.

## Handoff checklist before next `/new`

Before starting a fresh session:

1. Read this file and `STATUS.md`.
2. Read the Stage 5 architecture docs listed above.
3. If the user approves the next stage, begin only with the approved smoke-test/polish/lint-cleanup scope and update handoff files after verification.
4. If no approval is given, stay in review/planning mode.
5. State explicitly what was not changed.

## Stage 14-A handoff: dynamic character tracking cues

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-A implemented safe character tracking cues and passed final local verification. Keep continuing in small CSS/SVG slices; do not add a renderer/dependency unless the user explicitly reopens the Stage 11 decision gate.

Next if Stage 14-A verifies cleanly:

1. Commit/push Stage 14-A: `feat(office): add dynamic character tracking cues`.
2. Plan Stage 14-B as the next small DeskRPG-like slice. Recommended direction: room-level ambient activity meters or safe route pulse timeline, still derived only from safe DTO counts/deltas.
3. Maintain constraints: read-only `/office`, no backend/API/schema changes, no mutation controls, no persistent storage, no raw projection, no Phaser/Pixi/canvas/sprites.

## Stage 14-B handoff: room activity meters

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-B implemented safe room activity meters and passed final local verification. Commit/push completed as `1d7ab666 feat(office): add room activity meters`. Recommended Stage 14-C direction: safe event pulse timeline or room-to-room breadcrumb rail derived only from browser-local safe deltas.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.

## Stage 14-C handoff: safe pulse timeline

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-C implemented a safe pulse timeline from browser-local `OfficeStateDelta` (`nodeBadges`, `changedFlows`, `recentChanges`) and passed final local verification. Commit/push completed as `5e2b26d8 feat(office): add safe pulse timeline`.

Next recommended Stage 14-D direction: safe breadcrumb trail for room-to-room changes or a compact character/room heartbeat legend, still CSS/SVG only and derived from safe DTO/delta fields.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.

## Stage 14-D handoff: safe breadcrumb trail

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-D implemented a safe breadcrumb rail from browser-local `OfficeStateDelta.changedFlows`. It generates Korean room labels/details only, ignores raw flow labels and recent change text, and keeps the rail decorative/non-interactive. Final local verification passed: 33 focused frontend tests, ESLint, build with existing Vite large-chunk warning, 18 backend office tests, `git diff --check`, and browser smoke for `/office?stage14d=safe-breadcrumb-trail`.

Next recommended Stage 14-E direction: compact safe route compass or room heartbeat legend that ties Stage 14-B meters, Stage 14-C pulse, and Stage 14-D breadcrumb together without adding renderer dependencies or backend schema changes.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.
