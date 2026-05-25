import officePageSource from "./OfficePage.tsx?raw";
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
import type { NasKeeperExecutionStateDraft } from "./OfficePage";
import { buildOfficeKanbanProjection, buildOfficeDeskRpgProjectionModel, buildOfficeDeskRpgWorkerRoleVisibility, buildOfficeDisabledApprovalDialoguePosture, buildOfficeReviewerWikiHandoffPosture, buildOfficeApprovalDialogueInspectorDetail, buildOfficeReviewerWikiEvidenceDetailPosture, buildOfficeBoardEvidenceInspectorDrilldown, buildOfficeBossOrchestratorRequestPostureDetail, buildOfficeOrchestratorRequestEnvelopeDetail, buildOfficeApprovalRequestRouteDetail, buildOfficeEventRequestContractProjection, buildOfficeApprovalDialogueRouteInspector, buildOfficeEventTimelineProjection, buildOfficeTimelineWorkerHandoffDrilldown, buildOfficeApprovalRequestDetailDeepening, buildOfficeApprovalRequestView, buildOfficeApprovalAuditTimeline, buildOfficeApprovalExecutionGate, buildOfficeAuthorityAdapterContract, buildOfficeOrchestratorMediationQueue, buildOfficeWorkerIntentRouting, buildOfficeWorkerFacilityReadiness, buildOfficeWorkerAssignmentCandidateGate, buildOfficeWorkerRequestDraftPreview, buildOfficeWorkerHumanConfirmationEnvelope, buildOfficeWorkerAuthorityHandoffEnvelope, buildOfficeWorkerDispatchDryRunEnvelope, buildOfficeWorkerAuditPreviewEnvelope, buildOfficeWorkerRollbackPreviewEnvelope, buildOfficeWorkerFinalGateChecklist, buildOfficeWorkerFacilityLanePolish, buildOfficeWorkerRequestHandoffDetail, buildOfficeApprovalNasBoundaryPolish, buildOfficeApprovalAuthorityReadinessDetail, buildOfficeApprovalAuthorityDecisionEnvelopePreview, buildOfficeApprovalDecisionAuditNasTracePreview, buildOfficeNasKeeperSaveRequestGate, buildOfficeNasKeeperRollbackEvidencePreview, buildOfficeNasEvidencePackageStoreReadbackStatus, buildOfficeNasPathValidationStatusSurface, buildOfficeNasPathPreviewStatusSurface, buildOfficeNasPathPreviewStoreReadbackStatusSurface, buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface, buildOfficeNasRuntimeSingleFileWriteApprovalAction, buildOfficeNasKeeperQueueManualEvidenceReviewSurface, buildOfficeNasKeeperExecutionOperatorAction, buildOfficeDeskRpgReadOnlyChainCompletionReview, buildOfficeEventDrivenCharacterStateProjection, buildOfficeCharacterStateRoomOverlay, buildOfficeCharacterRoomInteractionPosture, buildOfficeCharacterInspectorDetailPosture, buildOfficeCharacterDetailSafeDialogueCopy, buildOfficeCharacterBubbleInspectorAlignment, buildOfficeCharacterPanelBoundarySummary, buildOfficeCharacterFacilityRoleLegend, buildOfficeCharacterFacilityBoundaryStrip, buildOfficeCharacterFacilitySourceLedgerStrip, buildOfficeCharacterFacilityCompletionReview, buildOfficeControlledMutationProposalContract, buildOfficeControlledMutationDryRunPlan, buildOfficeControlledMutationAuditSinkPlan, buildOfficeControlledMutationRollbackVerificationPlan, buildOfficeControlledMutationHumanApprovalPlan, buildOfficeControlledMutationAuthoritySummary, buildOfficeControlledMutationExecutionReadinessSummary, buildOfficeControlledMutationContractPostureProjection, buildOfficeControlledMutationContractPosturePolish, buildOfficeControlledMutationReadinessHandoffRibbon, buildOfficeControlledMutationReadinessSummaryPolish, buildOfficeControlledMutationRequestStorePosture, buildOfficeControlledMutationRequestStoreHardeningPlan, buildOfficeControlledMutationNextApprovalBoundary, buildOfficeControlledMutationPostDecisionApprovalBoundary, buildOfficeControlledMutationPostRegistryApprovalBoundary, buildOfficeControlledMutationTargetDispatchForbiddenBoundary, buildOfficeControlledMutationSafeContinuationCompletionReview, buildOfficeControlledMutationApprovalBoundarySummary, buildOfficeRpgRuntimeFanoutDrilldown, buildOfficeRpgFanoutApprovalEventBridge, buildOfficeRpgScene } from "./officeView";
import type { OfficeAuthorityMetadataHandoffStatus, OfficeDispatcherAuthorityDryRunSurface, OfficeDispatcherAuthorityMetadataAppendStatus, OfficeDispatcherAuthorityMetadataRecordingDraft, OfficeDispatcherExecutionSimulationStatus, OfficeNasKeeperExecutionFromPreviewPayload, OfficeNasKeeperExecutionFromPreviewResult, OfficeNasKeeperExecutionStateResult, OfficeNasKeeperHandoffQueueReadback, OfficeState } from "@/lib/api";

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

describe("Office controlled-mutation runtime status panel placement", () => {
  it("keeps accumulated technical evidence collapsed behind the RPG visualizer instead of flooding the main Office view", () => {
    const source = officePageSource;
    const rpgIndex = source.indexOf("<OfficeRpgMap");
    const drawerIndex = source.indexOf("<OfficeVisualizerEvidenceDrawer");
    const drawerCloseIndex = source.indexOf("</OfficeVisualizerEvidenceDrawer>");
    expect(rpgIndex).toBeGreaterThan(0);
    expect(drawerIndex).toBeGreaterThan(rpgIndex);
    expect(drawerCloseIndex).toBeGreaterThan(drawerIndex);
    expect(source).toContain('data-office-rpg-focused-shell="true"');
    expect(source).toContain('data-office-visualizer-evidence-drawer="true"');
    expect(source).toContain("<MacLocalRelayRootAuthorityPreflightPanel");
    expect(source).toContain("<MacLocalRelayRootAuthorityConfigContractPanel");
    expect(source).toContain("<MacLocalRelayRootReadinessProbeContractPanel");
    expect(source).toContain("<NasKeeperLastSuccessfulMacRelayWriteStatusPanel");
    expect(source).toContain("<NasKeeperFreshOneShotOperatorFlowPanel");
    expect(source).toContain("<NasKeeperFreshOneShotRequestBuilderPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel");
    expect(source).toContain("<NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignPanel");

    for (const panel of [
      "<NasKeeperLiveOperatorLanePanel",
      "<ControlledMutationApprovalBoundarySummaryPanel",
      "<RuntimeActivationReviewStatusPanel",
      "<ManualRuntimeCommandExecutionRecordStatusPanel",
      "<ManualNasKeeperHandoffRecordStatusPanel",
      "<NasKeeperTerminalExecutionStateCompletionReviewPanel",
    ]) {
      const panelIndex = source.indexOf(panel);
      expect(panelIndex).toBeGreaterThan(drawerIndex);
      expect(panelIndex).toBeLessThan(drawerCloseIndex);
    }
  });

  it("keeps graduated status panels available outside legacy diagnostic lanes for smoke hooks", () => {
    const source = officePageSource;
    const legacyIndex = source.indexOf("{SHOW_OFFICE_LEGACY_DIAGNOSTIC_LANES ?");
    expect(legacyIndex).toBeGreaterThan(0);

    for (const panel of [
      "<RuntimeActivationReviewStatusPanel",
      "<RuntimePreflightStatusPanel",
      "<ManualOneShotRuntimeDryRunStatusPanel",
      "<AdapterBindingDryRunStatusPanel",
      "<HumanReviewedSingleDispatchStatusPanel",
      "<ExplicitRuntimeDispatchApprovalStatusPanel",
      "<ConcreteRuntimeSingleDispatchSliceDesignPanel",
      "<DisabledOneShotRuntimeDispatchExecutorSkeletonPanel",
      "<ApprovedRealOneShotDispatchGateDesignPanel",
      "<ManualApprovalRecordingPreflightStatusPanel",
      "<ManualApprovalRecordingDraftStatusPanel",
      "<ManualApprovalRecordingDraftReviewStatusPanel",
      "<ManualApprovalRecordStatusPanel",
      "<ManualApprovalDispatchGateReadinessPanel",
      "<ManualDispatchGateOpenRecordStatusPanel",
      "<ManualRuntimeCommandPreviewRecordStatusPanel",
      "<ManualRuntimeCommandInclusionRecordStatusPanel",
      "<ManualRuntimeCommandExecutionRecordStatusPanel",
      "<ManualTargetMutationReadinessRecordStatusPanel",
      "<ManualTargetMutationRecordStatusPanel",
      "<ManualAdapterDispatchRecordStatusPanel",
      "<ManualKanbanMutationRecordStatusPanel",
      "<ManualNasSaveRecordStatusPanel",
      "<ManualNasKeeperHandoffRecordStatusPanel",
      "<NasKeeperHandoffClaimDryRunStatusPanel",
      "<NasKeeperHandoffAuthorizationRecordStatusPanel",
      "<NasKeeperMacRelayExecutionPayloadPreviewStatusPanel",
      "<NasKeeperExecutionFromPreviewGuardedFailureStatusPanel",
      "<NasKeeperGuardedFailureExecutionStateRecordStatusPanel",
      "<NasKeeperTerminalExecutionStateCompletionReviewPanel",
      "<NasKeeperLastSuccessfulMacRelayWriteStatusPanel",
      "<NasKeeperFreshOneShotOperatorFlowPanel",
      "<NasKeeperFreshOneShotRequestBuilderPanel",
      "<NasKeeperFreshRequestBuilderLedgerPanel",
      "<NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel",
      "<NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel",
      "<NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel",
    ]) {
      const panelIndex = source.indexOf(panel);
      expect(panelIndex).toBeGreaterThan(0);
      expect(panelIndex).toBeLessThan(legacyIndex);
      if ([
        "<ManualDispatchGateOpenRecordStatusPanel",
        "<ManualRuntimeCommandPreviewRecordStatusPanel",
        "<ManualRuntimeCommandInclusionRecordStatusPanel",
        "<ManualRuntimeCommandExecutionRecordStatusPanel",
        "<ManualTargetMutationReadinessRecordStatusPanel",
        "<ManualTargetMutationRecordStatusPanel",
        "<ManualAdapterDispatchRecordStatusPanel",
        "<ManualKanbanMutationRecordStatusPanel",
        "<ManualNasSaveRecordStatusPanel",
        "<ManualNasKeeperHandoffRecordStatusPanel",
      "<NasKeeperHandoffClaimDryRunStatusPanel",
      "<NasKeeperHandoffAuthorizationRecordStatusPanel",
      "<NasKeeperMacRelayExecutionPayloadPreviewStatusPanel",
      "<NasKeeperExecutionFromPreviewGuardedFailureStatusPanel",
      "<NasKeeperGuardedFailureExecutionStateRecordStatusPanel",
      "<NasKeeperTerminalExecutionStateCompletionReviewPanel",
      "<NasKeeperLastSuccessfulMacRelayWriteStatusPanel",
      "<NasKeeperFreshOneShotOperatorFlowPanel",
      "<NasKeeperFreshOneShotRequestBuilderPanel",
      "<NasKeeperFreshRequestBuilderLedgerPanel",
      "<NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel",
      "<NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel",
      "<NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel",
      ].includes(panel)) {
        expect(source.indexOf(panel, panelIndex + 1)).toBe(-1);
      }
    }
  });

  it("renders downstream consumption payload materialization summary review gate record readback review attestation readback as metadata-only and display-only", () => {
    const readback = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified",
        payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified: true,
        source_readback_review_attestation_verified: true,
        attestation_checksum_verified: true,
        source_review_record_checksum_verified: true,
        safe_ref_chain_verified: true,
        manual_attestation_outcome_verified: true,
        attestation_actor_verified: true,
        disabled_capability_flags_verified: true,
        readback_review_attestation_ref: "readbackreview-20260523035000-smoke0001",
        summary_review_gate_record_readback_review_record_ref: "reviewrecord-20260523031000-smoke0001",
        summary_review_gate_record_readback_review_record_sha256: "1".repeat(64),
        payload_materialization_summary_review_gate_record_sha256: "2".repeat(64),
        readback_review_attestation_sha256: "3".repeat(64),
        manual_attestation_outcome: "attested_for_manual_review_only_no_consumption",
        readback_verified: true,
        source_checksum_attested: true,
        safe_ref_chain_attested: true,
        aggregate_counts_attested: true,
        disabled_capabilities_attested: true,
        attested_by: "operator:smoke",
        attested_at: "2026-05-23T03:50:00Z",
        evidence_ref_count: 2,
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackPanel record={readback} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-vps-nas-authority="false"');
    expect(html).toContain("readbackreview-20260523035000-smoke0001");
    expect(html).toContain("attestation_checksum_verified");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders payload attestation readback-review panel as display-only metadata", () => {
    const review = {
      found: true,
      errors: [],
      record_count: 1,
      records: [],
      latest_record: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review",
        payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviewed: true,
        source_attestation_readback_verified: true,
        readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523051200-smoke0001",
        readback_review_attestation_ref: "readbackreview-20260523035000-smoke0001",
        readback_review_attestation_sha256: "3".repeat(64),
        summary_review_gate_record_readback_review_record_ref: "reviewrecord-20260523024000-smoke0001",
        manual_review_outcome: "reviewed_attestation_readback_for_manual_only_no_consumption",
        attestation_readback_verified: true,
        source_checksum_reviewed: true,
        safe_ref_chain_reviewed: true,
        disabled_capabilities_reviewed: true,
        reviewed_by: "operator:smoke",
        reviewed_at: "2026-05-23T05:12:00Z",
        attestation_readback_review_sha256: "4".repeat(64),
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewsResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewPanel record={review} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-vps-nas-authority="false"');
    expect(html).toContain("attestationreadbackreview-20260523051200-smoke0001");
    expect(html).toContain("reviewed_attestation_readback_for_manual_only_no_consumption");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });


});

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

    const selectedEntity = scene.entities[0];
    const markup = renderToStaticMarkup(<OfficeRpgMap scene={scene} onInspectEntity={() => undefined} selectedEntityId={selectedEntity.id} />);

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
    expect(markup).toContain("data-office-rpg-visual-map=\"true\"");
    expect(markup).toContain("data-office-rpg-primary-view=\"true\"");
    expect(markup.indexOf("data-office-rpg-visual-map=\"true\"")).toBeLessThan(markup.indexOf("data-office-rpg-mission-storyboard=\"true\""));
    expect(markup).toContain("data-office-rpg-map-svg=\"true\"");
    expect(markup).toContain("data-office-rpg-map-path=\"command-to-board\"");
    expect(markup).toContain("data-office-rpg-map-door=\"command-agent_desks\"");
    expect(markup).toContain("data-office-rpg-map-furniture=\"central-board\"");
    expect(markup).toContain("data-office-rpg-character-sprite");
    expect(scene.entities.length).toBeLessThanOrEqual(8);
    expect(markup.match(/data-office-rpg-character-sprite=/g)?.length).toBe(scene.entities.length);
    expect(markup).toContain("data-office-rpg-character-overlap-index");
    expect(markup).toContain("data-office-rpg-character-density-tier");
    expect(markup).toContain("data-office-rpg-character-density-tier=\"compact\"");
    expect(markup).toContain("data-office-rpg-character-density-room=\"task_board\"");
    expect(markup).toContain("data-office-rpg-character-kind=\"orchestrator\"");
    expect(markup).toContain("data-office-rpg-character-kind=\"search_worker\"");
    expect(markup).toContain("data-office-rpg-character-kind=\"nas_keeper\"");
    expect(markup).toContain("data-office-rpg-character-label-slot");
    expect(markup).toContain("data-office-rpg-character-nameplate");
    expect(markup).toContain("data-office-rpg-character-label-anchor");
    expect(markup).toContain("data-office-rpg-character-keyboard-target=\"true\"");
    expect(markup).toContain("aria-keyshortcuts=\"Enter Space\"");
    expect(markup).toContain("data-office-rpg-character-selection-halo");
    expect(markup).toContain("data-office-rpg-selected-inspector-anchor=\"#office-safe-inspector\"");
    expect(markup).toContain("data-office-rpg-keyboard-help=\"true\"");
    expect(markup).toContain("Enter/Space");
    expect(markup).toContain("data-office-rpg-character-bubble");
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
    expect(markup).toContain("data-office-rpg-legacy-fallback-map=\"true\"");
    expect(markup).toContain("보조 격자 지도");
    expect(markup.match(/data-office-rpg-fallback-row=/g)?.length).toBe(scene.entities.length);
    expect(markup).toContain("최근 안전 이벤트");
    expect(markup).not.toMatch(/raw prompt|raw transcript|raw task|secret body|raw token|raw warning|\/Users\/lidises|private-model/i);
  });

  it("builds a read-only runtime fan-out drill-down from aggregate scene counts", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      agents: Array.from({ length: 7 }, (_, index) => ({
        id: `agent-${index}`,
        status: "active",
        prompt: "raw fanout prompt must not leak",
        provider: "private-fanout-provider",
        api_key: "token-shaped-fanout-sentinel",
      })),
      work_items: [
        { id: "task-1", status: "blocked", title: "raw fanout task", body: "/Users/lidises/private/fanout.md" } as unknown as OfficeState["work_items"][number],
        { id: "task-2", status: "done", transcript: "raw fanout transcript" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "job-1", state: "scheduled", last_status: "ok", script: "/Users/lidises/private/cron.py" } as unknown as OfficeState["automations"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-20T09:00:00Z", item_count: 3, warning_count: 1, error_summary: "raw source failure" },
        { id: "kanban", status: "ok", checked_at: "2026-05-20T09:01:00Z", item_count: 2, warning_count: 0 },
      ],
    }));

    const drilldown = buildOfficeRpgRuntimeFanoutDrilldown(scene);

    expect(drilldown.stageLabel).toBe("Desk RPG Runtime Fan-out Drill-down 1");
    expect(drilldown.visibleActorCount).toBe(8);
    expect(drilldown.hiddenRuntimeCount).toBe(4);
    expect(drilldown.enabledControls).toBe(0);
    expect(drilldown.assignmentEnabled).toBe(false);
    expect(drilldown.dispatchEnabled).toBe(false);
    expect(drilldown.backendWriteEnabled).toBe(false);
    expect(drilldown.rawExcluded).toBe(true);
    expect(drilldown.lanes.map((lane) => lane.id)).toEqual(["representative_actors", "hidden_workers", "board_rows", "automation_rows", "source_rows"]);
    expect(drilldown.lanes.find((lane) => lane.id === "hidden_workers")?.count).toBe(4);
    expect(drilldown.inspectorDetails.map((detail) => detail.laneId)).toEqual(["representative_actors", "hidden_workers", "board_rows", "automation_rows", "source_rows"]);
    expect(drilldown.inspectorDetails.find((detail) => detail.laneId === "hidden_workers")?.suppressedCount).toBe(4);
    expect(drilldown.inspectorDetails.every((detail) => detail.safeProjectionOnly && !detail.rawRowsVisible && !detail.writeEnabled)).toBe(true);
    expect(JSON.stringify(drilldown)).not.toMatch(/raw fanout|\/Users\/lidises|token-shaped-fanout-sentinel|private-fanout-provider/i);
  });


  it("renders the runtime fan-out drill-down as aggregate-only read-only rows with inspector details", () => {
    const scene = buildOfficeRpgScene(officeFixture({
      agents: Array.from({ length: 7 }, (_, index) => ({ id: `agent-${index}`, status: "active", prompt: "raw panel prompt", provider: "private-panel-provider" })),
      work_items: [
        { id: "task-1", status: "blocked", title: "raw panel task", body: "/Users/lidises/private/panel.md" } as unknown as OfficeState["work_items"][number],
      ],
      automations: [
        { id: "job-1", state: "scheduled", last_status: "ok", script: "/Users/lidises/private/panel-cron.py" } as unknown as OfficeState["automations"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-20T09:00:00Z", item_count: 3, warning_count: 1, error_summary: "raw panel source" },
      ],
    }));

    const markup = renderToStaticMarkup(<OfficeRpgMap scene={scene} onInspectEntity={() => undefined} selectedEntityId={null} />);

    const panelStart = markup.indexOf("data-office-rpg-runtime-fanout-drilldown=\"true\"");
    const panelEnd = markup.indexOf("data-office-rpg-filters=\"true\"", panelStart);
    const panelMarkup = markup.slice(panelStart, panelEnd);

    expect(markup).toContain("data-office-rpg-runtime-fanout-drilldown=\"true\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-assignment-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-backend-write-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-hidden-count=\"4\"");
    for (const lane of ["representative_actors", "hidden_workers", "board_rows", "automation_rows", "source_rows"]) {
      expect(markup).toContain(`data-office-rpg-runtime-fanout-lane="${lane}"`);
    }
    expect(markup.match(/data-office-rpg-runtime-fanout-lane=/g)?.length).toBe(5);
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector=\"true\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector-write-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector-detail=\"hidden_workers\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector-suppressed-count=\"4\"");
    expect(markup).toContain("data-office-rpg-runtime-fanout-inspector-raw-rows-visible=\"false\"");
    expect(markup).toContain("스프라이트 증설 금지");
    expect(panelMarkup).not.toMatch(/<form|<button|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/raw panel|\/Users\/lidises|private-panel-provider/i);
  });

  it("renders the Kanban mutation dry-run readiness review as read-only evidence cards", () => {
    const OfficeKanbanMutationDryRunReadinessPanel = (OfficePageModule as unknown as {
      OfficeKanbanMutationDryRunReadinessPanel: React.ComponentType<{ readiness: ReturnType<typeof buildOfficeKanbanProjection>["mutationDryRunReadiness"] }>;
    }).OfficeKanbanMutationDryRunReadinessPanel;
    const projection = buildOfficeKanbanProjection(officeFixture({
      generated_at: "2026-05-20T09:25:00Z",
      rooms: [{ id: "kanban:ai-office", kind: "kanban_board", source: "kanban", display_name: "AI Office", counts: { blocked: 1 } }],
      work_items: [{
        id: "kanban:ai-office:item:0",
        source: "kanban",
        kind: "kanban_task",
        board_id: "ai-office",
        task_ref: "t_readiness_safe",
        title: "raw readiness title must not appear",
        status: "blocked",
        assignee: "office-runner",
        tenant: "ai-office",
        priority: 7,
        parent_task_refs: [],
        child_task_refs: [],
        badges: ["needs_attention"],
        body: "/Users/lidises/private/raw-readiness.md",
        prompt: "raw readiness token must not appear",
      } as unknown as OfficeState["work_items"][number]],
    }));
    const markup = renderToStaticMarkup(<OfficeKanbanMutationDryRunReadinessPanel readiness={projection.mutationDryRunReadiness} />);

    expect(markup).toContain("data-office-kanban-mutation-dry-run-readiness=\"true\"");
    expect(markup).toContain("data-office-kanban-mutation-dry-run-only=\"true\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-kanban-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-execution-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-dry-run-result-write-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-approval-record-write-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-nas-write-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-gateway-restart-enabled=\"false\"");
    expect(markup).toContain("data-office-kanban-mutation-readiness-candidate-ref=\"t_readiness_safe\"");
    expect(markup.match(/data-office-kanban-mutation-readiness-evidence-check=/g)?.length).toBe(6);
    expect(markup.match(/data-office-kanban-mutation-readiness-blocked-capability=/g)?.length).toBe(6);
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/raw readiness|\/Users\/lidises|token|private/i);
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

describe("RpgFanoutApprovalEventBridgePanel", () => {
  it("renders a read-only fanout-to-approval event bridge without controls", () => {
    const RpgFanoutApprovalEventBridgePanel = (OfficePageModule as unknown as {
      RpgFanoutApprovalEventBridgePanel: React.ComponentType<{ bridge: ReturnType<typeof buildOfficeRpgFanoutApprovalEventBridge> }>;
    }).RpgFanoutApprovalEventBridgePanel;
    const secretSentinel = ["token", "shaped", "fanout", "bridge"].join("-");
    const state = officeFixture({
      agents: [
        { id: "agent-1", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-2", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-3", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
        { id: "agent-4", status: "active", prompt: "raw fanout bridge prompt", provider: "private-fanout-provider", api_key: secretSentinel },
      ],
      work_items: [
        { id: "task-1", status: "blocked", title: "raw fanout bridge task", body: "/Users/lidises/private/fanout-bridge.md", transcript: "Traceback fanout bridge transcript" } as unknown as OfficeState["work_items"][number],
      ],
      data_sources: [
        { id: "paperclip", status: "partial", checked_at: "2026-05-14T00:00:00Z", item_count: 13, warning_count: 6, error_summary: "Traceback fanout bridge source" },
      ],
    });
    const projection = buildOfficeDeskRpgProjectionModel(state);
    const scene = buildOfficeRpgScene(state);
    const fanout = buildOfficeRpgRuntimeFanoutDrilldown(scene);
    const dialogue = buildOfficeDisabledApprovalDialoguePosture(projection);
    const posture = buildOfficeBossOrchestratorRequestPostureDetail(projection, dialogue);
    const envelope = buildOfficeOrchestratorRequestEnvelopeDetail(projection, posture);
    const route = buildOfficeApprovalRequestRouteDetail(envelope, dialogue);
    const bridge = buildOfficeRpgFanoutApprovalEventBridge(fanout, route);

    const markup = renderToStaticMarkup(<RpgFanoutApprovalEventBridgePanel bridge={bridge} />);

    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge=\"true\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-request-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-approval-event-creation-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-event-persistence-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-kanban-write-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-dispatch-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-audit-write-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-nas-save-enabled=\"false\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-safe-projection-only=\"true\"");
    expect(markup).toContain("data-office-rpg-fanout-approval-event-bridge-raw-excluded=\"true\"");
    expect(markup.match(/data-office-rpg-fanout-approval-event-bridge-card=/g)?.length).toBe(4);
    expect(markup).toContain("Desk RPG fan-out → approval event bridge");
    expect(markup).toContain("aggregate fan-out → request/approval event gate");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toMatch(/raw fanout bridge prompt|raw fanout bridge task|Traceback|\/Users\/lidises|token-shaped-fanout-bridge|private-fanout-provider/i);
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
        draft={{ relay_request_ref: "relay_req_ui", relay_execution_ref: "relay_exec_ui", write_ref: "write_ui", package_ref: "pkg_ui", target_vault_ref: "vault_personal_wiki_demo", safe_slug: "ai-office-ui-smoke", safe_title: "AI Office UI smoke", markdown_body: "# AI Office UI smoke", requested_by: "agent_nas_keeper", requested_at: "2026-05-17T13:30:00Z", nas_keeper_ref: "agent_nas_keeper", relay_node_ref: "mac_relay_primary", relay_authorized_by: "agent_nas_keeper", relay_authorized_at: "2026-05-17T13:31:00Z" }}
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
    expect(markup).toContain('data-office-nas-runtime-single-file-write-endpoint="/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute"');
    expect(markup).toContain('data-office-nas-mac-relay-write-execute-action="true"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-enabled-controls="1"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-raw-path-input-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-credential-input-enabled="false"');
    expect(markup).toContain('data-office-nas-runtime-single-file-write-mount-path-input-enabled="false"');
    expect(markup).toContain("단일 파일 쓰기");
    expect(markup).toContain("raw 경로/토큰 입력 금지");
    expect(markup).toContain("Mac relay 실행 route");
    expect(markup).toContain('name="safe_slug"');
    expect(markup).toContain('name="relay_request_ref"');
    expect(markup).not.toContain('name="path"');
    expect(markup).not.toContain('name="root"');
    expect(markup).not.toContain('name="mount"');
    expect(markup).not.toContain('name="secret"');
    expect(markup).not.toContain('name="token"');
    expect(markup).not.toMatch(/\/Users\/|\/home\/|sk-|token=|private-provider/i);
  });
});


describe("DispatcherAuthorityMetadataRecordingDraftPanel", () => {
  it("renders safe dry-run result/audit metadata draft without write controls", () => {
    const DispatcherAuthorityMetadataRecordingDraftPanel = (OfficePageModule as unknown as {
      DispatcherAuthorityMetadataRecordingDraftPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DispatcherAuthorityMetadataRecordingDraftPanel>>;
    }).DispatcherAuthorityMetadataRecordingDraftPanel;
    const draft: OfficeDispatcherAuthorityMetadataRecordingDraft = {
      schema_version: 1,
      mode: "dispatcher_authority_metadata_recording_draft",
      ready: true,
      request_id: "req_20260518_dispatcher_dryrun",
      correlation_id: "corr_20260518_dispatcher_dryrun",
      authority_ref: "authority_20260518_status_note",
      dry_run_result_payload: {
        result_id: "dryrun_20260518_dispatcher_metadata",
        safe_summary: "Dispatcher authority dry-run metadata recorded; execution boundary remains closed.",
      },
      audit_payload: {
        audit_id: "audit_20260518_dispatcher_metadata",
        event_kind: "dry_run_result_recorded",
      },
      capabilities: {
        metadata_recording_draft_enabled: true,
        dry_run_result_storage_enabled: false,
        audit_write_enabled: false,
        dry_run_execution_enabled: false,
        adapter_binding_enabled: false,
        target_mutation_enabled: false,
        nas_save_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DispatcherAuthorityMetadataRecordingDraftPanel draft={draft} error={null} />);

    expect(markup).toContain('data-office-dispatcher-authority-metadata-recording-draft="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-recording-draft-ready="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-recording-draft-storage-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-recording-draft-audit-write-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-recording-draft-target-mutation-enabled="false"');
    expect(markup).toContain("dryrun_20260518_dispatcher_metadata");
    expect(markup).toContain("audit_20260518_dispatcher_metadata");
    expect(markup).toContain("manual append only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("button");
    expect(markup).not.toMatch(/\/Users\/|\/home\/|sk-|token=|provider/i);
  });

  it("renders the actual dispatcher metadata append checkpoint readback without execution controls", () => {
    const DispatcherAuthorityMetadataAppendStatusPanel = (OfficePageModule as unknown as {
      DispatcherAuthorityMetadataAppendStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DispatcherAuthorityMetadataAppendStatusPanel>>;
    }).DispatcherAuthorityMetadataAppendStatusPanel;
    const status: OfficeDispatcherAuthorityMetadataAppendStatus = {
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
      capabilities: {
        metadata_append_readback_enabled: true,
        dry_run_result_storage_enabled: true,
        audit_write_enabled: true,
        dry_run_execution_enabled: false,
        adapter_binding_enabled: false,
        target_mutation_enabled: false,
        nas_save_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DispatcherAuthorityMetadataAppendStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-complete="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-readback-enabled="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-storage-enabled="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-audit-write-enabled="true"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-execution-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-metadata-append-status-count="dry_run_results"');
    expect(markup).toContain("dryrun_20260518_1218_dispatcher_metadata_append");
    expect(markup).toContain("audit_20260518_1218_dispatcher_metadata_append");
    expect(markup).toContain("human_reviewed_dispatcher_execution_simulation_boundary");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|\/home\/hermes|token-shaped-append|private-authority-provider/i);
  });

  it("renders the human-reviewed dispatcher execution simulation checkpoint without execution controls", () => {
    const DispatcherExecutionSimulationStatusPanel = (OfficePageModule as unknown as {
      DispatcherExecutionSimulationStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DispatcherExecutionSimulationStatusPanel>>;
    }).DispatcherExecutionSimulationStatusPanel;
    const status: OfficeDispatcherExecutionSimulationStatus = {
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
      capabilities: {
        simulation_status_readback_enabled: true,
        dry_run_execution_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        nas_save_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DispatcherExecutionSimulationStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-dispatcher-execution-simulation-status="true"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-complete="true"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-readback-enabled="true"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-execution-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-execution-simulation-status-count="dry_run_results"');
    expect(markup).toContain("dryrun_20260518_1255_dispatcher_execution_simulation");
    expect(markup).toContain("audit_20260518_1255_dispatcher_execution_simulation");
    expect(markup).toContain("dispatcher_execution_readback_review_only");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|\/home\/hermes|token-shaped-simulation|private-authority-provider/i);
  });

  it("renders dispatcher completion review status without executable controls", () => {
    const DispatcherCompletionReviewStatusPanel = (OfficePageModule as unknown as {
      DispatcherCompletionReviewStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DispatcherCompletionReviewStatusPanel>>;
    }).DispatcherCompletionReviewStatusPanel;
    const status = {
      schema_version: 1,
      mode: "dispatcher_completion_review_status" as const,
      request_id: "req_20260518_1255_dispatcher_execution_simulation",
      correlation_id: "corr_20260518_1255_dispatcher_execution_simulation",
      completion_review_complete: true,
      execution_checkpoint_status: "blocked",
      review_counts: { dry_run_results: 1, audit_events: 1 },
      latest_refs: {
        dry_run_result: "dryrun_20260518_1255_dispatcher_execution_simulation",
        audit: "audit_20260518_1255_dispatcher_execution_simulation",
      },
      completed_lanes: [
        "dispatcher_authority_dry_run_surface",
        "dispatcher_metadata_recording_draft",
        "dispatcher_metadata_append_checkpoint",
        "dispatcher_execution_simulation_status",
      ],
      next_manual_lane: "authority_handoff_completion_review_only",
      capabilities: {
        completion_review_readback_enabled: true,
        dry_run_execution_enabled: false,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        nas_save_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DispatcherCompletionReviewStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-dispatcher-completion-review-status="true"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-complete="true"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-readback-enabled="true"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-execution-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-lane="dispatcher_authority_dry_run_surface"');
    expect(markup).toContain('data-office-dispatcher-completion-review-status-lane="dispatcher_execution_simulation_status"');
    expect(markup).toContain("authority_handoff_completion_review_only");
    expect(markup).toContain("dryrun_20260518_1255_dispatcher_execution_simulation");
    expect(markup).toContain("audit_20260518_1255_dispatcher_execution_simulation");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|\/home\/hermes|token-shaped-completion|private-authority-provider/i);
  });

  it("renders target dispatch contract status without executable controls", () => {
    const TargetDispatchContractStatusPanel = (OfficePageModule as unknown as {
      TargetDispatchContractStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.TargetDispatchContractStatusPanel>>;
    }).TargetDispatchContractStatusPanel;
    const status = {
      schema_version: 1,
      mode: "target_dispatch_contract_status" as const,
      target_dispatch_contract_complete: true,
      source_completion_review_lane: "dispatcher_completion_review_status",
      next_manual_lane: "target_dispatch_runtime_approval_required",
      dispatch_options: ["kanban_comment", "status_note", "read_only_projection"],
      required_dispatch_fields: ["dispatch_ref", "target_ref"],
      allowed_operation_kinds: ["comment", "status_note", "read_only_projection"],
      forbidden_boundaries: ["adapter_dispatch", "target_mutation", "kanban_mutation", "nas_save"],
      capabilities: {
        target_dispatch_contract_readback_enabled: true,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<TargetDispatchContractStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-target-dispatch-contract-status="true"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-complete="true"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-readback-enabled="true"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-raw-excluded="true"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-option="kanban_comment"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-forbidden-boundary="adapter_dispatch"');
    expect(markup).toContain('data-office-target-dispatch-contract-status-field="dispatch_ref"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw target dispatch|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-target-dispatch|provider/i);
  });

  it("renders watcher cron contract status without daemon, cron, or executable controls", () => {
    const WatcherCronContractStatusPanel = (OfficePageModule as unknown as {
      WatcherCronContractStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.WatcherCronContractStatusPanel>>;
    }).WatcherCronContractStatusPanel;
    const status = {
      schema_version: 1,
      mode: "watcher_cron_contract_status" as const,
      watcher_cron_contract_complete: true,
      source_target_dispatch_lane: "target_dispatch_contract_status",
      next_manual_lane: "watcher_cron_runtime_approval_required",
      scheduler_options: ["manual_poll", "operator_trigger", "disabled_cron_draft"],
      required_scheduler_fields: ["schedule_ref", "dispatch_contract_ref"],
      forbidden_boundaries: ["watcher_daemon", "cron_job_activation", "adapter_dispatch", "target_mutation"],
      capabilities: {
        watcher_cron_contract_readback_enabled: true,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<WatcherCronContractStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-watcher-cron-contract-status="true"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-complete="true"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-readback-enabled="true"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-cron-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-raw-excluded="true"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-option="manual_poll"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-forbidden-boundary="watcher_daemon"');
    expect(markup).toContain('data-office-watcher-cron-contract-status-field="schedule_ref"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw watcher cron|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-watcher|provider/i);
  });

  it("renders runtime activation review status with all runtime paths still disabled", () => {
    const RuntimeActivationReviewStatusPanel = (OfficePageModule as unknown as {
      RuntimeActivationReviewStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.RuntimeActivationReviewStatusPanel>>;
    }).RuntimeActivationReviewStatusPanel;
    const status = {
      schema_version: 1,
      mode: "runtime_activation_review_status" as const,
      runtime_activation_review_complete: true,
      source_watcher_cron_lane: "watcher_cron_contract_status",
      next_manual_lane: "runtime_activation_still_disabled",
      reviewed_activation_targets: ["watcher_daemon", "cron_job_activation", "adapter_dispatch", "target_mutation"],
      activation_decisions: {
        watcher_daemon: "disabled_requires_explicit_runtime_approval",
        cron_job_activation: "disabled_requires_explicit_runtime_approval",
        adapter_dispatch: "disabled_requires_explicit_runtime_approval",
        target_mutation: "disabled_requires_explicit_runtime_approval",
      },
      forbidden_boundaries: ["runtime_activation", "vps_file_change", "service_restart", "git_push"],
      capabilities: {
        runtime_activation_review_readback_enabled: true,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<RuntimeActivationReviewStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-runtime-activation-review-status="true"');
    expect(markup).toContain('data-office-runtime-activation-review-status-complete="true"');
    expect(markup).toContain('data-office-runtime-activation-review-status-readback-enabled="true"');
    expect(markup).toContain('data-office-runtime-activation-review-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-cron-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-runtime-activation-review-status-raw-excluded="true"');
    expect(markup).toContain('data-office-runtime-activation-review-status-target="watcher_daemon"');
    expect(markup).toContain('data-office-runtime-activation-review-status-forbidden-boundary="runtime_activation"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw runtime activation|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });
});


describe("NasKeeperQueueManualEvidenceReviewSurfacePanel", () => {
  it("renders runtime preflight status with all activation prerequisites blocked", () => {
    const RuntimePreflightStatusPanel = (OfficePageModule as unknown as {
      RuntimePreflightStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.RuntimePreflightStatusPanel>>;
    }).RuntimePreflightStatusPanel;
    const status = {
      schema_version: 1,
      mode: "runtime_preflight_status" as const,
      runtime_preflight_complete: true,
      source_runtime_activation_lane: "runtime_activation_review_status",
      next_manual_lane: "manual_one_shot_runtime_dry_run",
      preflight_decisions: {
        systemd_unit_draft: "draft_required_not_created",
        cron_schedule_draft: "draft_required_not_installed",
        env_gate: "disabled_by_default_required",
        rollback_disable_command: "required_before_activation",
        target_allowlist: "required_before_dispatch",
        adapter_dry_run: "required_before_dispatch",
        audit_sink: "metadata_only_required_before_dispatch",
      },
      readiness: {
        systemd_unit_ready: false,
        cron_schedule_ready: false,
        env_gate_ready: false,
        rollback_ready: false,
        target_allowlist_ready: false,
        adapter_dry_run_ready: false,
        audit_sink_ready: false,
        runtime_activation_ready: false,
      },
      forbidden_boundaries: ["watcher_daemon_activation", "cron_job_installation", "adapter_dispatch", "target_mutation"],
      capabilities: {
        runtime_preflight_readback_enabled: true,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<RuntimePreflightStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-runtime-preflight-status="true"');
    expect(markup).toContain('data-office-runtime-preflight-status-complete="true"');
    expect(markup).toContain('data-office-runtime-preflight-status-readback-enabled="true"');
    expect(markup).toContain('data-office-runtime-preflight-status-runtime-ready="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-cron-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-runtime-preflight-status-raw-excluded="true"');
    expect(markup).toContain('data-office-runtime-preflight-status-check="systemd_unit_draft"');
    expect(markup).toContain('data-office-runtime-preflight-status-readiness="runtime_activation_ready"');
    expect(markup).toContain('data-office-runtime-preflight-status-forbidden-boundary="watcher_daemon_activation"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw runtime preflight|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual one-shot runtime dry-run status as metadata-only without runtime execution", () => {
    const ManualOneShotRuntimeDryRunStatusPanel = (OfficePageModule as unknown as {
      ManualOneShotRuntimeDryRunStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualOneShotRuntimeDryRunStatusPanel>>;
    }).ManualOneShotRuntimeDryRunStatusPanel;
    const status = {
      schema_version: 1,
      mode: "manual_one_shot_runtime_dry_run_status" as const,
      manual_one_shot_runtime_dry_run_complete: true,
      source_runtime_preflight_lane: "runtime_preflight_status",
      next_manual_lane: "adapter_binding_dry_run_status",
      operator_trigger: {
        trigger_mode: "operator_manual_once",
        repeat_enabled: false,
        watcher_daemon_required: false,
        cron_required: false,
      },
      dry_run_scope: {
        metadata_result_write_allowed: true,
        audit_event_write_allowed: true,
        runtime_command_execution_allowed: false,
        adapter_dispatch_allowed: false,
        target_mutation_allowed: false,
      },
      metadata_envelope: {
        request_ref: "req_manual_runtime_dry_run",
        correlation_ref: "corr_manual_runtime_dry_run",
        dry_run_result_ref: "dryrun_manual_runtime_dry_run",
        audit_event_ref: "audit_manual_runtime_dry_run",
      },
      forbidden_boundaries: ["watcher_daemon_activation", "cron_job_installation", "runtime_command_execution", "target_mutation"],
      capabilities: {
        manual_one_shot_runtime_dry_run_readback_enabled: true,
        metadata_result_write_enabled: true,
        audit_event_write_enabled: true,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        adapter_dispatch_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualOneShotRuntimeDryRunStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status="true"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-complete="true"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-readback-enabled="true"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-metadata-write-enabled="true"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-audit-write-enabled="true"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-cron-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-scope="metadata_result_write_allowed"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-envelope="request_ref"');
    expect(markup).toContain('data-office-manual-one-shot-runtime-dry-run-status-forbidden-boundary="runtime_command_execution"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders adapter binding dry-run status as registry-only without binding, dispatch, or target mutation", () => {
    const AdapterBindingDryRunStatusPanel = (OfficePageModule as unknown as {
      AdapterBindingDryRunStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.AdapterBindingDryRunStatusPanel>>;
    }).AdapterBindingDryRunStatusPanel;
    const status = {
      schema_version: 1,
      mode: "adapter_binding_dry_run_status" as const,
      adapter_binding_dry_run_complete: true,
      source_manual_one_shot_lane: "manual_one_shot_runtime_dry_run_status",
      next_manual_lane: "human_reviewed_single_dispatch_status",
      adapter_registry: {
        registry_readback_enabled: true,
        candidate_adapter_ref: "adapter_candidate_manual_runtime_dry_run",
        binding_mode: "dry_run_only",
        binding_created: false,
        dispatch_created: false,
      },
      binding_scope: {
        adapter_registry_readback_allowed: true,
        binding_plan_metadata_allowed: true,
        adapter_binding_allowed: false,
        adapter_dispatch_allowed: false,
        target_mutation_allowed: false,
      },
      forbidden_boundaries: ["adapter_binding", "adapter_dispatch", "target_mutation"],
      capabilities: {
        adapter_binding_dry_run_readback_enabled: true,
        adapter_registry_readback_enabled: true,
        binding_plan_metadata_enabled: true,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<AdapterBindingDryRunStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-adapter-binding-dry-run-status="true"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-complete="true"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-readback-enabled="true"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-registry-readback-enabled="true"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-plan-metadata-enabled="true"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-binding-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-cron-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-registry="candidate_adapter_ref"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-scope="adapter_binding_allowed"');
    expect(markup).toContain('data-office-adapter-binding-dry-run-status-forbidden-boundary="adapter_dispatch"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw adapter|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders human-reviewed single-dispatch status without dispatch or target mutation", () => {
    const HumanReviewedSingleDispatchStatusPanel = (OfficePageModule as unknown as {
      HumanReviewedSingleDispatchStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.HumanReviewedSingleDispatchStatusPanel>>;
    }).HumanReviewedSingleDispatchStatusPanel;
    const status = {
      schema_version: 1,
      mode: "human_reviewed_single_dispatch_status" as const,
      human_reviewed_single_dispatch_complete: true,
      source_adapter_binding_lane: "adapter_binding_dry_run_status",
      next_manual_lane: "explicit_runtime_dispatch_approval",
      dispatch_candidate: {
        candidate_ref: "dispatch_candidate_human_reviewed_single",
        human_review_required: true,
        human_review_recorded: true,
        single_dispatch_only: true,
        dispatch_created: false,
        target_mutation_created: false,
      },
      approval_requirements: {
        operator_review_required: true,
        adapter_binding_review_required: true,
        target_allowlist_review_required: true,
        rollback_review_required: true,
        runtime_dispatch_approval_granted: false,
      },
      forbidden_boundaries: ["adapter_dispatch", "target_mutation", "runtime_command_execution"],
      capabilities: {
        human_reviewed_single_dispatch_readback_enabled: true,
        dispatch_candidate_metadata_enabled: true,
        approval_requirements_readback_enabled: true,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<HumanReviewedSingleDispatchStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status="true"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-complete="true"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-readback-enabled="true"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-candidate-metadata-enabled="true"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-approval-readback-enabled="true"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-binding-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-cron-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-candidate="candidate_ref"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-approval="runtime_dispatch_approval_granted"');
    expect(markup).toContain('data-office-human-reviewed-single-dispatch-status-forbidden-boundary="adapter_dispatch"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw dispatch|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-dispatch|provider/i);
  });

  it("renders explicit runtime dispatch approval status without dispatch or target mutation", () => {
    const ExplicitRuntimeDispatchApprovalStatusPanel = (OfficePageModule as unknown as {
      ExplicitRuntimeDispatchApprovalStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ExplicitRuntimeDispatchApprovalStatusPanel>>;
    }).ExplicitRuntimeDispatchApprovalStatusPanel;
    const status = {
      schema_version: 1,
      mode: "explicit_runtime_dispatch_approval_status" as const,
      explicit_runtime_dispatch_approval_complete: true,
      source_human_review_lane: "human_reviewed_single_dispatch_status",
      next_manual_lane: "concrete_runtime_single_dispatch_slice",
      approval_status: {
        explicit_runtime_dispatch_approval_recorded: false,
        operator_final_approval_required: true,
        single_dispatch_scope_locked: true,
        target_allowlist_locked: false,
        rollback_plan_locked: false,
        dry_run_evidence_locked: false,
        automation_activation_requested: false,
      },
      runtime_boundary: {
        runtime_dispatch_ready: false,
        adapter_dispatch_created: false,
        target_mutation_created: false,
        watcher_or_cron_created: false,
        approval_status_only: true,
      },
      forbidden_boundaries: ["adapter_dispatch", "target_mutation", "watcher_daemon_activation"],
      capabilities: {
        explicit_runtime_dispatch_approval_readback_enabled: true,
        approval_criteria_readback_enabled: true,
        runtime_boundary_readback_enabled: true,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ExplicitRuntimeDispatchApprovalStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status="true"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-complete="true"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-readback-enabled="true"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-criteria-readback-enabled="true"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-runtime-boundary-readback-enabled="true"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-binding-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-dispatch-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-watcher-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-cron-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-kanban-mutation-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-nas-save-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-vps-file-change-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-service-restart-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-git-push-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-credential-access-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-public-exposure-enabled="false"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-approval="explicit_runtime_dispatch_approval_recorded"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-runtime-boundary="runtime_dispatch_ready"');
    expect(markup).toContain('data-office-explicit-runtime-dispatch-approval-status-forbidden-boundary="adapter_dispatch"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw runtime|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders concrete runtime single-dispatch slice design without dispatch or target mutation", () => {
    const ConcreteRuntimeSingleDispatchSliceDesignPanel = (OfficePageModule as unknown as {
      ConcreteRuntimeSingleDispatchSliceDesignPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ConcreteRuntimeSingleDispatchSliceDesignPanel>>;
    }).ConcreteRuntimeSingleDispatchSliceDesignPanel;
    const status = {
      schema_version: 1,
      mode: "concrete_runtime_single_dispatch_slice_design" as const,
      concrete_runtime_single_dispatch_slice_design_complete: true,
      source_approval_lane: "explicit_runtime_dispatch_approval_status",
      next_manual_lane: "approved_one_shot_runtime_dispatch",
      one_shot_envelope: {
        single_dispatch_only: true,
        operator_confirmation_required: true,
        runtime_dispatch_created: false,
        runtime_command_included: false,
        adapter_dispatch_created: false,
        target_mutation_created: false,
      },
      target_allowlist: {
        allowlist_required: true,
        allowlist_locked: false,
        opaque_target_refs_only: true,
        raw_paths_excluded: true,
      },
      rollback_plan: {
        rollback_required: true,
        disable_command_required: true,
        rollback_verified: false,
        service_restart_required: false,
      },
      dry_run_evidence_requirements: {
        dry_run_result_required: true,
        audit_event_required: true,
        human_review_required: true,
        evidence_locked: false,
      },
      idempotency: {
        idempotency_key_required: true,
        idempotency_key_issued: false,
        repeat_dispatch_blocked: true,
      },
      disabled_runtime_gate: {
        disabled_by_default: true,
        runtime_gate_open: false,
        automation_activation_requested: false,
        watcher_or_cron_allowed: false,
      },
      forbidden_boundaries: ["adapter_dispatch", "target_mutation", "runtime_command_execution"],
      capabilities: {
        single_dispatch_slice_design_readback_enabled: true,
        one_shot_envelope_metadata_enabled: true,
        target_allowlist_readback_enabled: true,
        rollback_plan_readback_enabled: true,
        dry_run_evidence_requirements_readback_enabled: true,
        idempotency_key_readback_enabled: true,
        disabled_runtime_gate_readback_enabled: true,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ConcreteRuntimeSingleDispatchSliceDesignPanel status={status} error={null} />);

    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-complete="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-readback-enabled="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-envelope-enabled="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-target-allowlist-enabled="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-rollback-enabled="true"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-dispatch-enabled="false"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-watcher-enabled="false"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-cron-enabled="false"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-envelope="single_dispatch_only"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-target-allowlist="allowlist_required"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-rollback="rollback_required"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-evidence="dry_run_result_required"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-idempotency="idempotency_key_required"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-runtime-gate="disabled_by_default"');
    expect(markup).toContain('data-office-concrete-runtime-single-dispatch-slice-design-forbidden-boundary="adapter_dispatch"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual approval-recording preflight status without executable controls", () => {
    const ManualApprovalRecordingPreflightStatusPanel = (OfficePageModule as unknown as {
      ManualApprovalRecordingPreflightStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualApprovalRecordingPreflightStatusPanel>>;
    }).ManualApprovalRecordingPreflightStatusPanel;
    const status = {
      schema_version: 1,
      mode: "manual_approval_recording_preflight_status" as const,
      manual_approval_recording_preflight_complete: true,
      source_design_lane: "approved_real_one_shot_dispatch_gate_design",
      next_manual_lane: "manual_real_approval_recording",
      preflight_contract: {
        approval_record_shape_required: true,
        exact_target_allowlist_ref_required: true,
        idempotency_key_required: true,
        replay_lookup_required: true,
        rollback_disable_ref_required: true,
        rollback_readiness_required: true,
        dry_run_evidence_ref_required: true,
        operator_final_confirmation_required: true,
        refusal_only_default: true,
      },
      execution_boundary: {
        preflight_only: true,
        approval_record_written: false,
        dispatch_gate_open: false,
        runtime_command_executed: false,
        target_mutation_created: false,
      },
      capabilities: {
        manual_approval_recording_preflight_readback_enabled: true,
        approval_recording_enabled: false,
        real_dispatch_execution_enabled: false,
        idempotency_replay_store_write_enabled: false,
        target_mutation_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualApprovalRecordingPreflightStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-approval-recording-preflight="true"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-complete="true"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-readback-enabled="true"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-approval-recording-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-contract="approval_record_shape_required"');
    expect(markup).toContain('data-office-manual-approval-recording-preflight-boundary="approval_record_written"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual approval-recording draft status as draft-only readback", () => {
    const ManualApprovalRecordingDraftStatusPanel = (OfficePageModule as unknown as {
      ManualApprovalRecordingDraftStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualApprovalRecordingDraftStatusPanel>>;
    }).ManualApprovalRecordingDraftStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_approval_recording_drafts_readback" as const,
      draft_count: 1,
      limit: 10,
      skipped_count: 0,
      drafts: [],
      latest_refs: { approval_record_ref: "approval-office-dispatch-1", idempotency_key: "idem-office-dispatch-1" },
      capabilities: {
        approval_record_draft_storage_enabled: true,
        approval_record_draft_readback_enabled: true,
        approval_recording_enabled: false,
        dispatch_gate_open: false,
        real_dispatch_execution_enabled: false,
        idempotency_replay_store_write_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualApprovalRecordingDraftStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-approval-recording-draft-status="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-count="1"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-storage-enabled="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-readback-enabled="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-approval-recording-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-dispatch-gate-open="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-real-dispatch-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-latest-ref="approval_record_ref"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual approval-recording draft review status without real write controls", () => {
    const ManualApprovalRecordingDraftReviewStatusPanel = (OfficePageModule as unknown as {
      ManualApprovalRecordingDraftReviewStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualApprovalRecordingDraftReviewStatusPanel>>;
    }).ManualApprovalRecordingDraftReviewStatusPanel;
    const status = {
      schema_version: 1,
      mode: "manual_approval_recording_draft_review_status" as const,
      manual_approval_recording_draft_review_complete: true,
      source_design_lane: "manual_approval_recording_draft_persistence",
      next_manual_lane: "separate_real_approval_record_write_gate",
      review: {
        draft_present: true,
        draft_status: "draft_only",
        approval_record_ref: "approval-office-dispatch-1",
        ready_for_manual_operator_review: true,
        ready_for_real_approval_record_write: false,
      },
      readback: { draft_count: 1 },
      execution_boundary: {
        review_status_only: true,
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
    };

    const markup = renderToStaticMarkup(<ManualApprovalRecordingDraftReviewStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-approval-recording-draft-review-status="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-complete="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-draft-present="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-manual-review-ready="true"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-real-write-ready="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-approval-recording-enabled="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-dispatch-gate-open="false"');
    expect(markup).toContain('data-office-manual-approval-recording-draft-review-boundary="approval_record_written"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual approval record status with write recorded but dispatch still closed", () => {
    const ManualApprovalRecordStatusPanel = (OfficePageModule as unknown as {
      ManualApprovalRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualApprovalRecordStatusPanel>>;
    }).ManualApprovalRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_approval_records_readback" as const,
      approval_record_count: 1,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_approval_record" as const,
          approval_status: "recorded_manual_approval" as const,
          approval_record_ref: "approval-office-dispatch-1",
          approval_record_written: true as const,
          dispatch_gate_open: false as const,
          runtime_command_executed: false as const,
          target_mutation_created: false as const,
          capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
          redaction: { raw_excluded: true },
        },
      ],
      latest_refs: { approval_record_ref: "approval-office-dispatch-1" },
      capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualApprovalRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-approval-record-status="true"');
    expect(markup).toContain('data-office-manual-approval-record-count="1"');
    expect(markup).toContain('data-office-manual-approval-record-written="true"');
    expect(markup).toContain('data-office-manual-approval-record-dispatch-gate-open="false"');
    expect(markup).toContain('data-office-manual-approval-record-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders approval-event envelope metadata without executable controls", () => {
    const ApprovalEventEnvelopeStatusPanel = (OfficePageModule as unknown as {
      ApprovalEventEnvelopeStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ApprovalEventEnvelopeStatusPanel>>;
    }).ApprovalEventEnvelopeStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_approval_event_envelopes_readback" as const,
      approval_event_envelope_count: 1,
      records: [
        {
          schema_version: 1,
          mode: "stored_approval_event_envelope" as const,
          event_status: "approval_event_envelope_metadata_recorded" as const,
          approval_event_ref: "event-office-approval-1",
          approval_record_ref: "approval-office-dispatch-1",
          event_envelope_ref: "envelope-office-approval-1",
          approval_record_written: true,
          approval_event_envelope_written: true as const,
          dispatch_gate_open: false as const,
          runtime_command_executed: false as const,
          target_mutation_created: false as const,
          kanban_mutation_created: false as const,
          nas_save_created: false as const,
          capabilities: { approval_event_envelope_storage_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false },
          redaction: { raw_excluded: true },
        },
      ],
      latest_refs: { approval_event_ref: "event-office-approval-1", approval_record_ref: "approval-office-dispatch-1", event_envelope_ref: "envelope-office-approval-1" },
      capabilities: { approval_event_envelope_readback_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ApprovalEventEnvelopeStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-approval-event-envelope-status="true"');
    expect(markup).toContain('data-office-approval-event-envelope-count="1"');
    expect(markup).toContain('data-office-approval-event-envelope-written="true"');
    expect(markup).toContain('data-office-approval-event-envelope-dispatch-gate-open="false"');
    expect(markup).toContain('data-office-approval-event-envelope-real-dispatch-enabled="false"');
    expect(markup).toContain('data-office-approval-event-envelope-kanban-enabled="false"');
    expect(markup).toContain('data-office-approval-event-envelope-nas-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual approval dispatch gate readiness with dispatch still closed", () => {
    const ManualApprovalDispatchGateReadinessPanel = (OfficePageModule as unknown as {
      ManualApprovalDispatchGateReadinessPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualApprovalDispatchGateReadinessPanel>>;
    }).ManualApprovalDispatchGateReadinessPanel;
    const status = {
      schema_version: 1,
      mode: "manual_approval_dispatch_gate_readiness_status" as const,
      manual_approval_dispatch_gate_readiness_complete: true,
      readiness: {
        approval_record_present: true,
        approval_record_written: true,
        ready_for_dispatch_gate_open: false,
        ready_for_runtime_dispatch_execution: false,
        exact_target_allowlist_ref: "allowlist-office-target-1",
      },
      execution_boundary: { dispatch_gate_open: false, runtime_command_included: false, runtime_command_executed: false, target_mutation_created: false, kanban_mutation_created: false, nas_save_created: false },
      capabilities: { approval_recording_enabled: true, dispatch_gate_open: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualApprovalDispatchGateReadinessPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-status="true"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-complete="true"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-approval-record-present="true"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-ready-for-gate-open="false"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-runtime-execution-ready="false"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-dispatch-gate-open="false"');
    expect(markup).toContain('data-office-manual-approval-dispatch-gate-readiness-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual dispatch gate open record with runtime still disabled", () => {
    const ManualDispatchGateOpenRecordStatusPanel = (OfficePageModule as unknown as {
      ManualDispatchGateOpenRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualDispatchGateOpenRecordStatusPanel>>;
    }).ManualDispatchGateOpenRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_dispatch_gate_open_records_readback" as const,
      dispatch_gate_open_record_count: 1,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_dispatch_gate_open_record" as const,
          dispatch_gate_ref: "gate-office-dispatch-1",
          approval_record_ref: "approval-office-dispatch-1",
          dispatch_gate_open: true,
          runtime_command_included: false,
          runtime_command_executed: false,
          target_mutation_created: false,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { dispatch_gate_open: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualDispatchGateOpenRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-dispatch-gate-open-record-status="true"');
    expect(markup).toContain('data-office-manual-dispatch-gate-open-record-count="1"');
    expect(markup).toContain('data-office-manual-dispatch-gate-open-record-gate-open="true"');
    expect(markup).toContain('data-office-manual-dispatch-gate-open-record-runtime-executed="false"');
    expect(markup).toContain('data-office-manual-dispatch-gate-open-record-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual runtime command preview record without command execution", () => {
    const ManualRuntimeCommandPreviewRecordStatusPanel = (OfficePageModule as unknown as {
      ManualRuntimeCommandPreviewRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualRuntimeCommandPreviewRecordStatusPanel>>;
    }).ManualRuntimeCommandPreviewRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_runtime_command_preview_records_readback" as const,
      runtime_command_preview_record_count: 1,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_runtime_command_preview_record" as const,
          dispatch_gate_ref: "gate-office-dispatch-1",
          runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
          command_envelope_ref: "envelope-office-dispatch-1",
          command_intent_ref: "intent-office-dispatch-1",
          runtime_command_preview_created: true,
          runtime_command_preview_checksum_sha256: "a".repeat(64),
          runtime_command_included: false,
          runtime_command_executed: false,
          target_mutation_created: false,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { runtime_command_preview_enabled: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false },
      redaction: { raw_command_excluded: true, command_args_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualRuntimeCommandPreviewRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-runtime-command-preview-record-status="true"');
    expect(markup).toContain('data-office-manual-runtime-command-preview-record-count="1"');
    expect(markup).toContain('data-office-manual-runtime-command-preview-created="true"');
    expect(markup).toContain('data-office-manual-runtime-command-preview-executed="false"');
    expect(markup).toContain('data-office-manual-runtime-command-preview-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual runtime command inclusion record without command execution", () => {
    const ManualRuntimeCommandInclusionRecordStatusPanel = (OfficePageModule as unknown as {
      ManualRuntimeCommandInclusionRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualRuntimeCommandInclusionRecordStatusPanel>>;
    }).ManualRuntimeCommandInclusionRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_runtime_command_inclusion_records_readback" as const,
      runtime_command_inclusion_record_count: 1,
      limit: 10,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_runtime_command_inclusion_record" as const,
          runtime_command_preview_ref: "cmdpreview-office-dispatch-1",
          runtime_command_ref: "cmd-office-dispatch-1",
          command_kind: "office_controlled_mutation_single_dispatch_noop_probe" as const,
          command_body: { target_ref: "target-office-dispatch-1", dry_run_evidence_ref: "dryrun-office-dispatch-1", rollback_disable_ref: "rollback-office-dispatch-1" },
          runtime_command_body_checksum_sha256: "b".repeat(64),
          runtime_command_included: true,
          runtime_command_executed: false,
          target_mutation_created: false,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { runtime_command_included: true, runtime_command_execution_enabled: false, real_dispatch_execution_enabled: false, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false },
      redaction: { shell_command_excluded: true, credentials_echoed: false },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualRuntimeCommandInclusionRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-runtime-command-inclusion-record-status="true"');
    expect(markup).toContain('data-office-manual-runtime-command-inclusion-record-count="1"');
    expect(markup).toContain('data-office-manual-runtime-command-included="true"');
    expect(markup).toContain('data-office-manual-runtime-command-inclusion-executed="false"');
    expect(markup).toContain('data-office-manual-runtime-command-inclusion-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/shell command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual runtime command execution record as executed noop without target mutation controls", () => {
    const ManualRuntimeCommandExecutionRecordStatusPanel = (OfficePageModule as unknown as {
      ManualRuntimeCommandExecutionRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualRuntimeCommandExecutionRecordStatusPanel>>;
    }).ManualRuntimeCommandExecutionRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_runtime_command_execution_records_readback" as const,
      runtime_command_execution_record_count: 1,
      limit: 10,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_runtime_command_execution_record" as const,
          runtime_command_ref: "cmd-office-dispatch-1",
          runtime_execution_ref: "exec-office-dispatch-1",
          idempotency_key: "idem-office-dispatch-1",
          runtime_execution_result: "noop_probe_succeeded" as const,
          runtime_command_executed: true,
          idempotency_replay_store_written: true,
          target_mutation_created: false,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { runtime_command_execution_enabled: true, idempotency_replay_store_write_enabled: true, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false, real_dispatch_execution_enabled: false },
      redaction: { shell_command_excluded: true, credentials_echoed: false },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualRuntimeCommandExecutionRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-runtime-command-execution-record-status="true"');
    expect(markup).toContain('data-office-manual-runtime-command-execution-record-count="1"');
    expect(markup).toContain('data-office-manual-runtime-command-executed="true"');
    expect(markup).toContain('data-office-manual-runtime-command-execution-target-mutated="false"');
    expect(markup).toContain('data-office-manual-runtime-command-execution-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/shell command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders manual target mutation readiness record as verified without target mutation controls", () => {
    const ManualTargetMutationReadinessRecordStatusPanel = (OfficePageModule as unknown as {
      ManualTargetMutationReadinessRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualTargetMutationReadinessRecordStatusPanel>>;
    }).ManualTargetMutationReadinessRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_target_mutation_readiness_records_readback" as const,
      target_mutation_readiness_record_count: 1,
      limit: 10,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_target_mutation_readiness_record" as const,
          runtime_execution_ref: "exec-office-dispatch-1",
          target_mutation_readiness_ref: "targetready-office-dispatch-1",
          exact_target_allowlist_ref: "allowlist-office-target-1",
          target_ref: "target-office-dispatch-1",
          target_mutation_readiness_verified: true,
          exact_target_allowlist_verified: true,
          runtime_command_executed: true,
          target_mutation_created: false,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { target_mutation_readiness_enabled: true, target_mutation_enabled: false, kanban_mutation_enabled: false, nas_save_enabled: false, real_dispatch_execution_enabled: false },
      redaction: { raw_target_excluded: true, credentials_echoed: false },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualTargetMutationReadinessRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-target-mutation-readiness-record-status="true"');
    expect(markup).toContain('data-office-manual-target-mutation-readiness-record-count="1"');
    expect(markup).toContain('data-office-manual-target-mutation-readiness-verified="true"');
    expect(markup).toContain('data-office-manual-target-mutation-readiness-target-mutated="false"');
    expect(markup).toContain('data-office-manual-target-mutation-readiness-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw target|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-target|provider/i);
  });

  it("renders manual target mutation record as mutated target without kanban or nas controls", () => {
    const ManualTargetMutationRecordStatusPanel = (OfficePageModule as unknown as {
      ManualTargetMutationRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualTargetMutationRecordStatusPanel>>;
    }).ManualTargetMutationRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_target_mutation_records_readback" as const,
      target_mutation_record_count: 1,
      limit: 10,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_target_mutation_record" as const,
          target_mutation_readiness_ref: "targetready-office-dispatch-1",
          target_mutation_ref: "targetmut-office-dispatch-1",
          target_ref: "target-office-dispatch-1",
          target_mutation_created: true,
          target_mutation_result: "safe_target_marker_written" as const,
          target_mutation_readiness_verified: true,
          exact_target_allowlist_verified: true,
          runtime_command_executed: true,
          idempotency_replay_store_written: true,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { target_mutation_enabled: true, kanban_mutation_enabled: false, nas_write_enabled: false, real_dispatch_execution_enabled: false },
      redaction: { raw_target_excluded: true, credentials_echoed: false },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualTargetMutationRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-target-mutation-record-status="true"');
    expect(markup).toContain('data-office-manual-target-mutation-record-count="1"');
    expect(markup).toContain('data-office-manual-target-mutation-created="true"');
    expect(markup).toContain('data-office-manual-target-mutation-kanban-created="false"');
    expect(markup).toContain('data-office-manual-target-mutation-nas-created="false"');
    expect(markup).toContain('data-office-manual-target-mutation-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw target|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-target|provider/i);
  });

  it("renders manual adapter dispatch record as adapter-dispatched without kanban or nas controls", () => {
    const ManualAdapterDispatchRecordStatusPanel = (OfficePageModule as unknown as {
      ManualAdapterDispatchRecordStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ManualAdapterDispatchRecordStatusPanel>>;
    }).ManualAdapterDispatchRecordStatusPanel;
    const status = {
      schema_version: 1,
      mode: "stored_manual_adapter_dispatch_records_readback" as const,
      adapter_dispatch_record_count: 1,
      limit: 10,
      records: [
        {
          schema_version: 1,
          mode: "stored_manual_adapter_dispatch_record" as const,
          target_mutation_ref: "targetmut-office-dispatch-1",
          adapter_dispatch_ref: "adapterdispatch-office-dispatch-1",
          adapter_ref: "adapter-office-dispatch-1",
          target_mutation_created: true,
          adapter_dispatch_created: true,
          adapter_dispatch_result: "safe_adapter_dispatch_marker_written" as const,
          kanban_mutation_created: false,
          nas_save_created: false,
          real_dispatch_execution_enabled: false,
        },
      ],
      capabilities: { adapter_dispatch_enabled: true, kanban_mutation_enabled: false, nas_write_enabled: false, real_dispatch_execution_enabled: false },
      redaction: { provider_excluded: true, credentials_echoed: false },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ManualAdapterDispatchRecordStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-manual-adapter-dispatch-record-status="true"');
    expect(markup).toContain('data-office-manual-adapter-dispatch-record-count="1"');
    expect(markup).toContain('data-office-manual-adapter-dispatch-created="true"');
    expect(markup).toContain('data-office-manual-adapter-dispatch-kanban-created="false"');
    expect(markup).toContain('data-office-manual-adapter-dispatch-nas-created="false"');
    expect(markup).toContain('data-office-manual-adapter-dispatch-real-dispatch-enabled="false"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw adapter|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-provider|provider/i);
  });

  it("renders manual Kanban mutation record as Kanban-mutated without NAS controls", () => {
    const ManualKanbanMutationRecordStatusPanel = (OfficePageModule as unknown as {
      ManualKanbanMutationRecordStatusPanel: React.ComponentType<{ status: unknown; error?: string | null }>;
    }).ManualKanbanMutationRecordStatusPanel;
    expect(ManualKanbanMutationRecordStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <ManualKanbanMutationRecordStatusPanel
        error={null}
        status={{
          schema_version: 1,
          mode: "stored_manual_kanban_mutation_records_readback",
          kanban_mutation_record_count: 1,
          records: [
            {
              schema_version: 1,
              mode: "stored_manual_kanban_mutation_record",
              adapter_dispatch_ref: "adapterdispatch-office-dispatch-1",
              kanban_mutation_ref: "kanbanmut-office-dispatch-1",
              kanban_card_ref: "card-office-dispatch-1",
              kanban_mutation_created: true,
              kanban_mutation_result: "safe_kanban_marker_written" as const,
              adapter_dispatch_created: true,
              nas_save_created: false,
              real_dispatch_execution_enabled: false,
            },
          ],
          capabilities: {
            kanban_mutation_enabled: true,
            nas_write_enabled: false,
            real_dispatch_execution_enabled: false,
          },
          redaction: { raw_kanban_payload_excluded: true, credentials_echoed: false },
        }}
      />,
    );

    expect(html).toContain('data-office-manual-kanban-mutation-record-status="true"');
    expect(html).toContain('data-office-manual-kanban-mutation-created="true"');
    expect(html).toContain('data-office-manual-kanban-mutation-nas-created="false"');
    expect(html).toContain("Kanban mutated · NAS still closed");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders manual NAS save record as saved while direct VPS NAS authority stays closed", () => {
    const ManualNasSaveRecordStatusPanel = (OfficePageModule as unknown as {
      ManualNasSaveRecordStatusPanel: React.ComponentType<{ status: unknown; error?: string | null }>;
    }).ManualNasSaveRecordStatusPanel;
    expect(ManualNasSaveRecordStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <ManualNasSaveRecordStatusPanel
        error={null}
        status={{
          schema_version: 1,
          mode: "stored_manual_nas_save_records_readback",
          nas_save_record_count: 1,
          records: [
            {
              schema_version: 1,
              mode: "stored_manual_nas_save_record",
              kanban_mutation_ref: "kanbanmut-office-dispatch-1",
              nas_save_ref: "nassave-office-dispatch-1",
              nas_note_ref: "nasnote-office-dispatch-1",
              kanban_mutation_created: true,
              nas_save_created: true,
              nas_save_result: "safe_nas_save_marker_written" as const,
              vps_direct_nas_authority_enabled: false,
              real_nas_execution_enabled: false,
              real_dispatch_execution_enabled: false,
            },
          ],
          capabilities: {
            nas_write_enabled: true,
            vps_direct_nas_authority_enabled: false,
            real_nas_execution_enabled: false,
            real_dispatch_execution_enabled: false,
          },
          redaction: { raw_markdown_body_excluded: true, raw_nas_path_excluded: true, credentials_echoed: false },
        }}
      />,
    );

    expect(html).toContain('data-office-manual-nas-save-record-status="true"');
    expect(html).toContain('data-office-manual-nas-save-created="true"');
    expect(html).toContain('data-office-manual-nas-save-vps-authority="false"');
    expect(html).toContain("NAS save marker written · direct VPS NAS authority closed");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders manual NAS Keeper handoff record as queued while real NAS execution stays closed", () => {
    const ManualNasKeeperHandoffRecordStatusPanel = (OfficePageModule as unknown as {
      ManualNasKeeperHandoffRecordStatusPanel: React.ComponentType<{ status: unknown; error?: string | null }>;
    }).ManualNasKeeperHandoffRecordStatusPanel;
    expect(ManualNasKeeperHandoffRecordStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <ManualNasKeeperHandoffRecordStatusPanel
        error={null}
        status={{
          schema_version: 1,
          mode: "manual_nas_keeper_handoff_records_readback",
          nas_keeper_handoff_record_count: 1,
          records: [
            {
              schema_version: 1,
              mode: "manual_nas_keeper_handoff_queued",
              nas_save_ref: "nassave-office-dispatch-1",
              handoff_ref: "handoff_manual_nas_keeper_1",
              queue_status: "pending_nas_keeper_authorization",
              relay_request_ref: "relay_req_manual_nas_keeper_1",
              write_ref: "write_manual_nas_keeper_1",
              package_ref: "pkg_manual_nas_keeper_1",
              target_vault_ref: "vault_personal_wiki_demo",
              safe_slug: "manual-nas-save-handoff",
              safe_title: "Manual NAS save handoff",
              nas_save_created: true,
              nas_keeper_handoff_queued: true,
              direct_vps_nas_write_enabled: false,
              vps_direct_nas_authority_enabled: false,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              real_nas_execution_enabled: false,
              real_dispatch_execution_enabled: false,
            },
          ],
          capabilities: {
            queue_append_enabled: true,
            nas_keeper_handoff_enabled: true,
            direct_vps_nas_write_enabled: false,
            mac_relay_write_enabled: false,
            actual_nas_write_enabled: false,
            real_nas_execution_enabled: false,
          },
          redaction: { markdown_body_excluded: true, raw_nas_path_excluded: true, credentials_echoed: false },
        }}
      />,
    );

    expect(html).toContain('data-office-manual-nas-keeper-handoff-record-status="true"');
    expect(html).toContain('data-office-manual-nas-keeper-handoff-queued="true"');
    expect(html).toContain('data-office-manual-nas-keeper-handoff-actual-write="false"');
    expect(html).toContain('data-office-manual-nas-keeper-handoff-mac-relay-write="false"');
    expect(html).toContain("Mac relay handoff queued · real NAS execution closed");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper handoff claim dry-run as read-only and non-mutating", () => {
    const NasKeeperHandoffClaimDryRunStatusPanel = (OfficePageModule as unknown as {
      NasKeeperHandoffClaimDryRunStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperHandoffClaimDryRunStatusPanel;
    expect(NasKeeperHandoffClaimDryRunStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperHandoffClaimDryRunStatusPanel
        error={null}
        result={{
          claimed: false,
          dry_run: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_handoff_claim_dry_run",
            dry_run: true,
            claim_status: "would_claim",
            handoff_ref: "handoff_manual_nas_keeper_1",
            claim_ref: "claim_manual_nas_keeper_1",
            queue_status_before: "pending_nas_keeper_authorization",
            queue_status_after: "pending_nas_keeper_authorization",
            relay_node_ref: "relay_mac_safe",
            capabilities: {
              queue_read_enabled: true,
              claim_dry_run_enabled: true,
              queue_mutation_enabled: false,
              nas_keeper_authorization_recording_enabled: false,
              direct_vps_nas_write_enabled: false,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
            },
            next_required_boundary: "nas_keeper_authorizes_and_mac_relay_executes",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-handoff-claim-dry-run-status="true"');
    expect(html).toContain('data-office-nas-keeper-handoff-claim-dry-run="true"');
    expect(html).toContain('data-office-nas-keeper-handoff-claim-queue-mutation="false"');
    expect(html).toContain('data-office-nas-keeper-handoff-claim-mac-relay-write="false"');
    expect(html).toContain("would_claim · queue stays pending");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper handoff authorization record as queue-mutated but non-executing", () => {
    const NasKeeperHandoffAuthorizationRecordStatusPanel = (OfficePageModule as unknown as {
      NasKeeperHandoffAuthorizationRecordStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperHandoffAuthorizationRecordStatusPanel;
    expect(NasKeeperHandoffAuthorizationRecordStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperHandoffAuthorizationRecordStatusPanel
        error={null}
        result={{
          authorized: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_handoff_authorized",
            authorized: true,
            handoff_ref: "handoff_manual_nas_keeper_1",
            authorization_ref: "auth_manual_nas_keeper_1",
            authorization_decision: "authorize_mac_relay_execution",
            queue_status_before: "pending_nas_keeper_authorization",
            queue_status_after: "authorized_for_mac_relay_execution",
            authorized_by: "operator_ai_office",
            authorized_at: "2026-05-21T06:40:00Z",
            relay_request_ref: "relay_req_manual_nas_keeper_1",
            write_ref: "write_manual_nas_keeper_1",
            package_ref: "pkg_manual_nas_keeper_1",
            target_vault_ref: "vault_personal_wiki_demo",
            safe_slug: "manual-nas-save-handoff",
            safe_title: "Manual NAS save handoff",
            requested_by: "operator_ai_office",
            requested_at: "2026-05-21T06:00:00Z",
            nas_keeper_ref: "keeper_manual_review",
            relay_node_ref: "relay_mac_safe",
            execution_path: ["safe_refs_only"],
            authorization_path: ["nas_keeper_review", "authorization_recorded", "mac_relay_execution_pending", "no_real_nas_write"],
            safe_logical_path: "wiki/safe/manual-nas-save-handoff.md",
            safe_display_path: "Personal Wiki / safe / manual-nas-save-handoff.md",
            payload_bytes: 128,
            execution_payload_preview_fields: ["write_ref"],
            capabilities: {
              queue_read_enabled: true,
              queue_mutation_enabled: true,
              nas_keeper_authorization_recording_enabled: true,
              execution_payload_preparation_enabled: true,
              vps_nas_mount_enabled: false,
              vps_credential_access_enabled: false,
              direct_vps_nas_write_enabled: false,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
            },
            next_required_boundary: "mac_relay_authenticated_execution_from_authorized_handoff",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-handoff-authorization-record-status="true"');
    expect(html).toContain('data-office-nas-keeper-handoff-authorization-authorized="true"');
    expect(html).toContain('data-office-nas-keeper-handoff-authorization-queue-mutation="true"');
    expect(html).toContain('data-office-nas-keeper-handoff-authorization-mac-relay-write="false"');
    expect(html).toContain('data-office-nas-keeper-handoff-authorization-actual-write="false"');
    expect(html).toContain("authorized · Mac relay execution still closed");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper Mac relay execution payload preview without executing writes", () => {
    const NasKeeperMacRelayExecutionPayloadPreviewStatusPanel = (OfficePageModule as unknown as {
      NasKeeperMacRelayExecutionPayloadPreviewStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperMacRelayExecutionPayloadPreviewStatusPanel;
    expect(NasKeeperMacRelayExecutionPayloadPreviewStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperMacRelayExecutionPayloadPreviewStatusPanel
        error={null}
        result={{
          previewed: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_execution_payload_preview",
            previewed: true,
            handoff_ref: "handoff_manual_nas_keeper_1",
            authorization_ref: "auth_manual_nas_keeper_1",
            relay_execution_ref: "relay_exec_manual_nas_keeper_1",
            queue_status: "authorized_for_mac_relay_execution",
            authorization_decision: "authorize_mac_relay_execution",
            authorized_by: "operator_ai_office",
            authorized_at: "2026-05-21T06:40:00Z",
            relay_authorized_by: "operator_ai_office",
            relay_authorized_at: "2026-05-21T06:58:00Z",
            execution_payload_preview: {
              relay_request_ref: "relay_req_manual_nas_keeper_1",
              relay_execution_ref: "relay_exec_manual_nas_keeper_1",
              write_ref: "write_manual_nas_keeper_1",
              package_ref: "pkg_manual_nas_keeper_1",
              target_vault_ref: "vault_personal_wiki_demo",
              safe_slug: "manual-nas-save-handoff",
              safe_title: "Manual NAS save handoff",
              requested_by: "operator_ai_office",
              requested_at: "2026-05-21T06:00:00Z",
              nas_keeper_ref: "keeper_manual_review",
              relay_node_ref: "relay_mac_safe",
              relay_authorized_by: "operator_ai_office",
              relay_authorized_at: "2026-05-21T06:58:00Z",
            },
            execution_payload_fields: ["write_ref", "relay_execution_ref"],
            markdown_body_ref: "queued_handoff_markdown_body::handoff_manual_nas_keeper_1",
            markdown_body_bytes: 39,
            markdown_body_sha256: "a".repeat(64),
            markdown_body_included: false,
            execution_path: ["prepared_request_validated", "mac_relay_write_pending"],
            payload_preview_path: ["authorized_queue_item_read", "safe_execution_payload_previewed", "mac_relay_execution_pending", "no_real_nas_write"],
            safe_logical_path: "wiki/safe/manual-nas-save-handoff.md",
            safe_display_path: "Personal Wiki / safe / manual-nas-save-handoff.md",
            payload_bytes: 128,
            capabilities: {
              queue_read_enabled: true,
              execution_payload_preview_enabled: true,
              queue_mutation_enabled: false,
              nas_keeper_authorization_recording_enabled: false,
              vps_nas_mount_enabled: false,
              vps_credential_access_enabled: false,
              direct_vps_nas_write_enabled: false,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
            },
            next_required_boundary: "mac_relay_authenticated_execution_from_previewed_payload",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-execution-payload-preview-status="true"');
    expect(html).toContain('data-office-nas-keeper-execution-payload-previewed="true"');
    expect(html).toContain('data-office-nas-keeper-execution-payload-preview-enabled="true"');
    expect(html).toContain('data-office-nas-keeper-execution-payload-mac-relay-write="false"');
    expect(html).toContain('data-office-nas-keeper-execution-payload-actual-write="false"');
    expect(html).toContain("payload previewed · Mac relay execution still closed");
    expect(html).toContain("queued_handoff_markdown_body::handoff_manual_nas_keeper_1");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper execution-from-preview guarded failure without writing", () => {
    const NasKeeperExecutionFromPreviewGuardedFailureStatusPanel = (OfficePageModule as unknown as {
      NasKeeperExecutionFromPreviewGuardedFailureStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperExecutionFromPreviewGuardedFailureStatusPanel;
    expect(NasKeeperExecutionFromPreviewGuardedFailureStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperExecutionFromPreviewGuardedFailureStatusPanel
        error={null}
        result={{
          executed: false,
          written: false,
          errors: [{ field: "mac_relay_root", code: "mac_relay_root_not_configured" }],
          dto: null,
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-execution-from-preview-guard-status="true"');
    expect(html).toContain('data-office-nas-keeper-execution-from-preview-guard-executed="false"');
    expect(html).toContain('data-office-nas-keeper-execution-from-preview-guard-written="false"');
    expect(html).toContain('data-office-nas-keeper-execution-from-preview-guard-root-configured="false"');
    expect(html).toContain("guarded failure · Mac relay root not configured");
    expect(html).toContain("mac_relay_root_not_configured");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper guarded failure execution-state record without write execution", () => {
    const NasKeeperGuardedFailureExecutionStateRecordStatusPanel = (OfficePageModule as unknown as {
      NasKeeperGuardedFailureExecutionStateRecordStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperGuardedFailureExecutionStateRecordStatusPanel;
    expect(NasKeeperGuardedFailureExecutionStateRecordStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperGuardedFailureExecutionStateRecordStatusPanel
        error={null}
        result={{
          recorded: true,
          errors: [],
          dto: {
            recorded: true,
            handoff_ref: "handoff_demo",
            execution_record_ref: "exec_record_guarded_demo",
            relay_execution_ref: "relayexec_guarded_demo",
            queue_status_before: "authorized_for_mac_relay_execution",
            queue_status_after: "mac_relay_execution_failed_guarded",
            execution_status: "failed_guarded",
            markdown_body_included: false,
            capabilities: {
              queue_mutation_enabled: true,
              execution_state_recording_enabled: true,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-guarded-failure-execution-state-record-status="true"');
    expect(html).toContain('data-office-nas-keeper-guarded-failure-execution-state-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-guarded-failure-execution-state-queue-mutation="true"');
    expect(html).toContain('data-office-nas-keeper-guarded-failure-execution-state-mac-relay-write="false"');
    expect(html).toContain('data-office-nas-keeper-guarded-failure-execution-state-actual-write="false"');
    expect(html).toContain("failed_guarded recorded · execution remains closed");
    expect(html).toContain("mac_relay_execution_failed_guarded");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders NAS Keeper terminal execution-state completion review without reopening writes", () => {
    const NasKeeperTerminalExecutionStateCompletionReviewPanel = (OfficePageModule as unknown as {
      NasKeeperTerminalExecutionStateCompletionReviewPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperTerminalExecutionStateCompletionReviewPanel;
    expect(NasKeeperTerminalExecutionStateCompletionReviewPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperTerminalExecutionStateCompletionReviewPanel
        error={null}
        result={{
          recorded: true,
          errors: [],
          dto: {
            recorded: true,
            handoff_ref: "handoff_demo",
            execution_record_ref: "exec_record_guarded_demo",
            relay_execution_ref: "relayexec_guarded_demo",
            queue_status_after: "mac_relay_execution_failed_guarded",
            execution_status: "failed_guarded",
            execution_safe_summary: "Mac relay execution guard failed safely before write because relay root was not configured.",
            execution_evidence_refs: ["guard:relayexec_guarded_demo", "guard:mac_relay_root_not_configured"],
            markdown_body_included: false,
            next_required_boundary: "none_terminal_execution_state_recorded",
            capabilities: {
              queue_mutation_enabled: true,
              execution_state_recording_enabled: true,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-terminal-completion-review-status="true"');
    expect(html).toContain('data-office-nas-keeper-terminal-completion-review-complete="true"');
    expect(html).toContain('data-office-nas-keeper-terminal-completion-review-path-closed="true"');
    expect(html).toContain('data-office-nas-keeper-terminal-completion-review-mac-relay-write="false"');
    expect(html).toContain('data-office-nas-keeper-terminal-completion-review-actual-write="false"');
    expect(html).toContain("terminal failed_guarded evidence complete · path intentionally closed");
    expect(html).toContain("mac_relay_execution_failed_guarded");
    expect(html).toContain("Mac-local relay root branch required for actual NAS write");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders Mac-local relay root authority preflight without credentials or write controls", () => {
    const MacLocalRelayRootAuthorityPreflightPanel = (OfficePageModule as unknown as {
      MacLocalRelayRootAuthorityPreflightPanel: React.ComponentType<{ terminalResult: unknown; error?: string | null }>;
    }).MacLocalRelayRootAuthorityPreflightPanel;
    expect(MacLocalRelayRootAuthorityPreflightPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <MacLocalRelayRootAuthorityPreflightPanel
        error={null}
        terminalResult={{
          recorded: true,
          errors: [],
          dto: {
            recorded: true,
            queue_status_after: "mac_relay_execution_failed_guarded",
            execution_status: "failed_guarded",
            next_required_boundary: "none_terminal_execution_state_recorded",
            capabilities: {
              queue_mutation_enabled: true,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-mac-local-relay-root-preflight="true"');
    expect(html).toContain('data-office-mac-local-relay-root-preflight-ready="false"');
    expect(html).toContain('data-office-mac-local-relay-root-preflight-read-only="true"');
    expect(html).toContain('data-office-mac-local-relay-root-preflight-vps-nas-authority="false"');
    expect(html).toContain("Mac-local relay root authority preflight");
    expect(html).toContain("HERMES_AI_OFFICE_MAC_RELAY_NAS_ROOT");
    expect(html).toContain("read-only preflight only");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders Mac-local relay root authority config contract without leaking root values", () => {
    const MacLocalRelayRootAuthorityConfigContractPanel = (OfficePageModule as unknown as {
      MacLocalRelayRootAuthorityConfigContractPanel: React.ComponentType<{ terminalResult: unknown; error?: string | null }>;
    }).MacLocalRelayRootAuthorityConfigContractPanel;
    expect(MacLocalRelayRootAuthorityConfigContractPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <MacLocalRelayRootAuthorityConfigContractPanel
        error={null}
        terminalResult={{
          recorded: true,
          errors: [],
          dto: {
            recorded: true,
            queue_status_after: "mac_relay_execution_failed_guarded",
            execution_status: "failed_guarded",
            next_required_boundary: "none_terminal_execution_state_recorded",
            capabilities: {
              queue_mutation_enabled: true,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-mac-local-relay-root-config-contract="true"');
    expect(html).toContain('data-office-mac-local-relay-root-config-contract-read-only="true"');
    expect(html).toContain('data-office-mac-local-relay-root-config-contract-root-value-visible="false"');
    expect(html).toContain('data-office-mac-local-relay-root-config-contract-write-enabled="false"');
    expect(html).toContain('data-office-mac-local-relay-root-config-contract-vps-nas-authority="false"');
    expect(html).toContain("Mac-local relay authority configuration contract");
    expect(html).toContain("prove readiness without exposing the root value");
    expect(html).toContain("masked_root_present");
    expect(html).toContain("writable_probe_required");
    expect(html).toContain("write execution remains a later rung");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders Mac-local relay root readiness probe contract as sanitized proof shape only", () => {
    const MacLocalRelayRootReadinessProbeContractPanel = (OfficePageModule as unknown as {
      MacLocalRelayRootReadinessProbeContractPanel: React.ComponentType<{ terminalResult: unknown; probeResult?: unknown; error?: string | null }>;
    }).MacLocalRelayRootReadinessProbeContractPanel;
    expect(MacLocalRelayRootReadinessProbeContractPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <MacLocalRelayRootReadinessProbeContractPanel
        error={null}
        terminalResult={{
          recorded: true,
          errors: [],
          dto: {
            recorded: true,
            queue_status_after: "mac_relay_execution_failed_guarded",
            execution_status: "failed_guarded",
            next_required_boundary: "none_terminal_execution_state_recorded",
            capabilities: {
              queue_mutation_enabled: true,
              mac_relay_write_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
            },
          },
        }}
        probeResult={{
          probed: true,
          errors: [],
          dto: {
            mode: "mac_local_relay_root_readiness_probe",
            probed: true,
            root_configured: false,
            root_readable: false,
            root_writable: false,
            safe_probe_ref: "mac_relay_root_probe::unconfigured",
            sanitized_root_label: "unconfigured",
            redaction_policy_version: 1,
            probe_errors: ["mac_relay_root_not_configured"],
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            capabilities: {
              probe_read_only: true,
              write_payload_enabled: false,
              actual_nas_write_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract="true"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-read-only="true"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-probe-executed="true"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-root-configured="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-root-readable="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-root-writable="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-write-enabled="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-vps-nas-authority="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-raw-root-path-included="false"');
    expect(html).toContain('data-office-mac-local-relay-root-readiness-probe-contract-credential-value-included="false"');
    expect(html).toContain("Mac-local relay root readiness probe");
    expect(html).toContain("sanitized read-only probe");
    expect(html).toContain("root_configured");
    expect(html).toContain("root_readable");
    expect(html).toContain("root_writable");
    expect(html).toContain("safe_probe_ref");
    expect(html).toContain("sanitized_root_label");
    expect(html).toContain("redaction_policy_version");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders last successful Mac relay write readback as repeat-safe display-only refs", () => {
    const NasKeeperLastSuccessfulMacRelayWriteStatusPanel = (OfficePageModule as unknown as {
      NasKeeperLastSuccessfulMacRelayWriteStatusPanel: React.ComponentType<{ result: unknown; error?: string | null }>;
    }).NasKeeperLastSuccessfulMacRelayWriteStatusPanel;
    expect(NasKeeperLastSuccessfulMacRelayWriteStatusPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperLastSuccessfulMacRelayWriteStatusPanel
        error={null}
        result={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_last_successful_bounded_write_readback",
            last_successful_write_found: true,
            handoff_ref: "handoff_one_shot_write_20260521103124",
            authorization_ref: "authz_one_shot_write_20260521103124",
            relay_execution_ref: "relay_exec_one_shot_write_20260521103124",
            execution_record_ref: "exec_record_one_shot_write_20260521103124",
            target_vault_ref: "Hermes",
            safe_slug: "controlled-mutation-one-shot-write-20260521103124",
            safe_display_path: "Hermes / controlled-mutation-one-shot-write-20260521103124.md",
            queue_status: "mac_relay_execution_succeeded",
            execution_status: "succeeded",
            execution_recorded_at: "2026-05-21T10:31:24Z",
            readback_sha256: "25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
            markdown_body_sha256: "25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
            readback_verified: true,
            payload_bytes: 226,
            markdown_body_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            write_payload_included: false,
            repeat_execution_replay_allowed: false,
            fresh_handoff_required_per_write: true,
            fresh_authorization_required_per_write: true,
            fresh_execution_ref_required_per_write: true,
            capabilities: {
              last_successful_write_readback_enabled: true,
              repeat_execution_replay_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              vps_credential_access_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-found="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-readback-verified="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-fresh-handoff-required="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-fresh-authorization-required="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-fresh-execution-ref-required="true"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-last-successful-mac-relay-write-vps-nas-authority="false"');
    expect(html).toContain("last bounded write readback");
    expect(html).toContain("fresh refs required");
    expect(html).toContain("controlled-mutation-one-shot-write-20260521103124.md");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders fresh one-shot operator wrapper as display-only fresh-ref contract", () => {
    const NasKeeperFreshOneShotOperatorFlowPanel = (OfficePageModule as unknown as {
      NasKeeperFreshOneShotOperatorFlowPanel: React.ComponentType<{ lastWrite: unknown; lastExecution?: unknown; error?: string | null }>;
    }).NasKeeperFreshOneShotOperatorFlowPanel;
    expect(NasKeeperFreshOneShotOperatorFlowPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshOneShotOperatorFlowPanel
        error={null}
        lastWrite={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_last_successful_bounded_write_readback",
            last_successful_write_found: true,
            handoff_ref: "handoff_one_shot_write_20260521103124",
            authorization_ref: "authz_one_shot_write_20260521103124",
            relay_execution_ref: "relay_exec_one_shot_write_20260521103124",
            execution_record_ref: "exec_record_one_shot_write_20260521103124",
            safe_display_path: "Hermes / controlled-mutation-one-shot-write-20260521103124.md",
            readback_sha256: "25c4819e10f857a74512223e5a32f68d0c24db058944a1fb0bb014e2c39d79e1",
            readback_verified: true,
            markdown_body_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            write_payload_included: false,
            repeat_execution_replay_allowed: false,
            fresh_handoff_required_per_write: true,
            fresh_authorization_required_per_write: true,
            fresh_execution_ref_required_per_write: true,
            capabilities: {
              repeat_execution_replay_enabled: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
              direct_vps_nas_write_enabled: false,
              vps_credential_access_enabled: false,
            },
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-fresh-handoff-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-fresh-authorization-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-fresh-execution-ref-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-operator-flow-vps-nas-authority="false"');
    expect(html).toContain("fresh refs only");
    expect(html).toContain("fail closed on reuse");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders fresh one-shot request builder as display-only dry-review/approval contract", () => {
    const NasKeeperFreshOneShotRequestBuilderPanel = (OfficePageModule as unknown as {
      NasKeeperFreshOneShotRequestBuilderPanel: React.ComponentType<{ builder?: unknown; error?: string | null }>;
    }).NasKeeperFreshOneShotRequestBuilderPanel;
    expect(NasKeeperFreshOneShotRequestBuilderPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshOneShotRequestBuilderPanel
        error={null}
        builder={{
          built: true,
          dry_reviewed: true,
          executed: false,
          written: false,
          approval_required: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_one_shot_operator_request_builder_review",
            operator_intent_ref: "intent_fresh_builder_20260521230000",
            issued_at: "2026-05-21T14:00:00Z",
            approve_actual_write: false,
            request_payload_ready: true,
            fresh_refs_verified: true,
            handoff_ref: "handoff_fresh_builder_intent_20260521140000_abc12345",
            authorization_ref: "authz_fresh_builder_intent_20260521140000_abc12345",
            relay_execution_ref: "relay_exec_fresh_builder_intent_20260521140000_abc12345",
            execution_record_ref: "exec_record_fresh_builder_intent_20260521140000_abc12345",
            safe_slug: "fresh-builder-intent-20260521140000-abc12345",
            safe_title: "Fresh builder intent",
            safe_request_payload: {},
            markdown_body_sha256: "a".repeat(64),
            markdown_body_bytes: 42,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            request_builder_path: ["safe_operator_intent_received", "unique_refs_generated", "dry_payload_reviewed"],
            next_required_boundary: "explicit_operator_approval_for_actual_write",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder-dry-review-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder-explicit-approval-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-one-shot-request-builder-vps-nas-authority="false"');
    expect(html).toContain("safe intent → dry review → explicit one-shot write");
    expect(html).not.toContain("Fresh builder safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders fresh request-builder ledger as display-only safe refs/checksums", () => {
    const NasKeeperFreshRequestBuilderLedgerPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerPanel;
    expect(NasKeeperFreshRequestBuilderLedgerPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerPanel
        error={null}
        ledger={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_readback",
            count: 1,
            dry_review_before_write_verified: true,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            filters_applied: { outcome: "written", queue_status: "mac_relay_execution_succeeded" },
            safe_export_enabled: true,
            safe_export: {
              format: "fresh_request_builder_safe_export_v1",
              count: 1,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              items: [{
                operator_request_outcome: "written",
                handoff_ref: "handoff_ledger_readback_20260521143000_abc12345",
                authorization_ref: "authz_ledger_readback_20260521143000_abc12345",
                relay_execution_ref: "relay_exec_ledger_readback_20260521143000_abc12345",
                execution_record_ref: "exec_record_ledger_readback_20260521143000_abc12345",
                queue_status: "mac_relay_execution_succeeded",
                execution_status: "succeeded",
                markdown_body_sha256: "a".repeat(64),
                readback_sha256: "b".repeat(64),
                readback_verified: true,
              }],
            },
            next_required_boundary: "fresh_request_builder_operator_review",
            items: [{
              schema_version: 1,
              mode: "nas_keeper_fresh_request_builder_ledger_item",
              operator_request_outcome: "written",
              handoff_ref: "handoff_ledger_readback_20260521143000_abc12345",
              authorization_ref: "authz_ledger_readback_20260521143000_abc12345",
              relay_execution_ref: "relay_exec_ledger_readback_20260521143000_abc12345",
              execution_record_ref: "exec_record_ledger_readback_20260521143000_abc12345",
              safe_slug: "ledger-readback-20260521143000-abc12345",
              safe_title: "Ledger readback safe title",
              safe_display_path: "Hermes / ledger-readback-20260521143000-abc12345.md",
              queue_ref: "queue_abc12345",
              queue_status: "mac_relay_execution_succeeded",
              execution_status: "succeeded",
              dry_reviewed_at: "2026-05-21T14:30:00Z",
              authorized_at: "2026-05-21T14:30:00Z",
              executed_at: "2026-05-21T14:30:00Z",
              dry_review_before_write_verified: true,
              markdown_body_sha256: "a".repeat(64),
              readback_sha256: "b".repeat(64),
              readback_verified: true,
              payload_bytes: 47,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              repeat_execution_replay_allowed: false,
            }],
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-dry-before-write="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-markdown-body-included="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-safe-export-enabled="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-safe-export="true"');
    expect(html).toContain("fresh_request_builder_safe_export_v1");
    expect(html).toContain("copyable safe export");
    expect(html).toContain("filters_applied");
    expect(html).toContain("handoff_ledger_readback_20260521143000_abc12345");
    expect(html).toContain("sanitized outcomes · dry-review-before-write proof");
    expect(html).not.toContain("Ledger readback safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders selected export review as display-only item-count/checksum proof", () => {
    const NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel;
    expect(NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerExportSelectionReviewPanel
        error={null}
        review={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_export_selection_review",
            selection_profile: "latest_written",
            source_mode: "nas_keeper_fresh_request_builder_ledger_readback",
            filters_applied: { outcome: "written", queue_status: "mac_relay_execution_succeeded" },
            selected_item_count: 1,
            selected_safe_export: {
              format: "fresh_request_builder_safe_export_v1",
              count: 1,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              items: [{
                handoff_ref: "handoff_select_written_20260521150900_7afe4001",
                markdown_body_sha256: "c".repeat(64),
                readback_sha256: "c".repeat(64),
                readback_verified: true,
              }],
            },
            selected_checksum_set: [{
              handoff_ref: "handoff_select_written_20260521150900_7afe4001",
              markdown_body_sha256: "c".repeat(64),
              readback_sha256: "c".repeat(64),
              readback_verified: true,
            }],
            checksum_set_sha256: "d".repeat(64),
            export_item_count_verified: true,
            checksum_set_verified: true,
            downstream_use_enabled: false,
            downstream_use_ready: true,
            manual_operator_review_required: true,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_operator_review",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-item-count-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-checksum-set-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-downstream-use-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-markdown-body-included="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-export-selection-review-checksum-preview="true"');
    expect(html).toContain("one profile · item-count and checksum-set proof");
    expect(html).toContain("handoff_select_written_20260521150900_7afe4001");
    expect(html).toContain("selected_export_review_v1");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders downstream-use preflight as display-only manual review gate", () => {
    const NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel;
    expect(NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightPanel
        error={null}
        preflight={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_use_preflight",
            selection_profile: "latest_written",
            source_mode: "nas_keeper_fresh_request_builder_ledger_export_selection_review",
            filters_applied: { outcome: "written" },
            selected_item_count: 1,
            checksum_set_sha256: "e".repeat(64),
            preflight_decision_sha256: "f".repeat(64),
            selected_export_review_passed: true,
            export_item_count_verified: true,
            checksum_set_verified: true,
            downstream_use_ready: true,
            downstream_use_allowed_after_manual_review: true,
            downstream_use_enabled: false,
            downstream_use_blocked_reason: "manual_operator_review_not_recorded",
            manual_operator_review_required: true,
            manual_operator_review_record_present: false,
            source_selection_review: {
              selection_profile: "latest_written",
              selected_item_count: 1,
              checksum_set_sha256: "e".repeat(64),
              export_item_count_verified: true,
              checksum_set_verified: true,
              downstream_use_ready: true,
              downstream_use_enabled: false,
            },
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_manual_operator_review_record",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-review-passed="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-manual-review-required="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-manual-review-record-present="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-downstream-use-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-preflight-markdown-body-included="false"');
    expect(html).toContain("manual review gate · downstream disabled");
    expect(html).toContain("downstream_use_preflight_v1");
    expect(html).toContain("manual_operator_review_not_recorded");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders manual review record readback as display-only safe-ref proof", () => {
    const NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel;
    expect(NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerManualReviewRecordPanel
        error={null}
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_manual_review_records_readback",
            record_count: 1,
            limit: 20,
            skipped_count: 0,
            records: [],
            latest_record: {
              schema_version: 1,
              mode: "nas_keeper_fresh_request_builder_ledger_manual_review_record",
              manual_operator_review_record_written: true,
              manual_review_ref: "manualreview-20260521161000-9afe6101",
              selection_profile: "latest_written",
              source_preflight_decision_sha256: "a".repeat(64),
              checksum_set_sha256: "b".repeat(64),
              selected_item_count: 1,
              reviewed_by: "agent_orchestrator",
              reviewed_at: "2026-05-21T16:10:30Z",
              operator_confirmation: "confirmed-selected-export-safe-ref-review-only",
              safe_summary: "Manual safe-ref review complete.",
              evidence_refs: ["preflight:" + "a".repeat(64)],
              manual_review_record_sha256: "c".repeat(64),
              downstream_use_enabled: false,
              downstream_consumed: false,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              repeat_execution_replay_allowed: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
              capabilities: {},
              next_required_boundary: "fresh_request_builder_downstream_use_enablement",
            },
            downstream_use_enabled: false,
            downstream_consumption_enabled: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_use_enablement",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-written="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-downstream-use-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-downstream-consumed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-manual-review-record-markdown-body-included="false"');
    expect(html).toContain("safe-ref review record · downstream still disabled");
    expect(html).toContain("manual_review_record_safe_ref_v1");
    expect(html).toContain("manualreview-20260521161000-9afe6101");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders downstream-use enablement record as readiness-only proof", () => {
    const NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel;
    expect(NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementPanel
        error={null}
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_records_readback",
            record_count: 1,
            limit: 20,
            skipped_count: 0,
            records: [],
            latest_record: {
              downstream_use_enablement_recorded: true,
              enablement_ref: "enablement-20260521163100-aafe7001",
              source_preflight_decision_sha256: "a".repeat(64),
              manual_review_ref: "manualreview-20260521163000-aafe7001",
              manual_review_record_sha256: "b".repeat(64),
              manual_review_record_verified: true,
              checksum_set_sha256: "c".repeat(64),
              selected_item_count: 1,
              enablement_record_sha256: "d".repeat(64),
              downstream_use_enabled: false,
              downstream_consumption_enabled: false,
              downstream_consumed: false,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              repeat_execution_replay_allowed: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
            },
            downstream_use_enabled: false,
            downstream_consumption_enabled: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_preflight",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-manual-review-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-downstream-use-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-downstream-consumed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-repeat-replay-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-use-enablement-markdown-body-included="false"');
    expect(html).toContain("safe-ref enablement · consumption still disabled");
    expect(html).toContain("downstream_use_enablement_safe_ref_v1");
    expect(html).toContain("enablement-20260521163100-aafe7001");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });


  it("renders downstream consumption preflight as readiness-gated display-only proof", () => {
    const NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel;
    expect(NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightPanel
        error={null}
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight",
            selection_profile: "latest_written",
            selected_export_review_passed: true,
            manual_operator_review_record_present: true,
            downstream_use_enablement_record_present: true,
            consumption_preflight_passed: true,
            enablement_ref: "enablement-20260521163100-aafe7001",
            source_preflight_decision_sha256: "a".repeat(64),
            manual_review_ref: "manualreview-20260521163000-aafe7001",
            manual_review_record_sha256: "b".repeat(64),
            enablement_record_sha256: "d".repeat(64),
            checksum_set_sha256: "c".repeat(64),
            selected_item_count: 1,
            consumption_preflight_decision_sha256: "e".repeat(64),
            downstream_use_enabled: true,
            downstream_consumption_enabled: false,
            downstream_consumed: false,
            actual_downstream_consumption_allowed_after_preflight: false,
            blocked_reason: "actual_downstream_consumption_boundary_not_approved",
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_enablement",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-passed="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-enable-record-present="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-downstream-use-enabled="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-downstream-consumed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight-markdown-body-included="false"');
    expect(html).toContain("consumption preflight · actual consumption still disabled");
    expect(html).toContain("downstream_consumption_preflight_safe_ref_v1");
    expect(html).toContain("enablement-20260521163100-aafe7001");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });


  it("renders downstream consumption enablement record as safe-ref proof without consuming", () => {
    const NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel;
    expect(NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementPanel
        error={null}
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_records_readback",
            record_count: 1,
            limit: 20,
            skipped_count: 0,
            records: [],
            latest_record: {
              downstream_consumption_enablement_recorded: true,
              consumption_enablement_ref: "consumptionenable-20260521170000-bafe8001",
              consumption_preflight_verified: true,
              enablement_ref: "enablement-20260521163100-aafe7001",
              source_consumption_preflight_decision_sha256: "e".repeat(64),
              source_preflight_decision_sha256: "a".repeat(64),
              manual_review_ref: "manualreview-20260521163000-aafe7001",
              manual_review_record_sha256: "b".repeat(64),
              enablement_record_sha256: "d".repeat(64),
              checksum_set_sha256: "c".repeat(64),
              selected_item_count: 1,
              consumption_enablement_record_sha256: "f".repeat(64),
              downstream_use_enabled: true,
              downstream_consumption_enabled: false,
              downstream_consumed: false,
              actual_downstream_consumption_allowed: false,
              markdown_body_included: false,
              write_payload_included: false,
              raw_root_path_included: false,
              credential_value_included: false,
              repeat_execution_replay_allowed: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
            },
            downstream_use_enabled: true,
            downstream_consumption_enabled: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            repeat_execution_replay_allowed: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_boundary",
          },
        }}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-preflight-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-downstream-use-enabled="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-downstream-consumed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-vps-nas-authority="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablement-markdown-body-included="false"');
    expect(html).toContain("consumption enablement · actual consumption still disabled");
    expect(html).toContain("downstream_consumption_enablement_safe_ref_v1");
    expect(html).toContain("consumptionenable-20260521170000-bafe8001");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });


  it("renders downstream consumption one-shot boundary design without execution controls", () => {
    const Panel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignPanel;
    expect(Panel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <Panel
        design={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design",
            boundary_design_ready: true,
            source_consumption_enablement_ref: "consumptionenable-20260521170000-bafe8001",
            source_consumption_enablement_record_sha256: "f".repeat(64),
            safe_ref_chain_verified: true,
            target_allowlist_shape: { safe_ref_only: true },
            idempotency_replay_guard_design: { required: true },
            rollback_disable_posture: { required: true },
            approval_boundary: { explicit_human_approval_required: true },
            boundary_design_sha256: "a".repeat(64),
            downstream_use_enabled: true,
            downstream_consumption_enabled: false,
            downstream_consumed: false,
            actual_downstream_consumption_allowed: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_exact_approval",
          },
        }}
        error={null}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design-safe-ref-chain="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design-vps-nas-authority="false"');
    expect(html).toContain("one-shot boundary design · still no consumption");
    expect(html).toContain("downstream_consumption_one_shot_boundary_design_v1");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders downstream consumption exact approval record without consumption controls", () => {
    const Panel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApprovalPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApprovalPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApprovalPanel;
    expect(Panel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <Panel
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_exact_approval_records_readback",
            record_count: 1,
            limit: 50,
            skipped_count: 0,
            records: [],
            latest_record: {
              schema_version: 1,
              mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_exact_approval_record",
              exact_approval_recorded: true,
              exact_approval_ref: "exactapproval-20260522120000-cafe9001",
              source_consumption_enablement_ref: "consumptionenable-20260521170000-bafe8001",
              source_consumption_enablement_record_sha256: "f".repeat(64),
              boundary_design_sha256: "a".repeat(64),
              boundary_design_verified: true,
              safe_ref_chain_verified: true,
              exact_approval_record_sha256: "b".repeat(64),
              downstream_consumption_enabled: false,
              downstream_consumed: false,
              actual_downstream_consumption_allowed: false,
              approval_record_write_enabled: true,
              replay_store_write_enabled: false,
              markdown_body_included: false,
              write_payload_included: false,
              watcher_enabled: false,
              cron_enabled: false,
              dispatch_enabled: false,
              authority_adapter_binding_enabled: false,
              vps_nas_mount_enabled: false,
            },
            downstream_use_enabled: true,
            downstream_consumption_enabled: false,
            downstream_consumed: false,
            actual_downstream_consumption_allowed: false,
            approval_record_write_enabled: true,
            replay_store_write_enabled: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_preflight",
          },
        }}
        error={null}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-boundary-design-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-exact-approval-vps-nas-authority="false"');
    expect(html).toContain("one-shot exact approval · still no consumption");
    expect(html).toContain("downstream_consumption_one_shot_exact_approval_v1");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders downstream consumption actual preflight over exact approval without consuming", () => {
    const Panel = (OfficePageModule as unknown as {
      NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflightPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflightPanel>>;
    }).NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflightPanel;
    expect(Panel).toBeTypeOf("function");

    const html = renderToStaticMarkup(
      <Panel
        result={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight",
            actual_consumption_preflight_ready: true,
            exact_approval_record_verified: true,
            safe_ref_chain_verified: true,
            exact_approval_ref: "exactapproval-20260522120000-cafe9001",
            exact_approval_record_sha256: "b".repeat(64),
            boundary_design_sha256: "a".repeat(64),
            source_consumption_enablement_ref: "consumptionenable-20260521170000-bafe8001",
            source_consumption_enablement_record_sha256: "f".repeat(64),
            target_allowlist_verified: true,
            idempotency_replay_lookup_required: true,
            disable_switch_required: true,
            downstream_use_enabled: true,
            downstream_consumption_enabled: false,
            downstream_consumed: false,
            actual_downstream_consumption_allowed: false,
            approval_record_write_enabled: true,
            replay_store_write_enabled: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            credential_value_included: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            capabilities: {},
            next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_gate",
          },
        }}
        error={null}
      />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-exact-approval-verified="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-preflight-vps-nas-authority="false"');
    expect(html).toContain("actual consumption preflight · still no execution");
    expect(html).toContain("downstream_consumption_actual_preflight_v1");
    expect(html).not.toContain("Safe body");
    expect(html).not.toContain("/Users/" + "lidises");
    expect(html).not.toContain("/home/hermes");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("sk" + "-test");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<form");
    expect(html).not.toContain("<input");
    expect(html).not.toContain("<select");
    expect(html).not.toContain("<textarea");
  });

  it("renders approved real one-shot dispatch gate design without executable controls", () => {
    const ApprovedRealOneShotDispatchGateDesignPanel = (OfficePageModule as unknown as {
      ApprovedRealOneShotDispatchGateDesignPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.ApprovedRealOneShotDispatchGateDesignPanel>>;
    }).ApprovedRealOneShotDispatchGateDesignPanel;
    const status = {
      schema_version: 1,
      mode: "approved_real_one_shot_dispatch_gate_design" as const,
      approved_real_one_shot_dispatch_gate_design_complete: true,
      source_design_lane: "disabled_executor_contract_hardening",
      next_manual_lane: "manual_real_one_shot_dispatch_gate_approval",
      approval_gate: {
        approval_record_required: true,
        exact_target_allowlist_required: true,
        rollback_disable_switch_required: true,
        idempotency_replay_store_required: true,
        operator_final_confirmation_required: true,
        runtime_gate_still_disabled_by_default: true,
        approval_recorded: false,
      },
      runtime_command_envelope: {
        runtime_command_shape_defined: true,
        runtime_command_materialized: false,
        runtime_command_included: false,
        runtime_command_executed: false,
        command_args_echoed: false,
      },
      replay_store: {
        idempotency_key_format_required: true,
        replay_lookup_required: true,
        replay_write_required_after_success: true,
        replay_store_bound: false,
        replay_state_mutated: false,
      },
      rollback_disable: {
        disable_switch_required: true,
        rollback_plan_ref_required: true,
        rollback_verified_before_dispatch_required: true,
        disable_switch_bound: false,
        rollback_executed: false,
      },
      execution_boundary: {
        design_only: true,
        dispatch_gate_open: false,
        approval_record_written: false,
        runtime_command_included: false,
        runtime_command_executed: false,
        adapter_binding_created: false,
        adapter_dispatch_created: false,
        target_mutation_created: false,
        watcher_or_cron_created: false,
      },
      forbidden_boundaries: ["approval_recording", "runtime_command_execution", "target_mutation"],
      capabilities: {
        approved_gate_design_readback_enabled: true,
        real_dispatch_execution_enabled: false,
        approval_recording_enabled: false,
        runtime_command_materialization_enabled: false,
        runtime_command_execution_enabled: false,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        idempotency_replay_store_write_enabled: false,
        rollback_execution_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<ApprovedRealOneShotDispatchGateDesignPanel status={status} error={null} />);

    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design="true"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-complete="true"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-readback-enabled="true"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-real-dispatch-enabled="false"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-approval-recording-enabled="false"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-replay-store-write-enabled="false"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-approval-gate="approval_record_required"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-runtime-envelope="runtime_command_shape_defined"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-replay-store="replay_lookup_required"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-rollback-disable="disable_switch_required"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-execution-boundary="runtime_command_executed"');
    expect(markup).toContain('data-office-approved-real-one-shot-dispatch-gate-design-forbidden-boundary="target_mutation"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders disabled one-shot runtime dispatch executor skeleton without executable controls", () => {
    const DisabledOneShotRuntimeDispatchExecutorSkeletonPanel = (OfficePageModule as unknown as {
      DisabledOneShotRuntimeDispatchExecutorSkeletonPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DisabledOneShotRuntimeDispatchExecutorSkeletonPanel>>;
    }).DisabledOneShotRuntimeDispatchExecutorSkeletonPanel;
    const status = {
      schema_version: 1,
      mode: "disabled_one_shot_runtime_dispatch_executor_skeleton" as const,
      disabled_one_shot_runtime_dispatch_executor_skeleton_complete: true,
      source_design_lane: "concrete_runtime_single_dispatch_slice_design",
      next_manual_lane: "approved_one_shot_runtime_dispatch_execution",
      executor_gate: {
        disabled_by_default: true,
        runtime_gate_open: false,
        execution_endpoint_present: true,
        execution_refuses_by_default: true,
        actual_dispatch_approved: false,
      },
      required_inputs: {
        exact_target_allowlist_required: true,
        idempotency_key_required: true,
        rollback_disable_plan_required: true,
        dry_run_evidence_required: true,
        operator_final_confirmation_required: true,
      },
      execution_boundary: {
        runtime_command_included: false,
        runtime_command_executed: false,
        adapter_binding_created: false,
        adapter_dispatch_created: false,
        target_mutation_created: false,
        watcher_or_cron_created: false,
        refusal_validation_only: true,
      },
      forbidden_boundaries: ["runtime_command_execution", "adapter_dispatch", "target_mutation"],
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
      capabilities: {
        disabled_executor_skeleton_readback_enabled: true,
        refusal_validation_enabled: true,
        execution_endpoint_present: true,
        contract_hardening_readback_enabled: true,
        idempotency_replay_block_metadata_enabled: true,
        adapter_binding_enabled: false,
        adapter_dispatch_enabled: false,
        runtime_command_execution_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
        target_mutation_enabled: false,
        kanban_mutation_enabled: false,
        nas_save_enabled: false,
        vps_file_change_enabled: false,
        service_restart_enabled: false,
        git_push_enabled: false,
        credential_access_enabled: false,
        public_exposure_enabled: false,
      },
      redaction: { raw_excluded: true },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DisabledOneShotRuntimeDispatchExecutorSkeletonPanel status={status} error={null} />);

    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-complete="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-readback-enabled="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-refusal-validation-enabled="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-endpoint-present="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-contract-hardening-readback-enabled="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-idempotency-replay-block-metadata-enabled="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-contract-hardening="true"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-contract-hardening-field="exact_target_allowlist_schema_enabled"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-ref-pattern="idempotency_key_prefix"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-runtime-gate-open="false"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-dispatch-approved="false"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-runtime-execution-enabled="false"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-gate="disabled_by_default"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-required-input="exact_target_allowlist_required"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-execution-boundary="runtime_command_executed"');
    expect(markup).toContain('data-office-disabled-one-shot-runtime-dispatch-executor-skeleton-forbidden-boundary="target_mutation"');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw command|Traceback|\/Users\/lidises|\/home\/hermes|sk-|private-runtime|provider/i);
  });

  it("renders the queue-state manual review surface without executable controls or raw markdown", () => {
    const NasKeeperQueueManualEvidenceReviewSurfacePanel = (OfficePageModule as unknown as { NasKeeperQueueManualEvidenceReviewSurfacePanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperQueueManualEvidenceReviewSurfacePanel>> }).NasKeeperQueueManualEvidenceReviewSurfacePanel;
    const boundary = { detailKind: "nas_runtime_n3_approval_boundary_status_surface" } as ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface>;
    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);
    const surface = buildOfficeNasKeeperQueueManualEvidenceReviewSurface(action);

    const markup = renderToStaticMarkup(
      <NasKeeperQueueManualEvidenceReviewSurfacePanel
        surface={surface}
        readback={{
          listed: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_mac_relay_handoff_queue_readback",
            listed: true,
            queue_storage_ref: "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue",
            filters: { queue_status: "manual_review_required" },
            effective_limit: 2,
            available_count: 3,
            count: 1,
            skipped_count: 2,
            items: [{
              schema_version: 1,
              mode: "nas_keeper_mac_relay_handoff_queue_item_summary",
              handoff_ref: "handoff_queue_panel_demo",
              queue_ref: "nas_keeper_mac_relay_handoff_queue::handoff_queue_panel_demo",
              queue_status: "manual_review_required",
              relay_request_ref: "relay_req_queue_panel_demo",
              write_ref: "write_queue_panel_demo",
              package_ref: "pkg_queue_panel_demo",
              target_vault_ref: "vault_personal_wiki_demo",
              safe_slug: "queue-panel-demo",
              safe_title: "Queue panel demo",
              requested_by: "agent_nas_keeper",
              requested_at: "2026-05-18T03:20:00Z",
              nas_keeper_ref: "agent_nas_keeper",
              relay_node_ref: "mac_relay_primary",
              safe_logical_path: "vault_personal_wiki_demo::queue-panel-demo.md",
              safe_display_path: "vault_personal_wiki_demo / queue-panel-demo.md",
              payload_bytes: 88,
              markdown_body_included: false,
              next_required_boundary: "manual_nas_keeper_execution_evidence_review_if_needed",
              execution_evidence_refs: ["evidence_queue_panel_demo"],
            }],
            markdown_body_included: false,
            capabilities: { queue_read_enabled: true, queue_mutation_enabled: false, execution_state_recording_enabled: false, mac_relay_write_enabled: false, actual_nas_write_enabled: false, watcher_enabled: false, cron_enabled: false, dispatch_enabled: false },
            next_required_boundary: "manual_nas_keeper_execution_evidence_review_if_needed",
          },
        }}
        loading={false}
        error={null}
      />
    );

    expect(markup).toContain('data-office-nas-keeper-queue-manual-review="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-endpoint="/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-queue-readback-enabled="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-browser-fetch-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-queue-mutation-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-mac-relay-execution-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-markdown-body-projected="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-readback-count="1"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-readback-skipped-count="2"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-readback-item="handoff_queue_panel_demo"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-triage-lane="manual_review_required"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-triage-lane-count="1"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-triage-lane-next-boundary="manual_nas_keeper_execution_evidence_review_if_needed"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-terminal-count="0"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-manual-review-count="1"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-evidence-ref-count="1"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-queue-mutation-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-mac-relay-execution-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-nas-write-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-evidence-consolidation-lane="manual_review"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-enabled-controls="0"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-ready-for-replace-rollback-smoke="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-next-action="close_open_authorized_or_manual_review_items_first"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-check="manual_review"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-mac-relay-execution-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-queue-review-checklist-nas-write-enabled="false"');
    expect(markup).toContain("completed/failed handoff evidence consolidation");
    expect(markup).toContain("Manual review");
    expect(markup).toContain("Manual review needed");
    expect(markup).toContain("Queue panel demo");
    expect(markup).toContain("manual_nas_keeper_execution_evidence_review_if_needed");
    expect(markup.match(/data-office-nas-keeper-queue-manual-review-card=/g)?.length).toBe(4);
    expect(markup).toContain("manual evidence review");
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw queue panel prompt|raw markdown body|Traceback|\/Users\/lidises|token-shaped-queue-panel|private-queue-panel-provider/i);
  });
});


describe("AuthorityMetadataHandoffStatusPanel", () => {
  it("renders safe status-note authority metadata readback without executable controls", () => {
    const AuthorityMetadataHandoffStatusPanel = (OfficePageModule as unknown as {
      AuthorityMetadataHandoffStatusPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.AuthorityMetadataHandoffStatusPanel>>;
    }).AuthorityMetadataHandoffStatusPanel;
    const status: OfficeAuthorityMetadataHandoffStatus = {
      schema_version: 1,
      mode: "authority_metadata_handoff_status",
      request_id: "req_20260518_1801_handoff",
      correlation_id: "corr_20260518_1801_handoff",
      checkpoint_complete: true,
      chain_counts: { requests: 1, decisions: 1, dry_run_results: 1, audit_events: 1, authority_registry: 1 },
      latest_refs: { request: "req_20260518_1801_handoff", authority_registry: "adapter_20260518_handoff" },
      next_manual_lane: "manual_status_note_authority_handoff",
      capabilities: {
        metadata_readback_enabled: true,
        status_note_lane_enabled: true,
        adapter_dispatch_enabled: false,
        adapter_binding_enabled: false,
        target_mutation_enabled: false,
        credential_access_enabled: false,
        watcher_daemon_enabled: false,
        cron_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<AuthorityMetadataHandoffStatusPanel status={status} error={null} />);

    expect(markup).toContain('data-office-authority-metadata-handoff="true"');
    expect(markup).toContain('data-office-authority-metadata-handoff-complete="true"');
    expect(markup).toContain('data-office-authority-metadata-handoff-status-note-lane="true"');
    expect(markup).toContain('data-office-authority-metadata-handoff-dispatch-enabled="false"');
    expect(markup).toContain('data-office-authority-metadata-handoff-binding-enabled="false"');
    expect(markup).toContain('data-office-authority-metadata-handoff-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-authority-metadata-handoff-count="requests"');
    expect(markup).toContain('manual_status_note_authority_handoff');
    expect(markup).toContain('adapter_20260518_handoff');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|token-shaped-authority|private-authority-provider/i);
  });
});

describe("DispatcherAuthorityDryRunSurfacePanel", () => {
  it("renders a display-only dispatcher/authority dry-run plan without executable controls", () => {
    const DispatcherAuthorityDryRunSurfacePanel = (OfficePageModule as unknown as {
      DispatcherAuthorityDryRunSurfacePanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.DispatcherAuthorityDryRunSurfacePanel>>;
    }).DispatcherAuthorityDryRunSurfacePanel;
    const surface: OfficeDispatcherAuthorityDryRunSurface = {
      schema_version: 1,
      mode: "dispatcher_authority_dry_run_surface",
      request_id: "req_20260518_dispatcher_dryrun",
      correlation_id: "corr_20260518_dispatcher_dryrun",
      authority_ref: "authority_20260518_status_note",
      dry_run_plan: {
        plan_ref: "plan_req_20260518_dispatcher_dryrun",
        ready: true,
        would_dispatch: false,
        would_bind_authority_adapter: false,
        would_mutate_target: false,
        would_write_nas: false,
        would_start_daemon: false,
        would_record_audit: false,
        next_boundary: "explicit_dispatcher_authority_execution_approval_required",
        steps: [
          { step_ref: "read_authority_metadata_checkpoint", label: "safe readback", enabled: true },
          { step_ref: "prepare_simulated_dispatch_envelope", label: "safe dry-run display", enabled: true },
          { step_ref: "stop_before_execution_boundary", label: "stop", enabled: true },
        ],
      },
      capabilities: {
        dry_run_design_surface_enabled: true,
        adapter_dispatch_enabled: false,
        adapter_binding_enabled: false,
        target_mutation_enabled: false,
        nas_save_enabled: false,
        watcher_daemon_enabled: false,
      },
      errors: [],
    };

    const markup = renderToStaticMarkup(<DispatcherAuthorityDryRunSurfacePanel surface={surface} error={null} />);

    expect(markup).toContain('data-office-dispatcher-authority-dry-run="true"');
    expect(markup).toContain('data-office-dispatcher-authority-dry-run-ready="true"');
    expect(markup).toContain('data-office-dispatcher-authority-dry-run-dispatch-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-dry-run-binding-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-dry-run-target-mutation-enabled="false"');
    expect(markup).toContain('data-office-dispatcher-authority-dry-run-step="stop_before_execution_boundary"');
    expect(markup).toContain('explicit_dispatcher_authority_execution_approval_required');
    expect(markup).not.toContain("<form");
    expect(markup).not.toContain("<button");
    expect(markup).not.toContain("<input");
    expect(markup).not.toContain("<select");
    expect(markup).not.toContain("<textarea");
    expect(markup).not.toMatch(/raw markdown body|Traceback|\/Users\/lidises|\/home\/hermes|token-shaped-authority|private-authority-provider|sk-/i);
  });
});


describe("NasKeeperExecutionOperatorActionPanel", () => {
  it("builds one-call execute-and-record payloads from safe refs only", () => {
    const buildRequest = (OfficePageModule as unknown as {
      buildNasKeeperExecutionFromPreviewRequest: typeof OfficePageModule.buildNasKeeperExecutionFromPreviewRequest;
    }).buildNasKeeperExecutionFromPreviewRequest;
    const executionDraft = {
      handoff_ref: "handoff_inline_ui_demo",
      relay_execution_ref: "relay_exec_inline_ui_demo",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      relay_authorized_by: "agent_nas_keeper",
      relay_authorized_at: "2026-05-18T07:01:00Z",
    };
    const stateDraft = {
      execution_record_ref: "exec_record_inline_ui_demo",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T07:02:00Z",
      execution_status: "succeeded" as const,
      safe_summary: "safe summary not sent inline",
      evidence_refs: "evidence:not_sent_inline",
    };

    expect(buildRequest(executionDraft, stateDraft, false)).toBe(executionDraft);
    expect(buildRequest(executionDraft, stateDraft, true)).toEqual({
      ...executionDraft,
      record_execution_state_after_write: true,
      execution_record_ref: "exec_record_inline_ui_demo",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T07:02:00Z",
    });
    expect(JSON.stringify(buildRequest(executionDraft, stateDraft, true))).not.toMatch(/safe summary not sent inline|evidence:not_sent_inline|markdown_body|\/Users\/lidises|\/home\/hermes|Traceback|sk-/i);
  });

  it("prefills safe execution-state evidence from a successful execution result", () => {
    const buildDraft = (OfficePageModule as unknown as {
      buildNasKeeperExecutionStateDraftFromResult: typeof OfficePageModule.buildNasKeeperExecutionStateDraftFromResult;
    }).buildNasKeeperExecutionStateDraftFromResult;
    const current = {
      execution_record_ref: "exec_record_previous",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T06:00:00Z",
      execution_status: "manual_review_required" as const,
      safe_summary: "previous summary",
      evidence_refs: "previous:evidence",
    };
    const executionDraft = {
      handoff_ref: "handoff_evidence_prefill_demo",
      relay_execution_ref: "relay_exec_evidence_prefill_demo",
      nas_keeper_ref: "agent_nas_keeper",
      relay_node_ref: "mac_relay_primary",
      relay_authorized_by: "agent_nas_keeper",
      relay_authorized_at: "2026-05-18T06:01:00Z",
    };
    const result: OfficeNasKeeperExecutionFromPreviewResult = {
      executed: true,
      written: true,
      errors: [],
      dto: {
        mode: "nas_keeper_mac_relay_execution_from_preview_completed",
        relay_request_ref: "relay_req_evidence_prefill_demo",
        relay_execution_ref: "relay_exec_evidence_prefill_demo",
        write_ref: "write_evidence_prefill_demo",
        safe_logical_path: "vault_personal_wiki_demo::evidence-prefill-demo.md",
        safe_display_path: "vault_personal_wiki_demo / evidence-prefill-demo.md",
        bytes_written: 128,
        readback_verified: true,
        readback_sha256: "abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789",
        readback_first_line: "# Evidence prefill demo",
        rollback_created: true,
        rollback_ref: "rollback_write_evidence_prefill_demo",
        audit_written: true,
        audit_ref: "audit_write_evidence_prefill_demo",
        capabilities: { mac_relay_write_enabled: true, actual_nas_write_enabled: true },
        handoff_ref: "handoff_evidence_prefill_demo",
        queue_ref: "nas_keeper_mac_relay_handoff_queue::handoff_evidence_prefill_demo",
        queue_status: "authorized_for_mac_relay_execution",
        authorization_ref: "auth_evidence_prefill_demo",
        previewed_payload_verified: true,
        markdown_body_ref: "queued_markdown_body::handoff_evidence_prefill_demo",
        markdown_body_bytes: 128,
        markdown_body_sha256: "1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
        markdown_body_included: false,
        execution_bridge_path: ["authorized_queue_item_read", "safe_execution_payload_previewed", "mac_local_root_checked", "mac_relay_execution_completed"],
      },
    };

    const draft = buildDraft(current, executionDraft, result, "2026-05-18T06:02:00Z");

    expect(draft).toEqual({
      execution_record_ref: "exec_record_relay_exec_evidence_prefill_demo",
      recorded_by: "agent_nas_keeper",
      recorded_at: "2026-05-18T06:02:00Z",
      execution_status: "succeeded",
      safe_summary: "Mac relay write completed; readback and audit evidence were verified.",
      evidence_refs: "audit:audit_write_evidence_prefill_demo, readback_sha256:abcdef0123456789, rollback:rollback_write_evidence_prefill_demo, markdown_sha256:1234567890abcdef",
    });
    expect(JSON.stringify(draft)).not.toMatch(/markdown_body|\/Users\/lidises|\/home\/hermes|Traceback|sk-/i);

    const unchanged = buildDraft(current, executionDraft, { executed: false, written: false, errors: [{ field: "mac_relay_root", code: "mac_relay_root_not_configured" }], dto: null }, "2026-05-18T06:03:00Z");
    expect(unchanged).toBe(current);
  });

  it("renders authorized queue item prefill affordance without exposing raw body fields", () => {
    const NasKeeperQueueManualEvidenceReviewSurfacePanel = (OfficePageModule as unknown as { NasKeeperQueueManualEvidenceReviewSurfacePanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperQueueManualEvidenceReviewSurfacePanel>> }).NasKeeperQueueManualEvidenceReviewSurfacePanel;
    const boundary = { detailKind: "nas_runtime_n3_approval_boundary_status_surface" } as ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface>;
    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);
    const queueSurface = buildOfficeNasKeeperQueueManualEvidenceReviewSurface(action);
    const readback: OfficeNasKeeperHandoffQueueReadback = {
      listed: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_mac_relay_handoff_queue_readback",
        listed: true,
        queue_storage_ref: "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue",
        filters: {},
        effective_limit: 25,
        available_count: 1,
        count: 1,
        skipped_count: 0,
        markdown_body_included: false,
        next_required_boundary: "manual_nas_keeper_execution_evidence_review_if_needed",
        capabilities: { queue_read_enabled: true },
        items: [{
          schema_version: 1,
          mode: "nas_keeper_mac_relay_handoff_queue_item_summary",
          handoff_ref: "handoff_authorized_prefill_demo",
          queue_ref: "nas_keeper_mac_relay_handoff_queue::handoff_authorized_prefill_demo",
          queue_status: "authorized_for_mac_relay_execution",
          relay_request_ref: "relay_req_authorized_prefill_demo",
          write_ref: "write_authorized_prefill_demo",
          package_ref: "pkg_authorized_prefill_demo",
          target_vault_ref: "vault_personal_wiki_demo",
          safe_slug: "authorized-prefill-demo",
          safe_title: "Authorized prefill demo",
          requested_by: "agent_orchestrator",
          requested_at: "2026-05-18T06:00:00Z",
          nas_keeper_ref: "agent_nas_keeper",
          relay_node_ref: "mac_relay_primary",
          safe_logical_path: "vault_personal_wiki_demo::authorized-prefill-demo.md",
          safe_display_path: "vault_personal_wiki_demo / authorized-prefill-demo.md",
          payload_bytes: 128,
          markdown_body_included: false,
          next_required_boundary: "mac_relay_authenticated_execution_from_authorized_handoff",
          authorized_by: "agent_nas_keeper",
          authorized_at: "2026-05-18T06:01:00Z",
        }],
      },
    };

    const markup = renderToStaticMarkup(
      <NasKeeperQueueManualEvidenceReviewSurfacePanel
        surface={queueSurface}
        readback={readback}
        onPrefillExecutionFromQueue={() => undefined}
      />,
    );

    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-prefill-enabled="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review-prefill-item="handoff_authorized_prefill_demo"');
    expect(markup).toContain("실행 패널에 안전 refs 불러오기");
    expect(markup).not.toContain('name="markdown_" + "body"');
    expect(markup).not.toMatch(/raw markdown body|\/Users\/lidises|token-shaped-prefill|Traceback/i);
  });

  it("renders guarded execution-from-preview and state-record controls without markdown body projection", () => {
    const NasKeeperExecutionOperatorActionPanel = (OfficePageModule as unknown as { NasKeeperExecutionOperatorActionPanel: React.ComponentType<React.ComponentProps<typeof OfficePageModule.NasKeeperExecutionOperatorActionPanel>> }).NasKeeperExecutionOperatorActionPanel;
    const boundary = { detailKind: "nas_runtime_n3_approval_boundary_status_surface" } as ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface>;
    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);
    const queueSurface = buildOfficeNasKeeperQueueManualEvidenceReviewSurface(action);
    const operatorAction = buildOfficeNasKeeperExecutionOperatorAction(queueSurface);

    const markup = renderToStaticMarkup(
      <NasKeeperExecutionOperatorActionPanel
        action={operatorAction}
        draft={{
          handoff_ref: "handoff_operator_demo",
          relay_execution_ref: "relay_exec_operator_demo",
          nas_keeper_ref: "agent_nas_keeper",
          relay_node_ref: "mac_relay_primary",
          relay_authorized_by: "agent_nas_keeper",
          relay_authorized_at: "2026-05-18T05:00:00Z",
        }}
        stateDraft={{
          execution_record_ref: "exec_record_operator_demo",
          recorded_by: "agent_nas_keeper",
          recorded_at: "2026-05-18T05:01:00Z",
          execution_status: "succeeded",
          safe_summary: "safe execution result recorded",
          evidence_refs: "evidence_operator_demo",
        }}
        approved={false}
        recordStateAfterWrite={true}
        busy={false}
        result={null}
        stateBusy={false}
        stateResult={null}
        error={null}
        onDraftChange={() => undefined}
        onStateDraftChange={() => undefined}
        onApprovalChange={() => undefined}
        onRecordStateAfterWriteChange={() => undefined}
        onExecute={() => undefined}
        onRecordState={() => undefined}
      />
    );

    expect(markup).toContain('data-office-nas-keeper-execution-operator-action="true"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-execution-endpoint="/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-state-endpoint="/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-state"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-markdown-body-projected="false"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-vps-nas-authority-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-watcher-cron-daemon-enabled="false"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-inline-record-default="true"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-approval-default="false"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-request-safe-fields="handoff_ref,relay_execution_ref,nas_keeper_ref,relay_node_ref,relay_authorized_by,relay_authorized_at,record_execution_state_after_write,execution_record_ref,recorded_by,recorded_at"');
    expect(markup).toContain('name="handoff_ref"');
    expect(markup).toContain('name="execution_record_ref"');
    expect(markup).toContain('name="record_execution_state_after_write"');
    expect(markup).toContain("NAS Keeper → Mac relay 실행+기록");
    expect(markup).toContain("실행 상태 기록");
    expect(markup).not.toContain('name="markdown_" + "body"');
    expect(markup).not.toContain('name="raw_path"');
    expect(markup).not.toContain('name="token"');
    expect(markup).not.toMatch(/raw operator prompt|raw markdown body|Traceback|\/Users\/lidises|token-shaped-operator|private-operator-provider/i);
  });

  it("renders the live NAS Keeper queue and operator lane outside legacy diagnostics", () => {
    const NasKeeperLiveOperatorLanePanel = (OfficePageModule as unknown as {
      NasKeeperLiveOperatorLanePanel: React.ComponentType<{
        queueSurface: ReturnType<typeof buildOfficeNasKeeperQueueManualEvidenceReviewSurface>;
        queueReadback: OfficeNasKeeperHandoffQueueReadback | null;
        queueLoading: boolean;
        queueError: string | null;
        onPrefillExecutionFromQueue: () => undefined;
        operatorAction: ReturnType<typeof buildOfficeNasKeeperExecutionOperatorAction>;
        executionDraft: OfficeNasKeeperExecutionFromPreviewPayload;
        executionStateDraft: NasKeeperExecutionStateDraft;
        executionApproved: boolean;
        recordStateAfterWrite: boolean;
        executionBusy: boolean;
        executionResult: OfficeNasKeeperExecutionFromPreviewResult | null;
        stateBusy: boolean;
        stateResult: OfficeNasKeeperExecutionStateResult | null;
        executionError: string | null;
        onExecutionDraftChange: () => undefined;
        onExecutionStateDraftChange: () => undefined;
        onExecutionApprovalChange: () => undefined;
        onRecordStateAfterWriteChange: () => undefined;
        onExecute: () => undefined;
        onRecordState: () => undefined;
      }>;
    }).NasKeeperLiveOperatorLanePanel;
    const boundary = { detailKind: "nas_runtime_n3_approval_boundary_status_surface" } as ReturnType<typeof buildOfficeNasRuntimeN3ApprovalBoundaryStatusSurface>;
    const action = buildOfficeNasRuntimeSingleFileWriteApprovalAction(boundary);
    const queueSurface = buildOfficeNasKeeperQueueManualEvidenceReviewSurface(action);
    const operatorAction = buildOfficeNasKeeperExecutionOperatorAction(queueSurface);

    const markup = renderToStaticMarkup(
      <NasKeeperLiveOperatorLanePanel
        queueSurface={queueSurface}
        queueReadback={null}
        queueLoading={false}
        queueError={null}
        onPrefillExecutionFromQueue={() => undefined}
        operatorAction={operatorAction}
        executionDraft={{
          handoff_ref: "handoff_live_operator_demo",
          relay_execution_ref: "relay_exec_live_operator_demo",
          nas_keeper_ref: "agent_nas_keeper",
          relay_node_ref: "mac_relay_primary",
          relay_authorized_by: "agent_nas_keeper",
          relay_authorized_at: "2026-05-20T01:40:00Z",
        }}
        executionStateDraft={{
          execution_record_ref: "exec_record_live_operator_demo",
          recorded_by: "agent_nas_keeper",
          recorded_at: "2026-05-20T01:41:00Z",
          execution_status: "succeeded",
          safe_summary: "safe execution result recorded",
          evidence_refs: "evidence_live_operator_demo",
        }}
        executionApproved={false}
        recordStateAfterWrite={true}
        executionBusy={false}
        executionResult={null}
        stateBusy={false}
        stateResult={null}
        executionError={null}
        onExecutionDraftChange={() => undefined}
        onExecutionStateDraftChange={() => undefined}
        onExecutionApprovalChange={() => undefined}
        onRecordStateAfterWriteChange={() => undefined}
        onExecute={() => undefined}
        onRecordState={() => undefined}
      />,
    );

    expect(markup).toContain('data-office-nas-keeper-live-operator-lane="true"');
    expect(markup).toContain('data-office-nas-keeper-queue-manual-review="true"');
    expect(markup).toContain('data-office-nas-keeper-execution-operator-action="true"');
    expect(markup).toContain('data-office-nas-keeper-live-operator-lane-approval-default="false"');
    expect(markup).toContain('data-office-nas-keeper-live-operator-lane-inline-record-default="true"');
    expect(markup).not.toContain('name="markdown_" + "body"');
    expect(markup).not.toMatch(/raw operator prompt|raw markdown body|Traceback|\/Users\/lidises|token-shaped-operator|private-operator-provider/i);
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

describe("ControlledMutationApprovalBoundarySummaryPanel", () => {
  it("Controlled Mutation Approval Boundary 1 renders approved read-only followthrough and blocked mutation classes", () => {
    const ControlledMutationApprovalBoundarySummaryPanel = (OfficePageModule as unknown as {
      ControlledMutationApprovalBoundarySummaryPanel: React.ComponentType<{ boundary: ReturnType<typeof buildOfficeControlledMutationApprovalBoundarySummary> }>;
    }).ControlledMutationApprovalBoundarySummaryPanel;
    const executionReadiness = buildOfficeControlledMutationExecutionReadinessSummary(buildOfficeControlledMutationAuthoritySummary(buildOfficeControlledMutationHumanApprovalPlan(buildOfficeControlledMutationRollbackVerificationPlan(buildOfficeControlledMutationAuditSinkPlan(buildOfficeControlledMutationDryRunPlan(buildOfficeControlledMutationProposalContract(buildOfficeWorkerFinalGateChecklist(buildOfficeWorkerRollbackPreviewEnvelope(buildOfficeWorkerAuditPreviewEnvelope(buildOfficeWorkerDispatchDryRunEnvelope(buildOfficeWorkerAuthorityHandoffEnvelope(buildOfficeWorkerHumanConfirmationEnvelope(buildOfficeWorkerRequestDraftPreview(buildOfficeWorkerAssignmentCandidateGate(buildOfficeWorkerFacilityReadiness(buildOfficeWorkerIntentRouting(buildOfficeOrchestratorMediationQueue(buildOfficeAuthorityAdapterContract(buildOfficeApprovalExecutionGate(buildOfficeApprovalAuditTimeline(buildOfficeApprovalRequestView(officeFixture({
      generated_at: "2026-05-20T08:40:00Z",
      agents: [{ id: "agent-approval-boundary-render", status: "active", prompt: "raw approval boundary render prompt token-shaped-value", provider: "private-approval-boundary-render-provider" }],
      work_items: [{ id: "w-approval-boundary-render", status: "blocked", title: "raw approval boundary render task", body: "/Users/lidises/private/approval-boundary-render.md" } as unknown as OfficeState["work_items"][number]],
      data_sources: [{ id: "paperclip:/Users/lidises/approval-boundary-render", status: "partial", checked_at: "2026-05-20T08:40:00Z", item_count: 1, warning_count: 1, error_summary: "raw approval boundary render token" } as unknown as OfficeState["data_sources"][number]],
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
    const boundary = buildOfficeControlledMutationApprovalBoundarySummary(review);
    const markup = renderToStaticMarkup(<ControlledMutationApprovalBoundarySummaryPanel boundary={boundary} />);

    expect(markup).toContain("data-office-controlled-mutation-approval-boundary=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-enabled-controls=\"0\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-form-control-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-browser-executable-controls-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-local-documentation-write-approved=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-frontend-readonly-summary-approved=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-commit-push-approved=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-vps-dashboard-sync-approved=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-dashboard-restart-approved=\"true\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-gateway-restart-approved=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-kanban-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-nas-write-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-watcher-cron-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-dispatcher-authority-adapter-binding-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-target-mutation-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-direct-vps-nas-authority-enabled=\"false\"");
    expect(markup).toContain("data-office-controlled-mutation-approval-boundary-public-exposure-change-enabled=\"false\"");
    expect(markup.match(/data-office-controlled-mutation-approval-boundary-approved-scope=/g)?.length).toBe(4);
    expect(markup.match(/data-office-controlled-mutation-approval-boundary-blocked-capability=/g)?.length).toBe(8);
    expect(markup).not.toContain("onClick");
    expect(markup).not.toMatch(/<button|<form|<input|<select|<textarea/i);
    expect(markup).not.toMatch(/\/Users\/lidises|paperclip:\/Users|raw approval boundary render|private-approval-boundary-render-provider|token-shaped-value/i);
  });

  it("renders downstream consumption noop replay probe record without enabling execution", () => {
    const latestRecord = {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_noop_replay_probe_record",
      noop_replay_probe_recorded: true,
      noop_replay_probe_ref: "noopreplay-20260522133000-cafe2002",
      execution_gate_ref: "executiongate-20260522125000-cafe1001",
      execution_gate_record_sha256: "a".repeat(64),
      selection_profile: "latest_written",
      idempotency_probe_key_ref: "probe-key-20260522133000-cafe2002",
      probe_mode: "noop_replay_probe_only",
      execution_gate_record_verified: true,
      safe_ref_chain_verified: true,
      idempotency_probe_key_verified: true,
      noop_probe_result: "noop_probe_succeeded",
      approved_by: "operator-ai-office",
      approved_at: "2026-05-22T04:30:00Z",
      operator_confirmation: "confirmed-noop-replay-probe-boundary-only",
      safe_summary: "Safe noop replay probe metadata only; actual consumption remains disabled.",
      evidence_refs: ["evidence:execution-gate"],
      noop_replay_probe_record_sha256: "b".repeat(64),
      downstream_use_enabled: true,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      credential_value_included: false,
      repeat_execution_replay_allowed: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      capabilities: {
        noop_replay_probe_recording_enabled: true,
        noop_replay_probe_readback_enabled: true,
        actual_downstream_consumption_enabled: false,
        replay_store_write_enabled: false,
      },
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_replay_store_write_contract",
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeRecord;
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_noop_replay_probe_records_readback",
        record_count: 1,
        limit: 50,
        skipped_count: 0,
        records: [latestRecord],
        latest_record: latestRecord,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        credential_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {
          noop_replay_probe_recording_enabled: true,
          noop_replay_probe_readback_enabled: true,
          actual_downstream_consumption_enabled: false,
          replay_store_write_enabled: false,
        },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_replay_store_write_contract",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeReadbackResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbePanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-replay-probe-vps-nas-authority="false"');
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
  });

  it("renders downstream consumption replay-store write contract without writing replay state", () => {
    const contract = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract",
        replay_store_contract_ready: true,
        noop_replay_probe_record_verified: true,
        noop_replay_probe_ref: "noopreplay-20260522133000-cafe2002",
        noop_replay_probe_record_sha256: "b".repeat(64),
        execution_gate_ref: "executiongate-20260522125000-cafe1001",
        execution_gate_record_sha256: "a".repeat(64),
        safe_ref_chain_verified: true,
        idempotency_probe_key_ref: "probe-key-20260522133000-cafe2002",
        idempotency_probe_key_verified: true,
        replay_store_key_ref: "probe-key-20260522133000-cafe2002",
        contract_write_shape_version: "safe_replay_store_contract_v1",
        allowed_replay_store_fields: ["replay_store_entry_ref", "noop_replay_probe_ref", "replay_store_key_ref", "source_record_sha256", "result_status"],
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        credential_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {
          replay_store_contract_readback_enabled: true,
          replay_store_metadata_write_enabled: false,
          real_replay_store_write_enabled: false,
          actual_downstream_consumption_enabled: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
        },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_replay_store_metadata_write",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreWriteContractResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreWriteContractPanel contract={contract} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-real-replay-store-written="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-write-contract-vps-nas-authority="false"');
    expect(html).toContain("safe_replay_store_contract_v1");
    expect(html).toContain("fresh_request_builder_downstream_consumption_one_shot_replay_store_metadata_write");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
    const rawPathLeakPattern = new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test", "markdown_" + "body", "write payload"].join("|"), "i");
    expect(html).not.toMatch(rawPathLeakPattern);
  });

  it("renders actual consumption disabled readback as a read-only terminal proof", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_disabled_readback",
        actual_consumption_disabled_readback_ready: true,
        replay_store_metadata_record_verified: true,
        safe_ref_chain_verified: true,
        replay_store_entry_ref: "replaystore-20260522142000-cafe3003",
        noop_replay_probe_ref: "noopreplay-20260522133000-cafe2002",
        replay_store_key_ref: "probe-key-20260522133000-cafe2002",
        replay_store_metadata_record_sha256: "c".repeat(64),
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {
          disabled_readback_enabled: true,
          actual_downstream_consumption_enabled: false,
          replay_store_write_enabled: false,
          real_replay_store_write_enabled: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
        },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_design_if_approved",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionDisabledReadbackResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionDisabledReadbackPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-disabled-readback-vps-nas-authority="false"');
    expect(html).toContain("fresh_request_builder_downstream_consumption_one_shot_actual_consumption_execution_design_if_approved");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
    const rawPathLeakPattern = new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test", "markdown_" + "body", "write payload"].join("|"), "i");
    expect(html).not.toMatch(rawPathLeakPattern);
  });

  it("renders noop execution probe after opening as metadata-only and non-executing", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_records_readback",
        record_count: 1,
        records: [],
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_execution_contract_after_noop_probe",
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record",
          noop_execution_probe_recorded: true,
          noop_execution_probe_ready: true,
          noop_execution_probe_ref: "noopexec-20260522090000-test0001",
          execution_opening_ref: "executionopen-20260522083000-test0001",
          execution_opening_record_sha256: "e".repeat(64),
          idempotency_replay_guard_ref: "idempotencyguard-20260522081500-test0001",
          idempotency_replay_guard_record_sha256: "a".repeat(64),
          operator_execution_approval_ref: "operatorexecapproval-20260522080000-test0001",
          operator_execution_approval_record_sha256: "b".repeat(64),
          replay_store_entry_ref: "replaystore-20260522075900-test0001",
          replay_store_metadata_record_sha256: "c".repeat(64),
          execution_design_sha256: "d".repeat(64),
          execution_opening_record_verified: true,
          safe_ref_chain_verified: true,
          probe_mode: "noop_execution_probe_after_opening_only",
          noop_execution_probe_result: "noop_execution_probe_succeeded",
          probed_by: "operator-safe-ref",
          probed_at: "2026-05-22T09:00:00Z",
          safe_summary: "Safe noop execution probe only.",
          evidence_refs: ["code:959ce20f"],
          noop_execution_probe_record_sha256: "f".repeat(64),
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          downstream_consumed: false,
          actual_downstream_consumption_allowed: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          secret_value_included: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
          capabilities: {},
          next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_execution_contract_after_noop_probe",
        },
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopExecutionProbeResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopExecutionProbePanel record={record} />,
    );
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-noop-execution-probe="true"');
    expect(html).toContain("noopexec-20260522090000-test0001");
    expect(html).toContain("noop_execution_probe_ready</dt><dd>true");
    expect(html).toContain("actual_downstream_consumption_executed</dt><dd>false");
    expect(html).toContain("real_replay_store_written</dt><dd>false");
    expect(html).toContain("vps_nas_mount_enabled</dt><dd>false");
    expect(html).toContain("fresh_request_builder_downstream_consumption_one_shot_actual_execution_contract_after_noop_probe");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("must-not-echo");
    expect(html).not.toMatch(new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders post-execution record readback as verified and non-consuming", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_post_execution_record_readback",
        post_execution_record_readback_ready: true,
        actual_execution_record_verified: true,
        actual_execution_ref: "actualexec-20260522102000-smoke0001",
        actual_execution_record_sha256: "a".repeat(64),
        execution_contract_sha256: "b".repeat(64),
        noop_execution_probe_record_sha256: "c".repeat(64),
        execution_result_status: "metadata_only_execution_recorded_no_consumption",
        noop_execution_probe_record_verified: true,
        execution_contract_verified: true,
        safe_ref_chain_verified: true,
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_contract_after_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPostExecutionRecordReadbackResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPostExecutionRecordReadbackPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-post-execution-record-readback="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-post-execution-record-readback-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-post-execution-record-readback-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-post-execution-record-readback-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-post-execution-record-readback-vps-nas-authority="false"');
    expect(html).toContain("actualexec-20260522102000-smoke0001");
    expect(html).toContain("actual_execution_record_verified");
    expect(html).toContain("metadata_only_execution_recorded_no_consumption");
    expect(html).not.toMatch(new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders the downstream consumption payload contract as contract-only and display-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_contract",
        consumption_payload_contract_ready: true,
        post_execution_record_readback_verified: true,
        actual_execution_record_verified: true,
        safe_ref_chain_verified: true,
        actual_execution_ref: "actualexec-20260522100100-test0001",
        actual_execution_record_sha256: "a".repeat(64),
        source_actual_execution_record_sha256: "a".repeat(64),
        payload_contract_shape_version: "safe_consumption_payload_contract_v1",
        payload_contract_sha256: "b".repeat(64),
        allowed_payload_fields: ["actual_execution_ref", "payload_contract_sha256"],
        payload_materialization_status: "contract_only_no_body_materialized",
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: { consumption_payload_contract_enabled: true },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_readiness_after_contract",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadContractResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadContractPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-contract="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-contract-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-contract-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-contract-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-contract-vps-nas-authority="false"');
    expect(html).toContain("contract_only_no_body_materialized");
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization write gate as gate-only and display-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_write_gate",
        consumption_payload_materialization_write_gate_ready: true,
        payload_materialization_request_verified: true,
        payload_materialization_contract_verified: true,
        payload_readiness_verified: true,
        actual_execution_ref: "actualexec-20260522102000-smoke0001",
        payload_materialization_request_sha256: "a".repeat(64),
        payload_materialization_contract_sha256: "b".repeat(64),
        payload_readiness_sha256: "c".repeat(64),
        materialization_write_gate_shape_version: "safe_consumption_payload_materialization_write_gate_v1",
        payload_materialization_write_gate_sha256: "d".repeat(64),
        payload_materialization_write_gate_status: "write_gate_only_no_body_materialized",
        materialization_write_gate_decision: "ready_for_bounded_manual_body_materialization_record",
        allowed_write_gate_fields: ["actual_execution_ref", "payload_materialization_request_sha256", "body_ref_placeholder"],
        body_ref_placeholder: "future_safe_body_ref_required",
        body_sha256_placeholder: "future_body_sha256_required",
        body_bytes_placeholder: 0,
        manual_body_materialization_required: true,
        payload_body_materialization_write_gate_open: true,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_after_write_gate",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationWriteGateResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationWriteGatePanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate-open="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-write-gate-vps-nas-authority="false"');
    expect(html).toContain("safe_consumption_payload_materialization_write_gate_v1");
    expect(html).toContain("write_gate_only_no_body_materialized");
    expect(html).toContain("ready_for_bounded_manual_body_materialization_record");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization record readback as metadata-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_records_readback",
        record_count: 1,
        limit: 50,
        skipped_count: 0,
        records: [],
        latest_record: {
          payload_materialization_recorded: true,
          payload_materialization_record_ready: true,
          payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
          actual_execution_ref: "actualexec-20260522102000-smoke0001",
          body_ref: "bodyref-20260522103000-smoke0001",
          body_sha256: "1".repeat(64),
          body_bytes: 128,
          payload_materialization_record_sha256: "2".repeat(64),
          materialization_result_status: "metadata_only_body_materialization_recorded_no_body_payload",
          write_gate_verified: true,
          payload_body_materialization_recorded: true,
          payload_body_materialization_enabled: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          secret_value_included: false,
          vps_nas_mount_enabled: false,
        },
        payload_body_materialization_recorded: true,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_readback_after_write",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordReadbackResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-vps-nas-authority="false"');
    expect(html).toContain("metadata_only_body_materialization_recorded_no_body_payload");
    expect(html).toContain("bodyref-20260522103000-smoke0001");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization record summary as aggregate metadata-only", () => {
    const summary = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record_summary",
        payload_materialization_record_summary_ready: true,
        record_count: 1,
        skipped_count: 0,
        body_bytes_total: 128,
        unique_actual_execution_ref_count: 1,
        unique_body_ref_count: 1,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        latest_payload_materialization_record_sha256: "2".repeat(64),
        all_records_metadata_only: true,
        all_write_gates_verified: true,
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_record_summary_review_after_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordSummaryResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordSummaryPanel record={summary} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-summary="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-summary-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-summary-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-summary-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-record-summary-vps-nas-authority="false"');
    expect(html).toContain("payloadmat-20260522103000-smoke0001");
    expect(html).toContain("body bytes total");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization summary review gate record readback review record as metadata-only", () => {
    const record = {
      found: true,
      record_count: 1,
      skipped_count: 0,
      latest_record: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record",
        payload_materialization_summary_review_gate_record_readback_review_recorded: true,
        readback_review_record_ready: true,
        source_readback_review_verified: true,
        summary_review_gate_record_readback_review_record_ref: "reviewrecord-20260522105000-smoke0001",
        summary_review_gate_record_ref: "summaryreview-20260522104000-smoke0001",
        payload_materialization_summary_review_gate_record_sha256: "4".repeat(64),
        summary_review_gate_record_readback_review_record_sha256: "5".repeat(64),
        review_outcome: "ready_for_manual_readback_review_only_no_consumption",
        source_readback_verification_reviewed: true,
        checksum_review_passed: true,
        safe_ref_review_passed: true,
        aggregate_count_review_passed: true,
        decision_review_passed: true,
        disabled_flag_review_passed: true,
        source_record_count: 1,
        source_body_bytes_total: 128,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        recorded_by: "operator:test",
        recorded_at: "2026-05-22T10:50:00Z",
        safe_summary: "Metadata-only readback review record; no downstream consumption performed.",
        evidence_refs: ["test:readback-review-record"],
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback",
      },
      records: [],
      errors: [],
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordListResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-record="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-record-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-record-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-record-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-record-vps-nas-authority="false"');
    expect(html).toContain("reviewrecord-20260522105000-smoke0001");
    expect(html).toContain("summaryreview-20260522104000-smoke0001");
    expect(html).toContain("ready_for_manual_readback_review_only_no_consumption");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization summary review gate record readback review as read-only", () => {
    const review = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review",
        payload_materialization_summary_review_gate_record_readback_review_ready: true,
        source_readback_verification_reviewed: true,
        checksum_review_passed: true,
        safe_ref_review_passed: true,
        aggregate_count_review_passed: true,
        decision_review_passed: true,
        disabled_flag_review_passed: true,
        review_outcome: "ready_for_manual_readback_review_only_no_consumption",
        summary_review_gate_record_ref: "summaryreview-20260522104000-smoke0001",
        payload_materialization_summary_review_gate_sha256: "3".repeat(64),
        payload_materialization_summary_review_gate_record_sha256: "4".repeat(64),
        review_gate_decision: "ready_for_bounded_manual_payload_materialization_review_gate_only",
        source_record_count: 1,
        source_body_bytes_total: 128,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        latest_payload_materialization_record_sha256: "2".repeat(64),
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_record",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewPanel record={review} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-vps-nas-authority="false"');
    expect(html).toContain("ready_for_manual_readback_review_only_no_consumption");
    expect(html).toContain("summaryreview-20260522104000-smoke0001");
    expect(html).toContain("payloadmat-20260522103000-smoke0001");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization summary review gate record readback as verified and display-only", () => {
    const readback = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_verified",
        payload_materialization_summary_review_gate_record_readback_verified: true,
        source_record_readback_verified: true,
        record_checksum_verified: true,
        source_review_gate_checksum_verified: true,
        safe_ref_chain_verified: true,
        aggregate_counts_verified: true,
        review_gate_decision_verified: true,
        disabled_capability_flags_verified: true,
        summary_review_gate_record_ref: "summaryreview-20260522104000-smoke0001",
        payload_materialization_summary_review_gate_sha256: "3".repeat(64),
        payload_materialization_summary_review_gate_record_sha256: "4".repeat(64),
        review_gate_decision: "ready_for_bounded_manual_payload_materialization_review_gate_only",
        source_record_count: 1,
        source_body_bytes_total: 128,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        latest_payload_materialization_record_sha256: "2".repeat(64),
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackPanel record={readback} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-vps-nas-authority="false"');
    expect(html).toContain("summaryreview-20260522104000-smoke0001");
    expect(html).toContain("payloadmat-20260522103000-smoke0001");
    expect(html).toContain("record_checksum_verified");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization summary review gate record as metadata-only and display-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record",
        payload_materialization_summary_review_gate_recorded: true,
        payload_materialization_summary_review_gate_record_ready: true,
        source_review_gate_verified: true,
        safe_ref_chain_verified: true,
        summary_review_gate_record_ref: "summaryreview-20260522104000-smoke0001",
        payload_materialization_summary_review_gate_sha256: "3".repeat(64),
        payload_materialization_summary_review_gate_record_sha256: "4".repeat(64),
        review_gate_decision: "ready_for_bounded_manual_payload_materialization_review_gate_only",
        source_record_count: 1,
        source_body_bytes_total: 128,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        latest_payload_materialization_record_sha256: "2".repeat(64),
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-vps-nas-authority="false"');
    expect(html).toContain("summaryreview-20260522104000-smoke0001");
    expect(html).toContain("payloadmat-20260522103000-smoke0001");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization summary review gate as read-only", () => {
    const review = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate",
        payload_materialization_summary_review_gate_ready: true,
        source_summary_verified: true,
        summary_readiness_verified: true,
        aggregate_counts_verified: true,
        metadata_only_flags_verified: true,
        write_gate_summary_verified: true,
        safe_latest_refs_verified: true,
        review_gate_decision: "ready_for_bounded_manual_payload_materialization_review_gate_only",
        source_record_count: 1,
        source_body_bytes_total: 128,
        source_unique_actual_execution_ref_count: 1,
        source_unique_body_ref_count: 1,
        latest_payload_materialization_record_ref: "payloadmat-20260522103000-smoke0001",
        latest_actual_execution_ref: "actualexec-20260522102000-smoke0001",
        latest_body_ref: "bodyref-20260522103000-smoke0001",
        latest_payload_materialization_record_sha256: "2".repeat(64),
        records_included: false,
        latest_record_included: false,
        payload_body_materialization_enabled: false,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGatePanel record={review} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-vps-nas-authority="false"');
    expect(html).toContain("ready_for_bounded_manual_payload_materialization_review_gate_only");
    expect(html).toContain("source_record_count");
    expect(html).toContain("payloadmat-20260522103000-smoke0001");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload materialization request as request-only", () => {
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRequestPanel
        record={{
          found: true,
          errors: [],
          dto: {
            schema_version: 1,
            mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_request",
            consumption_payload_materialization_request_ready: true,
            payload_materialization_contract_verified: true,
            payload_readiness_verified: true,
            materialization_request_shape_version: "safe_consumption_payload_materialization_request_v1",
            payload_materialization_request_sha256: "c".repeat(64),
            payload_materialization_request_status: "request_only_no_body_materialized",
            materialization_request_decision: "ready_for_bounded_manual_body_materialization_write_gate",
            requested_materialization_fields: ["actual_execution_ref", "body_ref_placeholder"],
            body_ref_placeholder: "future_safe_body_ref_required",
            body_sha256_placeholder: "future_body_sha256_required",
            body_bytes_placeholder: 0,
            manual_body_materialization_required: true,
            payload_body_materialization_enabled: false,
            downstream_consumption_enabled: false,
            downstream_consumed: false,
            actual_downstream_consumption_allowed: false,
            actual_downstream_consumption_executed: false,
            replay_store_write_enabled: false,
            real_replay_store_written: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            secret_value_included: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
            next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_write_gate_after_request",
          },
        }}
      />,
    );
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-request="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-request-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-request-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-request-replay-store-write="false"');
    expect(html).toContain('request_only_no_body_materialized');
    expect(html).toContain('future_safe_body_ref_required');
    expect(html).not.toContain("must" + "-not-echo");
    expect(html).not.toContain("/vol" + "ume1/private");
    expect(html).not.toContain("sk" + "-test-secret");
  });

  it("renders the downstream consumption materialization contract as contract-only and display-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_contract",
        consumption_payload_materialization_contract_ready: true,
        payload_readiness_verified: true,
        payload_contract_verified: true,
        actual_execution_ref: "actualexec-20260522102000-smoke0001",
        payload_contract_sha256: "a".repeat(64),
        payload_readiness_sha256: "b".repeat(64),
        materialization_contract_shape_version: "safe_consumption_payload_materialization_contract_v1",
        payload_materialization_contract_sha256: "c".repeat(64),
        payload_materialization_status: "contract_only_no_body_materialized",
        materialization_contract_decision: "ready_for_bounded_manual_body_materialization_request_contract",
        allowed_materialization_fields: ["actual_execution_ref", "payload_contract_sha256", "payload_readiness_sha256", "payload_materialization_contract_sha256", "materialization_contract_shape_version", "payload_materialization_status", "body_ref_placeholder", "body_sha256_placeholder", "body_bytes_placeholder"],
        body_ref_placeholder: "future_safe_body_ref_required",
        body_sha256_placeholder: "future_body_sha256_required",
        body_bytes_placeholder: 0,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_request_after_contract",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationContractResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationContractPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-contract="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-contract-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-contract-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-contract-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-contract-vps-nas-authority="false"');
    expect(html).toContain("safe_consumption_payload_materialization_contract_v1");
    expect(html).toContain("contract_only_no_body_materialized");
    expect(html).toContain("future_safe_body_ref_required");
    expect(html).not.toMatch(/<button|<input|<select|<textarea/i);
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders downstream consumption payload readiness as readiness-only and display-only", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_readiness",
        consumption_payload_readiness_ready: true,
        payload_contract_verified: true,
        consumption_payload_contract_ready: true,
        actual_execution_ref: "actualexec-20260522100100-test0001",
        payload_contract_shape_version: "safe_consumption_payload_contract_v1",
        payload_contract_sha256: "b".repeat(64),
        readiness_shape_version: "safe_consumption_payload_readiness_v1",
        payload_readiness_sha256: "c".repeat(64),
        payload_materialization_status: "readiness_only_no_body_materialized",
        readiness_decision: "ready_for_bounded_manual_payload_materialization_review",
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_contract_after_readiness",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadReadinessResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadReadinessPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-readiness="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-readiness-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-readiness-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-readiness-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-readiness-vps-nas-authority="false"');
    expect(html).toContain("readiness_only_no_body_materialized");
    expect(html).toContain("ready_for_bounded_manual_payload_materialization_review");
    expect(html).not.toMatch(new RegExp(["must" + "-not-echo", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders actual execution record after contract as metadata-only and non-consuming", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_records_readback",
        record_count: 1,
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record",
          actual_execution_recorded: true,
          actual_execution_record_ready: true,
          actual_execution_ref: "actualexec-20260522100100-test0001",
          noop_execution_probe_ref: "noopexec-20260522091700-probe0001",
          noop_execution_probe_record_sha256: "a".repeat(64),
          execution_contract_sha256: "b".repeat(64),
          operator_confirmation_ref: "operatorconfirm-20260522100100-test0001",
          execution_contract_verified: true,
          noop_execution_probe_record_verified: true,
          safe_ref_chain_verified: true,
          execution_result_status: "metadata_only_execution_recorded_no_consumption",
          actual_execution_record_sha256: "c".repeat(64),
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          downstream_consumed: false,
          actual_downstream_consumption_allowed: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          secret_value_included: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
          next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_post_execution_record_readback",
        },
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {},
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_post_execution_record_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionRecordResult;

    const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionRecordPanel record={record} error={null} />);

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-record="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-record-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-record-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-record-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-record-vps-nas-authority="false"');
    expect(html).toContain("actualexec-20260522100100-test0001");
    expect(html).toContain("metadata_only_execution_recorded_no_consumption");
    expect(html).toContain("actual_downstream_consumption_executed");
    expect(html).toContain("false");
    expect(html).not.toMatch(new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
    expect(html).not.toMatch(/<button|<input|<textarea|<select/i);
  });

  it("renders actual execution contract after noop probe as contract-only and non-executing", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_contract",
        actual_execution_contract_ready: true,
        noop_execution_probe_record_verified: true,
        noop_execution_probe_ref: "noopexec-20260522090000-test0001",
        noop_execution_probe_record_sha256: "f".repeat(64),
        execution_opening_ref: "executionopen-20260522083000-test0001",
        execution_opening_record_sha256: "e".repeat(64),
        idempotency_replay_guard_ref: "idempotencyguard-20260522081500-test0001",
        idempotency_replay_guard_record_sha256: "a".repeat(64),
        operator_execution_approval_ref: "operatorexecapproval-20260522080000-test0001",
        operator_execution_approval_record_sha256: "b".repeat(64),
        replay_store_entry_ref: "replaystore-20260522075900-test0001",
        replay_store_metadata_record_sha256: "c".repeat(64),
        execution_design_sha256: "d".repeat(64),
        safe_ref_chain_verified: true,
        execution_contract_shape_version: "safe_actual_execution_contract_v1",
        execution_contract_sha256: "1".repeat(64),
        allowed_execution_fields: [
          "actual_execution_ref",
          "noop_execution_probe_ref",
          "noop_execution_probe_record_sha256",
          "execution_contract_sha256",
          "operator_confirmation_ref",
          "execution_result_status",
          "evidence_refs",
        ],
        downstream_use_enabled: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        secret_value_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {},
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_execution_record_after_contract",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionContractResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionContractPanel record={record} />,
    );
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-execution-contract="true"');
    expect(html).toContain("noopexec-20260522090000-test0001");
    expect(html).toContain("actual_execution_contract_ready</dt><dd>true");
    expect(html).toContain("actual_downstream_consumption_executed</dt><dd>false");
    expect(html).toContain("real_replay_store_written</dt><dd>false");
    expect(html).toContain("vps_nas_mount_enabled</dt><dd>false");
    expect(html).toContain("safe_actual_execution_contract_v1");
    expect(html).toContain("fresh_request_builder_downstream_consumption_one_shot_actual_execution_record_after_contract");
    expect(html).not.toContain("/vol" + "ume1");
    expect(html).not.toContain("must-not-echo");
    expect(html).not.toMatch(new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test"].join("|"), "i"));
  });

  it("renders execution opening as metadata-only and non-executing", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_records_readback",
        record_count: 1,
        records: [],
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_noop_execution_probe_after_opening",
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record",
          execution_opening_recorded: true,
          execution_opening_ready: true,
          execution_opening_ref: "executionopen-20260522083000-test0001",
          idempotency_replay_guard_ref: "idempotencyguard-20260522081556-test0001",
          idempotency_replay_guard_record_verified: true,
          safe_ref_chain_verified: true,
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          actual_downstream_consumption_allowed: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          secret_value_included: false,
          execution_opening_record_sha256: "f".repeat(64),
          next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_noop_execution_probe_after_opening",
        },
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionOpeningResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionOpeningPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-opening="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-opening-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-opening-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-opening-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-execution-opening-vps-nas-authority="false"');
    expect(html).toContain("execution_opening_ready</dt><dd>true");
    expect(html).toContain("next_required_boundary</dt><dd>fresh_request_builder_downstream_consumption_one_shot_noop_execution_probe_after_opening");
    expect(html).not.toContain("/volume1");
    expect(html).not.toContain("write payload");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<input");
  });

  it("renders idempotency replay guard as metadata-only and non-executing", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_records_readback",
        record_count: 1,
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record",
          idempotency_replay_guard_recorded: true,
          idempotency_replay_guard_ref: "idempotencyguard-20260522173000-test",
          operator_execution_approval_ref: "operatorexecapproval-20260522161000-test",
          operator_execution_approval_record_sha256: "a".repeat(64),
          replay_store_entry_ref: "replaystore-20260522161000-test",
          replay_store_metadata_record_sha256: "b".repeat(64),
          execution_design_sha256: "c".repeat(64),
          idempotency_replay_guard_record_sha256: "d".repeat(64),
          operator_execution_approval_record_verified: true,
          execution_design_verified: true,
          replay_store_metadata_record_verified: true,
          safe_ref_chain_verified: true,
          duplicate_execution_design_blocked: true,
          duplicate_replay_store_entry_blocked: true,
          duplicate_operator_execution_approval_blocked: true,
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          downstream_consumed: false,
          actual_downstream_consumption_allowed: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          secret_value_included: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
          next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_execution_opening_after_idempotency_guard",
        },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_execution_opening_after_idempotency_guard",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionIdempotencyReplayGuardResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionIdempotencyReplayGuardPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-idempotency-replay-guard="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-idempotency-replay-guard-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-idempotency-replay-guard-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-idempotency-replay-guard-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-idempotency-replay-guard-vps-nas-authority="false"');
    expect(html).toContain("duplicate_execution_design_blocked</dt><dd>true");
    expect(html).toContain("duplicate_replay_store_entry_blocked</dt><dd>true");
    expect(html).not.toContain("/volume1");
    expect(html).not.toContain("write payload");
    expect(html).not.toContain("<button");
    expect(html).not.toContain("<input");
  });

  it("renders operator execution approval as metadata-only and non-executing", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_records_readback",
        record_count: 1,
        skipped_count: 0,
        records: [],
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record",
          operator_execution_approval_recorded: true,
          operator_execution_approval_ref: "operatorexecapproval-20260522161000-test",
          replay_store_entry_ref: "replaystore-entry-safe-ref",
          noop_replay_probe_ref: "noopreplay-safe-ref",
          replay_store_key_ref: "probe-key-safe-ref",
          replay_store_metadata_record_sha256: "c".repeat(64),
          execution_design_sha256: "d".repeat(64),
          execution_design_verified: true,
          replay_store_metadata_record_verified: true,
          safe_ref_chain_verified: true,
          approval_scope: "one_shot_actual_downstream_consumption_execution",
          approved_by: "operator-safe-ref",
          approved_at: "2026-05-22T16:10:00Z",
          operator_confirmation: "confirmed-approve-one-shot-actual-downstream-consumption-execution-metadata-only",
          safe_summary: "Approve one future metadata-only actual execution attempt after guards.",
          evidence_refs: ["handoff:actual-consumption-execution-design"],
          operator_execution_approval_record_sha256: "e".repeat(64),
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          downstream_consumed: false,
          actual_downstream_consumption_allowed: false,
          actual_downstream_consumption_executed: false,
          replay_store_write_enabled: false,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
        },
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        real_replay_store_written: false,
        replay_store_write_enabled: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_idempotency_replay_guard",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOperatorExecutionApprovalResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOperatorExecutionApprovalPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-operator-execution-approval="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-operator-execution-approval-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-operator-execution-approval-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-operator-execution-approval-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-operator-execution-approval-vps-nas-authority="false"');
    expect(html).toContain("operatorexecapproval-20260522161000-test");
    expect(html).toContain("one_shot_actual_downstream_consumption_execution");
    expect(html).not.toContain("&lt;form");
    expect(html).not.toContain("&lt;button");
    expect(html).not.toMatch(/\/Users\/|\/home\/hermes|\/volume1|sk-test|write payload/i);
  });

  it("renders actual consumption execution design as a read-only exact boundary", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design" as const,
        execution_design_ready: true,
        disabled_readback_verified: true,
        replay_store_metadata_record_verified: true,
        safe_ref_chain_verified: true,
        replay_store_entry_ref: "replaystore-entry-safe-ref",
        replay_store_metadata_record_sha256: "c".repeat(64),
        allowed_execution_input_refs: [
          "replay_store_entry_ref",
          "noop_replay_probe_ref",
          "replay_store_key_ref",
          "replay_store_metadata_record_sha256",
          "operator_exact_execution_approval_ref",
        ],
        required_pre_execution_gates: [
          "operator_exact_execution_approval_record",
          "idempotency_replay_guard",
          "rollback_disable_ref",
          "post_execution_proof_contract",
        ],
        rollback_disable_required: true,
        post_execution_proof_required: true,
        operator_exact_execution_approval_required: true,
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        actual_downstream_consumption_executed: false,
        replay_store_write_enabled: false,
        real_replay_store_written: false,
        markdown_body_included: false,
        write_payload_included: false,
        raw_root_path_included: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: { actual_downstream_consumption_enabled: false, real_replay_store_write_enabled: false, vps_nas_mount_enabled: false },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_operator_exact_execution_approval",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionExecutionDesignResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionExecutionDesignPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design-ready="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design-allowed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design-executed="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design-replay-store-write="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-actual-consumption-execution-design-vps-nas-authority="false"');
    expect(html).toContain("operator_exact_execution_approval_record");
    expect(html).toContain("replaystore-entry-safe-ref");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
  });

  it("renders downstream consumption replay-store metadata record without actual consumption", () => {
    const record = {
      found: true,
      errors: [],
      dto: {
        schema_version: 1,
        mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_metadata_records_readback",
        record_count: 1,
        limit: 50,
        skipped_count: 0,
        records: [],
        latest_record: {
          schema_version: 1,
          mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_metadata_record",
          replay_store_metadata_recorded: true,
          replay_store_entry_ref: "replaystore-20260522142000-cafe3003",
          noop_replay_probe_ref: "noopreplay-20260522133000-cafe2002",
          noop_replay_probe_record_sha256: "b".repeat(64),
          replay_store_key_ref: "probe-key-20260522133000-cafe2002",
          source_record_sha256: "b".repeat(64),
          contract_write_shape_version: "safe_replay_store_contract_v1",
          contract_write_shape_version_verified: true,
          noop_replay_probe_record_verified: true,
          safe_ref_chain_verified: true,
          source_record_sha256_verified: true,
          result_status: "metadata_recorded_only",
          recorded_by: "operator-ai-office",
          recorded_at: "2026-05-22T05:20:00Z",
          operator_confirmation: "confirmed-replay-store-metadata-only",
          safe_summary: "Safe replay-store metadata record only; actual downstream consumption remains disabled.",
          evidence_refs: ["evidence:noop-replay-probe", "evidence:replay-store-contract"],
          replay_store_metadata_record_sha256: "c".repeat(64),
          downstream_use_enabled: true,
          downstream_consumption_enabled: false,
          downstream_consumed: false,
          actual_downstream_consumption_allowed: false,
          replay_store_write_enabled: true,
          real_replay_store_written: false,
          markdown_body_included: false,
          write_payload_included: false,
          raw_root_path_included: false,
          credential_value_included: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
          capabilities: {
            replay_store_metadata_write_enabled: true,
            real_replay_store_write_enabled: false,
            actual_downstream_consumption_enabled: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            vps_nas_mount_enabled: false,
          },
          next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback",
        },
        downstream_consumption_enabled: false,
        downstream_consumed: false,
        actual_downstream_consumption_allowed: false,
        replay_store_write_enabled: true,
        real_replay_store_written: false,
        watcher_enabled: false,
        cron_enabled: false,
        dispatch_enabled: false,
        authority_adapter_binding_enabled: false,
        vps_nas_mount_enabled: false,
        capabilities: {
          replay_store_metadata_write_enabled: true,
          real_replay_store_write_enabled: false,
          actual_downstream_consumption_enabled: false,
          watcher_enabled: false,
          cron_enabled: false,
          dispatch_enabled: false,
          authority_adapter_binding_enabled: false,
          vps_nas_mount_enabled: false,
        },
        next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback",
      },
    } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataReadbackResult;
    const html = renderToStaticMarkup(
      <OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataPanel record={record} />,
    );

    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-recorded="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-downstream-consumption-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-replay-store-write="true"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-real-replay-store-written="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-automation-enabled="false"');
    expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-store-metadata-vps-nas-authority="false"');
    expect(html).toContain("metadata_recorded_only");
    expect(html).toContain("fresh_request_builder_downstream_consumption_one_shot_actual_consumption_disabled_readback");
    expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
    const rawPathLeakPattern = new RegExp(["/Us" + "ers/lidises", "/ho" + "me/hermes", "/vol" + "ume1", "sk" + "-test", "markdown_" + "body", "write payload"].join("|"), "i");
    expect(html).not.toMatch(rawPathLeakPattern);
  });

});


it("renders payload attestation readback review readback as read-only", () => {
  const readback = {
    found: true,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified",
      payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified: true,
      source_attestation_readback_review_verified: true,
      attestation_readback_review_checksum_verified: true,
      source_attestation_checksum_verified: true,
      safe_ref_chain_verified: true,
      manual_review_outcome_verified: true,
      reviewer_metadata_verified: true,
      disabled_capability_flags_verified: true,
      readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523083000-smoke0001",
      readback_review_attestation_ref: "readbackreview-20260523035000-smoke0001",
      readback_review_attestation_sha256: "3".repeat(64),
      summary_review_gate_record_readback_review_record_ref: "reviewrecord-20260523030000-smoke0001",
      manual_review_outcome: "reviewed_attestation_readback_for_manual_only_no_consumption",
      attestation_readback_verified: true,
      source_checksum_reviewed: true,
      safe_ref_chain_reviewed: true,
      disabled_capabilities_reviewed: true,
      reviewed_by: "operator:smoke",
      reviewed_at: "2026-05-23T08:30:00Z",
      attestation_readback_review_sha256: "4".repeat(64),
      evidence_ref_count: 1,
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackPanel record={readback} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-executed="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-vps-nas-authority="false"');
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("renders payload attestation readback review readback review as read-only", () => {
  const record = {
    found: true,
    errors: [],
    record_count: 1,
    records: [],
    latest_record: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review",
      payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviewed: true,
      source_attestation_readback_review_readback_verified: true,
      attestation_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreview-20260523113000-smoke0001",
      readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523083000-smoke0001",
      readback_review_attestation_ref: "readbackreview-20260523035000-smoke0001",
      attestation_readback_review_sha256: "4".repeat(64),
      manual_review_outcome: "reviewed_attestation_readback_review_readback_for_manual_only_no_consumption",
      attestation_readback_review_readback_verified: true,
      source_checksum_reviewed: true,
      safe_ref_chain_reviewed: true,
      disabled_capabilities_reviewed: true,
      reviewed_by: "operator:smoke",
      reviewed_at: "2026-05-23T11:30:00Z",
      attestation_readback_review_readback_review_sha256: "5".repeat(64),
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewsResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-executed="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-vps-nas-authority="false"');
  expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("renders payload attestation readback review readback review readback as read-only", () => {
  const record = {
    found: true,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback",
      payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_verified: true,
      source_attestation_readback_review_readback_review_verified: true,
      attestation_readback_review_readback_review_checksum_verified: true,
      safe_ref_chain_verified: true,
      manual_review_outcome_verified: true,
      disabled_capability_flags_verified: true,
      attestation_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreview-20260523150000-smoke0001",
      readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523083000-smoke0001",
      readback_review_attestation_ref: "readbackreview-20260523033000-smoke0001",
      attestation_readback_review_sha256: "6".repeat(64),
      attestation_readback_review_readback_review_sha256: "7".repeat(64),
      attestation_readback_review_readback_review_readback_sha256: "8".repeat(64),
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-executed="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-vps-nas-authority="false"');
  expect(html).toContain("payload attestation readback review readback review readback");
  expect(html).toContain("attestationreadbackreviewreadbackreview-20260523150000-smoke0001");
  expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
});

it("renders payload attestation readback review readback review readback review as read-only", () => {
  const record = {
    found: true,
    errors: [],
    record_count: 1,
    records: [],
    latest_record: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review",
      payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviewed: true,
      source_attestation_readback_review_readback_review_readback_verified: true,
      attestation_readback_review_readback_review_readback_verified: true,
      source_checksum_reviewed: true,
      safe_ref_chain_reviewed: true,
      disabled_capabilities_reviewed: true,
      reviewed_by: "operator:test",
      reviewed_at: "2026-05-23T15:00:00Z",
      manual_review_outcome: "reviewed_attestation_readback_review_readback_review_readback_for_manual_only_no_consumption",
      attestation_readback_review_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreviewreadbackreview-20260523150000-smoke0001",
      attestation_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreview-20260523124200-smoke0001",
      readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523083000-smoke0001",
      readback_review_attestation_ref: "readbackreview-20260523033000-smoke0001",
      attestation_readback_review_readback_review_sha256: "7".repeat(64),
      attestation_readback_review_readback_review_readback_sha256: "8".repeat(64),
      attestation_readback_review_readback_review_readback_review_sha256: "9".repeat(64),
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewsResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-executed="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-vps-nas-authority="false"');
  expect(html).toContain("payload attestation readback review readback review readback review");
  expect(html).toContain("attestationreadbackreviewreadbackreviewreadbackreview-20260523150000-smoke0001");
  expect(html).not.toMatch(/<button|<form|<input|<select|<textarea/);
});


it("renders payload attestation readback review readback review readback review readback panel without controls or raw leaks", () => {
  const record = {
    found: true,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback",
      payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_verified: true,
      source_attestation_readback_review_readback_review_readback_review_verified: true,
      attestation_readback_review_readback_review_readback_review_checksum_verified: true,
      safe_ref_chain_verified: true,
      manual_review_outcome_verified: true,
      disabled_capability_flags_verified: true,
      attestation_readback_review_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreviewreadbackreview-20260523150000-smoke0001",
      attestation_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreview-20260523124200-smoke0001",
      readback_review_attestation_readback_review_ref: "attestationreadbackreview-20260523110000-smoke0001",
      readback_review_attestation_ref: "readbackreview-20260523094000-smoke0001",
      attestation_readback_review_readback_review_readback_review_sha256: "9".repeat(64),
      attestation_readback_review_readback_review_readback_review_readback_sha256: "a".repeat(64),
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_review",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewReadbackResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewReadbackPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback-executed="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback-vps-nas-authority="false"');
  expect(html).toContain("payload attestation readback review readback review readback review readback");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper payload/write-payload preview contract panel is readonly and safe-ref only", () => {
  const record = {
    found: true,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_write_preview_contract",
      payload_write_preview_contract_ready: true,
      write_readiness_stage: "payload_write_preview_contract",
      write_readiness_percent: 72,
      source_readback_verified: true,
      safe_ref_chain_verified: true,
      source_attestation_readback_review_readback_review_readback_review_ref: "attestationreadbackreviewreadbackreviewreadbackreview-20260523143000-test0001",
      source_attestation_readback_review_readback_review_readback_review_readback_sha256: "a".repeat(64),
      payload_preview_ref: "payloadpreview-abcdef0123456789",
      write_payload_preview_ref: "writepayloadpreview-abcdef0123456789",
      payload_preview_sha256: "b".repeat(64),
      write_payload_preview_sha256: "c".repeat(64),
      payload_preview_contract_type: "safe_ref_checksum_only_no_body",
      write_payload_preview_contract_type: "safe_ref_checksum_only_no_write_payload_object",
      records_included: false,
      latest_record_included: false,
      payload_body_materialization_enabled: false,
      payload_body_materialized: false,
      downstream_consumption_enabled: false,
      downstream_consumed: false,
      actual_downstream_consumption_allowed: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      mac_relay_tmp_root_write_smoke_enabled: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_tmp_root_write_smoke_after_payload_write_preview",
      payload_write_preview_contract_sha256: "d".repeat(64),
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContractResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContractPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract-write-payload-included="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract-mac-relay-tmp-root-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract-vps-nas-authority="false"');
  expect(html).toContain("payload/write-payload preview contract");
  expect(html).toContain("payloadpreview-abcdef0123456789");
  expect(html).toContain("writepayloadpreview-abcdef0123456789");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper Mac relay tmp-root write smoke panel shows metadata-only tmp-root write evidence", () => {
  const record = {
    found: true,
    written: true,
    recorded: true,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke_completed",
      tmp_root_write_smoke_ref: "tmprootsmoke-20260524021500-test0001",
      payload_write_preview_contract_verified: true,
      write_readiness_stage: "mac_relay_tmp_root_write_smoke",
      write_readiness_percent: 82,
      mac_relay_tmp_root_write_smoke_enabled: true,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      tmp_root_readback_sha256: "e".repeat(64),
      tmp_root_audit_written: true,
      idempotency_key_sha256: "f".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_write_skipped: false,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_after_tmp_root_write_smoke",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokePanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke-executed="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke-readback="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke-vps-nas-authority="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke-replay-store-write="false"');
  expect(html).toContain("Mac relay tmp-root write smoke");
  expect(html).toContain("tmprootsmoke-20260524021500-test0001");
  expect(html).toContain("internal_tmp_root_smoke_only");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper replay/idempotency metadata panel stays display-only and closed-lane", () => {
  const record = {
    found: true,
    errors: [],
    record_count: 1,
    latest_record: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata_recorded",
      replay_idempotency_metadata_ref: "replayidem-20260524024100-test0001",
      replay_idempotency_metadata_ready: true,
      source_tmp_root_write_smoke_verified: true,
      source_tmp_root_readback_verified: true,
      source_idempotency_key_verified: true,
      source_tmp_root_write_smoke_ref: "tmprootsmoke-20260524024000-replay01",
      source_tmp_root_write_smoke_record_sha256: "a".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_metadata_recorded: true,
      idempotency_replayed: false,
      idempotency_duplicate_metadata_write_skipped: false,
      idempotency_replay_store_written: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      write_readiness_stage: "replay_idempotency_metadata_after_tmp_root_write_smoke",
      write_readiness_percent: 86,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      tmp_root_audit_written: true,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T02:41:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_replay_idempotency_metadata_readback_after_tmp_root_write_smoke",
      replay_idempotency_metadata_sha256: "c".repeat(64),
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata-vps-nas-authority="false"');
  expect(html).toContain("Replay/idempotency metadata");
  expect(html).toContain("replayidem-20260524024100-test0001");
  expect(html).toContain("replay_idempotency_metadata_after_tmp_root_write_smoke");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay precommit metadata panel stays display-only and advances write readiness", () => {
  const record = {
    found: true,
    errors: [],
    record_count: 1,
    latest_record: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata_recorded",
      mac_relay_precommit_ref: "precommit-20260524031200-test0001",
      mac_relay_precommit_metadata_ready: true,
      source_replay_idempotency_metadata_verified: true,
      source_idempotency_duplicate_skip_verified: true,
      source_replay_idempotency_metadata_ref: "replayidem-20260524024100-test0001",
      source_replay_idempotency_metadata_sha256: "c".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_precommit_write_skipped: false,
      idempotency_replay_store_written: false,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      write_readiness_stage: "mac_relay_precommit_metadata_after_replay_idempotency",
      write_readiness_percent: 90,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      tmp_root_audit_written: true,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T03:12:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_precommit_manifest_after_replay_idempotency",
      mac_relay_precommit_metadata_sha256: "d".repeat(64),
      markdown_body: "must-not-echo",
      raw_root_path: "/vol" + "ume1/private",
      credential_value: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata-vps-nas-authority="false"');
  expect(html).toContain("Mac relay precommit metadata");
  expect(html).toContain("precommit-20260524031200-test0001");
  expect(html).toContain("mac_relay_precommit_metadata_after_replay_idempotency");
  expect(html).toContain("90%");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay precommit manifest panel stays display-only and advances write readiness", () => {
  const record = {
    found: true,
    errors: [],
    record_count: 1,
    latest_record: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest_recorded",
      mac_relay_precommit_manifest_ref: "precommitmanifest-20260524042000-test0001",
      mac_relay_precommit_manifest_ready: true,
      source_mac_relay_precommit_metadata_verified: true,
      source_mac_relay_precommit_ref: "precommit-20260524031200-test0001",
      source_mac_relay_precommit_metadata_sha256: "d".repeat(64),
      source_replay_idempotency_metadata_ref: "replayidem-20260524024100-test0001",
      source_replay_idempotency_metadata_sha256: "c".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_manifest_write_skipped: false,
      safe_manifest_checklist_verified: true,
      safe_ref_chain_verified: true,
      manifest_ref_chain_includes_precommit_metadata: true,
      manifest_ref_chain_includes_replay_metadata: true,
      manifest_ref_chain_includes_tmp_root_smoke: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      write_readiness_stage: "mac_relay_precommit_manifest_after_replay_idempotency",
      write_readiness_percent: 94,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      manifest_includes_payload_body: false,
      manifest_includes_write_payload: false,
      manifest_includes_raw_root_path: false,
      manifest_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T04:20:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_final_preflight_after_precommit_manifest",
      mac_relay_precommit_manifest_sha256: "e".repeat(64),
      markdown_body: "must-not-echo",
      raw_root_path: "/vol" + "ume1/private",
      credential_value: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest-vps-nas-authority="false"');
  expect(html).toContain("Mac relay precommit manifest");
  expect(html).toContain("precommitmanifest-20260524042000-test0001");
  expect(html).toContain("mac_relay_precommit_manifest_after_replay_idempotency");
  expect(html).toContain("94%");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay final preflight panel stays display-only and reaches explicit real-write gate", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight_recorded",
      mac_relay_final_preflight_ref: "finalpreflight-20260524052200-test0001",
      mac_relay_final_preflight_ready: true,
      source_mac_relay_precommit_manifest_verified: true,
      source_safe_manifest_checklist_verified: true,
      source_mac_relay_precommit_manifest_ref: "precommitmanifest-20260524042000-test0001",
      source_mac_relay_precommit_manifest_sha256: "e".repeat(64),
      source_mac_relay_precommit_ref: "precommit-20260524031200-test0001",
      source_mac_relay_precommit_metadata_sha256: "d".repeat(64),
      source_replay_idempotency_metadata_ref: "replayidem-20260524024100-test0001",
      source_replay_idempotency_metadata_sha256: "c".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_final_preflight_write_skipped: false,
      final_preflight_checklist_verified: true,
      safe_ref_chain_verified: true,
      final_preflight_ref_chain_includes_precommit_manifest: true,
      final_preflight_ref_chain_includes_precommit_metadata: true,
      final_preflight_ref_chain_includes_replay_metadata: true,
      final_preflight_ref_chain_includes_tmp_root_smoke: true,
      write_readiness_stage: "mac_relay_final_preflight_after_precommit_manifest",
      write_readiness_percent: 97,
      next_write_boundary_requires_explicit_real_nas_production_approval: true,
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      final_preflight_includes_payload_body: false,
      final_preflight_includes_write_payload: false,
      final_preflight_includes_raw_root_path: false,
      final_preflight_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T05:22:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_write_gate_after_final_preflight",
      mac_relay_final_preflight_sha256: "f".repeat(64),
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight-vps-nas-authority="false"');
  expect(html).toContain("Mac relay final preflight");
  expect(html).toContain("finalpreflight-20260524052200-test0001");
  expect(html).toContain("mac_relay_final_preflight_after_precommit_manifest");
  expect(html).toContain("97%");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay real-write gate panel stays display-only and blocks without explicit approval", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate_recorded",
      mac_relay_real_write_gate_ref: "realwritegate-20260524062200-test0001",
      mac_relay_real_write_gate_ready: true,
      source_mac_relay_final_preflight_verified: true,
      source_final_preflight_checklist_verified: true,
      source_mac_relay_final_preflight_ref: "finalpreflight-20260524052200-test0001",
      source_mac_relay_final_preflight_sha256: "f".repeat(64),
      source_mac_relay_precommit_manifest_ref: "precommitmanifest-20260524042000-test0001",
      source_mac_relay_precommit_manifest_sha256: "e".repeat(64),
      source_mac_relay_precommit_ref: "precommit-20260524031200-test0001",
      source_mac_relay_precommit_metadata_sha256: "d".repeat(64),
      source_replay_idempotency_metadata_ref: "replayidem-20260524024100-test0001",
      source_replay_idempotency_metadata_sha256: "c".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_real_write_gate_write_skipped: false,
      real_write_gate_checklist_verified: true,
      safe_ref_chain_verified: true,
      real_write_gate_ref_chain_includes_final_preflight: true,
      real_write_gate_ref_chain_includes_precommit_manifest: true,
      real_write_gate_ref_chain_includes_precommit_metadata: true,
      real_write_gate_ref_chain_includes_replay_metadata: true,
      real_write_gate_ref_chain_includes_tmp_root_smoke: true,
      write_readiness_stage: "mac_relay_real_write_gate_after_final_preflight",
      write_readiness_percent: 99,
      explicit_real_nas_production_approval_present: false,
      real_write_gate_blocks_without_explicit_approval: true,
      next_write_boundary_requires_explicit_real_nas_production_approval: true,
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      payload_body_materialized: true,
      payload_body_materialization_scope: "internal_tmp_root_smoke_only",
      real_write_gate_includes_payload_body: false,
      real_write_gate_includes_write_payload: false,
      real_write_gate_includes_raw_root_path: false,
      real_write_gate_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      write_payload_materialized: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T06:22:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_approval_token_after_real_write_gate",
      mac_relay_real_write_gate_sha256: "a".repeat(64),
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGatePanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate-vps-nas-authority="false"');
  expect(html).toContain("Mac relay real-write gate");
  expect(html).toContain("realwritegate-20260524062200-test0001");
  expect(html).toContain("mac_relay_real_write_gate_after_final_preflight");
  expect(html).toContain("99%");
  expect(html).toContain("real_write_gate_blocks_without_explicit_approval");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay approval-token panel stays display-only and reaches production approval boundary", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token_recorded",
      mac_relay_approval_token_ref: "approvaltoken-20260524070500-test0001",
      mac_relay_approval_token_ready: true,
      approval_token_is_secret: false,
      approval_token_is_non_secret_safe_ref: true,
      approval_token_materialized_value_included: false,
      source_mac_relay_real_write_gate_verified: true,
      source_real_write_gate_checklist_verified: true,
      source_mac_relay_real_write_gate_ref: "realwritegate-20260524062200-test0001",
      source_mac_relay_real_write_gate_sha256: "a".repeat(64),
      idempotency_key_sha256: "b".repeat(64),
      idempotency_replayed: false,
      idempotency_duplicate_approval_token_write_skipped: false,
      approval_token_contract_verified: true,
      safe_ref_chain_verified: true,
      write_readiness_stage: "mac_relay_approval_token_after_real_write_gate",
      write_readiness_percent: 100,
      explicit_real_nas_production_approval_present: false,
      approval_token_blocks_without_explicit_production_approval: true,
      next_write_boundary_requires_explicit_real_nas_production_approval: true,
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      mac_relay_tmp_root_write_smoke_executed: true,
      tmp_root_filesystem_write_executed: true,
      tmp_root_readback_verified: true,
      approval_token_includes_payload_body: false,
      approval_token_includes_write_payload: false,
      approval_token_includes_raw_root_path: false,
      approval_token_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      actual_downstream_consumption_executed: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      raw_root_path_included: false,
      secret_value_included: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T07:05:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_production_write_approval_after_token",
      mac_relay_approval_token_sha256: "c".repeat(64),
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token-vps-nas-authority="false"');
  expect(html).toContain("Mac relay approval-token contract");
  expect(html).toContain("approvaltoken-20260524070500-test0001");
  expect(html).toContain("mac_relay_approval_token_after_real_write_gate");
  expect(html).toContain("100%");
  expect(html).toContain("approval_token_blocks_without_explicit_production_approval");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});

it("NAS Keeper Mac relay production-write approval panel stays display-only and blocks execution", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval_recorded",
      mac_relay_production_write_approval_ref: "prodapproval-20260524081000-test0001",
      mac_relay_production_write_approval_ready: true,
      source_mac_relay_approval_token_verified: true,
      source_approval_token_contract_verified: true,
      production_write_approval_boundary_verified: true,
      safe_ref_chain_verified: true,
      write_readiness_stage: "mac_relay_production_write_approval_after_token",
      write_readiness_percent: 100,
      explicit_real_nas_production_approval_present: true,
      production_write_approval_is_metadata_only: true,
      production_write_approval_does_not_execute_write: true,
      next_boundary_is_real_nas_write_execution: true,
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      production_write_approval_includes_payload_body: false,
      production_write_approval_includes_write_payload: false,
      production_write_approval_includes_raw_root_path: false,
      production_write_approval_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T08:10:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_after_production_approval",
      mac_relay_production_write_approval_sha256: "d".repeat(64),
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval-vps-nas-authority="false"');
  expect(html).toContain("Mac relay production-write approval boundary");
  expect(html).toContain("prodapproval-20260524081000-test0001");
  expect(html).toContain("mac_relay_production_write_approval_after_token");
  expect(html).toContain("100%");
  expect(html).toContain("production_write_approval_does_not_execute_write");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper Mac relay real NAS write dry-run seal panel stays display-only and blocks production write", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      schema_version: 1,
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_recorded",
      mac_relay_real_nas_write_dry_run_seal_ref: "nasdryrunseal-20260524100000-test0001",
      mac_relay_real_nas_write_dry_run_seal_ready: true,
      source_mac_relay_production_write_approval_verified: true,
      source_production_write_approval_boundary_verified: true,
      target_filename_contract_verified: true,
      post_write_verification_contract_verified: true,
      safe_ref_chain_verified: true,
      write_readiness_stage: "mac_relay_real_nas_write_dry_run_seal_after_production_approval",
      write_readiness_percent: 100,
      dry_run_seal_is_metadata_only: true,
      dry_run_seal_does_not_execute_write: true,
      final_safe_refs_verified_for_next_rung: true,
      real_nas_write_target_filename_contract_ready: true,
      post_write_readback_contract_ready: true,
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      dry_run_seal_includes_payload_body: false,
      dry_run_seal_includes_write_payload: false,
      dry_run_seal_includes_raw_root_path: false,
      dry_run_seal_includes_secret_value: false,
      markdown_body_included: false,
      write_payload_included: false,
      raw_root_path_included: false,
      secret_value_included: false,
      recorded_by: "operator:test",
      recorded_at: "2026-05-24T10:00:00Z",
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_mac_relay_real_nas_write_execution_after_dry_run_seal",
      mac_relay_real_nas_write_dry_run_seal_sha256: "e".repeat(64),
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal-replay-store-write="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal-vps-nas-authority="false"');
  expect(html).toContain("Mac relay real NAS write dry-run seal");
  expect(html).toContain("nasdryrunseal-20260524100000-test0001");
  expect(html).toContain("mac_relay_real_nas_write_dry_run_seal_after_production_approval");
  expect(html).toContain("100%");
  expect(html).toContain("dry_run_seal_does_not_execute_write");
  expect(html).toContain("target_filename_contract_verified");
  expect(html).toContain("post_write_verification_contract_verified");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper Mac relay real NAS write execution-envelope panel stays display-only and blocks production write", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      mac_relay_real_nas_write_execution_envelope_ref: "nasexecenv-20260524102000-test0001",
      mac_relay_real_nas_write_execution_envelope_ready: true,
      source_mac_relay_real_nas_write_dry_run_seal_verified: true,
      source_dry_run_seal_contract_verified: true,
      target_filename_contract_verified: true,
      post_write_verification_contract_verified: true,
      safe_ref_chain_verified: true,
      execution_intent_recorded: true,
      execution_envelope_is_metadata_only: true,
      execution_envelope_does_not_execute_write: true,
      real_nas_write_execution_envelope_ready: true,
      real_nas_write_execution_envelope_includes_final_safe_refs: true,
      real_nas_write_execution_envelope_includes_post_write_verification_plan: true,
      write_readiness_stage: "mac_relay_real_nas_write_execution_envelope_after_dry_run_seal",
      write_readiness_percent: 100,
      idempotency_duplicate_execution_envelope_skipped: false,
      mac_relay_real_nas_write_execution_envelope_sha256: "d".repeat(64),
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      execution_envelope_includes_payload_body: false,
      execution_envelope_includes_write_payload: false,
      execution_envelope_includes_raw_root_path: false,
      execution_envelope_includes_secret_value: false,
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopePanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope-vps-nas-authority="false"');
  expect(html).toContain("Mac relay real NAS write execution envelope");
  expect(html).toContain("nasexecenv-20260524102000-test0001");
  expect(html).toContain("mac_relay_real_nas_write_execution_envelope_after_dry_run_seal");
  expect(html).toContain("100%");
  expect(html).toContain("execution_envelope_does_not_execute_write");
  expect(html).toContain("real_nas_write_execution_envelope_includes_post_write_verification_plan");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper Mac relay real NAS write execution-record panel stays display-only and blocks production write", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      mac_relay_real_nas_write_execution_record_ref: "nasexecrec-20260524113000-test0001",
      mac_relay_real_nas_write_execution_record_ready: true,
      source_mac_relay_real_nas_write_execution_envelope_verified: true,
      source_execution_envelope_contract_verified: true,
      pre_execution_proof_recorded: true,
      execution_record_is_metadata_only: true,
      execution_record_does_not_execute_write: true,
      execution_record_does_not_materialize_payload: true,
      target_filename_contract_verified: true,
      post_write_verification_contract_verified: true,
      safe_ref_chain_verified: true,
      real_nas_write_execution_record_ready: true,
      real_nas_write_execution_record_includes_pre_execution_proof: true,
      real_nas_write_execution_record_includes_post_write_verification_plan: true,
      write_readiness_stage: "mac_relay_real_nas_write_execution_record_after_execution_envelope",
      write_readiness_percent: 100,
      idempotency_duplicate_execution_record_skipped: false,
      mac_relay_real_nas_write_execution_record_sha256: "e".repeat(64),
      metadata_only_record_write_executed: true,
      replay_store_write_enabled: false,
      real_replay_store_written: false,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_nas_mount_enabled: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      execution_record_includes_payload_body: false,
      execution_record_includes_write_payload: false,
      execution_record_includes_raw_root_path: false,
      execution_record_includes_secret_value: false,
      ["markdown_" + "body"]: "must" + "-not-echo",
      write_payload: { raw: "must" + "-not-echo" },
      ["raw_" + "root_path"]: "/vol" + "ume1/private",
      ["credential_" + "value"]: "sk" + "-test-secret",
    },
  } satisfies import("@/lib/api").OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult;

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordPanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record-vps-nas-authority="false"');
  expect(html).toContain("Mac relay real NAS write execution record");
  expect(html).toContain("nasexecrec-20260524113000-test0001");
  expect(html).toContain("mac_relay_real_nas_write_execution_record_after_execution_envelope");
  expect(html).toContain("100%");
  expect(html).toContain("execution_record_does_not_execute_write");
  expect(html).toContain("real_nas_write_execution_record_includes_pre_execution_proof");
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  expect(html).not.toContain("must" + "-not-echo");
  expect(html).not.toContain("/vol" + "ume1/private");
  expect(html).not.toContain("sk" + "-test-secret");
});


it("NAS Keeper Mac relay real NAS write final-execution-gate panel stays display-only before manual real write boundary", () => {
  const record = {
    found: true,
    stored: true,
    record_count: 1,
    errors: [],
    dto: {
      mac_relay_real_nas_write_final_execution_gate_ready: true,
      source_mac_relay_real_nas_write_execution_record_verified: true,
      source_execution_record_contract_verified: true,
      final_execution_gate_is_metadata_only: true,
      final_execution_gate_does_not_execute_write: true,
      final_execution_gate_does_not_materialize_payload: true,
      final_manual_real_nas_write_boundary_locked: true,
      pre_real_nas_write_lock_recorded: true,
      write_readiness_percent: 100,
      real_nas_write_final_execution_gate_ready: true,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      gateway_restart_required: false,
      final_execution_gate_includes_payload_body: false,
      final_execution_gate_includes_write_payload: false,
      final_execution_gate_includes_raw_root_path: false,
      final_execution_gate_includes_secret_value: false,
      next_required_boundary: "fresh_request_builder_downstream_consumption_one_shot_manual_real_nas_write_boundary_after_final_execution_gate",
    },
  };

  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGatePanel record={record} error={null} />);

  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate-vps-nas-authority="false"');
  expect(html).toContain('Mac relay real NAS write final execution gate');
  expect(html).toContain('100%');
  expect(html).toContain('final_execution_gate_does_not_execute_write');
  expect(html).toContain('final_manual_real_nas_write_boundary_locked');
  expect(html).toContain('pre_real_nas_write_lock_recorded');
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  const forbiddenBody = ["must", "not", "echo"].join("-");
  const forbiddenPath = ["", "volume1", "private"].join("/");
  expect(html).not.toContain(forbiddenBody);
  expect(html).not.toContain(forbiddenPath);
  const forbiddenSecret = ['sk', 'test', 'secret'].join('-');
  expect(html).not.toContain(forbiddenSecret);
});


it("NAS Keeper manual real NAS write boundary panel stays display-only and seals exact-production-write boundary", () => {
  const record = {
    found: true,
    latest_record: {
      manual_real_nas_write_boundary_ready: true,
      source_mac_relay_real_nas_write_final_execution_gate_verified: true,
      source_final_execution_gate_contract_verified: true,
      manual_boundary_contract_recorded: true,
      separate_exact_real_nas_write_approval_required: true,
      mac_relay_operator_presence_required: true,
      manual_boundary_does_not_execute_write: true,
      final_execution_gate_ref_chain_includes_execution_record: true,
      target_filename_contract_verified: true,
      post_write_verification_contract_verified: true,
      write_readiness_percent: 100,
      real_nas_production_write_enabled: false,
      vps_direct_nas_authority_enabled: false,
      watcher_enabled: false,
      cron_enabled: false,
      dispatch_enabled: false,
      authority_adapter_binding_enabled: false,
      public_exposure_enabled: false,
      manual_boundary_includes_payload_body: false,
      manual_boundary_includes_write_payload: false,
      manual_boundary_includes_raw_root_path: false,
      manual_boundary_includes_secret_value: false,
      manual_real_nas_write_boundary_sha256: "d".repeat(64),
      manual_real_nas_write_boundary_ref: "nasmanualboundary-20260524134000-test0001",
    },
    errors: [],
  };
  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundaryPanel record={record} error={null} />);
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary-vps-nas-authority="false"');
  expect(html).toContain('100%');
  expect(html).toContain('manual_boundary_does_not_execute_write');
  expect(html).toContain('separate_exact_real_nas_write_approval_required');
  expect(html).toContain('manual_boundary_contract_recorded');
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  const forbiddenBody = ["must", "not", "echo"].join("-");
  const forbiddenPath = ["", "volume1", "private"].join("/");
  expect(html).not.toContain(forbiddenBody);
  expect(html).not.toContain(forbiddenPath);
  const forbiddenSecret = ['sk', 'test', 'secret'].join('-');
  expect(html).not.toContain(forbiddenSecret);
});


it("NAS Keeper separate real NAS production write approval panel stays display-only and keeps production write disabled", () => {
  const record = {
    found: true,
    dto: {
      separate_real_nas_production_write_approval_ready: true,
      source_manual_real_nas_write_boundary_verified: true,
      approval_envelope_recorded: true,
      approval_token_recorded: true,
      approval_does_not_execute_write: true,
      real_nas_production_write_enabled: false,
      vps_direct_nas_authority_enabled: false,
      payload_write_preview_contract_verified: true,
      replay_idempotency_metadata_recorded: true,
      mac_relay_tmp_root_write_smoke_executed: true,
      write_readiness_percent: 100,
      approval_includes_payload_body: false,
      approval_includes_write_payload: false,
      approval_includes_raw_root_path: false,
      approval_includes_secret_value: false,
      separate_real_nas_production_write_approval_sha256: "e".repeat(64),
      separate_real_nas_production_write_approval_ref: "nasprodapproval-20260524143000-test0001",
    },
    errors: [],
  };
  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApprovalPanel record={record} error={null} />);
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval-vps-nas-authority="false"');
  expect(html).toContain('100%');
  expect(html).toContain('approval_does_not_execute_write');
  expect(html).toContain('approval_envelope_recorded');
  expect(html).toContain('payload_write_preview_contract_verified');
  expect(html).toContain('replay_idempotency_metadata_recorded');
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  const forbiddenBody = ["must", "not", "echo"].join("-");
  const forbiddenPath = ["", "volume1", "private"].join("/");
  const forbiddenSecret = ["sk", "test", "secret"].join("-");
  expect(html).not.toContain(forbiddenBody);
  expect(html).not.toContain(forbiddenPath);
  expect(html).not.toContain(forbiddenSecret);
});


describe("Office controlled mutation compact dashboard", () => {
  it("summarizes latest write-readiness and hides historical ladders by default", () => {
    const CompactPanel = (OfficePageModule as unknown as {
      OfficeControlledMutationCompactDashboardPanel: React.ComponentType<{
        latestApproval?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        latestPreflight?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        latestPacket?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        detailCount: number;
        children: React.ReactNode;
      }>;
    }).OfficeControlledMutationCompactDashboardPanel;
    const markup = renderToStaticMarkup(
      <CompactPanel
        latestApproval={{
          found: true,
          dto: {
            write_readiness_percent: 100,
            separate_real_nas_production_write_approval_ready: true,
            approval_does_not_execute_write: true,
            real_nas_production_write_enabled: false,
            vps_direct_nas_authority_enabled: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            public_exposure_enabled: false,
            gateway_restart_required: false,
            separate_real_nas_production_write_approval_ref: "nasprodapproval-safe-ref",
          },
        }}
        detailCount={12}
      >
        <section data-office-controlled-mutation-proposal-contract="true">historical ladder detail</section>
      </CompactPanel>,
    );

    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-ready="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-real-write="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-vps-authority="false"');
    expect(markup).toContain('data-office-controlled-mutation-archive-drawer-default-open="false"');
    expect(markup).toContain('NAS Keeper 요약');
    expect(markup).toContain('100%');
    expect(markup).toContain('세부 기록 12개는 문서/API로 이동');
    expect(markup).toContain('data-office-controlled-mutation-archive-heavy-dom-rendered="false"');
    expect(markup).toContain('data-office-controlled-mutation-archive-drawer-content="summary-only"');
    expect(markup).not.toContain('historical ladder detail');
    expect(markup).not.toContain('<button');
    expect(markup).not.toContain('<input');
    expect(markup).not.toContain('<form');
  });

  it("summarizes latest manual operator receipt without rendering heavy ladders", () => {
    const CompactPanel = (OfficePageModule as unknown as {
      OfficeControlledMutationCompactDashboardPanel: React.ComponentType<{
        latestManualOperatorReceipt?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        detailCount: number;
        children: React.ReactNode;
      }>;
    }).OfficeControlledMutationCompactDashboardPanel;
    const forbiddenBody = ["receipt", "body", "must", "not", "echo"].join("-");
    const forbiddenPath = ["", "Users", "private", "nas-receipt"].join("/");
    const forbiddenSecret = ["ghp", "manualreceiptsecret"].join("_");
    const markup = renderToStaticMarkup(
      <CompactPanel
        latestManualOperatorReceipt={{
          found: true,
          dto: {
            write_readiness_percent: 100,
            real_nas_production_write_manual_operator_receipt_ready: true,
            manual_operator_receipt_is_metadata_only: true,
            real_nas_production_write_manual_operator_receipt_ref: "nasmanualreceipt-safe-ref",
            real_nas_production_write_enabled: false,
            real_nas_production_write_executed: false,
            vps_direct_nas_authority_enabled: false,
            vps_nas_mount_enabled: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            public_exposure_enabled: false,
            gateway_restart_required: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            secret_value_included: false,
            unsafe_body: forbiddenBody,
            unsafe_path: forbiddenPath,
            unsafe_secret: forbiddenSecret,
          },
        }}
        detailCount={14}
      >
        <section data-office-controlled-mutation-proposal-contract="true">historical ladder detail</section>
      </CompactPanel>,
    );

    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-ready="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-metadata-only="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-real-write="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-vps-authority="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-runtime-open="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-manual-operator-receipt-payload-echo="false"');
    expect(markup).toContain('수동 operator receipt 기록');
    expect(markup).toContain('nasmanualreceipt-safe-ref');
    expect(markup).not.toContain('historical ladder detail');
    expect(markup).not.toContain(forbiddenBody);
    expect(markup).not.toContain(forbiddenPath);
    expect(markup).not.toContain(forbiddenSecret);
    expect(markup).not.toContain('<button');
    expect(markup).not.toContain('<input');
    expect(markup).not.toContain('<form');
  });


  it("summarizes latest Mac relay tmp-root write smoke above manual receipt without unsafe echo", () => {
    const CompactPanel = (OfficePageModule as unknown as {
      OfficeControlledMutationCompactDashboardPanel: React.ComponentType<{
        latestManualOperatorReceipt?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        latestTmpRootWriteSmoke?: { found?: boolean; dto?: Record<string, unknown> | null; latest_record?: Record<string, unknown> | null } | null;
        detailCount: number;
        children: React.ReactNode;
      }>;
    }).OfficeControlledMutationCompactDashboardPanel;
    const forbiddenBody = ["tmp", "root", "body", "must", "not", "echo"].join("-");
    const forbiddenPath = ["", "Users", "private", "tmp-root-smoke"].join("/");
    const forbiddenSecret = ["sk", "tmp-root-secret"].join("-");
    const markup = renderToStaticMarkup(
      <CompactPanel
        latestManualOperatorReceipt={{
          found: true,
          dto: {
            write_readiness_percent: 100,
            real_nas_production_write_manual_operator_receipt_ready: true,
            manual_operator_receipt_is_metadata_only: true,
            real_nas_production_write_manual_operator_receipt_ref: "nasmanualreceipt-safe-ref",
          },
        }}
        latestTmpRootWriteSmoke={{
          found: true,
          dto: {
            write_readiness_percent: 88,
            tmp_root_write_smoke_ref: "tmprootsmoke-safe-ref",
            mac_relay_tmp_root_write_smoke_executed: true,
            tmp_root_readback_verified: true,
            source_manual_operator_receipt_verified: true,
            payload_body_materialization_scope: "internal_tmp_root_smoke_only",
            real_nas_production_write_enabled: false,
            real_nas_production_write_executed: false,
            vps_direct_nas_authority_enabled: false,
            vps_nas_mount_enabled: false,
            watcher_enabled: false,
            cron_enabled: false,
            dispatch_enabled: false,
            authority_adapter_binding_enabled: false,
            public_exposure_enabled: false,
            gateway_restart_required: false,
            markdown_body_included: false,
            write_payload_included: false,
            raw_root_path_included: false,
            secret_value_included: false,
            unsafe_body: forbiddenBody,
            unsafe_path: forbiddenPath,
            unsafe_secret: forbiddenSecret,
          },
        }}
        detailCount={15}
      >
        <section data-office-controlled-mutation-proposal-contract="true">historical ladder detail</section>
      </CompactPanel>,
    );

    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-ready="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-readback="true"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-real-write="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-vps-authority="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-runtime-open="false"');
    expect(markup).toContain('data-office-controlled-mutation-compact-dashboard-tmp-root-write-smoke-payload-echo="false"');
    expect(markup).toContain('Mac relay tmp-root write smoke');
    expect(markup).toContain('tmprootsmoke-safe-ref');
    expect(markup).not.toContain('nasmanualreceipt-safe-ref</div>');
    expect(markup).not.toContain('historical ladder detail');
    expect(markup).not.toContain(forbiddenBody);
    expect(markup).not.toContain(forbiddenPath);
    expect(markup).not.toContain(forbiddenSecret);
    expect(markup).not.toContain('<button');
    expect(markup).not.toContain('<input');
    expect(markup).not.toContain('<form');
  });
});


it("NAS Keeper real NAS production write execution preflight panel stays display-only and keeps production write disabled", () => {
  const record = {
    found: true,
    dto: {
      real_nas_production_write_execution_preflight_ready: true,
      source_separate_real_nas_production_write_approval_verified: true,
      source_approval_envelope_verified: true,
      source_approval_token_verified: true,
      preflight_does_not_execute_write: true,
      preflight_does_not_materialize_payload: true,
      payload_write_preview_contract_verified: true,
      replay_idempotency_metadata_recorded: true,
      mac_relay_tmp_root_write_smoke_executed: true,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_direct_nas_authority_enabled: false,
      write_readiness_percent: 100,
      real_nas_production_write_execution_preflight_sha256: "f".repeat(64),
      real_nas_production_write_execution_preflight_ref: "naswritepreflight-20260524153000-test0001",
    },
    errors: [],
  };
  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflightPanel record={record} error={null} />);
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight-vps-nas-authority="false"');
  expect(html).toContain('100%');
  expect(html).toContain('preflight_does_not_execute_write');
  expect(html).toContain('payload_write_preview_contract_verified');
  expect(html).toContain('replay_idempotency_metadata_recorded');
  expect(html).toContain('mac_relay_tmp_root_write_smoke_executed');
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  const forbiddenBody = ["must", "not", "echo"].join("-");
  const forbiddenPath = ["", "volume1", "private"].join("/");
  const forbiddenSecret = ["sk", "test", "secret"].join("-");
  expect(html).not.toContain(forbiddenBody);
  expect(html).not.toContain(forbiddenPath);
  expect(html).not.toContain(forbiddenSecret);
});


it("NAS Keeper real NAS production write execution packet panel stays display-only and keeps production write disabled", () => {
  const record = {
    found: true,
    dto: {
      real_nas_production_write_execution_packet_ready: true,
      source_real_nas_production_write_execution_preflight_verified: true,
      source_preflight_sha256_verified: true,
      execution_packet_does_not_execute_write: true,
      execution_packet_does_not_materialize_payload: true,
      payload_write_preview_contract_verified: true,
      replay_idempotency_metadata_recorded: true,
      mac_relay_tmp_root_write_smoke_executed: true,
      real_nas_production_write_enabled: false,
      real_nas_production_write_executed: false,
      vps_direct_nas_authority_enabled: false,
      execution_packet_manifest_ref: "execpacketmanifest-20260525101000-test0001",
      write_readiness_percent: 100,
      real_nas_production_write_execution_packet_sha256: "f".repeat(64),
      real_nas_production_write_execution_packet_ref: "naswritepacket-20260525101000-test0001",
    },
    errors: [],
  };
  const html = renderToStaticMarkup(<OfficePageModule.NasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacketPanel record={record} error={null} />);
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet-ready="true"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet-real-nas-production="false"');
  expect(html).toContain('data-office-nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet-vps-nas-authority="false"');
  expect(html).toContain('execution_packet_does_not_execute_write');
  expect(html).toContain('payload_write_preview_contract_verified');
  expect(html).toContain('replay_idempotency_metadata_recorded');
  expect(html).toContain('execpacketmanifest-20260525101000-test0001');
  expect(html).not.toMatch(/<button|<input|<select|<textarea|<form/i);
  const forbiddenBody = ["must", "not", "echo"].join("-");
  const forbiddenPath = ["", "volume1", "private"].join("/");
  const forbiddenSecret = ["sk", "test", "secret"].join("-");
  expect(html).not.toContain(forbiddenBody);
  expect(html).not.toContain(forbiddenPath);
  expect(html).not.toContain(forbiddenSecret);
});
