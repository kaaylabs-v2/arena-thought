

## Nexus Learn Studio -- Feature & QoL Implementation Plan

Implementing items **1, 3, 4, 5, 6, 7, 8, 12** from the audit suggestions.

---

### Features to Build

#### 1. Global Command Palette (Cmd+K)
Create `src/components/CommandPalette.tsx` using the existing `cmdk` library (already available via `src/components/ui/command.tsx`). Mount it in `src/components/Layout.tsx`.

- Groups: **Pages** (Home, Library, Study Plan, Notebook, Progress, Reflections, Messages, Settings, Profile), **Recent Courses** (from workspace context), **Notebook entries**, **Vocab terms**
- Keyboard shortcut: Cmd+K / Ctrl+K
- Uses `CommandDialog`, `CommandInput`, `CommandList`, `CommandGroup`, `CommandItem` from existing UI primitives
- Navigation via `useNavigate()` on item select
- Subtle, minimal styling consistent with the Studio aesthetic

#### 3. Sidebar Notification Badge on Messages
In `src/components/AppSidebar.tsx`, read `directMessages` from `useWorkspace()` and compute unread count for the current learner. Render a small dot/count badge next to the "Messages" nav item when unread > 0.

- Small `h-4 w-4` accent-colored circle with count, or a dot if just 1
- Only shows when there are unread admin messages for the learner

#### 4. Keyboard Shortcuts
Create `src/components/KeyboardShortcuts.tsx` -- a global listener + help overlay triggered by `?` key.

- Shortcuts: `N` (new note on Notebook page), `T` (add task on Study Plan page), `R` (start reflection on Reflections page), `Esc` (close modals), `Cmd+K` (command palette)
- The overlay is a simple modal listing all shortcuts in a clean grid
- Mount in `Layout.tsx` alongside the command palette
- Page-specific shortcuts only fire when on the relevant page (check `location.pathname`)

#### 5. Course Progress Sparklines in Library Cards
In `src/pages/Library.tsx`, add a tiny inline SVG sparkline (7 data points representing last 7 days of activity) to each course card. Keep it minimal -- a thin polyline path, no axes, no labels, just a subtle visual trend indicator.

- Generate mock sparkline data per course (seeded from course ID for consistency)
- Place below the progress bar, ~20px tall, muted accent color
- Thin stroke, no fill -- understated, not flashy

#### 6. Smooth Page Transitions
Add a CSS-only route-level fade transition. Each page already has `animate-fade-in` on mount. Add a subtle exit animation by wrapping the `<Outlet>` in `Layout.tsx` with a key-based re-mount that triggers the entrance animation on route change.

- Use `useLocation().pathname` as a key on a wrapper div around `<Outlet />`
- Add a subtle `animate-fade-in` class to the wrapper so every route transition gets a consistent entrance
- No external library needed -- keeps it lightweight

#### 7. "Back to Top" Button
Create `src/components/ScrollToTop.tsx` -- a floating button that appears after scrolling 400px down. Place it in `Layout.tsx` inside the main content area.

- Small, rounded, semi-transparent button with an up-arrow icon
- Fades in/out with `opacity` + `translate-y` transition
- Scrolls smoothly to top on click
- Positioned bottom-right of the content area

#### 8. Confirmation Dialogs for Destructive Actions
Add inline "Are you sure?" confirmation steps before deleting notes, vocab terms, tasks, and reflections. Follow the pattern already used in the Notebook editor (the `showDeleteConfirm` state with Yes/No buttons).

- **StudyPlan.tsx**: Add confirmation state per task before `deleteTask` fires
- **Reflections.tsx**: Add confirmation before `deleteReflection`
- **Notebook.tsx vocab**: The delete already works inline; add confirmation for vocab delete too
- Pattern: Replace the delete button with a small "Delete? Yes / No" inline prompt (same as existing note editor pattern)

#### 12. Drag-and-Drop Task Reordering in Study Plan
Add HTML5 native drag-and-drop to task rows in `src/pages/StudyPlan.tsx`. No external library needed.

- Add `draggable`, `onDragStart`, `onDragOver`, `onDrop` handlers to `TaskRow`
- Visual feedback: subtle border highlight on the drop target
- Reorder within the sorted list; store order in workspace context
- Add `reorderTasks` method to `WorkspaceContext.tsx` that accepts a reordered array of task IDs

---

### Files to Create
- `src/components/CommandPalette.tsx`
- `src/components/KeyboardShortcuts.tsx`
- `src/components/ScrollToTop.tsx`

### Files to Edit
- `src/components/Layout.tsx` -- mount CommandPalette, KeyboardShortcuts, ScrollToTop
- `src/components/AppSidebar.tsx` -- add unread message badge
- `src/pages/Library.tsx` -- add sparkline SVG to course cards
- `src/pages/StudyPlan.tsx` -- add drag-and-drop + delete confirmation
- `src/pages/Reflections.tsx` -- add delete confirmation
- `src/pages/Notebook.tsx` -- add vocab delete confirmation
- `src/context/WorkspaceContext.tsx` -- add `reorderTasks` method

