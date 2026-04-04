import { useState } from "react";
import { Building2, Users, GraduationCap, Plus, Pencil } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { Department } from "@/admin/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { toast } from "sonner";

export default function AdminDepartmentsPage() {
  const { studioDepartments, studioMembers: members, studioCourses: adminCourses } = useWorkspace();
  const [depts, setDepts] = useState<Department[]>(studioDepartments);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", description: "", manager: "" });

  const totalMembers = depts.reduce((s, d) => s + d.memberCount, 0);
  const totalCourses = depts.reduce((s, d) => s + d.coursesAssigned, 0);

  const openNew = () => { setEditDept(null); setForm({ name: "", description: "", manager: "" }); setDrawerOpen(true); };
  const openEdit = (d: Department) => { setEditDept(d); setForm({ name: d.name, description: d.description, manager: d.manager }); setDrawerOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editDept) {
      setDepts(prev => prev.map(d => d.id === editDept.id ? { ...d, ...form } : d));
      toast.success(`${form.name} updated`);
    } else {
      const newDept: Department = { id: `dept-${Date.now()}`, name: form.name, description: form.description, manager: form.manager, memberCount: 0, coursesAssigned: 0 };
      setDepts(prev => [...prev, newDept]);
      toast.success(`${form.name} created`);
    }
    setDrawerOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Departments</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Organize learners into groups, teams, and cohorts</p>
        </div>
        <Button onClick={openNew} className="btn-apple gap-2 bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8 stagger-children">
        {[
          { icon: Building2, label: "Departments", value: depts.length },
          { icon: Users, label: "Total Members", value: totalMembers },
          { icon: GraduationCap, label: "Courses Assigned", value: totalCourses },
        ].map((s, i) => (
          <div key={i} className="card-interactive p-5">
            <div className="flex items-center gap-2 mb-1">
              <s.icon className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-serif text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 stagger-children">
        {depts.map(dept => {
          const deptMembers = members.filter(m => m.department === dept.name);
          const deptCourses = adminCourses.filter(c => c.department === dept.name);
          return (
            <div key={dept.id} className="card-interactive p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-lg text-foreground">{dept.name}</h3>
                    <Badge variant="outline" className="text-[10px] border-accent/30 text-accent">
                      {dept.memberCount} members
                    </Badge>
                  </div>
                  <p className="text-sm mb-3 text-muted-foreground">{dept.description}</p>
                  <div className="flex items-center gap-6 text-xs text-muted-foreground">
                    <span>Manager: <span className="text-foreground/70">{dept.manager}</span></span>
                    <span>{dept.coursesAssigned} courses assigned</span>
                  </div>

                  {deptMembers.length > 0 && (
                    <div className="flex items-center gap-1 mt-3">
                      {deptMembers.slice(0, 5).map(m => (
                        <div key={m.id} className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium bg-accent/10 text-accent transition-transform duration-200 hover:scale-110">
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      ))}
                      {deptMembers.length > 5 && (
                        <span className="text-[11px] ml-1 text-muted-foreground">+{deptMembers.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {deptCourses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {deptCourses.map(c => (
                        <span key={c.id} className="text-[11px] px-2 py-0.5 rounded-full bg-accent/5 text-muted-foreground transition-colors duration-200 hover:bg-accent/10">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => openEdit(dept)} className="toolbar-btn p-2 rounded-lg">
                  <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="font-serif">{editDept ? "Edit Department" : "New Department"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div><Label className="text-xs">Name</Label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" /></div>
              <div><Label className="text-xs">Description</Label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" /></div>
              <div><Label className="text-xs">Manager</Label><Input value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} placeholder="Manager name" /></div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSave} className="btn-apple bg-accent text-accent-foreground hover:bg-accent/90">{editDept ? "Save Changes" : "Create Department"}</Button>
              <DrawerClose asChild><Button variant="outline" className="btn-ghost">Cancel</Button></DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
