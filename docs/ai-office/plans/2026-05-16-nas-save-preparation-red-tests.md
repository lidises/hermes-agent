# NAS Save/Write Preparation + Evidence Contract/Validation/Store Ladder 1

Date: 2026-05-16 12:44 KST

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

This document now records the NAS preparation contract helper/route slice, validate-only DTO slice, evidence package contract-only slice, evidence package validate-only DTO slice, and local metadata store/readback slice.

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

## NAS Evidence Package Validate-Only DTO RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_validate.py`

The evidence package validate-only RED tests defined:

- Future pure helper: `validate_office_controlled_mutation_nas_evidence_package(...)`.
- Future protected validate-only route: `POST /api/office/controlled-mutation/nas-evidence-package/validate`.
- Route must be dashboard-session protected, not public, and not under `/api/plugins/`.
- Safe allowlisted payloads produce `mode: validated_nas_evidence_package` DTOs.
- Unsupported/raw fields and malformed top-level JSON return sanitized errors without raw echo.
- Path-like or credential-like allowlisted values are rejected without raw echo.
- PUT/PATCH/DELETE on the validate route remain rejected.
- Capabilities keep package creation, package persistence, evidence persistence, storage write, NAS path resolution, NAS mount access, rollback point creation, NAS save preparation/save/write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution disabled.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_validate.py -q -o 'addopts='
# 7 failed, 2 passed in 0.51s
```

Expected RED failures were missing helper import plus missing POST validate route returning 405.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added pure `validate_office_controlled_mutation_nas_evidence_package(...)` helper.
  - Added `_NAS_EVIDENCE_PACKAGE_FIELDS` allowlist.
  - The helper returns only sanitized field/code errors and a DTO when valid; it creates or persists nothing.
  - All package/persistence/write/NAS/credential/dispatch/audit/storage capabilities remain false except `validation_enabled`.
- `hermes_cli/web_server.py`
  - Added only protected POST route `POST /api/office/controlled-mutation/nas-evidence-package/validate`.
  - The route delegates to the pure validator using `payload: Any = Body(None)` so semantic validation/redaction remains in the helper.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_validate.py -q -o 'addopts='
# 9 passed in 0.49s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 119 passed in 1.13s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed

git diff --cached --check
# passed
```

Evidence package validate-only production safety scan:

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

## Safety / non-actions for evidence package validate-only DTO slice

No package creation, package persistence, evidence package persistence, storage/write path, NAS path resolution, NAS mount access, rollback point creation, actual NAS save/write/preparation runtime, audit write, event append, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## NAS Evidence Package Local Metadata Store RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_store.py`

The local metadata store RED tests define the approved boundary:

- Future append helper: `append_office_controlled_mutation_nas_evidence_package_event(...)`.
- Future readback helper: `list_office_controlled_mutation_nas_evidence_package_events(...)`.
- Future protected routes: `POST /api/office/controlled-mutation/nas-evidence-package` and `GET /api/office/controlled-mutation/nas-evidence-packages`.
- Storage is profile-scoped local JSONL only under `HERMES_HOME/office/controlled-mutation/nas-evidence-packages.jsonl`.
- Append validates with the existing safe DTO validator before writing, rejects unsupported raw fields without echo or write, rejects duplicate `package_ref` without a second write, and writes only one JSONL line per accepted DTO.
- Readback revalidates/normalizes stored records, supports safe `request_ref` filtering, clamps `limit` to 200, and skips malformed/invalid lines without raw echo.
- Capability flags keep NAS path resolution, NAS mount access, NAS write/save, storage write outside local metadata JSONL, evidence persistence to NAS, rollback point creation, credentials, audit write, event append, target mutation, authority binding, and dry-run execution disabled.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_store.py -q -o 'addopts='
# 5 failed, 1 passed in 0.50s
```

Expected RED failures were missing append/readback helper imports and missing POST store route returning 405.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added `_default_nas_evidence_package_store_path()`.
  - Added `_with_nas_evidence_package_persistence_capabilities(...)`.
  - Added `_normalize_stored_nas_evidence_package(...)` and `_read_nas_evidence_package_store(...)`.
  - Added `append_office_controlled_mutation_nas_evidence_package_event(...)`.
  - Added `list_office_controlled_mutation_nas_evidence_package_events(...)`.
- `hermes_cli/web_server.py`
  - Added protected `POST /api/office/controlled-mutation/nas-evidence-package`.
  - Added protected `GET /api/office/controlled-mutation/nas-evidence-packages`.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_store.py -q -o 'addopts='
# 6 passed in 0.44s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 125 passed in 1.11s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed

git diff --cached --check
# passed
```

Evidence package store production safety scan:

```text
hardcoded_secret_assignment: 0
shell_exec: 0
sql_format: 0
nas_path_resolution_or_mount_access: 0
credential_capability_enabled: 0
unapproved_mutation_routes: 0
```

Independent review: PASS, no security concern, logic error, or scope violation.

## Safety / non-actions for evidence package local metadata store slice

No NAS path resolution, NAS mount access, actual NAS save/write/preparation runtime, evidence file persistence to NAS, rollback point creation, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable control was performed.

## Frontend NAS Evidence Package Store Readback Status RED/GREEN

Changed frontend files:

- `web/src/pages/officeView.ts`
- `web/src/pages/OfficePage.tsx`
- `web/src/pages/OfficePage.test.ts`
- `web/src/pages/OfficePage.rpg.test.tsx`

The frontend-only RED tests define the approved boundary:

- Future helper: `buildOfficeNasEvidencePackageStoreReadbackStatus(...)`.
- Future panel: `NasEvidencePackageStoreReadbackStatusPanel`.
- Read-only `/office` status surface only; no backend/API/storage changes.
- Surface may display local metadata store/readback posture but must keep backendApiChanged/storageChanged false.
- Keep NAS path resolution, NAS mount access, NAS write/save, evidence file persistence, rollback point creation, credentials, audit write, dispatch/request/work-assignment, and browser executable controls disabled.
- Do not project raw prompt/task/transcript/path/provider/token values.

RED command/result:

```bash
npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx -t "NAS Evidence Package Store Readback Status|nas-evidence-package-store"
# 2 failed, 195 skipped
```

Expected RED failures were missing helper and missing panel.

GREEN implementation:

- `web/src/pages/officeView.ts`
  - Added `OfficeNasEvidencePackageStoreCapability` and `OfficeNasEvidencePackageStoreReadbackStatus`.
  - Added `buildOfficeNasEvidencePackageStoreReadbackStatus(...)`.
- `web/src/pages/OfficePage.tsx`
  - Added `NasEvidencePackageStoreReadbackStatusPanel`.
  - Added a memoized read-only status surface after rollback evidence preview.
- `web/src/pages/OfficePage.test.ts`
  - Added helper-level safety/flag/raw-leak coverage.
- `web/src/pages/OfficePage.rpg.test.tsx`
  - Added static markup coverage proving no form/button/input/select/textarea controls and no raw leaks.

GREEN verification:

```bash
npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx -t "NAS Evidence Package Store Readback Status|nas-evidence-package-store"
# 2 passed, 195 skipped

npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx
# 197 passed

npm run build
# passed; existing Vite large chunk warning only
```

Frontend production safety scan:

```text
changed_files_frontend_only: true
new_api_calls: 0
new_browser_storage_calls: 0
new_forms_or_controls: 0
backend_or_api_files_changed: 0
```

Independent review: PASS, no security concern, logic error, or scope violation.

## Safety / non-actions for frontend store/readback status slice

No backend/schema/API route/service change, storage change, browser API/storage use, forms/buttons/inputs/selects/textareas, NAS path resolution, NAS mount access, actual NAS save/write/preparation runtime, evidence file persistence to NAS, rollback point creation, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw private value projection was performed.

## NAS Path Resolution Contract RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_contract.py`

The path resolution contract RED tests define the approved boundary:

- Future helper: `build_office_controlled_mutation_nas_path_resolution_contract(...)`.
- Future protected route: `GET /api/office/controlled-mutation/nas-path-resolution/schema`.
- Contract metadata only: no path validation, runtime path resolution, vault mapping, mount discovery/access, filesystem read/write, NAS save/write, storage/readback, evidence persistence, rollback point creation, credentials, audit write, target mutation, or dry-run execution.
- No POST/PUT/PATCH/DELETE route on the schema path.
- Unsafe raw prompt/task/transcript/path/provider/token/credential/mount-command examples must not echo.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_contract.py -q -o 'addopts='
# 3 failed, 2 passed in 0.54s
```

Expected RED failures were missing helper imports and SPA HTML fallback for the missing protected route.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added `build_office_controlled_mutation_nas_path_resolution_contract(...)`.
- `hermes_cli/web_server.py`
  - Imported the helper.
  - Added protected `GET /api/office/controlled-mutation/nas-path-resolution/schema`.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_contract.py -q -o 'addopts='
# 5 passed in 0.43s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 130 passed in 1.11s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed
```

Path contract production safety scan:

```text
runtime_filesystem_or_mount_calls_added: 0
runtime_network_calls_added: 0
credential_capability_enabled: 0
storage_or_readback_added: 0
mutation_methods_added_for_schema_path: 0
```

Independent review: PASS, no security concern, logic error, or scope violation.

## Safety / non-actions for NAS path resolution contract slice

No path validation/runtime path resolution, NAS mount discovery/access, filesystem read/write, NAS save/write/preparation runtime, evidence file persistence, rollback point creation, storage/readback path, credential/auth/env change, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable control, or raw private value projection was performed.

## NAS Path Validation Validate-Only DTO RED/GREEN

Additional test file:

- `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_validate.py`

The path validation RED tests define the approved boundary:

- Future helper: `validate_office_controlled_mutation_nas_path_resolution(...)`.
- Future protected route: `POST /api/office/controlled-mutation/nas-path-resolution/validate`.
- Validate-only DTO: allowlisted safe opaque IDs, safe title, safe slug, and timestamp only.
- Runtime capabilities remain disabled: path resolution, vault mapping, mount discovery/access, filesystem read/write, NAS save/write, storage/readback, evidence persistence, rollback point creation, credentials, audit write, target mutation, authority binding, and dry-run execution.
- Unsupported raw prompt/task/transcript/path/provider/token/credential/mount-command values are rejected without echo.
- No schema mutation methods, persistence routes, readback routes, or NAS access.

RED command/result:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_validate.py -q -o 'addopts='
# 5 failed, 1 passed in 0.44s
```

Expected RED failures were missing helper/import and missing validate route. One test harness issue (`TestClient.delete(..., json=...)`) was fixed before GREEN.

GREEN implementation:

- `hermes_cli/office_controlled_mutation.py`
  - Added `_NAS_PATH_RESOLUTION_FIELDS` and `_SAFE_SLUG_RE`.
  - Tightened shared raw-marker rejection for `/mnt/`, `smb://`, and `mount -t`.
  - Added `validate_office_controlled_mutation_nas_path_resolution(...)`.
- `hermes_cli/web_server.py`
  - Imported the validator.
  - Added protected `POST /api/office/controlled-mutation/nas-path-resolution/validate`.

GREEN verification:

```bash
.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_validate.py -q -o 'addopts='
# 6 passed in 0.43s

.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='
# 136 passed in 1.11s

.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py
# passed

git diff --check
# passed
```

Path validation production safety scan:

```text
runtime_filesystem_or_mount_calls_added: 0
runtime_network_calls_added: 0
forbidden_runtime_capability_enabled: 0
storage_or_readback_added: 0
schema_mutation_methods_added: 0
```

Independent review: PASS, no blocking security concern, logic error, or scope violation. Minor note: the new raw markers tighten every validator using `_has_raw_marker`, not only this new validator.

## Safety / non-actions for NAS path validation slice

No runtime path resolution, vault mapping, NAS mount discovery/access, filesystem read/write, NAS save/write/preparation runtime, evidence file persistence, rollback point creation, storage/readback path, credential/auth/env change, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable control, or raw private value projection was performed.

## Next boundary

A separate explicit approval is required before any of:

- NAS path resolution or mount access.
- Actual NAS save/write/preparation runtime.
- Evidence file persistence to NAS.
- Rollback point creation.
- Credential/auth/env change.
- Target dispatch/runtime mutation.
- Real authority adapter binding/dispatch.
- Migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls.
