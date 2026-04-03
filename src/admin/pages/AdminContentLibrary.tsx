import { useState } from "react";
import {
  Search, FileText, Video, Presentation, FileIcon, Link2,
  LayoutGrid, List, Upload, X, Play, ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Types ──────────────────────────────────────────────────

type FileType = "pdf" | "video" | "slides" | "doc" | "link";

interface ContentFile {
  id: string;
  fileName: string;
  fileType: FileType;
  linkedCourse: string;
  module: string;
  uploadDate: string;
  uploaderName: string;
  fileSize: string;
}

// ─── Seed data ──────────────────────────────────────────────

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

// ─── Styles ─────────────────────────────────────────────────

const AMBER = "#C9963A";
const ROW_HOVER = "rgba(201,150,58,0.04)";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.07)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = "w-full h-9 px-3 rounded-lg text-[14px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white";
const inputBorder: React.CSSProperties = { border: "1px solid rgba(0,0,0,0.12)" };
const primaryBtn: React.CSSProperties = { backgroundColor: "#1A1A1A", color: "#fff", borderRadius: 8 };

type TypeFilter = "all" | FileType;
type ViewMode = "grid" | "list";

// ─── Helpers ────────────────────────────────────────────────

const typeIcon = (t: FileType, size = "h-4 w-4") => {
  const props = { className: size, strokeWidth: 1.5 };
  switch (t) {
    case "pdf": return <FileText {...props} />;
    case "video": return <Video {...props} />;
    case "slides": return <Presentation {...props} />;
    case "doc": return <FileIcon {...props} />;
    case "link": return <Link2 {...props} />;
  }
};

const typeLabel = (t: FileType) => {
  switch (t) {
    case "pdf": return "PDF";
    case "video": return "Video";
    case "slides": return "Slides";
    case "doc": return "Document";
    case "link": return "Link";
  }
};

const initials = (name: string) => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

// ─── Component ──────────────────────────────────────────────

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
    .filter(f =>
      f.fileName.toLowerCase().includes(search.toLowerCase()) ||
      f.linkedCourse.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Content Library</h1>
        <p className="text-[14px] mt-0.5" style={{ color: "rgba(0,0,0,0.45)", fontFamily: "Inter, sans-serif" }}>
          All uploaded files and sources across all courses
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
        <div className="flex items-center gap-2 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,0,0,0.3)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search files..."
              className={cn(inputStyle, "pl-9 pr-3")}
              style={inputBorder}
            />
          </div>

          {/* Type filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as TypeFilter)}
            className="h-9 px-3 rounded-lg text-[13px] bg-white focus:outline-none"
            style={inputBorder}
          >
            <option value="all">All Types</option>
            <option value="pdf">PDF</option>
            <option value="video">Video</option>
            <option value="slides">Slides</option>
            <option value="doc">Document</option>
            <option value="link">Link</option>
          </select>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={e => setCourseFilter(e.target.value)}
            className="h-9 px-3 rounded-lg text-[13px] bg-white focus:outline-none hidden lg:block"
            style={inputBorder}
          >
            <option value="all">All Courses</option>
            {uniqueCourses.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex rounded-lg overflow-hidden" style={{ border: "1px solid rgba(0,0,0,0.12)" }}>
            <button
              onClick={() => setViewMode("grid")}
              className="h-9 w-9 flex items-center justify-center transition-colors"
              style={{ backgroundColor: viewMode === "grid" ? "rgba(201,150,58,0.12)" : "transparent", color: viewMode === "grid" ? AMBER : "rgba(0,0,0,0.35)" }}
            >
              <LayoutGrid className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className="h-9 w-9 flex items-center justify-center transition-colors"
              style={{ backgroundColor: viewMode === "list" ? "rgba(201,150,58,0.12)" : "transparent", color: viewMode === "list" ? AMBER : "rgba(0,0,0,0.35)", borderLeft: "1px solid rgba(0,0,0,0.08)" }}
            >
              <List className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>

          {/* Upload */}
          <button
            onClick={() => toast("Upload available through Course deployment", { description: "Files are uploaded within course context for proper organization." })}
            className="flex items-center gap-2 px-4 py-2 text-[13px] font-medium transition-colors hover:opacity-90"
            style={primaryBtn}
          >
            <Upload className="h-4 w-4" /> Upload File
          </button>
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={cardStyle}>
          <div className="h-12 w-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: "rgba(201,150,58,0.08)" }}>
            <FileText className="h-5 w-5" style={{ color: AMBER }} />
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "rgba(0,0,0,0.6)" }}>No files found</p>
          <p className="text-xs mb-4" style={{ color: "rgba(0,0,0,0.35)" }}>Try adjusting your filters or search</p>
          <button
            onClick={() => { setSearch(""); setTypeFilter("all"); setCourseFilter("all"); }}
            className="px-4 py-2 text-[13px] font-medium"
            style={primaryBtn}
          >
            Clear Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        /* ─── Grid View ─────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map(file => (
            <div
              key={file.id}
              className="p-4 cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.01]"
              style={cardStyle}
              onClick={() => setPreviewFile(file)}
            >
              {/* Type icon */}
              <div className="h-10 w-10 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: "rgba(201,150,58,0.10)", color: AMBER }}>
                {typeIcon(file.fileType, "h-5 w-5")}
              </div>

              {/* File name */}
              <p className="text-[14px] font-medium leading-snug line-clamp-2 mb-2" style={{ color: "#1A1A1A", fontFamily: "Inter, sans-serif" }}>
                {file.fileName}
              </p>

              {/* Course badge */}
              <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium mb-1" style={{ backgroundColor: "rgba(201,150,58,0.08)", color: "#92670A" }}>
                {file.linkedCourse}
              </span>

              {/* Module */}
              <p className="text-[12px]" style={{ color: "rgba(0,0,0,0.4)", fontFamily: "Inter, sans-serif" }}>{file.module}</p>

              {/* Bottom */}
              <div className="flex items-center justify-between mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.05)" }}>
                <div className="flex items-center gap-2">
                  <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>{file.uploadDate}</span>
                  <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.25)" }}>·</span>
                  <span className="text-[11px]" style={{ color: "rgba(0,0,0,0.35)" }}>{file.fileSize}</span>
                </div>
                <div
                  className="h-5 w-5 rounded-full flex items-center justify-center text-[8px] font-medium"
                  style={{ backgroundColor: "rgba(201,150,58,0.15)", color: AMBER }}
                >
                  {initials(file.uploaderName)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ─── List View ─────────────────────────────────────── */
        <div className="overflow-hidden" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["File", "Type", "Course", "Module", "Uploaded", "Size", "Uploader"].map((h, i) => (
                  <th
                    key={i}
                    className={cn(
                      "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                      i === 3 && "hidden md:table-cell",
                      i === 4 && "hidden lg:table-cell",
                      i === 5 && "hidden lg:table-cell",
                      i === 6 && "hidden xl:table-cell",
                    )}
                    style={{ color: "rgba(0,0,0,0.4)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(file => (
                <tr
                  key={file.id}
                  className="transition-colors cursor-pointer"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = ROW_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                  onClick={() => setPreviewFile(file)}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(201,150,58,0.10)", color: AMBER }}>
                        {typeIcon(file.fileType)}
                      </div>
                      <span className="text-[13px] font-medium truncate" style={{ color: "rgba(0,0,0,0.8)" }}>{file.fileName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium uppercase" style={{ backgroundColor: "rgba(201,150,58,0.10)", color: "#92670A" }}>
                      {typeLabel(file.fileType)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{file.linkedCourse}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{file.module}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{file.uploadDate}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{file.fileSize}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden xl:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{file.uploaderName}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer summary */}
      <div className="flex items-center gap-4 mt-4 text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>
        <span>{filtered.length} files</span>
        <span>·</span>
        <span>{seedFiles.filter(f => f.fileType === "pdf").length} PDFs</span>
        <span>·</span>
        <span>{seedFiles.filter(f => f.fileType === "video").length} videos</span>
        <span>·</span>
        <span>{uniqueCourses.length} courses</span>
      </div>

      {/* ─── File Preview Drawer ──────────────────────────── */}
      {previewFile && (
        <>
          <div className="fixed inset-0 z-40" style={{ backgroundColor: "rgba(0,0,0,0.25)" }} onClick={() => setPreviewFile(null)} />
          <div className="fixed right-0 top-0 bottom-0 w-[480px] max-w-full z-50 flex flex-col" style={{ backgroundColor: "#FFFFFF", borderLeft: "1px solid rgba(0,0,0,0.08)" }}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5" style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: "rgba(201,150,58,0.10)", color: AMBER }}>
                  {typeIcon(previewFile.fileType)}
                </div>
                <div className="min-w-0">
                  <p className="text-[15px] font-semibold truncate" style={{ color: "#1A1A1A" }}>{previewFile.fileName}</p>
                  <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium uppercase" style={{ backgroundColor: "rgba(201,150,58,0.10)", color: "#92670A" }}>
                    {typeLabel(previewFile.fileType)}
                  </span>
                </div>
              </div>
              <button onClick={() => setPreviewFile(null)} className="h-8 w-8 rounded-md flex items-center justify-center hover:bg-black/5 shrink-0" style={{ color: "rgba(0,0,0,0.35)" }}>
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Metadata */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Details</p>
                <div className="space-y-2.5">
                  {[
                    { label: "COURSE", value: previewFile.linkedCourse },
                    { label: "MODULE", value: previewFile.module },
                    { label: "UPLOADED BY", value: previewFile.uploaderName },
                    { label: "UPLOAD DATE", value: previewFile.uploadDate },
                    { label: "FILE SIZE", value: previewFile.fileSize },
                  ].map((row, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5">
                      <span className="text-[11px] uppercase tracking-wider" style={{ color: "rgba(0,0,0,0.35)" }}>{row.label}</span>
                      <span className="text-[14px]" style={{ color: "rgba(0,0,0,0.75)", fontFamily: "Inter, sans-serif" }}>{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Preview area */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] mb-3" style={{ color: "rgba(0,0,0,0.4)" }}>Preview</p>
                {(previewFile.fileType === "pdf" || previewFile.fileType === "doc" || previewFile.fileType === "slides") && (
                  <div className="rounded-lg p-4" style={{ backgroundColor: "rgba(0,0,0,0.02)", border: "1px solid rgba(0,0,0,0.08)" }}>
                    <p className="text-[13px] leading-relaxed" style={{ color: "rgba(0,0,0,0.55)" }}>
                      This document covers the foundational concepts and frameworks essential for
                      understanding the subject matter. Key topics include theoretical foundations,
                      practical applications, and assessment criteria aligned with mastery definitions.
                    </p>
                    <p className="text-[13px] leading-relaxed mt-3" style={{ color: "rgba(0,0,0,0.55)" }}>
                      Learners are expected to engage with the material critically, drawing connections
                      to their professional context and demonstrating comprehension through structured
                      reflections and applied exercises.
                    </p>
                  </div>
                )}
                {previewFile.fileType === "video" && (
                  <div className="rounded-lg overflow-hidden flex items-center justify-center" style={{ backgroundColor: "#1A1A1A", aspectRatio: "16/9" }}>
                    <Play className="h-8 w-8 text-white opacity-70" />
                  </div>
                )}
                {previewFile.fileType === "link" && (
                  <div className="rounded-lg p-3" style={{ backgroundColor: "rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.08)" }}>
                    <code className="text-[13px] break-all" style={{ color: "rgba(0,0,0,0.55)", fontFamily: "monospace" }}>
                      https://resources.meridian.edu/{previewFile.linkedCourse.toLowerCase().replace(/ /g, "-")}/{previewFile.module.toLowerCase().replace(/ /g, "-")}
                    </code>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4" style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}>
              <button className="flex items-center gap-2 text-[13px] font-medium" style={{ color: AMBER }}>
                View in Course <ExternalLink className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
