# AI Office Approval Decision Contract Schema 1

Last updated: 2026-05-15 20:31 KST
Status: GREEN implementation completed. Production code is limited to a pure helper returning fixed non-recording human approval decision metadata. No decision recording route, persistence/storage/write path, event append/readback, database migration, service restart, deploy, VPS/NAS/Kanban/cron mutation, or browser executable control was added.

## Approved scope

The approved slice is `Approval Decision Contract Schema 1`:

- add only a pure helper/schema contract;
- keep decision recording/persistence/route out of scope;
- keep request creation, audit write, event append, dry-run execution, authority adapter, target mutation, and NAS save disabled/out of scope;
- stop before any route, storage backend, append/readback implementation, decision recording, migration, service restart, VPS/NAS/Kanban/cron mutation, or frontend executable control.

## Implementation

File:

- `hermes_cli/office_controlled_mutation.py`

Pure helper:

- `build_office_controlled_mutation_approval_decision_contract(unsafe_examples=None)`

The helper returns only fixed contract metadata:

- `mode=approval_decision_contract_only`
- `decision_store.implementation_enabled=false`
- `decision_store.recording_enabled=false`
- `decision_store.append_enabled=false`
- `decision_store.readback_enabled=false`
- `decision_store.durable_storage_enabled=false`
- `decision_store.database_migration_required=false`
- `allowed_decisions=[approve,reject,defer]`
- `approval_scope=single_action_only`
- `decision_endpoints=[]`
- `storage_endpoints=[]`
- `capabilities.human_decision_recording_enabled=false`
- `capabilities.decision_append_enabled=false`
- `capabilities.decision_readback_enabled=false`
- `capabilities.audit_write_enabled=false`
- `capabilities.target_mutation_enabled=false`
- redaction fields require raw exclusion, allowlisted fields only, opaque refs only, safe summaries only, and no unsupported value echo

Unsafe examples are ignored completely so raw/private values are never echoed.

## Tests

File:

- `tests/hermes_cli/test_office_controlled_mutation_approval_decision_contract.py`

RED result before implementation:

```text
3 failed
ImportError: cannot import name 'build_office_controlled_mutation_approval_decision_contract'
```

GREEN result:

```text
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_approval_decision_contract.py -q -o 'addopts='
3 passed
```

Combined verification:

```text
.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_contract.py tests/hermes_cli/test_office_controlled_mutation_request_event.py tests/hermes_cli/test_office_controlled_mutation_persistence_contract.py tests/hermes_cli/test_office_controlled_mutation_audit_sink_contract.py tests/hermes_cli/test_office_controlled_mutation_approval_decision_contract.py -q -o 'addopts='
36 passed
```

Other verification:

```text
.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
git diff --check
git diff --cached --check
```

All passed. Independent review also passed with no security concerns, logic errors, route/storage/write behavior, or scope violation.

Production safety scan found:

```text
hardcoded_secret 0
shell_injection 0
dangerous_exec 0
unsafe_pickle 0
sql_format 0
unauthorized_mutation_route 0
write_calls 0
network_calls 0
```

## Safety/non-actions

- no route/API endpoint;
- no decision recording;
- no decision append/readback;
- no audit write;
- no event append/readback;
- no storage/write path;
- no durable storage;
- no database migration;
- no request creation;
- no dry-run execution;
- no authority adapter;
- no target mutation;
- no Kanban/cron/VPS/NAS mutation;
- no NAS save;
- no service restart/deploy;
- no browser executable controls.

## Next boundary, if separately approved

Anything beyond this pure helper still requires separate explicit approval:

- dry-run evidence contract/schema;
- decision recording route or decision storage backend;
- audit append route or audit storage backend;
- event append/readback implementation;
- database migration;
- dry-run execution;
- authority adapter;
- target mutation;
- service restart/deploy;
- VPS/NAS/Kanban/cron mutation;
- browser forms/buttons/inputs/executable controls.
