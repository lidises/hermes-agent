# Projection VPS Manual Ingest Completion Recovery — 2026-05-13

## Scope

This is a recovery/completion pass for the interrupted AI Office projection work on branch `ai-office-stage16e-safe-spatial-choreography-20260510`.

The goal was to identify what remained unfinished after `Projection Relay Producer 1` and continue only non-critical, already-bounded work until the current manual projection path is complete.

## Continue vs stop criteria

Continue without asking again when the action is reversible, already inside the approved AI Office projection/dashboard boundary, and does not expand authority:

- read local repo docs, git state, PR state, and VPS service/cache status;
- run local tests/build/lint/security checks;
- validate an already-present safe Office projection bundle;
- update handoff docs;
- commit/push docs-only recovery evidence to the existing draft PR branch.

Stop or defer as a critical blocker when the next step requires one of these:

- data loss risk, destructive deletion, irreversible overwrite, or unsafe migration;
- secret/token/credential/NAS mount access or credential expansion;
- public exposure, firewall/reverse-proxy change, or service trust-surface expansion;
- production outage risk, dashboard/gateway restart not explicitly in scope, or core Hermes checkout mutation;
- legal/ethical concern, raw transcript/prompt/body/path/token leakage, or private data display;
- new watcher/cron/daemon automation;
- merge/mark-ready of PR #4 without explicit user instruction.

## Current state found

Local repo:

- Branch: `ai-office-stage16e-safe-spatial-choreography-20260510`.
- Draft PR: #4, open, draft, mergeable/clean, no remote checks reported.
- Head before this docs-only recovery: `05a0ee44`.
- `Projection Relay Producer 1` was already committed and pushed.

VPS read-only recovery check:

- Dashboard worktree: `/home/hermes/.hermes/ai-office-dashboard`.
- VPS dashboard worktree head: `05a0ee44`.
- `hermes-agent-dashboard.service`: active/running.
- `hermes-gateway.service`: active.
- Listener remains private/Tailscale: `100.122.57.85:8765`.
- Projection cache directories already exist under `/home/hermes/.hermes/office/projections/`.
- `incoming/pcwb-vps-smoke-001` exists.
- `active/pcwb-vps-smoke-001` exists.
- `archive/` empty.
- `rejected/` empty.

Manual ingest completion evidence:

- VPS validator command returned: `OK: safe Office projection bundle` for `active/pcwb-vps-smoke-001`.
- `read_office_projection_cache()` on the VPS returned safe metadata only:
  - status: `active`
  - active bundle id: `pcwb-vps-smoke-001`
  - active path: `pcwb-vps-smoke-001`
  - rejected count: `0`
- No Telegram gateway restart was performed.
- No dashboard restart was performed during this recovery pass.
- `/api/office` unauthenticated curl returned `401`, confirming the protected API did not become anonymously readable. The recovery pass did not fetch or expose auth secrets.

## Unfinished scan and classification

Focused scans were run over:

- `docs/ai-office`
- `scripts/ai_office`
- `hermes_cli`
- `web/src`
- repo-wide quick scan for TODO/FIXME/placeholder/stub/NotImplemented/pass-like terms

Classification:

1. Current AI Office projection track
   - `NEXT.md` and `STATUS.md` still described manual transfer + VPS ingest as the next step.
   - Recovery evidence shows this step is now complete with `pcwb-vps-smoke-001` active on the VPS.
   - Action: update docs to mark it verified complete and move automation/NAS/watchers to explicit deferred state.

2. Safe/intentional Python `pass`
   - `scripts/ai_office/generate_paperclip_manifest.py` and `scripts/ai_office/generate_office_projection.py` define custom exception classes with `pass` bodies.
   - These are complete Python idioms, not unfinished stubs.
   - Action: no code change.

3. Historical/product deferred items in AI Office docs
   - Pixel renderer adoption, remote/public mode, mutation controls, cron/watchers, incident-task creation, NAS mount, and asset reuse are intentionally deferred/non-goals or require separate approval.
   - Action: keep deferred; do not implement under the current safety boundary.

4. General Hermes repo placeholders/stubs
   - Many matches are legitimate UI input placeholders, test stubs, release-note text, compatibility `pass` handlers, or non-AI-Office core code outside this projection recovery scope.
   - Action: do not perform broad unrelated rewrites.

## Remaining deferred items

These are intentionally not done in this recovery pass:

- watcher/cron/daemon automation for projections;
- VPS NAS mount or direct NAS credentials;
- public exposure or reverse-proxy/firewall change;
- dashboard mutation controls;
- Telegram gateway restart/config change;
- core Hermes checkout mutation;
- PR #4 mark-ready or merge;
- replacing manual projection ingest with an automated ingestion service.

These are not considered unfinished defects; they are separate approval/security-design items.

## Verification commands executed

Local:

- `git status --short --branch`
- `git log --oneline -8 --decorate`
- `gh pr view 4 --json number,title,state,isDraft,url,mergeable,mergeStateStatus,statusCheckRollup,headRefName,baseRefName`
- focused TODO/FIXME/placeholder/stub scans via repo search tools

VPS:

- `git status --short --branch`
- `git rev-parse --short HEAD`
- `systemctl --user is-active hermes-agent-dashboard.service`
- `systemctl --user is-active hermes-gateway.service`
- projection cache directory inventory
- `python3 scripts/ai_office/validate_office_projection.py ~/.hermes/office/projections/active/pcwb-vps-smoke-001`
- `python3 - <<'PY' ... read_office_projection_cache() ... PY`
- `systemctl --user show hermes-agent-dashboard.service -p ActiveState -p SubState -p MainPID`
- unauthenticated `curl` to `/api/office`, which returned `401`

## Completion priority order

The remaining work was ordered by dependency and risk:

1. Identify the exact project state from `NEXT.md`, `STATUS.md`, git, PR #4, and the VPS dashboard worktree.
2. Verify whether the previously listed manual safe-bundle transfer + VPS ingest was actually missing.
3. If the bundle was present, validate it and the safe cache reader before any new mutation.
4. Update handoff docs so the stale next-action does not cause repeated manual ingest work.
5. Run the broadest non-destructive local verification available and classify failures rather than hiding them.
6. Keep security-sensitive next tracks deferred unless explicitly approved.

## Additional verification pass 2026-05-13 08:50 KST

Project command inventory from config files:

- Python test command: `.venv/bin/python -m pytest -q` from `pyproject.toml` testpaths/addopts.
- Python focused tests: `.venv/bin/python -m pytest <paths> -q -o addopts=`.
- Python lint/type tools declared as dev extras: `ruff`, `ty`; they are not installed in this local venv.
- Frontend test command: `npm test` in `web/package.json`.
- Frontend lint command: `npm run lint` in `web/package.json`.
- Frontend build/typecheck command: `npm run build`, which runs `tsc -b && vite build`.
- Frontend dev/start command: `npm run dev`; production preview: `npm run preview`.
- Root npm only has `postinstall`; root audit is still available through npm.

Commands and outcomes:

- Related projection/Paperclip tests: `.venv/bin/python -m pytest tests/test_office_projection_generator.py tests/test_office_projection_validator.py tests/hermes_cli/test_office_projection_cache.py tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py -q -o addopts=` → `28 passed`.
- Full Python test suite: `.venv/bin/python -m pytest -q` → attempted; result `113 failed, 20360 passed, 234 skipped, 214 warnings, 16 errors`.
- Failure triage reruns:
  - `tests/acp/test_entry.py` fails at collection with `ModuleNotFoundError: No module named 'acp'`; this is an optional ACP dependency not installed in the current local venv.
  - `tests/gateway/test_discord_allowed_mentions.py::test_safe_defaults_block_everyone_and_roles` passed when rerun directly without xdist/addopts, indicating at least part of the full-suite Discord failure set is not reproduced as a focused failure.
  - `tests/run_agent/test_provider_parity.py::TestAuxiliaryClientProviderPriority::test_nous_when_no_openrouter` consistently fails because the current auxiliary default is `qwen/qwen3.6-plus` while the test expects `google/gemini-3-flash-preview`; this is unrelated to the AI Office projection manual ingest path and should be fixed in a separate provider-parity PR.
  - `tests/hermes_cli/test_web_server.py::TestPtyWebSocket::test_streams_child_stdout_to_client` consistently fails because no `hermes-ws-ok` bytes arrive in the PTY websocket test; this is unrelated to projection docs/cache work and should be fixed in a separate web-server/PTY test pass.
- Frontend focused tests: `npm test -- --run OfficePage.test.ts App.test.ts` → `2 files passed, 71 tests passed`.
- Frontend lint: `npm run lint` → exit 0 with 20 existing React/compiler warnings, no errors. Warnings are in pre-existing files such as `OAuthProvidersCard.tsx`, `Toast.tsx`, `ConfigPage.tsx`, `SessionsPage.tsx`, `PluginPage.tsx`, and theme/i18n contexts; no Office projection recovery file was changed in `web/`.
- Frontend build/typecheck: `npm run build` → passed; `tsc -b` passed; Vite build passed with the existing large chunk warning.
- Frontend npm audit: `cd web && npm audit --audit-level=high` → `found 0 vulnerabilities`.
- Root npm audit: `npm audit --audit-level=high` → `found 0 vulnerabilities`.
- Python security audit: `.venv/bin/python -m pip_audit --version` showed `No module named pip_audit`; no new dependency was installed solely for this docs-only recovery pass.
- Python lint/type tool availability: `.venv/bin/python -m ruff check .` and `.venv/bin/python -m ty check ...` both failed because `ruff`/`ty` are not installed in the current venv. This local environment issue was documented instead of broad-installing dev extras for an unrelated docs-only recovery commit.
- Local browser smoke on `http://127.0.0.1:8876/office?projection-recovery=1` using a temporary dashboard process succeeded: the Office page rendered, navigation and office map/projection area were visible, raw leak regex was false, `게이트웨이 재시작`/`Hermes 업데이트` mutation copy was absent on `/office`, 54 focusable controls were present, and browser console JS errors were zero.

## UI/API/backend evidence classification

- UI rendering: local browser smoke showed a non-blank Office dashboard with sidebar navigation, Korean-first copy, map/projection area, safe empty states, and no catastrophic layout break.
- UI raw leak check: browser DOM text did not match token/path/private-key/raw-prompt sentinel patterns used in the smoke expression.
- UI mutation boundary: Office route did not show the gateway restart or Hermes update action copy in the DOM check.
- UI accessibility basics: smoke found keyboard-focusable controls and existing ARIA/navigation labels in the accessibility snapshot. This is evidence of basic focus/label posture, not a full WCAG audit.
- Responsive coverage: this pass did not perform separate mobile/tablet viewport screenshots; the existing CSS/build remains unchanged and no new UI code was added in this recovery pass.
- API auth/error posture: unauthenticated VPS `/api/office` returned `401`; no auth secret was read to bypass this. This confirms the endpoint did not become publicly readable during the recovery pass.
- API input validation: no API code changed in this pass; existing focused Office API/projection tests remain the evidence for the touched projection path.
- Database/migration: no database, schema, or migration was changed.
- Environment/config: no environment variable or config requirement was added.
- External services: only GitHub PR metadata and VPS SSH/status checks were used; no new external service integration was implemented.
- Async/cron/queue: no watcher, cron, queue, or daemon automation was added. Automation remains deferred because it changes persistence/authority.
- Logging/error messages: no runtime logging path was changed. Validator/cache errors in the projection path remain safe metadata-only by existing tests.
- Internationalization: no new web UI strings were added in this pass; documentation is Korean/English mixed to match existing AI Office handoff docs.
- Cross-platform: projection generator/validator/cache paths use Python `pathlib`; live VPS path is Linux-specific and documented as deployment evidence, not hardcoded into code.

## Failure/bug handling

The broad full-suite failures are real evidence and were not hidden by deleting tests, adding skips, or weakening assertions. They are classified as outside the current AI Office projection manual-ingest completion because:

- the related projection/Paperclip tests pass;
- the frontend Office tests/build pass;
- the active VPS projection validates and cache reader reports active safe metadata;
- several failures are optional-dependency/environment problems or unrelated core/gateway/provider parity failures;
- fixing provider defaults, ACP dependency setup, Discord full-suite isolation, or PTY websocket behavior would be broad core work beyond the docs-only projection recovery boundary.

If the next standing goal is to reduce the full repository failure count, the recommended priority order is:

1. Install/standardize optional dev extras for ACP/MCP/TTS tests in a controlled environment, or mark those tests with appropriate optional-dependency skips.
2. Fix provider-parity expectation drift for the Nous auxiliary default model.
3. Investigate PTY websocket stdout streaming on macOS/Python 3.12.
4. Re-run Discord/gateway subsets serially to identify xdist/environment isolation failures.
5. Address existing React lint warnings in small UI-specific PRs, because they predate this Office projection recovery and are not caused by the current changes.

## Implementation hardening pass 2026-05-13 09:05 KST

A small code hardening slice was added for the manual Office projection producer because it directly addresses the remaining checklist items about implemented code paths, file I/O failures, user-facing errors, typechecking, and function responsibility.

Changed files:

- `scripts/ai_office/generate_office_projection.py`
- `tests/test_office_projection_generator.py`

TDD evidence:

1. Added failing tests first:
   - `test_projection_generator_rejects_non_positive_freshness_without_writing`
   - `test_projection_generator_reports_output_write_errors_without_private_paths`
2. RED result:
   - freshness test failed because the generator only failed later through the projection validator with a less direct message;
   - output write error test failed with an unhandled `FileExistsError` traceback that included private temporary paths.
3. GREEN implementation:
   - reject non-positive `--valid-for-seconds` and `--hard-expire-seconds` before building/writing a bundle;
   - catch `OSError` around output directory creation and JSON writes;
   - return a safe actionable error shape `ERROR: failed to write projection bundle (<ExceptionClass>)` without echoing the private path and without a Python traceback.
4. Regression evidence:
   - new focused tests passed;
   - full generator test file passed with 6 tests;
   - projection/Paperclip focused suite now passed with 30 tests.

Additional command outcomes after code hardening:

- `.venv/bin/python -m pip install 'ruff' 'ty>=0.0.1a29,<0.0.22'` installed project-declared dev tools into the local venv only; no lockfile or source dependency change was made.
- `.venv/bin/python -m ty check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` initially found a test helper typing issue at `manifest.update(overrides)`; fixed by annotating the helper manifest as `dict[str, object]`; rerun passed.
- `.venv/bin/python -m ruff check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` passed; ruff emitted the existing project config deprecation warning about top-level `select` moving to `lint.select`.
- `.venv/bin/python -m pytest tests/test_office_projection_generator.py -q -o addopts=` → `6 passed`.
- `.venv/bin/python -m pytest tests/test_office_projection_generator.py tests/test_office_projection_validator.py tests/hermes_cli/test_office_projection_cache.py tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py -q -o addopts=` → `30 passed`.
- Full Python suite rerun after the code change: `.venv/bin/python -m pytest -q --tb=short` → `104 failed, 20371 passed, 234 skipped, 216 warnings, 16 errors`. This is still outside the projection path, but the count improved after installing declared dev tools; remaining examples are Discord/gateway isolation, provider parity drift, ACP/MCP/TTS optional dependency/import issues, PTY websocket behavior, file-tool state/staleness tests, Vercel terminal tool expectation drift, and macOS process timing.
- Frontend focused tests plus build rerun: `npm test -- --run OfficePage.test.ts App.test.ts && npm run build` → `71 tests passed`; `tsc -b` and Vite build passed with the existing large chunk warning.
- Browser smoke rerun on temporary local dashboard port `8877`:
  - `/office?checklist=2` rendered with navigation and Office projection map;
  - raw leak regex false;
  - no loading/error terminal state left on the page;
  - no `lorem ipsum`, `TODO`, or `FIXME` in visible body text;
  - 50 interactive controls, 0 controls without accessible text;
  - first character inspection click succeeded and remained raw-leak false;
  - `/sessions` route rendered a non-blank sessions screen and raw-leak false;
  - console JS errors after smoke were zero.

Checklist-relevant classification after this pass:

- Implemented code path: the projection producer is executable code, not a stub; its new file I/O and freshness failure paths are covered by tests.
- Runtime exceptions: known projection-producer output write errors now return a controlled error instead of a traceback. Broad repo runtime exceptions remain in unrelated full-suite failures and are classified separately above.
- Typecheck: project-declared `ty` was installed in the local venv and passed for the touched producer/tests. Full-repo typecheck was not attempted because this pass changed only the projection producer/tests and the repo has many unrelated optional/runtime domains.
- UI coverage: Office and Sessions routes were smoke-tested locally. This is route-level evidence, not a claim of exhaustive mobile/tablet/WCAG coverage for every dashboard plugin.
- API/backend: no public endpoint contract changed. The existing protected `/api/office` 401 evidence and projection validator/cache tests remain the backend evidence for this slice.
- External services/async/cron: no new integration, watcher, queue, or daemon was added; automation remains approval-gated.
- Performance: the changed producer path processes bounded manifest lists and writes two JSON files once; no loop, polling, or network call was introduced.
- Logging/errors: the producer now reports safe error categories without secret/path echoing and without swallowing errors silently.
- i18n: no new browser-facing UI string was added. New CLI errors are English, consistent with the existing script/validator messages.
- Config/hardcoding: no environment-specific path was added; output path remains a CLI argument and internal file names remain the fixed projection bundle contract (`manifest.json`, `payload.json`).

## Evidence extension pass 2026-05-13 09:20 KST

This pass focused on the remaining checklist areas that can be advanced without broad repo rewrites or security-sensitive operations.

Code responsibility / duplication:

- Refactored `scripts/ai_office/generate_office_projection.py` to separate concerns:
  - `_validate_generation_args()` handles CLI argument policy checks.
  - `build_projection_bundle()` builds and validates the safe in-memory bundle.
  - `_write_projection_bundle()` performs the two-file bundle write.
  - `main()` now coordinates parse/build/dry-run/write/validate/report only.
- This is a behavior-preserving refactor guarded by the existing generator tests; no new dependency, config value, file name, schema, or public API was introduced.

Additional backend/API evidence:

- Existing `tests/hermes_cli/test_office_api.py` covers protected Office endpoints, read-only DTO shape, mutation method rejection, and safe Kanban renderer fields.
- Rerun result: `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py -q -o addopts=` → `7 passed`.
- Manual TestClient probe for invalid `mode` inputs:
  - `/api/office/state?mode=remote` → 400 `Unsupported office display mode`
  - `/api/office/state?mode=` → 400 `Unsupported office display mode`
  - `/api/office/state?mode=../secret` → 400 `Unsupported office display mode`
  - `/api/office/events?mode=remote` → 400 `Unsupported office display mode`
  - `/api/office/events?mode=` → 400 `Unsupported office display mode`
  - `/api/office/events?mode=../secret` → 400 `Unsupported office display mode`
  - unauthenticated `/api/office/state` and `/api/office/events` → 401.
- No database/schema/migration changed in this pass; projection cache remains filesystem JSON bundle layout only.

Additional UI flow and layout evidence:

- Full current web test suite rerun from `web/`: `npm test -- --run` → `2 files passed, 71 tests passed`.
- `npm run lint && npm run build` → exit 0; lint still reports 20 existing warnings in unrelated dashboard files, and build still reports only the known Vite large chunk warning.
- Browser smoke on temporary local dashboard port `8878` exercised more than static render:
  - `/office?evidence=3` loaded with navigation and Office map visible.
  - Density controls were clicked (`요약`, then `상세`) and the page reflected detailed mode text.
  - A character inspect button was clicked and inspector copy remained visible.
  - The `라우팅` filter button was clicked and the page reflected routing filter text.
  - DOM probe after interactions: viewport `1280x633`, body chars `2502`, 61 focusable controls, 0 unnamed controls, raw leak regex false, horizontal overflow false, console JS errors 0.
- Static responsive CSS evidence remains in `web/src/index.css`:
  - `.office-map--mobile-readable` uses `overflow-x: auto` and bounded labels.
  - `.office-map--responsive` receives a `min-width: 34rem` under `@media (max-width: 640px)`.
  - The browser smoke confirmed no desktop horizontal overflow; a true mobile/tablet visual screenshot was not available with the current browser tool because it exposes no viewport-resize control.

Typecheck / runtime exception evidence:

- Touched Python files passed focused `ty` checks after refactor: `.venv/bin/python -m ty check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` → `All checks passed!`.
- Full repo ty was attempted: `.venv/bin/python -m ty check .` exited 101 with a `ty` panic while checking `tools/checkpoint_manager.py` plus 6557 diagnostics. Because `ty` itself reported `This indicates a bug in ty` and `Not all project files were analyzed`, this cannot currently serve as an authoritative full-repo typecheck gate in this environment.
- Representative full-repo ty diagnostics are outside the touched projection path: missing optional `acp` imports, broad nullable argument typing drift, TUI gateway dynamic config typing, and utility path type drift.
- Touched frontend TypeScript remains covered by `npm run build` (`tsc -b && vite build`) passing.

External service / async / performance / logging classification:

- This pass added no external service call, network request, watcher, queue, cron, daemon, retry loop, or background worker.
- The projection producer remains bounded: load already-safe manifests, build in-memory DTOs, write exactly `manifest.json` and `payload.json`, then run the canonical validator.
- Error reporting remains safe: CLI errors include category/action information but do not echo manifest values, private paths, token-like strings, raw prompts, transcripts, logs, provider/model IDs, or shell args.
- Because automation is approval-gated, duplicate execution, partial failure, and restart behavior remain documented design work rather than implemented runtime behavior.

## Evidence extension pass 2026-05-13 09:35 KST

This pass converted another unchecked area into a small TDD hardening change instead of adding only prose.

TDD hardening added:

- New failing test first: `test_projection_generator_bounds_manifest_count_before_reading_or_writing`.
- RED result: the generator attempted to read the first missing manifest and returned `cannot read file (FileNotFoundError)` instead of rejecting an oversized manifest list up front.
- GREEN implementation:
  - import the validator's `MAX_PAYLOAD_ITEMS` and use it as the single producer-side manifest-count bound;
  - reject more than `MAX_PAYLOAD_ITEMS` `--paperclip-manifest` inputs before reading any manifest or writing output;
  - keep the error safe: `too many paperclip manifests; maximum is 100`, with no private path, raw value, or traceback;
  - introduce `MANIFEST_FILE_NAME` and `PAYLOAD_FILE_NAME` constants so the output file contract is centralized instead of duplicated string literals.

Checklist-relevant evidence from this pass:

- Runtime/input failure path: oversized manifest input is now bounded before file I/O and cannot degrade into repeated filesystem reads or path-echoing errors.
- Performance/bounds: the producer's manifest count now matches the validator's bounded payload item limit (`MAX_PAYLOAD_ITEMS`); no unbounded manifest fan-in path remains in the touched producer.
- Config vs hardcoding: schema limits continue to come from the canonical validator; bundle file names are still fixed by the projection contract but now centralized in producer constants.
- Cross-platform path behavior: input and output paths remain `pathlib.Path` arguments; the new rejection path does not depend on platform path formatting and deliberately avoids echoing local paths.
- Responsibility/duplication: `_validate_generation_args()` now owns both scalar argument policy and manifest-count policy; `_write_projection_bundle()` owns the centralized two-file write.

Verification after this pass:

- RED command: `.venv/bin/python -m pytest tests/test_office_projection_generator.py::test_projection_generator_bounds_manifest_count_before_reading_or_writing -q -o addopts= --tb=short` initially failed with `cannot read file (FileNotFoundError)`.
- GREEN command: same targeted test → `1 passed`.
- Focused Office/projection/API suite: `.venv/bin/python -m pytest tests/test_office_projection_generator.py tests/test_office_projection_validator.py tests/hermes_cli/test_office_projection_cache.py tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py tests/hermes_cli/test_office_api.py -q -o addopts=` → `38 passed`.
- Focused Python typecheck: `.venv/bin/python -m ty check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` → `All checks passed!`.
- Focused Python lint: `.venv/bin/python -m ruff check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` → `All checks passed!`, with only the existing top-level `select` deprecation warning from `pyproject.toml`.
- Frontend focused tests/build: `npm test -- --run OfficePage.test.ts App.test.ts && npm run build` → `71 tests passed`; `tsc -b` and Vite build passed with the existing large chunk warning.
- API probe with `starlette.testclient`:
  - authenticated `/api/office/state` and `/api/office/events` → 200 dict responses;
  - invalid `mode` values `remote`, empty string, and `../secret` on both endpoints → 400 `Unsupported office display mode`;
  - unauthenticated `/api/office/state` and `/api/office/events` → 401.
- Full Python suite rerun after this pass: `.venv/bin/python -m pytest -q --tb=short` → `104 failed, 20372 passed, 234 skipped, 218 warnings, 16 errors`. This confirms the touched projection/API tests continue to pass while repo-wide unrelated failures remain. Representative remaining domains are Discord slash/auth/send mocks, ACP/MCP/TTS import/optional dependency errors, provider parity expectation drift, gateway systemd/WSL service routing tests on macOS, PTY websocket tests, file-tool state/staleness tests, Vercel terminal requirement expectations, and timing-sensitive local interrupt cleanup.

## Evidence extension pass 2026-05-13 09:46 KST

This pass targeted the unchecked multi-viewport UI evidence with a small TDD slice in the existing Office responsive view-model instead of claiming visual coverage from a fixed desktop browser only.

TDD UI responsive hardening:

- New failing assertion first in `builds Stage 12-A responsive readability plans from viewport width only`:
  - `viewportWidth: 820` should produce an explicit `tablet` plan;
  - expected `office-map--tablet-readable` and `office-map-rail--tablet-stack` classes;
  - expected Korean tablet notes explaining standard density and stacked auxiliary rail behavior.
- RED result: the 820px case was treated as `desktop`, with `office-map--responsive` and `office-map-rail--desktop`.
- GREEN implementation:
  - `OfficeResponsiveReadabilityPlan.viewportMode` now supports `narrow | tablet | desktop`;
  - widths `<640` remain mobile/narrow summary mode;
  - widths `640..1023` now receive tablet/standard mode and tablet-specific class names;
  - widths `>=1024` or unknown widths remain desktop/current density mode;
  - CSS adds tablet-readable nameplate sizing plus a two-column rail stack under `@media (min-width: 641px) and (max-width: 1023px)`.

Checklist-relevant evidence from this pass:

- UI flow/viewport: the existing helper now distinguishes mobile, tablet, and desktop view-model states instead of collapsing tablet into desktop.
- i18n/localization: the newly added user-facing tablet notes are Korean, consistent with the page's Korean-first Office UI copy. This repo does not currently route these Office helper strings through a separate translation-key table.
- Performance: the change is a pure width-threshold branch and CSS class selection; no new network request, renderer, dependency, loop, or expensive recomputation was added.
- Config/hardcoding: the breakpoints mirror the existing CSS media boundaries already present around `640px`; `1024px` is the new tablet/desktop boundary used only for view-model class selection and documented by test.
- Cross-platform: the viewport classifier uses numeric browser width only and does not depend on OS paths or platform APIs.

Verification after this pass:

- RED command: `npm test -- --run OfficePage.test.ts -t "Stage 12-A responsive"` initially failed because 820px returned `desktop` classes.
- GREEN command: same targeted test → `1 passed | 67 skipped`.
- Frontend focused tests/build: `npm test -- --run OfficePage.test.ts App.test.ts && npm run build` → `71 passed`; `tsc -b` and Vite build passed with only the known large chunk warning.
- Frontend lint: `npm run lint` → exit 0 with the same existing 20 warnings in unrelated files; no new OfficePage/officeView warning.
- Focused backend/projection suite: `.venv/bin/python -m pytest tests/test_office_projection_generator.py tests/test_office_projection_validator.py tests/hermes_cli/test_office_projection_cache.py tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py tests/hermes_cli/test_office_api.py -q -o addopts=` → `38 passed`.
- Focused Python typecheck for touched projection files remains green: `.venv/bin/python -m ty check scripts/ai_office/generate_office_projection.py tests/test_office_projection_generator.py` → `All checks passed!`.
- Browser smoke on temporary local dashboard port `8879`:
  - `/office?responsive=tablet-evidence` rendered the Office page;
  - desktop viewport `1280x633` retained desktop classes (`office-map--responsive`, `office-map-rail--desktop`), no tablet/mobile class was incorrectly applied;
  - horizontal overflow false;
  - unnamed buttons 0;
  - raw leak regex false;
  - console JS errors 0.

## Conclusion

The previously listed next operational step, manual safe-bundle transfer plus VPS ingest, is complete and verified on the VPS for bundle `pcwb-vps-smoke-001`.

The current project state is ready for review of PR #4 as a draft. Further progress beyond this point is not a simple completion of the current manual path; it would be a new security-sensitive design track for automation, NAS access, service changes, public exposure, PR merge readiness, or a separate repo-wide test-health track.
