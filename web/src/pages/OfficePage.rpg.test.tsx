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
import { buildOfficeDeskRpgProjectionModel, buildOfficeDeskRpgWorkerRoleVisibility, buildOfficeDisabledApprovalDialoguePosture, buildOfficeReviewerWikiHandoffPosture, buildOfficeApprovalDialogueInspectorDetail, buildOfficeReviewerWikiEvidenceDetailPosture, buildOfficeBoardEvidenceInspectorDrilldown, buildOfficeRpgScene } from "./officeView";
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
