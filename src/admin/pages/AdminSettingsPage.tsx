import { useState, useRef } from "react";
import {
  Settings2, Building2, Palette, Bell, Shield, User, Plug,
  Sun, Moon, MonitorSmartphone, Check, Image, Monitor, Smartphone,
  MoreHorizontal, LogOut, Copy, Download, RotateCcw,
} from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useTheme } from "@/components/ThemeProvider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { roleBadgeLabel } from "@/admin/data/mock-data";
import {
  NotionLogo,
  ZoteroLogo,
  ReadwiseLogo,
  ObsidianLogo,
  GoogleDriveLogo,
  GoogleCalendarLogo,
} from "@/components/IntegrationLogos";

type AdminSettingsTab = "general" | "organization" | "branding" | "notifications" | "security" | "connectors" | "profile";

const tabConfig: { id: AdminSettingsTab; label: string; icon: React.ElementType }[] = [
  { id: "general", label: "General", icon: Settings2 },
  { id: "organization", label: "Organization", icon: Building2 },
  { id: "branding", label: "Branding", icon: Palette },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "connectors", label: "Connectors", icon: Plug },
  { id: "profile", label: "Profile", icon: User },
];

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<AdminSettingsTab>("general");

  return (
    <div className="h-full min-h-screen p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="mb-6 animate-fade-in">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Settings</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Organization profile, branding, and configuration.</p>
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
          {activeTab === "organization" && <OrganizationPanel />}
          {activeTab === "branding" && <BrandingPanel />}
          {activeTab === "notifications" && <NotificationsPanel />}
          {activeTab === "security" && <SecurityPanel />}
          {activeTab === "connectors" && <ConnectorsPanel />}
          {activeTab === "profile" && <ProfilePanel />}
        </div>
      </div>

      <div className="h-16" />
    </div>
  );
}

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
      <PanelHeader title="General" description="Appearance and display preferences for the Admin Studio." />

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

      {/* Display */}
      <div>
        <SectionLabel>Display</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Font size"
            description="Adjust text size across the Admin Studio"
            action={
              <SegmentedControl
                value={appSettings.fontSize}
                options={[{ value: "small", label: "S" }, { value: "medium", label: "M" }, { value: "large", label: "L" }]}
                onChange={(v) => updateAppSettings({ fontSize: v as "small" | "medium" | "large" })}
              />
            }
          />
          <SettingRow
            label="Compact mode"
            description="Reduce spacing and panel padding"
            action={<Toggle checked={appSettings.compactMode} onChange={(v) => updateAppSettings({ compactMode: v })} />}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Organization ─────────────────────────────────────── */

function OrganizationPanel() {
  const { studioOrganization: organization, setStudioOrganization } = useWorkspace();
  const [org, setOrg] = useState(organization);

  const handleSave = () => {
    setStudioOrganization(org);
    toast.success("Settings saved");
  };

  return (
    <div className="space-y-8">
      <PanelHeader title="Organization" description="Manage your organization's identity and welcome message." />

      <div className="rounded-xl border border-border bg-card p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs">Organization Name</Label><Input value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} /></div>
          <div><Label className="text-xs">Industry</Label><Input value={org.industry} onChange={e => setOrg(o => ({ ...o, industry: e.target.value }))} /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><Label className="text-xs">Contact Email</Label><Input value={org.contactEmail} onChange={e => setOrg(o => ({ ...o, contactEmail: e.target.value }))} /></div>
          <div><Label className="text-xs">Timezone</Label><Input value={org.timezone} onChange={e => setOrg(o => ({ ...o, timezone: e.target.value }))} /></div>
        </div>
        <div><Label className="text-xs">Welcome Message</Label><Textarea value={org.welcomeMessage} onChange={e => setOrg(o => ({ ...o, welcomeMessage: e.target.value }))} rows={3} /></div>
        <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-[13px] font-sans font-medium hover:bg-accent/90 transition-all duration-200 active:scale-[0.97]">
          Save Changes
        </button>
      </div>
    </div>
  );
}

/* ─── Branding ─────────────────────────────────────────── */

function BrandingPanel() {
  const { studioOrganization: organization, setStudioOrganization } = useWorkspace();
  const [org, setOrg] = useState(organization);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    setStudioOrganization(org);
    toast.success("Settings saved");
  };

  const handleLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File too large", { description: "Maximum size is 2 MB" });
      return;
    }
    if (!["image/png", "image/svg+xml", "image/jpeg", "image/webp"].includes(file.type)) {
      toast.error("Invalid format", { description: "Use PNG, SVG, JPEG, or WebP" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoPreview(reader.result as string);
      setLogoName(file.name);
      toast.success("Logo uploaded", { description: file.name });
    };
    reader.readAsDataURL(file);
  };

  const removeLogo = () => {
    setLogoPreview(null);
    setLogoName(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    toast.success("Logo removed");
  };

  return (
    <div className="space-y-8">
      <PanelHeader title="Branding" description="Customize the look and feel of your organization's workspace." />

      <div>
        <SectionLabel>Accent color</SectionLabel>
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg border border-border transition-transform duration-200 hover:scale-105" style={{ backgroundColor: org.accentColor }} />
            <Input value={org.accentColor} onChange={e => setOrg(o => ({ ...o, accentColor: e.target.value }))} className="max-w-[200px]" />
          </div>
        </div>
      </div>

      <div>
        <SectionLabel>Logo</SectionLabel>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/svg+xml,image/jpeg,image/webp"
          onChange={handleLogoSelect}
          className="hidden"
        />
        {logoPreview ? (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-lg border border-border overflow-hidden flex items-center justify-center bg-muted/30">
                <img src={logoPreview} alt="Logo preview" className="max-h-full max-w-full object-contain" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-foreground/80 truncate">{logoName}</p>
                <p className="text-[11px] text-muted-foreground">Logo uploaded successfully</p>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => fileInputRef.current?.click()} className="text-[12px] font-medium text-accent hover:text-accent/80 transition-colors duration-150">Replace</button>
                  <button onClick={removeLogo} className="text-[12px] font-medium text-destructive hover:text-destructive/80 transition-colors duration-150">Remove</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed rounded-xl p-8 text-center border-border transition-all duration-250 hover:bg-accent/5 hover:border-accent/30 cursor-pointer active:scale-[0.99]"
          >
            <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground">Click to upload your logo</p>
            <p className="text-xs mt-1 text-muted-foreground/60">PNG, SVG, JPEG, WebP — max 2 MB</p>
          </div>
        )}
      </div>

      <button onClick={handleSave} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-[13px] font-sans font-medium hover:bg-accent/90 transition-all duration-200 active:scale-[0.97]">
        Save Changes
      </button>
    </div>
  );
}

/* ─── Notifications ────────────────────────────────────── */

function NotificationsPanel() {
  const [notifications, setNotifications] = useState({ email: true, inApp: true, weeklyDigest: false });

  return (
    <div className="space-y-8">
      <PanelHeader title="Notifications" description="Configure how and when you receive updates." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        {[
          { key: "email" as const, label: "Email Notifications", desc: "Receive updates about member activity and course completions" },
          { key: "inApp" as const, label: "In-App Notifications", desc: "Show notifications within the Admin Studio" },
          { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Receive a summary email every Monday" },
        ].map(n => (
          <SettingRow
            key={n.key}
            label={n.label}
            description={n.desc}
            action={<Toggle checked={notifications[n.key]} onChange={v => setNotifications(prev => ({ ...prev, [n.key]: v }))} />}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── Security ─────────────────────────────────────────── */

function SecurityPanel() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);

  return (
    <div className="space-y-8">
      <PanelHeader title="Security" description="Authentication, sessions, and access controls." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <SettingRow
          label="Two-Factor Authentication"
          description="Require 2FA for all admin accounts"
          action={<Toggle checked={twoFactor} onChange={(v) => { setTwoFactor(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />}
        />
        <SettingRow
          label="SSO / SAML"
          description="Enable single sign-on for your organization"
          action={<span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent font-sans">Coming Soon</span>}
        />
        <SettingRow
          label="Session Timeout"
          description="Auto-logout after inactivity (minutes)"
          action={<Input type="number" value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value))} className="max-w-[100px] h-8 text-[12px]" />}
        />
      </div>

      {/* Active sessions */}
      <div>
        <SectionLabel>Active sessions</SectionLabel>
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left px-5 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Device</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Location</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Created</th>
                <th className="text-left px-4 py-3 text-[10px] font-sans uppercase tracking-widest text-muted-foreground/80 font-medium">Last active</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { device: "Chrome · macOS", location: "San Francisco, US", created: "Mar 18, 2026", updated: "2 min ago" },
                { device: "Safari · iPhone", location: "San Francisco, US", created: "Mar 15, 2026", updated: "1 day ago" },
              ].map((s, i) => (
                <tr key={i} className="group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      {s.device.includes("iPhone") ? <Smartphone className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.5} /> : <Monitor className="h-3.5 w-3.5 text-muted-foreground/70" strokeWidth={1.5} />}
                      <span className="text-[13px] font-sans text-foreground">{s.device}</span>
                      {i === 0 && <span className="text-[10px] font-sans text-accent font-medium ml-1">Current</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.location}</td>
                  <td className="px-4 py-3.5 text-[12px] font-sans text-muted-foreground">{s.created}</td>
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
        onClick={() => toast.success("Logged out", { description: "See you next time." })}
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
      <PanelHeader title="Connectors" description="Connect external apps and services to your admin workspace." />

      <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
        <IntegrationRow name="Notion" description="Sync course materials and documentation to Notion" svgLogo={<NotionLogo className="h-5 w-5" />} />
        <IntegrationRow name="Google Drive" description="Import and export course content to Drive" svgLogo={<GoogleDriveLogo className="h-5 w-5" />} />
        <IntegrationRow name="Google Calendar" description="Schedule courses and deadlines on Calendar" svgLogo={<GoogleCalendarLogo className="h-5 w-5" />} />
        <IntegrationRow name="Zotero" description="Import academic references for course content" svgLogo={<ZoteroLogo className="h-5 w-5" />} />
        <IntegrationRow name="Readwise" description="Sync reading highlights into course sources" svgLogo={<ReadwiseLogo className="h-5 w-5" />} />
        <IntegrationRow name="Obsidian" description="Export course notes as Markdown vault files" svgLogo={<ObsidianLogo className="h-5 w-5" />} />
      </div>
    </div>
  );
}

/* ─── Profile ──────────────────────────────────────────── */

function ProfilePanel() {
  const { studioCurrentAdmin: currentAdmin, studioOrganization } = useWorkspace();
  const [adminName, setAdminName] = useState(currentAdmin.name);
  const [adminEmail, setAdminEmail] = useState(currentAdmin.email);

  const handleCopyOrgId = () => {
    navigator.clipboard.writeText("org_nxs_8f42b1c3");
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-8">
      <PanelHeader title="Profile" description="Your administrator identity and organization details." />

      {/* Admin identity */}
      <div>
        <SectionLabel>Administrator</SectionLabel>
        <div className="rounded-xl border border-border bg-card p-6 space-y-5">
          <div className="flex items-center gap-4 mb-1">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-xl font-serif font-medium text-primary/70">
                {currentAdmin.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{currentAdmin.name}</p>
              <p className="text-xs text-muted-foreground">{roleBadgeLabel(currentAdmin.role)}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label className="text-xs">Name</Label><Input value={adminName} onChange={e => setAdminName(e.target.value)} /></div>
            <div><Label className="text-xs">Email</Label><Input value={adminEmail} onChange={e => setAdminEmail(e.target.value)} /></div>
          </div>
          <div>
            <Label className="text-xs">Role</Label>
            <Input value={roleBadgeLabel(currentAdmin.role)} disabled className="max-w-[200px] opacity-60" />
            <p className="text-[11px] text-muted-foreground mt-1">Roles are managed by super admins</p>
          </div>
          <button onClick={() => toast.success("Profile updated")} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent text-accent-foreground text-[13px] font-sans font-medium hover:bg-accent/90 transition-all duration-200 active:scale-[0.97]">
            Save Profile
          </button>
        </div>
      </div>

      {/* Organization info */}
      <div>
        <SectionLabel>Organization</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
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
          <SettingRow label="Organization name" description="Managed by your institution" action={<span className="text-[13px] font-sans text-foreground">{studioOrganization.name}</span>} />
        </div>
      </div>

      {/* Data export */}
      <div>
        <SectionLabel>Data & Export</SectionLabel>
        <div className="rounded-xl border border-border bg-card divide-y divide-border overflow-hidden">
          <SettingRow
            label="Export organization data"
            description="Download members, courses, and analytics as JSON"
            action={
              <button
                onClick={() => toast("Organization export coming in a future update")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
              >
                <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
                Export
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
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-sans shrink-0 transition-all duration-200 active:scale-[0.97] border border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
      >
        Connect
      </button>
    </div>
  );
}
