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
const AMBER_HOVER = "#B8862E";
const AMBER_LIGHT = "rgba(201, 150, 58, 0.08)";
const ROW_HOVER = "rgba(201, 150, 58, 0.04)";

type TabFilter = "all" | "active" | "draft" | "archived";
type DeployPathway = null | "preloaded" | "custom" | "commission";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = "w-full h-9 px-3 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white";
const inputBorder = { border: "1px solid rgba(0,0,0,0.12)" };

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

  const statusColor = (s: CourseStatus): React.CSSProperties => {
    switch (s) {
      case "active": return { backgroundColor: "rgba(34,197,94,0.08)", color: "#16a34a" };
      case "draft": return { backgroundColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.5)" };
      case "archived": return { backgroundColor: "rgba(201,150,58,0.08)", color: AMBER };
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

  const primaryBtn: React.CSSProperties = {
    backgroundColor: "#1A1A1A", color: "#fff", borderRadius: 8,
  };
  const secondaryBtn: React.CSSProperties = {
    backgroundColor: "transparent", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 8, color: "rgba(0,0,0,0.65)",
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Courses</h1>
          <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>Manage deployed courses and create new ones</p>
        </div>
        <button onClick={openDeploy} className="flex items-center gap-2 px-4 py-2.5 text-[13px] font-medium transition-colors hover:opacity-90" style={primaryBtn}>
          <Plus className="h-4 w-4" /> Deploy New Course
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: tab === t.value ? "#fff" : "transparent",
                color: tab === t.value ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.45)",
                boxShadow: tab === t.value ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                borderBottom: tab === t.value ? `2px solid ${AMBER}` : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className={cn(inputStyle, "pl-9 pr-3")} style={inputBorder}
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={cardStyle}>
          <GraduationCapIcon />
          <p className="text-sm mt-2" style={{ color: "rgba(0,0,0,0.45)" }}>No courses found</p>
          <button onClick={openDeploy} className="mt-3 text-sm font-medium hover:underline" style={{ color: AMBER }}>Deploy your first course</button>
        </div>
      ) : (
        <div className="overflow-hidden" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["Course Name", "Type", "Status", "Enrolled", "Mastery", "Deployed", ""].map((h, i) => (
                  <th key={i} className={cn(
                    "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                    i === 1 && "hidden md:table-cell",
                    i === 3 && "hidden lg:table-cell",
                    i === 4 && "hidden lg:table-cell",
                    i === 5 && "hidden xl:table-cell",
                  )} style={{ color: "rgba(0,0,0,0.4)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(course => (
                <tr
                  key={course.id}
                  className="transition-colors group"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = ROW_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-medium" style={{ color: "rgba(0,0,0,0.8)" }}>{course.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.45)" }}>{typeLabel(course.type)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium" style={statusColor(course.status)}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.6)" }}>{course.enrolledCount}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px]" style={{ color: "rgba(0,0,0,0.6)" }}>{course.masteryRate}%</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{course.dateDeployed}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {[Pencil, Archive, Users, Copy].map((Icon, i) => (
                        <button key={i} className="h-7 w-7 rounded-md flex items-center justify-center transition-colors" style={{ color: "rgba(0,0,0,0.3)" }}>
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
          <div className="fixed inset-0 bg-black/30 z-40" onClick={closeDeploy} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col overflow-hidden animate-slide-in-right" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <h2 className="text-base font-semibold" style={{ color: "rgba(0,0,0,0.85)" }}>
                {!pathway ? "Deploy New Course" : pathway === "preloaded" ? "Nexi Preloaded Courses" : pathway === "custom" ? "Upload Custom Content" : "Commission Content"}
              </h2>
              <button onClick={closeDeploy} className="h-8 w-8 rounded-md flex items-center justify-center" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Pathway selector */}
              {!pathway && (
                <div className="space-y-3">
                  <p className="text-[13px] mb-4" style={{ color: "rgba(0,0,0,0.45)" }}>Choose how you'd like to add a course:</p>
                  {([
                    { key: "preloaded" as const, title: "Nexi Preloaded", desc: "Browse and deploy from our curated course library" },
                    { key: "custom" as const, title: "Upload Custom Content", desc: "Upload your own files and build a course" },
                    { key: "commission" as const, title: "Commission Content", desc: "Request custom content from our team" },
                  ]).map(pw => (
                    <button
                      key={pw.key}
                      onClick={() => setPathway(pw.key)}
                      className="w-full flex items-center justify-between p-4 text-left transition-colors"
                      style={{ ...cardStyle, cursor: "pointer" }}
                      onMouseEnter={e => (e.currentTarget.style.backgroundColor = AMBER_LIGHT)}
                      onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#FFFFFF")}
                    >
                      <div>
                        <p className="text-[13px] font-medium" style={{ color: "rgba(0,0,0,0.8)" }}>{pw.title}</p>
                        <p className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{pw.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4" style={{ color: "rgba(0,0,0,0.25)" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* Preloaded */}
              {pathway === "preloaded" && (
                <div>
                  <button onClick={() => setPathway(null)} className="text-[12px] mb-4 flex items-center gap-1" style={{ color: "rgba(0,0,0,0.45)" }}>← Back</button>
                  <div className="grid grid-cols-1 gap-3">
                    {preloadedCourses.map(course => (
                      <div key={course.id} className="p-4 transition-colors" style={cardStyle}>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[13px] font-medium" style={{ color: "rgba(0,0,0,0.8)" }}>{course.title}</p>
                            <p className="text-[12px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>{course.description}</p>
                            <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>{course.category}</span>
                          </div>
                          <button
                            onClick={() => { toast.success(`${course.title} deployed successfully`); closeDeploy(); }}
                            className="shrink-0 ml-3 px-3 py-1.5 text-[12px] font-medium transition-colors hover:opacity-90"
                            style={primaryBtn}
                          >Deploy</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Upload */}
              {pathway === "custom" && (
                <div className="space-y-5">
                  <button onClick={() => setPathway(null)} className="text-[12px] mb-2 flex items-center gap-1" style={{ color: "rgba(0,0,0,0.45)" }}>← Back</button>

                  <div
                    onClick={handleFakeUpload}
                    className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                    style={{ borderColor: "rgba(0,0,0,0.12)" }}
                    onMouseEnter={e => (e.currentTarget.style.backgroundColor = AMBER_LIGHT)}
                    onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: "rgba(0,0,0,0.2)" }} />
                    <p className="text-[13px] font-medium" style={{ color: "rgba(0,0,0,0.6)" }}>Click to upload files</p>
                    <p className="text-[11px] mt-1" style={{ color: "rgba(0,0,0,0.35)" }}>PDF, DOCX, PPT, MP4, or URLs</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg px-3 py-2" style={{ border: "1px solid rgba(0,0,0,0.08)" }}>
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded flex items-center justify-center text-[10px] font-bold uppercase" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>{f.type}</div>
                            <div>
                              <p className="text-[12px] font-medium" style={{ color: "rgba(0,0,0,0.7)" }}>{f.name}</p>
                              <p className="text-[10px]" style={{ color: "rgba(0,0,0,0.35)" }}>{f.size}</p>
                            </div>
                          </div>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} style={{ color: "rgba(0,0,0,0.3)" }}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Course Title</label>
                    <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Enter course title" className={inputStyle} style={inputBorder} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Description</label>
                    <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="What is this course about?" rows={3} className="w-full px-3 py-2 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] resize-none" style={inputBorder} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Mastery Outcome</label>
                    <input value={customMastery} onChange={e => setCustomMastery(e.target.value)} placeholder="What does mastery mean for this course?" className={inputStyle} style={inputBorder} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Department</label>
                    <select value={customDept} onChange={e => setCustomDept(e.target.value)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => { toast.success("Course saved as draft"); closeDeploy(); }} className="flex-1 h-10 text-[13px] font-medium transition-colors" style={secondaryBtn}>
                      Save as Draft
                    </button>
                    <button onClick={() => { toast.success("Course deployed successfully"); closeDeploy(); }} className="flex-1 h-10 text-[13px] font-medium transition-colors hover:opacity-90" style={primaryBtn}>
                      Deploy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Commission */}
              {pathway === "commission" && (
                <div className="space-y-5">
                  <button onClick={() => setPathway(null)} className="text-[12px] mb-2 flex items-center gap-1" style={{ color: "rgba(0,0,0,0.45)" }}>← Back</button>
                  <p className="text-[13px]" style={{ color: "rgba(0,0,0,0.6)" }}>Describe what you need and our content team will work with you to build it.</p>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Objective</label>
                    <textarea value={commObjective} onChange={e => setCommObjective(e.target.value)} placeholder="Describe the learning objective and audience..." rows={4} className="w-full px-3 py-2 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] resize-none" style={inputBorder} />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-[0.08em] mb-1.5" style={{ color: "rgba(0,0,0,0.4)" }}>Timeline</label>
                    <select value={commTimeline} onChange={e => setCommTimeline(e.target.value)} className={cn(inputStyle, "bg-white")} style={inputBorder}>
                      <option>2 weeks</option>
                      <option>4 weeks</option>
                      <option>6 weeks</option>
                      <option>8+ weeks</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-[13px] cursor-pointer" style={{ color: "rgba(0,0,0,0.65)" }}>
                    <input type="checkbox" checked={commHasMaterials} onChange={e => setCommHasMaterials(e.target.checked)} className="rounded" style={{ borderColor: "rgba(0,0,0,0.2)" }} />
                    I have existing materials to provide
                  </label>
                  <button
                    onClick={() => { toast.success("Commission request submitted"); closeDeploy(); }}
                    className="w-full h-10 text-[13px] font-medium transition-colors hover:opacity-90 flex items-center justify-center gap-2"
                    style={primaryBtn}
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
    <svg className="h-10 w-10 mx-auto" style={{ color: "rgba(0,0,0,0.2)" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}
