

## Admin Studio -- Feature Suggestions & Quality-of-Life Improvements

Based on a thorough audit of all Admin Studio pages, sidebar, top bar, and layout components.

---

### Features

#### 1. Admin Command Palette (Cmd+K)
The Learner Studio has a global command palette but the Admin Studio does not. Add an admin-specific command palette for quick navigation to pages, searching members by name/email, jumping to specific courses, and triggering common actions (invite member, deploy course, new announcement).

- **New file**: `src/admin/components/AdminCommandPalette.tsx`
- **Edit**: `src/admin/components/AdminLayout.tsx` -- mount it globally
- Groups: Pages (Dashboard, Courses, People, etc.), Members (search by name), Courses (search by name), Quick Actions (Invite, Deploy, Announce)
- Reuses existing `cmdk` / `CommandDialog` primitives

#### 2. Clickable Dashboard Stat Cards
Dashboard stat cards (Total Members, Active This Week, Courses Deployed, Mastery Achieved) are currently static. Make them clickable links that navigate to their relevant pages (People, Analytics, Courses).

- **Edit**: `src/admin/pages/AdminDashboard.tsx` -- wrap stat cards in `<Link>` with hover indication

#### 3. Sidebar Unread Message Badge
The Learner sidebar has an unread badge on Messages but the Admin sidebar does not. Add one by reading `directMessages` from workspace context and counting unread learner messages.

- **Edit**: `src/admin/components/AdminSidebar.tsx` -- add badge dot/count next to Messages nav item

#### 4. Smooth Page Transitions
The Learner Studio has route-level `animate-fade-in` on transitions via `useLocation().pathname` as a key. The Admin Layout has a bare `<Outlet />` with no transition.

- **Edit**: `src/admin/components/AdminLayout.tsx` -- add `useLocation().pathname` key wrapper with `animate-fade-in`

#### 5. Scroll-to-Top Button
Long admin pages (Members table, Analytics charts, Help docs) have no back-to-top affordance. Mount the existing `ScrollToTop` component in the Admin Layout.

- **Edit**: `src/admin/components/AdminLayout.tsx` -- import and mount `ScrollToTop`

#### 6. Confirmation Dialogs for Destructive Actions
Currently, archiving courses, deactivating members, and deleting announcements happen instantly with only a toast. Add inline "Are you sure?" confirmation patterns matching the Learner Studio pattern.

- **Edit**: `src/admin/pages/AdminCourses.tsx` -- confirmation before archive
- **Edit**: `src/admin/pages/AdminMembers.tsx` -- already has deactivation confirmation (good), but no confirmation for role changes that downgrade from admin
- **Edit**: `src/admin/pages/AdminAnnouncementsPage.tsx` -- add delete capability with confirmation (currently announcements can't be deleted at all)

#### 7. Announcement Delete/Edit
Announcements can only be created, never edited or deleted. Add edit and delete actions to each announcement card with inline confirmation for delete.

- **Edit**: `src/admin/pages/AdminAnnouncementsPage.tsx` -- add edit drawer + delete with confirmation

#### 8. Top Bar Breadcrumbs
Nested pages (Courses > Content Library, People > Departments, Insights > Outcomes) have no breadcrumb trail. Replace the static org name in the top bar with a breadcrumb showing the current page path.

- **Edit**: `src/admin/components/AdminTopBar.tsx` -- derive breadcrumbs from `useLocation().pathname` and active tab state

---

### Quality-of-Life Improvements

#### 9. Empty State for Dashboard (First-Run Experience)
If there are 0 members or 0 courses, the dashboard still shows stat cards with zeros and empty charts. Add a first-run onboarding card ("Welcome! Start by inviting members and deploying a course") when the organization has no data.

- **Edit**: `src/admin/pages/AdminDashboard.tsx` -- conditional empty/welcome state

#### 10. Keyboard Shortcut Support
Add admin-specific keyboard shortcuts: `I` to open invite drawer (People page), `D` to open deploy drawer (Courses page), `A` to create announcement (Announcements page), `?` for help overlay.

- **New file**: `src/admin/components/AdminKeyboardShortcuts.tsx`
- **Edit**: `src/admin/components/AdminLayout.tsx` -- mount it

#### 11. Consistent Drawer Pattern (Announcements + Departments)
Announcements and Departments use bottom-sheet `<Drawer>` while Courses/Members/Content Library use right-slide drawers. Convert Announcements and Departments to right-slide drawers for desktop consistency.

- **Edit**: `src/admin/pages/AdminAnnouncementsPage.tsx` -- replace `<Drawer>` with custom right-slide drawer
- **Edit**: `src/admin/pages/AdminDepartmentsPage.tsx` -- same

#### 12. Messages -- Responsive Layout
The messages page uses a fixed `grid-cols-[260px_1fr]` that breaks on narrow viewports. On mobile, show only the learner list, then full-screen conversation on select with a back button.

- **Edit**: `src/admin/pages/AdminMessagesPage.tsx` -- responsive mobile layout with back navigation

---

### Files to Create
- `src/admin/components/AdminCommandPalette.tsx`
- `src/admin/components/AdminKeyboardShortcuts.tsx`

### Files to Edit
- `src/admin/components/AdminLayout.tsx` -- mount command palette, keyboard shortcuts, scroll-to-top, page transitions
- `src/admin/components/AdminSidebar.tsx` -- unread message badge
- `src/admin/components/AdminTopBar.tsx` -- breadcrumb navigation
- `src/admin/pages/AdminDashboard.tsx` -- clickable stat cards, first-run empty state
- `src/admin/pages/AdminCourses.tsx` -- archive confirmation
- `src/admin/pages/AdminAnnouncementsPage.tsx` -- edit/delete + right-slide drawer
- `src/admin/pages/AdminDepartmentsPage.tsx` -- right-slide drawer
- `src/admin/pages/AdminMessagesPage.tsx` -- responsive mobile layout

