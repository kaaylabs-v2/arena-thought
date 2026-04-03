const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

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
      <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>{title}</h1>
      <p className="text-sm mt-0.5 mb-8" style={{ color: "rgba(0,0,0,0.45)" }}>{description}</p>
      <div className="p-12 text-center" style={cardStyle}>
        <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
          <span className="text-lg">🚧</span>
        </div>
        <p className="text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>This page will be built in the next phase.</p>
      </div>
    </div>
  );
}
