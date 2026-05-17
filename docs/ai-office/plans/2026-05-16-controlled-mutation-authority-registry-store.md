# Controlled Mutation Authority Adapter Registry Store 1

Date: 2026-05-16 10:04 KST

## Approved scope

The user explicitly approved only the authority adapter local safe registry/store boundary as:

> metadata record/readback only, no credentials/dispatch/target mutation

This slice adds local/profile-scoped metadata record/readback for authority adapter registry posture. It does not implement adapters, bind adapters, access credentials, dispatch, mutate targets, execute dry-runs, write audit events, or save to NAS.

## Implementation

Files changed:

- `hermes_cli/office_controlled_mutation.py`
- `hermes_cli/web_server.py`
- `tests/hermes_cli/test_office_controlled_mutation_authority_registry_store.py`

Implemented behavior:

- `validate_office_controlled_mutation_authority_adapter_registry_event(...)`
  - accepts only allowlisted registry metadata fields
  - validates adapter kind/postures against narrow safe vocabularies
  - rejects unsupported raw/credential/dispatch/path/provider fields without echo
  - rejects credential/private-like markers inside allowlisted text/ref/id fields without echo
  - returns a safe DTO with implementation/binding/dispatch/credential/target/dry-run/audit/NAS capabilities false
- `append_office_controlled_mutation_authority_adapter_registry_event(...)`
  - stores only validator-passing safe DTOs
  - writes to local Hermes-home JSONL: `HERMES_HOME/office/controlled-mutation/authority_adapters.jsonl`
  - rejects duplicate `adapter_ref` without a second write
- `list_office_controlled_mutation_authority_adapter_registry_events(...)`
  - revalidates/normalizes stored entries before returning them
  - skips malformed JSONL and invalid stored DTOs without raw echo
  - supports safe `adapter_kind` filtering
  - clamps `limit` to 200 and reports `skipped_count`
- Protected dashboard routes:
  - `POST /api/office/controlled-mutation/authority-adapter-registry`
  - `GET /api/office/controlled-mutation/authority-adapter-registry`

## Safety / non-actions

This slice does not add credential/auth/env access or changes, real adapter implementation, adapter binding, adapter dispatch, target mutation, dry-run execution, audit write, NAS save/write, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls.

## Verification

RED:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_authority_registry_store.py -q -o 'addopts='`
- Failed as expected before implementation: 7 failures on missing validator/append/readback helpers and missing protected POST route.

GREEN / hardening:

- Initial focused GREEN: `7 passed`
- Independent review found one blocking raw/private-data leak gap: `adapter_ref` and `authority_candidate_ref` accepted token/secret-like opaque IDs and echoed them in DTOs.
- Added regression coverage rejecting `secret_hunter2_adapter` and `token_hunter2_auth` without echo.
- Hardened `_is_opaque_id(...)` to reject `_has_raw_marker(...)` values.

Final verification:

- `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_authority_registry_store.py -q -o 'addopts='` → `8 passed`
- `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `91 passed`
- `.venv/bin/python -m py_compile hermes_cli/office_controlled_mutation.py hermes_cli/web_server.py` → passed
- `git diff --check` → passed
- Production diff safety scan → hardcoded_secret_assignment 0, shell_exec 0, sql_format 0, unauthorized PUT/PATCH/DELETE 0, forbidden capability enablement 0, intended registry POST route 1
- Final independent review → PASS, prior opaque-ID raw/private marker blocker fixed, no remaining blocking security concern, logic error, or scope violation

## Next approval boundary

Next real implementation still requires explicit approval:

- target dispatch/runtime mutation
- NAS save/write preparation
- credential/auth/env changes
- real authority adapter implementation/binding/dispatch
- migration
- VPS/NAS/Kanban/cron mutation
- deploy/restart/push/PR/merge
- browser executable controls
