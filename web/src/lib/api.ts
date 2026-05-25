// The dashboard can be served either at the root of its host (e.g.
// https://kanban.tilos.com/) or under a URL prefix when reverse-proxied
// (e.g. https://mission-control.tilos.com/hermes/). The Python backend
// injects ``window.__HERMES_BASE_PATH__`` into index.html based on the
// incoming ``X-Forwarded-Prefix`` header so the SPA can address its own
// ``/api/...`` and ``/dashboard-plugins/...`` URLs correctly without a
// rebuild. Empty string means "served at root".
function readBasePath(): string {
  if (typeof window === "undefined") return "";
  const raw = window.__HERMES_BASE_PATH__ ?? "";
  if (!raw) return "";
  // Normalise: ensure leading slash, strip trailing slash.
  const withLead = raw.startsWith("/") ? raw : `/${raw}`;
  return withLead.replace(/\/+$/, "");
}

export const HERMES_BASE_PATH = readBasePath();
const BASE = HERMES_BASE_PATH;

import type { DashboardTheme } from "@/themes/types";

// Ephemeral session token for protected endpoints.
// Injected into index.html by the server — never fetched via API.
declare global {
  interface Window {
    __HERMES_SESSION_TOKEN__?: string;
    __HERMES_BASE_PATH__?: string;
  }
}
let _sessionToken: string | null = null;
const SESSION_HEADER = "X-Hermes-Session-Token";

function setSessionHeader(headers: Headers, token: string): void {
  if (!headers.has(SESSION_HEADER)) {
    headers.set(SESSION_HEADER, token);
  }
}

const UNSAFE_ERROR_BODY_PATTERN = /traceback|\/Users\/|\/home\/|token\s*=|sk-[A-Za-z0-9_-]+|secret|password|private key/i;

function safeErrorDetail(text: string, statusText: string): string {
  const fallback = statusText || "request failed";
  const trimmed = text.trim();
  if (!trimmed) return fallback;
  if (UNSAFE_ERROR_BODY_PATTERN.test(trimmed) || trimmed.includes("\n")) return "request failed";
  return trimmed;
}


export interface OfficeNasSingleFileWritePayload {
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  markdown_body: string;
  requested_by: string;
  requested_at: string;
}

export interface OfficeNasSingleFileWriteResult {
  written: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    mode: string;
    write_ref: string;
    safe_logical_path: string;
    safe_display_path: string;
    bytes_written: number;
    rollback_created: boolean;
    rollback_ref: string | null;
    capabilities: Record<string, boolean>;
  };
}

export interface OfficeNasMacRelayWritePayload extends OfficeNasSingleFileWritePayload {
  relay_request_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  relay_authorized_by: string;
  relay_authorized_at: string;
}

export interface OfficeNasMacRelayWriteResult {
  executed: boolean;
  written: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    mode: string;
    relay_request_ref: string;
    relay_execution_ref: string;
    write_ref: string;
    safe_logical_path: string;
    safe_display_path: string;
    bytes_written: number;
    readback_verified: boolean;
    readback_sha256: string;
    readback_first_line: string;
    rollback_created: boolean;
    rollback_ref: string | null;
    audit_written: boolean;
    audit_ref: string | null;
    capabilities: Record<string, boolean>;
  };
}

export interface OfficeNasKeeperHandoffQueueItemSummary {
  schema_version: number;
  mode: string;
  handoff_ref: string;
  queue_ref: string;
  queue_status: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  requested_by: string;
  requested_at: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  safe_logical_path: string;
  safe_display_path: string;
  payload_bytes: number;
  markdown_body_included: false;
  next_required_boundary: string;
  queued_by?: string;
  queued_at?: string;
  authorization_ref?: string;
  authorization_decision?: string;
  authorized_by?: string;
  authorized_at?: string;
  relay_execution_ref?: string;
  execution_record_ref?: string;
  execution_status?: string;
  execution_recorded_by?: string;
  execution_recorded_at?: string;
  execution_safe_summary?: string;
  execution_evidence_refs?: string[];
}

export interface OfficeNasKeeperHandoffQueueReadback {
  listed: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: string;
    listed: true;
    queue_storage_ref: string;
    filters: Record<string, string | number>;
    effective_limit: number;
    available_count: number;
    count: number;
    skipped_count: number;
    items: OfficeNasKeeperHandoffQueueItemSummary[];
    markdown_body_included: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperHandoffQueueReadbackParams {
  handoff_ref?: string;
  queue_status?: string;
  relay_node_ref?: string;
  nas_keeper_ref?: string;
  limit?: number;
}


export interface OfficeNasKeeperHandoffClaimDryRunPayload {
  handoff_ref: string;
  claim_ref: string;
  relay_node_ref: string;
  claimed_by: string;
  claimed_at: string;
}

export interface OfficeNasKeeperHandoffClaimDryRunResult {
  claimed: false;
  dry_run: true;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_handoff_claim_dry_run";
    dry_run: true;
    claim_status: string;
    handoff_ref: string;
    claim_ref: string;
    queue_ref?: string;
    queue_status_before: string;
    queue_status_after: string;
    claimed_by: string;
    claimed_at: string;
    relay_request_ref: string;
    write_ref: string;
    package_ref: string;
    target_vault_ref: string;
    safe_slug: string;
    safe_title: string;
    requested_by: string;
    requested_at: string;
    nas_keeper_ref: string;
    relay_node_ref: string;
    execution_path: string[];
    claim_path: string[];
    safe_logical_path: string;
    safe_display_path: string;
    payload_bytes: number;
    execution_payload_preview_fields: string[];
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperHandoffAuthorizationPayload {
  handoff_ref: string;
  authorization_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  authorization_decision: "authorize_mac_relay_execution";
  authorized_by: string;
  authorized_at: string;
}

export interface OfficeNasKeeperHandoffAuthorizationResult {
  authorized: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_handoff_authorized";
    authorized: boolean;
    handoff_ref: string;
    authorization_ref: string;
    authorization_decision: string;
    queue_ref?: string;
    queue_status_before: string;
    queue_status_after: string;
    authorized_by: string;
    authorized_at: string;
    relay_request_ref: string;
    write_ref: string;
    package_ref: string;
    target_vault_ref: string;
    safe_slug: string;
    safe_title: string;
    requested_by: string;
    requested_at: string;
    nas_keeper_ref: string;
    relay_node_ref: string;
    execution_path: string[];
    authorization_path: string[];
    safe_logical_path: string;
    safe_display_path: string;
    payload_bytes: number;
    execution_payload_preview_fields: string[];
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeAuthorityMetadataHandoffStatus {
  schema_version: number;
  mode: "authority_metadata_handoff_status";
  request_id?: string;
  correlation_id?: string;
  checkpoint_complete: boolean;
  chain_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeAuthorityMetadataHandoffParams {
  request_id?: string;
  correlation_id?: string;
  limit?: number;
}

export interface OfficeDispatcherAuthorityDryRunSurface {
  schema_version: number;
  mode: "dispatcher_authority_dry_run_surface";
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  dry_run_plan: {
    plan_ref: string;
    ready: boolean;
    would_dispatch: false;
    would_bind_authority_adapter: false;
    would_mutate_target: false;
    would_write_nas: false;
    would_start_daemon: false;
    would_record_audit: false;
    next_boundary: string;
    steps: Array<{ step_ref: string; label: string; enabled: boolean }>;
  };
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityDryRunParams {
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
}

export interface OfficeDispatcherAuthorityMetadataRecordingDraft {
  schema_version: number;
  mode: "dispatcher_authority_metadata_recording_draft";
  ready: boolean;
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  dry_run_result_payload: null | Record<string, unknown>;
  audit_payload: null | Record<string, unknown>;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityMetadataRecordingDraftParams {
  request_id?: string;
  correlation_id?: string;
  authority_ref?: string;
  result_id?: string;
  audit_id?: string;
  recorded_at?: string;
}

export interface OfficeDispatcherAuthorityMetadataAppendStatus {
  schema_version: number;
  mode: "dispatcher_authority_metadata_append_status";
  request_id?: string;
  correlation_id?: string;
  append_checkpoint_complete: boolean;
  append_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherAuthorityMetadataAppendStatusParams {
  request_id?: string;
  correlation_id?: string;
  limit?: number;
}

export interface OfficeDispatcherExecutionSimulationStatus {
  schema_version: number;
  mode: "dispatcher_execution_simulation_status";
  request_id: string;
  correlation_id: string;
  simulation_checkpoint_complete: boolean;
  simulation_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  checkpoint_status: string;
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherExecutionSimulationStatusParams {
  limit?: number;
}

export interface OfficeDispatcherCompletionReviewStatus {
  schema_version: number;
  mode: "dispatcher_completion_review_status";
  request_id: string;
  correlation_id: string;
  completion_review_complete: boolean;
  execution_checkpoint_status: string;
  review_counts: Record<string, number>;
  latest_refs: Record<string, string>;
  completed_lanes: string[];
  next_manual_lane: string;
  capabilities: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeTargetDispatchContractStatus {
  schema_version: number;
  mode: "target_dispatch_contract_status";
  target_dispatch_contract_complete: boolean;
  source_completion_review_lane: string;
  next_manual_lane: string;
  dispatch_options: string[];
  required_dispatch_fields: string[];
  allowed_operation_kinds: string[];
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeWatcherCronContractStatus {
  schema_version: number;
  mode: "watcher_cron_contract_status";
  watcher_cron_contract_complete: boolean;
  source_target_dispatch_lane: string;
  next_manual_lane: string;
  scheduler_options: string[];
  required_scheduler_fields: string[];
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeRuntimeActivationReviewStatus {
  schema_version: number;
  mode: "runtime_activation_review_status";
  runtime_activation_review_complete: boolean;
  source_watcher_cron_lane: string;
  next_manual_lane: string;
  reviewed_activation_targets: string[];
  activation_decisions: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeRuntimePreflightStatus {
  schema_version: number;
  mode: "runtime_preflight_status";
  runtime_preflight_complete: boolean;
  source_runtime_activation_lane: string;
  next_manual_lane: string;
  preflight_decisions: Record<string, string>;
  readiness: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualOneShotRuntimeDryRunStatus {
  schema_version: number;
  mode: "manual_one_shot_runtime_dry_run_status";
  manual_one_shot_runtime_dry_run_complete: boolean;
  source_runtime_preflight_lane: string;
  next_manual_lane: string;
  operator_trigger: Record<string, boolean | string>;
  dry_run_scope: Record<string, boolean>;
  metadata_envelope: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeAdapterBindingDryRunStatus {
  schema_version: number;
  mode: "adapter_binding_dry_run_status";
  adapter_binding_dry_run_complete: boolean;
  source_manual_one_shot_lane: string;
  next_manual_lane: string;
  adapter_registry: Record<string, boolean | string>;
  binding_scope: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeHumanReviewedSingleDispatchStatus {
  schema_version: number;
  mode: "human_reviewed_single_dispatch_status";
  human_reviewed_single_dispatch_complete: boolean;
  source_adapter_binding_lane: string;
  next_manual_lane: string;
  dispatch_candidate: Record<string, boolean | string>;
  approval_requirements: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeExplicitRuntimeDispatchApprovalStatus {
  schema_version: number;
  mode: "explicit_runtime_dispatch_approval_status";
  explicit_runtime_dispatch_approval_complete: boolean;
  source_human_review_lane: string;
  next_manual_lane: string;
  approval_status: Record<string, boolean>;
  runtime_boundary: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeConcreteRuntimeSingleDispatchSliceDesign {
  schema_version: number;
  mode: "concrete_runtime_single_dispatch_slice_design";
  concrete_runtime_single_dispatch_slice_design_complete: boolean;
  source_approval_lane: string;
  next_manual_lane: string;
  one_shot_envelope: Record<string, boolean>;
  target_allowlist: Record<string, boolean>;
  rollback_plan: Record<string, boolean>;
  dry_run_evidence_requirements: Record<string, boolean>;
  idempotency: Record<string, boolean>;
  disabled_runtime_gate: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDisabledOneShotRuntimeDispatchExecutorSkeleton {
  schema_version: number;
  mode: "disabled_one_shot_runtime_dispatch_executor_skeleton";
  disabled_one_shot_runtime_dispatch_executor_skeleton_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  executor_gate: Record<string, boolean>;
  required_inputs: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  contract_hardening: Record<string, boolean>;
  ref_patterns: Record<string, string>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeApprovedRealOneShotDispatchGateDesign {
  schema_version: number;
  mode: "approved_real_one_shot_dispatch_gate_design";
  approved_real_one_shot_dispatch_gate_design_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  approval_gate: Record<string, boolean>;
  runtime_command_envelope: Record<string, boolean>;
  replay_store: Record<string, boolean>;
  rollback_disable: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  forbidden_boundaries: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingPreflightStatus {
  schema_version: number;
  mode: "manual_approval_recording_preflight_status";
  manual_approval_recording_preflight_complete: boolean;
  source_design_lane: string;
  next_manual_lane: string;
  preflight_contract: Record<string, boolean>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingPreflightPayload {
  approval_record_ref: string;
  exact_target_allowlist_ref: string;
  idempotency_key: string;
  replay_lookup_ref: string;
  rollback_disable_ref: string;
  dry_run_evidence_ref: string;
  operator_confirmation: string;
}

export interface OfficeManualApprovalRecordingPreflightRefusal {
  schema_version: number;
  mode: "manual_approval_recording_preflight_refusal";
  accepted: false;
  approval_record_written: false;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  refusal_code: string;
  safe_validation: Record<string, boolean>;
  validation_errors: Array<{ field: string; code: string }>;
  missing_requirements: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordingDraftPayload extends OfficeManualApprovalRecordingPreflightPayload {
  requested_by: string;
  requested_at: string;
  safe_summary: string;
  evidence_refs: string[];
}

export interface OfficeManualApprovalRecordingDraft {
  schema_version: number;
  mode: "stored_manual_approval_recording_draft";
  draft_status: "draft_only";
  approval_record_ref: string;
  idempotency_key: string;
  approval_record_written: false;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  idempotency_replay_store_written: false;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordingDraftAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualApprovalRecordingDraft | null;
}

export interface OfficeManualApprovalRecordingDraftStatus {
  schema_version: number;
  mode: "stored_manual_approval_recording_drafts_readback";
  draft_count: number;
  limit: number;
  skipped_count: number;
  drafts: OfficeManualApprovalRecordingDraft[];
  latest_refs: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordingDraftReviewStatus {
  schema_version: number;
  mode: "manual_approval_recording_draft_review_status";
  manual_approval_recording_draft_review_complete: boolean;
  source_design_lane?: string;
  next_manual_lane?: string;
  review: Record<string, string | boolean | number | null>;
  readback: Record<string, unknown>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalRecordPayload {
  approval_record_ref: string;
  operator_confirmation: "confirmed-real-approval-record-write-only";
  approved_by: string;
  approved_at: string;
  approval_evidence_refs: string[];
}

export interface OfficeManualApprovalRecord {
  schema_version: number;
  mode: "stored_manual_approval_record";
  approval_status: "recorded_manual_approval";
  approval_record_ref: string;
  approval_record_written: true;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
}

export interface OfficeManualApprovalRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualApprovalRecord | null;
}

export interface OfficeManualApprovalRecordStatus {
  schema_version: number;
  mode: "stored_manual_approval_records_readback";
  approval_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualApprovalRecord[];
  latest_refs: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeApprovalEventEnvelopeRecord {
  schema_version: number;
  mode: "stored_approval_event_envelope";
  event_status?: "approval_event_envelope_metadata_recorded";
  approval_event_ref: string;
  approval_record_ref: string;
  event_envelope_ref: string;
  approval_record_written: boolean;
  approval_event_envelope_written: true;
  dispatch_gate_open: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  kanban_mutation_created?: false;
  nas_save_created?: false;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeApprovalEventEnvelopeAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeApprovalEventEnvelopeRecord | null;
}

export interface OfficeApprovalEventEnvelopeStatus {
  schema_version: number;
  mode: "stored_approval_event_envelopes_readback";
  approval_event_envelope_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeApprovalEventEnvelopeRecord[];
  latest_refs: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualApprovalDispatchGateReadinessStatus {
  schema_version: number;
  mode: "manual_approval_dispatch_gate_readiness_status";
  manual_approval_dispatch_gate_readiness_complete: boolean;
  source_design_lane?: string;
  next_manual_lane?: string;
  readiness: Record<string, string | boolean | number | null>;
  readback?: Record<string, unknown>;
  execution_boundary: Record<string, boolean>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeManualDispatchGateOpenRecordPayload {
  approval_record_ref: string;
  dispatch_gate_ref: string;
  operator_confirmation: "confirmed-dispatch-gate-open-metadata-only";
  opened_by: string;
  opened_at: string;
  gate_evidence_refs: string[];
}

export interface OfficeManualDispatchGateOpenRecord {
  schema_version: number;
  mode: "stored_manual_dispatch_gate_open_record";
  gate_status?: "dispatch_gate_open_metadata_only";
  approval_record_ref: string;
  dispatch_gate_ref: string;
  approval_record_written?: boolean;
  dispatch_gate_open: boolean;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualDispatchGateOpenRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualDispatchGateOpenRecord | null;
}

export interface OfficeManualDispatchGateOpenRecordStatus {
  schema_version: number;
  mode: "stored_manual_dispatch_gate_open_records_readback";
  dispatch_gate_open_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualDispatchGateOpenRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandPreviewRecordPayload {
  dispatch_gate_ref: string;
  runtime_command_preview_ref: string;
  command_envelope_ref: string;
  command_intent_ref: string;
  operator_confirmation: "confirmed-runtime-command-preview-only";
  materialized_by: string;
  materialized_at: string;
  preview_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandPreviewRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_preview_record";
  preview_status?: "runtime_command_preview_only";
  dispatch_gate_ref: string;
  runtime_command_preview_ref: string;
  command_envelope_ref?: string;
  command_intent_ref?: string;
  approval_record_ref?: string;
  runtime_command_preview_created: boolean;
  runtime_command_preview_checksum_sha256: string;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandPreviewRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandPreviewRecord | null;
}

export interface OfficeManualRuntimeCommandPreviewRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_preview_records_readback";
  runtime_command_preview_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandPreviewRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandInclusionRecordPayload {
  runtime_command_preview_ref: string;
  runtime_command_ref: string;
  operator_confirmation: "confirmed-runtime-command-inclusion-no-execute";
  included_by: string;
  included_at: string;
  command_kind: "office_controlled_mutation_single_dispatch_noop_probe";
  command_body: {
    target_ref: string;
    dry_run_evidence_ref: string;
    rollback_disable_ref: string;
  };
  inclusion_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandInclusionRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_inclusion_record";
  inclusion_status?: "runtime_command_included_no_execute";
  runtime_command_preview_ref: string;
  runtime_command_ref: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  command_envelope_ref?: string;
  command_intent_ref?: string;
  command_kind: "office_controlled_mutation_single_dispatch_noop_probe";
  command_body: {
    target_ref: string;
    dry_run_evidence_ref: string;
    rollback_disable_ref: string;
  };
  runtime_command_body_checksum_sha256: string;
  runtime_command_preview_created?: boolean;
  runtime_command_included: boolean;
  runtime_command_executed: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandInclusionRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandInclusionRecord | null;
}

export interface OfficeManualRuntimeCommandInclusionRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_inclusion_records_readback";
  runtime_command_inclusion_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandInclusionRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualRuntimeCommandExecutionRecordPayload {
  runtime_command_ref: string;
  runtime_execution_ref: string;
  idempotency_key: string;
  operator_confirmation: "confirmed-runtime-command-execute-noop-probe-only";
  executed_by: string;
  executed_at: string;
  execution_evidence_refs: string[];
}

export interface OfficeManualRuntimeCommandExecutionRecord {
  schema_version: number;
  mode: "stored_manual_runtime_command_execution_record";
  execution_status?: "noop_probe_executed_no_target_mutation";
  runtime_command_preview_ref?: string;
  runtime_command_ref: string;
  runtime_execution_ref: string;
  idempotency_key: string;
  runtime_execution_result: "noop_probe_succeeded";
  runtime_command_included?: boolean;
  runtime_command_executed: boolean;
  idempotency_replay_store_written: boolean;
  adapter_dispatch_created?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualRuntimeCommandExecutionRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualRuntimeCommandExecutionRecord | null;
}

export interface OfficeManualRuntimeCommandExecutionRecordStatus {
  schema_version: number;
  mode: "stored_manual_runtime_command_execution_records_readback";
  runtime_command_execution_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualRuntimeCommandExecutionRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualTargetMutationReadinessRecordPayload {
  runtime_execution_ref: string;
  target_mutation_readiness_ref: string;
  exact_target_allowlist_ref: string;
  target_ref: string;
  dry_run_evidence_ref: string;
  rollback_disable_ref: string;
  operator_confirmation: "confirmed-target-mutation-readiness-no-mutate";
  verified_by: string;
  verified_at: string;
  readiness_evidence_refs: string[];
}

export interface OfficeManualTargetMutationReadinessRecord {
  schema_version: number;
  mode: "stored_manual_target_mutation_readiness_record";
  readiness_status?: "exact_target_verified_no_mutation";
  runtime_command_ref?: string;
  runtime_execution_ref: string;
  target_mutation_readiness_ref: string;
  exact_target_allowlist_ref: string;
  target_ref: string;
  dry_run_evidence_ref?: string;
  rollback_disable_ref?: string;
  target_mutation_readiness_verified: boolean;
  exact_target_allowlist_verified: boolean;
  runtime_command_executed: boolean;
  idempotency_replay_store_written?: boolean;
  adapter_dispatch_created?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created?: boolean;
  nas_save_created?: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualTargetMutationReadinessRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualTargetMutationReadinessRecord | null;
}

export interface OfficeManualTargetMutationReadinessRecordStatus {
  schema_version: number;
  mode: "stored_manual_target_mutation_readiness_records_readback";
  target_mutation_readiness_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualTargetMutationReadinessRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualTargetMutationRecordPayload {
  target_mutation_readiness_ref: string;
  target_mutation_ref: string;
  operator_confirmation: "confirmed-target-mutation-write-only";
  mutated_by: string;
  mutated_at: string;
  mutation_evidence_refs: string[];
}

export interface OfficeManualTargetMutationRecord {
  schema_version: number;
  mode: "stored_manual_target_mutation_record";
  mutation_status?: "exact_target_mutated_no_kanban_or_nas";
  target_mutation_result?: "safe_target_marker_written";
  target_mutation_readiness_ref: string;
  target_mutation_ref: string;
  runtime_execution_ref?: string;
  runtime_command_ref?: string;
  runtime_command_preview_ref?: string;
  idempotency_key?: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  exact_target_allowlist_ref?: string;
  target_ref?: string;
  dry_run_evidence_ref?: string;
  rollback_disable_ref?: string;
  target_mutation_readiness_verified?: boolean;
  exact_target_allowlist_verified?: boolean;
  runtime_command_executed?: boolean;
  idempotency_replay_store_written?: boolean;
  rollback_executed?: boolean;
  target_mutation_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualTargetMutationRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualTargetMutationRecord | null;
}

export interface OfficeManualTargetMutationRecordStatus {
  schema_version: number;
  mode: "stored_manual_target_mutation_records_readback";
  target_mutation_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualTargetMutationRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualAdapterDispatchRecordPayload {
  target_mutation_ref: string;
  adapter_dispatch_ref: string;
  adapter_ref: string;
  operator_confirmation: "confirmed-adapter-dispatch-record-only";
  dispatched_by: string;
  dispatched_at: string;
  dispatch_evidence_refs: string[];
}

export interface OfficeManualAdapterDispatchRecord {
  schema_version: number;
  mode: "stored_manual_adapter_dispatch_record";
  dispatch_status?: "adapter_dispatched_no_kanban_or_nas";
  adapter_dispatch_result?: "safe_adapter_dispatch_marker_written";
  target_mutation_ref: string;
  adapter_dispatch_ref: string;
  adapter_ref: string;
  target_mutation_readiness_ref?: string;
  runtime_execution_ref?: string;
  runtime_command_ref?: string;
  runtime_command_preview_ref?: string;
  idempotency_key?: string;
  dispatch_gate_ref?: string;
  approval_record_ref?: string;
  exact_target_allowlist_ref?: string;
  target_ref?: string;
  target_mutation_created: boolean;
  adapter_dispatch_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualAdapterDispatchRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualAdapterDispatchRecord | null;
}

export interface OfficeManualAdapterDispatchRecordStatus {
  schema_version: number;
  mode: "stored_manual_adapter_dispatch_records_readback";
  adapter_dispatch_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualAdapterDispatchRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualKanbanMutationRecordPayload {
  adapter_dispatch_ref: string;
  kanban_mutation_ref: string;
  kanban_card_ref: string;
  operator_confirmation: "confirmed-kanban-mutation-record-only";
  mutated_by: string;
  mutated_at: string;
  mutation_evidence_refs: string[];
}

export interface OfficeManualKanbanMutationRecord {
  schema_version: number;
  mode: "stored_manual_kanban_mutation_record";
  kanban_status?: "kanban_mutated_no_nas_or_real_dispatch";
  kanban_mutation_result?: "safe_kanban_marker_written";
  adapter_dispatch_ref: string;
  kanban_mutation_ref: string;
  kanban_card_ref: string;
  adapter_ref?: string;
  target_mutation_ref?: string;
  target_ref?: string;
  target_mutation_created: boolean;
  adapter_dispatch_created: boolean;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualKanbanMutationRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualKanbanMutationRecord | null;
}

export interface OfficeManualKanbanMutationRecordStatus {
  schema_version: number;
  mode: "stored_manual_kanban_mutation_records_readback";
  kanban_mutation_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualKanbanMutationRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualNasSaveRecordPayload {
  kanban_mutation_ref: string;
  nas_save_ref: string;
  nas_note_ref: string;
  operator_confirmation: "confirmed-nas-save-record-only";
  saved_by: string;
  saved_at: string;
  save_evidence_refs: string[];
}

export interface OfficeManualNasSaveRecord {
  schema_version: number;
  mode: "stored_manual_nas_save_record";
  nas_save_status?: "nas_save_marker_written_no_direct_vps_authority";
  nas_save_result?: "safe_nas_save_marker_written";
  kanban_mutation_ref: string;
  nas_save_ref: string;
  nas_note_ref: string;
  kanban_card_ref?: string;
  adapter_dispatch_ref?: string;
  target_mutation_ref?: string;
  target_ref?: string;
  kanban_mutation_created: boolean;
  nas_save_created: boolean;
  vps_direct_nas_authority_enabled: boolean;
  real_nas_execution_enabled: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualNasSaveRecordAppendResult {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualNasSaveRecord | null;
}

export interface OfficeManualNasSaveRecordStatus {
  schema_version: number;
  mode: "stored_manual_nas_save_records_readback";
  nas_save_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualNasSaveRecord[];
  latest_refs?: Record<string, string>;
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeManualNasKeeperHandoffRecordPayload {
  nas_save_ref: string;
  handoff_ref: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  markdown_body: string;
  requested_by: string;
  requested_at: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  queued_by: string;
  queued_at: string;
  operator_confirmation: "confirmed-nas-keeper-handoff-queue-only";
}

export interface OfficeManualNasKeeperHandoffRecord {
  schema_version: number;
  mode: "manual_nas_keeper_handoff_queued";
  nas_save_ref: string;
  handoff_ref: string;
  queue_status: string;
  relay_request_ref: string;
  write_ref: string;
  package_ref: string;
  target_vault_ref: string;
  safe_slug: string;
  safe_title: string;
  nas_save_created: boolean;
  nas_keeper_handoff_queued: boolean;
  direct_vps_nas_write_enabled: boolean;
  vps_direct_nas_authority_enabled: boolean;
  mac_relay_write_enabled: boolean;
  actual_nas_write_enabled: boolean;
  real_nas_execution_enabled: boolean;
  real_dispatch_execution_enabled: boolean;
  capabilities?: Record<string, boolean>;
  redaction?: Record<string, boolean>;
}

export interface OfficeManualNasKeeperHandoffRecordAppendResult {
  queued: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeManualNasKeeperHandoffRecord | null;
}

export interface OfficeManualNasKeeperHandoffRecordStatus {
  schema_version: number;
  mode: "manual_nas_keeper_handoff_records_readback";
  nas_keeper_handoff_record_count: number;
  limit?: number;
  skipped_count?: number;
  records: OfficeManualNasKeeperHandoffRecord[];
  capabilities: Record<string, boolean>;
  redaction?: Record<string, boolean>;
  errors?: Array<{ field: string; code: string }>;
}

export interface OfficeDisabledOneShotRuntimeDispatchPayload {
  exact_target_allowlist_ref: string;
  idempotency_key: string;
  rollback_plan_ref: string;
  dry_run_evidence_ref: string;
  operator_confirmation: boolean;
}

export interface OfficeDisabledOneShotRuntimeDispatchRefusal {
  schema_version: number;
  mode: "disabled_one_shot_runtime_dispatch_executor_refusal";
  accepted: false;
  dispatch_created: false;
  runtime_command_executed: false;
  target_mutation_created: false;
  refusal_code: string;
  safe_validation: Record<string, boolean>;
  validation_errors: Array<{ field: string; code: string }>;
  missing_requirements: string[];
  capabilities: Record<string, boolean>;
  redaction: Record<string, boolean>;
  errors: Array<{ field: string; code: string }>;
}

export interface OfficeDispatcherCompletionReviewStatusParams {
  limit?: number;
}

export interface OfficeNasKeeperExecutionPayloadPreviewPayload {
  handoff_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  relay_authorized_by: string;
  relay_authorized_at: string;
}

export interface OfficeNasKeeperExecutionPayloadPreviewResult {
  previewed: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_execution_payload_preview";
    previewed: true;
    handoff_ref: string;
    authorization_ref?: string;
    relay_execution_ref: string;
    queue_ref?: string;
    queue_status: string;
    authorization_decision?: string;
    authorized_by?: string;
    authorized_at?: string;
    relay_authorized_by: string;
    relay_authorized_at: string;
    execution_payload_preview?: Record<string, string>;
    execution_payload_fields?: string[];
    markdown_body_ref: string;
    markdown_body_bytes: number;
    markdown_body_sha256: string;
    markdown_body_included: false;
    execution_path?: string[];
    payload_preview_path?: string[];
    safe_logical_path?: string;
    safe_display_path?: string;
    payload_bytes?: number;
    capabilities: Record<string, boolean>;
    next_required_boundary?: string;
  };
}

export interface OfficeMacRelayRootReadinessProbeResult {
  probed: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "mac_local_relay_root_readiness_probe";
    probed: true;
    root_configured: boolean;
    root_readable: boolean;
    root_writable: boolean;
    safe_probe_ref: string;
    sanitized_root_label: string;
    redaction_policy_version: number;
    probe_errors: string[];
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperLastSuccessfulMacRelayWriteResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_last_successful_bounded_write_readback";
    last_successful_write_found: boolean;
    handoff_ref?: string;
    authorization_ref?: string;
    relay_execution_ref?: string;
    execution_record_ref?: string;
    target_vault_ref?: string;
    safe_slug?: string;
    safe_display_path?: string;
    queue_status?: string;
    execution_status?: string;
    execution_recorded_at?: string;
    readback_sha256?: string;
    markdown_body_sha256?: string;
    readback_verified?: boolean;
    payload_bytes?: number;
    markdown_body_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    write_payload_included?: false;
    repeat_execution_replay_allowed: false;
    fresh_handoff_required_per_write: true;
    fresh_authorization_required_per_write: true;
    fresh_execution_ref_required_per_write: true;
    operator_flow_contract?: string[];
    capabilities: Record<string, boolean>;
    next_required_boundary?: string;
  };
}

export interface OfficeNasKeeperFreshOneShotOperatorWriteResult {
  executed: boolean;
  written: boolean;
  recorded: boolean;
  fresh_refs_verified: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_fresh_one_shot_operator_write_completed";
    fresh_refs_verified: true;
    handoff_ref: string;
    authorization_ref: string;
    relay_execution_ref: string;
    execution_record_ref: string;
    queue_ref?: string;
    queue_status?: string;
    execution_status?: string;
    safe_display_path?: string;
    safe_logical_path?: string;
    payload_bytes?: number;
    markdown_body_sha256?: string;
    readback_sha256?: string;
    readback_verified: boolean;
    execution_state_recorded: boolean;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    fresh_handoff_required_per_write: true;
    fresh_authorization_required_per_write: true;
    fresh_execution_ref_required_per_write: true;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshOneShotRequestBuilderResult {
  built: boolean;
  dry_reviewed: boolean;
  executed: boolean;
  written: boolean;
  approval_required: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_one_shot_operator_request_builder_review" | "nas_keeper_fresh_one_shot_operator_request_builder_executed";
    operator_intent_ref: string;
    issued_at: string;
    approve_actual_write: boolean;
    request_payload_ready: boolean;
    fresh_refs_verified: boolean;
    handoff_ref: string;
    authorization_ref: string;
    relay_execution_ref: string;
    execution_record_ref: string;
    safe_slug: string;
    safe_title: string;
    safe_request_payload: Record<string, unknown>;
    markdown_body_sha256: string;
    markdown_body_bytes: number;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    request_builder_path: string[];
    next_required_boundary: string;
    write_result?: OfficeNasKeeperFreshOneShotOperatorWriteResult["dto"];
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_readback";
    count: number;
    items: Array<{
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_item";
      operator_request_outcome: string;
      handoff_ref: string;
      authorization_ref: string;
      relay_execution_ref: string;
      execution_record_ref: string;
      safe_slug: string;
      safe_title: string;
      safe_display_path?: string;
      queue_ref?: string;
      queue_status: string;
      execution_status: string;
      dry_reviewed_at: string;
      authorized_at: string;
      executed_at?: string | null;
      dry_review_before_write_verified: boolean;
      markdown_body_sha256: string;
      readback_sha256: string;
      readback_verified: boolean;
      payload_bytes?: number;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      credential_value_included: false;
      repeat_execution_replay_allowed: false;
    }>;
    filters_applied: Record<string, string>;
    safe_export_enabled: boolean;
    safe_export: null | {
      format: "fresh_request_builder_safe_export_v1";
      count: number;
      items: Array<Record<string, string | number | boolean | null | undefined>>;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      credential_value_included: false;
    };
    dry_review_before_write_verified: boolean;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerExportSelectionReviewResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_export_selection_review";
    selection_profile: "latest_written";
    source_mode: "nas_keeper_fresh_request_builder_ledger_readback";
    filters_applied: Record<string, string>;
    selected_item_count: number;
    selected_safe_export: OfficeNasKeeperFreshRequestBuilderLedgerReadbackResult["dto"]["safe_export"];
    selected_checksum_set: Array<{
      handoff_ref: string;
      markdown_body_sha256: string;
      readback_sha256: string;
      readback_verified: boolean;
    }>;
    checksum_set_sha256: string;
    export_item_count_verified: boolean;
    checksum_set_verified: boolean;
    downstream_use_enabled: false;
    downstream_use_ready: boolean;
    manual_operator_review_required: boolean;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_use_preflight";
    selection_profile: "latest_written";
    source_mode: "nas_keeper_fresh_request_builder_ledger_export_selection_review";
    filters_applied: Record<string, string>;
    selected_item_count: number;
    checksum_set_sha256: string;
    preflight_decision_sha256: string;
    selected_export_review_passed: boolean;
    export_item_count_verified: boolean;
    checksum_set_verified: boolean;
    downstream_use_ready: boolean;
    downstream_use_allowed_after_manual_review: boolean;
    downstream_use_enabled: false;
    downstream_use_blocked_reason: string;
    manual_operator_review_required: boolean;
    manual_operator_review_record_present: boolean;
    source_selection_review: {
      selection_profile?: string;
      selected_item_count: number;
      checksum_set_sha256: string;
      export_item_count_verified: boolean;
      checksum_set_verified: boolean;
      downstream_use_ready: boolean;
      downstream_use_enabled: boolean;
    };
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerManualReviewRecordReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_manual_review_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: Array<{
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_manual_review_record";
      manual_operator_review_record_written: true;
      manual_review_ref: string;
      selection_profile: "latest_written";
      source_preflight_decision_sha256: string;
      checksum_set_sha256: string;
      selected_item_count: number;
      reviewed_by: string;
      reviewed_at: string;
      operator_confirmation: string;
      safe_summary: string;
      evidence_refs: string[];
      manual_review_record_sha256: string;
      downstream_use_enabled: false;
      downstream_consumed: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      credential_value_included: false;
      repeat_execution_replay_allowed: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      capabilities: Record<string, boolean>;
      next_required_boundary: string;
    }>;
    latest_record: null | Record<string, unknown>;
    downstream_use_enabled: false;
    downstream_consumption_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_use_enablement_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: Array<Record<string, unknown>>;
    latest_record: null | {
      downstream_use_enablement_recorded?: boolean;
      enablement_ref?: string;
      source_preflight_decision_sha256?: string;
      manual_review_ref?: string;
      manual_review_record_sha256?: string;
      manual_review_record_verified?: boolean;
      checksum_set_sha256?: string;
      selected_item_count?: number;
      enablement_record_sha256?: string;
      downstream_use_enabled?: boolean;
      downstream_consumption_enabled?: boolean;
      downstream_consumed?: boolean;
      markdown_body_included?: boolean;
      write_payload_included?: boolean;
      raw_root_path_included?: boolean;
      credential_value_included?: boolean;
      repeat_execution_replay_allowed?: boolean;
      watcher_enabled?: boolean;
      cron_enabled?: boolean;
      dispatch_enabled?: boolean;
      authority_adapter_binding_enabled?: boolean;
      vps_nas_mount_enabled?: boolean;
    };
    downstream_use_enabled: false;
    downstream_consumption_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_preflight";
    selection_profile: string;
    selected_export_review_passed: boolean;
    manual_operator_review_record_present: boolean;
    downstream_use_enablement_record_present: boolean;
    consumption_preflight_passed: boolean;
    enablement_ref?: string | null;
    source_preflight_decision_sha256?: string | null;
    manual_review_ref?: string | null;
    manual_review_record_sha256?: string | null;
    enablement_record_sha256?: string | null;
    checksum_set_sha256?: string | null;
    selected_item_count: number;
    consumption_preflight_decision_sha256: string;
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed_after_preflight: false;
    blocked_reason: string;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_enablement_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: Array<Record<string, unknown>>;
    latest_record?: null | {
      downstream_consumption_enablement_recorded?: boolean;
      consumption_enablement_ref?: string;
      consumption_preflight_verified?: boolean;
      enablement_ref?: string;
      source_consumption_preflight_decision_sha256?: string;
      source_preflight_decision_sha256?: string;
      manual_review_ref?: string;
      manual_review_record_sha256?: string;
      enablement_record_sha256?: string;
      checksum_set_sha256?: string;
      selected_item_count?: number;
      consumption_enablement_record_sha256?: string;
      downstream_use_enabled?: boolean;
      downstream_consumption_enabled?: boolean;
      downstream_consumed?: boolean;
      actual_downstream_consumption_allowed?: boolean;
      markdown_body_included?: boolean;
      write_payload_included?: boolean;
      raw_root_path_included?: boolean;
      credential_value_included?: boolean;
      repeat_execution_replay_allowed?: boolean;
      watcher_enabled?: boolean;
      cron_enabled?: boolean;
      dispatch_enabled?: boolean;
      authority_adapter_binding_enabled?: boolean;
      vps_nas_mount_enabled?: boolean;
    };
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    repeat_execution_replay_allowed: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_boundary_design";
    boundary_design_ready: boolean;
    source_consumption_enablement_ref?: string | null;
    source_consumption_enablement_record_sha256?: string | null;
    safe_ref_chain_verified: boolean;
    target_allowlist_shape: Record<string, boolean>;
    idempotency_replay_guard_design: Record<string, boolean>;
    rollback_disable_posture: Record<string, boolean>;
    approval_boundary: Record<string, boolean | string>;
    boundary_design_sha256: string;
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApprovalReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_exact_approval_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_exact_approval_record";
      exact_approval_recorded: boolean;
      exact_approval_ref: string;
      source_consumption_enablement_ref: string;
      source_consumption_enablement_record_sha256: string;
      boundary_design_sha256: string;
      boundary_design_verified: boolean;
      safe_ref_chain_verified: boolean;
      exact_approval_record_sha256: string;
      downstream_consumption_enabled: false;
      downstream_consumed: false;
      actual_downstream_consumption_allowed: false;
      approval_record_write_enabled: boolean;
      replay_store_write_enabled: false;
      markdown_body_included: false;
      write_payload_included: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      [key: string]: unknown;
    };
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    approval_record_write_enabled: boolean;
    replay_store_write_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflightResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_preflight";
    actual_consumption_preflight_ready: boolean;
    exact_approval_record_verified: boolean;
    safe_ref_chain_verified: boolean;
    exact_approval_ref: string | null;
    exact_approval_record_sha256: string | null;
    boundary_design_sha256: string | null;
    source_consumption_enablement_ref: string | null;
    source_consumption_enablement_record_sha256: string | null;
    target_allowlist_verified: boolean;
    idempotency_replay_lookup_required: boolean;
    disable_switch_required: boolean;
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    approval_record_write_enabled: boolean;
    replay_store_write_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGateReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_execution_gate_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGateRecord[];
    latest_record: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGateRecord | null;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    execution_gate_record_write_enabled: boolean;
    replay_store_write_enabled: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGateRecord {
  schema_version: number;
  mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_execution_gate_record";
  execution_gate_opened: boolean;
  execution_gate_ref: string;
  selection_profile: "latest_written";
  exact_approval_ref: string;
  exact_approval_record_sha256: string;
  boundary_design_sha256: string;
  actual_consumption_preflight_verified: boolean;
  exact_approval_record_verified: boolean;
  safe_ref_chain_verified: boolean;
  approved_by: string;
  approved_at: string;
  operator_confirmation: string;
  safe_summary: string;
  evidence_refs: string[];
  execution_gate_record_sha256: string;
  downstream_use_enabled: boolean;
  downstream_consumption_enabled: false;
  downstream_consumed: false;
  actual_downstream_consumption_allowed: false;
  execution_gate_record_write_enabled: boolean;
  replay_store_write_enabled: false;
  markdown_body_included: false;
  write_payload_included: false;
  raw_root_path_included: false;
  credential_value_included: false;
  watcher_enabled: false;
  cron_enabled: false;
  dispatch_enabled: false;
  authority_adapter_binding_enabled: false;
  vps_nas_mount_enabled: false;
  capabilities: Record<string, boolean>;
  next_required_boundary: string;
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_noop_replay_probe_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeRecord[];
    latest_record: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeRecord | null;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeRecord {
  schema_version: number;
  mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_noop_replay_probe_record";
  noop_replay_probe_recorded: boolean;
  noop_replay_probe_ref: string;
  execution_gate_ref: string;
  execution_gate_record_sha256: string;
  selection_profile: "latest_written";
  idempotency_probe_key_ref: string;
  probe_mode: "noop_replay_probe_only";
  execution_gate_record_verified: boolean;
  safe_ref_chain_verified: boolean;
  idempotency_probe_key_verified: boolean;
  noop_probe_result: "noop_probe_succeeded";
  approved_by: string;
  approved_at: string;
  operator_confirmation: string;
  safe_summary: string;
  evidence_refs: string[];
  noop_replay_probe_record_sha256: string;
  downstream_use_enabled: boolean;
  downstream_consumption_enabled: false;
  downstream_consumed: false;
  actual_downstream_consumption_allowed: false;
  replay_store_write_enabled: false;
  real_replay_store_written: false;
  markdown_body_included: false;
  write_payload_included: false;
  raw_root_path_included: false;
  credential_value_included: false;
  repeat_execution_replay_allowed: false;
  watcher_enabled: false;
  cron_enabled: false;
  dispatch_enabled: false;
  authority_adapter_binding_enabled: false;
  vps_nas_mount_enabled: false;
  capabilities: Record<string, boolean>;
  next_required_boundary: string;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreWriteContractResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_write_contract";
    replay_store_contract_ready: boolean;
    noop_replay_probe_record_verified: boolean;
    noop_replay_probe_ref: string;
    noop_replay_probe_record_sha256: string;
    execution_gate_ref: string;
    execution_gate_record_sha256: string;
    safe_ref_chain_verified: boolean;
    idempotency_probe_key_ref: string;
    idempotency_probe_key_verified: boolean;
    replay_store_key_ref: string;
    contract_write_shape_version: string;
    allowed_replay_store_fields: string[];
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    credential_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataRecord {
  schema_version: number;
  mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_metadata_record";
  replay_store_metadata_recorded: boolean;
  replay_store_entry_ref: string;
  noop_replay_probe_ref: string;
  noop_replay_probe_record_sha256: string;
  replay_store_key_ref: string;
  source_record_sha256: string;
  contract_write_shape_version: string;
  contract_write_shape_version_verified: boolean;
  noop_replay_probe_record_verified: boolean;
  safe_ref_chain_verified: boolean;
  source_record_sha256_verified: boolean;
  result_status: string;
  recorded_by: string;
  recorded_at: string;
  operator_confirmation: string;
  safe_summary: string;
  evidence_refs: string[];
  replay_store_metadata_record_sha256: string;
  downstream_use_enabled: boolean;
  downstream_consumption_enabled: false;
  downstream_consumed: false;
  actual_downstream_consumption_allowed: false;
  replay_store_write_enabled: boolean;
  real_replay_store_written: false;
  markdown_body_included: false;
  write_payload_included: false;
  raw_root_path_included: false;
  credential_value_included: false;
  watcher_enabled: false;
  cron_enabled: false;
  dispatch_enabled: false;
  authority_adapter_binding_enabled: false;
  vps_nas_mount_enabled: false;
  capabilities: Record<string, boolean>;
  next_required_boundary: string;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_replay_store_metadata_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataRecord[];
    latest_record: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataRecord | null;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    replay_store_write_enabled: boolean;
    real_replay_store_written: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionDisabledReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_disabled_readback";
    actual_consumption_disabled_readback_ready: boolean;
    replay_store_metadata_record_verified: boolean;
    safe_ref_chain_verified: boolean;
    replay_store_entry_ref?: string;
    noop_replay_probe_ref?: string;
    replay_store_key_ref?: string;
    replay_store_metadata_record_sha256?: string;
    execution_design_sha256?: string;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionExecutionDesignResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_one_shot_actual_consumption_execution_design";
    execution_design_ready: boolean;
    disabled_readback_verified: boolean;
    replay_store_metadata_record_verified: boolean;
    safe_ref_chain_verified: boolean;
    replay_store_entry_ref?: string;
    noop_replay_probe_ref?: string;
    replay_store_key_ref?: string;
    replay_store_metadata_record_sha256?: string;
    execution_design_sha256?: string;
    downstream_use_enabled?: boolean;
    allowed_execution_input_refs: string[];
    required_pre_execution_gates: string[];
    rollback_disable_required: boolean;
    post_execution_proof_required: boolean;
    operator_exact_execution_approval_required: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOperatorExecutionApprovalResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_records_readback";
    record_count: number;
    limit?: number;
    skipped_count: number;
    records: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_operator_execution_approval_record";
      operator_execution_approval_recorded: boolean;
      operator_execution_approval_ref: string;
      replay_store_entry_ref: string;
      noop_replay_probe_ref: string;
      replay_store_key_ref: string;
      replay_store_metadata_record_sha256: string;
      execution_design_sha256: string;
      execution_design_verified: boolean;
      replay_store_metadata_record_verified: boolean;
      safe_ref_chain_verified: boolean;
      approval_scope: string;
      approved_by: string;
      approved_at: string;
      operator_confirmation: string;
      safe_summary: string;
      evidence_refs: string[];
      operator_execution_approval_record_sha256: string;
      downstream_use_enabled: boolean;
      downstream_consumption_enabled: false;
      downstream_consumed: false;
      actual_downstream_consumption_allowed: false;
      actual_downstream_consumption_executed: false;
      replay_store_write_enabled: false;
      real_replay_store_written: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
    };
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionIdempotencyReplayGuardResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_records_readback";
    record_count: number;
    limit?: number;
    skipped_count?: number;
    records?: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_idempotency_replay_guard_record";
      idempotency_replay_guard_recorded: boolean;
      idempotency_replay_guard_ref: string;
      operator_execution_approval_ref: string;
      operator_execution_approval_record_sha256: string;
      replay_store_entry_ref: string;
      replay_store_metadata_record_sha256: string;
      execution_design_sha256: string;
      idempotency_replay_guard_record_sha256: string;
      operator_execution_approval_record_verified: boolean;
      execution_design_verified: boolean;
      replay_store_metadata_record_verified: boolean;
      safe_ref_chain_verified: boolean;
      duplicate_execution_design_blocked: boolean;
      duplicate_replay_store_entry_blocked: boolean;
      duplicate_operator_execution_approval_blocked: boolean;
      downstream_use_enabled: boolean;
      downstream_consumption_enabled: false;
      downstream_consumed: false;
      actual_downstream_consumption_allowed: false;
      actual_downstream_consumption_executed: false;
      replay_store_write_enabled: false;
      real_replay_store_written: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      secret_value_included?: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      next_required_boundary: string;
    };
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled?: false;
    downstream_consumed?: false;
    actual_downstream_consumption_allowed?: false;
    actual_downstream_consumption_executed?: false;
    replay_store_write_enabled?: false;
    real_replay_store_written?: false;
    markdown_body_included?: false;
    write_payload_included?: false;
    raw_root_path_included?: false;
    watcher_enabled?: false;
    cron_enabled?: false;
    dispatch_enabled?: false;
    authority_adapter_binding_enabled?: false;
    vps_nas_mount_enabled?: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionOpeningResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_records_readback";
    record_count: number;
    limit?: number;
    skipped_count?: number;
    records?: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_execution_opening_record";
      execution_opening_recorded: boolean;
      execution_opening_ready: boolean;
      execution_opening_ref: string;
      idempotency_replay_guard_ref: string;
      idempotency_replay_guard_record_sha256?: string;
      idempotency_replay_guard_record_verified: boolean;
      safe_ref_chain_verified: boolean;
      downstream_use_enabled: boolean;
      downstream_consumption_enabled: false;
      actual_downstream_consumption_allowed: false;
      actual_downstream_consumption_executed: false;
      replay_store_write_enabled: false;
      real_replay_store_written: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      secret_value_included?: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      execution_opening_record_sha256: string;
      next_required_boundary: string;
      [key: string]: unknown;
    };
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled?: false;
    downstream_consumed?: false;
    actual_downstream_consumption_allowed?: false;
    actual_downstream_consumption_executed?: false;
    replay_store_write_enabled?: false;
    real_replay_store_written?: false;
    markdown_body_included?: false;
    write_payload_included?: false;
    raw_root_path_included?: false;
    watcher_enabled?: false;
    cron_enabled?: false;
    dispatch_enabled?: false;
    authority_adapter_binding_enabled?: false;
    vps_nas_mount_enabled?: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopExecutionProbeResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_records_readback";
    record_count: number;
    limit?: number;
    skipped_count?: number;
    records?: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_noop_execution_probe_record";
      noop_execution_probe_recorded: boolean;
      noop_execution_probe_ready: boolean;
      noop_execution_probe_ref: string;
      execution_opening_ref: string;
      execution_opening_record_sha256: string;
      execution_opening_record_verified: boolean;
      safe_ref_chain_verified: boolean;
      noop_execution_probe_result: string;
      downstream_use_enabled: boolean;
      downstream_consumption_enabled: false;
      actual_downstream_consumption_allowed: false;
      actual_downstream_consumption_executed: false;
      replay_store_write_enabled: false;
      real_replay_store_written: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      secret_value_included?: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      noop_execution_probe_record_sha256: string;
      next_required_boundary: string;
      [key: string]: unknown;
    };
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled?: false;
    downstream_consumed?: false;
    actual_downstream_consumption_allowed?: false;
    actual_downstream_consumption_executed?: false;
    replay_store_write_enabled?: false;
    real_replay_store_written?: false;
    markdown_body_included?: false;
    write_payload_included?: false;
    raw_root_path_included?: false;
    watcher_enabled?: false;
    cron_enabled?: false;
    dispatch_enabled?: false;
    authority_adapter_binding_enabled?: false;
    vps_nas_mount_enabled?: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionContractResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_contract";
    actual_execution_contract_ready: boolean;
    noop_execution_probe_record_verified: boolean;
    noop_execution_probe_ref?: string;
    noop_execution_probe_record_sha256?: string;
    execution_opening_ref?: string;
    execution_opening_record_sha256?: string;
    idempotency_replay_guard_ref?: string;
    idempotency_replay_guard_record_sha256?: string;
    operator_execution_approval_ref?: string;
    operator_execution_approval_record_sha256?: string;
    replay_store_entry_ref?: string;
    replay_store_metadata_record_sha256?: string;
    execution_design_sha256?: string;
    safe_ref_chain_verified: boolean;
    execution_contract_shape_version: "safe_actual_execution_contract_v1";
    execution_contract_sha256?: string | null;
    allowed_execution_fields: string[];
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionRecordResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_records_readback";
    record_count: number;
    limit?: number;
    skipped_count?: number;
    records?: Array<Record<string, unknown>>;
    latest_record: null | {
      schema_version: number;
      mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_actual_execution_record";
      actual_execution_recorded: boolean;
      actual_execution_record_ready: boolean;
      actual_execution_ref: string;
      noop_execution_probe_ref: string;
      noop_execution_probe_record_sha256: string;
      execution_contract_sha256: string;
      operator_confirmation_ref: string;
      execution_result_status: string;
      execution_contract_verified: boolean;
      noop_execution_probe_record_verified: boolean;
      safe_ref_chain_verified: boolean;
      actual_execution_record_sha256: string;
      downstream_use_enabled: boolean;
      downstream_consumption_enabled: false;
      downstream_consumed: false;
      actual_downstream_consumption_allowed: false;
      actual_downstream_consumption_executed: false;
      replay_store_write_enabled: false;
      real_replay_store_written: false;
      markdown_body_included: false;
      write_payload_included: false;
      raw_root_path_included: false;
      secret_value_included?: false;
      watcher_enabled: false;
      cron_enabled: false;
      dispatch_enabled: false;
      authority_adapter_binding_enabled: false;
      vps_nas_mount_enabled: false;
      next_required_boundary: string;
      [key: string]: unknown;
    };
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled?: false;
    downstream_consumed?: false;
    actual_downstream_consumption_allowed?: false;
    actual_downstream_consumption_executed?: false;
    replay_store_write_enabled?: false;
    real_replay_store_written?: false;
    markdown_body_included?: false;
    write_payload_included?: false;
    raw_root_path_included?: false;
    watcher_enabled?: false;
    cron_enabled?: false;
    dispatch_enabled?: false;
    authority_adapter_binding_enabled?: false;
    vps_nas_mount_enabled?: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPostExecutionRecordReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_post_execution_record_readback";
    post_execution_record_readback_ready: boolean;
    actual_execution_record_verified: boolean;
    actual_execution_ref?: string | null;
    actual_execution_record_sha256?: string | null;
    execution_contract_sha256?: string | null;
    noop_execution_probe_record_sha256?: string | null;
    execution_result_status?: string | null;
    noop_execution_probe_record_verified: boolean;
    execution_contract_verified: boolean;
    safe_ref_chain_verified: boolean;
    downstream_use_enabled: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadContractResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_contract";
    consumption_payload_contract_ready: boolean;
    post_execution_record_readback_verified: boolean;
    actual_execution_record_verified: boolean;
    safe_ref_chain_verified: boolean;
    actual_execution_ref?: string | null;
    actual_execution_record_sha256?: string | null;
    execution_contract_sha256?: string | null;
    noop_execution_probe_record_sha256?: string | null;
    payload_contract_shape_version: "safe_consumption_payload_contract_v1";
    payload_contract_sha256?: string | null;
    allowed_payload_fields: string[];
    payload_materialization_status: "contract_only_no_body_materialized";
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadReadinessResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_readiness";
    consumption_payload_readiness_ready: boolean;
    payload_contract_verified: boolean;
    consumption_payload_contract_ready: boolean;
    post_execution_record_readback_verified?: boolean;
    actual_execution_record_verified?: boolean;
    safe_ref_chain_verified?: boolean;
    actual_execution_ref?: string | null;
    payload_contract_shape_version?: "safe_consumption_payload_contract_v1" | null;
    payload_contract_sha256?: string | null;
    readiness_shape_version: "safe_consumption_payload_readiness_v1";
    payload_readiness_sha256?: string | null;
    payload_materialization_status: "readiness_only_no_body_materialized";
    readiness_decision: "ready_for_bounded_manual_payload_materialization_review";
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationContractResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_contract";
    consumption_payload_materialization_contract_ready: boolean;
    payload_readiness_verified: boolean;
    payload_contract_verified: boolean;
    consumption_payload_readiness_ready?: boolean;
    actual_execution_ref?: string | null;
    payload_contract_sha256?: string | null;
    payload_readiness_sha256?: string | null;
    materialization_contract_shape_version: "safe_consumption_payload_materialization_contract_v1";
    payload_materialization_contract_sha256?: string | null;
    payload_materialization_status: "contract_only_no_body_materialized";
    materialization_contract_decision: "ready_for_bounded_manual_body_materialization_request_contract";
    allowed_materialization_fields: string[];
    body_ref_placeholder: "future_safe_body_ref_required";
    body_sha256_placeholder: "future_body_sha256_required";
    body_bytes_placeholder: 0;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRequestResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_request";
    consumption_payload_materialization_request_ready: boolean;
    payload_materialization_contract_verified: boolean;
    payload_readiness_verified: boolean;
    actual_execution_ref?: string | null;
    payload_materialization_contract_sha256?: string | null;
    payload_readiness_sha256?: string | null;
    materialization_request_shape_version: "safe_consumption_payload_materialization_request_v1";
    payload_materialization_request_sha256?: string | null;
    payload_materialization_request_status: "request_only_no_body_materialized";
    materialization_request_decision: "ready_for_bounded_manual_body_materialization_write_gate";
    requested_materialization_fields: string[];
    body_ref_placeholder: "future_safe_body_ref_required";
    body_sha256_placeholder: "future_body_sha256_required";
    body_bytes_placeholder: 0;
    manual_body_materialization_required: boolean;
    payload_body_materialization_enabled: false;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationWriteGateResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_write_gate";
    consumption_payload_materialization_write_gate_ready: boolean;
    payload_materialization_request_verified: boolean;
    payload_materialization_contract_verified: boolean;
    payload_readiness_verified: boolean;
    actual_execution_ref?: string | null;
    payload_materialization_request_sha256?: string | null;
    payload_materialization_contract_sha256?: string | null;
    payload_readiness_sha256?: string | null;
    materialization_write_gate_shape_version: "safe_consumption_payload_materialization_write_gate_v1";
    payload_materialization_write_gate_sha256?: string | null;
    payload_materialization_write_gate_status: "write_gate_only_no_body_materialized";
    materialization_write_gate_decision: "ready_for_bounded_manual_body_materialization_record";
    allowed_write_gate_fields: string[];
    body_ref_placeholder: "future_safe_body_ref_required";
    body_sha256_placeholder: "future_body_sha256_required";
    body_bytes_placeholder: 0;
    manual_body_materialization_required: boolean;
    payload_body_materialization_write_gate_open: boolean;
    payload_body_materialization_enabled: false;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordReadbackResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_records_readback";
    record_count: number;
    limit: number;
    skipped_count: number;
    records: Array<Record<string, unknown>>;
    latest_record?: null | {
      payload_materialization_recorded?: boolean;
      payload_materialization_record_ready?: boolean;
      payload_materialization_record_ref?: string;
      actual_execution_ref?: string;
      body_ref?: string;
      body_sha256?: string;
      body_bytes?: number;
      payload_materialization_record_sha256?: string;
      materialization_result_status?: string;
      write_gate_verified?: boolean;
      payload_body_materialization_recorded?: boolean;
      payload_body_materialization_enabled?: false;
      actual_downstream_consumption_executed?: false;
      replay_store_write_enabled?: false;
      real_replay_store_written?: false;
      markdown_body_included?: false;
      write_payload_included?: false;
      raw_root_path_included?: false;
      secret_value_included?: false;
      vps_nas_mount_enabled?: false;
      next_required_boundary?: string;
      [key: string]: unknown;
    };
    payload_body_materialization_recorded: boolean;
    payload_body_materialization_enabled: false;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordSummaryResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_record_summary";
    payload_materialization_record_summary_ready: boolean;
    record_count: number;
    skipped_count: number;
    body_bytes_total: number;
    unique_actual_execution_ref_count: number;
    unique_body_ref_count: number;
    latest_payload_materialization_record_ref?: string | null;
    latest_actual_execution_ref?: string | null;
    latest_body_ref?: string | null;
    latest_payload_materialization_record_sha256?: string | null;
    all_records_metadata_only: boolean;
    all_write_gates_verified: boolean;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateResult {
  found: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate";
    payload_materialization_summary_review_gate_ready: boolean;
    source_summary_verified: boolean;
    summary_readiness_verified: boolean;
    aggregate_counts_verified: boolean;
    metadata_only_flags_verified: boolean;
    write_gate_summary_verified: boolean;
    safe_latest_refs_verified: boolean;
    review_gate_decision: string;
    source_record_count: number;
    source_body_bytes_total: number;
    source_unique_actual_execution_ref_count: number;
    source_unique_body_ref_count: number;
    latest_payload_materialization_record_ref?: string | null;
    latest_actual_execution_ref?: string | null;
    latest_body_ref?: string | null;
    latest_payload_materialization_record_sha256?: string | null;
    payload_materialization_summary_review_gate_sha256?: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_use_enabled?: boolean;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    capabilities?: Record<string, boolean>;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecord {
  schema_version: number;
  mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record";
  payload_materialization_summary_review_gate_record_readback_review_recorded: boolean;
  readback_review_record_ready: boolean;
  source_readback_review_verified: boolean;
  summary_review_gate_record_readback_review_record_ref: string;
  summary_review_gate_record_ref: string;
  payload_materialization_summary_review_gate_record_sha256: string;
  summary_review_gate_record_readback_review_record_sha256: string;
  review_outcome: string;
  source_readback_verification_reviewed: boolean;
  checksum_review_passed: boolean;
  safe_ref_review_passed: boolean;
  aggregate_count_review_passed: boolean;
  decision_review_passed: boolean;
  disabled_flag_review_passed: boolean;
  source_record_count: number;
  source_body_bytes_total: number;
  latest_payload_materialization_record_ref: string;
  latest_actual_execution_ref: string;
  latest_body_ref: string;
  recorded_by: string;
  recorded_at: string;
  safe_summary: string;
  evidence_refs: string[];
  records_included: false;
  latest_record_included: false;
  payload_body_materialization_enabled: false;
  downstream_consumption_enabled: false;
  downstream_consumed: false;
  actual_downstream_consumption_allowed: false;
  actual_downstream_consumption_executed: false;
  replay_store_write_enabled: false;
  real_replay_store_written: false;
  markdown_body_included: false;
  write_payload_included: false;
  raw_root_path_included: false;
  secret_value_included?: false;
  watcher_enabled: false;
  cron_enabled: false;
  dispatch_enabled: false;
  authority_adapter_binding_enabled: false;
  vps_nas_mount_enabled: false;
  next_required_boundary: string;
  [key: string]: unknown;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordListResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count: number;
  skipped_count: number;
  latest_record: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecord | null;
  records: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecord[];
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_record_readback_verified";
    payload_materialization_summary_review_gate_record_readback_review_record_readback_verified: boolean;
    source_readback_review_record_verified: boolean;
    record_checksum_verified: boolean;
    source_review_record_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    aggregate_counts_verified: boolean;
    review_outcome_verified: boolean;
    disabled_capability_flags_verified: boolean;
    summary_review_gate_record_readback_review_record_ref: string;
    summary_review_gate_record_ref: string;
    payload_materialization_summary_review_gate_record_sha256: string;
    summary_review_gate_record_readback_review_record_sha256: string;
    review_outcome: string;
    source_readback_verification_reviewed: boolean;
    checksum_review_passed: boolean;
    safe_ref_review_passed: boolean;
    aggregate_count_review_passed: boolean;
    decision_review_passed: boolean;
    disabled_flag_review_passed: boolean;
    source_record_count: number;
    source_body_bytes_total: number;
    latest_payload_materialization_record_ref: string;
    latest_actual_execution_ref: string;
    latest_body_ref: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_verified: boolean;
    source_readback_review_attestation_verified: boolean;
    attestation_checksum_verified: boolean;
    source_review_record_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    manual_attestation_outcome_verified: boolean;
    attestation_actor_verified: boolean;
    disabled_capability_flags_verified: boolean;
    readback_review_attestation_ref: string;
    summary_review_gate_record_readback_review_record_ref: string;
    summary_review_gate_record_readback_review_record_sha256: string;
    payload_materialization_summary_review_gate_record_sha256: string;
    readback_review_attestation_sha256: string;
    manual_attestation_outcome: string;
    readback_verified: boolean;
    source_checksum_attested: boolean;
    safe_ref_chain_attested: boolean;
    aggregate_counts_attested: boolean;
    disabled_capabilities_attested: boolean;
    attested_by: string;
    attested_at: string;
    evidence_ref_count: number;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_verified: boolean;
    source_attestation_readback_review_verified: boolean;
    attestation_readback_review_checksum_verified: boolean;
    source_attestation_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    manual_review_outcome_verified: boolean;
    reviewer_metadata_verified: boolean;
    disabled_capability_flags_verified: boolean;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    readback_review_attestation_sha256: string;
    summary_review_gate_record_readback_review_record_ref: string;
    manual_review_outcome: string;
    attestation_readback_verified: boolean;
    source_checksum_reviewed: boolean;
    safe_ref_chain_reviewed: boolean;
    disabled_capabilities_reviewed: boolean;
    reviewed_by: string;
    reviewed_at: string;
    attestation_readback_review_sha256: string;
    evidence_ref_count: number;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}



export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewsResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count: number;
  records: Array<Record<string, unknown>>;
  latest_record: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_reviewed: boolean;
    source_attestation_readback_review_readback_review_readback_verified: boolean;
    attestation_readback_review_readback_review_readback_review_ref: string;
    attestation_readback_review_readback_review_ref: string;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    attestation_readback_review_readback_review_sha256: string;
    attestation_readback_review_readback_review_readback_sha256: string;
    manual_review_outcome: string;
    attestation_readback_review_readback_review_readback_verified: boolean;
    source_checksum_reviewed: boolean;
    safe_ref_chain_reviewed: boolean;
    disabled_capabilities_reviewed: boolean;
    reviewed_by: string;
    reviewed_at: string;
    attestation_readback_review_readback_review_readback_review_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}



export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_review_readback_verified: boolean;
    source_attestation_readback_review_readback_review_readback_review_verified: boolean;
    attestation_readback_review_readback_review_readback_review_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    manual_review_outcome_verified: boolean;
    disabled_capability_flags_verified: boolean;
    attestation_readback_review_readback_review_readback_review_ref: string;
    attestation_readback_review_readback_review_ref: string;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    attestation_readback_review_readback_review_readback_review_sha256: string;
    attestation_readback_review_readback_review_readback_review_readback_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}



export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult {
  found?: boolean;
  written?: boolean;
  recorded?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_tmp_root_write_smoke_completed";
    tmp_root_write_smoke_ref: string;
    payload_write_preview_contract_verified: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    mac_relay_tmp_root_write_smoke_enabled: boolean;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    tmp_root_readback_sha256: string;
    tmp_root_audit_written: boolean;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_write_skipped: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_replay_idempotency_metadata_recorded";
    replay_idempotency_metadata_ref: string;
    replay_idempotency_metadata_ready: boolean;
    source_tmp_root_write_smoke_verified: boolean;
    source_tmp_root_readback_verified: boolean;
    source_idempotency_key_verified: boolean;
    source_tmp_root_write_smoke_ref: string;
    source_tmp_root_write_smoke_record_sha256: string;
    idempotency_key_sha256: string;
    idempotency_metadata_recorded: boolean;
    idempotency_replayed: boolean;
    idempotency_duplicate_metadata_write_skipped: boolean;
    idempotency_replay_store_written: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    write_readiness_stage: string;
    write_readiness_percent: number;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    tmp_root_audit_written: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    replay_idempotency_metadata_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_metadata_recorded";
    mac_relay_precommit_ref: string;
    mac_relay_precommit_metadata_ready: boolean;
    source_replay_idempotency_metadata_verified: boolean;
    source_idempotency_duplicate_skip_verified: boolean;
    source_replay_idempotency_metadata_ref: string;
    source_replay_idempotency_metadata_sha256: string;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_precommit_write_skipped: boolean;
    idempotency_replay_store_written: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    write_readiness_stage: string;
    write_readiness_percent: number;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    tmp_root_audit_written: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_precommit_metadata_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_precommit_manifest_recorded";
    mac_relay_precommit_manifest_ref: string;
    mac_relay_precommit_manifest_ready: boolean;
    source_mac_relay_precommit_metadata_verified: boolean;
    source_mac_relay_precommit_ref: string;
    source_mac_relay_precommit_metadata_sha256: string;
    source_replay_idempotency_metadata_ref: string;
    source_replay_idempotency_metadata_sha256: string;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_manifest_write_skipped: boolean;
    safe_manifest_checklist_verified: boolean;
    safe_ref_chain_verified: boolean;
    manifest_ref_chain_includes_precommit_metadata: boolean;
    manifest_ref_chain_includes_replay_metadata: boolean;
    manifest_ref_chain_includes_tmp_root_smoke: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    write_readiness_stage: string;
    write_readiness_percent: number;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    manifest_includes_payload_body: false;
    manifest_includes_write_payload: false;
    manifest_includes_raw_root_path: false;
    manifest_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_precommit_manifest_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_final_preflight_recorded";
    mac_relay_final_preflight_ref: string;
    mac_relay_final_preflight_ready: boolean;
    source_mac_relay_precommit_manifest_verified: boolean;
    source_safe_manifest_checklist_verified: boolean;
    source_mac_relay_precommit_manifest_ref: string;
    source_mac_relay_precommit_manifest_sha256: string;
    source_mac_relay_precommit_ref: string;
    source_mac_relay_precommit_metadata_sha256: string;
    source_replay_idempotency_metadata_ref: string;
    source_replay_idempotency_metadata_sha256: string;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_final_preflight_write_skipped: boolean;
    final_preflight_checklist_verified: boolean;
    safe_ref_chain_verified: boolean;
    final_preflight_ref_chain_includes_precommit_manifest: boolean;
    final_preflight_ref_chain_includes_precommit_metadata: boolean;
    final_preflight_ref_chain_includes_replay_metadata: boolean;
    final_preflight_ref_chain_includes_tmp_root_smoke: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    next_write_boundary_requires_explicit_real_nas_production_approval: boolean;
    metadata_only_record_write_executed: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    final_preflight_includes_payload_body: false;
    final_preflight_includes_write_payload: false;
    final_preflight_includes_raw_root_path: false;
    final_preflight_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_final_preflight_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_write_gate_recorded";
    mac_relay_real_write_gate_ref: string;
    mac_relay_real_write_gate_ready: boolean;
    source_mac_relay_final_preflight_verified: boolean;
    source_final_preflight_checklist_verified: boolean;
    source_mac_relay_final_preflight_ref: string;
    source_mac_relay_final_preflight_sha256: string;
    source_mac_relay_precommit_manifest_ref: string;
    source_mac_relay_precommit_manifest_sha256: string;
    source_mac_relay_precommit_ref: string;
    source_mac_relay_precommit_metadata_sha256: string;
    source_replay_idempotency_metadata_ref: string;
    source_replay_idempotency_metadata_sha256: string;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_real_write_gate_write_skipped: boolean;
    real_write_gate_checklist_verified: boolean;
    safe_ref_chain_verified: boolean;
    real_write_gate_ref_chain_includes_final_preflight: boolean;
    real_write_gate_ref_chain_includes_precommit_manifest: boolean;
    real_write_gate_ref_chain_includes_precommit_metadata: boolean;
    real_write_gate_ref_chain_includes_replay_metadata: boolean;
    real_write_gate_ref_chain_includes_tmp_root_smoke: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    explicit_real_nas_production_approval_present: false;
    real_write_gate_blocks_without_explicit_approval: true;
    next_write_boundary_requires_explicit_real_nas_production_approval: boolean;
    metadata_only_record_write_executed: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    payload_body_materialized: true;
    payload_body_materialization_scope: string;
    real_write_gate_includes_payload_body: false;
    real_write_gate_includes_write_payload: false;
    real_write_gate_includes_raw_root_path: false;
    real_write_gate_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    real_nas_production_write_executed: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_real_write_gate_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_approval_token_recorded";
    mac_relay_approval_token_ref: string;
    mac_relay_approval_token_ready: boolean;
    approval_token_is_secret: false;
    approval_token_is_non_secret_safe_ref: true;
    approval_token_materialized_value_included: false;
    source_mac_relay_real_write_gate_verified: boolean;
    source_real_write_gate_checklist_verified: boolean;
    source_mac_relay_real_write_gate_ref: string;
    source_mac_relay_real_write_gate_sha256: string;
    idempotency_key_sha256: string;
    idempotency_replayed: boolean;
    idempotency_duplicate_approval_token_write_skipped: boolean;
    approval_token_contract_verified: boolean;
    safe_ref_chain_verified: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    explicit_real_nas_production_approval_present: false;
    approval_token_blocks_without_explicit_production_approval: true;
    next_write_boundary_requires_explicit_real_nas_production_approval: boolean;
    metadata_only_record_write_executed: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    mac_relay_tmp_root_write_smoke_executed: boolean;
    tmp_root_filesystem_write_executed: boolean;
    tmp_root_readback_verified: boolean;
    approval_token_includes_payload_body: false;
    approval_token_includes_write_payload: false;
    approval_token_includes_raw_root_path: false;
    approval_token_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    actual_downstream_consumption_executed: false;
    real_nas_production_write_enabled: false;
    real_nas_production_write_executed: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    raw_root_path_included: false;
    secret_value_included: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_approval_token_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_production_write_approval_recorded";
    mac_relay_production_write_approval_ref: string;
    mac_relay_production_write_approval_ready: boolean;
    source_mac_relay_approval_token_verified: boolean;
    source_approval_token_contract_verified: boolean;
    production_write_approval_boundary_verified: boolean;
    safe_ref_chain_verified: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    explicit_real_nas_production_approval_present: true;
    production_write_approval_is_metadata_only: true;
    production_write_approval_does_not_execute_write: true;
    next_boundary_is_real_nas_write_execution: true;
    metadata_only_record_write_executed: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    real_nas_production_write_enabled: false;
    real_nas_production_write_executed: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    production_write_approval_includes_payload_body: false;
    production_write_approval_includes_write_payload: false;
    production_write_approval_includes_raw_root_path: false;
    production_write_approval_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_production_write_approval_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_mac_relay_real_nas_write_dry_run_seal_recorded";
    mac_relay_real_nas_write_dry_run_seal_ref: string;
    mac_relay_real_nas_write_dry_run_seal_ready: boolean;
    source_mac_relay_production_write_approval_verified: boolean;
    source_production_write_approval_boundary_verified: boolean;
    target_filename_contract_verified: boolean;
    post_write_verification_contract_verified: boolean;
    safe_ref_chain_verified: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    dry_run_seal_is_metadata_only: true;
    dry_run_seal_does_not_execute_write: true;
    final_safe_refs_verified_for_next_rung: true;
    real_nas_write_target_filename_contract_ready: true;
    post_write_readback_contract_ready: true;
    metadata_only_record_write_executed: boolean;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    real_nas_production_write_enabled: false;
    real_nas_production_write_executed: false;
    vps_nas_mount_enabled: false;
    vps_direct_nas_authority_enabled: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    public_exposure_enabled: false;
    gateway_restart_required: false;
    dry_run_seal_includes_payload_body: false;
    dry_run_seal_includes_write_payload: false;
    dry_run_seal_includes_raw_root_path: false;
    dry_run_seal_includes_secret_value: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included: false;
    recorded_by: string;
    recorded_at: string;
    next_required_boundary: string;
    mac_relay_real_nas_write_dry_run_seal_sha256: string;
    [key: string]: unknown;
  };
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult["dto"]>>;
  record_count?: number;
  skipped_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: {
    schema_version?: number;
    mode?: string;
    mac_relay_real_nas_write_execution_envelope_ref?: string;
    mac_relay_real_nas_write_execution_envelope_ready?: boolean;
    source_mac_relay_real_nas_write_dry_run_seal_verified?: boolean;
    source_dry_run_seal_contract_verified?: boolean;
    target_filename_contract_verified?: boolean;
    post_write_verification_contract_verified?: boolean;
    safe_ref_chain_verified?: boolean;
    execution_intent_recorded?: boolean;
    execution_envelope_is_metadata_only?: boolean;
    execution_envelope_does_not_execute_write?: boolean;
    real_nas_write_execution_envelope_ready?: boolean;
    real_nas_write_execution_envelope_includes_final_safe_refs?: boolean;
    real_nas_write_execution_envelope_includes_post_write_verification_plan?: boolean;
    write_readiness_stage?: string;
    write_readiness_percent?: number;
    idempotency_duplicate_execution_envelope_skipped?: boolean;
    mac_relay_real_nas_write_execution_envelope_sha256?: string;
    metadata_only_record_write_executed?: boolean;
    replay_store_write_enabled?: boolean;
    real_replay_store_written?: boolean;
    real_nas_production_write_enabled?: boolean;
    real_nas_production_write_executed?: boolean;
    vps_nas_mount_enabled?: boolean;
    vps_direct_nas_authority_enabled?: boolean;
    watcher_enabled?: boolean;
    cron_enabled?: boolean;
    dispatch_enabled?: boolean;
    authority_adapter_binding_enabled?: boolean;
    public_exposure_enabled?: boolean;
    gateway_restart_required?: boolean;
    execution_envelope_includes_payload_body?: boolean;
    execution_envelope_includes_write_payload?: boolean;
    execution_envelope_includes_raw_root_path?: boolean;
    execution_envelope_includes_secret_value?: boolean;
    [key: string]: unknown;
  } | null;
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult["dto"]>>;
  record_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto?: {
    schema_version?: number;
    mode?: string;
    mac_relay_real_nas_write_execution_record_ref?: string;
    mac_relay_real_nas_write_execution_record_ready?: boolean;
    source_mac_relay_real_nas_write_execution_envelope_verified?: boolean;
    source_execution_envelope_contract_verified?: boolean;
    pre_execution_proof_recorded?: boolean;
    execution_record_is_metadata_only?: boolean;
    execution_record_does_not_execute_write?: boolean;
    execution_record_does_not_materialize_payload?: boolean;
    target_filename_contract_verified?: boolean;
    post_write_verification_contract_verified?: boolean;
    safe_ref_chain_verified?: boolean;
    real_nas_write_execution_record_ready?: boolean;
    real_nas_write_execution_record_includes_pre_execution_proof?: boolean;
    real_nas_write_execution_record_includes_post_write_verification_plan?: boolean;
    write_readiness_stage?: string;
    write_readiness_percent?: number;
    idempotency_duplicate_execution_record_skipped?: boolean;
    mac_relay_real_nas_write_execution_record_sha256?: string;
    metadata_only_record_write_executed?: boolean;
    replay_store_write_enabled?: boolean;
    real_replay_store_written?: boolean;
    real_nas_production_write_enabled?: boolean;
    real_nas_production_write_executed?: boolean;
    vps_nas_mount_enabled?: boolean;
    vps_direct_nas_authority_enabled?: boolean;
    watcher_enabled?: boolean;
    cron_enabled?: boolean;
    dispatch_enabled?: boolean;
    authority_adapter_binding_enabled?: boolean;
    public_exposure_enabled?: boolean;
    gateway_restart_required?: boolean;
    execution_record_includes_payload_body?: boolean;
    execution_record_includes_write_payload?: boolean;
    execution_record_includes_raw_root_path?: boolean;
    execution_record_includes_secret_value?: boolean;
    [key: string]: unknown;
  } | null;
  latest_record?: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult["dto"];
  records?: Array<NonNullable<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult["dto"]>>;
  record_count?: number;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGateResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundaryResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApprovalResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflightResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacketResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorExecutionResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorReceiptResult {
  found?: boolean;
  stored?: boolean;
  idempotency_replayed?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count?: number;
  skipped_count?: number;
  records?: Record<string, unknown>[];
  latest_record?: Record<string, unknown> | null;
  dto?: Record<string, unknown> | null;
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContractResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_write_preview_contract";
    payload_write_preview_contract_ready: boolean;
    write_readiness_stage: string;
    write_readiness_percent: number;
    source_readback_verified: boolean;
    safe_ref_chain_verified: boolean;
    source_attestation_readback_review_readback_review_readback_review_ref: string;
    source_attestation_readback_review_readback_review_readback_review_readback_sha256: string;
    payload_preview_ref: string;
    write_payload_preview_ref: string;
    payload_preview_sha256: string;
    write_payload_preview_sha256: string;
    payload_preview_contract_type: string;
    write_payload_preview_contract_type: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    payload_body_materialized: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    write_payload_materialized: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    mac_relay_tmp_root_write_smoke_enabled: false;
    real_nas_production_write_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    payload_write_preview_contract_sha256: string;
    [key: string]: unknown;
  };
}

export type OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewPostResult = {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewsResult["latest_record"];
};


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review_readback_verified: boolean;
    source_attestation_readback_review_readback_review_verified: boolean;
    attestation_readback_review_readback_review_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    manual_review_outcome_verified: boolean;
    disabled_capability_flags_verified: boolean;
    attestation_readback_review_readback_review_ref: string;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    attestation_readback_review_sha256: string;
    attestation_readback_review_readback_review_sha256: string;
    attestation_readback_review_readback_review_readback_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewsResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count: number;
  records: Array<Record<string, unknown>>;
  latest_record: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_review";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review_readback_reviewed: boolean;
    source_attestation_readback_review_readback_verified: boolean;
    attestation_readback_review_readback_review_ref: string;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    attestation_readback_review_sha256: string;
    manual_review_outcome: string;
    attestation_readback_review_readback_verified: boolean;
    source_checksum_reviewed: boolean;
    safe_ref_chain_reviewed: boolean;
    disabled_capabilities_reviewed: boolean;
    reviewed_by: string;
    reviewed_at: string;
    attestation_readback_review_readback_review_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export type OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewPostResult = {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewsResult["latest_record"];
};


export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewsResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  record_count: number;
  records: Array<Record<string, unknown>>;
  latest_record: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review_attestation_readback_review";
    payload_materialization_summary_review_gate_record_readback_review_attestation_readback_reviewed: boolean;
    source_attestation_readback_verified: boolean;
    readback_review_attestation_readback_review_ref: string;
    readback_review_attestation_ref: string;
    readback_review_attestation_sha256: string;
    summary_review_gate_record_readback_review_record_ref: string;
    manual_review_outcome: string;
    attestation_readback_verified: boolean;
    source_checksum_reviewed: boolean;
    safe_ref_chain_reviewed: boolean;
    disabled_capabilities_reviewed: boolean;
    reviewed_by: string;
    reviewed_at: string;
    attestation_readback_review_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export type OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewPostResult = {
  stored: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewsResult["latest_record"];
};

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_review";
    payload_materialization_summary_review_gate_record_readback_review_ready: boolean;
    source_readback_verification_reviewed: boolean;
    checksum_review_passed: boolean;
    safe_ref_review_passed: boolean;
    aggregate_count_review_passed: boolean;
    decision_review_passed: boolean;
    disabled_flag_review_passed: boolean;
    review_outcome: string;
    summary_review_gate_record_ref: string;
    payload_materialization_summary_review_gate_sha256: string;
    payload_materialization_summary_review_gate_record_sha256: string;
    review_gate_decision: string;
    source_record_count: number;
    source_body_bytes_total: number;
    latest_payload_materialization_record_ref: string;
    latest_actual_execution_ref: string;
    latest_body_ref: string;
    latest_payload_materialization_record_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackResult {
  found?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record_readback_verified";
    payload_materialization_summary_review_gate_record_readback_verified: boolean;
    source_record_readback_verified: boolean;
    record_checksum_verified: boolean;
    source_review_gate_checksum_verified: boolean;
    safe_ref_chain_verified: boolean;
    aggregate_counts_verified: boolean;
    review_gate_decision_verified: boolean;
    disabled_capability_flags_verified: boolean;
    summary_review_gate_record_ref: string;
    payload_materialization_summary_review_gate_sha256: string;
    payload_materialization_summary_review_gate_record_sha256: string;
    review_gate_decision: string;
    source_record_count: number;
    source_body_bytes_total: number;
    latest_payload_materialization_record_ref: string;
    latest_actual_execution_ref: string;
    latest_body_ref: string;
    latest_payload_materialization_record_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}

export interface OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordResult {
  found?: boolean;
  stored?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_fresh_request_builder_ledger_downstream_consumption_payload_materialization_summary_review_gate_record";
    payload_materialization_summary_review_gate_recorded: boolean;
    payload_materialization_summary_review_gate_record_ready: boolean;
    source_review_gate_verified: boolean;
    safe_ref_chain_verified: boolean;
    summary_review_gate_record_ref: string;
    payload_materialization_summary_review_gate_sha256: string;
    payload_materialization_summary_review_gate_record_sha256: string;
    review_gate_decision: string;
    source_record_count: number;
    source_body_bytes_total: number;
    latest_payload_materialization_record_ref: string;
    latest_actual_execution_ref: string;
    latest_body_ref: string;
    latest_payload_materialization_record_sha256: string;
    records_included: false;
    latest_record_included: false;
    payload_body_materialization_enabled: false;
    downstream_consumption_enabled: false;
    downstream_consumed: false;
    actual_downstream_consumption_allowed: false;
    actual_downstream_consumption_executed: false;
    replay_store_write_enabled: false;
    real_replay_store_written: false;
    markdown_body_included: false;
    write_payload_included: false;
    raw_root_path_included: false;
    secret_value_included?: false;
    watcher_enabled: false;
    cron_enabled: false;
    dispatch_enabled: false;
    authority_adapter_binding_enabled: false;
    vps_nas_mount_enabled: false;
    next_required_boundary: string;
    [key: string]: unknown;
  };
}


export interface OfficeNasKeeperExecutionFromPreviewPayload {
  handoff_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  relay_authorized_by: string;
  relay_authorized_at: string;
  record_execution_state_after_write?: true;
  execution_record_ref?: string;
  recorded_by?: string;
  recorded_at?: string;
}

export interface OfficeNasKeeperExecutionFromPreviewResult {
  executed: boolean;
  written: boolean;
  recorded?: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | (OfficeNasMacRelayWriteResult["dto"] & {
    mode: "nas_keeper_mac_relay_execution_from_preview_completed";
    handoff_ref: string;
    queue_ref: string;
    queue_status: string;
    authorization_ref: string;
    previewed_payload_verified: true;
    markdown_body_ref: string;
    markdown_body_bytes: number;
    markdown_body_sha256: string;
    markdown_body_included: false;
    execution_bridge_path: string[];
    execution_state_recorded?: boolean;
    execution_state?: OfficeNasKeeperExecutionStateResult["dto"];
  });
}

export interface OfficeNasKeeperExecutionStatePayload {
  handoff_ref: string;
  execution_record_ref: string;
  relay_execution_ref: string;
  nas_keeper_ref: string;
  relay_node_ref: string;
  recorded_by: string;
  recorded_at: string;
  execution_status: "succeeded" | "failed" | "failed_guarded" | "manual_review_required";
  safe_summary: string;
  evidence_refs: string[];
}

export interface OfficeNasKeeperExecutionStateResult {
  recorded: boolean;
  errors: Array<{ field: string; code: string }>;
  dto: null | {
    schema_version: number;
    mode: "nas_keeper_mac_relay_execution_state_recorded";
    recorded: true;
    handoff_ref: string;
    execution_record_ref: string;
    relay_execution_ref: string;
    queue_ref: string;
    queue_status_before: string;
    queue_status_after: string;
    execution_status: string;
    execution_safe_summary: string;
    execution_evidence_refs: string[];
    markdown_body_included: false;
    capabilities: Record<string, boolean>;
    next_required_boundary: string;
  };
}

export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  // Inject the session token into all /api/ requests.
  const headers = new Headers(init?.headers);
  const token = window.__HERMES_SESSION_TOKEN__;
  if (token) {
    setSessionHeader(headers, token);
  }
  let res: Response;
  try {
    res = await fetch(`${BASE}${url}`, { ...init, headers });
  } catch {
    throw new Error("Network request failed");
  }
  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`${res.status}: ${safeErrorDetail(text, res.statusText)}`);
  }
  return res.json();
}

async function getSessionToken(): Promise<string> {
  if (_sessionToken) return _sessionToken;
  const injected = window.__HERMES_SESSION_TOKEN__;
  if (injected) {
    _sessionToken = injected;
    return _sessionToken;
  }
  throw new Error("Session token not available — page must be served by the Hermes dashboard server");
}

export const api = {
  getStatus: () => fetchJSON<StatusResponse>("/api/status"),
  getOfficeState: () => fetchJSON<OfficeState>("/api/office/state"),
  getOfficeEvents: () => fetchJSON<OfficeSafeEventsResponse>("/api/office/events"),
  getOfficeControlledMutationNasKeeperHandoffQueue: (params: OfficeNasKeeperHandoffQueueReadbackParams = {}) => {
    const qs = new URLSearchParams();
    if (params.handoff_ref) qs.set("handoff_ref", params.handoff_ref);
    if (params.queue_status) qs.set("queue_status", params.queue_status);
    if (params.relay_node_ref) qs.set("relay_node_ref", params.relay_node_ref);
    if (params.nas_keeper_ref) qs.set("nas_keeper_ref", params.nas_keeper_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeNasKeeperHandoffQueueReadback>(`/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-queue${suffix}`);
  },

  dryRunOfficeControlledMutationNasKeeperHandoffClaim: (body: OfficeNasKeeperHandoffClaimDryRunPayload) =>
    fetchJSON<OfficeNasKeeperHandoffClaimDryRunResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-claim-dry-run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  authorizeOfficeControlledMutationNasKeeperHandoff: (body: OfficeNasKeeperHandoffAuthorizationPayload) =>
    fetchJSON<OfficeNasKeeperHandoffAuthorizationResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-handoff-authorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationAuthorityMetadataHandoff: (params: OfficeAuthorityMetadataHandoffParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeAuthorityMetadataHandoffStatus>(`/api/office/controlled-mutation/authority-metadata-handoff${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityDryRun: (params: OfficeDispatcherAuthorityDryRunParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.authority_ref) qs.set("authority_ref", params.authority_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityDryRunSurface>(`/api/office/controlled-mutation/dispatcher-authority-dry-run${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityMetadataRecordingDraft: (params: OfficeDispatcherAuthorityMetadataRecordingDraftParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.authority_ref) qs.set("authority_ref", params.authority_ref);
    if (params.result_id) qs.set("result_id", params.result_id);
    if (params.audit_id) qs.set("audit_id", params.audit_id);
    if (params.recorded_at) qs.set("recorded_at", params.recorded_at);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityMetadataRecordingDraft>(`/api/office/controlled-mutation/dispatcher-authority-metadata-recording-draft${suffix}`);
  },
  getOfficeControlledMutationDispatcherAuthorityMetadataAppendStatus: (params: OfficeDispatcherAuthorityMetadataAppendStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.request_id) qs.set("request_id", params.request_id);
    if (params.correlation_id) qs.set("correlation_id", params.correlation_id);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherAuthorityMetadataAppendStatus>(`/api/office/controlled-mutation/dispatcher-authority-metadata-append-status${suffix}`);
  },
  getOfficeControlledMutationDispatcherExecutionSimulationStatus: (params: OfficeDispatcherExecutionSimulationStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherExecutionSimulationStatus>(`/api/office/controlled-mutation/dispatcher-execution-simulation-status${suffix}`);
  },
  getOfficeControlledMutationDispatcherCompletionReviewStatus: (params: OfficeDispatcherCompletionReviewStatusParams = {}) => {
    const qs = new URLSearchParams();
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeDispatcherCompletionReviewStatus>(`/api/office/controlled-mutation/dispatcher-completion-review-status${suffix}`);
  },
  getOfficeControlledMutationTargetDispatchContractStatus: () =>
    fetchJSON<OfficeTargetDispatchContractStatus>("/api/office/controlled-mutation/target-dispatch-contract-status"),
  getOfficeControlledMutationWatcherCronContractStatus: () =>
    fetchJSON<OfficeWatcherCronContractStatus>("/api/office/controlled-mutation/watcher-cron-contract-status"),
  getOfficeControlledMutationRuntimeActivationReviewStatus: () =>
    fetchJSON<OfficeRuntimeActivationReviewStatus>("/api/office/controlled-mutation/runtime-activation-review-status"),
  getOfficeControlledMutationRuntimePreflightStatus: () =>
    fetchJSON<OfficeRuntimePreflightStatus>("/api/office/controlled-mutation/runtime-preflight-status"),
  getOfficeControlledMutationManualOneShotRuntimeDryRunStatus: () =>
    fetchJSON<OfficeManualOneShotRuntimeDryRunStatus>("/api/office/controlled-mutation/manual-one-shot-runtime-dry-run-status"),
  getOfficeControlledMutationAdapterBindingDryRunStatus: () =>
    fetchJSON<OfficeAdapterBindingDryRunStatus>("/api/office/controlled-mutation/adapter-binding-dry-run-status"),
  getOfficeControlledMutationHumanReviewedSingleDispatchStatus: () =>
    fetchJSON<OfficeHumanReviewedSingleDispatchStatus>("/api/office/controlled-mutation/human-reviewed-single-dispatch-status"),
  getOfficeControlledMutationExplicitRuntimeDispatchApprovalStatus: () =>
    fetchJSON<OfficeExplicitRuntimeDispatchApprovalStatus>("/api/office/controlled-mutation/explicit-runtime-dispatch-approval-status"),
  getOfficeControlledMutationConcreteRuntimeSingleDispatchSliceDesign: () =>
    fetchJSON<OfficeConcreteRuntimeSingleDispatchSliceDesign>("/api/office/controlled-mutation/concrete-runtime-single-dispatch-slice-design"),
  getOfficeControlledMutationDisabledOneShotRuntimeDispatchExecutorSkeleton: () =>
    fetchJSON<OfficeDisabledOneShotRuntimeDispatchExecutorSkeleton>("/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton"),
  getOfficeControlledMutationApprovedRealOneShotDispatchGateDesign: () =>
    fetchJSON<OfficeApprovedRealOneShotDispatchGateDesign>("/api/office/controlled-mutation/approved-real-one-shot-dispatch-gate-design"),
  getOfficeControlledMutationManualApprovalRecordingPreflightStatus: () =>
    fetchJSON<OfficeManualApprovalRecordingPreflightStatus>("/api/office/controlled-mutation/manual-approval-recording-preflight"),
  executeOfficeControlledMutationManualApprovalRecordingPreflight: (body: OfficeManualApprovalRecordingPreflightPayload) =>
    fetchJSON<OfficeManualApprovalRecordingPreflightRefusal>("/api/office/controlled-mutation/manual-approval-recording-preflight/preflight", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  appendOfficeControlledMutationManualApprovalRecordingDraft: (body: OfficeManualApprovalRecordingDraftPayload) =>
    fetchJSON<OfficeManualApprovalRecordingDraftAppendResult>("/api/office/controlled-mutation/manual-approval-recording-draft", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualApprovalRecordingDraftStatus: (params: { approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordingDraftStatus>(`/api/office/controlled-mutation/manual-approval-recording-draft-status${suffix}`);
  },
  getOfficeControlledMutationManualApprovalRecordingDraftReviewStatus: (params: { approval_record_ref?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordingDraftReviewStatus>(`/api/office/controlled-mutation/manual-approval-recording-draft-review-status${suffix}`);
  },
  appendOfficeControlledMutationManualApprovalRecord: (body: OfficeManualApprovalRecordPayload) =>
    fetchJSON<OfficeManualApprovalRecordAppendResult>("/api/office/controlled-mutation/manual-approval-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualApprovalRecordStatus: (params: { approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (params.limit !== undefined) qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalRecordStatus>(`/api/office/controlled-mutation/manual-approval-record-status${suffix}`);
  },
  getOfficeControlledMutationManualApprovalDispatchGateReadinessStatus: (params: { approval_record_ref?: string } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualApprovalDispatchGateReadinessStatus>(`/api/office/controlled-mutation/manual-approval-dispatch-gate-readiness-status${suffix}`);
  },
  getOfficeControlledMutationApprovalEventEnvelopeStatus: (params: { approval_event_ref?: string; approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.approval_event_ref) qs.set("approval_event_ref", params.approval_event_ref);
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeApprovalEventEnvelopeStatus>(`/api/office/controlled-mutation/approval-event-envelope-status${suffix}`);
  },
  writeOfficeControlledMutationManualDispatchGateOpenRecord: (body: OfficeManualDispatchGateOpenRecordPayload) =>
    fetchJSON<OfficeManualDispatchGateOpenRecordAppendResult>("/api/office/controlled-mutation/manual-dispatch-gate-open-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualDispatchGateOpenRecordStatus: (params: { dispatch_gate_ref?: string; approval_record_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.dispatch_gate_ref) qs.set("dispatch_gate_ref", params.dispatch_gate_ref);
    if (params.approval_record_ref) qs.set("approval_record_ref", params.approval_record_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualDispatchGateOpenRecordStatus>(`/api/office/controlled-mutation/manual-dispatch-gate-open-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandPreviewRecord: (body: OfficeManualRuntimeCommandPreviewRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandPreviewRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-preview-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandPreviewRecordStatus: (params: { runtime_command_preview_ref?: string; dispatch_gate_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_preview_ref) qs.set("runtime_command_preview_ref", params.runtime_command_preview_ref);
    if (params.dispatch_gate_ref) qs.set("dispatch_gate_ref", params.dispatch_gate_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandPreviewRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-preview-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandInclusionRecord: (body: OfficeManualRuntimeCommandInclusionRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandInclusionRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-inclusion-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandInclusionRecordStatus: (params: { runtime_command_ref?: string; runtime_command_preview_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_ref) qs.set("runtime_command_ref", params.runtime_command_ref);
    if (params.runtime_command_preview_ref) qs.set("runtime_command_preview_ref", params.runtime_command_preview_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandInclusionRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-inclusion-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualRuntimeCommandExecutionRecord: (body: OfficeManualRuntimeCommandExecutionRecordPayload) =>
    fetchJSON<OfficeManualRuntimeCommandExecutionRecordAppendResult>("/api/office/controlled-mutation/manual-runtime-command-execution-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualRuntimeCommandExecutionRecordStatus: (params: { runtime_command_ref?: string; runtime_execution_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_command_ref) qs.set("runtime_command_ref", params.runtime_command_ref);
    if (params.runtime_execution_ref) qs.set("runtime_execution_ref", params.runtime_execution_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualRuntimeCommandExecutionRecordStatus>(`/api/office/controlled-mutation/manual-runtime-command-execution-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualTargetMutationReadinessRecord: (body: OfficeManualTargetMutationReadinessRecordPayload) =>
    fetchJSON<OfficeManualTargetMutationReadinessRecordAppendResult>("/api/office/controlled-mutation/manual-target-mutation-readiness-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualTargetMutationReadinessRecordStatus: (params: { runtime_execution_ref?: string; target_mutation_readiness_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.runtime_execution_ref) qs.set("runtime_execution_ref", params.runtime_execution_ref);
    if (params.target_mutation_readiness_ref) qs.set("target_mutation_readiness_ref", params.target_mutation_readiness_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualTargetMutationReadinessRecordStatus>(`/api/office/controlled-mutation/manual-target-mutation-readiness-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualTargetMutationRecord: (body: OfficeManualTargetMutationRecordPayload) =>
    fetchJSON<OfficeManualTargetMutationRecordAppendResult>("/api/office/controlled-mutation/manual-target-mutation-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualTargetMutationRecordStatus: (params: { target_mutation_readiness_ref?: string; target_mutation_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.target_mutation_readiness_ref) qs.set("target_mutation_readiness_ref", params.target_mutation_readiness_ref);
    if (params.target_mutation_ref) qs.set("target_mutation_ref", params.target_mutation_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualTargetMutationRecordStatus>(`/api/office/controlled-mutation/manual-target-mutation-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualAdapterDispatchRecord: (body: OfficeManualAdapterDispatchRecordPayload) =>
    fetchJSON<OfficeManualAdapterDispatchRecordAppendResult>("/api/office/controlled-mutation/manual-adapter-dispatch-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualAdapterDispatchRecordStatus: (params: { target_mutation_ref?: string; adapter_dispatch_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.target_mutation_ref) qs.set("target_mutation_ref", params.target_mutation_ref);
    if (params.adapter_dispatch_ref) qs.set("adapter_dispatch_ref", params.adapter_dispatch_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualAdapterDispatchRecordStatus>(`/api/office/controlled-mutation/manual-adapter-dispatch-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualKanbanMutationRecord: (body: OfficeManualKanbanMutationRecordPayload) =>
    fetchJSON<OfficeManualKanbanMutationRecordAppendResult>("/api/office/controlled-mutation/manual-kanban-mutation-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualKanbanMutationRecordStatus: (params: { adapter_dispatch_ref?: string; kanban_mutation_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.adapter_dispatch_ref) qs.set("adapter_dispatch_ref", params.adapter_dispatch_ref);
    if (params.kanban_mutation_ref) qs.set("kanban_mutation_ref", params.kanban_mutation_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualKanbanMutationRecordStatus>(`/api/office/controlled-mutation/manual-kanban-mutation-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualNasSaveRecord: (body: OfficeManualNasSaveRecordPayload) =>
    fetchJSON<OfficeManualNasSaveRecordAppendResult>("/api/office/controlled-mutation/manual-nas-save-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualNasSaveRecordStatus: (params: { kanban_mutation_ref?: string; nas_save_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.kanban_mutation_ref) qs.set("kanban_mutation_ref", params.kanban_mutation_ref);
    if (params.nas_save_ref) qs.set("nas_save_ref", params.nas_save_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualNasSaveRecordStatus>(`/api/office/controlled-mutation/manual-nas-save-record-status${suffix}`);
  },
  writeOfficeControlledMutationManualNasKeeperHandoffRecord: (body: OfficeManualNasKeeperHandoffRecordPayload) =>
    fetchJSON<OfficeManualNasKeeperHandoffRecordAppendResult>("/api/office/controlled-mutation/manual-nas-keeper-handoff-record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationManualNasKeeperHandoffRecordStatus: (params: { nas_save_ref?: string; handoff_ref?: string; limit?: number } = {}) => {
    const qs = new URLSearchParams();
    if (params.nas_save_ref) qs.set("nas_save_ref", params.nas_save_ref);
    if (params.handoff_ref) qs.set("handoff_ref", params.handoff_ref);
    if (typeof params.limit === "number") qs.set("limit", String(params.limit));
    const suffix = qs.toString() ? `?${qs.toString()}` : "";
    return fetchJSON<OfficeManualNasKeeperHandoffRecordStatus>(`/api/office/controlled-mutation/manual-nas-keeper-handoff-record-status${suffix}`);
  },
  executeOfficeControlledMutationDisabledOneShotRuntimeDispatch: (body: OfficeDisabledOneShotRuntimeDispatchPayload) =>
    fetchJSON<OfficeDisabledOneShotRuntimeDispatchRefusal>("/api/office/controlled-mutation/disabled-one-shot-runtime-dispatch-executor-skeleton/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasSingleFileWrite: (body: OfficeNasSingleFileWritePayload) =>
    fetchJSON<OfficeNasSingleFileWriteResult>("/api/office/controlled-mutation/nas-runtime/single-file-write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasMacRelayWrite: (body: OfficeNasMacRelayWritePayload) =>
    fetchJSON<OfficeNasMacRelayWriteResult>("/api/office/controlled-mutation/nas-runtime/mac-relay-write-execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  previewOfficeControlledMutationNasKeeperExecutionPayload: (body: OfficeNasKeeperExecutionPayloadPreviewPayload) =>
    fetchJSON<OfficeNasKeeperExecutionPayloadPreviewResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-payload-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  probeOfficeControlledMutationMacRelayRootReadiness: () =>
    fetchJSON<OfficeMacRelayRootReadinessProbeResult>("/api/office/controlled-mutation/nas-runtime/mac-relay-root-readiness-probe"),
  getOfficeControlledMutationNasKeeperLastSuccessfulMacRelayWrite: () =>
    fetchJSON<OfficeNasKeeperLastSuccessfulMacRelayWriteResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-last-successful-mac-relay-write"),
  buildOfficeControlledMutationNasKeeperFreshOneShotRequest: (body: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshOneShotRequestBuilderResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-request-builder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedger: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger?export_safe=true&limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerExportSelectionReview: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerExportSelectionReviewResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-export-selection-review?profile=latest_written&limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamUsePreflight: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamUsePreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-preflight?profile=latest_written&limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerManualReviewRecord: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerManualReviewRecordReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-manual-review-record?limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamUseEnablement: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamUseEnablementReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-use-enablements?limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflight: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-preflight?profile=latest_written&limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablement: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionEnablementReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-enablements?limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesign: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOneShotBoundaryDesignResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-boundary-design"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApproval: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApprovalReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-exact-approvals?limit=20"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflight: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-preflight"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGate: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionGateReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-gates"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbe: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopReplayProbeReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-replay-probes"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreWriteContract: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreWriteContractResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-write-contract"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadata: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayStoreMetadataReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-replay-store-metadata-records"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionDisabledReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionDisabledReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-disabled-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionExecutionDesign: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualConsumptionExecutionDesignResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-consumption-execution-design"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOperatorExecutionApproval: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionOperatorExecutionApprovalResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-operator-execution-approvals"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionIdempotencyReplayGuard: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionIdempotencyReplayGuardResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-idempotency-replay-guards"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionOpening: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExecutionOpeningResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-execution-openings"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopExecutionProbe: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionNoopExecutionProbeResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-noop-execution-probes"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionContract: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionContractResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-execution-contract"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionRecord: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionActualExecutionRecordResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-actual-execution-records"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPostExecutionRecordReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPostExecutionRecordReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-post-execution-record-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadContract: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadContractResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-contract"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadReadiness: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadReadinessResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-readiness"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationContract: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationContractResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-contract"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRequest: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRequestResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-request"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationWriteGate: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationWriteGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-write-gate"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecords: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-records"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordSummary: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationRecordSummaryResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-record-summary"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGate: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecords: () =>
    fetchJSON<Record<string, unknown>>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-records"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReview: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-record-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviews: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewsResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-reviews"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviews: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewsResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-reviews"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviews: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewsResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-reviews"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewReadback: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewReadbackResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-review-readback"),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmoke: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmoke: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayTmpRootWriteSmokeResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-tmp-root-write-smoke", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadata: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadata: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionReplayIdempotencyMetadataResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-replay-idempotency-metadata", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadata: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadata: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitMetadataResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-metadata", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifest: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifest: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayPrecommitManifestResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-precommit-manifest", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflight: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflight: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayFinalPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-final-preflight", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGate: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGate: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealWriteGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-write-gate", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalToken: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalToken: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayApprovalTokenResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-approval-token", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApproval: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApproval: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayProductionWriteApprovalResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-production-write-approval", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSeal: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSeal: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteDryRunSealResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-dry-run-seal", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelope: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelope: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionEnvelopeResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-envelope", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecord: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecord: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteExecutionRecordResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-execution-record", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGate: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGate: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionMacRelayRealNasWriteFinalExecutionGateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-mac-relay-real-nas-write-final-execution-gate", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundary: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundaryResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundary: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionManualRealNasWriteBoundaryResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-manual-real-nas-write-boundary", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApproval: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApprovalResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApproval: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionSeparateRealNasProductionWriteApprovalResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-separate-real-nas-production-write-approval", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflight: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflight: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPreflightResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-preflight", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacket: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacketResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacket: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteExecutionPacketResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-execution-packet", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorExecution: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorExecutionResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-manual-operator-execution"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorExecution: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorExecutionResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-manual-operator-execution", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorReceipt: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorReceiptResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-manual-operator-receipt"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorReceipt: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionRealNasProductionWriteManualOperatorReceiptResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-real-nas-production-write-manual-operator-receipt", { method: "POST", body: JSON.stringify(payload) }),
  getOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContract: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadWritePreviewContractResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-payload-write-preview-contract"),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReview: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewReadbackReviewPostResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-review-readback-reviews", { method: "POST", body: JSON.stringify(payload) }),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReview: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewReadbackReviewPostResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-review-readback-reviews", { method: "POST", body: JSON.stringify(payload) }),
  postOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReview: (payload: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestationReadbackReviewPostResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestation-readback-reviews", { method: "POST", body: JSON.stringify(payload) }),
  listOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestations: () =>
    fetchJSON<Record<string, unknown>>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestations"),
  appendOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewAttestation: (body: Record<string, unknown>) =>
    fetchJSON<Record<string, unknown>>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-attestations", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  listOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecords: () =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecordListResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-records"),
  appendOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecord: (body: Record<string, unknown>) =>
    fetchJSON<{ stored: boolean; errors: Array<{ field: string; code: string }>; dto: OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordReadbackReviewRecord | null }>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-record-readback-review-records", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  appendOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecord: (body: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionPayloadMaterializationSummaryReviewGateRecordResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-consumption-payload-materialization-summary-review-gate-records", {
      method: "POST",
      body: JSON.stringify(body),
    }),
  appendOfficeControlledMutationNasKeeperFreshRequestBuilderLedgerDownstreamConsumptionExactApproval: (body: Record<string, unknown>) =>
    fetchJSON<Record<string, unknown>>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-request-builder-ledger-downstream-consumption-one-shot-exact-approvals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasKeeperFreshOneShotOperatorWrite: (body: Record<string, unknown>) =>
    fetchJSON<OfficeNasKeeperFreshOneShotOperatorWriteResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-fresh-one-shot-operator-write", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  executeOfficeControlledMutationNasKeeperExecutionFromPreview: (body: OfficeNasKeeperExecutionFromPreviewPayload) =>
    fetchJSON<OfficeNasKeeperExecutionFromPreviewResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-from-preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  recordOfficeControlledMutationNasKeeperExecutionState: (body: OfficeNasKeeperExecutionStatePayload) =>
    fetchJSON<OfficeNasKeeperExecutionStateResult>("/api/office/controlled-mutation/nas-runtime/nas-keeper-execution-state", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  getSessions: (limit = 20, offset = 0) =>
    fetchJSON<PaginatedSessions>(`/api/sessions?limit=${limit}&offset=${offset}`),
  getSessionMessages: (id: string) =>
    fetchJSON<SessionMessagesResponse>(`/api/sessions/${encodeURIComponent(id)}/messages`),
  getSessionLatestDescendant: (id: string) =>
    fetchJSON<SessionLatestDescendantResponse>(
      `/api/sessions/${encodeURIComponent(id)}/latest-descendant`,
    ),
  deleteSession: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/sessions/${encodeURIComponent(id)}`, {
      method: "DELETE",
    }),
  getLogs: (params: { file?: string; lines?: number; level?: string; component?: string }) => {
    const qs = new URLSearchParams();
    if (params.file) qs.set("file", params.file);
    if (params.lines) qs.set("lines", String(params.lines));
    if (params.level && params.level !== "ALL") qs.set("level", params.level);
    if (params.component && params.component !== "all") qs.set("component", params.component);
    return fetchJSON<LogsResponse>(`/api/logs?${qs.toString()}`);
  },
  getAnalytics: (days: number) =>
    fetchJSON<AnalyticsResponse>(`/api/analytics/usage?days=${days}`),
  getModelsAnalytics: (days: number) =>
    fetchJSON<ModelsAnalyticsResponse>(`/api/analytics/models?days=${days}`),
  getConfig: () => fetchJSON<Record<string, unknown>>("/api/config"),
  getDefaults: () => fetchJSON<Record<string, unknown>>("/api/config/defaults"),
  getSchema: () => fetchJSON<{ fields: Record<string, unknown>; category_order: string[] }>("/api/config/schema"),
  getModelInfo: () => fetchJSON<ModelInfoResponse>("/api/model/info"),
  getModelOptions: () => fetchJSON<ModelOptionsResponse>("/api/model/options"),
  getAuxiliaryModels: () => fetchJSON<AuxiliaryModelsResponse>("/api/model/auxiliary"),
  setModelAssignment: (body: ModelAssignmentRequest) =>
    fetchJSON<ModelAssignmentResponse>("/api/model/set", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  saveConfig: (config: Record<string, unknown>) =>
    fetchJSON<{ ok: boolean }>("/api/config", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ config }),
    }),
  getConfigRaw: () => fetchJSON<{ yaml: string }>("/api/config/raw"),
  saveConfigRaw: (yaml_text: string) =>
    fetchJSON<{ ok: boolean }>("/api/config/raw", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ yaml_text }),
    }),
  getEnvVars: () => fetchJSON<Record<string, EnvVarInfo>>("/api/env"),
  setEnvVar: (key: string, value: string) =>
    fetchJSON<{ ok: boolean }>("/api/env", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    }),
  deleteEnvVar: (key: string) =>
    fetchJSON<{ ok: boolean }>("/api/env", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key }),
    }),
  revealEnvVar: async (key: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ key: string; value: string }>("/api/env/reveal", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        [SESSION_HEADER]: token,
      },
      body: JSON.stringify({ key }),
    });
  },

  // Cron jobs
  getCronJobs: () => fetchJSON<CronJob[]>("/api/cron/jobs"),
  createCronJob: (job: { prompt: string; schedule: string; name?: string; deliver?: string }) =>
    fetchJSON<CronJob>("/api/cron/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(job),
    }),
  pauseCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/pause`, { method: "POST" }),
  resumeCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/resume`, { method: "POST" }),
  triggerCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}/trigger`, { method: "POST" }),
  deleteCronJob: (id: string) =>
    fetchJSON<{ ok: boolean }>(`/api/cron/jobs/${id}`, { method: "DELETE" }),

  // Profiles (minimal)
  getProfiles: () =>
    fetchJSON<{ profiles: ProfileInfo[] }>("/api/profiles"),
  createProfile: (body: { name: string; clone_from_default: boolean }) =>
    fetchJSON<{ ok: boolean; name: string; path: string }>("/api/profiles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  renameProfile: (name: string, newName: string) =>
    fetchJSON<{ ok: boolean; name: string; path: string }>(
      `/api/profiles/${encodeURIComponent(name)}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ new_name: newName }),
      },
    ),
  deleteProfile: (name: string) =>
    fetchJSON<{ ok: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}`,
      { method: "DELETE" },
    ),
  getProfileSetupCommand: (name: string) =>
    fetchJSON<{ command: string }>(
      `/api/profiles/${encodeURIComponent(name)}/setup-command`,
    ),
  getProfileSoul: (name: string) =>
    fetchJSON<{ content: string; exists: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}/soul`,
    ),
  updateProfileSoul: (name: string, content: string) =>
    fetchJSON<{ ok: boolean }>(
      `/api/profiles/${encodeURIComponent(name)}/soul`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      },
    ),

  // Skills & Toolsets
  getSkills: () => fetchJSON<SkillInfo[]>("/api/skills"),
  toggleSkill: (name: string, enabled: boolean) =>
    fetchJSON<{ ok: boolean }>("/api/skills/toggle", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, enabled }),
    }),
  getToolsets: () => fetchJSON<ToolsetInfo[]>("/api/tools/toolsets"),

  // Session search (FTS5)
  searchSessions: (q: string) =>
    fetchJSON<SessionSearchResponse>(`/api/sessions/search?q=${encodeURIComponent(q)}`),

  // OAuth provider management
  getOAuthProviders: () =>
    fetchJSON<OAuthProvidersResponse>("/api/providers/oauth"),
  disconnectOAuthProvider: async (providerId: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ ok: boolean; provider: string }>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}`,
      {
        method: "DELETE",
        headers: { [SESSION_HEADER]: token },
      },
    );
  },
  startOAuthLogin: async (providerId: string) => {
    const token = await getSessionToken();
    return fetchJSON<OAuthStartResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/start`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SESSION_HEADER]: token,
        },
        body: "{}",
      },
    );
  },
  submitOAuthCode: async (providerId: string, sessionId: string, code: string) => {
    const token = await getSessionToken();
    return fetchJSON<OAuthSubmitResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          [SESSION_HEADER]: token,
        },
        body: JSON.stringify({ session_id: sessionId, code }),
      },
    );
  },
  pollOAuthSession: (providerId: string, sessionId: string) =>
    fetchJSON<OAuthPollResponse>(
      `/api/providers/oauth/${encodeURIComponent(providerId)}/poll/${encodeURIComponent(sessionId)}`,
    ),
  cancelOAuthSession: async (sessionId: string) => {
    const token = await getSessionToken();
    return fetchJSON<{ ok: boolean }>(
      `/api/providers/oauth/sessions/${encodeURIComponent(sessionId)}`,
      {
        method: "DELETE",
        headers: { [SESSION_HEADER]: token },
      },
    );
  },

  // Gateway / update actions
  restartGateway: () =>
    fetchJSON<ActionResponse>("/api/gateway/restart", { method: "POST" }),
  updateHermes: () =>
    fetchJSON<ActionResponse>("/api/hermes/update", { method: "POST" }),
  getActionStatus: (name: string, lines = 200) =>
    fetchJSON<ActionStatusResponse>(
      `/api/actions/${encodeURIComponent(name)}/status?lines=${lines}`,
    ),

  // Dashboard plugins
  getPlugins: () =>
    fetchJSON<PluginManifestResponse[]>("/api/dashboard/plugins"),
  rescanPlugins: () =>
    fetchJSON<{ ok: boolean; count: number }>("/api/dashboard/plugins/rescan"),

  getPluginsHub: () => fetchJSON<PluginsHubResponse>("/api/dashboard/plugins/hub"),

  installAgentPlugin: (body: AgentPluginInstallRequest) =>
    fetchJSON<AgentPluginInstallResponse>("/api/dashboard/agent-plugins/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...body }),
    }),

  enableAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string; unchanged?: boolean }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/enable`,
      { method: "POST" },
    ),

  disableAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string; unchanged?: boolean }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/disable`,
      { method: "POST" },
    ),

  updateAgentPlugin: (name: string) =>
    fetchJSON<AgentPluginUpdateResponse>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}/update`,
      { method: "POST" },
    ),

  removeAgentPlugin: (name: string) =>
    fetchJSON<{ ok: boolean; name: string }>(
      `/api/dashboard/agent-plugins/${encodeURIComponent(name)}`,
      { method: "DELETE" },
    ),

  savePluginProviders: (body: PluginProvidersPutRequest) =>
    fetchJSON<{ ok: boolean }>("/api/dashboard/plugin-providers", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),

  setPluginVisibility: (name: string, hidden: boolean) =>
    fetchJSON<{ ok: boolean; name: string; hidden: boolean }>(
      `/api/dashboard/plugins/${encodeURIComponent(name)}/visibility`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hidden }),
      },
    ),

  // Dashboard themes
  getThemes: () =>
    fetchJSON<DashboardThemesResponse>("/api/dashboard/themes"),
  setTheme: (name: string) =>
    fetchJSON<{ ok: boolean; theme: string }>("/api/dashboard/theme", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    }),
};

export interface ActionResponse {
  name: string;
  ok: boolean;
  pid: number;
}

export interface ActionStatusResponse {
  exit_code: number | null;
  lines: string[];
  name: string;
  pid: number | null;
  running: boolean;
}

export interface PlatformStatus {
  error_code?: string;
  error_message?: string;
  state: string;
  updated_at: string;
}

export interface StatusResponse {
  active_sessions: number;
  config_path: string;
  config_version: number;
  env_path: string;
  gateway_exit_reason: string | null;
  gateway_health_url: string | null;
  gateway_pid: number | null;
  gateway_platforms: Record<string, PlatformStatus>;
  gateway_running: boolean;
  gateway_state: string | null;
  gateway_updated_at: string | null;
  hermes_home: string;
  latest_config_version: number;
  release_date: string;
  version: string;
}

export type OfficeSourceStatus = "ok" | "partial" | "missing" | "unavailable" | "error";

export interface OfficeDataSource {
  id: string;
  status: OfficeSourceStatus;
  checked_at: string;
  item_count?: number;
  warning_count?: number;
  error_summary?: string | null;
}

export interface OfficeKanbanWorkItem {
  id: string;
  kind: "kanban_task";
  source: "kanban";
  room_id: string;
  board_id: string;
  task_ref: string;
  title: "Kanban task";
  status: string;
  assignee: string | null;
  tenant: string | null;
  priority: number;
  created_at?: number | string | null;
  started_at?: number | string | null;
  completed_at?: number | string | null;
  updated_at?: number | string | null;
  last_heartbeat_at?: number | string | null;
  dependency_counts: { parents: number; children: number };
  parent_task_refs: string[];
  child_task_refs: string[];
  badges: string[];
  provenance?: Record<string, unknown>;
}

export interface OfficeProjectionCacheActive {
  bundle_id: string;
  generated_at: string;
  generated_by: string;
  source_kind: string;
  source_tags: string[];
  freshness: Record<string, string>;
  validator: Record<string, string>;
  redaction: { raw_excluded: boolean; guarantee: string };
  payload_summary: Record<string, number | string | null>;
  display: Record<string, unknown>;
  bundle_path: string;
}

export interface OfficeProjectionCacheRejection {
  bundle_path: string;
  status: "rejected";
  reason_count: number;
  reasons: string[];
  field_paths: string[];
  checked_at: string;
}

export interface OfficeProjectionCache {
  schema_version: number;
  status: "active" | "missing" | "stale" | "rejected" | string;
  redacted: true;
  cache_layout: { incoming: string; active: string; archive: string; rejected: string };
  active: OfficeProjectionCacheActive | null;
  rejected: { count: number; recent: OfficeProjectionCacheRejection[] };
}

export interface OfficeState {
  schema_version: number;
  generated_at: string;
  mode: "read_only";
  display_mode: string;
  capabilities: {
    read_only: boolean;
    mutations_enabled: boolean;
    remote_mode: string;
  };
  data_sources: OfficeDataSource[];
  summary: Record<string, number | null | string>;
  rooms: Array<Record<string, unknown>>;
  agents: Array<Record<string, unknown>>;
  work_items: Array<Record<string, unknown>>;
  automations: Array<Record<string, unknown>>;
  topics: Array<Record<string, unknown>>;
  events: Array<Record<string, unknown>>;
  provenance: Array<Record<string, unknown>>;
  redactions: {
    policy_version: number;
    redacted_field_count: number;
    omitted_sections: string[];
    warnings: string[];
  };
  projection_cache: OfficeProjectionCache;
}

export interface OfficeSafeEventDTO {
  id: string;
  category: "snapshot_static" | "source_health_changed" | "workload_changed" | "attention_changed" | "room_density_changed" | "flow_changed";
  room_id: "sessions" | "work" | "automation" | "routing";
  tone: "neutral" | "positive" | "warning" | "negative";
  count: number;
  generated_at: string;
  redacted: true;
}

export interface OfficeSafeEventsResponse {
  schema_version: number;
  generated_at: string;
  mode: "read_only";
  stream: "safe_snapshot_events";
  redacted: true;
  fallback: "frontend_safe_projection";
  events: OfficeSafeEventDTO[];
}

export interface SessionInfo {
  id: string;
  source: string | null;
  model: string | null;
  title: string | null;
  started_at: number;
  ended_at: number | null;
  last_active: number;
  is_active: boolean;
  message_count: number;
  tool_call_count: number;
  input_tokens: number;
  output_tokens: number;
  preview: string | null;
  parent_session_id?: string | null;
}

export interface SessionLatestDescendantResponse {
  requested_session_id: string;
  session_id: string;
  path: string[];
  changed: boolean;
}

export interface PaginatedSessions {
  sessions: SessionInfo[];
  total: number;
  limit: number;
  offset: number;
}

export interface EnvVarInfo {
  is_set: boolean;
  redacted_value: string | null;
  description: string;
  url: string | null;
  category: string;
  is_password: boolean;
  tools: string[];
  advanced: boolean;
}

export interface SessionMessage {
  role: "user" | "assistant" | "system" | "tool";
  content: string | null;
  tool_calls?: Array<{
    id: string;
    function: { name: string; arguments: string };
  }>;
  tool_name?: string;
  tool_call_id?: string;
  timestamp?: number;
}

export interface SessionMessagesResponse {
  session_id: string;
  messages: SessionMessage[];
}

export interface LogsResponse {
  file: string;
  lines: string[];
}

export interface AnalyticsDailyEntry {
  day: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  reasoning_tokens: number;
  estimated_cost: number;
  actual_cost: number;
  sessions: number;
  api_calls: number;
}

export interface AnalyticsModelEntry {
  model: string;
  input_tokens: number;
  output_tokens: number;
  estimated_cost: number;
  sessions: number;
  api_calls: number;
}

export interface AnalyticsSkillEntry {
  skill: string;
  view_count: number;
  manage_count: number;
  total_count: number;
  percentage: number;
  last_used_at: number | null;
}

export interface AnalyticsSkillsSummary {
  total_skill_loads: number;
  total_skill_edits: number;
  total_skill_actions: number;
  distinct_skills_used: number;
}

export interface AnalyticsResponse {
  daily: AnalyticsDailyEntry[];
  by_model: AnalyticsModelEntry[];
  totals: {
    total_input: number;
    total_output: number;
    total_cache_read: number;
    total_reasoning: number;
    total_estimated_cost: number;
    total_actual_cost: number;
    total_sessions: number;
    total_api_calls: number;
  };
  skills: {
    summary: AnalyticsSkillsSummary;
    top_skills: AnalyticsSkillEntry[];
  };
}

export interface ProfileInfo {
  name: string;
  path: string;
  is_default: boolean;
  model: string | null;
  provider: string | null;
  has_env: boolean;
  skill_count: number;
}

export interface ModelsAnalyticsModelEntry {
  model: string;
  provider: string;
  input_tokens: number;
  output_tokens: number;
  cache_read_tokens: number;
  reasoning_tokens: number;
  estimated_cost: number;
  actual_cost: number;
  sessions: number;
  api_calls: number;
  tool_calls: number;
  last_used_at: number;
  avg_tokens_per_session: number;
  capabilities: {
    supports_tools?: boolean;
    supports_vision?: boolean;
    supports_reasoning?: boolean;
    context_window?: number;
    max_output_tokens?: number;
    model_family?: string;
  };
}

export interface ModelsAnalyticsResponse {
  models: ModelsAnalyticsModelEntry[];
  totals: {
    distinct_models: number;
    total_input: number;
    total_output: number;
    total_cache_read: number;
    total_reasoning: number;
    total_estimated_cost: number;
    total_actual_cost: number;
    total_sessions: number;
    total_api_calls: number;
  };
  period_days: number;
}

export interface CronJob {
  id: string;
  name?: string;
  prompt: string;
  schedule: { kind: string; expr: string; display: string };
  schedule_display: string;
  enabled: boolean;
  state: string;
  deliver?: string;
  last_run_at?: string | null;
  next_run_at?: string | null;
  last_error?: string | null;
}

export interface SkillInfo {
  name: string;
  description: string;
  category: string;
  enabled: boolean;
}

export interface ToolsetInfo {
  name: string;
  label: string;
  description: string;
  enabled: boolean;
  configured: boolean;
  tools: string[];
}

export interface SessionSearchResult {
  session_id: string;
  snippet: string;
  role: string | null;
  source: string | null;
  model: string | null;
  session_started: number | null;
}

export interface SessionSearchResponse {
  results: SessionSearchResult[];
}

// ── Model info types ──────────────────────────────────────────────────

export interface ModelInfoResponse {
  model: string;
  provider: string;
  auto_context_length: number;
  config_context_length: number;
  effective_context_length: number;
  capabilities: {
    supports_tools?: boolean;
    supports_vision?: boolean;
    supports_reasoning?: boolean;
    context_window?: number;
    max_output_tokens?: number;
    model_family?: string;
  };
}

// ── Model options / assignment types ──────────────────────────────────

export interface ModelOptionProvider {
  name: string;
  slug: string;
  models?: string[];
  total_models?: number;
  is_current?: boolean;
  is_user_defined?: boolean;
  source?: string;
  warning?: string;
}

export interface ModelOptionsResponse {
  model?: string;
  provider?: string;
  providers?: ModelOptionProvider[];
}

export interface AuxiliaryTaskAssignment {
  task: string;
  provider: string;
  model: string;
  base_url: string;
}

export interface AuxiliaryModelsResponse {
  tasks: AuxiliaryTaskAssignment[];
  main: { provider: string; model: string };
}

export interface ModelAssignmentRequest {
  scope: "main" | "auxiliary";
  provider: string;
  model: string;
  /** For auxiliary: task slot name, "" for all, "__reset__" to reset all. */
  task?: string;
}

export interface ModelAssignmentResponse {
  ok: boolean;
  scope?: string;
  provider?: string;
  model?: string;
  tasks?: string[];
  reset?: boolean;
}

// ── OAuth provider types ────────────────────────────────────────────────

export interface OAuthProviderStatus {
  logged_in: boolean;
  source?: string | null;
  source_label?: string | null;
  token_preview?: string | null;
  expires_at?: string | null;
  has_refresh_token?: boolean;
  last_refresh?: string | null;
  error?: string;
}

export interface OAuthProvider {
  id: string;
  name: string;
  /** "pkce" (browser redirect + paste code), "device_code" (show code + URL),
   *  or "external" (delegated to a separate CLI like Claude Code or Qwen). */
  flow: "pkce" | "device_code" | "external";
  cli_command: string;
  docs_url: string;
  status: OAuthProviderStatus;
}

export interface OAuthProvidersResponse {
  providers: OAuthProvider[];
}

/** Discriminated union — the shape of /start depends on the flow. */
export type OAuthStartResponse =
  | {
      session_id: string;
      flow: "pkce";
      auth_url: string;
      expires_in: number;
    }
  | {
      session_id: string;
      flow: "device_code";
      user_code: string;
      verification_url: string;
      expires_in: number;
      poll_interval: number;
    };

export interface OAuthSubmitResponse {
  ok: boolean;
  status: "approved" | "error";
  message?: string;
}

export interface OAuthPollResponse {
  session_id: string;
  status: "pending" | "approved" | "denied" | "expired" | "error";
  error_message?: string | null;
  expires_at?: number | null;
}

// ── Dashboard theme types ──────────────────────────────────────────────

export interface DashboardThemeSummary {
  description: string;
  label: string;
  name: string;
  /** Full theme definition for user themes; undefined for built-ins
   *  (which the frontend already has locally). */
  definition?: DashboardTheme;
}

export interface DashboardThemesResponse {
  active: string;
  themes: DashboardThemeSummary[];
}

// ── Dashboard plugin types ─────────────────────────────────────────────

export interface PluginManifestResponse {
  name: string;
  label: string;
  description: string;
  icon: string;
  version: string;
  tab: {
    path: string;
    position?: string;
    override?: string;
    hidden?: boolean;
  };
  slots?: string[];
  entry: string;
  css?: string | null;
  has_api: boolean;
  source: string;
}

export interface HubAgentPluginRow {
  name: string;
  version: string;
  description: string;
  source: string;
  runtime_status: "disabled" | "enabled" | "inactive";
  has_dashboard_manifest: boolean;
  dashboard_manifest: PluginManifestResponse | null;
  path: string;
  can_remove: boolean;
  can_update_git: boolean;
  auth_required: boolean;
  auth_command: string;
  user_hidden: boolean;
}

export interface PluginsHubProviders {
  memory_provider: string;
  memory_options: Array<{ name: string; description: string }>;
  context_engine: string;
  context_options: Array<{ name: string; description: string }>;
}

export interface PluginsHubResponse {
  plugins: HubAgentPluginRow[];
  orphan_dashboard_plugins: PluginManifestResponse[];
  providers: PluginsHubProviders;
}

export interface AgentPluginInstallRequest {
  identifier: string;
  force?: boolean;
  enable?: boolean;
}

export interface AgentPluginInstallResponse {
  ok: boolean;
  plugin_name?: string;
  warnings?: string[];
  missing_env?: string[];
  after_install_path?: string | null;
  enabled?: boolean;
  error?: string;
}

export interface AgentPluginUpdateResponse {
  ok: boolean;
  name?: string;
  output?: string;
  unchanged?: boolean;
  error?: string;
}

export interface PluginProvidersPutRequest {
  memory_provider?: string;
  context_engine?: string;
}
