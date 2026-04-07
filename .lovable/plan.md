

## Insights Page (Learner Studio) — Detailed Audit

### What works well

- **Left nav + content split** matches Settings exactly — consistent app-wide pattern. Active state with `bg-accent/10 text-accent` is clean and visible.
- **Overview metric tiles** are well-spaced, staggered entrance animations feel polished. The serif number + uppercase label pairing is on-brand.
- **Bar chart** uses semantic tokens for axes, gridlines, and tooltip — works in both themes. Custom tooltip with `bg-popover` is correct.
- **Progress tab** is the strongest tab. Varied data (5%–100%), three status types, animated bars with scroll-reveal — this feels complete and real.
- **Patterns tab** card grouping with section headers matches the Settings page card pattern. Clean and readable.
- **Continue Learning nudge** in Overview is useful — directly actionable, links to workspace.

---

### Issues found — ranked by severity

#### 1. Focus Areas and Patterns tabs are too thin — could be merged
**Focus Areas** shows 4 cards with topic + course + follow-up count. **Patterns** shows 7 key-value rows in 2 groups. Both tabs feel sparse — each has about 30% viewport fill and large empty voids below. A learner clicking through 4 tabs where 2 feel half-empty creates a "where's the rest?" impression.

**Recommendation:** Merge Focus Areas into Patterns. Rename the combined tab "Patterns & Focus." Show the Nexi Usage / Study Habits cards first, then a "Topics to revisit" section below with the 4 focus area cards. This gives one dense, satisfying tab instead of two sparse ones. The left nav drops to 3 items (Overview, Progress, Patterns) which is cleaner.

#### 2. Focus Areas cards link to `/library` — wrong destination
Every focus area card is a `<Link to="/library">`. Clicking "Backpropagation" takes you to the full library page, not to anything related to backpropagation. This is misleading — the user expects to land on the relevant course or a filtered view. Since there's no deep-link to a specific topic, the link creates false promise.

**Fix:** Either link to the specific course workspace (`/workspace/{courseId}`) or remove the Link wrapper entirely and make the cards non-clickable informational elements. Non-clickable is more honest given current functionality.

#### 3. Focus Areas course tag is inline with topic name — wrapping on narrow screens
The course name (e.g., "Foundations of Machine Learning") sits inline next to the topic name on the same line. On the screenshot this renders as `Backpropagation  Foundations of Machine Learning` — two text elements jammed together with only a background color difference distinguishing them. At narrower widths this will wrap awkwardly.

**Fix:** The previous audit spec called for the course tag on a second line below the topic. This was partially applied (the tag has `mt-1 inline-block`) but the parent `<div>` doesn't force a line break. Add `block` to the outer div or wrap the tag in its own div.

#### 4. Overview "Study Hours" metric is inflated and fake
`82h` is computed from `Math.floor(data.progress * 15 + 60)` per course, summed and divided by 60. This formula produces unrealistically high numbers that scale with the number of published courses. With 6 courses it shows 82h. If someone publishes a 7th course, it jumps. This metric has no grounding in reality and will confuse users who know they haven't studied 82 hours.

**Fix:** Either use a fixed realistic number (e.g., `12h` total) or derive from `weeklyActivity` data (sum = 12.5h, show that). Using the weekly chart data as the source makes the number and the chart tell the same story.

#### 5. Patterns tab "Questions asked" shows `1` instead of fallback `14`
The fallback logic is `Object.values(chatMessages).flat().filter(...).length || 14`. In the screenshot it shows `1`, meaning there is exactly 1 user message in chatMessages. The fallback only triggers on `0`. This means the displayed number fluctuates between real (tiny) counts and the hardcoded fallback — inconsistent behavior. Similar issue with "Tasks completed" showing `1` instead of the fallback `3`.

**Fix:** Either always show real data (and accept small numbers are fine — they're honest), or always show seeded minimums: `Math.max(realCount, seedMinimum)`. The `|| fallback` pattern is the wrong tool — it only catches zero, not "embarrassingly low."

#### 6. Patterns tab "Most used mood" shows lowercase `focused` instead of `Focused`
The mood value comes raw from the reflection data without capitalization. Every other value in the Patterns rows is properly cased or formatted.

**Fix:** Capitalize the first letter: `mostUsedMood.charAt(0).toUpperCase() + mostUsedMood.slice(1)`.

#### 7. Left nav doesn't match Settings nav styling exactly
Settings uses `py-2 rounded-lg text-[13px]` with icons and `hover:bg-muted/50`. Insights uses `py-1.5 rounded-md text-sm` without icons and no hover background on inactive items. The two pages sit adjacent in the sidebar and should feel like siblings.

**Fix:** Align Insights nav to Settings: add `hover:bg-muted/50` to inactive items, change to `py-2 rounded-lg text-[13px]`, and optionally add icons (Sparkles for Overview, Target for Focus, BarChart3 for Progress, Activity for Patterns) — though icons are optional if keeping the page lighter.

#### 8. No mobile handling for left nav
At mobile widths the 176px (`w-44`) nav and content area squeeze together. Settings has the same issue — neither page collapses the left nav on mobile. For consistency this is "fine" (both are broken the same way), but it's worth noting.

**Fix (if addressing):** Hide the left nav below `md` breakpoint and show horizontal pill tabs at the top instead, similar to how Communication now uses capsule tabs.

#### 9. Overview content area has extra `py-6` creating misalignment with nav
The content panel has `py-6` (line 435), pushing the first metric tile 24px below the top of the nav. The nav items start at the very top. This creates a visual misalignment — the "Overview" label sits higher than the first card.

**Fix:** Remove `py-6` or reduce to `pt-1` so the content aligns with the top of the nav list.

#### 10. Tab switch has no crossfade — instant content swap
The wrapper has `transition-opacity duration-150` but the children are conditionally rendered (`&&`), so React unmounts/mounts them — the opacity transition never fires. Content just pops in.

**Fix:** Either use CSS approach (render all tabs, show/hide with opacity + absolute positioning) or accept the instant swap. Given the `animate-fade-in` on each tab's children, the entrance animation partially compensates, so this is low priority.

#### 11. Focus Areas frequency bar doesn't animate on mount
The bar width is set via inline `style={{ width: ... }}` with `transition-all duration-500`, but the initial render already has the target width — so the transition never plays. Unlike the Progress tab which uses `AnimatedProgressBar` with a delayed `useState`, these bars appear at full width immediately.

**Fix:** Either reuse the `AnimatedProgressBar` component, or add a simple mounted state that starts at 0 and transitions to target.

#### 12. Empty state in Progress tab is orphaned from the page's visual language
The empty state uses `BookOpen` icon + "Browse Library" link. This is fine but could be warmer — matching the "Nexi noticed" tone. "No courses started yet" is factual but cold for a page that's branded as "surfaced by Nexi."

**Fix (low priority):** Rephrase to something like "Start a course to see your progress here" and use the Sparkles icon instead.

---

### Structural recommendation: Merge to 3 tabs

The strongest version of this page has 3 tabs, not 4:

```
Overview   — Metrics + chart + continue nudge (unchanged)
Progress   — Course cards with bars (unchanged)
Patterns   — Nexi Usage rows + Study Habits rows + Focus Areas cards
```

This eliminates two problems at once: the sparse Focus Areas tab and the sparse Patterns tab. It also reduces navigation friction — fewer clicks to see everything.

---

### Summary of recommended changes

| Priority | Change |
|----------|--------|
| High | Merge Focus Areas into Patterns tab (3 tabs total) |
| High | Fix Focus Areas links (remove `/library` links or point to workspace) |
| High | Fix Study Hours metric (derive from weekly data, not formula) |
| Medium | Fix Patterns fallback logic (`Math.max` instead of `\|\|`) |
| Medium | Capitalize mood value in Patterns |
| Medium | Force course tag to second line in focus area cards |
| Medium | Align left nav styling with Settings (hover bg, sizing) |
| Medium | Remove content panel `py-6` misalignment |
| Low | Animate Focus Areas frequency bars on mount |
| Low | Add mobile horizontal tabs fallback |
| Low | Warm up Progress empty state copy |

