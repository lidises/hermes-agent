# NAS Save/Write Preparation Contract Implementation 1

Date: 2026-05-16 11:39 KST

## Approved scope

User first approved only:

- `NAS save/write preparation: 설계+RED tests only`
- Production write implementation was forbidden.

After the RED stop point, user separately approved:

- `NAS save/write preparation contract implementation only: pure helper + protected GET schema route`
- No POST/PUT/PATCH/DELETE.
- No storage/write path.
- No NAS path resolution or NAS mount access.
- No evidence persistence or rollback point creation.
- No actual NAS save/write.

This slice therefore implements only the pure contract helper and protected GET schema route needed to satisfy the prior RED tests.

## Added RED tests

Test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_contract.py`

The RED tests defined the next non-writing NAS preparation boundary:

- Future pure helper: `build_office_controlled_mutation_nas_save_preparation_contract(...)`
- Future protected contract route: `GET /api/office/controlled-mutation/nas-save-preparation/schema`
- Route must be dashboard-session protected, not public, and not under `/api/plugins/`.
- Authenticated response must be JSON, not SPA HTML fallback.
- Common mutation methods must remain rejected.
- Contract must keep all executable/write capabilities disabled, including NAS save preparation, NAS save, NAS write, credential access, target mutation, audit write, dry-run execution, and authority binding.
- Unsafe examples must be ignored so raw prompts, task bodies, transcripts, private paths, source bodies, provider ids, tokens, and credentials never echo.

## RED verification

Command:

```bash
cd /Users/lidises/dev/hermes-agent
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_contract.py -q -o 'addopts='
```

Result:

```text
3 failed, 2 passed in 0.62s
```

Expected failures:

1. ImportError for missing `build_office_controlled_mutation_nas_save_preparation_contract`.
2. ImportError for missing raw-material/no-echo helper path.
3. Authenticated future route fell through to SPA HTML (`text/html; charset=utf-8`) instead of returning JSON.

Expected passes:

1. Unauthenticated route access was protected with 401.
2. Common mutation methods rejected the missing route with 404/405.

## GREEN implementation

Production files changed after separate approval:

- `hermes_cli/office_controlled_mutation.py`
  - Added pure `build_office_controlled_mutation_nas_save_preparation_contract(...)` descriptor helper.
  - The helper ignores `unsafe_examples` and returns fixed contract metadata only.
  - All NAS/write/credential/dispatch/audit/storage capabilities remain false.
- `hermes_cli/web_server.py`
  - Added protected GET route `GET /api/office/controlled-mutation/nas-save-preparation/schema`.
  - The route returns the helper contract JSON and is protected by the existing dashboard session-token middleware.

## GREEN verification

Commands/results:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_contract.py -q -o 'addopts='
# 5 passed in 0.60s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 96 passed in 1.09s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed

git diff --cached --check
# passed
```

Production safety scan:

```text
hardcoded_secret_assignment: 0
shell_exec: 0
sql_format: 0
unauthorized_mutation_route: 0
storage_or_write_call: 0
nas_access_hint: 0
credential_capability_enabled: 0
```

Independent review: PASS, no blocking security concern, logic error, or scope violation.

## Safety / non-actions

No NAS preparation DTO validation, request creation, POST/PUT/PATCH/DELETE endpoint, storage/write path, NAS path resolution, NAS mount access, evidence persistence, rollback point creation, actual NAS save/write/preparation runtime, event append/readback, audit write, dry-run execution, target dispatch, real authority adapter binding, credential/auth/env change, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## Next boundary

A separate explicit approval is required before any of:

- NAS preparation DTO validation.
- POST/PUT/PATCH/DELETE route.
- Storage/write path.
- NAS path resolution or mount access.
- Evidence persistence or rollback point creation.
- Actual NAS save/write.
- Credential/auth/env change.
- Target dispatch/runtime mutation.
- Real authority adapter binding/dispatch.
- Migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls.
