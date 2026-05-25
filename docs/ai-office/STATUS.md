## Current status — Mac relay precommit manifest compact dashboard deployed (2026-05-25T14:55Z)

Current deployed baseline:
- Branch: `main`
- Code commit: `6a87edf0e Surface NAS Keeper precommit manifest summary`
- Local and origin are synced for the code commit.
- VPS core checkout and dashboard checkout are synced to the code commit.
- Dashboard assets were rebuilt locally and rsynced to both VPS checkouts.
- `hermes-agent-dashboard.service` and `hermes-vps-core-dashboard.service` were restarted and are active.
- Gateway service was not restarted.

Implemented rung:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency`

Changes:
- Promoted Mac relay precommit manifest to the compact `/office` controlled-mutation summary above precommit metadata.
- Added compact DOM hooks for precommit manifest readiness, source verification, replay-store-write closure, real-write closure, VPS-authority closure, runtime closure, and payload-echo closure.
- Exercised the protected precommit manifest API live on the VPS as a metadata-only record write sourced from the current precommit metadata.
- Preserved the compact dashboard posture: latest boundary only, heavy historical ladder collapsed out of default DOM, no controls/forms/inputs.

Boundaries preserved:
- real NAS production write: not enabled and not executed
- VPS direct NAS authority / VPS NAS mount: not enabled
- watcher / cron / dispatch / authority adapter / public exposure: not enabled
- gateway restart: not performed
- replay-store execution write: not enabled
- raw markdown / write_payload / raw path / secret echo: excluded from DTO and compact DOM summary

Local verification:
- Frontend RED first: precommit manifest compact-dashboard test failed before implementation.
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_actual_execution_record.py -k 'tmp_root_write_smoke or manual_operator_receipt or replay_idempotency_metadata or mac_relay_precommit_metadata or mac_relay_precommit_manifest' -o 'addopts=' -q`
  - result: `12 passed, 81 deselected`
- `cd web && npm test -- --run src/pages/OfficePage.rpg.test.tsx -t 'Mac relay tmp-root write smoke|manual operator receipt|compact dashboard|replay/idempotency metadata|Mac relay precommit metadata|Mac relay precommit manifest'`
  - result: `10 passed, 168 skipped`
- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
  - result: passed
- `git diff --check`
  - result: passed
- production-source leak scan for raw path/secret/body markers
  - result: passed
- `cd web && npm run build`
  - result: passed; only the known large Vite chunk warning appeared
- `cd web && npm run lint -- src/pages/OfficePage.tsx`
  - result: exit 0; existing warnings only, no errors

VPS deployment / smoke:
- Both VPS worktrees reset to the code commit.
- `hermes_cli/web_dist/` rsynced to both VPS worktrees.
- Dashboard and core status pages returned HTTP 200 after restart.
- Protected API smoke:
  - unauthenticated precommit manifest GET returned `401`
  - protected precommit manifest POST returned HTTP 200
  - stored=true
  - precommit manifest GET returned HTTP 200
  - record_count=2 after live smoke write
  - manifest ready=true
  - source precommit metadata verified=true
  - write_readiness_percent=94
  - next boundary: `fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - latest readback matched the just-recorded metadata-only manifest
- Hydrated DOM smoke on `/office`:
  - compact dashboard hook found=true
  - precommit manifest ready=true
  - source verified=true
  - replay-store write=false
  - real-write=false
  - VPS-authority=false
  - runtime-open=false
  - payload-echo=false
  - write-readiness displayed as 94%
  - latest boundary label: Mac relay precommit manifest
  - scoped controls/forms/inputs=0
  - heavy archive DOM rendered=false
  - browser console JS errors=0

Next safe boundary:
`fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest`

Do not cross without exact later approval:
- real NAS production write
- VPS direct NAS authority
- durable queue/watcher/cron/dispatcher/authority-adapter activation
- gateway restart
- public exposure
- raw markdown/path/secret echo
