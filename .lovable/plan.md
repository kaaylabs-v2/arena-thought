

# Nexus² / Arena — Refinement Plan

## Current State Assessment

The existing codebase has a solid foundation: design tokens, sidebar, 3-pane workspace, and all 6 pages. However, the product currently has **dead interactions** and **disconnected state** that prevent it from feeling like a real product.

## Key Problems to Fix

1. **Dead state**: "Save to Notebook" in Nexi doesn't create real notes. Follow-up chips do nothing. Send button doesn't work. Notebook pane and Notebook page use separate hardcoded data.
2. **No shared state system**: There's no context/store connecting Nexi saves to the Notebook pane or Notebook page.
3. **Source selection doesn't update Nexi context**: Selecting a source in the Sources pane doesn't change what Nexi shows or references.
4. **Follow-up chips are decorative**: They should inject prompts and generate responses.
5. **Layout elasticity on wide screens**: Reading width is unconstrained in Nexi.

---

## Implementation Plan

### Step 1 — Create shared app state (React Context)

Create `src/context/WorkspaceContext.tsx`:
- `notebookEntries` state (array of notes with id, title, snippet, source, course, tags, date, savedFrom)
- `addNotebookEntry()` function
- `chatMessages` state per course
- `addMessage()` function
- `activeSource` state
- `setActiveSource()` function

Seed with initial demo data. This single context replaces all hardcoded arrays in NexiPane, NotebookPane, and the Notebook page.

### Step 2 — Wire up Nexi to be functional

**NexiPane changes:**
- Connect to WorkspaceContext for messages and notebook
- **Send button works**: typing + pressing Send or Enter adds a user message and generates a simulated Nexi response (pick from a pool of contextual responses based on active source)
- **Save to Notebook works**: clicking "Save to Notebook" calls `addNotebookEntry()` with the message content, creating a real entry that appears in the Notebook pane and page
- **Follow-up chips work**: clicking a chip injects it as a user message and triggers a simulated response
- **Source context visible**: show active source name in header; when source changes, Nexi shows a subtle context update message
- **Max reading width**: cap message area at `max-w-2xl` centered within the pane

### Step 3 — Wire up Notebook pane (workspace)

**NotebookPane changes:**
- Read from WorkspaceContext `notebookEntries` instead of hardcoded array
- New entries from "Save to Notebook" appear immediately with a subtle fade-in animation
- Quick capture input works: pressing Enter creates a personal note entry
- Note count badge updates in real-time in mini mode

### Step 4 — Wire up Notebook page (top-level)

**Notebook page changes:**
- Read from same WorkspaceContext `notebookEntries`
- Search filters against real entries
- Sort by recent/course/tag actually reorders
- Entries saved from workspace appear here too

### Step 5 — Wire up Sources pane to Nexi

**SourcesPane + Workspace changes:**
- When a source is selected, update `activeSource` in context
- NexiPane reads `activeSource` and shows it in the header bar
- Selecting a new source optionally adds a system-style message: "Now grounded in: [source name]"
- Sources pane auto-expands when a source is clicked from mini-rail

### Step 6 — Reflections page: make Save work

- Clicking "Save reflection" adds the reflection to a local state array and clears the input
- New reflections appear at the top of the list with fade-in
- Maintain the calm, private tone

### Step 7 — Polish pass

- **Input UX**: Enter to send in Nexi (Shift+Enter for newline), proper disabled states
- **Transitions**: fade-in on new messages, smooth note appearance in notebook pane
- **Nexi reading width**: messages capped at readable width even on ultrawide
- **Pane width reallocation**: when both side panes are mini, add `max-w-3xl mx-auto` to Nexi message area to prevent line sprawl
- **Empty states**: ensure they show when no entries exist (before demo data loads)
- **Copy button feedback**: show "Copied" briefly after clicking

---

## Technical Details

**State architecture**: Single `WorkspaceProvider` wrapping the app at the `Layout` level. Uses `useState` + context (no external state library needed for this scope). Demo data seeded on mount.

**Simulated AI responses**: A pool of 8-10 contextual response templates keyed by source/topic. Follow-up chips select from this pool. Not random — responses match the chip label (e.g., "Quiz me" generates a quiz-style response).

**File changes:**
- New: `src/context/WorkspaceContext.tsx`
- Edit: `src/components/Layout.tsx` (wrap with provider)
- Edit: `src/components/workspace/NexiPane.tsx` (functional send, save, follow-ups, source context)
- Edit: `src/components/workspace/NotebookPane.tsx` (read from context, working quick capture)
- Edit: `src/components/workspace/SourcesPane.tsx` (source selection updates context)
- Edit: `src/pages/Workspace.tsx` (pass context, source→nexi wiring)
- Edit: `src/pages/Notebook.tsx` (read from context)
- Edit: `src/pages/Reflections.tsx` (working save)
- Minor: `src/pages/Index.tsx`, `src/pages/Progress.tsx` (no major changes, already solid)

