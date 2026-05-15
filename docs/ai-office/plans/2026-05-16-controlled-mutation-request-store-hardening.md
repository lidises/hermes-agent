# Controlled Mutation Request Store Hardening 1

Date: 2026-05-16 08:48 KST

## Approved scope

The user explicitly approved request-store hardening implementation only:

- duplicate request detection
- correlation readback handling
- readback limit handling
- malformed JSONL resilience

## Implementation

Files changed:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_request_event.py`

Implemented behavior:

- `append_office_controlled_mutation_request_event(...)` now rejects duplicate `request_id` entries already present in the local JSONL request store.
- `list_office_controlled_mutation_request_events(...)` now reports the effective clamped `limit`, reports `skipped_count`, and supports safe `correlation_id` filtering.
- Malformed JSONL lines and invalid stored DTOs are skipped without echoing raw line content.
- The existing protected `GET /api/office/controlled-mutation/requests` route accepts the same safe `correlation_id` filter.

## Safety / non-actions

This slice does not add dry-run execution, human-decision recording, authority adapters, target mutation, audit writes, NAS save/write, Kanban/VPS/cron mutation, credential/env changes, migrations, deploy/restart, push/PR/merge, browser controls, or new mutation routes.

Capability flags for dry-run execution, human-decision recording, authority adapter, target mutation, audit write, and NAS save remain false.

## Verification

RED:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_request_event.py -q -o 'addopts='`
- Failed as expected before implementation: missing `limit`, duplicate append accepted, `correlation_id` unsupported, and API readback lacked hardening metadata.

GREEN:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_request_event.py -q -o 'addopts='` → `21 passed`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `55 passed`
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` → passed
- `git diff --check` → passed
- production diff safety scan → hardcoded_secret 0, shell_exec 0, sql_format 0, unauthorized_mutation_route 0, target/audit/NAS enablement 0, new POST routes 0, unsafe write-call additions 0
- independent review → PASS, no blocking security concern, logic error, or scope violation

## Next approval boundary

Next boundaries still requiring explicit approval:

- human-decision recording contract/store
- dry-run execution/result storage
- audit append sink/runtime
- authority adapter implementation/binding
- target mutation/dispatch
- NAS save/write preparation
- VPS/NAS/Kanban/cron mutation
- deploy/restart/push/PR/merge
- browser executable controls
