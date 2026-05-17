# Controlled Mutation Human Decision Store 1

Date: 2026-05-16 08:56 KST

## Approved scope

The user explicitly approved the human-decision recording contract/store boundary only:

- approve/reject/hold decision validation
- local profile-scoped decision append/readback
- duplicate decision/request detection
- safe request/correlation filtering
- malformed JSONL resilience

## Implementation

Files changed:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_approval_decision_contract.py`
- `tests/hermes_cli/test_office_controlled_mutation_decision_store.py`

Implemented behavior:

- `validate_office_controlled_mutation_decision_event(...)` validates an allowlisted safe human-decision DTO without writing.
- `append_office_controlled_mutation_decision_event(...)` records a validated safe decision DTO in local profile-scoped JSONL at `HERMES_HOME/office/controlled-mutation/decisions.jsonl`.
- `list_office_controlled_mutation_decision_events(...)` reads back normalized safe decision DTOs with effective `limit`, `skipped_count`, safe `request_id` and `correlation_id` filters.
- Duplicate `decision_id` and duplicate `request_id` decisions are rejected without a second write.
- Malformed JSONL lines and invalid stored DTOs are skipped without raw echo.
- Protected dashboard routes were added:
  - `POST /api/office/controlled-mutation/decision`
  - `GET /api/office/controlled-mutation/decisions`
- The existing approval-decision contract vocabulary now uses `hold` instead of the earlier placeholder `defer`, matching the approved approve/reject/hold boundary.

## Safety / non-actions

This slice does not add dry-run execution, authority adapter implementation/binding, dispatch/target mutation, audit write, NAS save/write, Kanban/VPS/cron mutation, credential/env changes, migrations, deploy/restart, push/PR/merge, or browser controls.

Capability flags for dry-run execution, authority adapter, target mutation, audit write, and NAS save remain false.

## Verification

RED:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_decision_store.py -q -o 'addopts='`
- Failed as expected before implementation: missing decision validator/append/readback helpers and missing protected decision routes.

GREEN:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_decision_store.py tests/hermes_cli/test_office_controlled_mutation_approval_decision_contract.py -q -o 'addopts='` → `11 passed`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `63 passed`
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` → passed
- `git diff --check` → passed
- production diff safety scan → hardcoded_secret 0, shell_exec 0, sql_format 0, unauthorized PUT/PATCH/DELETE 0, execution/target/audit/NAS enablement 0, intended new POST route only `/api/office/controlled-mutation/decision`, unsafe write-call additions 0
- independent review → PASS, no blocking security concern, logic error, or scope violation

## Next approval boundary

Next boundaries still requiring explicit approval:

- dry-run execution/result storage
- audit append sink/runtime
- authority adapter implementation/binding
- target mutation/dispatch
- NAS save/write preparation
- VPS/NAS/Kanban/cron mutation
- deploy/restart/push/PR/merge
- browser executable controls
