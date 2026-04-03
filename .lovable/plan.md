

# Admin Studio — Course Creation & Management

## Overview

A new `/admin` section accessible from the sidebar where an admin can create courses, add source materials organized into modules, assign users, and publish courses. This is a mock/demo implementation using in-memory state (no backend), consistent with the rest of the app.

## What Gets Built

### 1. Admin Studio page (`src/pages/AdminStudio.tsx`)

A full-page admin dashboard with two views:

**Course list view** — table/grid of all courses showing title, status (draft/published), source count, assigned user count, and last edited. Actions: edit, delete, publish/unpublish.

**Course editor view** — opened when creating or editing a course:
- **Details section**: title, description
- **Modules & Sources section**: add modules, then add source items (title, type: video/lecture/reading/pdf/code/slides/link) within each module. Drag-free but reorderable via up/down buttons.
- **Assign Users section**: multi-select from a mock user list to assign learners
- **Publish toggle**: draft → published. Only published courses appear in the student Library.

### 2. Admin data in WorkspaceContext

Add to context:
- `AdminCourse` type: `{ id, title, description, status: "draft" | "published", modules: AdminModule[], assignedUsers: string[], createdAt, updatedAt }`
- `AdminModule` type: `{ id, title, items: AdminSourceItem[] }`
- `AdminSourceItem` type: `{ id, title, type: SourceType }`
- State: `adminCourses`, seed with existing hardcoded courses converted to admin format
- CRUD: `addAdminCourse`, `updateAdminCourse`, `deleteAdminCourse`, `publishCourse`, `unpublishCourse`

### 3. Library page update

Instead of a hardcoded `courses` array, derive the student-facing course list from `adminCourses.filter(c => c.status === "published")` via context. This connects admin publishing to what students see.

### 4. Sidebar nav update

Add an "Admin Studio" entry to the sidebar nav with a `Shield` (or `Settings2`) icon, linking to `/admin`.

### 5. Route

Add `/admin` route in `App.tsx` pointing to `AdminStudio`.

## Files to Change

| File | Change |
|------|--------|
| `src/pages/AdminStudio.tsx` | **New** — course list + course editor views |
| `src/context/WorkspaceContext.tsx` | Add `AdminCourse` types, state, CRUD methods, seed data |
| `src/pages/Library.tsx` | Read published courses from context instead of hardcoded array |
| `src/components/AppSidebar.tsx` | Add Admin Studio nav item |
| `src/App.tsx` | Add `/admin` route |

## Design Notes

- Follows existing design language: `font-serif` headings, `text-[13px] font-sans` body, `border-border`, `bg-card`, `rounded-xl`, `shadow-lifted` cards
- Course editor uses a single-page form layout (not a dialog) for comfortable editing
- Module/source management uses inline add/remove patterns similar to the notebook quick-add form
- Mock user list: 4-5 fake users (name + email) for the assignment UI
- No real auth/role gating — just a separate page accessible from sidebar

