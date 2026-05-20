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


## Final deployment result — 2026-05-20 21:16 KST

Final code/deploy commits:

- `ed224c2353a671a47446f4eab19c9cea9890a32d` — `feat(office): store approval event envelopes`
- `abe37d934260d07aa5548321fe6e01e327a4132c` — `fix(office): show approval event envelope status`

VPS sync/restart:

- `/home/hermes/.hermes/ai-office-dashboard` HEAD: `abe37d934260d07aa5548321fe6e01e327a4132c`; clean.
- `/home/hermes/.hermes/hermes-agent` HEAD: `abe37d934260d07aa5548321fe6e01e327a4132c`; clean.
- `web_dist` relative content hash matched across local, dashboard, and hermes-agent: `39b19727ae5e9a9042afb75e51e552cd10f11bb3c554f1f78bcf94eb8ed80d3d` over 22 files.
- Restarted `hermes-agent-dashboard.service` only.
- Did not restart `hermes-gateway.service`.
- Final services: dashboard active, gateway active.
- Private `/office` HTTP: 200.

VPS live API smoke:

- Wrote bounded metadata-only records through protected APIs:
  - manual approval draft: stored=true, HTTP 200;
  - manual approval record: stored=true, HTTP 200;
  - approval-event envelope: stored=true, HTTP 200.
- Readback for `event-office-approval-ed224c23-vps-smoke`:
  - `approval_event_envelope_count=1`
  - `approval_record_ref=approval-office-event-ed224c23-vps-smoke`
  - `event_envelope_ref=envelope-office-approval-ed224c23-vps-smoke`
  - `dispatch_gate_open=false`
  - `real_dispatch_execution_enabled=false`
  - `target_mutation_enabled=false`
  - `kanban_mutation_enabled=false`
  - `nas_save_enabled=false`
  - `raw_excluded=true`

VPS live browser smoke:

- URL: `http://100.122.57.85:8765/office?approval-event-envelope=abe37d93`
- DOM:
  - approval-event envelope panel present: true
  - count: 1
  - written: true
  - controls in panel: 0
  - dispatch gate open: false
  - real dispatch enabled: false
  - target mutation enabled: false
  - Kanban enabled: false
  - NAS enabled: false
  - panel raw leak: false
  - visual map: 1
  - map SVG: 1
  - console JS errors: 0

Preserved boundaries:

- Dispatch gate opening not performed.
- Runtime command materialization/execution not performed.
- Adapter binding/dispatch not performed.
- Target mutation not performed.
- Kanban mutation not performed.
- NAS save/write/direct VPS NAS authority not performed.
- Watcher/cron/daemon activation not performed.
- Credential access not performed.
- Public exposure unchanged.
- Gateway was not restarted.
