# Fresh request ledger downstream consumption one-shot execution gate handoff

Updated: 2026-05-22 13:01 KST

## Scope completed

Completed rung: `fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_gate`.

This rung opens only a bounded metadata-only execution-gate record/readback boundary. It does not execute downstream consumption and does not grant runtime/dispatcher/NAS authority.

## Commits

- Code commit: `ba15f7a4 feat(office): gate downstream consumption execution`
- Previous docs/current base before this handoff: `096c997e docs(office): hand off downstream consumption actual preflight`

## Protected APIs

Added:

- `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates`
- `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates`

Both are protected Office API routes. Unauthenticated write is rejected in focused tests.

## Backend helpers

Added:

- `append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_record(...)`
- `list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_gate_records(...)`

The append helper requires:

- latest actual-consumption preflight readiness
- matching exact approval ref
- matching exact approval record SHA-256
- matching boundary design SHA-256
- `selection_profile=latest_written`
- safe execution-gate ref shape

The record stores only safe refs, SHA-256 hashes, booleans, safe timestamps/status strings, and safe evidence refs.

## UI

Added display-only panel:

- `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGatePanel`

DOM hook:

- `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-gate="true"`

The panel has no buttons/forms/inputs/selects/textareas and displays only safe readback metadata.

## Live bounded write/readback smoke

Protected POST created the metadata-only execution-gate record:

- `execution_gate_ref=executiongate-20260522130500-ba15f7a4`
- `stored=true`
- execution gate record SHA length 64

Protected GET readback:

- `found=true`
- `record_count=1`
- `latestRef=executiongate-20260522130500-ba15f7a4`
- `execution_gate_opened=true`
- `actual_consumption_preflight_verified=true`
- `exact_approval_record_verified=true`
- `safe_ref_chain_verified=true`
- `downstream_consumption_enabled=false`
- `downstream_consumed=false`
- `actual_downstream_consumption_allowed=false`
- `replay_store_write_enabled=false`
- `dispatch_enabled=false`
- `vps_nas_mount_enabled=false`

DOM smoke:

- panel found true
- gate opened true
- downstream consumption enabled false
- replay-store write false
- automation false
- VPS NAS authority false
- scoped controls 0
- raw/secret leak false
- console JS errors 0

## Verification

Local verification before code commit:

- `python3 -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` passed.
- Focused Python tests: 6 passed (`actual_preflight` + `execution_gate`).
- Focused Office web tests: 124 passed.
- `npm run lint` passed with existing warnings only.
- `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- added-line leak sentinel: hits 0.

`web_dist` relative content hash:

- `64fb453310885cc4df1880e2c50ae66b16fed2a29baa22cadaf3bcd0ae3a939b`

## Deployment

- VPS dashboard worktree synced to `ba15f7a4ec87fed9daf6e64f982bfd01ef304f15`.
- VPS core worktree synced to `ba15f7a4ec87fed9daf6e64f982bfd01ef304f15` using the `lidises` remote.
- `web_dist` rsynced to both VPS worktrees.
- Dashboard restarted only.
- Gateway was not restarted. Gateway process remains present as PID `519592`; the user systemd unit name is not present on this VPS runtime, so status should be checked by process unless the unit is restored.
- Private `/office` readiness smoke returned 200.

## Boundaries preserved

Still false/not done:

- actual downstream consumption
- downstream consumed
- replay-store write for consumption execution
- watcher/cron/daemon activation
- dispatcher binding
- authority-adapter binding
- VPS NAS mount/write/credential authority
- public exposure change
- gateway restart
- markdown body/write payload/raw root path/credential exposure

## Next recommended rung

`fresh_request_builder_downstream_consumption_one_shot_noop_replay_probe`

Suggested scope:

- Add a bounded noop/idempotency replay probe record/readback over the execution-gate record.
- Verify safe replay-key/idempotency metadata only.
- Keep actual downstream consumption disabled.
- Do not write real replay-store execution state yet unless the rung explicitly defines the safe noop record lane.
- Do not bind dispatcher/authority adapter, enable watcher/cron, restart gateway, change public exposure, or grant VPS NAS authority.
