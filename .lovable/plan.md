# Sidebar Language Picker + Visual Settings Overhaul

## My Thoughts

**Visual settings like the reference image**: The image shows a card-based visual picker (theme cards with mini-previews, font selector with "Aa" cards). This is a **good idea** — it's more engaging than toggle rows for visual preferences. However, I'd adapt it to fit our existing design system rather than copy it exactly. Specifically:

- **Color mode**: 3 visual cards (Light / Auto / Dark) replacing the current toggle button — requires adding "auto" (system) support to ThemeProvider
- **Font style**: Visual "Aa" cards (Default / Sans / Serif / Dyslexic-friendly) — replaces font size segmented control or sits alongside it
- **Skip "Background animation"**: We don't have animations to toggle, so this doesn't apply

## Plan

### 1. Extend ThemeProvider to support "auto" mode

- Change `Theme` type from `"light" | "dark"` to `"light" | "dark" | "auto"`
- "Auto" follows `prefers-color-scheme` media query
- Store preference in localStorage, resolve actual theme at runtime

### 2. Redesign GeneralPanel Appearance section

Replace the current row-based appearance settings with visual card pickers:

**Color mode** — 3 selectable cards with mini window illustrations:

- Light (warm paper preview), Auto (split preview), Dark (charcoal preview)

Cards are `~120px` wide rounded-xl boxes with a border highlight on selection (accent color)  
  
**side note:** make sure the animations and how it interacts with mouse hover nice which adds character

**Font style** — 4 selectable "Aa" cards:

- Default (Instrument Serif), Sans (Inter), Serif, Dyslexic-friendly (OpenDyslexic)
- Add font preference to `AppSettings` in WorkspaceContext

**Font size** — Keep existing S/M/L segmented control below the cards

**Compact mode** — Keep as toggle row below

### 3. Add font preference to WorkspaceContext

- Add `fontFamily: "default" | "sans" | "serif" | "dyslexic"` to `AppSettings`
- Apply a class to `<body>` or root based on selection

### 4. Sidebar Language submenu

- Convert the "Language" `DropdownMenuItem` into a `DropdownMenuSub` with a submenu listing 10 languages (English, Español, Français, Deutsch, Português, 日本語, 中文, 한국어, العربية, हिन्दी)
- Selected language shows a checkmark
- Store selection in WorkspaceContext (add `language` field to AppSettings)
- Do not Sync with the Nexi settings preferred language dropdown, as i want nexi responses langugae to be separate from the UI langugae   
  
side note: You do not have to implement system wide langugaae change as it can be very taxing 