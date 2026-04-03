import { useState, useRef, KeyboardEvent } from "react";
import {
  Search, X, Mail, MoreHorizontal, Shield, Upload,
  UserPlus, Pencil, UserCog, UserMinus, Play, FileText,
  BookOpen, Award, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { departments, adminCourses } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type MemberRole = "learner" | "manager" | "admin";
type MemberStatus = "active" | "invited" | "inactive";

interface Member {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  department: string;
  status: MemberStatus;
  dateJoined: string;
  coursesEnrolled: number;
  lastActive: string;
  masteryAchieved: number;
  courseProgress?: { name: string; progress: number; mastery: boolean }[];
}

// ─── Seed data ──────────────────────────────────────────────

const seedMembers: Member[] = [
  { id: "m-1", name: "Aisha Patel", email: "aisha@meridian.edu", role: "learner", department: "Engineering", status: "active", dateJoined: "2025-09-15", coursesEnrolled: 3, lastActive: "2 hours ago", masteryAchieved: 2, courseProgress: [{ name: "Python Fundamentals", progress: 85, mastery: true }, { name: "Data Privacy & Compliance", progress: 100, mastery: true }, { name: "Leadership Basics", progress: 40, mastery: false }] },
  { id: "m-2", name: "James Liu", email: "james@meridian.edu", role: "learner", department: "Product", status: "active", dateJoined: "2025-10-02", coursesEnrolled: 2, lastActive: "1 day ago", masteryAchieved: 1, courseProgress: [{ name: "Leadership Basics", progress: 72, mastery: true }, { name: "Python Fundamentals", progress: 30, mastery: false }] },
  { id: "m-3", name: "Priya Sharma", email: "priya@meridian.edu", role: "learner", department: "Operations", status: "active", dateJoined: "2025-08-20", coursesEnrolled: 2, lastActive: "3 hours ago", masteryAchieved: 2, courseProgress: [{ name: "Data Privacy & Compliance", progress: 100, mastery: true }, { name: "Python Fundamentals", progress: 90, mastery: true }] },
  { id: "m-4", name: "David Okafor", email: "david@meridian.edu", role: "manager", department: "Engineering", status: "active", dateJoined: "2025-08-15", coursesEnrolled: 2, lastActive: "5 hours ago", masteryAchieved: 1, courseProgress: [{ name: "Python Fundamentals", progress: 60, mastery: false }, { name: "Leadership Basics", progress: 100, mastery: true }] },
  { id: "m-5", name: "Sarah Kim", email: "sarah@meridian.edu", role: "learner", department: "Product", status: "invited", dateJoined: "2026-03-20", coursesEnrolled: 0, lastActive: "Never", masteryAchieved: 0 },
  { id: "m-6", name: "Marcus Chen", email: "marcus@meridian.edu", role: "learner", department: "Operations", status: "active", dateJoined: "2025-11-01", coursesEnrolled: 2, lastActive: "4 hours ago", masteryAchieved: 0, courseProgress: [{ name: "Data Privacy & Compliance", progress: 45, mastery: false }, { name: "Leadership Basics", progress: 20, mastery: false }] },
  { id: "m-7", name: "Elena Rodriguez", email: "elena@meridian.edu", role: "admin", department: "Product", status: "active", dateJoined: "2025-07-30", coursesEnrolled: 1, lastActive: "1 hour ago", masteryAchieved: 1, courseProgress: [{ name: "Leadership Basics", progress: 100, mastery: true }] },
  { id: "m-8", name: "Tom Walsh", email: "tom@meridian.edu", role: "learner", department: "Engineering", status: "inactive", dateJoined: "2025-09-01", coursesEnrolled: 1, lastActive: "30 days ago", masteryAchieved: 0, courseProgress: [{ name: "Python Fundamentals", progress: 15, mastery: false }] },
  { id: "m-9", name: "Fatima Al-Hassan", email: "fatima@meridian.edu", role: "learner", department: "Operations", status: "active", dateJoined: "2025-10-15", coursesEnrolled: 2, lastActive: "6 hours ago", masteryAchieved: 1, courseProgress: [{ name: "Data Privacy & Compliance", progress: 100, mastery: true }, { name: "Leadership Basics", progress: 55, mastery: false }] },
  { id: "m-10", name: "Ryan Park", email: "ryan@meridian.edu", role: "learner", department: "Engineering", status: "invited", dateJoined: "2026-03-28", coursesEnrolled: 0, lastActive: "Never", masteryAchieved: 0 },
  { id: "m-11", name: "Nadia Osei", email: "nadia@meridian.edu", role: "manager", department: "Product", status: "active", dateJoined: "2025-08-10", coursesEnrolled: 2, lastActive: "2 hours ago", masteryAchieved: 1, courseProgress: [{ name: "Leadership Basics", progress: 100, mastery: true }, { name: "Python Fundamentals", progress: 50, mastery: false }] },
  { id: "m-12", name: "Jordan Reeves", email: "jordan@meridian.edu", role: "admin", department: "Operations", status: "active", dateJoined: "2025-07-15", coursesEnrolled: 0, lastActive: "1 hour ago", masteryAchieved: 0 },
];

// ─── Styles ─────────────────────────────────────────────────

const AMBER = "#C9963A";
const ROW_HOVER = "rgba(201,150,58,0.04)";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = "w-full h-9 px-3 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white";
const inputBorder: React.CSSProperties = { border: "1px solid rgba(0,0,0,0.12)" };
const primaryBtn: React.CSSProperties = { backgroundColor: "#1A1A1A", color: "#fff", borderRadius: 8 };
const ghostBtn: React.CSSProperties = { backgroundColor: "transparent", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8, color: "rgba(0,0,0,0.65)" };

type TabFilter = "all" | "learners" | "admins" | "invited" | "inactive";

let nextId = 100;

// ─── Helpers ────────────────────────────────────────────────

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const roleBadgeStyle = (r: MemberRole): React.CSSProperties => {
  switch (r) {
    case "admin": return { backgroundColor: "rgba(201,150,58,0.12)", color: "#92670A", border: "1px solid rgba(201,150,58,0.25)" };
    case "manager": return { backgroundColor: "rgba(0,0,0,0.06)", color: "#555", border: "1px solid rgba(0,0,0,0.12)" };
    case "learner": return { backgroundColor: "transparent", color: "rgba(0,0,0,0.45)", border: "none" };
  }
};

const statusBadgeStyle = (s: MemberStatus): React.CSSProperties => {
  switch (s) {
    case "active": return { backgroundColor: "rgba(201,150,58,0.10)", color: "#92670A", border: "1px solid rgba(201,150,58,0.20)" };
    case "invited": return { backgroundColor: "rgba(0,0,0,0.05)", color: "#888", border: "1px solid rgba(0,0,0,0.10)" };
    case "inactive": return { backgroundColor: "rgba(0,0,0,0.04)", color: "#aaa", border: "1px solid rgba(0,0,0,0.08)" };
  }
};

// ─── Component ──────────────────────────────────────────────

export default function AdminMembersPage() {
  const [membersList, setMembersList] = useState<Member[]>(seedMembers);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");

  // Drawers
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [detailMember, setDetailMember] = useState<Member | null>(null);

  // Action states
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [roleChangeId, setRoleChangeId] = useState<string | null>(null);

  // Invite form
  const [emailChips, setEmailChips] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [invRole, setInvRole] = useState<MemberRole>("learner");
  const [invDept, setInvDept] = useState("");
  const [invMessage, setInvMessage] = useState("");

  // Bulk import
  const [bulkFile, setBulkFile] = useState<string | null>(null);

  const emailRef = useRef<HTMLInputElement>(null);

  // ─── Filtering ──────────────────────────────────────────

  const tabs: { value: TabFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: membersList.length },
    { value: "learners", label: "Learners", count: membersList.filter(m => m.role === "learner").length },
    { value: "admins", label: "Admins", count: membersList.filter(m => m.role === "admin" || m.role === "manager").length },
    { value: "invited", label: "Invited", count: membersList.filter(m => m.status === "invited").length },
    { value: "inactive", label: "Inactive", count: membersList.filter(m => m.status === "inactive").length },
  ];

  const filtered = membersList
    .filter(m => {
      if (tab === "learners") return m.role === "learner";
      if (tab === "admins") return m.role === "admin" || m.role === "manager";
      if (tab === "invited") return m.status === "invited";
      if (tab === "inactive") return m.status === "inactive";
      return true;
    })
    .filter(m =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
    );

  // ─── Invite handlers ───────────────────────────────────

  const addEmailChip = (email: string) => {
    const trimmed = email.trim().toLowerCase();
    if (trimmed && !emailChips.includes(trimmed)) {
      setEmailChips(prev => [...prev, trimmed]);
    }
    setEmailInput("");
  };

  const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && emailInput.trim()) {
      e.preventDefault();
      addEmailChip(emailInput);
    }
    if (e.key === "Backspace" && !emailInput && emailChips.length > 0) {
      setEmailChips(prev => prev.slice(0, -1));
    }
  };

  const closeInvite = () => {
    setInviteOpen(false);
    setEmailChips([]);
    setEmailInput("");
    setInvRole("learner");
    setInvDept("");
    setInvMessage("");
  };

  const handleSendInvites = () => {
    if (emailChips.length === 0) return;
    const newMembers: Member[] = emailChips.map((email, i) => ({
      id: `m-${++nextId}`,
      name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()),
      email,
      role: invRole,
      department: invDept || "No department",
      status: "invited" as MemberStatus,
      dateJoined: new Date().toISOString().split("T")[0],
      coursesEnrolled: 0,
      lastActive: "Never",
      masteryAchieved: 0,
    }));
    setMembersList(prev => [...newMembers, ...prev]);
    toast.success(`${emailChips.length} invite${emailChips.length > 1 ? "s" : ""} sent successfully`);
    closeInvite();
  };

  // ─── Bulk import ────────────────────────────────────────

  const closeBulk = () => { setBulkOpen(false); setBulkFile(null); };

  const handleBulkImport = () => {
    toast.success("12 members imported");
    closeBulk();
  };

  // ─── Row actions ────────────────────────────────────────

  const handleDeactivate = (id: string) => {
    setMembersList(prev => prev.map(m => m.id === id ? { ...m, status: "inactive" as MemberStatus } : m));
    toast.success("Member deactivated");
    setDeactivatingId(null);
    setActionMenuId(null);
  };

  const handleRoleChange = (id: string, newRole: MemberRole) => {
    setMembersList(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m));
    toast.success("Role updated");
    setRoleChangeId(null);
    setActionMenuId(null);
  };

  // ─── Render ─────────────────────────────────────────────

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Members</h1>
          <p className="text-[14px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)", fontFamily: "Inter, sans-serif" }}>
            Manage learners and admins in your organization
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBulkOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:opacity-80" style={ghostBtn}>
            <Upload className="h-4 w-4" /> Bulk Import
          </button>
          <button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:opacity-90" style={primaryBtn}>
            <UserPlus className="h-4 w-4" /> Invite Members
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-0">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="px-3 py-2 text-[13px] font-medium transition-colors relative"
              style={{
                color: tab === t.value ? AMBER : "rgba(0,0,0,0.45)",
                borderBottom: tab === t.value ? `2px solid ${AMBER}` : "2px solid transparent",
              }}
            >
              {t.label} <span className="ml-1 text-[11px]" style={{ color: "rgba(0,0,0,0.3)" }}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className={cn(inputStyle, "pl-9 pr-3")}
            style={inputBorder}
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={cardStyle}>
          <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
            <Users className="h-5 w-5" style={{ color: AMBER }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>No members found</p>
          <p className="text-xs mb-4" style={{ color: "rgba(0,0,0,0.35)" }}>Try adjusting your filters or search</p>
          <button onClick={() => setInviteOpen(true)} className="px-4 py-2 text-[13px] font-medium" style={primaryBtn}>
            Invite Members
          </button>
        </div>
      ) : (
        <div className="overflow-hidden" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Email", "Role", "Department", "Status", "Joined", ""].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                      i === 1 && "hidden md:table-cell",
                      i === 3 && "hidden lg:table-cell",
                      i === 5 && "hidden xl:table-cell",
                    )}
                    style={{ color: "rgba(0,0,0,0.4)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr
                  key={member.id}
                  className="transition-colors group relative"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = ROW_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  {/* Name */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0"
                        style={{ backgroundColor: "rgba(201,150,58,0.15)", color: AMBER }}
                      >
                        {initials(member.name)}
                      </div>
                      <span className="text-[14px] font-medium" style={{ color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}>
                        {member.name}
                      </span>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.5)" }}>{member.email}</span>
                  </td>

                  {/* Role */}
                  <td className="px-5 py-3.5 relative">
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={roleBadgeStyle(member.role)}
                    >
                      {member.role === "admin" && <Shield className="h-3 w-3" />}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    {/* Inline role change dropdown */}
                    {roleChangeId === member.id && (
                      <div className="absolute left-5 top-10 z-30 w-36 rounded-lg py-1 shadow-lg" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)" }}>
                        {(["learner", "manager", "admin"] as MemberRole[]).map(r => (
                          <button
                            key={r}
                            onClick={() => handleRoleChange(member.id, r)}
                            className="w-full text-left px-3 py-2 text-[13px] hover:bg-[rgba(0,0,0,0.03)] transition-colors capitalize"
                            style={{ color: r === member.role ? AMBER : "rgba(0,0,0,0.7)", fontWeight: r === member.role ? 600 : 400 }}
                          >
                            {r}
                          </button>
                        ))}
                        <button onClick={() => setRoleChangeId(null)} className="w-full text-left px-3 py-2 text-[12px] transition-colors" style={{ color: "rgba(0,0,0,0.35)" }}>Cancel</button>
                      </div>
                    )}
                  </td>

                  {/* Department */}
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.5)" }}>{member.department}</span>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-3.5">
                    <span
                      className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium"
                      style={statusBadgeStyle(member.status)}
                    >
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>

                  {/* Joined */}
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{member.dateJoined}</span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5">
                    {deactivatingId === member.id ? (
                      <div className="flex items-center gap-2 text-[12px]">
                        <span style={{ color: "rgba(0,0,0,0.55)" }}>Deactivate this member?</span>
                        <button onClick={() => handleDeactivate(member.id)} className="font-medium" style={{ color: "#DC2626" }}>Confirm</button>
                        <button onClick={() => setDeactivatingId(null)} style={{ color: "rgba(0,0,0,0.4)" }}>Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setDetailMember(member)}
                          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors"
                          title="View details"
                        >
                          <Pencil className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.35)" }} />
                        </button>
                        <button
                          onClick={() => setRoleChangeId(roleChangeId === member.id ? null : member.id)}
                          className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors"
                          title="Change role"
                        >
                          <UserCog className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.35)" }} />
                        </button>
                        {member.status !== "inactive" && (
                          <button
                            onClick={() => setDeactivatingId(member.id)}
                            className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-black/5 transition-colors"
                            title="Deactivate"
                          >
                            <UserMinus className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.35)" }} />
                          </button>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary */}
      <div className="flex items-center gap-4 mt-4 text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>
        <span>{membersList.length} total members</span>
        <span>·</span>
        <span>{membersList.filter(m => m.role === "admin").length} admins</span>
        <span>·</span>
        <span>{membersList.filter(m => m.role === "manager").length} managers</span>
        <span>·</span>
        <span>{membersList.filter(m => m.status === "invited").length} pending invites</span>
      </div>

      {/* ─── Invite Members Drawer ────────────────────────── */}
      {inviteOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={closeInvite} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div>
                <h2 className="text-[18px] font-semibold" style={{ color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}>Invite Members</h2>
                <p className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.4)" }}>Invites will be sent via email</p>
              </div>
              <button onClick={closeInvite} className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Email chips */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Email addresses</label>
                <div
                  className="min-h-[44px] flex flex-wrap gap-1.5 p-2 rounded-lg cursor-text"
                  style={{ border: "1px solid rgba(0,0,0,0.12)", backgroundColor: "#fff" }}
                  onClick={() => emailRef.current?.focus()}
                >
                  {emailChips.map((chip, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium"
                      style={{ backgroundColor: "rgba(201,150,58,0.12)", color: "#92670A" }}
                    >
                      {chip}
                      <button onClick={() => setEmailChips(prev => prev.filter((_, idx) => idx !== i))} className="hover:opacity-70">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    ref={emailRef}
                    value={emailInput}
                    onChange={e => setEmailInput(e.target.value)}
                    onKeyDown={handleEmailKeyDown}
                    onBlur={() => emailInput.trim() && addEmailChip(emailInput)}
                    placeholder={emailChips.length === 0 ? "Enter email and press Enter..." : ""}
                    className="flex-1 min-w-[140px] h-7 text-[14px] outline-none bg-transparent"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  />
                </div>
              </div>

              {/* Role */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Assign role</label>
                <select value={invRole} onChange={e => setInvRole(e.target.value as MemberRole)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="learner">Learner</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              {/* Department */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Assign department</label>
                <select value={invDept} onChange={e => setInvDept(e.target.value)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="">No department</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>

              {/* Welcome message */}
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Welcome message (optional)</label>
                <textarea
                  value={invMessage}
                  onChange={e => setInvMessage(e.target.value)}
                  placeholder="Add a personal message to the invite email..."
                  rows={3}
                  className="w-full px-3 py-2 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white resize-none"
                  style={{ ...inputBorder, fontFamily: "Inter, sans-serif" }}
                />
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button onClick={closeInvite} className="flex-1 h-10 text-[13px] font-medium transition-colors" style={ghostBtn}>Cancel</button>
              <button
                onClick={handleSendInvites}
                disabled={emailChips.length === 0}
                className="flex-1 h-10 text-[13px] font-medium transition-colors hover:opacity-90 disabled:opacity-40"
                style={primaryBtn}
              >
                Send Invites
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Bulk Import Drawer ───────────────────────────── */}
      {bulkOpen && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={closeBulk} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <h2 className="text-[18px] font-semibold" style={{ color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}>Bulk Import Members</h2>
              <button onClick={closeBulk} className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Upload area */}
              <div
                className="rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[rgba(201,150,58,0.50)]"
                style={{
                  border: "2px dashed rgba(201,150,58,0.30)",
                  backgroundColor: "rgba(201,150,58,0.04)",
                }}
                onClick={() => setBulkFile("members_import.csv")}
              >
                <Upload className="h-6 w-6 mx-auto mb-3" style={{ color: AMBER }} />
                <p className="text-[14px] font-medium" style={{ color: "rgba(0,0,0,0.65)" }}>Drop a CSV file here or click to browse</p>
                <p className="text-[12px] mt-1" style={{ color: "rgba(0,0,0,0.35)" }}>Required columns: name, email, role, department</p>
              </div>

              {/* Mock preview */}
              {bulkFile && (
                <div>
                  <p className="text-[12px] font-medium mb-2" style={{ color: "rgba(0,0,0,0.6)" }}>
                    Preview — {bulkFile}
                  </p>
                  <div className="overflow-hidden rounded-lg" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr style={{ backgroundColor: "rgba(0,0,0,0.03)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                          {["Name", "Email", "Role", "Department"].map(h => (
                            <th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-[10px]" style={{ color: "rgba(0,0,0,0.4)" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { n: "Alex Thompson", e: "alex@meridian.edu", r: "Learner", d: "Engineering" },
                          { n: "Maria Santos", e: "maria@meridian.edu", r: "Learner", d: "Product" },
                          { n: "Chris Wright", e: "chris@meridian.edu", r: "Manager", d: "Operations" },
                        ].map((row, i) => (
                          <tr key={i} style={{ borderBottom: "1px solid rgba(0,0,0,0.04)" }}>
                            <td className="px-3 py-2" style={{ color: "rgba(0,0,0,0.7)" }}>{row.n}</td>
                            <td className="px-3 py-2" style={{ color: "rgba(0,0,0,0.5)" }}>{row.e}</td>
                            <td className="px-3 py-2" style={{ color: "rgba(0,0,0,0.5)" }}>{row.r}</td>
                            <td className="px-3 py-2" style={{ color: "rgba(0,0,0,0.5)" }}>{row.d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] mt-2" style={{ color: "rgba(0,0,0,0.35)" }}>Showing 3 of 12 rows</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button onClick={closeBulk} className="flex-1 h-10 text-[13px] font-medium transition-colors" style={ghostBtn}>Cancel</button>
              <button
                onClick={handleBulkImport}
                disabled={!bulkFile}
                className="flex-1 h-10 text-[13px] font-medium transition-colors hover:opacity-90 disabled:opacity-40"
                style={primaryBtn}
              >
                Import 12 members
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Member Detail Side Panel ─────────────────────── */}
      {detailMember && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={() => setDetailMember(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50 flex flex-col overflow-hidden" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-[14px] font-semibold" style={{ backgroundColor: "rgba(201,150,58,0.15)", color: AMBER }}>
                  {initials(detailMember.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold" style={{ color: "#1A1A1A" }}>{detailMember.name}</h2>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium" style={roleBadgeStyle(detailMember.role)}>
                      {detailMember.role === "admin" && <Shield className="h-2.5 w-2.5" />}
                      {detailMember.role.charAt(0).toUpperCase() + detailMember.role.slice(1)}
                    </span>
                  </div>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mt-1" style={statusBadgeStyle(detailMember.status)}>
                    {detailMember.status.charAt(0).toUpperCase() + detailMember.status.slice(1)}
                  </span>
                </div>
              </div>
              <button onClick={() => setDetailMember(null)} className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-black/5" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Details */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Details</p>
                <div className="space-y-2.5">
                  {[
                    { label: "EMAIL", value: detailMember.email },
                    { label: "DEPARTMENT", value: detailMember.department },
                    { label: "JOINED", value: detailMember.dateJoined },
                    { label: "LAST ACTIVE", value: detailMember.lastActive },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>{row.label}</span>
                      <span className="text-[14px]" style={{ color: "rgba(0,0,0,0.75)", fontFamily: "Inter, sans-serif" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enrolled Courses */}
              {detailMember.courseProgress && detailMember.courseProgress.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Enrolled Courses</p>
                  <div className="space-y-3">
                    {detailMember.courseProgress.slice(0, 4).map((cp, i) => (
                      <div key={i} className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.05)" }}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-medium" style={{ color: "rgba(0,0,0,0.75)" }}>{cp.name}</span>
                          <span className="text-[12px] font-medium" style={{ color: AMBER }}>{cp.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "rgba(201,150,58,0.12)" }}>
                          <div className="h-full rounded-full transition-all" style={{ width: `${cp.progress}%`, backgroundColor: AMBER }} />
                        </div>
                      </div>
                    ))}
                    {detailMember.courseProgress.length > 4 && (
                      <button className="text-[13px] font-medium" style={{ color: AMBER }}>View all →</button>
                    )}
                  </div>
                </div>
              )}

              {/* Mastery */}
              {detailMember.courseProgress && detailMember.courseProgress.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Mastery</p>
                  <div className="space-y-2">
                    {detailMember.courseProgress.map((cp, i) => (
                      <div key={i} className="flex items-center justify-between py-1.5">
                        <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.65)" }}>{cp.name}</span>
                        <span
                          className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium"
                          style={
                            cp.mastery
                              ? { backgroundColor: "rgba(201,150,58,0.12)", color: "#92670A", border: "1px solid rgba(201,150,58,0.25)" }
                              : { backgroundColor: "rgba(0,0,0,0.04)", color: "#aaa", border: "1px solid rgba(0,0,0,0.08)" }
                          }
                        >
                          {cp.mastery ? "Mastery Achieved" : "Not Yet"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Required for unused import warning suppression
const Users = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);
