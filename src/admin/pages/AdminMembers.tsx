import { useState, useRef, KeyboardEvent } from "react";
import {
  Search, X, Mail, MoreHorizontal, Shield, Upload,
  UserPlus, Pencil, UserCog, UserMinus, Play, FileText,
  BookOpen, Award, ChevronRight,
} from "lucide-react";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type MemberRole = "learner" | "manager" | "admin";
type MemberStatus = "active" | "invited" | "inactive";

interface Member {
  id: string; name: string; email: string; role: MemberRole; department: string;
  status: MemberStatus; dateJoined: string; coursesEnrolled: number; lastActive: string;
  masteryAchieved: number; courseProgress?: { name: string; progress: number; mastery: boolean }[];
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

const AMBER = "#C9963A";
type TabFilter = "all" | "learners" | "admins" | "invited" | "inactive";
let nextId = 100;

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

const roleBadgeCls = (r: MemberRole) => {
  switch (r) {
    case "admin": return "bg-accent/12 text-accent border border-accent/25";
    case "manager": return "bg-muted text-muted-foreground border border-border";
    case "learner": return "text-muted-foreground";
  }
};

const statusBadgeCls = (s: MemberStatus) => {
  switch (s) {
    case "active": return "bg-accent/10 text-accent border border-accent/20";
    case "invited": return "bg-muted text-muted-foreground border border-border";
    case "inactive": return "bg-muted/50 text-muted-foreground/60 border border-border/50";
  }
};

// ─── Component ──────────────────────────────────────────────

export default function AdminMembersPage() {
  const [membersList, setMembersList] = useState<Member[]>(seedMembers);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [bulkOpen, setBulkOpen] = useState(false);
  const [detailMember, setDetailMember] = useState<Member | null>(null);
  const [deactivatingId, setDeactivatingId] = useState<string | null>(null);
  const [roleChangeId, setRoleChangeId] = useState<string | null>(null);
  const [emailChips, setEmailChips] = useState<string[]>([]);
  const [emailInput, setEmailInput] = useState("");
  const [invRole, setInvRole] = useState<MemberRole>("learner");
  const [invDept, setInvDept] = useState("");
  const [invMessage, setInvMessage] = useState("");
  const [bulkFile, setBulkFile] = useState<string | null>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const tabs: { value: TabFilter; label: string; count: number }[] = [
    { value: "all", label: "All", count: membersList.length },
    { value: "learners", label: "Learners", count: membersList.filter(m => m.role === "learner").length },
    { value: "admins", label: "Admins", count: membersList.filter(m => m.role === "admin" || m.role === "manager").length },
    { value: "invited", label: "Invited", count: membersList.filter(m => m.status === "invited").length },
    { value: "inactive", label: "Inactive", count: membersList.filter(m => m.status === "inactive").length },
  ];

  const filtered = membersList
    .filter(m => { if (tab === "learners") return m.role === "learner"; if (tab === "admins") return m.role === "admin" || m.role === "manager"; if (tab === "invited") return m.status === "invited"; if (tab === "inactive") return m.status === "inactive"; return true; })
    .filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase()));

  const addEmailChip = (email: string) => { const trimmed = email.trim().toLowerCase(); if (trimmed && !emailChips.includes(trimmed)) setEmailChips(prev => [...prev, trimmed]); setEmailInput(""); };
  const handleEmailKeyDown = (e: KeyboardEvent<HTMLInputElement>) => { if ((e.key === "Enter" || e.key === ",") && emailInput.trim()) { e.preventDefault(); addEmailChip(emailInput); } if (e.key === "Backspace" && !emailInput && emailChips.length > 0) setEmailChips(prev => prev.slice(0, -1)); };
  const closeInvite = () => { setInviteOpen(false); setEmailChips([]); setEmailInput(""); setInvRole("learner"); setInvDept(""); setInvMessage(""); };
  const handleSendInvites = () => { if (emailChips.length === 0) return; const newMembers: Member[] = emailChips.map((email, i) => ({ id: `m-${++nextId}`, name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, l => l.toUpperCase()), email, role: invRole, department: invDept || "No department", status: "invited" as MemberStatus, dateJoined: new Date().toISOString().split("T")[0], coursesEnrolled: 0, lastActive: "Never", masteryAchieved: 0, })); setMembersList(prev => [...newMembers, ...prev]); toast.success(`${emailChips.length} invite${emailChips.length > 1 ? "s" : ""} sent successfully`); closeInvite(); };
  const closeBulk = () => { setBulkOpen(false); setBulkFile(null); };
  const handleBulkImport = () => { toast.success("12 members imported"); closeBulk(); };
  const handleDeactivate = (id: string) => { setMembersList(prev => prev.map(m => m.id === id ? { ...m, status: "inactive" as MemberStatus } : m)); toast.success("Member deactivated"); setDeactivatingId(null); };
  const handleRoleChange = (id: string, newRole: MemberRole) => { setMembersList(prev => prev.map(m => m.id === id ? { ...m, role: newRole } : m)); toast.success("Role updated"); setRoleChangeId(null); };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Members</h1>
          <p className="text-[14px] mt-0.5 text-muted-foreground font-sans">Manage learners and admins in your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setBulkOpen(true)} className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium border border-border rounded-lg text-foreground/65">
            <Upload className="h-4 w-4" /> Bulk Import
          </button>
          <button onClick={() => setInviteOpen(true)} className="btn-apple flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">
            <UserPlus className="h-4 w-4" /> Invite Members
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-0">
          {tabs.map(t => (
            <button key={t.value} onClick={() => setTab(t.value)}
              className={cn("segment-pill px-3 py-2 text-[13px] font-medium transition-colors relative", tab === t.value ? "text-accent border-b-2 border-accent" : "text-muted-foreground border-b-2 border-transparent")}
            >
              {t.label} <span className="ml-1 text-[11px] text-muted-foreground/50">{t.count}</span>
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email..." className="w-full h-9 pl-9 pr-3 rounded-lg text-[14px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200" />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 card-interactive">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-accent/10">
            <UserPlus className="h-5 w-5 text-accent" />
          </div>
          <p className="text-sm font-medium mb-1 text-foreground/60">No members found</p>
          <p className="text-xs mb-4 text-muted-foreground">Try adjusting your filters or search</p>
          <button onClick={() => setInviteOpen(true)} className="btn-apple px-4 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">Invite Members</button>
        </div>
      ) : (
        <div className="overflow-hidden card-interactive">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["Name", "Email", "Role", "Department", "Status", "Joined", ""].map((h, i) => (
                  <th key={i} className={cn("px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", i === 1 && "hidden md:table-cell", i === 3 && "hidden lg:table-cell", i === 5 && "hidden xl:table-cell")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="transition-colors duration-200 group relative border-b border-border/50 hover:bg-accent/5">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 bg-accent/15 text-accent">{initials(member.name)}</div>
                      <span className="text-[14px] font-medium text-foreground font-sans">{member.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-[13px] text-muted-foreground">{member.email}</span></td>
                  <td className="px-5 py-3.5 relative">
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium", roleBadgeCls(member.role))}>
                      {member.role === "admin" && <Shield className="h-3 w-3" />}
                      {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                    </span>
                    {roleChangeId === member.id && (
                      <div className="absolute left-5 top-10 z-30 w-36 rounded-xl py-1 shadow-elevated animate-scale-in bg-popover border border-border">
                        {(["learner", "manager", "admin"] as MemberRole[]).map(r => (
                          <button key={r} onClick={() => handleRoleChange(member.id, r)} className={cn("w-full text-left px-3 py-2 text-[13px] hover:bg-muted transition-colors duration-150 capitalize", r === member.role ? "text-accent font-semibold" : "text-foreground/70")}>{r}</button>
                        ))}
                        <button onClick={() => setRoleChangeId(null)} className="w-full text-left px-3 py-2 text-[12px] transition-colors duration-150 text-muted-foreground">Cancel</button>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-[13px] text-muted-foreground">{member.department}</span></td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium", statusBadgeCls(member.status))}>{member.status.charAt(0).toUpperCase() + member.status.slice(1)}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell"><span className="text-[12px] text-muted-foreground/60">{member.dateJoined}</span></td>
                  <td className="px-5 py-3.5">
                    {deactivatingId === member.id ? (
                      <div className="flex items-center gap-2 text-[12px] animate-fade-in-fast">
                        <span className="text-muted-foreground">Deactivate this member?</span>
                        <button onClick={() => handleDeactivate(member.id)} className="font-medium text-destructive">Confirm</button>
                        <button onClick={() => setDeactivatingId(null)} className="text-muted-foreground">Cancel</button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <button onClick={() => setDetailMember(member)} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center" title="View details"><Pencil className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        <button onClick={() => setRoleChangeId(roleChangeId === member.id ? null : member.id)} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center" title="Change role"><UserCog className="h-3.5 w-3.5 text-muted-foreground" /></button>
                        {member.status !== "inactive" && (
                          <button onClick={() => setDeactivatingId(member.id)} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center" title="Deactivate"><UserMinus className="h-3.5 w-3.5 text-muted-foreground" /></button>
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

      <div className="flex items-center gap-4 mt-4 text-[12px] text-muted-foreground/60">
        <span>{membersList.length} total members</span><span>·</span>
        <span>{membersList.filter(m => m.role === "admin").length} admins</span><span>·</span>
        <span>{membersList.filter(m => m.role === "manager").length} managers</span><span>·</span>
        <span>{membersList.filter(m => m.status === "invited").length} pending invites</span>
      </div>

      {/* Invite Drawer */}
      {inviteOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 animate-fade-in-gentle" onClick={closeInvite} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div>
                <h2 className="text-[18px] font-semibold text-foreground font-sans">Invite Members</h2>
                <p className="text-[13px] mt-0.5 text-muted-foreground">Invites will be sent via email</p>
              </div>
              <button onClick={closeInvite} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Email addresses</label>
                <div className="min-h-[44px] flex flex-wrap gap-1.5 p-2 rounded-lg cursor-text border border-input bg-background transition-shadow duration-200 focus-within:ring-2 focus-within:ring-accent/30" onClick={() => emailRef.current?.focus()}>
                  {emailChips.map((chip, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[12px] font-medium bg-accent/12 text-accent animate-scale-in">
                      {chip}<button onClick={() => setEmailChips(prev => prev.filter((_, idx) => idx !== i))} className="hover:opacity-70"><X className="h-3 w-3" /></button>
                    </span>
                  ))}
                  <input ref={emailRef} value={emailInput} onChange={e => setEmailInput(e.target.value)} onKeyDown={handleEmailKeyDown} onBlur={() => emailInput.trim() && addEmailChip(emailInput)} placeholder={emailChips.length === 0 ? "Enter email and press Enter..." : ""} className="flex-1 min-w-[140px] h-7 text-[14px] outline-none bg-transparent font-sans" />
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Assign role</label>
                <select value={invRole} onChange={e => setInvRole(e.target.value as MemberRole)} className="w-full h-9 px-3 rounded-lg text-[14px] bg-background border border-input focus:outline-none transition-shadow duration-200">
                  <option value="learner">Learner</option><option value="manager">Manager</option><option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Assign department</label>
                <select value={invDept} onChange={e => setInvDept(e.target.value)} className="w-full h-9 px-3 rounded-lg text-[14px] bg-background border border-input focus:outline-none transition-shadow duration-200">
                  <option value="">No department</option>{departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Welcome message (optional)</label>
                <textarea value={invMessage} onChange={e => setInvMessage(e.target.value)} placeholder="Add a personal message to the invite email..." rows={3} className="w-full px-3 py-2 rounded-lg text-[14px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none font-sans transition-shadow duration-200" />
              </div>
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-border">
              <button onClick={closeInvite} className="btn-ghost flex-1 h-10 text-[13px] font-medium border border-border rounded-lg text-foreground/65 hover:bg-muted">Cancel</button>
              <button onClick={handleSendInvites} disabled={emailChips.length === 0} className="btn-apple flex-1 h-10 text-[13px] font-medium disabled:opacity-40 bg-primary text-primary-foreground rounded-lg">Send Invites</button>
            </div>
          </div>
        </>
      )}

      {/* Bulk Import Drawer */}
      {bulkOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 animate-fade-in-gentle" onClick={closeBulk} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h2 className="text-[18px] font-semibold text-foreground font-sans">Bulk Import Members</h2>
              <button onClick={closeBulk} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
              <div className="rounded-xl p-8 text-center cursor-pointer transition-all duration-250 border-2 border-dashed border-accent/30 bg-accent/5 hover:border-accent/50 active:scale-[0.99]" onClick={() => setBulkFile("members_import.csv")}>
                <Upload className="h-6 w-6 mx-auto mb-3 text-accent" />
                <p className="text-[14px] font-medium text-foreground/65">Drop a CSV file here or click to browse</p>
                <p className="text-[12px] mt-1 text-muted-foreground">Required columns: name, email, role, department</p>
              </div>
              {bulkFile && (
                <div className="animate-fade-in-fast">
                  <p className="text-[12px] font-medium mb-2 text-foreground/60">Preview — {bulkFile}</p>
                  <div className="overflow-hidden rounded-lg border border-border">
                    <table className="w-full text-[12px]">
                      <thead>
                        <tr className="bg-muted/50 border-b border-border">
                          {["Name", "Email", "Role", "Department"].map(h => (<th key={h} className="px-3 py-2 text-left font-semibold uppercase tracking-wider text-[10px] text-muted-foreground">{h}</th>))}
                        </tr>
                      </thead>
                      <tbody>
                        {[{ n: "Alex Thompson", e: "alex@meridian.edu", r: "Learner", d: "Engineering" }, { n: "Maria Santos", e: "maria@meridian.edu", r: "Learner", d: "Product" }, { n: "Chris Wright", e: "chris@meridian.edu", r: "Manager", d: "Operations" }].map((row, i) => (
                          <tr key={i} className="border-b border-border/50">
                            <td className="px-3 py-2 text-foreground/70">{row.n}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.e}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.r}</td>
                            <td className="px-3 py-2 text-muted-foreground">{row.d}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-[11px] mt-2 text-muted-foreground">Showing 3 of 12 rows</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 flex gap-3 border-t border-border">
              <button onClick={closeBulk} className="btn-ghost flex-1 h-10 text-[13px] font-medium border border-border rounded-lg text-foreground/65 hover:bg-muted">Cancel</button>
              <button onClick={handleBulkImport} disabled={!bulkFile} className="btn-apple flex-1 h-10 text-[13px] font-medium disabled:opacity-40 bg-primary text-primary-foreground rounded-lg">Import 12 members</button>
            </div>
          </div>
        </>
      )}

      {/* Member Detail Side Panel */}
      {detailMember && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 animate-fade-in-gentle" onClick={() => setDetailMember(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[420px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full flex items-center justify-center text-[14px] font-semibold bg-accent/15 text-accent">{initials(detailMember.name)}</div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-[16px] font-semibold text-foreground">{detailMember.name}</h2>
                    <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium", roleBadgeCls(detailMember.role))}>
                      {detailMember.role === "admin" && <Shield className="h-2.5 w-2.5" />}{detailMember.role.charAt(0).toUpperCase() + detailMember.role.slice(1)}
                    </span>
                  </div>
                  <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium mt-1", statusBadgeCls(detailMember.status))}>{detailMember.status.charAt(0).toUpperCase() + detailMember.status.slice(1)}</span>
                </div>
              </div>
              <button onClick={() => setDetailMember(null)} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center shrink-0 text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 text-muted-foreground">Details</p>
                <div className="space-y-2.5">
                  {[{ label: "EMAIL", value: detailMember.email }, { label: "DEPARTMENT", value: detailMember.department }, { label: "JOINED", value: detailMember.dateJoined }, { label: "LAST ACTIVE", value: detailMember.lastActive }].map((row, i) => (
                    <div key={i} className="setting-row flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60">{row.label}</span>
                      <span className="text-[14px] text-foreground/75 font-sans">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              {detailMember.courseProgress && detailMember.courseProgress.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 text-muted-foreground">Enrolled Courses</p>
                  <div className="space-y-3 stagger-children">
                    {detailMember.courseProgress.slice(0, 4).map((cp, i) => (
                      <div key={i} className="p-3 rounded-lg bg-muted/30 border border-border/50 transition-colors duration-200 hover:bg-muted/50">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[13px] font-medium text-foreground/75">{cp.name}</span>
                          <span className="text-[12px] font-medium text-accent">{cp.progress}%</span>
                        </div>
                        <div className="h-1.5 rounded-full overflow-hidden bg-accent/12">
                          <div className="h-full rounded-full transition-all duration-600 ease-smooth" style={{ width: `${cp.progress}%`, backgroundColor: AMBER }} />
                        </div>
                      </div>
                    ))}
                    {detailMember.courseProgress.length > 4 && (<button className="text-[13px] font-medium text-accent">View all →</button>)}
                  </div>
                </div>
              )}
              {detailMember.courseProgress && detailMember.courseProgress.length > 0 && (
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 text-muted-foreground">Mastery</p>
                  <div className="space-y-2">
                    {detailMember.courseProgress.map((cp, i) => (
                      <div key={i} className="setting-row flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg">
                        <span className="text-[13px] text-foreground/65">{cp.name}</span>
                        <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium", cp.mastery ? "bg-accent/12 text-accent border border-accent/25" : "bg-muted/50 text-muted-foreground/60 border border-border/50")}>
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
