import { Moon, Sun, Shield, Volume2, Palette, RotateCcw, Eye, Bell } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useState } from "react";
import { toast } from "sonner";

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [notifications, setNotifications] = useState(false);

  const handleClearData = () => {
    localStorage.clear();
    toast.success("Local data cleared", { description: "Your local preferences have been reset." });
  };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-2xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Settings</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Customize your learning environment.</p>
      </div>

      <div className="space-y-8">
        {/* Appearance */}
        <section className="animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-2.5 mb-4">
            <Palette className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Appearance</h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
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
              action={<Toggle checked={compactMode} onChange={setCompactMode} />}
            />
          </div>
        </section>

        {/* Privacy */}
        <section className="animate-fade-in [animation-delay:160ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-2.5 mb-4">
            <Shield className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Privacy</h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <SettingRow
              label="Auto-save notes"
              description="Automatically save Nexi responses when bookmarked"
              action={<Toggle checked={autoSave} onChange={setAutoSave} />}
            />
            <SettingRow
              label="Notifications"
              description="Receive study reminders and progress updates"
              action={<Toggle checked={notifications} onChange={setNotifications} />}
            />
          </div>
        </section>

        {/* Voice & Input */}
        <section className="animate-fade-in [animation-delay:240ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-2.5 mb-4">
            <Volume2 className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Voice & Input</h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <SettingRow
              label="Voice input"
              description="Enable microphone for voice-to-text in Nexi"
              action={<Toggle checked={voiceEnabled} onChange={setVoiceEnabled} />}
            />
          </div>
        </section>

        {/* Personalization */}
        <section className="animate-fade-in [animation-delay:320ms] [animation-fill-mode:backwards]">
          <div className="flex items-center gap-2.5 mb-4">
            <Eye className="h-4 w-4 text-muted-foreground/60" strokeWidth={1.5} />
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Data</h2>
          </div>
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <div className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-[13px] font-sans font-medium text-foreground">Clear local data</p>
                <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5">Reset preferences and cached state</p>
              </div>
              <button
                onClick={handleClearData}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-destructive/30 text-[12px] font-sans text-destructive hover:bg-destructive/5 transition-all duration-200 active:scale-[0.97]"
              >
                <RotateCcw className="h-3.5 w-3.5" strokeWidth={1.5} />
                Reset
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

function SettingRow({ label, description, action }: { label: string; description: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div>
        <p className="text-[13px] font-sans font-medium text-foreground">{label}</p>
        <p className="text-[11px] font-sans text-muted-foreground/70 mt-0.5">{description}</p>
      </div>
      {action}
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

export default Settings;
