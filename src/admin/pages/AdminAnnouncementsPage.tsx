import { useState, useEffect } from "react";
import { Megaphone, Plus, Calendar, User, Pencil, Trash2, X } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { type Announcement } from "@/admin/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminAnnouncementsPage() {
  const { studioAnnouncements, studioDepartments: departments } = useWorkspace();
  const [items, setItems] = useState<Announcement[]>(studioAnnouncements);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState<Announcement | null>(null);
  const [form, setForm] = useState({ title: "", body: "", audience: "All Members" });
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Listen for keyboard shortcut
  useEffect(() => {
    const handler = () => openNew();
    window.addEventListener("admin-shortcut:announce", handler);
    return () => window.removeEventListener("admin-shortcut:announce", handler);
  }, []);

  const openNew = () => {
    setEditingAnn(null);
    setForm({ title: "", body: "", audience: "All Members" });
    setDrawerOpen(true);
  };

  const openEdit = (ann: Announcement) => {
    setEditingAnn(ann);
    setForm({ title: ann.title, body: ann.body, audience: ann.audience });
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingAnn(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.body.trim()) return;
    if (editingAnn) {
      setItems(prev => prev.map(a => a.id === editingAnn.id ? { ...a, title: form.title, body: form.body, audience: form.audience } : a));
      toast.success("Announcement updated");
    } else {
      const newItem: Announcement = {
        id: `ann-${Date.now()}`,
        title: form.title,
        body: form.body,
        audience: form.audience,
        sentDate: new Date().toISOString().slice(0, 10),
        sentBy: "Jordan Reeves",
      };
      setItems(prev => [newItem, ...prev]);
      toast.success("Announcement sent");
    }
    closeDrawer();
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(a => a.id !== id));
    setDeletingId(null);
    toast.success("Announcement deleted");
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Announcements</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Send messages to learners and departments</p>
        </div>
        <Button onClick={openNew} className="btn-apple gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> New Announcement
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 stagger-children">
        <div className="card-interactive p-5">
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Total Sent</span>
          </div>
          <p className="text-2xl font-serif text-foreground">{items.length}</p>
        </div>
        <div className="card-interactive p-5">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-accent" />
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Latest</span>
          </div>
          <p className="text-2xl font-serif text-foreground">{items[0]?.sentDate || "—"}</p>
        </div>
      </div>

      <div className="space-y-3 stagger-children">
        {items.map(ann => (
          <div key={ann.id} className="card-interactive p-5">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-medium text-sm text-foreground/80">{ann.title}</h3>
              <div className="flex items-center gap-2 shrink-0">
                <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                  {ann.audience}
                </Badge>
                <button onClick={() => openEdit(ann)} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                {deletingId === ann.id ? (
                  <div className="flex items-center gap-1.5 text-[12px] animate-fade-in-fast">
                    <button onClick={() => handleDelete(ann.id)} className="font-medium text-destructive">Delete</button>
                    <button onClick={() => setDeletingId(null)} className="text-muted-foreground">Cancel</button>
                  </div>
                ) : (
                  <button onClick={() => setDeletingId(ann.id)} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
            <p className="text-sm leading-relaxed mb-3 text-muted-foreground">{ann.body}</p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground/60">
              <span className="flex items-center gap-1"><User className="h-3 w-3" />{ann.sentBy}</span>
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{ann.sentDate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Right-slide drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in-gentle" onClick={closeDrawer} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground font-serif">
                {editingAnn ? "Edit Announcement" : "New Announcement"}
              </h2>
              <button onClick={closeDrawer} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin">
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
            <div className="px-6 py-4 border-t border-border flex gap-3">
              <button onClick={closeDrawer} className="btn-ghost flex-1 h-10 text-[13px] font-medium border border-border rounded-lg text-foreground/65 hover:bg-muted">Cancel</button>
              <button onClick={handleSave} className="btn-apple flex-1 h-10 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">
                {editingAnn ? "Save Changes" : "Send Announcement"}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
