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
import { buildOfficeDeskRpgProjectionModel, buildOfficeRpgScene } from "./officeView";
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
        api_key: "sk-test-inspector-1234567890",
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
    expect(markup).not.toMatch(/raw inspector prompt|raw inspector task title|Traceback|\/Users\/lidises|sk-test-inspector|private-inspector-provider/i);
  });
});
