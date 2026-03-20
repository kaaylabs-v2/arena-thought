

## Root Cause Analysis

The logos have failed four times because they are **hand-drawn approximations**, not actual brand assets. Here is the specific problem with each:

| Logo | Problem |
|------|---------|
| **Notion** | Path data is close but uses `fill="hsl(var(--card))"` for the cutout, which breaks across themes |
| **Google Calendar** | Custom geometric attempt with `<text>` and `<rect>` elements — looks nothing like the real mark |
| **Google Drive** | Decent but uses slightly off path coordinates |
| **Zotero** | Simplified "Z" in a red box — not the official letterform |
| **Readwise** | Completely fabricated book icon — Readwise's logo is a stylized yellow/orange circle with a book shape |
| **Anki** | Star icon in a blue box — Anki's real logo is a multi-pointed star/flower shape |
| **Obsidian** | Crude crystal shape — the real logo is a detailed gem with gradient facets |
| **Apple Calendar** | Simplified calendar with `<text>` tag for the day number — doesn't match macOS icon style |

## Strategy: Use Verified SVG Path Data from Simple Icons

**Simple Icons** is an MIT-licensed collection of 3,400+ official brand SVGs verified against brand guidelines. I fetched the actual path data from their GitHub repo for the brands that exist there.

### Available from Simple Icons (verified paths obtained)

| Brand | Color | Status |
|-------|-------|--------|
| Notion | `#000000` | Path fetched and verified |
| Zotero | `#CC2936` | Path fetched and verified |
| Anki | `#235DBA` | Path fetched and verified |
| Obsidian | `#7C3AED` | Path fetched and verified |
| Google Drive | `#4285F4` | Path fetched (single-color version) |
| Google Calendar | `#4285F4` | Path fetched and verified |

### Not in Simple Icons (need faithful recreation)

| Brand | Approach |
|-------|----------|
| **Readwise** | Use official brand color (`#FCD34D` yellow) with the recognizable owl/book mark shape from their actual brand assets |
| **Apple Calendar** | Use the macOS calendar icon style: red header strip, white body, day number "17" — but rendered with proper `<rect>` + `<text>` at correct proportions |

## Implementation Plan

### Step 1: Rewrite `src/components/IntegrationLogos.tsx`

Replace every logo component with verified SVG data:

- **All Simple Icons logos**: Use `viewBox="0 0 24 24"` with the exact `<path d="...">` from Simple Icons
- **Multi-color logos** (Google Drive, Google Calendar): Use the official multi-color SVG paths from Google's brand guidelines rather than the monochrome Simple Icons version, since user chose "Full color"
- **Readwise**: Faithful recreation of the yellow circle + white owl silhouette
- **Apple Calendar**: Clean macOS-style calendar icon with red header, white body, and day number

For each logo, the component will:
- Accept `className` prop for sizing
- Use the brand's official hex color(s) as fill
- Use `viewBox="0 0 24 24"` (Simple Icons standard) where possible
- NOT use `currentColor` or theme-dependent fills — always explicit brand colors

### Step 2: No changes needed to Settings.tsx or StudyPlan.tsx

Both files already import and use the logo components correctly. Only the SVG internals in `IntegrationLogos.tsx` need to change.

### Technical Details

The key fix: replace ~107 lines of hand-drawn SVG paths with verified data from Simple Icons (MIT license). The Google Drive and Google Calendar logos will keep their multi-color treatment since Simple Icons only provides monochrome versions and the user wants full color. For those two, I'll use the existing multi-color paths but with corrected geometry from Google's official brand resources.

