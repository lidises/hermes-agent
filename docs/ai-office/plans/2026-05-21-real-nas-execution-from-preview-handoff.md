# AI Office NAS Keeper real NAS execution-from-preview handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raised the NAS Keeper/Mac relay boundary from isolated temp-root execution to a bounded real Mac-local NAS execution-from-preview smoke against an existing writable safe vault.

## Safety boundary

Allowed in this slice:

- Temporary local handoff queue only.
- Existing writable safe vault only.
- One create and one replace to the same harmless safe logical note.
- Readback, rollback-before-replace, audit sidecar, final SHA-256, and raw-leak verification.

Explicitly not allowed / not done:

- Durable production NAS Keeper queue mutation.
- Direct VPS NAS write/authority/mount/credentials.
- Watcher/cron/daemon activation.
- Relay daemon dispatch.
- Authority-adapter binding.
- Kanban mutation.
- Public exposure changes.
- Dashboard/gateway restart.
- Raw NAS root/path, queued markdown body, credentials, providers, tokens, or executable command projection.

## Live recheck before mutation

Local:

- branch: `main`
- local HEAD before slice: `39e909b3`
- local git clean before docs changes
- Mac-local real relay root availability: true
- existing safe vault availability: true

VPS read-only precheck:

- dashboard HEAD: `39e909b3`
- dashboard dirty count: 0
- agent HEAD: `39e909b32`
- agent dirty count: 0
- dashboard service: active
- gateway service: active

## Real NAS smoke

Safe logical target:

- `Hermes::ai-office-real-nas-exec-preview-smoke-20260521011553.md`

The real NAS root path, temporary queue path, and queued markdown bodies were intentionally omitted from docs and final report.

Run 1 — create:

- queued=true
- authorized=true
- previewed=true
- executed=true
- written=true
- queue_unchanged_by_execute=true
- readback_verified=true
- audit_written=true
- rollback_created=false
- markdown_body_included=false
- mac_relay_write_enabled=true
- actual_nas_write_enabled=true
- direct_vps_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- readback SHA-256: `9b3154071dd6facf2272b70f4f9c4a021e1dc9a96c8e843942de7a8fb33b550b`

Run 2 — replace same logical target:

- queued=true
- authorized=true
- previewed=true
- executed=true
- written=true
- queue_unchanged_by_execute=true
- readback_verified=true
- audit_written=true
- rollback_created=true
- rollback_ref=`rollback_write_realnas_20260521011553_2`
- rollback_verified=true
- rollback SHA-256: `9b3154071dd6facf2272b70f4f9c4a021e1dc9a96c8e843942de7a8fb33b550b`
- markdown_body_included=false
- mac_relay_write_enabled=true
- actual_nas_write_enabled=true
- direct_vps_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- final readback SHA-256: `d6033cd13e7efca67fa9c95ff01b5e5a23b3e6ff620d2dc6b5e1aaf068bdf7e5`

Final verification:

- final readback SHA-256 matched expected replacement-body SHA-256.
- rollback SHA-256 matched the initial create-body SHA-256.
- raw leak probe=false for markdown body, real root path, temp queue path, `/Users/`, `/home/hermes`, token-like, and credential-like sentinels.
- temporary handoff queue was removed after evidence capture.

## Regression checks

Passed:

- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_from_preview.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_payload_preview.py tests/hermes_cli/test_office_controlled_mutation_nas_mac_relay_write_execute.py tests/hermes_cli/test_office_controlled_mutation_nas_runtime_write.py -q -o 'addopts='`
  - 22 passed
- `git diff --check`
- added-line docs safety scan: PASS

## Result

No code changes were required. Existing execution-from-preview bridge behaved correctly for a bounded real Mac-local NAS create+replace smoke through a temporary queue.

## Next recommended rung

Next safe rung, if explicitly approved, is durable-production-queue rehearsal/readback design only: create/authorize/read back one durable local-profile queue item without execution/write automation, then prove execution lanes remain closed. This is still not watcher/cron/dispatch automation, authority-adapter binding, Kanban mutation, direct VPS NAS authority, public exposure, or service restart.

Last updated: 2026-05-21 10:16 KST
