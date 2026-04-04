

## Admin Studio -- Complete UI/UX Audit

### What's Working Well
- **Header pattern is consistent**: All 8 pages use `font-serif text-[2rem] font-normal text-foreground` + `text-sm text-muted-foreground` subtitle
- **Container standardized**: Every page uses `p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in`
- **Card system**: `card-interactive` used uniformly across Dashboard, Courses, People, Insights, Announcements, Departments, Content Library, Help
- **Stagger animations**: `stagger-children` applied consistently to stat grids and card lists
- **Drawer system**: All drawers (Deploy Course, Edit Course, Enrollments, Invite Members, Bulk Import, Member Detail, File Preview) follow the same right-slide pattern with consistent header/footer structure
- **Table headers**: Uniform `text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground` across Courses, Members, Content Library, Analytics
- **Sidebar**: Clean, well-structured with proper active states and theme toggle
- **Notification panel**: Polished with mark-read, mark-all, clear-all actions
- **Chart theming**: All Recharts components use consistent AMBER accent, `hsl(var(--card))` tooltips, and 500ms animation durations

---

### Issues Found

#### 1. Analytics -- Duplicate `font-serif text-base` classes (MEDIUM)
Lines 214, 227, 243, 256, 288 in `AdminAnalyticsPage.tsx` all have `font-serif text-base mb-4 font-serif text-base text-foreground/80` -- the `font-serif text-base` is written twice. Won't break rendering but is messy and could confuse future edits.

#### 2. Outcomes -- Duplicate `font-serif` on section headers (MEDIUM)
Line 35: `font-serif text-lg mb-4 font-serif text-base text-foreground` -- conflicting `text-lg` and `text-base`. Same on line 56. The last class wins (`text-base`), so `text-lg` is dead code. Should be cleaned to just `font-serif text-base mb-4 text-foreground`.

#### 3. Dashboard -- Pending actions text too faint (LOW)
Line 96: `text-foreground/60` for pending action items. These are actionable alerts that should be more prominent. Recommend `text-foreground/80`.

#### 4. Dashboard -- Quick action chevron too faint (LOW)
Line 113: `text-muted-foreground/40` on the ChevronRight icon is nearly invisible in dark mode. Recommend `text-muted-foreground/60`.

#### 5. Dashboard -- Activity timestamp too faint (LOW)
Line 81: `text-muted-foreground/60` on activity timestamps. Already bumped in previous audit passes but still could be `text-muted-foreground/70` for consistency with other timestamp patterns.

#### 6. Courses -- Enrolled/Mastery text opacity (LOW)
Lines 218, 220: `text-foreground/75` on enrolled count and mastery rate values. These are key metrics and should be full `text-foreground`.

#### 7. Content Library -- "No files found" text too faint (LOW)
Line 93: `text-foreground/60` on the empty state message. Should be `text-foreground/75` minimum to match the Members empty state pattern (line 144 of AdminMembers).

#### 8. Sidebar -- "Admin Studio" label very faint (LOW)
Line 74 of AdminSidebar: `text-sidebar-foreground/35` is extremely faint. Recommend `text-sidebar-foreground/50` so users can actually read it.

#### 9. Announcements -- Uses shadcn Drawer component (OBSERVATION)
Announcements and Departments use `<Drawer>` (bottom sheet) while Courses and Members use custom right-slide drawers. This is a minor inconsistency -- bottom drawers feel more mobile-oriented while right-slide drawers feel more desktop-appropriate. Not a bug but worth noting for consistency.

#### 10. Settings -- TabsList missing `bg-muted/50` (LOW)
Line 56 of AdminSettingsPage: `<TabsList className="mb-6">` -- missing `bg-muted/50` which all other TabsList instances include (Courses, People, Insights all have it).

#### 11. Help page -- Section headers use `/85` opacity (LOW)
Lines 83, 110, 139, 161: `text-foreground/85` on section headers. These are section headings and should be full `text-foreground` for maximum readability, especially in dark mode.

#### 12. People page -- Nested page double-padding hack (OBSERVATION)
`MembersInline` and `DepartmentsInline` use `<div className="-m-6 lg:-m-8">` to counteract parent padding. Same pattern in Insights and Courses. This works but is fragile -- if parent padding changes, all negative margins must be updated manually. Not a bug but a maintenance concern.

---

### Recommended Changes

**File: `src/admin/pages/AdminAnalyticsPage.tsx`**
- Lines 214, 227, 243, 256, 288: Remove duplicate `font-serif text-base` from chart headers. Change each from `font-serif text-base mb-4 font-serif text-base text-foreground/80` to `font-serif text-base mb-4 text-foreground/80`

**File: `src/admin/pages/AdminOutcomesPage.tsx`**
- Line 35: Change `font-serif text-lg mb-4 font-serif text-base text-foreground` to `font-serif text-base mb-4 text-foreground`
- Line 56: Same fix

**File: `src/admin/pages/AdminDashboard.tsx`**
- Line 96: Change `text-foreground/60` to `text-foreground/80` on pending action text
- Line 113: Change `text-muted-foreground/40` to `text-muted-foreground/60` on quick action chevrons
- Line 81: Change `text-muted-foreground/60` to `text-muted-foreground/70` on activity timestamps

**File: `src/admin/pages/AdminCourses.tsx`**
- Lines 218, 220: Change `text-foreground/75` to `text-foreground` on enrolled count and mastery rate

**File: `src/admin/pages/AdminContentLibrary.tsx`**
- Line 93: Change `text-foreground/60` to `text-foreground/75`

**File: `src/admin/components/AdminSidebar.tsx`**
- Line 74: Change `text-sidebar-foreground/35` to `text-sidebar-foreground/50`

**File: `src/admin/pages/AdminSettingsPage.tsx`**
- Line 56: Add `bg-muted/50` to TabsList to match all other TabsList instances

**File: `src/admin/pages/AdminHelpPage.tsx`**
- Lines 83, 110, 139, 161: Change `text-foreground/85` to `text-foreground`

---

### Additional Feature Suggestions & Quality-of-Life Improvements

1. **Breadcrumb navigation**: The admin pages with nested tabs (Courses > Content Library, People > Departments, Insights > Outcomes) have no breadcrumb trail. Adding a simple breadcrumb below the top bar would help orientation, especially when deep in a drawer.

2. **Search in sidebar**: As the admin grows, a quick-search/command palette (Cmd+K) would let admins jump between pages, find members, or search courses without navigating manually.

3. **Dashboard stat cards should be clickable**: Each stat card (Total Members, Active This Week, etc.) should link to its relevant page (People, Analytics) for quick drill-down.

4. **Empty state consistency**: The Dashboard shows no empty state if there are 0 members or 0 courses. Adding a first-run onboarding state ("Welcome! Start by inviting members") would improve the first-time experience.

5. **Responsive mobile audit**: The admin tables hide columns progressively (`hidden md:table-cell`, `hidden lg:table-cell`), which is good. However, the right-slide drawers are `w-[480px] max-w-full` which will fill the entire screen on mobile -- they should use the bottom sheet `<Drawer>` pattern on small screens for consistency.

6. **Settings page -- missing "Back to Arena" link**: Unlike the sidebar user menu which has "Back to Arena", there's no visible way to return to the learner studio from the Settings page itself. A link in the org section or a persistent breadcrumb would help.

7. **Notification persistence**: Notifications are initialized from activity data but reset on page refresh. If Supabase is connected later, these should persist. Worth noting as a future integration point.

---

### Summary

The Admin Studio is well-built with strong consistency across all 8+ pages. The main issues are cosmetic: duplicate CSS classes in Analytics/Outcomes headers, a few text opacity values that are too faint for dark mode readability, and one missing `bg-muted/50` on the Settings TabsList. The drawer system is consistent (right-slide pattern) except for Announcements and Departments which use bottom sheets. All changes are minor polish.

