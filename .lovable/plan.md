

# Nexus² / Arena — Premium AI Learning Workspace

## Design System Foundation

**Typography**: Inter for UI text; a serif font (Playfair Display or similar via Google Fonts) for display headings and course titles. Strong hierarchy with deliberate sizing scale.

**Color — Light Mode**: Warm paper-like background (`hsl(40, 20%, 98%)`), muted navy primary (`hsl(220, 40%, 25%)`), warm amber accent for highlights, soft warm grays for borders/surfaces. Premium, calm, notebook-like.

**Color — Dark Mode**: Deep warm charcoal backgrounds (not pure black), preserved navy/amber accents translated for dark surfaces, warm muted tones throughout. Fully designed, not an inversion.

**Surfaces**: Subtle warm borders, soft layered panels, restrained shadows. No glass/blur effects.

**Spacing & Radius**: Consistent 4px grid, medium border radius (8px default), generous but not wasteful whitespace.

---

## Global Navigation (Sidebar)

Premium sidebar with expanded and mini-rail (icon-only) states. Never fully disappears.

**Top section**: Nexus² logo/wordmark  
**Main nav**: Home, Library, Notebook, Reflections, Progress — each with refined Lucide icons, active/hover states  
**Bottom utilities**: Profile avatar, Settings, Theme toggle (light/dark)  

Smooth collapse/expand transition. Active route highlighted with subtle warm accent. Mini-rail shows icons only with tooltips.

---

## Pages

### 1. Home
Calm entry point, not a dashboard. Contains:
- **Continue Learning** — single prominent card showing last active course with source context
- **Recent Workspaces** — 2-3 compact rows of recently accessed courses
- **Quick Actions** — subtle row: "Open Library", "Review Notebook"
- Sparse, elegant, high-value. No stats grid, no KPI cards.

### 2. Library
Clean course directory with:
- Search bar (functional-looking with proper focus states)
- Filter tabs: All, Active, Completed, Pinned
- Course cards in a clean grid — each showing title (serif), brief description, progress indicator (subtle bar), last accessed date
- Premium card hover states
- Clicking a course navigates to the Course Workspace

### 3. Course Workspace (Core Experience)
The heart of the product. Full-width 3-pane layout:

**Left — Sources Pane**
- Collapsible to mini-rail (icon strip showing module icons)
- Expanded shows: course module tree, lectures, readings, PDFs
- Source items with icons, titles, completion dots
- Selecting a source enters "focused source mode" — shows source title, content preview, back button to return to module list
- Pinned and recent materials sections

**Center — Nexi (AI Companion)**
- Dominant pane, always primary
- Premium message display — not generic chat bubbles. Response blocks with clear hierarchy, source citations styled as subtle inline references
- Input area at bottom: clean textarea with send button, subtle affordances
- Follow-up chips below responses: "Explain simply", "Quiz me", "Extract key ideas", "Compare concepts" — restrained, useful
- Each response has action row: Save to Notebook, Copy — minimal icons
- Excellent typography and reading rhythm in responses
- Empty state: calm welcome message grounded in the current course context

**Right — Notebook/Studio Pane**
- Collapsible to mini-rail (notebook icon + count badge)
- Expanded shows: saved notes list, organized by recency/topic
- Note cards with title, snippet, source link, timestamp
- Tags/labels for organization
- Quick capture area at top
- When saving from Nexi, smooth transition showing note appearing in Notebook

**Pane behavior**: Smooth CSS transitions on width changes. Collapse/expand toggles on each pane header. Nexi always retains majority of space. State preserved across interactions.

### 4. Notebook (Top-level)
Full knowledge browsing view:
- Search and filter by course, tag, date
- Note cards in a clean list or grid view
- Each note shows: title, snippet, source course, tags, date
- Sort options: Recent, Course, Tag
- Empty state: "Your insights will appear here as you learn"
- Feels like a serious knowledge system, not passive storage

### 5. Reflections
Private, calm reflection space:
- Journal-style entries with date headers
- Rich text area for writing reflections
- Linked to courses/topics optionally
- Privacy indicator visible ("Private • Only you")
- Minimal UI, generous whitespace, warm tone
- Empty state: "A quiet space for your thinking"

### 6. Progress
Subtle mastery overview:
- Per-course progress cards — title, completion percentage (subtle bar), last studied, time spent
- "Continue" action on each card routing back to Course Workspace
- Overall summary at top: courses active, total study time — kept minimal
- No badges, no gamification, no charts unless a single clean one adds value
- Empty state directing to Library

---

## States & Polish

- **Empty states**: Designed for every page with calm, purposeful copy
- **Loading states**: Skeleton screens matching actual content layout
- **Hover states**: Subtle background shifts, not color explosions
- **Active states**: Warm accent highlight, clear but not loud
- **Focus states**: Visible ring for accessibility, styled to match design
- **Dark mode**: Every page and component fully translated — warm dark palette, not neglected
- **Transitions**: Smooth 200-300ms ease for pane collapses, page transitions, hover effects

---

## Component Consistency

All buttons, inputs, cards, tabs, pills, tooltips, sheets, and menus follow unified design tokens. Button hierarchy: primary (navy fill), secondary (outlined), ghost (text-only), destructive (red, rare). Consistent icon weight (Lucide, strokeWidth 1.5). Consistent spacing rhythm throughout.

---

## File Structure

- Design system tokens in `index.css`
- Sidebar as `AppSidebar` component
- Layout wrapper with `SidebarProvider`
- Each page as route: `/`, `/library`, `/workspace/:id`, `/notebook`, `/reflections`, `/progress`
- Workspace panes as separate components: `SourcesPane`, `NexiPane`, `NotebookPane`
- Shared components: `CourseCard`, `NoteCard`, `NexiMessage`, `FollowUpChips`, `PaneHeader`
- Theme toggle using class-based dark mode

