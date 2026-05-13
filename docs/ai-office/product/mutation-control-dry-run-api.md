# AI Office mutation-control dry-run API design

Last updated: 2026-05-13 14:55 KST

## Purpose

Define the first safe mutation-control shape for `/office` without adding an executable dashboard mutation surface.

The only approved low-risk candidate in this pass is safe projection ingest/promote dry-run. It validates one redacted projection bundle and returns whether it would be promoted or rejected without mutating active cache, archive, rejection history, Kanban, cron, gateway, systemd, public exposure, NAS mounts, or credentials.

## Non-goals

- No public listener or auth surface change.
- No browser form, submit button, or fetch-based mutation call.
- No Kanban write.
- No cron/watcher automation.
- No gateway/core restart or systemd control.
- No NAS mount or direct credentials on the VPS.
- No raw bundle values, absolute paths, prompts, transcripts, logs, tokens, credentials, provider/model identity, or command args in API responses.

## Candidate action

Action id: `projection_ingest_promote`

Initial mode: `dry_run=true` only.

Inputs, when a backend route is later approved:

- `bundle_path`: server-side incoming bundle identifier, not an arbitrary absolute path.
- `dry_run`: must be true for the first implementation phase.
- `idempotency_key`: required before non-dry-run promotion is considered.
- `approval_scope`: short server-side audit label for the user-approved task.

Current implementation baseline:

- `hermes_cli.office_projection.ingest_office_projection_bundle(bundle_dir, dry_run=True)`.
- Valid bundle returns safe metadata:
  - `status: would_promote`
  - `bundle_path`: safe directory name only
  - `ok: true`
  - `dry_run: true`
  - `action: projection_ingest_promote`
  - `gates`: validator/cache/rollback gates
- Invalid bundle returns safe rejection metadata:
  - `status: would_reject`
  - `ok: false`
  - `dry_run: true`
  - `rejection`: category and field-path metadata only

## Required gates before any executable browser mutation

1. Session approval
   - The current task must explicitly approve the exact action and scope.
2. Dry-run first
   - Browser-visible result must be demonstrated with no active/archive/rejected cache mutation.
3. Audit trail
   - Audit metadata must be safe and value-free.
4. Rollback handle
   - Non-dry-run promotion cannot proceed until active/archive recovery is tested.
5. Allowlist
   - Only server-side incoming bundle identifiers are accepted; no absolute paths or shell args.
6. Raw leak guard
   - Responses and dashboard rendering must pass sentinel checks for private paths, token-like values, raw prompts/transcripts/logs, and credentials.

## Promotion criteria for future phase

A later non-dry-run promotion needs separate approval and must include:

- Route-level tests.
- CSRF/session or equivalent private-channel guard.
- Idempotency behavior.
- Pre/post active cache checks.
- Archive rollback evidence.
- Browser smoke confirming no raw leak, no console errors, and no accidental controls for higher-risk actions.
