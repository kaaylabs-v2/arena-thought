

## Home Page (Learner Studio) — Full UI Audit

### What works well

- **Greeting is warm and contextual.** Time-of-day greeting + user name is a strong personal touch. The serif/sans pairing looks scholarly.
- **Two-column layout is well-structured.** Left column for primary learning flow, right column for ambient context — clear information hierarchy.
- **Staggered entrance animations** on each section (`[animation-delay:100ms]`, `200ms`, `300ms`) create a polished "blur-to-sharp" cascade. Good use of `animation-fill-mode: backwards`.
- **Card-interactive class** provides excellent Apple-style hover/active microinteractions (translateY, spring easing, shadow).
- **Progress bar** in the Continue Learning card has a smooth `duration-1000 ease-spring` fill animation — feels alive on page load.

---

### Issues found — ranked by severity

#### 1. Notification Inbox dismiss state is local and disconnected from Communication page
Dismissing a notification on Home uses `useState<Set<string>>` local to `NotificationInbox`. Navigating to `/communication` shows the same announcements with their own separate dismiss state. This creates a confusing split-brain: you dismiss on Home, navigate to Communication, and the same notification is back. The "View all" link promises continuity but delivers none.

**Fix:** Either lift dismiss state into `WorkspaceContext` so both pages share it, or accept that Home is a lightweight preview and remove the dismiss button entirely — replace it with a simple "View all" CTA.

#### 2. "Last active" timestamps are static seed strings, not computed
`lastActiveOptions` is `["2 hours ago", "Yesterday", "3 days ago", ...]` — these are randomly assigned via `seedHash` and never update. A user returning to the page hours later still sees "2 hours ago." Worse, the seed hash means different courses get random timestamps that don't reflect any actual usage pattern. "2 hours ago" on a course the user has never opened is misleading.

**Fix:** Either derive "last active" from a real timestamp stored per course (even if mocked at seed time as `Date.now() - offset`), or remove the timestamp from the Continue Learning card and only show the module label. Honesty is better than fake precision.

#### 3. Progress values are deterministic but meaningless
`seedHash(c.id, 2) * 70 + 15` produces a number between 15–85% per course. This never changes. Completing tasks, opening workspaces, or interacting with Nexi has zero effect on progress. The progress bar looks functional but is decorative.

**Fix (minimal):** Acknowledge this is mock data and leave it, but ensure the progress bar doesn't animate on every re-render (it does — because the component remounts on route change via the `key={location.pathname}` in Layout). Either memoize the value or suppress the animation on subsequent visits.

#### 4. Task checkbox completes but doesn't animate out
Toggling a task on the Home page calls `toggleTask`, which sets `completed: true`. But the task list filters `!t.completed`, so the task instantly vanishes. There's no exit animation — one frame it's there, the next it's gone. This feels broken.

**Fix:** Add a brief delay or exit animation before filtering out completed tasks. A simple approach: track recently-completed IDs in local state, show them with `opacity-50 line-through` for ~400ms, then remove.

#### 5. Notification Inbox expand/collapse has no animation
Clicking a notification toggles `expandedIds`, which toggles `line-clamp-2` on/off. The text jumps between clamped and full height with no transition. This feels abrupt for a UI that emphasizes smoothness elsewhere.

**Fix:** Wrap the body text in a container with `transition-all duration-200` and use `max-height` or `grid-rows` animation instead of toggling `line-clamp`.

#### 6. Quick Actions section has no section label
The left column has clearly labeled sections ("Upcoming tasks", "Recent courses") with the `text-[11px] uppercase tracking-widest` pattern. The Quick Actions block in the right column has no header — it's just three bare links below the notification inbox. This breaks the visual consistency.

**Fix:** Add a section label: `"Quick actions"` using the same `text-[11px] uppercase tracking-widest text-muted-foreground mb-3` pattern.

#### 7. "View all →" link style is inconsistent
The Tasks section uses `text-[11px] font-sans text-accent hover:text-accent/80` with an inline arrow `→`. The Notification Inbox uses `text-xs text-accent hover:underline` with the text "View all" (no arrow). Different sizes, different hover effects, different arrow conventions.

**Fix:** Standardize on one style. Recommend: `text-[11px] font-sans text-accent hover:text-accent/80 transition-colors` with `→` suffix for all "view all" links.

#### 8. Greeting subtitle gap to first content block
The greeting has `mb-6` (24px) between the subtitle and the two-column grid. The app-wide standard established in other pages is `mb-8` (32px).

**Fix:** Change `mb-6` to `mb-8` on the greeting wrapper for consistency with the 32px subtitle-to-content gap standard.

#### 9. Continue Learning card lacks a visible label
Every other section has a small uppercase header. The Continue Learning card is the most important element on the page but has no "Continue learning" label above it — it's just a card that appears. First-time users have to infer its purpose.

**Fix:** Add a section label above the card: `"Continue learning"` using the same `text-[11px] uppercase tracking-widest text-muted-foreground mb-4` pattern.

#### 10. Right column doesn't stack gracefully below 900px
At `min-[900px]` the layout switches from 1-col to 2-col. But in 1-col mode the right column (notifications + quick actions) drops below all three left-column sections, meaning the user has to scroll past tasks and all recent courses to see notifications. Notifications are arguably more urgent.

**Fix:** Consider reordering in mobile layout — either move notifications above tasks using CSS `order`, or use a different mobile-first layout where notifications appear after the Continue Learning card.

#### 11. Empty state uses `min-h-screen` but the page is inside a Layout with a sidebar
The empty state div has `h-full min-h-screen` which doesn't account for the sidebar. On desktop, the content area is already constrained by `flex-1 min-w-0` in the Layout. The `min-h-screen` creates a taller-than-needed container when the sidebar is present.

**Fix:** Replace `min-h-screen` with `min-h-[calc(100vh-2rem)]` or just use `h-full flex-1` and let the parent flex context handle centering.

#### 12. Priority dot has `group-hover:scale-125` but there's no `group` class on the task row
The priority dot uses `group-hover:scale-125` but the parent `div` doesn't have `className="group"`. The hover scale effect never fires — it's dead CSS.

**Fix:** Add `group` to the task row's className.

#### 13. Send button missing from notification dismiss — no confirmation feedback
Dismissing a notification shows no toast or visual confirmation. The card just becomes 50% opacity. There's no undo. For destructive-ish actions, some feedback is expected.

**Fix:** Either add a brief `toast("Notification dismissed")` with an undo option, or add a subtle checkmark animation on dismiss.

---

### Summary of recommended changes

| Priority | Change | Scope |
|----------|--------|-------|
| High | Fix notification dismiss state (share with Communication or remove dismiss) | Index.tsx + possibly WorkspaceContext |
| High | Add exit animation for completed tasks (brief fade-out before removal) | Index.tsx |
| Medium | Add section labels ("Continue learning", "Quick actions") | Index.tsx |
| Medium | Fix greeting gap: `mb-6` → `mb-8` | Index.tsx |
| Medium | Standardize "View all →" link style across sections | Index.tsx |
| Medium | Add notification expand/collapse animation (replace line-clamp toggle) | Index.tsx |
| Medium | Reorder right column above tasks on mobile | Index.tsx |
| Medium | Fix dead `group-hover:scale-125` on priority dot (add `group` class) | Index.tsx |
| Low | Fix empty state `min-h-screen` to account for sidebar | Index.tsx |
| Low | Either derive timestamps from real offsets or remove "last active" | Index.tsx |
| Low | Suppress progress bar re-animation on re-mount (memoize or use CSS `animation-fill-mode`) | Index.tsx |

