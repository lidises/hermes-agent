# Fresh Session Handoff — AI Office / Hermes Update / RPG Visualizer

Generated: 2026-05-13 19:20:33 KST

> Purpose: allow a new Hermes session to restart cleanly without relying on compacted chat history. Treat this as handoff context, not as approval to implement or deploy.

## Current repository state on Mac

- Repo: `/Users/lidises/dev/hermes-agent`
- Branch: `main`
- Tracking: `main...origin/main`
- HEAD at handoff: `1a08d9b5 feat(office): surface kanban operating posture`
- Local worktree status at handoff:
  - Untracked: `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md`
  - This handoff file is also newly created/untracked unless committed after this note.
- `NEXT.md` and `STATUS.md` were not present at repo root in this checkout when checked.

## Canonical VPS Kanban state

Canonical board: VPS `ai-office`.

Parent planning card:

- ID: `t_5a7ea52c`
- Title: `plan: 2D live AI Office renderer north-star 20260513T090222Z`
- Status: `triage`
- Assignee: `ai-office-orchestrator`
- Children: `t_0140986b`, `t_050c2807`, `t_1fd174f4`, `t_22f10129`, `t_700679b0`, `t_939922ed`, `t_af8ad90e`, `t_fcb330d1`
- Existing comment added this session:
  - `RPG Visualizer planning document drafted on Mac: /Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md. Scope remains planning-only; implementation/code/service changes require explicit approval.`

## Important planning document

Primary plan drafted this session:

- `/Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md`

Core decision in that plan:

- Build an AI Office RPG Visualizer as factual observability, not decorative fake life.
- Use existing protected `/api/office/state` and `/api/office/events` boundaries.
- Start with React + CSS/SVG/DOM, not Phaser/Pixi/canvas.
- Keep `/office` read-only and privacy-safe.
- Do not expose raw prompts, transcripts, task bodies, comments/results/logs/scripts, secrets, provider/model identity, or numeric Telegram topic IDs.
- Do not add mutation controls, dashboard restart, gateway restart, public exposure, NAS mount/credentials, cron/watchers, or service controls without separate explicit approval.

## Recommended next approval slice

If the user wants implementation next, the smallest safe approval text is:

```text
AI Office RPG Visualizer Phase 1만 진행해. frontend view-model/test 중심으로 OfficeRpgScene adapter를 만들고, UI/서비스/게이트웨이/백엔드 변경은 approval-required로 멈춰.
```

Optional second slice after Phase 1 passes:

```text
Phase 1 통과 후 Phase 2의 CSS/SVG static 2D map까지 진행해. 외부 renderer dependency, sprite asset, mutation control, backend schema/API change는 approval-required로 멈춰.
```

## Phase outline from the plan

1. Phase 0 — inspect current Hermes dashboard/state APIs.
   - Mostly done for planning.
   - Files inspected included:
     - `hermes_cli/office_state.py`
     - `hermes_cli/web_server.py`
     - `web/src/lib/api.ts`
     - `web/src/pages/officeView.ts`
     - `web/src/pages/OfficePage.tsx`
     - `docs/ai-office/architecture/backend-api.md`
     - `docs/ai-office/architecture/frontend-components.md`
     - `docs/ai-office/architecture/pixel-renderer-adapter.md`
2. Phase 1 — read-only RPG scene adapter.
   - Add pure frontend view-model in `web/src/pages/officeView.ts`.
   - Add tests first in `web/src/pages/OfficePage.test.ts` or a focused view-model test.
   - Prove raw/private fields are ignored.
   - Prove missing sources are visible, not silently treated as zero.
   - Prove no fake progress/motion is fabricated.
3. Phase 2 — static 2D map with fixture/mock state.
   - CSS/SVG/DOM only.
   - 3–5 rooms.
   - Accessibility/text fallback retained.
4. Phase 3 — connect real `/api/office/state` and optional safe events.
5. Phase 4 — clickable safe inspector and filters.
6. Phase 5 — CSS-only polish/motion.
7. Phase 6 — optional task actions, only after separate approval and preview-first gates.

## Original broad request to verify in a fresh session

The user originally asked to update Hermes across Mac, VPS, and WSL and summarize ideas that were conceived but not progressed. Because the visible active context is compacted, do not assume the update work was completed unless verified from live state and git/service evidence.

Fresh session should start by verifying:

- Mac checkout/runtime:
  - `/Users/lidises/.hermes/hermes-agent`
  - `/Users/lidises/dev/hermes-agent`
  - current branch, HEAD, dirty state, installed CLI version if applicable.
- VPS runtime/checkouts:
  - SSH with explicit identity if needed: `/Users/lidises/.ssh/id_ed25520`
  - host: `hermes@100.122.57.85`
  - canonical AI Office/Kanban is on VPS.
  - inspect only first: systemd user services, dashboard worktree, gateway worktree, active HEADs.
- WSL:
  - Verify actual access path/environment before claiming update status.
  - If unavailable from the Mac session, report that WSL requires user-side access or a known SSH/relay path.

Do not mutate VPS, gateway, services, or WSL until the exact update scope is clear.

## Suggested fresh-session starter prompt

Paste this into a new session:

```text
AI Office/Hermes 이어서 해줘. 먼저 스킬 `hermes-agent`와 `ai-office-vps-operations`를 로드하고, 아래 handoff를 기준으로 live state를 다시 검증해줘:

- Handoff: /Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-13-fresh-session-handoff.md
- RPG Visualizer plan: /Users/lidises/dev/hermes-agent/docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md
- Canonical VPS Kanban parent: t_5a7ea52c on board ai-office

먼저 Mac/VPS/WSL Hermes update 상태를 read-only로 확인하고, 실제로 진행되지 않은 구상/카드/문서를 요약해줘. 구현/서비스 재시작/게이트웨이 재시작/VPS 파일 변경/WSL 변경/commit/push는 내가 승인하기 전에는 하지 마.

출력은 한국어로:
1. live 검증 결과
2. 아직 진행되지 않은 구상 목록
3. 현재 변경 파일/커밋 상태
4. 바로 승인할 수 있는 최소 다음 단계 2~3개
```

## Safety boundaries for next session

- Planning/documentation can proceed locally.
- Implementation requires explicit approval per slice.
- Dashboard restart requires explicit approval.
- Gateway/core checkout mutation or gateway restart requires explicit approval.
- VPS filesystem mutation requires explicit approval.
- WSL mutation requires explicit access verification and approval.
- No NAS mount/credentials, no public exposure, no cron/watchers, no service-control buttons.

## Known changed/uncommitted files to handle

At minimum, the new session should decide whether to keep/commit/discard:

- `docs/ai-office/plans/2026-05-13-ai-office-rpg-visualizer-plan.md`
- `docs/ai-office/plans/2026-05-13-fresh-session-handoff.md`

Recommended: leave them uncommitted until the user says whether the plan/handoff should be committed/pushed.
