import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "@/components/ThemeProvider";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { FontFamily } from "@/context/WorkspaceContext";
import { NotionLogo, ZoteroLogo, ReadwiseLogo, ObsidianLogo, GoogleDriveLogo, GoogleCalendarLogo } from "@/components/IntegrationLogos";
import {
  Building2, LogOut, Monitor, Smartphone, MoreHorizontal,
  Moon, Sun, Palette, Eye, Brain, Volume2, BookOpen,
  Shield, Download, RotateCcw, Plug, Check, Copy,
  Settings2, Sparkles, Globe, Code2, MessageSquare, MonitorSmartphone,
} from "lucide-react";

type SettingsTab = "general" | "nexi" | "account" | "privacy" | "connectors";

const tabConfig: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "nexi", label: "Nexi", icon: Sparkles },
  { id: "account", label: "Account", icon: Building2 },
  { id: "privacy", label: "Privacy", icon: Shield },
  { id: "connectors", label: "Connectors", icon: Plug },
];

const Settings = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>("general");

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Settings</h1>
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
          {activeTab === "general" && <GeneralPanel />}
          {activeTab === "nexi" && <NexiPanel />}
          {activeTab === "account" && <AccountPanel />}
          {activeTab === "privacy" && <PrivacyPanel />}
          {activeTab === "connectors" && <ConnectorsPanel />}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
};

/* ─── Theme preview mini-illustrations ─────────────────── */

function ThemeMiniPreview({ mode }: { mode: "light" | "auto" | "dark" }) {
  const lightSide = (
    <div className="w-full h-full bg-[hsl(42_24%_97%)] rounded-[5px] p-1.5 flex flex-col gap-1">
      <div className="h-1.5 w-8 rounded-full bg-[hsl(222_28%_14%/0.15)]" />
      <div className="h-1 w-6 rounded-full bg-[hsl(222_28%_14%/0.08)]" />
      <div className="flex-1 rounded-[3px] bg-[hsl(40_22%_94%)] mt-0.5" />
    </div>
  );
  const darkSide = (
    <div className="w-full h-full bg-[hsl(228_18%_9%)] rounded-[5px] p-1.5 flex flex-col gap-1">
      <div className="h-1.5 w-8 rounded-full bg-[hsl(38_12%_88%/0.2)]" />
      <div className="h-1 w-6 rounded-full bg-[hsl(38_12%_88%/0.1)]" />
      <div className="flex-1 rounded-[3px] bg-[hsl(228_16%_13%)] mt-0.5" />
    </div>
  );

  if (mode === "light") return <div className="w-full h-full">{lightSide}</div>;
  if (mode === "dark") return <div className="w-full h-full">{darkSide}</div>;

  // auto — split
  return (
    <div className="w-full h-full flex overflow-hidden rounded-[5px]">
      <div className="w-1/2 bg-[hsl(42_24%_97%)] p-1.5 flex flex-col gap-1">
        <div className="h-1.5 w-6 rounded-full bg-[hsl(222_28%_14%/0.15)]" />
        <div className="h-1 w-4 rounded-full bg-[hsl(222_28%_14%/0.08)]" />
        <div className="flex-1 rounded-l-[3px] bg-[hsl(40_22%_94%)] mt-0.5" />
      </div>
      <div className="w-1/2 bg-[hsl(228_18%_9%)] p-1.5 flex flex-col gap-1">
        <div className="h-1.5 w-6 rounded-full bg-[hsl(38_12%_88%/0.2)]" />
        <div className="h-1 w-4 rounded-full bg-[hsl(38_12%_88%/0.1)]" />
        <div className="flex-1 rounded-r-[3px] bg-[hsl(228_16%_13%)] mt-0.5" />
      </div>
    </div>
  );
}

/* ─── Font preview cards ───────────────────────────────── */

const fontOptions: { value: FontFamily; label: string; family: string }[] = [
  { value: "default", label: "Default", family: "'Source Serif 4', Georgia, serif" },
  { value: "sans", label: "Sans", family: "'Inter', system-ui, sans-serif" },
  { value: "serif", label: "Serif", family: "'Source Serif 4', Georgia, serif" },
  { value: "dyslexic", label: "Dyslexic", family: "'OpenDyslexic', sans-serif" },
];

/* ─── General ──────────────────────────────────────────── */

function GeneralPanel() {
  const { theme, setTheme } = useTheme();
  const { appSettings, updateAppSettings } = useWorkspace();


  const themeOptions: { value: "light" | "auto" | "dark"; label: string; icon: React.ElementType }[] = [
    { value: "light", label: "Light", icon: Sun },
    { value: "auto", label: "Auto", icon: MonitorSmartphone },
    { value: "dark", label: "Dark", icon: Moon },
  ];

  return (
    <div className="space-y-8">
      <PanelHeader title="General" description="Appearance, input, and workspace preferences." />

      {/* Color mode */}
      <div>
        <SectionLabel>Color mode</SectionLabel>
        <div className="flex gap-3">
          {themeOptions.map((opt) => {
            const selected = theme === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setTheme(opt.value)}
                className={`group relative flex flex-col items-center gap-2.5 rounded-xl border-2 p-2.5 pb-3 transition-all duration-300 cursor-pointer active:scale-[0.97] w-[120px] ${
                  selected
                    ? "border-accent bg-accent/5 shadow-[0_0_0_1px_hsl(var(--accent)/0.15)]"
                    : "border-border hover:border-muted-foreground/25 hover:bg-muted/30"
                }`}
              >
                <div className={`w-full aspect-[4/3] rounded-lg overflow-hidden transition-transform duration-300 ${!selected ? "group-hover:scale-[1.02]" : ""}`}>
                  <ThemeMiniPreview mode={opt.value} />
                </div>
                <div className="flex items-center gap-1.5">
                  <opt.icon className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                  <span className={`text-[12px] font-sans ${selected ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                    {opt.label}
                  </span>
                </div>
                {selected && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-accent-foreground" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font style */}
      <div>
        <SectionLabel>Font style</SectionLabel>
        <div className="flex gap-3">
          {fontOptions.map((opt) => {
            const selected = appSettings.fontFamily === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateAppSettings({ fontFamily: opt.value })}
                className={`group relative flex flex-col items-center gap-2 rounded-xl border-2 p-3 pb-2.5 transition-all duration-300 cursor-pointer active:scale-[0.97] w-[100px] ${
                  selected
                    ? "border-accent bg-accent/5 shadow-[0_0_0_1px_hsl(var(--accent)/0.15)]"
                    : "border-border hover:border-muted-foreground/25 hover:bg-muted/30"
                }`}
              >
                <span
                  className={`text-[28px] leading-none transition-transform duration-300 ${!selected ? "group-hover:scale-105" : ""}`}
                  style={{ fontFamily: opt.family }}
                >
                  Aa
                </span>
                <span className={`text-[11px] font-sans ${selected ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                  {opt.label}
                </span>
                {selected && (
                  <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-accent flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-accent-foreground" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Font size + compact */}
      <div>
        <SectionLabel>Display</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
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
          <SettingRow label="Compact mode" description="Reduce spacing and panel padding" action={<Toggle checked={appSettings.compactMode} onChange={(v) => updateAppSettings({ compactMode: v })} />} />
        </div>
      </div>

      {/* Voice & Input */}
      <div>
        <SectionLabel>Voice & Input</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Voice input" description="Enable microphone for voice-to-text in Nexi" action={<Toggle checked={appSettings.voiceInput} onChange={(v) => updateAppSettings({ voiceInput: v })} />} />
        </div>
      </div>

      {/* Reading & Sources */}
      <div>
        <SectionLabel>Reading & Sources</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Auto-expand sources" description="Automatically open viewer when selecting a source" action={<Toggle checked={appSettings.autoExpandSources} onChange={(v) => updateAppSettings({ autoExpandSources: v })} />} />
          <SettingRow label="Auto-save notes" description="Automatically save Nexi responses when bookmarked" action={<Toggle checked={appSettings.autoSaveNotes} onChange={(v) => updateAppSettings({ autoSaveNotes: v })} />} />
        </div>
      </div>
    </div>
  );
}

/* ─── Nexi ─────────────────────────────────────────────── */

function NexiPanel() {
  const { appSettings, updateAppSettings } = useWorkspace();
  const nexiTone = appSettings.nexiTone;
  const citationsVisible = appSettings.showCitations;
  const followUpChips = appSettings.followUpChips;
  const conversationMemory = appSettings.conversationMemory;
  const codeDepth = appSettings.codeDepth;

  return (
    <div className="space-y-8">
      <PanelHeader title="Nexi" description="Configure your AI companion's behavior and communication style." />

      {/* Response behavior */}
      <div>
        <SectionLabel>Response behavior</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Response style"
            description="How Nexi communicates explanations"
            action={
              <SegmentedControl
                value={nexiTone}
                options={[{ value: "concise", label: "Concise" }, { value: "detailed", label: "Detailed" }, { value: "socratic", label: "Socratic" }]}
                onChange={(v) => updateAppSettings({ nexiTone: v as "concise" | "detailed" | "socratic" })}
              />
            }
          />
          <SettingRow label="Show citations" description="Display source references in Nexi responses" action={<Toggle checked={citationsVisible} onChange={(v) => updateAppSettings({ showCitations: v })} />} />
          <SettingRow label="Follow-up suggestions" description="Show suggested actions after each response" action={<Toggle checked={followUpChips} onChange={(v) => updateAppSettings({ followUpChips: v })} />} />
        </div>
      </div>

      {/* Context & memory */}
      <div>
        <SectionLabel>Context & Memory</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow label="Conversation memory" description="Remember context from previous sessions within a course" action={<Toggle checked={conversationMemory} onChange={(v) => updateAppSettings({ conversationMemory: v })} />} />
        </div>
      </div>

      {/* Explanation preferences */}
      <div>
        <SectionLabel>Explanation preferences</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Code explanation depth"
            description="Level of detail for code and math walkthroughs"
            action={
              <SegmentedControl
                value={codeDepth}
                options={[{ value: "beginner", label: "Beginner" }, { value: "intermediate", label: "Intermediate" }, { value: "advanced", label: "Advanced" }]}
                onChange={(v) => setCodeDepth(v as "beginner" | "intermediate" | "advanced")}
              />
            }
          />
          <SettingRow
            label="Preferred language"
            description="Language Nexi uses for explanations"
            action={
              <select
                value={preferredLanguage}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val !== "English") {
                    toast("Language support coming in a future update");
                    setPreferredLanguage("English");
                  }
                }}
                className="px-3 py-1.5 rounded-lg border border-border bg-background text-[12px] font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 cursor-pointer"
              >
                <option value="English">English</option>
                <option value="Spanish">Español</option>
                <option value="French">Français</option>
                <option value="German">Deutsch</option>
                <option value="Portuguese">Português</option>
                <option value="Japanese">日本語</option>
                <option value="Chinese">中文</option>
                <option value="Korean">한국어</option>
                <option value="Arabic">العربية</option>
                <option value="Hindi">हिन्दी</option>
              </select>
            }
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Account ──────────────────────────────────────────── */

function AccountPanel() {
  const { userRole, setUserRole, studioOrganization } = useWorkspace();
  const handleLogout = () => toast.success("Logged out", { description: "See you next time." });

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText("org_nxs_8f42b1c3");
    toast.success("Copied to clipboard");
  };

  const sessions = [
    { device: "Chrome · macOS", location: "San Francisco, US", created: "Mar 18, 2026", updated: "2 min ago" },
    { device: "Safari · iPhone", location: "San Francisco, US", created: "Mar 15, 2026", updated: "1 day ago" },
    { device: "Firefox · Windows", location: "New York, US", created: "Mar 10, 2026", updated: "5 days ago" },
  ];

  return (
    <div className="space-y-8">
      <PanelHeader title="Account" description="Organization details and session management." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        <SettingRow
          label="Organization ID"
          description="Unique identifier for your workspace"
          action={
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-mono text-muted-foreground select-all">org_nxs_8f42b1c3</span>
              <button
                onClick={handleCopyOrgId}
                className="h-7 w-7 rounded-md flex items-center justify-center hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors duration-200 active:scale-[0.95]"
              >
                <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>
            </div>
          }
        />
        <SettingRow label="Organization name" description="Managed by your school, company, or institution" action={<span className="text-[13px] font-sans text-foreground">{studioOrganization.name}</span>} />
      </div>

      {/* Role (demo) */}
      <div>
        <SectionLabel>Role (demo)</SectionLabel>
        <div className="rounded-xl border border-dashed border-[hsl(38_60%_50%/0.3)] bg-[hsl(38_60%_50%/0.06)] p-4">
          <p className="text-[11px] font-sans italic text-[hsl(38_60%_50%/0.6)] mb-3">
            Demo only — This switcher will be removed in production
          </p>
          <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
            <SettingRow
              label="Active role"
              description="Switch between Learner and Admin personas for demo purposes"
              action={
                <SegmentedControl
                  value={userRole}
                  options={[{ value: "learner", label: "Learner" }, { value: "admin", label: "Admin" }]}
                  onChange={(v) => {
                    setUserRole(v as "learner" | "admin");
                    toast.success(`Switched to ${v === "admin" ? "Admin" : "Learner"}`);
                  }}
                />
              }
            />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Active sessions</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Device</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Location</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium hidden sm:table-cell">Created</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Last active</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sessions.map((s, i) => (
                <tr key={i} className="group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {s.device.includes("iPhone") ? <Smartphone className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.5} /> : <Monitor className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.5} />}
                      <span className="text-[13px] font-sans text-foreground">{s.device}</span>
                      {i === 0 && <span className="text-[10px] font-sans text-accent font-medium ml-1">Current</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.location}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground hidden sm:table-cell">{s.created}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.updated}</td>
                  <td className="px-3 py-3.5">
                    <button
                      onClick={() => toast("Session management coming in a future update")}
                      className="h-7 w-7 rounded-md flex items-center justify-center transition-colors duration-200 hover:bg-muted/50 text-muted-foreground hover:text-foreground active:scale-[0.95]"
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
  const { notebookEntries, vocabulary, reflections, tasks } = useWorkspace();

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Local data cleared", { description: "Your preferences have been reset." });
  };
  const handleExport = () => {
    const data = {
      notes: notebookEntries,
      vocabulary,
      reflections,
      tasks,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus-learn-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Export complete", { description: "Your data has been downloaded." });
  };

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

function IntegrationRow({ name, description, svgLogo }: { name: string; description: string; svgLogo: React.ReactNode }) {
  const [connected, setConnected] = useState(false);

  const handleToggle = () => {
    toast("Integration coming in a future update", { description: `${name} integration is not yet available.` });
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
