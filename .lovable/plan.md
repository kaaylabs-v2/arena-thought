

# Center All Page Content Consistently

## Problem
6 of 8 pages lack `mx-auto`, causing content to stick to the left with wasted right-side space. Reflections and Progress already look better because they're centered.

## Changes
Add `mx-auto` to the root container `className` in these 6 files:

| File | Current `max-w` |
|------|----------------|
| `src/pages/Index.tsx` | `max-w-3xl` |
| `src/pages/Library.tsx` | `max-w-5xl` |
| `src/pages/StudyPlan.tsx` | `max-w-3xl` |
| `src/pages/Notebook.tsx` | `max-w-5xl` |
| `src/pages/Settings.tsx` | `max-w-2xl` |
| `src/pages/Profile.tsx` | `max-w-2xl` |

Each is a one-line change — append `mx-auto` to the existing className string. No other modifications needed.

