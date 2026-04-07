

## Fix: Expandable Announcement Body in Notification Inbox

**Problem:** The announcement body uses `line-clamp-2`, cutting off longer content with no way to read the full text.

**Solution:** Add click-to-expand on each notification row. Clicking the row toggles the body between truncated (2 lines) and fully visible. This is the lightest fix — no modals, no new pages, no layout changes.

### Changes — `src/pages/Index.tsx` (NotificationInbox component only)

1. Add an `expandedIds` state: `useState<Set<string>>(new Set())`

2. On the notification row `<div>`, add an `onClick` handler that toggles the notification's ID in `expandedIds` (only for non-dismissed items)

3. On the body `<p>`, conditionally apply `line-clamp-2` only when the item is **not** expanded:
   ```
   className={`text-xs text-muted-foreground ${expandedIds.has(n.id) ? '' : 'line-clamp-2'}`}
   ```

4. No other changes — dismiss button, styling, layout, and all other sections remain untouched.

