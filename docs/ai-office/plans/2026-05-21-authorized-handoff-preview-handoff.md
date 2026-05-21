# AI Office NAS Keeper authorized handoff + execution payload preview handoff — 2026-05-21

## Scope

User approved continuing the recommended controlled-mutation path with bounded writes and slightly stronger authority.

This slice raised risk exactly one rung after NAS Keeper handoff queue marker:

- authorize one queued NAS Keeper/Mac relay handoff metadata record;
- preview the Mac relay execution payload with `markdown_body_included=false`;
- verify protected API auth gating and safe DTO boundaries locally and on the private VPS dashboard.

## Safety boundary

Allowed in this slice:

- Queue authorization metadata write/readback only.
- Execution payload preview only.
- Markdown body may be read internally for SHA-256 and byte count only, but must not appear in API/browser DTOs.

Explicitly not allowed / not done:

- Mac relay write.
- Actual NAS write / real NAS execution.
- Direct VPS NAS write/authority/mount/credentials.
- Queue execution-state mutation.
- Watcher/cron/daemon activation.
- Rollback execution.
- Real dispatch.
- Gateway restart.
- Public exposure changes.
- Raw markdown body, NAS path, provider, filesystem path, credential, or executable command projection.

## Contract verification

Focused tests passed:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_keeper_authorize_handoff.py tests/hermes_cli/test_office_controlled_mutation_nas_keeper_execution_payload_preview.py -q -o 'addopts='`
  - 6 passed
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py`
- `cd web && npm test -- --run src/lib/api.test.ts`
  - 44 passed

## Local smoke

Source-launched temp dashboard:

- `127.0.0.1:9134`

Protected API smoke:

- seeded one safe queued handoff using local helper under the same `HERMES_HOME`.
- POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize`:
  - unauthenticated: 401
  - authenticated: `authorized=true`
  - `queue_status_after=authorized_for_mac_relay_execution`
- POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-payload-preview`:
  - unauthenticated: 401
  - authenticated: `previewed=true`
  - `queue_status=authorized_for_mac_relay_execution`
  - `markdown_body_included=false`
  - `markdown_body_sha256` length 64
  - `execution_payload_preview` does not include `markdown_body`
  - `queue_mutation_enabled=false`
  - `mac_relay_write_enabled=false`
  - `actual_nas_write_enabled=false`
  - `watcher_enabled=false`
  - `cron_enabled=false`
  - `dispatch_enabled=false`
  - raw markdown/path/provider/credential leak=false

Local browser smoke:

- URL: `http://127.0.0.1:9134/office?authorizedpreview-local-browser=1`
- `/office` rendered, scoped NAS Keeper handoff controls=0, raw leak=false, console JS errors=0.

## VPS smoke

Precheck:

- dashboard worktree HEAD: `cf02a29a`
- agent worktree HEAD: `cf02a29a9`
- both worktrees clean
- dashboard active
- gateway active

Protected API smoke:

- seeded one safe queued handoff on VPS restricted profile using the existing helper only.
- POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize`:
  - unauthenticated: 401
  - authenticated: `authorized=true`
  - `queue_status_after=authorized_for_mac_relay_execution`
- POST `/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-payload-preview`:
  - unauthenticated: 401
  - authenticated: `previewed=true`
  - `queue_status=authorized_for_mac_relay_execution`
  - `markdown_body_included=false`
  - `markdown_body_sha256` length 64
  - `execution_payload_preview` does not include `markdown_body`
  - `queue_mutation_enabled=false`
  - `mac_relay_write_enabled=false`
  - `actual_nas_write_enabled=false`
  - `watcher_enabled=false`
  - `cron_enabled=false`
  - `dispatch_enabled=false`
  - raw markdown/path/provider/credential leak=false

VPS browser/HTTP smoke:

- URL: `http://100.122.57.85:8765/office?authorizedpreview-vps-browser=cf02a29a`
- `/office` rendered; raw markdown/path/provider/credential leak=false; console JS errors=0.
- HTTP smoke: `/office?authorizedpreview-http=cf02a29a` returned 200.
- services after smoke:
  - dashboard active
  - gateway active and untouched

## Result

Completed against code already present in `cf02a29a9c7dc2f85b57811895d92118abe52225`.

No code changes were required in this slice. The only follow-up change is this evidence/handoff doc plus NEXT/STATUS updates.

## Next recommended rung

Next safe rung, if explicitly approved, is `Mac-local authenticated execution-from-preview temp-root smoke`:

- use an authorized handoff and previewed payload;
- execute only on the Mac relay side against a temporary/safe root first;
- verify rollback/readback/audit metadata;
- still keep direct VPS NAS authority, watcher/cron, public exposure, real dispatch, and gateway restart closed.

Last updated: 2026-05-21 09:48 KST
