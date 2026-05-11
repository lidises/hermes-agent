import { describe, expect, it } from "vitest";
import { buildSidebarNavGroups, type NavItem } from "./appNav";

const icon = () => null;

function item(path: string, label: string): NavItem {
  return { path, label, icon };
}

describe("buildSidebarNavGroups", () => {
  it("keeps sessions and office visible while folding secondary dashboard menus", () => {
    const groups = buildSidebarNavGroups([
      item("/sessions", "Sessions"),
      item("/office", "Office"),
      item("/analytics", "Analytics"),
      item("/models", "Models"),
      item("/logs", "Logs"),
      item("/cron", "Cron"),
      item("/skills", "Skills"),
      item("/plugins", "Plugins"),
      item("/profiles", "Profiles"),
      item("/config", "Config"),
      item("/env", "Keys"),
      item("/docs", "Docs"),
    ]);

    expect(groups.map((group) => group.id)).toEqual([
      "primary",
      "operations",
      "library",
      "settings",
    ]);
    expect(groups[0].collapsible).toBe(false);
    expect(groups[0].items.map((navItem) => navItem.path)).toEqual([
      "/sessions",
      "/office",
    ]);
    expect(groups.slice(1).every((group) => group.collapsible)).toBe(true);
    expect(groups.find((group) => group.id === "operations")?.items.map((navItem) => navItem.path)).toEqual([
      "/analytics",
      "/models",
      "/logs",
      "/cron",
    ]);
    expect(groups.find((group) => group.id === "settings")?.items.map((navItem) => navItem.path)).toEqual([
      "/config",
      "/env",
      "/docs",
    ]);
  });

  it("preserves unknown built-in entries in a final folded group", () => {
    const groups = buildSidebarNavGroups([
      item("/sessions", "Sessions"),
      item("/office", "Office"),
      item("/paperclip", "Paperclip"),
    ]);

    expect(groups.map((group) => group.id)).toEqual(["primary", "other"]);
    expect(groups.find((group) => group.id === "other")?.collapsible).toBe(true);
    expect(groups.find((group) => group.id === "other")?.items.map((navItem) => navItem.path)).toEqual([
      "/paperclip",
    ]);
  });
});
