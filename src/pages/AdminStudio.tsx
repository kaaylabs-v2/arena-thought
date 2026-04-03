import { useState } from "react";
import { useWorkspace, mockUsers, type AdminCourse, type AdminModule, type AdminSourceItem, type SourceType } from "@/context/WorkspaceContext";
import { Plus, Trash2, ArrowUp, ArrowDown, Shield, ChevronLeft, Globe, GlobeLock, Pencil, Sparkles, Users, BookOpen, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sourceTypes: { value: SourceType; label: string }[] = [
  { value: "video", label: "Video" },
  { value: "lecture", label: "Lecture" },
  { value: "reading", label: "Reading" },
  { value: "pdf", label: "PDF" },
  { value: "code", label: "Code" },
  { value: "slides", label: "Slides" },
  { value: "link", label: "Link" },
];

let localId = 500;
const newId = () => `admin-${++localId}`;

// ─── Course Editor ───────────────────────────────────────────

function CourseEditor({
  initial,
  onSave,
  onCancel,
}: {
  initial?: AdminCourse;
  onSave: (data: Omit<AdminCourse, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [modules, setModules] = useState<AdminModule[]>(initial?.modules ?? []);
  const [assignedUsers, setAssignedUsers] = useState<string[]>(initial?.assignedUsers ?? []);
  const [status, setStatus] = useState<"draft" | "published">(initial?.status ?? "draft");

  const addModule = () => {
    setModules((prev) => [...prev, { id: newId(), title: "", items: [] }]);
  };

  const updateModuleTitle = (idx: number, t: string) => {
    setModules((prev) => prev.map((m, i) => (i === idx ? { ...m, title: t } : m)));
  };

  const removeModule = (idx: number) => {
    setModules((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveModule = (idx: number, dir: -1 | 1) => {
    setModules((prev) => {
      const next = [...prev];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[idx], next[target]] = [next[target], next[idx]];
      return next;
    });
  };

  const addSource = (moduleIdx: number) => {
    setModules((prev) =>
      prev.map((m, i) =>
        i === moduleIdx ? { ...m, items: [...m.items, { id: newId(), title: "", type: "lecture" as SourceType }] } : m
      )
    );
  };

  const updateSource = (moduleIdx: number, itemIdx: number, updates: Partial<AdminSourceItem>) => {
    setModules((prev) =>
      prev.map((m, mi) =>
        mi === moduleIdx ? { ...m, items: m.items.map((s, si) => (si === itemIdx ? { ...s, ...updates } : s)) } : m
      )
    );
  };

  const removeSource = (moduleIdx: number, itemIdx: number) => {
    setModules((prev) =>
      prev.map((m, mi) =>
        mi === moduleIdx ? { ...m, items: m.items.filter((_, si) => si !== itemIdx) } : m
      )
    );
  };

  const moveSource = (moduleIdx: number, itemIdx: number, dir: -1 | 1) => {
    setModules((prev) =>
      prev.map((m, mi) => {
        if (mi !== moduleIdx) return m;
        const items = [...m.items];
        const target = itemIdx + dir;
        if (target < 0 || target >= items.length) return m;
        [items[itemIdx], items[target]] = [items[target], items[itemIdx]];
        return { ...m, items };
      })
    );
  };

  const toggleUser = (userId: string) => {
    setAssignedUsers((prev) => (prev.includes(userId) ? prev.filter((u) => u !== userId) : [...prev, userId]));
  };

  const handleSave = () => {
    if (!title.trim()) return;
    onSave({ title, description, modules, assignedUsers, status });
  };

  const totalSources = modules.reduce((acc, m) => acc + m.items.length, 0);

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-4xl mx-auto animate-fade-in">
      <button onClick={onCancel} className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-[13px] font-sans mb-6 transition-colors">
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
        Back to courses
      </button>

      <h1 className="font-serif text-3xl text-foreground mb-8">{initial ? "Edit Course" : "New Course"}</h1>

      {/* Details */}
      <section className="mb-8">
        <label className="block text-[12px] font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2">Title</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Course title"
          className="w-full h-10 px-3 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all"
        />
        <label className="block text-[12px] font-sans font-medium text-muted-foreground uppercase tracking-wider mb-2 mt-4">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Course description"
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all resize-none"
        />
      </section>

      {/* Modules & Sources */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-serif text-lg text-foreground">Modules & Sources</h2>
          <Button variant="outline" size="sm" onClick={addModule} className="text-[12px] gap-1.5">
            <Plus className="h-3.5 w-3.5" /> Add Module
          </Button>
        </div>
        {modules.length === 0 && (
          <p className="text-muted-foreground text-[13px] font-sans py-6 text-center border border-dashed border-border rounded-lg">No modules yet. Add a module to organize your course materials.</p>
        )}
        <div className="space-y-4">
          {modules.map((mod, mi) => (
            <div key={mod.id} className="border border-border rounded-xl bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={mod.title}
                  onChange={(e) => updateModuleTitle(mi, e.target.value)}
                  placeholder="Module title"
                  className="flex-1 h-8 px-2.5 rounded-md border border-input bg-background text-[13px] font-sans font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <button onClick={() => moveModule(mi, -1)} disabled={mi === 0} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 text-muted-foreground"><ArrowUp className="h-3.5 w-3.5" /></button>
                <button onClick={() => moveModule(mi, 1)} disabled={mi === modules.length - 1} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-muted disabled:opacity-30 text-muted-foreground"><ArrowDown className="h-3.5 w-3.5" /></button>
                <button onClick={() => removeModule(mi)} className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-destructive/10 text-destructive/70"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>

              {mod.items.length > 0 && (
                <div className="space-y-2 mb-3">
                  {mod.items.map((item, si) => (
                    <div key={item.id} className="flex items-center gap-2 pl-3">
                      <FileText className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" />
                      <input
                        value={item.title}
                        onChange={(e) => updateSource(mi, si, { title: e.target.value })}
                        placeholder="Source title"
                        className="flex-1 h-7 px-2 rounded-md border border-input bg-background text-[12px] font-sans placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/20"
                      />
                      <select
                        value={item.type}
                        onChange={(e) => updateSource(mi, si, { type: e.target.value as SourceType })}
                        className="h-7 px-2 rounded-md border border-input bg-background text-[11px] font-sans text-muted-foreground focus:outline-none"
                      >
                        {sourceTypes.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                      <button onClick={() => moveSource(mi, si, -1)} disabled={si === 0} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"><ArrowUp className="h-3 w-3" /></button>
                      <button onClick={() => moveSource(mi, si, 1)} disabled={si === mod.items.length - 1} className="h-6 w-6 flex items-center justify-center rounded hover:bg-muted disabled:opacity-30 text-muted-foreground"><ArrowDown className="h-3 w-3" /></button>
                      <button onClick={() => removeSource(mi, si)} className="h-6 w-6 flex items-center justify-center rounded hover:bg-destructive/10 text-destructive/70"><Trash2 className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={() => addSource(mi)} className="text-[11px] font-sans text-accent hover:text-accent/80 flex items-center gap-1 pl-3 transition-colors">
                <Plus className="h-3 w-3" /> Add source
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Assign Users */}
      <section className="mb-8">
        <h2 className="font-serif text-lg text-foreground mb-3">Assign Users</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {mockUsers.map((user) => {
            const selected = assignedUsers.includes(user.id);
            return (
              <button
                key={user.id}
                onClick={() => toggleUser(user.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all text-[13px] font-sans ${
                  selected ? "border-accent/40 bg-accent/5 text-foreground" : "border-border bg-card text-muted-foreground hover:border-accent/20"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-medium shrink-0 ${selected ? "bg-accent/15 text-accent" : "bg-muted text-muted-foreground"}`}>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{user.name}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="flex items-center gap-2 text-[12px] font-sans text-muted-foreground">
          <span>{modules.length} modules</span>
          <span>·</span>
          <span>{totalSources} sources</span>
          <span>·</span>
          <span>{assignedUsers.length} users</span>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => { setStatus(status === "draft" ? "published" : "draft"); }} className="text-[12px] gap-1.5">
            {status === "draft" ? <Globe className="h-3.5 w-3.5" /> : <GlobeLock className="h-3.5 w-3.5" />}
            {status === "draft" ? "Set Published" : "Set Draft"}
          </Button>
          <Button size="sm" onClick={handleSave} disabled={!title.trim()} className="text-[12px]">
            {initial ? "Save Changes" : "Create Course"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Admin Studio ──────────────────────────────────────

const AdminStudio = () => {
  const { adminCourses, addAdminCourse, updateAdminCourse, deleteAdminCourse, publishCourse, unpublishCourse } = useWorkspace();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  if (creating) {
    return (
      <CourseEditor
        onSave={(data) => {
          addAdminCourse(data);
          setCreating(false);
        }}
        onCancel={() => setCreating(false)}
      />
    );
  }

  const editingCourse = editingId ? adminCourses.find((c) => c.id === editingId) : null;
  if (editingCourse) {
    return (
      <CourseEditor
        initial={editingCourse}
        onSave={(data) => {
          updateAdminCourse(editingId!, data);
          setEditingId(null);
        }}
        onCancel={() => setEditingId(null)}
      />
    );
  }

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-2.5 mb-1.5">
          <Shield className="h-5 w-5 text-accent/70" strokeWidth={1.5} />
          <h1 className="font-serif text-4xl text-foreground leading-[1.1]">Admin Studio</h1>
        </div>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Create, manage, and publish courses for your learners.</p>
      </div>

      <div className="flex justify-end mb-6 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <Button onClick={() => setCreating(true)} className="text-[13px] gap-1.5">
          <Plus className="h-4 w-4" /> New Course
        </Button>
      </div>

      {adminCourses.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <BookOpen className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm">No courses yet. Create your first course.</p>
        </div>
      ) : (
        <div className="space-y-3 animate-fade-in [animation-delay:120ms] [animation-fill-mode:backwards]">
          {adminCourses.map((course) => {
            const sourceCount = course.modules.reduce((acc, m) => acc + m.items.length, 0);
            return (
              <div key={course.id} className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 hover:border-accent/20 transition-all">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-serif text-[1rem] text-foreground truncate">{course.title}</h3>
                    <Badge variant={course.status === "published" ? "default" : "secondary"} className="text-[10px] shrink-0">
                      {course.status === "published" ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground">
                    <span className="flex items-center gap-1"><FileText className="h-3 w-3" />{sourceCount} sources</span>
                    <span className="flex items-center gap-1"><Users className="h-3 w-3" />{course.assignedUsers.length} users</span>
                    <span>Updated {course.updatedAt}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingId(course.id)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  {course.status === "draft" ? (
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-accent" onClick={() => publishCourse(course.id)}>
                      <Globe className="h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => unpublishCourse(course.id)}>
                      <GlobeLock className="h-3.5 w-3.5" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive/70 hover:text-destructive" onClick={() => deleteAdminCourse(course.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminStudio;
