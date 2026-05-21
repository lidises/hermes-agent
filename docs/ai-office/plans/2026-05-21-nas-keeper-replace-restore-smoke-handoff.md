# AI Office NAS Keeper replace/restore smoke — 2026-05-21

## Scope

User approved continuing with bounded write authority after the successful previewed-payload Mac relay execution.

This pass exercised the existing NAS Keeper -> Mac relay execution-from-preview path against one known safe logical note by replacing it once, verifying readback/rollback/audit evidence, restoring the exact original body, and verifying the final hash returned to the original.

## Safe target

- safe_logical_target: `Hermes::controlled-mutation-durable-exec-20260521-014337.md`
- safe_display_target: `Hermes / controlled-mutation-durable-exec-20260521-014337.md`

No raw filesystem path is recorded in this handoff.

## Boundary

Allowed in this pass:

- Mac-local relay writes through the already implemented execution-from-preview helper.
- Isolated temporary local handoff queue for the smoke.
- One replacement write and one restore write.
- Execution-state recording after each successful write/readback.
- Safe hash/readback/rollback/audit evidence.
- Docs update, commit/push, and VPS docs-only sync.

Still not done / still closed:

- Durable production queue mutation for the replace/restore smoke.
- Watcher/cron/daemon activation.
- Relay daemon dispatch loop.
- Authority-adapter binding.
- Direct VPS NAS authority, mount, credentials, or write.
- Public exposure changes.
- Dashboard or gateway restart.
- Raw markdown body/path/token/provider projection.

## Precheck

- local HEAD/origin before pass: `d7d8e27d5e42e8e36bdc49a747a9dffd680fbbb7`
- local git clean before pass
- original target exists: true
- original bytes: 110
- original SHA-256: `b18ffa51d2a35f215c1c336efec875fc87b89a7917da4b1132ec4f9982930924`
- original hash matched the prior execution handoff expected hash: true

## Execution note

A first replacement attempt used an incorrect safe vault ref and failed closed with safe error `write_target_unavailable` before any replacement was committed. The target remained/restored to the original hash before the successful smoke was run with the correct safe logical vault ref.

## Temporary queue

- queue_dir_ref: `temp-local-queue::replace-restore-20260521-021531`
- durable production queue used for smoke: false
- queue_count: 2
- queue_statuses:
  - `mac_relay_execution_succeeded`
  - `mac_relay_execution_succeeded`
- markdown_body_included_in_queue_readback: false

## Replacement write

Refs:

- handoff_ref: `handoff-replace-smoke-20260521-021531`
- relay_request_ref: `relayreq-replace-smoke-20260521-021531`
- write_ref: `write-replace-smoke-20260521-021531`
- package_ref: `pkg-replace-smoke-20260521-021531`
- authorization_ref: `auth-replace-smoke-20260521-021531`
- relay_execution_ref: `relayexec-replace-smoke-20260521-021531`
- execution_record_ref: `exec-record-replace-smoke-20260521-021531`

Result:

- queued=true
- authorized=true
- previewed=true
- executed=true
- written=true
- recorded=true
- queue_status_before=`authorized_for_mac_relay_execution`
- queue_status_after=`mac_relay_execution_succeeded`
- markdown_body_included=false
- replacement_sha256=`ea925b6f29be816956c3816e9b997b1b5ae37c8f79459a8b728e437b29f2bca7`
- readback_sha256=`ea925b6f29be816956c3816e9b997b1b5ae37c8f79459a8b728e437b29f2bca7`
- readback_verified=true
- rollback_created=true
- rollback_ref=`rollback_write-replace-smoke-20260521-021531`
- audit_written=true
- audit_ref=`audit_write-replace-smoke-20260521-021531`

## Restore write

Refs:

- handoff_ref: `handoff-restore-smoke-20260521-021531`
- relay_request_ref: `relayreq-restore-smoke-20260521-021531`
- write_ref: `write-restore-smoke-20260521-021531`
- package_ref: `pkg-restore-smoke-20260521-021531`
- authorization_ref: `auth-restore-smoke-20260521-021531`
- relay_execution_ref: `relayexec-restore-smoke-20260521-021531`
- execution_record_ref: `exec-record-restore-smoke-20260521-021531`

Result:

- queued=true
- authorized=true
- previewed=true
- executed=true
- written=true
- recorded=true
- queue_status_before=`authorized_for_mac_relay_execution`
- queue_status_after=`mac_relay_execution_succeeded`
- markdown_body_included=false
- restore/readback SHA-256=`b18ffa51d2a35f215c1c336efec875fc87b89a7917da4b1132ec4f9982930924`
- readback_verified=true
- rollback_created=true
- rollback_ref=`rollback_write-restore-smoke-20260521-021531`
- audit_written=true
- audit_ref=`audit_write-restore-smoke-20260521-021531`

## Final readback

- final bytes: 110
- final SHA-256: `b18ffa51d2a35f215c1c336efec875fc87b89a7917da4b1132ec4f9982930924`
- restored_matches_original=true

## Capability flags during successful writes

Enabled only inside the Mac-local helper execution boundary:

- mac_relay_write_enabled=true
- actual_nas_write_enabled=true
- queue_mutation_enabled=true for the temporary local queue
- execution_state_recording_enabled=true for the temporary local queue

Closed:

- direct_vps_nas_write_enabled=false
- watcher_enabled=false
- cron_enabled=false
- dispatch_enabled=false
- authority_adapter_binding_enabled=false

## Verification

- target final hash readback matched original.
- temporary queue readback showed two terminal succeeded items.
- safe DTO/readback leak scan passed: no raw local/VPS paths, token/secret sentinels, raw command sentinels, or markdown projection sentinels.
- `PYTHONPATH=. .venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` passed.
- Focused pytest passed: 17 passed.
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_from_preview.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_state_record.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_mac_relay_write_execute.py`
  - `tests/hermes_cli/test_office_controlled_mutation_nas_mac_relay_write_request.py`
- `git diff --check` passed.

## Result

The bounded replace/restore smoke completed successfully. The known safe NAS note returned to its original body hash after the replacement and restore writes.

## Next recommended rung

This particular write-chain goal is effectively complete through manual bounded NAS write, rollback/readback/audit, and restore verification.

If continuing to raise risk later, the next separate design gate should not be an automatic watcher yet. Prefer a read-only operational readiness report for whether any future watcher/cron/daemon activation is justified, including exact trigger, idempotency, rollback, audit, dispatch boundary, and kill switch. Keep watcher/cron/daemon activation, direct VPS NAS authority, public exposure, gateway restart, and generalized dispatch disabled unless explicitly approved as a new security-sensitive phase.

Last updated: 2026-05-21 11:15 KST
