# Stage 16-C — Read-only Safe Event Stream

Date: 2026-05-10 00:14 KST
Branch: `ai-office-stage16c-safe-event-stream-20260510`
Base: `89b16bb5` (`feat(office): add safe event substrate motion`)

## Why

Stage 16-B created the frontend-safe event substrate and motion commands. The next step is a minimal backend read-only stream that feeds the same safe shape without exposing raw commands, prompts, transcripts, task bodies, scripts, logs, provider/model identity, secrets, tokens, or individual task identity.

## Goal

Add an authenticated read-only office event endpoint and frontend connection posture so `/office` can distinguish:

- local projected snapshot/delta events;
- backend safe stream available;
- stream unavailable with local fallback.

## Scope

1. Backend safe event projection
   - Add an allowlisted `OfficeSafeEvent` projection derived from already-redacted `OfficeState` summary/source status only.
   - Add a protected read-only route such as `/api/office/events`.
   - Keep payload category/count/room/tone/timestamp only.
   - Do not emit raw labels/details or adapter errors.

2. Frontend safe stream posture
   - Add a tiny API helper or page-local fetch that reads safe events when available.
   - Keep Stage 16-B local projection as fallback.
   - UI labels stream source without implying raw tracking.

3. Tests
   - Backend: endpoint requires dashboard session token, rejects mutation methods, emits allowlisted redacted event shape.
   - Frontend: stream state helper/adapter maps loaded/unavailable state safely and preserves fallback events.

## Safety contract

Preserved unless separately approved:

- read-only endpoint only;
- no mutation controls;
- no persistent browser storage;
- no raw prompt/transcript/task_body/script/log/provider/model/secret/token/task identity;
- no SSE/WebSocket long-lived stream in this slice if a one-shot event endpoint gives enough verified movement; SSE can be a later 16-D if needed;
- no renderer dependency.

## Implementation record

Completed so far:

- Backend RED verified: focused `test_office_api.py` failed before `/api/office/events` returned the safe JSON shape.
- Added backend `OfficeSafeEvent` and `build_office_safe_event_payload(state)`.
- Added authenticated read-only `GET /api/office/events` to `web_server.py`.
- Added backend tests for session-token protection, allowlisted payload shape, raw-string exclusion, and mutation-method rejection.
- Backend GREEN verified: `test_office_api.py` 6 passed.
- Frontend RED verified: focused `OfficePage.test.ts` failed while `buildOfficeSafeStreamPosture` was missing.
- Added frontend DTO/API support: `OfficeSafeEventsResponse`, `OfficeSafeEventDTO`, and `api.getOfficeEvents()`.
- Added `OfficeSafeStreamPosture` and `buildOfficeSafeStreamPosture(...)`.
- Connected `/office` to load backend safe events and render `data-office-safe-stream-status` while preserving the Stage 16-B fallback projection.
- Frontend GREEN verified: `OfficePage.test.ts` 53 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.

## Verification target

Frontend:

```bash
cd web
npm test -- --run OfficePage.test.ts
./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
npm run build
```

Backend:

```bash
source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
git diff --check
```

Final verification 2026-05-10 00:39 KST:

- `npm test -- --run OfficePage.test.ts`: 53 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.
- `npm run build` passed with the existing Vite large chunk warning only.
- Backend focused office tests passed: 21 passed in 1.68s.
- `git diff --check` passed.
- Browser smoke `/office?stage16c=safe-event-stream` passed: office-first layout, safe event substrate, `data-office-safe-stream-status="local-fallback"`, safe event item `snapshot_static`, motion lane command `idle-glow`, tracking truth, diagnostics drawer, prior route/focus/breadcrumb/pulse hooks, raw leak false, console JS errors none.

Browser smoke:

- `/office?stage16c=safe-event-stream`
- office-first layout present;
- safe event substrate present;
- stream posture hook present;
- fallback/local events still present when stream empty/unavailable;
- raw leak false;
- console JS errors none.
