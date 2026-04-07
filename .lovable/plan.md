

# Workspace Page — Comprehensive Audit & Improvement Plan

## Issues Found

### Layout & Sizing

1. **Double border between Sources/Notebook and Nexi panels** — Sources panel has `border-r border-border` on the ResizablePanel AND the ResizableHandle draws its own visual separator. Same issue on the Notebook side (`border-l border-border`). This creates a 2px-wide visual seam that looks unintentional. **Fix:** Remove the border classes from the ResizablePanel containers; let the handles be the sole divider.

2. **Collapse/expand buttons not vertically centered** — The `pt-3` positions them near the top. They should be `items-center` (vertically centered in the full height) for a polished look, matching how Figma/VS Code does it.

3. **Mini rail width inconsistency** — `MINI = 3.2%` is ~45px at 1400px but ~64px at 2000px. On very wide screens, the mini rail becomes too wide. **Fix:** Use a clamped pixel-based approach or set a max on mini mode.

### Text Visibility & Typography

4. **Notebook header uses `text-[10px]`** — The "NOTEBOOK" label and note count are both 10px, making them hard to read especially in dark mode. The Sources pane header also uses 10px for its label. **Fix:** Bump to 11px for both.

5. **Note card snippet at `text-muted-foreground/70`** — In dark mode, 70% opacity on `muted-foreground` (which is already muted) creates very low contrast text. Same issue on note dates (`text-[9px] text-muted-foreground/70`) and tag pills. **Fix:** Raise opacity floor to `/80` for snippets and `/60` for dates.

6. **Vocab delete button invisible until hover (`text-muted-foreground/0`)** — This is clever but means zero discoverability. On touch devices, there's no hover state at all. **Fix:** Start at `/30` opacity so it's subtly visible.

7. **Source viewer body text uses `text-foreground/85`** — Slightly reduces contrast unnecessarily. In dark mode this can feel washed out. **Fix:** Use `text-foreground` for body text, keep `/85` only for secondary content.

8. **Nexi disclaimer text at 10px** — "Grounded in your course materials" is tiny and easy to miss. Fine as-is for aesthetics but consider bumping to 11px.

### Dark Mode Specific

9. **Code blocks use `bg-foreground/[0.03]`** — In dark mode, foreground is light, so 3% of a light color is nearly invisible. The code block background barely differs from the card. **Fix:** Use `bg-muted/40` which adapts correctly in both themes.

10. **Source metadata strip `bg-muted/20`** — Too subtle in dark mode, almost indistinguishable from the card background. **Fix:** Bump to `bg-muted/30`.

11. **Nexi chat card uses `shadow-soft`** — If this shadow uses a light-only token, it may be invisible in dark mode. Verify the shadow adapts; if not, add a subtle `border-border/60` as fallback visual separation.

### Padding & Spacing Inconsistencies

12. **Sources list mode header padding `px-4 py-3.5`** vs **Notebook header `px-4 py-3.5`** — These match, which is good. But Sources viewer header uses `px-5 py-3` — the `py` is 0.5 less, causing a visual jump when switching from list to viewer. **Fix:** Normalize to `py-3.5` everywhere.

13. **Nexi pane uses `px-8`** for messages and input, but Sources viewer uses `px-6` and Notebook uses `px-4`. While the panes are different widths, the padding ratio feels inconsistent. The Nexi input area has `pb-6 pt-3` which is asymmetric — consider `pb-5 pt-3` for tighter bottom breathing room.

14. **Source list items use `py-[7px]`** — Arbitrary pixel value instead of Tailwind spacing. **Fix:** Use `py-1.5` (6px) or `py-2` (8px) for consistency.

### Fluidity & Animation

15. **No entrance animation on Sources list/viewer transition** — When switching from list to viewer mode, the content just swaps instantly. **Fix:** Add `animate-fade-in-fast` to the list mode root container, matching the viewer which already has `animate-fade-in-gentle`.

16. **Follow-up chips lack stagger** — All four chips appear simultaneously. Adding a 40ms stagger per chip would feel more polished.

17. **Typing indicator dots use `animate-pulse`** — This is a slow, opacity-based pulse. A bouncing dot animation (translateY) would feel more lively and match modern chat UIs.

### Logic & UX Issues

18. **`notebookBeforeViewer` state not persisted** — If the user refreshes, the notebook doesn't restore to its pre-viewer state. Minor since all state is ephemeral, but worth noting.

19. **Source completion status is hardcoded** — The `completed` booleans on source items are static in the `modules` array. They don't update when users actually interact with sources. These should eventually come from context.

20. **Voice input is fully simulated with hardcoded phrases** — The `handleVoiceToggle` always types "How does backpropagation handle vanishing gradients?" regardless of context. The simulation should at least be acknowledged with a visible "(demo)" label.

21. **No keyboard shortcut to toggle Sources/Notebook panes** — Power users would benefit from shortcuts like `[` for Sources and `]` for Notebook.

22. **VocabSelectionPopover hardcodes `left` clamping at `500`** — `Math.min(selection.left, 500)` — this breaks on narrow center panes or wide screens. Should use container width dynamically.

---

## Quality of Life Suggestions

### High Impact

- **Search within Sources** — Add a filter/search input in the Sources list header to quickly find materials in long module lists
- **Note editing** — Currently notes are write-only; users can't edit or delete saved notes. Add inline edit and a delete button
- **Drag to reorder notes** — Let users organize their notebook entries
- **Breadcrumb in Nexi header** — Show "Library > Course Title" as a clickable breadcrumb to navigate back without using the sidebar

### Medium Impact

- **Source progress tracking** — Mark sources as "read/watched" from the viewer with a button, updating the check marks dynamically
- **Notebook export** — Add an export button (copy all notes as markdown, or download as .md)
- **Nexi conversation history** — Show a dropdown of past conversations or a "New chat" button to start fresh
- **Pin/star important notes** — Allow users to pin notes to the top of the notebook
- **Character count on quick capture** — Show remaining characters or a subtle indicator when notes get long

### Polish

- **Empty state for Nexi** — When no messages exist, show a centered welcome card with suggested prompts instead of a blank area
- **Tooltip on source type icons** — In the mini rail, hovering shows the title; also show the type label
- **Smooth scroll-to-bottom button** — When the user scrolls up in Nexi chat, show a "scroll to bottom" floating pill (like iMessage)
- **Reading progress indicator** — In the source viewer, add a thin progress bar at the top showing scroll position through the document

---

## Implementation Summary

| Category | Files to Edit | Scope |
|---|---|---|
| Border/layout fixes | `Workspace.tsx` | Remove double borders, center collapse buttons |
| Text visibility | `SourcesPane.tsx`, `NotebookPane.tsx`, `NexiPane.tsx` | Bump opacity floors, fix font sizes |
| Dark mode fixes | `SourcesPane.tsx`, `NexiPane.tsx` | Code block bg, metadata strip bg |
| Padding normalization | `SourcesPane.tsx`, `NotebookPane.tsx` | Normalize py values, replace arbitrary px |
| Animation polish | `SourcesPane.tsx`, `NexiPane.tsx` | Add fade-in to list mode, stagger chips, bouncing dots |
| UX features | All workspace files + context | Search, note editing, breadcrumb, empty states |

The fixes (items 1–17) are straightforward CSS/class changes. The QoL features (search, note editing, export) would each be separate follow-up tasks.

