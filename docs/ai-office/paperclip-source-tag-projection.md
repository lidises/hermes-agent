# Paperclip Source-Tag Projection Bridge

This bridge describes how AI Office links work state to Paperclip/shared-context state without exposing raw files, prompts, transcripts, logs, or private paths.

## Mental model

```text
Kanban/work item  ── safe source tags ── Paperclip safe manifest
```

The join key is an allowlisted tag such as `source:koreandeer-shoulder`, not a filename, document title, NAS path, prompt snippet, task body, or transcript fragment.

## Source tag format

Allowed tag regex:

```text
^source:[a-z0-9][a-z0-9_-]{1,80}$
```

Rules:

- Lowercase ASCII only after `source:`.
- Use hyphen or underscore for word boundaries.
- Keep tags stable across safe manifest refreshes.
- Prefer project/context semantics over storage semantics.
- Do not encode usernames, full private paths, secrets, provider/model ids, exact document titles, or patient/person identifiers.

Good:

```text
source:koreandeer-shoulder
source:clinic-blog-draft
source:paperclip-demo
```

Bad:

```text
source:/Users/example/nas/...
source:raw prompt about shoulder pain
source:token-placeholder
source:John-Doe-chart
```

## Dedupe and cap rules

Consumers should:

1. Drop non-string values.
2. Keep only values matching the allowlist regex.
3. Deduplicate while preserving first-seen order.
4. Cap display to 8 tags per source by default.
5. Treat an empty tag list as `unknown` rather than inferring from raw material.

## Relation to `session_search`

`session_search` can help a server-side or local relay discover prior context, but its raw summaries/transcripts must not be forwarded to the browser.

Allowed browser projection:

- safe source tag
- coarse count
- health/status
- redaction/provenance summary
- relay label allowlist

Forbidden browser projection:

- transcript snippets
- prompt snippets
- raw session titles/previews unless separately approved and redacted
- tool arguments
- model/provider identity from private metadata

## Relationship to manifests

A manifest may include:

```yaml
tags:
  - source:koreandeer-shoulder
```

AI Office can then show that a work item and a Paperclip source are related when both carry the same safe tag. The UI must remain read-only and should expose only source health and counts.

## Failure posture

- Missing tag: show no relation; do not infer.
- Invalid tag: validator rejects manifest or frontend helper drops it.
- Duplicate tags: dedupe.
- Too many tags: cap and optionally show `+N` count.
- Conflicting source health: prefer worst visible health (`error` > `partial` > `missing`/`unavailable` > `ok`) without reading raw content.

## Non-goals

This bridge does not define:

- NAS watchers;
- task mutation controls;
- relay execution controls;
- raw source browsing;
- approval semantics;
- a runtime queue or lock service.
