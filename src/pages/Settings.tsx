import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { useWorkspace } from "@/context/WorkspaceContext";
import { NotionLogo, ZoteroLogo, ReadwiseLogo, ObsidianLogo, GoogleDriveLogo, GoogleCalendarLogo } from "@/components/IntegrationLogos";
import {
  User, Building2, LogOut, Monitor, Smartphone, MapPin, MoreHorizontal,
  Moon, Sun, Palette, Eye, Type, Brain, Volume2, BookOpen, Keyboard,
  Shield, Download, RotateCcw, Plug, Check, Mail, GraduationCap, Target, Pen,
} from "lucide-react";

type SettingsTab = "profile" | "account" | "connectors" | "privacy" | "appearance" | "ai-learning";

const tabConfig: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "profile", label: "Profile", icon: User },
  { id: "account", label: "Account", icon: Building2 },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "ai-learning", label: "AI & Learning", icon: Brain },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Settings</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Manage your account, preferences, and integrations.</p>
      </div>

      <div className="flex gap-8 lg:gap-12 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        {/* Left nav */}
        <nav className="w-44 shrink-0 sticky top-8 self-start">
          <ul className="space-y-0.5">
            {tabConfig.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-sans transition-all duration-200 active:scale-[0.97] ${
                    activeTab === tab.id
                      ? "bg-primary/8 text-foreground font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <tab.icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                  {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && <ProfilePanel />}
          {activeTab === "account" && <AccountPanel />}
          {activeTab === "connectors" && <ConnectorsPanel />}
          {activeTab === "privacy" && <PrivacyPanel />}
          {activeTab === "appearance" && <AppearancePanel />}
          {activeTab === "ai-learning" && <AILearningPanel />}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

/* ─── Profile ──────────────────────────────────────────── */

function ProfilePanel() {
  const { userProfile, updateUserProfile, notebookEntries, reflections } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
    toast.success("Profile updated");
  };
  const handleCancel = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      <PanelHeader title="Profile" description="Your learning identity and public information." />

      {/* Avatar + name */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-xl font-serif font-medium text-primary/70">
              {userProfile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[15px] font-sans font-medium text-foreground">{userProfile.name}</p>
            <p className="text-[12px] font-sans text-muted-foreground/60">{userProfile.email}</p>
          </div>
        </div>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]">
            <Pen className="h-3 w-3" strokeWidth={1.5} />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <ProfileField label="Name" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
            <ProfileField label="Email" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} />
            <ProfileField label="Institution" value={editForm.institution} onChange={(v) => setEditForm({ ...editForm, institution: v })} />
            <ProfileField label="Bio" value={editForm.bio} onChange={(v) => setEditForm({ ...editForm, bio: v })} multiline />
            <ProfileField label="Learning goal" value={editForm.learningGoal} onChange={(v) => setEditForm({ ...editForm, learningGoal: v })} multiline />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button onClick={handleSave} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]">Save changes</button>
            <button onClick={handleCancel} className="px-4 py-2 rounded-lg border border-border text-[12px] font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]">Cancel</button>
          </div>
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card divide-y divide-border">
          <ProfileDetail icon={Mail} label="Email" value={userProfile.email} />
          <ProfileDetail icon={GraduationCap} label="Institution" value={userProfile.institution} />
          <ProfileDetail icon={MapPin} label="Timezone" value={userProfile.timezone.replace("_", " ").replace("America/", "")} />
          <div className="px-5 py-4">
            <p className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest mb-1.5">Bio</p>
            <p className="text-[13px] font-sans text-foreground/85 leading-relaxed">{userProfile.bio}</p>
          </div>
          <div className="px-5 py-4">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Target className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
              <p className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest">Learning goal</p>
            </div>
            <p className="text-[13px] font-sans text-foreground/85 leading-relaxed">{userProfile.learningGoal}</p>
          </div>
        </div>
      )}

      {/* Learning summary */}
      <div>
        <SectionLabel>Learning summary</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={BookOpen} label="Active courses" value="3" />
          <StatCard icon={Monitor} label="Total study time" value="67h 50m" />
          <StatCard icon={BookOpen} label="Notes captured" value={String(notebookEntries.length)} />
          <StatCard icon={Shield} label="Reflections" value={String(reflections.length)} />
        </div>
      </div>
    </div>
  );
}

/* ─── Account ──────────────────────────────────────────── */

function AccountPanel() {
  const handleLogout = () => toast.success("Logged out", { description: "See you next time." });

  const sessions = [
    { device: "Chrome · macOS", location: "San Francisco, US", created: "Mar 18, 2026", updated: "2 min ago" },
    { device: "Safari · iPhone", location: "San Francisco, US", created: "Mar 15, 2026", updated: "1 day ago" },
    { device: "Firefox · Windows", location: "New York, US", created: "Mar 10, 2026", updated: "5 days ago" },
  ];

  return (
    <div className="space-y-8">
      <PanelHeader title="Account" description="Organization details and session management." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <SettingRow label="Organization ID" description="Unique identifier for your workspace" action={<span className="text-[12px] font-mono text-muted-foreground select-all">org_nxs_8f42b1c3</span>} />
        <SettingRow label="Organization name" description="Managed by your school, company, or institution" action={<span className="text-[13px] font-sans text-foreground">Personal</span>} />
      </div>

      {/* Active sessions */}
      <div>
        <SectionLabel>Active sessions</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/60 font-medium">Device</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/60 font-medium">Location</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/60 font-medium hidden sm:table-cell">Created</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/60 font-medium">Last active</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s, i) => (
                <tr key={i} className="group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {s.device.includes("iPhone") ? <Smartphone className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} /> : <Monitor className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />}
                      <span className="text-[13px] font-sans text-foreground">{s.device}</span>
                      {i === 0 && <span className="text-[10px] font-sans text-accent font-medium ml-1">Current</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.location}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground hidden sm:table-cell">{s.created}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.updated}</td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => i !== 0 && toast.success("Session terminated")}
                      className={`h-7 w-7 rounded-md flex items-center justify-center transition-colors duration-200 ${i === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-muted/50 text-muted-foreground hover:text-foreground active:scale-[0.95]"}`}
                      disabled={i === 0}
                    >
                      <MoreHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-destructive/30 text-[13px] font-sans text-destructive hover:bg-destructive/5 transition-all duration-200 active:scale-[0.97]"
      >
        <LogOut className="h-4 w-4" strokeWidth={1.5} />
        Log out
      </button>
    </div>
  );
}

/* ─── Connectors ───────────────────────────────────────── */

function ConnectorsPanel() {
  return (
    <div className="space-y-8">
      <PanelHeader title="Connectors" description="Connect external apps and services to enhance your workflow." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <IntegrationRow name="Notion" description="Sync notes and reflections to Notion pages" svgLogo={<NotionLogo className="h-5 w-5" />} />
        <IntegrationRow name="Google Drive" description="Import sources and export notes to Drive" svgLogo={<GoogleDriveLogo className="h-5 w-5" />} />
        <IntegrationRow name="Google Calendar" description="Connect Google Calendar for study scheduling" svgLogo={<GoogleCalendarLogo className="h-5 w-5" />} />
        <IntegrationRow name="Zotero" description="Import academic references and citation data" svgLogo={<ZoteroLogo className="h-5 w-5" />} />
        <IntegrationRow name="Readwise" description="Sync highlights and reading notes" svgLogo={<ReadwiseLogo className="h-5 w-5" />} />
        <IntegrationRow name="Obsidian" description="Export notebook entries as Markdown vault files" svgLogo={<ObsidianLogo className="h-5 w-5" />} />
      </div>
    </div>
  );
}

/* ─── Privacy ──────────────────────────────────────────── */

function PrivacyPanel() {
  const [analyticsOptOut, setAnalyticsOptOut] = useState(true);
  const [localOnly, setLocalOnly] = useState(true);
  const [notifications, setNotifications] = useState(false);

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Local data cleared", { description: "Your preferences have been reset." });
  };
  const handleExport = () => toast.success("Export started", { description: "Your notes and reflections are being prepared." });

  return (
    <div className="space-y-8">
      <PanelHeader title="Privacy" description="Control your data, storage, and export preferences." />

      <div>
        <SectionLabel>Security</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Local-only storage" description="All data stays on your device — nothing is sent externally" action={<Toggle checked={localOnly} onChange={setLocalOnly} />} />
          <SettingRow label="Analytics opt-out" description="Disable anonymous usage analytics" action={<Toggle checked={analyticsOptOut} onChange={setAnalyticsOptOut} />} />
          <SettingRow label="Notifications" description="Receive study reminders and progress nudges" action={<Toggle checked={notifications} onChange={setNotifications} />} />
        </div>
      </div>

      <div>
        <SectionLabel>Data & Export</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Export all data"
            description="Download notes, reflections, and progress as JSON"
            action={
              <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]">
                <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                Export
              </button>
            }
          />
          <SettingRow
            label="Clear local data"
            description="Reset all preferences and cached state"
            action={
              <button onClick={handleClearData} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-[12px] font-sans text-destructive hover:bg-destructive/5 transition-all duration-200 active:scale-[0.97]">
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                Reset
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Appearance ───────────────────────────────────────── */

function AppearancePanel() {
  const { theme, toggleTheme } = useTheme();
  const { appSettings, updateAppSettings } = useWorkspace();

  return (
    <div className="space-y-8">
      <PanelHeader title="Appearance" description="Customize how Nexus² looks and feels." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <SettingRow
          label="Theme"
          description="Switch between light and dark mode"
          action={
            <button onClick={toggleTheme} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]">
              {theme === "light" ? <Moon className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />}
              {theme === "light" ? "Dark" : "Light"}
            </button>
          }
        />
        <SettingRow label="Compact mode" description="Reduce spacing and panel padding" action={<Toggle checked={appSettings.compactMode} onChange={(v) => updateAppSettings({ compactMode: v })} />} />
        <SettingRow
          label="Font size"
          description="Adjust reading text size across the workspace"
          action={
            <SegmentedControl
              value={appSettings.fontSize}
              options={[{ value: "small", label: "S" }, { value: "medium", label: "M" }, { value: "large", label: "L" }]}
              onChange={(v) => updateAppSettings({ fontSize: v as "small" | "medium" | "large" })}
            />
          }
        />
      </div>
    </div>
  );
}

/* ─── AI & Learning ────────────────────────────────────── */

function AILearningPanel() {
  const [nexiTone, setNexiTone] = useState<"concise" | "detailed" | "socratic">("detailed");
  const [citationsVisible, setCitationsVisible] = useState(true);
  const [followUpChips, setFollowUpChips] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoExpandSources, setAutoExpandSources] = useState(true);
  const [autoSave, setAutoSave] = useState(true);

  return (
    <div className="space-y-8">
      <PanelHeader title="AI & Learning" description="Configure Nexi behavior, voice input, and reading preferences." />

      <div>
        <SectionLabel>Nexi — AI Companion</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Response style"
            description="How Nexi communicates explanations"
            action={
              <SegmentedControl
                value={nexiTone}
                options={[{ value: "concise", label: "Concise" }, { value: "detailed", label: "Detailed" }, { value: "socratic", label: "Socratic" }]}
                onChange={(v) => setNexiTone(v as "concise" | "detailed" | "socratic")}
              />
            }
          />
          <SettingRow label="Show citations" description="Display source references in Nexi responses" action={<Toggle checked={citationsVisible} onChange={setCitationsVisible} />} />
          <SettingRow label="Follow-up suggestions" description="Show suggested actions after each Nexi response" action={<Toggle checked={followUpChips} onChange={setFollowUpChips} />} />
        </div>
      </div>

      <div>
        <SectionLabel>Voice & Input</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Voice input" description="Enable microphone for voice-to-text in Nexi" action={<Toggle checked={voiceEnabled} onChange={setVoiceEnabled} />} />
        </div>
      </div>

      <div>
        <SectionLabel>Reading & Sources</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Auto-expand sources" description="Automatically open viewer when selecting a source" action={<Toggle checked={autoExpandSources} onChange={setAutoExpandSources} />} />
          <SettingRow label="Auto-save notes" description="Automatically save Nexi responses when bookmarked" action={<Toggle checked={autoSave} onChange={setAutoSave} />} />
        </div>
      </div>
    </div>
  );
}

/* ─── Shared UI primitives ─────────────────────────────── */

function PanelHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="font-serif text-2xl text-foreground font-medium leading-snug">{title}</h2>
      <p className="text-[13px] font-sans text-muted-foreground/70 mt-1">{description}</p>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-3">{children}</p>;
}

function SettingRow({ label, description, action }: { label: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="min-w-0 flex-1 mr-4">
        <p className="text-[13px] font-sans font-medium text-foreground">{label}</p>
        <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5">{description}</p>
      </div>
      <div className="shrink-0">{action}</div>
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`toggle-apple h-[26px] w-[46px] ${checked ? "bg-accent" : "bg-muted"}`}
    >
      <span className={`toggle-thumb top-[3px] left-[3px] h-5 w-5 ${checked ? "translate-x-5" : "translate-x-0"}`} />
    </button>
  );
}

function SegmentedControl({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5 gap-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`segment-pill px-2.5 py-1 rounded-md text-[11px] font-sans ${
            value === opt.value ? "bg-card text-foreground shadow-soft font-medium" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ProfileField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="px-5 py-4">
      <label className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-[13px] font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 resize-none leading-relaxed" />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-muted/30 rounded-lg px-3 py-2 text-[13px] font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30" />
      )}
    </div>
  );
}

function ProfileDetail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
        <span className="text-[12px] font-sans text-muted-foreground">{label}</span>
      </div>
      <span className="text-[13px] font-sans text-foreground">{value}</span>
    </div>
  );
}

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
        <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-serif text-foreground font-medium tabular-nums">{value}</span>
    </div>
  );
}

function IntegrationRow({ name, description, svgLogo }: { name: string; description: string; svgLogo: React.ReactNode }) {
  const [connected, setConnected] = useState(false);

  const handleToggle = () => {
    setConnected(!connected);
    if (!connected) {
      toast.success(`${name} connected`, { description: "Integration is now active." });
    } else {
      toast.success(`${name} disconnected`);
    }
  };

  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3 min-w-0 flex-1 mr-4">
        <div className="h-8 w-8 rounded-lg border border-border/60 flex items-center justify-center shrink-0 overflow-hidden bg-muted/50">
          {svgLogo}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-sans font-medium text-foreground">{name}</p>
          <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5 truncate">{description}</p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-sans shrink-0 transition-all duration-200 active:scale-[0.97] ${
          connected
            ? "border border-accent/30 text-accent bg-accent/5 hover:bg-accent/10"
            : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
        }`}
      >
        {connected ? (
          <>
            <Check className="h-3 w-3" strokeWidth={2} />
            Connected
          </>
        ) : (
          "Connect"
        )}
      </button>
    </div>
  );
}

export default Settings;
