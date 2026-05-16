# Controlled Mutation Audit Append Store 1

Date: 2026-05-16 09:47 KST

## Approved scope

The user explicitly approved only the audit append sink/runtime boundary as:

> audit event append/readback only, no execution/target mutation

This slice records externally supplied safe audit DTOs and reads them back. It does not execute dry-runs, dispatch, mutate targets, bind authority adapters, or save to NAS.

## Implementation

Files changed:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_audit_store.py`

Implemented behavior:

- `validate_office_controlled_mutation_audit_event(...)`
  - accepts only allowlisted safe fields: `audit_id`, `request_id`, `correlation_id`, `event_kind`, `actor_ref`, `safe_summary`, `evidence_refs`, `recorded_at`
  - accepts event kinds `request_recorded`, `decision_recorded`, `dry_run_result_recorded`, `execution_blocked`
  - rejects unsupported/raw fields without echoing raw values
  - rejects credential/private-like markers in allowlisted text/ref fields without echoing the submitted value
- `append_office_controlled_mutation_audit_event(...)`
  - validates first
  - appends normalized DTOs only
  - writes local/profile-scoped JSONL under `HERMES_HOME/office/controlled-mutation/audit_events.jsonl`
  - rejects duplicate `audit_id` without a second write
- `list_office_controlled_mutation_audit_events(...)`
  - reads and revalidates stored DTOs
  - supports safe `request_id`, `correlation_id`, and `event_kind` filters
  - clamps `limit` to 0..200
  - skips malformed JSONL/invalid entries with `skipped_count` and no raw echo
- Protected dashboard routes:
  - `POST /api/office/controlled-mutation/audit`
  - `GET /api/office/controlled-mutation/audit`

## Safety / non-actions

This slice does not add real dry-run execution, command execution, target mutation, authority adapter implementation/binding, NAS save/write, credential/auth/env changes, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls.

The new routes remain protected by the existing dashboard `/api` session-token middleware and are not added to the public API allowlist.

## Review hardening

The first independent review found that allowlisted audit fields could still accept credential-like values such as `password`/`secret`. The second review found additional credential-like variants such as `api key`, `authorization bearer`, `api_key:` refs, and `auth:` refs. The implementation now centralizes marker checks in `_has_raw_marker(...)` and the audit tests cover these sentinels without echoing submitted values.

## Verification

RED:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_audit_store.py -q -o 'addopts='`
- Failed as expected before implementation: 7 failures on missing audit validator/append/readback helpers and missing protected POST route.
- Additional hardening REDs failed before marker fixes on credential-like allowlisted values.

GREEN:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_audit_store.py -q -o 'addopts='` → `9 passed`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `80 passed`
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` → passed
- `git diff --check` → passed
- Production diff safety scan → hardcoded_secret_assignment 0, shell_exec 0, sql_format 0, unauthorized PUT/PATCH/DELETE 0, target/NAS/dry_run_execution enablement 0, intended one audit POST route only
- Independent final review → PASS, prior raw private/credential-like data blockers fixed, no blocking security concern, logic error, or scope violation

## Next approval boundary

Next real implementation still requires explicit approval:

- authority adapter implementation/binding
- target mutation/dispatch
- NAS save/write preparation
- VPS/NAS/Kanban/cron mutation
- deploy/restart/push/PR/merge
- browser executable controls
