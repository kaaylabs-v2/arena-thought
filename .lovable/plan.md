

# Admin Studio — Complete Audit

## 1. UI & Layout Inconsistencies

### Header Pattern Divergence
The Admin Studio has **two conflicting header patterns** across its pages:

| Page | Header | Spacing | Max Width | Padding |
|------|--------|---------|-----------|---------|
| Dashboard | `text-[2rem] font-normal` | `mb-6` (implicit, `space-y-6`) | `max-w-[1200px]` | `p-6 lg:p-8` |
| Courses | `text-[2rem] font-normal` | `mb-6` | `max-w-[1200px]` | `p-6 lg:p-8` |
| People | `text-[2rem] font-normal` | `mb-6` | `max-w-[1200px]` | `p-6 lg:p-8` |
| Insights | `text-[2rem] font-normal` | `mb-6` | `max-w-[1200px]` | `p-6 lg:p-8` |
| Communication | `text-[2rem] font-normal` | `mb-6` | `max-w-[1200px]` | `p-6 lg:p-8` |
| Help | `text-[2rem] font-normal` | `mb-8` | `max-w-[1200px]` | `p-6 lg:p-8` |
| **Settings** | **`text-4xl font-medium`** | `mb-8` | `max-w-5xl` | `p-8 lg:p-12 xl:p-16` |

**Finding**: Admin Settings follows the *Learner Studio* header pattern (`text-4xl`, `mb-8`, responsive padding, `max-w-5xl`), while every other Admin page uses the Admin pattern (`text-[2rem]`, `mb-6`, `p-6 lg:p-8`, `max-w-[1200px]`). The Settings page is visually inconsistent with the rest of the Admin Studio.

### Nested Pages Double Headers
`AdminPeoplePage` renders its own `<h1>People</h1>` header, then embeds `AdminMembersPage` and `AdminDepartmentsPage` which each render **their own** `<h1>Members</h1>` / `<h1>Departments</h1>` headers with their own `p-6 lg:p-8` padding. The negative margin wrapper (`-m-6 lg:-m-8`) is supposed to cancel this, but it creates a double-header effect — the "People" title at the top, then "Members" appears again right below the tabs.

Same issue with `AdminInsightsPage` → nested `AdminAnalyticsPage` / `AdminOutcomesPage` (both have their own `<h1>`). And `AdminCourses` → nested `AdminContentLibraryPage` (has its own page-level UI).

### Members Page Uses Different Seed Data
`AdminMembers.tsx` has its own hardcoded `seedMembers` array (12 members: Aisha Patel, James Liu, etc.) that is **completely different** from `mock-data.ts` `members` (12 members: Alex Chen, Jordan Chen, etc.). The Members page never reads from `useWorkspace().studioMembers` — it uses local state initialized from its own seeds. This means:
- Dashboard stat card shows `members.length` from WorkspaceContext (12 members from mock-data.ts)
- Members page shows 12 *different* members from its local seedMembers
- Names, emails, departments, and roles don't match between the two

### Content Library Uses Its Own Seed Data
`AdminContentLibrary.tsx` has its own `seedFiles` array (10 files referencing courses like "Python Fundamentals", "Leadership Basics") while `mock-data.ts` has a separate `contentLibrary` array (8 files referencing "Foundations of Machine Learning", "Advanced Statistical Methods"). These are completely different datasets with different course names — Content Library doesn't use the context data at all.

---

## 2. Data Sync Issues (Admin ↔ Learner Studio)

### Courses: Two Separate Systems
The Admin Studio's courses in `mock-data.ts` (`adminCourses`) use IDs `c-1` through `c-6` and names like "Foundations of Machine Learning". The Learner Studio's courses in `WorkspaceContext` (`seedAdminCourses`) use IDs `"1"` through `"6"` with matching names but different ID formats. Creating a course in Admin Courses page uses `setCourses(prev => [newCourse, ...prev])` which is local state — it does **not** call `addAdminCourse()` from WorkspaceContext, so new courses never appear in the Learner Studio.

### Dashboard Stats Don't Update With Member Actions
Dashboard reads `studioMembers` from context, but the Members page uses its own `seedMembers` local state. Inviting, deactivating, or changing roles on the Members page doesn't affect the Dashboard counts at all.

### Courses Page Local State
`AdminCoursesPage` initializes `const [courses, setCourses] = useState(studioCourses)` — copies context data into local state. All mutations (deploy, edit, archive, duplicate) go to local state only. If the admin navigates away and back, all changes are lost. The Dashboard's "Courses Deployed" stat stays stale.

### Departments Page Local State
`AdminDepartmentsPage` does the same: `const [depts, setDepts] = useState(studioDepartments)` — local copy. Creating or editing departments doesn't propagate to WorkspaceContext. Member avatar lists in department cards use `studioMembers` (which has different names than what the Members page shows).

### Announcement Drafts Lost on Tab Switch
`AdminCommunicationPage` stores drafts in local state (`useState<LocalDraft[]>([])`). If the user navigates away from `/admin/communication` and returns, all drafts are gone.

---

## 3. Logic Issues

### Dashboard "Active This Week" Is Naive
```tsx
members.filter(m => !["30 days ago", "Never"].includes(m.lastActive)).length
```
This counts anyone whose `lastActive` is NOT "30 days ago" or "Never" as active this week. Members active "8 days ago" or "12 hours ago" are all counted. This is string comparison on human-readable labels, not actual date logic.

### Dashboard `pendingActions` Are Static
The "Pending Actions" section always shows the same 3 hardcoded strings regardless of actual state:
- "2 members haven't started any course in 14 days" — never computed from member data
- "1 course has no mastery outcome defined" — never computed from course data
- "3 invited members haven't accepted yet" — never computed from invite counts

### Dashboard Mastery Chart Empty for Non-Active Courses
The mastery chart filters `adminCourses.filter(c => c.status === "active")`. If an admin archives all courses, the chart area renders empty with no empty-state message.

### Analytics `filteredCourses` Missing Deps
```tsx
const filteredCourses = useMemo(() => {...}, [deptFilter, sortCol, sortDir]);
```
Missing `adminCourses` dependency — if courses change (deploy/archive), the memo won't recompute.

### Analytics `filteredMembers` Missing Deps
```tsx
const filteredMembers = useMemo(() => {...}, [deptFilter]);
```
Missing `members` dependency.

### Analytics `deptBreakdown` Empty Deps
```tsx
const deptBreakdown = useMemo(() => {...}, []);
```
Never recomputes if departments change.

### Courses Edit Drawer Status Bug
When clicking a status button in the Edit drawer, it directly mutates `courses` state via `setCourses()` but doesn't update `editCourse` or `editForm`. The visual check uses `courses.find(c => c.id === editCourse.id)?.status` which works, but clicking "Save Changes" after a status change overwrites the status back because `handleEditSave` spreads `editForm` which doesn't include `status`.

### Help Page Not in Sidebar
`/admin/help` has a route and a full page component, but the Admin Sidebar `navItems` array doesn't include a Help link. The page is only accessible by direct URL or through the command palette.

---

## 4. Dark Mode / Light Mode Issues

### Hardcoded `AMBER` Color
Multiple Admin pages define `const AMBER = "#C9963A"` and use it directly in SVG/chart fills. This works because amber is the brand accent, but it's defined redundantly in at least 4 files (Dashboard, Courses, Analytics, Members) instead of using a shared constant or `hsl(var(--accent))`.

### Chart Shadow Hardcoded
`chartTooltipStyle` uses `boxShadow: "0 4px 12px rgba(0,0,0,0.15)"` — black shadow that's too strong on dark backgrounds. Should use `hsl(var(--foreground) / 0.15)` or similar.

### Members Learning Signals Badges
```tsx
<span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 ...">
```
This uses Tailwind amber palette directly instead of semantic tokens. It works but is one of the few places that breaks the "no hardcoded colors" rule with explicit light/dark variants.

### Pie Chart Colors
`deptBreakdown` uses `AMBER`, `hsl(var(--muted-foreground))`, and `hsl(var(--foreground) / 0.3)` for 3 departments. If more departments are added, the colors cycle using `i % 3` which is fine, but having only 3 distinct colors is limiting.

---

## 5. Incomplete / Half-Baked Features

### Admin Settings Notifications Panel — Local State
```tsx
const [notifications, setNotifications] = useState({ email: true, inApp: true, weeklyDigest: false });
```
All notification toggles are local state — they reset on navigation. Unlike the Learner Settings (which we just fixed to persist to `appSettings`), Admin notification preferences go nowhere.

### Admin Settings Security Panel — Local State
```tsx
const [twoFactor, setTwoFactor] = useState(false);
const [sessionTimeout, setSessionTimeout] = useState(60);
```
Same issue — purely local. The "2FA enabled" toast fires but nothing persists.

### Admin Settings Profile — Edits Don't Save
`adminName` and `adminEmail` are local state initialized from `studioCurrentAdmin`. The "Save Profile" button fires `toast.success("Profile updated")` but doesn't call any context updater. The changes are lost on navigation.

### Content Library Upload
The "Upload" button on Content Library shows a toast saying "All content is managed within course context — upload files when deploying or editing a course." This is a dead end — there's no actual upload flow in the Content Library itself.

### Enrollments Drawer Shows All Department Members
The Enrollments drawer for a course shows `members.filter(m => m.department === enrollCourse.department && m.status === "active")` and marks all of them as "Enrolled." There's no way to actually enroll/unenroll individual members — it's display-only with a misleading "Enrolled" badge on everyone.

### Admin `AdminStudio.tsx` Page Still Exists
`src/pages/AdminStudio.tsx` is the old admin page (course editor with modules/sources). It's still in the codebase but there's no route pointing to it — dead code.

---

## 6. Accessibility / UX Issues

### Table Row Actions Only on Hover
In Courses and Members tables, action buttons (`Edit`, `Archive`, `Duplicate`, etc.) have `opacity-0 group-hover:opacity-100`. They're invisible until hover, which means:
- Keyboard-only users cannot discover them
- Touch/mobile users can't access them (no hover on mobile)

### Role Change Dropdown Positioned Absolutely
The role-change popup in Members uses `absolute left-5 top-10` — if clicked on a row near the bottom of the viewport, the dropdown may render off-screen with no scroll handling.

### No Pagination on Tables
Members (12 entries) and Courses (6 entries) are manageable, but there's no pagination or virtualization. If bulk import adds 100+ members, the table will render all rows.

### Sidebar Missing Help Link
As noted, Help page exists but has no sidebar navigation. Users would need to know the URL or use Cmd+K.

---

## 7. Summary of Bugs to Fix (Priority Order)

1. **Members page uses wrong seed data** — Shows completely different people than Dashboard. Should read from `useWorkspace().studioMembers` or at minimum share the same dataset.
2. **Content Library uses wrong seed data** — Different files and course names than `mock-data.ts`. Should use context data.
3. **Nested pages show double headers** — People, Insights, and Courses tabs render sub-pages that have their own full headers.
4. **Courses page local state** — Deploy/edit/archive don't persist. Should mutate context state.
5. **Admin Settings header pattern** — Follows Learner pattern (`text-4xl`, responsive padding) instead of Admin pattern (`text-[2rem]`, `p-6 lg:p-8`).
6. **Dashboard pendingActions static** — Should compute from actual member/course data.
7. **Analytics useMemo missing deps** — `filteredCourses`, `filteredMembers`, and `deptBreakdown` have stale closure risk.
8. **Admin notifications/security/profile don't persist** — All local state, reset on navigation.
9. **Help page missing from sidebar** — Accessible only by URL or command palette.
10. **Edit drawer status change doesn't persist through Save** — Status click and Save button conflict.

---

## 8. QoL Improvements Recommended

### High Priority
1. **Add Help to sidebar** — Add a HelpCircle icon link to the sidebar nav items.
2. **Compute Dashboard pending actions** — Derive from actual members/courses: real invited count, real members with no activity, courses without mastery definitions.
3. **Wire Courses page to context** — Deploy/archive/edit should persist via WorkspaceContext so Dashboard stats stay accurate.

### Medium Priority
4. **Unify Members data** — Delete local `seedMembers` in `AdminMembers.tsx` and use `studioMembers` from context.
5. **Unify Content Library data** — Use `studioContent` from context or align course names.
6. **Remove nested page double headers** — Sub-pages embedded in tabs should not render their own `<h1>` + padding wrapper.
7. **Add mobile-friendly actions** — Replace hover-only table actions with a dropdown menu (MoreHorizontal icon) that works on touch.

### Nice to Have
8. **Dashboard: Live member count in pending actions** — "3 invited members haven't accepted yet" → dynamically compute from `studioMembers.filter(m => m.status === "invited").length`.
9. **Admin Settings consistency** — Align header to match other Admin pages or keep Learner pattern but be deliberate about it.
10. **Dead code cleanup** — Remove `src/pages/AdminStudio.tsx` and its imports.

