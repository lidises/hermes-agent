# Kanban mutation dry-run readiness handoff

Last updated: 2026-05-20 17:47 KST

## Completed in this slice

- Added `Kanban mutation dry-run readiness 1` as a read-only `/office` Kanban operations surface.
- The surface is intentionally A0/display-only:
  - `enabledControls=0`
  - `kanbanMutationEnabled=false`
  - `executionEnabled=false`
  - `dryRunResultWriteEnabled=false`
  - `approvalRecordWriteEnabled=false`
  - `nasWriteEnabled=false`
  - `watcherCronEnabled=false`
  - `gatewayRestartEnabled=false`
- It shows only safe candidate refs/status from the allowlisted Kanban projection DTO plus:
  - 6 evidence checks
  - 6 blocked capability cards
- It does not create forms/buttons/inputs or call mutation endpoints.

## Commits

- `0d063f43 feat(office): add kanban mutation readiness review`

## Verification

Local:

- Focused readiness tests:
  - `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx -t "Kanban mutation dry-run readiness"`
  - 2 passed
- Combined Office tests:
  - `npm test -- --run src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 252 passed
- ESLint:
  - `npx eslint src/pages/officeView.ts src/pages/OfficePage.tsx src/pages/OfficePage.test.ts src/pages/OfficePage.rpg.test.tsx`
  - 0 errors
  - existing Fast Refresh warnings only
- Build:
  - `npm run build`
  - passed
  - existing Vite large chunk warning only
- `git diff --check`:
  - passed
- production changed-line safety scan:
  - passed
- Local browser DOM smoke:
  - readiness=1
  - checks=6
  - blocked=6
  - controls=0
  - kanbanEnabled=false
  - forms=0
  - rawLeak=false
  - console JS errors=0
- Local vision smoke:
  - Read-only evidence/checklist surface visible
  - Blocked capability cards visible
  - No executable form controls visible

VPS:

- `/home/hermes/.hermes/ai-office-dashboard`
  - HEAD `0d063f43`
  - clean at reset time
- `/home/hermes/.hermes/hermes-agent`
  - HEAD `0d063f431`
  - clean at reset time
- `web_dist` rsync complete to both worktrees
- relative content hash matched on local and both VPS copies:
  - `70305efd554bd7a66c388f536b498feb95b5db83321bd832ec933cef60f388e4`
  - 22 files
- Restarted:
  - `hermes-agent-dashboard.service` only
- Not restarted:
  - `hermes-gateway.service`
- Final service state:
  - dashboard active
  - gateway active
- Private `/office?kanban-readiness=0d063f43`:
  - HTTP 200
- Deployed asset hook:
  - `data-office-kanban-mutation-dry-run-readiness` present in built JS

## VPS browser note

Direct Browserbase/browser access to private VPS `/office` loaded the app shell but did not render OfficeState-backed panels because that browser context lacks the dashboard auth/session for `/api/office/state` and remained in the loading state. This matches the prior approval-boundary deploy behavior. VPS evidence is therefore:

- private HTTP 200 from VPS curl
- deployed built-asset hook scan
- dashboard/gateway service active
- local authenticated/dev browser DOM + vision smoke

## Preserved boundaries

- No Kanban mutation.
- No dry-run result write.
- No approval record write.
- No NAS write.
- No watcher/cron/dispatcher/daemon activation.
- No target mutation.
- No dispatcher/authority-adapter binding.
- No public exposure change.
- No gateway restart.

## Recommended next prompt

Continue with a separately approved `Kanban mutation dry-run result store plan` only if the operator wants to move beyond display-only readiness. Keep it non-executing and require exact candidate transition/ref, rollback/readback evidence, and idempotency/audit shape before any real Kanban state mutation.
