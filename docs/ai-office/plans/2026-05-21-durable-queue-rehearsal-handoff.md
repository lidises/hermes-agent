# AI Office NAS Keeper durable queue rehearsal/readback handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raised the NAS Keeper/Mac relay boundary from temporary-queue real-NAS execution smoke to durable local-profile production queue rehearsal/readback only.

## Safety boundary

Allowed in this slice:

- Append exactly one durable local-profile NAS Keeper handoff queue item.
- Authorize that item for Mac relay execution review.
- Preview the execution payload only.
- Render/read back the durable queue item in `/office` and verify guarded execution remains disabled until explicit one-shot approval.
- Verify the intended real NAS target does not exist after rehearsal.

Explicitly not allowed / not done:

- Execution-from-preview from the durable queue.
- Real NAS write from this durable queue item.
- Watcher/cron/daemon activation.
- Relay daemon dispatch.
- Authority-adapter binding.
- Direct VPS NAS write/authority/mount/credentials.
- Kanban mutation.
- Public exposure changes.
- Dashboard/gateway restart.
- Raw NAS path, queued markdown body, credentials, provider values, token-like values, or executable command projection.

## Live recheck before mutation

Local:

- branch: `main`
- local HEAD before slice: `6a80f358`
- local git clean before durable queue append
- durable queue existed before rehearsal: true
- durable queue line count before rehearsal: 3

VPS read-only precheck:

- dashboard HEAD: `6a80f358`
- dashboard dirty count: 0
- agent HEAD: `6a80f358f`
- agent dirty count: 0
- dashboard service: active
- gateway service: active

## Durable queue rehearsal

Safe logical target:

- `Hermes::ai-office-durable-queue-rehearsal-20260521012551.md`

Safe refs:

- handoff_ref: `handoff_durablequeue_20260521012551`
- relay_execution_ref: `relay_exec_durablequeue_20260521012551`

Results:

- queued=true
- authorized=true
- previewed=true
- queue_status_after_authorize=`authorized_for_mac_relay_execution`
- durable queue line count after rehearsal: 4
- durable queue line delta: 1
- filtered readback count: 1
- filtered readback status: `authorized_for_mac_relay_execution`
- readback markdown_body_included=false
- preview markdown_body_included=false
- markdown_body_sha256=`c8ba5c72b30e82ab36f41f2167b9d6935c655fbb33b74830e7c601682a7b63a4`
- expected SHA-256 matched preview SHA-256
- actual_nas_write_enabled=false
- mac_relay_write_enabled=false
- dispatch_enabled=false
- watcher_enabled=false
- cron_enabled=false
- target_exists_after_rehearsal=false
- raw leak probe=false

## Local `/office` browser smoke

Source dashboard:

- `127.0.0.1:9135`

DOM evidence:

- durable queue item visible=true
- authorized status visible=true
- approval checkbox unchecked=true
- guarded execute button disabled=true
- raw leak=false
- console JS errors=0

Note: the broader `/office` page has pre-existing RPG map buttons and an enabled separate state-recording button. The guarded execute button for this item was specifically disabled because one-shot execution approval was unchecked.

## Regression checks

Passed with `HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT` unset:

- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_handoff_queue.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_authorize_handoff.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_queue_readback.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_payload_preview.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_claim_dry_run.py -q -o 'addopts='`
  - 16 passed
- `git diff --check`
- expected safe logical target existence check: false

## Result

The durable local-profile queue now contains one new authorized rehearsal item. It is visible/readable and previewable, but it has not been executed and did not create the intended real NAS target.

## Next recommended rung

Next safe rung, if explicitly approved, is one-shot guarded `/office` execution of exactly this existing durable item, then safe execution-state recording. This is still not watcher/cron/dispatch automation, authority-adapter binding, Kanban mutation, direct VPS NAS authority, public exposure, or service restart.

Last updated: 2026-05-21 10:27 KST
