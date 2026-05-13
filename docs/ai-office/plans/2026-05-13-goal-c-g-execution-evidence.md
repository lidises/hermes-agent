# Goal C-G execution evidence — projection dry-run API, promote, Kanban checkpoint, watcher dry-run

Timestamp: 2026-05-13 15:49 KST

## Approved concrete task list

User approved C-G buckets after A+B docs-only sync. The concrete continuation executed in this order:

1. C — protected/private projection ingest dry-run API/helper.
2. D — promote a validator-passing safe bundle with rollback/archive evidence.
3. F — write only an explicitly derived canonical VPS `ai-office` Kanban checkpoint.
4. G — prepare disabled-by-default, dry-run-only watcher automation with rollback/disable posture and secret-free output.

E was not needed in this pass because gateway/core checkout sync was not required for these dashboard/projection tasks. `hermes-gateway.service` was not restarted.

## C — protected projection ingest dry-run API

Commit pushed before deploy:

- `bfe9c8f0 feat(office): add projection ingest dry-run API`

Code/test changes:

- `hermes_cli/web_server.py`
  - Added protected POST `/api/office/projection/ingest-dry-run`.
  - It resolves only safe incoming bundle names under `HERMES_HOME/office/projections/incoming`.
  - It calls `ingest_office_projection_bundle(..., dry_run=True)` only.
  - It rejects path traversal and unsupported bundle names with constant non-echoing error text.
- `tests/hermes_cli/test_office_api.py`
  - Added auth, non-mutation, and path-traversal tests.

Local verification:

- RED observed first: new dry-run API tests returned HTTP 405 before implementation.
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_projection_cache.py -q -o 'addopts='` passed: 16 passed.
- `cd web && npm run build` passed with existing Vite large-chunk warning only.
- `cd web && npm run lint` exited 0 with pre-existing warnings outside touched files.
- `git diff --check` passed.

VPS dashboard deployment:

- Dedicated dashboard worktree `/home/hermes/.hermes/ai-office-dashboard` moved from `3b4d695f` to `bfe9c8f0`.
- Focused VPS tests passed: 16 passed.
- VPS `web` build passed with existing Vite large-chunk warning only.
- Restarted only `hermes-agent-dashboard.service` because backend route code changed.
- `hermes-gateway.service` stayed active and was not restarted.
- Listener stayed private/Tailscale-only at `100.122.57.85:8765`.

Private browser/API smoke:

- URL: `http://100.122.57.85:8765/office?dryrunapi=bfe9c8f0`
- Page title: `Hermes Agent - Dashboard`.
- Console messages: 0; JS errors: 0.
- Auth probe: unauthenticated POST returned 401.
- Valid safe bundle dry-run POST returned 200 with `status=would_promote`, `dry_run=true`, `action=projection_ingest_promote`, and safe gates only.
- Path traversal probe returned 400 with constant `Unsupported office projection bundle`; it did not echo the submitted value.

## D — validator-passing safe-bundle promote

Bundle:

- `pcwb-vps-smoke-001`
- Already present in VPS incoming/active cache from the prior manual projection ingest track.
- Validation/dry-run posture remained safe: raw source/NAS material was not read by the VPS.

Execution evidence:

- Before promote: `read_office_projection_cache(root)` reported `status=active`, `active.bundle_id=pcwb-vps-smoke-001`, `rejected.count=0`.
- Dry run: `ingest_office_projection_bundle(bundle, root=root, dry_run=True)` returned `status=would_promote`, `ok=true`, `dry_run=true`, gates `validator_pass`, `safe_metadata_only`, `active_cache_atomic`, `rollback_archive`.
- Non-dry-run promote: `ingest_office_projection_bundle(bundle, root=root)` returned `status=promoted`, `ok=true`.
- After promote: cache still reported `status=active`, `active.bundle_id=pcwb-vps-smoke-001`, `rejected.count=0`.
- Rollback/archive evidence: archive contained `20260513T064603Z__pcwb-vps-smoke-001`.

Safety posture:

- No NAS mount, direct NAS credentials, or VPS direct raw-source read.
- No public exposure change.
- No gateway/core checkout sync.
- No gateway restart.

## F — canonical VPS Kanban checkpoint

Canonical board: VPS `ai-office`.

Created and completed checkpoint task:

- Task id: `t_bd4fe848`
- Title: `status: goal C-G projection mutation checkpoint`
- Assignee: `ai-office-orchestrator`
- Tenant: `ai-office`
- Status: `done`
- Metadata summary: C dry-run API deployed/smoked; D safe bundle promoted with archive rollback evidence; G disabled dry-run watcher design/script pending commit; no public/NAS/gateway mutation.

The Kanban write was limited to derived status only. It did not include secrets, raw prompts/transcripts, task bodies, numeric Telegram topic ids, NAS credentials, or raw source content.

## G — disabled/dry-run watcher automation

Prepared script:

- `scripts/ai_office/office_projection_watchdog.py`

Behavior:

- Disabled by default; without `--enabled`, it reports `status=disabled` and performs no dry-run scan results.
- With `--enabled`, it scans only safe-named bundle directories in `HERMES_HOME/office/projections/incoming` and runs `ingest_office_projection_bundle(..., dry_run=True)`.
- It never promotes, archives, rejects, deletes, transfers, reads NAS/raw material, or emits absolute projection paths.
- Output is compact JSON with allowlisted fields only: status, dry-run mode, active bundle id, incoming count, result status/gates/error categories.
- Disable path: do not pass `--enabled`, remove or pause any future cron job, or remove the script from the scheduled command.
- Rollback path: revert the repo commit containing the script/tests; no runtime daemon is left running.

Tests:

- `tests/scripts/test_office_projection_watchdog.py`
  - disabled-by-default/no active mutation,
  - explicit enabled mode remains dry-run-only,
  - unsafe incoming names are omitted from output.

Verification:

- `.venv/bin/python -m pytest tests/scripts/test_office_projection_watchdog.py tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_projection_cache.py -q -o 'addopts='` passed: 19 passed.
- `HERMES_HOME=$(mktemp -d) .venv/bin/python scripts/ai_office/office_projection_watchdog.py` returned disabled JSON.
- `HERMES_HOME=$(mktemp -d) .venv/bin/python scripts/ai_office/office_projection_watchdog.py --enabled` returned dry-run checked JSON with no incoming bundles.

No cron job was enabled in this pass. This leaves G at a safe disabled/dry-run automation design + script baseline.

## Final safety/non-actions

Not performed:

- Public exposure changes.
- VPS NAS mount, direct NAS credentials, or VPS direct NAS/raw source reads.
- Gateway/core checkout sync.
- `hermes-gateway.service` restart.
- PR mark-ready/merge.
- Active watcher/cron enablement.
- Non-safe bundle promotion.
- Dashboard mutation controls beyond protected dry-run endpoint.

Pending after this evidence commit:

- Commit/push this evidence plus G script/tests and NEXT/STATUS updates.
- Fast-forward VPS dashboard worktree to the final commit for code/docs availability.
- Run final focused tests/script check and private `/office` smoke.
