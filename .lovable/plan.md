

# Make Page Transitions Visibly Animated but Still Fast

## Current State
- `page-enter`: 0.35s, opacity 0→1, translateY(4px), scale(0.999→1) — barely perceptible
- No exit animation at all — old page vanishes instantly, new one fades in minimally

## What We'll Do
Increase the animation presence just enough to feel polished (Apple Settings / iOS tab-switch level) without slowing navigation.

### Changes

**1. Bump `page-enter` keyframe values (tailwind.config.ts)**
- `translateY`: 4px → 8px (noticeable upward entrance)
- `scale`: 0.999 → 0.985 (subtle zoom-in, visible but not dramatic)
- Duration stays 0.35s — fast enough to never feel sluggish

**2. Add staggered content fade for cards/sections**
- Add a `animate-fade-in` with `animation-delay` utility on major content blocks inside pages (cards, stat grids, tables)
- Uses existing `fade-in` keyframe (0.4s) with small stagger delays (50ms, 100ms, 150ms) via Tailwind arbitrary values
- This creates an Apple-like "content settling in" effect without blocking interaction

**3. Apply to both Layout files**
- `src/components/Layout.tsx` (Learner Studio) — already has `animate-page-enter`, just benefits from the keyframe update
- `src/admin/components/AdminLayout.tsx` (Admin Studio) — same

No exit animation added — exit animations require `AnimatePresence` (framer-motion) which would add a dependency and delay navigation. The enter-only approach matches Apple's own Settings app behavior.

### Files to Edit
- `tailwind.config.ts` — update `page-enter` keyframe values
- `src/pages/Index.tsx` — add stagger classes to greeting card + stat cards
- `src/admin/pages/AdminDashboard.tsx` — add stagger classes to stat cards + chart sections

Total: 3 files, minimal changes, no new dependencies.

