import { Moon, Sun, Shield, Volume2, Palette, RotateCcw, Eye, Bell, Keyboard, BookOpen, Brain, Download, Languages, Type, Plug, ExternalLink, Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import { toast } from "sonner";
import { useWorkspace } from "@/context/WorkspaceContext";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { appSettings, updateAppSettings } = useWorkspace();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(false);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(true);
  const [localOnly, setLocalOnly] = useState(true);
  const [nexiTone, setNexiTone] = useState<"concise" | "detailed" | "socratic">("detailed");
  const [citationsVisible, setCitationsVisible] = useState(true);
  const [followUpChips, setFollowUpChips] = useState(true);
  const [autoExpandSources, setAutoExpandSources] = useState(true);
  const [keyboardShortcuts, setKeyboardShortcuts] = useState(true);

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Local data cleared", { description: "Your preferences have been reset." });
  };

  const handleExport = () => {
    toast.success("Export started", { description: "Your notes and reflections are being prepared." });
  };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-2xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Settings</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Customize your learning environment.</p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <SettingSection icon={Palette} label="Appearance" delay={80}>
          <SettingRow
            label="Theme"
            description="Switch between light and dark mode"
            action={
              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
              >
                {theme === "light" ? <Moon className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Sun className="h-3.5 w-3.5" strokeWidth={1.5} />}
                {theme === "light" ? "Dark" : "Light"}
              </button>
            }
          />
          <SettingRow
            label="Compact mode"
            description="Reduce spacing and panel padding"
            action={<Toggle checked={appSettings.compactMode} onChange={(v) => updateAppSettings({ compactMode: v })} />}
          />
          <SettingRow
            label="Font size"
            description="Adjust reading text size across the workspace"
            action={
              <SegmentedControl
                value={appSettings.fontSize}
                options={[
                  { value: "small", label: "S" },
                  { value: "medium", label: "M" },
                  { value: "large", label: "L" },
                ]}
                onChange={(v) => updateAppSettings({ fontSize: v as "small" | "medium" | "large" })}
              />
            }
          />
        </SettingSection>

        {/* Nexi AI Companion */}
        <SettingSection icon={Brain} label="Nexi — AI Companion" delay={160}>
          <SettingRow
            label="Response style"
            description="How Nexi communicates explanations"
            action={
              <SegmentedControl
                value={nexiTone}
                options={[
                  { value: "concise", label: "Concise" },
                  { value: "detailed", label: "Detailed" },
                  { value: "socratic", label: "Socratic" },
                ]}
                onChange={(v) => setNexiTone(v as "concise" | "detailed" | "socratic")}
              />
            }
          />
          <SettingRow
            label="Show citations"
            description="Display source references in Nexi responses"
            action={<Toggle checked={citationsVisible} onChange={setCitationsVisible} />}
          />
          <SettingRow
            label="Follow-up suggestions"
            description="Show suggested actions after each Nexi response"
            action={<Toggle checked={followUpChips} onChange={setFollowUpChips} />}
          />
        </SettingSection>

        {/* Voice & Input */}
        <SettingSection icon={Volume2} label="Voice & Input" delay={240}>
          <SettingRow
            label="Voice input"
            description="Enable microphone for voice-to-text in Nexi"
            action={<Toggle checked={voiceEnabled} onChange={setVoiceEnabled} />}
          />
          <SettingRow
            label="Keyboard shortcuts"
            description="Enable ⌘K command palette and workspace shortcuts"
            action={<Toggle checked={keyboardShortcuts} onChange={setKeyboardShortcuts} />}
          />
        </SettingSection>

        {/* Reading & Sources */}
        <SettingSection icon={BookOpen} label="Reading & Sources" delay={320}>
          <SettingRow
            label="Auto-expand sources"
            description="Automatically open viewer mode when selecting a source"
            action={<Toggle checked={autoExpandSources} onChange={setAutoExpandSources} />}
          />
          <SettingRow
            label="Auto-save notes"
            description="Automatically save Nexi responses when bookmarked"
            action={<Toggle checked={autoSave} onChange={setAutoSave} />}
          />
        </SettingSection>

        {/* Privacy & Security */}
        <SettingSection icon={Shield} label="Privacy & Security" delay={400}>
          <SettingRow
            label="Local-only storage"
            description="All data stays on your device — nothing is sent externally"
            action={<Toggle checked={localOnly} onChange={setLocalOnly} />}
          />
          <SettingRow
            label="Analytics opt-out"
            description="Disable anonymous usage analytics"
            action={<Toggle checked={analyticsOptOut} onChange={setAnalyticsOptOut} />}
          />
          <SettingRow
            label="Notifications"
            description="Receive study reminders and progress nudges"
            action={<Toggle checked={notifications} onChange={setNotifications} />}
          />
        </SettingSection>

        {/* Data & Export */}
        <SettingSection icon={Download} label="Data & Export" delay={480}>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[13px] font-sans font-medium text-foreground">Export all data</p>
              <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5">Download notes, reflections, and progress as JSON</p>
            </div>
            <button
              onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
            >
              <Download className="h-3.5 w-3.5" strokeWidth={1.5} />
              Export
            </button>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-[13px] font-sans font-medium text-foreground">Clear local data</p>
              <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5">Reset all preferences and cached state</p>
            </div>
            <button
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-[12px] font-sans text-destructive hover:bg-destructive/5 transition-all duration-200 active:scale-[0.97]"
            >
              <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
              Reset
            </button>
          </div>
        </SettingSection>

        {/* Integrations */}
        <SettingSection icon={Plug} label="Integrations" delay={540}>
          <IntegrationRow
            name="Notion"
            description="Sync notes and reflections to Notion pages"
            icon="https://www.notion.so/images/favicon.ico"
          />
          <IntegrationRow
            name="Google Drive"
            description="Import sources and export notes to Drive"
            icon="https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png"
          />
          <IntegrationRow
            name="Google Calendar"
            description="Connect Google Calendar for study scheduling"
            icon="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_31_2x.png"
          />
          <IntegrationRow
            name="Zotero"
            description="Import academic references and citation data"
            icon="https://www.zotero.org/support/lib/exe/fetch.php?tok=b55a97&media=logo.png"
          />
          <IntegrationRow
            name="Readwise"
            description="Sync highlights and reading notes"
            fallbackLetter="R"
            fallbackColor="bg-yellow-500/15 text-yellow-500"
          />
          <IntegrationRow
            name="Anki"
            description="Export flashcards from Nexi quiz sessions"
            fallbackLetter="A"
            fallbackColor="bg-blue-500/15 text-blue-500"
          />
          <IntegrationRow
            name="Obsidian"
            description="Export notebook entries as Markdown vault files"
            icon="https://obsidian.md/favicon.ico"
          />
        </SettingSection>


        <section className="animate-fade-in [animation-delay:560ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-2.5 mb-4">
            <Keyboard className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Keyboard Shortcuts</h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <ShortcutRow label="Toggle sidebar" keys={["⌘", "B"]} />
            <ShortcutRow label="Send message" keys={["Enter"]} />
            <ShortcutRow label="New line" keys={["⇧", "Enter"]} />
            <ShortcutRow label="Save to notebook" keys={["⌘", "S"]} />
            <ShortcutRow label="Toggle theme" keys={["⌘", "⇧", "T"]} />
          </div>
        </section>
      </div>

      <div className="h-16" />
    </div>
  );
};

function SettingSection({ icon: Icon, label, delay, children }: { icon: React.ElementType; label: string; delay: number; children: React.ReactNode }) {
  return (
    <section className="animate-fade-in [animation-fill-mode:backwards]" style={{ animationDelay: `${delay}ms` }}>
      <div className="flex items-center gap-2.5 mb-4">
        <Icon className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
        <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">{label}</h2>
      </div>
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {children}
      </div>
    </section>
  );
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
      className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${checked ? "bg-accent" : "bg-muted"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-soft transition-transform duration-200 ${checked ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

function SegmentedControl({ value, options, onChange }: { value: string; options: { value: string; label: string }[]; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`px-2.5 py-1 rounded-md text-[11px] font-sans transition-all duration-200 ${
            value === opt.value
              ? "bg-card text-foreground shadow-soft font-medium"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function ShortcutRow({ label, keys }: { label: string; keys: string[] }) {
  return (
    <div className="flex items-center justify-between px-5 py-3">
      <span className="text-[12px] font-sans text-muted-foreground">{label}</span>
      <div className="flex items-center gap-1">
        {keys.map((key, i) => (
          <kbd key={i} className="h-6 min-w-[24px] px-1.5 flex items-center justify-center rounded-md border border-border bg-muted/50 text-[10px] font-mono text-muted-foreground">
            {key}
          </kbd>
        ))}
      </div>
    </div>
  );
}

function IntegrationRow({ name, description, icon, fallbackLetter, fallbackColor }: { name: string; description: string; icon?: string; fallbackLetter?: string; fallbackColor?: string }) {
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
        <div className="h-8 w-8 rounded-lg bg-muted/50 border border-border/60 flex items-center justify-center shrink-0 overflow-hidden">
          {icon ? (
            <img src={icon} alt={name} className="h-5 w-5 object-contain" />
          ) : (
            <span className="text-[11px] font-sans font-bold text-muted-foreground/60">{name.charAt(0)}</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="text-[13px] font-sans font-medium text-foreground">{name}</p>
          <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5 truncate">{description}</p>
        </div>
      </div>
      <button
        onClick={handleToggle}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-sans transition-all duration-200 active:scale-[0.97] shrink-0 ${
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
