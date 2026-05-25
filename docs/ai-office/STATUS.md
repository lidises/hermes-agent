## Current status — Mac relay precommit metadata compact dashboard deployed (2026-05-25T13:12Z)

Current deployed baseline:
- Branch: `main`
- Code commit: `3cb6d0304 feat(office): surface precommit metadata in compact dashboard`
- Local and origin are synced for the code commit.
- VPS core checkout and dashboard checkout are synced to the code commit.
- Dashboard assets were rebuilt locally and rsynced to both VPS checkouts.
- Dashboard/core services were restarted; gateway service stayed active and was not restarted.

Implemented rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_metadata_after_replay_idempotency`

Changes:
- Promoted Mac relay precommit metadata to the compact `/office` controlled-mutation summary above replay/idempotency metadata.
- Added compact DOM hooks for precommit metadata readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- Exercised the protected precommit metadata API live on the VPS as a metadata-only record write sourced from verified replay/idempotency metadata.
- Added frontend regression coverage proving precommit metadata wins over replay/tmp-root in the compact summary without rendering historical ladders, controls, raw paths, markdown bodies, or secrets.

Boundaries preserved:
- real NAS production write: not enabled and not executed
- VPS direct NAS authority / VPS NAS mount: not enabled
- watcher / cron / dispatch / authority adapter / public exposure: not enabled
- gateway restart: not required and not performed
- replay-store execution write: not enabled
- raw markdown / write_payload / raw path / secret echo: excluded from DTO and compact DOM summary

Local verification:
- Frontend RED first: precommit metadata compact-dashboard test failed before implementation.
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_record.py -k 'tmp_root_write_smoke or manual_operator_receipt or replay_idempotency_metadata or mac_relay_precommit_metadata' -o 'addopts=' -q`
  - result: `10 passed, 83 deselected`
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t 'Mac relay tmp-root write smoke|manual operator receipt|compact dashboard|replay/idempotency metadata|Mac relay precommit metadata'`
  - result: `8 passed, 169 skipped`
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
  - result: passed
- `git diff --check`
  - result: passed
- production-source leak scan for raw path/secret/body markers
  - result: no production matches
- `cd web && npm run build`
  - result: passed; only the known large Vite chunk warning appeared

VPS deployment / smoke:
- Both VPS worktrees reset to the code commit.
- `hermes_cli/web_dist/` rsynced to both VPS worktrees.
- `hermes-agent-dashboard.service`: active after restart.
- `hermes-vps-core-dashboard.service`: active after restart.
- `hermes-gateway.service`: active; gateway was not restarted.
- Protected API smoke:
  - unauthenticated precommit metadata GET returned `401`
  - source replay metadata GET found=true
  - precommit metadata POST stored=true
  - duplicate precommit metadata POST idempotency_replayed=true
  - duplicate precommit metadata write skipped=true
  - precommit metadata GET found=true and record_count=2
  - precommit metadata ready=true
  - source replay/idempotency metadata verified=true
  - duplicate-skip source verified=true
  - write_readiness_percent=90
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
- Hydrated DOM smoke:
  - compact dashboard hook found=true
  - precommit metadata ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest boundary label: Mac relay precommit metadata
  - scoped controls/forms/inputs=0
  - raw leak=false
  - browser console JS errors=0

Next safe boundary:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`

Do not cross without exact later approval:
- real NAS production write
- VPS direct NAS authority
- durable queue/watcher/cron/dispatcher/authority-adapter activation
- gateway restart
- public exposure
- raw markdown/path/secret echo
