# AI Office approval-event envelope metadata write/readback handoff — 2026-05-20

## Scope

Approved by user as the next recommended step with write included and slightly stronger authority.

Implemented a bounded approval-event envelope metadata write/readback slice:

- Backend helper validates and appends sanitized approval-event envelope metadata to local Hermes controlled-mutation JSONL storage.
- Protected API routes expose POST write and GET readback.
- Frontend `/office` adds a display-only readback panel with stable DOM hooks.
- Dispatch, runtime command execution, target mutation, Kanban mutation, NAS save/write, watcher/cron, credential access, public exposure, and gateway restart remain disabled.

## New backend contract

- Store:
  - `$HERMES_HOME/office/controlled-mutation/approval_event_envelopes.jsonl`
- Helper functions:
  - `validate_office_controlled_mutation_approval_event_envelope(...)`
  - `append_office_controlled_mutation_approval_event_envelope(...)`
  - `list_office_controlled_mutation_approval_event_envelopes(...)`
- Routes:
  - `POST /api/office/controlled-mutation/approval-event-envelope`
  - `GET /api/office/controlled-mutation/approval-event-envelope-status`

## Safety posture

Allowed:

- approval-event envelope metadata storage/readback only;
- sanitized refs, booleans, ISO timestamps, safe summary text, evidence refs;
- readback projection in `/office`.

Still blocked:

- dispatch gate opening;
- runtime command materialization/execution;
- adapter binding/dispatch;
- target mutation;
- Kanban mutation;
- NAS save/write/direct VPS NAS authority;
- watcher/cron/daemon activation;
- credential access;
- public exposure;
- gateway restart.

## Verification log

RED:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_approval_event_envelope.py -q -o 'addopts='
# failed: missing append/list helper imports and missing API route (405)
```

GREEN so far:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_approval_event_envelope.py -q -o 'addopts='
# 4 passed

cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "approval-event envelope"
# 1 passed
```

Additional verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_approval_event_envelope.py tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py tests/hermes_cli/test_office_api.py -q -o 'addopts='
# 46 passed

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

cd web && npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx
# 257 passed

cd web && npx eslint src/pages/OfficePage.tsx src/pages/OfficePage.rpg.test.tsx src/lib/api.ts
# 0 errors, existing Fast Refresh warnings only

cd web && npm run build
# passed, existing Vite large chunk warning only

git diff --check
# passed
```

Local API smoke:

- Started dashboard against temp `HERMES_HOME=/tmp/hermes-approval-event-local`.
- Posted draft approval record, approval record, and approval-event envelope through protected APIs.
- Read back `approval_event_envelope_count=1`, latest refs, storage/readback enabled, and `real_dispatch_execution_enabled=false`.
- Local Vite/dev browser loaded `/office`; existing development module externalization warnings were present, JS errors were zero. Focused static panel test is the reliable frontend panel assertion for this slice.

## Next safe lane

After this slice is committed/deployed and live-smoked, the next safest lane is a read-only Office status/readback deepening or a separately approved dispatch-gate-open metadata-only record. Do not jump directly to runtime command materialization/execution, target mutation, Kanban mutation, or NAS save/write without a new explicit boundary.
