# Hermes AI Office — NEXT

Last updated: 2026-05-16 23:06 KST

## Start here after `/new`

1. Load relevant skills if needed:
   - `hermes-agent`
   - `writing-plans`
   - `plan` if staying planning-only
   - `kanban-orchestrator` only if creating/organizing board tasks is explicitly approved
2. Read this file.
3. Read `STATUS.md`.
4. Read the current umbrella docs first:
   - `docs/ai-office/product/unified-operating-workbench.md`
   - `docs/ai-office/architecture/unified-operating-workbench.md`
   - `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md`
   - `.hermes/plans/2026-05-14_082251-ai-office-unified-operating-workbench-plan.md`
   - `docs/ai-office/plans/2026-05-14-unified-operating-workbench-fresh-session-start.md`
5. If implementation or lower-level API context is separately approved, then read the older Stage 5 outputs:
   - `docs/ai-office/architecture/backend-api.md`
   - `docs/ai-office/architecture/data-adapters.md`
   - `docs/ai-office/architecture/frontend-components.md`
   - `docs/ai-office/architecture/test-plan.md`
   - `docs/ai-office/architecture/rollout-plan.md`
   - `docs/ai-office/architecture/pixel-renderer-adapter.md`
6. If needed for provenance/routing context, then read the Stage 4 outputs:
   - `docs/ai-office/design/topic-registry-spec.md`
   - `docs/ai-office/design/task-provenance-metadata.md`
   - `docs/ai-office/design/provenance-backfill.md`
   - `docs/ai-office/design/privacy-security.md`
7. If needed for product context, then read the Stage 3 outputs:
   - `docs/ai-office/product/user-stories.md`
   - `docs/ai-office/architecture/office-state-model.md`
   - `docs/ai-office/product/information-architecture.md`
   - `docs/ai-office/product/non-goals-and-mutation-boundary.md`
   - `docs/ai-office/product/mvp-acceptance-criteria.md`
8. Do not implement dashboard code unless the user explicitly approves an implementation stage.
9. Continue from the `Current next stage` below.

## Suggested `/goal` for a fresh session

Use `/goal` as a session-level guardrail and progress judge, not as the durable project memory. Durable state still lives in `STATUS.md`, `NEXT.md`, `DECISIONS.md`, `OPEN-QUESTIONS.md`, and stage output docs.

Default planning-mode goal:

```text
/goal Hermes AI Office / Pixel Agents style dashboard project를 구현하지 말고, 먼저 충분한 리서치·제품기획·아키텍처·단계별 실행계획·리스크·MVP 범위를 문서화한다. 각 단계는 STATUS/NEXT handoff를 남겨 /new 후에도 이어갈 수 있게 하고, 실제 코드 구현·서비스 재시작·설정 변경은 사용자가 명시적으로 승인하기 전까지 하지 않는다.
```

Stage 8/manual smoke goal suggestion, use only after explicit approval:

```text
/goal Hermes AI Office next stage를 승인된 범위 안에서 진행한다. 우선 Stage 8-A까지 완료된 read-only MVP diff와 /office 화면을 수동 smoke test하거나 다음 비픽셀 시각 polish를 한다. mutation controls, service restart, config/systemd change, Kanban/cron mutation, topic registry write, pixel renderer/dependency 추가는 하지 않는다. 검증 결과와 남은 open question을 STATUS/NEXT에 갱신한다.
```

When `/goal` is most useful:

1. Beginning a fresh `/new` session for one bounded stage, especially Stage 3–5 planning/design.
2. Long source-reading or synthesis sessions where the agent may otherwise drift into implementation.
3. Before any Stage 6+ implementation session, to enforce the approved scope and stop after the planned verification.
4. For multi-turn review loops: keep `/goal` active while drafting, reviewing, and tightening one deliverable set.

When not to rely on `/goal` alone:

1. Cross-session memory: use `STATUS.md`/`NEXT.md` instead.
2. Fine-grained coding task tracking: use a written plan and, after approval, Kanban/subagent workflow.
3. Background scheduled monitoring: use cron, not `/goal`.
4. Any mutation approval: `/goal` does not replace explicit user approval for code/config/service/Kanban/cron changes.

## Fresh-session /goal approval handoff

The user approved A-G approval buckets for future AI Office work while excluding H public exposure changes and permanently excluding VPS NAS mounts/direct NAS credentials/VPS direct NAS raw reads. Use the prepared prompt and guardrails in `docs/ai-office/plans/2026-05-13-goal-a-g-approval-handoff.md` for the next `/goal` session. A-G are permission buckets, not standalone tasks: the next session must first identify the exact concrete task list from current NEXT/STATUS/evidence before implementing.

## Current next stage

Current umbrella project: `AI Office Unified Operating Workbench` / `AI Office 통합 운영실`.

Treat AI Office/VPS dashboard, canonical VPS `ai-office` Kanban, Paperclip/sourceTags/Projection Pipeline, and the DeskRPG-like RPG Visualizer as one product. The operating model is:

```text
VPS ai-office Kanban = 운영 보드 / work state source of truth
Paperclip/sourceTags = 근거 레이어 / safe evidence context
Projection Cache = 안전 투영 캐시 / validated last-known-good display material
/office RPG Visualizer = RPG 운영실 / human-readable private dashboard
```

Authoritative Phase 0 umbrella docs:

- `docs/ai-office/product/unified-operating-workbench.md`
- `docs/ai-office/architecture/unified-operating-workbench.md`

Recent safe Desk RPG request/approval/NAS boundary slices are locally implemented through `NAS Path Preview Local Metadata Store 1` in `web/src/pages/officeView.ts` and `web/src/pages/OfficePage.tsx`, with focused coverage in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. `/office` now renders the safe chain from Boss/Orchestrator request posture through disabled envelope, approval route, event contract/timeline, worker handoff, approval/NAS boundary, approval-authority readiness, disabled approve/reject/hold decision-envelope preview, projected post-decision audit/NAS trace preview, projected NAS Keeper save request gate, projected rollback/evidence package preview, frontend-only local metadata store/readback status surface, frontend-only NAS path validation status surface, frontend-only NAS path preview status surface, and protected local/profile-scoped NAS path preview metadata store/readback. Stable hooks include `data-office-boss-orchestrator-request-posture-detail*`, `data-office-orchestrator-request-envelope-detail*`, `data-office-approval-request-route-detail*`, `data-office-event-request-contract-projection*`, `data-office-approval-dialogue-route-inspector*`, `data-office-event-timeline-projection*`, `data-office-timeline-worker-handoff-drilldown*`, `data-office-approval-request-detail-deepening*`, `data-office-worker-facility-lane-polish*`, `data-office-worker-request-handoff-detail*`, `data-office-approval-nas-boundary-polish*`, `data-office-approval-nas-boundary-card*`, `data-office-approval-authority-readiness*`, `data-office-approval-authority-decision-envelope*`, `data-office-approval-decision-audit-nas-trace*`, `data-office-nas-keeper-save-request-gate*`, `data-office-nas-keeper-rollback-evidence*`, `data-office-nas-evidence-package-store*`, and `data-office-nas-path-validation*`, `data-office-nas-path-preview*`, plus backend protected `POST /api/office/controlled-mutation/nas-path-resolution/preview-store` and `GET /api/office/controlled-mutation/nas-path-resolution/previews`. The chain remains projection-only: no backend/schema/API route/service/Kanban/cron/VPS/NAS mutation, no forms/buttons/inputs, no approve/reject/hold decision record, no save request persistence, no rollback point creation, no rollback evidence persistence, no backend/API/storage change in the frontend status surfaces, no browser storage/API call, no worker assignment/dispatch, no audit event append, no NAS trace persistence, no NAS write preparation, no NAS save, and no raw prompt/task body/transcript/path/token/provider projection.

Master Spec v0.1 follow-up: read `docs/ai-office/plans/2026-05-14-desk-rpg-master-spec-review.md` before choosing the next work. It reframes read-only-first as the first safety posture, not the permanent product ceiling. The completed product-contract sequence is `Desk RPG Product Vision 1` → `Desk RPG Projection Model 1` → `Desk RPG IA/Layout 1` → `Controlled Mutation & Approval Model 1`; `Implementation Roadmap 1` reconciled those contracts into the first safe implementation sequence; `Desk RPG Projection ViewModel Helper 1` provides the pure helper foundation; `Desk RPG Room Shell 1` renders it as the read-only operating-room shell; `Desk RPG Inspector Migration 1` bridges aggregate safe details into the right inspector; `Desk RPG Board Evidence Tab 1` migrates aggregate board/evidence posture into the central board; `Desk RPG Boss Command Console 1` makes the 사장/user-avatar instruction point visible as disabled Orchestrator-mediated posture; `Desk RPG Worker Role Visibility 1` makes the worker/search/reviewer/wiki-writer/NAS-keeper role set visible without assignment or dispatch; `Disabled Approval Dialogue Posture 1` makes the Orchestrator → 사장 approval wait dialogue visible without approve/reject/hold/request/dispatch/NAS save controls; `Reviewer/Wiki Handoff Posture 1` makes the Search Worker → Reviewer → Wiki Writer → NAS Keeper handoff order visible without review execution, draft creation, assignment, request creation, dispatch, or NAS save controls; `Approval Dialogue Inspector Detail 1` makes the approval dialogue and reviewer/wiki handoff inspectable as safe detail cards without decisions, audit writes, or persistence; `Reviewer/Wiki Evidence Detail Posture 1` makes reviewer/wiki evidence aggregates inspectable without source opening, review execution, draft creation, audit writes, or NAS save; `Board Evidence-to-Inspector Drill-down 1` connects central board/evidence aggregate to right-inspector detail without board/source opening, inspector writes, request creation, audit writes, or NAS save; `Boss/Orchestrator Request Posture Detail 1` makes the 사장 instruction point, Orchestrator mediation, disabled request envelope, and approval boundary inspectable without input, request creation, worker assignment, dispatch, audit write, or NAS save; `Orchestrator Request Envelope Detail 1` makes the disabled envelope preview, safe context aggregate, Kanban write boundary, and approval request boundary inspectable without envelope creation, Kanban write, worker assignment, dispatch, audit write, or NAS save; `Approval Request Route Detail 1` makes the future UserInstructionSubmitted → OrchestratorPlanRequested → ApprovalRequested route inspectable without event creation, approval request creation, Kanban write, audit write, dispatch, or NAS save; `Event Request Contract Projection 1` makes the future event contract names and write/audit boundaries visible without schema write, event creation, event persistence, runtime dispatch, audit write, or NAS save; `Approval Dialogue Route Inspector 1` makes the dialogue/route/event-contract chain inspectable without decisions, request creation, event creation, persistence, dispatch, audit write, or NAS save; `Event Timeline Projection 1` makes the projected request→orchestrator→approval→NAS-save-approval-pending sequence visible without runtime event write, intent/visual event creation, persistence, timeline append, audit write, dispatch, or NAS save; `Timeline/Worker Handoff Drill-down 1` makes the safe event-to-worker handoff visible without drill-down writes, assignment, request creation, dispatch, audit write, or NAS save; `Approval-request Detail Deepening 1` makes request/timeline/worker detail visible without decisions, event/request creation, assignment, dispatch, audit write, or NAS save; `Worker Facility Lane Polish 1` makes worker facility prerequisites visible without facility writes, assignments, request creation, dispatch, audit write, or NAS save; `Worker Request Handoff Detail 1` connects approval request detail to worker lane posture without request creation, assignment, dispatch, audit write, or NAS save; and the next step should stay frontend-only/read-only before any executable control.

Current local slice: `NAS Path Preview Local Metadata Store 1` is implemented locally after explicit approval for `local metadata store/readback for path preview DTO only; no filesystem/NAS access`. It adds `append_office_controlled_mutation_nas_path_resolution_preview_event(...)` and `list_office_controlled_mutation_nas_path_resolution_preview_events(...)` in `hermes_cli/office_controlled_mutation.py`, protected dashboard routes `POST /api/office/controlled-mutation/nas-path-resolution/preview-store` and `GET /api/office/controlled-mutation/nas-path-resolution/previews` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_preview_store.py`. The store is local/profile-scoped only at `HERMES_HOME/office/controlled-mutation/nas-path-resolution-previews.jsonl`, appends only preview-validator-backed allowlisted safe metadata DTOs, rejects unsupported raw/private fields without write or echo, rejects duplicate `safe_logical_path` without a second write, clamps readback `limit` to 200, supports safe `package_ref` filtering, and skips malformed/invalid JSONL records without raw echo. Verification passed 2026-05-16 23:06 KST: RED first failed with missing helpers and missing store route (`6 failed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_preview_store.py -q -o 'addopts='` → `6 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `147 passed`; `py_compile`, `git diff --check`, production safety scan, and independent review PASS. This slice still does not do runtime filesystem path resolution, vault mapping, NAS mount discovery/access, filesystem/NAS read/write, actual NAS save/write/preparation runtime, evidence file persistence, rollback point creation, credential access, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `Frontend NAS Path Preview Status Surface 1` is implemented locally as a frontend-only/read-only continuation of the approved pure/local preview helper. It adds `buildOfficeNasPathPreviewStatusSurface(...)` and the `OfficeNasPathPreviewStatusSurface` DTO in `web/src/pages/officeView.ts`, renders `NasPathPreviewStatusSurfacePanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The surface shows validationEnabled=true and previewEnabled=true for the already-approved preview posture while keeping frontendOnly=true, backendApiChanged=false, storageChanged=false, pathResolutionRuntimeEnabled=false, vaultMappingEnabled=false, mountDiscoveryEnabled=false, nasMountAccessEnabled=false, filesystemReadEnabled=false, filesystemWriteEnabled=false, nasWriteEnabled=false, evidenceFilePersistenceEnabled=false, rollbackPointCreated=false, credentialAccessEnabled=false, auditWriteEnabled=false, dispatch/request/work-assignment false, safeProjectionOnly=true, rawExcluded=true, and enabledControls=0. Verification passed 2026-05-16 22:48 KST: RED first failed with missing helper/panel (`2 failed`); GREEN focused `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx -t "NAS Path Preview Status Surface|nas-path-preview"` → `2 passed`; full Office frontend `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx` → `201 passed`; `npm run build` passed with existing Vite large chunk warning only; `git diff --check` passed; production frontend safety scan found no new API calls/browser storage/forms/buttons/inputs/selects/textareas/handlers; changed-file scope stayed frontend-only; independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add backend/schema/API routes/services, storage changes, browser API/storage calls, forms/buttons/inputs, runtime filesystem path resolution, vault mapping, mount discovery/access, filesystem/NAS read/write, actual NAS save/write/preparation runtime, evidence file persistence, rollback point creation, credential/auth/env change, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `NAS Path Resolution Preview 1` is implemented locally after explicit approval for `pure/local NAS path resolution preview helper + protected POST /preview; no mount/read/write/filesystem access`. It adds `preview_office_controlled_mutation_nas_path_resolution(...)` in `hermes_cli/office_controlled_mutation.py`, protected dashboard route `POST /api/office/controlled-mutation/nas-path-resolution/preview` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_preview.py`. The preview first reuses the validate-only DTO, then derives safe logical/display path strings from validated opaque `target_vault_ref` and safe `safe_slug` only; it returns `mode: previewed_nas_path_resolution`, validationEnabled=true, path_resolution_preview_enabled=true, while path_resolution_runtime_enabled, vault_mapping_enabled, mount_discovery_enabled, mount_access_enabled, filesystem_read/write, NAS save/write, evidence persistence, rollback point creation, storage write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution stay false. Verification passed 2026-05-16 22:41 KST: RED first failed with missing helper and missing preview route (`3 failed, 2 passed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_preview.py -q -o 'addopts='` → `5 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `141 passed`; `py_compile`, `git diff --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add runtime filesystem path resolution, vault mapping, mount discovery/access, filesystem/NAS read/write, storage/readback, actual NAS save/write/preparation runtime, evidence file persistence, rollback point creation, credential/auth/env change, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `Frontend NAS Path Validation Status Surface 1` is implemented locally as a frontend-only/read-only continuation of the approved validate-only DTO. It adds `buildOfficeNasPathValidationStatusSurface(...)` and the `OfficeNasPathValidationStatusSurface` DTO in `web/src/pages/officeView.ts`, renders `NasPathValidationStatusSurfacePanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The surface shows validationEnabled=true for the already-approved validate-only DTO posture while keeping frontendOnly=true, backendApiChanged=false, storageChanged=false, pathResolutionRuntimeEnabled=false, vaultMappingEnabled=false, mountDiscoveryEnabled=false, nasMountAccessEnabled=false, filesystemReadEnabled=false, filesystemWriteEnabled=false, nasWriteEnabled=false, evidenceFilePersistenceEnabled=false, rollbackPointCreated=false, credentialAccessEnabled=false, auditWriteEnabled=false, dispatch/request/work-assignment false, safeProjectionOnly=true, rawExcluded=true, and enabledControls=0. Verification passed 2026-05-16 22:34 KST: RED first failed with missing helper/panel (`2 failed`); GREEN focused `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx -t "NAS Path Validation Status Surface|nas-path-validation"` → `2 passed`; full Office frontend `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx` → `199 passed`; `npm run build` passed with existing Vite large chunk warning only; `git diff --check` passed; production frontend safety scan found no new API calls/browser storage/forms/buttons/inputs/selects/textareas/handlers; changed-file scope stayed frontend-only; independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add backend/schema/API routes/services, storage changes, browser API/storage calls, forms/buttons/inputs, runtime path resolution, vault mapping, mount discovery/access, filesystem/NAS read/write, actual NAS save/write/preparation runtime, evidence file persistence, rollback point creation, credential/auth/env change, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `NAS Path Validation Validate-Only DTO 1` is implemented locally after explicit approval for `NAS path validation validate-only DTO + protected POST /validate; no resolution/mount/read/write/runtime`. It adds `validate_office_controlled_mutation_nas_path_resolution(...)` in `hermes_cli/office_controlled_mutation.py`, protected dashboard route `POST /api/office/controlled-mutation/nas-path-resolution/validate` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_validate.py`. The validator accepts only allowlisted safe opaque IDs, safe title, safe slug, and timestamp fields; rejects unsupported raw/private fields without echo; and returns `mode: validated_nas_path_resolution` DTOs with validation enabled while keeping path resolution, vault mapping, mount discovery/access, filesystem read/write, NAS save preparation/save/write, evidence file persistence, rollback point creation, storage write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution disabled. Verification passed 2026-05-16 22:24 KST: RED first failed with missing helper/import and missing validate route (`5 failed, 1 passed` after test harness fix); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_validate.py -q -o 'addopts='` → `6 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `136 passed`; `py_compile`, `git diff --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add runtime path resolution, vault mapping, mount discovery/access, filesystem/NAS read/write, storage/readback, evidence file persistence, rollback point creation, credential access, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `NAS Path Resolution Contract 1` is implemented locally after explicit approval for `NAS path resolution contract-only helper + protected GET schema; no mount/read/write/runtime`. It adds `build_office_controlled_mutation_nas_path_resolution_contract(...)` in `hermes_cli/office_controlled_mutation.py`, protected dashboard route `GET /api/office/controlled-mutation/nas-path-resolution/schema` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_contract.py`. The contract describes future path resolution metadata only and keeps path validation, NAS path resolution, vault mapping, mount discovery, NAS mount access, filesystem read/write, NAS save preparation/save/write, evidence file persistence, rollback point creation, storage write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution disabled. Verification passed 2026-05-16 13:08 KST: RED first failed with missing helper and SPA HTML fallback for the future route (`3 failed, 2 passed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_path_resolution_contract.py -q -o 'addopts='` → `5 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `130 passed`; `py_compile`, `git diff --check`, refined production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add mount discovery/access, filesystem/NAS read/write, storage/readback, path validation/resolution runtime, credential access, audit write, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, browser executable controls, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `Frontend NAS Evidence Package Store Readback Status 1` is implemented locally after explicit approval for `frontend-only/read-only NAS evidence package store/readback status surface; no backend/API/storage changes`. It adds `buildOfficeNasEvidencePackageStoreReadbackStatus(...)` and the `OfficeNasEvidencePackageStoreReadbackStatus` DTO in `web/src/pages/officeView.ts`, renders `NasEvidencePackageStoreReadbackStatusPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The surface is read-only display of the already-approved local metadata JSONL store/readback posture: it shows local metadata store enabled and safe readback enabled, while keeping backendApiChanged=false, storageChanged=false, nasPathResolutionEnabled=false, nasMountAccessEnabled=false, nasWriteEnabled=false, evidenceFilePersistenceEnabled=false, rollbackPointCreated=false, credentialAccessEnabled=false, auditWriteEnabled=false, dispatch/request/work-assignment false, safeProjectionOnly=true, rawExcluded=true, and enabledControls=0. Verification passed 2026-05-16 13:01 KST: RED first failed with missing helper/panel (`2 failed`); GREEN focused `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx -t "NAS Evidence Package Store Readback Status|nas-evidence-package-store"` → `2 passed`; full Office frontend `npm test -- --run OfficePage.test.ts OfficePage.rpg.test.tsx` → `197 passed`; `npm run build` passed with existing Vite large chunk warning only; production frontend safety scan found no new API calls/browser storage/forms/buttons/inputs/selects/textareas; changed-file scope stayed frontend-only; independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not add backend/schema/API routes/services, storage changes, browser API/storage calls, forms/buttons/inputs, NAS path resolution, NAS mount access, actual NAS save/write runtime, evidence persistence to NAS, rollback point creation, credential access, audit write, target dispatch/runtime mutation, authority binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw prompt/task/transcript/path/token/provider projection.

Previous local slice: `NAS Evidence Package Local Metadata Store 1` is implemented locally after explicit approval for `NAS evidence package local metadata store/readback; profile-scoped JSONL only, no NAS path/mount/write runtime`. It adds `append_office_controlled_mutation_nas_evidence_package_event(...)` and `list_office_controlled_mutation_nas_evidence_package_events(...)` in `hermes_cli/office_controlled_mutation.py`, protected dashboard routes `POST /api/office/controlled-mutation/nas-evidence-package` and `GET /api/office/controlled-mutation/nas-evidence-packages` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_store.py`. The store is local/profile-scoped only at `HERMES_HOME/office/controlled-mutation/nas-evidence-packages.jsonl`, appends only validator-backed allowlisted safe metadata DTOs, rejects unsupported raw/private fields without write or echo, rejects duplicate `package_ref` without a second write, clamps readback `limit` to 200, supports safe `request_ref` filtering, and skips malformed/invalid JSONL records without raw echo. Verification passed 2026-05-16 12:44 KST: RED first failed with missing helpers and POST route returning 405 (`5 failed, 1 passed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_store.py -q -o 'addopts='` → `6 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `125 passed`; `py_compile`, `git diff --check`, `git diff --cached --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`. This slice still does not do NAS path resolution, NAS mount access, actual NAS save/write runtime, evidence persistence to NAS, rollback point creation, credential access, audit write, target mutation, authority binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls. Next step requires separate explicit approval before NAS path resolution/mount access, actual NAS save/write/preparation runtime, evidence file persistence, rollback point creation, credential/auth/env change, target dispatch/runtime mutation, real authority adapter binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `NAS Evidence Package Validate-Only DTO 1` is implemented locally after explicit approval for `NAS evidence package validate-only DTO + protected POST /validate; no persistence/storage/write/NAS access`. It adds `validate_office_controlled_mutation_nas_evidence_package(...)` in `hermes_cli/office_controlled_mutation.py` and protected dashboard route `POST /api/office/controlled-mutation/nas-evidence-package/validate` in `hermes_cli/web_server.py`. The validator accepts only allowlisted safe refs/text/list/timestamp fields, returns sanitized error codes without raw echo, and produces `mode: validated_nas_evidence_package` DTOs with validation enabled while keeping package creation, package persistence, evidence persistence, storage write, NAS path resolution, NAS mount access, rollback point creation, NAS save preparation/save/write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution false. Verification passed 2026-05-16 12:31 KST: RED first failed with missing helper and missing POST route (`7 failed, 2 passed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_validate.py -q -o 'addopts='` → `9 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `119 passed`; `py_compile`, `git diff --check`, `git diff --cached --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`.

Previous local slice: `NAS Evidence Package Contract 1` is implemented locally after explicit approval for `NAS evidence package contract-only helper + protected GET schema route; no POST/storage/write/NAS access`. It adds `build_office_controlled_mutation_nas_evidence_package_contract(...)` in `hermes_cli/office_controlled_mutation.py` and protected dashboard route `GET /api/office/controlled-mutation/nas-evidence-package/schema` in `hermes_cli/web_server.py`. The contract describes future package metadata only while keeping package validation, package creation, package persistence, evidence persistence, rollback point creation, storage write, NAS path resolution, NAS mount access, NAS save preparation, NAS save/write, credential access, audit write, event append, target mutation, authority binding, and dry-run execution disabled. Verification passed 2026-05-16 12:17 KST: RED first failed with missing helper and SPA HTML fallback for the future route (`3 failed, 2 passed`); GREEN focused `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_evidence_package_contract.py -q -o 'addopts='` → `5 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `110 passed`; `py_compile`, `git diff --check`, `git diff --cached --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`.

Previous local slice: `NAS Save/Write Preparation Validate-Only DTO 1` is implemented locally after explicit approval for `NAS preparation DTO validation only — pure validator + validate-only protected POST; no persistence/write/NAS access`. It adds `validate_office_controlled_mutation_nas_save_preparation(...)` in `hermes_cli/office_controlled_mutation.py` and protected dashboard route `POST /api/office/controlled-mutation/nas-save-preparation/validate` in `hermes_cli/web_server.py`. The validator accepts only allowlisted safe refs/text/timestamp fields, returns sanitized error codes without raw echo, and produces `mode: validated_nas_save_preparation` DTOs with validation enabled while keeping request creation, persistence, storage write, NAS path resolution, NAS mount access, evidence persistence, rollback point creation, NAS preparation/save/write, credential access, audit write, target mutation, authority binding, and dry-run execution false. Verification passed 2026-05-16 11:55 KST: RED first failed with missing helper and missing POST route; GREEN focused NAS preparation validate `.venv/bin/python -m pytest tests/hermes_cli/test_office_controlled_mutation_nas_save_preparation_validate.py -q -o 'addopts='` → `9 passed`; combined Office API + controlled-mutation `.venv/bin/python -m pytest tests/hermes_cli/test_office_api.py tests/hermes_cli/test_office_controlled_mutation_*.py -q -o 'addopts='` → `105 passed`; `py_compile`, `git diff --check`, `git diff --cached --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`.

Previous local slice: `NAS Save/Write Preparation Contract Implementation 1` is implemented locally after explicit approval for `pure helper + protected GET schema route only; no POST/PUT/PATCH/DELETE, no storage/write/NAS access`. It adds `build_office_controlled_mutation_nas_save_preparation_contract(...)` in `hermes_cli/office_controlled_mutation.py` and protected dashboard route `GET /api/office/controlled-mutation/nas-save-preparation/schema` in `hermes_cli/web_server.py`. It keeps every NAS/write/credential/dispatch/audit/storage capability false, ignores unsafe examples without echo, and adds no write path, NAS path resolution, NAS mount access, evidence persistence, rollback point creation, actual NAS save/write, credential/auth/env change, target dispatch, real authority adapter binding, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls. Verification passed 2026-05-16 11:39 KST: focused NAS preparation contract `5 passed`, combined Office API + controlled-mutation `96 passed`, `py_compile`, `git diff --check`, `git diff --cached --check`, production safety scan, and independent review PASS. Evidence: `docs/ai-office/plans/2026-05-16-nas-save-preparation-red-tests.md`.

Previous local slice: `Controlled Mutation Safe Continuation Completion Review 1` is implemented as a frontend-only/read-only phase-boundary completion review. It sets `readOnlyTargetLevelReached=true`, `nextRequiresExplicitApproval=true`, `enabledControls=0`, shows 7 completed safe/forbidden frontend chain entries, and names the explicit approval boundaries `nas_save_write_preparation`, `credential_auth_env_change`, `real_authority_adapter_binding`, and `target_dispatch_runtime`. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-safe-continuation-completion-review.md`. It added no forms/buttons/inputs, backend/schema/API route/service changes, storage/write paths, event append/readback, audit writes, execution/dry-run/dispatch/target mutation, real authority adapter binding, credential/auth/env changes, migrations, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw private value projection.

Previous local slice: `Controlled Mutation Target Dispatch Forbidden Boundary 1` is implemented after the user selected `Target dispatch/runtime mutation은 아직 금지하고 frontend-only/read-only fallback posture만 계속`. This is a frontend-only/read-only continuation, not target dispatch approval. It adds `buildOfficeControlledMutationTargetDispatchForbiddenBoundary(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationTargetDispatchForbiddenBoundaryPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel records `target_dispatch_runtime` as `forbidden_by_user`, shows continuation/approval boundaries (`frontend_readonly_fallback_continue`, `nas_save_write_preparation`, `credential_auth_env_change`, `real_authority_adapter_binding`), and keeps enabledControls=0 plus approval/dispatch/target/dry-run/execution/authority-binding/credential/NAS/deploy/push flags false. It adds no forms/buttons/inputs, browser executable controls, network/browser storage APIs, backend/schema/API route/service changes, storage/write paths, event append/readback, audit writes, execution/dry-run/dispatch/target mutation, real authority adapter implementation/binding, credential/auth/env changes, migrations, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw private value projection. Verification passed: RED raw-leak sentinel failure fixed by tightening generic copy, GREEN focused `2 passed`, full Office frontend `193 passed`, App `3 passed`, backend Office API + controlled-mutation `91 passed`, ESLint, build with existing Vite large chunk warning only, `git diff --check`, production safety scan, browser smoke `/office?target-dispatch-forbidden=1`, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-target-dispatch-forbidden-boundary.md`. Next boundary requiring explicit approval: NAS save/write preparation, credential/auth/env changes, real authority adapter implementation/binding/dispatch, target dispatch/runtime mutation, migration, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Post Registry Approval Boundary 1` is implemented as the safe frontend-only/read-only fallback after the next approval prompt timed out following `Controlled Mutation Authority Adapter Registry Store 1`. It adds `buildOfficeControlledMutationPostRegistryApprovalBoundary(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationPostRegistryApprovalBoundaryPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel shows six completed local subsets (`request_store_hardening`, `human_decision_store`, `dry_run_result_storage`, `audit_append_sink`, `authority_binding_contract`, `authority_adapter_registry`) and four `approval_required` next boundaries (`target_dispatch_runtime`, `nas_save_write_preparation`, `credential_auth_env_change`, `real_authority_adapter_binding`). It adds no forms/buttons/inputs, browser executable controls, network/browser storage APIs, backend/schema/API route/service changes, storage/write paths, event append/readback, audit writes, execution/dry-run/dispatch/target mutation, real authority adapter implementation/binding, credential/auth/env changes, migrations, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw private value projection. Verification passed: RED missing-helper/panel failure, GREEN focused `2 passed`, full Office frontend `191 passed`, App `3 passed`, backend Office API + controlled-mutation `91 passed`, ESLint, build with existing Vite large chunk warning only, `git diff --check`, production safety scan, browser smoke `/office?post-registry-boundary=1`, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-post-registry-approval-boundary.md`. Next boundary requiring explicit approval: target dispatch/runtime mutation, NAS save/write preparation, credential/auth/env changes, real authority adapter implementation/binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Authority Adapter Registry Store 1` is implemented after explicit approval for authority adapter local safe registry/store as `metadata record/readback only, no credentials/dispatch/target mutation`. It adds safe authority adapter registry metadata validation, local profile-scoped JSONL append/readback helpers, protected dashboard routes `POST /api/office/controlled-mutation/authority-adapter-registry` and `GET /api/office/controlled-mutation/authority-adapter-registry`, and regression tests. The registry store accepts only allowlisted safe metadata DTOs, rejects unsupported raw credential/dispatch/path/provider fields without echo, rejects credential/private-like markers inside allowlisted text/ref/id fields without echo, rejects duplicate `adapter_ref` without a second write, exposes safe `adapter_kind` filtering, reports clamped `limit` plus `skipped_count`, and skips malformed JSONL/invalid DTO entries without raw echo. It does not access credentials, implement/bind/dispatch adapters, mutate targets, execute dry-runs, write audit events, or save to NAS. Verification passed: RED missing-helper/route failures, initial GREEN focused `7 passed`, independent review blocker on raw/private markers in opaque IDs fixed via regression and `_is_opaque_id(...)` hardening, final focused `8 passed`, combined Office API + controlled-mutation `91 passed`, py_compile, `git diff --check`, production safety scan, and final independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-authority-registry-store.md`. Next boundary requiring explicit approval: target dispatch/runtime mutation, NAS save/write preparation, credential/auth/env changes, real authority adapter implementation/binding/dispatch, migration, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Authority Binding Contract 1` is implemented after explicit approval for authority adapter implementation/binding design/contract only with `no credentials/dispatch/target mutation`. It adds pure `build_office_controlled_mutation_authority_binding_contract(...)` contract metadata and regression tests. The helper returns `mode: authority_binding_contract_only`, describes future binding/adapter field requirements, keeps every implementation/binding/dispatch/registry/credential/target/dry-run/audit/event/request/decision/NAS capability false, exposes no adapter/binding/storage endpoints, and ignores unsafe examples without raw echo. It adds no API route, storage/write/readback path, adapter implementation, adapter binding, adapter registry, credential/auth/env access/change, dispatch, target mutation, dry-run execution, audit write, NAS save/write, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or browser executable controls. Verification passed: RED missing-helper failure, GREEN focused `3 passed`, combined Office API + controlled-mutation `83 passed`, py_compile, `git diff --check`, production safety scan, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-authority-binding-contract.md`. Next boundary requiring explicit approval: authority adapter local safe registry/store, target mutation/dispatch, NAS save/write preparation, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Audit Append Store 1` is implemented after explicit approval for audit append sink/runtime as `audit event append/readback only, no execution/target mutation`. It adds safe audit event validation, local profile-scoped JSONL append/readback helpers, protected dashboard routes `POST /api/office/controlled-mutation/audit` and `GET /api/office/controlled-mutation/audit`, and regression tests. The store accepts only allowlisted safe audit DTOs, rejects raw logs/commands/paths/providers/tokens without echo, rejects credential/private-like markers inside allowlisted text/ref fields without echo, rejects duplicate `audit_id` without a second write, exposes safe request/correlation/event-kind filters, reports clamped `limit` plus `skipped_count`, and skips malformed JSONL/invalid DTO entries without raw echo. It does not execute dry-runs, bind authority adapters, dispatch, mutate targets, or save to NAS. Verification passed: RED missing-helper/route failures, GREEN focused `9 passed`, combined Office API + controlled-mutation `80 passed`, py_compile, `git diff --check`, production safety scan, and final independent review after hardening two credential-marker gaps. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-audit-append-store.md`. Next boundary requiring explicit approval: authority adapter implementation/binding, target mutation/dispatch, NAS save/write preparation, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Dry-Run Result Store 1` is implemented after explicit approval for dry-run execution/result storage as `simulation result record/readback only, no real execution/target mutation`. It adds safe dry-run result validation, local profile-scoped JSONL append/readback helpers, protected dashboard routes `POST /api/office/controlled-mutation/dry-run-result` and `GET /api/office/controlled-mutation/dry-run-results`, and regression tests. The store accepts only allowlisted safe result DTOs, rejects raw outputs/commands/paths/providers/tokens without echo, rejects duplicate `result_id` and duplicate `request_id` results without a second write, exposes safe request/correlation filters, reports clamped `limit` plus `skipped_count`, and skips malformed JSONL/invalid DTO entries without raw echo. It does not execute dry-runs or mutate targets. Verification passed: RED missing-helper/route failures, GREEN focused `8 passed`, combined Office API + controlled-mutation `71 passed`, py_compile, `git diff --check`, production safety scan, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-dry-run-result-store.md`. Next boundary requiring explicit approval: audit append sink/runtime, authority adapter implementation/binding, target mutation/dispatch, NAS save/write preparation, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Post Decision Approval Boundary 1` is implemented as the safe no-approval fallback after the next backend/write approval prompt timed out. It adds `buildOfficeControlledMutationPostDecisionApprovalBoundary(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationPostDecisionApprovalBoundaryPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel shows completed local subsets for `request_store_hardening` and `human_decision_store`, while keeping `dry_run_result_storage`, `audit_append_sink`, `authority_adapter_binding`, and `target_dispatch_runtime` as `approval_required`. It adds no forms/buttons/inputs, browser executable controls, network/browser storage APIs, backend/schema/API route/service changes, storage/write paths, audit writes, dry-run execution, dispatch, target mutation, authority adapter binding, credential/auth/env changes, migrations, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, or raw private value projection. Verification passed: RED missing-helper/panel failure, GREEN focused `2 passed`, full Office frontend `189 passed`, App `3 passed`, backend Office API + controlled-mutation `63 passed`, ESLint with existing unrelated warnings only, build with existing large chunk warning only, `git diff --check`, production safety scan, browser smoke `/office?post-decision-boundary=1`, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-post-decision-approval-boundary.md`. Next boundary requiring explicit approval: dry-run execution/result storage, audit append sink/runtime, authority adapter implementation/binding, target mutation/dispatch, NAS save/write preparation, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Human Decision Store 1` is implemented after explicit approval for human-decision recording contract/store only. It adds safe decision validation, local profile-scoped JSONL append/readback helpers, protected dashboard routes `POST /api/office/controlled-mutation/decision` and `GET /api/office/controlled-mutation/decisions`, and regression tests. The store accepts only approve/reject/hold allowlisted decision DTOs, rejects raw comments/prompts/paths/providers/tokens without echo, rejects duplicate `decision_id` and duplicate `request_id` decisions without a second write, exposes safe request/correlation filters, reports clamped `limit` plus `skipped_count`, and skips malformed JSONL/invalid DTO entries without raw echo. Verification passed: RED missing-helper/route failures, GREEN focused `11 passed`, combined Office API + controlled-mutation `63 passed`, py_compile, `git diff --check`, production safety scan, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-human-decision-store.md`. Next boundary requiring explicit approval: dry-run execution/result storage, audit append sink/runtime, authority adapter implementation/binding, target mutation/dispatch, NAS save/write preparation, VPS/NAS/Kanban/cron mutation, deploy/restart/push/PR/merge, or browser executable controls.

Previous local slice: `Controlled Mutation Request Store Hardening 1` is implemented after explicit approval for request-store hardening only. It updates `append_office_controlled_mutation_request_event(...)` and `list_office_controlled_mutation_request_events(...)` in `hermes_cli/office_controlled_mutation.py`, extends the existing protected `GET /api/office/controlled-mutation/requests` route with safe `correlation_id` filtering, and covers the behavior in `tests/hermes_cli/test_office_controlled_mutation_request_event.py`. Implemented hardening is limited to duplicate `request_id` detection without a second write, safe correlation readback filtering, effective `limit` reporting/clamping, and malformed JSONL/invalid DTO skip counting without raw echo. Verification passed: RED focused failures, GREEN focused `21 passed`, combined Office API + controlled-mutation `55 passed`, py_compile, `git diff --check`, production safety scan, and independent review. Evidence: `docs/ai-office/plans/2026-05-16-controlled-mutation-request-store-hardening.md`. The later explicitly approved human-decision store subset is now implemented in `Controlled Mutation Human Decision Store 1`; dry-run execution/result storage, audit append sink/runtime, authority adapter, target mutation/dispatch, NAS save/write, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, and browser controls remain separately gated.

Previous local slice: `Controlled Mutation Next Approval Boundary 1` is implemented as the safe no-approval fallback after the next backend/write approval prompt timed out. It adds `buildOfficeControlledMutationNextApprovalBoundary(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationNextApprovalBoundaryPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel did not implement request-store hardening or human-decision storage; it only displayed four `approval_required` options (`request_store_hardening`, `human_decision_store`, `execution_audit_authority`, `ops_runtime_mutation`) and kept enabledControls=0 plus approval/backend/storage/event append/readback/hardening/decision-store/request/audit/execution/dry-run/dispatch/target/authority/credential/NAS flags false. Verification passed: RED missing-helper failure, GREEN focused `2 passed`, full frontend Office `187 passed`, App `3 passed`, backend Office API + controlled-mutation `51 passed`, ESLint with existing unrelated warnings only, build with existing large chunk warning only, `git diff --check`, production safety scan, browser smoke `/office?next-approval-boundary=1`, and independent review. The later explicitly approved request-store hardening subset is now implemented in `Controlled Mutation Request Store Hardening 1`; human-decision recording, execution/audit/authority, ops/runtime mutation, credential/env changes, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, and browser executable controls remain separately gated.

Previous local slice: `Request Store Hardening Plan 1` is implemented as the safe no-approval fallback after the backend/write approval prompt timed out. It adds `buildOfficeControlledMutationRequestStoreHardeningPlan(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationRequestStoreHardeningPlanPanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel does not implement backend hardening; it only displays four `approval_required` items (`duplicate_detection`, `correlation_index`, `readback_limit`, `malformed_line_resilience`) and keeps enabledControls=0 plus backend/storage/event append/readback/hardening/request/audit/execution/dispatch/NAS flags false. Verification passed: RED missing-helper failures, GREEN focused `2 passed`, full frontend Office `185 passed`, App `3 passed`, backend Office API + controlled-mutation `51 passed`, ESLint, build with existing large chunk warning only, `git diff --check`, production safety scan, browser smoke `/office?hardening-plan=1`, and independent review.

Previous local slice: `Frontend Request Store Posture 1` is implemented as the safe frontend-only/read-only continuation after approval timeout at the backend/storage boundary. It adds `buildOfficeControlledMutationRequestStorePosture(...)` in `web/src/pages/officeView.ts`, renders `ControlledMutationRequestStorePosturePanel` in `/office`, and covers helper/component behavior in `web/src/pages/OfficePage.test.ts` and `web/src/pages/OfficePage.rpg.test.tsx`. The panel only projects static posture about the already-approved local request store into four display-only cards (`local_store`, `validation`, `hardening_boundary`, `approval_boundary`) and keeps enabledControls=0 plus storage/write/event append/readback/request creation/audit/execution/dry-run/dispatch/target mutation/authority adapter/NAS/credential flags false. Verification passed: RED missing-helper failures, GREEN focused `2 passed`, full frontend Office `183 passed`, App `3 passed`, backend Office API + controlled-mutation `51 passed`, ESLint, build with existing large chunk warning only, `git diff --check`, production safety scan, and local browser smoke `/office?request-store-posture=1`. Next boundary requiring explicit approval: request-store hardening (duplicate/correlation/max-limit/malformed JSONL resilience) or human-decision recording contract/store; keep dry-run execution, audit write, authority adapter binding, target mutation, NAS save, credential/env changes, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, and browser executable controls behind a distinct verification gate.

Previous local slice: `Controlled Mutation Safe Request Store 1` is implemented after explicit approval to proceed past the frontend completion boundary except for critically security-damaging work. It adds safe request-event append/readback helpers in `hermes_cli/office_controlled_mutation.py`, protected dashboard routes `POST /api/office/controlled-mutation/request` and `GET /api/office/controlled-mutation/requests` in `hermes_cli/web_server.py`, and focused tests in `tests/hermes_cli/test_office_controlled_mutation_request_event.py`. Storage is local/profile-scoped JSONL at `HERMES_HOME/office/controlled-mutation/requests.jsonl` and only validator-passing allowlisted safe DTOs are persisted, and readback revalidates/normalizes stored entries before returning them. RED first failed on missing helpers/routes; GREEN focused passed with `17 passed`; controlled-mutation backend tests passed with `40 passed`; combined Office API + controlled-mutation tests passed with `51 passed`; py_compile, diff check, and safety scan passed. This slice enables only safe request DTO append/readback; it still does not execute dry-runs, record human decisions, bind/dispatch authority adapters, mutate targets, write audit events, save/prepare NAS material, change credentials/auth/env, add migrations/database schema, mutate VPS/NAS/Kanban/cron, deploy/restart, push/PR/merge, or add browser forms/buttons/inputs/executable controls. Evidence: `docs/ai-office/plans/2026-05-15-controlled-mutation-safe-request-store.md`. Next recommended boundary: request-store hardening or separately gated human-decision recording contract/store; keep dry-run execution, audit write, authority adapter binding, target mutation, NAS save, credentials/env, migration, VPS/NAS/Kanban/cron mutation, deploy/restart, push/PR/merge, and browser executable controls behind a distinct verification gate.

Recent supporting evidence remains linked below; do not delete it when using the umbrella model.

AI Office RPG Visualizer Phase 2-5 is implemented, pushed, and deployed to the private VPS dashboard. `/office` now has a read-only DOM/CSS RPG map derived from safe `OfficeState`, with filters, jump targets, inspector integration, text fallback, reduced-motion-aware CSS motion, focused tests, and local/private browser smoke evidence. Code commit `ebca3a3c` is deployed in `/home/hermes/.hermes/ai-office-dashboard`; only `hermes-agent-dashboard.service` was restarted. Evidence: `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-implementation-evidence.md` and `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-vps-deploy-smoke.md`. Next operational choice should be a new concrete task; keep gateway/core restart, public exposure, NAS mount/direct credentials, active watcher/cron automation, and executable mutation controls separately approval-gated.

Kanban-first operating conversion completed on 2026-05-13: canonical VPS `ai-office` is now the operating source of truth, three real operating cards were created/completed (`t_83f3ff90`, `t_0fced671`, `t_49757d89`), Mac has `<local-user-bin>/ai-office-kanban` for safe canonical board access, and `/office` now includes a read-only Kanban-first operating posture panel. Evidence: `docs/ai-office/plans/2026-05-13-kanban-first-operating-conversion.md`. Next AI Office work should create/route durable tasks on the VPS `ai-office` board by default; keep dashboard mutation controls, cron/watcher automation, public exposure, NAS mount/direct credentials, and gateway/core restarts separately approval-gated.

Fresh-session `/goal` C-G execution completed: protected projection ingest dry-run API is implemented, pushed, deployed to the private VPS dashboard, and smoked; validator-passing safe bundle `pcwb-vps-smoke-001` was promoted non-dry-run with archive rollback evidence; canonical VPS `ai-office` Kanban checkpoint `t_bd4fe848` was created/completed; disabled-by-default dry-run watcher script `scripts/ai_office/office_projection_watchdog.py` and tests were added. Final commit `009c57f3` is pushed and synced to the VPS dashboard worktree for code/docs availability; focused VPS tests and private `/office?goal-cg=009c57f3` smoke passed. No active cron/watcher was enabled, gateway was not restarted, public exposure remained closed, and VPS NAS/direct raw-source access stayed excluded. Evidence: `docs/ai-office/plans/2026-05-13-goal-c-g-execution-evidence.md`. Next work should start from a new concrete task/approval, not from the A-G bucket labels themselves.

`Paperclip Workbench 2` is implemented on `ai-office-stage16e-safe-spatial-choreography-20260510` as a frontend-only safe manifest visibility strip inside the existing folded Paperclip workbench. It summarizes validator-passing safe manifests and VPS/private-dashboard posture from already-sanitized Paperclip workbench/source DTOs only; it does not deploy to VPS, copy projection files, mount NAS, add watchers, expose public routes, restart services, add mutation controls, or read/display raw Paperclip/NAS material.

Paperclip Workbench 2 implementation:

- Frontend helper: `buildOfficePaperclipManifestVisibility(state)` returns three safe cards: `manifests`, `privateDashboard`, and `relayPosture`.
- UI hook: `data-office-paperclip-manifest-visibility="true"` plus per-card `data-office-paperclip-manifest-card="manifests|privateDashboard|relayPosture"` values.
- Safety: sentinel test covers raw path/token/prompt/body/error-summary strings and asserts they do not appear in the manifest visibility output.
- Scope: frontend-only read-only summary; no backend schema/API change, storage, watcher, mutation control, renderer/dependency, service restart, VPS deployment, safe-manifest transfer, or raw source projection.

Verification completed for Paperclip Workbench 2:

- RED verified: `npm test -- --run OfficePage.test.ts -t "Paperclip Workbench 2"` failed first with `buildOfficePaperclipManifestVisibility is not a function`.
- GREEN focused test passed: `npm test -- --run OfficePage.test.ts -t "Paperclip Workbench 2"`.
- `npm test -- --run OfficePage.test.ts` passed: 65 passed.
- `npm test -- --run App.test.ts` passed: 2 passed.
- Focused ESLint passed for touched Office/App frontend files.
- `npm run build` passed with the existing Vite large chunk warning only.
- `.venv/bin/python -m pytest tests/test_paperclip_manifest_generator.py tests/test_paperclip_manifest_validator.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q -o 'addopts='` passed: 33 passed.
- `validate_paperclip_manifest.py docs/ai-office/examples/paperclip-source.example.yaml` passed.
- `git diff --check`, `git diff --cached --check`, and added-line static security scan passed.
- Browser smoke `/office?paperclip-workbench=2&verify=1` passed: Paperclip workbench, manifest visibility strip, three card hooks, map summary, scene markers, raw leak false, console JS errors none.
- Independent pre-commit review passed with no security concerns or logic errors.

Immediate next recommended track:

- `Projection Orchestration 1` is implemented locally and deployed privately: `/office` shows relay → validator → active cache → dashboard projection as a read-only, CSS-motion strip derived from safe `OfficeState.projection_cache` and redacted source posture only.
- `Projection Relay Producer 1` is implemented locally: `scripts/ai_office/generate_office_projection.py` creates manual Mac/WSL safe Office projection bundles from already-validated Paperclip safe manifests, validates the generated `manifest.json`/`payload.json`, supports `--dry-run`, and does not transfer files, start watchers, touch VPS, or read raw source bodies.
- VPS dashboard worktree has been fast-forwarded to the current pushed branch head for code/docs availability only; no service restart was performed, and both dashboard and gateway services remained active. PR #4 is updated and remains draft/reviewable. Do not mark ready, merge, add public exposure, NAS mount/direct credentials, watcher/cron automation, dashboard mutation controls, gateway restart, or core checkout mutation without separate approval.
- Recovery check 2026-05-13 08:45 KST found the previously recommended manual transfer + VPS ingest step already complete: `incoming/pcwb-vps-smoke-001` and `active/pcwb-vps-smoke-001` exist on the VPS, the active bundle validates with `OK: safe Office projection bundle`, and `read_office_projection_cache()` reports `status=active`, `active.bundle_id=pcwb-vps-smoke-001`, `rejected.count=0`.
- Completion evidence and unfinished/deferred classification are in `docs/ai-office/plans/2026-05-13-projection-vps-manual-ingest-completion.md`.
- Next recommended track is no longer another manual ingest. Keep PR #4 draft/reviewable, then choose one separately approved next track: review/mark-ready/merge PR #4, or design projection automation. Do not start watcher/cron automation, NAS mount/direct credentials, public exposure, dashboard mutation controls, gateway restart, or core checkout mutation without separate approval.
- Recovery check 2026-05-13 13:39 KST for session `20260512_181306_8d90ac` completed the unfinished local test-hardening handoff: gateway approval blocking tests are deterministic, Tencent TokenHub `hy3-preview` context resolves provider-aware to 256000, and focused verification/security checks passed. Evidence: `docs/ai-office/plans/2026-05-13-session-20260512-181306-recovery.md`. Remaining full-suite failures are classified there as host/optional-dependency or unrelated integration issues; PR #4 should still remain draft/reviewable unless separately approved.
- VPS dashboard sync/smoke check 2026-05-13 14:09 KST fast-forwarded the dedicated VPS dashboard worktree `/home/hermes/.hermes/ai-office-dashboard` to latest PR #4 commit `d9ac5fae` and restarted only `hermes-agent-dashboard.service`; `hermes-gateway.service` stayed active and was not restarted. Private `/office?v=d9ac5fae` on `100.122.57.85:8765` returned 200, browser smoke found no JS console errors, mutation controls were absent, raw leak probes were false, listener stayed private/Tailscale-bound, and public IPv4/IPv6 probes did not serve port 8765. Evidence: `docs/ai-office/plans/2026-05-13-pr4-d9ac5fae-vps-dashboard-smoke.md`. PR #4 remains draft/open; mark-ready/merge and any gateway/core/public/NAS/watcher/Kanban/mutation-control changes still need separate approval.
- PR ready/gateway sync check 2026-05-13 14:23 KST marked PR #4 ready for review (`isDraft=false`) and, with gateway approval, switched the VPS core/gateway checkout `/home/hermes/.hermes/hermes-agent` to PR head `5903922e`, preserving rollback branch `backup/vps-core-main-before-pr4-gateway-20260513T052142Z`, then restarted only `hermes-gateway.service`. Gateway stayed active with no post-restart errors after the wait; dashboard stayed active without restart, private `/office` still returned 200, and the dashboard worktree intentionally remains at the previously smoked code commit `d9ac5fae`. Evidence: `docs/ai-office/plans/2026-05-13-pr4-ready-gateway-sync.md`. PR #4 is still open and unmerged; merge/public/NAS/watcher/Kanban/mutation-control work still needs separate approval.
- PR #4 merge + Mutation Control Readiness 1 check 2026-05-13 14:36 KST merged PR #4 into `main` (`e7d2d430`), then added the separately approved dashboard mutation-control readiness panel in `30bbfd4c`. The new panel exposes only disabled readiness candidates (`kanban`, `automation`, `service`, `projection`) with no executable backend/systemd/Kanban/cron action. The VPS dashboard worktree `/home/hermes/.hermes/ai-office-dashboard` now tracks `main` at `30bbfd4c`; only `hermes-agent-dashboard.service` was restarted, gateway stayed active without restart, private `/office?v=30bbfd4c` returned 200, browser console/JS errors were zero, enabled mutation controls were zero, raw leak probes were false, and public IPv4/IPv6 port 8765 probes did not serve HTTP. Evidence: `docs/ai-office/plans/2026-05-13-pr4-merge-mutation-control-readiness.md`. Remaining approval-gated items: executable mutation backend/actions, Kanban writes, cron/watcher automation, public exposure, NAS mount/direct credentials, and any further gateway/core runtime changes.

Stage 16-E current implementation:

- `buildOfficeSafeSpatialChoreography(events, heartbeat)` maps safe events to generated `room-pulse` and `route-sweep` items.
- `/office` renders the spatial choreography overlay inside the existing CSS/SVG map.
- Smoke hooks remain:
  - `data-office-safe-spatial-choreography="true"`
  - `data-office-safe-spatial-choreography-mode`
  - `data-office-safe-spatial-choreography-item="room-pulse|route-sweep"`
  - `data-office-safe-spatial-choreography-room`
  - `data-office-safe-spatial-choreography-intensity`
- First/static snapshots remain `safe-spatial-idle`; no fabricated route movement is shown without safe event activity.

Stage 16-D current implementation:

- `buildOfficeSafeMotionHeartbeat(...)` maps safe stream posture + local polling metadata into generated Korean heartbeat mode/phase/intensity copy.
- `/office` polls `/api/office/events` every 5 seconds while the tab is visible and keeps Stage 16-C local fallback if unavailable.
- The UI renders a compact `Stage 16-D 안전 motion heartbeat` rail near the safe event substrate.
- New smoke hooks:
  - `data-office-safe-motion-heartbeat="true"`
  - `data-office-safe-motion-heartbeat-mode`
  - `data-office-safe-motion-heartbeat-phase`
  - `data-office-safe-motion-heartbeat-intensity`
  - `data-office-safe-motion-heartbeat-enabled`
  - `data-office-safe-motion-heartbeat-item="stream|cadence|motion"`
- CSS-only pulse/scan cues are reduced-motion aware.

Verification completed:

- RED verified before helper implementation: `buildOfficeSafeMotionHeartbeat is not a function`.
- GREEN after helper implementation: `OfficePage.test.ts` 54 passed.
- Final frontend focused test: `OfficePage.test.ts` 54 passed.
- ESLint passed for `OfficePage.tsx`, `officeView.ts`, `OfficePage.test.ts`, and `api.ts`.
- `npm run build` passed with the existing Vite large chunk warning only.
- Backend focused office tests passed: 21 passed in 1.02s.
- `git diff --check` passed.
- Browser smoke `/office?stage16d=safe-motion-heartbeat` passed: safe event substrate, stream status, heartbeat mode/phase/intensity hooks, heartbeat items, motion lane, raw leak false, and console JS errors none.

Stage 9-E current implementation:

- `/office` primary UI copy is now Korean-first: headings, focus buttons, refresh/inspect actions, empty states, safety copy, status labels, room labels, and inspector field labels.
- Technical identifiers remain visible where useful: DTO, OfficeState, source IDs, cron, IDs, and adapter-emitted status strings.
- Planning note for the next dynamic/tracking pass: `docs/ai-office/plans/2026-05-09-koreanization-and-dynamic-map.md`.

Stage 9-F current implementation:

- `buildOfficeStateDelta(previous, next)` compares only safe browser-local counts/statuses and attention count.
- Office-map room cards now show last-refresh `+N`, `-N`, and `상태 변경` badges.
- The map card now has a compact `최근 변화` rail backed by a small duplicate-collapsed in-memory ring buffer.
- Stage 9-F3 adds safe flow-level change hints plus `방금 변경` text in the flow legend.
- Stage 9-F3 adds explicit browser-tab-local live controls: `실시간 추적 켜기` and `실시간 추적 일시정지`, polling the same read-only OfficeState endpoint every 30 seconds only while enabled.
- Stage 9-F4 adds automation next-run timing buckets (`overdue`, `<15m`, `<1h`, `today`, `later`, `unknown`) and emits safe `일정 변경` / `자동화 다음 실행 ...` deltas.
- Stage 9-F4 changes live tracking from fixed interval to browser-local adaptive timeouts: visible/no failures 30 seconds, hidden or one failure 60 seconds, repeated failures 120 seconds.
- Stage 9-G adds source-health summary and centralized empty-state hints, including explicit `사용 불가` source counts and safe missing-source labels.
- Stage 9-I adds DeskRPG-like CSS marker motion: safe scene markers now walk/idle/blink with reduced-motion fallback, no renderer dependency, no sprite assets, and no DeskRPG code/assets.
- Stage 10-A adds RPG character projection: `OfficeCharacter`, `buildOfficeCharacters(state, nodes)`, and `buildOfficeCharacterSceneObjects(characters)` turn safe DTO counts/status/source health into generic Korean role characters (`모델 캐릭터`, `작업자`, `자동화 관리인`, `전달자`, `감시자`, `경보 담당`) before rendering markers.
- Stage 10-B adds original CSS/SVG-like character presentation: `OfficeCharacterView` and `buildOfficeCharacterView(character)` produce safe role glyphs, Korean nameplates/status labels, and CSS classes; `OfficeCharacterMarker` renders layered head/body/accessory/status-light shapes with `data-office-character-role` smoke hooks.
- Stage 10-C adds safe action chips: `OfficeCharacterActivity` and `buildOfficeCharacterActivity(character, delta)` derive Korean labels such as `생각 중`, `예약 대기`, `확인 필요`, and `막힘` from role/status plus room/flow deltas only; `OfficeCharacterMarker` exposes `data-office-character-activity` for smoke testing.
- Stage 10-D adds room-to-room RPG route choreography: `OfficeCharacterRoute` and `buildOfficeCharacterRoutes(delta)` derive only from `OfficeStateDelta.changedFlows`, render decorative route hints with static `흐름 변경` labels, and disable route animations under reduced motion.
- Stage 10-E adds safe character inspection: `OfficeCharacterInspector` and `buildOfficeCharacterInspector(character, delta)` generate keyboard/ARIA-friendly inspector fields (`캐릭터`, `역할`, `방`, `상태`, `액션`, `최근 안전 변화`, `가림`) from role/status/safe delta only; character buttons expose `data-office-character-inspect`.
- Stage 10-F adds usability hardening: `OfficeUsabilitySummary` and `buildOfficeUsabilitySummary(state, characters, options)` surface dense-state aggregation, missing/partial source fallback, reduced-motion static meaning, responsive layout posture, and Korean-first copy in a safe map rail with `data-office-usability` smoke hooks.
- Stage 10-G adds local density/readability modes: `OfficeMapDensityMode`, `OfficeMapDensityPlan`, and `buildOfficeMapDensityPlan(mode, characters)` derive 요약/표준/상세 display plans, cap visible generated characters, expose `data-office-density-controls`, and fold the recent-change rail only in 요약 mode.
- Stage 10-H adds safe keyboard jump targets: `OfficeMapJumpTarget` and `buildOfficeMapJumpTargets(densityPlan)` expose 지도/사용성/최근 변화/안전 정보 quick links with stable focusable section anchors and summary-mode collapsed recent rail targeting.
- Stage 12-A adds responsive/mobile readability posture with browser-local viewport width, CSS-only responsive hooks, and no renderer dependency.
- Stage 12-B adds empty-source copy polish: `OfficeEmptySourceCopyPlan` and `buildOfficeEmptySourceCopyPlan(state)` explain an empty source list as a safe DTO/source-gap state and render `data-office-empty-source-copy` without controls or raw projection.
- Stage 13 adds a PR/handoff summary draft in `docs/ai-office/plans/2026-05-09-stage-13-pr-handoff-summary.md` for review and fresh-session continuity.
- Stage 14-A through Stage 14-D add safe dynamic-tracking layers: character tracking cues, room activity meters, safe pulse timeline, and safe breadcrumb trail.
- Stage 14-E adds the safe route compass: `OfficeSafeRouteCompass` and `buildOfficeSafeRouteCompass(delta)` summarize direction/signal/safe-change count from safe `OfficeStateDelta` aggregates only, and `/office` renders `data-office-safe-route-compass` with three decorative points.
- Stage 14-F adds the safe focus lane: `OfficeSafeFocusLane` and `buildOfficeSafeFocusLane(delta)` rank known rooms by safe delta density and render `data-office-safe-focus-lane` with per-room decorative items.
- Stage 14-G adds the safe attention strip: `OfficeSafeAttentionStrip` and `buildOfficeSafeAttentionStrip(delta)` compress safe focus density plus route-compass signal into `focus|signal|scope` chips and render `data-office-safe-attention-strip`.
- Stage 14-H adds safe room beacons: `OfficeSafeRoomBeacons` and `buildOfficeSafeRoomBeacons(delta)` convert safe focus-lane density into decorative map beacons and a compact room beacon rail with `data-office-safe-room-beacons`.
- Stage 14-I adds safe flow pulse bands: `OfficeSafeFlowPulseBands` and `buildOfficeSafeFlowPulseBands(delta)` convert changed safe flows into decorative SVG pulse bands and a compact flow pulse rail with `data-office-safe-flow-pulse-bands`.
- Stage 14-J adds a safe tactical minimap: `OfficeSafeTacticalMinimap` and `buildOfficeSafeTacticalMinimap(delta)` compress safe room beacons and flow pulse bands into fixed-order room cells with `data-office-safe-tactical-minimap`.
- Stage 14-K adds a safe tactical ticker: `OfficeSafeTacticalTicker` and `buildOfficeSafeTacticalTicker(delta)` compress safe minimap and attention signals into `focus|map|cells` ticker items with `data-office-safe-tactical-ticker`.
- Stage 14-L adds a safe mission clock: `OfficeSafeMissionClock` and `buildOfficeSafeMissionClock(options)` compress browser-local live/manual posture, tab visibility, local read failures, and latest safe-delta presence into `mode|cadence|safety|pulse` items with `data-office-safe-mission-clock`.
- Stage 14-M adds a safe command deck: `OfficeSafeCommandDeck` and `buildOfficeSafeCommandDeck(state, delta, missionOptions)` group mission/tactical/source/safety cards with `data-office-safe-command-deck`.
- Stage 14-N adds a safe floor legend: `OfficeSafeFloorLegend` and `buildOfficeSafeFloorLegend(delta)` group generated active rooms, idle rooms, safe flow count, and projection safety with `data-office-safe-floor-legend`.
- Stage 14-O adds a safe status snapshot: `OfficeSafeStatusSnapshot` and `buildOfficeSafeStatusSnapshot(state, delta, missionOptions)` consolidate deck/floor/source/guard posture with `data-office-safe-status-snapshot`.
- Stage 14-P adds a safe scan index: `OfficeSafeScanIndex` and `buildOfficeSafeScanIndex(state, delta, missionOptions)` consolidate snapshot/rail/mode posture with `data-office-safe-scan-index`.
- Stage 14-Q adds a safe HUD readability strip: `OfficeSafeHudReadabilityPlan` and `buildOfficeSafeHudReadabilityPlan(options)` summarize browser-local layout/motion/density/tracking posture with `data-office-safe-hud-readability`.
- First snapshots produce no fabricated history; manual refresh remains the default.
- Planning note expanded: `docs/ai-office/plans/2026-05-09-koreanization-and-dynamic-map.md`.

Recommended next implementation/design stage: Stage 14 is closed at 14-Q. First PR/merge the completed branch into `main`, then start Stage 15 consolidation from updated `main` or a fresh branch off `main`. Stage 15 should focus on HUD hierarchy, duplicate signal reduction, PR/readiness refresh, and only evidence-driven visual polish. Do not expose individual task identity, generate content-like speech bubbles, add character mutation targets, or add Phaser, PixiJS, canvas, sprite assets, DeskRPG code/assets, backend/schema/API changes, mutation controls, persistent storage, or raw record projection. Renderer work remains closed unless new measured evidence and explicit approval reopen it.

Stage 9-D completed:

- `web/src/pages/officeView.ts` adds `OfficeSceneObjectView` and `buildOfficeSceneObjectView(object)` so marker glyph/title/tone/accessibility presentation is testable.
- `web/src/pages/OfficePage.tsx` improves room-card contrast, marker hierarchy, focus rings, SVG/zone/legend z-index layering, and bottom legend spacing.
- `web/src/pages/OfficePage.test.ts` covers non-interactive marker presentation and raw-field avoidance.
- Still no PixiJS/Phaser, canvas engine, sprite assets, copied DeskRPG code/assets, new dependency, backend route/schema, or mutation controls.

Verification for Stage 9-D:

```text
cd /Users/lidises/dev/hermes-agent/web
npm test -- --run OfficePage.test.ts
# 1 test file passed, 7 tests passed

./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts
# passed: 0 errors

npm run build
# passed: tsc -b && vite build

cd /Users/lidises/dev/hermes-agent
source .venv/bin/activate
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short
# 18 passed in 1.07s

git diff --check
# passed

Browser smoke: http://127.0.0.1:8765/office
# Office map visible with stronger room-card contrast, non-interactive scene markers, readable bottom safety/flow legend, Safe inspector zone metadata, no fixture raw-field leaks, no console JS errors
```

## Immediate next action — historical/stale

Historical/stale; do not follow this block over the top `Current next stage`. The active next direction is `AI Office 통합 운영실` umbrella IA/layout/view-model consolidation, not finishing this older Stage 16-A handoff.

Immediate next action is finishing Stage 16-A on `ai-office-stage16a-office-first-reset-20260509`:

1. Run final frontend verification from `web`:
   - `npm test -- --run OfficePage.test.ts`
   - `./node_modules/.bin/eslint src/pages/OfficePage.tsx src/pages/officeView.ts src/pages/OfficePage.test.ts`
   - `npm run build`
2. Run backend/safety verification from repo root:
   - `source .venv/bin/activate && scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py -q --tb=short && git diff --check`
3. Browser smoke `/office?stage16a=office-first-reset`:
   - office-first layout exists.
   - map/scene appears before generic dashboard diagnostics in DOM order.
   - tracking truth strip exists and states snapshot/delta posture.
   - clicking a character sets `data-office-character-selected="true"` and updates the selected-character panel.
   - diagnostics drawer exists and Stage 14/15 hooks still exist.
   - raw leak false and console JS errors none.
4. Commit/push:
   - `feat(office): add AI office-first layout reset`
5. Do not start Stage 16-B until Stage 16-A is committed/pushed.
6. Stage 16-B, if approved, should start with safe event substrate design: redacted event categories/counts/timing buckets only; no raw logs, prompts, transcripts, scripts, tool args, task bodies, provider/model identity, credentials, or mutation controls.

Completed Stage 6 files:

1. `hermes_cli/office_redaction.py`
2. `hermes_cli/office_state.py`
3. `hermes_cli/office_adapters.py`
4. `hermes_cli/web_server.py`
5. `tests/hermes_cli/test_office_redaction.py`
6. `tests/hermes_cli/test_office_api.py`
7. `tests/hermes_cli/test_office_state_adapters.py`
8. `pyproject.toml` — `web` extra now bounds `starlette>=0.46.0,<1`.
9. `web/src/lib/api.ts`
10. `web/src/pages/OfficePage.tsx`
11. `web/src/App.tsx`

Local environment extras installed/ensured with user approval:

```bash
source .venv/bin/activate
python -m pip install -e '.[web]'
python -m pip install 'starlette<1'
python -m pip install -e '.[pty]'
```

Verification already performed:

```text
scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_api.py -q
# 5 passed

scripts/run_tests.sh tests/hermes_cli/test_office_state_adapters.py -q
# 8 passed

scripts/run_tests.sh tests/hermes_cli/test_office_redaction.py tests/hermes_cli/test_office_state_adapters.py tests/hermes_cli/test_office_api.py tests/hermes_cli/test_web_server.py tests/hermes_cli/test_web_server_host_header.py -q
# 158 passed, 5 warnings

cd web
export PATH="$HOME/.local/node-v24.11.1-linux-x64/bin:$PATH"
npm run build
# passed: tsc -b && vite build

./node_modules/.bin/eslint src/pages/OfficePage.tsx src/App.tsx src/lib/api.ts
# passed

npm run lint
# now passes: 0 errors, 20 warnings

npm run build
# passed after lint cleanup: tsc -b && vite build

scripts/run_tests.sh tests/acp tests/acp_adapter -q --tb=short
# after installing .[acp]: 221 passed, 10 warnings

scripts/run_tests.sh tests/tools/test_transcription.py tests/tools/test_transcription_tools.py tests/tools/test_transcription_dotenv_fallback.py tests/tools/test_image_edit_tool.py tests/tools/test_registry.py tests/test_model_tools.py -q --tb=short
# 178 passed, 7 skipped

scripts/run_tests.sh tests/tools/test_delegate.py tests/tools/test_daytona_environment.py tests/tools/test_vercel_sandbox_environment.py tests/hermes_cli/test_cmd_update.py tests/hermes_cli/test_update_yes_flag.py -q --tb=short
# 178 passed

scripts/run_tests.sh tests/hermes_cli/test_update_yes_flag.py::TestUpdateYesStashRestore::test_yes_restores_stash_without_prompting -q --tb=long
# 1 passed

scripts/run_tests.sh tests/hermes_cli/test_cmd_update.py tests/hermes_cli/test_update_yes_flag.py -q --tb=short
# 10 passed

scripts/run_tests.sh tests/agent/test_bedrock_1m_context.py tests/agent/test_bedrock_adapter.py tests/hermes_cli/test_bedrock_model_picker.py -q --tb=short
# 139 passed, 6 skipped

scripts/run_tests.sh -q --tb=short
# latest full Python suite after all cleanup batches: 20886 passed, 125 skipped, 232 warnings in 389.83s

npm test
# failed: package has no "test" script
```

Notes:

- `npm run lint` for the whole web app now passes with 0 errors and 20 warnings after downgrading React Compiler migration rules to warnings and fixing two unused variables.
- Full Python `scripts/run_tests.sh -q --tb=short` is green after the cleanup batches: 20886 passed, 125 skipped, 232 warnings in 389.83s.
- `test_update_yes_flag` no longer appears in the latest full xdist failure list after patching through `cmd_update.__globals__`.
- `web/package.json` has no `test` script, so `npm test` is not available.
- The ACP import-error cluster was an environment gap; local `.venv` now has `agent-client-protocol 0.10.0` via `python -m pip install -e '.[acp]'`.
- Installing only `.[web]` initially left existing PTY WebSocket tests failing because `ptyprocess` was missing; installing existing `.[pty]` fixed those tests.
- Starlette 1.0.0 caused WebSocket TestClient frame incompatibilities in existing PTY tests, so `pyproject.toml` now constrains the web extra to `starlette<1` and local verification used Starlette 0.52.1.
- Remaining backend warnings are existing Python `pty.py` `forkpty()` deprecation warnings in PTY tests.

Primary Stage 5 outputs to keep using:

1. `docs/ai-office/architecture/backend-api.md`
2. `docs/ai-office/architecture/data-adapters.md`
3. `docs/ai-office/architecture/frontend-components.md`
4. `docs/ai-office/architecture/test-plan.md`
5. `docs/ai-office/architecture/rollout-plan.md`
6. `docs/ai-office/architecture/pixel-renderer-adapter.md`

Stage 6 approval checklist from the rollout plan:

1. User approves Stage 6 implementation scope.
2. User agrees to protected built-in `/api/office/...` API placement.
3. User agrees Stage 6 remains read-only and localhost-first.
4. User agrees pixel visualization remains deferred.
5. User agrees whether Stage 6 may read an existing `~/.hermes/office/topics.json` seed registry if present.
6. User agrees session titles remain off by default unless tests prove redaction behavior.
7. User agrees no gateway/dashboard service restart is performed without separate approval.

## Current planning outputs to preserve

Stage 1 research docs:

- `docs/ai-office/research/pixel-agents-audit.md`
- `docs/ai-office/research/pixel-agents-standalone-audit.md`
- `docs/ai-office/research/pixel-agents-codex-audit.md`
- `docs/ai-office/research/smallville-generative-agents-audit.md`
- `docs/ai-office/research/agent-observability-patterns.md`
- `docs/ai-office/research/synthesis.md`

Stage 2 audit docs:

- `docs/ai-office/audit/dashboard-architecture.md`
- `docs/ai-office/audit/kanban-data-model.md`
- `docs/ai-office/audit/cron-data-model.md`
- `docs/ai-office/audit/telegram-topic-routing.md`
- `docs/ai-office/audit/session-provenance.md`
- `docs/ai-office/audit/current-wsl-state-snapshot.md`

Stage 3 product/IA docs:

- `docs/ai-office/product/user-stories.md`
- `docs/ai-office/architecture/office-state-model.md`
- `docs/ai-office/product/information-architecture.md`
- `docs/ai-office/product/non-goals-and-mutation-boundary.md`
- `docs/ai-office/product/mvp-acceptance-criteria.md`

Stage 4 design docs:

- `docs/ai-office/design/topic-registry-spec.md`
- `docs/ai-office/design/task-provenance-metadata.md`
- `docs/ai-office/design/provenance-backfill.md`
- `docs/ai-office/design/privacy-security.md`

Stage 5 architecture docs:

- `docs/ai-office/architecture/backend-api.md`
- `docs/ai-office/architecture/data-adapters.md`
- `docs/ai-office/architecture/frontend-components.md`
- `docs/ai-office/architecture/test-plan.md`
- `docs/ai-office/architecture/rollout-plan.md`
- `docs/ai-office/architecture/pixel-renderer-adapter.md`

Earlier product/architecture/risk docs:

- `docs/ai-office/product/mvp-scope.md`
- `docs/ai-office/architecture/conceptual-architecture.md`
- `docs/ai-office/RISKS.md`

## Do not do without separate approval

- Do not implement mutation controls, topic registry persistence, or pixel-renderer slices beyond the completed Stage 6 read-only MVP.
- Do not add npm/Python dependencies unless explicitly approved.
- Do not create or mutate Kanban boards/tasks unless explicitly approved.
- Do not create, pause, resume, trigger, delete, or mutate cron jobs from AI Office.
- Do not restart services.
- Do not change gateway/cron/config/systemd/startup scripts.
- Do not write to NAS/Obsidian shared ledger.
- Do not vendor/fork Pixel Agents code.
- Do not create/edit `~/.hermes/office/topics.json` unless the user explicitly approves a registry seed/edit step.

## Handoff checklist before next `/new`

Before starting a fresh session:

1. Read this file and `STATUS.md`.
2. Read the Stage 5 architecture docs listed above.
3. If the user approves the next stage, begin only with the approved smoke-test/polish/lint-cleanup scope and update handoff files after verification.
4. If no approval is given, stay in review/planning mode.
5. State explicitly what was not changed.

## Stage 14-A handoff: dynamic character tracking cues

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-A implemented safe character tracking cues and passed final local verification. Keep continuing in small CSS/SVG slices; do not add a renderer/dependency unless the user explicitly reopens the Stage 11 decision gate.

Next if Stage 14-A verifies cleanly:

1. Commit/push Stage 14-A: `feat(office): add dynamic character tracking cues`.
2. Plan Stage 14-B as the next small DeskRPG-like slice. Recommended direction: room-level ambient activity meters or safe route pulse timeline, still derived only from safe DTO counts/deltas.
3. Maintain constraints: read-only `/office`, no backend/API/schema changes, no mutation controls, no persistent storage, no raw projection, no Phaser/Pixi/canvas/sprites.

## Stage 14-B handoff: room activity meters

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-B implemented safe room activity meters and passed final local verification. Commit/push completed as `1d7ab666 feat(office): add room activity meters`. Recommended Stage 14-C direction: safe event pulse timeline or room-to-room breadcrumb rail derived only from browser-local safe deltas.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.

## Stage 14-C handoff: safe pulse timeline

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-C implemented a safe pulse timeline from browser-local `OfficeStateDelta` (`nodeBadges`, `changedFlows`, `recentChanges`) and passed final local verification. Commit/push completed as `5e2b26d8 feat(office): add safe pulse timeline`.

Next recommended Stage 14-D direction: safe breadcrumb trail for room-to-room changes or a compact character/room heartbeat legend, still CSS/SVG only and derived from safe DTO/delta fields.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.

## Stage 14-D handoff: safe breadcrumb trail

Current branch: `ai-office-stage14-dynamic-tracking-20260509`

Stage 14-D implemented a safe breadcrumb rail from browser-local `OfficeStateDelta.changedFlows`. It generates Korean room labels/details only, ignores raw flow labels and recent change text, and keeps the rail decorative/non-interactive. Final local verification passed: 33 focused frontend tests, ESLint, build with existing Vite large-chunk warning, 18 backend office tests, `git diff --check`, and browser smoke for `/office?stage14d=safe-breadcrumb-trail`.

Next recommended Stage 14-E direction: compact safe route compass or room heartbeat legend that ties Stage 14-B meters, Stage 14-C pulse, and Stage 14-D breadcrumb together without adding renderer dependencies or backend schema changes.

Keep constraints: no renderer/dependency, no backend/API/schema changes, no mutation controls, no persistent storage, no raw record projection.

## Current handoff — Mutation Control Readiness 2 dry-run baseline + goal docs sync (2026-05-13 15:23 KST)

- PR #4 is merged; main now includes the prior dashboard/gateway evidence and mutation readiness baseline.
- Approved low-risk follow-up completed locally: Mutation Control Readiness 2, dry-run mutation API design, and safe projection ingest/promote dry-run helper.
- Dashboard mutation panel remains non-executable: all controls disabled, dry-run-only metadata shown, no browser mutation route/form/fetch added.
- Safe helper baseline: `ingest_office_projection_bundle(..., dry_run=True)` returns would-promote/would-reject metadata without active/archive/rejected cache mutation or raw value echo.
- Evidence: `docs/ai-office/plans/2026-05-13-mutation-control-v2-dry-run-evidence.md`.
- Deployment/smoke complete: `origin/main` and VPS dashboard worktree were at `2d29d13a`; only `hermes-agent-dashboard.service` was restarted; private `/office?v=2d29d13a` returned HTTP 200 with console/js errors 0 and no enabled mutation controls.
- Fresh `/goal` A+B selection completed a docs-only fast-forward of the dedicated VPS dashboard worktree from `7246cd37` to `29265fc1` with no service restart. Private `/office?goal-docsync=29265fc1` returned HTTP 200; browser smoke found 4 dry-run-only disabled mutation controls, 0 forms, raw leak false, and 0 console/JS errors. Evidence: `docs/ai-office/plans/2026-05-13-goal-docsync-vps-dashboard-smoke.md`.
- Next gate: any executable browser mutation route, non-dry-run projection promote, Kanban write, automation/cron, public exposure, NAS credentials, or gateway/core runtime change remains out of scope unless separately approved.


## Reviewer/Wiki Evidence Detail Posture 1 handoff (2026-05-15 08:26 KST)

- Complete locally; follow-up Board Evidence-to-Inspector Drill-down 1 is also complete. Next: Boss/Orchestrator Request Posture Detail 1 or approval/request route detail.
