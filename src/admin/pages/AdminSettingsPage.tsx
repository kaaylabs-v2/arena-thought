import { useState } from "react";
import { Settings, Building2, Palette, Globe, Bell, Shield } from "lucide-react";
import { organization, currentAdmin } from "@/admin/data/mock-data";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [org, setOrg] = useState(organization);
  const [notifications, setNotifications] = useState({ email: true, inApp: true, weeklyDigest: false });
  const [twoFactor, setTwoFactor] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(60);
  const handleSave = () => toast.success("Settings saved");

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
              <div className="mt-1 border-2 border-dashed rounded-xl p-8 text-center border-border transition-all duration-250 hover:bg-accent/5 hover:border-accent/30 cursor-pointer active:scale-[0.99]">
                <p className="text-sm text-muted-foreground">Drag and drop your logo here, or click to browse</p>
                <p className="text-xs mt-1 text-muted-foreground/60">PNG, SVG — max 2 MB</p>
              </div>
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
              <Switch />
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
              <Input type="number" defaultValue={60} className="max-w-[200px]" />
            </div>
            <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">Save Changes</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
