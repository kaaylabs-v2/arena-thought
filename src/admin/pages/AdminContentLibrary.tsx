import { useState } from "react";
import {
  Search, FileText, Video, Presentation, FileIcon, Link2,
  LayoutGrid, List, Upload, X, Play, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type FileType = "pdf" | "video" | "slides" | "doc" | "link";

interface ContentFile {
  id: string; fileName: string; fileType: FileType; linkedCourse: string;
  module: string; uploadDate: string; uploaderName: string; fileSize: string;
}

const seedFiles: ContentFile[] = [
  { id: "f-1", fileName: "Introduction to Python.pdf", fileType: "pdf", linkedCourse: "Python Fundamentals", module: "Module 1", uploadDate: "2025-09-28", uploaderName: "Jordan Reeves", fileSize: "2.4 MB" },
  { id: "f-2", fileName: "Week 2 Lecture Slides.pptx", fileType: "slides", linkedCourse: "Python Fundamentals", module: "Module 2", uploadDate: "2025-10-05", uploaderName: "Jordan Reeves", fileSize: "5.1 MB" },
  { id: "f-3", fileName: "Neural Networks Overview", fileType: "link", linkedCourse: "Python Fundamentals", module: "Module 3", uploadDate: "2025-10-12", uploaderName: "Priya Sharma", fileSize: "—" },
  { id: "f-4", fileName: "Leadership Framework.pdf", fileType: "pdf", linkedCourse: "Leadership Basics", module: "Module 1", uploadDate: "2025-11-10", uploaderName: "Marcus Chen", fileSize: "1.8 MB" },
  { id: "f-5", fileName: "Case Study Video.mp4", fileType: "video", linkedCourse: "Leadership Basics", module: "Module 2", uploadDate: "2025-11-15", uploaderName: "Marcus Chen", fileSize: "84 MB" },
  { id: "f-6", fileName: "GDPR Guidelines.pdf", fileType: "pdf", linkedCourse: "Data Privacy & Compliance", module: "Module 1", uploadDate: "2025-09-18", uploaderName: "Elena Vasquez", fileSize: "3.2 MB" },
  { id: "f-7", fileName: "Compliance Checklist.docx", fileType: "doc", linkedCourse: "Data Privacy & Compliance", module: "Module 1", uploadDate: "2025-09-20", uploaderName: "Jordan Reeves", fileSize: "0.4 MB" },
  { id: "f-8", fileName: "Training Video: Data Handling.mp4", fileType: "video", linkedCourse: "Data Privacy & Compliance", module: "Module 3", uploadDate: "2025-09-22", uploaderName: "Elena Vasquez", fileSize: "120 MB" },
  { id: "f-9", fileName: "PM Methodology Guide.pdf", fileType: "pdf", linkedCourse: "Project Management Essentials", module: "Module 1", uploadDate: "2026-02-15", uploaderName: "Jordan Reeves", fileSize: "4.7 MB" },
  { id: "f-10", fileName: "Project Charter Template.docx", fileType: "doc", linkedCourse: "Project Management Essentials", module: "Module 2", uploadDate: "2026-02-20", uploaderName: "Jordan Reeves", fileSize: "0.6 MB" },
];

const AMBER = "#C9963A";
type TypeFilter = "all" | FileType;
type ViewMode = "grid" | "list";

const typeIcon = (t: FileType, size = "h-4 w-4") => {
  const props = { className: size, strokeWidth: 1.5 };
  switch (t) { case "pdf": return <FileText {...props} />; case "video": return <Video {...props} />; case "slides": return <Presentation {...props} />; case "doc": return <FileIcon {...props} />; case "link": return <Link2 {...props} />; }
};
const typeLabel = (t: FileType) => { switch (t) { case "pdf": return "PDF"; case "video": return "Video"; case "slides": return "Slides"; case "doc": return "Document"; case "link": return "Link"; } };
const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

export default function AdminContentLibraryPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [previewFile, setPreviewFile] = useState<ContentFile | null>(null);

  const uniqueCourses = [...new Set(seedFiles.map(f => f.linkedCourse))];
  const filtered = seedFiles
    .filter(f => typeFilter === "all" || f.fileType === typeFilter)
    .filter(f => courseFilter === "all" || f.linkedCourse === courseFilter)
    .filter(f => f.fileName.toLowerCase().includes(search.toLowerCase()) || f.linkedCourse.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Content Library</h1>
        <p className="text-[14px] mt-0.5 text-muted-foreground font-sans">All uploaded files and sources across all courses</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files..." className="w-full h-9 pl-9 pr-3 rounded-lg text-[14px] bg-background border border-input focus:outline-none focus:ring-2 focus:ring-accent/30 transition-shadow duration-200" />
          </div>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as TypeFilter)} className="h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none transition-shadow duration-200">
            <option value="all">All Types</option><option value="pdf">PDF</option><option value="video">Video</option><option value="slides">Slides</option><option value="doc">Document</option><option value="link">Link</option>
          </select>
          <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} className="h-9 px-3 rounded-lg text-[13px] bg-background border border-input focus:outline-none hidden lg:block transition-shadow duration-200">
            <option value="all">All Courses</option>{uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-border">
            <button onClick={() => setViewMode("grid")} className={cn("segment-pill h-9 w-9 flex items-center justify-center transition-colors", viewMode === "grid" ? "bg-accent/12 text-accent" : "text-muted-foreground")}>
              <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button onClick={() => setViewMode("list")} className={cn("segment-pill h-9 w-9 flex items-center justify-center border-l border-border transition-colors", viewMode === "list" ? "bg-accent/12 text-accent" : "text-muted-foreground")}>
              <List className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <button onClick={() => toast("Upload available through Course deployment", { description: "Files are uploaded within course context for proper organization." })} className="btn-apple flex items-center gap-2 px-4 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">
            <Upload className="h-4 w-4" /> Upload File
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 card-interactive">
          <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3 bg-accent/10"><FileText className="h-5 w-5 text-accent" /></div>
          <p className="text-sm font-medium mb-1 text-foreground/60">No files found</p>
          <p className="text-xs mb-4 text-muted-foreground">Try adjusting your filters or search</p>
          <button onClick={() => { setSearch(""); setTypeFilter("all"); setCourseFilter("all"); }} className="btn-apple px-4 py-2 text-[13px] font-medium bg-primary text-primary-foreground rounded-lg">Clear Filters</button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 stagger-children">
          {filtered.map(file => (
            <div key={file.id} className="card-interactive p-4 cursor-pointer" onClick={() => setPreviewFile(file)}>
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3 bg-accent/10 text-accent">{typeIcon(file.fileType, "h-5 w-5")}</div>
              <p className="text-[14px] font-medium leading-snug line-clamp-2 mb-2 text-foreground font-sans">{file.fileName}</p>
              <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium mb-1 bg-accent/10 text-accent">{file.linkedCourse}</span>
              <p className="text-[12px] text-muted-foreground font-sans">{file.module}</p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground/60">{file.uploadDate}</span>
                  <span className="text-[11px] text-muted-foreground/40">·</span>
                  <span className="text-[11px] text-muted-foreground/60">{file.fileSize}</span>
                </div>
                <div className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-medium bg-accent/15 text-accent">{initials(file.uploaderName)}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-hidden card-interactive">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                {["File", "Type", "Course", "Module", "Uploaded", "Size", "Uploader"].map((h, i) => (
                  <th key={i} className={cn("px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground", i === 3 && "hidden md:table-cell", i === 4 && "hidden lg:table-cell", i === 5 && "hidden lg:table-cell", i === 6 && "hidden xl:table-cell")}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(file => (
                <tr key={file.id} className="transition-colors duration-200 cursor-pointer border-b border-border/50 hover:bg-accent/5" onClick={() => setPreviewFile(file)}>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0 bg-accent/10 text-accent">{typeIcon(file.fileType)}</div>
                      <span className="text-[13px] font-medium truncate text-foreground/80">{file.fileName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5"><span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium uppercase bg-accent/10 text-accent">{typeLabel(file.fileType)}</span></td>
                  <td className="px-5 py-3.5"><span className="text-[12px] text-muted-foreground">{file.linkedCourse}</span></td>
                  <td className="px-5 py-3.5 hidden md:table-cell"><span className="text-[12px] text-muted-foreground">{file.module}</span></td>
                  <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-[12px] text-muted-foreground/60">{file.uploadDate}</span></td>
                  <td className="px-5 py-3.5 hidden lg:table-cell"><span className="text-[12px] text-muted-foreground/60">{file.fileSize}</span></td>
                  <td className="px-5 py-3.5 hidden xl:table-cell"><span className="text-[12px] text-muted-foreground">{file.uploaderName}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex items-center gap-4 mt-4 text-[12px] text-muted-foreground/60">
        <span>{filtered.length} files</span><span>·</span>
        <span>{seedFiles.filter(f => f.fileType === "pdf").length} PDFs</span><span>·</span>
        <span>{seedFiles.filter(f => f.fileType === "video").length} videos</span><span>·</span>
        <span>{uniqueCourses.length} courses</span>
      </div>

      {/* File Preview Drawer */}
      {previewFile && (
        <>
          <div className="fixed inset-0 z-40 bg-black/25 animate-fade-in-gentle" onClick={() => setPreviewFile(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col animate-slide-in-right bg-card border-l border-border">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0 bg-accent/10 text-accent">{typeIcon(previewFile.fileType)}</div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold truncate text-foreground">{previewFile.fileName}</p>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase bg-accent/10 text-accent">{typeLabel(previewFile.fileType)}</span>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="toolbar-btn h-8 w-8 rounded-md flex items-center justify-center shrink-0 text-muted-foreground"><X className="h-4 w-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 text-muted-foreground">Details</p>
                <div className="space-y-2.5">
                  {[{ label: "COURSE", value: previewFile.linkedCourse }, { label: "MODULE", value: previewFile.module }, { label: "UPLOADED BY", value: previewFile.uploaderName }, { label: "UPLOAD DATE", value: previewFile.uploadDate }, { label: "FILE SIZE", value: previewFile.fileSize }].map((row, i) => (
                    <div key={i} className="setting-row flex items-center justify-between py-1.5 px-2 -mx-2 rounded-lg">
                      <span className="text-[11px] uppercase tracking-wider text-muted-foreground/60">{row.label}</span>
                      <span className="text-[14px] text-foreground/75 font-sans">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3 text-muted-foreground">Preview</p>
                {(previewFile.fileType === "pdf" || previewFile.fileType === "doc" || previewFile.fileType === "slides") && (
                  <div className="rounded-lg p-4 bg-muted/30 border border-border">
                    <p className="text-[13px] leading-relaxed text-muted-foreground">This document covers the foundational concepts and frameworks essential for understanding the subject matter. Key topics include theoretical foundations, practical applications, and assessment criteria aligned with mastery definitions.</p>
                    <p className="text-[13px] leading-relaxed mt-3 text-muted-foreground">Learners are expected to engage with the material critically, drawing connections to their professional context and demonstrating comprehension through structured reflections and applied exercises.</p>
                  </div>
                )}
                {previewFile.fileType === "video" && (
                  <div className="rounded-lg overflow-hidden flex items-center justify-center bg-primary" style={{ aspectRatio: "16/9" }}>
                    <Play className="h-8 w-8 text-primary-foreground opacity-70" />
                  </div>
                )}
                {previewFile.fileType === "link" && (
                  <div className="rounded-lg p-3 bg-muted/30 border border-border">
                    <code className="text-[13px] break-all text-muted-foreground font-mono">
                      https://resources.meridian.edu/{previewFile.linkedCourse.toLowerCase().replace(/ /g, "-")}/{previewFile.module.toLowerCase().replace(/ /g, "-")}
                    </code>
                  </div>
                )}
              </div>
            </div>
            <div className="px-6 py-4 border-t border-border">
              <button className="flex items-center gap-2 text-[13px] font-medium text-accent transition-colors duration-200 hover:text-accent/80">View in Course <ExternalLink className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
