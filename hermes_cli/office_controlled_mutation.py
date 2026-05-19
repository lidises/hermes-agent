"""Contract-only AI Office controlled mutation schema.

This module intentionally exposes no executable mutation, adapter, target,
or audit behavior. It provides fixed allowlisted contract shapes plus the first
approved narrow safe request-event JSONL append/readback boundary under local
Hermes profile storage, before any future authority implementation exists.
"""

from __future__ import annotations

import hashlib
import json
import re
from collections.abc import Mapping, Sequence
from pathlib import Path
from typing import Any, cast

from hermes_constants import get_hermes_home

_AUTHORITY_LEVELS = [
    "display_only",
    "request_only",
    "dry_run_only",
    "human_approved_execute",
    "break_glass_admin",
]

_ALLOWED_ACTION_KINDS = [
    "kanban_transition",
    "kanban_comment",
    "projection_promote",
    "projection_reject",
    "nas_save_request",
    "watcher_enable_request",
    "service_restart_request",
]

_EVENT_KINDS = [
    "action_requested",
    "dry_run_completed",
    "human_decision_recorded",
    "execution_started",
    "execution_completed",
    "execution_blocked",
]

_DISABLED_CAPABILITIES = {
    "request_creation_enabled": False,
    "dry_run_execution_enabled": False,
    "human_decision_recording_enabled": False,
    "authority_adapter_enabled": False,
    "target_mutation_enabled": False,
    "audit_write_enabled": False,
    "nas_save_enabled": False,
}

_REDACTION_POSTURE = {
    "raw_excluded": True,
    "allowlisted_fields_only": True,
    "opaque_refs_only": True,
}

_REQUEST_EVENT_FIELDS = {
    "request_id",
    "correlation_id",
    "actor_ref",
    "intent_kind",
    "action_kind",
    "authority_level",
    "risk_class",
    "target_ref",
    "reason_code",
    "safe_summary",
    "evidence_refs",
    "requested_at",
}

_REQUEST_EVENT_ACTION_KINDS = {"kanban_comment"}
_REQUEST_EVENT_AUTHORITY_LEVELS = {"request_only"}
_REQUEST_EVENT_RISK_CLASSES = {"low", "medium", "high"}
_DECISION_EVENT_FIELDS = {
    "decision_id",
    "request_id",
    "correlation_id",
    "decision",
    "decided_by",
    "safe_reason_summary",
    "evidence_refs",
    "decided_at",
}
_DECISION_EVENT_DECISIONS = {"approve", "reject", "hold"}
_DRY_RUN_RESULT_EVENT_FIELDS = {
    "result_id",
    "request_id",
    "correlation_id",
    "simulated_by",
    "simulation_status",
    "safe_summary",
    "evidence_refs",
    "completed_at",
}
_DRY_RUN_RESULT_STATUSES = {"passed", "blocked", "warning"}
_AUDIT_EVENT_FIELDS = {
    "audit_id",
    "request_id",
    "correlation_id",
    "event_kind",
    "actor_ref",
    "safe_summary",
    "evidence_refs",
    "recorded_at",
}
_AUDIT_EVENT_KINDS = {"request_recorded", "decision_recorded", "dry_run_result_recorded", "execution_blocked"}
_APPROVAL_RECORDING_DRAFT_FIELDS = {
    "approval_record_ref",
    "exact_target_allowlist_ref",
    "idempotency_key",
    "replay_lookup_ref",
    "rollback_disable_ref",
    "dry_run_evidence_ref",
    "operator_confirmation",
    "requested_by",
    "requested_at",
    "safe_summary",
    "evidence_refs",
}
_APPROVAL_RECORD_FIELDS = {
    "approval_record_ref",
    "operator_confirmation",
    "approved_by",
    "approved_at",
    "approval_evidence_refs",
}
_DISPATCH_GATE_OPEN_RECORD_FIELDS = {
    "approval_record_ref",
    "dispatch_gate_ref",
    "operator_confirmation",
    "opened_by",
    "opened_at",
    "gate_evidence_refs",
}
_RUNTIME_COMMAND_PREVIEW_RECORD_FIELDS = {
    "dispatch_gate_ref",
    "runtime_command_preview_ref",
    "command_envelope_ref",
    "command_intent_ref",
    "operator_confirmation",
    "materialized_by",
    "materialized_at",
    "preview_evidence_refs",
}
_AUTHORITY_REGISTRY_FIELDS = {
    "adapter_ref",
    "adapter_kind",
    "authority_candidate_ref",
    "registered_by",
    "permission_posture",
    "credential_posture",
    "dispatch_posture",
    "target_posture",
    "safe_summary",
    "evidence_refs",
    "registered_at",
}
_AUTHORITY_REGISTRY_ADAPTER_KINDS = {"kanban_comment", "status_note", "read_only_projection"}
_AUTHORITY_REGISTRY_PERMISSION_POSTURES = {"metadata_only", "blocked"}
_AUTHORITY_REGISTRY_CREDENTIAL_POSTURES = {"not_configured", "blocked"}
_AUTHORITY_REGISTRY_EXECUTION_POSTURES = {"blocked"}
_NAS_PREPARATION_FIELDS = {
    "preparation_ref",
    "request_ref",
    "decision_ref",
    "source_manifest_ref",
    "target_vault_ref",
    "proposed_path_ref",
    "safe_title",
    "safe_summary",
    "evidence_refs",
    "rollback_plan_ref",
    "requested_by",
    "requested_at",
}
_NAS_EVIDENCE_PACKAGE_FIELDS = {
    "package_ref",
    "preparation_ref",
    "request_ref",
    "decision_ref",
    "source_manifest_refs",
    "review_evidence_refs",
    "wiki_draft_ref",
    "target_vault_ref",
    "proposed_path_ref",
    "safe_title",
    "safe_summary",
    "rollback_plan_ref",
    "created_by",
    "created_at",
}
_NAS_PATH_RESOLUTION_FIELDS = {
    "path_resolution_ref",
    "package_ref",
    "target_vault_ref",
    "proposed_path_ref",
    "safe_title",
    "safe_slug",
    "path_policy_ref",
    "created_by",
    "created_at",
}
_NAS_RUNTIME_WRITE_FIELDS = {
    "write_ref",
    "package_ref",
    "target_vault_ref",
    "safe_slug",
    "safe_title",
    "markdown_body",
    "requested_by",
    "requested_at",
}
_NAS_MAC_RELAY_WRITE_REQUEST_FIELDS = _NAS_RUNTIME_WRITE_FIELDS | {"relay_request_ref", "nas_keeper_ref", "relay_node_ref"}
_NAS_KEEPER_HANDOFF_QUEUE_FIELDS = _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS | {"handoff_ref", "queued_by", "queued_at"}
_NAS_KEEPER_HANDOFF_CLAIM_DRY_RUN_FIELDS = {"handoff_ref", "claim_ref", "relay_node_ref", "claimed_by", "claimed_at"}
_NAS_KEEPER_HANDOFF_AUTHORIZE_FIELDS = {
    "handoff_ref",
    "authorization_ref",
    "nas_keeper_ref",
    "relay_node_ref",
    "authorized_by",
    "authorized_at",
    "authorization_decision",
}
_NAS_KEEPER_HANDOFF_EXECUTION_PAYLOAD_PREVIEW_FIELDS = {
    "handoff_ref",
    "relay_execution_ref",
    "nas_keeper_ref",
    "relay_node_ref",
    "relay_authorized_by",
    "relay_authorized_at",
}
_NAS_KEEPER_HANDOFF_EXECUTION_STATE_FIELDS = {
    "handoff_ref",
    "execution_record_ref",
    "relay_execution_ref",
    "nas_keeper_ref",
    "relay_node_ref",
    "recorded_by",
    "recorded_at",
    "execution_status",
    "safe_summary",
    "evidence_refs",
}
_NAS_KEEPER_HANDOFF_EXECUTION_STATUSES = {
    "succeeded": "mac_relay_execution_succeeded",
    "failed": "mac_relay_execution_failed",
    "manual_review_required": "mac_relay_execution_manual_review_required",
}
_NAS_KEEPER_HANDOFF_QUEUE_STATUSES = {
    "pending_nas_keeper_authorization",
    "authorized_for_mac_relay_execution",
    "mac_relay_execution_succeeded",
    "mac_relay_execution_failed",
    "mac_relay_execution_manual_review_required",
}
_NAS_KEEPER_HANDOFF_QUEUE_READBACK_FIELDS = {"handoff_ref", "queue_status", "relay_node_ref", "nas_keeper_ref", "limit"}
_OPAQUE_ID_RE = re.compile(r"^[A-Za-z0-9][A-Za-z0-9_.:-]{2,119}$")
_OPAQUE_REF_RE = re.compile(r"^[A-Za-z][A-Za-z0-9_-]{1,40}:[A-Za-z0-9][A-Za-z0-9_.:-]{1,160}$")
_SAFE_TEXT_RE = re.compile(r"^[^<>\\]{1,240}$")
_SAFE_SLUG_RE = re.compile(r"^[a-z0-9][a-z0-9-]{1,119}$")
_ISO_UTC_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


def _error(field: str, code: str) -> dict[str, str]:
    return {"field": field, "code": code}


def _is_opaque_id(value: object) -> bool:
    return (
        isinstance(value, str)
        and bool(_OPAQUE_ID_RE.fullmatch(value))
        and "/" not in value
        and ".." not in value
        and not _has_raw_marker(value)
    )


def _has_raw_marker(value: str) -> bool:
    lowered = value.lower()
    raw_markers = (
        "traceback",
        "/users/",
        "/home/",
        "/mnt/",
        "smb://",
        "mount -t",
        "token",
        "provider",
        "password",
        "secret",
        "credential",
        "api key",
        "api_key",
        "authorization",
        "bearer",
        "raw prompt",
        "raw task",
    )
    token_markers = lowered.startswith("sk-") or " sk-" in lowered or ":sk-" in lowered
    auth_ref_markers = lowered.startswith("auth:") or lowered.startswith("api_key:")
    return token_markers or auth_ref_markers or any(marker in lowered for marker in raw_markers)


def _is_opaque_ref(value: object) -> bool:
    return (
        isinstance(value, str)
        and bool(_OPAQUE_REF_RE.fullmatch(value))
        and "/" not in value
        and ".." not in value
        and not _has_raw_marker(value)
    )


def _is_safe_text(value: object) -> bool:
    return isinstance(value, str) and bool(_SAFE_TEXT_RE.fullmatch(value)) and not _has_raw_marker(value)


def _validate_evidence_refs(value: object) -> bool:
    if not isinstance(value, Sequence) or isinstance(value, (str, bytes)):
        return False
    if len(value) > 8:
        return False
    return all(_is_opaque_ref(item) for item in value)


def build_office_controlled_mutation_contract_schema(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executable controlled-mutation contract descriptor.

    ``unsafe_examples`` is accepted only for tests and future callers that need
    to verify the boundary: values are deliberately ignored so raw prompt/task
    body/transcript/path/provider/token material can never be echoed.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "contract_only",
        "authority_levels": list(_AUTHORITY_LEVELS),
        "allowed_action_kinds": list(_ALLOWED_ACTION_KINDS),
        "event_kinds": list(_EVENT_KINDS),
        "capabilities": dict(_DISABLED_CAPABILITIES),
        "redaction": dict(_REDACTION_POSTURE),
        "contract_notes": [
            "allowed_action_kinds are descriptive contract vocabulary only",
            "all executable capabilities remain disabled until separately approved",
        ],
        "mutation_endpoints": [],
    }


def validate_office_controlled_mutation_request_event(payload: object) -> dict[str, object]:
    """Validate a safe, non-persisted controlled-mutation request DTO.

    The validator is intentionally pure: it creates no request, writes no audit
    event, calls no adapter, and never echoes unsupported/raw fields or values.
    """

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _REQUEST_EVENT_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    required_fields = sorted(_REQUEST_EVENT_FIELDS)
    for field in required_fields:
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "request_id" in payload and not _is_opaque_id(payload.get("request_id")):
        errors.append(_error("request_id", "invalid_opaque_id"))
    if "correlation_id" in payload and not _is_opaque_id(payload.get("correlation_id")):
        errors.append(_error("correlation_id", "invalid_opaque_id"))
    if "actor_ref" in payload and not _is_opaque_ref(payload.get("actor_ref")):
        errors.append(_error("actor_ref", "invalid_opaque_ref"))
    if "target_ref" in payload and not _is_opaque_ref(payload.get("target_ref")):
        errors.append(_error("target_ref", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))

    if payload.get("intent_kind") != "action_requested":
        errors.append(_error("intent_kind", "unsupported_request_event_intent"))
    if "action_kind" in payload and payload.get("action_kind") not in _REQUEST_EVENT_ACTION_KINDS:
        errors.append(_error("action_kind", "unsupported_request_event_action"))
    if "authority_level" in payload and payload.get("authority_level") not in _REQUEST_EVENT_AUTHORITY_LEVELS:
        errors.append(_error("authority_level", "unsupported_request_event_authority"))
    if "risk_class" in payload and payload.get("risk_class") not in _REQUEST_EVENT_RISK_CLASSES:
        errors.append(_error("risk_class", "unsupported_risk_class"))

    for field in ("reason_code", "safe_summary"):
        if field in payload and not _is_safe_text(payload.get(field)):
            errors.append(_error(field, "invalid_safe_text"))
    if "requested_at" in payload and not (isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])):
        errors.append(_error("requested_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_request_event",
        "request_id": payload["request_id"],
        "correlation_id": payload["correlation_id"],
        "actor_ref": payload["actor_ref"],
        "intent_kind": payload["intent_kind"],
        "action_kind": payload["action_kind"],
        "authority_level": payload["authority_level"],
        "risk_class": payload["risk_class"],
        "target_ref": payload["target_ref"],
        "reason_code": payload["reason_code"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "requested_at": payload["requested_at"],
        "capabilities": {
            "request_creation_enabled": False,
            "persistence_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def _default_request_event_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "requests.jsonl"


def _with_request_event_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "request_creation_enabled": True,
            "persistence_enabled": True,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_request_event(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _REQUEST_EVENT_FIELDS if field in item}
    validation = validate_office_controlled_mutation_request_event(payload)
    if not validation["valid"]:
        return None
    return _with_request_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))


def _read_request_event_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_request_event(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_request_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append a safe request-event DTO to the local Hermes JSONL store.

    This is the first narrow write boundary: it stores only the already validated,
    allowlisted DTO under ``HERMES_HOME`` (or an explicit test path). It does not
    execute a dry run, record a human decision, call an authority adapter, mutate
    a target, write audit/NAS material, or echo unsupported/raw input values.
    """

    validation = validate_office_controlled_mutation_request_event(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}

    dto = _with_request_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_request_event_store_path()
    existing_events, _ = _read_request_event_store(path)
    if any(event.get("request_id") == dto["request_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("request_id", "duplicate_request_id")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_request_events(
    *, store_path: Path | None = None, limit: int = 50, correlation_id: str | None = None
) -> dict[str, object]:
    """Read back safe stored request-event DTOs without exposing raw inputs."""

    path = store_path or _default_request_event_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_request_event_store(path)
    response_correlation_id: str | None = None
    errors: list[dict[str, str]] = []

    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            response_correlation_id = correlation_id
            events = [event for event in events if event.get("correlation_id") == correlation_id]
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
            events = []

    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_request_events_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "readback_enabled": True,
            "duplicate_detection_enabled": True,
            "correlation_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if response_correlation_id is not None:
        response["correlation_id"] = response_correlation_id
    return response


def _default_decision_event_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "decisions.jsonl"


def validate_office_controlled_mutation_decision_event(payload: object) -> dict[str, object]:
    """Validate a safe human decision DTO without recording it."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _DECISION_EVENT_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_DECISION_EVENT_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "decision_id" in payload and not _is_opaque_id(payload.get("decision_id")):
        errors.append(_error("decision_id", "invalid_opaque_id"))
    if "request_id" in payload and not _is_opaque_id(payload.get("request_id")):
        errors.append(_error("request_id", "invalid_opaque_id"))
    if "correlation_id" in payload and not _is_opaque_id(payload.get("correlation_id")):
        errors.append(_error("correlation_id", "invalid_opaque_id"))
    if "decided_by" in payload and not _is_opaque_ref(payload.get("decided_by")):
        errors.append(_error("decided_by", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    if "decision" in payload and payload.get("decision") not in _DECISION_EVENT_DECISIONS:
        errors.append(_error("decision", "unsupported_decision"))
    if "safe_reason_summary" in payload and not _is_safe_text(payload.get("safe_reason_summary")):
        errors.append(_error("safe_reason_summary", "invalid_safe_text"))
    if "decided_at" in payload and not (
        isinstance(payload.get("decided_at"), str) and _ISO_UTC_RE.fullmatch(payload["decided_at"])
    ):
        errors.append(_error("decided_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_human_decision_event",
        "decision_id": payload["decision_id"],
        "request_id": payload["request_id"],
        "correlation_id": payload["correlation_id"],
        "decision": payload["decision"],
        "decided_by": payload["decided_by"],
        "safe_reason_summary": payload["safe_reason_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "decided_at": payload["decided_at"],
        "capabilities": {
            "human_decision_recording_enabled": False,
            "decision_append_enabled": False,
            "decision_readback_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def _with_decision_event_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "human_decision_recording_enabled": True,
            "decision_append_enabled": True,
            "decision_readback_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_decision_event(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _DECISION_EVENT_FIELDS if field in item}
    validation = validate_office_controlled_mutation_decision_event(payload)
    if not validation["valid"]:
        return None
    return _with_decision_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))


def _read_decision_event_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_decision_event(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_decision_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append a safe human decision DTO to the local Hermes JSONL store."""

    validation = validate_office_controlled_mutation_decision_event(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}

    dto = _with_decision_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_decision_event_store_path()
    existing_events, _ = _read_decision_event_store(path)
    if any(event.get("decision_id") == dto["decision_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("decision_id", "duplicate_decision_id")], "dto": None}
    if any(event.get("request_id") == dto["request_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("request_id", "duplicate_request_decision")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_decision_events(
    *,
    store_path: Path | None = None,
    limit: int = 50,
    request_id: str | None = None,
    correlation_id: str | None = None,
) -> dict[str, object]:
    """Read back safe stored human decision DTOs without exposing raw inputs."""

    path = store_path or _default_decision_event_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_decision_event_store(path)
    errors: list[dict[str, str]] = []
    response_request_id: str | None = None
    response_correlation_id: str | None = None

    if request_id is not None:
        if _is_opaque_id(request_id):
            response_request_id = request_id
            events = [event for event in events if event.get("request_id") == request_id]
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
            events = []
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            response_correlation_id = correlation_id
            events = [event for event in events if event.get("correlation_id") == correlation_id]
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
            events = []

    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_human_decision_events_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "decision_readback_enabled": True,
            "human_decision_recording_enabled": True,
            "decision_append_enabled": True,
            "duplicate_detection_enabled": True,
            "request_filter_enabled": True,
            "correlation_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if response_request_id is not None:
        response["request_id"] = response_request_id
    if response_correlation_id is not None:
        response["correlation_id"] = response_correlation_id
    return response



def _default_dry_run_result_event_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "dry_run_results.jsonl"


def validate_office_controlled_mutation_dry_run_result_event(payload: object) -> dict[str, object]:
    """Validate a safe dry-run result DTO without executing a dry run."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _DRY_RUN_RESULT_EVENT_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_DRY_RUN_RESULT_EVENT_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "result_id" in payload and not _is_opaque_id(payload.get("result_id")):
        errors.append(_error("result_id", "invalid_opaque_id"))
    if "request_id" in payload and not _is_opaque_id(payload.get("request_id")):
        errors.append(_error("request_id", "invalid_opaque_id"))
    if "correlation_id" in payload and not _is_opaque_id(payload.get("correlation_id")):
        errors.append(_error("correlation_id", "invalid_opaque_id"))
    if "simulated_by" in payload and not _is_opaque_ref(payload.get("simulated_by")):
        errors.append(_error("simulated_by", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    if "simulation_status" in payload and payload.get("simulation_status") not in _DRY_RUN_RESULT_STATUSES:
        errors.append(_error("simulation_status", "unsupported_simulation_status"))
    if "safe_summary" in payload and not _is_safe_text(payload.get("safe_summary")):
        errors.append(_error("safe_summary", "invalid_safe_text"))
    if "completed_at" in payload and not (
        isinstance(payload.get("completed_at"), str) and _ISO_UTC_RE.fullmatch(payload["completed_at"])
    ):
        errors.append(_error("completed_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_dry_run_result_event",
        "result_id": payload["result_id"],
        "request_id": payload["request_id"],
        "correlation_id": payload["correlation_id"],
        "simulated_by": payload["simulated_by"],
        "simulation_status": payload["simulation_status"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "completed_at": payload["completed_at"],
        "capabilities": {
            "dry_run_result_storage_enabled": False,
            "dry_run_result_readback_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def _with_dry_run_result_event_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "dry_run_result_storage_enabled": True,
            "dry_run_result_readback_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_dry_run_result_event(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _DRY_RUN_RESULT_EVENT_FIELDS if field in item}
    validation = validate_office_controlled_mutation_dry_run_result_event(payload)
    if not validation["valid"]:
        return None
    return _with_dry_run_result_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))


def _read_dry_run_result_event_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_dry_run_result_event(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_dry_run_result_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append a safe dry-run result DTO without executing a dry run."""

    validation = validate_office_controlled_mutation_dry_run_result_event(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}

    dto = _with_dry_run_result_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_dry_run_result_event_store_path()
    existing_events, _ = _read_dry_run_result_event_store(path)
    if any(event.get("result_id") == dto["result_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("result_id", "duplicate_result_id")], "dto": None}
    if any(event.get("request_id") == dto["request_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("request_id", "duplicate_request_dry_run_result")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_dry_run_result_events(
    *,
    store_path: Path | None = None,
    limit: int = 50,
    request_id: str | None = None,
    correlation_id: str | None = None,
) -> dict[str, object]:
    """Read back safe stored dry-run result DTOs without exposing raw inputs."""

    path = store_path or _default_dry_run_result_event_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_dry_run_result_event_store(path)
    errors: list[dict[str, str]] = []
    response_request_id: str | None = None
    response_correlation_id: str | None = None

    if request_id is not None:
        if _is_opaque_id(request_id):
            response_request_id = request_id
            events = [event for event in events if event.get("request_id") == request_id]
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
            events = []
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            response_correlation_id = correlation_id
            events = [event for event in events if event.get("correlation_id") == correlation_id]
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
            events = []

    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_dry_run_result_events_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "dry_run_result_readback_enabled": True,
            "dry_run_result_storage_enabled": True,
            "duplicate_detection_enabled": True,
            "request_filter_enabled": True,
            "correlation_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if response_request_id is not None:
        response["request_id"] = response_request_id
    if response_correlation_id is not None:
        response["correlation_id"] = response_correlation_id
    return response



def _default_audit_event_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "audit_events.jsonl"


def validate_office_controlled_mutation_audit_event(payload: object) -> dict[str, object]:
    """Validate a safe audit event DTO without executing or mutating targets."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _AUDIT_EVENT_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_AUDIT_EVENT_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "audit_id" in payload and not _is_opaque_id(payload.get("audit_id")):
        errors.append(_error("audit_id", "invalid_opaque_id"))
    if "request_id" in payload and not _is_opaque_id(payload.get("request_id")):
        errors.append(_error("request_id", "invalid_opaque_id"))
    if "correlation_id" in payload and not _is_opaque_id(payload.get("correlation_id")):
        errors.append(_error("correlation_id", "invalid_opaque_id"))
    if "actor_ref" in payload and not _is_opaque_ref(payload.get("actor_ref")):
        errors.append(_error("actor_ref", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    if "event_kind" in payload and payload.get("event_kind") not in _AUDIT_EVENT_KINDS:
        errors.append(_error("event_kind", "unsupported_audit_event_kind"))
    if "safe_summary" in payload and not _is_safe_text(payload.get("safe_summary")):
        errors.append(_error("safe_summary", "invalid_safe_text"))
    if "recorded_at" in payload and not (
        isinstance(payload.get("recorded_at"), str) and _ISO_UTC_RE.fullmatch(payload["recorded_at"])
    ):
        errors.append(_error("recorded_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_audit_event",
        "audit_id": payload["audit_id"],
        "request_id": payload["request_id"],
        "correlation_id": payload["correlation_id"],
        "event_kind": payload["event_kind"],
        "actor_ref": payload["actor_ref"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "recorded_at": payload["recorded_at"],
        "capabilities": {
            "audit_append_enabled": False,
            "audit_readback_enabled": False,
            "audit_write_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def _with_audit_event_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "audit_append_enabled": True,
            "audit_readback_enabled": True,
            "audit_write_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_audit_event(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _AUDIT_EVENT_FIELDS if field in item}
    validation = validate_office_controlled_mutation_audit_event(payload)
    if not validation["valid"]:
        return None
    return _with_audit_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))


def _read_audit_event_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_audit_event(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_audit_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append a safe audit event DTO without executing or mutating targets."""

    validation = validate_office_controlled_mutation_audit_event(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}

    dto = _with_audit_event_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_audit_event_store_path()
    existing_events, _ = _read_audit_event_store(path)
    if any(event.get("audit_id") == dto["audit_id"] for event in existing_events):
        return {"stored": False, "errors": [_error("audit_id", "duplicate_audit_id")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_audit_events(
    *,
    store_path: Path | None = None,
    limit: int = 50,
    request_id: str | None = None,
    correlation_id: str | None = None,
    event_kind: str | None = None,
) -> dict[str, object]:
    """Read back safe stored audit DTOs without exposing raw inputs."""

    path = store_path or _default_audit_event_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_audit_event_store(path)
    errors: list[dict[str, str]] = []
    response_request_id: str | None = None
    response_correlation_id: str | None = None
    response_event_kind: str | None = None

    if request_id is not None:
        if _is_opaque_id(request_id):
            response_request_id = request_id
            events = [event for event in events if event.get("request_id") == request_id]
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
            events = []
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            response_correlation_id = correlation_id
            events = [event for event in events if event.get("correlation_id") == correlation_id]
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
            events = []
    if event_kind is not None:
        if event_kind in _AUDIT_EVENT_KINDS:
            response_event_kind = event_kind
            events = [event for event in events if event.get("event_kind") == event_kind]
        else:
            errors.append(_error("event_kind", "unsupported_audit_event_kind"))
            events = []

    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_audit_events_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "audit_readback_enabled": True,
            "audit_append_enabled": True,
            "audit_write_enabled": True,
            "duplicate_detection_enabled": True,
            "request_filter_enabled": True,
            "correlation_filter_enabled": True,
            "event_kind_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if response_request_id is not None:
        response["request_id"] = response_request_id
    if response_correlation_id is not None:
        response["correlation_id"] = response_correlation_id
    if response_event_kind is not None:
        response["event_kind"] = response_event_kind
    return response



def _default_authority_adapter_registry_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "authority_adapters.jsonl"


def validate_office_controlled_mutation_authority_adapter_registry_event(payload: object) -> dict[str, object]:
    """Validate safe authority adapter registry metadata without credentials or binding."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _AUTHORITY_REGISTRY_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_AUTHORITY_REGISTRY_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "adapter_ref" in payload and not _is_opaque_id(payload.get("adapter_ref")):
        errors.append(_error("adapter_ref", "invalid_opaque_id"))
    if "authority_candidate_ref" in payload and not _is_opaque_id(payload.get("authority_candidate_ref")):
        errors.append(_error("authority_candidate_ref", "invalid_opaque_id"))
    if "registered_by" in payload and not _is_opaque_ref(payload.get("registered_by")):
        errors.append(_error("registered_by", "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    if "adapter_kind" in payload and payload.get("adapter_kind") not in _AUTHORITY_REGISTRY_ADAPTER_KINDS:
        errors.append(_error("adapter_kind", "unsupported_adapter_kind"))
    if "permission_posture" in payload and payload.get("permission_posture") not in _AUTHORITY_REGISTRY_PERMISSION_POSTURES:
        errors.append(_error("permission_posture", "unsupported_permission_posture"))
    if "credential_posture" in payload and payload.get("credential_posture") not in _AUTHORITY_REGISTRY_CREDENTIAL_POSTURES:
        errors.append(_error("credential_posture", "unsupported_credential_posture"))
    if "dispatch_posture" in payload and payload.get("dispatch_posture") not in _AUTHORITY_REGISTRY_EXECUTION_POSTURES:
        errors.append(_error("dispatch_posture", "unsupported_dispatch_posture"))
    if "target_posture" in payload and payload.get("target_posture") not in _AUTHORITY_REGISTRY_EXECUTION_POSTURES:
        errors.append(_error("target_posture", "unsupported_target_posture"))
    if "safe_summary" in payload and not _is_safe_text(payload.get("safe_summary")):
        errors.append(_error("safe_summary", "invalid_safe_text"))
    if "registered_at" in payload and not (
        isinstance(payload.get("registered_at"), str) and _ISO_UTC_RE.fullmatch(payload["registered_at"])
    ):
        errors.append(_error("registered_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_authority_adapter_registry_event",
        "adapter_ref": payload["adapter_ref"],
        "adapter_kind": payload["adapter_kind"],
        "authority_candidate_ref": payload["authority_candidate_ref"],
        "registered_by": payload["registered_by"],
        "permission_posture": payload["permission_posture"],
        "credential_posture": payload["credential_posture"],
        "dispatch_posture": payload["dispatch_posture"],
        "target_posture": payload["target_posture"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "registered_at": payload["registered_at"],
        "capabilities": {
            "adapter_registry_storage_enabled": False,
            "adapter_registry_readback_enabled": False,
            "adapter_implementation_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
    }
    return {"valid": True, "errors": [], "dto": dto}


def _with_authority_registry_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "adapter_registry_storage_enabled": True,
            "adapter_registry_readback_enabled": True,
            "adapter_implementation_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_authority_registry_event(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _AUTHORITY_REGISTRY_FIELDS if field in item}
    validation = validate_office_controlled_mutation_authority_adapter_registry_event(payload)
    if not validation["valid"]:
        return None
    return _with_authority_registry_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))


def _read_authority_registry_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_authority_registry_event(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_authority_adapter_registry_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append safe authority adapter registry metadata only."""

    validation = validate_office_controlled_mutation_authority_adapter_registry_event(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}
    dto = _with_authority_registry_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_authority_adapter_registry_store_path()
    existing_events, _ = _read_authority_registry_store(path)
    if any(event.get("adapter_ref") == dto["adapter_ref"] for event in existing_events):
        return {"stored": False, "errors": [_error("adapter_ref", "duplicate_adapter_ref")], "dto": None}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_authority_adapter_registry_events(
    *,
    store_path: Path | None = None,
    limit: int = 50,
    adapter_kind: str | None = None,
) -> dict[str, object]:
    """Read back safe authority adapter registry metadata only."""

    path = store_path or _default_authority_adapter_registry_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_authority_registry_store(path)
    errors: list[dict[str, str]] = []
    response_adapter_kind: str | None = None
    if adapter_kind is not None:
        if adapter_kind in _AUTHORITY_REGISTRY_ADAPTER_KINDS:
            response_adapter_kind = adapter_kind
            events = [event for event in events if event.get("adapter_kind") == adapter_kind]
        else:
            errors.append(_error("adapter_kind", "unsupported_adapter_kind"))
            events = []
    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_authority_adapter_registry_events_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "adapter_registry_readback_enabled": True,
            "adapter_registry_storage_enabled": True,
            "duplicate_detection_enabled": True,
            "adapter_kind_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "adapter_implementation_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "nas_save_enabled": False,
        },
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if response_adapter_kind is not None:
        response["adapter_kind"] = response_adapter_kind
    return response


def build_office_controlled_mutation_authority_metadata_handoff_status(
    *,
    request_id: str | None = None,
    correlation_id: str | None = None,
    store_paths: Mapping[str, Path] | None = None,
    limit: int = 25,
) -> dict[str, object]:
    """Summarize safe metadata checkpoints for a manual authority handoff lane."""

    errors: list[dict[str, str]] = []
    safe_request_id: str | None = None
    safe_correlation_id: str | None = None
    if request_id is not None:
        if _is_opaque_id(request_id):
            safe_request_id = request_id
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            safe_correlation_id = correlation_id
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {
            "schema_version": 1,
            "mode": "authority_metadata_handoff_status",
            "checkpoint_complete": False,
            "chain_counts": {
                "requests": 0,
                "decisions": 0,
                "dry_run_results": 0,
                "audit_events": 0,
                "authority_registry": 0,
            },
            "latest_refs": {},
            "next_manual_lane": "manual_status_note_authority_handoff",
            "capabilities": _authority_metadata_handoff_capabilities(),
            "redaction": dict(_REDACTION_POSTURE),
            "errors": errors,
        }

    paths = store_paths or {}
    max_items = max(0, min(limit, 200))
    requests = list_office_controlled_mutation_request_events(
        store_path=paths.get("requests"), limit=max_items, correlation_id=safe_correlation_id
    )
    decisions = list_office_controlled_mutation_decision_events(
        store_path=paths.get("decisions"), limit=max_items, request_id=safe_request_id, correlation_id=safe_correlation_id
    )
    dry_runs = list_office_controlled_mutation_dry_run_result_events(
        store_path=paths.get("dry_run_results"), limit=max_items, request_id=safe_request_id, correlation_id=safe_correlation_id
    )
    audits = list_office_controlled_mutation_audit_events(
        store_path=paths.get("audit_events"), limit=max_items, request_id=safe_request_id, correlation_id=safe_correlation_id
    )
    registry = list_office_controlled_mutation_authority_adapter_registry_events(
        store_path=paths.get("authority_registry"), limit=max_items, adapter_kind="status_note"
    )

    counts = {
        "requests": _safe_count(requests.get("count")),
        "decisions": _safe_count(decisions.get("count")),
        "dry_run_results": _safe_count(dry_runs.get("count")),
        "audit_events": _safe_count(audits.get("count")),
        "authority_registry": _safe_count(registry.get("count")),
    }
    latest_refs: dict[str, str] = {}
    for key, response, ref_field in (
        ("request", requests, "request_id"),
        ("decision", decisions, "decision_id"),
        ("dry_run_result", dry_runs, "result_id"),
        ("audit", audits, "audit_id"),
        ("authority_registry", registry, "adapter_ref"),
    ):
        events = response.get("events")
        if isinstance(events, list) and events and isinstance(events[-1], Mapping):
            ref = events[-1].get(ref_field)
            if isinstance(ref, str) and _is_opaque_id(ref):
                latest_refs[key] = ref

    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "authority_metadata_handoff_status",
        "checkpoint_complete": all(value > 0 for value in counts.values()),
        "chain_counts": counts,
        "latest_refs": latest_refs,
        "next_manual_lane": "manual_status_note_authority_handoff",
        "capabilities": _authority_metadata_handoff_capabilities(),
        "redaction": dict(_REDACTION_POSTURE),
        "errors": [],
    }
    if safe_request_id is not None:
        response["request_id"] = safe_request_id
    if safe_correlation_id is not None:
        response["correlation_id"] = safe_correlation_id
    return response


def _authority_metadata_handoff_capabilities() -> dict[str, bool]:
    return {
        "metadata_readback_enabled": True,
        "status_note_lane_enabled": True,
        "request_store_readback_enabled": True,
        "decision_store_readback_enabled": True,
        "dry_run_result_readback_enabled": True,
        "audit_readback_enabled": True,
        "authority_registry_readback_enabled": True,
        "adapter_implementation_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "credential_access_enabled": False,
        "target_mutation_enabled": False,
        "dry_run_execution_enabled": False,
        "nas_save_enabled": False,
        "watcher_daemon_enabled": False,
        "cron_enabled": False,
    }


def build_office_controlled_mutation_dispatcher_authority_dry_run_surface(
    *,
    request_id: str | None = None,
    correlation_id: str | None = None,
    authority_ref: str | None = None,
    unsafe_examples: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Describe a future dispatcher/authority path as a non-executing dry-run surface."""

    _ = unsafe_examples
    errors: list[dict[str, str]] = []
    safe_request_id: str | None = None
    safe_correlation_id: str | None = None
    safe_authority_ref: str | None = None
    if request_id is not None:
        if _is_opaque_id(request_id):
            safe_request_id = request_id
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            safe_correlation_id = correlation_id
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
    if authority_ref is not None:
        if _is_opaque_id(authority_ref):
            safe_authority_ref = authority_ref
        else:
            errors.append(_error("authority_ref", "invalid_opaque_id"))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    plan_ref = f"plan_{safe_request_id}" if safe_request_id else "plan_dispatcher_authority_dry_run"
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "dispatcher_authority_dry_run_surface",
        "dry_run_plan": {
            "plan_ref": plan_ref,
            "ready": not errors,
            "would_dispatch": False,
            "would_bind_authority_adapter": False,
            "would_mutate_target": False,
            "would_write_nas": False,
            "would_start_daemon": False,
            "would_record_audit": False,
            "next_boundary": "explicit_dispatcher_authority_execution_approval_required",
            "steps": [
                {
                    "step_ref": "read_authority_metadata_checkpoint",
                    "label": "Read the existing safe metadata checkpoint.",
                    "enabled": True,
                },
                {
                    "step_ref": "select_safe_authority_candidate",
                    "label": "Select a metadata-only authority candidate.",
                    "enabled": True,
                },
                {
                    "step_ref": "prepare_simulated_dispatch_envelope",
                    "label": "Prepare a simulated dispatch envelope without sending it.",
                    "enabled": True,
                },
                {
                    "step_ref": "record_manual_dry_run_result_only_after_separate_approval",
                    "label": "Record dry-run metadata only if a separate store-write approval is given.",
                    "enabled": False,
                },
                {
                    "step_ref": "stop_before_execution_boundary",
                    "label": "Stop before dispatcher execution, adapter binding, or target mutation.",
                    "enabled": True,
                },
            ],
        },
        "capabilities": _dispatcher_authority_dry_run_capabilities(),
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if safe_request_id is not None:
        response["request_id"] = safe_request_id
    if safe_correlation_id is not None:
        response["correlation_id"] = safe_correlation_id
    if safe_authority_ref is not None:
        response["authority_ref"] = safe_authority_ref
    return response


def _dispatcher_authority_dry_run_capabilities() -> dict[str, bool]:
    return {
        "dry_run_design_surface_enabled": True,
        "metadata_readback_enabled": True,
        "simulated_dispatch_envelope_enabled": True,
        "manual_approval_boundary_visible": True,
        "adapter_implementation_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "credential_access_enabled": False,
        "target_mutation_enabled": False,
        "dry_run_execution_enabled": False,
        "dry_run_result_storage_enabled": False,
        "audit_write_enabled": False,
        "nas_save_enabled": False,
        "watcher_daemon_enabled": False,
        "cron_enabled": False,
        "vps_direct_nas_authority_enabled": False,
        "public_exposure_enabled": False,
    }


def build_office_controlled_mutation_dispatcher_authority_metadata_recording_draft(
    *,
    request_id: str | None = None,
    correlation_id: str | None = None,
    authority_ref: str | None = None,
    result_id: str | None = None,
    audit_id: str | None = None,
    recorded_at: str | None = None,
    unsafe_examples: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Prepare safe dry-run result/audit payloads without appending them."""

    _ = unsafe_examples
    errors: list[dict[str, str]] = []
    safe_request_id: str | None = None
    safe_correlation_id: str | None = None
    safe_authority_ref: str | None = None
    safe_result_id: str | None = None
    safe_audit_id: str | None = None
    safe_recorded_at: str | None = None

    if request_id is not None:
        if _is_opaque_id(request_id):
            safe_request_id = request_id
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
    else:
        errors.append(_error("request_id", "missing_field"))
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            safe_correlation_id = correlation_id
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
    else:
        errors.append(_error("correlation_id", "missing_field"))
    if authority_ref is not None:
        if _is_opaque_id(authority_ref):
            safe_authority_ref = authority_ref
        else:
            errors.append(_error("authority_ref", "invalid_opaque_id"))
    if result_id is not None:
        if _is_opaque_id(result_id):
            safe_result_id = result_id
        else:
            errors.append(_error("result_id", "invalid_opaque_id"))
    else:
        errors.append(_error("result_id", "missing_field"))
    if audit_id is not None:
        if _is_opaque_id(audit_id):
            safe_audit_id = audit_id
        else:
            errors.append(_error("audit_id", "invalid_opaque_id"))
    else:
        errors.append(_error("audit_id", "missing_field"))
    if recorded_at is not None:
        if _ISO_UTC_RE.fullmatch(recorded_at):
            safe_recorded_at = recorded_at
        else:
            errors.append(_error("recorded_at", "invalid_timestamp"))
    else:
        errors.append(_error("recorded_at", "missing_field"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    capabilities = _dispatcher_authority_metadata_recording_draft_capabilities()
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "dispatcher_authority_metadata_recording_draft",
        "ready": not errors,
        "dry_run_result_payload": None,
        "audit_payload": None,
        "capabilities": capabilities,
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if safe_request_id is not None:
        response["request_id"] = safe_request_id
    if safe_correlation_id is not None:
        response["correlation_id"] = safe_correlation_id
    if safe_authority_ref is not None:
        response["authority_ref"] = safe_authority_ref
    if errors:
        return response

    assert safe_request_id is not None
    assert safe_correlation_id is not None
    assert safe_result_id is not None
    assert safe_audit_id is not None
    assert safe_recorded_at is not None
    evidence_refs = [f"plan:{safe_request_id}"]
    audit_evidence_refs = [f"dryrun:{safe_result_id}"]
    if safe_authority_ref is not None:
        evidence_refs.append(f"authority:{safe_authority_ref}")
        audit_evidence_refs.append(f"authority:{safe_authority_ref}")

    dry_run_result_payload = {
        "result_id": safe_result_id,
        "request_id": safe_request_id,
        "correlation_id": safe_correlation_id,
        "simulated_by": "actor:dispatcher_authority_dry_run_surface",
        "simulation_status": "passed",
        "safe_summary": "Dispatcher authority dry-run metadata recorded; execution boundary remains closed.",
        "evidence_refs": evidence_refs,
        "completed_at": safe_recorded_at,
    }
    audit_payload = {
        "audit_id": safe_audit_id,
        "request_id": safe_request_id,
        "correlation_id": safe_correlation_id,
        "event_kind": "dry_run_result_recorded",
        "actor_ref": "actor:dispatcher_authority_dry_run_surface",
        "safe_summary": "Dry-run result metadata prepared for manual append only; no dispatch, binding, target mutation, NAS save, daemon, auth access, or public exposure.",
        "evidence_refs": audit_evidence_refs,
        "recorded_at": safe_recorded_at,
    }
    dry_validation = validate_office_controlled_mutation_dry_run_result_event(dry_run_result_payload)
    audit_validation = validate_office_controlled_mutation_audit_event(audit_payload)
    validation_errors: list[dict[str, str]] = []
    if not dry_validation["valid"]:
        validation_errors.append(_error("dry_run_result_payload", "invalid_payload"))
    if not audit_validation["valid"]:
        validation_errors.append(_error("audit_payload", "invalid_payload"))
    if validation_errors:
        response["ready"] = False
        response["errors"] = validation_errors
        return response

    response["dry_run_result_payload"] = dry_run_result_payload
    response["audit_payload"] = audit_payload
    return response


def _dispatcher_authority_metadata_recording_draft_capabilities() -> dict[str, bool]:
    return {
        "metadata_recording_draft_enabled": True,
        "dry_run_result_payload_projection_enabled": True,
        "audit_payload_projection_enabled": True,
        "dry_run_result_storage_enabled": False,
        "audit_write_enabled": False,
        "adapter_implementation_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "credential_access_enabled": False,
        "target_mutation_enabled": False,
        "dry_run_execution_enabled": False,
        "nas_save_enabled": False,
        "watcher_daemon_enabled": False,
        "cron_enabled": False,
        "vps_direct_nas_authority_enabled": False,
        "public_exposure_enabled": False,
    }


def build_office_controlled_mutation_dispatcher_authority_metadata_append_status(
    *,
    request_id: str | None = None,
    correlation_id: str | None = None,
    store_paths: Mapping[str, Path] | None = None,
    limit: int = 25,
) -> dict[str, object]:
    """Read back actual dry-run result/audit metadata append checkpoints safely."""

    errors: list[dict[str, str]] = []
    safe_request_id: str | None = None
    safe_correlation_id: str | None = None
    if request_id is not None:
        if _is_opaque_id(request_id):
            safe_request_id = request_id
        else:
            errors.append(_error("request_id", "invalid_opaque_id"))
    if correlation_id is not None:
        if _is_opaque_id(correlation_id):
            safe_correlation_id = correlation_id
        else:
            errors.append(_error("correlation_id", "invalid_opaque_id"))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    base_response: dict[str, object] = {
        "schema_version": 1,
        "mode": "dispatcher_authority_metadata_append_status",
        "append_checkpoint_complete": False,
        "append_counts": {"dry_run_results": 0, "audit_events": 0},
        "latest_refs": {},
        "next_manual_lane": "human_reviewed_dispatcher_execution_simulation_boundary",
        "capabilities": _dispatcher_authority_metadata_append_status_capabilities(),
        "redaction": dict(_REDACTION_POSTURE),
        "errors": errors,
    }
    if safe_request_id is not None:
        base_response["request_id"] = safe_request_id
    if safe_correlation_id is not None:
        base_response["correlation_id"] = safe_correlation_id
    if errors:
        return base_response

    paths = store_paths or {}
    max_items = max(0, min(limit, 200))
    dry_runs = list_office_controlled_mutation_dry_run_result_events(
        store_path=paths.get("dry_run_results"), limit=max_items, request_id=safe_request_id, correlation_id=safe_correlation_id
    )
    audits = list_office_controlled_mutation_audit_events(
        store_path=paths.get("audit_events"), limit=max_items, request_id=safe_request_id, correlation_id=safe_correlation_id
    )
    counts = {
        "dry_run_results": _safe_count(dry_runs.get("count")),
        "audit_events": _safe_count(audits.get("count")),
    }
    latest_refs: dict[str, str] = {}
    for key, response, ref_field in (
        ("dry_run_result", dry_runs, "result_id"),
        ("audit", audits, "audit_id"),
    ):
        events = response.get("events")
        if isinstance(events, list) and events and isinstance(events[-1], Mapping):
            ref = events[-1].get(ref_field)
            if isinstance(ref, str) and _is_opaque_id(ref):
                latest_refs[key] = ref

    base_response["append_checkpoint_complete"] = counts["dry_run_results"] > 0 and counts["audit_events"] > 0
    base_response["append_counts"] = counts
    base_response["latest_refs"] = latest_refs
    return base_response


_DISPATCHER_EXECUTION_SIMULATION_REQUEST_ID = "req_20260518_1255_dispatcher_execution_simulation"
_DISPATCHER_EXECUTION_SIMULATION_CORRELATION_ID = "corr_20260518_1255_dispatcher_execution_simulation"


def build_office_controlled_mutation_dispatcher_execution_simulation_status(
    *,
    store_paths: Mapping[str, Path] | None = None,
    limit: int = 25,
) -> dict[str, object]:
    """Read back the human-reviewed dispatcher execution simulation checkpoint safely."""

    status = build_office_controlled_mutation_dispatcher_authority_metadata_append_status(
        request_id=_DISPATCHER_EXECUTION_SIMULATION_REQUEST_ID,
        correlation_id=_DISPATCHER_EXECUTION_SIMULATION_CORRELATION_ID,
        store_paths=store_paths,
        limit=limit,
    )
    capabilities_value = status.get("capabilities", {})
    capabilities: dict[str, bool] = dict(capabilities_value) if isinstance(capabilities_value, dict) else {}
    capabilities["simulation_status_readback_enabled"] = True
    return {
        "schema_version": 1,
        "mode": "dispatcher_execution_simulation_status",
        "request_id": _DISPATCHER_EXECUTION_SIMULATION_REQUEST_ID,
        "correlation_id": _DISPATCHER_EXECUTION_SIMULATION_CORRELATION_ID,
        "simulation_checkpoint_complete": bool(status.get("append_checkpoint_complete")),
        "simulation_counts": status.get("append_counts", {"dry_run_results": 0, "audit_events": 0}),
        "latest_refs": status.get("latest_refs", {}),
        "checkpoint_status": "blocked",
        "next_manual_lane": "dispatcher_execution_readback_review_only",
        "capabilities": capabilities,
        "redaction": dict(_REDACTION_POSTURE),
        "errors": status.get("errors", []),
    }


def build_office_controlled_mutation_dispatcher_completion_review_status(
    *,
    store_paths: Mapping[str, Path] | None = None,
    limit: int = 25,
) -> dict[str, object]:
    """Summarize the dispatcher authority handoff chain without enabling execution."""

    simulation_status = build_office_controlled_mutation_dispatcher_execution_simulation_status(
        store_paths=store_paths,
        limit=limit,
    )
    capabilities_value = simulation_status.get("capabilities", {})
    capabilities: dict[str, bool] = dict(capabilities_value) if isinstance(capabilities_value, dict) else {}
    capabilities["completion_review_readback_enabled"] = True
    for key in (
        "dry_run_execution_enabled",
        "adapter_implementation_enabled",
        "adapter_binding_enabled",
        "adapter_dispatch_enabled",
        "credential_access_enabled",
        "target_mutation_enabled",
        "nas_save_enabled",
        "watcher_daemon_enabled",
        "cron_enabled",
        "vps_direct_nas_authority_enabled",
        "public_exposure_enabled",
    ):
        capabilities[key] = False
    counts_value = simulation_status.get("simulation_counts", {"dry_run_results": 0, "audit_events": 0})
    counts: dict[str, int] = dict(counts_value) if isinstance(counts_value, dict) else {"dry_run_results": 0, "audit_events": 0}
    latest_refs_value = simulation_status.get("latest_refs", {})
    latest_refs: dict[str, str] = dict(latest_refs_value) if isinstance(latest_refs_value, dict) else {}
    return {
        "schema_version": 1,
        "mode": "dispatcher_completion_review_status",
        "request_id": _DISPATCHER_EXECUTION_SIMULATION_REQUEST_ID,
        "correlation_id": _DISPATCHER_EXECUTION_SIMULATION_CORRELATION_ID,
        "completion_review_complete": bool(simulation_status.get("simulation_checkpoint_complete")),
        "execution_checkpoint_status": simulation_status.get("checkpoint_status", "unknown"),
        "review_counts": counts,
        "latest_refs": latest_refs,
        "completed_lanes": [
            "dispatcher_authority_dry_run_surface",
            "dispatcher_metadata_recording_draft",
            "dispatcher_metadata_append_checkpoint",
            "dispatcher_execution_simulation_status",
        ],
        "next_manual_lane": "authority_handoff_completion_review_only",
        "capabilities": capabilities,
        "redaction": dict(_REDACTION_POSTURE),
        "errors": simulation_status.get("errors", []),
    }


def build_office_controlled_mutation_target_dispatch_contract_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project the next target-dispatch contract lane without dispatch or mutation."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "target_dispatch_contract_status",
        "target_dispatch_contract_complete": True,
        "source_completion_review_lane": "dispatcher_completion_review_status",
        "next_manual_lane": "target_dispatch_runtime_approval_required",
        "dispatch_options": ["kanban_comment", "status_note", "read_only_projection"],
        "required_dispatch_fields": [
            "dispatch_ref",
            "binding_candidate_ref",
            "authority_candidate_ref",
            "request_ref",
            "decision_ref",
            "target_ref",
            "operation_kind",
            "dry_run_ref",
            "safe_summary",
            "evidence_refs",
            "expires_at",
        ],
        "allowed_operation_kinds": ["comment", "status_note", "read_only_projection"],
        "forbidden_boundaries": [
            "adapter_dispatch",
            "target_mutation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "public_exposure",
        ],
        "capabilities": {
            "target_dispatch_contract_readback_enabled": True,
            "adapter_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "public_exposure_enabled": False,
            "credential_access_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_watcher_cron_contract_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project the watcher/cron scheduler contract without enabling a daemon."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "watcher_cron_contract_status",
        "watcher_cron_contract_complete": True,
        "source_target_dispatch_lane": "target_dispatch_contract_status",
        "next_manual_lane": "watcher_cron_runtime_approval_required",
        "scheduler_options": ["manual_poll", "operator_trigger", "disabled_cron_draft"],
        "required_scheduler_fields": [
            "schedule_ref",
            "dispatch_contract_ref",
            "target_ref",
            "poll_interval_seconds",
            "max_items_per_tick",
            "dry_run_ref",
            "safe_summary",
            "evidence_refs",
            "expires_at",
        ],
        "forbidden_boundaries": [
            "watcher_daemon",
            "cron_job_activation",
            "adapter_dispatch",
            "target_mutation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "public_exposure",
        ],
        "capabilities": {
            "watcher_cron_contract_readback_enabled": True,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "adapter_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "public_exposure_enabled": False,
            "credential_access_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_runtime_activation_review_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Review runtime activation posture while keeping every runtime path disabled."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "runtime_activation_review_status",
        "runtime_activation_review_complete": True,
        "source_watcher_cron_lane": "watcher_cron_contract_status",
        "next_manual_lane": "runtime_activation_still_disabled",
        "reviewed_activation_targets": [
            "watcher_daemon",
            "cron_job_activation",
            "adapter_dispatch",
            "target_mutation",
        ],
        "activation_decisions": {
            "watcher_daemon": "disabled_requires_explicit_runtime_approval",
            "cron_job_activation": "disabled_requires_explicit_runtime_approval",
            "adapter_dispatch": "disabled_requires_explicit_runtime_approval",
            "target_mutation": "disabled_requires_explicit_runtime_approval",
        },
        "forbidden_boundaries": [
            "runtime_activation",
            "watcher_daemon",
            "cron_job_activation",
            "adapter_dispatch",
            "target_mutation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "runtime_activation_review_readback_enabled": True,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "adapter_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_runtime_preflight_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project runtime activation preflight requirements without creating runtime artifacts."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "runtime_preflight_status",
        "runtime_preflight_complete": True,
        "source_runtime_activation_lane": "runtime_activation_review_status",
        "next_manual_lane": "manual_one_shot_runtime_dry_run",
        "preflight_decisions": {
            "systemd_unit_draft": "draft_required_not_created",
            "cron_schedule_draft": "draft_required_not_installed",
            "env_gate": "disabled_by_default_required",
            "rollback_disable_command": "required_before_activation",
            "target_allowlist": "required_before_dispatch",
            "adapter_dry_run": "required_before_dispatch",
            "audit_sink": "metadata_only_required_before_dispatch",
        },
        "readiness": {
            "systemd_unit_ready": False,
            "cron_schedule_ready": False,
            "env_gate_ready": False,
            "rollback_ready": False,
            "target_allowlist_ready": False,
            "adapter_dry_run_ready": False,
            "audit_sink_ready": False,
            "runtime_activation_ready": False,
        },
        "forbidden_boundaries": [
            "watcher_daemon_activation",
            "cron_job_installation",
            "adapter_dispatch",
            "target_mutation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "runtime_preflight_readback_enabled": True,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "adapter_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_manual_one_shot_runtime_dry_run_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project a manual one-shot runtime dry-run lane without executing runtime work."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "manual_one_shot_runtime_dry_run_status",
        "manual_one_shot_runtime_dry_run_complete": True,
        "source_runtime_preflight_lane": "runtime_preflight_status",
        "next_manual_lane": "adapter_binding_dry_run_status",
        "operator_trigger": {
            "trigger_mode": "operator_manual_once",
            "repeat_enabled": False,
            "watcher_daemon_required": False,
            "cron_required": False,
        },
        "dry_run_scope": {
            "metadata_result_write_allowed": True,
            "audit_event_write_allowed": True,
            "runtime_command_execution_allowed": False,
            "adapter_dispatch_allowed": False,
            "target_mutation_allowed": False,
        },
        "metadata_envelope": {
            "request_ref": "req_manual_one_shot_runtime_dry_run",
            "correlation_ref": "corr_manual_one_shot_runtime_dry_run",
            "dry_run_result_ref": "dryrun_manual_one_shot_runtime_dry_run",
            "audit_event_ref": "audit_manual_one_shot_runtime_dry_run",
        },
        "forbidden_boundaries": [
            "watcher_daemon_activation",
            "cron_job_installation",
            "runtime_command_execution",
            "adapter_dispatch",
            "target_mutation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "manual_one_shot_runtime_dry_run_readback_enabled": True,
            "metadata_result_write_enabled": True,
            "audit_event_write_enabled": True,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "adapter_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_adapter_binding_dry_run_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project adapter binding readiness as dry-run metadata without binding or dispatch."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "adapter_binding_dry_run_status",
        "adapter_binding_dry_run_complete": True,
        "source_manual_one_shot_lane": "manual_one_shot_runtime_dry_run_status",
        "next_manual_lane": "human_reviewed_single_dispatch_status",
        "adapter_registry": {
            "registry_readback_enabled": True,
            "candidate_adapter_ref": "adapter_candidate_manual_runtime_dry_run",
            "binding_mode": "dry_run_only",
            "binding_created": False,
            "dispatch_created": False,
        },
        "binding_scope": {
            "adapter_registry_readback_allowed": True,
            "binding_plan_metadata_allowed": True,
            "adapter_binding_allowed": False,
            "adapter_dispatch_allowed": False,
            "target_mutation_allowed": False,
        },
        "forbidden_boundaries": [
            "adapter_binding",
            "adapter_dispatch",
            "runtime_command_execution",
            "target_mutation",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "adapter_binding_dry_run_readback_enabled": True,
            "adapter_registry_readback_enabled": True,
            "binding_plan_metadata_enabled": True,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_human_reviewed_single_dispatch_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project a human-reviewed single-dispatch candidate without dispatching."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "human_reviewed_single_dispatch_status",
        "human_reviewed_single_dispatch_complete": True,
        "source_adapter_binding_lane": "adapter_binding_dry_run_status",
        "next_manual_lane": "explicit_runtime_dispatch_approval",
        "dispatch_candidate": {
            "candidate_ref": "dispatch_candidate_human_reviewed_single",
            "human_review_required": True,
            "human_review_recorded": True,
            "single_dispatch_only": True,
            "dispatch_created": False,
            "target_mutation_created": False,
        },
        "approval_requirements": {
            "operator_review_required": True,
            "adapter_binding_review_required": True,
            "target_allowlist_review_required": True,
            "rollback_review_required": True,
            "runtime_dispatch_approval_granted": False,
        },
        "forbidden_boundaries": [
            "adapter_dispatch",
            "target_mutation",
            "runtime_command_execution",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "human_reviewed_single_dispatch_readback_enabled": True,
            "dispatch_candidate_metadata_enabled": True,
            "approval_requirements_readback_enabled": True,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_explicit_runtime_dispatch_approval_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project explicit runtime dispatch approval readiness without dispatching."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "explicit_runtime_dispatch_approval_status",
        "explicit_runtime_dispatch_approval_complete": True,
        "source_human_review_lane": "human_reviewed_single_dispatch_status",
        "next_manual_lane": "concrete_runtime_single_dispatch_slice",
        "approval_status": {
            "explicit_runtime_dispatch_approval_recorded": False,
            "operator_final_approval_required": True,
            "single_dispatch_scope_locked": True,
            "target_allowlist_locked": False,
            "rollback_plan_locked": False,
            "dry_run_evidence_locked": False,
            "automation_activation_requested": False,
        },
        "runtime_boundary": {
            "runtime_dispatch_ready": False,
            "adapter_dispatch_created": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
            "approval_status_only": True,
        },
        "forbidden_boundaries": [
            "adapter_dispatch",
            "target_mutation",
            "runtime_command_execution",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "explicit_runtime_dispatch_approval_readback_enabled": True,
            "approval_criteria_readback_enabled": True,
            "runtime_boundary_readback_enabled": True,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_concrete_runtime_single_dispatch_slice_design(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project a concrete single-dispatch slice design without dispatching."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "concrete_runtime_single_dispatch_slice_design",
        "concrete_runtime_single_dispatch_slice_design_complete": True,
        "source_approval_lane": "explicit_runtime_dispatch_approval_status",
        "next_manual_lane": "approved_one_shot_runtime_dispatch",
        "one_shot_envelope": {
            "single_dispatch_only": True,
            "operator_confirmation_required": True,
            "runtime_dispatch_created": False,
            "runtime_command_included": False,
            "adapter_dispatch_created": False,
            "target_mutation_created": False,
        },
        "target_allowlist": {
            "allowlist_required": True,
            "allowlist_locked": False,
            "opaque_target_refs_only": True,
            "raw_paths_excluded": True,
        },
        "rollback_plan": {
            "rollback_required": True,
            "disable_command_required": True,
            "rollback_verified": False,
            "service_restart_required": False,
        },
        "dry_run_evidence_requirements": {
            "dry_run_result_required": True,
            "audit_event_required": True,
            "human_review_required": True,
            "evidence_locked": False,
        },
        "idempotency": {
            "idempotency_key_required": True,
            "idempotency_key_issued": False,
            "repeat_dispatch_blocked": True,
        },
        "disabled_runtime_gate": {
            "disabled_by_default": True,
            "runtime_gate_open": False,
            "automation_activation_requested": False,
            "watcher_or_cron_allowed": False,
        },
        "forbidden_boundaries": [
            "adapter_dispatch",
            "target_mutation",
            "runtime_command_execution",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "single_dispatch_slice_design_readback_enabled": True,
            "one_shot_envelope_metadata_enabled": True,
            "target_allowlist_readback_enabled": True,
            "rollback_plan_readback_enabled": True,
            "dry_run_evidence_requirements_readback_enabled": True,
            "idempotency_key_readback_enabled": True,
            "disabled_runtime_gate_readback_enabled": True,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_disabled_one_shot_runtime_dispatch_executor_skeleton(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project a disabled one-shot executor skeleton without executing."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "disabled_one_shot_runtime_dispatch_executor_skeleton",
        "disabled_one_shot_runtime_dispatch_executor_skeleton_complete": True,
        "source_design_lane": "concrete_runtime_single_dispatch_slice_design",
        "next_manual_lane": "approved_one_shot_runtime_dispatch_execution",
        "executor_gate": {
            "disabled_by_default": True,
            "runtime_gate_open": False,
            "execution_endpoint_present": True,
            "execution_refuses_by_default": True,
            "actual_dispatch_approved": False,
        },
        "required_inputs": {
            "exact_target_allowlist_required": True,
            "idempotency_key_required": True,
            "rollback_disable_plan_required": True,
            "dry_run_evidence_required": True,
            "operator_final_confirmation_required": True,
        },
        "execution_boundary": {
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "adapter_binding_created": False,
            "adapter_dispatch_created": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
            "refusal_validation_only": True,
        },
        "contract_hardening": {
            "exact_target_allowlist_schema_enabled": True,
            "idempotency_key_format_check_enabled": True,
            "idempotency_replay_metadata_enabled": True,
            "rollback_disable_plan_ref_check_enabled": True,
            "dry_run_evidence_ref_check_enabled": True,
            "operator_final_confirmation_metadata_enabled": True,
            "refusal_only_default": True,
        },
        "ref_patterns": {
            "exact_target_allowlist_ref_prefix": "allowlist-",
            "rollback_plan_ref_prefix": "rollback-",
            "dry_run_evidence_ref_prefix": "dryrun-",
            "idempotency_key_prefix": "idem-",
        },
        "forbidden_boundaries": [
            "runtime_command_execution",
            "adapter_binding",
            "adapter_dispatch",
            "target_mutation",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "disabled_executor_skeleton_readback_enabled": True,
            "refusal_validation_enabled": True,
            "execution_endpoint_present": True,
            "contract_hardening_readback_enabled": True,
            "idempotency_replay_block_metadata_enabled": True,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "runtime_command_execution_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def _office_disabled_runtime_dispatch_valid_prefixed_ref(value: object, prefix: str) -> bool:
    if not isinstance(value, str):
        return False
    if not value.startswith(prefix):
        return False
    if not 6 <= len(value) <= 80:
        return False
    suffix = value[len(prefix):]
    return bool(suffix) and all(char.isalnum() or char in {"-", "_"} for char in suffix)


def refuse_office_controlled_mutation_disabled_one_shot_runtime_dispatch(
    payload: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Refuse a would-be one-shot dispatch while returning only safe validation metadata."""

    body = payload if isinstance(payload, Mapping) else {}
    exact_target_allowlist_ref = body.get("exact_target_allowlist_ref")
    idempotency_key = body.get("idempotency_key")
    rollback_plan_ref = body.get("rollback_plan_ref")
    dry_run_evidence_ref = body.get("dry_run_evidence_ref")
    operator_confirmation = body.get("operator_confirmation")
    safe_validation = {
        "exact_target_allowlist_present": bool(exact_target_allowlist_ref),
        "exact_target_allowlist_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(exact_target_allowlist_ref, "allowlist-"),
        "idempotency_key_present": bool(idempotency_key),
        "idempotency_key_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(idempotency_key, "idem-"),
        "idempotency_replay_seen": False,
        "rollback_disable_plan_present": bool(rollback_plan_ref),
        "rollback_disable_plan_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(rollback_plan_ref, "rollback-"),
        "dry_run_evidence_present": bool(dry_run_evidence_ref),
        "dry_run_evidence_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(dry_run_evidence_ref, "dryrun-"),
        "operator_confirmation_present": operator_confirmation is not None,
        "operator_confirmation_valid": operator_confirmation is True,
    }
    missing = []
    validation_errors: list[dict[str, str]] = []
    validation_specs = [
        ("exact_target_allowlist_ref", "exact_target_allowlist", safe_validation["exact_target_allowlist_present"], safe_validation["exact_target_allowlist_valid"]),
        ("idempotency_key", "idempotency_key", safe_validation["idempotency_key_present"], safe_validation["idempotency_key_valid"]),
        ("rollback_plan_ref", "rollback_disable_plan", safe_validation["rollback_disable_plan_present"], safe_validation["rollback_disable_plan_valid"]),
        ("dry_run_evidence_ref", "dry_run_evidence", safe_validation["dry_run_evidence_present"], safe_validation["dry_run_evidence_valid"]),
    ]
    for field, requirement, present, valid in validation_specs:
        if not present:
            missing.append(requirement)
            validation_errors.append({"field": field, "code": "required"})
        elif not valid:
            validation_errors.append({"field": field, "code": "unsupported_ref_shape"})
    if not safe_validation["operator_confirmation_present"]:
        missing.append("operator_confirmation")
        validation_errors.append({"field": "operator_confirmation", "code": "required"})
    elif not safe_validation["operator_confirmation_valid"]:
        validation_errors.append({"field": "operator_confirmation", "code": "unsupported_confirmation"})
    return {
        "schema_version": 1,
        "mode": "disabled_one_shot_runtime_dispatch_executor_refusal",
        "accepted": False,
        "dispatch_created": False,
        "runtime_command_executed": False,
        "target_mutation_created": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "watcher_or_cron_created": False,
        "refusal_code": "runtime_dispatch_disabled_by_default",
        "safe_validation": safe_validation,
        "validation_errors": validation_errors,
        "missing_requirements": missing,
        "capabilities": {
            "refusal_validation_enabled": True,
            "runtime_command_execution_enabled": False,
            "target_mutation_enabled": False,
            "adapter_dispatch_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def build_office_controlled_mutation_approved_real_one_shot_dispatch_gate_design(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project the real-dispatch approval gate design without approving or executing."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "approved_real_one_shot_dispatch_gate_design",
        "approved_real_one_shot_dispatch_gate_design_complete": True,
        "source_design_lane": "disabled_executor_contract_hardening",
        "next_manual_lane": "manual_real_one_shot_dispatch_gate_approval",
        "approval_gate": {
            "approval_record_required": True,
            "exact_target_allowlist_required": True,
            "rollback_disable_switch_required": True,
            "idempotency_replay_store_required": True,
            "operator_final_confirmation_required": True,
            "runtime_gate_still_disabled_by_default": True,
            "approval_recorded": False,
        },
        "runtime_command_envelope": {
            "runtime_command_shape_defined": True,
            "runtime_command_materialized": False,
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "command_args_echoed": False,
        },
        "replay_store": {
            "idempotency_key_format_required": True,
            "replay_lookup_required": True,
            "replay_write_required_after_success": True,
            "replay_store_bound": False,
            "replay_state_mutated": False,
        },
        "rollback_disable": {
            "disable_switch_required": True,
            "rollback_plan_ref_required": True,
            "rollback_verified_before_dispatch_required": True,
            "disable_switch_bound": False,
            "rollback_executed": False,
        },
        "execution_boundary": {
            "design_only": True,
            "dispatch_gate_open": False,
            "approval_record_written": False,
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "adapter_binding_created": False,
            "adapter_dispatch_created": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
        },
        "forbidden_boundaries": [
            "approval_recording",
            "runtime_command_materialization",
            "runtime_command_execution",
            "adapter_binding",
            "adapter_dispatch",
            "idempotency_replay_store_write",
            "rollback_execution",
            "target_mutation",
            "watcher_daemon_activation",
            "cron_job_installation",
            "kanban_mutation",
            "nas_save",
            "vps_file_change",
            "service_restart",
            "git_push",
            "credential_access",
            "public_exposure",
        ],
        "capabilities": {
            "approved_gate_design_readback_enabled": True,
            "real_dispatch_execution_enabled": False,
            "approval_recording_enabled": False,
            "runtime_command_materialization_enabled": False,
            "runtime_command_execution_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "target_mutation_enabled": False,
            "watcher_daemon_enabled": False,
            "cron_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }



def _default_approval_recording_draft_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "approval_record_drafts.jsonl"


def _approval_recording_draft_capabilities() -> dict[str, bool]:
    return {
        "approval_record_draft_storage_enabled": True,
        "approval_record_draft_readback_enabled": True,
        "draft_duplicate_detection_enabled": True,
        "approval_recording_enabled": False,
        "real_dispatch_execution_enabled": False,
        "dispatch_gate_open": False,
        "runtime_command_materialization_enabled": False,
        "runtime_command_execution_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "idempotency_replay_store_write_enabled": False,
        "rollback_execution_enabled": False,
        "target_mutation_enabled": False,
        "kanban_mutation_enabled": False,
        "nas_save_enabled": False,
        "vps_file_change_enabled": False,
        "service_restart_enabled": False,
        "git_push_enabled": False,
        "credential_access_enabled": False,
        "public_exposure_enabled": False,
    }


def validate_office_controlled_mutation_manual_approval_recording_draft(payload: object) -> dict[str, object]:
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    for field in sorted(_APPROVAL_RECORDING_DRAFT_FIELDS):
        if field not in payload:
            errors.append(_error(field, "required"))
    for field in sorted(set(payload) - _APPROVAL_RECORDING_DRAFT_FIELDS):
        _ = field

    ref_specs = (
        ("approval_record_ref", "approval-"),
        ("exact_target_allowlist_ref", "allowlist-"),
        ("idempotency_key", "idem-"),
        ("replay_lookup_ref", "replay-"),
        ("rollback_disable_ref", "rollback-"),
        ("dry_run_evidence_ref", "dryrun-"),
    )
    for field, prefix in ref_specs:
        if field in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get(field), prefix):
            errors.append(_error(field, "unsupported_ref_shape"))
    if "operator_confirmation" in payload and payload.get("operator_confirmation") != "confirmed-draft-record-only":
        errors.append(_error("operator_confirmation", "unsupported_confirmation"))
    if "requested_by" in payload and not _is_opaque_ref(payload.get("requested_by")):
        errors.append(_error("requested_by", "invalid_opaque_ref"))
    if "requested_at" in payload and not (
        isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])
    ):
        errors.append(_error("requested_at", "invalid_timestamp"))
    if "safe_summary" in payload and not _is_safe_text(payload.get("safe_summary")):
        errors.append(_error("safe_summary", "invalid_safe_text"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "stored_manual_approval_recording_draft",
        "draft_status": "draft_only",
        "approval_record_ref": payload["approval_record_ref"],
        "exact_target_allowlist_ref": payload["exact_target_allowlist_ref"],
        "idempotency_key": payload["idempotency_key"],
        "replay_lookup_ref": payload["replay_lookup_ref"],
        "rollback_disable_ref": payload["rollback_disable_ref"],
        "dry_run_evidence_ref": payload["dry_run_evidence_ref"],
        "operator_confirmation": "confirmed-draft-record-only",
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "approval_record_written": False,
        "dispatch_gate_open": False,
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "idempotency_replay_store_written": False,
        "rollback_executed": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "capabilities": _approval_recording_draft_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}


def _normalize_stored_approval_recording_draft(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _APPROVAL_RECORDING_DRAFT_FIELDS if field in item}
    validation = validate_office_controlled_mutation_manual_approval_recording_draft(payload)
    if not validation["valid"]:
        return None
    return cast(dict[str, object], validation["dto"])


def _read_approval_recording_draft_store(path: Path) -> tuple[list[dict[str, object]], int]:
    drafts: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return drafts, skipped_count
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_approval_recording_draft(item)
            if normalized is None:
                skipped_count += 1
                continue
            drafts.append(normalized)
    return drafts, skipped_count


def append_office_controlled_mutation_manual_approval_recording_draft(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    validation = validate_office_controlled_mutation_manual_approval_recording_draft(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}
    dto = cast(dict[str, object], validation["dto"])
    path = store_path or _default_approval_recording_draft_store_path()
    existing, _ = _read_approval_recording_draft_store(path)
    if any(item.get("approval_record_ref") == dto["approval_record_ref"] for item in existing):
        return {"stored": False, "errors": [_error("approval_record_ref", "duplicate_approval_record_ref")], "dto": None}
    if any(item.get("idempotency_key") == dto["idempotency_key"] for item in existing):
        return {"stored": False, "errors": [_error("idempotency_key", "duplicate_idempotency_key")], "dto": None}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_manual_approval_recording_drafts(
    *, store_path: Path | None = None, limit: int = 50, approval_record_ref: str | None = None
) -> dict[str, object]:
    path = store_path or _default_approval_recording_draft_store_path()
    errors: list[dict[str, str]] = []
    drafts, skipped_count = _read_approval_recording_draft_store(path)
    if approval_record_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_record_ref, "approval-"):
            drafts = [item for item in drafts if item.get("approval_record_ref") == approval_record_ref]
        else:
            errors.append(_error("approval_record_ref", "unsupported_ref_shape"))
            drafts = []
    max_items = max(0, min(limit, 200))
    drafts = drafts[-max_items:] if max_items else []
    latest_refs: dict[str, str] = {}
    if drafts:
        latest = drafts[-1]
        for key in ("approval_record_ref", "idempotency_key"):
            value = latest.get(key)
            if isinstance(value, str):
                latest_refs[key] = value
    return {
        "schema_version": 1,
        "mode": "stored_manual_approval_recording_drafts_readback",
        "draft_count": len(drafts),
        "limit": max_items,
        "skipped_count": skipped_count,
        "drafts": drafts,
        "latest_refs": latest_refs,
        "capabilities": _approval_recording_draft_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": errors,
    }


def _default_approval_record_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "approval_records.jsonl"


def _default_dispatch_gate_open_record_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "dispatch_gate_open_records.jsonl"


def _default_runtime_command_preview_record_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "runtime_command_preview_records.jsonl"


def _runtime_command_preview_record_capabilities() -> dict[str, bool]:
    capabilities = _dispatch_gate_open_record_capabilities()
    capabilities.update(
        {
            "runtime_command_preview_record_storage_enabled": True,
            "runtime_command_preview_record_readback_enabled": True,
            "runtime_command_preview_enabled": True,
            "runtime_command_materialization_enabled": False,
            "runtime_command_execution_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
            "real_dispatch_execution_enabled": False,
        }
    )
    return capabilities


def _dispatch_gate_open_record_capabilities() -> dict[str, bool]:
    capabilities = _approval_record_capabilities()
    capabilities.update(
        {
            "dispatch_gate_open_record_storage_enabled": True,
            "dispatch_gate_open_record_readback_enabled": True,
            "dispatch_gate_open": True,
            "runtime_command_materialization_enabled": False,
            "runtime_command_execution_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
            "real_dispatch_execution_enabled": False,
        }
    )
    return capabilities


def _approval_record_capabilities() -> dict[str, bool]:
    capabilities = _approval_recording_draft_capabilities()
    capabilities.update(
        {
            "approval_record_storage_enabled": True,
            "approval_record_readback_enabled": True,
            "approval_recording_enabled": True,
            "dispatch_gate_open": False,
            "real_dispatch_execution_enabled": False,
            "runtime_command_materialization_enabled": False,
            "runtime_command_execution_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        }
    )
    return capabilities


def validate_office_controlled_mutation_manual_approval_record(payload: object, *, source_draft: Mapping[str, object]) -> dict[str, object]:
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    for field in sorted(_APPROVAL_RECORD_FIELDS):
        if field not in payload:
            errors.append(_error(field, "required"))
    for field in sorted(set(payload) - _APPROVAL_RECORD_FIELDS):
        _ = field

    if "approval_record_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("approval_record_ref"), "approval-"):
        errors.append(_error("approval_record_ref", "unsupported_ref_shape"))
    if "approval_record_ref" in payload and payload.get("approval_record_ref") != source_draft.get("approval_record_ref"):
        errors.append(_error("approval_record_ref", "draft_mismatch"))
    if "operator_confirmation" in payload and payload.get("operator_confirmation") != "confirmed-real-approval-record-write-only":
        errors.append(_error("operator_confirmation", "unsupported_confirmation"))
    if "approved_by" in payload and not _is_opaque_ref(payload.get("approved_by")):
        errors.append(_error("approved_by", "invalid_opaque_ref"))
    if "approved_at" in payload and not (
        isinstance(payload.get("approved_at"), str) and _ISO_UTC_RE.fullmatch(payload["approved_at"])
    ):
        errors.append(_error("approved_at", "invalid_timestamp"))
    if "approval_evidence_refs" in payload and not _validate_evidence_refs(payload.get("approval_evidence_refs")):
        errors.append(_error("approval_evidence_refs", "invalid_opaque_ref"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "stored_manual_approval_record",
        "approval_status": "recorded_manual_approval",
        "source_draft_status": source_draft.get("draft_status"),
        "approval_record_ref": payload["approval_record_ref"],
        "idempotency_key": source_draft.get("idempotency_key"),
        "exact_target_allowlist_ref": source_draft.get("exact_target_allowlist_ref"),
        "replay_lookup_ref": source_draft.get("replay_lookup_ref"),
        "rollback_disable_ref": source_draft.get("rollback_disable_ref"),
        "dry_run_evidence_ref": source_draft.get("dry_run_evidence_ref"),
        "approved_by": payload["approved_by"],
        "approved_at": payload["approved_at"],
        "approval_evidence_refs": list(payload["approval_evidence_refs"]),
        "approval_record_written": True,
        "dispatch_gate_open": False,
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "idempotency_replay_store_written": False,
        "rollback_executed": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "kanban_mutation_created": False,
        "nas_save_created": False,
        "vps_file_change_created": False,
        "capabilities": _approval_record_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}


def _normalize_stored_approval_record(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    if item.get("mode") != "stored_manual_approval_record":
        return None
    required = {
        "schema_version",
        "mode",
        "approval_status",
        "approval_record_ref",
        "approval_record_written",
        "dispatch_gate_open",
        "runtime_command_executed",
        "target_mutation_created",
        "capabilities",
        "redaction",
    }
    if not required.issubset(set(item)):
        return None
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(item.get("approval_record_ref"), "approval-"):
        return None
    return dict(item)


def _read_approval_record_store(path: Path) -> tuple[list[dict[str, object]], int]:
    records: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return records, skipped_count
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_approval_record(item)
            if normalized is None:
                skipped_count += 1
                continue
            records.append(normalized)
    return records, skipped_count


def append_office_controlled_mutation_manual_approval_record(
    payload: object, *, draft_store_path: Path | None = None, store_path: Path | None = None
) -> dict[str, object]:
    if not isinstance(payload, Mapping):
        return {"stored": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    approval_ref = payload.get("approval_record_ref")
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_ref, "approval-"):
        return {"stored": False, "errors": [_error("approval_record_ref", "unsupported_ref_shape")], "dto": None}
    draft_readback = list_office_controlled_mutation_manual_approval_recording_drafts(
        store_path=draft_store_path,
        approval_record_ref=cast(str, approval_ref),
        limit=1,
    )
    drafts = cast(list[dict[str, object]], draft_readback.get("drafts", []))
    if not drafts:
        return {"stored": False, "errors": [_error("approval_record_ref", "draft_not_found")], "dto": None}
    validation = validate_office_controlled_mutation_manual_approval_record(payload, source_draft=drafts[-1])
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}
    dto = cast(dict[str, object], validation["dto"])
    path = store_path or _default_approval_record_store_path()
    existing, _ = _read_approval_record_store(path)
    if any(item.get("approval_record_ref") == dto["approval_record_ref"] for item in existing):
        return {"stored": False, "errors": [_error("approval_record_ref", "duplicate_approval_record_ref")], "dto": None}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_manual_approval_records(
    *, store_path: Path | None = None, limit: int = 50, approval_record_ref: str | None = None
) -> dict[str, object]:
    path = store_path or _default_approval_record_store_path()
    errors: list[dict[str, str]] = []
    records, skipped_count = _read_approval_record_store(path)
    if approval_record_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_record_ref, "approval-"):
            records = [item for item in records if item.get("approval_record_ref") == approval_record_ref]
        else:
            errors.append(_error("approval_record_ref", "unsupported_ref_shape"))
            records = []
    max_items = max(0, min(limit, 200))
    records = records[-max_items:] if max_items else []
    latest_refs: dict[str, str] = {}
    if records:
        latest = records[-1]
        for key in ("approval_record_ref", "idempotency_key"):
            value = latest.get(key)
            if isinstance(value, str):
                latest_refs[key] = value
    return {
        "schema_version": 1,
        "mode": "stored_manual_approval_records_readback",
        "approval_record_count": len(records),
        "limit": max_items,
        "skipped_count": skipped_count,
        "records": records,
        "latest_refs": latest_refs,
        "capabilities": _approval_record_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": errors,
    }


def build_office_controlled_mutation_manual_approval_dispatch_gate_readiness_status(
    *,
    approval_store_path: Path | None = None,
    approval_record_ref: str | None = None,
    unsafe_examples: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Project dispatch-gate readiness from a bounded approval record without opening the gate."""
    _ = unsafe_examples
    readback = list_office_controlled_mutation_manual_approval_records(
        store_path=approval_store_path,
        approval_record_ref=approval_record_ref,
        limit=1,
    )
    records = cast(list[dict[str, object]], readback.get("records", []))
    latest = records[-1] if records else None
    approval_present = latest is not None
    return {
        "schema_version": 1,
        "mode": "manual_approval_dispatch_gate_readiness_status",
        "manual_approval_dispatch_gate_readiness_complete": approval_present,
        "source_design_lane": "manual_approval_record_write_gate",
        "next_manual_lane": "separate_dispatch_gate_open_boundary",
        "readiness": {
            "approval_record_present": approval_present,
            "approval_record_written": bool(latest.get("approval_record_written")) if latest else False,
            "ready_for_dispatch_gate_open": False,
            "ready_for_runtime_dispatch_execution": False,
            "exact_target_allowlist_ref": latest.get("exact_target_allowlist_ref") if latest else None,
            "idempotency_key": latest.get("idempotency_key") if latest else None,
            "replay_lookup_ref": latest.get("replay_lookup_ref") if latest else None,
            "rollback_disable_ref": latest.get("rollback_disable_ref") if latest else None,
            "dry_run_evidence_ref": latest.get("dry_run_evidence_ref") if latest else None,
            "approval_record_ref": latest.get("approval_record_ref") if latest else None,
        },
        "readback": {
            "approval_record_count": readback.get("approval_record_count", 0),
            "latest_refs": readback.get("latest_refs", {}),
            "skipped_count": readback.get("skipped_count", 0),
        },
        "execution_boundary": {
            "approval_record_written": bool(latest.get("approval_record_written")) if latest else False,
            "dispatch_gate_open": False,
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "adapter_binding_created": False,
            "adapter_dispatch_created": False,
            "idempotency_replay_store_written": False,
            "rollback_executed": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
            "kanban_mutation_created": False,
            "nas_save_created": False,
            "vps_file_change_created": False,
        },
        "capabilities": _approval_record_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": readback.get("errors", []),
    }


def validate_office_controlled_mutation_manual_dispatch_gate_open_record(payload: object, *, source_approval: Mapping[str, object]) -> dict[str, object]:
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    for field in sorted(_DISPATCH_GATE_OPEN_RECORD_FIELDS):
        if field not in payload:
            errors.append(_error(field, "required"))
    for field in sorted(set(payload) - _DISPATCH_GATE_OPEN_RECORD_FIELDS):
        _ = field

    if "approval_record_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("approval_record_ref"), "approval-"):
        errors.append(_error("approval_record_ref", "unsupported_ref_shape"))
    if "approval_record_ref" in payload and payload.get("approval_record_ref") != source_approval.get("approval_record_ref"):
        errors.append(_error("approval_record_ref", "approval_record_mismatch"))
    if "dispatch_gate_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("dispatch_gate_ref"), "gate-"):
        errors.append(_error("dispatch_gate_ref", "unsupported_ref_shape"))
    if "operator_confirmation" in payload and payload.get("operator_confirmation") != "confirmed-dispatch-gate-open-metadata-only":
        errors.append(_error("operator_confirmation", "unsupported_confirmation"))
    if "opened_by" in payload and not _is_opaque_ref(payload.get("opened_by")):
        errors.append(_error("opened_by", "invalid_opaque_ref"))
    if "opened_at" in payload and not (
        isinstance(payload.get("opened_at"), str) and _ISO_UTC_RE.fullmatch(payload["opened_at"])
    ):
        errors.append(_error("opened_at", "invalid_timestamp"))
    if "gate_evidence_refs" in payload and not _validate_evidence_refs(payload.get("gate_evidence_refs")):
        errors.append(_error("gate_evidence_refs", "invalid_opaque_ref"))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "stored_manual_dispatch_gate_open_record",
        "gate_status": "dispatch_gate_open_metadata_only",
        "approval_record_ref": payload["approval_record_ref"],
        "dispatch_gate_ref": payload["dispatch_gate_ref"],
        "idempotency_key": source_approval.get("idempotency_key"),
        "exact_target_allowlist_ref": source_approval.get("exact_target_allowlist_ref"),
        "replay_lookup_ref": source_approval.get("replay_lookup_ref"),
        "rollback_disable_ref": source_approval.get("rollback_disable_ref"),
        "dry_run_evidence_ref": source_approval.get("dry_run_evidence_ref"),
        "opened_by": payload["opened_by"],
        "opened_at": payload["opened_at"],
        "gate_evidence_refs": list(payload["gate_evidence_refs"]),
        "approval_record_written": True,
        "dispatch_gate_open": True,
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "idempotency_replay_store_written": False,
        "rollback_executed": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "kanban_mutation_created": False,
        "nas_save_created": False,
        "vps_file_change_created": False,
        "real_dispatch_execution_enabled": False,
        "capabilities": _dispatch_gate_open_record_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}


def _normalize_stored_dispatch_gate_open_record(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    if item.get("mode") != "stored_manual_dispatch_gate_open_record":
        return None
    required = {
        "schema_version",
        "mode",
        "gate_status",
        "approval_record_ref",
        "dispatch_gate_ref",
        "approval_record_written",
        "dispatch_gate_open",
        "runtime_command_executed",
        "target_mutation_created",
        "capabilities",
        "redaction",
    }
    if not required.issubset(set(item)):
        return None
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(item.get("approval_record_ref"), "approval-"):
        return None
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(item.get("dispatch_gate_ref"), "gate-"):
        return None
    return dict(item)


def _read_dispatch_gate_open_record_store(path: Path) -> tuple[list[dict[str, object]], int]:
    records: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return records, skipped_count
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_dispatch_gate_open_record(item)
            if normalized is None:
                skipped_count += 1
                continue
            records.append(normalized)
    return records, skipped_count


def append_office_controlled_mutation_manual_dispatch_gate_open_record(
    payload: object, *, approval_store_path: Path | None = None, store_path: Path | None = None
) -> dict[str, object]:
    if not isinstance(payload, Mapping):
        return {"stored": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    approval_ref = payload.get("approval_record_ref")
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_ref, "approval-"):
        return {"stored": False, "errors": [_error("approval_record_ref", "unsupported_ref_shape")], "dto": None}
    approval_readback = list_office_controlled_mutation_manual_approval_records(
        store_path=approval_store_path,
        approval_record_ref=cast(str, approval_ref),
        limit=1,
    )
    approvals = cast(list[dict[str, object]], approval_readback.get("records", []))
    if not approvals:
        return {"stored": False, "errors": [_error("approval_record_ref", "approval_record_not_found")], "dto": None}
    validation = validate_office_controlled_mutation_manual_dispatch_gate_open_record(payload, source_approval=approvals[-1])
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}
    dto = cast(dict[str, object], validation["dto"])
    path = store_path or _default_dispatch_gate_open_record_store_path()
    existing, _ = _read_dispatch_gate_open_record_store(path)
    if any(item.get("dispatch_gate_ref") == dto["dispatch_gate_ref"] for item in existing):
        return {"stored": False, "errors": [_error("dispatch_gate_ref", "duplicate_dispatch_gate_ref")], "dto": None}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_manual_dispatch_gate_open_records(
    *, store_path: Path | None = None, limit: int = 50, dispatch_gate_ref: str | None = None, approval_record_ref: str | None = None
) -> dict[str, object]:
    path = store_path or _default_dispatch_gate_open_record_store_path()
    errors: list[dict[str, str]] = []
    records, skipped_count = _read_dispatch_gate_open_record_store(path)
    if dispatch_gate_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(dispatch_gate_ref, "gate-"):
            records = [item for item in records if item.get("dispatch_gate_ref") == dispatch_gate_ref]
        else:
            errors.append(_error("dispatch_gate_ref", "unsupported_ref_shape"))
            records = []
    if approval_record_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_record_ref, "approval-"):
            records = [item for item in records if item.get("approval_record_ref") == approval_record_ref]
        else:
            errors.append(_error("approval_record_ref", "unsupported_ref_shape"))
            records = []
    max_items = max(0, min(limit, 200))
    records = records[-max_items:] if max_items else []
    latest_refs: dict[str, str] = {}
    if records:
        latest = records[-1]
        for key in ("dispatch_gate_ref", "approval_record_ref", "idempotency_key"):
            value = latest.get(key)
            if isinstance(value, str):
                latest_refs[key] = value
    return {
        "schema_version": 1,
        "mode": "stored_manual_dispatch_gate_open_records_readback",
        "dispatch_gate_open_record_count": len(records),
        "limit": max_items,
        "skipped_count": skipped_count,
        "records": records,
        "latest_refs": latest_refs,
        "capabilities": _dispatch_gate_open_record_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": errors,
    }


def _build_runtime_command_preview_checksum(dto: Mapping[str, object]) -> str:
    safe_projection = {
        "dispatch_gate_ref": dto.get("dispatch_gate_ref"),
        "runtime_command_preview_ref": dto.get("runtime_command_preview_ref"),
        "command_envelope_ref": dto.get("command_envelope_ref"),
        "command_intent_ref": dto.get("command_intent_ref"),
        "idempotency_key": dto.get("idempotency_key"),
        "exact_target_allowlist_ref": dto.get("exact_target_allowlist_ref"),
        "rollback_disable_ref": dto.get("rollback_disable_ref"),
        "dry_run_evidence_ref": dto.get("dry_run_evidence_ref"),
    }
    payload = json.dumps(safe_projection, sort_keys=True, separators=(",", ":")).encode("utf-8")
    return hashlib.sha256(payload).hexdigest()


def validate_office_controlled_mutation_manual_runtime_command_preview_record(payload: object, *, source_gate: Mapping[str, object]) -> dict[str, object]:
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    for field in sorted(_RUNTIME_COMMAND_PREVIEW_RECORD_FIELDS):
        if field not in payload:
            errors.append(_error(field, "required"))
    for field in sorted(set(payload) - _RUNTIME_COMMAND_PREVIEW_RECORD_FIELDS):
        _ = field

    if "dispatch_gate_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("dispatch_gate_ref"), "gate-"):
        errors.append(_error("dispatch_gate_ref", "unsupported_ref_shape"))
    if "dispatch_gate_ref" in payload and payload.get("dispatch_gate_ref") != source_gate.get("dispatch_gate_ref"):
        errors.append(_error("dispatch_gate_ref", "dispatch_gate_mismatch"))
    if "runtime_command_preview_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("runtime_command_preview_ref"), "cmdpreview-"):
        errors.append(_error("runtime_command_preview_ref", "unsupported_ref_shape"))
    if "command_envelope_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("command_envelope_ref"), "envelope-"):
        errors.append(_error("command_envelope_ref", "unsupported_ref_shape"))
    if "command_intent_ref" in payload and not _office_disabled_runtime_dispatch_valid_prefixed_ref(payload.get("command_intent_ref"), "intent-"):
        errors.append(_error("command_intent_ref", "unsupported_ref_shape"))
    if "operator_confirmation" in payload and payload.get("operator_confirmation") != "confirmed-runtime-command-preview-only":
        errors.append(_error("operator_confirmation", "unsupported_confirmation"))
    if "materialized_by" in payload and not _is_opaque_ref(payload.get("materialized_by")):
        errors.append(_error("materialized_by", "invalid_opaque_ref"))
    if "materialized_at" in payload and not (
        isinstance(payload.get("materialized_at"), str) and _ISO_UTC_RE.fullmatch(payload["materialized_at"])
    ):
        errors.append(_error("materialized_at", "invalid_timestamp"))
    if "preview_evidence_refs" in payload and not _validate_evidence_refs(payload.get("preview_evidence_refs")):
        errors.append(_error("preview_evidence_refs", "invalid_opaque_ref"))
    if not bool(source_gate.get("dispatch_gate_open")):
        errors.append(_error("dispatch_gate_ref", "dispatch_gate_not_open"))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "stored_manual_runtime_command_preview_record",
        "preview_status": "runtime_command_preview_only",
        "dispatch_gate_ref": payload["dispatch_gate_ref"],
        "runtime_command_preview_ref": payload["runtime_command_preview_ref"],
        "command_envelope_ref": payload["command_envelope_ref"],
        "command_intent_ref": payload["command_intent_ref"],
        "approval_record_ref": source_gate.get("approval_record_ref"),
        "idempotency_key": source_gate.get("idempotency_key"),
        "exact_target_allowlist_ref": source_gate.get("exact_target_allowlist_ref"),
        "replay_lookup_ref": source_gate.get("replay_lookup_ref"),
        "rollback_disable_ref": source_gate.get("rollback_disable_ref"),
        "dry_run_evidence_ref": source_gate.get("dry_run_evidence_ref"),
        "materialized_by": payload["materialized_by"],
        "materialized_at": payload["materialized_at"],
        "preview_evidence_refs": list(payload["preview_evidence_refs"]),
        "approval_record_written": True,
        "dispatch_gate_open": True,
        "runtime_command_preview_created": True,
        "runtime_command_included": False,
        "runtime_command_executed": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "idempotency_replay_store_written": False,
        "rollback_executed": False,
        "target_mutation_created": False,
        "watcher_or_cron_created": False,
        "kanban_mutation_created": False,
        "nas_save_created": False,
        "vps_file_change_created": False,
        "real_dispatch_execution_enabled": False,
        "capabilities": _runtime_command_preview_record_capabilities(),
        "redaction": {
            "raw_command_excluded": True,
            "command_args_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
    }
    dto["runtime_command_preview_checksum_sha256"] = _build_runtime_command_preview_checksum(dto)
    return {"valid": True, "errors": [], "dto": dto}


def _normalize_stored_runtime_command_preview_record(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    if item.get("mode") != "stored_manual_runtime_command_preview_record":
        return None
    required = {
        "schema_version",
        "mode",
        "preview_status",
        "dispatch_gate_ref",
        "runtime_command_preview_ref",
        "runtime_command_preview_created",
        "runtime_command_preview_checksum_sha256",
        "runtime_command_executed",
        "target_mutation_created",
        "capabilities",
        "redaction",
    }
    if not required.issubset(set(item)):
        return None
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(item.get("dispatch_gate_ref"), "gate-"):
        return None
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(item.get("runtime_command_preview_ref"), "cmdpreview-"):
        return None
    checksum = item.get("runtime_command_preview_checksum_sha256")
    if not (isinstance(checksum, str) and re.fullmatch(r"[0-9a-f]{64}", checksum)):
        return None
    return dict(item)


def _read_runtime_command_preview_record_store(path: Path) -> tuple[list[dict[str, object]], int]:
    records: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return records, skipped_count
    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_runtime_command_preview_record(item)
            if normalized is None:
                skipped_count += 1
                continue
            records.append(normalized)
    return records, skipped_count


def append_office_controlled_mutation_manual_runtime_command_preview_record(
    payload: object, *, gate_store_path: Path | None = None, store_path: Path | None = None
) -> dict[str, object]:
    if not isinstance(payload, Mapping):
        return {"stored": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    gate_ref = payload.get("dispatch_gate_ref")
    if not _office_disabled_runtime_dispatch_valid_prefixed_ref(gate_ref, "gate-"):
        return {"stored": False, "errors": [_error("dispatch_gate_ref", "unsupported_ref_shape")], "dto": None}
    gate_readback = list_office_controlled_mutation_manual_dispatch_gate_open_records(
        store_path=gate_store_path,
        dispatch_gate_ref=cast(str, gate_ref),
        limit=1,
    )
    gates = cast(list[dict[str, object]], gate_readback.get("records", []))
    if not gates:
        return {"stored": False, "errors": [_error("dispatch_gate_ref", "dispatch_gate_not_found")], "dto": None}
    validation = validate_office_controlled_mutation_manual_runtime_command_preview_record(payload, source_gate=gates[-1])
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}
    dto = cast(dict[str, object], validation["dto"])
    path = store_path or _default_runtime_command_preview_record_store_path()
    existing, _ = _read_runtime_command_preview_record_store(path)
    if any(item.get("runtime_command_preview_ref") == dto["runtime_command_preview_ref"] for item in existing):
        return {"stored": False, "errors": [_error("runtime_command_preview_ref", "duplicate_runtime_command_preview_ref")], "dto": None}
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_manual_runtime_command_preview_records(
    *, store_path: Path | None = None, limit: int = 50, runtime_command_preview_ref: str | None = None, dispatch_gate_ref: str | None = None
) -> dict[str, object]:
    path = store_path or _default_runtime_command_preview_record_store_path()
    errors: list[dict[str, str]] = []
    records, skipped_count = _read_runtime_command_preview_record_store(path)
    if runtime_command_preview_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(runtime_command_preview_ref, "cmdpreview-"):
            records = [item for item in records if item.get("runtime_command_preview_ref") == runtime_command_preview_ref]
        else:
            errors.append(_error("runtime_command_preview_ref", "unsupported_ref_shape"))
            records = []
    if dispatch_gate_ref is not None:
        if _office_disabled_runtime_dispatch_valid_prefixed_ref(dispatch_gate_ref, "gate-"):
            records = [item for item in records if item.get("dispatch_gate_ref") == dispatch_gate_ref]
        else:
            errors.append(_error("dispatch_gate_ref", "unsupported_ref_shape"))
            records = []
    max_items = max(0, min(limit, 200))
    records = records[-max_items:] if max_items else []
    latest_refs: dict[str, str] = {}
    if records:
        latest = records[-1]
        for key in ("runtime_command_preview_ref", "dispatch_gate_ref", "command_envelope_ref", "command_intent_ref"):
            value = latest.get(key)
            if isinstance(value, str):
                latest_refs[key] = value
    return {
        "schema_version": 1,
        "mode": "stored_manual_runtime_command_preview_records_readback",
        "runtime_command_preview_record_count": len(records),
        "limit": max_items,
        "skipped_count": skipped_count,
        "records": records,
        "latest_refs": latest_refs,
        "capabilities": _runtime_command_preview_record_capabilities(),
        "redaction": {
            "raw_command_excluded": True,
            "command_args_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": errors,
    }


def build_office_controlled_mutation_manual_approval_recording_draft_review_status(
    *,
    store_path: Path | None = None,
    approval_record_ref: str | None = None,
    unsafe_examples: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Project safe draft-review readiness without writing a real approval record."""

    _ = unsafe_examples
    readback = list_office_controlled_mutation_manual_approval_recording_drafts(
        store_path=store_path,
        approval_record_ref=approval_record_ref,
        limit=1,
    )
    drafts = cast(list[dict[str, object]], readback.get("drafts", []))
    latest = drafts[-1] if drafts else None
    errors = list(cast(list[dict[str, str]], readback.get("errors", [])))
    draft_present = latest is not None
    review = {
        "draft_present": draft_present,
        "draft_status": latest.get("draft_status") if latest else None,
        "approval_record_ref": latest.get("approval_record_ref") if latest else None,
        "idempotency_key": latest.get("idempotency_key") if latest else None,
        "safe_evidence_ref_count": len(latest.get("evidence_refs", [])) if latest and isinstance(latest.get("evidence_refs"), list) else 0,
        "safe_summary_present": bool(latest.get("safe_summary")) if latest else False,
        "ready_for_manual_operator_review": draft_present and not errors,
        "ready_for_real_approval_record_write": False,
        "next_required_gate": "separate_real_approval_record_write_gate",
    }
    return {
        "schema_version": 1,
        "mode": "manual_approval_recording_draft_review_status",
        "manual_approval_recording_draft_review_complete": True,
        "source_design_lane": "manual_approval_recording_draft_persistence",
        "next_manual_lane": "separate_real_approval_record_write_gate",
        "review": review,
        "readback": {
            "draft_count": readback.get("draft_count", 0),
            "skipped_count": readback.get("skipped_count", 0),
            "latest_refs": readback.get("latest_refs", {}),
        },
        "execution_boundary": {
            "review_status_only": True,
            "approval_record_written": False,
            "dispatch_gate_open": False,
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "adapter_binding_created": False,
            "adapter_dispatch_created": False,
            "idempotency_replay_store_written": False,
            "rollback_executed": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
            "kanban_mutation_created": False,
            "nas_save_created": False,
            "vps_file_change_created": False,
        },
        "capabilities": _approval_recording_draft_capabilities(),
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": errors,
    }


def build_office_controlled_mutation_manual_approval_recording_preflight_status(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Project refusal-only manual approval-recording preflight without writing approval records."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "manual_approval_recording_preflight_status",
        "manual_approval_recording_preflight_complete": True,
        "source_design_lane": "approved_real_one_shot_dispatch_gate_design",
        "next_manual_lane": "manual_real_approval_recording",
        "preflight_contract": {
            "approval_record_shape_required": True,
            "exact_target_allowlist_ref_required": True,
            "idempotency_key_required": True,
            "replay_lookup_required": True,
            "rollback_disable_ref_required": True,
            "rollback_readiness_required": True,
            "dry_run_evidence_ref_required": True,
            "operator_final_confirmation_required": True,
            "refusal_only_default": True,
        },
        "execution_boundary": {
            "preflight_only": True,
            "approval_record_written": False,
            "dispatch_gate_open": False,
            "runtime_command_included": False,
            "runtime_command_executed": False,
            "adapter_binding_created": False,
            "adapter_dispatch_created": False,
            "idempotency_replay_store_written": False,
            "rollback_executed": False,
            "target_mutation_created": False,
            "watcher_or_cron_created": False,
        },
        "capabilities": {
            "manual_approval_recording_preflight_readback_enabled": True,
            "approval_recording_enabled": False,
            "real_dispatch_execution_enabled": False,
            "runtime_command_materialization_enabled": False,
            "runtime_command_execution_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "target_mutation_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "vps_file_change_enabled": False,
            "service_restart_enabled": False,
            "git_push_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "errors": [],
    }


def refuse_office_controlled_mutation_manual_approval_recording_preflight(
    payload: Mapping[str, Any] | None = None,
) -> dict[str, object]:
    """Refuse manual approval recording while returning only safe preflight validation metadata."""

    body = payload if isinstance(payload, Mapping) else {}
    approval_record_ref = body.get("approval_record_ref")
    exact_target_allowlist_ref = body.get("exact_target_allowlist_ref")
    idempotency_key = body.get("idempotency_key")
    replay_lookup_ref = body.get("replay_lookup_ref")
    rollback_disable_ref = body.get("rollback_disable_ref")
    dry_run_evidence_ref = body.get("dry_run_evidence_ref")
    operator_confirmation = body.get("operator_confirmation")
    safe_validation = {
        "approval_record_ref_present": bool(approval_record_ref),
        "approval_record_ref_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(approval_record_ref, "approval-"),
        "exact_target_allowlist_ref_present": bool(exact_target_allowlist_ref),
        "exact_target_allowlist_ref_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(exact_target_allowlist_ref, "allowlist-"),
        "idempotency_key_present": bool(idempotency_key),
        "idempotency_key_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(idempotency_key, "idem-"),
        "replay_lookup_ref_present": bool(replay_lookup_ref),
        "replay_lookup_ref_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(replay_lookup_ref, "replay-"),
        "replay_lookup_seen": False,
        "rollback_disable_ref_present": bool(rollback_disable_ref),
        "rollback_disable_ref_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(rollback_disable_ref, "rollback-"),
        "rollback_ready": False,
        "dry_run_evidence_ref_present": bool(dry_run_evidence_ref),
        "dry_run_evidence_ref_valid": _office_disabled_runtime_dispatch_valid_prefixed_ref(dry_run_evidence_ref, "dryrun-"),
        "operator_confirmation_present": operator_confirmation is not None,
        "operator_confirmation_valid": operator_confirmation == "confirmed-manual-preflight-only",
    }
    validation_errors: list[dict[str, str]] = []
    missing: list[str] = []
    validation_specs = [
        ("approval_record_ref", "approval_record_ref", safe_validation["approval_record_ref_present"], safe_validation["approval_record_ref_valid"]),
        ("exact_target_allowlist_ref", "exact_target_allowlist_ref", safe_validation["exact_target_allowlist_ref_present"], safe_validation["exact_target_allowlist_ref_valid"]),
        ("idempotency_key", "idempotency_key", safe_validation["idempotency_key_present"], safe_validation["idempotency_key_valid"]),
        ("replay_lookup_ref", "replay_lookup_ref", safe_validation["replay_lookup_ref_present"], safe_validation["replay_lookup_ref_valid"]),
        ("rollback_disable_ref", "rollback_disable_ref", safe_validation["rollback_disable_ref_present"], safe_validation["rollback_disable_ref_valid"]),
        ("dry_run_evidence_ref", "dry_run_evidence_ref", safe_validation["dry_run_evidence_ref_present"], safe_validation["dry_run_evidence_ref_valid"]),
    ]
    for field, requirement, present, valid in validation_specs:
        if not present:
            missing.append(requirement)
            validation_errors.append({"field": field, "code": "required"})
        elif not valid:
            validation_errors.append({"field": field, "code": "unsupported_ref_shape"})
    if not safe_validation["operator_confirmation_present"]:
        missing.append("operator_confirmation")
        validation_errors.append({"field": "operator_confirmation", "code": "required"})
    elif not safe_validation["operator_confirmation_valid"]:
        validation_errors.append({"field": "operator_confirmation", "code": "unsupported_confirmation"})
    return {
        "schema_version": 1,
        "mode": "manual_approval_recording_preflight_refusal",
        "accepted": False,
        "approval_record_written": False,
        "dispatch_gate_open": False,
        "runtime_command_executed": False,
        "target_mutation_created": False,
        "adapter_binding_created": False,
        "adapter_dispatch_created": False,
        "idempotency_replay_store_written": False,
        "rollback_executed": False,
        "watcher_or_cron_created": False,
        "refusal_code": "approval_recording_disabled_by_default",
        "safe_validation": safe_validation,
        "validation_errors": validation_errors,
        "missing_requirements": missing,
        "capabilities": {
            "preflight_validation_enabled": True,
            "approval_recording_enabled": False,
            "runtime_command_execution_enabled": False,
            "target_mutation_enabled": False,
            "adapter_dispatch_enabled": False,
            "idempotency_replay_store_write_enabled": False,
            "rollback_execution_enabled": False,
            "kanban_mutation_enabled": False,
            "nas_save_enabled": False,
            "credential_access_enabled": False,
            "public_exposure_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
    }



def _dispatcher_authority_metadata_append_status_capabilities() -> dict[str, bool]:
    return {
        "metadata_append_readback_enabled": True,
        "dry_run_result_readback_enabled": True,
        "audit_readback_enabled": True,
        "dry_run_result_storage_enabled": True,
        "audit_write_enabled": True,
        "adapter_implementation_enabled": False,
        "adapter_binding_enabled": False,
        "adapter_dispatch_enabled": False,
        "credential_access_enabled": False,
        "target_mutation_enabled": False,
        "dry_run_execution_enabled": False,
        "nas_save_enabled": False,
        "watcher_daemon_enabled": False,
        "cron_enabled": False,
        "vps_direct_nas_authority_enabled": False,
        "public_exposure_enabled": False,
    }


def _safe_count(value: object) -> int:
    return value if isinstance(value, int) else 0


def build_office_controlled_mutation_event_persistence_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing event persistence contract descriptor.

    ``unsafe_examples`` is accepted only to prove boundary behavior. Values are
    deliberately ignored so raw prompt/task body/transcript/path/provider/token
    material can never be echoed.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "event_persistence_contract_only",
        "event_store": {
            "implementation_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "accepted_event_kinds": list(_EVENT_KINDS),
        "required_envelope_fields": [
            "event_id",
            "correlation_id",
            "request_id",
            "event_kind",
            "actor_ref",
            "target_ref",
            "safe_summary",
            "evidence_refs",
            "created_at",
        ],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "event_append_enabled": False,
            "audit_write_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future persistence only; no event is appended",
            "storage backend, migration, retention, and audit sink require separate approval",
        ],
    }


def build_office_controlled_mutation_audit_sink_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing audit sink contract descriptor.

    ``unsafe_examples`` is deliberately ignored so private raw audit material,
    prompts, transcripts, paths, providers, tokens, and topic ids are never
    echoed by the contract helper.
    """

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "audit_sink_contract_only",
        "audit_sink": {
            "implementation_enabled": False,
            "write_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "accepted_event_kinds": list(_EVENT_KINDS),
        "result_postures": ["info", "warning", "blocked", "success"],
        "required_audit_fields": [
            "audit_ref",
            "event_at",
            "event_kind",
            "result_posture",
            "safe_summary",
        ],
        "optional_safe_refs": ["request_ref", "dry_run_ref", "decision_ref", "action_kind"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "audit_write_enabled": False,
            "audit_append_enabled": False,
            "audit_readback_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "audit_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future audit sink shape only; no audit event is written",
            "audit storage, append route, retention, and readback require separate approval",
        ],
    }


def build_office_controlled_mutation_approval_decision_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-recording human approval decision contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "approval_decision_contract_only",
        "decision_store": {
            "implementation_enabled": False,
            "recording_enabled": False,
            "append_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "allowed_decisions": ["approve", "reject", "hold"],
        "approval_scope": "single_action_only",
        "required_decision_fields": [
            "decision_ref",
            "request_ref",
            "dry_run_ref",
            "decided_at",
            "decision",
            "decided_by",
            "approval_scope",
            "expires_at",
        ],
        "optional_safe_fields": ["comment_summary"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "human_decision_recording_enabled": False,
            "decision_append_enabled": False,
            "decision_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "decision_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future human decision shape only; no decision is recorded",
            "decision route, storage, expiry enforcement, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_dry_run_evidence_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executing dry-run evidence contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "dry_run_evidence_contract_only",
        "dry_run_engine": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "result_recording_enabled": False,
            "readback_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_evidence_fields": [
            "dry_run_ref",
            "request_ref",
            "authority_candidate_ref",
            "started_at",
            "completed_at",
            "result",
            "risk_class",
            "simulated_steps",
            "rollback_preview_ref",
            "evidence_refs",
        ],
        "allowed_results": ["would_succeed", "would_fail", "blocked", "unknown"],
        "required_step_fields": [
            "step_ref",
            "operation_kind",
            "target_ref",
            "expected_effect_summary",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "warning_count", "evidence_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "dry_run_execution_enabled": False,
            "dry_run_result_recording_enabled": False,
            "dry_run_readback_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "target_mutation_enabled": False,
            "nas_save_enabled": False,
        },
        "dry_run_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future dry-run evidence shape only; no dry-run is executed",
            "dry-run engine, result recording, readback, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_authority_adapter_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-implementing authority adapter contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "authority_adapter_contract_only",
        "adapter": {
            "implementation_enabled": False,
            "dispatch_enabled": False,
            "binding_enabled": False,
            "credential_access_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_authority_fields": [
            "authority_candidate_ref",
            "request_ref",
            "dry_run_ref",
            "decision_ref",
            "actor_ref",
            "risk_class",
            "scope",
            "expires_at",
            "required_capabilities",
        ],
        "allowed_authority_scopes": [
            "single_action",
            "bounded_batch",
            "read_only_projection",
        ],
        "required_capability_fields": [
            "capability_ref",
            "operation_kind",
            "target_ref",
            "permission_posture",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "capability_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "adapter_implementation_enabled": False,
            "adapter_dispatch_enabled": False,
            "adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "adapter_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future authority adapter shape only; no adapter is implemented or bound",
            "adapter implementation, dispatch, credential access, storage, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_authority_binding_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-binding authority adapter binding design descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "authority_binding_contract_only",
        "binding": {
            "implementation_enabled": False,
            "binding_enabled": False,
            "dispatch_enabled": False,
            "credential_access_enabled": False,
            "adapter_registry_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_binding_fields": [
            "binding_candidate_ref",
            "authority_candidate_ref",
            "adapter_contract_ref",
            "request_ref",
            "decision_ref",
            "audit_ref",
            "actor_ref",
            "risk_class",
            "scope",
            "expires_at",
            "blocked_reasons",
        ],
        "allowed_binding_scopes": ["single_action", "read_only_projection"],
        "required_adapter_fields": [
            "adapter_ref",
            "adapter_kind",
            "permission_posture",
            "credential_posture",
            "dispatch_posture",
            "target_posture",
        ],
        "allowed_adapter_kinds": ["kanban_comment", "status_note", "read_only_projection"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
            "credentials_echoed": False,
        },
        "capabilities": {
            "adapter_implementation_enabled": False,
            "adapter_binding_enabled": False,
            "adapter_dispatch_enabled": False,
            "adapter_registry_enabled": False,
            "credential_access_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "adapter_endpoints": [],
        "binding_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future authority adapter binding shape only; no adapter is implemented, registered, or bound",
            "adapter implementation, credential access, dispatch, target mutation, storage, and audit write require separate approval",
        ],
    }


def build_office_controlled_mutation_nas_save_preparation_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing NAS save/write preparation contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "nas_save_preparation_contract_only",
        "required_preparation_fields": [
            "preparation_ref",
            "request_ref",
            "decision_ref",
            "source_manifest_ref",
            "target_vault_ref",
            "proposed_path_ref",
            "safe_title",
            "safe_summary",
            "evidence_refs",
            "rollback_plan_ref",
            "requested_by",
            "requested_at",
        ],
        "allowed_write_policies": ["prepare_only", "human_approved_later"],
        "preparation": {
            "contract_enabled": True,
            "nas_write_preparation_enabled": False,
            "nas_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "evidence_package_persistence_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "dry_run_execution_enabled": False,
            "human_decision_recording_enabled": False,
            "authority_adapter_enabled": False,
            "authority_binding_enabled": False,
            "target_mutation_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
        },
        "preparation_endpoints": [],
        "storage_endpoints": [],
        "nas_endpoints": [],
        "contract_notes": [
            "contract describes future NAS save/write preparation shape only; no NAS path is resolved and no NAS write is prepared",
            "actual NAS write preparation, path resolution, evidence package persistence, rollback point creation, and NAS save require separate approval",
        ],
    }



def build_office_controlled_mutation_nas_evidence_package_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-writing NAS evidence package contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "nas_evidence_package_contract_only",
        "required_package_fields": [
            "package_ref",
            "preparation_ref",
            "request_ref",
            "decision_ref",
            "source_manifest_refs",
            "review_evidence_refs",
            "wiki_draft_ref",
            "target_vault_ref",
            "proposed_path_ref",
            "safe_title",
            "safe_summary",
            "rollback_plan_ref",
            "created_by",
            "created_at",
        ],
        "package": {
            "contract_enabled": True,
            "package_validation_enabled": False,
            "package_creation_enabled": False,
            "package_persistence_enabled": False,
            "evidence_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "database_migration_required": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "request_creation_enabled": False,
            "package_validation_enabled": False,
            "package_creation_enabled": False,
            "package_persistence_enabled": False,
            "evidence_package_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "package_endpoints": [],
        "storage_endpoints": [],
        "nas_endpoints": [],
        "contract_notes": [
            "contract describes future NAS evidence package metadata only; no evidence is persisted and no rollback point is created",
            "actual package persistence, rollback point creation, NAS path resolution, NAS mount access, NAS save, and NAS write require separate approval",
        ],
    }


def build_office_controlled_mutation_nas_path_resolution_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-runtime NAS path resolution contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "nas_path_resolution_contract_only",
        "required_path_fields": [
            "path_resolution_ref",
            "package_ref",
            "target_vault_ref",
            "proposed_path_ref",
            "safe_title",
            "safe_slug",
            "path_policy_ref",
            "created_by",
            "created_at",
        ],
        "path_resolution": {
            "contract_enabled": True,
            "path_validation_enabled": False,
            "path_resolution_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "database_migration_required": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_path_refs_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "path_validation_enabled": False,
            "nas_path_resolution_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "nas_mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "path_resolution_endpoints": [],
        "mount_endpoints": [],
        "filesystem_endpoints": [],
        "contract_notes": [
            "contract describes future NAS path resolution metadata only; no path is resolved and no mount is accessed",
            "actual path validation, path resolution, mount discovery/access, filesystem read/write, NAS save, and NAS write require separate approval",
        ],
    }


def build_office_controlled_mutation_nas_runtime_boundary_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the disabled NAS runtime capability contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "nas_runtime_capability_contract_only",
        "gate": "N2_runtime_capability_contract",
        "approved_gate": "N2_runtime_capability_contract",
        "runtime": {
            "contract_enabled": True,
            "path_validation_enabled": False,
            "local_path_mapping_enabled": False,
            "runtime_path_resolution_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_health_check_enabled": False,
            "nas_mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "evidence_package_files_dry_run_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "single_package_write_enabled": False,
            "nas_write_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "raw_paths_echoed": False,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "path_validation_enabled": False,
            "local_path_mapping_enabled": False,
            "runtime_path_resolution_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_health_check_enabled": False,
            "nas_mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "evidence_package_files_dry_run_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "single_package_write_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "runtime_endpoints": [],
        "mount_endpoints": [],
        "filesystem_endpoints": [],
        "write_endpoints": [],
        "contract_notes": [
            "contract describes disabled NAS runtime capabilities only; no filesystem or NAS path is resolved",
            "runtime path resolution, mount health checks, file reads, file writes, rollback points, and NAS writes require separate approval",
        ],
    }


def _is_safe_markdown_body(value: object) -> bool:
    if not isinstance(value, str):
        return False
    if not value or len(value.encode("utf-8")) > 50_000:
        return False
    if "\x00" in value or "<script" in value.lower():
        return False
    return not _has_raw_marker(value)



def prepare_office_controlled_mutation_nas_mac_relay_write_request(payload: object) -> dict[str, object]:
    """Validate a NAS Keeper -> Mac relay write request without writing files.

    This is the VPS-safe request boundary for real NAS writes: the dashboard can
    prepare a safe envelope for a Mac relay owned by the NAS Keeper, but the VPS
    receives no NAS mount, credential, root path, or direct filesystem authority.
    """

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"prepared": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    required = sorted(_NAS_RUNTIME_WRITE_FIELDS | {"relay_request_ref", "nas_keeper_ref", "relay_node_ref"})
    for field in required:
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("relay_request_ref", "write_ref", "package_ref", "target_vault_ref", "requested_by", "nas_keeper_ref", "relay_node_ref"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "safe_slug" in payload and not (
        isinstance(payload.get("safe_slug"), str)
        and _SAFE_SLUG_RE.fullmatch(payload["safe_slug"])
        and not _has_raw_marker(payload["safe_slug"])
        and ".." not in payload["safe_slug"]
        and "/" not in payload["safe_slug"]
    ):
        errors.append(_error("safe_slug", "invalid_safe_slug"))
    if "safe_title" in payload and not _is_safe_text(payload.get("safe_title")):
        errors.append(_error("safe_title", "invalid_safe_text"))
    if "markdown_body" in payload and not _is_safe_markdown_body(payload.get("markdown_body")):
        errors.append(_error("markdown_body", "raw_marker_detected"))
    if "requested_at" in payload and not (
        isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])
    ):
        errors.append(_error("requested_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"prepared": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_write_request_prepared",
        "relay_request_ref": payload["relay_request_ref"],
        "write_ref": payload["write_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "safe_slug": payload["safe_slug"],
        "safe_title": payload["safe_title"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "execution_path": ["ai_office_request", "nas_keeper", "mac_relay", "real_nas"],
        "safe_logical_path": f"{payload['target_vault_ref']}::{payload['safe_slug']}.md",
        "safe_display_path": f"{payload['target_vault_ref']} / {payload['safe_slug']}.md",
        "payload_bytes": len(str(payload["markdown_body"]).encode("utf-8")),
        "capabilities": {
            "request_prepared": True,
            "nas_keeper_required": True,
            "mac_relay_required": True,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "vps_filesystem_write_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": False,
            "actual_nas_write_enabled": False,
            "audit_write_enabled": False,
            "target_mutation_enabled": False,
        },
        "next_required_boundary": "mac_relay_authenticated_execution",
    }
    return {"prepared": True, "errors": [], "dto": dto}




def enqueue_office_controlled_mutation_nas_keeper_mac_relay_handoff(
    payload: object, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Append a safe NAS Keeper handoff request to a local AI Office queue.

    This is still a VPS-safe boundary: it stores only an already-validated safe
    request envelope for NAS Keeper review/routing and grants no direct NAS
    mount, credential, raw path, watcher, cron, dispatch, or execution authority.
    """

    if not isinstance(payload, Mapping):
        return {"queued": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    errors: list[dict[str, str]] = []
    if set(payload) - _NAS_KEEPER_HANDOFF_QUEUE_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in ("handoff_ref", "queued_by", "queued_at"):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("handoff_ref", "queued_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "queued_at" in payload and not (isinstance(payload.get("queued_at"), str) and _ISO_UTC_RE.fullmatch(payload["queued_at"])):
        errors.append(_error("queued_at", "invalid_timestamp"))

    request_payload = {field: payload[field] for field in _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS if field in payload}
    prepared = prepare_office_controlled_mutation_nas_mac_relay_write_request(request_payload)
    errors.extend(cast(list[dict[str, str]], prepared.get("errors") or []))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"queued": False, "errors": errors, "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    queue_root = queue_file.parent
    queue_root.mkdir(parents=True, exist_ok=True)

    handoff_ref = str(payload["handoff_ref"])
    if queue_file.exists():
        for line in queue_file.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                continue
            if item.get("handoff_ref") == handoff_ref:
                return {"queued": False, "errors": [_error("handoff_ref", "duplicate_handoff_ref")], "dto": None}

    prepared_dto = cast(dict[str, object], prepared["dto"])
    queue_item = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_queued",
        "handoff_ref": handoff_ref,
        "queue_ref": f"nas_keeper_mac_relay_handoff_queue::{handoff_ref}",
        "queue_status": "pending_nas_keeper_authorization",
        "queued_by": payload["queued_by"],
        "queued_at": payload["queued_at"],
        "relay_request_ref": payload["relay_request_ref"],
        "write_ref": payload["write_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "safe_slug": payload["safe_slug"],
        "safe_title": payload["safe_title"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "execution_path": prepared_dto["execution_path"],
        "handoff_path": ["vps_ai_office_queue", "nas_keeper_review", "mac_relay_execution", "real_nas"],
        "safe_logical_path": prepared_dto["safe_logical_path"],
        "safe_display_path": prepared_dto["safe_display_path"],
        "payload_bytes": prepared_dto["payload_bytes"],
        "markdown_body": payload["markdown_body"],
        "capabilities": {
            "queue_append_enabled": True,
            "request_prepared": True,
            "nas_keeper_required": True,
            "mac_relay_required": True,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": False,
            "actual_nas_write_enabled": False,
            "watcher_enabled": False,
            "cron_enabled": False,
            "dispatch_enabled": False,
            "authority_adapter_binding_enabled": False,
        },
        "next_required_boundary": "nas_keeper_authorizes_mac_relay_execution",
    }
    with queue_file.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(queue_item, sort_keys=True, ensure_ascii=False) + "\n")
    dto = {k: v for k, v in queue_item.items() if k != "markdown_body"}
    dto["queue_storage_ref"] = "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue"
    return {"queued": True, "errors": [], "dto": dto}



def _nas_keeper_handoff_queue_file(queue_dir: Path | str | None = None) -> Path:
    if queue_dir is None:
        return get_hermes_home() / "ai-office" / "nas-keeper-handoff" / "mac-relay-write-queue.jsonl"
    return Path(queue_dir).expanduser() / "mac-relay-write-queue.jsonl"


def _safe_nas_keeper_queue_summary(item: Mapping[str, object]) -> dict[str, object] | None:
    """Return a safe readback DTO for one queue item, or ``None`` if unsafe."""

    required = (
        "handoff_ref",
        "queue_ref",
        "queue_status",
        "relay_request_ref",
        "write_ref",
        "package_ref",
        "target_vault_ref",
        "safe_slug",
        "safe_title",
        "requested_by",
        "requested_at",
        "nas_keeper_ref",
        "relay_node_ref",
        "safe_logical_path",
        "safe_display_path",
        "payload_bytes",
        "next_required_boundary",
    )
    if any(field not in item for field in required):
        return None
    if item.get("queue_status") not in _NAS_KEEPER_HANDOFF_QUEUE_STATUSES:
        return None
    if not _is_safe_text(item.get("queue_ref")):
        return None
    for field in (
        "handoff_ref",
        "relay_request_ref",
        "write_ref",
        "package_ref",
        "target_vault_ref",
        "requested_by",
        "nas_keeper_ref",
        "relay_node_ref",
    ):
        if not _is_opaque_id(item.get(field)):
            return None
    if not _is_safe_text(item.get("safe_title")) or not _is_safe_text(item.get("safe_logical_path")):
        return None
    if not _is_safe_text(item.get("safe_display_path")) or not _is_safe_text(item.get("next_required_boundary")):
        return None
    safe_slug = item.get("safe_slug")
    if not isinstance(safe_slug, str) or not _SAFE_SLUG_RE.fullmatch(safe_slug):
        return None
    for field in ("requested_at", "queued_at", "authorized_at", "execution_recorded_at"):
        if field in item and not (isinstance(item.get(field), str) and _ISO_UTC_RE.fullmatch(str(item[field]))):
            return None
    if not isinstance(item.get("payload_bytes"), int) or int(cast(int, item["payload_bytes"])) < 0:
        return None

    summary: dict[str, object] = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_queue_item_summary",
        "handoff_ref": item["handoff_ref"],
        "queue_ref": item["queue_ref"],
        "queue_status": item["queue_status"],
        "relay_request_ref": item["relay_request_ref"],
        "write_ref": item["write_ref"],
        "package_ref": item["package_ref"],
        "target_vault_ref": item["target_vault_ref"],
        "safe_slug": item["safe_slug"],
        "safe_title": item["safe_title"],
        "requested_by": item["requested_by"],
        "requested_at": item["requested_at"],
        "nas_keeper_ref": item["nas_keeper_ref"],
        "relay_node_ref": item["relay_node_ref"],
        "safe_logical_path": item["safe_logical_path"],
        "safe_display_path": item["safe_display_path"],
        "payload_bytes": item["payload_bytes"],
        "markdown_body_included": False,
        "next_required_boundary": item["next_required_boundary"],
    }
    for field in (
        "queued_by",
        "queued_at",
        "authorization_ref",
        "authorization_decision",
        "authorized_by",
        "authorized_at",
        "relay_execution_ref",
        "execution_record_ref",
        "execution_status",
        "execution_recorded_by",
        "execution_recorded_at",
        "execution_safe_summary",
    ):
        if field in item:
            value = item[field]
            if field.endswith("_at") and not (isinstance(value, str) and _ISO_UTC_RE.fullmatch(value)):
                return None
            if field.endswith("_ref") or field in {"queued_by", "authorized_by", "execution_recorded_by"}:
                if not _is_opaque_id(value):
                    return None
            if field == "authorization_decision" and value != "authorize_mac_relay_execution":
                return None
            if field == "execution_status" and value not in _NAS_KEEPER_HANDOFF_EXECUTION_STATUSES:
                return None
            if field == "execution_safe_summary" and not _is_safe_text(value):
                return None
            summary[field] = value
    if "execution_evidence_refs" in item:
        refs = item["execution_evidence_refs"]
        if not _validate_evidence_refs(refs):
            return None
        summary["execution_evidence_refs"] = list(cast(Sequence[object], refs))
    return summary


def list_office_controlled_mutation_nas_keeper_mac_relay_handoff_queue(
    filters: object | None = None, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Read the local NAS Keeper handoff queue as safe summary DTOs only."""

    filter_map: Mapping[str, object]
    if filters is None:
        filter_map = {}
    elif isinstance(filters, Mapping):
        filter_map = filters
    else:
        return {"listed": False, "errors": [_error("filters", "invalid_filters_type")], "dto": None}

    errors: list[dict[str, str]] = []
    if set(filter_map) - _NAS_KEEPER_HANDOFF_QUEUE_READBACK_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    safe_filters: dict[str, object] = {}
    for field in ("handoff_ref", "relay_node_ref", "nas_keeper_ref"):
        if field in filter_map:
            if not _is_opaque_id(filter_map.get(field)):
                errors.append(_error(field, "invalid_opaque_id"))
            else:
                safe_filters[field] = filter_map[field]
    if "queue_status" in filter_map:
        if filter_map.get("queue_status") not in _NAS_KEEPER_HANDOFF_QUEUE_STATUSES:
            errors.append(_error("queue_status", "unsupported_queue_status"))
        else:
            safe_filters["queue_status"] = filter_map["queue_status"]
    limit = 200
    if "limit" in filter_map:
        try:
            limit = int(cast(Any, filter_map.get("limit")))
        except (TypeError, ValueError):
            errors.append(_error("limit", "invalid_limit"))
        else:
            limit = max(1, min(limit, 200))
    if errors:
        return {"listed": False, "errors": sorted(errors, key=lambda item: (item["field"], item["code"])), "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    if not queue_file.exists():
        items: list[dict[str, object]] = []
        skipped_count = 0
    else:
        items = []
        skipped_count = 0
        for line in queue_file.read_text(encoding="utf-8").splitlines():
            if not line.strip():
                continue
            try:
                raw_item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            if not isinstance(raw_item, Mapping):
                skipped_count += 1
                continue
            summary = _safe_nas_keeper_queue_summary(raw_item)
            if summary is None:
                skipped_count += 1
                continue
            if any(summary.get(key) != value for key, value in safe_filters.items()):
                continue
            items.append(summary)
    available_count = len(items)
    returned_items = items[:limit]
    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_queue_readback",
        "listed": True,
        "queue_storage_ref": "ai_office_local_profile::nas_keeper_mac_relay_handoff_queue",
        "filters": safe_filters,
        "effective_limit": limit,
        "available_count": available_count,
        "count": len(returned_items),
        "skipped_count": skipped_count,
        "items": returned_items,
        "markdown_body_included": False,
        "capabilities": {
            "queue_read_enabled": True,
            "queue_mutation_enabled": False,
            "execution_state_recording_enabled": False,
            "execution_payload_preview_enabled": False,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": False,
            "actual_nas_write_enabled": False,
            "watcher_enabled": False,
            "cron_enabled": False,
            "dispatch_enabled": False,
            "authority_adapter_binding_enabled": False,
        },
        "next_required_boundary": "manual_nas_keeper_execution_evidence_review_if_needed",
    }
    return {"listed": True, "errors": [], "dto": dto}


def dry_run_office_controlled_mutation_nas_keeper_mac_relay_claim(
    payload: object, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Preview a Mac relay claim of one NAS Keeper handoff queue item.

    This is intentionally dry-run only: it reads the safe local queue and returns
    the safe metadata a Mac relay would be allowed to claim, but it does not
    mutate queue status, authorize execution, write NAS files, start watchers, or
    bind any dispatch/authority adapter.
    """

    if not isinstance(payload, Mapping):
        return {"claimed": False, "dry_run": True, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    errors: list[dict[str, str]] = []
    if set(payload) - _NAS_KEEPER_HANDOFF_CLAIM_DRY_RUN_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_NAS_KEEPER_HANDOFF_CLAIM_DRY_RUN_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("handoff_ref", "claim_ref", "relay_node_ref", "claimed_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "claimed_at" in payload and not (isinstance(payload.get("claimed_at"), str) and _ISO_UTC_RE.fullmatch(payload["claimed_at"])):
        errors.append(_error("claimed_at", "invalid_timestamp"))
    if errors:
        return {"claimed": False, "dry_run": True, "errors": sorted(errors, key=lambda item: (item["field"], item["code"])), "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    if not queue_file.exists():
        return {"claimed": False, "dry_run": True, "errors": [_error("queue", "queue_not_found")], "dto": None}

    wanted = str(payload["handoff_ref"])
    matched: dict[str, object] | None = None
    for line in queue_file.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, Mapping) and item.get("handoff_ref") == wanted:
            matched = dict(item)
            break
    if matched is None:
        return {"claimed": False, "dry_run": True, "errors": [_error("handoff_ref", "handoff_not_found")], "dto": None}
    if matched.get("queue_status") != "pending_nas_keeper_authorization":
        return {"claimed": False, "dry_run": True, "errors": [_error("queue_status", "unsupported_queue_status")], "dto": None}
    if matched.get("relay_node_ref") != payload["relay_node_ref"]:
        return {"claimed": False, "dry_run": True, "errors": [_error("relay_node_ref", "relay_node_mismatch")], "dto": None}

    request_payload = {field: matched[field] for field in _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS if field in matched}
    prepared = prepare_office_controlled_mutation_nas_mac_relay_write_request(request_payload)
    if prepared.get("errors"):
        return {"claimed": False, "dry_run": True, "errors": cast(list[dict[str, str]], prepared.get("errors") or []), "dto": None}
    prepared_dto = cast(dict[str, object], prepared["dto"])
    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_claim_dry_run",
        "dry_run": True,
        "claim_status": "would_claim",
        "handoff_ref": payload["handoff_ref"],
        "claim_ref": payload["claim_ref"],
        "queue_ref": matched.get("queue_ref"),
        "queue_status_before": matched.get("queue_status"),
        "queue_status_after": "pending_nas_keeper_authorization",
        "claimed_by": payload["claimed_by"],
        "claimed_at": payload["claimed_at"],
        "relay_request_ref": matched["relay_request_ref"],
        "write_ref": matched["write_ref"],
        "package_ref": matched["package_ref"],
        "target_vault_ref": matched["target_vault_ref"],
        "safe_slug": matched["safe_slug"],
        "safe_title": matched["safe_title"],
        "requested_by": matched["requested_by"],
        "requested_at": matched["requested_at"],
        "nas_keeper_ref": matched["nas_keeper_ref"],
        "relay_node_ref": matched["relay_node_ref"],
        "execution_path": prepared_dto["execution_path"],
        "claim_path": ["mac_relay_reads_queue", "nas_keeper_authorization_pending", "dry_run_only", "no_real_nas_write"],
        "safe_logical_path": prepared_dto["safe_logical_path"],
        "safe_display_path": prepared_dto["safe_display_path"],
        "payload_bytes": prepared_dto["payload_bytes"],
        "execution_payload_preview_fields": sorted(_NAS_MAC_RELAY_WRITE_REQUEST_FIELDS | {"relay_execution_ref", "relay_authorized_by", "relay_authorized_at"}),
        "capabilities": {
            "queue_read_enabled": True,
            "claim_dry_run_enabled": True,
            "queue_mutation_enabled": False,
            "nas_keeper_authorization_recording_enabled": False,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": False,
            "actual_nas_write_enabled": False,
            "watcher_enabled": False,
            "cron_enabled": False,
            "dispatch_enabled": False,
            "authority_adapter_binding_enabled": False,
        },
        "next_required_boundary": "nas_keeper_authorizes_and_mac_relay_executes",
    }
    return {"claimed": False, "dry_run": True, "errors": [], "dto": dto}



def authorize_office_controlled_mutation_nas_keeper_mac_relay_handoff(
    payload: object, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Record NAS Keeper authorization for one queued Mac relay handoff.

    This is the first queue-mutation boundary after dry-run claim preview. It
    marks one safe queued handoff as authorized for later Mac relay execution,
    but it still does not execute a relay write, write NAS files, start
    automation, or bind dispatch/authority adapters.
    """

    if not isinstance(payload, Mapping):
        return {"authorized": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    errors: list[dict[str, str]] = []
    if set(payload) - _NAS_KEEPER_HANDOFF_AUTHORIZE_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_NAS_KEEPER_HANDOFF_AUTHORIZE_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("handoff_ref", "authorization_ref", "nas_keeper_ref", "relay_node_ref", "authorized_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if payload.get("authorization_decision") != "authorize_mac_relay_execution":
        errors.append(_error("authorization_decision", "unsupported_authorization_decision"))
    if "authorized_at" in payload and not (isinstance(payload.get("authorized_at"), str) and _ISO_UTC_RE.fullmatch(payload["authorized_at"])):
        errors.append(_error("authorized_at", "invalid_timestamp"))
    if errors:
        return {"authorized": False, "errors": sorted(errors, key=lambda item: (item["field"], item["code"])), "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    if not queue_file.exists():
        return {"authorized": False, "errors": [_error("queue", "queue_not_found")], "dto": None}

    wanted = str(payload["handoff_ref"])
    items: list[dict[str, object]] = []
    matched_index: int | None = None
    for line in queue_file.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(item, Mapping):
            continue
        item_dict = dict(item)
        if item_dict.get("handoff_ref") == wanted and matched_index is None:
            matched_index = len(items)
        items.append(item_dict)

    if matched_index is None:
        return {"authorized": False, "errors": [_error("handoff_ref", "handoff_not_found")], "dto": None}

    matched = items[matched_index]
    if matched.get("queue_status") != "pending_nas_keeper_authorization":
        return {"authorized": False, "errors": [_error("queue_status", "unsupported_queue_status")], "dto": None}
    if matched.get("nas_keeper_ref") != payload["nas_keeper_ref"]:
        return {"authorized": False, "errors": [_error("nas_keeper_ref", "nas_keeper_mismatch")], "dto": None}
    if matched.get("relay_node_ref") != payload["relay_node_ref"]:
        return {"authorized": False, "errors": [_error("relay_node_ref", "relay_node_mismatch")], "dto": None}

    request_payload = {field: matched[field] for field in _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS if field in matched}
    prepared = prepare_office_controlled_mutation_nas_mac_relay_write_request(request_payload)
    if prepared.get("errors"):
        return {"authorized": False, "errors": cast(list[dict[str, str]], prepared.get("errors") or []), "dto": None}
    prepared_dto = cast(dict[str, object], prepared["dto"])

    updated = dict(matched)
    updated.update(
        {
            "queue_status": "authorized_for_mac_relay_execution",
            "authorization_ref": payload["authorization_ref"],
            "authorization_decision": payload["authorization_decision"],
            "authorized_by": payload["authorized_by"],
            "authorized_at": payload["authorized_at"],
            "authorization_path": [
                "nas_keeper_review",
                "authorization_recorded",
                "mac_relay_execution_pending",
                "no_real_nas_write",
            ],
            "capabilities": {
                "queue_read_enabled": True,
                "queue_mutation_enabled": True,
                "nas_keeper_authorization_recording_enabled": True,
                "execution_payload_preparation_enabled": True,
                "vps_nas_mount_enabled": False,
                "vps_credential_access_enabled": False,
                "direct_vps_nas_write_enabled": False,
                "mac_relay_write_enabled": False,
                "actual_nas_write_enabled": False,
                "watcher_enabled": False,
                "cron_enabled": False,
                "dispatch_enabled": False,
                "authority_adapter_binding_enabled": False,
            },
            "next_required_boundary": "mac_relay_authenticated_execution_from_authorized_handoff",
        }
    )
    items[matched_index] = updated
    tmp_file = queue_file.with_suffix(queue_file.suffix + ".tmp")
    with tmp_file.open("w", encoding="utf-8") as handle:
        for item in items:
            handle.write(json.dumps(item, sort_keys=True, ensure_ascii=False) + "\n")
    tmp_file.replace(queue_file)

    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_handoff_authorized",
        "authorized": True,
        "handoff_ref": payload["handoff_ref"],
        "authorization_ref": payload["authorization_ref"],
        "authorization_decision": payload["authorization_decision"],
        "queue_ref": updated.get("queue_ref"),
        "queue_status_before": "pending_nas_keeper_authorization",
        "queue_status_after": "authorized_for_mac_relay_execution",
        "authorized_by": payload["authorized_by"],
        "authorized_at": payload["authorized_at"],
        "relay_request_ref": updated["relay_request_ref"],
        "write_ref": updated["write_ref"],
        "package_ref": updated["package_ref"],
        "target_vault_ref": updated["target_vault_ref"],
        "safe_slug": updated["safe_slug"],
        "safe_title": updated["safe_title"],
        "requested_by": updated["requested_by"],
        "requested_at": updated["requested_at"],
        "nas_keeper_ref": updated["nas_keeper_ref"],
        "relay_node_ref": updated["relay_node_ref"],
        "execution_path": prepared_dto["execution_path"],
        "authorization_path": updated["authorization_path"],
        "safe_logical_path": prepared_dto["safe_logical_path"],
        "safe_display_path": prepared_dto["safe_display_path"],
        "payload_bytes": prepared_dto["payload_bytes"],
        "execution_payload_preview_fields": sorted(_NAS_MAC_RELAY_WRITE_REQUEST_FIELDS | {"relay_execution_ref", "relay_authorized_by", "relay_authorized_at"}),
        "capabilities": updated["capabilities"],
        "next_required_boundary": updated["next_required_boundary"],
    }
    return {"authorized": True, "errors": [], "dto": dto}



def preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(
    payload: object, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Preview the safe Mac relay execution payload for an authorized handoff.

    This reads an already-authorized queue item and returns the safe refs and
    bounded metadata needed by a future Mac-local execution call. It does not
    mutate queue state, expose raw markdown content in the response, dispatch to
    a relay, write NAS files, or grant the VPS any NAS authority.
    """

    if not isinstance(payload, Mapping):
        return {"previewed": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    errors: list[dict[str, str]] = []
    if set(payload) - _NAS_KEEPER_HANDOFF_EXECUTION_PAYLOAD_PREVIEW_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_NAS_KEEPER_HANDOFF_EXECUTION_PAYLOAD_PREVIEW_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("handoff_ref", "relay_execution_ref", "nas_keeper_ref", "relay_node_ref", "relay_authorized_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "relay_authorized_at" in payload and not (
        isinstance(payload.get("relay_authorized_at"), str) and _ISO_UTC_RE.fullmatch(payload["relay_authorized_at"])
    ):
        errors.append(_error("relay_authorized_at", "invalid_timestamp"))
    if errors:
        return {"previewed": False, "errors": sorted(errors, key=lambda item: (item["field"], item["code"])), "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    if not queue_file.exists():
        return {"previewed": False, "errors": [_error("queue", "queue_not_found")], "dto": None}

    wanted = str(payload["handoff_ref"])
    matched: dict[str, object] | None = None
    for line in queue_file.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, Mapping) and item.get("handoff_ref") == wanted:
            matched = dict(item)
            break
    if matched is None:
        return {"previewed": False, "errors": [_error("handoff_ref", "handoff_not_found")], "dto": None}
    if matched.get("queue_status") != "authorized_for_mac_relay_execution":
        return {"previewed": False, "errors": [_error("queue_status", "handoff_not_authorized")], "dto": None}
    if matched.get("nas_keeper_ref") != payload["nas_keeper_ref"]:
        return {"previewed": False, "errors": [_error("nas_keeper_ref", "nas_keeper_mismatch")], "dto": None}
    if matched.get("relay_node_ref") != payload["relay_node_ref"]:
        return {"previewed": False, "errors": [_error("relay_node_ref", "relay_node_mismatch")], "dto": None}
    if matched.get("authorized_by") != payload["relay_authorized_by"]:
        return {"previewed": False, "errors": [_error("relay_authorized_by", "authorization_actor_mismatch")], "dto": None}

    required_authorization_fields = {"authorization_ref", "authorization_decision", "authorized_by", "authorized_at"}
    if not required_authorization_fields.issubset(matched):
        return {"previewed": False, "errors": [_error("authorization", "missing_authorization_metadata")], "dto": None}
    if matched.get("authorization_decision") != "authorize_mac_relay_execution":
        return {"previewed": False, "errors": [_error("authorization_decision", "unsupported_authorization_decision")], "dto": None}

    request_payload = {field: matched[field] for field in _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS if field in matched}
    prepared = prepare_office_controlled_mutation_nas_mac_relay_write_request(request_payload)
    if prepared.get("errors"):
        return {"previewed": False, "errors": cast(list[dict[str, str]], prepared.get("errors") or []), "dto": None}
    prepared_dto = cast(dict[str, object], prepared["dto"])
    markdown_body = str(matched.get("markdown_body", ""))
    markdown_body_sha256 = hashlib.sha256(markdown_body.encode("utf-8")).hexdigest()
    execution_payload = {
        "relay_request_ref": matched["relay_request_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "write_ref": matched["write_ref"],
        "package_ref": matched["package_ref"],
        "target_vault_ref": matched["target_vault_ref"],
        "safe_slug": matched["safe_slug"],
        "safe_title": matched["safe_title"],
        "requested_by": matched["requested_by"],
        "requested_at": matched["requested_at"],
        "nas_keeper_ref": matched["nas_keeper_ref"],
        "relay_node_ref": matched["relay_node_ref"],
        "relay_authorized_by": payload["relay_authorized_by"],
        "relay_authorized_at": payload["relay_authorized_at"],
    }
    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_execution_payload_preview",
        "previewed": True,
        "handoff_ref": payload["handoff_ref"],
        "authorization_ref": matched["authorization_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "queue_ref": matched.get("queue_ref"),
        "queue_status": matched.get("queue_status"),
        "authorization_decision": matched.get("authorization_decision"),
        "authorized_by": matched.get("authorized_by"),
        "authorized_at": matched.get("authorized_at"),
        "relay_authorized_by": payload["relay_authorized_by"],
        "relay_authorized_at": payload["relay_authorized_at"],
        "execution_payload_preview": execution_payload,
        "execution_payload_fields": sorted(_NAS_MAC_RELAY_WRITE_REQUEST_FIELDS | {"relay_execution_ref", "relay_authorized_by", "relay_authorized_at"}),
        "markdown_body_ref": f"queued_handoff_markdown_body::{wanted}",
        "markdown_body_bytes": len(markdown_body.encode("utf-8")),
        "markdown_body_sha256": markdown_body_sha256,
        "markdown_body_included": False,
        "execution_path": prepared_dto["execution_path"],
        "payload_preview_path": [
            "authorized_queue_item_read",
            "safe_execution_payload_previewed",
            "mac_relay_execution_pending",
            "no_real_nas_write",
        ],
        "safe_logical_path": prepared_dto["safe_logical_path"],
        "safe_display_path": prepared_dto["safe_display_path"],
        "payload_bytes": prepared_dto["payload_bytes"],
        "capabilities": {
            "queue_read_enabled": True,
            "execution_payload_preview_enabled": True,
            "queue_mutation_enabled": False,
            "nas_keeper_authorization_recording_enabled": False,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": False,
            "actual_nas_write_enabled": False,
            "watcher_enabled": False,
            "cron_enabled": False,
            "dispatch_enabled": False,
            "authority_adapter_binding_enabled": False,
        },
        "next_required_boundary": "mac_relay_authenticated_execution_from_previewed_payload",
    }
    return {"previewed": True, "errors": [], "dto": dto}


def execute_office_controlled_mutation_nas_keeper_mac_relay_execution_from_preview(
    payload: object, *, queue_dir: Path | str | None = None, root_path: Path | str | None = None
) -> dict[str, object]:
    """Execute an authorized handoff using its previewed Mac relay payload.

    This is a Mac-local execution bridge: it rereads the authorized queue item,
    reuses the preview boundary for safe refs/authorization continuity, verifies
    the queued markdown hash, then calls the Mac relay writer only when a local
    relay root is configured. It does not mutate queue state, start automation,
    dispatch to a daemon, expose markdown content in the response, or grant VPS
    NAS authority.
    """

    if root_path is None:
        return {
            "executed": False,
            "written": False,
            "errors": [_error("mac_relay_root", "mac_relay_root_not_configured")],
            "dto": None,
        }

    if not isinstance(payload, Mapping):
        previewed = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(payload, queue_dir=queue_dir)
        return {
            "executed": False,
            "written": False,
            "errors": cast(list[dict[str, str]], previewed.get("errors") or []),
            "dto": None,
        }

    inline_state_fields = {
        "record_execution_state_after_write",
        "execution_record_ref",
        "recorded_by",
        "recorded_at",
    }
    has_inline_state_fields = any(field in payload for field in inline_state_fields)
    allowed_payload_fields = _NAS_KEEPER_HANDOFF_EXECUTION_PAYLOAD_PREVIEW_FIELDS | (inline_state_fields if has_inline_state_fields else set())
    if set(payload) - allowed_payload_fields:
        return {
            "executed": False,
            "written": False,
            "recorded": False if has_inline_state_fields else None,
            "errors": [_error("unsupported_fields", "unsupported_field")],
            "dto": None,
        }
    record_after_write = payload.get("record_execution_state_after_write") is True
    if has_inline_state_fields:
        inline_errors: list[dict[str, str]] = []
        if payload.get("record_execution_state_after_write") is not True:
            inline_errors.append(_error("record_execution_state_after_write", "must_be_true"))
        for field in ("execution_record_ref", "recorded_by", "recorded_at"):
            if field not in payload:
                inline_errors.append(_error(field, "missing_field"))
        for field in ("execution_record_ref", "recorded_by"):
            if field in payload and not _is_opaque_id(payload.get(field)):
                inline_errors.append(_error(field, "invalid_opaque_id"))
        if "recorded_at" in payload and not (
            isinstance(payload.get("recorded_at"), str) and _ISO_UTC_RE.fullmatch(cast(str, payload["recorded_at"]))
        ):
            inline_errors.append(_error("recorded_at", "invalid_timestamp"))
        if inline_errors:
            return {
                "executed": False,
                "written": False,
                "recorded": False,
                "errors": sorted(inline_errors, key=lambda item: (item["field"], item["code"])),
                "dto": None,
            }

    preview_payload = {field: payload[field] for field in _NAS_KEEPER_HANDOFF_EXECUTION_PAYLOAD_PREVIEW_FIELDS if field in payload}
    previewed = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(preview_payload, queue_dir=queue_dir)
    if not previewed.get("previewed"):
        return {
            "executed": False,
            "written": False,
            "recorded": False if record_after_write else None,
            "errors": cast(list[dict[str, str]], previewed.get("errors") or []),
            "dto": None,
        }
    preview_dto = cast(dict[str, object], previewed["dto"])

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    wanted = str(payload["handoff_ref"])
    matched: dict[str, object] | None = None
    for line in queue_file.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if isinstance(item, Mapping) and item.get("handoff_ref") == wanted:
            matched = dict(item)
            break
    if matched is None:
        return {"executed": False, "written": False, "errors": [_error("handoff_ref", "handoff_not_found")], "dto": None}

    markdown_body = str(matched.get("markdown_body", ""))
    markdown_body_sha256 = hashlib.sha256(markdown_body.encode("utf-8")).hexdigest()
    if markdown_body_sha256 != preview_dto.get("markdown_body_sha256"):
        return {
            "executed": False,
            "written": False,
            "errors": [_error("markdown_body_sha256", "queued_markdown_hash_mismatch")],
            "dto": None,
        }

    execution_payload = dict(cast(dict[str, object], preview_dto["execution_payload_preview"]))
    execution_payload["markdown_body"] = markdown_body
    executed = execute_office_controlled_mutation_nas_mac_relay_write(execution_payload, root_path=root_path)
    if not executed.get("executed"):
        return {
            "executed": False,
            "written": False,
            "errors": cast(list[dict[str, str]], executed.get("errors") or []),
            "dto": None,
        }
    execution_dto = cast(dict[str, object], executed["dto"])

    capabilities = dict(cast(dict[str, object], execution_dto["capabilities"]))
    capabilities.update(
        {
            "queue_read_enabled": True,
            "execution_payload_preview_enabled": True,
            "queue_mutation_enabled": False,
            "nas_keeper_authorization_recording_enabled": False,
            "watcher_enabled": False,
            "cron_enabled": False,
            "dispatch_enabled": False,
            "authority_adapter_binding_enabled": False,
        }
    )
    dto = dict(execution_dto)
    dto.update(
        {
            "mode": "nas_keeper_mac_relay_execution_from_preview_completed",
            "handoff_ref": wanted,
            "queue_ref": preview_dto.get("queue_ref"),
            "queue_status": preview_dto.get("queue_status"),
            "authorization_ref": preview_dto.get("authorization_ref"),
            "previewed_payload_verified": True,
            "markdown_body_ref": preview_dto.get("markdown_body_ref"),
            "markdown_body_bytes": preview_dto.get("markdown_body_bytes"),
            "markdown_body_sha256": markdown_body_sha256,
            "markdown_body_included": False,
            "execution_bridge_path": [
                "authorized_queue_item_read",
                "safe_execution_payload_previewed",
                "mac_local_root_checked",
                "mac_relay_execution_completed",
            ],
            "execution_state_recorded": False,
            "capabilities": capabilities,
        }
    )
    if record_after_write:
        evidence_refs = [
            f"readback:{execution_dto['readback_sha256']}",
            f"markdown:{markdown_body_sha256}",
        ]
        if execution_dto.get("audit_ref"):
            evidence_refs.insert(0, f"audit:{execution_dto['audit_ref']}")
        if execution_dto.get("rollback_ref"):
            evidence_refs.append(f"rollback:{execution_dto['rollback_ref']}")
        state_record = record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
            {
                "handoff_ref": wanted,
                "execution_record_ref": payload["execution_record_ref"],
                "relay_execution_ref": payload["relay_execution_ref"],
                "nas_keeper_ref": payload["nas_keeper_ref"],
                "relay_node_ref": payload["relay_node_ref"],
                "recorded_by": payload["recorded_by"],
                "recorded_at": payload["recorded_at"],
                "execution_status": "succeeded",
                "safe_summary": "Mac relay write completed and safe readback evidence was recorded.",
                "evidence_refs": evidence_refs[:12],
            },
            queue_dir=queue_dir,
        )
        if not state_record.get("recorded"):
            return {
                "executed": True,
                "written": True,
                "recorded": False,
                "errors": cast(list[dict[str, str]], state_record.get("errors") or []),
                "dto": dto,
            }
        capabilities["queue_mutation_enabled"] = True
        capabilities["execution_state_recording_enabled"] = True
        dto["capabilities"] = capabilities
        dto["execution_state_recorded"] = True
        dto["execution_state"] = state_record["dto"]
    return {"executed": True, "written": True, "recorded": record_after_write, "errors": [], "dto": dto}



def record_office_controlled_mutation_nas_keeper_mac_relay_execution_state(
    payload: object, *, queue_dir: Path | str | None = None
) -> dict[str, object]:
    """Record final/manual execution state for one authorized NAS Keeper handoff.

    This is a queue-state recording boundary only. It mutates one local queue
    item from authorized to a terminal/manual execution status and stores safe
    evidence refs. It does not execute a write, read NAS files, start automation,
    dispatch to a relay daemon, bind authority adapters, or grant VPS NAS
    authority.
    """

    if not isinstance(payload, Mapping):
        return {"recorded": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    errors: list[dict[str, str]] = []
    if set(payload) - _NAS_KEEPER_HANDOFF_EXECUTION_STATE_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_NAS_KEEPER_HANDOFF_EXECUTION_STATE_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("handoff_ref", "execution_record_ref", "relay_execution_ref", "nas_keeper_ref", "relay_node_ref", "recorded_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "recorded_at" in payload and not (
        isinstance(payload.get("recorded_at"), str) and _ISO_UTC_RE.fullmatch(payload["recorded_at"])
    ):
        errors.append(_error("recorded_at", "invalid_timestamp"))
    if payload.get("execution_status") not in _NAS_KEEPER_HANDOFF_EXECUTION_STATUSES:
        errors.append(_error("execution_status", "unsupported_execution_status"))
    if "safe_summary" in payload and not _is_safe_text(payload.get("safe_summary")):
        errors.append(_error("safe_summary", "invalid_safe_text"))
    if "evidence_refs" in payload:
        evidence_refs = payload.get("evidence_refs")
        if not isinstance(evidence_refs, Sequence) or isinstance(evidence_refs, (str, bytes)):
            errors.append(_error("evidence_refs", "invalid_list"))
        elif len(evidence_refs) > 12 or not all(_is_opaque_ref(item) for item in evidence_refs):
            errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    if errors:
        return {"recorded": False, "errors": sorted(errors, key=lambda item: (item["field"], item["code"])), "dto": None}

    queue_file = _nas_keeper_handoff_queue_file(queue_dir)
    if not queue_file.exists():
        return {"recorded": False, "errors": [_error("queue", "queue_not_found")], "dto": None}

    wanted = str(payload["handoff_ref"])
    items: list[dict[str, object]] = []
    matched_index: int | None = None
    for line in queue_file.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            item = json.loads(line)
        except json.JSONDecodeError:
            continue
        if not isinstance(item, Mapping):
            continue
        item_dict = dict(item)
        if item_dict.get("handoff_ref") == wanted and matched_index is None:
            matched_index = len(items)
        items.append(item_dict)

    if matched_index is None:
        return {"recorded": False, "errors": [_error("handoff_ref", "handoff_not_found")], "dto": None}

    matched = items[matched_index]
    if matched.get("queue_status") != "authorized_for_mac_relay_execution":
        return {
            "recorded": False,
            "errors": [_error("queue_status", "handoff_not_open_for_execution_state_recording")],
            "dto": None,
        }
    if matched.get("nas_keeper_ref") != payload["nas_keeper_ref"]:
        return {"recorded": False, "errors": [_error("nas_keeper_ref", "nas_keeper_mismatch")], "dto": None}
    if matched.get("relay_node_ref") != payload["relay_node_ref"]:
        return {"recorded": False, "errors": [_error("relay_node_ref", "relay_node_mismatch")], "dto": None}

    preview_payload = {
        "handoff_ref": payload["handoff_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "relay_authorized_by": matched.get("authorized_by"),
        "relay_authorized_at": matched.get("authorized_at"),
    }
    previewed = preview_office_controlled_mutation_nas_keeper_mac_relay_execution_payload(preview_payload, queue_dir=queue_dir)
    if not previewed.get("previewed"):
        return {"recorded": False, "errors": cast(list[dict[str, str]], previewed.get("errors") or []), "dto": None}
    preview_dto = cast(dict[str, object], previewed["dto"])

    queue_status_after = _NAS_KEEPER_HANDOFF_EXECUTION_STATUSES[str(payload["execution_status"])]
    next_required_boundary = (
        "manual_nas_keeper_execution_evidence_review"
        if payload["execution_status"] == "manual_review_required"
        else "none_terminal_execution_state_recorded"
    )
    capabilities = {
        "queue_read_enabled": True,
        "queue_mutation_enabled": True,
        "execution_state_recording_enabled": True,
        "execution_payload_preview_enabled": True,
        "vps_nas_mount_enabled": False,
        "vps_credential_access_enabled": False,
        "direct_vps_nas_write_enabled": False,
        "mac_relay_write_enabled": False,
        "actual_nas_write_enabled": False,
        "watcher_enabled": False,
        "cron_enabled": False,
        "dispatch_enabled": False,
        "authority_adapter_binding_enabled": False,
    }
    updated = dict(matched)
    updated.update(
        {
            "queue_status": queue_status_after,
            "execution_record_ref": payload["execution_record_ref"],
            "relay_execution_ref": payload["relay_execution_ref"],
            "execution_status": payload["execution_status"],
            "execution_recorded_by": payload["recorded_by"],
            "execution_recorded_at": payload["recorded_at"],
            "execution_safe_summary": payload["safe_summary"],
            "execution_evidence_refs": list(cast(Sequence[object], payload["evidence_refs"])),
            "execution_state_path": [
                "authorized_queue_item_read",
                "execution_state_recorded",
                "manual_evidence_refs_attached",
                "queue_closed_without_automation",
            ],
            "capabilities": capabilities,
            "next_required_boundary": next_required_boundary,
        }
    )
    items[matched_index] = updated
    tmp_file = queue_file.with_suffix(queue_file.suffix + ".tmp")
    with tmp_file.open("w", encoding="utf-8") as handle:
        for item in items:
            handle.write(json.dumps(item, sort_keys=True, ensure_ascii=False) + "\n")
    tmp_file.replace(queue_file)

    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_execution_state_recorded",
        "recorded": True,
        "handoff_ref": payload["handoff_ref"],
        "execution_record_ref": payload["execution_record_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "queue_ref": matched.get("queue_ref"),
        "queue_status_before": "authorized_for_mac_relay_execution",
        "queue_status_after": queue_status_after,
        "execution_status": payload["execution_status"],
        "recorded_by": payload["recorded_by"],
        "recorded_at": payload["recorded_at"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(cast(Sequence[object], payload["evidence_refs"])),
        "safe_logical_path": matched.get("safe_logical_path"),
        "safe_display_path": matched.get("safe_display_path"),
        "markdown_body_ref": preview_dto.get("markdown_body_ref"),
        "markdown_body_bytes": preview_dto.get("markdown_body_bytes"),
        "markdown_body_sha256": preview_dto.get("markdown_body_sha256"),
        "markdown_body_included": False,
        "execution_state_path": updated["execution_state_path"],
        "capabilities": capabilities,
        "next_required_boundary": next_required_boundary,
    }
    return {"recorded": True, "errors": [], "dto": dto}



def execute_office_controlled_mutation_nas_mac_relay_write(
    payload: object, *, root_path: Path | str | None = None
) -> dict[str, object]:
    """Execute an authenticated NAS Keeper -> Mac relay write on the Mac side.

    This helper is intentionally Mac-local: callers must provide a locally
    configured NAS root. It never grants the VPS a NAS mount, credential, raw
    root path, or direct write authority. Results contain only safe metadata.
    """

    if root_path is None:
        return {"executed": False, "written": False, "errors": [_error("mac_relay_root", "mac_relay_root_not_configured")], "dto": None}
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"executed": False, "written": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}
    required_execution_fields = {"relay_execution_ref", "relay_authorized_by", "relay_authorized_at"}
    allowed_fields = _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS | required_execution_fields
    if set(payload) - allowed_fields:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(required_execution_fields):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("relay_execution_ref", "relay_authorized_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "relay_authorized_at" in payload and not (
        isinstance(payload.get("relay_authorized_at"), str) and _ISO_UTC_RE.fullmatch(payload["relay_authorized_at"])
    ):
        errors.append(_error("relay_authorized_at", "invalid_timestamp"))

    request_payload = {field: payload[field] for field in _NAS_MAC_RELAY_WRITE_REQUEST_FIELDS if field in payload}
    prepared = prepare_office_controlled_mutation_nas_mac_relay_write_request(request_payload)
    errors.extend(cast(list[dict[str, str]], prepared.get("errors") or []))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"executed": False, "written": False, "errors": errors, "dto": None}

    write_payload = {field: payload[field] for field in _NAS_RUNTIME_WRITE_FIELDS}
    write_result = execute_office_controlled_mutation_nas_single_file_write(write_payload, root_path=root_path)
    if not write_result.get("written"):
        return {"executed": False, "written": False, "errors": cast(list[dict[str, str]], write_result.get("errors") or []), "dto": None}

    root = Path(root_path).expanduser().resolve()
    target = (root / str(payload["target_vault_ref"]) / f"{payload['safe_slug']}.md").resolve()
    try:
        target.relative_to(root)
    except ValueError:
        return {"executed": False, "written": False, "errors": [_error("safe_slug", "path_escape_blocked")], "dto": None}
    try:
        readback = target.read_text(encoding="utf-8")
    except OSError:
        return {"executed": False, "written": True, "errors": [_error("readback", "readback_unavailable")], "dto": None}
    readback_sha256 = hashlib.sha256(readback.encode("utf-8")).hexdigest()
    readback_first_line = readback.splitlines()[0] if readback.splitlines() else ""
    if not _is_safe_text(readback_first_line):
        readback_first_line = ""

    write_dto = cast(dict[str, object], write_result["dto"])
    audit_ref = f"audit_{payload['write_ref']}"
    audit_dir = target.parent / ".ai-office-audit"
    audit_path = audit_dir / f"{payload['write_ref']}.json"
    audit_body = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_write_audit",
        "audit_ref": audit_ref,
        "relay_request_ref": payload["relay_request_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "write_ref": payload["write_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "safe_slug": payload["safe_slug"],
        "safe_logical_path": write_dto["safe_logical_path"],
        "safe_display_path": write_dto["safe_display_path"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "relay_authorized_by": payload["relay_authorized_by"],
        "relay_authorized_at": payload["relay_authorized_at"],
        "bytes_written": write_dto["bytes_written"],
        "readback_sha256": readback_sha256,
        "rollback_created": write_dto["rollback_created"],
        "rollback_ref": write_dto["rollback_ref"],
    }
    try:
        audit_dir.mkdir(parents=True, exist_ok=True)
        audit_path.write_text(json.dumps(audit_body, sort_keys=True, ensure_ascii=False) + "\n", encoding="utf-8")
        audit_written = True
    except OSError:
        audit_written = False

    dto = {
        "schema_version": 1,
        "mode": "nas_keeper_mac_relay_write_completed",
        "relay_request_ref": payload["relay_request_ref"],
        "relay_execution_ref": payload["relay_execution_ref"],
        "write_ref": payload["write_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "safe_slug": payload["safe_slug"],
        "safe_title": payload["safe_title"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "nas_keeper_ref": payload["nas_keeper_ref"],
        "relay_node_ref": payload["relay_node_ref"],
        "relay_authorized_by": payload["relay_authorized_by"],
        "relay_authorized_at": payload["relay_authorized_at"],
        "execution_path": ["ai_office_request", "nas_keeper", "mac_relay", "real_nas"],
        "safe_logical_path": write_dto["safe_logical_path"],
        "safe_display_path": write_dto["safe_display_path"],
        "bytes_written": write_dto["bytes_written"],
        "readback_verified": readback == str(payload["markdown_body"]),
        "readback_sha256": readback_sha256,
        "readback_first_line": readback_first_line,
        "rollback_created": write_dto["rollback_created"],
        "rollback_ref": write_dto["rollback_ref"],
        "audit_written": audit_written,
        "audit_ref": audit_ref if audit_written else None,
        "capabilities": {
            "nas_keeper_required": True,
            "mac_relay_required": True,
            "vps_nas_mount_enabled": False,
            "vps_credential_access_enabled": False,
            "direct_vps_nas_write_enabled": False,
            "mac_relay_write_enabled": True,
            "actual_nas_write_enabled": True,
            "filesystem_write_enabled": True,
            "filesystem_read_enabled": True,
            "audit_write_enabled": audit_written,
            "target_mutation_enabled": False,
        },
    }
    return {"executed": True, "written": True, "errors": [], "dto": dto}

def execute_office_controlled_mutation_nas_single_file_write(
    payload: object, *, root_path: Path | str | None = None
) -> dict[str, object]:
    """Write one safe markdown file under a configured root with rollback.

    This is the first intentionally executable NAS/local-file boundary: it is
    constrained to one allowlisted markdown file path derived only from opaque
    vault/slug fields, writes atomically, and returns no raw filesystem paths.
    """

    if root_path is None:
        return {"written": False, "errors": [_error("write_root", "write_root_not_configured")], "dto": None}
    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"written": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _NAS_RUNTIME_WRITE_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))
    for field in sorted(_NAS_RUNTIME_WRITE_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))
    for field in ("write_ref", "package_ref", "target_vault_ref", "requested_by"):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "safe_slug" in payload and not (
        isinstance(payload.get("safe_slug"), str)
        and _SAFE_SLUG_RE.fullmatch(payload["safe_slug"])
        and not _has_raw_marker(payload["safe_slug"])
        and ".." not in payload["safe_slug"]
        and "/" not in payload["safe_slug"]
    ):
        errors.append(_error("safe_slug", "invalid_safe_slug"))
    if "safe_title" in payload and not _is_safe_text(payload.get("safe_title")):
        errors.append(_error("safe_title", "invalid_safe_text"))
    if "markdown_body" in payload and not _is_safe_markdown_body(payload.get("markdown_body")):
        errors.append(_error("markdown_body", "raw_marker_detected"))
    if "requested_at" in payload and not (
        isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])
    ):
        errors.append(_error("requested_at", "invalid_timestamp"))
    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"written": False, "errors": errors, "dto": None}

    root = Path(root_path).expanduser().resolve()
    target = (root / str(payload["target_vault_ref"]) / f"{payload['safe_slug']}.md").resolve()
    try:
        target.relative_to(root)
    except ValueError:
        return {"written": False, "errors": [_error("safe_slug", "path_escape_blocked")], "dto": None}

    try:
        target.parent.mkdir(parents=True, exist_ok=True)
    except OSError:
        return {"written": False, "errors": [_error("write_target", "write_target_unavailable")], "dto": None}
    rollback_created = False
    rollback_ref = None
    if target.exists():
        rollback_ref = f"rollback_{payload['write_ref']}"
        rollback_path = (root / ".ai-office-rollbacks" / str(payload["write_ref"]) / target.name).resolve()
        try:
            rollback_path.parent.mkdir(parents=True, exist_ok=True)
        except OSError:
            rollback_path = (target.parent / ".ai-office-rollbacks" / str(payload["write_ref"]) / target.name).resolve()
            try:
                rollback_path.parent.mkdir(parents=True, exist_ok=True)
            except OSError:
                return {"written": False, "errors": [_error("rollback", "rollback_unavailable")], "dto": None}
        try:
            rollback_path.write_bytes(target.read_bytes())
        except OSError:
            return {"written": False, "errors": [_error("rollback", "rollback_unavailable")], "dto": None}
        rollback_created = True

    markdown_body = str(payload["markdown_body"])
    temp_path = target.with_name(f".{target.name}.{payload['write_ref']}.tmp")
    try:
        temp_path.write_text(markdown_body, encoding="utf-8")
        temp_path.replace(target)
    except OSError:
        try:
            temp_path.unlink(missing_ok=True)
        except OSError:
            pass
        return {"written": False, "errors": [_error("write_target", "write_target_unavailable")], "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "nas_single_file_write_completed",
        "write_ref": payload["write_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "safe_slug": payload["safe_slug"],
        "safe_title": payload["safe_title"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "safe_logical_path": f"{payload['target_vault_ref']}::{payload['safe_slug']}.md",
        "safe_display_path": f"{payload['target_vault_ref']} / {payload['safe_slug']}.md",
        "bytes_written": len(markdown_body.encode("utf-8")),
        "rollback_created": rollback_created,
        "rollback_ref": rollback_ref,
        "capabilities": {
            "validation_enabled": True,
            "local_path_mapping_enabled": True,
            "runtime_path_resolution_enabled": True,
            "vault_mapping_enabled": True,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": rollback_created,
            "filesystem_write_enabled": True,
            "evidence_file_persistence_enabled": True,
            "rollback_point_creation_enabled": rollback_created,
            "single_package_write_enabled": True,
            "nas_write_enabled": True,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
    }
    return {"written": True, "errors": [], "dto": dto}


def validate_office_controlled_mutation_nas_path_resolution(payload: object) -> dict[str, object]:
    """Validate a safe, non-runtime NAS path resolution DTO."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _NAS_PATH_RESOLUTION_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_NAS_PATH_RESOLUTION_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    for field in (
        "path_resolution_ref",
        "package_ref",
        "target_vault_ref",
        "proposed_path_ref",
        "path_policy_ref",
        "created_by",
    ):
        if field in payload and not _is_opaque_id(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_id"))
    if "safe_title" in payload and not _is_safe_text(payload.get("safe_title")):
        errors.append(_error("safe_title", "invalid_safe_text"))
    if "safe_slug" in payload and not (
        isinstance(payload.get("safe_slug"), str)
        and _SAFE_SLUG_RE.fullmatch(payload["safe_slug"])
        and not _has_raw_marker(payload["safe_slug"])
        and ".." not in payload["safe_slug"]
        and "/" not in payload["safe_slug"]
    ):
        errors.append(_error("safe_slug", "invalid_safe_slug"))
    if "created_at" in payload and not (
        isinstance(payload.get("created_at"), str) and _ISO_UTC_RE.fullmatch(payload["created_at"])
    ):
        errors.append(_error("created_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_nas_path_resolution",
        "path_resolution_ref": payload["path_resolution_ref"],
        "package_ref": payload["package_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "proposed_path_ref": payload["proposed_path_ref"],
        "safe_title": payload["safe_title"],
        "safe_slug": payload["safe_slug"],
        "path_policy_ref": payload["path_policy_ref"],
        "created_by": payload["created_by"],
        "created_at": payload["created_at"],
        "capabilities": {
            "validation_enabled": True,
            "path_resolution_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}


def preview_office_controlled_mutation_nas_path_resolution(payload: object) -> dict[str, object]:
    """Build a safe local NAS path-resolution preview without touching mounts or files."""

    validated = validate_office_controlled_mutation_nas_path_resolution(payload)
    if not validated["valid"]:
        return {"valid": False, "errors": validated["errors"], "dto": None}

    source = validated["dto"]
    assert isinstance(source, Mapping)
    target_vault_ref = str(source["target_vault_ref"])
    safe_slug = str(source["safe_slug"])
    vault_labels = {
        "vault_personal_operating_wiki": "Personal Operating Wiki",
    }
    safe_display_vault = vault_labels.get(target_vault_ref, target_vault_ref.replace("_", " ").title())
    safe_logical_path = f"{target_vault_ref}::{safe_slug}.md"
    safe_display_path = f"{safe_display_vault} / {safe_slug}.md"
    dto = {
        "schema_version": 1,
        "mode": "previewed_nas_path_resolution",
        "validated_mode": source["mode"],
        "path_resolution_ref": source["path_resolution_ref"],
        "package_ref": source["package_ref"],
        "target_vault_ref": target_vault_ref,
        "proposed_path_ref": source["proposed_path_ref"],
        "safe_title": source["safe_title"],
        "safe_slug": safe_slug,
        "path_policy_ref": source["path_policy_ref"],
        "created_by": source["created_by"],
        "created_at": source["created_at"],
        "safe_logical_path": safe_logical_path,
        "safe_display_path": safe_display_path,
        "path_preview": {
            "target_vault_ref": target_vault_ref,
            "proposed_path_ref": source["proposed_path_ref"],
            "safe_slug": safe_slug,
            "extension": ".md",
            "raw_path_material_included": False,
        },
        "capabilities": {
            "validation_enabled": True,
            "path_resolution_preview_enabled": True,
            "path_resolution_runtime_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}


def _default_nas_path_resolution_preview_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "nas-path-resolution-previews.jsonl"


def _with_nas_path_resolution_preview_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "validation_enabled": True,
            "path_resolution_preview_enabled": True,
            "path_preview_persistence_enabled": True,
            "path_preview_readback_enabled": False,
            "path_resolution_runtime_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "evidence_file_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "storage_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto


def _normalize_stored_nas_path_resolution_preview(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _NAS_PATH_RESOLUTION_FIELDS if field in item}
    preview = preview_office_controlled_mutation_nas_path_resolution(payload)
    if not preview["valid"]:
        return None
    return _with_nas_path_resolution_preview_persistence_capabilities(cast(Mapping[str, Any], preview["dto"]))


def _read_nas_path_resolution_preview_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_nas_path_resolution_preview(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count


def append_office_controlled_mutation_nas_path_resolution_preview_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate, preview, and append safe NAS path preview metadata to local Hermes JSONL."""

    preview = preview_office_controlled_mutation_nas_path_resolution(payload)
    if not preview["valid"]:
        return {"stored": False, "errors": preview["errors"], "dto": None}

    dto = _with_nas_path_resolution_preview_persistence_capabilities(cast(Mapping[str, Any], preview["dto"]))
    path = store_path or _default_nas_path_resolution_preview_store_path()
    existing_events, _ = _read_nas_path_resolution_preview_store(path)
    if any(event.get("safe_logical_path") == dto["safe_logical_path"] for event in existing_events):
        return {"stored": False, "errors": [_error("safe_logical_path", "duplicate_safe_logical_path")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}


def list_office_controlled_mutation_nas_path_resolution_preview_events(
    *, store_path: Path | None = None, limit: int = 50, package_ref: str | None = None
) -> dict[str, object]:
    """Read back safe stored NAS path preview metadata without resolving paths or exposing raw inputs."""

    path = store_path or _default_nas_path_resolution_preview_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_nas_path_resolution_preview_store(path)
    response_package_ref: str | None = None
    errors: list[dict[str, str]] = []

    if package_ref is not None:
        if _is_opaque_id(package_ref):
            response_package_ref = package_ref
            events = [event for event in events if event.get("package_ref") == package_ref]
        else:
            errors.append(_error("package_ref", "invalid_opaque_id"))
            events = []

    events = events[-max_events:] if max_events else []
    return {
        "schema_version": 1,
        "mode": "stored_nas_path_resolution_previews_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "path_preview_readback_enabled": True,
            "path_preview_persistence_enabled": True,
            "path_resolution_preview_enabled": True,
            "path_resolution_runtime_enabled": False,
            "vault_mapping_enabled": False,
            "mount_discovery_enabled": False,
            "mount_access_enabled": False,
            "filesystem_read_enabled": False,
            "filesystem_write_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "storage_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "package_ref": response_package_ref,
        "errors": errors,
    }


def validate_office_controlled_mutation_nas_save_preparation(payload: object) -> dict[str, object]:
    """Validate a safe, non-persisted NAS save/write preparation DTO."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _NAS_PREPARATION_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_NAS_PREPARATION_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "preparation_ref" in payload and not _is_opaque_id(payload.get("preparation_ref")):
        errors.append(_error("preparation_ref", "invalid_opaque_id"))
    for field in (
        "request_ref",
        "decision_ref",
        "source_manifest_ref",
        "target_vault_ref",
        "proposed_path_ref",
        "rollback_plan_ref",
        "requested_by",
    ):
        if field in payload and not _is_opaque_ref(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_ref"))
    if "evidence_refs" in payload and not _validate_evidence_refs(payload.get("evidence_refs")):
        errors.append(_error("evidence_refs", "invalid_opaque_ref"))
    for field in ("safe_title", "safe_summary"):
        if field in payload and not _is_safe_text(payload.get(field)):
            errors.append(_error(field, "invalid_safe_text"))
    if "requested_at" in payload and not (
        isinstance(payload.get("requested_at"), str) and _ISO_UTC_RE.fullmatch(payload["requested_at"])
    ):
        errors.append(_error("requested_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_nas_save_preparation",
        "preparation_ref": payload["preparation_ref"],
        "request_ref": payload["request_ref"],
        "decision_ref": payload["decision_ref"],
        "source_manifest_ref": payload["source_manifest_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "proposed_path_ref": payload["proposed_path_ref"],
        "safe_title": payload["safe_title"],
        "safe_summary": payload["safe_summary"],
        "evidence_refs": list(payload["evidence_refs"]),
        "rollback_plan_ref": payload["rollback_plan_ref"],
        "requested_by": payload["requested_by"],
        "requested_at": payload["requested_at"],
        "capabilities": {
            "validation_enabled": True,
            "request_creation_enabled": False,
            "persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "evidence_package_persistence_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}



def validate_office_controlled_mutation_nas_evidence_package(payload: object) -> dict[str, object]:
    """Validate a safe, non-persisted NAS evidence package DTO."""

    errors: list[dict[str, str]] = []
    if not isinstance(payload, Mapping):
        return {"valid": False, "errors": [_error("payload", "invalid_payload_type")], "dto": None}

    if set(payload) - _NAS_EVIDENCE_PACKAGE_FIELDS:
        errors.append(_error("unsupported_fields", "unsupported_field"))

    for field in sorted(_NAS_EVIDENCE_PACKAGE_FIELDS):
        if field not in payload:
            errors.append(_error(field, "missing_field"))

    if "package_ref" in payload and not _is_opaque_id(payload.get("package_ref")):
        errors.append(_error("package_ref", "invalid_opaque_id"))
    if "preparation_ref" in payload and not _is_opaque_id(payload.get("preparation_ref")):
        errors.append(_error("preparation_ref", "invalid_opaque_id"))
    for field in (
        "request_ref",
        "decision_ref",
        "wiki_draft_ref",
        "target_vault_ref",
        "proposed_path_ref",
        "rollback_plan_ref",
        "created_by",
    ):
        if field in payload and not _is_opaque_ref(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_ref"))
    for field in ("source_manifest_refs", "review_evidence_refs"):
        if field in payload and not _validate_evidence_refs(payload.get(field)):
            errors.append(_error(field, "invalid_opaque_ref"))
    for field in ("safe_title", "safe_summary"):
        if field in payload and not _is_safe_text(payload.get(field)):
            errors.append(_error(field, "invalid_safe_text"))
    if "created_at" in payload and not (
        isinstance(payload.get("created_at"), str) and _ISO_UTC_RE.fullmatch(payload["created_at"])
    ):
        errors.append(_error("created_at", "invalid_timestamp"))

    errors = sorted(errors, key=lambda item: (item["field"], item["code"]))
    if errors:
        return {"valid": False, "errors": errors, "dto": None}

    dto = {
        "schema_version": 1,
        "mode": "validated_nas_evidence_package",
        "package_ref": payload["package_ref"],
        "preparation_ref": payload["preparation_ref"],
        "request_ref": payload["request_ref"],
        "decision_ref": payload["decision_ref"],
        "source_manifest_refs": list(payload["source_manifest_refs"]),
        "review_evidence_refs": list(payload["review_evidence_refs"]),
        "wiki_draft_ref": payload["wiki_draft_ref"],
        "target_vault_ref": payload["target_vault_ref"],
        "proposed_path_ref": payload["proposed_path_ref"],
        "safe_title": payload["safe_title"],
        "safe_summary": payload["safe_summary"],
        "rollback_plan_ref": payload["rollback_plan_ref"],
        "created_by": payload["created_by"],
        "created_at": payload["created_at"],
        "capabilities": {
            "validation_enabled": True,
            "package_creation_enabled": False,
            "package_persistence_enabled": False,
            "evidence_persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
    }
    return {"valid": True, "errors": [], "dto": dto}



def _default_nas_evidence_package_store_path() -> Path:
    return get_hermes_home() / "office" / "controlled-mutation" / "nas-evidence-packages.jsonl"



def _with_nas_evidence_package_persistence_capabilities(dto: Mapping[str, Any]) -> dict[str, object]:
    stored_dto = dict(dto)
    capabilities = dict(stored_dto.get("capabilities", {}))
    capabilities.update(
        {
            "validation_enabled": True,
            "package_creation_enabled": True,
            "package_persistence_enabled": True,
            "evidence_persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        }
    )
    stored_dto["capabilities"] = capabilities
    return stored_dto



def _normalize_stored_nas_evidence_package(item: object) -> dict[str, object] | None:
    if not isinstance(item, Mapping):
        return None
    payload = {field: item.get(field) for field in _NAS_EVIDENCE_PACKAGE_FIELDS if field in item}
    validation = validate_office_controlled_mutation_nas_evidence_package(payload)
    if not validation["valid"]:
        return None
    return _with_nas_evidence_package_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))



def _read_nas_evidence_package_store(path: Path) -> tuple[list[dict[str, object]], int]:
    events: list[dict[str, object]] = []
    skipped_count = 0
    if not path.exists():
        return events, skipped_count

    with path.open("r", encoding="utf-8", errors="replace") as handle:
        for line in handle:
            try:
                item = json.loads(line)
            except json.JSONDecodeError:
                skipped_count += 1
                continue
            normalized = _normalize_stored_nas_evidence_package(item)
            if normalized is None:
                skipped_count += 1
                continue
            events.append(normalized)
    return events, skipped_count



def append_office_controlled_mutation_nas_evidence_package_event(
    payload: object, *, store_path: Path | None = None
) -> dict[str, object]:
    """Validate and append safe NAS evidence package metadata to local Hermes JSONL."""

    validation = validate_office_controlled_mutation_nas_evidence_package(payload)
    if not validation["valid"]:
        return {"stored": False, "errors": validation["errors"], "dto": None}

    dto = _with_nas_evidence_package_persistence_capabilities(cast(Mapping[str, Any], validation["dto"]))
    path = store_path or _default_nas_evidence_package_store_path()
    existing_events, _ = _read_nas_evidence_package_store(path)
    if any(event.get("package_ref") == dto["package_ref"] for event in existing_events):
        return {"stored": False, "errors": [_error("package_ref", "duplicate_package_ref")], "dto": None}

    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(dto, sort_keys=True, separators=(",", ":")) + "\n")
    return {"stored": True, "errors": [], "dto": dto}



def list_office_controlled_mutation_nas_evidence_package_events(
    *, store_path: Path | None = None, limit: int = 50, request_ref: str | None = None
) -> dict[str, object]:
    """Read back safe stored NAS evidence package metadata without exposing raw inputs."""

    path = store_path or _default_nas_evidence_package_store_path()
    max_events = max(0, min(limit, 200))
    events, skipped_count = _read_nas_evidence_package_store(path)
    response_request_ref: str | None = None
    errors: list[dict[str, str]] = []

    if request_ref is not None:
        if _is_opaque_ref(request_ref):
            response_request_ref = request_ref
            events = [event for event in events if event.get("request_ref") == request_ref]
        else:
            errors.append(_error("request_ref", "invalid_opaque_ref"))
            events = []

    events = events[-max_events:] if max_events else []
    response: dict[str, object] = {
        "schema_version": 1,
        "mode": "stored_nas_evidence_packages_readback",
        "count": len(events),
        "limit": max_events,
        "skipped_count": skipped_count,
        "events": events,
        "capabilities": {
            "package_readback_enabled": True,
            "duplicate_detection_enabled": True,
            "request_filter_enabled": True,
            "malformed_line_resilience_enabled": True,
            "package_persistence_enabled": True,
            "evidence_persistence_enabled": False,
            "storage_write_enabled": False,
            "nas_path_resolution_enabled": False,
            "nas_mount_access_enabled": False,
            "rollback_point_creation_enabled": False,
            "nas_save_preparation_enabled": False,
            "nas_save_enabled": False,
            "nas_write_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "target_mutation_enabled": False,
            "authority_binding_enabled": False,
            "dry_run_execution_enabled": False,
        },
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "errors": errors,
    }
    if response_request_ref is not None:
        response["request_ref"] = response_request_ref
    return response



def build_office_controlled_mutation_execution_readiness_contract(
    *, unsafe_examples: Mapping[str, Any] | None = None
) -> dict[str, object]:
    """Return the non-executing execution readiness contract descriptor."""

    _ = unsafe_examples
    return {
        "schema_version": 1,
        "mode": "execution_readiness_contract_only",
        "execution": {
            "implementation_enabled": False,
            "execution_enabled": False,
            "dispatch_enabled": False,
            "target_mutation_enabled": False,
            "durable_storage_enabled": False,
            "database_migration_required": False,
        },
        "required_readiness_fields": [
            "readiness_ref",
            "request_ref",
            "authority_candidate_ref",
            "dry_run_ref",
            "decision_ref",
            "audit_preview_ref",
            "rollback_preview_ref",
            "risk_class",
            "gate_status",
            "blocked_reasons",
            "required_confirmations",
        ],
        "allowed_gate_statuses": ["blocked", "ready_pending_approval", "ready_read_only", "not_evaluated"],
        "required_gate_fields": [
            "gate_ref",
            "gate_kind",
            "status",
            "evidence_ref",
            "blocked_reason",
        ],
        "optional_safe_fields": ["summary", "gate_count", "warning_count"],
        "redaction": {
            "raw_excluded": True,
            "allowlisted_fields_only": True,
            "opaque_refs_only": True,
            "safe_summaries_only": True,
            "unsupported_values_echoed": False,
        },
        "capabilities": {
            "execution_implementation_enabled": False,
            "execution_dispatch_enabled": False,
            "target_mutation_enabled": False,
            "dry_run_execution_enabled": False,
            "authority_adapter_implementation_enabled": False,
            "authority_adapter_binding_enabled": False,
            "credential_access_enabled": False,
            "audit_write_enabled": False,
            "event_append_enabled": False,
            "request_creation_enabled": False,
            "human_decision_recording_enabled": False,
            "nas_save_enabled": False,
        },
        "execution_endpoints": [],
        "storage_endpoints": [],
        "contract_notes": [
            "contract describes future execution readiness shape only; no execution is implemented",
            "execution implementation, dispatch, target mutation, storage, and audit write require separate approval",
        ],
    }
