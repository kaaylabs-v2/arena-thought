import { useState } from "react";
import { Building2, Users, GraduationCap, Plus, MoreHorizontal, Pencil } from "lucide-react";
import { departments, members, adminCourses, type Department } from "@/admin/data/mock-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose } from "@/components/ui/drawer";
import { toast } from "sonner";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const statCardStyle: React.CSSProperties = {
  ...cardStyle,
  padding: "20px 24px",
};

export default function AdminDepartmentsPage() {
  const [depts, setDepts] = useState<Department[]>(departments);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editDept, setEditDept] = useState<Department | null>(null);
  const [form, setForm] = useState({ name: "", description: "", manager: "" });

  const totalMembers = depts.reduce((s, d) => s + d.memberCount, 0);
  const totalCourses = depts.reduce((s, d) => s + d.coursesAssigned, 0);

  const openNew = () => {
    setEditDept(null);
    setForm({ name: "", description: "", manager: "" });
    setDrawerOpen(true);
  };

  const openEdit = (d: Department) => {
    setEditDept(d);
    setForm({ name: d.name, description: d.description, manager: d.manager });
    setDrawerOpen(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (editDept) {
      setDepts(prev => prev.map(d => d.id === editDept.id ? { ...d, ...form } : d));
      toast.success(`${form.name} updated`);
    } else {
      const newDept: Department = {
        id: `dept-${Date.now()}`,
        name: form.name,
        description: form.description,
        manager: form.manager,
        memberCount: 0,
        coursesAssigned: 0,
      };
      setDepts(prev => [...prev, newDept]);
      toast.success(`${form.name} created`);
    }
    setDrawerOpen(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Departments</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Organize learners into groups, teams, and cohorts</p>
        </div>
        <Button onClick={openNew} className="gap-2" style={{ backgroundColor: "#C9963A" }}>
          <Plus className="h-4 w-4" /> New Department
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div style={statCardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="h-4 w-4" style={{ color: "#C9963A" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>Departments</span>
          </div>
          <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{depts.length}</p>
        </div>
        <div style={statCardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4" style={{ color: "#C9963A" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>Total Members</span>
          </div>
          <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{totalMembers}</p>
        </div>
        <div style={statCardStyle}>
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="h-4 w-4" style={{ color: "#C9963A" }} />
            <span className="text-xs font-medium uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.4)" }}>Courses Assigned</span>
          </div>
          <p className="text-2xl font-serif" style={{ color: "rgba(0,0,0,0.85)" }}>{totalCourses}</p>
        </div>
      </div>

      {/* Department cards */}
      <div className="grid gap-4">
        {depts.map(dept => {
          const deptMembers = members.filter(m => m.department === dept.name);
          const deptCourses = adminCourses.filter(c => c.department === dept.name);
          return (
            <div key={dept.id} style={cardStyle} className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-serif text-lg" style={{ color: "rgba(0,0,0,0.85)" }}>{dept.name}</h3>
                    <Badge variant="outline" className="text-[10px]" style={{ borderColor: "rgba(201,150,58,0.3)", color: "#C9963A" }}>
                      {dept.memberCount} members
                    </Badge>
                  </div>
                  <p className="text-sm mb-3" style={{ color: "rgba(0,0,0,0.45)" }}>{dept.description}</p>
                  <div className="flex items-center gap-6 text-xs" style={{ color: "rgba(0,0,0,0.4)" }}>
                    <span>Manager: <span style={{ color: "rgba(0,0,0,0.7)" }}>{dept.manager}</span></span>
                    <span>{dept.coursesAssigned} courses assigned</span>
                  </div>

                  {/* Member avatars */}
                  {deptMembers.length > 0 && (
                    <div className="flex items-center gap-1 mt-3">
                      {deptMembers.slice(0, 5).map(m => (
                        <div key={m.id} className="h-7 w-7 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ backgroundColor: "rgba(201,150,58,0.1)", color: "#C9963A" }}>
                          {m.name.split(" ").map(n => n[0]).join("")}
                        </div>
                      ))}
                      {deptMembers.length > 5 && (
                        <span className="text-[11px] ml-1" style={{ color: "rgba(0,0,0,0.35)" }}>+{deptMembers.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {/* Courses */}
                  {deptCourses.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {deptCourses.map(c => (
                        <span key={c.id} className="text-[11px] px-2 py-0.5 rounded-full" style={{ backgroundColor: "rgba(201,150,58,0.06)", color: "rgba(0,0,0,0.5)" }}>
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <button onClick={() => openEdit(dept)} className="p-2 rounded-lg transition-colors hover:bg-black/5">
                  <Pencil className="h-3.5 w-3.5" style={{ color: "rgba(0,0,0,0.3)" }} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <div className="mx-auto w-full max-w-md">
            <DrawerHeader>
              <DrawerTitle className="font-serif">{editDept ? "Edit Department" : "New Department"}</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 space-y-4">
              <div>
                <Label className="text-xs">Name</Label>
                <Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engineering" />
              </div>
              <div>
                <Label className="text-xs">Description</Label>
                <Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description" />
              </div>
              <div>
                <Label className="text-xs">Manager</Label>
                <Input value={form.manager} onChange={e => setForm(f => ({ ...f, manager: e.target.value }))} placeholder="Manager name" />
              </div>
            </div>
            <DrawerFooter>
              <Button onClick={handleSave} style={{ backgroundColor: "#C9963A" }}>{editDept ? "Save Changes" : "Create Department"}</Button>
              <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </div>
  );
}
