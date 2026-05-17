# AI Office Controlled Mutation Boundary — RED Test Handoff

Last updated: 2026-05-15 19:12 KST
Status: RED tests were promoted to GREEN by `Controlled Mutation Contract Schema 1`. Production implementation is limited to a pure schema helper plus protected GET schema route. No mutation route, persistence, DB migration, service restart, VPS/NAS/Kanban/cron mutation, or browser executable control was added.

## Approved scope

User approved the next boundary preparation at this scope:

- backend/schema/API route design + tests are allowed;
- stop before production implementation;
- no DB/service/VPS/NAS changes;
- no executable GUI controls;
- no request creation, target mutation, audit write, or NAS save.

## Boundary being prepared

Next large boundary from `NEXT.md` / `STATUS.md`:

```text
event schema and controlled mutation approval boundary
```

The first safe backend step should remain contract-only:

```text
GET /api/office/controlled-mutation/schema
```

It should describe future controlled-mutation capabilities while keeping every executable flag disabled.

## RED tests added

File added:

```text
tests/hermes_cli/test_office_controlled_mutation_contract.py
```

The tests define two next implementation units:

1. Pure schema helper:
   - module: `hermes_cli.office_controlled_mutation`
   - function: `build_office_controlled_mutation_contract_schema(...)`
   - expected mode: `contract_only`
   - expected capabilities all false:
     - `request_creation_enabled`
     - `dry_run_execution_enabled`
     - `human_decision_recording_enabled`
     - `authority_adapter_enabled`
     - `target_mutation_enabled`
     - `audit_write_enabled`
     - `nas_save_enabled`
   - expected redaction posture:
     - `raw_excluded=true`
     - `allowlisted_fields_only=true`
     - `opaque_refs_only=true`

2. Protected API route:
   - route: `GET /api/office/controlled-mutation/schema`
   - must be protected by dashboard session token;
   - must not be public;
   - must not live under `/api/plugins/`;
   - must return JSON only after auth;
   - common mutation methods against this schema route must stay rejected.

## RED verification

Command run:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_contract.py -q -o 'addopts='
```

Expected RED result observed:

```text
3 failed, 2 passed
```

Failures are expected and define the missing implementation:

1. `ModuleNotFoundError: No module named 'hermes_cli.office_controlled_mutation'`
2. same missing module for raw-material rejection test
3. authenticated `GET /api/office/controlled-mutation/schema` currently falls through to the SPA HTML response, so it is not yet a JSON API contract route.

The two passed tests verify already-existing safety posture:

- unauthenticated access requires dashboard session token;
- common mutation methods on the missing schema path are not accepted as mutation routes.

## GREEN implementation completed

`Controlled Mutation Contract Schema 1` implemented only the approved contract-only subset:

1. Added `hermes_cli/office_controlled_mutation.py` with pure `build_office_controlled_mutation_contract_schema(...)`.
2. The helper returns fixed allowlisted contract metadata and ignores unsafe examples so raw material is never echoed.
3. Added protected `GET /api/office/controlled-mutation/schema` in `hermes_cli/web_server.py`.
4. No POST/PUT/PATCH/DELETE routes were added.
5. No request events, decisions, audit events, dry-run records, target mutations, Kanban writes, cron changes, service restarts, or NAS saves were created.

GREEN verification:

```text
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_contract.py -q -o 'addopts='
5 passed

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_contract.py -q -o 'addopts='
16 passed
```

Next boundary requiring separate explicit approval: request-event DTO validation or persistence design.

## Non-goals

Not approved in this handoff:

- implementation of action request persistence;
- approval decision recording;
- dry-run execution beyond existing separately approved projection dry-run precedent;
- authority adapter execution;
- audit sink writes;
- Kanban mutation;
- cron/watcher enablement;
- service restart;
- VPS mutation;
- NAS read/write/mount/direct credentials;
- browser buttons/forms/inputs or executable controls;
- deployment, push, PR, merge.
