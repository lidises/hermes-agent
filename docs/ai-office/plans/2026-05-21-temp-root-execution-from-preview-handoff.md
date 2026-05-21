# AI Office NAS Keeper temp-root execution-from-preview handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raised the NAS Keeper/Mac relay boundary from authorization + execution-payload preview to actual Mac-local execution-from-preview against an isolated temporary safe root only.

## Safety boundary

Allowed in this slice:

- Temporary local handoff queue only.
- Isolated temporary Mac relay safe root only.
- One create and one replace to the same safe logical target.
- Readback, rollback-before-replace, and audit sidecar verification.

Explicitly not allowed / not done:

- Real NAS root write.
- Durable production NAS Keeper queue mutation.
- Direct VPS NAS write/authority/mount/credentials.
- Watcher/cron/daemon activation.
- Relay daemon dispatch.
- Authority-adapter binding.
- Kanban mutation.
- Public exposure changes.
- Gateway restart.
- Raw markdown body, temp/root path, filesystem path, credential, provider, or executable command projection.

## Live recheck before mutation

Local:

- branch: `main`
- local HEAD before slice: `2e92c380`
- local git clean before docs changes

VPS read-only precheck:

- dashboard HEAD: `2e92c380`
- dashboard dirty count: 0
- agent HEAD: `2e92c3800`
- agent dirty count: 0
- dashboard service: active
- gateway service: active

## Temp-root smoke

Safe logical target:

- `vault_temp_relay_smoke::temp-root-execution-smoke.md`

The temporary root path and queued markdown bodies were intentionally omitted from docs and final report.

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
- direct_vps_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- readback SHA-256: `797801a176f72f0b3329c89ba5d6766130bb85f478f6a12d680a294f1046fd6e`

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
- rollback_ref=`rollback_write_20260521_temp_root_2`
- markdown_body_included=false
- direct_vps_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- final readback SHA-256: `51ef74788bf573c16a9d10900417b0dd86acb17e80168be96932592345aae32c`

Final verification:

- final readback SHA-256 matched expected replacement-body SHA-256.
- raw leak probe=false for markdown body, temp/root path, `/Users/`, `/home/hermes`, token-like, and credential-like sentinels.
- temporary smoke root was removed after evidence capture.

## Regression checks

Passed:

- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_from_preview.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_payload_preview.py tests/hermes_cli/test_office_controlled_mutation_nas_mac_relay_write_execute.py tests/hermes_cli/test_office_controlled_mutation_nas_runtime_write.py -q -o 'addopts='`
  - 22 passed
- `git diff --check`
- added-line docs safety scan: PASS

## Result

No code changes were required. Existing execution-from-preview bridge behaved correctly for an isolated temp-root create+replace smoke.

## Next recommended rung

Next safe rung, if explicitly approved, is a bounded real Mac-local NAS execution-from-preview smoke against an existing writable safe vault, still using a temporary handoff queue and still keeping direct VPS NAS authority, durable production queue execution, watcher/cron, public exposure, relay daemon dispatch, authority-adapter binding, Kanban mutation, and gateway restart closed.

Last updated: 2026-05-21 10:01 KST
