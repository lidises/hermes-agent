# NAS Save/Write Preparation + Evidence Contract Ladder 1

Date: 2026-05-16 12:17 KST

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

After that contract slice was committed clean, user instructed to keep progressing through large sections and ask upfront at approval boundaries. The next boundary was approved as:

- `NAS preparation DTO validation only — pure validator + validate-only protected POST; no persistence/write/NAS access`
- No storage/write path.
- No NAS path resolution or NAS mount access.
- No evidence package persistence or rollback point creation.
- No actual NAS save/write/preparation runtime.

After that validate-only slice was committed clean, user approved:

- `NAS evidence package contract-only helper + protected GET schema route; no POST/storage/write/NAS access`
- No package validation.
- No package creation or persistence.
- No storage/write path.
- No NAS path resolution or NAS mount access.
- No evidence package persistence or rollback point creation.
- No actual NAS save/write/preparation runtime.

This document now records the NAS preparation contract helper/route slice, validate-only DTO slice, and subsequent evidence package contract-only slice.

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

## Safety / non-actions for contract slice

No NAS preparation DTO validation, request creation, POST/PUT/PATCH/DELETE endpoint, storage/write path, NAS path resolution, NAS mount access, evidence persistence, rollback point creation, actual NAS save/write/preparation runtime, event append/readback, audit write, dry-run execution, target dispatch, real authority adapter binding, credential/auth/env change, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## Validate-only DTO RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_validate.py`

The validate-only RED tests defined:

- Future pure validator: `validate_office_controlled_mutation_nas_save_preparation(...)`.
- Future protected validate-only route: `POST /api/office/controlled-mutation/nas-save-preparation/validate`.
- Route must be dashboard-session protected, not public, and not under `/api/plugins/`.
- PUT/PATCH/DELETE on the validate route must remain rejected.
- Validator must accept only safe allowlisted refs/text/timestamp fields.
- Validator must reject unsupported raw/private fields with generic sanitized errors.
- Validator must reject path-like or credential-like allowlisted values without echo.
- Returned DTO must keep request creation, persistence, storage write, NAS path resolution, NAS mount access, evidence persistence, rollback point creation, NAS preparation/save/write, credential access, audit write, target mutation, authority binding, and dry-run execution disabled.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_validate.py -q -o 'addopts='
# 8 failed, 1 passed in 0.59s
```

Expected RED failures were missing validator import plus missing POST route returning method-not-allowed/fallback behavior.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added `_NAS_PREPARATION_FIELDS` and pure `validate_office_controlled_mutation_nas_save_preparation(...)`.
  - The validator has no path resolution, mount access, storage/write, credential/env access, audit write, target mutation, authority binding, or execution side effects.
- `hermes_cli/web_server.py`
  - Added only protected `POST /api/office/controlled-mutation/nas-save-preparation/validate`.
  - The route delegates semantic validation/redaction to the pure helper and persists nothing.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_validate.py -q -o 'addopts='
# 9 passed in 0.48s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 105 passed in 1.06s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed

git diff --cached --check
# passed
```

Validate-only production safety scan:

```text
hardcoded_secret_assignment: 0
shell_exec: 0
sql_format: 0
storage_or_write_call: 0
nas_path_resolution_or_mount_access: 0
credential_capability_enabled: 0
unapproved_mutation_routes: 0
```

Independent review: PASS, no security concern, logic error, or scope violation.

## Safety / non-actions for validate-only DTO slice

No request creation, persistence, storage/write path, NAS path resolution, NAS mount access, evidence package persistence, rollback point creation, actual NAS save/write/preparation runtime, audit write, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## NAS Evidence Package Contract RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_contract.py`

The evidence package contract RED tests defined:

- Future pure helper: `build_office_controlled_mutation_nas_evidence_package_contract(...)`.
- Future protected contract route: `GET /api/office/controlled-mutation/nas-evidence-package/schema`.
- Route must be dashboard-session protected, not public, and not under `/api/plugins/`.
- Authenticated response must be JSON, not SPA HTML fallback.
- POST/PUT/PATCH/DELETE on the route must remain rejected.
- Contract must keep package validation, package creation, package persistence, evidence persistence, rollback point creation, storage write, NAS path resolution, NAS mount access, NAS save preparation, NAS save/write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution disabled.
- Unsafe examples must be ignored so raw prompts, task bodies, transcripts, private paths, source bodies, reviewer comments, provider ids, tokens, and credentials never echo.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_contract.py -q -o 'addopts='
# 3 failed, 2 passed in 0.59s
```

Expected RED failures were missing helper import plus missing JSON API route falling through to SPA HTML.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added pure `build_office_controlled_mutation_nas_evidence_package_contract(...)` descriptor helper.
  - The helper ignores `unsafe_examples` and returns fixed contract metadata only.
  - All package/persistence/write/NAS/credential/dispatch/audit/storage capabilities remain false.
- `hermes_cli/web_server.py`
  - Added only protected GET route `GET /api/office/controlled-mutation/nas-evidence-package/schema`.
  - The route returns helper contract JSON and is protected by existing dashboard session-token middleware.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_contract.py -q -o 'addopts='
# 5 passed in 0.47s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 110 passed in 1.12s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed

git diff --cached --check
# passed
```

Evidence package contract production safety scan:

```text
hardcoded_secret_assignment: 0
shell_exec: 0
sql_format: 0
storage_or_write_call: 0
nas_path_resolution_or_mount_access: 0
credential_capability_enabled: 0
unapproved_mutation_routes: 0
```

Independent review: PASS, no security concern, logic error, or scope violation.

## Safety / non-actions for evidence package contract slice

No package validation, package creation, package persistence, evidence package persistence, storage/write path, NAS path resolution, NAS mount access, rollback point creation, actual NAS save/write/preparation runtime, audit write, event append, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## Next boundary

A separate explicit approval is required before any of:

- Package validation.
- Package creation or persistence.
- Persistence/storage/write path.
- NAS path resolution or mount access.
- Evidence package persistence or rollback point creation.
- Actual NAS save/write/preparation runtime.
- Credential/auth/env change.
- Target dispatch/runtime mutation.
- Real authority adapter binding/dispatch.
- Migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls.
