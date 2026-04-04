

## Nexus Learn -- Cross-Studio QoL & Synchronization Improvements

Implementation plan for 12 items across 9 files. All changes are desktop-focused and theme-safe (light + dark).

---

### Logical Fixes

**1. Index.tsx -- Derive courses from context**
- Remove the static `recentCourses` array (lines 5-9)
- Import `useWorkspace` already exists; pull `adminCourses` from it
- Build `recentCourses` via `useMemo` from `adminCourses.filter(c => c.status === "published")`, mapping each to `{ id, title, lastActive, progress, module }` with deterministic mock progress/lastActive seeded from course ID (same simple LCG hash used in Library sparklines)
- If no published courses, show a "No courses yet" empty state linking to `/library`

**2. Progress.tsx -- Derive course progress from context**
- Remove the static `courseProgress` array (lines 6-11)
- Import `useWorkspace`, read `adminCourses`
- Build `courseProgress` via `useMemo` from published courses, generating deterministic `progress`, `timeMinutes`, `modules`, `completed`, `nextTopic`, `needsAttention`, `lastStudied` using the same seeded approach
- Keep `weeklyActivity` and `streakDays` as static mock data (no context source for these)

**3. AdminSettingsPage.tsx -- Persist saves**
- Line 21: change `handleSave` to call `setStudioOrganization(org)` before the toast
- Pull `setStudioOrganization` from `useWorkspace()` (already available in context)

**4. Profile.tsx -- Dynamic stats**
- Import `adminCourses` from `useWorkspace()` (line 7)
- Line 110: Replace hardcoded `"3"` with `String(adminCourses.filter(c => c.status === "published").length)`
- Line 111: Replace hardcoded `"67h 50m"` with a computed total from the same deterministic seed used in Progress (create a shared helper or inline the computation)

---

### Synchronization Gaps

**5. StudyPlan.tsx -- Dynamic course options**
- Lines 17-22: Replace static `courseOptions` array with a `useMemo` that reads `adminCourses.filter(c => c.status === "published").map(c => c.title)`, prepending an empty string for "no course"
- Import `adminCourses` from existing `useWorkspace()` call (line 30 already destructures from it -- just add `adminCourses`)

**6. Notebook.tsx -- Dynamic course options**
- Lines 20-25: Same approach -- replace static `courseOptions` with `useMemo` reading from `adminCourses`, keeping "General" as a fallback option
- Add `adminCourses` to the destructured `useWorkspace()` call (line 28)

---

### Missing Settings & Features

**7. AdminSettingsPage.tsx -- Admin profile tab**
- Add a new `TabsTrigger` for "Profile" with a `User` icon
- `TabsContent` renders the current admin's name, email, role in a card layout matching the existing Organization tab style
- Add local edit state for name/email with a save button that shows a toast (admin data is read-only in context, so edit is local-only like the current org fields were before the fix)

**8. Settings.tsx (Learner) -- Functional JSON export**
- Line 488: Replace `handleExport` with a function that:
  - Reads `notebookEntries`, `vocabulary`, `reflections`, `tasks` from `useWorkspace()`
  - Builds a JSON object `{ notes, vocabulary, reflections, tasks, exportedAt }`
  - Creates a Blob, generates a download URL, triggers `<a>` click download
  - Filename: `nexus-learn-export-YYYY-MM-DD.json`
- Need to lift `useWorkspace()` into `PrivacyPanel` or pass data as props (currently `PrivacyPanel` doesn't access context)

**9. AdminSettingsPage.tsx -- Fix notification label contrast**
- Lines 136, 150, 155: Change `text-foreground/75` to `text-foreground` on notification and security labels

---

### Quality-of-Life

**10. StudyPlan.tsx -- Task completion toast with undo**
- In `toggleTask` call sites (both the Index.tsx home page tasks and StudyPlan.tsx), wrap with:
  ```tsx
  const wasCompleted = task.completed;
  toggleTask(task.id);
  if (!wasCompleted) {
    toast("Task completed", {
      action: { label: "Undo", onClick: () => toggleTask(task.id) },
    });
  }
  ```
- Apply in StudyPlan's `TaskRow` `onToggle` handler

**11. AppSidebar.tsx -- Notebook count badge**
- Destructure `notebookEntries`, `vocabulary` from `useWorkspace()`
- Compute `notebookCount = notebookEntries.length + vocabulary.length`
- Add a badge next to "Notebook" nav item (same pattern as Messages badge), using `bg-muted-foreground/20 text-muted-foreground` for a subtler appearance than the accent-colored Messages badge

**12. Messages.tsx -- Better empty state**
- Replace the minimal empty state (lines 64-68) with a more descriptive version:
  - Larger, friendlier icon treatment
  - Primary text: "No conversations yet"
  - Secondary text: "When your instructor sends you a message, it will appear here."
  - Subtle dashed border card wrapper for visual weight

---

### Files Summary

| File | Items | Key Changes |
|------|-------|-------------|
| `src/pages/Index.tsx` | 1 | Dynamic courses from context |
| `src/pages/Progress.tsx` | 2 | Dynamic course progress from context |
| `src/pages/Profile.tsx` | 4 | Dynamic stats from context |
| `src/pages/StudyPlan.tsx` | 5, 10 | Dynamic course options + completion undo toast |
| `src/pages/Notebook.tsx` | 6 | Dynamic course options |
| `src/admin/pages/AdminSettingsPage.tsx` | 3, 7, 9 | Persist saves + profile tab + label contrast |
| `src/pages/Settings.tsx` | 8 | Functional JSON data export |
| `src/components/AppSidebar.tsx` | 11 | Notebook count badge |
| `src/pages/Messages.tsx` | 12 | Improved empty state |

