

# Role-Based Access: Admin vs Learner

## Summary

Add a `userRole` state (`"learner" | "admin"`) to context. Admins see the Admin Studio nav and can access `/admin`. Learners see a styled "Access Denied" page if they try. Switching to admin shows a different persona (name/email). Role resets to learner on refresh.

## Changes

### 1. WorkspaceContext (`src/context/WorkspaceContext.tsx`)
- Add `userRole: "learner" | "admin"` state (default `"learner"`) and `setUserRole` method to context
- Define two persona objects: learner profile (current "Alex Chen") and admin profile (e.g. "Dr. Sarah Mitchell", admin email). When `setUserRole` is called, also call `updateUserProfile` with the matching persona's data
- Expose `userRole` and `setUserRole` in the provider

### 2. Sidebar — hide Admin Studio for learners (`src/components/AppSidebar.tsx`)
- Filter `mainNav` to exclude the Admin Studio item when `userRole !== "admin"`

### 3. Admin Studio — access denied page (`src/pages/AdminStudio.tsx`)
- At the top of the component, check `userRole` from context
- If `"learner"`, render a styled access-denied view (Shield icon, "You don't have permission", explanation text) instead of the admin dashboard — no redirect

### 4. Role switcher in Sidebar User Menu (`src/components/SidebarUserMenu.tsx`)
- Add a menu item with a `ShieldCheck` icon: "Switch to Admin" / "Switch to Learner"
- Clicking it calls `setUserRole` and shows a toast confirming the switch
- Visually distinguish which role is active (e.g. a small badge or check)

### 5. Role switcher in Settings (`src/pages/Settings.tsx`)
- In the Account panel, add a "Role" setting row with a segmented control or toggle to switch between Learner and Admin
- Label it clearly as a demo/dev tool

## Files

| File | Change |
|------|--------|
| `src/context/WorkspaceContext.tsx` | Add `userRole`, `setUserRole`, persona switching logic |
| `src/components/AppSidebar.tsx` | Conditionally render Admin Studio nav |
| `src/pages/AdminStudio.tsx` | Add access-denied view for learners |
| `src/components/SidebarUserMenu.tsx` | Add role switcher menu item |
| `src/pages/Settings.tsx` | Add role toggle in Account panel |

