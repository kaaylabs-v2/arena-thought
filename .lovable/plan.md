# Restructure Settings + Profile Pages

## New Architecture

**Profile** becomes a standalone full-page (accessed from sidebar user menu), no 2-pane layout. It keeps all profile-specific content: avatar, name, email, institution, bio, learning goal, learning stats, privacy notice.

**Settings** keeps the 2-pane layout but with reorganized tabs:


| Tab            | Contents                                                                                                                                                 |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **General**    | Voice & Input, Reading & Sources, Appearance (theme, compact mode, font size) - (make sure you organize them in the correct apt order)                   |
| **Nexi**       | Response style, citations, follow-up suggestions + new meaningful settings (memory/context window, language preference, explanation depth for code/math) |
| **Account**    | Org ID (add a copy icon/button next to it)/name, sessions table, logout                                                                                  |
| **Privacy**    | Local-only, analytics, data export, clear data                                                                                                           |
| **Connectors** | All integrations                                                                                                                                         |


## File Changes

### 1. `src/pages/Profile.tsx`

Keep as-is — it's already a dedicated full page with all profile fields, stats, and privacy notice. No changes needed.

### 2. `src/pages/Settings.tsx`

- Remove `"profile"` tab entirely
- Rename `"appearance"` + split: merge appearance settings into a new **General** tab alongside Voice & Input and Reading & Sources
- Rename `"ai-learning"` to `"nexi"` — keep only Nexi AI Companion settings, add 2-3 useful new ones (memory toggle, code explanation depth, language preference)
- Keep Account, Privacy, Connectors as-is
- New tab order: General, Nexi, Account, Privacy, Connectors
- Default active tab: `"general"`

### 3. `src/components/SidebarUserMenu.tsx`

No changes — Profile and Settings links already point to `/profile` and `/settings`.

### 4. `src/components/AppSidebar.tsx`

No changes — Profile is accessed via user menu, not main nav.

## New Nexi Tab Settings (meaningful additions)

- **Conversation memory**: Toggle whether Nexi remembers context across sessions
- **Code explanations**: Segmented control (Beginner / Intermediate / Advanced)
- **Preferred explanation language**: Dropdown or text input for natural language preference