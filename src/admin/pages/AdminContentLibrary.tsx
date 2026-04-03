import { useState } from "react";
import { Search, FileText, Video, Presentation, FileIcon, Link2, Download } from "lucide-react";
import { contentLibrary, type ContentItem } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";

const AMBER = "#C9963A";
const AMBER_LIGHT = "rgba(201, 150, 58, 0.08)";
const ROW_HOVER = "rgba(201, 150, 58, 0.04)";

const cardStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  border: "1px solid rgba(0,0,0,0.08)",
  borderRadius: 12,
  boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
};

const inputStyle = "w-full h-9 px-3 rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[rgba(201,150,58,0.3)] bg-white";
const inputBorder: React.CSSProperties = { border: "1px solid rgba(0,0,0,0.12)" };

type TypeFilter = "all" | "pdf" | "video" | "slides" | "doc" | "link";

const typeIcon = (t: ContentItem["fileType"]) => {
  switch (t) {
    case "pdf": return <FileText className="h-4 w-4" />;
    case "video": return <Video className="h-4 w-4" />;
    case "slides": return <Presentation className="h-4 w-4" />;
    case "doc": return <FileIcon className="h-4 w-4" />;
    case "link": return <Link2 className="h-4 w-4" />;
  }
};

const typeLabel = (t: ContentItem["fileType"]) => {
  switch (t) {
    case "pdf": return "PDF";
    case "video": return "Video";
    case "slides": return "Slides";
    case "doc": return "Document";
    case "link": return "Link";
  }
};

export default function AdminContentLibraryPage() {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [search, setSearch] = useState("");

  const types: { value: TypeFilter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "pdf", label: "PDF" },
    { value: "video", label: "Video" },
    { value: "slides", label: "Slides" },
    { value: "doc", label: "Docs" },
    { value: "link", label: "Links" },
  ];

  const filtered = contentLibrary
    .filter(c => typeFilter === "all" || c.fileType === typeFilter)
    .filter(c => c.fileName.toLowerCase().includes(search.toLowerCase()) || c.linkedCourse.toLowerCase().includes(search.toLowerCase()));

  const uniqueCourses = [...new Set(contentLibrary.map(c => c.linkedCourse))];

  // Stats
  const totalSize = contentLibrary.reduce((acc, c) => {
    const num = parseFloat(c.fileSize);
    if (c.fileSize.includes("MB")) return acc + num;
    if (c.fileSize.includes("KB")) return acc + num / 1024;
    return acc;
  }, 0);

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal" style={{ color: "rgba(0,0,0,0.85)" }}>Content Library</h1>
        <p className="text-sm mt-0.5" style={{ color: "rgba(0,0,0,0.45)" }}>All uploaded files and sources across all courses</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Files", value: contentLibrary.length.toString() },
          { label: "Linked Courses", value: uniqueCourses.length.toString() },
          { label: "Total Size", value: `${totalSize.toFixed(0)} MB` },
          { label: "Videos", value: contentLibrary.filter(c => c.fileType === "video").length.toString() },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl" style={cardStyle}>
            <p className="text-[10px] font-semibold uppercase tracking-[0.08em]" style={{ color: "rgba(0,0,0,0.35)" }}>{stat.label}</p>
            <p className="text-[1.5rem] font-serif mt-1" style={{ color: "rgba(0,0,0,0.8)" }}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-5">
        <div className="flex gap-1 rounded-lg p-1" style={{ backgroundColor: "rgba(0,0,0,0.04)" }}>
          {types.map(t => (
            <button
              key={t.value}
              onClick={() => setTypeFilter(t.value)}
              className="px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors"
              style={{
                backgroundColor: typeFilter === t.value ? "#fff" : "transparent",
                color: typeFilter === t.value ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.45)",
                boxShadow: typeFilter === t.value ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                borderBottom: typeFilter === t.value ? `2px solid ${AMBER}` : "2px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: "rgba(0,0,0,0.3)" }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search files or courses..." className={cn(inputStyle, "pl-9 pr-3")} style={inputBorder} />
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-20" style={cardStyle}>
          <p className="text-sm" style={{ color: "rgba(0,0,0,0.45)" }}>No files found</p>
        </div>
      ) : (
        <div className="overflow-hidden" style={cardStyle}>
          <table className="w-full text-left">
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
                {["File Name", "Type", "Linked Course", "Uploaded By", "Date", "Size"].map((h, i) => (
                  <th key={i} className={cn(
                    "px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]",
                    i === 3 && "hidden md:table-cell",
                    i === 4 && "hidden lg:table-cell",
                    i === 5 && "hidden lg:table-cell",
                  )} style={{ color: "rgba(0,0,0,0.4)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => (
                <tr
                  key={item.id}
                  className="transition-colors group"
                  style={{ borderBottom: "1px solid rgba(0,0,0,0.06)" }}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = ROW_HOVER)}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>
                        {typeIcon(item.fileType)}
                      </div>
                      <span className="text-[13px] font-medium truncate" style={{ color: "rgba(0,0,0,0.8)" }}>{item.fileName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium" style={{ backgroundColor: AMBER_LIGHT, color: AMBER }}>
                      {typeLabel(item.fileType)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{item.linkedCourse}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden md:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.5)" }}>{item.uploaderName}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{item.uploadDate}</span>
                  </td>
                  <td className="px-5 py-3.5 hidden lg:table-cell">
                    <span className="text-[12px]" style={{ color: "rgba(0,0,0,0.35)" }}>{item.fileSize}</span>
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
        <span>{contentLibrary.filter(c => c.fileType === "pdf").length} PDFs</span>
        <span>·</span>
        <span>{contentLibrary.filter(c => c.fileType === "video").length} videos</span>
        <span>·</span>
        <span>{uniqueCourses.length} courses</span>
      </div>
    </div>
  );
}
