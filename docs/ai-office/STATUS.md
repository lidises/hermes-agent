## Current status — Mac relay tmp-root write smoke after manual receipt deployed (2026-05-25T19:36Z)

Current deployed baseline:
- Branch: `main`
- Code commit: `9dae525ce feat(office): attach tmp-root smoke to manual receipt rung`
- Local and origin are synced for the code commit.
- VPS core checkout and dashboard checkout are synced to the code commit.
- Dashboard assets were rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services were restarted; gateway service stayed active and was not restarted.

Implemented rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_manual_receipt`

Changes:
- Extended the tmp-root write smoke executor to optionally bind to the latest verified manual operator receipt record.
- Added source receipt ref/SHA verification metadata into the tmp-root smoke DTO.
- Advanced the write-readiness stage when receipt-backed smoke is present.
- Added real NAS write executed and VPS direct NAS authority false flags to the smoke DTO.
- Kept duplicate POST idempotency replay/skip semantics and included receipt source in the idempotency seed.
- Updated the compact `/office` controlled-mutation dashboard summary to prefer the tmp-root write smoke when present.
- Added backend and frontend focused tests for the receipt-backed tmp-root smoke and compact summary.

Boundaries preserved:
- real NAS production write: not enabled and not executed
- VPS direct NAS authority / VPS NAS mount: not enabled
- watcher / cron / dispatch / authority adapter / public exposure: not enabled
- gateway restart: not required and not performed
- replay-store write: not enabled
- raw markdown / write_payload / raw path / secret echo: excluded from DTO and compact DOM summary

Local verification:
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_record.py -k 'tmp_root_write_smoke or manual_operator_receipt or replay_idempotency_metadata' -o 'addopts=' -q`
  - result: `8 passed, 85 deselected`
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t 'Mac relay tmp-root write smoke|manual operator receipt|compact dashboard'`
  - result: `4 passed, 171 skipped`
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
  - result: passed
- `git diff --check`
  - result: passed
- added-line leak scan for raw path/secret/body markers
  - result: no matches
- `cd web && npm run build`
  - result: passed; only the known large Vite chunk warning appeared

Known unrelated/frontend-suite note:
- The whole `OfficePage.rpg.test.tsx` file still has two pre-existing source-placement assertions that fail against the current compact-dashboard structure. The new tmp-root/receipt/compact focused tests pass, and the production build passes.

VPS deployment / smoke:
- Both VPS worktrees reset to `9dae525ce`.
- `hermes_cli/web_dist/` rsynced to both VPS worktrees.
- `hermes-agent-dashboard.service`: active after restart.
- `hermes-vps-core-dashboard.service`: active after restart.
- `hermes-gateway.service`: active; gateway was not restarted.
- Protected API smoke:
  - unauthenticated tmp-root smoke GET returned `401`
  - tmp-root smoke POST returned 200 and recorded/written success or idempotent replay
  - source manual operator receipt verified=true
  - tmp-root filesystem write executed=true
  - tmp-root readback verified=true
  - duplicate tmp-root smoke POST replay=true
  - tmp-root smoke GET found=true and record_count=2
  - forbidden capability flags false
  - raw leak probe empty
- Hydrated DOM smoke:
  - compact dashboard hook found=true
  - tmp-root smoke ready=true
  - tmp-root readback=true
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - scoped controls/forms/inputs=0
  - raw leak=false
  - browser console JS errors=0

Next safe boundary:
`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`

Do not cross without exact later approval:
- real NAS production write
- VPS direct NAS authority
- durable queue/watcher/cron/dispatcher/authority-adapter activation
- gateway restart
- public exposure
- raw markdown/path/secret echo
