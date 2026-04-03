// Stub pages for remaining admin routes — will be fully built in phase 2

export function AdminContentLibrary() {
  return <StubPage title="Content Library" description="All uploaded files and sources across all courses" />;
}

export function AdminMembers() {
  return <StubPage title="Members" description="Manage all learners and admins in the organization" />;
}

export function AdminDepartments() {
  return <StubPage title="Departments" description="Organize learners into groups, teams, and cohorts" />;
}

export function AdminOutcomes() {
  return <StubPage title="Outcomes" description="Track mastery definitions and who achieved them" />;
}

export function AdminAnalytics() {
  return <StubPage title="Analytics" description="Organization-level insights and engagement data" />;
}

export function AdminAnnouncements() {
  return <StubPage title="Announcements" description="Send messages to learners and departments" />;
}

export function AdminSettings() {
  return <StubPage title="Settings" description="Organization profile, branding, and configuration" />;
}

export function AdminHelp() {
  return <StubPage title="Help" description="Documentation and support resources" />;
}

function StubPage({ title, description }: { title: string; description: string }) {
  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-0.5 mb-8">{description}</p>
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="h-12 w-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-3">
          <span className="text-slate-400 text-lg">🚧</span>
        </div>
        <p className="text-sm text-slate-500">This page will be built in the next phase.</p>
      </div>
    </div>
  );
}
