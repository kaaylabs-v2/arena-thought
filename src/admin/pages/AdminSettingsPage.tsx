import { useState, useRef } from "react";
import { Settings, Building2, Palette, Globe, Bell, Shield, Upload, X, Image } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { studioOrganization: organization, studioCurrentAdmin: currentAdmin } = useWorkspace();
  const [org, setOrg] = useState(organization);
  const [notifications, setNotifications] = useState({ email: true, inApp: true, weeklyDigest: false });
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoName, setLogoName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSave = () => toast.success("Settings saved");

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
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <h1 className="font-serif text-[2rem] font-normal text-foreground">Settings</h1>
      <p className="text-sm mt-0.5 mb-8 text-muted-foreground">Organization profile, branding, and configuration</p>

      <Tabs defaultValue="organization">
        <TabsList className="mb-6">
          <TabsTrigger value="organization" className="gap-1.5 text-xs"><Building2 className="h-3.5 w-3.5" />Organization</TabsTrigger>
          <TabsTrigger value="branding" className="gap-1.5 text-xs"><Palette className="h-3.5 w-3.5" />Branding</TabsTrigger>
          <TabsTrigger value="notifications" className="gap-1.5 text-xs"><Bell className="h-3.5 w-3.5" />Notifications</TabsTrigger>
          <TabsTrigger value="security" className="gap-1.5 text-xs"><Shield className="h-3.5 w-3.5" />Security</TabsTrigger>
        </TabsList>

        <TabsContent value="organization">
          <div className="card-interactive p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Organization Name</Label><Input value={org.name} onChange={e => setOrg(o => ({ ...o, name: e.target.value }))} /></div>
              <div><Label className="text-xs">Industry</Label><Input value={org.industry} onChange={e => setOrg(o => ({ ...o, industry: e.target.value }))} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Label className="text-xs">Contact Email</Label><Input value={org.contactEmail} onChange={e => setOrg(o => ({ ...o, contactEmail: e.target.value }))} /></div>
              <div><Label className="text-xs">Timezone</Label><Input value={org.timezone} onChange={e => setOrg(o => ({ ...o, timezone: e.target.value }))} /></div>
            </div>
            <div><Label className="text-xs">Welcome Message</Label><Textarea value={org.welcomeMessage} onChange={e => setOrg(o => ({ ...o, welcomeMessage: e.target.value }))} rows={3} /></div>
            <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="branding">
          <div className="card-interactive p-6 space-y-5">
            <div>
              <Label className="text-xs">Accent Color</Label>
              <div className="flex items-center gap-3 mt-1">
                <div className="h-10 w-10 rounded-lg border border-border transition-transform duration-200 hover:scale-105" style={{ backgroundColor: org.accentColor }} />
                <Input value={org.accentColor} onChange={e => setOrg(o => ({ ...o, accentColor: e.target.value }))} className="max-w-[200px]" />
              </div>
            </div>
            <div>
              <Label className="text-xs">Logo</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/svg+xml,image/jpeg,image/webp"
                onChange={handleLogoSelect}
                className="hidden"
              />
              {logoPreview ? (
                <div className="mt-1 border rounded-xl p-4 border-border">
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
                  className="mt-1 border-2 border-dashed rounded-xl p-8 text-center border-border transition-all duration-250 hover:bg-accent/5 hover:border-accent/30 cursor-pointer active:scale-[0.99]"
                >
                  <Image className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" strokeWidth={1.5} />
                  <p className="text-sm text-muted-foreground">Click to upload your logo</p>
                  <p className="text-xs mt-1 text-muted-foreground/60">PNG, SVG, JPEG, WebP — max 2 MB</p>
                </div>
              )}
            </div>
            <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="card-interactive p-6 space-y-5">
            {[
              { key: "email" as const, label: "Email Notifications", desc: "Receive updates about member activity and course completions" },
              { key: "inApp" as const, label: "In-App Notifications", desc: "Show notifications within the Admin Studio" },
              { key: "weeklyDigest" as const, label: "Weekly Digest", desc: "Receive a summary email every Monday" },
            ].map(n => (
              <div key={n.key} className="setting-row flex items-center justify-between py-3 px-3 -mx-3 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground/75">{n.label}</p>
                  <p className="text-xs text-muted-foreground">{n.desc}</p>
                </div>
                <Switch checked={notifications[n.key]} onCheckedChange={v => setNotifications(prev => ({ ...prev, [n.key]: v }))} />
              </div>
            ))}
            <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="card-interactive p-6 space-y-5">
            <div className="setting-row flex items-center justify-between py-3 px-3 -mx-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground/75">Two-Factor Authentication</p>
                <p className="text-xs text-muted-foreground">Require 2FA for all admin accounts</p>
              </div>
              <Switch checked={twoFactor} onCheckedChange={(v) => { setTwoFactor(v); toast.success(v ? "2FA enabled" : "2FA disabled"); }} />
            </div>
            <div className="setting-row flex items-center justify-between py-3 px-3 -mx-3 rounded-lg">
              <div>
                <p className="text-sm font-medium text-foreground/75">SSO / SAML</p>
                <p className="text-xs text-muted-foreground">Enable single sign-on for your organization</p>
              </div>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-accent/10 text-accent">Coming Soon</span>
            </div>
            <div>
              <Label className="text-xs">Session Timeout (minutes)</Label>
              <Input type="number" value={sessionTimeout} onChange={e => setSessionTimeout(Number(e.target.value))} className="max-w-[200px]" />
            </div>
            <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
