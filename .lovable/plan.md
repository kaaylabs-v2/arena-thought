

## Plan: Admin-Learner Messaging System

### Overview
Add a bidirectional messaging system where the admin (Dr. Sarah Mitchell) can send messages to learners from the Admin Studio, and learners can view and reply from the Learner Studio. Messages are shared through the existing `WorkspaceContext`.

### Architecture

```text
WorkspaceContext
  └── directMessages: DirectMessage[]
  └── addDirectMessage(msg)
  └── markMessageRead(id)

Admin Studio                          Learner Studio
┌─────────────────────┐              ┌─────────────────────┐
│ /admin/messages      │              │ /messages            │
│ - Select learner     │  ◄──────►   │ - Inbox view         │
│ - Compose message    │  shared     │ - Reply to admin     │
│ - View conversation  │  state      │ - View conversation  │
│ - See replies        │              │ - Unread badge       │
└─────────────────────┘              └─────────────────────┘
```

### Changes

**1. WorkspaceContext — Add messaging state**
- New `DirectMessage` type: `{ id, fromRole: "admin"|"learner", fromName, toUserId, subject?, content, timestamp, read }`
- Add `directMessages` state with seed data (2-3 sample messages)
- Add `addDirectMessage()` and `markMessageRead()` callbacks
- Expose in context provider

**2. Learner Messages Page — `src/pages/Messages.tsx`**
- Inbox list showing messages from admin, with unread indicators
- Message detail view with full content and reply composer
- Replies are added as new `DirectMessage` entries with `fromRole: "learner"`
- Consistent page header matching other learner pages (unified layout)

**3. Admin Messages Page — `src/admin/pages/AdminMessagesPage.tsx`**
- Learner selector (from `mockUsers` / `studioMembers`)
- Conversation thread view per learner
- Compose area with subject + message body
- Shows learner replies inline

**4. Routing — `src/App.tsx`**
- Add `/messages` route under Learner Layout
- Add `/admin/messages` route under Admin Guard

**5. Sidebar Navigation**
- Add "Messages" nav item with `MessageSquare` icon to `AppSidebar.tsx` (learner)
- Add "Messages" nav item to `AdminSidebar.tsx` (admin)
- Both show unread count badge when there are unread messages

**6. Unread Badge on Home**
- Optionally show a small notification on the learner Home page if there are unread admin messages

### Seed Data
- Admin message: "Great progress on the Neural Networks module, Alex. Your backpropagation problem set was excellent."
- Admin message: "Please review the updated reading materials for Bayesian Inference before next week."
- Learner reply: "Thank you! I had a question about the chain rule application in deeper networks."

