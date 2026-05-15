# AI Office Event Persistence Design RED Tests

Last updated: 2026-05-15 20:18 KST
Status: GREEN implementation completed by `Event Persistence Contract Schema 1`. Production code remains limited to a pure helper that returns fixed non-writing metadata. No storage/write path, database migration, route, service restart, deploy, VPS/NAS/Kanban/cron mutation, or browser executable control was added.

## Approved scope

The approved slice is `Event Persistence Design RED Tests 1`:

- define the next persistence boundary with tests and handoff docs only;
- keep persistence/event append implementation absent;
- keep request creation, approval decision recording, audit sink, dry-run execution, authority adapter, target mutation, and NAS save disabled/out of scope;
- stop before adding any storage backend, append route, migration, durable file write, database write, service restart, VPS/NAS/Kanban/cron mutation, or frontend executable control.

## RED tests added

File:

- `tests/hermes_cli/test_office_controlled_mutation_persistence_contract.py`

The tests define a future pure helper only:

- `build_office_controlled_mutation_event_persistence_contract(...)`

Expected future contract shape:

- `mode=event_persistence_contract_only`
- `event_store.implementation_enabled=false`
- `event_store.append_enabled=false`
- `event_store.readback_enabled=false`
- `event_store.durable_storage_enabled=false`
- `event_store.database_migration_required=false`
- `storage_endpoints=[]`
- `capabilities.event_append_enabled=false`
- `capabilities.audit_write_enabled=false`
- `capabilities.target_mutation_enabled=false`
- `capabilities.nas_save_enabled=false`
- redaction fields require raw exclusion, allowlisted fields only, opaque refs only, and no unsupported value echo

The tests also require unsafe examples to be ignored and not echoed:

- raw prompt
- raw task body
- private transcript/Traceback
- local private path
- provider id
- token placeholder
- numeric topic id

## Verified RED result

Command:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_persistence_contract.py -q -o 'addopts='
```

Result:

```text
3 failed
```

Expected failure:

```text
ImportError: cannot import name 'build_office_controlled_mutation_event_persistence_contract' from 'hermes_cli.office_controlled_mutation'
```

This is the intended RED state because the production helper has not been approved or implemented.

## Safety/non-actions

No production code was added for this slice. Specifically:

- no `hermes_cli/office_controlled_mutation.py` persistence helper implementation;
- no route/API endpoint for event append/readback;
- no file write or database write path;
- no migration;
- no storage directory or schema runtime creation;
- no request creation;
- no event append;
- no approval decision record;
- no audit write;
- no dry-run execution;
- no authority adapter;
- no target mutation;
- no Kanban/cron/VPS/NAS mutation;
- no NAS save;
- no service restart/deploy;
- no browser executable controls.

## GREEN implementation completed

`Event Persistence Contract Schema 1` implemented the approved pure-helper-only subset:

- added `build_office_controlled_mutation_event_persistence_contract(unsafe_examples=None)` to `hermes_cli/office_controlled_mutation.py`;
- returns fixed contract metadata only;
- ignores unsafe examples completely;
- keeps implementation/write/append/readback/durable-storage/migration capabilities false;
- adds no route and no storage backend.

Verification:

```text
Focused GREEN: 3 passed
Combined Office API/controlled mutation tests: 30 passed
py_compile: passed
git diff --check: passed
git diff --cached --check: passed
production safety scan: hardcoded_secret 0, shell_injection 0, dangerous_exec 0, unsafe_pickle 0, sql_format 0, unauthorized_mutation_route 0, write_calls 0, network_calls 0
independent review: passed after NEXT/STATUS doc hygiene fix
```

## Next boundary, if separately approved

Anything beyond the pure helper still requires separate explicit approval:

- append route;
- storage backend;
- event append/readback implementation;
- audit sink;
- database migration;
- dry-run execution;
- authority adapter;
- target mutation;
- service restart/deploy;
- VPS/NAS/Kanban/cron mutation;
- browser forms/buttons/inputs/executable controls.
