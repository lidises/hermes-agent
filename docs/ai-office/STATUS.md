## Current status — Mac relay real-write gate compact summary deployed (2026-05-26T02:06Z)

Current deployed baseline:
- Branch: `main`
- Code commit: `89255c392 feat(office): surface Mac relay real-write gate summary`
- Local and origin are synced for the code commit.
- VPS core checkout and dashboard checkout are synced to the code commit.
- Dashboard assets were rebuilt locally and rsynced to both VPS checkouts.
- `hermes-agent-dashboard.service` and `hermes-vps-core-dashboard.service` were restarted and are active.
- Gateway service remained active and was not restarted.

Implemented rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_write_gate_after_final_preflight`

Changes:
- Promoted Mac relay real-write gate to the compact `/office` controlled-mutation summary above final preflight.
- Added compact DOM hooks for real-write gate readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- Exercised the protected real-write gate API live on the VPS as a metadata-only readback/idempotency replay check against the existing safe record.
- Preserved the compact dashboard posture: latest boundary only, heavy historical ladder collapsed out of default DOM, no controls/forms/inputs.

Boundaries preserved:
- real NAS production write: not enabled and not executed
- VPS direct NAS authority / VPS NAS mount: not enabled
- watcher / cron / dispatch / authority adapter / public exposure: not enabled
- gateway restart: not performed
- replay-store execution write: not enabled
- raw markdown / write_payload / raw path / secret echo: excluded from DTO and compact DOM summary

Local verification:
- Frontend RED first: real-write gate compact-dashboard test failed before implementation.
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_record.py -k "real_write_gate" -q -o addopts=`
  - result: `3 passed, 90 deselected`
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t "real-write gate"`
  - result: `3 passed, 177 skipped`
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
  - result: passed
- `git diff --check`
  - result: passed
- production-source leak scan for raw path/secret/body markers
  - result: passed
- `cd web && npm run lint -- src/pages/OfficePage.tsx`
  - result: exit 0; existing warnings only, no errors
- `cd web && npm run build`
  - result: passed; only the known large Vite chunk warning appeared

VPS deployment / smoke:
- Both VPS worktrees reset to the code commit.
- `hermes_cli/web_dist/` rsynced to both VPS worktrees.
- Local/core/dashboard relative `web_dist` hash matched.
- Dashboard and core dashboard services restarted; gateway service was not restarted.
- Protected API smoke:
  - unauthenticated real-write gate GET returned `401`
  - authenticated real-write gate GET returned HTTP 200
  - found=true
  - real-write gate ready=true
  - write_readiness_percent=99
  - SHA-256 length=64
  - duplicate protected POST replayed idempotently and skipped a second write
  - record_count remained `2` after duplicate replay
  - next boundary: `fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate`
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - raw leak probe=false
- Hydrated DOM smoke on `/office`:
  - compact dashboard hook found=true
  - real-write gate ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - write-readiness displayed as 99%
  - latest boundary label: Mac relay real-write gate
  - scoped controls/forms/inputs=0
  - browser console JS errors=0
  - raw leak probe=false

Next safe boundary:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate`

Do not cross without exact later approval:
- real NAS production write
- VPS direct NAS authority
- durable queue/watcher/cron/dispatcher/authority-adapter activation
- gateway restart
- public exposure
- raw markdown/path/secret echo
