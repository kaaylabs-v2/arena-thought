

# AI-Generated Definitions & Examples for Vocab Popover

## What Changes

### 1. Auto-generate definition when form opens (`VocabSelectionPopover.tsx`)

When the user clicks "Add to Vocab" on a highlighted term, the form opens with:
- **Term** pre-filled (as now)
- **Definition** auto-populated after a short simulated delay (~800ms) with a mock AI-generated definition based on the term text. Shows a small loading shimmer/skeleton while "generating."
- **Example** field starts empty, with a small "Generate example" link/button beside the label. Clicking it triggers another mock delay and fills in a contextual example sentence. This is more tasteful than a checkbox — it's an on-demand action.
- Both fields remain fully editable — the user can override or clear the AI suggestion and type manually.

### 2. Mock AI generation logic

A simple function that returns plausible definitions and examples based on keyword matching or generic academic-sounding text. No real API call — just a `setTimeout` with curated mock responses for common terms (e.g., "backpropagation", "gradient", "neural network") and a sensible fallback for unknown terms.

### 3. Visual treatment

- While generating: a subtle pulse animation on the field (or skeleton lines inside the textarea)
- After generation: text appears with a brief fade-in
- A small `Sparkles` icon on the "Generate example" button to indicate AI
- Fields stay editable with normal styling after generation

### 4. NotebookPane vocab quick-add form gets the same treatment

The manual add form in the Notebook pane sidebar also gets a "Generate" button for definition and example fields, using the same mock logic, so the experience is consistent.

## Files to Change

| File | Change |
|------|--------|
| `src/components/workspace/VocabSelectionPopover.tsx` | Add mock AI generation for definition on form open, add "Generate example" button, loading states |
| `src/components/workspace/NotebookPane.tsx` | Add generate buttons to the vocab quick-add form for consistency |

