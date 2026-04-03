

# Admin Studio Self-Audit — Full Plan

## CRITERION 1 — SMOOTHNESS

### Issues Found
1. **Courses table action buttons (Pencil, Archive, Users, Copy)** — no tooltip, no toast, no action at all. They snap into view with `opacity` transition but the buttons themselves have no `transition` on hover color (only via `.toolbar-btn` which is fine).
2. **Custom drawer overlays** use CSS `animate-slide-in-right` from index.css (translateX 100%→0) but the Tailwind config also defines `animate-slide-in-right` (translateX 16px→0, a subtle slide). The CSS `@keyframes` in index.css overrides, so the drawers DO slide from off-screen. **No issue here** — already smooth.
3. **Departments/Announcements drawers** use the `vaul` Drawer component (bottom sheet), which has built-in spring animation. **No issue.**
4. **Settings Tabs** — TabsList/TabsTrigger from shadcn have built-in transitions. **No issue.**
5. **Logo upload area** in Settings Branding — click does nothing silently (no toast, no state change). It has hover/active transitions. Functional issue more than smoothness.
6. **Notification bell** in AdminTopBar — no transition on color change. Has `transition-colors` class already. **No issue.**

### Fixes to Apply
- No smoothness-specific fixes needed. All transitions are >= 150ms with proper easing. Drawers, cards, buttons, tabs all have defined transitions.

---

## CRITERION 2 — FUNCTIONALITY TRUTHFULNESS

### Issues Found
1. **Courses table row action buttons** (Pencil, Archive, Users, Copy) — all 4 do nothing on click. No toast, no action, no tooltip.
2. **Settings > Branding > Logo upload area** — clickable cursor but does nothing.
3. **Settings > Security > 2FA Switch** — no `onCheckedChange` handler, no state. Clicks toggle visually (Radix handles it) but nothing is saved.
4. **Settings > Security > Session Timeout** — input accepts values but no state or save handler tied to it specifically.
5. **Help page resource links** (Documentation, Community Forum) — `href="#"` which navigates to `#`. Email support link works.
6. **User menu "Learn more" sub-items** (About Nexus², Tutorials, Usage policy, Privacy policy) — all call `window.open("#", "_blank")` which opens a blank tab.
7. **Dashboard "Pending Actions"** items — static text, not clickable, which is fine for informational items. **No issue.**
8. **Dashboard Quick Actions** — use `<a href>` which does full page reload instead of React Router `navigate`. Functional but non-ideal.
9. **Content Library "View in Course" button** in preview drawer — does nothing on click.
10. **Notification bell** in AdminTopBar — does nothing on click.

### Fixes to Apply
1. **Courses action buttons**: Add tooltips ("Coming in next phase") with `title` attribute, and add `opacity-50 cursor-not-allowed` or toast on click.
2. **Logo upload**: Add toast "Logo upload coming in next phase".
3. **2FA Switch**: Add state + toast feedback.
4. **Session Timeout input**: Wire to state.
5. **Help resource links** (#): Add toast "Coming in next phase" on click for Documentation and Community Forum. Keep Email as-is.
6. **User menu "#" links**: Replace `window.open("#")` with toast "Coming in next phase".
7. **Dashboard Quick Actions**: Change `<a href>` to use `useNavigate`/`Link` from react-router.
8. **Content Library "View in Course"**: Add toast "Coming in next phase".
9. **Notification bell**: Add tooltip "Coming in next phase" and reduce opacity or add toast.

---

## CRITERION 3 — LAYOUT LOGIC

### Issues Found
1. **Outcomes page**: 4-column stat grid on all screens — will compress too small on tablet. Should be `grid-cols-2 lg:grid-cols-4`.
2. **Analytics page**: Same 4-column issue. Also 2-column chart grid doesn't stack on smaller screens — should be `grid-cols-1 lg:grid-cols-2`.
3. **Help page**: 3-column resource cards don't stack — should be `grid-cols-1 sm:grid-cols-3`.
4. **Departments page**: 3-column stat row doesn't stack — should be `grid-cols-1 sm:grid-cols-3`.
5. **Announcements page**: 2-column stat row is fine but could use `grid-cols-1 sm:grid-cols-2`.
6. **Analytics table**: No horizontal padding consistency — `py-3` but no `px-5` like other tables.

### Fixes to Apply
1. Outcomes stats: `grid-cols-2 lg:grid-cols-4`
2. Analytics stats: `grid-cols-2 lg:grid-cols-4`
3. Analytics charts: `grid-cols-1 lg:grid-cols-2`
4. Help resources: `grid-cols-1 sm:grid-cols-3`
5. Departments stats: `grid-cols-1 sm:grid-cols-3`
6. Announcements stats: `grid-cols-1 sm:grid-cols-2`
7. Analytics table: Add consistent `px-4` to cells.

---

## CRITERION 4 — INFORMATION HIERARCHY

### Issues Found
1. **Analytics "Avg Engagement" stat** shows hardcoded "4.2h/wk" — fake data with no source. Should be clearly labeled or use mock data properly.
2. **All pages**: Headers and subtitles are clear and well-structured. **No issue.**
3. **Tables**: Primary columns (Name, Course Name) are first. **No issue.**
4. **Empty states**: All have clear CTAs. **No issue.**
5. **Stat cards**: Number-first, label-below pattern is consistent and scannable. **No issue.**

### Fixes to Apply
- Minor: No critical hierarchy issues. The fake "4.2h/wk" is a functionality truthfulness issue (covered above).

---

## CRITERION 5 — BRAND AND TONE CONSISTENCY

### Issues Found
1. **Courses page: status badge** uses `bg-green-500/10 text-green-600 dark:text-green-400` for "active" status — should use amber system instead of green.
2. **Analytics page: course status badge** uses same green: `bg-green-500/10 text-green-600 dark:text-green-400`.
3. **Analytics page: mastery rate colors** use raw `#16a34a` (green) and `#dc2626` (red) — should use amber tints or neutral system. The Outcomes page has the same issue with inline badge styles.
4. **Departments page: "New Department" button** uses `bg-accent` — correct amber.
5. **Announcements page: "New Announcement" button** uses `bg-accent` — correct amber.
6. **All headings** use `font-serif` — correct Source Serif 4.
7. **All icons** use `strokeWidth={1.5}` — correct.
8. **Dashboard AlertTriangle** uses `strokeWidth={2}` — slightly heavier than standard 1.5.
9. **Primary buttons** (Deploy, Invite) use `bg-primary text-primary-foreground` — primary is near-black. **Correct.**
10. **Table row hovers** use `hover:bg-accent/5` — amber tint. **Correct.**

### Fixes to Apply
1. Replace green status badges in Courses and Analytics with amber-tinted system: `bg-accent/10 text-accent` for active.
2. Replace raw green/red mastery colors with amber-based thresholds (high mastery = amber, low = muted-foreground, not red/green).
3. Fix AlertTriangle strokeWidth from 2 to 1.5.

---

## Files to Modify

1. **`src/admin/pages/AdminDashboard.tsx`** — Fix Quick Actions to use router navigation; fix AlertTriangle strokeWidth.
2. **`src/admin/pages/AdminCourses.tsx`** — Add toast/tooltip to row action buttons; fix green status badge.
3. **`src/admin/pages/AdminMembers.tsx`** — No changes needed (already well-built).
4. **`src/admin/pages/AdminContentLibrary.tsx`** — Add toast to "View in Course" button.
5. **`src/admin/pages/AdminDepartmentsPage.tsx`** — Fix responsive grid.
6. **`src/admin/pages/AdminOutcomesPage.tsx`** — Fix responsive grid; fix green/red badge colors.
7. **`src/admin/pages/AdminAnalyticsPage.tsx`** — Fix responsive grids; fix green status/mastery colors; add table padding.
8. **`src/admin/pages/AdminAnnouncementsPage.tsx`** — Fix responsive grid.
9. **`src/admin/pages/AdminSettingsPage.tsx`** — Add toast to logo upload; wire 2FA switch state; wire session timeout state.
10. **`src/admin/pages/AdminHelpPage.tsx`** — Fix `#` links with toast; fix responsive grid.
11. **`src/admin/components/AdminTopBar.tsx`** — Add tooltip/toast to notification bell.
12. **`src/admin/components/AdminSidebarUserMenu.tsx`** — Replace `window.open("#")` calls with toasts.

**No new pages, features, or Arena files touched. No AdminLayout.tsx changes.**

