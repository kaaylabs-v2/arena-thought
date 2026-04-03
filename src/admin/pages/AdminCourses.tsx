import { useState } from "react";
import { Search, Plus, Filter, MoreHorizontal, Archive, Copy, Users, Pencil, X, Upload, ChevronRight, Check, Send } from "lucide-react";
import { toast } from "sonner";
import {
  adminCourses as seedCourses,
  preloadedCourses,
  departments,
  type AdminCourseItem,
  type CourseStatus,
} from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

type TabFilter = "all" | "active" | "draft" | "archived";
type DeployPathway = null | "preloaded" | "custom" | "commission";

export default function AdminCoursesPage() {
  const [courses] = useState<AdminCourseItem[]>(seedCourses);
  const [tab, setTab] = useState<TabFilter>("all");
  const [search, setSearch] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [pathway, setPathway] = useState<DeployPathway>(null);

  // Custom upload state
  const [customTitle, setCustomTitle] = useState("");
  const [customDesc, setCustomDesc] = useState("");
  const [customMastery, setCustomMastery] = useState("");
  const [customDept, setCustomDept] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  // Commission state
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

  const statusColor = (s: CourseStatus) => {
    switch (s) {
      case "active": return "bg-emerald-50 text-emerald-700";
      case "draft": return "bg-slate-100 text-slate-600";
      case "archived": return "bg-orange-50 text-orange-600";
    }
  };

  const openDeploy = () => {
    setDrawerOpen(true);
    setPathway(null);
  };

  const closeDeploy = () => {
    setDrawerOpen(false);
    setPathway(null);
    setCustomTitle("");
    setCustomDesc("");
    setCustomMastery("");
    setCustomDept("");
    setUploadedFiles([]);
    setCommObjective("");
    setCommHasMaterials(false);
  };

  const handleFakeUpload = () => {
    const fakeFiles = [
      { name: "Module_1_Intro.pdf", size: "2.1 MB", type: "pdf" },
      { name: "Workshop_Recording.mp4", size: "145 MB", type: "video" },
    ];
    setUploadedFiles(prev => [...prev, ...fakeFiles]);
  };

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Courses</h1>
          <p className="text-sm text-slate-500 mt-0.5">Manage deployed courses and create new ones</p>
        </div>
        <button
          onClick={openDeploy}
          className="flex items-center gap-2 rounded-lg bg-slate-900 text-white px-4 py-2.5 text-[13px] font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="h-4 w-4" /> Deploy New Course
        </button>
      </div>

      {/* Tabs + Search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {tabs.map(t => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                tab === t.value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 bg-white text-[13px] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/10 focus:border-slate-300"
          />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
          <GraduationCapIcon />
          <p className="text-sm text-slate-500 mt-2">No courses found</p>
          <button onClick={openDeploy} className="mt-3 text-sm font-medium text-slate-900 hover:underline">
            Deploy your first course
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Course Name</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Enrolled</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden lg:table-cell">Mastery</th>
                <th className="px-5 py-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider hidden xl:table-cell">Deployed</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(course => (
                <tr key={course.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="text-[13px] font-medium text-slate-800">{course.name}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px] text-slate-500">{typeLabel(course.type)}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={cn("inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium", statusColor(course.status))}>
                      {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px] text-slate-600">{course.enrolledCount}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[13px] text-slate-600">{course.masteryRate}%</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px] text-slate-400">{course.dateDeployed}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1">
                      <button className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Pencil className="h-3.5 w-3.5" /></button>
                      <button className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Archive className="h-3.5 w-3.5" /></button>
                      <button className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Users className="h-3.5 w-3.5" /></button>
                      <button className="h-7 w-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600"><Copy className="h-3.5 w-3.5" /></button>
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
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full bg-white z-50 shadow-xl border-l border-slate-200 flex flex-col overflow-hidden animate-slide-in-right">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-base font-semibold text-slate-900">
                {!pathway ? "Deploy New Course" : pathway === "preloaded" ? "Nexi Preloaded Courses" : pathway === "custom" ? "Upload Custom Content" : "Commission Content"}
              </h2>
              <button onClick={closeDeploy} className="h-8 w-8 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              {/* Pathway selector */}
              {!pathway && (
                <div className="space-y-3">
                  <p className="text-[13px] text-slate-500 mb-4">Choose how you'd like to add a course:</p>
                  {[
                    { key: "preloaded" as const, title: "Nexi Preloaded", desc: "Browse and deploy from our curated course library" },
                    { key: "custom" as const, title: "Upload Custom Content", desc: "Upload your own files and build a course" },
                    { key: "commission" as const, title: "Commission Content", desc: "Request custom content from our team" },
                  ].map(pw => (
                    <button
                      key={pw.key}
                      onClick={() => setPathway(pw.key)}
                      className="w-full flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left hover:bg-slate-50 hover:border-slate-300 transition-colors"
                    >
                      <div>
                        <p className="text-[13px] font-medium text-slate-800">{pw.title}</p>
                        <p className="text-[12px] text-slate-500 mt-0.5">{pw.desc}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400" />
                    </button>
                  ))}
                </div>
              )}

              {/* Preloaded */}
              {pathway === "preloaded" && (
                <div>
                  <button onClick={() => setPathway(null)} className="text-[12px] text-slate-500 hover:text-slate-700 mb-4 flex items-center gap-1">← Back</button>
                  <div className="grid grid-cols-1 gap-3">
                    {preloadedCourses.map(course => (
                      <div key={course.id} className="rounded-xl border border-slate-200 p-4 hover:border-slate-300 transition-colors">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="text-[13px] font-medium text-slate-800">{course.title}</p>
                            <p className="text-[12px] text-slate-500 mt-0.5">{course.description}</p>
                            <span className="inline-block mt-2 text-[10px] font-medium uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{course.category}</span>
                          </div>
                          <button
                            onClick={() => { toast.success(`${course.title} deployed successfully`); closeDeploy(); }}
                            className="shrink-0 ml-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[12px] font-medium hover:bg-slate-800 transition-colors"
                          >
                            Deploy
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Upload */}
              {pathway === "custom" && (
                <div className="space-y-5">
                  <button onClick={() => setPathway(null)} className="text-[12px] text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1">← Back</button>

                  {/* Upload area */}
                  <div
                    onClick={handleFakeUpload}
                    className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center cursor-pointer hover:border-slate-300 hover:bg-slate-50/50 transition-colors"
                  >
                    <Upload className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-[13px] text-slate-600 font-medium">Click to upload files</p>
                    <p className="text-[11px] text-slate-400 mt-1">PDF, DOCX, PPT, MP4, or URLs</p>
                  </div>

                  {uploadedFiles.length > 0 && (
                    <div className="space-y-2">
                      {uploadedFiles.map((f, i) => (
                        <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 px-3 py-2">
                          <div className="flex items-center gap-2">
                            <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">{f.type}</div>
                            <div>
                              <p className="text-[12px] text-slate-700 font-medium">{f.name}</p>
                              <p className="text-[10px] text-slate-400">{f.size}</p>
                            </div>
                          </div>
                          <button onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Course Title</label>
                    <input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="Enter course title" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
                    <textarea value={customDesc} onChange={e => setCustomDesc(e.target.value)} placeholder="What is this course about?" rows={3} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Mastery Outcome</label>
                    <input value={customMastery} onChange={e => setCustomMastery(e.target.value)} placeholder="What does mastery mean for this course?" className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900/10" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Department</label>
                    <select value={customDept} onChange={e => setCustomDept(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900/10 bg-white">
                      <option value="">Select department</option>
                      {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
                    </select>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => { toast.success("Course saved as draft"); closeDeploy(); }}
                      className="flex-1 h-10 rounded-lg border border-slate-200 text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      Save as Draft
                    </button>
                    <button
                      onClick={() => { toast.success("Course deployed successfully"); closeDeploy(); }}
                      className="flex-1 h-10 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors"
                    >
                      Deploy Now
                    </button>
                  </div>
                </div>
              )}

              {/* Commission */}
              {pathway === "commission" && (
                <div className="space-y-5">
                  <button onClick={() => setPathway(null)} className="text-[12px] text-slate-500 hover:text-slate-700 mb-2 flex items-center gap-1">← Back</button>
                  <p className="text-[13px] text-slate-600">Describe what you need and our content team will work with you to build it.</p>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Objective</label>
                    <textarea value={commObjective} onChange={e => setCommObjective(e.target.value)} placeholder="Describe the learning objective and audience..." rows={4} className="w-full px-3 py-2 rounded-lg border border-slate-200 text-[13px] focus:outline-none focus:ring-2 focus:ring-slate-900/10 resize-none" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5">Timeline</label>
                    <select value={commTimeline} onChange={e => setCommTimeline(e.target.value)} className="w-full h-9 px-3 rounded-lg border border-slate-200 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-slate-900/10">
                      <option>2 weeks</option>
                      <option>4 weeks</option>
                      <option>6 weeks</option>
                      <option>8+ weeks</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-[13px] text-slate-700 cursor-pointer">
                    <input type="checkbox" checked={commHasMaterials} onChange={e => setCommHasMaterials(e.target.checked)} className="rounded border-slate-300" />
                    I have existing materials to provide
                  </label>
                  <button
                    onClick={() => { toast.success("Commission request submitted"); closeDeploy(); }}
                    className="w-full h-10 rounded-lg bg-slate-900 text-white text-[13px] font-medium hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
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
    <svg className="h-10 w-10 text-slate-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
      <path d="M12 14l9-5-9-5-9 5 9 5z" />
      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
    </svg>
  );
}
