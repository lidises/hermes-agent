## Current status — replay/idempotency metadata compact dashboard deployed (2026-05-25T11:44Z)

Current deployed baseline:
- Branch: `main`
- Code commit: `9ce9d0416 feat(office): surface replay metadata in compact dashboard`
- Local and origin are synced for the code commit.
- VPS core checkout and dashboard checkout are synced to the code commit.
- Dashboard assets were rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services were restarted; gateway service stayed active and was not restarted.

Implemented rung:
`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke`

Changes:
- Promoted replay/idempotency metadata to the compact `/office` controlled-mutation summary above the tmp-root smoke.
- Added compact DOM hooks for replay metadata readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- The protected replay metadata API already stores safe metadata-only records over verified tmp-root smoke source refs/checksums; this slice exercised that live on the VPS and surfaced it in the dashboard.
- Added frontend regression coverage proving replay metadata wins over tmp-root smoke in the compact summary without rendering historical ladders, controls, raw paths, markdown bodies, or secrets.

Boundaries preserved:
- real NAS production write: not enabled and not executed
- VPS direct NAS authority / VPS NAS mount: not enabled
- watcher / cron / dispatch / authority adapter / public exposure: not enabled
- gateway restart: not required and not performed
- replay-store execution write: not enabled
- raw markdown / write_payload / raw path / secret echo: excluded from DTO and compact DOM summary

Local verification:
- Frontend RED first: replay metadata compact-dashboard test failed before implementation.
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_record.py -k 'tmp_root_write_smoke or manual_operator_receipt or replay_idempotency_metadata' -o 'addopts=' -q`
  - result: `8 passed, 85 deselected`
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t 'Mac relay tmp-root write smoke|manual operator receipt|compact dashboard|replay/idempotency metadata'`
  - result: `6 passed, 170 skipped`
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
  - result: passed
- `git diff --check`
  - result: passed
- production-source added-line leak scan for raw path/secret/body markers
  - result: no matches
- `cd web && npm run build`
  - result: passed; only the known large Vite chunk warning appeared

Known unrelated/frontend-suite note:
- The whole `OfficePage.rpg.test.tsx` file still has pre-existing source-placement assertions outside this focused path. The new replay/tmp-root/compact focused tests pass, and the production build passes.

VPS deployment / smoke:
- Both VPS worktrees reset to the code commit.
- `hermes_cli/web_dist/` rsynced to both VPS worktrees.
- `hermes-agent-dashboard.service`: active after restart.
- `hermes-vps-core-dashboard.service`: active after restart.
- `hermes-gateway.service`: active; gateway was not restarted.
- Protected API smoke:
  - unauthenticated replay metadata GET returned `401`
  - source tmp-root smoke GET found=true
  - replay metadata POST stored=true
  - duplicate replay metadata POST idempotency_replayed=true
  - replay metadata GET found=true and record_count=2
  - replay metadata ready=true
  - source tmp-root smoke/readback/idempotency verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
- Hydrated DOM smoke:
  - compact dashboard hook found=true
  - replay metadata ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest boundary label: replay/idempotency metadata
  - scoped controls/forms/inputs=0
  - raw leak=false
  - browser console JS errors=0

Next safe boundary:
`fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_readback_after_tmp_root_write_smoke`

Do not cross without exact later approval:
- real NAS production write
- VPS direct NAS authority
- durable queue/watcher/cron/dispatcher/authority-adapter activation
- gateway restart
- public exposure
- raw markdown/path/secret echo
