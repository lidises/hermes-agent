# AI Office dispatch gate + runtime preview live surface handoff — 2026-05-20

## Scope

User approved continuing the recommended path with bounded writes and slightly stronger authority.

This slice surfaces the already-existing controlled-mutation metadata rungs in the live `/office` page outside `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`:

- manual dispatch-gate-open record status
- manual runtime-command preview record status

The backend/API/store helpers already exist in this checkout. This slice adds a regression test for live-visible placement and makes the panels visible in the production browser surface.

## Boundary

Allowed:

- Local code/docs/test writes.
- Existing protected metadata-only APIs may be used for smoke records:
  - approval draft
  - approval record
  - dispatch-gate-open metadata
  - runtime-command preview checksum-only metadata
- Commit/push.
- Dashboard-only VPS source/worktree sync and dashboard restart.

Still blocked:

- Runtime command body inclusion.
- Runtime command execution.
- Adapter binding/dispatch.
- Target mutation.
- Kanban mutation.
- NAS save/write/direct VPS NAS authority.
- Watcher/cron/daemon activation.
- Credential access.
- Public exposure changes.
- Gateway restart.

## Verification log

RED:

```bash
cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "live-visible outside legacy"
# failed: ManualDispatchGateOpenRecordStatusPanel first occurrence was after SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES
```

GREEN focused:

```bash
cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "live-visible outside legacy"
# passed
```

Full local verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_manual_approval_recording_draft.py tests/hermes_cli/test_office_controlled_mutation_approval_event_envelope.py tests/hermes_cli/test_office_api.py -q -o 'addopts='
# 46 passed

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

cd web && npm test -- --run src/lib/api.test.ts src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx
# 302 passed

cd web && npx eslint src/pages/OfficePage.tsx src/pages/OfficePage.rpg.test.tsx src/lib/api.ts
# errors 0; existing Fast Refresh warnings 2

cd web && npm run build
# passed; existing Vite large chunk warning

git diff --check
# passed
```

Local API smoke:

- temp HERMES_HOME dashboard on 127.0.0.1:9122.
- Protected API chain stored:
  - manual approval draft = true
  - manual approval record = true
  - manual dispatch gate open = true
  - manual runtime command preview = true
- Readback:
  - gate_count=1 for final unique filter
  - preview_count=1
  - gate_open=true
  - preview_created=true
  - checksum length=64
  - runtime_included=false
  - runtime_executed=false
  - real_dispatch=false
  - target_mutation=false
  - Kanban=false
  - NAS=false
  - unsafe raw command leak=false

Local browser smoke:

- URL: http://127.0.0.1:9122/office?gate-preview-local=1
- DOM:
  - dispatch-gate-open panel present=true
  - runtime-preview panel present=true
  - controls=0
  - gateOpen=true
  - previewCreated=true
  - previewExecuted=false
  - unsafe raw command leak=false
  - console JS errors=0

Deploy verification:

- Code/docs commit pushed:
  - b8afe867 feat(office): surface dispatch gate preview status
- VPS worktrees synced:
  - `/home/hermes/.hermes/ai-office-dashboard` HEAD = b8afe86754f3ffc8d70dfb45c8c44a0bd219aa42
  - `/home/hermes/.hermes/hermes-agent` HEAD = b8afe86754f3ffc8d70dfb45c8c44a0bd219aa42
- `web_dist` rsynced to both worktrees.
  - relative content hash: 96daa63e368ccf7d80bc33b4782be52e14ad6d0d4344210bd1c5a40416e7b21b
  - file count: 22
- Restarted:
  - `hermes-agent-dashboard.service` only, via hermes user systemd.
- Not restarted:
  - `hermes-gateway.service`.
- Final services:
  - dashboard active
  - gateway active

VPS API smoke:

- URL base: `http://100.122.57.85:8765`
- Protected API chain stored:
  - manual approval draft = true
  - manual approval record = true
  - manual dispatch gate open = true
  - manual runtime command preview = true
- Readback:
  - gate_count=1 for final unique filter
  - preview_count=1 for final unique filter
  - gate_open=true
  - preview_created=true
  - checksum length=64
  - runtime_included=false
  - runtime_executed=false
  - real_dispatch=false
  - target_mutation=false
  - Kanban=false
  - NAS=false
  - unsafe raw command leak=false

VPS browser smoke:

- URL: `http://100.122.57.85:8765/office?gate-preview-vps=b8afe867`
- DOM:
  - dispatch-gate-open panel present=true
  - runtime-preview panel present=true
  - controls=0
  - gateOpen=true
  - previewCreated=true
  - previewExecuted=false
  - previewRealDispatch=false
  - unsafe raw command leak=false
  - console JS errors=0

Final note: live panel counts can exceed the unique filtered API smoke counts because previous safe metadata-only smoke records remain in the VPS store.
