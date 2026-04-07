

## Announcements Banner on Learner Home Page

### What we're building

A dismissible announcements section on the Home page (`Index.tsx`) that surfaces admin-created announcements. It sits between the greeting and the "Continue Learning" card.

### Single file change

**`src/pages/Index.tsx`**

1. Import `Megaphone`, `X` from lucide-react and `useState` from React
2. Pull `studioAnnouncements` from `useWorkspace()`
3. Add `dismissedIds` state via `useState<Set<string>>`
4. Filter announcements to show only non-dismissed, take latest 2 (sorted by `sentDate` descending)
5. Render the section between the greeting `<div>` and the "Continue Learning" `<section>`:

```
Section container: mb-8 space-y-2 animate-fade-in [animation-delay:80ms]

Each card:
  rounded-xl border border-accent/20 bg-accent/5 px-5 py-4
  flex items-start gap-3

  Left icon: Megaphone h-4 w-4 text-accent mt-0.5 shrink-0

  Content (flex-1 min-w-0):
    Title row (flex items-center gap-2):
      Title: text-sm font-medium text-foreground truncate
      Audience badge: text-[10px] bg-muted text-muted-foreground rounded-full px-2 py-0.5
    Body: text-sm text-muted-foreground line-clamp-2 mt-1
    Date: text-[11px] text-muted-foreground/60 mt-1.5

  Dismiss button: text-muted-foreground hover:text-foreground p-1 rounded-md
    X icon h-3.5 w-3.5

If >2 announcements exist, show a "View all →" text link below the cards
  text-[12px] text-accent hover:text-accent/80
  (links to /messages since there's no dedicated announcements route)
```

### Theme safety

All classes use semantic tokens (`text-foreground`, `bg-accent/5`, `border-accent/20`, `bg-muted`, `text-muted-foreground`). No hardcoded colors. Works in both light and dark mode automatically.

### What stays untouched

- WorkspaceContext, routing, sidebar, admin pages — zero changes
- All existing Home page sections remain identical

