# Paperclip Safe Manifest

Paperclip safe manifests are read-only source summaries produced by a privacy-sensitive relay (MacBook or WSL) and consumed by AI Office as sanitized source/workbench projections.

They are not raw Paperclip exports, not NAS file browsers, not runtime queues, and not mutation instructions.

## Roles

- Producer: MacBook/WSL relay or a local dry-run generator.
- Consumer: AI Office safe DTO adapter.
- Ledger: NAS/Obsidian can keep evidence and rationale, but the dashboard runtime must consume only sanitized manifest fields.
- VPS: may receive validator-passing manifests only; it must not receive broad NAS credentials, direct NAS read-write mounts, raw exports, or relay secrets.

## Required fields

```yaml
schema_version: 1
id: paperclip:demo-shared-context
source_type: paperclip
relay: MacBook
status: partial
checked_at: '2026-05-11T09:00:00Z'
item_count: 12
warning_count: 1
tags:
  - source:koreandeer-shoulder
redaction:
  policy_version: 1
  omitted_sections:
    - raw_documents
    - raw_paths
```

Field rules:

- `schema_version`: integer, currently `1`.
- `id`: safe stable source id. Prefer `paperclip:<slug>`.
- `source_type`: one of `paperclip`, `nas_manifest`, `session_tag`, `relay_projection`.
- `relay`: one of `MacBook`, `WSL`, `VPS`, `unknown`.
- `status`: one of `ok`, `partial`, `missing`, `unavailable`, `error`.
- `checked_at`: ISO-like UTC timestamp string.
- `item_count`: non-negative integer count only.
- `warning_count`: non-negative integer count only.
- `tags`: list of allowlisted source tags matching `^source:[a-z0-9][a-z0-9_-]{1,80}$`.
- `redaction.policy_version`: integer.
- `redaction.omitted_sections`: safe labels only; do not include paths or document titles that reveal private content.

## Optional safe fields

- `label`: sanitized display label, no full paths.
- `provenance_summary`: short safe text such as `relay-generated safe manifest`.
- `path_bucket`: coarse bucket such as `nas-personal-ledger`, `macbook-local`, `wsl-relay`, `unknown`.
- `extension_buckets`: counts by broad extension class, for example `{ markdown: 3, image: 2, pdf: 1, other: 6 }`.
- `staleness_note`: safe summary like `older than 7 days`.

## Forbidden keys

Forbidden keys are rejected recursively, even when nested:

- `prompt`
- `transcript`
- `body`
- `result`
- `script`
- `args`
- `log`
- `path`
- `absolute_path`
- `full_path`
- `secret`
- `token`
- `password`
- `credential`
- `auth`
- `env`

Use `path_bucket` instead of `path`.

## Forbidden value patterns

Manifest values must not contain:

- full private filesystem paths such as `/Users/...`, `/home/...`, `/Volumes/...`, drive-letter paths, or UNC paths;
- token/secret-looking values;
- raw prompt/transcript/body snippets;
- raw logs or command output;
- provider/model identity if it came from private session metadata.

The validator reports concise field paths and categories. It must not echo the suspicious value.

## Queue and watcher non-goals

A manifest is a snapshot. It is not:

- a queue item;
- a lock file;
- a live bus event;
- an approval command;
- a refresh instruction;
- a NAS synchronization mechanism.

If the source changes, a relay can generate a new manifest snapshot and validate it before the dashboard adapter reads it.

## Example files

- Valid example: `docs/ai-office/examples/paperclip-source.example.yaml`

## Validation

Run:

```bash
python scripts/ai_office/validate_paperclip_manifest.py docs/ai-office/examples/paperclip-source.example.yaml
```

Expected output:

```text
OK: safe Paperclip manifest
```
