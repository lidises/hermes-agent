# AI Office runtime-command inclusion live surface handoff — 2026-05-20

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raises the visible `/office` surface one rung after checksum-only runtime-command preview: bounded runtime-command inclusion metadata status is now live-visible in production, while execution and all downstream mutation remain closed.

## Boundary

Allowed in this slice:

- Use the existing protected metadata-only runtime-command inclusion store/API/readback implementation.
- Surface the existing `ManualRuntimeCommandInclusionRecordStatusPanel` outside legacy diagnostics.
- Add placement regression coverage so production/browser smoke sees the panel.
- Run local protected API smoke that writes a safe metadata-only chain ending in inclusion.
- Commit/push and VPS dashboard-only sync/restart/live smoke.

Explicitly not allowed / not done:

- Runtime command execution.
- Adapter binding/dispatch.
- Replay write beyond metadata status lane.
- Target mutation.
- Kanban mutation.
- NAS save/write/direct VPS NAS authority.
- Watcher/cron/daemon activation.
- Credential access.
- Public exposure changes.
- Gateway restart.

## RED/GREEN so far

RED:

```bash
cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "runtime inclusion status panels live-visible"
# failed: inclusion panel appeared after SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES
```

GREEN:

```bash
cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "runtime inclusion status panels live-visible"
# 1 passed
```

## Changed files

- `web/src/pages/OfficePage.rpg.test.tsx`
  - Placement regression now covers dispatch gate, runtime preview, and runtime inclusion panels.
- `web/src/pages/OfficePage.tsx`
  - `ManualRuntimeCommandInclusionRecordStatusPanel` moved to the live-visible status group before `SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES`.

## Local verification

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

Safety scan:

- added/diff files checked for token/private-key/password/api-key patterns: passed.

Local API smoke:

- temp HERMES_HOME dashboard on 127.0.0.1:9123.
- Protected API chain stored:
  - manual approval draft = true
  - manual approval record = true
  - dispatch gate open = true
  - runtime command preview = true
  - runtime command inclusion = true
- Readback:
  - count=1
  - included=true
  - executed=false
  - checksum length=64
  - target_mutation=false
  - Kanban=false
  - NAS=false
  - real_dispatch=false
  - unsafe command value leak=false
  - private path leak=false
  - note: `shell_command_excluded=true` appears only as a redaction flag, not as an executable command body.

Local browser smoke:

- URL: http://127.0.0.1:9123/office?inclusion-local-browser=1
- DOM:
  - inclusion panel present=true
  - count=1
  - included=true
  - executed=false
  - realDispatch=false
  - controls=0
  - unsafe command value leak=false
  - private path leak=false
  - console JS errors=0

Commit/push and VPS verification pending.

## Next likely rung after this completes

If the user again approves raising risk by the shortest safe path, the next rung is runtime-command execution-noop metadata, not target mutation. Keep execution noop backed by inclusion, with target/Kanban/NAS/adapter/real dispatch still false.
