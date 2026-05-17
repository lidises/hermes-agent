# AI Office Desk RPG Master Spec v0.1 — Hermes Review

작성: 2026-05-14 10:28 KST
입력: `<local-download-path>/ai_office_desk_rpg_master_spec_v_0_1.md`
범위: 기획/검토 전용. 코드 구현, 서비스 재시작, Kanban/cron/NAS/VPS mutation 없음.

## 결론

Master Spec v0.1의 방향은 맞다. 특히 중요한 전환은 다음이다.

1. `/office`는 상태판 대시보드가 아니라 `조용하지만 살아있는 AI orchestration 운영실`이어야 한다.
2. read-only-first는 최종 목적이 아니라 안전한 첫 단계다.
3. 최종 목표는 캐릭터/게시판/자료실/승인 흐름을 통해 CLI 운영을 GUI 운영으로 옮기는 것이다.
4. 단, GUI mutation/control은 반드시 authority/event/approval 모델이 먼저 생긴 뒤 붙여야 한다.
5. 현재 구현은 버릴 것이 아니라 `safe snapshot/projection DTO + redaction + current DOM/CSS visual layer`를 Phase 0/1 기반으로 재해석해야 한다.

즉, 기존 umbrella 문서의 `read-only-first` 원칙은 유지하되 의미를 좁혀야 한다.

- 잘못된 해석: `/office`는 영원히 읽기 전용 화면이다.
- 올바른 해석: `/office`는 먼저 읽기 안전성을 확보하고, 이후 mutation은 event request + approval gate + authority model을 통해 제한적으로 연다.

## 내가 보는 핵심 제품 문장

AI Office 통합 운영실은 Hermes runtime, Kanban, Paperclip/sourceTags, Projection Cache, NAS 저장 권한을 하나의 JRPG 사무실로 투영하는 운영 UI다. 사용자는 사장 캐릭터로 존재하고, 오케스트레이터와 worker 캐릭터들이 실제 이벤트에 따라 움직이며, 게시판과 자료실을 통해 작업 상태·근거·승인·최종 저장을 확인하고 지시한다.

## 마지막 5개 질문에 대한 권장 답

### 1. MVP 성공 장면

잡아도 된다. MVP 성공 장면은 다음 한 장면으로 고정하는 것이 좋다.

> 사용자가 “침 치료 과학적 근거 위키 글 작성”을 요청하면, 오케스트레이터가 프로젝트를 만들고, 검색 worker 2~3명이 병렬로 움직이며, Reviewer와 Wiki Writer가 이어받고, 진행 상태와 근거 count가 중앙 게시판/캐릭터 inspector에 보이며, 마지막에 오케스트레이터가 사장 캐릭터에게 완료/승인대기 보고를 한다.

MVP에서 실제 NAS write까지 넣지 말고 `NAS save approval requested`까지만 넣는 것이 안전하다. 실제 NAS write는 3차 성공 기준으로 미룬다.

### 2. 오케스트레이터 중앙 관리자 여부

중앙 관리자여야 한다.

원칙:

- 자연어 지시: 항상 Orchestrator-level instruction으로 들어간다.
- worker 클릭 quick action: worker에게 바로 실행시키는 것이 아니라 `WorkerActionRequested` event를 만들고 Orchestrator가 승인/분배한다.
- 예외: 순수 read-only UI action, 예를 들어 `Report`, `Show evidence`, `Open inspector`는 worker-level에서 즉시 가능하다.

이유:

- 중복 작업, 권한 우회, NAS write 오작동을 막는다.
- Kanban이 source of truth로 남는다.
- 나중에 Telegram/GUI/CLI 지시가 같은 event pipeline으로 합쳐진다.

### 3. Kanban/Paperclip 표현

`시설물 + 담당 캐릭터`가 맞다.

- Kanban: 중앙 게시판/업무판. 공식 task state source of truth.
- Kanban Keeper/Board Clerk: 게시판 정리, blocked/approval/high-level phase 업데이트 담당 캐릭터.
- Paperclip: 근거 보드/자료 묶음 테이블/클립보드 wall. evidence lineage surface.
- Paperclip Curator: sourceTag, manifest, confidence, used/not-used 정리 담당 캐릭터.

이렇게 해야 상태와 역할이 분리된다. 게시판은 source-of-truth object이고, 캐릭터는 그것을 관리/설명하는 actor다.

### 4. Phaser/sprite/tilemap

장기 검토는 열어두되, MVP에는 도입하지 않는 것이 맞다.

권장 순서:

1. Phase 0/1: DOM/CSS fixed office + sprite-like CSS/image layer.
2. Phase 2: event-driven character state machine과 projection model.
3. Phase 3: inspector/dialogue/quick action request.
4. Phase 4: 권한/approval/event request mutation.
5. 그 뒤에야 Phaser/Pixi/canvas decision gate.

Phaser는 진짜 tilemap/pathing에는 유리하지만, 지금 당장 도입하면 architecture보다 renderer가 의사결정을 끌고 갈 위험이 크다. 현재 bottleneck은 renderer가 아니라 event/authority/projection 모델이다.

### 5. NAS Keeper 권한

NAS Keeper를 유일한 NAS RW role로 설계하는 것이 맞다. Final NAS save는 자동이 아니라 사용자 승인 후가 맞다.

정책:

- Draft/intermediate: scratch workspace에 자동 저장 가능.
- Final NAS save: `ApprovalRequested` → user approval → `SaveRequested` → NAS Keeper만 실행 → rollback point/evidence 기록.
- 대부분 worker: scratch RW, NAS RO 또는 projection/manifest read only.
- VPS: direct NAS mount/direct NAS credentials/direct raw-source reads 금지 유지.

## Master Spec에 대한 보완 제안

### A. MVP actor set은 6명으로 시작

기본 5명을 고르라면 아래 5명이지만, 실제 MVP에는 User Avatar를 포함해 6명이 자연스럽다.

1. User Avatar / 사장
2. Orchestrator
3. Search Worker
4. Reviewer
5. Wiki Writer
6. NAS Keeper

Planner는 MVP에서 Orchestrator 내부 capability로 시작하고, 업무가 복잡해지면 별도 캐릭터로 분리한다. Kanban Keeper와 Paperclip Curator도 MVP에는 facility behavior/inspector로 시작하고, Phase 2 이후 캐릭터화한다.

### B. 검색 worker는 role은 하나, instance는 여러 개

Master Spec의 `Persistent Role Avatar + Ephemeral Runtime Instance`가 정답이다.

- 화면상 대표 역할: Search Worker
- runtime instance: web-search, pubmed-search, internal-search 등 여러 개
- inspector에서는 병렬 subtask를 drill-down
- 맵에서는 2~3명까지만 visible clone/assistant로 표현

처음부터 “웹 검색 캐릭터”, “논문 검색 캐릭터”, “내부문서 검색 캐릭터”를 모두 고정 NPC화하면 캐릭터 수가 너무 빨리 늘어난다.

### C. 첫 화면은 single central office + fixed camera

Master Spec의 single central office가 좋다.

초기 배치:

- 중앙: Kanban/Paperclip combined board
- 좌측 상단: 사장 자리
- 중앙/전면: Orchestrator desk
- 우측: worker desk cluster
- 하단/우측: NAS vault entrance
- 별도 방 대신 zone/desk cluster로 표현

다중 방, 프로젝트 룸, 미니맵은 MVP 제외가 맞다. 지금은 “누가 뭘 하는지”를 한눈에 보는 것이 더 중요하다.

### D. 이벤트 체계는 Master Spec보다 한 층 더 나눠야 함

Master Spec의 이벤트 목록은 좋지만, 구현상 세 종류를 분리해야 한다.

1. Runtime events
   - 실제 작업/worker/Kanban/cron/projection에서 나온 사실.
2. Intent/request events
   - GUI/Telegram/CLI에서 들어온 지시 요청. 아직 실행 아님.
3. Visual projection events
   - renderer가 쓰기 위해 안전하게 축약된 room/character/motion cue.

예:

```text
UserInstructionSubmitted
→ OrchestratorPlanRequested
→ TaskCreated / TaskAssigned
→ WorkerSpawned / SearchStarted
→ EvidenceCollected
→ ReviewRequested / ReviewCompleted
→ DraftStarted / DraftReady
→ ApprovalRequested
→ SaveRequested
→ SaveCommitted
→ TaskCompleted
```

GUI mutation은 `UserInstructionSubmitted` 또는 `ActionRequested`만 만들고, 직접 `SaveCommitted` 같은 사실 이벤트를 만들면 안 된다.

### E. 말풍선은 real text가 아니라 safe generated copy 우선

말풍선에 raw 검색어/문서 제목을 바로 노출하지 않는 편이 좋다. 개인 프라이버시보다 더 큰 문제는 화면 noise와 raw leak 가능성이다.

권장 말풍선:

- “웹 근거 찾는 중…”
- “논문 후보 3개 찾음”
- “근거 검토 대기”
- “저장 승인 필요”
- “막힘: 추가 지시 필요”

검색어/문서 제목/세부 source는 inspector 또는 Paperclip tab에서만 safe redaction 후 표시한다.

### F. Inspector 형태

MVP는 오른쪽 drawer가 가장 안전하다.

- 맵은 calm하게 유지.
- JRPG 대화 박스는 나중에 dialogue/approval flow에 사용.
- modal은 workflow를 막기 쉬워서 approval confirmation에만 사용.

권장 UX:

- character click → right inspector drawer
- board click → board/evidence/log/result tabs
- approval needed → 작은 JRPG dialogue box + explicit approve/hold buttons

### G. scratch workspace는 repo 밖 별도 AI Office scratch가 좋음

장기 권장:

```text
~/.hermes/ai-office/workspaces/
  project-<id>/
    search-worker-a/
    search-worker-b/
    reviewer/
    wiki-writer/
    approvals/
    exports/
```

이유:

- repo worktree 오염 방지
- worker별 권한/cleanup/rollback 관리 쉬움
- NAS와 runtime temp를 분리
- VPS/Mac/WSL relay 모델과 맞음

단, 이 경로 정책은 구현 전 별도 approval 필요.

### H. 보안실/관리실 action은 숨기지 말고 gated object로 표현

service restart, deploy, permission change는 완전히 숨기면 사용자가 운영 상태를 이해하기 어렵다. 하지만 실행 버튼처럼 보이면 위험하다.

권장:

- 보안실/관리실 object는 존재.
- 기본은 locked/read-only.
- “승인 필요”, “CLI 확인 필요”, “권한 없음” 같은 posture만 표시.
- 실제 실행은 별도 승인 + session token + backend policy + audit event 이후.

MVP에서는 enabled action 0개가 맞다.

## 현재 Hermes 구현 기준 답변: Master Spec의 45개 implementation 질문 요약

### Runtime / Backend

1. 현재 제공 데이터: `OfficeState`에 Kanban, cron, sessions, topics, paperclip manifest, projection cache, provenance, source health, redaction, safe events가 있다.
2. `/api/office/state` 존재한다.
3. 현재는 snapshot 중심이다. `/api/office/events`도 event log가 아니라 redacted snapshot에서 만든 safe event payload다.
4. canonical event history는 없다. Kanban task_events 일부와 browser-local delta가 있을 뿐이다.
5. canonical event schema는 확장 가능하지만, 지금 당장 backend schema를 바꾸기보다 별도 projection/view-model helper로 시작하는 편이 안전하다.
6. runtime worker identity와 logical role identity 분리는 현재 명확하지 않다. 새 projection layer에서 설계해야 한다.
7. worker spawn/despawn 추적은 현재 office DTO 수준에서는 부족하다.
8. task dependency graph는 Kanban task_links 기반으로 일부 존재한다.
9. lineage/correlation tracing은 provenance/sourceTag/projection 쪽 개념은 있으나, 전 runtime event 공통 schema로는 아직 부족하다.
10. approval state는 현재 disabled mutation readiness/posture 수준이며, runtime approval workflow는 별도 설계가 필요하다.

### Frontend / Renderer

11. `/office` frontend는 React/TypeScript/Vite 기반이다.
12. 현재 구조는 helper-driven이라 projection-friendly한 편이지만, HUD/rail 누적이 심해 IA 정리가 필요하다.
13. DOM/CSS sprite office는 MVP에서 가능하다.
14. fixed camera/fixed layout은 현재 구조와 충돌하지 않는다.
15. hardcoded desk positions로 시작 가능하다.
16. CSS/SVG helper와 RPG scene helper가 이미 많다.
17. 기존 AI RPG Visualizer에서는 character projection, filters, inspector, fallback rows, Korean copy, reduced-motion CSS, raw-leak tests를 재사용해야 한다.
18. renderer와 orchestration state 분리는 `officeView.ts` helper 계층에서 가능하다.
19. MVP는 CSS transition/keyframe + simple state machine으로 충분하다. full animation engine은 과하다.
20. update frequency는 현재 `/api/office/events` 5초 polling이 기준이다. 실시간성이 필요하면 later stage에서 SSE/WebSocket 검토.

### Projection Architecture

21. projection layer는 별도 module/view-model helper로 분리 가능하다.
22. runtime → visual mapping은 backend canonical schema 변경보다 frontend/pure helper에서 먼저 검증하는 게 좋다.
23. visible worker 제한은 projection helper에서 처리해야 한다.
24. noise suppression은 반드시 필요하다.
25. projection cache는 이미 존재하므로 visual projection에도 last-known-good 개념을 맞추는 것이 좋다.
26. map-level abstraction은 high-level phase/role/status만 표시하고 runtime subtasks는 inspector로 보낸다.
27. Project/Objectives/TaskGroups/RuntimeTasks 계층은 Kanban + future event model 위에 얹어야 한다.

### Interaction / UX

28. 자연어 입력은 사장 자리 command console로 구현 가능하나, MVP에서는 비실행 mock/request posture부터 시작한다.
29. quick actions는 실제 mutation 대신 event request 생성으로 시작해야 한다.
30. character status panel은 right drawer 권장.
31. runtime drill-down은 safe counts/status/subtask ids까지만. raw prompts/logs/body 금지.
32. Kanban은 map object이면서 overlay tab을 여는 방식이 좋다.
33. Paperclip은 board tab 또는 inspector tab으로 통합한다.
34. approval은 사장 자리/오케스트레이터 말풍선 + inspector approval card로 표현한다.
35. blocked escalation은 worker `?` → Orchestrator 접근 → approval/request card 순서로 표현한다.

### Runtime / Authority

36. NAS Keeper RW 강제는 장기적으로 system permission까지 가는 것이 좋지만, MVP에서는 정책/approval model부터 설계한다.
37. draft auto-save workspace는 `~/.hermes/ai-office/workspaces` 계열 별도 scratch가 좋다.
38. rollback point는 final NAS save 직전/직후 모두 기록해야 한다.
39. controlled mutation policy는 backend API boundary에서 enforce하고 frontend는 posture를 표시하는 역할이어야 한다.
40. Orchestrator AI는 계획/분배/보고를 담당하고, backend substrate는 권한/상태전이/감사로그를 담당해야 한다.

### MVP Scope / Engineering

41. MVP에서 실제 NAS write 제외 + approval flow mock은 가능하고 권장된다.
42. fake event + partial real runtime hybrid는 현재 구조와 호환된다. 단 fake임을 UI/DTO에 명확히 표시해야 한다.
43. 가장 먼저 검증할 것은 renderer가 아니라 `projection/view-model`이다.
44. MVP에서 빼야 할 것: Telegram integration, real NAS write, Phaser/Pixi, multi-room, personality simulation, voice, replay theater, sentence-level lineage, public exposure, enabled mutation controls.
45. 가장 큰 bottleneck: event/authority model 부재와 현재 `/office`의 feature/HUD 누적. renderer 성능은 아직 1순위 위험이 아니다.

## 기존 umbrella 문서와의 충돌/수정 필요점

현재 `docs/ai-office/product/unified-operating-workbench.md`와 `docs/ai-office/architecture/unified-operating-workbench.md`는 안전한 Phase 0 문서로는 맞다. 다만 Master Spec 관점에서 다음 문장을 추가로 명확히 해야 한다.

1. read-only-first는 영구 non-goal이 아니라 first safety posture다.
2. long-term target은 character dialogue, instruction request, approval, controlled mutation까지 포함한다.
3. Phaser/Pixi는 MVP 금지지만 long-term decision gate는 열려 있다.
4. `/office`의 다음 작업은 단순 IA/Layout 1이 아니라 `Desk RPG Projection Model 1`이어야 한다.

## 내가 추천하는 다음 산출물 순서

Master Spec 기준으로는 기존 추천 A/B/D/C에서 약간 바꾼다.

1. `Desk RPG Product Vision 1`
   - Master Spec v0.1을 repo 내부 durable product vision으로 정리.
   - 조용한 운영실, user avatar, MVP success scene, non-goals 확정.
2. `Desk RPG Projection Model 1`
   - role avatar vs runtime instance
   - event/request/visual projection 분리
   - character/desk/board/vault state model
   - visible worker cap/noise suppression
3. `Desk RPG IA/Layout 1`
   - single central office fixed layout
   - board/worker/NAS vault/inspector 배치
   - HUD 제거/숨김/탭 구조
4. `Controlled Mutation & Approval Model 1`
   - 자연어/quick action이 어떻게 event request가 되는지
   - Orchestrator 승인/분배
   - NAS Keeper approval/write boundary
5. 그 다음에 구현 로드맵

이 순서가 좋은 이유: 바로 구현 로드맵으로 가면 또 HUD/strip을 하나 더 붙일 가능성이 높다. 먼저 “무엇을 투영할지”와 “누가 어떤 권한으로 움직이는지”를 고정해야 한다.

## 다음 승인 요청으로 적합한 문장

다음 세션/다음 작업 승인 문구는 아래가 적합하다.

```text
AI Office 통합 운영실을 Master Spec v0.1의 Desk RPG/JRPG 운영실 방향으로 재정렬한다. 코드 구현은 하지 말고, 먼저 repo 내부 문서로 `Desk RPG Product Vision 1`, `Desk RPG Projection Model 1`, `Desk RPG IA/Layout 1`을 작성한다. 기존 read-only-first 안전 원칙은 유지하되, 장기 controlled mutation/approval 목표와 충돌하지 않게 정리한다. 기존 evidence 문서는 삭제하지 않고 링크한다. VPS/Kanban/cron/NAS/service restart/renderer dependency는 변경하지 않는다.
```

## 당장 implementation으로 들어가지 말아야 하는 이유

현 상태에서 바로 UI를 바꾸면 다음 문제가 생긴다.

- 현재 `/office`가 이미 Stage/HUD/rail이 누적되어 있어 더 복잡해진다.
- Master Spec의 핵심은 sprite가 아니라 event/authority/projection인데 renderer 작업부터 시작할 위험이 있다.
- mutation/control을 UI에 먼저 넣으면 권한 모델이 뒤따라가게 된다.
- NAS Keeper, approval, Orchestrator mediation이 문서/테스트 contract 없이 구현되면 나중에 보안 모델을 되돌리기 어렵다.

따라서 다음 실제 개발 전 최소 문서 contract는 다음 세 가지다.

1. canonical event/request/projection vocabulary
2. role avatar/runtime instance/visible actor model
3. approval/NAS write authority boundary
