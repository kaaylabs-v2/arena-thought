import { useState } from "react";
import { Search, Plus, X, Mail, MoreHorizontal, UserPlus, Shield, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import {
  members as seedMembers,
  departments,
  type AdminMember,
  type MemberRole,
  type MemberStatus,
} from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

const AMBER = "#C9963A";
const AMBER_LIGHT = "rgba(201, 150, 58, 0.08)";
const ROW_HOVER = "rgba(201, 150, 58, 0.04)";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = "w-full h-9 px-3 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white";
const inputBorder: React.CSSProperties = { border: "1px solid rgba(0,0,0,0.12)" };

const primaryBtn: React.CSSProperties = { backgroundColor: "#1A1A1A", color: "#fff", borderRadius: 8 };
const secondaryBtn: React.CSSProperties = { backgroundColor: "transparent", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8, color: "rgba(0,0,0,0.65)" };

type TabFilter = "all" | "active" | "invited" | "inactive";

let nextId = 100;

export default function AdminMembersPage() {
  const [membersList, setMembersList] = useState<AdminMember[]>(seedMembers);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<AdminMember | null>(null);
  const [actionMenuId, setActionMenuId] = useState<string | null>(null);

  // Invite form
  const [invName, setInvName] = useState("");
  const [invEmail, setInvEmail] = useState("");
  const [invRole, setInvRole] = useState<MemberRole>("learner");
  const [invDept, setInvDept] = useState("");

  // Edit form
  const [editRole, setEditRole] = useState<MemberRole>("learner");
  const [editDept, setEditDept] = useState("");
  const [editStatus, setEditStatus] = useState<MemberStatus>("active");

  const tabs: { value: TabFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: membersList.length },
    { value: "active", label: "Active", count: membersList.filter(m => m.status === "active").length },
    { value: "invited", label: "Invited", count: membersList.filter(m => m.status === "invited").length },
    { value: "inactive", label: "Inactive", count: membersList.filter(m => m.status === "inactive").length },
  ];

  const filtered = membersList
    .filter(m => tab === "all" || m.status === tab)
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  const statusBadge = (s: MemberStatus): React.CSSProperties => {
    switch (s) {
      case "active": return { backgroundColor: "rgba(34,197,94,0.08)", color: "#16a34a" };
      case "invited": return { backgroundColor: AMBER_LIGHT, color: AMBER };
      case "inactive": return { backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.4)" };
    }
  };

  const roleBadge = (r: MemberRole): React.CSSProperties => {
    switch (r) {
      case "admin": return { backgroundColor: "rgba(201,150,58,0.1)", color: AMBER };
      case "manager": return { backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.55)" };
      case "learner": return { backgroundColor: "transparent", color: "rgba(0,0,0,0.4)" };
    }
  };

  const closeInvite = () => { setInviteOpen(false); setInvName(""); setInvEmail(""); setInvRole("learner"); setInvDept(""); };

  const handleInvite = () => {
    if (!invName.trim() || !invEmail.trim()) return;
    const newMember: AdminMember = {
      id: `m-${++nextId}`,
      name: invName,
      email: invEmail,
      role: invRole,
      department: invDept || "Unassigned",
      status: "invited",
      dateJoined: new Date().toISOString().split("T")[0],
      coursesEnrolled: 0,
      lastActive: "Never",
      masteryAchieved: 0,
    };
    setMembersList(prev => [newMember, ...prev]);
    toast.success(`Invitation sent to ${invName}`);
    closeInvite();
  };

  const openEdit = (member: AdminMember) => {
    setEditingMember(member);
    setEditRole(member.role);
    setEditDept(member.department);
    setEditStatus(member.status);
    setActionMenuId(null);
  };

  const handleSaveEdit = () => {
    if (!editingMember) return;
    setMembersList(prev => prev.map(m =>
      m.id === editingMember.id ? { ...m, role: editRole, department: editDept, status: editStatus } : m
    ));
    toast.success(`Updated ${editingMember.name}`);
    setEditingMember(null);
  };

  const handleRemove = (id: string) => {
    const member = membersList.find(m => m.id === id);
    setMembersList(prev => prev.filter(m => m.id !== id));
    toast.success(`${member?.name || "Member"} removed`);
    setActionMenuId(null);
  };

  const handleResendInvite = (member: AdminMember) => {
    toast.success(`Invitation resent to ${member.email}`);
    setActionMenuId(null);
  };

  const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Members</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Manage all learners and admins in the organization</p>
        </div>
        <button onClick={() => setInviteOpen(true)} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:opacity-90" style={primaryBtn}>
          <UserPlus className="h-4 w-4" /> Invite Member
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: tab === t.value ? "#fff" : "transparent",
                color: tab === t.value ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.45)",
                boxShadow: tab === t.value ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                borderBottom: tab === t.value ? `2px solid ${AMBER}` : "2px solid transparent",
              }}
            >
              {t.label} <span className="ml-1 text-[11px]" style={{ color: "rgba(0,0,0,0.3)" }}>{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search members..." className={cn(inputStyle, "pl-9 pr-3")} style={inputBorder} />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={cardStyle}>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>No members found</p>
        </div>
      ) : (
        <div className="overflow-hidden" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Name", "Role", "Department", "Status", "Courses", "Mastery", "Last Active", ""].map((h, i) => (
                  <th key={i} className={cn(
                    "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                    i === 2 && "hidden md:table-cell",
                    i === 4 && "hidden lg:table-cell",
                    i === 5 && "hidden lg:table-cell",
                    i === 6 && "hidden xl:table-cell",
                  )} style={{ color: "rgba(0,0,0,0.4)" }}>
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
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>
                        {initials(member.name)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium truncate" style={{ color: "rgba(0,0,0,0.8)" }}>{member.name}</p>
                        <p className="text-[11px] truncate" style={{ color: "rgba(0,0,0,0.35)" }}>{member.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium" style={roleBadge(member.role)}>
                      {member.role === "admin" && <Shield className="h-3 w-3" />}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{member.department}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium" style={statusBadge(member.status)}>
                      {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.6)" }}>{member.coursesEnrolled}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.6)" }}>{member.masteryAchieved}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{member.lastActive}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="relative">
                      <button
                        onClick={() => setActionMenuId(actionMenuId === member.id ? null : member.id)}
                        className="h-7 w-7 rounded-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: "rgba(0,0,0,0.3)" }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                      {actionMenuId === member.id && (
                        <div className="absolute right-0 top-8 z-30 w-44 rounded-lg py-1 shadow-lg" style={{ backgroundColor: "#fff", border: "1px solid rgba(0,0,0,0.08)" }}>
                          <button onClick={() => openEdit(member)} className="w-full text-left px-3 py-2 text-[13px] hover:bg-[rgba(0,0,0,0.03)] transition-colors" style={{ color: "rgba(0,0,0,0.7)" }}>
                            Edit member
                          </button>
                          {member.status === "invited" && (
                            <button onClick={() => handleResendInvite(member)} className="w-full text-left px-3 py-2 text-[13px] hover:bg-[rgba(0,0,0,0.03)] transition-colors" style={{ color: "rgba(0,0,0,0.7)" }}>
                              Resend invite
                            </button>
                          )}
                          <button onClick={() => handleRemove(member.id)} className="w-full text-left px-3 py-2 text-[13px] hover:bg-[rgba(0,0,0,0.03)] transition-colors" style={{ color: "#DC2626" }}>
                            Remove member
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Summary bar */}
      <div className="flex items-center gap-4 mt-4 text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>
        <span>{membersList.length} total members</span>
        <span>·</span>
        <span>{membersList.filter(m => m.role === "admin").length} admins</span>
        <span>·</span>
        <span>{membersList.filter(m => m.role === "manager").length} managers</span>
        <span>·</span>
        <span>{membersList.filter(m => m.status === "invited").length} pending invites</span>
      </div>

      {/* Invite Drawer */}
      {inviteOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeInvite} />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <h2 className="text-base font-semibold" style={{ color: "rgba(0,0,0,0.85)" }}>Invite Member</h2>
              <button onClick={closeInvite} className="h-8 w-8 rounded-md flex items-center justify-center" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Full Name</label>
                <input value={invName} onChange={e => setInvName(e.target.value)} placeholder="Jane Smith" className={inputStyle} style={inputBorder} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Email Address</label>
                <input value={invEmail} onChange={e => setInvEmail(e.target.value)} placeholder="jane@meridian.edu" type="email" className={inputStyle} style={inputBorder} />
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Role</label>
                <select value={invRole} onChange={e => setInvRole(e.target.value as MemberRole)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="learner">Learner</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Department</label>
                <select value={invDept} onChange={e => setInvDept(e.target.value)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="">Select department</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button onClick={closeInvite} className="flex-1 h-10 text-[13px] font-medium transition-colors" style={secondaryBtn}>Cancel</button>
              <button onClick={handleInvite} disabled={!invName.trim() || !invEmail.trim()} className="flex-1 h-10 text-[13px] font-medium transition-colors hover:opacity-90 disabled:opacity-40" style={primaryBtn}>
                <span className="flex items-center justify-center gap-2"><Mail className="h-4 w-4" /> Send Invite</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Edit Member Drawer */}
      {editingMember && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setEditingMember(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <h2 className="text-base font-semibold" style={{ color: "rgba(0,0,0,0.85)" }}>Edit Member</h2>
              <button onClick={() => setEditingMember(null)} className="h-8 w-8 rounded-md flex items-center justify-center" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              {/* Identity (read-only) */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div className="h-10 w-10 rounded-full flex items-center justify-center text-[12px] font-semibold" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>
                  {initials(editingMember.name)}
                </div>
                <div>
                  <p className="text-[14px] font-medium" style={{ color: "rgba(0,0,0,0.8)" }}>{editingMember.name}</p>
                  <p className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)" }}>{editingMember.email}</p>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Role</label>
                <select value={editRole} onChange={e => setEditRole(e.target.value as MemberRole)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="learner">Learner</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Department</label>
                <select value={editDept} onChange={e => setEditDept(e.target.value)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="">Unassigned</option>
                  {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Status</label>
                <select value={editStatus} onChange={e => setEditStatus(e.target.value as MemberStatus)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                  <option value="active">Active</option>
                  <option value="invited">Invited</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="pt-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-2" style={{ color: "rgba(0,0,0,0.4)" }}>Details</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>Joined</p>
                    <p className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.7)" }}>{editingMember.dateJoined}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>Last Active</p>
                    <p className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.7)" }}>{editingMember.lastActive}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>Courses</p>
                    <p className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.7)" }}>{editingMember.coursesEnrolled}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: "rgba(0,0,0,0.02)" }}>
                    <p className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>Mastery</p>
                    <p className="text-[13px] mt-0.5" style={{ color: "rgba(0,0,0,0.7)" }}>{editingMember.masteryAchieved}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button onClick={() => setEditingMember(null)} className="flex-1 h-10 text-[13px] font-medium transition-colors" style={secondaryBtn}>Cancel</button>
              <button onClick={handleSaveEdit} className="flex-1 h-10 text-[13px] font-medium transition-colors hover:opacity-90" style={primaryBtn}>Save Changes</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
