# Mutation Control Readiness 2 + projection dry-run evidence

Date: 2026-05-13 14:54 KST

## Approved scope

User approved proceeding through the recommended low-risk sequence:

1. Mutation-control readiness panel v2.
2. Dry-run only mutation API design doc + tests.
3. Narrow first safe action: projection ingest/promote dry-run.

Still not approved/performed:

- Public exposure changes.
- NAS mount/direct credentials on VPS.
- Watcher/cron automation.
- Kanban write.
- Gateway/core runtime mutation or gateway restart.
- Executable browser mutation controls.
- Non-dry-run projection promote from the dashboard.

## Implementation

### Dashboard panel

Files:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts`

Changes:

- Upgraded `Mutation Control Readiness 1` to `Mutation Control Readiness 2`.
- Added explicit gates:
  - `session`
  - `dryRun`
  - `audit`
  - `rollback`
- Reordered candidate controls by risk:
  1. `projection` low risk, dry-run only
  2. `kanban` medium risk, dry-run only
  3. `automation` high risk, dry-run only
  4. `service` high risk, dry-run only
- All browser controls remain disabled.
- UI exposes only metadata attributes:
  - `data-office-mutation-control-risk`
  - `data-office-mutation-control-dry-run-only`
  - gate satisfaction markers

### Dry-run design

File:

- `docs/ai-office/product/mutation-control-dry-run-api.md`

Design records:

- The first allowed action id is `projection_ingest_promote`.
- Initial mode is `dry_run=true` only.
- No browser route/form/submit/fetch mutation was added.
- Future executable route requires explicit session approval, audit, idempotency, rollback, allowlist, and raw leak checks.

### Safe projection dry-run helper

Files:

- `hermes_cli/office_projection.py`
- `tests/hermes_cli/test_office_projection_cache.py`

Changes:

- `ingest_office_projection_bundle(..., dry_run=True)` now returns safe would-promote/would-reject metadata.
- Dry-run does not create active/archive/rejected cache directories, copy bundles, promote bundles, or write rejection metadata.
- Rejection dry-run returns categories/field paths only and does not echo raw values.

## Verification

Commands run from `/Users/lidises/dev/hermes-agent` or `/Users/lidises/dev/hermes-agent/web`:

- `npm test -- --run OfficePage.test.ts -t "mutation-control readiness"`
  - passed
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_projection_cache.py -q -o 'addopts='`
  - 5 passed
- `npm test -- --run OfficePage.test.ts`
  - 69 passed
- `npm run build`
  - passed
  - existing Vite large chunk warning only
- `npm run lint`
  - exit 0
  - existing non-Office warnings only
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_projection_cache.py tests/test_office_projection_validator.py -q -o 'addopts='`
  - 15 passed
- `git diff --check`
  - passed

## Safety notes

- No gateway restart.
- No gateway/core checkout mutation.
- No public listener change.
- No NAS credential or mount work.
- No Kanban mutation.
- No cron/watcher automation.
- No raw bundle value, private path, token-like value, prompt, transcript, or log value is returned by the dry-run helper.


## VPS dashboard deployment smoke

Date: 2026-05-13 14:56 KST

- Local commit pushed to `origin/main`: `2d29d13a feat(office): add mutation dry-run readiness`.
- VPS dashboard worktree `/home/hermes/.hermes/ai-office-dashboard` fast-forwarded from `e7d53984` to `2d29d13a`.
- Restarted only `hermes-agent-dashboard.service`.
- Did not restart `hermes-gateway.service`.
- Final VPS checks:
  - dashboard worktree HEAD: `2d29d13a`
  - worktree status entries: `0`
  - `hermes-agent-dashboard.service`: active
  - `hermes-gateway.service`: active
  - listener: `100.122.57.85:8765`
  - private `/office?v=2d29d13a`: HTTP 200
- Browser smoke:
  - mutation panel present: true
  - gate count: 4
  - controls: projection/low/dry-run-only, kanban/medium/dry-run-only, automation/high/dry-run-only, service/high/dry-run-only
  - enabled controls: none
  - forms: 0
  - raw leak probe: false
  - console messages: 0
  - JS errors: 0
- Public negative probe:
  - IPv4 `178.105.83.210:8765`: timeout / no HTTP served
  - IPv6 `[2a01:4f8:1c18:b821::1]:8765`: no route to host
