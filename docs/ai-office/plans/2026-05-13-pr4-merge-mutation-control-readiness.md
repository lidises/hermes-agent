# PR #4 merge + Mutation Control Readiness 1 evidence

Date: 2026-05-13 14:36 KST

## Scope approved by user

User approved:

- Merge PR #4.
- Dashboard mutation-control related changes.

Still not performed:

- PR #4 was not modified after merge except observing merged state.
- No gateway restart in this pass.
- No public exposure change.
- No NAS mount/direct credentials.
- No watcher/cron automation.
- No Kanban mutation.
- No executable dashboard mutation endpoint/action was added.

## PR #4 merge

PR #4 was merged into `main`.

Observed after merge:

- PR: `https://github.com/lidises/hermes-agent/pull/4`
- State: `MERGED`
- Merge commit: `e7d2d4306937af095f170b0d1a315925ac74d5a7`
- Local `main` and `origin/main` were at `e7d2d430` before the mutation-control follow-up.

## Mutation Control Readiness 1 implementation

Commit pushed to `main`:

- `30bbfd4c feat(office): add gated mutation control readiness`

Implementation summary:

- Added `buildOfficeMutationControlReadiness(state)`.
- Added a diagnostics drawer panel hook: `data-office-mutation-control-readiness="true"`.
- Added four disabled control candidates only: `kanban`, `automation`, `service`, `projection`.
- Every candidate is rendered disabled with `data-office-mutation-control-enabled="false"`.
- The panel is a readiness/approval/audit gate, not an executable mutation UI.
- No backend endpoint, systemd action, Kanban write, cron action, gateway action, credential path, or public route was added.

## Local verification

- RED first: focused mutation-control readiness test failed with `buildOfficeMutationControlReadiness is not a function`.
- GREEN focused: `npm test -- --run OfficePage.test.ts -t "mutation-control readiness"` passed.
- Full OfficePage helper tests: `npm test -- --run OfficePage.test.ts` passed: 69 tests.
- Build: `npm run build` passed with existing Vite large chunk warning only.
- Lint: `npm run lint` exited 0 with pre-existing warnings outside touched Office files.
- Whitespace: `git diff --check` passed.

## VPS dashboard deployment

Dedicated dashboard worktree:

- Path: `/home/hermes/.hermes/ai-office-dashboard`
- Previous branch/head: `ai-office-stage16e-safe-spatial-choreography-20260510` at `d9ac5fae`
- Updated branch/head: `main` at `30bbfd4c`
- Worktree status entries after update: `0`

Service scope:

- Restarted only `hermes-agent-dashboard.service`.
- Did not restart `hermes-gateway.service`.

Post-restart service/listener check:

- `hermes-agent-dashboard.service`: active
- `hermes-gateway.service`: active
- Listener: private Tailscale `100.122.57.85:8765`
- Private `/office?v=30bbfd4c`: HTTP 200

## Browser/private smoke

Browser URL:

- `http://100.122.57.85:8765/office?v=30bbfd4c`

Browser console/state:

- Console messages: 0
- JS errors: 0
- Mutation readiness panel present: true
- Mutation status: `blocked-read-only`
- Control candidates: `kanban`, `automation`, `service`, `projection`
- All control candidates disabled: true
- Enabled mutation controls: 0
- Forms: 0
- Raw leak probe: false

Raw HTML probe notes:

- The server-rendered HTML is the SPA shell, so `html_has_mutation_panel=false` is expected before client rendering.
- Raw HTML enabled-control probe: false
- Raw HTML leak sentinel: false

Public negative probes:

- Public IPv4 `178.105.83.210:8765`: timeout/no served HTTP response.
- Public IPv6 `[2a01:4f8:1c18:b821::1]:8765`: no route to host from probe environment.
- Private-only dashboard posture preserved.
