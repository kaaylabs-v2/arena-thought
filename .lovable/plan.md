

# Text Selection → Add to Vocab in Nexi Pane

## What Changes

### 1. Add a floating "Add to Vocab" tooltip on text selection in Nexi responses

When a user highlights/selects any word or phrase inside a Nexi AI response bubble, a small floating popover appears near the selection with an "Add to Vocab" button (BookA icon + label).

**How it works:**
- Listen for `mouseup` / `selectionchange` on Nexi response content
- If `window.getSelection()` returns non-empty text within a Nexi message, calculate position and show a small floating pill/button
- Clicking it opens a compact inline form (term pre-filled with selected text, definition + example fields)
- On save, calls `addVocabulary()` with `course: courseTitle` and `savedFrom: "nexi"`
- Dismiss on click-outside or Escape
- The popover uses absolute positioning based on selection range bounding rect

### 2. Remove the existing per-message "Save as Vocab" button

The current button on every Nexi message that auto-extracts bold terms is clunky — replace it entirely with the selection-based flow. Keep "Save to Notebook" and "Copy" buttons.

### 3. Vocab form in the floating popover

A minimal form:
- **Term** — pre-filled with highlighted text (editable)
- **Definition** — empty textarea for user to type meaning
- **Example** — optional input
- Save / Cancel buttons

Styled consistently with design system: `bg-popover`, `border-border`, `shadow-lifted`, `rounded-xl`, small text sizes.

### 4. Notebook pane vocab tab already works

The existing vocab tab in NotebookPane already shows course-filtered vocabulary entries. No changes needed there — new entries from the selection flow will appear automatically.

## Files to Change

| File | Change |
|------|--------|
| `src/components/workspace/NexiPane.tsx` | Add selection detection logic, floating popover component, remove old "Save as Vocab" button from action row |

## Technical Approach

- Use a `useEffect` with `document.addEventListener('selectionchange')` scoped to the messages container ref
- Track selection state: `{ text: string, rect: DOMRect, msgId: string } | null`
- Render a portal-free absolutely positioned div when selection is active
- The popover form is a small controlled component rendered inline

