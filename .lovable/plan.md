

## Communication Pages — Layout & Tab Consistency Fix

### The Problem

You're right on both counts. Every other admin page (Courses, People, Insights) follows a consistent pattern:

```text
┌─────────────────────────────────────────┐
│  p-6 lg:p-8  max-w-[1200px]  mx-auto   │
│                                         │
│  Title (font-serif text-[2rem])         │
│  Subtitle                               │
│                                         │
│  ┌─────────────────────────────┐        │
│  │ [Capsule Tab] [Capsule Tab] │  ← TabsList (bg-muted/50, pill shape)
│  └─────────────────────────────┘        │
│                                         │
│  Tab content...                         │
└─────────────────────────────────────────┘
```

But Communication uses:
- **Full-bleed layout** (`px-8` padding, no `max-w-[1200px] mx-auto` centering)
- **Underline tabs** (custom `border-b-2 border-accent`) instead of the capsule `<TabsList>` / `<TabsTrigger>` pattern
- **Different title size** (`text-4xl` vs `text-[2rem]`)

This makes it feel wider, heavier, and visually disconnected from the rest of the admin studio.

### The Fix

Align both Communication pages (admin + learner) with the established admin layout conventions:

**1. Container — center within 1200px**
- Wrap both pages in `p-6 lg:p-8 max-w-[1200px] mx-auto`
- Keep the full-height flex structure for the DM tab (the messaging thread needs it), but scope the height constraint to the tab content area, not the entire page

**2. Tabs — switch to capsule pattern**
- Replace the custom underline tab buttons with shadcn `<Tabs>`, `<TabsList>`, `<TabsTrigger>`, `<TabsContent>`
- Use `bg-muted/50` on `TabsList` and `text-[13px]` on triggers — matching Courses, People, Insights exactly
- Unread badge stays inline inside the trigger label

**3. Title — match other pages**
- Change from `font-serif text-4xl font-medium` to `font-serif text-[2rem] font-normal` (matching Courses, People, Insights)

**4. Spacing — match `mb-6` pattern**
- Title block uses `mb-6` before tabs (same as other pages)
- TabsList uses `mb-6` (same as other pages)

**5. DM tab height**
- The DM tab still needs anchored composer behavior. Instead of making the whole page `h-[calc(100vh-64px)]`, the tab content area alone gets `h-[calc(100vh-220px)]` (accounting for header + tabs + padding) with `flex flex-col` so the composer stays pinned

### Files Changed

| File | Change |
|------|--------|
| `src/admin/pages/AdminCommunicationPage.tsx` | Switch to centered container, capsule tabs, matched title |
| `src/pages/Communication.tsx` | Same layout alignment for learner studio |

### What stays the same
- All tab content (DM threads, announcements, compose) — unchanged
- Mobile responsive behavior — unchanged
- Shared dismiss state, animations, timestamp logic — unchanged

