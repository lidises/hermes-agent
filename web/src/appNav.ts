import type { ComponentType } from "react";

export interface NavItem {
  icon: ComponentType<{ className?: string }>;
  label: string;
  labelKey?: string;
  path: string;
}

type SidebarNavGroupId = "primary" | "operations" | "library" | "settings" | "other";

export interface SidebarNavGroup {
  collapsible: boolean;
  id: SidebarNavGroupId;
  items: NavItem[];
}

const SIDEBAR_NAV_GROUP_PATHS: Record<SidebarNavGroupId, string[]> = {
  primary: ["/chat", "/sessions", "/office"],
  operations: ["/analytics", "/models", "/logs", "/cron"],
  library: ["/skills", "/plugins", "/profiles"],
  settings: ["/config", "/env", "/docs"],
  other: [],
};

export function buildSidebarNavGroups(items: NavItem[]): SidebarNavGroup[] {
  const used = new Set<string>();
  const byPath = new Map(items.map((item) => [item.path, item]));

  const groups = (["primary", "operations", "library", "settings"] as SidebarNavGroupId[]).map(
    (id) => {
      const groupItems = SIDEBAR_NAV_GROUP_PATHS[id]
        .map((path) => byPath.get(path))
        .filter((item): item is NavItem => Boolean(item));
      groupItems.forEach((item) => used.add(item.path));
      return {
        id,
        collapsible: id !== "primary",
        items: groupItems,
      } satisfies SidebarNavGroup;
    },
  );

  const otherItems = items.filter((item) => !used.has(item.path));
  if (otherItems.length > 0) {
    groups.push({ id: "other", collapsible: true, items: otherItems });
  }

  return groups.filter((group) => group.items.length > 0);
}
