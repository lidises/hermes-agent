# Controlled Mutation Safe Request Store 1

Date: 2026-05-15 23:44 KST

## Scope

User approved proceeding past the frontend-only completion review except for critically security-damaging actions. This slice implements the first narrow controlled-mutation storage boundary: protected safe request-event append/readback under local `HERMES_HOME` JSONL storage.

## Implemented

- `hermes_cli/office_controlled_mutation.py`
  - Added `append_office_controlled_mutation_request_event(...)`.
  - Added `list_office_controlled_mutation_request_events(...)`.
  - Store path is profile-local: `get_hermes_home() / "office" / "controlled-mutation" / "requests.jsonl"`.
  - Only the already validated allowlisted DTO is appended; readback revalidates and normalizes stored JSONL entries before returning them.
- `hermes_cli/web_server.py`
  - Added protected `POST /api/office/controlled-mutation/request`.
  - Added protected `GET /api/office/controlled-mutation/requests`.
- `tests/hermes_cli/test_office_controlled_mutation_request_event.py`
  - Added TDD coverage for helper append/readback, protected API append/readback, local `HERMES_HOME` path confinement, and raw rejection/no-echo/no-write behavior.

## Safety posture

Allowed in this slice:

- safe request-event creation/persistence for validator-passing DTOs only
- protected dashboard API append/readback
- local `HERMES_HOME` JSONL file write/readback

Still not implemented:

- dry-run execution
- human decision recording
- authority adapter implementation/binding/dispatch
- target mutation
- audit write
- NAS save/write/preparation
- credential/auth/env change
- migration/database schema change
- VPS/NAS/Kanban/cron mutation
- deploy/restart/push/PR/merge
- browser controls/forms/buttons/inputs

Raw/sensitive input handling:

- unsupported fields are rejected before write
- unsupported/raw values are not echoed in errors
- raw prompt/task/transcript/path/provider/token-style sentinels are not persisted by the append path

## Verification

RED first:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_request_event.py -q -o 'addopts='
```

Expected failures captured before implementation:

- missing `append_office_controlled_mutation_request_event`
- missing `list_office_controlled_mutation_request_events`
- missing protected append/readback routes returning 405

GREEN / regression:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_request_event.py -q -o 'addopts='
# 14 passed

.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 37 passed

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 48 passed
```

Additional checks:

- `git diff --check` passed.
- Production added-line scan found no hardcoded secrets/private raw sentinels, no exec/subprocess, no target/audit/NAS mutation enablement, and only the intended protected controlled-mutation POST/GET routes plus intended local JSONL write path.

## Next recommended boundary

Next safe backend slice can be one of:

1. request-store hardening: duplicate/correlation handling, max readback limit, and malformed JSONL resilience tests; or
2. first human-decision recording contract/store, still protected/local/allowlisted and still without target mutation, adapter binding, dry-run execution, audit write, or NAS save.

Do not proceed to dry-run execution, audit write, authority adapter, target mutation, credential/env changes, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls without a distinct verification gate.
