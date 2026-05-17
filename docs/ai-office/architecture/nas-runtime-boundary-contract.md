# AI Office NAS Runtime Boundary Contract 1

Last updated: 2026-05-17 00:16 KST
Status: N2 runtime capability contract/helper + protected GET schema route is implemented locally after explicit approval. This document still does not approve local path mapping validation, runtime filesystem/NAS path resolution, NAS mount discovery/access, filesystem/NAS reads or writes, credential/auth/env changes, audit writes, target dispatch, deployments, service restarts, push/PR/merge, Kanban/cron/VPS mutation, or browser executable controls.

## Purpose

`NAS Runtime Boundary Contract 1` defines the NAS runtime gate ladder and now records the N2 contract-only implementation posture.

It defines what must be true before AI Office can ever move from safe NAS preparation/path-preview metadata into real filesystem/NAS runtime behavior. It is intentionally not an implementation plan for immediate runtime work. The current product remains safe projection + local metadata only.

## Current implemented baseline

The already implemented chain reaches only these safe states:

1. NAS save/write preparation contract metadata.
2. NAS save/write preparation validate-only DTO.
3. NAS evidence package contract, validate-only DTO, and local/profile-scoped metadata store/readback.
4. NAS path resolution contract, validate-only DTO, pure/local preview helper, and local/profile-scoped path-preview metadata store/readback.
5. `/office` read-only status surfaces for those already approved postures.

The current implementation still has no real filesystem/NAS path resolution runtime, vault mapping, mount discovery, mount access, filesystem read/write, NAS write, evidence file persistence, rollback point creation, credential access, audit write, target dispatch, real authority adapter binding, deployment, service restart, or browser executable control.

## Non-negotiable authority model

Real NAS runtime work is not a single permission. It is a ladder of separately approved gates:

| Gate | Name | Meaning | Requires separate explicit approval? |
| --- | --- | --- | --- |
| N0 | `contract_only` | Documentation/schema language only. No tests or production code. | current approved docs-only slice |
| N1 | `runtime_red_tests_only` | Failing tests describing future runtime contract. No production code. | yes |
| N2 | `runtime_capability_contract` | Pure helper/GET schema describing disabled runtime capabilities. No real filesystem or NAS access. | yes |
| N3 | `local_path_mapping_validate_only` | Side-effect-free validation of safe logical refs to allowed logical vault names. No OS path resolution. | yes |
| N4 | `runtime_path_resolution_dry_run` | Server-side dry-run that resolves only preconfigured local sandbox/relay-safe roots and reports safe metadata. No NAS mount access or writes. | yes |
| N5 | `mount_health_read_only` | Read-only mount/existence health checks through an approved relay/adapter. No directory traversal, raw listing, or file read. | yes |
| N6 | `evidence_package_files_dry_run` | Computes planned file package manifest and rollback plan. No writes. | yes |
| N7 | `single_package_write_with_rollback` | Writes exactly one approved evidence package through a bounded authority adapter with pre/post audit. | yes |

N0 is committed. N1 RED tests and N2 runtime capability contract are implemented locally after explicit approval. N3-N7 remain unapproved.

## Required runtime invariants before any future gate

Any future runtime gate must preserve these invariants:

- Browser never receives raw NAS paths, local paths, mount names, credentials, prompts, transcripts, task bodies, source bodies, provider names, tokens, shell commands, or numeric topic IDs.
- `/office` remains display-only until a separately approved browser-control gate exists; no approve/reject/save/write buttons are implied by this document.
- Runtime endpoints, if ever added, must be protected by the dashboard session-token boundary and must not live under public/plugin routes.
- Every request uses opaque safe refs and allowlisted DTO fields only.
- Unsupported or rejected values are reported via generic reason codes without echoing field names or raw values when they may contain private material.
- Every executable capability flag defaults to false and must be tested as false unless that exact capability is the approved gate.
- Direct VPS NAS mounts/direct NAS credentials remain excluded unless the user explicitly changes the standing architecture. Default path is Mac/WSL relay or prevalidated safe projection bundle, not raw NAS authority on the VPS.
- NAS/raw source material stays outside runtime prompts/logs/memory/skills and outside browser DTOs.
- A future write requires rollback planning, pre-write audit, post-write audit, duplicate/idempotency guard, and explicit human approval scoped to one package.

## N1 RED-test shape

N1 was approved on 2026-05-17 for RED tests only. Tests fail first and cover only expected future boundaries:

- import of a not-yet-existing runtime boundary helper;
- protected route behavior returns JSON when authenticated and 401 unauthenticated;
- POST/PUT/PATCH/DELETE rejected unless the exact method is explicitly approved;
- all runtime capabilities disabled by default;
- raw sentinel examples ignored/not echoed;
- no filesystem/NAS access during tests.

N1 test file: `tests/hermes_cli/test_office_controlled_mutation_nas_runtime_boundary_contract.py`.

Expected RED result: `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_runtime_boundary_contract.py -q -o 'addopts='` returned `3 failed, 2 passed in 0.45s` from missing future helper imports and authenticated route SPA HTML fallback.

## Minimal future implementation constraints

After N2, future implementation must proceed one gate at a time with TDD and a clean commit after each gate. Future implementation must not jump directly from local metadata/readback to N7 write runtime.

The default next technical recommendation after the N2 contract slice is N3 `local_path_mapping_validate_only` if the user wants another pure validation boundary. Any actual filesystem, NAS mount, or write behavior remains much later and separately gated.

## Verification for this docs-only slice

The N0 slice changed documentation only:

- `docs/ai-office/architecture/nas-runtime-boundary-contract.md`
- `docs/ai-office/NEXT.md`
- `docs/ai-office/STATUS.md`
- `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`

No tests or production code were changed or run as part of the docs/spec contract. Verification is limited to docs-only scope checks, Markdown/diff whitespace checks, and independent review.
