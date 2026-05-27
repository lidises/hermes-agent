# AI Office unified workbench superseded index

This index records the product-surface consolidation boundary for older AI Office-related project surfaces.

Canonical surface:
- `/office` is the single AI Office user-facing workbench.
- The RPG Visualizer is the primary default viewport.
- Former separate projects remain as source/evidence layers, not as competing top-level products.

Superseded-by mapping:

| Former project/surface | Current layer inside `/office` | Status |
| --- | --- | --- |
| AI Office / VPS dashboard | RPG operating room shell / unified workbench | absorbed as canonical surface |
| VPS ai-office Kanban | Operating-board layer | source of board state, not a separate user surface |
| Paperclip / sourceTags | Evidence/source layer | safe manifest/source-tag evidence only |
| Projection Pipeline / safe cache | Projection-cache layer | safe cache/status aggregate only |
| DeskRPG / RPG Visualizer | Primary visualization layer | default user surface |
| NAS Keeper / controlled-mutation | Approval, receipt, boundary, and evidence tabs | default-closed diagnostics; no executable controls |

Safety boundary:
- This consolidation does not delete historical docs, source pipelines, queues, receipts, or runtime state.
- It does not add production NAS write authority, direct VPS NAS authority, watcher/cron/dispatcher/authority-adapter activation, public exposure, gateway restart, or raw markdown/path/secret/write-payload echo.
- Additional real NAS writes or replacement writes still require a new exact approval boundary.

UI contract:
- Header metadata is reduced to safe badges.
- Sidebar/plugin-like duplicates are represented as absorbed internal `/office` anchors.
- RPG inspector evidence points to Kanban, Paperclip, and NAS Keeper as safe facets.
- Detailed technical evidence remains behind default-closed RPG Visualizer tabs.
