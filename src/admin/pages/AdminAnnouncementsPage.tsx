import { useState } from "react";
import { Megaphone, Plus, Calendar, User } from "lucide-react";
import { announcements as seedAnnouncements, departments, type Announcement } from "@/admin/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { toast } from "sonner";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

export default function AdminAnnouncementsPage() {
  const [items, setItems] = useState<Announcement[]>(seedAnnouncements);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "All Members" });

  const handleSend = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    const newItem: Announcement = {
      id: `ann-${Date.now()}`,
      title: form.title,
      body: form.body,
      audience: form.audience,
      sentDate: new Date().toISOString().slice(0, 10),
      sentBy: "Jordan Reeves",
    };
    setItems(prev => [newItem, ...prev]);
    setDrawerOpen(false);
    setForm({ title: "", body: "", audience: "All Members" });
    toast.success("Announcement sent");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Announcements</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Send messages to learners and departments</p>
        </div>
        <Button onClick={() => setDrawerOpen(true)} className="gap-2" style={{ backgroundColor: "#C9963A" }}>
          <Plus className="h-4 w-4" /> New Announcement
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="h-4 w-4" style={{ color: "#C9963A" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>Total Sent</span>
          </div>
          <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{items.length}</p>
        </div>
        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4" style={{ color: "#C9963A" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>Latest</span>
          </div>
          <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{items[0]?.sentDate || "—"}</p>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {items.map(ann => (
          <div key={ann.id} style={cardStyle} className="p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm" style={{ color: "rgba(0,0,0,0.8)" }}>{ann.title}</h3>
              <Badge variant="outline" className="text-[10px] shrink-0" style={{ borderColor: "rgba(201,150,58,0.3)", color: "#C9963A" }}>
                {ann.audience}
              </Badge>
            </div>
            <p className="text-sm leading-relaxed mb-3" style={{ color: "rgba(0,0,0,0.55)" }}>{ann.body}</p>
            <div className="flex items-center gap-4 text-xs" style={{ color: "rgba(0,0,0,0.35)" }}>
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{ann.sentBy}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ann.sentDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Compose Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="font-serif">New Announcement</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div>
                <Label className="text-xs">Title</Label>
                <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" />
              </div>
              <div>
                <Label className="text-xs">Audience</Label>
                <Select value={form.audience} onValueChange={v => setForm(f => ({ ...f, audience: v }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All Members">All Members</SelectItem>
                    {departments.map(d => <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Message</Label>
                <Textarea value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} placeholder="Write your message..." rows={4} />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSend} style={{ backgroundColor: "#C9963A" }}>Send Announcement</Button>
              <DrawerClose asChild><Button variant="outline">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
