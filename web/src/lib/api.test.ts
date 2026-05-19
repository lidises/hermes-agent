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

  it("reads safe authority metadata handoff status through the protected readback route", async () => {
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
        schema_version: 1,
        mode: "authority_metadata_handoff_status",
        request_id: "req_20260518_1801_handoff",
        correlation_id: "corr_20260518_1801_handoff",
        checkpoint_complete: true,
        chain_counts: { requests: 1, decisions: 1, dry_run_results: 1, audit_events: 1, authority_registry: 1 },
        latest_refs: { authority_registry: "adapter_20260518_handoff" },
        next_manual_lane: "manual_status_note_authority_handoff",
        capabilities: { status_note_lane_enabled: true, adapter_dispatch_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationAuthorityMetadataHandoff({ request_id: "req_20260518_1801_handoff", limit: 2 });

    expect(result.checkpoint_complete).toBe(true);
    expect(result.chain_counts.requests).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/authority-metadata-handoff?request_id=req_20260518_1801_handoff&limit=2",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body/i);
  });

  it("reads the dispatcher authority dry-run surface through the protected display route", async () => {
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
        schema_version: 1,
        mode: "dispatcher_authority_dry_run_surface",
        request_id: "req_20260518_dispatcher_dryrun",
        dry_run_plan: { ready: true, would_dispatch: false, would_bind_authority_adapter: false, would_mutate_target: false, steps: [] },
        capabilities: { dry_run_design_surface_enabled: true, adapter_dispatch_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationDispatcherAuthorityDryRun({ request_id: "req_20260518_dispatcher_dryrun", authority_ref: "authority_20260518_status_note" });

    expect(result.mode).toBe("dispatcher_authority_dry_run_surface");
    expect(result.dry_run_plan.would_dispatch).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/dispatcher-authority-dry-run?request_id=req_20260518_dispatcher_dryrun&authority_ref=authority_20260518_status_note",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body|provider/i);
  });

  it("reads dispatcher authority metadata recording draft through a protected GET route", async () => {
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
        schema_version: 1,
        mode: "dispatcher_authority_metadata_recording_draft",
        ready: true,
        request_id: "req_20260518_dispatcher_dryrun",
        dry_run_result_payload: { result_id: "dryrun_20260518_dispatcher_metadata" },
        audit_payload: { audit_id: "audit_20260518_dispatcher_metadata", event_kind: "dry_run_result_recorded" },
        capabilities: { metadata_recording_draft_enabled: true, dry_run_result_storage_enabled: false, audit_write_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationDispatcherAuthorityMetadataRecordingDraft({
      request_id: "req_20260518_dispatcher_dryrun",
      correlation_id: "corr_20260518_dispatcher_dryrun",
      authority_ref: "authority_20260518_status_note",
      result_id: "dryrun_20260518_dispatcher_metadata",
      audit_id: "audit_20260518_dispatcher_metadata",
      recorded_at: "2026-05-18T11:45:00Z",
    });

    expect(result.mode).toBe("dispatcher_authority_metadata_recording_draft");
    expect(result.ready).toBe(true);
    expect(result.capabilities.dry_run_result_storage_enabled).toBe(false);
    expect(result.capabilities.audit_write_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/dispatcher-authority-metadata-recording-draft?request_id=req_20260518_dispatcher_dryrun&correlation_id=corr_20260518_dispatcher_dryrun&authority_ref=authority_20260518_status_note&result_id=dryrun_20260518_dispatcher_metadata&audit_id=audit_20260518_dispatcher_metadata&recorded_at=2026-05-18T11%3A45%3A00Z",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body|provider/i);
  });

  it("reads dispatcher authority metadata append status through a protected GET route", async () => {
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
        schema_version: 1,
        mode: "dispatcher_authority_metadata_append_status",
        request_id: "req_20260518_1218_dispatcher_metadata_append",
        correlation_id: "corr_20260518_1218_dispatcher_metadata_append",
        append_checkpoint_complete: true,
        append_counts: { dry_run_results: 1, audit_events: 1 },
        latest_refs: {
          dry_run_result: "dryrun_20260518_1218_dispatcher_metadata_append",
          audit: "audit_20260518_1218_dispatcher_metadata_append",
        },
        next_manual_lane: "human_reviewed_dispatcher_execution_simulation_boundary",
        capabilities: { metadata_append_readback_enabled: true, dry_run_execution_enabled: false, target_mutation_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationDispatcherAuthorityMetadataAppendStatus({
      request_id: "req_20260518_1218_dispatcher_metadata_append",
      correlation_id: "corr_20260518_1218_dispatcher_metadata_append",
      limit: 5,
    });

    expect(result.mode).toBe("dispatcher_authority_metadata_append_status");
    expect(result.append_checkpoint_complete).toBe(true);
    expect(result.append_counts.audit_events).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/dispatcher-authority-metadata-append-status?request_id=req_20260518_1218_dispatcher_metadata_append&correlation_id=corr_20260518_1218_dispatcher_metadata_append&limit=5",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body|provider/i);
  });

  it("gets the human-reviewed dispatcher execution simulation status without request body", async () => {
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
        schema_version: 1,
        mode: "dispatcher_execution_simulation_status",
        request_id: "req_20260518_1255_dispatcher_execution_simulation",
        correlation_id: "corr_20260518_1255_dispatcher_execution_simulation",
        simulation_checkpoint_complete: true,
        simulation_counts: { dry_run_results: 1, audit_events: 1 },
        latest_refs: {
          dry_run_result: "dryrun_20260518_1255_dispatcher_execution_simulation",
          audit: "audit_20260518_1255_dispatcher_execution_simulation",
        },
        checkpoint_status: "blocked",
        next_manual_lane: "dispatcher_execution_readback_review_only",
        capabilities: { simulation_status_readback_enabled: true, dry_run_execution_enabled: false, target_mutation_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationDispatcherExecutionSimulationStatus({ limit: 5 });

    expect(result.mode).toBe("dispatcher_execution_simulation_status");
    expect(result.simulation_checkpoint_complete).toBe(true);
    expect(result.simulation_counts.audit_events).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/dispatcher-execution-simulation-status?limit=5",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body|provider/i);
  });

  it("gets the dispatcher completion review status without request body", async () => {
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
        schema_version: 1,
        mode: "dispatcher_completion_review_status",
        request_id: "req_20260518_1255_dispatcher_execution_simulation",
        correlation_id: "corr_20260518_1255_dispatcher_execution_simulation",
        completion_review_complete: true,
        execution_checkpoint_status: "blocked",
        review_counts: { dry_run_results: 1, audit_events: 1 },
        latest_refs: {
          dry_run_result: "dryrun_20260518_1255_dispatcher_execution_simulation",
          audit: "audit_20260518_1255_dispatcher_execution_simulation",
        },
        completed_lanes: ["dispatcher_authority_dry_run_surface", "dispatcher_execution_simulation_status"],
        next_manual_lane: "authority_handoff_completion_review_only",
        capabilities: { completion_review_readback_enabled: true, dry_run_execution_enabled: false, adapter_dispatch_enabled: false, target_mutation_enabled: false },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationDispatcherCompletionReviewStatus({ limit: 5 });

    expect(result.mode).toBe("dispatcher_completion_review_status");
    expect(result.completion_review_complete).toBe(true);
    expect(result.review_counts.audit_events).toBe(1);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/dispatcher-completion-review-status?limit=5",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|raw markdown body|provider/i);
  });

  it("gets target dispatch contract status through the protected readback route", async () => {
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
        schema_version: 1,
        mode: "target_dispatch_contract_status",
        target_dispatch_contract_complete: true,
        source_completion_review_lane: "dispatcher_completion_review_status",
        next_manual_lane: "target_dispatch_runtime_approval_required",
        dispatch_options: ["kanban_comment", "status_note", "read_only_projection"],
        required_dispatch_fields: ["dispatch_ref", "target_ref"],
        allowed_operation_kinds: ["comment", "status_note", "read_only_projection"],
        forbidden_boundaries: ["adapter_dispatch", "target_mutation"],
        capabilities: { target_dispatch_contract_readback_enabled: true, adapter_dispatch_enabled: false, target_mutation_enabled: false },
        redaction: { raw_excluded: true },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationTargetDispatchContractStatus();

    expect(result.mode).toBe("target_dispatch_contract_status");
    expect(result.target_dispatch_contract_complete).toBe(true);
    expect(result.capabilities.adapter_dispatch_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/target-dispatch-contract-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets watcher cron contract status through the protected readback route", async () => {
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
        schema_version: 1,
        mode: "watcher_cron_contract_status",
        watcher_cron_contract_complete: true,
        source_target_dispatch_lane: "target_dispatch_contract_status",
        next_manual_lane: "watcher_cron_runtime_approval_required",
        scheduler_options: ["manual_poll", "operator_trigger", "disabled_cron_draft"],
        required_scheduler_fields: ["schedule_ref", "dispatch_contract_ref"],
        forbidden_boundaries: ["watcher_daemon", "cron_job_activation"],
        capabilities: { watcher_cron_contract_readback_enabled: true, watcher_daemon_enabled: false, cron_enabled: false },
        redaction: { raw_excluded: true },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationWatcherCronContractStatus();

    expect(result.mode).toBe("watcher_cron_contract_status");
    expect(result.watcher_cron_contract_complete).toBe(true);
    expect(result.capabilities.watcher_daemon_enabled).toBe(false);
    expect(result.capabilities.cron_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/watcher-cron-contract-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets runtime activation review status through the protected readback route", async () => {
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
        schema_version: 1,
        mode: "runtime_activation_review_status",
        runtime_activation_review_complete: true,
        source_watcher_cron_lane: "watcher_cron_contract_status",
        next_manual_lane: "runtime_activation_still_disabled",
        reviewed_activation_targets: ["watcher_daemon", "cron_job_activation"],
        activation_decisions: { watcher_daemon: "disabled_requires_explicit_runtime_approval" },
        forbidden_boundaries: ["runtime_activation", "adapter_dispatch", "target_mutation"],
        capabilities: { runtime_activation_review_readback_enabled: true, watcher_daemon_enabled: false, cron_enabled: false, adapter_dispatch_enabled: false, target_mutation_enabled: false },
        redaction: { raw_excluded: true },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationRuntimeActivationReviewStatus();

    expect(result.mode).toBe("runtime_activation_review_status");
    expect(result.runtime_activation_review_complete).toBe(true);
    expect(result.capabilities.watcher_daemon_enabled).toBe(false);
    expect(result.capabilities.cron_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/runtime-activation-review-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets runtime preflight status through the protected readback route", async () => {
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
        schema_version: 1,
        mode: "runtime_preflight_status",
        runtime_preflight_complete: true,
        source_runtime_activation_lane: "runtime_activation_review_status",
        next_manual_lane: "manual_one_shot_runtime_dry_run",
        preflight_decisions: { systemd_unit_draft: "draft_required_not_created" },
        readiness: { runtime_activation_ready: false, systemd_unit_ready: false },
        forbidden_boundaries: ["watcher_daemon_activation", "cron_job_installation"],
        capabilities: { runtime_preflight_readback_enabled: true, watcher_daemon_enabled: false, cron_enabled: false, adapter_dispatch_enabled: false, target_mutation_enabled: false },
        redaction: { raw_excluded: true },
        errors: [],
      }),
    } as Response);

    const result = await api.getOfficeControlledMutationRuntimePreflightStatus();

    expect(result.mode).toBe("runtime_preflight_status");
    expect(result.runtime_preflight_complete).toBe(true);
    expect(result.readiness.runtime_activation_ready).toBe(false);
    expect(result.capabilities.watcher_daemon_enabled).toBe(false);
    expect(result.capabilities.cron_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/runtime-preflight-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets manual one-shot runtime dry-run status through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "manual_one_shot_runtime_dry_run_status",
        manual_one_shot_runtime_dry_run_complete: true,
        capabilities: {
          manual_one_shot_runtime_dry_run_readback_enabled: true,
          metadata_result_write_enabled: true,
          audit_event_write_enabled: true,
          runtime_command_execution_enabled: false,
          watcher_daemon_enabled: false,
          cron_enabled: false,
          adapter_dispatch_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationManualOneShotRuntimeDryRunStatus();

    expect(result.mode).toBe("manual_one_shot_runtime_dry_run_status");
    expect(result.manual_one_shot_runtime_dry_run_complete).toBe(true);
    expect(result.capabilities.metadata_result_write_enabled).toBe(true);
    expect(result.capabilities.audit_event_write_enabled).toBe(true);
    expect(result.capabilities.runtime_command_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-one-shot-runtime-dry-run-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets adapter binding dry-run status through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "adapter_binding_dry_run_status",
        adapter_binding_dry_run_complete: true,
        capabilities: {
          adapter_binding_dry_run_readback_enabled: true,
          adapter_registry_readback_enabled: true,
          binding_plan_metadata_enabled: true,
          adapter_binding_enabled: false,
          adapter_dispatch_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationAdapterBindingDryRunStatus();

    expect(result.mode).toBe("adapter_binding_dry_run_status");
    expect(result.adapter_binding_dry_run_complete).toBe(true);
    expect(result.capabilities.adapter_registry_readback_enabled).toBe(true);
    expect(result.capabilities.binding_plan_metadata_enabled).toBe(true);
    expect(result.capabilities.adapter_binding_enabled).toBe(false);
    expect(result.capabilities.adapter_dispatch_enabled).toBe(false);
    expect(result.capabilities.target_mutation_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/adapter-binding-dry-run-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets human-reviewed single-dispatch status through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "human_reviewed_single_dispatch_status",
        human_reviewed_single_dispatch_complete: true,
        capabilities: {
          human_reviewed_single_dispatch_readback_enabled: true,
          dispatch_candidate_metadata_enabled: true,
          approval_requirements_readback_enabled: true,
          adapter_dispatch_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationHumanReviewedSingleDispatchStatus();

    expect(result.mode).toBe("human_reviewed_single_dispatch_status");
    expect(result.human_reviewed_single_dispatch_complete).toBe(true);
    expect(result.capabilities.dispatch_candidate_metadata_enabled).toBe(true);
    expect(result.capabilities.approval_requirements_readback_enabled).toBe(true);
    expect(result.capabilities.adapter_dispatch_enabled).toBe(false);
    expect(result.capabilities.target_mutation_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/human-reviewed-single-dispatch-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets explicit runtime dispatch approval status through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "explicit_runtime_dispatch_approval_status",
        explicit_runtime_dispatch_approval_complete: true,
        capabilities: {
          explicit_runtime_dispatch_approval_readback_enabled: true,
          approval_criteria_readback_enabled: true,
          runtime_boundary_readback_enabled: true,
          adapter_dispatch_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationExplicitRuntimeDispatchApprovalStatus();

    expect(result.mode).toBe("explicit_runtime_dispatch_approval_status");
    expect(result.explicit_runtime_dispatch_approval_complete).toBe(true);
    expect(result.capabilities.explicit_runtime_dispatch_approval_readback_enabled).toBe(true);
    expect(result.capabilities.approval_criteria_readback_enabled).toBe(true);
    expect(result.capabilities.runtime_boundary_readback_enabled).toBe(true);
    expect(result.capabilities.adapter_dispatch_enabled).toBe(false);
    expect(result.capabilities.target_mutation_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/explicit-runtime-dispatch-approval-status",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets concrete runtime single-dispatch slice design through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "concrete_runtime_single_dispatch_slice_design",
        concrete_runtime_single_dispatch_slice_design_complete: true,
        capabilities: {
          single_dispatch_slice_design_readback_enabled: true,
          one_shot_envelope_metadata_enabled: true,
          target_allowlist_readback_enabled: true,
          rollback_plan_readback_enabled: true,
          adapter_dispatch_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationConcreteRuntimeSingleDispatchSliceDesign();

    expect(result.mode).toBe("concrete_runtime_single_dispatch_slice_design");
    expect(result.concrete_runtime_single_dispatch_slice_design_complete).toBe(true);
    expect(result.capabilities.single_dispatch_slice_design_readback_enabled).toBe(true);
    expect(result.capabilities.one_shot_envelope_metadata_enabled).toBe(true);
    expect(result.capabilities.target_allowlist_readback_enabled).toBe(true);
    expect(result.capabilities.rollback_plan_readback_enabled).toBe(true);
    expect(result.capabilities.adapter_dispatch_enabled).toBe(false);
    expect(result.capabilities.target_mutation_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/concrete-runtime-single-dispatch-slice-design",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets disabled one-shot runtime dispatch executor skeleton through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "disabled_one_shot_runtime_dispatch_executor_skeleton",
        disabled_one_shot_runtime_dispatch_executor_skeleton_complete: true,
        capabilities: {
          disabled_executor_skeleton_readback_enabled: true,
          refusal_validation_enabled: true,
          execution_endpoint_present: true,
          contract_hardening_readback_enabled: true,
          idempotency_replay_block_metadata_enabled: true,
          runtime_command_execution_enabled: false,
          target_mutation_enabled: false,
        },
        contract_hardening: {
          exact_target_allowlist_schema_enabled: true,
          idempotency_key_format_check_enabled: true,
          idempotency_replay_metadata_enabled: true,
          rollback_disable_plan_ref_check_enabled: true,
          dry_run_evidence_ref_check_enabled: true,
          operator_final_confirmation_metadata_enabled: true,
          refusal_only_default: true,
        },
        ref_patterns: {
          exact_target_allowlist_ref_prefix: "allowlist-",
          rollback_plan_ref_prefix: "rollback-",
          dry_run_evidence_ref_prefix: "dryrun-",
          idempotency_key_prefix: "idem-",
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationDisabledOneShotRuntimeDispatchExecutorSkeleton();

    expect(result.mode).toBe("disabled_one_shot_runtime_dispatch_executor_skeleton");
    expect(result.disabled_one_shot_runtime_dispatch_executor_skeleton_complete).toBe(true);
    expect(result.capabilities.disabled_executor_skeleton_readback_enabled).toBe(true);
    expect(result.capabilities.refusal_validation_enabled).toBe(true);
    expect(result.capabilities.execution_endpoint_present).toBe(true);
    expect(result.capabilities.contract_hardening_readback_enabled).toBe(true);
    expect(result.capabilities.idempotency_replay_block_metadata_enabled).toBe(true);
    expect(result.contract_hardening.exact_target_allowlist_schema_enabled).toBe(true);
    expect(result.contract_hardening.refusal_only_default).toBe(true);
    expect(result.ref_patterns.idempotency_key_prefix).toBe("idem-");
    expect(result.capabilities.runtime_command_execution_enabled).toBe(false);
    expect(result.capabilities.target_mutation_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("gets manual approval-recording preflight status through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "manual_approval_recording_preflight_status",
        manual_approval_recording_preflight_complete: true,
        preflight_contract: { approval_record_shape_required: true, refusal_only_default: true },
        execution_boundary: { preflight_only: true, approval_record_written: false, runtime_command_executed: false, target_mutation_created: false },
        capabilities: {
          manual_approval_recording_preflight_readback_enabled: true,
          approval_recording_enabled: false,
          real_dispatch_execution_enabled: false,
          idempotency_replay_store_write_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationManualApprovalRecordingPreflightStatus();

    expect(result.mode).toBe("manual_approval_recording_preflight_status");
    expect(result.manual_approval_recording_preflight_complete).toBe(true);
    expect(result.capabilities.manual_approval_recording_preflight_readback_enabled).toBe(true);
    expect(result.capabilities.approval_recording_enabled).toBe(false);
    expect(result.execution_boundary.approval_record_written).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-recording-preflight",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("refuses manual approval-recording preflight requests through the protected route without raw values", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "manual_approval_recording_preflight_refusal",
        accepted: false,
        approval_record_written: false,
        dispatch_gate_open: false,
        runtime_command_executed: false,
        target_mutation_created: false,
        refusal_code: "approval_recording_disabled_by_default",
        validation_errors: [{ field: "idempotency_key", code: "unsupported_ref_shape" }],
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.executeOfficeControlledMutationManualApprovalRecordingPreflight({
      approval_record_ref: "approval-office-dispatch-1",
      exact_target_allowlist_ref: "allowlist-office-target-1",
      idempotency_key: "idem-office-dispatch-1",
      replay_lookup_ref: "replay-office-dispatch-1",
      rollback_disable_ref: "rollback-office-dispatch-1",
      dry_run_evidence_ref: "dryrun-office-dispatch-1",
      operator_confirmation: "confirmed-manual-preflight-only",
    });

    expect(result.mode).toBe("manual_approval_recording_preflight_refusal");
    expect(result.accepted).toBe(false);
    expect(result.approval_record_written).toBe(false);
    expect(result.target_mutation_created).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-recording-preflight/preflight",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: expect.any(String) }),
    );
    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.body).toBe(JSON.stringify({
      approval_record_ref: "approval-office-dispatch-1",
      exact_target_allowlist_ref: "allowlist-office-target-1",
      idempotency_key: "idem-office-dispatch-1",
      replay_lookup_ref: "replay-office-dispatch-1",
      rollback_disable_ref: "rollback-office-dispatch-1",
      dry_run_evidence_ref: "dryrun-office-dispatch-1",
      operator_confirmation: "confirmed-manual-preflight-only",
    }));
    expect(String(init?.body)).not.toMatch(/\/Users\/|\/home\/|sk-|provider|raw_command/i);
  });

  it("stores manual approval-recording drafts through the protected route without opening execution", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { __HERMES_SESSION_TOKEN__: "session-token-for-header-only", __HERMES_BASE_PATH__: "" },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        stored: true,
        errors: [],
        dto: {
          mode: "stored_manual_approval_recording_draft",
          draft_status: "draft_only",
          approval_record_ref: "approval-office-dispatch-1",
          idempotency_key: "idem-office-dispatch-1",
          approval_record_written: false,
          dispatch_gate_open: false,
          runtime_command_executed: false,
          target_mutation_created: false,
          idempotency_replay_store_written: false,
          capabilities: { approval_record_draft_storage_enabled: true, approval_recording_enabled: false, real_dispatch_execution_enabled: false },
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.appendOfficeControlledMutationManualApprovalRecordingDraft({
      approval_record_ref: "approval-office-dispatch-1",
      exact_target_allowlist_ref: "allowlist-office-target-1",
      idempotency_key: "idem-office-dispatch-1",
      replay_lookup_ref: "replay-office-dispatch-1",
      rollback_disable_ref: "rollback-office-dispatch-1",
      dry_run_evidence_ref: "dryrun-office-dispatch-1",
      operator_confirmation: "confirmed-draft-record-only",
      requested_by: "actor:ai_office_operator",
      requested_at: "2026-05-19T04:00:00Z",
      safe_summary: "Draft approval record stored for review only; dispatch gate remains closed.",
      evidence_refs: ["plan:manual_approval_recording_preflight", "dryrun:dryrun-office-dispatch-1"],
    });

    expect(result.stored).toBe(true);
    expect(result.dto?.draft_status).toBe("draft_only");
    expect(result.dto?.approval_record_written).toBe(false);
    expect(result.dto?.dispatch_gate_open).toBe(false);
    expect(result.dto?.target_mutation_created).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-recording-draft",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: expect.any(String) }),
    );
    expect(String(fetchMock.mock.calls[0]?.[1]?.body)).not.toMatch(/\/Users\/|\/home\/|sk-|provider|raw_command/i);
  });

  it("reads manual approval-recording draft status with query filters", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { __HERMES_SESSION_TOKEN__: "session-token-for-header-only", __HERMES_BASE_PATH__: "" },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "stored_manual_approval_recording_drafts_readback",
        draft_count: 1,
        limit: 10,
        skipped_count: 0,
        drafts: [],
        latest_refs: { approval_record_ref: "approval-office-dispatch-1", idempotency_key: "idem-office-dispatch-1" },
        capabilities: { approval_record_draft_readback_enabled: true, approval_recording_enabled: false, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
        errors: [],
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationManualApprovalRecordingDraftStatus({ approval_record_ref: "approval-office-dispatch-1", limit: 10 });

    expect(result.mode).toBe("stored_manual_approval_recording_drafts_readback");
    expect(result.draft_count).toBe(1);
    expect(result.capabilities.approval_recording_enabled).toBe(false);
    expect(result.capabilities.dispatch_gate_open).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-recording-draft-status?approval_record_ref=approval-office-dispatch-1&limit=10",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("gets manual approval-recording draft review status through the protected route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { __HERMES_SESSION_TOKEN__: "session-token-for-header-only", __HERMES_BASE_PATH__: "" },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "manual_approval_recording_draft_review_status",
        manual_approval_recording_draft_review_complete: true,
        review: {
          draft_present: true,
          draft_status: "draft_only",
          approval_record_ref: "approval-office-dispatch-1",
          ready_for_manual_operator_review: true,
          ready_for_real_approval_record_write: false,
          next_required_gate: "separate_real_approval_record_write_gate",
        },
        execution_boundary: {
          approval_record_written: false,
          dispatch_gate_open: false,
          runtime_command_executed: false,
          target_mutation_created: false,
        },
        capabilities: {
          approval_record_draft_readback_enabled: true,
          approval_recording_enabled: false,
          dispatch_gate_open: false,
          real_dispatch_execution_enabled: false,
          target_mutation_enabled: false,
        },
        redaction: { raw_excluded: true },
        errors: [],
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationManualApprovalRecordingDraftReviewStatus({ approval_record_ref: "approval-office-dispatch-1" });

    expect(result.mode).toBe("manual_approval_recording_draft_review_status");
    expect(result.review.draft_present).toBe(true);
    expect(result.review.ready_for_real_approval_record_write).toBe(false);
    expect(result.execution_boundary.approval_record_written).toBe(false);
    expect(result.execution_boundary.dispatch_gate_open).toBe(false);
    expect(result.capabilities.approval_recording_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-recording-draft-review-status?approval_record_ref=approval-office-dispatch-1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("writes and reads manual approval records through protected routes without opening dispatch", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: { __HERMES_SESSION_TOKEN__: "session-token-for-header-only", __HERMES_BASE_PATH__: "" },
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          stored: true,
          errors: [],
          dto: {
            mode: "stored_manual_approval_record",
            approval_status: "recorded_manual_approval",
            approval_record_written: true,
            dispatch_gate_open: false,
            runtime_command_executed: false,
            target_mutation_created: false,
            capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
            redaction: { raw_excluded: true },
          },
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          mode: "stored_manual_approval_records_readback",
          approval_record_count: 1,
          records: [],
          latest_refs: { approval_record_ref: "approval-office-dispatch-1" },
          capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
          errors: [],
        }),
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const writeResult = await api.appendOfficeControlledMutationManualApprovalRecord({
      approval_record_ref: "approval-office-dispatch-1",
      operator_confirmation: "confirmed-real-approval-record-write-only",
      approved_by: "actor:ai_office_operator",
      approved_at: "2026-05-19T04:30:00Z",
      approval_evidence_refs: ["approval:approval-office-dispatch-1"],
    });
    const readback = await api.getOfficeControlledMutationManualApprovalRecordStatus({ approval_record_ref: "approval-office-dispatch-1", limit: 10 });

    expect(writeResult.stored).toBe(true);
    expect(writeResult.dto?.approval_record_written).toBe(true);
    expect(writeResult.dto?.dispatch_gate_open).toBe(false);
    expect(readback.mode).toBe("stored_manual_approval_records_readback");
    expect(readback.approval_record_count).toBe(1);
    expect(readback.capabilities.real_dispatch_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/office/controlled-mutation/manual-approval-record",
      expect.objectContaining({ method: "POST", body: expect.not.stringContaining("raw_command") }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/office/controlled-mutation/manual-approval-record-status?approval_record_ref=approval-office-dispatch-1&limit=10",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
  });

  it("gets manual approval dispatch gate readiness through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "manual_approval_dispatch_gate_readiness_status",
        manual_approval_dispatch_gate_readiness_complete: true,
        readiness: {
          approval_record_present: true,
          approval_record_written: true,
          ready_for_dispatch_gate_open: false,
          ready_for_runtime_dispatch_execution: false,
          exact_target_allowlist_ref: "allowlist-office-target-1",
        },
        execution_boundary: { dispatch_gate_open: false, runtime_command_executed: false, target_mutation_created: false },
        capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
        errors: [],
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationManualApprovalDispatchGateReadinessStatus({ approval_record_ref: "approval-office-dispatch-1" });

    expect(result.mode).toBe("manual_approval_dispatch_gate_readiness_status");
    expect(result.manual_approval_dispatch_gate_readiness_complete).toBe(true);
    expect(result.readiness.approval_record_present).toBe(true);
    expect(result.readiness.ready_for_dispatch_gate_open).toBe(false);
    expect(result.execution_boundary.dispatch_gate_open).toBe(false);
    expect(result.capabilities.real_dispatch_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/manual-approval-dispatch-gate-readiness-status?approval_record_ref=approval-office-dispatch-1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|private-path|secret-marker|credential-marker|provider|raw_command/i);
  });

  it("writes and reads manual dispatch gate open records through protected routes without runtime execution", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          stored: true,
          dto: {
            mode: "stored_manual_dispatch_gate_open_record",
            dispatch_gate_ref: "gate-office-dispatch-1",
            approval_record_ref: "approval-office-dispatch-1",
            dispatch_gate_open: true,
            runtime_command_included: false,
            runtime_command_executed: false,
            target_mutation_created: false,
            real_dispatch_execution_enabled: false,
          },
          errors: [],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          mode: "stored_manual_dispatch_gate_open_records_readback",
          dispatch_gate_open_record_count: 1,
          records: [{ dispatch_gate_ref: "gate-office-dispatch-1", dispatch_gate_open: true, runtime_command_executed: false }],
          capabilities: { dispatch_gate_open: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false },
        }),
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const write = await api.writeOfficeControlledMutationManualDispatchGateOpenRecord({
      approval_record_ref: "approval-office-dispatch-1",
      dispatch_gate_ref: "gate-office-dispatch-1",
      operator_confirmation: "confirmed-dispatch-gate-open-metadata-only",
      opened_by: "actor:ai_office_operator",
      opened_at: "2026-05-19T05:20:00Z",
      gate_evidence_refs: ["approval:approval-office-dispatch-1"],
    });
    const read = await api.getOfficeControlledMutationManualDispatchGateOpenRecordStatus({ dispatch_gate_ref: "gate-office-dispatch-1" });

    expect(write.stored).toBe(true);
    expect(write.dto?.dispatch_gate_open).toBe(true);
    expect(write.dto?.runtime_command_executed).toBe(false);
    expect(read.mode).toBe("stored_manual_dispatch_gate_open_records_readback");
    expect(read.records[0]?.dispatch_gate_open).toBe(true);
    expect(read.capabilities.runtime_command_execution_enabled).toBe(false);
    expect(read.capabilities.real_dispatch_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/office/controlled-mutation/manual-dispatch-gate-open-record",
      expect.objectContaining({ method: "POST", body: expect.any(String), headers: expect.any(Headers) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/office/controlled-mutation/manual-dispatch-gate-open-record-status?dispatch_gate_ref=gate-office-dispatch-1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.raw_command).toBeUndefined();
    expect(body.provider).toBeUndefined();
  });

  it("writes and reads manual runtime command preview records through protected routes without execution", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          stored: true,
          dto: {
            mode: "stored_manual_runtime_command_preview_record",
            dispatch_gate_ref: "gate-office-dispatch-1",
            runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
            runtime_command_preview_created: true,
            runtime_command_preview_checksum_sha256: "a".repeat(64),
            runtime_command_included: false,
            runtime_command_executed: false,
            target_mutation_created: false,
            real_dispatch_execution_enabled: false,
          },
          errors: [],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          mode: "stored_manual_runtime_command_preview_records_readback",
          runtime_command_preview_record_count: 1,
          records: [{ runtime_command_preview_ref: "cmdpreview-office-dispatch-1", runtime_command_preview_created: true, runtime_command_executed: false }],
          capabilities: { runtime_command_preview_enabled: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false },
        }),
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const write = await api.writeOfficeControlledMutationManualRuntimeCommandPreviewRecord({
      dispatch_gate_ref: "gate-office-dispatch-1",
      runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
      command_envelope_ref: "envelope-office-dispatch-1",
      command_intent_ref: "intent-office-dispatch-1",
      operator_confirmation: "confirmed-runtime-command-preview-only",
      materialized_by: "actor:ai_office_operator",
      materialized_at: "2026-05-19T05:40:00Z",
      preview_evidence_refs: ["gate:gate-office-dispatch-1"],
    });
    const read = await api.getOfficeControlledMutationManualRuntimeCommandPreviewRecordStatus({ runtime_command_preview_ref: "cmdpreview-office-dispatch-1" });

    expect(write.stored).toBe(true);
    expect(write.dto?.runtime_command_preview_created).toBe(true);
    expect(write.dto?.runtime_command_executed).toBe(false);
    expect(read.mode).toBe("stored_manual_runtime_command_preview_records_readback");
    expect(read.records[0]?.runtime_command_preview_created).toBe(true);
    expect(read.capabilities.runtime_command_execution_enabled).toBe(false);
    expect(read.capabilities.real_dispatch_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/office/controlled-mutation/manual-runtime-command-preview-record",
      expect.objectContaining({ method: "POST", body: expect.any(String), headers: expect.any(Headers) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/office/controlled-mutation/manual-runtime-command-preview-record-status?runtime_command_preview_ref=cmdpreview-office-dispatch-1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.raw_command).toBeUndefined();
    expect(body.provider).toBeUndefined();
  });

  it("writes and reads manual runtime command inclusion records through protected routes without execution", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          stored: true,
          dto: {
            mode: "stored_manual_runtime_command_inclusion_record",
            runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
            runtime_command_ref: "cmd-office-dispatch-1",
            command_kind: "office_controlled_mutation_single_dispatch_noop_probe",
            command_body: { target_ref: "target-office-dispatch-1" },
            runtime_command_body_checksum_sha256: "b".repeat(64),
            runtime_command_included: true,
            runtime_command_executed: false,
            target_mutation_created: false,
            real_dispatch_execution_enabled: false,
          },
          errors: [],
        }),
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        headers: new Headers({ "content-type": "application/json" }),
        json: async () => ({
          mode: "stored_manual_runtime_command_inclusion_records_readback",
          runtime_command_inclusion_record_count: 1,
          records: [{ runtime_command_ref: "cmd-office-dispatch-1", runtime_command_included: true, runtime_command_executed: false }],
          capabilities: { runtime_command_included: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false },
        }),
      } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const write = await api.writeOfficeControlledMutationManualRuntimeCommandInclusionRecord({
      runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
      runtime_command_ref: "cmd-office-dispatch-1",
      operator_confirmation: "confirmed-runtime-command-inclusion-no-execute",
      included_by: "actor:ai_office_operator",
      included_at: "2026-05-19T06:00:00Z",
      command_kind: "office_controlled_mutation_single_dispatch_noop_probe",
      command_body: {
        target_ref: "target-office-dispatch-1",
        dry_run_evidence_ref: "dryrun-office-dispatch-1",
        rollback_disable_ref: "rollback-office-dispatch-1",
      },
      inclusion_evidence_refs: ["cmdpreview:cmdpreview-office-dispatch-1"],
    });
    const read = await api.getOfficeControlledMutationManualRuntimeCommandInclusionRecordStatus({ runtime_command_ref: "cmd-office-dispatch-1" });

    expect(write.stored).toBe(true);
    expect(write.dto?.runtime_command_included).toBe(true);
    expect(write.dto?.runtime_command_executed).toBe(false);
    expect(read.mode).toBe("stored_manual_runtime_command_inclusion_records_readback");
    expect(read.records[0]?.runtime_command_included).toBe(true);
    expect(read.capabilities.runtime_command_execution_enabled).toBe(false);
    expect(fetchMock).toHaveBeenNthCalledWith(
      1,
      "/api/office/controlled-mutation/manual-runtime-command-inclusion-record",
      expect.objectContaining({ method: "POST", body: expect.any(String), headers: expect.any(Headers) }),
    );
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      "/api/office/controlled-mutation/manual-runtime-command-inclusion-record-status?runtime_command_ref=cmd-office-dispatch-1",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const body = JSON.parse(String(fetchMock.mock.calls[0]?.[1]?.body));
    expect(body.shell_command).toBeUndefined();
    expect(body.token).toBeUndefined();
  });

  it("gets approved real one-shot dispatch gate design through the protected readback route", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "approved_real_one_shot_dispatch_gate_design",
        approved_real_one_shot_dispatch_gate_design_complete: true,
        approval_gate: { approval_record_required: true, approval_recorded: false },
        runtime_command_envelope: { runtime_command_shape_defined: true, runtime_command_executed: false },
        replay_store: { replay_lookup_required: true, replay_state_mutated: false },
        rollback_disable: { disable_switch_required: true, rollback_executed: false },
        execution_boundary: { design_only: true, dispatch_gate_open: false, runtime_command_executed: false, target_mutation_created: false },
        capabilities: {
          approved_gate_design_readback_enabled: true,
          real_dispatch_execution_enabled: false,
          approval_recording_enabled: false,
          idempotency_replay_store_write_enabled: false,
          target_mutation_enabled: false,
        },
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.getOfficeControlledMutationApprovedRealOneShotDispatchGateDesign();

    expect(result.mode).toBe("approved_real_one_shot_dispatch_gate_design");
    expect(result.approved_real_one_shot_dispatch_gate_design_complete).toBe(true);
    expect(result.capabilities.approved_gate_design_readback_enabled).toBe(true);
    expect(result.capabilities.real_dispatch_execution_enabled).toBe(false);
    expect(result.capabilities.approval_recording_enabled).toBe(false);
    expect(result.capabilities.idempotency_replay_store_write_enabled).toBe(false);
    expect(result.execution_boundary.design_only).toBe(true);
    expect(result.execution_boundary.target_mutation_created).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/approved-real-one-shot-dispatch-gate-design",
      expect.objectContaining({ headers: expect.any(Headers) }),
    );
    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1])).not.toMatch(/method|body|\/Users\/|\/home\/|token=|sk-|provider/i);
  });

  it("refuses disabled one-shot runtime dispatch execute requests through the protected route without raw values", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      status: 200,
      headers: new Headers({ "content-type": "application/json" }),
      json: async () => ({
        mode: "disabled_one_shot_runtime_dispatch_executor_refusal",
        accepted: false,
        dispatch_created: false,
        runtime_command_executed: false,
        target_mutation_created: false,
        refusal_code: "runtime_dispatch_disabled_by_default",
      }),
    } as Response);
    vi.stubGlobal("fetch", fetchMock);

    const result = await api.executeOfficeControlledMutationDisabledOneShotRuntimeDispatch({
      exact_target_allowlist_ref: "allowlist-office-target-1",
      idempotency_key: "idem-1",
      rollback_plan_ref: "rollback-1",
      dry_run_evidence_ref: "dryrun-1",
      operator_confirmation: true,
    });

    expect(result.accepted).toBe(false);
    expect(result.runtime_command_executed).toBe(false);
    expect(result.target_mutation_created).toBe(false);
    expect(result.refusal_code).toBe("runtime_dispatch_disabled_by_default");
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton/execute",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: expect.any(String) }),
    );
    const [, init] = fetchMock.mock.calls[0] ?? [];
    const headers = init?.headers as Headers;
    expect(headers.get("X-Hermes-Session-Token")).toBe("session-token-for-header-only");
    expect(init?.body).toBe(JSON.stringify({
      exact_target_allowlist_ref: "allowlist-office-target-1",
      idempotency_key: "idem-1",
      rollback_plan_ref: "rollback-1",
      dry_run_evidence_ref: "dryrun-1",
      operator_confirmation: true,
    }));
    expect(JSON.stringify(fetchMock.mock.calls[0])).not.toMatch(/\/Users\/|\/home\/|sk-|provider|raw_command/i);
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

  it("posts optional inline execution-state recording refs without markdown or raw paths", async () => {
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: {
        __HERMES_SESSION_TOKEN__: "session-token-for-header-only",
        __HERMES_BASE_PATH__: "",
      },
    });
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({ executed: true, written: true, recorded: true, errors: [], dto: null }),
    } as Response);

    const payload = {
      handoff_ref: "handoff_ui_demo",
      relay_execution_ref: "relay_exec_ui_demo",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      relay_authorized_by: "agent_nas_keeper",
      relay_authorized_at: "2026-05-18T04:10:00Z",
      record_execution_state_after_write: true as const,
      execution_record_ref: "exec_record_ui_inline_demo",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T06:50:00Z",
    };

    await api.executeOfficeControlledMutationNasKeeperExecutionFromPreview(payload);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview",
      expect.objectContaining({ method: "POST", headers: expect.any(Headers), body: JSON.stringify(payload) }),
    );
    expect(JSON.stringify(fetchMock.mock.calls[0]?.[1]?.body)).toContain("record_execution_state_after_write");
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
