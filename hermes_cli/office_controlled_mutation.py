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
    readback = target.read_text(encoding="utf-8")
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
    except PermissionError:
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

    target.parent.mkdir(parents=True, exist_ok=True)
    rollback_created = False
    rollback_ref = None
    if target.exists():
        rollback_ref = f"rollback_{payload['write_ref']}"
        rollback_path = (root / ".ai-office-rollbacks" / str(payload["write_ref"]) / target.name).resolve()
        try:
            rollback_path.parent.mkdir(parents=True, exist_ok=True)
        except PermissionError:
            rollback_path = (target.parent / ".ai-office-rollbacks" / str(payload["write_ref"]) / target.name).resolve()
            try:
                rollback_path.parent.mkdir(parents=True, exist_ok=True)
            except PermissionError:
                return {"written": False, "errors": [_error("rollback", "rollback_unavailable")], "dto": None}
        rollback_path.write_bytes(target.read_bytes())
        rollback_created = True

    markdown_body = str(payload["markdown_body"])
    temp_path = target.with_name(f".{target.name}.{payload['write_ref']}.tmp")
    temp_path.write_text(markdown_body, encoding="utf-8")
    temp_path.replace(target)

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
