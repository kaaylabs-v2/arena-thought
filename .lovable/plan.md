

# Learner Studio — Complete Audit

## 1. UI & Layout Inconsistencies

### Header/Spacing Inconsistencies
| Page | Header Style | Max Width | Padding | Issue |
|------|-------------|-----------|---------|-------|
| Home | `text-4xl`, `mb-8`, `max-w-6xl`, `px-8 py-8` | 6xl | px-8 py-8 | Padding pattern differs from others |
| Library | `text-4xl`, `mb-8`, `max-w-5xl`, `p-8 lg:p-12 xl:p-16` | 5xl | Responsive | Standard |
| Study Plan | `text-4xl`, `mb-8`, `max-w-3xl`, `p-8 lg:p-12 xl:p-16` | 3xl | Responsive | Standard |
| Notebook | `text-4xl`, `mb-8`, `max-w-5xl`, `p-8 lg:p-12 xl:p-16` | 5xl | Responsive | Standard |
| Insights | `text-4xl`, `mb-8`, `max-w-5xl`, `p-8 lg:p-12 xl:p-16` | 5xl | Responsive | Standard |
| Reflections | `text-4xl`, `mb-8`, `max-w-3xl`, `p-8 lg:p-12 xl:p-16` | 3xl | Responsive | Standard |
| Profile | `text-4xl`, `mb-8`, `max-w-2xl`, `p-8 lg:p-12 xl:p-16` | 2xl | Responsive | Standard |
| Settings | `text-4xl`, `mb-8`, `max-w-5xl`, `p-8 lg:p-12 xl:p-16` | 5xl | Responsive | Standard |
| **Communication** | **`text-[2rem]`**, `mb-6`, max-w-[1200px], `p-6 lg:p-8` | 1200px | p-6 lg:p-8 | **Breaks pattern** |

**Finding**: Communication page uses `text-[2rem]` instead of `text-4xl`, `mb-6` instead of `mb-8`, `p-6 lg:p-8` instead of the standard responsive padding, and a pixel-based max-width. It also lacks the subtitle `tracking-[-0.01em]` class and uses `font-normal` instead of `font-medium`.

### Missing Subtitle on Communication
Communication subtitle reads "Messages and announcements from your institution" but uses `text-sm mt-0.5` instead of the standard `text-muted-foreground font-sans text-sm tracking-[-0.01em]` with `mb-1.5` on the heading.

---

## 2. Data Sync Issues (Learner ↔ Admin Studio)

### Library Progress Hardcoded by ID
Library.tsx line 18 hardcodes progress by course ID (`c.id === "4" ? 100 : c.id === "1" ? 68 : ...`). This won't work when admin creates new courses with auto-incremented IDs like `admin-501`. New courses get a `Math.random()` fallback that changes on every render — a visual flicker bug.

### Library `lastAccessed` Shows Raw `updatedAt` String
Library card displays `course.lastAccessed` which is just `c.updatedAt` (e.g., "Mar 14, 2026") — not a relative "X days ago" label. Inconsistent with Home page which shows "18 hours ago" etc.

### Workspace `courseData` Only Has 3 Entries
`Workspace.tsx` line 16 hardcodes only 3 course IDs (`"1"`, `"2"`, `"3"`). If the admin publishes courses with IDs `"4"`, `"5"`, `"6"`, opening `/workspace/4` falls back to course `"1"` data — wrong title and module shown in the workspace header.

### Insights + Home Duplicate `fixedCourseData`
Both `Index.tsx` and `Insights.tsx` define their own identical `fixedCourseData` arrays. These should be shared from a single source to avoid drift. A comment on line 9 of Index.tsx says "must match Insights.tsx" — fragile.

### Notification Inbox Body Duplication
`NotificationInbox` in Index.tsx renders the body text twice — once inside the animated grid-rows expand/collapse AND once below it as a `line-clamp-2` fallback (lines 157-168). When collapsed, the user sees the body text twice (truncated + hidden grid). The unexpanded state should only show the line-clamp version.

---

## 3. Logic Issues

### `seededFocusAreas` Still in Insights.tsx
Despite adding the new `nexi-insights-data.ts` system, Insights.tsx still has a local `seededFocusAreas` array (line 44-49) that is completely separate from the centralized insights. The "Topics to Revisit" section uses `seededFocusAreas` directly and only cross-references `topInsights` for border colors — the data isn't truly unified.

### Home Page Nexi Suggestion Never Rotates
`getTopInsights(1)` is called in a `useMemo` with empty deps — it will always return the same insight. The "rotate" behavior described in the plan isn't implemented; it's static.

### Study Plan Drag Reorder vs Sort Conflict
`sortedActive` sorts by priority, but `reorderTasks` reorders by drag position. After dragging, the next render re-sorts by priority, undoing the drag. The drag-and-drop is essentially non-functional for cross-priority moves.

### Settings Toggles Are Local State Only
Voice input, auto-expand sources, auto-save, Nexi tone, citations, follow-ups, conversation memory, code depth — all use `useState` and are lost on page navigation. They don't persist to `appSettings` in WorkspaceContext or localStorage.

### Communication `formatListTime` Edge Case
The `formatListTime` function tries to parse "Just now" and "Yesterday" as dates, which is fine, but the fallback `new Date(ts)` on strings like "2 hours ago" returns `Invalid Date`, causing the function to return the raw string. Not broken visually but technically incorrect.

---

## 4. Dark Mode / Light Mode Issues

### Notebook Card Colors Hardcoded
`courseColors` in Notebook.tsx uses hardcoded opacity values like `bg-accent/[0.06]` and `bg-primary/[0.04]` which work but courses not in the map get `bg-card border-border` — acceptable, but the card hover shadow on line 490 uses hardcoded HSL `hsl(222 28% 14% / 0.1)` which won't adapt to dark mode (shadow too dark on light, invisible on dark).

### Insights Bar Chart
The bar chart `fill="hsl(var(--accent))"` is correct, but the `cursor` fill `hsl(var(--accent) / 0.08)` may not render correctly across all browsers due to CSS custom property syntax inside SVG attributes.

---

## 5. Incomplete / Half-Baked Features

### Connectors Panel (Settings)
All 6 connectors (Notion, Drive, Calendar, Zotero, Readwise, Obsidian) show a "Connect" button that fires a toast saying "coming in a future update." The `connected` state variable exists but is never set to `true` — the button is a dead end with no toggle.

### Study Plan Sync Panel
Google Calendar and Notion sync toggles in Study Plan fire toasts but don't actually connect to anything. The `platformStates` are local state only. Acceptable for demo but worth noting.

### Reflections `groupByDate` Is Naive
The function checks for string equality on `"Just now"`, `"Today"`, `"Yesterday"` — but reflections created in the current session get `"Just now"` while seeded ones have fixed dates. There's no actual date parsing, so anything that doesn't match these strings goes to "Earlier." If a reflection has a date like "Mar 15, 2026" it goes to "Earlier" even if it was yesterday.

### Profile Edit Doesn't Persist Bio/Goal Across Role Switch
When switching roles via Settings, `userProfile` doesn't change, but the Admin Studio has its own `studioCurrentAdmin` profile. There's no sync — editing the learner profile doesn't reflect in admin, and vice versa. Expected for demo but creates a disconnect.

---

## 6. Missing Accessibility / UX Polish

- **No focus indicators on note cards** in Notebook grid/list view — keyboard navigation is impossible.
- **Drag handles in Study Plan** have no keyboard alternative (Tab + Arrow keys).
- **Reflection delete confirmation** positioned `absolute top-4 right-4` can overlap with the mood label on short reflections.
- **Communication thread area** has no empty state text when no thread is selected on desktop (line 340 says "Select a conversation" but it auto-selects the first one, so this is never visible).

---

## 7. QoL Improvements I'd Recommend

### High Priority
1. **Search in Study Plan** — There's no way to search or filter tasks. With many tasks, finding one is tedious. Add a search bar matching the Library/Notebook pattern.
2. **Notebook: Course filter chips** — The notebook has sort-by-course but no filter chips. Add course-based filter pills above the notes grid for quick narrowing.
3. **Home: "Study time this week" stat** — The greeting block has space for a small stat line. Add `"12.5h studied this week"` pulled from the same `weeklyActivity` data used in Insights.

### Medium Priority
4. **Reflections: Link to course** — There's a `linkedCourse` field on Reflection type but no UI to set it during composition. Add a course selector dropdown to the reflection composer.
5. **Library: Sort options** — Library has filter tabs (All/Active/Completed/Pinned) but no sort (by progress, alphabetical, last accessed). Add a sort dropdown.
6. **Insights: Export data** — The Insights page shows metrics but provides no way to export or share progress. A small "Export" button that downloads a summary PDF/JSON would round it out.

### Nice to Have
7. **Workspace: Breadcrumb** — When entering a workspace, there's no breadcrumb showing Library > Course Name. Add a minimal breadcrumb or back-to-library link in the workspace header.
8. **Home: Streak counter** — A "5-day study streak" counter near the greeting would add motivational context at zero implementation cost (mock data).
9. **Notebook: Word count** — Show word count in the note editor footer, next to the formatting toolbar.

---

## Summary of Bugs to Fix (Priority Order)

1. **Communication page header** — Breaks the unified header pattern (text size, padding, spacing)
2. **Notification Inbox double body text** — Shows notification body twice when collapsed
3. **Library progress hardcoding** — Breaks for dynamically-created courses, flickers on render
4. **Workspace courseData** — Only supports 3 course IDs; others show wrong data
5. **Duplicate fixedCourseData** — Should be a shared constant
6. **Settings toggles don't persist** — All Nexi/workspace settings reset on navigation
7. **Study Plan drag vs sort conflict** — Drag reorder is undone by priority sort on next render
8. **Insights seededFocusAreas not unified** — Still separate from nexi-insights-data.ts

