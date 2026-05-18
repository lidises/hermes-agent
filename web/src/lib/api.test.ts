import { afterEach, describe, expect, it, vi } from "vitest";

import { api, fetchJSON } from "./api";

describe("fetchJSON", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(globalThis, "window");
  });

  it("does not surface raw response bodies with paths, tokens, or stack traces in thrown errors", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      text: async () => "Traceback raw /Users/lidises/nas token=secret sk-office-sentinel",
    } as Response);

    await expect(fetchJSON("/api/office/state")).rejects.toThrow("500: request failed");
    await expect(fetchJSON("/api/office/state")).rejects.not.toThrow(/Traceback|\/Users\/lidises|token=secret|sk-office/i);
    expect(fetchMock).toHaveBeenCalledWith("/api/office/state", expect.objectContaining({ headers: expect.any(Headers) }));
  });

  it("turns rejected network failures into a constant safe error", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const rawHomePath = ["", "home", "hermes", ".env"].join("/");
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error(`ECONNRESET raw ${rawHomePath} token=secret`));

    await expect(fetchJSON("/api/office/events")).rejects.toThrow("Network request failed");
    await expect(fetchJSON("/api/office/events")).rejects.not.toThrow(/\/home\/hermes|token=secret|ECONNRESET/i);
  });
  it("posts safe NAS single-file write payload through the protected route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        written: true,
        errors: [],
        dto: {
          mode: "nas_single_file_write_completed",
          write_ref: "write_office_ui_demo",
          safe_logical_path: "vault_personal_wiki_demo::ai-office-ui-smoke.md",
          safe_display_path: "vault_personal_wiki_demo / ai-office-ui-smoke.md",
          bytes_written: 42,
          rollback_created: false,
          rollback_ref: null,
          capabilities: { nas_write_enabled: true },
        },
      }),
    } as Response);

    const payload = {
      write_ref: "write_office_ui_demo",
      package_ref: "pkg_office_ui_demo",
      target_vault_ref: "vault_personal_wiki_demo",
      safe_slug: "ai-office-ui-smoke",
      safe_title: "AI Office UI smoke",
      markdown_body: "# AI Office UI smoke\n",
      requested_by: "agent_nas_keeper",
      requested_at: "2026-05-17T13:30:00Z",
    };

    const result = await api.executeOfficeControlledMutationNasSingleFileWrite(payload);

    expect(result.written).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/single-file-write",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: JSON.stringify(payload) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toMatch(/\/Users\/|\/home\/|token=|sk-/i);
  });

  it("reads safe NAS Keeper handoff queue summaries through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        listed: true,
        errors: [],
        dto: {
          schema_version: 1,
          mode: "nas_keeper_mac_relay_handoff_queue_readback",
          listed: true,
          queue_storage_ref: "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue",
          filters: { queue_status: "manual_review_required" },
          effective_limit: 2,
          available_count: 1,
          count: 1,
          skipped_count: 3,
          items: [{ handoff_ref: "handoff_ui_demo", queue_status: "manual_review_required", safe_title: "Safe title", markdown_body_included: false }],
          markdown_body_included: false,
          capabilities: { queue_read_enabled: true, queue_mutation_enabled: false, mac_relay_write_enabled: false },
          next_required_boundary: "manual_nas_keeper_execution_evidence_review_if_needed",
        },
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationNasKeeperHandoffQueue({ queue_status: "manual_review_required", limit: 2 });

    expect(result.listed).toBe(true);
    expect(result.dto?.count).toBe(1);
    expect(result.dto?.markdown_body_included).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue?queue_status=manual_review_required&limit=2",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body/i);
  });

  it("posts safe NAS Keeper Mac relay write payload through the protected execution route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        executed: true,
        written: true,
        errors: [],
        dto: {
          mode: "nas_keeper_mac_relay_write_completed",
          relay_request_ref: "relay_req_office_ui_demo",
          relay_execution_ref: "relay_exec_office_ui_demo",
          write_ref: "write_office_ui_demo",
          safe_logical_path: "Hermes::ai-office-ui-smoke.md",
          safe_display_path: "Hermes / ai-office-ui-smoke.md",
          bytes_written: 42,
          readback_verified: true,
          readback_sha256: "0".repeat(64),
          readback_first_line: "# AI Office UI smoke",
          rollback_created: false,
          rollback_ref: null,
          audit_written: true,
          audit_ref: "audit_ref",
          capabilities: { mac_relay_nas_write_enabled: true },
        },
      }),
    } as Response);

    const payload = {
      relay_request_ref: "relay_req_office_ui_demo",
      relay_execution_ref: "relay_exec_office_ui_demo",
      write_ref: "write_office_ui_demo",
      package_ref: "pkg_office_ui_demo",
      target_vault_ref: "Hermes",
      safe_slug: "ai-office-ui-smoke",
      safe_title: "AI Office UI smoke",
      markdown_body: "# AI Office UI smoke\n",
      requested_by: "agent_nas_keeper",
      requested_at: "2026-05-17T13:30:00Z",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      relay_authorized_by: "agent_nas_keeper",
      relay_authorized_at: "2026-05-17T13:31:00Z",
    };

    const result = await api.executeOfficeControlledMutationNasMacRelayWrite(payload);

    expect(result.executed).toBe(true);
    expect(result.written).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: JSON.stringify(payload) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toMatch(/\/Users\/|\/home\/|token=|sk-/i);
  });

  it("posts safe NAS Keeper execution-from-preview payload through the protected Mac relay bridge", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        executed: false,
        written: false,
        errors: [{ field: "mac_relay_root", code: "mac_relay_root_not_configured" }],
        dto: null,
      }),
    } as Response);

    const payload = {
      handoff_ref: "handoff_ui_demo",
      relay_execution_ref: "relay_exec_ui_demo",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      relay_authorized_by: "agent_nas_keeper",
      relay_authorized_at: "2026-05-18T04:10:00Z",
    };

    const result = await api.executeOfficeControlledMutationNasKeeperExecutionFromPreview(payload);

    expect(result.executed).toBe(false);
    expect(result.errors[0]?.code).toBe("mac_relay_root_not_configured");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: JSON.stringify(payload) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toMatch(/markdown_body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("posts safe NAS Keeper execution-state record payload through the protected queue mutation route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        recorded: true,
        errors: [],
        dto: {
          schema_version: 1,
          mode: "nas_keeper_mac_relay_execution_state_recorded",
          recorded: true,
          handoff_ref: "handoff_ui_demo",
          execution_record_ref: "exec_record_ui_demo",
          relay_execution_ref: "relay_exec_ui_demo",
          queue_ref: "queue_handoff_ui_demo",
          queue_status_before: "authorized_for_mac_relay_execution",
          queue_status_after: "mac_relay_execution_succeeded",
          execution_status: "succeeded",
          execution_safe_summary: "safe execution result recorded",
          execution_evidence_refs: ["evidence_ui_demo"],
          markdown_body_included: false,
          capabilities: { queue_mutation_enabled: true, direct_vps_nas_write_enabled: false },
          next_required_boundary: "none_terminal_execution_state_recorded",
        },
      }),
    } as Response);

    const payload = {
      handoff_ref: "handoff_ui_demo",
      execution_record_ref: "exec_record_ui_demo",
      relay_execution_ref: "relay_exec_ui_demo",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T04:12:00Z",
      execution_status: "succeeded" as const,
      safe_summary: "safe execution result recorded",
      evidence_refs: ["evidence_ui_demo"],
    };

    const result = await api.recordOfficeControlledMutationNasKeeperExecutionState(payload);

    expect(result.recorded).toBe(true);
    expect(result.dto?.markdown_body_included).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-state",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: JSON.stringify(payload) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(headers.get("Content-Type")).toBe("application/json");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).not.toMatch(/markdown_body|\/Users\/|\/home\/|token=|sk-|provider|Traceback/i);
  });
});
