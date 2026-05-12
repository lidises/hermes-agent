import { describe, expect, it } from "vitest";

import {
  buildOfficeAttentionItems,
  buildOfficeCharacterActivity,
  buildOfficeCharacterInspector,
  buildOfficeCharacterRoutes,
  buildOfficeCharacterSceneObjects,
  buildOfficeCharacterTrackingCues,
  buildOfficeCharacterView,
  buildOfficeCharacters,
  buildOfficeMapDensityPlan,
  buildOfficeMapJumpTargets,
  buildOfficeMapPolishPlan,
  buildOfficeResponsiveReadabilityPlan,
  buildOfficeRoomActivityMeters,
  buildOfficeLiveOperationsLayer,
  buildOfficeSafePulseTimeline,
  buildOfficeSafeBreadcrumbTrail,
  buildOfficeSafeRouteCompass,
  buildOfficeSafeFocusLane,
  buildOfficeSafeAttentionStrip,
  buildOfficeSafeRoomBeacons,
  buildOfficeSafeFlowPulseBands,
  buildOfficeSafeTacticalMinimap,
  buildOfficeSafeTacticalTicker,
  buildOfficeSafeMissionClock,
  buildOfficeSafeCommandDeck,
  buildOfficeSafeFloorLegend,
  buildOfficeSafeStatusSnapshot,
  buildOfficeSafeScanIndex,
  buildOfficeSafeHudReadabilityPlan,
  buildOfficeSafeHudHierarchy,
  buildOfficeFirstLayoutPlan,
  buildOfficeTrackingTruthPlan,
  buildOfficeSelectedCharacterFocus,
  buildOfficeSafeEventSubstrate,
  buildOfficeSafeMotionCommands,
  buildOfficeSafeStreamPosture,
  buildOfficeSafeMotionHeartbeat,
  buildOfficeSafeSpatialChoreography,
  buildOfficePaperclipWorkbench,
  buildOfficePaperclipInspector,
  buildOfficePaperclipManifestVisibility,
  buildOfficeKanbanProjection,
  buildOfficePaperclipMapProjection,
  buildOfficePageSectionPlan,
  buildOfficeMapFlows,
  buildOfficeMapNodes,
  buildOfficeSceneMotionTrack,
  buildOfficeSceneObjectView,
  buildOfficeSceneObjects,
  buildOfficeStateDelta,
  buildOfficeAutomationTimingSummary,
  buildOfficeEmptySourceCopyPlan,
  buildOfficeEmptyStateHints,
  buildOfficeSourceHealthSummary,
  buildOfficeSourceHealthRail,
  buildOfficeSourceHealthCompactDiagnostics,
  buildOfficeUsabilitySummary,
  mergeOfficeRecentChanges,
  resolveOfficeLiveTrackingInterval,
  groupByText,
  visibleRows,
  buildOfficeTimeDisplayPolicy,
} from "./officeView";
import type { OfficeState } from "@/lib/api";

function officeFixture(overrides: Partial<OfficeState> = {}): OfficeState {
  return {
    schema_version: 1,
    generated_at: "2026-05-08T00:00:00Z",
    mode: "read_only",
    display_mode: "localhost",
    capabilities: {
      read_only: true,
      mutations_enabled: false,
      remote_mode: "unsupported",
    },
    data_sources: [],
    summary: {},
    rooms: [],
    agents: [],
    work_items: [],
    automations: [],
    topics: [],
    events: [],
    provenance: [],
    redactions: {
      policy_version: 1,
      redacted_field_count: 0,
      omitted_sections: [],
      warnings: [],
    },
    ...overrides,
  };
}

describe("OfficePage view helpers", () => {
  it("groups unknown work safely without reading sensitive body fields", () => {
    const grouped = groupByText([
      { id: "1", status: "blocked", title: "safe title", body: "raw body must not matter" },
      { id: "2", status: "", title: "missing status" },
    ], "status", "unknown");

    expect(Object.keys(grouped)).toEqual(["blocked", "unknown"]);
    expect(grouped.blocked).toHaveLength(1);
    expect(grouped.unknown).toHaveLength(1);
  });

  it("caps dense lists until show-more is requested", () => {
    const rows = Array.from({ length: 8 }, (_, index) => ({ id: index }));

    expect(visibleRows(rows, 6, false)).toHaveLength(6);
    expect(visibleRows(rows, 6, true)).toHaveLength(8);
  });

  it("documents browser-local timezone formatting for office timestamps", () => {
    expect(buildOfficeTimeDisplayPolicy()).toEqual({
      label: "시간 표시",
      value: "브라우저 로컬 시간대",
      detail: "브라우저 locale/timezone 기준으로 표시합니다. KST 고정 변환은 하지 않습니다.",
    });
  });

  it("builds a safe Source Health 1 rail across Kanban, Paperclip, automation, routing, and redaction", () => {
    const rail = buildOfficeSourceHealthRail(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 3, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-11T08:00:00Z", item_count: 8, warning_count: 2, error_summary: "raw /Users/lidises/nas path must not appear" },
        { id: "paperclip:/Users/lidises/nas/raw", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, source_type: "paperclip", tags: ["source:safe", "raw prompt"] } as unknown as OfficeState["data_sources"][number],
        { id: "cron", status: "unavailable", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, error_summary: "secret script must not appear" },
        { id: "topics", status: "error", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, error_summary: "token sk-office-redaction-sentinel" },
      ],
      redactions: { policy_version: 1, redacted_field_count: 4, omitted_sections: ["prompt"], warnings: ["raw warning must not appear"] },
    }));

    expect(rail.stageLabel).toBe("Office Source Health 1");
    expect(rail.items.map((item) => item.id)).toEqual(["sessions", "kanban", "paperclip", "automation", "routing", "redaction"]);
    expect(rail.items.find((item) => item.id === "kanban")).toMatchObject({ label: "Kanban", status: "partial", tone: "warning", sourceCount: 1, itemCount: 8, warningCount: 2 });
    expect(rail.items.find((item) => item.id === "paperclip")).toMatchObject({ label: "Paperclip", status: "missing", tone: "warning", sourceCount: 1, itemCount: 0, warningCount: 1 });
    expect(rail.items.find((item) => item.id === "automation")).toMatchObject({ label: "자동화", status: "unavailable", tone: "neutral" });
    expect(rail.items.find((item) => item.id === "routing")).toMatchObject({ label: "라우팅", status: "error", tone: "negative" });
    expect(rail.items.find((item) => item.id === "redaction")).toMatchObject({ label: "가림", status: "partial", tone: "warning", warningCount: 4 });
    expect(JSON.stringify(rail)).not.toMatch(/\/Users\/lidises|raw|prompt|secret|token|script|sk-office-redaction-sentinel/i);
    const warningOnlyRail = buildOfficeSourceHealthRail(officeFixture({
      redactions: { policy_version: 1, redacted_field_count: 0, omitted_sections: [], warnings: ["raw warning body must not appear"] },
    }));
    expect(warningOnlyRail.items.find((item) => item.id === "redaction")).toMatchObject({ status: "partial", tone: "warning", warningCount: 1 });
    expect(JSON.stringify(warningOnlyRail)).not.toMatch(/raw warning body/i);
  });

  it("builds compact Source Health 2 diagnostics without leaking raw source details", () => {
    const diagnostics = buildOfficeSourceHealthCompactDiagnostics(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 3, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-11T08:00:00Z", item_count: 8, warning_count: 2, error_summary: "raw /Users/lidises/nas path must not appear" },
        { id: "paperclip:/Users/lidises/nas/raw", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, source_type: "paperclip", tags: ["source:safe", "raw prompt"] } as unknown as OfficeState["data_sources"][number],
        { id: "cron", status: "unavailable", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, error_summary: "secret script must not appear" },
        { id: "topics", status: "error", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 1, error_summary: "token sk-office-redaction-sentinel" },
      ],
      redactions: { policy_version: 1, redacted_field_count: 4, omitted_sections: ["prompt"], warnings: ["raw warning must not appear"] },
    }));

    expect(diagnostics.stageLabel).toBe("Office Source Health 2");
    expect(diagnostics.cards.map((card) => card.id)).toEqual(["coverage", "attention", "readability"]);
    expect(diagnostics.cards.find((card) => card.id === "coverage")).toMatchObject({ title: "소스 커버리지", count: 6, tone: "warning" });
    expect(diagnostics.cards.find((card) => card.id === "attention")).toMatchObject({ title: "확인 필요", count: 4, tone: "negative" });
    expect(diagnostics.cards.find((card) => card.id === "readability")).toMatchObject({ title: "읽기 밀도", count: 3, tone: "warning" });
    expect(diagnostics.detail).toContain("상단 3장 요약");
    expect(JSON.stringify(diagnostics)).not.toMatch(/\/Users\/lidises|raw|prompt|secret|token|script|sk-office-redaction-sentinel/i);
  });

  it("summarizes lower Office sections so details can stay collapsed by default", () => {
    const plan = buildOfficePageSectionPlan(officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 12, warning_count: 0 },
        { id: "topics", status: "missing", checked_at: "2026-05-11T08:00:00Z", item_count: 0, warning_count: 0 },
        { id: "paperclip:safe", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 1, warning_count: 0, source_type: "paperclip", tags: ["source:safe", "secret tag ignored"] } as unknown as OfficeState["data_sources"][number],
      ],
      agents: [{ id: "session-1", status: "active", source_platform: "cli" }],
      work_items: [{ id: "w1", status: "blocked", title: "raw body should not appear", body: "secret task body" } as unknown as OfficeState["work_items"][number]],
      automations: [{ id: "a1", state: "scheduled", last_status: "ok", script: "secret script" } as unknown as OfficeState["automations"][number]],
      topics: [],
      provenance: [{ source: "paperclip:safe", label: "safe source", detail: "raw path must not appear" } as unknown as OfficeState["provenance"][number]],
      events: [{ id: "e1", kind: "safe_event", source: "office", created_at: "2026-05-11T08:00:00Z" } as unknown as OfficeState["events"][number]],
      redactions: { policy_version: 1, redacted_field_count: 3, omitted_sections: ["prompt"], warnings: [] },
    }));

    expect(plan.map((section) => section.id)).toEqual(["sources", "paperclip", "work", "automation", "routing", "events"]);
    expect(plan.find((section) => section.id === "sources")).toMatchObject({ label: "소스 상태", count: 3, defaultOpen: false });
    expect(plan.find((section) => section.id === "paperclip")?.summary).toContain("출처 1개");
    expect(plan.find((section) => section.id === "work")?.summary).toContain("세션 1개");
    expect(plan.find((section) => section.id === "routing")?.summary).toContain("출처 기록 1개");
    expect(JSON.stringify(plan)).not.toMatch(/raw|secret|body|script|path/i);
  });

  it("builds a safe Paperclip workbench projection from source tags without raw content", () => {
    const state = officeFixture({
      data_sources: [
        {
          id: "paperclip:clinic-blog",
          status: "partial",
          checked_at: "2026-05-11T08:00:00Z",
          item_count: 12,
          warning_count: 1,
          error_summary: "1 stale manifest",
          source_type: "paperclip",
          relay: "MacBook",
          tags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
          path: "/Users/lidises/nas/secret/raw/path",
          prompt: "raw prompt must not appear",
          transcript: "raw transcript must not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
      provenance: [
        { source: "paperclip:clinic-blog", label: "Paperclip safe manifest", detail: "raw path must not appear" } as unknown as OfficeState["provenance"][number],
      ],
    });

    const workbench = buildOfficePaperclipWorkbench(state);

    expect(workbench.sources).toHaveLength(1);
    expect(workbench.sources[0]).toMatchObject({
      id: "paperclip:clinic-blog",
      label: "clinic-blog",
      health: "partial",
      sourceType: "paperclip",
      itemCount: 12,
      warningCount: 1,
      relay: "MacBook",
    });
    expect(workbench.sources[0].tags).toEqual(["source:koreandeer-shoulder"]);
    expect(JSON.stringify(workbench)).not.toMatch(/raw|prompt|transcript|secret|\/Users\/lidises\/nas/i);
  });

  it("builds Paperclip Workbench 2 manifest visibility without leaking raw manifest details", () => {
    const visibility = buildOfficePaperclipManifestVisibility(officeFixture({
      data_sources: [
        {
          id: "paperclip:clinic-safe-shelf",
          status: "ok",
          checked_at: "2026-05-11T23:30:00Z",
          item_count: 3,
          warning_count: 0,
          source_type: "relay_projection",
          relay: "VPS",
          tags: ["source:koreandeer-shoulder", "raw prompt must not appear"],
          path: "/home/hermes/.hermes/office/paperclip-manifests/private.yaml",
          body: "raw manifest body must not appear",
          token: "sk-" + "paperclip-visibility-sentinel",
        } as unknown as OfficeState["data_sources"][number],
        {
          id: "paperclip:/Users/lidises/nas/raw-second",
          status: "partial",
          checked_at: "2026-05-08T00:00:00Z",
          item_count: 9,
          warning_count: 2,
          source_type: "nas_manifest",
          relay: "MacBook",
          tags: ["source:clinic-notes"],
          error_summary: "raw /Users/lidises/nas error should not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
    }));

    expect(visibility.stageLabel).toBe("Paperclip Workbench 2");
    expect(visibility.cards.map((card) => card.id)).toEqual(["manifests", "privateDashboard", "relayPosture"]);
    expect(visibility.cards.find((card) => card.id === "manifests")).toMatchObject({ title: "안전 manifest", count: 2, tone: "warning" });
    expect(visibility.cards.find((card) => card.id === "privateDashboard")).toMatchObject({ title: "VPS 표시", count: 1, tone: "positive" });
    expect(visibility.cards.find((card) => card.id === "relayPosture")).toMatchObject({ title: "릴레이 생산", count: 2, tone: "neutral" });
    expect(visibility.detail).toContain("validator-passing");
    expect(JSON.stringify(visibility)).not.toMatch(/\/home\/hermes|\/Users\/lidises|raw|prompt|body|token|sk-paperclip|private\.yaml/i);
  });

  it("builds a safe Kanban operations projection with graph refs and no raw task content", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      rooms: [
        { id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { done: 1, running: 1, blocked: 0 } },
      ],
      work_items: [
        {
          id: "kanban:ai-office:item:0",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_72c99902",
          title: "Kanban task",
          body: "raw body must not appear",
          result: "raw result must not appear",
          prompt: "raw prompt must not appear",
          transcript: "raw transcript must not appear",
          status: "done",
          assignee: "ai-office-orchestrator",
          tenant: "ai-office",
          priority: 7,
          parent_task_refs: [],
          child_task_refs: ["t_86deef15"],
          dependency_counts: { parents: 0, children: 1 },
          badges: ["graph_parent"],
        },
        {
          id: "kanban:ai-office:item:1",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_86deef15",
          title: "Kanban task",
          status: "running",
          assignee: "office-reporter",
          tenant: "ai-office",
          priority: 0,
          parent_task_refs: ["t_72c99902"],
          child_task_refs: [],
          dependency_counts: { parents: 1, children: 0 },
          badges: ["active", "graph_child"],
        },
      ],
    }));

    expect(projection.stageLabel).toBe("칸반 운영실");
    expect(projection.readOnly).toBe(true);
    expect(projection.boards[0]).toMatchObject({ boardId: "ai-office", displayName: "AI Office", taskCount: 2 });
    expect(projection.assignees.map((assignee) => assignee.id)).toEqual(["ai-office-orchestrator", "office-reporter"]);
    expect(projection.tenants).toEqual([{ id: "ai-office", count: 2 }]);
    expect(projection.graphEdges).toEqual([{ parent: "t_72c99902", child: "t_86deef15", boardId: "ai-office" }]);
    expect(projection.cards[0]).toMatchObject({ taskRef: "t_72c99902", boardId: "ai-office", childTaskRefs: ["t_86deef15"] });
    expect(JSON.stringify(projection)).not.toMatch(/raw|body|result|prompt|transcript|secret/i);
  });

  it("summarizes Kanban stale, blocked, and workload signals without raw task fields", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-12T00:00:00Z",
      rooms: [
        { id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { running: 2, blocked: 1, open: 1 } },
      ],
      work_items: [
        {
          id: "kanban:ai-office:item:0",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_running_old",
          title: "Kanban task",
          status: "running",
          assignee: "office-runner",
          tenant: "ai-office",
          priority: 3,
          updated_at: "2026-05-11T22:30:00Z",
          last_heartbeat_at: "2026-05-11T22:30:00Z",
          parent_task_refs: [],
          child_task_refs: [],
          badges: ["active"],
          body: "raw body must not appear",
        },
        {
          id: "kanban:ai-office:item:1",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_blocked",
          title: "Kanban task",
          status: "blocked",
          assignee: "office-runner",
          tenant: "ai-office",
          priority: 9,
          updated_at: { path: "/Users/lidises/nas/private" },
          last_heartbeat_at: "raw secret timestamp must not appear",
          parent_task_refs: ["t_running_old"],
          child_task_refs: [],
          badges: ["needs_attention", "graph_child"],
          result: "raw result must not appear",
        },
        {
          id: "kanban:ai-office:item:2",
          source: "kanban",
          kind: "kanban_task",
          board_id: "ai-office",
          task_ref: "t_recent",
          title: "Kanban task",
          status: "running",
          assignee: "reviewer",
          tenant: "ai-office",
          priority: 1,
          updated_at: "2026-05-11T23:58:00Z",
          last_heartbeat_at: "2026-05-11T23:58:00Z",
          parent_task_refs: [],
          child_task_refs: [],
          badges: ["active"],
        },
      ],
    }));

    expect(projection.observability.stageLabel).toBe("Kanban Observability 2");
    expect(projection.observability.summaryCards).toEqual([
      { id: "workload", label: "작업량", value: 3, detail: "보드 1개 · 실행 중 2개", tone: "neutral" },
      { id: "blocked", label: "막힘", value: 1, detail: "확인 필요 task_ref 1개", tone: "negative" },
      { id: "stale", label: "정체", value: 1, detail: "최근 heartbeat/update 60분 초과 1개", tone: "warning" },
    ]);
    expect(projection.observability.workloadByBoard).toEqual([{ boardId: "ai-office", total: 3, running: 2, blocked: 1, stale: 1 }]);
    expect(projection.observability.attentionRefs).toEqual(["t_blocked", "t_running_old"]);
    expect(JSON.stringify(projection.observability)).not.toMatch(/raw|body|result|prompt|transcript|secret|\/Users\/lidises\/nas/i);
    expect(JSON.stringify(projection.cards)).not.toMatch(/raw|secret|timestamp|\/Users\/lidises\/nas/i);
  });

  it("caps Kanban observability attention refs before exposing the browser projection", () => {
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-12T00:00:00Z",
      rooms: [{ id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { blocked: 8 } }],
      work_items: Array.from({ length: 8 }, (_, index) => ({
        id: `kanban:ai-office:item:${index}`,
        source: "kanban",
        kind: "kanban_task",
        board_id: "ai-office",
        task_ref: `t_blocked_${index}`,
        title: "Kanban task",
        status: "blocked",
        assignee: "office-runner",
        tenant: "ai-office",
        priority: index,
        parent_task_refs: [],
        child_task_refs: [],
        badges: ["needs_attention"],
        body: "raw body must not appear",
      })),
    }));

    expect(projection.observability.attentionRefs).toEqual(["t_blocked_0", "t_blocked_1", "t_blocked_2", "t_blocked_3", "t_blocked_4", "t_blocked_5"]);
    expect(JSON.stringify(projection.observability)).not.toMatch(/raw|body|secret/i);
  });

  it("builds safe Paperclip inspector fields and CSS map slots from the sanitized workbench only", () => {
    const state = officeFixture({
      generated_at: "2026-05-11T09:00:00Z",
      data_sources: [
        {
          id: "paperclip:clinic-blog",
          status: "ok",
          checked_at: "2026-05-11T08:00:00Z",
          item_count: 3,
          warning_count: 0,
          source_type: "paperclip",
          relay: "MacBook",
          tags: ["source:koreandeer-shoulder", "token must not appear"],
          path: "/Users/lidises/nas/private/full/path",
          body: "secret body must not appear",
        } as unknown as OfficeState["data_sources"][number],
      ],
    });
    const source = buildOfficePaperclipWorkbench(state).sources[0];
    const inspector = buildOfficePaperclipInspector(source);
    const projection = buildOfficePaperclipMapProjection([source]);

    expect(inspector.kind).toBe("Paperclip 안전 작업대");
    expect(inspector.fields.map(([label]) => label)).toEqual(["id", "종류", "상태", "항목", "경고", "릴레이", "상태 시점", "태그", "가림"]);
    expect(projection.slots[0]).toMatchObject({ id: "paperclip:clinic-blog", label: "clinic-blog", health: "ok", x: 18, y: 50 });
    expect(JSON.stringify({ inspector, projection })).not.toMatch(/raw|prompt|transcript|secret|token|\/Users\/lidises\/nas|body/i);
  });

  it("builds live operations layer from safe aggregate state without raw work details", () => {
    const layer = buildOfficeLiveOperationsLayer(officeFixture({
      generated_at: "2026-05-11T09:00:00Z",
      work_items: [
        { id: "w1", status: "running", title: "raw task body must not appear", body: "secret body" } as unknown as OfficeState["work_items"][number],
        { id: "w2", status: "blocked", title: "blocked private title", result: "raw result" } as unknown as OfficeState["work_items"][number],
        { id: "w3", status: "reviewing", prompt: "raw prompt" } as unknown as OfficeState["work_items"][number],
        { id: "w4", status: "report_ready", transcript: "raw transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "a1", state: "scheduled", last_status: "ok", script: "/Users/lidises/private.py" } as unknown as OfficeState["automations"][number],
        { id: "a2", state: "done", last_status: "ok", script: "/Users/lidises/private-done.py" } as unknown as OfficeState["automations"][number],
      ],
      data_sources: [{ id: "paperclip:rpg-office-runtime-roadmap", status: "ok", checked_at: "2026-05-11T08:00:00Z", item_count: 9, warning_count: 0 }],
    }));

    expect(layer.stageLabel).toBe("Live operations layer");
    expect(layer.summary).toBe("작업 중 1 · 리뷰 1 · 보고 1 · 주의 1 · 자동화 1");
    expect(layer.cues.map((cue) => cue.id)).toEqual(["working", "reviewing", "report-ready", "blocked", "automation-running"]);
    expect(layer.cues.find((cue) => cue.id === "report-ready")).toMatchObject({ label: "보고 대기", count: 1, roomId: "work", tone: "positive" });
    expect(layer.cues.every((cue) => cue.ariaHidden && cue.interactive === false)).toBe(true);
    expect(JSON.stringify(layer)).not.toMatch(/raw|prompt|transcript|secret|body|result|\/Users\/lidises|private/i);
  });

  it("builds attention rail from blocked work, failed automations, and unhealthy sources", () => {
    const attention = buildOfficeAttentionItems(
      officeFixture({
        data_sources: [
          {
            id: "topics",
            status: "missing",
            checked_at: "2026-05-08T00:00:00Z",
            warning_count: 0,
          },
          {
            id: "cron",
            status: "partial",
            checked_at: "2026-05-08T00:00:00Z",
            warning_count: 1,
          },
        ],
        work_items: [{ id: "task-1", title: "Blocked safe task", status: "blocked" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "error" }],
      }),
    );

    expect(attention.map((item) => item.id)).toEqual([
      "work:task-1",
      "automation:job-1",
      "source:cron",
    ]);
    expect(attention.map((item) => item.label).join(" ")).not.toContain("prompt");
  });

  it("builds a browser-local office map from safe DTO counts", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        data_sources: [
          { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 2 },
          { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
        ],
        agents: [{ id: "session-1", source_platform: "cli", status: "active", preview: "raw prompt must not matter" }],
        work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", script: "raw script must not matter" }],
        topics: [],
      }),
    );

    expect(nodes.map((node) => node.id)).toEqual(["sessions", "work", "automation", "routing"]);
    expect(nodes.find((node) => node.id === "sessions")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "work")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "automation")?.count).toBe(1);
    expect(nodes.find((node) => node.id === "routing")?.health).toBe("missing");
    expect(nodes.map((node) => `${node.label} ${node.detail}`).join(" ")).not.toContain("raw");
  });


  it("builds safe office-map flow hints with degraded endpoint health", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        data_sources: [
          { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
          { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
        ],
        agents: [{ id: "session-1", source_platform: "cli", status: "active", transcript: "raw transcript must not matter" }],
        work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
        automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", script: "raw script must not matter" }],
      }),
    );
    const flows = buildOfficeMapFlows(nodes);

    expect(flows.map((flow) => `${flow.from}->${flow.to}`)).toEqual([
      "sessions->work",
      "work->automation",
      "automation->routing",
    ]);
    expect(flows.map((flow) => flow.health)).toEqual(["partial", "error", "error"]);
    expect(flows.map((flow) => flow.label).join(" ")).not.toContain("raw");
    expect(nodes.map((node) => node.zone)).toEqual(["entry", "workbench", "machine", "routing"]);
    expect(nodes.every((node) => node.x >= 12 && node.x <= 88 && node.y >= 16 && node.y <= 84)).toBe(true);
  });

  it("builds safe 2D office scene objects with caps and no raw field projection", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 8 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 7 },
        { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 2 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
      ],
      agents: Array.from({ length: 8 }, (_, index) => ({ id: `session-${index}`, source_platform: "cli", status: "active", transcript: "raw transcript must not matter" })),
      work_items: Array.from({ length: 7 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw task body must not matter" })),
      automations: [
        { id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
        { id: "job-2", name: "Cron job job-2", state: "error", last_status: "error", secret: "raw secret must not matter" },
      ],
      topics: [],
      provenance: [],
    });
    const nodes = buildOfficeMapNodes(state);
    const objects = buildOfficeSceneObjects(state, nodes);

    expect(objects.map((object) => object.kind)).toContain("avatar");
    expect(objects.map((object) => object.kind)).toContain("desk");
    expect(objects.map((object) => object.kind)).toContain("machine");
    expect(objects.map((object) => object.kind)).toContain("mail");
    expect(objects.filter((object) => object.roomId === "sessions" && object.kind === "avatar")).toHaveLength(6);
    expect(objects.find((object) => object.id === "sessions-overflow")?.label).toBe("+2 세션");
    expect(objects.find((object) => object.id === "work-overflow")?.label).toBe("+1 작업");
    expect(objects.find((object) => object.roomId === "routing")?.label).toBe("미연결 보관함");
    expect(objects.every((object) => object.x >= 10 && object.x <= 90 && object.y >= 12 && object.y <= 88)).toBe(true);
    expect(objects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|transcript|body|script|secret/i);
  });

  it("builds non-interactive accessible marker presentation without raw details", () => {
    const marker = buildOfficeSceneObjectView({
      id: "work-desk-1",
      roomId: "work",
      kind: "desk",
      label: "work desk 1",
      detail: "workbench safe marker",
      health: "partial",
      x: 63,
      y: 21,
    });

    expect(marker.glyph).toBe("▤");
    expect(marker.title).toBe("work desk 1 · workbench safe marker");
    expect(marker.ariaHidden).toBe(true);
    expect(marker.interactive).toBe(false);
    expect(marker.toneClass).toContain("yellow");
    expect(marker.title).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe CSS motion tracks so the 2D scene feels alive without a renderer", () => {
    const avatarMotion = buildOfficeSceneMotionTrack({
      id: "sessions-avatar-1",
      roomId: "sessions",
      kind: "avatar",
      label: "세션 표시 1",
      detail: "entry 안전 표시",
      health: "ok",
      x: 17,
      y: 22,
    });
    const machineMotion = buildOfficeSceneMotionTrack({
      id: "automation-machine-1",
      roomId: "automation",
      kind: "machine",
      label: "자동화 기계 1",
      detail: "machine 안전 표시",
      health: "partial",
      x: 17,
      y: 58,
    });

    expect(avatarMotion).toMatchObject({
      className: "office-scene-marker-motion office-scene-marker-walk",
      ariaLabel: "세션 표시 1 이동 표시 · 안전 DTO 기반",
    });
    expect(avatarMotion.style).toMatchObject({
      "--office-motion-x": "3px",
      "--office-motion-y": "-2px",
      "--office-motion-duration": "4.8s",
      "--office-motion-delay": "-0.3s",
    });
    expect(machineMotion.className).toBe("office-scene-marker-motion office-scene-marker-blink");
    expect(machineMotion.ariaLabel).toBe("자동화 기계 1 상태등 표시 · 안전 DTO 기반");
    expect(`${avatarMotion.ariaLabel} ${Object.values(avatarMotion.style).join(" ")} ${machineMotion.ariaLabel}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe RPG role characters for models and office work without raw projection", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 4 },
        { id: "cron", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
        { id: "topics", status: "missing", checked_at: "2026-05-09T00:00:00Z", item_count: 0 },
      ],
      agents: [
        { id: "agent-1", model: "safe-model", status: "active", prompt: "raw prompt must not matter" },
        { id: "agent-2", provider: "safe-provider", status: "idle", transcript: "raw transcript must not matter" },
      ],
      work_items: Array.from({ length: 4 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw task body must not matter" })),
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T01:00:00Z", script: "raw script must not matter" }],
      topics: [],
      provenance: [],
    });
    const characters = buildOfficeCharacters(state, buildOfficeMapNodes(state));

    expect(characters.map((character) => character.role)).toEqual(expect.arrayContaining(["model", "worker", "automation_keeper", "router", "sentinel", "alert"]));
    expect(characters.find((character) => character.role === "model")?.label).toBe("모델 캐릭터 1");
    expect(characters.find((character) => character.role === "worker")?.label).toBe("작업자 1");
    expect(characters.find((character) => character.role === "automation_keeper")?.label).toBe("자동화 관리인 1");
    expect(characters.find((character) => character.role === "router")?.label).toBe("전달자 1");
    expect(characters.find((character) => character.role === "sentinel")?.label).toBe("감시자 1");
    expect(characters.find((character) => character.role === "alert")?.status).toBe("blocked");
    expect(characters.every((character) => character.roomId && character.status && character.redactionNote && character.x >= 10 && character.x <= 90 && character.y >= 12 && character.y <= 88)).toBe(true);
    expect(characters.map((character) => `${character.label} ${character.detail} ${character.redactionNote}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|safe-model|safe-provider/i);
  });

  it("builds original CSS character views for each RPG role without raw labels", () => {
    const roles = ["model", "operator", "worker", "reviewer", "automation_keeper", "router", "sentinel", "alert"] as const;
    const views = roles.map((role, index) =>
      buildOfficeCharacterView({
        id: `${role}-1`,
        role,
        roomId: role === "automation_keeper" ? "automation" : role === "router" || role === "sentinel" ? "routing" : role === "model" || role === "operator" ? "sessions" : "work",
        label: `raw ${role} model prompt ${index}`,
        status: role === "alert" ? "blocked" : role === "reviewer" ? "reviewing" : role === "router" ? "routing" : role === "automation_keeper" ? "scheduled" : "active",
        detail: "raw transcript body script secret must not matter",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 20,
        y: 20,
      }),
    );

    expect(views.map((view) => view.nameplate)).toEqual(["모델", "조작", "작업", "검토", "자동화", "전달", "감시", "경보"]);
    expect(views.every((view) => view.bodyClassName.startsWith("office-character office-character--"))).toBe(true);
    expect(views.every((view) => view.accessoryClassName.startsWith("office-character__accessory office-character__accessory--"))).toBe(true);
    expect(views.map((view) => view.statusLabel)).toEqual(["활성", "활성", "활성", "검토", "예약", "전달", "활성", "막힘"]);
    expect(views.map((view) => `${view.glyph} ${view.nameplate} ${view.statusLabel} ${view.safeTitle} ${view.bodyClassName} ${view.accessoryClassName}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model prompt/i);
  });

  it("builds safe action loops for RPG characters from status and room delta only", () => {
    const emptyDelta = buildOfficeStateDelta(null, officeFixture());
    const changedDelta = {
      ...emptyDelta,
      nodeBadges: {
        ...emptyDelta.nodeBadges,
        automation: [{ label: "일정 변경", tone: "warning" as const }],
        routing: [{ label: "상태 변경", tone: "warning" as const }],
      },
    };
    const base = {
      id: "character-1",
      roomId: "sessions" as const,
      label: "raw prompt transcript body script secret must not matter",
      detail: "raw model provider task body must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const activities = [
      buildOfficeCharacterActivity({ ...base, role: "model", status: "active" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "worker", roomId: "work", status: "working" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "reviewer", roomId: "work", status: "reviewing" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "router", roomId: "routing", status: "routing" }, changedDelta),
      buildOfficeCharacterActivity({ ...base, role: "automation_keeper", roomId: "automation", status: "scheduled" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "automation_keeper", roomId: "automation", status: "scheduled" }, changedDelta),
      buildOfficeCharacterActivity({ ...base, role: "alert", roomId: "work", status: "blocked" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "sentinel", roomId: "routing", status: "warning" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "sentinel", roomId: "routing", status: "unknown" }, emptyDelta),
      buildOfficeCharacterActivity({ ...base, role: "operator", status: "idle" }, emptyDelta),
    ];

    expect(activities.map((activity) => activity.id)).toEqual(["thinking", "working", "reviewing", "routing", "scheduled", "soon", "blocked", "warning", "unknown", "idle"]);
    expect(activities.map((activity) => activity.label)).toEqual(["생각 중", "작업 중", "검토 중", "전달 중", "예약 대기", "곧 실행", "막힘", "확인 필요", "확인 불가", "대기"]);
    expect(activities.map((activity) => activity.tone)).toEqual(["normal", "success", "success", "normal", "muted", "warning", "danger", "warning", "muted", "muted"]);
    expect(activities.map((activity) => activity.motion)).toEqual(["idle", "pulse", "idle", "walk", "idle", "blink", "blink", "blink", "none", "none"]);
    expect(activities.map((activity) => `${activity.id} ${activity.label} ${activity.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model|provider/i);
  });

  it("builds safe room-to-room RPG routes from changed flows only", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "세션에서 작업으로", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const },
        { from: "automation" as const, to: "routing" as const, label: "자동화에서 라우팅으로", tone: "negative" as const },
      ],
    };

    const routes = buildOfficeCharacterRoutes(delta);

    expect(routes.map((route) => route.id)).toEqual([
      "route:sessions->work",
      "route:work->automation",
      "route:automation->routing",
    ]);
    expect(routes.map((route) => route.label)).toEqual(["흐름 변경", "흐름 변경", "흐름 변경"]);
    expect(routes.map((route) => route.detail)).toEqual([
      "세션에서 작업으로 · 방금 변경",
      "작업에서 자동화로 · 방금 변경",
      "자동화에서 라우팅으로 · 방금 변경",
    ]);
    expect(routes.map((route) => route.motion)).toEqual(["route", "alert", "alert"]);
    expect(routes.map((route) => route.tone)).toEqual(["normal", "warning", "danger"]);
    expect(routes.map((route) => `${route.label} ${route.detail} ${route.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe character inspector fields for keyboard-accessible RPG character inspection", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "+2", tone: "positive" as const }],
        work: [],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
    };
    const character = {
      id: "model-1",
      role: "model" as const,
      roomId: "sessions" as const,
      label: "raw model provider prompt must not matter",
      status: "active" as const,
      detail: "raw transcript body script secret must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const inspector = buildOfficeCharacterInspector(character, delta);

    expect(inspector.kind).toBe("RPG 캐릭터");
    expect(inspector.title).toBe("세션 · 모델 캐릭터");
    expect(inspector.ariaLabel).toBe("모델 캐릭터 살펴보기, 방 세션, 상태 활성, 액션 생각 중");
    expect(inspector.fields).toEqual([
      ["캐릭터", "모델 캐릭터"],
      ["역할", "모델"],
      ["방", "세션"],
      ["상태", "활성"],
      ["액션", "생각 중"],
      ["최근 안전 변화", "+2 · 세션에서 작업으로 · 방금 변경"],
      ["가림", "안전 DTO 역할/상태/개수/흐름만 반영 · 원문 제외"],
    ]);
    expect(`${inspector.title} ${inspector.ariaLabel} ${inspector.fields.flat().join(" ")}`).not.toMatch(/raw|prompt|transcript|body|script|secret|model provider/i);
  });

  it("builds safe Stage 16-A tracking truth and selected-character focus copy", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "+2", tone: "positive" as const }],
        work: [],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
    };
    const character = {
      id: "model-1",
      role: "model" as const,
      roomId: "sessions" as const,
      label: "raw model provider prompt must not matter",
      status: "active" as const,
      detail: "raw transcript body script secret must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    };

    const truth = buildOfficeTrackingTruthPlan(delta, { hasEventStream: false, visibleCharacterCount: 12 });
    const focus = buildOfficeSelectedCharacterFocus(character, delta);

    expect(truth.stageLabel).toBe("Stage 16-A tracking truth");
    expect(truth.mode).toBe("snapshot-delta");
    expect(truth.label).toBe("스냅샷 변화 기반");
    expect(truth.detail).toBe("캐릭터 12개 · 최근 안전 변화 2개 · 실시간 이벤트 스트림 없음");
    expect(truth.caveats).toEqual(["움직임은 CSS 장식입니다", "실제 작업 추적은 안전 이벤트 스트림 승인 후 분리 구현"]);
    expect(focus).toEqual({
      selectedCharacterId: "model-1",
      title: "모델 캐릭터 선택됨",
      summary: "세션 · 활성 · 생각 중",
      roomLabel: "세션",
      actionLabel: "생각 중",
      highlightSelector: '[data-office-character-id="model-1"]',
      fields: [
        ["역할", "모델"],
        ["방", "세션"],
        ["상태", "활성"],
        ["액션", "생각 중"],
        ["추적", "스냅샷 변화 기반 · 원문 제외"],
      ],
    });
    expect(`${truth.label} ${truth.detail} ${truth.caveats.join(" ")} ${focus.title} ${focus.summary} ${focus.fields.flat().join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|provider|model provider|sk-/i);
  });

  it("builds safe Stage 16-B event substrate and motion commands", () => {
    const delta = {
      ...buildOfficeStateDelta(null, officeFixture()),
      nodeBadges: {
        sessions: [{ label: "raw prompt +3 token must not matter", tone: "positive" as const }],
        work: [{ label: "raw task_body warning secret must not matter", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw transcript script provider must not matter", tone: "warning" as const }],
    };

    const substrate = buildOfficeSafeEventSubstrate(delta, { visibleCharacterCount: 11, hasEventStream: false });
    const commands = buildOfficeSafeMotionCommands(substrate.events);

    expect(substrate.stageLabel).toBe("Stage 16-B safe event substrate");
    expect(substrate.mode).toBe("projected-events");
    expect(substrate.summary).toBe("안전 이벤트 4개 · snapshot/delta 투영");
    expect(substrate.events.map((event) => event.category)).toEqual(["room_density_changed", "room_density_changed", "flow_changed", "attention_changed"]);
    expect(substrate.events.map((event) => event.roomId)).toEqual(["sessions", "work", "sessions", "work"]);
    expect(substrate.events.every((event) => event.redacted && event.safeLabel.length > 0 && event.rawSource === false)).toBe(true);
    expect(commands.map((command) => command.kind)).toEqual(["pulse-room", "pulse-room", "route-lane", "attention-spark"]);
    expect(commands.find((command) => command.kind === "route-lane")?.lane).toBe("sessions-work");
    expect(`${substrate.summary} ${substrate.events.map((event) => `${event.safeLabel} ${event.detail}`).join(" ")} ${commands.map((command) => `${command.label} ${command.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("keeps Stage 16-B first snapshot static without fabricated movement", () => {
    const substrate = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const commands = buildOfficeSafeMotionCommands(substrate.events);

    expect(substrate.mode).toBe("static-posture");
    expect(substrate.events).toEqual([
      expect.objectContaining({
        category: "snapshot_static",
        roomId: "sessions",
        tone: "neutral",
        count: 11,
        safeLabel: "정적 안전 스냅샷",
        redacted: true,
        rawSource: false,
      }),
    ]);
    expect(commands).toEqual([
      expect.objectContaining({
        kind: "idle-glow",
        roomId: "sessions",
        label: "대기 광원",
      }),
    ]);
  });

  it("builds safe Stage 16-C stream posture from backend events with local fallback", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const loaded = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        {
          id: "backend-1",
          category: "source_health_changed",
          room_id: "routing",
          tone: "warning",
          count: 2,
          generated_at: "2026-05-10T00:00:00Z",
          redacted: true,
          raw_label: "raw prompt provider model token must not leak",
        },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);
    const unavailable = buildOfficeSafeStreamPosture({ status: "unavailable", events: [], error: "raw transcript secret token" }, local);

    expect(loaded.mode).toBe("backend-safe-stream");
    expect(loaded.label).toBe("백엔드 안전 이벤트 연결");
    expect(loaded.events.map((event) => event.category)).toEqual(["source_health_changed"]);
    expect(loaded.events[0]).toEqual(expect.objectContaining({ roomId: "routing", tone: "warning", count: 2, rawSource: false, redacted: true }));
    expect(unavailable.mode).toBe("local-fallback");
    expect(unavailable.events.map((event) => event.category)).toEqual(["snapshot_static"]);
    expect(`${loaded.summary} ${loaded.events[0].safeLabel} ${loaded.events[0].detail} ${unavailable.summary}`).not.toMatch(/raw|prompt|transcript|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds safe Stage 16-D motion heartbeat from safe stream posture", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const stream = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "negative", count: 4, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-2", category: "source_health_changed", room_id: "routing", tone: "warning", count: 2, generated_at: "2026-05-10T00:00:00Z", redacted: true },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);

    const heartbeat = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 7, failureCount: 0, reducedMotion: false });
    const reduced = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 8, failureCount: 0, reducedMotion: true });
    const fallback = buildOfficeSafeMotionHeartbeat(local, { pollStatus: "unavailable", tick: 0, failureCount: 2, reducedMotion: false });

    expect(heartbeat.stageLabel).toBe("Stage 16-D 안전 motion heartbeat");
    expect(heartbeat.mode).toBe("safe-polling");
    expect(heartbeat.phase).toBe("pulse");
    expect(heartbeat.intensity).toBe("high");
    expect(heartbeat.items.map((item) => item.id)).toEqual(["stream", "cadence", "motion"]);
    expect(heartbeat.items[0].detail).toContain("백엔드 안전 이벤트");
    expect(reduced.motionEnabled).toBe(false);
    expect(fallback.mode).toBe("local-fallback");
    expect(fallback.intensity).toBe("low");
    expect(`${heartbeat.summary} ${heartbeat.items.map((item) => item.detail).join(" ")} ${fallback.summary}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds safe Stage 16-E spatial choreography from heartbeat events", () => {
    const local = buildOfficeSafeEventSubstrate(buildOfficeStateDelta(null, officeFixture()), { visibleCharacterCount: 11, hasEventStream: false });
    const stream = buildOfficeSafeStreamPosture({
      status: "loaded",
      events: [
        { id: "event-1", category: "workload_changed", room_id: "work", tone: "negative", count: 4, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-2", category: "flow_changed", room_id: "work", to_room_id: "automation", tone: "warning", count: 1, generated_at: "2026-05-10T00:00:00Z", redacted: true },
        { id: "event-3", category: "source_health_changed", room_id: "routing", tone: "warning", count: 2, generated_at: "2026-05-10T00:00:00Z", redacted: true, detail: "raw provider token must not leak" },
      ],
      generated_at: "2026-05-10T00:00:00Z",
    }, local);
    const heartbeat = buildOfficeSafeMotionHeartbeat(stream, { pollStatus: "active", tick: 9, failureCount: 0, reducedMotion: false });

    const choreography = buildOfficeSafeSpatialChoreography(stream.events, heartbeat);

    expect(choreography.stageLabel).toBe("Stage 16-E 안전 spatial choreography");
    expect(choreography.mode).toBe("safe-spatial-motion");
    expect(choreography.items.map((item) => item.kind)).toEqual(["room-pulse", "route-sweep", "room-pulse"]);
    expect(choreography.items[0]).toEqual(expect.objectContaining({ roomId: "work", x: 70, y: 30, intensity: "high", interactive: false, ariaHidden: true }));
    expect(choreography.items[1]).toEqual(expect.objectContaining({ roomId: "work", toRoomId: "automation", x: 70, y: 30, x2: 24, y2: 67 }));
    expect(`${choreography.summary} ${choreography.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|api_key|password|sk-/i);
  });

  it("builds Stage 10-F usability summary for dense, missing-source, reduced-motion, and responsive states", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 8 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 8, warning_count: 1, error_summary: "raw stack secret must not matter" },
        { id: "cron", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 5 },
      ],
      agents: Array.from({ length: 8 }, (_, index) => ({ id: `agent-${index}`, status: "active", prompt: "raw prompt must not matter" })),
      work_items: Array.from({ length: 8 }, (_, index) => ({ id: `task-${index}`, title: "Safe task", status: index === 0 ? "blocked" : "open", body: "raw body must not matter" })),
      automations: Array.from({ length: 5 }, (_, index) => ({ id: `job-${index}`, state: "scheduled", script: "raw script must not matter" })),
      topics: [],
      provenance: [],
    });
    const nodes = buildOfficeMapNodes(state);
    const characters = buildOfficeCharacters(state, nodes);

    const summary = buildOfficeUsabilitySummary(state, characters, { reducedMotion: true, viewportWidth: 430 });

    expect(summary.items.map((item) => item.id)).toEqual(["density", "source-fallback", "motion", "responsive", "korean-copy"]);
    expect(summary.items.map((item) => item.label)).toEqual(["밀도 점검", "소스 공백", "동작 모드", "좁은 화면", "한국어 우선"]);
    expect(summary.items.find((item) => item.id === "density")?.detail).toContain("합산 캐릭터");
    expect(summary.items.find((item) => item.id === "source-fallback")?.detail).toContain("미연결/부분 연결");
    expect(summary.items.find((item) => item.id === "motion")?.detail).toContain("정지");
    expect(summary.items.find((item) => item.id === "responsive")?.detail).toContain("세로");
    expect(summary.items.every((item) => item.detail.length > 0 && item.tone)).toBe(true);
    expect(summary.items.map((item) => `${item.label} ${item.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|stack/i);
  });

  it("builds Stage 10-G safe readability density plans without exposing raw character details", () => {
    const characters = Array.from({ length: 14 }, (_, index) => ({
      id: `character-${index}`,
      role: "model" as const,
      roomId: "sessions" as const,
      label: index === 13 ? "raw prompt transcript secret must not matter" : `모델 캐릭터 ${index + 1}`,
      status: "active" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const summary = buildOfficeMapDensityPlan("summary", characters);
    const standard = buildOfficeMapDensityPlan("standard", characters);
    const detail = buildOfficeMapDensityPlan("detail", characters);

    expect([summary.label, standard.label, detail.label]).toEqual(["요약", "표준", "상세"]);
    expect(summary.visibleCharacters).toHaveLength(6);
    expect(standard.visibleCharacters).toHaveLength(12);
    expect(detail.visibleCharacters).toHaveLength(14);
    expect(summary.hiddenCharacterCount).toBe(8);
    expect(standard.hiddenCharacterCount).toBe(2);
    expect(detail.hiddenCharacterCount).toBe(0);
    expect(summary.showUsabilityRail).toBe(true);
    expect(summary.showRecentRail).toBe(false);
    expect(standard.showRecentRail).toBe(true);
    expect(detail.showRecentRail).toBe(true);
    expect(`${summary.label} ${summary.detail} ${summary.visibleCharacters.map((character) => character.label).join(" ")}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 11-B CSS/SVG polish plans for crowded labels and lower rails", () => {
    const characters = Array.from({ length: 14 }, (_, index) => ({
      id: `character-${index}`,
      role: "automation_keeper" as const,
      roomId: index < 8 ? ("automation" as const) : ("sessions" as const),
      label: index === 13 ? "raw prompt transcript secret must not matter" : `자동화 관리인 ${index + 1}`,
      status: index % 3 === 0 ? ("scheduled" as const) : ("active" as const),
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardPlan = buildOfficeMapDensityPlan("standard", characters);
    const summaryPlan = buildOfficeMapDensityPlan("summary", characters);
    const standardPolish = buildOfficeMapPolishPlan(standardPlan);
    const summaryPolish = buildOfficeMapPolishPlan(summaryPlan);

    expect(standardPolish).toMatchObject({
      stageLabel: "Stage 11-B 정돈",
      characterLabelMode: "compact",
      lowerRailMode: "detached",
      mapClassName: "office-map--polished office-map--labels-compact office-map--rail-detached",
      legendClassName: "office-map-legend office-map-legend--detached",
    });
    expect(standardPolish.notes).toEqual(expect.arrayContaining(["캐릭터 이름표는 역할 중심으로 압축", "하단 rail은 맵 바닥과 분리"]));
    expect(summaryPolish.characterLabelMode).toBe("minimal");
    expect(summaryPolish.lowerRailMode).toBe("detached");
    expect(`${standardPolish.stageLabel} ${standardPolish.notes.join(" ")} ${standardPolish.mapClassName}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 12-A responsive readability plans from viewport width only", () => {
    const characters = Array.from({ length: 12 }, (_, index) => ({
      id: `character-${index}`,
      role: "model" as const,
      roomId: "sessions" as const,
      label: index === 11 ? "raw prompt transcript secret must not matter" : `모델 캐릭터 ${index + 1}`,
      status: "active" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardPlan = buildOfficeMapDensityPlan("standard", characters);
    const narrow = buildOfficeResponsiveReadabilityPlan(standardPlan, { viewportWidth: 430 });
    const desktop = buildOfficeResponsiveReadabilityPlan(standardPlan, { viewportWidth: 1280 });

    expect(narrow).toMatchObject({
      stageLabel: "Stage 12-A 반응형",
      viewportMode: "narrow",
      recommendedDensityMode: "summary",
      mapClassName: "office-map--responsive office-map--mobile-readable",
      railClassName: "office-map-rail--mobile-stack",
    });
    expect(narrow.notes).toEqual(expect.arrayContaining(["좁은 화면에서는 요약 모드 권장", "맵 rail은 세로 흐름으로 읽힘"]));
    expect(desktop.viewportMode).toBe("desktop");
    expect(desktop.recommendedDensityMode).toBe("standard");
    expect(`${narrow.stageLabel} ${narrow.notes.join(" ")} ${narrow.mapClassName}`).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds Stage 10-H keyboard jump targets with density-aware recent rail labels", () => {
    const characters = Array.from({ length: 9 }, (_, index) => ({
      id: `character-${index}`,
      role: "worker" as const,
      roomId: "work" as const,
      label: index === 8 ? "raw prompt transcript secret must not matter" : `작업자 ${index + 1}`,
      status: "working" as const,
      detail: "raw task body script must not matter",
      redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
      x: 20,
      y: 20,
    }));

    const standardTargets = buildOfficeMapJumpTargets(buildOfficeMapDensityPlan("standard", characters));
    const summaryTargets = buildOfficeMapJumpTargets(buildOfficeMapDensityPlan("summary", characters));

    expect(standardTargets.map((target) => [target.id, target.label, target.targetId, target.enabled])).toEqual([
      ["map", "지도", "office-map-canvas", true],
      ["usability", "사용성", "office-map-usability", true],
      ["recent", "최근 변화", "office-map-recent", true],
      ["inspector", "안전 정보", "office-safe-inspector", true],
    ]);
    expect(summaryTargets.find((target) => target.id === "recent")).toMatchObject({
      label: "최근 변화 접힘",
      targetId: "office-map-recent-collapsed",
      enabled: true,
    });
    expect(summaryTargets.map((target) => `${target.label} ${target.detail} ${target.targetId}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("adapts safe RPG characters into current scene markers without exposing raw data", () => {
    const characters = buildOfficeCharacters(
      officeFixture({
        data_sources: [
          { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
          { id: "cron", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1 },
        ],
        agents: [{ id: "agent-1", model: "raw-model-name must not matter", status: "active", prompt: "raw prompt must not matter" }],
        automations: [{ id: "job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
      }),
      buildOfficeMapNodes(officeFixture()),
    );

    const sceneObjects = buildOfficeCharacterSceneObjects(characters);

    expect(sceneObjects.map((object) => object.kind)).toEqual(expect.arrayContaining(["avatar", "machine"]));
    expect(sceneObjects.find((object) => object.kind === "avatar")?.label).toBe("모델 캐릭터 1");
    expect(sceneObjects.every((object) => object.id.startsWith("character:"))).toBe(true);
    expect(sceneObjects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model-name/i);
  });

  it("builds safe Stage 14-A character tracking cues from visible characters and delta only", () => {
    const characters = [
      {
        id: "model-1",
        role: "model" as const,
        roomId: "sessions" as const,
        label: "raw prompt transcript model-name must not matter",
        status: "active" as const,
        detail: "raw task body script secret must not matter",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 22,
        y: 24,
      },
      {
        id: "worker-1",
        role: "worker" as const,
        roomId: "work" as const,
        label: "작업자 1",
        status: "working" as const,
        detail: "safe detail",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 68,
        y: 24,
      },
      {
        id: "automation-1",
        role: "automation_keeper" as const,
        roomId: "automation" as const,
        label: "자동화 관리인 1",
        status: "scheduled" as const,
        detail: "safe detail",
        redactionNote: "안전 DTO 역할/상태/개수만 반영 · 원문 제외",
        x: 24,
        y: 68,
      },
    ];
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [],
        work: [{ label: "상태 변경", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript must not matter", tone: "warning" as const }],
      recentChanges: [],
    };

    const cues = buildOfficeCharacterTrackingCues(characters, delta);

    expect(cues).toHaveLength(3);
    expect(cues.map((cue) => [cue.characterId, cue.label, cue.tone])).toEqual([
      ["model-1", "변화 감지", "alert"],
      ["worker-1", "변화 감지", "alert"],
      ["automation-1", "자동화 감시", "steady"],
    ]);
    expect(cues[0].style["--office-tracking-x"]).toMatch(/px$/);
    expect(cues[0].style["--office-tracking-delay"]).toMatch(/s$/);
    expect(cues.every((cue) => cue.ariaHidden === true && cue.interactive === false)).toBe(true);
    expect(cues.map((cue) => `${cue.label} ${cue.detail} ${cue.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model-name/i);
  });

  it("builds safe Stage 14-B room activity meters from room counts, characters, and delta", () => {
    const nodes = buildOfficeMapNodes(
      officeFixture({
        agents: Array.from({ length: 5 }, (_, index) => ({ id: `agent-${index}`, prompt: "raw prompt must not matter" })),
        work_items: [{ id: "task-raw", title: "raw task body must not matter", body: "raw body must not matter" }],
        automations: [],
        topics: [],
        provenance: [],
      }),
    );
    const characters = [
      { id: "model-1", role: "model" as const, roomId: "sessions" as const, label: "raw model", status: "active" as const, detail: "raw prompt", redactionNote: "safe", x: 20, y: 20 },
      { id: "worker-1", role: "worker" as const, roomId: "work" as const, label: "작업자", status: "working" as const, detail: "safe", redactionNote: "safe", x: 60, y: 20 },
      { id: "worker-2", role: "worker" as const, roomId: "work" as const, label: "작업자", status: "working" as const, detail: "safe", redactionNote: "safe", x: 64, y: 20 },
    ];
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [{ label: "+1", tone: "positive" as const }], automation: [], routing: [] },
      changedFlows: [{ from: "work" as const, to: "automation" as const, label: "raw transcript must not matter", tone: "positive" as const }],
      recentChanges: [],
    };

    const meters = buildOfficeRoomActivityMeters(nodes, characters, delta);

    expect(meters.map((meter) => [meter.roomId, meter.label, meter.level])).toEqual([
      ["sessions", "분주함", "busy"],
      ["work", "변화 감지", "changed"],
      ["automation", "변화 감지", "changed"],
      ["routing", "조용함", "quiet"],
    ]);
    expect(meters.every((meter) => meter.ariaHidden === true && meter.interactive === false)).toBe(true);
    expect(meters[0].detail).toContain("안전 항목 5개");
    expect(meters.map((meter) => `${meter.label} ${meter.detail} ${meter.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|model/i);
  });

  it("builds safe Stage 14-C pulse timeline from recent safe deltas", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [{ label: "+2", tone: "positive" as const }], work: [], automation: [], routing: [] },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw prompt transcript body script secret must not matter", tone: "warning" as const }],
      recentChanges: [
        { id: "change-1", label: "세션 +2", detail: "raw transcript must not matter", tone: "positive" as const },
        { id: "change-2", label: "자동화 상태", detail: "raw script secret must not matter", tone: "warning" as const },
      ],
    };

    const timeline = buildOfficeSafePulseTimeline(delta);

    expect(timeline.stageLabel).toBe("Stage 14-C 안전 pulse timeline");
    expect(timeline.items.map((item) => [item.kind, item.label, item.tone])).toEqual([
      ["room", "세션 변화", "positive"],
      ["flow", "세션 → 작업", "warning"],
      ["recent", "최근 안전 변화 1", "positive"],
      ["recent", "최근 안전 변화 2", "warning"],
    ]);
    expect(timeline.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(timeline.items.map((item) => `${item.label} ${item.detail} ${item.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret|token|sk-/i);
  });

  it("builds safe Stage 14-D breadcrumb trail from changed flows", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt must not matter", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw task_body script must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-secret", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const trail = buildOfficeSafeBreadcrumbTrail(delta);

    expect(trail.stageLabel).toBe("Stage 14-D 안전 breadcrumb");
    expect(trail.segments.map((segment) => [segment.label, segment.detail, segment.tone])).toEqual([
      ["세션", "출발 방 · 안전 흐름 변화", "positive"],
      ["작업", "경유 방 · 안전 흐름 변화", "warning"],
      ["자동화", "도착 방 · 안전 흐름 변화", "warning"],
    ]);
    expect(trail.segments.every((segment) => segment.ariaHidden === true && segment.interactive === false)).toBe(true);
    expect(trail.segments.map((segment) => `${segment.label} ${segment.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|sk-/i);
  });

  it("builds safe Stage 14-E route compass from safe deltas", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [{ label: "raw model provider", tone: "warning" as const }], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt transcript must not matter", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw script secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const compass = buildOfficeSafeRouteCompass(delta);

    expect(compass.stageLabel).toBe("Stage 14-E 안전 route compass");
    expect(compass.heading).toBe("주의 집중");
    expect(compass.points.map((point) => [point.label, point.detail, point.tone])).toEqual([
      ["방향", "세션 → 자동화", "negative"],
      ["신호", "감소 우선", "negative"],
      ["요약", "안전 변화 4개 · 방 3개", "neutral"],
    ]);
    expect(compass.points.every((point) => point.ariaHidden === true && point.interactive === false)).toBe(true);
    expect(`${compass.heading} ${compass.detail} ${compass.points.map((point) => `${point.label} ${point.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-F focus lane from safe delta density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const lane = buildOfficeSafeFocusLane(delta);

    expect(lane.stageLabel).toBe("Stage 14-F 안전 focus lane");
    expect(lane.items.map((item) => [item.roomId, item.label, item.detail, item.tone, item.weight])).toEqual([
      ["work", "작업", "주의 변화 2개 · 흐름 2개", "negative", 4],
      ["automation", "자동화", "확인 변화 1개 · 흐름 1개", "warning", 2],
      ["sessions", "세션", "정상 변화 1개 · 흐름 1개", "positive", 2],
      ["routing", "라우팅", "대기 변화 0개 · 흐름 0개", "neutral", 0],
    ]);
    expect(lane.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${lane.stageLabel} ${lane.detail} ${lane.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-G attention strip from safe focus density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const strip = buildOfficeSafeAttentionStrip(delta);

    expect(strip.stageLabel).toBe("Stage 14-G 안전 attention strip");
    expect(strip.heading).toBe("주의 방 우선");
    expect(strip.chips.map((chip) => [chip.id, chip.label, chip.detail, chip.tone])).toEqual([
      ["focus", "초점", "작업 · 밀도 4", "negative"],
      ["signal", "신호", "주의 우선", "negative"],
      ["scope", "범위", "방 3개 · 밀도 8", "neutral"],
    ]);
    expect(strip.chips.every((chip) => chip.ariaHidden === true && chip.interactive === false)).toBe(true);
    expect(`${strip.stageLabel} ${strip.heading} ${strip.detail} ${strip.chips.map((chip) => `${chip.label} ${chip.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-H room beacons from safe focus lane density", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const beacons = buildOfficeSafeRoomBeacons(delta);

    expect(beacons.stageLabel).toBe("Stage 14-H 안전 room beacons");
    expect(beacons.beacons.map((beacon) => [beacon.roomId, beacon.label, beacon.detail, beacon.tone, beacon.intensity, beacon.x, beacon.y])).toEqual([
      ["work", "작업 beacon", "주의 · 밀도 4 · 맵 표시", "negative", "high", 70, 30],
      ["automation", "자동화 beacon", "확인 · 밀도 2 · 맵 표시", "warning", "medium", 24, 67],
      ["sessions", "세션 beacon", "정상 · 밀도 2 · 맵 표시", "positive", "medium", 24, 30],
      ["routing", "라우팅 beacon", "대기 · 밀도 0 · 맵 표시", "neutral", "idle", 70, 67],
    ]);
    expect(beacons.beacons.every((beacon) => beacon.ariaHidden === true && beacon.interactive === false)).toBe(true);
    expect(beacons.beacons.map((beacon) => `${beacon.label} ${beacon.detail} ${beacon.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-I flow pulse bands from changed safe flows", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: { sessions: [], work: [], automation: [], routing: [] },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw prompt transcript", tone: "positive" as const },
        { from: "work" as const, to: "automation" as const, label: "raw script secret", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const bands = buildOfficeSafeFlowPulseBands(delta);

    expect(bands.stageLabel).toBe("Stage 14-I 안전 flow pulse bands");
    expect(bands.bands.map((band) => [band.id, band.label, band.detail, band.tone, band.intensity, band.x1, band.y1, band.x2, band.y2])).toEqual([
      ["sessions-to-work", "세션 → 작업 pulse", "정상 · 안전 흐름 1", "positive", "medium", 24, 30, 70, 30],
      ["work-to-automation", "작업 → 자동화 pulse", "확인 · 안전 흐름 2", "warning", "high", 70, 30, 24, 67],
    ]);
    expect(bands.bands.every((band) => band.ariaHidden === true && band.interactive === false)).toBe(true);
    expect(bands.bands.map((band) => `${band.label} ${band.detail} ${band.reducedMotionLabel}`).join(" ")).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-J tactical minimap from safe beacons and flow bands", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const minimap = buildOfficeSafeTacticalMinimap(delta);

    expect(minimap.stageLabel).toBe("Stage 14-J 안전 tactical minimap");
    expect(minimap.summary).toBe("활성 방 3개 · 흐름 2개");
    expect(minimap.cells.map((cell) => [cell.roomId, cell.label, cell.detail, cell.tone, cell.intensity, cell.active])).toEqual([
      ["sessions", "세션", "정상 · 밀도 2", "positive", "medium", true],
      ["work", "작업", "주의 · 밀도 4", "negative", "high", true],
      ["automation", "자동화", "확인 · 밀도 2", "warning", "medium", true],
      ["routing", "라우팅", "대기 · 밀도 0", "neutral", "idle", false],
    ]);
    expect(minimap.cells.every((cell) => cell.ariaHidden === true && cell.interactive === false)).toBe(true);
    expect(`${minimap.summary} ${minimap.cells.map((cell) => `${cell.label} ${cell.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-K tactical ticker from safe minimap and attention signals", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [{ label: "raw script", tone: "warning" as const }],
        routing: [],
      },
      changedFlows: [
        { from: "sessions" as const, to: "work" as const, label: "raw transcript must not matter", tone: "negative" as const },
        { from: "work" as const, to: "automation" as const, label: "raw secret must not matter", tone: "warning" as const },
      ],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const ticker = buildOfficeSafeTacticalTicker(delta);

    expect(ticker.stageLabel).toBe("Stage 14-K 안전 tactical ticker");
    expect(ticker.headline).toBe("주의 방 우선 · 활성 방 3개 · 흐름 2개");
    expect(ticker.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["focus", "초점", "작업 · 밀도 4", "negative"],
      ["map", "전술", "활성 방 3개 · 흐름 2개", "neutral"],
      ["cells", "방", "세션 2 · 작업 4 · 자동화 2", "negative"],
    ]);
    expect(ticker.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${ticker.headline} ${ticker.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-L mission clock from browser-local posture only", () => {
    const clock = buildOfficeSafeMissionClock({
      liveTracking: true,
      isVisible: false,
      consecutiveFailures: 2,
      hasRecentChanges: true,
    });

    expect(clock.stageLabel).toBe("Stage 14-L 안전 mission clock");
    expect(clock.headline).toBe("실시간 · 숨김 탭 · 120초");
    expect(clock.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["mode", "모드", "실시간 추적", "positive"],
      ["cadence", "간격", "120초", "warning"],
      ["safety", "안전", "브라우저 로컬 · 읽기 전용", "neutral"],
      ["pulse", "변화", "최근 변화 있음", "positive"],
    ]);
    expect(clock.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${clock.headline} ${clock.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);

    const manual = buildOfficeSafeMissionClock({ liveTracking: false, isVisible: true, consecutiveFailures: 0, hasRecentChanges: false });
    expect(manual.headline).toBe("수동 · 표시 탭 · 대기");
    expect(manual.items.find((item) => item.id === "cadence")?.detail).toBe("수동 새로고침");
  });

  it("builds safe Stage 14-M command deck from mission clock, tactical ticker, and source health", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2, warning_count: 0, error_summary: "raw provider must not matter" },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1, warning_count: 2, error_summary: "raw token must not matter" },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw model provider", tone: "positive" as const }],
        work: [{ label: "raw prompt", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw transcript", tone: "negative" as const }],
      recentChanges: [{ id: "recent-token", label: "raw token", detail: "sk-sho...leak", tone: "negative" as const }],
    };

    const deck = buildOfficeSafeCommandDeck(state, delta, { liveTracking: false, isVisible: true, consecutiveFailures: 0, hasRecentChanges: true });

    expect(deck.stageLabel).toBe("Stage 14-M 안전 command deck");
    expect(deck.headline).toBe("수동 · 표시 탭 · 대기 · 주의 필요");
    expect(deck.cards.map((card) => [card.id, card.label, card.detail, card.tone])).toEqual([
      ["mission", "작전 시계", "수동 · 표시 탭 · 대기", "neutral"],
      ["tactical", "전술 HUD", "주의 방 우선 · 활성 방 2개 · 흐름 1개", "negative"],
      ["sources", "소스", "정상 1 · 주의 1 · 공백/미연결 3 · 경고 2", "warning"],
      ["safety", "안전", "읽기 전용 · 로컬 표시 · 원문 제외", "neutral"],
    ]);
    expect(deck.cards.every((card) => card.ariaHidden === true && card.interactive === false)).toBe(true);
    expect(`${deck.headline} ${deck.cards.map((card) => `${card.label} ${card.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-N floor legend from safe minimap cells", () => {
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw token", tone: "negative" as const }, { label: "raw transcript", tone: "warning" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw model", tone: "negative" as const }],
      recentChanges: [],
    };

    const legend = buildOfficeSafeFloorLegend(delta);

    expect(legend.stageLabel).toBe("Stage 14-N 안전 floor legend");
    expect(legend.summary).toBe("활성 2 · 대기 2 · 흐름 1");
    expect(legend.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["active", "활성 방", "세션 · 작업", "negative"],
      ["idle", "대기 방", "자동화 · 라우팅", "neutral"],
      ["flow", "흐름", "안전 흐름 1개", "negative"],
      ["safety", "투영", "집계 전용", "neutral"],
    ]);
    expect(legend.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${legend.summary} ${legend.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-O status snapshot from existing safe HUD helpers", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "unavailable", checked_at: "2026-05-08T00:00:00Z", item_count: 0, warning_count: 1 },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw task_body", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "sessions" as const, to: "work" as const, label: "raw provider", tone: "negative" as const }],
      recentChanges: [],
    };

    const snapshot = buildOfficeSafeStatusSnapshot(state, delta, {
      liveTracking: false,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(snapshot.stageLabel).toBe("Stage 14-O 안전 status snapshot");
    expect(snapshot.headline).toBe("소스 주의 · 활성 2 · 대기 2 · 흐름 1");
    expect(snapshot.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["deck", "상태판", "수동 · 표시 탭 · 변화 감지", "warning"],
      ["floor", "바닥", "활성 2 · 대기 2 · 흐름 1", "negative"],
      ["source", "소스", "2개 중 1개 사용 가능", "warning"],
      ["guard", "가드", "읽기 전용 · 원문 제외", "neutral"],
    ]);
    expect(snapshot.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${snapshot.headline} ${snapshot.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-P scan index from status snapshot and safe rail count", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1, warning_count: 1 },
      ],
    });
    const delta = {
      hasChanges: true,
      nodeBadges: {
        sessions: [{ label: "raw prompt", tone: "positive" as const }],
        work: [{ label: "raw token", tone: "negative" as const }],
        automation: [],
        routing: [],
      },
      changedFlows: [{ from: "work" as const, to: "automation" as const, label: "raw provider", tone: "warning" as const }],
      recentChanges: [],
    };

    const index = buildOfficeSafeScanIndex(state, delta, {
      liveTracking: true,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(index.stageLabel).toBe("Stage 14-P 안전 scan index");
    expect(index.headline).toBe("스캔 4칸 · snapshot 기준");
    expect(index.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["snapshot", "스냅샷", "상태 snapshot 참조", "negative"],
      ["rail", "레일", "4개 안전 칸", "negative"],
      ["mode", "모드", "실시간 · 표시 탭", "positive"],
    ]);
    expect(index.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${index.headline} ${index.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 14-Q HUD readability plan from browser-local layout signals", () => {
    const plan = buildOfficeSafeHudReadabilityPlan({
      viewportWidth: 1120,
      prefersReducedMotion: true,
      safePanelCount: 6,
      liveTracking: true,
    });

    expect(plan.stageLabel).toBe("Stage 14-Q 안전 HUD readability");
    expect(plan.summary).toBe("넓은 HUD · 정적 모션 · 6개 패널");
    expect(plan.items.map((item) => [item.id, item.label, item.detail, item.tone])).toEqual([
      ["layout", "배치", "넓은 HUD", "positive"],
      ["motion", "모션", "정적 모션", "neutral"],
      ["density", "밀도", "6개 패널", "warning"],
      ["tracking", "추적", "실시간", "positive"],
    ]);
    expect(plan.items.every((item) => item.ariaHidden === true && item.interactive === false)).toBe(true);
    expect(`${plan.summary} ${plan.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 15-A HUD hierarchy from existing safe panels", () => {
    const hierarchy = buildOfficeSafeHudHierarchy({
      statusTone: "warning",
      scanTone: "neutral",
      readabilityTone: "warning",
      statusItemCount: 4,
      scanItemCount: 3,
      readabilityItemCount: 4,
    });

    expect(hierarchy.stageLabel).toBe("Stage 15-A 안전 HUD hierarchy");
    expect(hierarchy.headline).toBe("먼저 볼 순서 정리");
    expect(hierarchy.summary).toBe("핵심 4개 · 보조 3개 · 진단 4개");
    expect(hierarchy.sections.map((section) => [section.id, section.label, section.detail, section.tone])).toEqual([
      ["primary", "핵심", "상태 snapshot 먼저", "warning"],
      ["secondary", "보조", "scan index로 범위 확인", "neutral"],
      ["diagnostic", "진단", "HUD readability로 밀도 확인", "warning"],
    ]);
    expect(hierarchy.sections.every((section) => section.ariaHidden === true && section.interactive === false)).toBe(true);
    expect(`${hierarchy.headline} ${hierarchy.summary} ${hierarchy.sections.map((section) => `${section.label} ${section.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("reduces duplicate Stage 15-B scan copy while preserving safe ownership", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1, warning_count: 1 },
      ],
    });
    const delta = buildOfficeStateDelta(null, state);
    const index = buildOfficeSafeScanIndex(state, delta, {
      liveTracking: true,
      isVisible: true,
      consecutiveFailures: 0,
      hasRecentChanges: true,
    });

    expect(index.headline).toBe("스캔 4칸 · snapshot 기준");
    expect(index.items.find((item) => item.id === "snapshot")?.detail).toBe("상태 snapshot 참조");
    expect(index.items.find((item) => item.id === "rail")?.detail).toBe("4개 안전 칸");
    expect(index.headline).not.toContain("활성");
    expect(index.headline).not.toContain("흐름");
    expect(`${index.headline} ${index.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds safe Stage 16-A AI Office-first layout plan", () => {
    const layout = buildOfficeFirstLayoutPlan({
      visibleCharacterCount: 12,
      diagnosticPanelCount: 11,
      hasSelectedCharacter: false,
    });

    expect(layout.stageLabel).toBe("Stage 16-A AI Office-first reset");
    expect(layout.heading).toBe("AI Office 먼저 보기");
    expect(layout.primarySurface).toBe("scene");
    expect(layout.diagnosticsMode).toBe("secondary-collapsed");
    expect(layout.sections.map((section) => [section.id, section.label, section.priority])).toEqual([
      ["scene", "오피스 현장", 1],
      ["inspector", "선택 정보", 2],
      ["timeline", "최근 변화", 3],
      ["diagnostics", "진단 HUD", 4],
    ]);
    expect(layout.summary).toBe("캐릭터 12개 · 진단 11개는 보조로 정리");
    expect(layout.sections.every((section) => section.detail.length > 0)).toBe(true);
    expect(`${layout.heading} ${layout.summary} ${layout.sections.map((section) => section.detail).join(" ")}`).not.toMatch(/raw|prompt|transcript|task_body|script|secret|token|provider|model|sk-/i);
  });

  it("builds Korean empty-source copy without exposing raw adapter data", () => {
    const plan = buildOfficeEmptySourceCopyPlan(
      officeFixture({
        data_sources: [],
        agents: [{ id: "agent-raw", prompt: "raw prompt must not matter", token: "sk-test-must-not-matter" }],
        work_items: [{ id: "task-raw", body: "raw task body must not matter" }],
      }),
    );

    expect(plan.title).toBe("아직 연결된 소스가 없습니다");
    expect(plan.detail).toContain("대시보드 오류가 아니라 안전 DTO가 비어 있는 상태");
    expect(plan.items.map((item) => item.label)).toEqual(["연결 상태", "읽기 범위", "다음 확인"]);
    expect(plan.items.map((item) => item.detail).join(" ")).toContain("미보고 소스 5개");
    expect(plan.items.map((item) => item.detail).join(" ")).toContain("읽기 전용");
    expect(`${plan.title} ${plan.detail} ${plan.items.map((item) => `${item.label} ${item.detail}`).join(" ")}`).not.toMatch(/raw|prompt|task_body|body|script|secret|token|sk-/i);
  });

  it("summarizes source health and empty fixture hints without leaking raw adapter errors", () => {
    const state = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-09T00:00:00Z", item_count: 2, warning_count: 0 },
        { id: "kanban", status: "partial", checked_at: "2026-05-09T00:00:00Z", item_count: 1, warning_count: 2, error_summary: "raw stack trace must not matter" },
        { id: "cron", status: "error", checked_at: "2026-05-09T00:00:00Z", item_count: 0, warning_count: 1, error_summary: "raw token must not matter" },
        { id: "topics", status: "unavailable", checked_at: "2026-05-09T00:00:00Z", item_count: 0, warning_count: 0 },
      ],
    });

    const summary = buildOfficeSourceHealthSummary(state);
    const hints = buildOfficeEmptyStateHints();

    expect(summary.counts).toEqual({ ok: 1, partial: 1, missing: 1, unavailable: 1, error: 1 });
    expect(summary.totalWarningCount).toBe(3);
    expect(summary.label).toBe("주의 필요");
    expect(summary.detail).toBe("정상 1 · 주의 2 · 공백/미연결 2 · 경고 3");
    expect(summary.missingSourceIds).toEqual(["provenance"]);
    expect(hints).toMatchObject({
      rooms: "방 투영이 없습니다. 외부 작업이 비었다는 뜻은 아니며, 연결된 안전 DTO만 기준으로 표시합니다.",
      agents: "세션 어댑터가 안전 메타데이터를 제공하지 않았습니다. 제목/미리보기 원문은 계속 숨깁니다.",
      automations: "cron 스타일 작업이 보고되지 않았습니다. 실행/일시정지 제어는 제공하지 않습니다.",
    });
    expect(`${summary.label} ${summary.detail} ${summary.missingSourceIds.join(" ")} ${Object.values(hints).join(" ")}`).not.toMatch(/raw|stack|token|prompt|transcript|body|script|secret/i);
  });

  it("keeps the empty office map resilient and explicit about source gaps", () => {
    const state = officeFixture();
    const nodes = buildOfficeMapNodes(state);
    const flows = buildOfficeMapFlows(nodes);
    const objects = buildOfficeSceneObjects(state, nodes);

    expect(nodes).toHaveLength(4);
    expect(nodes.map((node) => [node.id, node.count, node.health])).toEqual([
      ["sessions", 0, "missing"],
      ["work", 0, "missing"],
      ["automation", 0, "missing"],
      ["routing", 0, "missing"],
    ]);
    expect(flows.map((flow) => flow.health)).toEqual(["missing", "missing", "missing"]);
    expect(objects).toContainEqual(expect.objectContaining({ id: "routing-empty", label: "미연결 보관함", kind: "mail" }));
    expect(objects.map((object) => `${object.label} ${object.detail}`).join(" ")).not.toMatch(/raw|prompt|transcript|body|script|secret/i);
  });

  it("builds safe browser-local office state deltas for room counts, health, and attention", () => {
    const previous = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "error", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:00:00Z", item_count: 0 },
      ],
      agents: [{ id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" }],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 3 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:01:00Z", item_count: 0 },
        { id: "cron", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 2 },
        { id: "topics", status: "missing", checked_at: "2026-05-08T00:01:00Z", item_count: 0 },
      ],
      agents: Array.from({ length: 3 }, (_, index) => ({ id: `session-${index}`, source_platform: "cli", status: "active", prompt: "raw prompt must not matter" })),
      work_items: [{ id: "task-1", title: "Safe task", status: "blocked", body: "raw task body must not matter" }],
      automations: [
        { id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
        { id: "job-2", name: "Cron job job-2", state: "scheduled", last_status: "ok", script: "raw script must not matter" },
      ],
    });

    const delta = buildOfficeStateDelta(previous, next);

    expect(delta.nodeBadges).toMatchObject({
      sessions: [{ label: "+2", tone: "positive" }],
      work: [{ label: "상태 변경", tone: "warning" }],
      automation: [{ label: "+1", tone: "positive" }, { label: "상태 변경", tone: "positive" }],
      routing: [],
    });
    expect(delta.recentChanges.map((change) => change.label)).toEqual([
      "세션 +2",
      "작업 상태 정상 → 부분 연결",
      "자동화 +1",
      "자동화 상태 오류 → 정상",
      "흐름 세션에서 작업으로 변경",
      "흐름 작업에서 자동화로 변경",
      "흐름 자동화에서 라우팅으로 변경",
      "확인 필요 1 → 2",
    ]);
    expect(delta.recentChanges.map((change) => change.detail).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("builds flow-level change hints from safe endpoint count and health deltas", () => {
    const previous = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "kanban", status: "ok", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
        { id: "cron", status: "partial", checked_at: "2026-05-08T00:00:00Z", item_count: 1 },
      ],
      agents: [{ id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" }],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      data_sources: [
        { id: "sessions", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 2 },
        { id: "kanban", status: "partial", checked_at: "2026-05-08T00:01:00Z", item_count: 1 },
        { id: "cron", status: "ok", checked_at: "2026-05-08T00:01:00Z", item_count: 1 },
      ],
      agents: [
        { id: "session-1", source_platform: "cli", status: "active", prompt: "raw prompt must not matter" },
        { id: "session-2", source_platform: "telegram", status: "idle", prompt: "raw prompt must not matter" },
      ],
      work_items: [{ id: "task-1", title: "Safe task", status: "open", body: "raw task body must not matter" }],
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", last_status: "ok", script: "raw script must not matter" }],
    });

    const delta = buildOfficeStateDelta(previous, next);

    expect(delta.changedFlows).toEqual([
      { from: "sessions", to: "work", label: "세션에서 작업으로", tone: "warning" },
      { from: "work", to: "automation", label: "작업에서 자동화로", tone: "neutral" },
      { from: "automation", to: "routing", label: "자동화에서 라우팅으로", tone: "positive" },
    ]);
    expect(delta.recentChanges.map((change) => change.label)).toContain("흐름 세션에서 작업으로 변경");
    expect(delta.recentChanges.map((change) => change.detail).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("builds safe automation next-run timing buckets without exposing cron bodies", () => {
    const summary = buildOfficeAutomationTimingSummary(
      officeFixture({
        automations: [
          { id: "overdue", next_run_at: "2026-05-08T23:55:00Z", prompt: "raw prompt must not matter" },
          { id: "soon", next_run_at: "2026-05-09T00:10:00Z", script: "raw script must not matter" },
          { id: "hour", next_run_at: "2026-05-09T00:45:00Z", body: "raw body must not matter" },
          { id: "today", next_run_at: "2026-05-09T12:00:00Z", secret: "raw secret must not matter" },
          { id: "later", next_run_at: "2026-05-10T00:05:00Z" },
          { id: "unknown", next_run_at: "not-a-date" },
        ],
      }),
      "2026-05-09T00:00:00Z",
    );

    expect(summary.counts).toEqual({ overdue: 1, under15m: 1, under1h: 1, today: 1, later: 1, unknown: 1 });
    expect(summary.primaryBucket).toEqual({ id: "overdue", label: "기한 지남", tone: "warning" });
    expect(`${summary.primaryBucket.label} ${Object.keys(summary.counts).join(" ")}`).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("adds safe automation next-run bucket deltas to the recent rail", () => {
    const previous = officeFixture({
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T12:00:00Z", script: "raw script must not matter" }],
    });
    const next = officeFixture({
      automations: [{ id: "job-1", name: "Cron job job-1", state: "scheduled", next_run_at: "2026-05-09T00:45:00Z", prompt: "raw prompt must not matter" }],
    });

    const delta = buildOfficeStateDelta(previous, next, { now: "2026-05-09T00:00:00Z" });

    expect(delta.nodeBadges.automation).toContainEqual({ label: "일정 변경", tone: "warning" });
    expect(delta.recentChanges).toContainEqual({
      id: "automation:next-run-bucket:today->under1h",
      label: "자동화 다음 실행 오늘 → <1h",
      detail: "next_run_at 시간대만 비교 · 프롬프트/스크립트 제외",
      tone: "warning",
    });
    expect(delta.recentChanges.map((change) => `${change.label} ${change.detail}`).join(" ")).not.toMatch(/raw|prompt|body|script|secret/i);
  });

  it("resolves local live tracking interval from tab visibility and consecutive failures", () => {
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 0 })).toBe(30_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: false, consecutiveFailures: 0 })).toBe(60_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 1 })).toBe(60_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: true, consecutiveFailures: 2 })).toBe(120_000);
    expect(resolveOfficeLiveTrackingInterval({ isVisible: false, consecutiveFailures: 2 })).toBe(120_000);
  });

  it("collapses duplicate browser-memory recent changes before applying the ring-buffer limit", () => {
    const current = [
      { id: "sessions:count:1->2", label: "세션 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
      { id: "work:health:ok->partial", label: "작업 상태 정상 → 부분 연결", detail: "상태만 비교", tone: "warning" as const },
    ];
    const incoming = [
      { id: "sessions:count:1->2", label: "세션 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
      { id: "automation:count:1->2", label: "자동화 +1", detail: "안전 개수 1 → 2", tone: "positive" as const },
    ];

    expect(mergeOfficeRecentChanges(incoming, current, 2).map((change) => change.id)).toEqual([
      "sessions:count:1->2",
      "automation:count:1->2",
    ]);
  });

  it("returns no dynamic badges or rail entries for the first snapshot", () => {
    const delta = buildOfficeStateDelta(null, officeFixture());

    expect(delta.hasChanges).toBe(false);
    expect(delta.recentChanges).toEqual([]);
    expect(delta.nodeBadges).toEqual({ sessions: [], work: [], automation: [], routing: [] });
    expect(delta.changedFlows).toEqual([]);
  });

});
