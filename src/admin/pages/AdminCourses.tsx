import { useState } from "react";
import { Search, Plus, Archive, Copy, Users, Pencil, X, Upload, ChevronRight, Check, Send } from "lucide-react";
import { toast } from "sonner";
import {
  adminCourses as seedCourses,
  preloadedCourses,
  departments,
  type AdminCourseItem,
  type CourseStatus,
} from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

const AMBER = "#C9963A";

type TabFilter = "all" | "active" | "draft" | "archived";
type DeployPathway = null | "preloaded" | "custom" | "commission";

export default function AdminCoursesPage() {
  const [courses] = useState<AdminCourseItem[]>(seedCourses);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pathway, setPathway] = useState<DeployPathway>(null);

  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customMastery, setCustomMastery] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  const [commObjective, setCommObjective] = useState("");
  const [commTimeline, setCommTimeline] = useState("4 weeks");
  const [commHasMaterials, setCommHasMaterials] = useState(false);

  const tabs: { value: TabFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "draft", label: "Draft" },
    { value: "archived", label: "Archived" },
  ];

  const filtered = courses
    .filter(c => tab === "all" || c.status === tab)
    .filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  const typeLabel = (t: AdminCourseItem["type"]) => {
    switch (t) {
      case "nexi_preloaded": return "Nexi Preloaded";
      case "custom": return "Custom";
      case "commissioned": return "Commissioned";
    }
  };

  const statusColor = (s: CourseStatus): string => {
    switch (s) {
      case "active": return "bg-green-500/10 text-green-600 dark:text-green-400";
      case "draft": return "bg-muted text-muted-foreground";
      case "archived": return "bg-accent/10 text-accent";
    }
  };

  const openDeploy = () => { setDrawerOpen(true); setPathway(null); };
  const closeDeploy = () => {
    setDrawerOpen(false); setPathway(null);
    setCustomTitle(""); setCustomDesc(""); setCustomMastery(""); setCustomDept("");
    setUploadedFiles([]); setCommObjective(""); setCommHasMaterials(false);
  };

  const handleFakeUpload = () => {
    setUploadedFiles(prev => [...prev,
      { name: "Module_1_Intro.pdf", size: "2.1 MB", type: "pdf" },
      { name: "Workshop_Recording.mp4", size: "145 MB", type: "video" },
    ]);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Courses</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Manage deployed courses and create new ones</p>
        </div>
        <button onClick={openDeploy} className="btn-apple flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">
          <Plus className="h-4 w-4" /> Deploy New Course
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 rounded-lg p-1 bg-muted/50">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "segment-pill px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                tab === t.value
                  ? "bg-card text-foreground shadow-sm border-b-2 border-accent"
                  : "text-muted-foreground"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full h-9 pl-9 pr-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 card-interactive">
          <GraduationCapIcon />
          <p className="text-sm mt-2 text-muted-foreground">No courses found</p>
          <button onClick={openDeploy} className="mt-3 text-sm font-medium hover:underline text-accent">Deploy your first course</button>
        </div>
      ) : (
        <div className="overflow-hidden card-interactive">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["Course Name", "Type", "Status", "Enrolled", "Mastery", "Deployed", ""].map((h, i) => (
                  <th key={i} className={cn(
                    "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground",
                    i === 1 && "hidden md:table-cell",
                    i === 3 && "hidden lg:table-cell",
                    i === 4 && "hidden lg:table-cell",
                    i === 5 && "hidden xl:table-cell",
                  )}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(course => (
                <tr key={course.id} className="transition-colors duration-200 group border-b border-border hover:bg-accent/5">
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-medium text-foreground/80">{course.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px] text-muted-foreground">{typeLabel(course.type)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium", statusColor(course.status))}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px] text-foreground/60">{course.enrolledCount}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px] text-foreground/60">{course.masteryRate}%</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px] text-muted-foreground/60">{course.dateDeployed}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      {[Pencil, Archive, Users, Copy].map((Icon, i) => (
                        <button key={i} className="toolbar-btn h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground">
                          <Icon className="h-3.5 w-3.5" />
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deploy Drawer */}
      {drawerOpen && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40 animate-fade-in-gentle" onClick={closeDeploy} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">
                {!pathway ? "Deploy New Course" : pathway === "preloaded" ? "Nexi Preloaded Courses" : pathway === "custom" ? "Upload Custom Content" : "Commission Content"}
              </h2>
              <button onClick={closeDeploy} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
              {!pathway && (
                <div className="space-y-3 stagger-children">
                  <p className="text-[13px] mb-4 text-muted-foreground">Choose how you'd like to add a course:</p>
                  {([
                    { key: "preloaded" as const, title: "Nexi Preloaded", desc: "Browse and deploy from our curated course library" },
                    { key: "custom" as const, title: "Upload Custom Content", desc: "Upload your own files and build a course" },
                    { key: "commission" as const, title: "Commission Content", desc: "Request custom content from our team" },
                  ]).map(pw => (
                    <button
                      key={pw.key}
                      onClick={() => setPathway(pw.key)}
                      className="card-interactive w-full flex items-center justify-between p-4 text-left cursor-pointer"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-foreground/80">{pw.title}</p>
                        <p className="text-[12px] mt-0.5 text-muted-foreground">{pw.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-muted-foreground/40" />
                    </button>
                  ))}
                </div>
              )}

              {pathway === "preloaded" && (
                <div className="animate-fade-in-fast">
                  <button onClick={() => setPathway(null)} className="btn-ghost text-[12px] mb-4 flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground">← Back</button>
                  <div className="grid grid-cols-1 gap-3 stagger-children">
                    {preloadedCourses.map(course => (
                      <div key={course.id} className="card-interactive p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-foreground/80">{course.title}</p>
                            <p className="text-[12px] mt-0.5 text-muted-foreground">{course.description}</p>
                            <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full bg-accent/10 text-accent">{course.category}</span>
                          </div>
                          <button
                            onClick={() => { toast.success(`${course.title} deployed successfully`); closeDeploy(); }}
                            className="btn-apple shrink-0 ml-3 px-3 py-1.5 text-[12px] font-medium bg-primary text-primary-foreground rounded-lg"
                          >Deploy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {pathway === "custom" && (
                <div className="space-y-5 animate-fade-in-fast">
                  <button onClick={() => setPathway(null)} className="btn-ghost text-[12px] mb-2 flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground">← Back</button>
                  <div
                    onClick={handleFakeUpload}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-250 border-border hover:bg-accent/5 hover:border-accent/30 active:scale-[0.99]"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
                    <p className="text-[13px] font-medium text-foreground/60">Click to upload files</p>
                    <p className="text-[11px] mt-1 text-muted-foreground">PDF, DOCX, PPT, MP4, or URLs</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2 stagger-children">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2 border border-border transition-colors duration-200 hover:bg-muted/30">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded flex items-center justify-center text-[10px] font-bold uppercase bg-accent/10 text-accent">{f.type}</div>
                            <div>
                              <p className="text-[12px] font-medium text-foreground/70">{f.name}</p>
                              <p className="text-[10px] text-muted-foreground">{f.size}</p>
                            </div>
                          </div>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="toolbar-btn text-muted-foreground hover:text-foreground p-1 rounded-md">
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Course Title</label>
                    <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Enter course title" className="w-full h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Description</label>
                    <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="What is this course about?" rows={3} className="w-full px-3 py-2 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-shadow duration-200" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Mastery Outcome</label>
                    <input value={customMastery} onChange={e => setCustomMastery(e.target.value)} placeholder="What does mastery mean for this course?" className="w-full h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Department</label>
                    <select value={customDept} onChange={e => setCustomDept(e.target.value)} className="w-full h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none transition-shadow duration-200">
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { toast.success("Course saved as draft"); closeDeploy(); }} className="btn-ghost flex-1 h-10 text-[13px] font-medium border border-border rounded-lg text-foreground/65 hover:bg-muted">
                      Save as Draft
                    </button>
                    <button onClick={() => { toast.success("Course deployed successfully"); closeDeploy(); }} className="btn-apple flex-1 h-10 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">
                      Deploy Now
                    </button>
                  </div>
                </div>
              )}

              {pathway === "commission" && (
                <div className="space-y-5 animate-fade-in-fast">
                  <button onClick={() => setPathway(null)} className="btn-ghost text-[12px] mb-2 flex items-center gap-1 px-2 py-1 rounded-md text-muted-foreground">← Back</button>
                  <p className="text-[13px] text-foreground/60">Describe what you need and our content team will work with you to build it.</p>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Objective</label>
                    <textarea value={commObjective} onChange={e => setCommObjective(e.target.value)} placeholder="Describe the learning objective and audience..." rows={4} className="w-full px-3 py-2 rounded-lg text-[13px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 resize-none transition-shadow duration-200" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5 text-muted-foreground">Timeline</label>
                    <select value={commTimeline} onChange={e => setCommTimeline(e.target.value)} className="w-full h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none transition-shadow duration-200">
                      <option>2 weeks</option>
                      <option>4 weeks</option>
                      <option>6 weeks</option>
                      <option>8+ weeks</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-[13px] cursor-pointer text-foreground/65">
                    <input type="checkbox" checked={commHasMaterials} onChange={e => setCommHasMaterials(e.target.checked)} className="rounded border-border" />
                    I have existing materials to provide
                  </label>
                  <button
                    onClick={() => { toast.success("Commission request submitted"); closeDeploy(); }}
                    className="btn-apple w-full h-10 text-[13px] font-medium flex items-center justify-center gap-2 bg-primary text-primary-foreground rounded-lg"
                  >
                    <Send className="h-4 w-4" /> Submit Request
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function GraduationCapIcon() {
  return (
    <svg className="h-10 w-10 mx-auto text-muted-foreground/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}
