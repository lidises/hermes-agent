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

import { OfficeRpgMap } from "./OfficePage";
import { buildOfficeRpgScene } from "./officeView";
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
