

## Admin Sidebar Navigation — Analysis & Recommendation

### Current State (8 items)

| Menu Item | What it does | Lines of code | Complexity |
|---|---|---|---|
| **Dashboard** | KPI cards, activity feed, pending actions, quick actions, mastery chart | 130 | Medium |
| **Courses** | Full CRUD: list, filter, deploy, edit, archive, duplicate, enrollments | 560 | High |
| **Content Library** | File browser for PDFs/videos/slides linked to courses | 220 | Medium |
| **Members** | Invite, role/status management, detail view, bulk import | 390 | High |
| **Departments** | Create/edit departments, see linked members/courses | 140 | Low |
| **Outcomes** | Mastery rates per course, knowledge gaps list | 70 | Low |
| **Analytics** | Charts (engagement, completions, department breakdown), export | 360 | High |
| **Announcements** | Create/list announcements with audience targeting | 120 | Low |

### Recommendation

**Merge to 5 items.** Here is the proposed grouping:

```text
CURRENT (8)              PROPOSED (5)
─────────────            ─────────────
Dashboard          →     Dashboard  (unchanged)
Courses            ┐
Content Library    ┘→    Courses  (add "Content" as a tab inside Courses)
Members            ┐
Departments        ┘→    People  (Members + Departments as tabs)
Outcomes           ┐
Analytics          ┘→    Insights  (Analytics charts + Outcomes/mastery as tabs)
Announcements      →     Announcements  (unchanged — distinct enough)
```

### Rationale

1. **Courses + Content Library → "Courses" (with tabs)**
   Content Library is just the files attached to courses. It has no independent purpose. Moving it to a "Content" tab inside Courses keeps everything course-related in one place and removes a click from the admin's mental model.

2. **Members + Departments → "People" (with tabs)**
   Departments are just a grouping mechanism for members. They share the same data (member lists, role assignments). A "Members" tab + "Departments" tab under one "People" section is cleaner and matches how admins think: "I'm managing people."

3. **Analytics + Outcomes → "Insights" (with tabs)**
   Outcomes (mastery rates, knowledge gaps) is essentially a specialized analytics view — it's 70 lines and just shows per-course mastery bars. Merging it as a tab alongside the engagement/completion charts creates a single destination for "how are things going?"

4. **Dashboard stays** — it's the landing overview, always needed.

5. **Announcements stays** — it's a distinct action (compose + send) that doesn't fit naturally elsewhere.

### Result

The sidebar goes from 8 items to 5, which is within the ideal 4-7 range for scanability. No functionality is removed — everything becomes a tab within its parent page.

### Files to modify

- `src/admin/components/AdminSidebar.tsx` — reduce `navItems` to 5
- `src/admin/pages/AdminCourses.tsx` — add a "Content" tab, inline the Content Library UI
- Create `src/admin/pages/AdminPeoplePage.tsx` — tabs for Members + Departments (import existing components)
- Create `src/admin/pages/AdminInsightsPage.tsx` — tabs for Analytics + Outcomes
- `src/App.tsx` — update admin routes (`/admin/people`, `/admin/insights`), add redirects for old paths
- Remove or deprecate: `AdminContentLibrary.tsx`, `AdminMembers.tsx`, `AdminDepartmentsPage.tsx`, `AdminOutcomesPage.tsx`, `AdminAnalyticsPage.tsx` (their content moves into the new tab pages)

