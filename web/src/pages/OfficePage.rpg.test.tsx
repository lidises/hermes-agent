import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@nous-research/ui/ui/components/button", () => ({
  Button: ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props}>{children}</button>,
}));

vi.mock("@nous-research/ui/ui/components/spinner", () => ({
  Spinner: ({ className }: { className?: string }) => <span className={className}>loading</span>,
}));

vi.mock("@/lib/api", () => ({
  api: {
    getOfficeEvents: vi.fn(),
    getOfficeState: vi.fn(),
  },
}));

import * as OfficePageModule from "./OfficePage";
import { OfficeRpgMap } from "./OfficePage";
import { buildOfficeDeskRpgProjectionModel, buildOfficeDeskRpgWorkerRoleVisibility, buildOfficeDisabledApprovalDialoguePosture, buildOfficeReviewerWikiHandoffPosture, buildOfficeApprovalDialogueInspectorDetail, buildOfficeReviewerWikiEvidenceDetailPosture, buildOfficeBoardEvidenceInspectorDrilldown, buildOfficeBossOrchestratorRequestPostureDetail, buildOfficeOrchestratorRequestEnvelopeDetail, buildOfficeApprovalRequestRouteDetail, buildOfficeEventRequestContractProjection, buildOfficeApprovalDialogueRouteInspector, buildOfficeEventTimelineProjection, buildOfficeTimelineWorkerHandoffDrilldown, buildOfficeApprovalRequestDetailDeepening, buildOfficeApprovalRequestView, buildOfficeApprovalAuditTimeline, buildOfficeApprovalExecutionGate, buildOfficeAuthorityAdapterContract, buildOfficeOrchestratorMediationQueue, buildOfficeWorkerIntentRouting, buildOfficeWorkerFacilityReadiness, buildOfficeWorkerAssignmentCandidateGate, buildOfficeWorkerRequestDraftPreview, buildOfficeWorkerHumanConfirmationEnvelope, buildOfficeWorkerAuthorityHandoffEnvelope, buildOfficeWorkerDispatchDryRunEnvelope, buildOfficeWorkerAuditPreviewEnvelope, buildOfficeWorkerRollbackPreviewEnvelope, buildOfficeWorkerFinalGateChecklist, buildOfficeWorkerFacilityLanePolish, buildOfficeWorkerRequestHandoffDetail, buildOfficeApprovalNasBoundaryPolish, buildOfficeApprovalAuthorityReadinessDetail, buildOfficeApprovalAuthorityDecisionEnvelopePreview, buildOfficeApprovalDecisionAuditNasTracePreview, buildOfficeNasKeeperSaveRequestGate, buildOfficeNasKeeperRollbackEvidencePreview, buildOfficeNasEvidencePackageStoreReadbackStatus, buildOfficeNasPathValidationStatusSurface, buildOfficeNasPathPreviewStatusSurface, buildOfficeNasPathPreviewStoreReadbackStatusSurface, buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface, buildOfficeNasRuntimeSingleFileWriteApprovalAction, buildOfficeDeskRpgReadOnlyChainCompletionReview, buildOfficeEventDrivenCharacterStateProjection, buildOfficeCharacterStateRoomOverlay, buildOfficeCharacterRoomInteractionPosture, buildOfficeCharacterInspectorDetailPosture, buildOfficeCharacterDetailSafeDialogueCopy, buildOfficeCharacterBubbleInspectorAlignment, buildOfficeCharacterPanelBoundarySummary, buildOfficeCharacterFacilityRoleLegend, buildOfficeCharacterFacilityBoundaryStrip, buildOfficeCharacterFacilitySourceLedgerStrip, buildOfficeCharacterFacilityCompletionReview, buildOfficeControlledMutationProposalContract, buildOfficeControlledMutationDryRunPlan, buildOfficeControlledMutationAuditSinkPlan, buildOfficeControlledMutationRollbackVerificationPlan, buildOfficeControlledMutationHumanApprovalPlan, buildOfficeControlledMutationAuthoritySummary, buildOfficeControlledMutationExecutionReadinessSummary, buildOfficeControlledMutationContractPostureProjection, buildOfficeControlledMutationContractPosturePolish, buildOfficeControlledMutationReadinessHandoffRibbon, buildOfficeControlledMutationReadinessSummaryPolish, buildOfficeControlledMutationRequestStorePosture, buildOfficeControlledMutationRequestStoreHardeningPlan, buildOfficeControlledMutationNextApprovalBoundary, buildOfficeControlledMutationPostDecisionApprovalBoundary, buildOfficeControlledMutationPostRegistryApprovalBoundary, buildOfficeControlledMutationTargetDispatchForbiddenBoundary, buildOfficeControlledMutationSafeContinuationCompletionReview, buildOfficeRpgScene } from "./officeView";
import type { OfficeState } from "@/lib/api";

function officeFixture(overrides: Partial<OfficeState> = {}): OfficeState {
  return {
    schema_version: 1,
    generated_at: "2026-05-13T10:00:00Z",
    mode: "read_only",
    display_mode: "localhost",
    capabilities: { read_only: true, mutations_enabled: false, remote_mode: "unsupported" },
    data_sources: [],
    summary: {},
    rooms: [],
    agents: [],
    work_items: [],
    automations: [],
    topics: [],
    events: [],
    provenance: [],
    redactions: { policy_version: 1, redacted_field_count: 0, omitted_sections: [], warnings: [] },
    projection_cache: {
      schema_version: 1,
      status: "missing",
      redacted: true,
      cache_layout: { incoming: "incoming", active: "active", archive: "archive", rejected: "rejected" },
      active: null,
      rejected: { count: 0, recent: [] },
    },
    ...overrides,
  };
}

describe("OfficeRpgMap", () => {
  it("renders the read-only RPG room map and mirrors every entity in a text fallback", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      data_sources: [
        { id: "kanban", status: "ok", checked_at: "2026-05-13T09:59:00Z", item_count: 4, warning_count: 0 },
        { id: "paperclip", status: "partial", checked_at: "2026-05-13T09:58:00Z", item_count: 2, warning_count: 1, error_summary: "raw /Users/lidises/nas token must not leak" },
      ],
      agents: [
        { id: "agent-1", status: "active", model: "private-model", prompt: "raw prompt must not leak" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw task title", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "task-2", status: "done", title: "raw done title", transcript: "raw done transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "job-1", state: "scheduled", last_status: "ok", next_run_at: "2026-05-13T11:00:00Z", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number],
      ],
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "warning", generated_at: "2026-05-13T09:55:00Z", detail: "raw token detail" } as unknown as OfficeState["events"][number],
      ],
      redactions: { policy_version: 1, redacted_field_count: 2, omitted_sections: ["prompt", "transcript"], warnings: ["raw warning"] },
    }));

    const markup = renderToStaticMarkup(<OfficeRpgMap scene={scene} onInspectEntity={() => undefined} selectedEntityId={null} />);

    expect(markup).toContain("data-office-rpg-map");
    expect(markup).toContain("data-office-rpg-jump-target=\"map\"");
    expect(markup).toContain("data-office-rpg-jump-target=\"attention\"");
    expect(markup).toContain("data-office-rpg-jump-target=\"source_archive\"");
    expect(markup).toContain("data-office-rpg-jump-target=\"inspector\"");
    expect(markup).toContain("data-office-rpg-jump-target=\"fallback\"");
    expect(markup).toContain("data-office-rpg-filter=\"room\"");
    expect(markup).toContain("data-office-rpg-filter=\"status\"");
    expect(markup).toContain("data-office-rpg-filter=\"severity\"");
    expect(markup).toContain("data-office-rpg-filter=\"role\"");
    expect(markup).toContain("data-office-rpg-mission-storyboard=\"true\"");
    expect(markup).toContain("data-office-rpg-mission-step=\"orchestrate\"");
    expect(markup).toContain("data-office-rpg-orchestrator-desk=\"true\"");
    expect(markup).toContain("data-office-rpg-orchestrator-card=\"decompose\"");
    expect(markup).toContain("data-office-rpg-orchestrator-card=\"authority\"");
    expect(markup).toContain("data-office-rpg-orchestrator-boundary=\"true\"");
    expect(markup).toContain("data-office-rpg-kanban-board=\"true\"");
    expect(markup).toContain("data-office-rpg-kanban-lane=\"active\"");
    expect(markup).toContain("data-office-rpg-kanban-lane=\"boundary\"");
    expect(markup).toContain("data-office-rpg-kanban-boundary=\"true\"");
    expect(markup).toContain("data-office-rpg-source-archive=\"true\"");
    expect(markup).toContain("data-office-rpg-source-shelf=\"evidence\"");
    expect(markup).toContain("data-office-rpg-source-shelf=\"manifests\"");
    expect(markup).toContain("data-office-rpg-source-boundary=\"true\"");
    expect(markup).toContain("data-office-rpg-review-corner=\"true\"");
    expect(markup).toContain("data-office-rpg-review-station=\"blocked\"");
    expect(markup).toContain("data-office-rpg-review-station=\"boundary\"");
    expect(markup).toContain("data-office-rpg-review-boundary=\"true\"");
    expect(markup).toContain("AI Office RPG Visualizer");
    expect(markup).toContain("읽기 전용");
    expect(markup).toContain("Command Room");
    expect(markup).toContain("Agent Desks");
    expect(markup).toContain("Task Board");
    expect(markup).toContain("Cron Room");
    expect(markup).toContain("Source Archive");
    expect(markup).toContain("Incident Corner");
    expect(markup.match(/data-office-rpg-entity=/g)?.length).toBe(scene.entities.length);
    expect(markup.match(/data-office-rpg-fallback-row=/g)?.length).toBe(scene.entities.length);
    expect(markup).toContain("최근 안전 이벤트");
    expect(markup).not.toMatch(/raw prompt|raw transcript|raw task|secret body|raw token|raw warning|\/Users\/lidises|private-model/i);
  });
});

describe("OfficeDeskRpgRoomShell", () => {
  it("Desk RPG Room Shell 1 renders a read-only operating-room shell from the safe projection DTO", () => {
    const OfficeDeskRpgRoomShell = (OfficePageModule as unknown as {
      OfficeDeskRpgRoomShell: React.ComponentType<{ projection: ReturnType<typeof buildOfficeDeskRpgProjectionModel> }>;
    }).OfficeDeskRpgRoomShell;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: Array.from({ length: 5 }, (_, index) => ({
        id: `agent-${index}`,
        status: "active",
        prompt: "raw prompt must not leak into room shell",
        provider: "private-provider-hidden-id",
        api_key: "sk-test-room-shell-1234567890",
      })),
      work_items: [
        { id: "task-1", status: "blocked", title: "raw task title", body: "/Users/lidises/private/wiki.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback raw source" },
      ],
    }));

    const markup = renderToStaticMarkup(<OfficeDeskRpgRoomShell projection={projection} />);

    expect(markup).toContain("data-office-desk-rpg-room-shell=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-facilities=\"true\"");
    for (const id of ["boss_desk", "orchestrator_desk", "worker_cluster", "central_board", "right_inspector", "nas_vault", "security_ops_corner", "calm_activity_lane"]) {
      expect(markup).toContain(`data-office-desk-rpg-facility="${id}"`);
    }
    for (const role of ["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]) {
      expect(markup).toContain(`data-office-desk-rpg-actor="${role}"`);
    }
    expect(markup).toContain("읽기 전용 Desk RPG 운영실");
    expect(markup).toContain("NAS 저장은 승인 전 차단");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toMatch(/raw prompt|raw task title|Traceback|\/Users\/lidises|sk-test-room-shell|private-provider/i);
  });
});

describe("OfficeDeskRpgInspectorPanel", () => {
  it("Desk RPG Inspector Migration 1 bridges safe DTO details into a read-only right inspector posture", () => {
    const OfficeDeskRpgInspectorPanel = (OfficePageModule as unknown as {
      OfficeDeskRpgInspectorPanel: React.ComponentType<{ projection: ReturnType<typeof buildOfficeDeskRpgProjectionModel> }>;
    }).OfficeDeskRpgInspectorPanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: Array.from({ length: 6 }, (_, index) => ({
        id: `agent-${index}`,
        status: "active",
        prompt: "raw inspector prompt must not leak",
        provider: "private-inspector-provider",
        api_key: "token-shaped-inspector-sentinel",
      })),
      work_items: [
        { id: "task-1", status: "blocked", title: "raw inspector task title", body: "/Users/lidises/private/inspector.md" } as unknown as OfficeState["work_items"][number],
        { id: "task-2", status: "done", title: "safe count only" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback inspector source" },
      ],
    }));

    const markup = renderToStaticMarkup(<OfficeDeskRpgInspectorPanel projection={projection} />);

    expect(markup).toContain("data-office-desk-rpg-inspector=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-targets=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-target=\"actor:search_worker\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-target=\"facility:right_inspector\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-board=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-vault=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-ops=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-inspector-suppressed-search-worker=\"3\"");
    expect(markup).toContain("Right inspector posture");
    expect(markup).toContain("aggregate-only");
    expect(markup).toContain("승인 전 NAS 저장 차단");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toMatch(/raw inspector prompt|raw inspector task title|Traceback|\/Users\/lidises|token-shaped-inspector-sentinel|\*\*\*|private-inspector-provider/i);
  });
});

describe("OfficeDeskRpgBoardEvidencePanel", () => {
  it("Desk RPG Board Evidence Tab 1 migrates safe board and evidence posture into a read-only central board tab", () => {
    const OfficeDeskRpgBoardEvidencePanel = (OfficePageModule as unknown as {
      OfficeDeskRpgBoardEvidencePanel: React.ComponentType<{ projection: ReturnType<typeof buildOfficeDeskRpgProjectionModel> }>;
    }).OfficeDeskRpgBoardEvidencePanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw board prompt", provider: "private-board-provider", api_key: "token-shaped-inspector-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw board task title", body: "/Users/lidises/private/board.md" } as unknown as OfficeState["work_items"][number],
        { id: "task-2", status: "done", title: "raw board done title", transcript: "raw board transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback board source" },
        { id: "kanban", status: "ok", checked_at: "2026-05-14T00:00:00Z", item_count: 2, warning_count: 0 },
      ],
    }));

    const markup = renderToStaticMarkup(<OfficeDeskRpgBoardEvidencePanel projection={projection} />);

    expect(markup).toContain("data-office-desk-rpg-board=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-board-tab=\"evidence\"");
    expect(markup).toContain("data-office-desk-rpg-board-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-board-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-board-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-board-work-count=\"2\"");
    expect(markup).toContain("data-office-desk-rpg-board-blocked-count=\"1\"");
    expect(markup).toContain("data-office-desk-rpg-board-source-count=\"2\"");
    expect(markup).toContain("data-office-desk-rpg-board-warning-count=\"1\"");
    expect(markup).toContain("data-office-desk-rpg-board-raw-bodies-visible=\"false\"");
    expect(markup).toContain("Central board evidence tab");
    expect(markup).toContain("aggregate-only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toMatch(/raw board prompt|raw board task title|raw board done title|raw board transcript|Traceback|\/Users\/lidises|token-shaped-inspector-sentinel|\*\*\*|private-board-provider/i);
  });
});

describe("OfficeDeskRpgWorkerRoleVisibilityPanel", () => {
  it("Desk RPG Worker Role Visibility 1 renders safe worker roles without assignment controls", () => {
    const OfficeDeskRpgWorkerRoleVisibilityPanel = (OfficePageModule as unknown as {
      OfficeDeskRpgWorkerRoleVisibilityPanel: React.ComponentType<{ visibility: ReturnType<typeof buildOfficeDeskRpgWorkerRoleVisibility> }>;
    }).OfficeDeskRpgWorkerRoleVisibilityPanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw worker prompt", provider: "private-worker-provider", api_key: "token-shaped-worker-sentinel" },
        { id: "agent-2", status: "active" },
        { id: "agent-3", status: "active" },
        { id: "agent-4", status: "active" },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw worker task title", body: "/Users/lidises/private/worker.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback worker source" },
      ],
    }));
    const visibility = buildOfficeDeskRpgWorkerRoleVisibility(projection);

    const markup = renderToStaticMarkup(<OfficeDeskRpgWorkerRoleVisibilityPanel visibility={visibility} />);

    expect(markup).toContain("data-office-desk-rpg-worker-roles=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-worker-roles-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-worker-roles-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-worker-roles-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-worker-roles-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-worker-role=\"search_worker\"");
    expect(markup).toContain("data-office-desk-rpg-worker-role=\"reviewer\"");
    expect(markup).toContain("data-office-desk-rpg-worker-role=\"wiki_writer\"");
    expect(markup).toContain("data-office-desk-rpg-worker-role=\"nas_keeper\"");
    expect(markup).toContain("Worker role visibility");
    expect(markup).toContain("역할 가시성");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw worker prompt|raw worker task title|Traceback|\/Users\/lidises|token-shaped-worker-sentinel|private-worker-provider/i);
  });
});

describe("DisabledApprovalDialoguePosturePanel", () => {
  it("Disabled Approval Dialogue Posture 1 renders a JRPG dialogue as disabled read-only posture", () => {
    const DisabledApprovalDialoguePosturePanel = (OfficePageModule as unknown as {
      DisabledApprovalDialoguePosturePanel: React.ComponentType<{ dialogue: ReturnType<typeof buildOfficeDisabledApprovalDialoguePosture> }>;
    }).DisabledApprovalDialoguePosturePanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw dialogue prompt", provider: "private-dialogue-provider", api_key: "token-shaped-dialogue-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw dialogue task title", body: "/Users/lidises/private/dialogue.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback dialogue source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);

    const markup = renderToStaticMarkup(<DisabledApprovalDialoguePosturePanel dialogue={dialogue} />);

    expect(markup).toContain("data-office-disabled-approval-dialogue=\"true\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-reject-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-hold-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-line=\"report\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-line=\"approval\"");
    expect(markup).toContain("data-office-disabled-approval-dialogue-line=\"boundary\"");
    expect(markup).toContain("Disabled approval dialogue posture");
    expect(markup).toContain("승인 대화 posture");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw dialogue prompt|raw dialogue task title|Traceback|\/Users\/lidises|token-shaped-dialogue-sentinel|private-dialogue-provider/i);
  });
});

describe("ReviewerWikiHandoffPosturePanel", () => {
  it("Reviewer/Wiki Handoff Posture 1 renders a disabled review-to-wiki handoff without controls", () => {
    const ReviewerWikiHandoffPosturePanel = (OfficePageModule as unknown as {
      ReviewerWikiHandoffPosturePanel: React.ComponentType<{ handoff: ReturnType<typeof buildOfficeReviewerWikiHandoffPosture> }>;
    }).ReviewerWikiHandoffPosturePanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw handoff prompt", provider: "private-handoff-provider", api_key: "token-shaped-handoff-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw reviewer wiki task title", body: "/Users/lidises/private/handoff.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 4, warning_count: 2, error_summary: "Traceback handoff source" },
      ],
    }));
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);

    const markup = renderToStaticMarkup(<ReviewerWikiHandoffPosturePanel handoff={handoff} />);

    expect(markup).toContain("data-office-reviewer-wiki-handoff=\"true\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-review-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-wiki-draft-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-step=\"search_evidence\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-step=\"review_gate\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-step=\"wiki_draft\"");
    expect(markup).toContain("data-office-reviewer-wiki-handoff-step=\"nas_boundary\"");
    expect(markup).toContain("Reviewer/Wiki handoff posture");
    expect(markup).toContain("검토 → 위키 작성 handoff");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw handoff prompt|raw reviewer wiki task title|Traceback|\/Users\/lidises|token-shaped-handoff-sentinel|private-handoff-provider/i);
  });
});

describe("ApprovalDialogueInspectorDetailPanel", () => {
  it("Approval Dialogue Inspector Detail 1 renders disabled inspector cards without controls", () => {
    const ApprovalDialogueInspectorDetailPanel = (OfficePageModule as unknown as {
      ApprovalDialogueInspectorDetailPanel: React.ComponentType<{ inspector: ReturnType<typeof buildOfficeApprovalDialogueInspectorDetail> }>;
    }).ApprovalDialogueInspectorDetailPanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw inspector prompt", provider: "private-inspector-provider", api_key: "token-shaped-inspector-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw approval inspector task title", body: "/Users/lidises/private/inspector.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 5, warning_count: 2, error_summary: "Traceback inspector source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const inspector = buildOfficeApprovalDialogueInspectorDetail(dialogue, handoff);

    const markup = renderToStaticMarkup(<ApprovalDialogueInspectorDetailPanel inspector={inspector} />);

    expect(markup).toContain("data-office-approval-dialogue-inspector=\"true\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-review-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-card=\"dialogue_summary\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-card=\"review_handoff\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-card=\"decision_boundary\"");
    expect(markup).toContain("data-office-approval-dialogue-inspector-card=\"nas_boundary\"");
    expect(markup).toContain("Approval dialogue inspector detail");
    expect(markup).toContain("승인 대화 inspector");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw inspector prompt|raw approval inspector task title|Traceback|\/Users\/lidises|token-shaped-inspector-sentinel|private-inspector-provider/i);
  });
});

describe("ReviewerWikiEvidenceDetailPosturePanel", () => {
  it("Reviewer/Wiki Evidence Detail Posture 1 renders safe evidence detail without source controls", () => {
    const ReviewerWikiEvidenceDetailPosturePanel = (OfficePageModule as unknown as {
      ReviewerWikiEvidenceDetailPosturePanel: React.ComponentType<{ detail: ReturnType<typeof buildOfficeReviewerWikiEvidenceDetailPosture> }>;
    }).ReviewerWikiEvidenceDetailPosturePanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw evidence prompt", provider: "private-evidence-provider", api_key: "token-shaped-evidence-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw evidence detail task title", body: "/Users/lidises/private/evidence.md", transcript: "Traceback evidence transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 7, warning_count: 3, error_summary: "Traceback evidence source" },
      ],
    }));
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const detail = buildOfficeReviewerWikiEvidenceDetailPosture(projection, handoff);

    const markup = renderToStaticMarkup(<ReviewerWikiEvidenceDetailPosturePanel detail={detail} />);

    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail=\"true\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-source-open-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-review-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-wiki-draft-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-card=\"safe_evidence_count\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-card=\"review_warning_count\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-card=\"wiki_material_posture\"");
    expect(markup).toContain("data-office-reviewer-wiki-evidence-detail-card=\"nas_save_boundary\"");
    expect(markup).toContain("Reviewer/Wiki evidence detail posture");
    expect(markup).toContain("근거 detail posture");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw evidence prompt|raw evidence detail task title|Traceback|\/Users\/lidises|token-shaped-evidence-sentinel|private-evidence-provider/i);
  });
});



describe("BoardEvidenceInspectorDrilldownPanel", () => {
  it("Board Evidence-to-Inspector Drill-down 1 renders a disabled board-to-inspector path without controls", () => {
    const BoardEvidenceInspectorDrilldownPanel = (OfficePageModule as unknown as {
      BoardEvidenceInspectorDrilldownPanel: React.ComponentType<{ drilldown: ReturnType<typeof buildOfficeBoardEvidenceInspectorDrilldown> }>;
    }).BoardEvidenceInspectorDrilldownPanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw drilldown prompt", provider: "private-drilldown-provider", api_key: "token-shaped-drilldown-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw drilldown task title", body: "/Users/lidises/private/drilldown.md", transcript: "Traceback drilldown transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 9, warning_count: 4, error_summary: "Traceback drilldown source" },
      ],
    }));
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const evidenceDetail = buildOfficeReviewerWikiEvidenceDetailPosture(projection, handoff);
    const drilldown = buildOfficeBoardEvidenceInspectorDrilldown(projection, evidenceDetail);

    const markup = renderToStaticMarkup(<BoardEvidenceInspectorDrilldownPanel drilldown={drilldown} />);

    expect(markup).toContain("data-office-board-evidence-inspector-drilldown=\"true\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-board-open-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-source-open-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-inspector-write-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-card=\"central_board\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-card=\"evidence_tab\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-card=\"right_inspector\"");
    expect(markup).toContain("data-office-board-evidence-inspector-drilldown-card=\"approval_boundary\"");
    expect(markup).toContain("Board evidence-to-inspector drill-down");
    expect(markup).toContain("중앙 board → right inspector");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw drilldown prompt|raw drilldown task title|Traceback|\/Users\/lidises|token-shaped-drilldown-sentinel|private-drilldown-provider/i);
  });
});

describe("BossOrchestratorRequestPostureDetailPanel", () => {
  it("Boss/Orchestrator Request Posture Detail 1 renders request posture without inputs or controls", () => {
    const BossOrchestratorRequestPostureDetailPanel = (OfficePageModule as unknown as {
      BossOrchestratorRequestPostureDetailPanel: React.ComponentType<{ detail: ReturnType<typeof buildOfficeBossOrchestratorRequestPostureDetail> }>;
    }).BossOrchestratorRequestPostureDetailPanel;
    const secretSentinel = ["token", "shaped", "boss", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw boss request prompt", provider: "private-boss-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw boss request task title", body: "/Users/lidises/private/boss-request.md", transcript: "Traceback boss request transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 5, warning_count: 2, error_summary: "Traceback boss request source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const detail = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);

    const markup = renderToStaticMarkup(<BossOrchestratorRequestPostureDetailPanel detail={detail} />);

    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail=\"true\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-input-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-orchestrator-required=\"true\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-work-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-card=\"boss_instruction_point\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-card=\"orchestrator_mediation\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-card=\"request_envelope\"");
    expect(markup).toContain("data-office-boss-orchestrator-request-posture-detail-card=\"approval_boundary\"");
    expect(markup).toContain("Boss/orchestrator request posture detail");
    expect(markup).toContain("사장 instruction → Orchestrator mediation");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw boss request prompt|raw boss request task title|Traceback|\/Users\/lidises|token-shaped-boss-sentinel|private-boss-provider/i);
  });
});

describe("OrchestratorRequestEnvelopeDetailPanel", () => {
  it("Orchestrator Request Envelope Detail 1 renders disabled envelope posture without controls", () => {
    const OrchestratorRequestEnvelopeDetailPanel = (OfficePageModule as unknown as {
      OrchestratorRequestEnvelopeDetailPanel: React.ComponentType<{ envelope: ReturnType<typeof buildOfficeOrchestratorRequestEnvelopeDetail> }>;
    }).OrchestratorRequestEnvelopeDetailPanel;
    const secretSentinel = ["token", "shaped", "envelope", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw envelope prompt", provider: "private-envelope-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw envelope task title", body: "/Users/lidises/private/envelope.md", transcript: "Traceback envelope transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 7, warning_count: 3, error_summary: "Traceback envelope source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);

    const markup = renderToStaticMarkup(<OrchestratorRequestEnvelopeDetailPanel envelope={envelope} />);

    expect(markup).toContain("data-office-orchestrator-request-envelope-detail=\"true\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-envelope-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-kanban-write-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-work-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-card=\"instruction_intake\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-card=\"mediation_guard\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-card=\"safe_context_envelope\"");
    expect(markup).toContain("data-office-orchestrator-request-envelope-detail-card=\"approval_request_boundary\"");
    expect(markup).toContain("Orchestrator request envelope detail");
    expect(markup).toContain("Orchestrator envelope · disabled request preview");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw envelope prompt|raw envelope task title|Traceback|\/Users\/lidises|token-shaped-envelope-sentinel|private-envelope-provider/i);
  });
});


describe("ApprovalRequestRouteDetailPanel", () => {
  it("Approval Request Route Detail 1 renders read-only route boundaries without controls", () => {
    const ApprovalRequestRouteDetailPanel = (OfficePageModule as unknown as {
      ApprovalRequestRouteDetailPanel: React.ComponentType<{ route: ReturnType<typeof buildOfficeApprovalRequestRouteDetail> }>;
    }).ApprovalRequestRouteDetailPanel;
    const secretSentinel = ["token", "shaped", "route", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw route prompt", provider: "private-route-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw route task title", body: "/Users/lidises/private/route.md", transcript: "Traceback route transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 9, warning_count: 4, error_summary: "Traceback route source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);

    const markup = renderToStaticMarkup(<ApprovalRequestRouteDetailPanel route={route} />);

    expect(markup).toContain("data-office-approval-request-route-detail=\"true\"");
    expect(markup).toContain("data-office-approval-request-route-detail-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-request-route-detail-intent-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-approval-request-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-kanban-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-route-detail-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-approval-request-route-detail-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-approval-request-route-detail-card=\"intent_event_boundary\"");
    expect(markup).toContain("data-office-approval-request-route-detail-card=\"orchestrator_plan_boundary\"");
    expect(markup).toContain("data-office-approval-request-route-detail-card=\"approval_request_boundary\"");
    expect(markup).toContain("data-office-approval-request-route-detail-card=\"write_audit_boundary\"");
    expect(markup).toContain("Approval request route detail");
    expect(markup).toContain("Intent → Orchestrator plan → Approval request · read-only route");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw route prompt|raw route task title|Traceback|\/Users\/lidises|token-shaped-route-sentinel|private-route-provider/i);
  });
});


describe("EventRequestContractProjectionPanel", () => {
  it("Event Request Contract Projection 1 renders future event contract without controls", () => {
    const EventRequestContractProjectionPanel = (OfficePageModule as unknown as {
      EventRequestContractProjectionPanel: React.ComponentType<{ contract: ReturnType<typeof buildOfficeEventRequestContractProjection> }>;
    }).EventRequestContractProjectionPanel;
    const secretSentinel = ["token", "shaped", "event", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw event prompt", provider: "private-event-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw event task title", body: "/Users/lidises/private/event.md", transcript: "Traceback event transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 11, warning_count: 5, error_summary: "Traceback event source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);

    const markup = renderToStaticMarkup(<EventRequestContractProjectionPanel contract={contract} />);

    expect(markup).toContain("data-office-event-request-contract-projection=\"true\"");
    expect(markup).toContain("data-office-event-request-contract-projection-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-event-request-contract-projection-schema-write-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-runtime-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-event-request-contract-projection-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-event-request-contract-projection-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-event-request-contract-projection-card=\"user_instruction_submitted\"");
    expect(markup).toContain("data-office-event-request-contract-projection-card=\"orchestrator_plan_requested\"");
    expect(markup).toContain("data-office-event-request-contract-projection-card=\"approval_requested\"");
    expect(markup).toContain("data-office-event-request-contract-projection-card=\"write_audit_projection\"");
    expect(markup).toContain("Event request contract projection");
    expect(markup).toContain("Future event contract · projection only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw event prompt|raw event task title|Traceback|\/Users\/lidises|token-shaped-event-sentinel|private-event-provider/i);
  });
});


describe("ApprovalDialogueRouteInspectorPanel", () => {
  it("Approval Dialogue Route Inspector 1 renders route inspector without controls", () => {
    const ApprovalDialogueRouteInspectorPanel = (OfficePageModule as unknown as {
      ApprovalDialogueRouteInspectorPanel: React.ComponentType<{ inspector: ReturnType<typeof buildOfficeApprovalDialogueRouteInspector> }>;
    }).ApprovalDialogueRouteInspectorPanel;
    const secretSentinel = ["token", "shaped", "dialogue", "route", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw dialogue route prompt", provider: "private-dialogue-route-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw dialogue route task title", body: "/Users/lidises/private/dialogue-route.md", transcript: "Traceback dialogue route transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 6, error_summary: "Traceback dialogue route source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);

    const markup = renderToStaticMarkup(<ApprovalDialogueRouteInspectorPanel inspector={inspector} />);

    expect(markup).toContain("data-office-approval-dialogue-route-inspector=\"true\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-reject-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-hold-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-card=\"dialogue_posture\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-card=\"route_boundaries\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-card=\"event_contract\"");
    expect(markup).toContain("data-office-approval-dialogue-route-inspector-card=\"write_lock\"");
    expect(markup).toContain("Approval dialogue route inspector");
    expect(markup).toContain("Dialogue → route → event contract · inspector only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw dialogue route prompt|raw dialogue route task title|Traceback|\/Users\/lidises|token-shaped-dialogue-route-sentinel|private-dialogue-route-provider/i);
  });
});


describe("EventTimelineProjectionPanel", () => {
  it("Event Timeline Projection 1 renders a read-only event timeline without controls", () => {
    const EventTimelineProjectionPanel = (OfficePageModule as unknown as {
      EventTimelineProjectionPanel: React.ComponentType<{ timeline: ReturnType<typeof buildOfficeEventTimelineProjection> }>;
    }).EventTimelineProjectionPanel;
    const secretSentinel = ["token", "shaped", "timeline", "sentinel"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw timeline prompt", provider: "private-timeline-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw timeline task title", body: "/Users/lidises/private/event-timeline.md", transcript: "Traceback event timeline transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 21, warning_count: 8, error_summary: "Traceback event timeline source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);

    const markup = renderToStaticMarkup(<EventTimelineProjectionPanel timeline={timeline} />);

    expect(markup).toContain("data-office-event-timeline-projection=\"true\"");
    expect(markup).toContain("data-office-event-timeline-projection-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-event-timeline-projection-runtime-event-write-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-intent-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-visual-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-timeline-append-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-event-timeline-projection-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-event-timeline-projection-raw-excluded=\"true\"");
    expect(markup).toContain("data-office-event-timeline-projection-event=\"user_instruction_submitted\"");
    expect(markup).toContain("data-office-event-timeline-projection-event=\"orchestrator_plan_requested\"");
    expect(markup).toContain("data-office-event-timeline-projection-event=\"approval_requested\"");
    expect(markup).toContain("data-office-event-timeline-projection-event=\"nas_save_approval_pending\"");
    expect(markup).toContain("Event timeline projection");
    expect(markup).toContain("Runtime → intent → visual projection · no event writes");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw timeline prompt|raw timeline task title|Traceback|\/Users\/lidises|token-shaped-timeline-sentinel|private-timeline-provider/i);
  });
});

describe("TimelineWorkerHandoffDrilldownPanel", () => {
  it("Timeline/Worker Handoff Drill-down 1 renders a read-only worker drill-down without controls", () => {
    const TimelineWorkerHandoffDrilldownPanel = (OfficePageModule as unknown as {
      TimelineWorkerHandoffDrilldownPanel: React.ComponentType<{ drilldown: ReturnType<typeof buildOfficeTimelineWorkerHandoffDrilldown> }>;
    }).TimelineWorkerHandoffDrilldownPanel;
    const secretSentinel = ["token", "shaped", "worker", "handoff"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw worker handoff prompt", provider: "private-worker-handoff-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw worker handoff task", body: "/Users/lidises/private/worker-handoff.md", transcript: "Traceback worker handoff transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 5, error_summary: "Traceback worker handoff source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);

    const markup = renderToStaticMarkup(<TimelineWorkerHandoffDrilldownPanel drilldown={drilldown} />);

    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown=\"true\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-write-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-work-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-step=\"search_worker\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-step=\"reviewer\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-step=\"wiki_writer\"");
    expect(markup).toContain("data-office-timeline-worker-handoff-drilldown-step=\"nas_keeper\"");
    expect(markup).toContain("Timeline/worker handoff drill-down");
    expect(markup).toContain("Projected worker sequence · no assignment");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw worker handoff prompt|raw worker handoff task|Traceback|\/Users\/lidises|token-shaped-worker-handoff|private-worker-handoff-provider/i);
  });
});


describe("ApprovalRequestDetailDeepeningPanel", () => {
  it("Approval-request Detail Deepening 1 renders a read-only approval request detail without controls", () => {
    const ApprovalRequestDetailDeepeningPanel = (OfficePageModule as unknown as {
      ApprovalRequestDetailDeepeningPanel: React.ComponentType<{ detail: ReturnType<typeof buildOfficeApprovalRequestDetailDeepening> }>;
    }).ApprovalRequestDetailDeepeningPanel;
    const secretSentinel = ["token", "shaped", "approval", "detail"].join("-");
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw approval detail prompt", provider: "private-approval-detail-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw approval detail task", body: "/Users/lidises/private/approval-detail.md", transcript: "Traceback approval detail transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 8, warning_count: 2, error_summary: "Traceback approval detail source" },
      ],
    }));
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
    const detail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);

    const markup = renderToStaticMarkup(<ApprovalRequestDetailDeepeningPanel detail={detail} />);

    expect(markup).toContain("data-office-approval-request-detail-deepening=\"true\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-work-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-section=\"request_snapshot\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-section=\"timeline_alignment\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-section=\"worker_handoff\"");
    expect(markup).toContain("data-office-approval-request-detail-deepening-section=\"write_boundary\"");
    expect(markup).toContain("Approval-request detail deepening");
    expect(markup).toContain("Approval request detail · projection only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw approval detail prompt|raw approval detail task|Traceback|\/Users\/lidises|token-shaped-approval-detail|private-approval-detail-provider/i);
  });
});


describe("WorkerFacilityLanePolishPanel", () => {
  it("Worker Facility Lane Polish 1 renders facility lanes as read-only posture", () => {
    const WorkerFacilityLanePolishPanel = (OfficePageModule as unknown as {
      WorkerFacilityLanePolishPanel: React.ComponentType<{ polish: ReturnType<typeof buildOfficeWorkerFacilityLanePolish> }>;
    }).WorkerFacilityLanePolishPanel;
    const state = officeFixture({
      agents: [{ id: "agent-worker-lane", status: "active", prompt: "raw worker lane prompt", provider: "private-worker-lane-provider", api_key: "token-shaped-worker-lane-polish" }],
      work_items: [
        { id: "task-worker-lane", status: "blocked", title: "raw worker lane task", body: "/Users/lidises/private/worker-lane.md", transcript: "Traceback worker lane transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 7, warning_count: 2, error_summary: "Traceback worker lane source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
    const approvalView = buildOfficeApprovalRequestView(state);
    const audit = buildOfficeApprovalAuditTimeline(approvalView);
    const gate = buildOfficeApprovalExecutionGate(audit);
    const authority = buildOfficeAuthorityAdapterContract(gate);
    const queue = buildOfficeOrchestratorMediationQueue(authority);
    const routing = buildOfficeWorkerIntentRouting(queue);
    const readiness = buildOfficeWorkerFacilityReadiness(routing);
    const polish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);

    const markup = renderToStaticMarkup(<WorkerFacilityLanePolishPanel polish={polish} />);

    expect(markup).toContain("data-office-worker-facility-lane-polish=\"true\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-facility-lane-polish-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-facility-lane=\"lane_search_worker\"");
    expect(markup).toContain("data-office-worker-facility-lane=\"lane_reviewer\"");
    expect(markup).toContain("data-office-worker-facility-lane=\"lane_wiki_writer\"");
    expect(markup).toContain("data-office-worker-facility-lane=\"lane_nas_keeper\"");
    expect(markup).toContain("Worker facility lane polish");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw worker lane prompt|raw worker lane task|Traceback|\/Users\/lidises|token-shaped-worker-lane-polish|private-worker-lane-provider/i);
  });
});


describe("WorkerRequestHandoffDetailPanel", () => {
  it("Worker Request Handoff Detail 1 renders request-to-worker handoff as read-only posture", () => {
    const WorkerRequestHandoffDetailPanel = (OfficePageModule as unknown as {
      WorkerRequestHandoffDetailPanel: React.ComponentType<{ detail: ReturnType<typeof buildOfficeWorkerRequestHandoffDetail> }>;
    }).WorkerRequestHandoffDetailPanel;
    const state = officeFixture({
      agents: [{ id: "agent-request-handoff", status: "active", prompt: "raw worker request handoff prompt", provider: "private-worker-request-provider", api_key: "token-shaped-worker-request-handoff" }],
      work_items: [
        { id: "task-request-handoff", status: "blocked", title: "raw worker request handoff task", body: "/Users/lidises/private/request-handoff.md", transcript: "Traceback worker request handoff transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 9, warning_count: 3, error_summary: "Traceback worker request handoff source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const contract = buildOfficeEventRequestContractProjection(route);
    const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
    const timeline = buildOfficeEventTimelineProjection(contract, inspector);
    const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
    const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
    const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
    const approvalDetail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);
    const approvalView = buildOfficeApprovalRequestView(state);
    const audit = buildOfficeApprovalAuditTimeline(approvalView);
    const gate = buildOfficeApprovalExecutionGate(audit);
    const authority = buildOfficeAuthorityAdapterContract(gate);
    const queue = buildOfficeOrchestratorMediationQueue(authority);
    const routing = buildOfficeWorkerIntentRouting(queue);
    const readiness = buildOfficeWorkerFacilityReadiness(routing);
    const lanePolish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);
    const detail = buildOfficeWorkerRequestHandoffDetail(approvalDetail, lanePolish);

    const markup = renderToStaticMarkup(<WorkerRequestHandoffDetailPanel detail={detail} />);

    expect(markup).toContain("data-office-worker-request-handoff-detail=\"true\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-work-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-request-handoff-detail-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-worker-request-handoff-section=\"request_detail\"");
    expect(markup).toContain("data-office-worker-request-handoff-section=\"worker_lanes\"");
    expect(markup).toContain("data-office-worker-request-handoff-section=\"handoff_boundary\"");
    expect(markup).toContain("data-office-worker-request-handoff-section=\"nas_boundary\"");
    expect(markup).toContain("Worker request handoff detail");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw worker request handoff prompt|raw worker request handoff task|Traceback|\/Users\/lidises|token-shaped-worker-request-handoff|private-worker-request-provider/i);
  });
});


function buildApprovalNasBoundaryPolishPanelFixture(overrides: Partial<OfficeState> = {}) {
  const state = officeFixture({
    agents: [{ id: "agent-approval-nas", status: "active", prompt: "raw approval nas prompt", provider: "private-approval-nas-provider", api_key: "token-shaped-approval-nas" }],
    work_items: [
      { id: "task-approval-nas", status: "blocked", title: "raw approval nas task", body: "/Users/lidises/private/approval-nas.md", transcript: "Traceback approval nas transcript" } as unknown as OfficeState["work_items"][number],
    ],
    data_sources: [
      { id: "paperclip", status: "partial", checked_at: "2026-05-15T00:00:00Z", item_count: 11, warning_count: 4, error_summary: "Traceback approval nas source" },
    ],
    ...overrides,
  });
  const projection = buildOfficeDeskRpgProjectionModel(state);
  const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
  const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
  const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
  const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
  const contract = buildOfficeEventRequestContractProjection(route);
  const inspector = buildOfficeApprovalDialogueRouteInspector(dialogue, route, contract);
  const timeline = buildOfficeEventTimelineProjection(contract, inspector);
  const workerRoles = buildOfficeDeskRpgWorkerRoleVisibility(projection);
  const handoff = buildOfficeReviewerWikiHandoffPosture(projection);
  const drilldown = buildOfficeTimelineWorkerHandoffDrilldown(timeline, workerRoles, handoff);
  const approvalDetail = buildOfficeApprovalRequestDetailDeepening(route, timeline, drilldown);
  const approvalView = buildOfficeApprovalRequestView(state);
  const audit = buildOfficeApprovalAuditTimeline(approvalView);
  const gate = buildOfficeApprovalExecutionGate(audit);
  const authority = buildOfficeAuthorityAdapterContract(gate);
  const queue = buildOfficeOrchestratorMediationQueue(authority);
  const routing = buildOfficeWorkerIntentRouting(queue);
  const readiness = buildOfficeWorkerFacilityReadiness(routing);
  const lanePolish = buildOfficeWorkerFacilityLanePolish(drilldown, readiness);
  const detail = buildOfficeWorkerRequestHandoffDetail(approvalDetail, lanePolish);
  return buildOfficeApprovalNasBoundaryPolish(detail);
}

describe("ApprovalNasBoundaryPolishPanel", () => {
  it("Approval/NAS Boundary Polish 1 renders approval and NAS locks as read-only posture", () => {
    const ApprovalNasBoundaryPolishPanel = (OfficePageModule as unknown as {
      ApprovalNasBoundaryPolishPanel: React.ComponentType<{ polish: ReturnType<typeof buildOfficeApprovalNasBoundaryPolish> }>;
    }).ApprovalNasBoundaryPolishPanel;
    const polish = buildApprovalNasBoundaryPolishPanelFixture();

    const markup = renderToStaticMarkup(<ApprovalNasBoundaryPolishPanel polish={polish} />);

    expect(markup).toContain("data-office-approval-nas-boundary-polish=\"true\"");
    expect(markup).toContain("data-office-approval-nas-boundary-polish-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-nas-boundary-polish-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-nas-boundary-polish-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-nas-boundary-card=\"approval_gate\"");
    expect(markup).toContain("data-office-approval-nas-boundary-card=\"worker_handoff\"");
    expect(markup).toContain("data-office-approval-nas-boundary-card=\"audit_boundary\"");
    expect(markup).toContain("data-office-approval-nas-boundary-card=\"nas_vault_boundary\"");
    expect(markup).toContain("Approval/NAS boundary polish");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw approval nas prompt|raw approval nas task|Traceback|\/Users\/lidises|token-shaped-approval-nas|private-approval-nas-provider/i);
  });
});


describe("ApprovalAuthorityReadinessDetailPanel", () => {
  it("Approval Authority Readiness Detail 1 renders authority prerequisites without enabled controls", () => {
    const ApprovalAuthorityReadinessDetailPanel = (OfficePageModule as unknown as {
      ApprovalAuthorityReadinessDetailPanel: React.ComponentType<{ readiness: ReturnType<typeof buildOfficeApprovalAuthorityReadinessDetail> }>;
    }).ApprovalAuthorityReadinessDetailPanel;
    const boundary = buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-authority-readiness", status: "active", prompt: "raw authority readiness prompt", provider: "private-authority-readiness-provider", api_key: "token-shaped-authority-readiness" }],
      work_items: [
        { id: "task-authority-readiness", status: "blocked", title: "raw authority readiness task", body: "/Users/lidises/private/authority-readiness.md", transcript: "Traceback authority readiness transcript" } as unknown as OfficeState["work_items"][number],
      ],
    });
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(boundary);

    const markup = renderToStaticMarkup(<ApprovalAuthorityReadinessDetailPanel readiness={readiness} />);

    expect(markup).toContain("data-office-approval-authority-readiness-detail=\"true\"");
    expect(markup).toContain("data-office-approval-authority-readiness-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-authority-readiness-authority-granted=\"false\"");
    expect(markup).toContain("data-office-approval-authority-readiness-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-readiness-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-readiness-card=\"human_authority\"");
    expect(markup).toContain("data-office-approval-authority-readiness-card=\"orchestrator_mediation\"");
    expect(markup).toContain("data-office-approval-authority-readiness-card=\"audit_sink\"");
    expect(markup).toContain("data-office-approval-authority-readiness-card=\"nas_keeper_authority\"");
    expect(markup).toContain("Approval authority readiness");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw authority readiness prompt|raw authority readiness task|Traceback|\/Users\/lidises|token-shaped-authority-readiness|private-authority-readiness-provider/i);
  });
});


describe("ApprovalAuthorityDecisionEnvelopePreviewPanel", () => {
  it("Approval Authority Decision Envelope Preview 1 renders disabled decision options without controls", () => {
    const ApprovalAuthorityDecisionEnvelopePreviewPanel = (OfficePageModule as unknown as {
      ApprovalAuthorityDecisionEnvelopePreviewPanel: React.ComponentType<{ envelope: ReturnType<typeof buildOfficeApprovalAuthorityDecisionEnvelopePreview> }>;
    }).ApprovalAuthorityDecisionEnvelopePreviewPanel;
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-decision-envelope", status: "active", prompt: "raw decision envelope prompt", provider: "private-decision-envelope-provider", api_key: "token-shaped-decision-envelope" }],
      work_items: [
        { id: "task-decision-envelope", status: "blocked", title: "raw decision envelope task", body: "/Users/lidises/private/decision-envelope.md", transcript: "Traceback decision envelope transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);

    const markup = renderToStaticMarkup(<ApprovalAuthorityDecisionEnvelopePreviewPanel envelope={envelope} />);

    expect(markup).toContain("data-office-approval-authority-decision-envelope=\"true\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-record-created=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-approve-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-reject-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-hold-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-envelope-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-authority-decision-option=\"approve\"");
    expect(markup).toContain("data-office-approval-authority-decision-option=\"reject\"");
    expect(markup).toContain("data-office-approval-authority-decision-option=\"hold\"");
    expect(markup).toContain("Approval authority decision envelope");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw decision envelope prompt|raw decision envelope task|Traceback|\/Users\/lidises|token-shaped-decision-envelope|private-decision-envelope-provider/i);
  });
});


describe("ApprovalDecisionAuditNasTracePreviewPanel", () => {
  it("Approval Decision Audit/NAS Trace Preview 1 renders projected trace without writable controls", () => {
    const ApprovalDecisionAuditNasTracePreviewPanel = (OfficePageModule as unknown as {
      ApprovalDecisionAuditNasTracePreviewPanel: React.ComponentType<{ trace: ReturnType<typeof buildOfficeApprovalDecisionAuditNasTracePreview> }>;
    }).ApprovalDecisionAuditNasTracePreviewPanel;
    const secretSentinel = ["token", "shaped", "decision", "trace"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-decision-trace", status: "active", prompt: "raw decision trace prompt", provider: "private-decision-trace-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-decision-trace", status: "blocked", title: "raw decision trace task", body: "/Users/lidises/private/decision-trace.md", transcript: "Traceback decision trace transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);

    const markup = renderToStaticMarkup(<ApprovalDecisionAuditNasTracePreviewPanel trace={trace} />);

    expect(markup).toContain("data-office-approval-decision-audit-nas-trace=\"true\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-decision-record-created=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-audit-event-appended=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-nas-trace-persisted=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-trace-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-step=\"decision_intake\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-step=\"audit_trace\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-step=\"nas_save_request\"");
    expect(markup).toContain("data-office-approval-decision-audit-nas-step=\"nas_keeper_boundary\"");
    expect(markup).toContain("Approval decision audit/NAS trace");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw decision trace prompt|raw decision trace task|Traceback|\/Users\/lidises|token-shaped-decision-trace|private-decision-trace-provider/i);
  });
});


describe("NasKeeperSaveRequestGatePanel", () => {
  it("NAS Keeper Save Request Gate 1 renders projected save gate without writable controls", () => {
    const NasKeeperSaveRequestGatePanel = (OfficePageModule as unknown as {
      NasKeeperSaveRequestGatePanel: React.ComponentType<{ gate: ReturnType<typeof buildOfficeNasKeeperSaveRequestGate> }>;
    }).NasKeeperSaveRequestGatePanel;
    const secretSentinel = ["token", "shaped", "nas", "gate"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-nas-gate", status: "active", prompt: "raw nas gate prompt", provider: "private-nas-gate-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-nas-gate", status: "blocked", title: "raw nas gate task", body: "/Users/lidises/private/nas-gate.md", transcript: "Traceback nas gate transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);

    const markup = renderToStaticMarkup(<NasKeeperSaveRequestGatePanel gate={gate} />);

    expect(markup).toContain("data-office-nas-keeper-save-request-gate=\"true\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-save-request-created=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-save-request-persisted=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-rollback-point-created=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-nas-write-prepared=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-step=\"save_requested_event\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-step=\"nas_keeper_review\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-step=\"rollback_point\"");
    expect(markup).toContain("data-office-nas-keeper-save-request-gate-step=\"final_save_boundary\"");
    expect(markup).toContain("NAS Keeper save request gate");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw nas gate prompt|raw nas gate task|Traceback|\/Users\/lidises|token-shaped-nas-gate|private-nas-gate-provider/i);
  });
});


describe("NasKeeperRollbackEvidencePreviewPanel", () => {
  it("NAS Keeper Rollback Evidence Preview 1 renders projected rollback evidence without writable controls", () => {
    const NasKeeperRollbackEvidencePreviewPanel = (OfficePageModule as unknown as {
      NasKeeperRollbackEvidencePreviewPanel: React.ComponentType<{ rollback: ReturnType<typeof buildOfficeNasKeeperRollbackEvidencePreview> }>;
    }).NasKeeperRollbackEvidencePreviewPanel;
    const secretSentinel = ["token", "shaped", "rollback", "evidence"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-rollback-evidence", status: "active", prompt: "raw rollback evidence prompt", provider: "private-rollback-evidence-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-rollback-evidence", status: "blocked", title: "raw rollback evidence task", body: "/Users/lidises/private/rollback-evidence.md", transcript: "Traceback rollback evidence transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);

    const markup = renderToStaticMarkup(<NasKeeperRollbackEvidencePreviewPanel rollback={rollback} />);

    expect(markup).toContain("data-office-nas-keeper-rollback-evidence=\"true\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-rollback-point-created=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-rollback-evidence-persisted=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-audit-event-appended=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-nas-trace-persisted=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-card=\"rollback_snapshot\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-card=\"evidence_manifest\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-card=\"audit_anchor\"");
    expect(markup).toContain("data-office-nas-keeper-rollback-evidence-card=\"restore_boundary\"");
    expect(markup).toContain("NAS Keeper rollback evidence preview");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw rollback evidence prompt|raw rollback evidence task|Traceback|\/Users\/lidises|token-shaped-rollback-evidence|private-rollback-evidence-provider/i);
  });
});


describe("NasEvidencePackageStoreReadbackStatusPanel", () => {
  it("NAS Evidence Package Store Readback Status 1 renders local metadata status without controls", () => {
    const NasEvidencePackageStoreReadbackStatusPanel = (OfficePageModule as unknown as {
      NasEvidencePackageStoreReadbackStatusPanel: React.ComponentType<{ status: ReturnType<typeof buildOfficeNasEvidencePackageStoreReadbackStatus> }>;
    }).NasEvidencePackageStoreReadbackStatusPanel;
    const secretSentinel = ["token", "shaped", "package", "store"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-package-store", status: "active", prompt: "raw package store prompt", provider: "private-package-store-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-package-store", status: "blocked", title: "raw package store task", body: "/Users/lidises/nas/private/package-store.md", transcript: "Traceback package store transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const status = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);

    const markup = renderToStaticMarkup(<NasEvidencePackageStoreReadbackStatusPanel status={status} />);

    expect(markup).toContain('data-office-nas-evidence-package-store-readback-status="true"');
    expect(markup).toContain('data-office-nas-evidence-package-store-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-evidence-package-store-backend-api-changed="false"');
    expect(markup).toContain('data-office-nas-evidence-package-store-storage-changed="false"');
    expect(markup).toContain('data-office-nas-evidence-package-store-nas-path-resolution-enabled="false"');
    expect(markup).toContain('data-office-nas-evidence-package-store-nas-mount-access-enabled="false"');
    expect(markup).toContain('data-office-nas-evidence-package-store-nas-write-enabled="false"');
    expect(markup).toContain('data-office-nas-evidence-package-store-capability="local_metadata_store"');
    expect(markup).toContain('data-office-nas-evidence-package-store-capability="safe_readback"');
    expect(markup).toContain('NAS evidence package store readback status');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw package store prompt|raw package store task|Traceback|\/Users\/lidises|token-shaped-package-store|private-package-store-provider/i);
  });
});


describe("NasPathValidationStatusSurfacePanel", () => {
  it("NAS Path Validation Status Surface 1 renders validate-only path posture without writable controls", () => {
    const NasPathValidationStatusSurfacePanel = (OfficePageModule as unknown as {
      NasPathValidationStatusSurfacePanel: React.ComponentType<{ status: ReturnType<typeof buildOfficeNasPathValidationStatusSurface> }>;
    }).NasPathValidationStatusSurfacePanel;
    const secretSentinel = ["token", "shaped", "path", "validate"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-path-validate", status: "active", prompt: "raw path validate prompt", provider: "private-path-validate-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-validate", status: "blocked", title: "raw path validate task", body: "/Users/lidises/nas/private/path-validate.md", transcript: "Traceback path validate transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const status = buildOfficeNasPathValidationStatusSurface(store);

    const markup = renderToStaticMarkup(<NasPathValidationStatusSurfacePanel status={status} />);

    expect(markup).toContain('data-office-nas-path-validation-status="true"');
    expect(markup).toContain('data-office-nas-path-validation-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-path-validation-backend-api-changed="false"');
    expect(markup).toContain('data-office-nas-path-validation-storage-changed="false"');
    expect(markup).toContain('data-office-nas-path-validation-runtime-enabled="false"');
    expect(markup).toContain('data-office-nas-path-validation-mount-access-enabled="false"');
    expect(markup).toContain('data-office-nas-path-validation-filesystem-write-enabled="false"');
    expect(markup).toContain('data-office-nas-path-validation-capability="safe_validate_only"');
    expect(markup).toContain('NAS path validation status surface');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw path validate prompt|raw path validate task|Traceback|\/Users\/lidises|token-shaped-path-validate|private-path-validate-provider/i);
  });
});


describe("NasPathPreviewStatusSurfacePanel", () => {
  it("NAS Path Preview Status Surface 1 renders preview-only path posture without writable controls", () => {
    const NasPathPreviewStatusSurfacePanel = (OfficePageModule as unknown as {
      NasPathPreviewStatusSurfacePanel: React.ComponentType<{ status: ReturnType<typeof buildOfficeNasPathPreviewStatusSurface> }>;
    }).NasPathPreviewStatusSurfacePanel;
    const secretSentinel = ["token", "shaped", "path", "preview"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-path-preview", status: "active", prompt: "raw path preview prompt", provider: "private-path-preview-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-preview", status: "blocked", title: "raw path preview task", body: "/Users/lidises/nas/private/path-preview.md", transcript: "Traceback path preview transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const status = buildOfficeNasPathPreviewStatusSurface(validation);

    const markup = renderToStaticMarkup(<NasPathPreviewStatusSurfacePanel status={status} />);

    expect(markup).toContain('data-office-nas-path-preview-status="true"');
    expect(markup).toContain('data-office-nas-path-preview-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-path-preview-backend-api-changed="false"');
    expect(markup).toContain('data-office-nas-path-preview-storage-changed="false"');
    expect(markup).toContain('data-office-nas-path-preview-runtime-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-mount-access-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-filesystem-write-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-capability="safe_preview_only"');
    expect(markup).toContain('NAS path preview status surface');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw path preview prompt|raw path preview task|Traceback|\/Users\/lidises|token-shaped-path-preview|private-path-preview-provider/i);
  });
});


describe("NasPathPreviewStoreReadbackStatusSurfacePanel", () => {
  it("NAS Path Preview Store Readback Status Surface 1 renders local metadata posture without writable controls", () => {
    const NasPathPreviewStoreReadbackStatusSurfacePanel = (OfficePageModule as unknown as {
      NasPathPreviewStoreReadbackStatusSurfacePanel: React.ComponentType<{ status: ReturnType<typeof buildOfficeNasPathPreviewStoreReadbackStatusSurface> }>;
    }).NasPathPreviewStoreReadbackStatusSurfacePanel;
    const secretSentinel = ["token", "shaped", "path", "preview", "store"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-path-preview-store", status: "active", prompt: "raw path preview store prompt", provider: "private-path-preview-store-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-path-preview-store", status: "blocked", title: "raw path preview store task", body: "/Users/lidises/nas/private/path-preview-store.md", transcript: "Traceback path preview store transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const preview = buildOfficeNasPathPreviewStatusSurface(validation);
    const status = buildOfficeNasPathPreviewStoreReadbackStatusSurface(preview);

    const markup = renderToStaticMarkup(<NasPathPreviewStoreReadbackStatusSurfacePanel status={status} />);

    expect(markup).toContain('data-office-nas-path-preview-store-status="true"');
    expect(markup).toContain('data-office-nas-path-preview-store-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-path-preview-store-backend-api-changed="false"');
    expect(markup).toContain('data-office-nas-path-preview-store-storage-changed="false"');
    expect(markup).toContain('data-office-nas-path-preview-store-local-metadata-enabled="true"');
    expect(markup).toContain('data-office-nas-path-preview-store-readback-enabled="true"');
    expect(markup).toContain('data-office-nas-path-preview-store-runtime-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-store-mount-access-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-store-filesystem-write-enabled="false"');
    expect(markup).toContain('data-office-nas-path-preview-store-capability="safe_preview_metadata_store"');
    expect(markup).toContain('NAS path preview store/readback status surface');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw path preview store prompt|raw path preview store task|Traceback|\/Users\/lidises|token-shaped-path-preview-store|private-path-preview-store-provider/i);
  });
});


describe("NasRuntimeN3ApprovalBoundaryStatusSurfacePanel", () => {
  it("NAS Runtime N3 Approval Boundary Status Surface 1 renders approval-required fallback without controls", () => {
    const NasRuntimeN3ApprovalBoundaryStatusSurfacePanel = (OfficePageModule as unknown as {
      NasRuntimeN3ApprovalBoundaryStatusSurfacePanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface> }>;
    }).NasRuntimeN3ApprovalBoundaryStatusSurfacePanel;
    const secretSentinel = ["token", "shaped", "n3", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-n3-panel", status: "active", prompt: "raw n3 panel prompt", provider: "private-n3-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-n3-panel", status: "blocked", title: "raw n3 panel task", body: "/Users/lidises/private/n3-panel.md", transcript: "Traceback n3 panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const preview = buildOfficeNasPathPreviewStatusSurface(validation);
    const previewStore = buildOfficeNasPathPreviewStoreReadbackStatusSurface(preview);
    const boundary = buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface(previewStore);

    const markup = renderToStaticMarkup(<NasRuntimeN3ApprovalBoundaryStatusSurfacePanel boundary={boundary} />);

    expect(markup).toContain('data-office-nas-runtime-n3-boundary="true"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-approval-status="approval_required"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-fallback-reason="approval_prompt_timed_out"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-frontend-only="true"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-backend-api-changed="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-validation-route-added="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-local-path-mapping-validation-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-runtime-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-mount-access-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-filesystem-write-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-n3-boundary-option="n3_validate_only"');
    expect(markup).toContain('NAS runtime N3 approval boundary status surface');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toMatch(/raw n3 panel prompt|raw n3 panel task|Traceback|\/Users\/lidises|token-shaped-n3-panel|private-n3-panel-provider/i);
  });
});


describe("NasRuntimeSingleFileWriteApprovalActionPanel", () => {
  it("renders a safe approved single-file write action panel with one control boundary", () => {
    const NasRuntimeSingleFileWriteApprovalActionPanel = (OfficePageModule as unknown as {
      NasRuntimeSingleFileWriteApprovalActionPanel: React.ComponentType<{
        action: ReturnType<typeof buildOfficeNasRuntimeSingleFileWriteApprovalAction>;
        draft: Record<string, string>;
        approved: boolean;
        busy: boolean;
        result: null;
        error: null;
        onDraftChange: (field: string, value: string) => void;
        onApprovalChange: (approved: boolean) => void;
        onExecute: () => void;
      }>;
    }).NasRuntimeSingleFileWriteApprovalActionPanel;
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture());
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const store = buildOfficeNasEvidencePackageStoreReadbackStatus(rollback);
    const validation = buildOfficeNasPathValidationStatusSurface(store);
    const preview = buildOfficeNasPathPreviewStatusSurface(validation);
    const previewStore = buildOfficeNasPathPreviewStoreReadbackStatusSurface(preview);
    const boundary = buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface(previewStore);
    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);

    const markup = renderToStaticMarkup(
      <NasRuntimeSingleFileWriteApprovalActionPanel
        action={action}
        draft={{ write_ref: "write_ui", package_ref: "pkg_ui", target_vault_ref: "vault_personal_wiki_demo", safe_slug: "ai-office-ui-smoke", safe_title: "AI Office UI smoke", markdown_body: "# AI Office UI smoke", requested_by: "agent_nas_keeper", requested_at: "2026-05-17T13:30:00Z" }}
        approved={false}
        busy={false}
        result={null}
        error={null}
        onDraftChange={() => undefined}
        onApprovalChange={() => undefined}
        onExecute={() => undefined}
      />,
    );

    expect(markup).toContain('data-office-nas-runtime-single-file-write-action="true"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-endpoint="/api/office/controlled-mutation/nas-runtime/single-file-write"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-enabled-controls="1"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-raw-path-input-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-credential-input-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-mount-path-input-enabled="false"');
    expect(markup).toContain("단일 파일 쓰기");
    expect(markup).toContain("raw 경로/토큰 입력 금지");
    expect(markup).toContain("승인 후 1회 실행");
    expect(markup).toContain('name="safe_slug"');
    expect(markup).not.toContain('name="path"');
    expect(markup).not.toContain('name="root"');
    expect(markup).not.toContain('name="mount"');
    expect(markup).not.toContain('name="secret"');
    expect(markup).not.toContain('name="token"');
    expect(markup).not.toMatch(/\/Users\/|\/home\/|sk-|token=|private-provider/i);
  });
});


describe("DeskRpgReadOnlyChainCompletionReviewPanel", () => {
  it("Desk RPG Read-only Chain Completion Review 1 renders completion review without writable controls", () => {
    const DeskRpgReadOnlyChainCompletionReviewPanel = (OfficePageModule as unknown as {
      DeskRpgReadOnlyChainCompletionReviewPanel: React.ComponentType<{ review: ReturnType<typeof buildOfficeDeskRpgReadOnlyChainCompletionReview> }>;
    }).DeskRpgReadOnlyChainCompletionReviewPanel;
    const secretSentinel = ["token", "shaped", "completion", "review"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-completion-review", status: "active", prompt: "raw completion review prompt", provider: "private-completion-review-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-completion-review", status: "blocked", title: "raw completion review task", body: "/Users/lidises/private/completion-review.md", transcript: "Traceback completion review transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);

    const markup = renderToStaticMarkup(<DeskRpgReadOnlyChainCompletionReviewPanel review={review} />);

    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-mutation-controls-added=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-runtime-write-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-card=\"request_to_orchestrator\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-card=\"evidence_to_review\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-card=\"approval_to_nas_keeper\"");
    expect(markup).toContain("data-office-desk-rpg-readonly-chain-completion-review-card=\"next_projection_gap\"");
    expect(markup).toContain("Desk RPG read-only chain completion review");
    expect(markup).toContain("Event-driven Character State Projection 1");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw completion review prompt|raw completion review task|Traceback|\/Users\/lidises|token-shaped-completion-review|private-completion-review-provider/i);
  });
});


describe("EventDrivenCharacterStateProjectionPanel", () => {
  it("Event-driven Character State Projection 1 renders character states without writable controls", () => {
    const EventDrivenCharacterStateProjectionPanel = (OfficePageModule as unknown as {
      EventDrivenCharacterStateProjectionPanel: React.ComponentType<{ projection: ReturnType<typeof buildOfficeEventDrivenCharacterStateProjection> }>;
    }).EventDrivenCharacterStateProjectionPanel;
    const secretSentinel = ["token", "shaped", "character", "state"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-state", status: "active", prompt: "raw character state prompt", provider: "private-character-state-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-state", status: "blocked", title: "raw character state task", body: "/Users/lidises/private/character-state.md", transcript: "Traceback character state transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const safeEvents = [
      { id: "evt-runtime-workload", category: "workload_changed", roomId: "work", tone: "warning", count: 2, safeLabel: "업무 변화", detail: "safe aggregate only", redacted: true, rawSource: false },
      { id: "evt-intent-attention", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "승인 주의", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-static", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "정적 snapshot", detail: "safe static posture", redacted: true, rawSource: false },
    ] as const;
    const projection = buildOfficeEventDrivenCharacterStateProjection(review, safeEvents);

    const markup = renderToStaticMarkup(<EventDrivenCharacterStateProjectionPanel projection={projection} />);

    expect(markup).toContain("data-office-event-driven-character-state-projection=\"true\"");
    expect(markup).toContain("data-office-event-driven-character-state-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-event-driven-character-state-runtime-write-enabled=\"false\"");
    expect(markup).toContain("data-office-event-driven-character-state-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-event-driven-character-state-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-event-driven-character-state-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-event-driven-character-state-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-event-driven-character-state-role=\"user_boss\"");
    expect(markup).toContain("data-office-event-driven-character-state-role=\"orchestrator\"");
    expect(markup).toContain("data-office-event-driven-character-state-role=\"search_worker\"");
    expect(markup).toContain("data-office-event-driven-character-state-role=\"nas_keeper\"");
    expect(markup).toContain("Event-driven character state projection");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character state prompt|raw character state task|Traceback|\/Users\/lidises|token-shaped-character-state|private-character-state-provider/i);
  });
});


describe("CharacterStateRoomOverlayPanel", () => {
  it("Character State Room Overlay 1 renders non-interactive room markers without writable controls", () => {
    const CharacterStateRoomOverlayPanel = (OfficePageModule as unknown as {
      CharacterStateRoomOverlayPanel: React.ComponentType<{ overlay: ReturnType<typeof buildOfficeCharacterStateRoomOverlay> }>;
    }).CharacterStateRoomOverlayPanel;
    const secretSentinel = ["token", "shaped", "room", "overlay"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-overlay", status: "active", prompt: "raw character overlay prompt", provider: "private-character-overlay-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-overlay", status: "blocked", title: "raw character overlay task", body: "/Users/lidises/private/character-overlay.md", transcript: "Traceback character overlay transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-room", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-room", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-room", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);

    const markup = renderToStaticMarkup(<CharacterStateRoomOverlayPanel overlay={overlay} />);

    expect(markup).toContain("data-office-character-state-room-overlay=\"true\"");
    expect(markup).toContain("data-office-character-state-room-overlay-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-state-room-overlay-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-state-room-overlay-backend-stream-enabled=\"false\"");
    expect(markup).toContain("data-office-character-state-room-overlay-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-state-room-overlay-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-character-state-room-overlay-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"user_boss\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"orchestrator\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"search_worker\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"reviewer\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"wiki_writer\"");
    expect(markup).toContain("data-office-character-state-room-overlay-marker=\"nas_keeper\"");
    expect(markup).toContain("Character state room overlay");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character overlay prompt|raw character overlay task|Traceback|\/Users\/lidises|token-shaped-room-overlay|private-character-overlay-provider/i);
  });
});


describe("CharacterRoomInteractionPosturePanel", () => {
  it("Character Room Interaction Posture 1 renders display-only click and keyboard inspection posture", () => {
    const CharacterRoomInteractionPosturePanel = (OfficePageModule as unknown as {
      CharacterRoomInteractionPosturePanel: React.ComponentType<{ posture: ReturnType<typeof buildOfficeCharacterRoomInteractionPosture> }>;
    }).CharacterRoomInteractionPosturePanel;
    const secretSentinel = ["token", "shaped", "room", "interaction"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-interaction", status: "active", prompt: "raw character interaction prompt", provider: "private-character-interaction-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-interaction", status: "blocked", title: "raw character interaction task", body: "/Users/lidises/private/character-interaction.md", transcript: "Traceback character interaction transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-interaction", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-interaction", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-interaction", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const posture = buildOfficeCharacterRoomInteractionPosture(overlay);
    const markup = renderToStaticMarkup(<CharacterRoomInteractionPosturePanel posture={posture} />);
    expect(markup).toContain("data-office-character-room-interaction-posture=\"true\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-click-handler-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-keyboard-handler-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-backend-stream-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"user_boss\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"orchestrator\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"search_worker\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"reviewer\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"wiki_writer\"");
    expect(markup).toContain("data-office-character-room-interaction-posture-marker=\"nas_keeper\"");
    expect(markup).toContain("Click/keyboard inspection posture");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character interaction prompt|raw character interaction task|Traceback|\/Users\/lidises|token-shaped-room-interaction|private-character-interaction-provider/i);
  });
});


describe("CharacterDetailSafeDialogueCopyPanel", () => {
  it("Character Detail Safe Dialogue Copy 1 renders generated bubbles without controls or raw leaks", () => {
    const CharacterDetailSafeDialogueCopyPanel = (OfficePageModule as unknown as {
      CharacterDetailSafeDialogueCopyPanel: React.ComponentType<{ dialogue: ReturnType<typeof buildOfficeCharacterDetailSafeDialogueCopy> }>;
    }).CharacterDetailSafeDialogueCopyPanel;
    const secretSentinel = ["token", "shaped", "dialogue", "copy"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-dialogue-panel", status: "active", prompt: "raw character dialogue panel prompt", provider: "private-character-dialogue-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-dialogue-panel", status: "blocked", title: "raw character dialogue panel task", body: "/Users/lidises/private/character-dialogue-panel.md", transcript: "Traceback character dialogue panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-dialogue-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-dialogue-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-dialogue-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const markup = renderToStaticMarkup(<CharacterDetailSafeDialogueCopyPanel dialogue={dialogue} />);

    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy=\"true\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-backend-stream-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-animation-state-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-character-detail-safe-dialogue-copy-nas-save-enabled=\"false\"");
    expect(markup.match(/data-office-character-detail-safe-dialogue-copy-bubble=/g)?.length).toBe(6);
    for (const role of ["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]) {
      expect(markup).toContain(`data-office-character-detail-safe-dialogue-copy-bubble="${role}"`);
    }
    expect(markup).toContain("웹 근거 찾는 중");
    expect(markup).toContain("저장 승인 필요");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character dialogue panel prompt|raw character dialogue panel task|Traceback|\/Users\/lidises|token-shaped-dialogue-copy|private-character-dialogue-panel-provider/i);
  });
});


describe("CharacterFacilityCompletionReviewPanel", () => {
  it("Character Facility Completion Review 1 renders completion and large-boundary posture without controls or raw leaks", () => {
    const CharacterFacilityCompletionReviewPanel = (OfficePageModule as unknown as {
      CharacterFacilityCompletionReviewPanel: React.ComponentType<{ review: ReturnType<typeof buildOfficeCharacterFacilityCompletionReview> }>;
    }).CharacterFacilityCompletionReviewPanel;
    const secretSentinel = ["token", "shaped", "facility", "completion", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-completion-panel", status: "active", prompt: "raw completion panel prompt", provider: "private-completion-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-completion-panel", status: "blocked", title: "raw completion panel task", body: "/Users/lidises/private/completion-panel.md", transcript: "Traceback completion panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const chainReview = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(chainReview, [
      { id: "evt-runtime-completion-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-completion-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-completion-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);
    const ledger = buildOfficeCharacterFacilitySourceLedgerStrip(strip, overlay);
    const review = buildOfficeCharacterFacilityCompletionReview(ledger);
    const markup = renderToStaticMarkup(<CharacterFacilityCompletionReviewPanel review={review} />);

    expect(markup).toContain('data-office-character-facility-completion-review="true"');
    expect(markup).toContain('data-office-character-facility-completion-review-enabled-controls="0"');
    expect(markup).toContain('data-office-character-facility-completion-review-target-reached="true"');
    expect(markup).toContain('data-office-character-facility-completion-review-next-requires-approval="true"');
    expect(markup).toContain("event schema and controlled mutation approval boundary");
    expect(markup).toContain("Character Facility Source Ledger Strip 1");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw completion panel prompt|raw completion panel task|Traceback|\/Users\/lidises|token-shaped-facility-completion-panel|private-completion-panel-provider/i);
  });
});


describe("CharacterFacilitySourceLedgerStripPanel", () => {
  it("Character Facility Source Ledger Strip 1 renders source provenance without controls or raw leaks", () => {
    const CharacterFacilitySourceLedgerStripPanel = (OfficePageModule as unknown as {
      CharacterFacilitySourceLedgerStripPanel: React.ComponentType<{ ledger: ReturnType<typeof buildOfficeCharacterFacilitySourceLedgerStrip> }>;
    }).CharacterFacilitySourceLedgerStripPanel;
    const secretSentinel = ["token", "shaped", "facility", "source", "ledger", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-source-ledger-panel", status: "active", prompt: "raw source ledger panel prompt", provider: "private-source-ledger-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-source-ledger-panel", status: "blocked", title: "raw source ledger panel task", body: "/Users/lidises/private/source-ledger-panel.md", transcript: "Traceback source ledger panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-source-ledger-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-source-ledger-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-source-ledger-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);
    const ledger = buildOfficeCharacterFacilitySourceLedgerStrip(strip, overlay);
    const markup = renderToStaticMarkup(<CharacterFacilitySourceLedgerStripPanel ledger={ledger} />);

    expect(markup).toContain('data-office-character-facility-source-ledger-strip="true"');
    expect(markup).toContain('data-office-character-facility-source-ledger-strip-enabled-controls="0"');
    expect(markup).toContain('data-office-character-facility-source-ledger-strip-safe-projection-only="true"');
    expect(markup).toContain('data-office-character-facility-source-ledger-strip-zone="boss_desk"');
    expect(markup).toContain('data-office-character-facility-source-ledger-strip-zone="nas_vault"');
    expect(markup).toContain("safe role legend");
    expect(markup).toContain("safe NAS boundary aggregate");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw source ledger panel prompt|raw source ledger panel task|Traceback|\/Users\/lidises|token-shaped-facility-source-ledger-panel|private-source-ledger-panel-provider/i);
  });
});


describe("CharacterFacilityBoundaryStripPanel", () => {
  it("Character Facility Boundary Strip 1 renders safe facility mutation boundaries without controls or raw leaks", () => {
    const CharacterFacilityBoundaryStripPanel = (OfficePageModule as unknown as {
      CharacterFacilityBoundaryStripPanel: React.ComponentType<{ strip: ReturnType<typeof buildOfficeCharacterFacilityBoundaryStrip> }>;
    }).CharacterFacilityBoundaryStripPanel;
    const secretSentinel = ["token", "shaped", "facility", "strip", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-strip-panel", status: "active", prompt: "raw character strip panel prompt", provider: "private-character-strip-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-strip-panel", status: "blocked", title: "raw character strip panel task", body: "/Users/lidises/private/character-strip-panel.md", transcript: "Traceback character strip panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-strip-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-strip-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-strip-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const strip = buildOfficeCharacterFacilityBoundaryStrip(legend, overlay);
    const markup = renderToStaticMarkup(<CharacterFacilityBoundaryStripPanel strip={strip} />);

    expect(markup).toContain("data-office-character-facility-boundary-strip=\"true\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-zone=\"boss_desk\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-zone=\"nas_vault\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-mutation-boundary=\"instruction intake disabled\"");
    expect(markup).toContain("data-office-character-facility-boundary-strip-mutation-boundary=\"NAS save disabled\"");
    expect(markup).toContain("mediation write disabled");
    expect(markup).toContain("inspector write disabled");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character strip panel prompt|raw character strip panel task|Traceback|\/Users\/lidises|token-shaped-facility-strip-panel|private-character-strip-panel-provider/i);
  });
});


describe("CharacterFacilityRoleLegendPanel", () => {
  it("Character Facility Role Legend 1 renders role/facility boundaries without controls or raw leaks", () => {
    const CharacterFacilityRoleLegendPanel = (OfficePageModule as unknown as {
      CharacterFacilityRoleLegendPanel: React.ComponentType<{ legend: ReturnType<typeof buildOfficeCharacterFacilityRoleLegend> }>;
    }).CharacterFacilityRoleLegendPanel;
    const secretSentinel = ["token", "shaped", "facility", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-facility-panel", status: "active", prompt: "raw character facility panel prompt", provider: "private-character-facility-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-facility-panel", status: "blocked", title: "raw character facility panel task", body: "/Users/lidises/private/character-facility-panel.md", transcript: "Traceback character facility panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-facility-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-facility-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-facility-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const legend = buildOfficeCharacterFacilityRoleLegend(summary, overlay);
    const markup = renderToStaticMarkup(<CharacterFacilityRoleLegendPanel legend={legend} />);

    expect(markup).toContain("data-office-character-facility-role-legend=\"true\"");
    expect(markup).toContain("data-office-character-facility-role-legend-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-facility-role-legend-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-character-facility-role-legend-role=\"user_boss\"");
    expect(markup).toContain("data-office-character-facility-role-legend-role=\"nas_keeper\"");
    expect(markup).toContain("data-office-character-facility-role-legend-facility=\"boss_desk\"");
    expect(markup).toContain("data-office-character-facility-role-legend-facility=\"nas_vault\"");
    expect(markup).toContain("data-office-character-facility-role-legend-boundary=\"NAS save disabled\"");
    expect(markup).toContain("instruction display only");
    expect(markup).toContain("NAS save disabled");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character facility panel prompt|raw character facility panel task|Traceback|\/Users\/lidises|token-shaped-facility-panel|private-character-facility-panel-provider/i);
  });
});


describe("CharacterPanelBoundarySummaryPanel", () => {
  it("Character Panel Boundary Summary 1 renders compact safety boundaries without controls or raw leaks", () => {
    const CharacterPanelBoundarySummaryPanel = (OfficePageModule as unknown as {
      CharacterPanelBoundarySummaryPanel: React.ComponentType<{ summary: ReturnType<typeof buildOfficeCharacterPanelBoundarySummary> }>;
    }).CharacterPanelBoundarySummaryPanel;
    const secretSentinel = ["token", "shaped", "boundary", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-boundary-panel", status: "active", prompt: "raw character boundary panel prompt", provider: "private-character-boundary-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-boundary-panel", status: "blocked", title: "raw character boundary panel task", body: "/Users/lidises/private/character-boundary-panel.md", transcript: "Traceback character boundary panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-boundary-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-boundary-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-boundary-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const summary = buildOfficeCharacterPanelBoundarySummary(detail, dialogue, alignment);
    const markup = renderToStaticMarkup(<CharacterPanelBoundarySummaryPanel summary={summary} />);

    expect(markup).toContain("data-office-character-panel-boundary-summary=\"true\"");
    expect(markup).toContain("data-office-character-panel-boundary-summary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-panel-boundary-summary-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-character-panel-boundary-summary-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-panel-boundary-summary-nas-save-enabled=\"false\"");
    expect(markup.match(/data-office-character-panel-boundary-summary-panel=/g)?.length).toBe(3);
    expect(markup).toContain("right inspector display only");
    expect(markup).toContain("generated safe copy only");
    expect(markup).toContain("route and NAS boundary display only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character boundary panel prompt|raw character boundary panel task|Traceback|\/Users\/lidises|token-shaped-boundary-panel|private-character-boundary-panel-provider/i);
  });
});


describe("CharacterBubbleInspectorAlignmentPanel", () => {
  it("Character Bubble-to-Inspector Alignment 1 renders aligned bubble metadata without controls or raw leaks", () => {
    const CharacterBubbleInspectorAlignmentPanel = (OfficePageModule as unknown as {
      CharacterBubbleInspectorAlignmentPanel: React.ComponentType<{ alignment: ReturnType<typeof buildOfficeCharacterBubbleInspectorAlignment> }>;
    }).CharacterBubbleInspectorAlignmentPanel;
    const secretSentinel = ["token", "shaped", "alignment", "panel"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-alignment-panel", status: "active", prompt: "raw character alignment panel prompt", provider: "private-character-alignment-panel-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-alignment-panel", status: "blocked", title: "raw character alignment panel task", body: "/Users/lidises/private/character-alignment-panel.md", transcript: "Traceback character alignment panel transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-alignment-panel", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-alignment-panel", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-alignment-panel", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const dialogue = buildOfficeCharacterDetailSafeDialogueCopy(detail);
    const alignment = buildOfficeCharacterBubbleInspectorAlignment(dialogue, detail);
    const markup = renderToStaticMarkup(<CharacterBubbleInspectorAlignmentPanel alignment={alignment} />);

    expect(markup).toContain("data-office-character-bubble-inspector-alignment=\"true\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-backend-stream-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-animation-state-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-character-bubble-inspector-alignment-nas-save-enabled=\"false\"");
    expect(markup.match(/data-office-character-bubble-inspector-alignment-item=/g)?.length).toBe(6);
    for (const role of ["user_boss", "orchestrator", "search_worker", "reviewer", "wiki_writer", "nas_keeper"]) {
      expect(markup).toContain(`data-office-character-bubble-inspector-alignment-item="${role}"`);
    }
    expect(markup).toContain("boss → orchestrator");
    expect(markup).toContain("source title hidden");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character alignment panel prompt|raw character alignment panel task|Traceback|\/Users\/lidises|token-shaped-alignment-panel|private-character-alignment-panel-provider/i);
  });
});


describe("CharacterInspectorDetailPosturePanel", () => {
  it("Character Inspector Detail Posture 1 renders static right-inspector cards without controls or raw leaks", () => {
    const CharacterInspectorDetailPosturePanel = (OfficePageModule as unknown as {
      CharacterInspectorDetailPosturePanel: React.ComponentType<{ detail: ReturnType<typeof buildOfficeCharacterInspectorDetailPosture> }>;
    }).CharacterInspectorDetailPosturePanel;
    const secretSentinel = ["token", "shaped", "inspector", "detail"].join("-");
    const readiness = buildOfficeApprovalAuthorityReadinessDetail(buildApprovalNasBoundaryPolishPanelFixture({
      agents: [{ id: "agent-character-inspector", status: "active", prompt: "raw character inspector prompt", provider: "private-character-inspector-provider", api_key: secretSentinel }],
      work_items: [
        { id: "task-character-inspector", status: "blocked", title: "raw character inspector task", body: "/Users/lidises/private/character-inspector.md", transcript: "Traceback character inspector transcript" } as unknown as OfficeState["work_items"][number],
      ],
    }));
    const envelope = buildOfficeApprovalAuthorityDecisionEnvelopePreview(readiness);
    const trace = buildOfficeApprovalDecisionAuditNasTracePreview(envelope);
    const gate = buildOfficeNasKeeperSaveRequestGate(trace);
    const rollback = buildOfficeNasKeeperRollbackEvidencePreview(gate);
    const review = buildOfficeDeskRpgReadOnlyChainCompletionReview(rollback);
    const stateProjection = buildOfficeEventDrivenCharacterStateProjection(review, [
      { id: "evt-runtime-inspector", category: "room_density_changed", roomId: "work", tone: "warning", count: 3, safeLabel: "room density", detail: "safe density aggregate", redacted: true, rawSource: false },
      { id: "evt-intent-inspector", category: "attention_changed", roomId: "routing", tone: "negative", count: 1, safeLabel: "approval attention", detail: "safe attention aggregate", redacted: true, rawSource: false },
      { id: "evt-visual-inspector", category: "snapshot_static", roomId: "sessions", tone: "neutral", count: 0, safeLabel: "static snapshot", detail: "safe static aggregate", redacted: true, rawSource: false },
    ] as const);
    const overlay = buildOfficeCharacterStateRoomOverlay(stateProjection);
    const interaction = buildOfficeCharacterRoomInteractionPosture(overlay);
    const detail = buildOfficeCharacterInspectorDetailPosture(interaction);
    const markup = renderToStaticMarkup(<CharacterInspectorDetailPosturePanel detail={detail} />);
    expect(markup).toContain("data-office-character-inspector-detail-posture=\"true\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-selected-marker-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-click-handler-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-keyboard-handler-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-inspector-write-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"user_boss\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"orchestrator\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"search_worker\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"reviewer\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"wiki_writer\"");
    expect(markup).toContain("data-office-character-inspector-detail-posture-card=\"nas_keeper\"");
    expect(markup).toContain("Character inspector detail posture");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw character inspector prompt|raw character inspector task|Traceback|\/Users\/lidises|token-shaped-inspector-detail|private-character-inspector-provider/i);
  });
});


describe("ControlledMutationContractPostureProjectionPanel", () => {
  it("Frontend Contract Posture Projection 1 renders read-only contract cards without controls", () => {
    const ControlledMutationContractPostureProjectionPanel = (OfficePageModule as unknown as {
      ControlledMutationContractPostureProjectionPanel: React.ComponentType<{ projection: ReturnType<typeof buildOfficeControlledMutationContractPostureProjection> }>;
    }).ControlledMutationContractPostureProjectionPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T13:00:00Z",
      agents: [{ id: "agent-contract-posture", status: "active", prompt: "raw frontend contract posture prompt token-shaped-contract-posture", provider: "private-contract-posture-provider" }],
      work_items: [{ id: "task-contract-posture", status: "blocked", title: "raw frontend contract posture task", body: "/Users/lidises/private/frontend-contract-posture.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const markup = renderToStaticMarkup(<ControlledMutationContractPostureProjectionPanel projection={projection} />);

    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-credential-change-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-projection-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-contract-posture-projection-card=/g)?.length).toBe(6);
    for (const card of ["contract_chain", "browser_surface", "backend_boundary", "authority_boundary", "storage_boundary", "nas_boundary"]) {
      expect(markup).toContain(`data-office-controlled-mutation-contract-posture-projection-card="${card}"`);
    }
    expect(markup).toContain("Frontend Contract Posture Projection 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw frontend contract posture prompt|raw frontend contract posture task|\/Users\/lidises|token-shaped-contract-posture|private-contract-posture-provider/i);
  });
});


describe("ControlledMutationContractPosturePolishPanel", () => {
  it("Frontend controlled-mutation contract posture polish 2 renders grouped read-only rows without controls", () => {
    const ControlledMutationContractPosturePolishPanel = (OfficePageModule as unknown as {
      ControlledMutationContractPosturePolishPanel: React.ComponentType<{ polish: ReturnType<typeof buildOfficeControlledMutationContractPosturePolish> }>;
    }).ControlledMutationContractPosturePolishPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T13:25:00Z",
      agents: [{ id: "agent-posture-polish-panel", status: "active", prompt: "raw posture polish panel prompt token-shaped-value", provider: "private-posture-polish-panel-provider" }],
      work_items: [{ id: "task-posture-polish", status: "blocked", title: "raw posture polish panel task", body: "/Users/lidises/private/posture-polish-panel.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const markup = renderToStaticMarkup(<ControlledMutationContractPosturePolishPanel polish={polish} />);

    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-contract-posture-polish-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-contract-posture-polish-row=/g)?.length).toBe(4);
    for (const row of ["browser_surface", "mutation_backplane", "authority_and_credentials", "nas_vps_kanban"]) {
      expect(markup).toContain(`data-office-controlled-mutation-contract-posture-polish-row="${row}"`);
    }
    expect(markup).toContain("Frontend Contract Posture Polish 2");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/\/Users\/lidises|raw posture polish panel|private-posture-polish-panel|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationReadinessHandoffRibbonPanel", () => {
  it("Frontend controlled-mutation readiness handoff ribbon renders static request approval authority execution steps", () => {
    const ControlledMutationReadinessHandoffRibbonPanel = (OfficePageModule as unknown as {
      ControlledMutationReadinessHandoffRibbonPanel: React.ComponentType<{ ribbon: ReturnType<typeof buildOfficeControlledMutationReadinessHandoffRibbon> }>;
    }).ControlledMutationReadinessHandoffRibbonPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T13:50:00Z",
      agents: [{ id: "agent-handoff-ribbon-panel", status: "active", prompt: "raw handoff ribbon panel prompt token-shaped-value", provider: "private-handoff-ribbon-panel-provider" }],
      work_items: [{ id: "task-handoff-ribbon", status: "blocked", title: "raw handoff ribbon panel task", body: "/Users/lidises/private/handoff-ribbon-panel.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const markup = renderToStaticMarkup(<ControlledMutationReadinessHandoffRibbonPanel ribbon={ribbon} />);

    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-event-readback-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-dry-run-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-handoff-ribbon-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-readiness-handoff-ribbon-step=/g)?.length).toBe(4);
    for (const step of ["request", "approval", "authority", "execution"]) {
      expect(markup).toContain(`data-office-controlled-mutation-readiness-handoff-ribbon-step="${step}"`);
    }
    expect(markup).toContain("Frontend Readiness Handoff Ribbon 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/\/Users\/lidises|raw handoff ribbon panel|private-handoff-ribbon-panel|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationReadinessSummaryPolishPanel", () => {
  it("Frontend controlled-mutation readiness summary polish renders static summary cards without controls", () => {
    const ControlledMutationReadinessSummaryPolishPanel = (OfficePageModule as unknown as {
      ControlledMutationReadinessSummaryPolishPanel: React.ComponentType<{ summary: ReturnType<typeof buildOfficeControlledMutationReadinessSummaryPolish> }>;
    }).ControlledMutationReadinessSummaryPolishPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-15T14:10:00Z",
      agents: [{ id: "agent-summary-polish-panel", status: "active", prompt: "raw readiness summary polish panel prompt token-shaped-value", provider: "private-summary-polish-panel-provider" }],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const markup = renderToStaticMarkup(<ControlledMutationReadinessSummaryPolishPanel summary={summary} />);

    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-event-readback-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-dry-run-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-readiness-summary-polish-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-readiness-summary-polish-card=/g)?.length).toBe(3);
    for (const card of ["chain", "locks", "next_boundary"]) {
      expect(markup).toContain(`data-office-controlled-mutation-readiness-summary-polish-card="${card}"`);
    }
    expect(markup).toContain("Frontend Readiness Summary Polish 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw readiness summary polish panel|private-summary-polish-panel|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationRequestStorePosturePanel", () => {
  it("Frontend request store posture renders local-store boundary copy without executable controls", () => {
    const ControlledMutationRequestStorePosturePanel = (OfficePageModule as unknown as {
      ControlledMutationRequestStorePosturePanel: React.ComponentType<{ posture: ReturnType<typeof buildOfficeControlledMutationRequestStorePosture> }>;
    }).ControlledMutationRequestStorePosturePanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T00:10:00Z",
      agents: [{ id: "agent-request-store-panel", status: "active", prompt: "raw request store panel prompt token-shaped-value", provider: "private-request-store-panel-provider" }],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const markup = renderToStaticMarkup(<ControlledMutationRequestStorePosturePanel posture={posture} />);

    expect(markup).toContain("data-office-controlled-mutation-request-store-posture=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-event-readback-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-dry-run-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-posture-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-request-store-posture-card=/g)?.length).toBe(4);
    for (const card of ["local_store", "validation", "hardening_boundary", "approval_boundary"]) {
      expect(markup).toContain(`data-office-controlled-mutation-request-store-posture-card="${card}"`);
    }
    expect(markup).toContain("Frontend Request Store Posture 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw request store panel|private-request-store-panel|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationRequestStoreHardeningPlanPanel", () => {
  it("Request store hardening plan renders approval-required backend hardening posture without executable controls", () => {
    const ControlledMutationRequestStoreHardeningPlanPanel = (OfficePageModule as unknown as {
      ControlledMutationRequestStoreHardeningPlanPanel: React.ComponentType<{ plan: ReturnType<typeof buildOfficeControlledMutationRequestStoreHardeningPlan> }>;
    }).ControlledMutationRequestStoreHardeningPlanPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T00:50:00Z",
      agents: [{ id: "agent-request-store-hardening-panel", status: "active", prompt: "raw request store hardening panel prompt token-shaped-value", provider: "private-request-store-hardening-panel-provider" }],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const plan = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const markup = renderToStaticMarkup(<ControlledMutationRequestStoreHardeningPlanPanel plan={plan} />);

    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-event-readback-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-hardening-implemented=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-request-store-hardening-plan-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-request-store-hardening-plan-item=/g)?.length).toBe(4);
    for (const item of ["duplicate_detection", "correlation_index", "readback_limit", "malformed_line_resilience"]) {
      expect(markup).toContain(`data-office-controlled-mutation-request-store-hardening-plan-item="${item}"`);
    }
    expect(markup).toContain("Request Store Hardening Plan 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw request store hardening panel|private-request-store-hardening-panel|token-shaped-value|provider/i);
  });
});

describe("ControlledMutationNextApprovalBoundaryPanel", () => {
  it("Controlled Mutation Next Approval Boundary 1 renders approval-required posture without executable controls", () => {
    const ControlledMutationNextApprovalBoundaryPanel = (OfficePageModule as unknown as {
      ControlledMutationNextApprovalBoundaryPanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeControlledMutationNextApprovalBoundary> }>;
    }).ControlledMutationNextApprovalBoundaryPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T01:15:00Z",
      agents: [{ id: "agent-next-approval-panel", status: "active", prompt: "raw next approval panel prompt token-shaped-value", provider: "private-next-approval-panel-provider" }],
      work_items: [{ id: "w-next-approval-panel", status: "blocked", title: "raw next approval panel task", body: "/Users/lidises/private/next-approval-panel.md" } as unknown as OfficeState["work_items"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const boundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const markup = renderToStaticMarkup(<ControlledMutationNextApprovalBoundaryPanel boundary={boundary} />);

    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-approval-granted=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-event-append-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-event-readback-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-hardening-implemented=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-decision-store-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-dry-run-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-credential-change-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-nas-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-next-approval-boundary-raw-excluded=\"true\"");
    expect(markup.match(/data-office-controlled-mutation-next-approval-boundary-option=/g)?.length).toBe(4);
    for (const item of ["request_store_hardening", "human_decision_store", "execution_audit_authority", "ops_runtime_mutation"]) {
      expect(markup).toContain(`data-office-controlled-mutation-next-approval-boundary-option="${item}"`);
    }
    expect(markup).toContain("Controlled Mutation Next Approval Boundary 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toContain("onSubmit");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/\/Users\/lidises|raw next approval|private-next-approval|token-shaped-value|provider/i);
  });
});

describe("OfficeDeskRpgBossCommandConsolePanel", () => {
  it("Desk RPG Boss Command Console 1 shows user-avatar instruction posture without executable controls", () => {
    const OfficeDeskRpgBossCommandConsolePanel = (OfficePageModule as unknown as {
      OfficeDeskRpgBossCommandConsolePanel: React.ComponentType<{ projection: ReturnType<typeof buildOfficeDeskRpgProjectionModel> }>;
    }).OfficeDeskRpgBossCommandConsolePanel;
    const projection = buildOfficeDeskRpgProjectionModel(officeFixture({
      agents: [{ id: "agent-1", status: "active", prompt: "raw boss prompt", provider: "private-boss-provider", api_key: "token-shaped-boss-sentinel" }],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw boss task title", body: "/Users/lidises/private/boss.md" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 3, warning_count: 1, error_summary: "Traceback boss source" },
      ],
    }));

    const markup = renderToStaticMarkup(<OfficeDeskRpgBossCommandConsolePanel projection={projection} />);

    expect(markup).toContain("data-office-desk-rpg-boss-console=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-boss-console-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-boss-console-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-desk-rpg-boss-console-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-desk-rpg-boss-console-orchestrator-required=\"true\"");
    expect(markup).toContain("data-office-desk-rpg-boss-console-nas-save-enabled=\"false\"");
    expect(markup).toContain("Boss command console");
    expect(markup).toContain("사장 캐릭터");
    expect(markup).toContain("Orchestrator-level instruction posture");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw boss prompt|raw boss task title|Traceback|\/Users\/lidises|token-shaped-boss-sentinel|private-boss-provider/i);
  });
});

describe("ControlledMutationPostDecisionApprovalBoundaryPanel", () => {
  it("Controlled Mutation Post Decision Approval Boundary 1 renders approval-required posture without executable controls", () => {
    const ControlledMutationPostDecisionApprovalBoundaryPanel = (OfficePageModule as unknown as {
      ControlledMutationPostDecisionApprovalBoundaryPanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeControlledMutationPostDecisionApprovalBoundary> }>;
    }).ControlledMutationPostDecisionApprovalBoundaryPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T02:05:00Z",
      agents: [{ id: "agent-post-decision-panel", status: "active", prompt: "raw post decision panel prompt token-shaped-value", provider: "private-post-decision-panel-provider" }],
      work_items: [{ id: "w-post-decision-panel", status: "blocked", title: "raw post decision panel task", body: "/Users/lidises/private/post-decision-panel.md" } as unknown as OfficeState["work_items"][number]],
      data_sources: [{ id: "paperclip:/Users/lidises/post-decision-panel", status: "partial", checked_at: "2026-05-16T02:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw post decision panel token" } as unknown as OfficeState["data_sources"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const boundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const markup = renderToStaticMarkup(<ControlledMutationPostDecisionApprovalBoundaryPanel boundary={boundary} />);

    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-approval-granted=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-request-store-hardening-completed=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-human-decision-store-completed=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-new-backend-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-new-storage-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-dry-run-result-storage-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-credential-change-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-nas-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-decision-approval-boundary-raw-excluded=\"true\"");
    expect(markup.match(/data-office-controlled-mutation-post-decision-approval-boundary-option=/g)?.length).toBe(4);
    for (const item of ["dry_run_result_storage", "audit_append_sink", "authority_adapter_binding", "target_dispatch_runtime"]) {
      expect(markup).toContain(`data-office-controlled-mutation-post-decision-approval-boundary-option="${item}"`);
    }
    expect(markup.match(/data-office-controlled-mutation-post-decision-approval-boundary-completed-subset=/g)?.length).toBe(2);
    expect(markup).toContain("Controlled Mutation Post Decision Approval Boundary 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw post decision|private-post-decision|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationPostRegistryApprovalBoundaryPanel", () => {
  it("Controlled Mutation Post Registry Approval Boundary 1 renders approval-required posture without executable controls", () => {
    const ControlledMutationPostRegistryApprovalBoundaryPanel = (OfficePageModule as unknown as {
      ControlledMutationPostRegistryApprovalBoundaryPanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeControlledMutationPostRegistryApprovalBoundary> }>;
    }).ControlledMutationPostRegistryApprovalBoundaryPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T10:05:00Z",
      agents: [{ id: "agent-post-registry-panel", status: "active", prompt: "raw post registry panel prompt token-shaped-value", provider: "private-post-registry-panel-provider" }],
      work_items: [{ id: "w-post-registry-panel", status: "blocked", title: "raw post registry panel task", body: "/Users/lidises/private/post-registry-panel.md" } as unknown as OfficeState["work_items"][number]],
      data_sources: [{ id: "paperclip:/Users/lidises/post-registry-panel", status: "partial", checked_at: "2026-05-16T10:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw post registry panel token" } as unknown as OfficeState["data_sources"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const boundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const markup = renderToStaticMarkup(<ControlledMutationPostRegistryApprovalBoundaryPanel boundary={boundary} />);

    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-approval-granted=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-authority-adapter-registry-completed=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-credential-change-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-nas-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-post-registry-approval-boundary-raw-excluded=\"true\"");
    expect(markup.match(/data-office-controlled-mutation-post-registry-approval-boundary-completed-subset=/g)?.length).toBe(6);
    expect(markup.match(/data-office-controlled-mutation-post-registry-approval-boundary-option=/g)?.length).toBe(4);
    for (const item of ["target_dispatch_runtime", "nas_save_write_preparation", "credential_auth_env_change", "real_authority_adapter_binding"]) {
      expect(markup).toContain(`data-office-controlled-mutation-post-registry-approval-boundary-option="${item}"`);
    }
    expect(markup).toContain("Controlled Mutation Post Registry Approval Boundary 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw post registry|private-post-registry|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationTargetDispatchForbiddenBoundaryPanel", () => {
  it("Controlled Mutation Target Dispatch Forbidden Boundary 1 renders frontend-only continuation without executable controls", () => {
    const ControlledMutationTargetDispatchForbiddenBoundaryPanel = (OfficePageModule as unknown as {
      ControlledMutationTargetDispatchForbiddenBoundaryPanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeControlledMutationTargetDispatchForbiddenBoundary> }>;
    }).ControlledMutationTargetDispatchForbiddenBoundaryPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T10:30:00Z",
      agents: [{ id: "agent-target-dispatch-panel", status: "active", prompt: "raw target dispatch panel prompt token-shaped-value", provider: "private-target-dispatch-panel-provider" }],
      work_items: [{ id: "w-target-dispatch-panel", status: "blocked", title: "raw target dispatch panel task", body: "/Users/lidises/private/target-dispatch-panel.md" } as unknown as OfficeState["work_items"][number]],
      data_sources: [{ id: "paperclip:/Users/lidises/target-dispatch-panel", status: "partial", checked_at: "2026-05-16T10:30:00Z", item_count: 1, warning_count: 1, error_summary: "raw target dispatch panel token" } as unknown as OfficeState["data_sources"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const postRegistryBoundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const boundary = buildOfficeControlledMutationTargetDispatchForbiddenBoundary(postRegistryBoundary);
    const markup = renderToStaticMarkup(<ControlledMutationTargetDispatchForbiddenBoundaryPanel boundary={boundary} />);

    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-target-dispatch-runtime-approval-granted=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-dry-run-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-credential-change-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-nas-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-deploy-restart-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-push-pr-merge-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-target-dispatch-forbidden-boundary-raw-excluded=\"true\"");
    expect(markup.match(/data-office-controlled-mutation-target-dispatch-forbidden-boundary-forbidden-boundary=/g)?.length).toBe(1);
    expect(markup.match(/data-office-controlled-mutation-target-dispatch-forbidden-boundary-option=/g)?.length).toBe(4);
    expect(markup).toContain("Controlled Mutation Target Dispatch Forbidden Boundary 1");
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw target dispatch|private-target-dispatch|token-shaped-value|provider/i);
  });
});


describe("ControlledMutationSafeContinuationCompletionReviewPanel", () => {
  it("Controlled Mutation Safe Continuation Completion Review 1 renders the explicit approval stop without controls", () => {
    const ControlledMutationSafeContinuationCompletionReviewPanel = (OfficePageModule as unknown as {
      ControlledMutationSafeContinuationCompletionReviewPanel: React.ComponentType<{ review: ReturnType<typeof buildOfficeControlledMutationSafeContinuationCompletionReview> }>;
    }).ControlledMutationSafeContinuationCompletionReviewPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-16T11:00:00Z",
      agents: [{ id: "agent-safe-review", status: "active", prompt: "raw safe review prompt token-shaped-value", provider: "private-safe-review-provider" }],
      work_items: [{ id: "w-safe-review", status: "blocked", title: "raw safe review task", body: "/Users/lidises/private/safe-review.md" } as unknown as OfficeState["work_items"][number]],
      data_sources: [{ id: "paperclip:/Users/lidises/safe-review", status: "partial", checked_at: "2026-05-16T11:00:00Z", item_count: 1, warning_count: 1, error_summary: "raw safe review token" } as unknown as OfficeState["data_sources"][number]],
    })))))))))))))))))))))));
    const projection = buildOfficeControlledMutationContractPostureProjection(executionReadiness);
    const polish = buildOfficeControlledMutationContractPosturePolish(projection);
    const ribbon = buildOfficeControlledMutationReadinessHandoffRibbon(polish);
    const summary = buildOfficeControlledMutationReadinessSummaryPolish(ribbon);
    const posture = buildOfficeControlledMutationRequestStorePosture(summary);
    const hardening = buildOfficeControlledMutationRequestStoreHardeningPlan(posture);
    const nextBoundary = buildOfficeControlledMutationNextApprovalBoundary(hardening);
    const postDecisionBoundary = buildOfficeControlledMutationPostDecisionApprovalBoundary(nextBoundary);
    const postRegistryBoundary = buildOfficeControlledMutationPostRegistryApprovalBoundary(postDecisionBoundary);
    const targetForbiddenBoundary = buildOfficeControlledMutationTargetDispatchForbiddenBoundary(postRegistryBoundary);
    const review = buildOfficeControlledMutationSafeContinuationCompletionReview(targetForbiddenBoundary);
    const markup = renderToStaticMarkup(<ControlledMutationSafeContinuationCompletionReviewPanel review={review} />);

    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-next-requires-explicit-approval=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-read-only-target-level-reached=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-safe-continuation-completion-review-nas-mutation-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-safe-continuation-completion-review-completed-slice=/g)?.length).toBe(7);
    expect(markup.match(/data-office-controlled-mutation-safe-continuation-completion-review-explicit-approval-boundary=/g)?.length).toBe(4);
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw safe review|private-safe-review-provider|token-shaped-value/i);
  });
});
