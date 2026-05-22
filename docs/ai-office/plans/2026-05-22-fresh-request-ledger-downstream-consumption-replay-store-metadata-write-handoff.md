# Fresh request ledger downstream consumption replay-store metadata write handoff

Updated: 2026-05-22 14:36 KST

## Result

Completed `fresh_request_builder_downstream_consumption_one_shot_replay_store_metadata_write`.

- Code commit: `c94608e1 feat(office): record replay-store metadata boundary`.
- VPS dashboard/core worktrees synced to code commit.
- `web_dist` rsynced to the VPS dashboard worktree after local build.
- Dashboard restarted only: `hermes-agent-dashboard.service` stayed active after restart.
- Gateway stayed active and was not restarted: `hermes-gateway.service` active.

## What changed

Backend:

- Added bounded replay-store metadata record helpers:
  - `append_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_record(...)`
  - `list_office_controlled_mutation_nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_store_metadata_records(...)`
- Added protected routes:
  - `GET /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-metadata-records`
  - `POST /api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-metadata-records`
- Record validation is limited to safe refs, SHA-256 chain fields, safe timestamps/status strings, and opaque evidence refs.
- Stored/readback DTOs keep actual downstream consumption, real replay-store writes, automation, dispatcher/authority adapter, and VPS NAS authority disabled.

Frontend:

- Added API client type/function for replay-store metadata readback.
- Added `NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataPanel`.
- Added live placement after the replay-store write contract panel.
- DOM hook:
  - `data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata="true"`

Tests:

- Added `tests/hermes_cli/test_office_controlled_mutation_nas_keeper_downstream_consumption_replay_store_metadata.py`.
- Extended `web/src/pages/OfficePage.rpg.test.tsx` with a metadata-only/no-controls/no-real-replay regression.

## Verification

- RED observed before implementation:
  - backend import/API tests failed on missing metadata helpers/route;
  - frontend component test failed before panel/export/API client wiring.
- `py_compile` for touched backend modules passed.
- Focused Python chain tests: 18 passed (`boundary_design`, `exact_approval`, `execution_gate`, `noop_replay_probe`, `replay_store_contract`, `replay_store_metadata`).
- Focused Office web test subset: 8 passed.
- `npm run lint` passed with existing warnings only.
- `npm run build` passed with existing Vite large chunk warning only.
- `git diff --check` passed.
- Added-line secret sentinel passed.
- `web_dist` relative content hash after local build/deploy: `8627bcde1ea0c390337c4ddad4aa3e3225d4b053ec70ea748ba7fb1b0912710b`.

## VPS live smoke

Protected API returned:

- unauthenticated GET returned 401.
- authenticated GET returned status 200.
- `found=true`.
- `record_count=1` for the live safe metadata record smoke.
- `replay_store_metadata_recorded=true`.
- `downstream_consumption_enabled=false`.
- `downstream_consumed=false`.
- `actual_downstream_consumption_allowed=false`.
- `replay_store_write_enabled=true` for this metadata-only record boundary.
- `real_replay_store_written=false`.
- watcher/cron/dispatch/authority-adapter false.
- `vps_nas_mount_enabled=false`.

DOM/browser smoke returned:

- panel present true.
- recorded true.
- downstream consumption enabled false.
- replay-store write true for metadata-only boundary.
- real replay store written false.
- automation enabled false.
- VPS NAS authority false.
- controls 0.
- raw/secret leak false.
- console JS errors 0.

## Boundaries preserved

- No actual downstream consumption.
- No real replay-store write for consumption execution; only bounded safe metadata record append.
- No markdown body/write payload/raw root path/credential value exposure.
- No watcher/cron/daemon activation.
- No dispatcher binding.
- No authority-adapter binding.
- No gateway restart.
- No public exposure change.
- No VPS NAS mount/write/credential authority.

## Next recommended rung

`fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback`:

- add a read-only terminal boundary proving that, even after metadata-only replay-store recording, actual downstream consumption remains disabled;
- read only safe refs/hashes/status booleans from the metadata chain;
- do not execute downstream consumption;
- do not write markdown/body payloads;
- do not enable watcher/cron/dispatcher/authority-adapter/VPS NAS authority;
- do not restart gateway.

## Suggested starter prompt

Continue from local/origin clean state after docs sync. Start `fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback` as the next bounded read-only rung after the replay-store metadata write. Follow TDD: RED backend/API/UI tests, implement safe readback only, verify, commit/push, VPS dashboard-only sync/restart/smoke, docs handoff commit/push, and VPS docs-only sync/smoke. Do not execute actual downstream consumption, write markdown/body payloads, or enable watcher/cron/dispatcher/authority-adapter/VPS NAS authority.
