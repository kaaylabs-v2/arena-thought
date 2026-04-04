import {
  Search, BookOpen, Tag, Calendar, StickyNote, LayoutGrid, List,
  Plus, ArrowLeft, Trash2, Bold, Italic, Underline, ListOrdered, ListChecks, X, MoreHorizontal,
  BookA,
} from "lucide-react";
import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { useWorkspace, type NotebookEntry, type VocabularyEntry } from "@/context/WorkspaceContext";
import { toast } from "sonner";

type SortKey = "recent" | "course" | "tag";
type ViewMode = "list" | "cards";
type PageTab = "notes" | "vocab";

const courseColors: Record<string, string> = {
  "Foundations of Machine Learning": "bg-accent/[0.06] border-accent/15",
  "Advanced Statistical Methods": "bg-primary/[0.04] border-primary/10",
  "Philosophy of Mind": "bg-muted border-border",
};

const courseOptions = [
  "Foundations of Machine Learning",
  "Advanced Statistical Methods",
  "Philosophy of Mind",
  "General",
];

const Notebook = () => {
  const { notebookEntries, addNotebookEntry, updateNotebookEntry, deleteNotebookEntry, vocabulary, addVocabulary, updateVocabulary, deleteVocabulary } = useWorkspace();
  const [pageTab, setPageTab] = useState<PageTab>("notes");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewMode>("cards");

  // Note editor state
  const [openNote, setOpenNote] = useState<NotebookEntry | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editCourse, setEditCourse] = useState("General");
  const [editTags, setEditTags] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const titleRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);

  const filteredNotes = useMemo(() => {
    let result = notebookEntries.filter((n) =>
      !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.course.toLowerCase().includes(search.toLowerCase())
    );
    if (sort === "course") {
      result = [...result].sort((a, b) => a.course.localeCompare(b.course));
    } else if (sort === "tag") {
      result = [...result].sort((a, b) => (a.tags[0] || "").localeCompare(b.tags[0] || ""));
    }
    return result;
  }, [notebookEntries, search, sort]);

  // Vocabulary filtering
  const filteredVocab = useMemo(() => {
    return vocabulary.filter((v) =>
      !search || v.term.toLowerCase().includes(search.toLowerCase()) || v.definition.toLowerCase().includes(search.toLowerCase()) || v.course.toLowerCase().includes(search.toLowerCase())
    );
  }, [vocabulary, search]);

  // Vocab editor state
  const [editingVocab, setEditingVocab] = useState<VocabularyEntry | null>(null);
  const [newVocab, setNewVocab] = useState(false);
  const [vTerm, setVTerm] = useState("");
  const [vDef, setVDef] = useState("");
  const [vExample, setVExample] = useState("");
  const [vCourse, setVCourse] = useState("General");

  const openNewVocab = useCallback(() => {
    setEditingVocab(null);
    setNewVocab(true);
    setVTerm(""); setVDef(""); setVExample(""); setVCourse("General");
  }, []);

  const openEditVocab = useCallback((v: VocabularyEntry) => {
    setEditingVocab(v);
    setNewVocab(false);
    setVTerm(v.term); setVDef(v.definition); setVExample(v.example || ""); setVCourse(v.course);
  }, []);

  const handleSaveVocab = useCallback(() => {
    if (!vTerm.trim() || !vDef.trim()) { toast.error("Term and definition required"); return; }
    if (newVocab) {
      addVocabulary({ term: vTerm.trim(), definition: vDef.trim(), example: vExample.trim() || undefined, course: vCourse, tags: [], savedFrom: "personal" });
      toast.success("Term added");
    } else if (editingVocab) {
      updateVocabulary(editingVocab.id, { term: vTerm.trim(), definition: vDef.trim(), example: vExample.trim() || undefined, course: vCourse });
      toast.success("Term updated");
    }
    setEditingVocab(null); setNewVocab(false);
  }, [vTerm, vDef, vExample, vCourse, newVocab, editingVocab, addVocabulary, updateVocabulary]);

  const handleDeleteVocab = useCallback((id: string) => {
    deleteVocabulary(id);
    toast.success("Term deleted");
    setEditingVocab(null); setNewVocab(false);
  }, [deleteVocabulary]);

  const openNoteEditor = useCallback((note: NotebookEntry) => {
    setOpenNote(note);
    setEditTitle(note.title);
    setEditContent(note.snippet);
    setEditCourse(note.course);
    setEditTags(note.tags.join(", "));
    setIsCreating(false);
    setShowDeleteConfirm(false);
  }, []);

  const openNewNote = useCallback(() => {
    setOpenNote(null);
    setEditTitle("");
    setEditContent("");
    setEditCourse("General");
    setEditTags("");
    setIsCreating(true);
    setShowDeleteConfirm(false);
    setTimeout(() => titleRef.current?.focus(), 100);
  }, []);

  const handleSave = useCallback(() => {
    if (!editTitle.trim() && !editContent.trim()) {
      toast.error("Note is empty");
      return;
    }
    const tags = editTags.split(",").map((t) => t.trim()).filter(Boolean);
    if (isCreating) {
      addNotebookEntry({
        title: editTitle.trim() || "Untitled note",
        snippet: editContent,
        course: editCourse,
        tags,
        source: "Personal note",
        savedFrom: "personal",
      });
      toast.success("Note created");
    } else if (openNote) {
      updateNotebookEntry(openNote.id, {
        title: editTitle.trim() || "Untitled note",
        snippet: editContent,
        course: editCourse,
        tags,
      });
      toast.success("Note updated");
    }
    setOpenNote(null);
    setIsCreating(false);
  }, [editTitle, editContent, editCourse, editTags, isCreating, openNote, addNotebookEntry, updateNotebookEntry]);

  const handleDelete = useCallback(() => {
    if (openNote) {
      deleteNotebookEntry(openNote.id);
      toast.success("Note deleted");
      setOpenNote(null);
      setIsCreating(false);
      setShowDeleteConfirm(false);
    }
  }, [openNote, deleteNotebookEntry]);

  const closeEditor = useCallback(() => {
    setOpenNote(null);
    setIsCreating(false);
    setShowDeleteConfirm(false);
  }, []);

  // Auto-resize textarea
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.style.height = "auto";
      contentRef.current.style.height = contentRef.current.scrollHeight + "px";
    }
  }, [editContent]);

  // Insert formatting helper
  const insertFormatting = (prefix: string, suffix: string) => {
    const textarea = contentRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = editContent.substring(start, end);
    const newContent = editContent.substring(0, start) + prefix + selected + suffix + editContent.substring(end);
    setEditContent(newContent);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  const isEditorOpen = isCreating || openNote !== null;

  // ─── Note Editor Overlay (Apple Notes style) ───
  if (isEditorOpen) {
    return (
      <div className="h-full min-h-screen flex flex-col animate-fade-in">
        {/* Editor top bar */}
        <div className="flex items-center justify-between px-6 lg:px-10 py-4 border-b border-border shrink-0">
          <button
            onClick={closeEditor}
            className="flex items-center gap-2 text-[13px] font-sans text-muted-foreground hover:text-foreground transition-colors duration-200 active:scale-[0.97]"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            Notes
          </button>
          <div className="flex items-center gap-2">
            {openNote && !showDeleteConfirm && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-muted-foreground/80 hover:text-destructive hover:bg-destructive/5 transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
            {showDeleteConfirm && (
              <div className="flex items-center gap-2 animate-fade-in">
                <span className="text-[12px] font-sans text-destructive">Delete?</span>
                <button
                  onClick={handleDelete}
                  className="px-2.5 py-1 rounded-md bg-destructive text-destructive-foreground text-[11px] font-sans font-medium hover:bg-destructive/90 transition-colors duration-200 active:scale-[0.97]"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-2.5 py-1 rounded-md border border-border text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors duration-200 active:scale-[0.97]"
                >
                  No
                </button>
              </div>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-1.5 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              {isCreating ? "Create" : "Save"}
            </button>
          </div>
        </div>

        {/* Formatting toolbar */}
        <div className="flex items-center gap-1 px-6 lg:px-10 py-2 border-b border-border/50 shrink-0">
          <button onClick={() => insertFormatting("**", "**")} className="toolbar-btn h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/80">
            <Bold className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button onClick={() => insertFormatting("*", "*")} className="toolbar-btn h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/80">
            <Italic className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button onClick={() => insertFormatting("__", "__")} className="toolbar-btn h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/80">
            <Underline className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <div className="h-4 w-px bg-border mx-1" />
          <button onClick={() => insertFormatting("\n- ", "")} className="toolbar-btn h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/80">
            <ListChecks className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <button onClick={() => insertFormatting("\n1. ", "")} className="toolbar-btn h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/80">
            <ListOrdered className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <div className="h-4 w-px bg-border mx-1" />
          {/* Course selector */}
          <select
            value={editCourse}
            onChange={(e) => setEditCourse(e.target.value)}
            className="h-7 px-2 rounded-md border border-border bg-background text-[11px] font-sans text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
          >
            {courseOptions.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Editor body */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="max-w-2xl mx-auto px-6 lg:px-10 py-8">
            {/* Title */}
            <input
              ref={titleRef}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              placeholder="Note title"
              className="w-full font-serif text-2xl lg:text-3xl text-foreground placeholder:text-muted-foreground/70 bg-transparent border-none outline-none mb-4 leading-snug font-medium"
            />

            {/* Meta line */}
            <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground/70 mb-6 pb-4 border-b border-border/40">
              <span>{openNote?.date || "New note"}</span>
              <span className="text-border">·</span>
              <span>{editCourse}</span>
              {editTags && (
                <>
                  <span className="text-border">·</span>
                  <span>{editTags}</span>
                </>
              )}
            </div>

            {/* Content */}
            <textarea
              ref={contentRef}
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              placeholder="Start writing..."
              className="w-full text-[14px] font-sans text-foreground/90 leading-[1.8] bg-transparent border-none outline-none resize-none min-h-[300px] placeholder:text-muted-foreground/70 tracking-[-0.01em]"
            />

            {/* Tags input */}
            <div className="mt-8 pt-4 border-t border-border/40">
              <label className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-widest mb-2 block">Tags (comma-separated)</label>
              <input
                type="text"
                value={editTags}
                onChange={(e) => setEditTags(e.target.value)}
                placeholder="neural-networks, optimization"
                className="w-full bg-muted/30 rounded-lg px-3 py-2 text-[13px] font-sans text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-1 focus:ring-ring/20"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Notes listing view ───
  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-8 animate-fade-in">
        <div>
          <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Notebook</h1>
          <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your collected insights and knowledge.</p>
        </div>
        <button
          onClick={pageTab === "notes" ? openNewNote : openNewVocab}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-[13px] font-sans font-medium btn-apple shrink-0"
        >
          <Plus className="h-4 w-4" strokeWidth={1.5} />
          {pageTab === "notes" ? "New note" : "New term"}
        </button>
      </div>

      {/* Page tabs */}
      <div className="flex gap-1 mb-6 animate-fade-in [animation-delay:40ms] [animation-fill-mode:backwards]">
        <button
          onClick={() => setPageTab("notes")}
          className={`px-4 py-2 text-[13px] font-sans font-medium rounded-lg transition-all duration-200 ${
            pageTab === "notes"
              ? "bg-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          Notes
          <span className="ml-1.5 text-[11px] opacity-70">{notebookEntries.length}</span>
        </button>
        <button
          onClick={() => setPageTab("vocab")}
          className={`px-4 py-2 text-[13px] font-sans font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
            pageTab === "vocab"
              ? "bg-primary text-primary-foreground shadow-soft"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <BookA className="h-3.5 w-3.5" strokeWidth={1.5} />
          Vocabulary
          <span className="text-[11px] opacity-70">{vocabulary.length}</span>
        </button>
      </div>

      {pageTab === "notes" ? (
        <>
          {/* Search + Sort + View toggle */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search notes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex gap-0.5 bg-muted/60 p-1 rounded-lg">
                {(["recent", "course", "tag"] as SortKey[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => setSort(key)}
                    className={`px-3.5 py-1.5 text-[12px] font-sans font-medium rounded-md capitalize transition-all duration-200 ${
                      sort === key ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="flex gap-0.5 bg-muted/60 p-1 rounded-lg">
                <button
                  onClick={() => setView("cards")}
                  className={`min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md cursor-pointer transition-all duration-200 ${
                    view === "cards" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] active:bg-foreground/[0.06]"
                  }`}
                >
                  <LayoutGrid className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`min-w-[32px] min-h-[32px] flex items-center justify-center rounded-md cursor-pointer transition-all duration-200 ${
                    view === "list" ? "bg-background text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground hover:bg-foreground/[0.04] active:bg-foreground/[0.06]"
                  }`}
                >
                  <List className="h-3.5 w-3.5" strokeWidth={1.5} />
                </button>
              </div>
            </div>
          </div>

          {/* Notes */}
          {filteredNotes.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <StickyNote className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
              <p className="text-muted-foreground/70 font-sans text-sm mb-4">Your insights will appear here as you learn.</p>
              <button onClick={openNewNote} className="text-[13px] font-sans text-accent hover:text-accent/80 transition-colors duration-200">
                Create your first note →
              </button>
            </div>
          ) : view === "list" ? (
            <div className="space-y-2.5">
              {filteredNotes.map((note, i) => (
                <div
                  key={note.id}
                  onClick={() => openNoteEditor(note)}
                  className="group card-interactive p-5 cursor-pointer animate-fade-in [animation-fill-mode:backwards]"
                  style={{ animationDelay: `${100 + i * 60}ms` }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-serif text-base text-foreground flex-1 leading-snug">{note.title}</h3>
                    <span className="text-[10px] font-sans text-muted-foreground/80 ml-3 shrink-0 flex items-center gap-1">
                      <Calendar className="h-3 w-3" strokeWidth={1.5} />
                      {note.date}
                    </span>
                  </div>
                  <p className="text-[12px] text-muted-foreground/70 font-sans leading-relaxed mb-3 line-clamp-2 tracking-[-0.01em]">{note.snippet}</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[10px] font-sans text-muted-foreground/80 flex items-center gap-1">
                      <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                      {note.course}
                    </span>
                    <span className="text-border">·</span>
                    <span className="text-[10px] font-sans text-muted-foreground/70">{note.source}</span>
                    {note.tags.length > 0 && (
                      <div className="flex gap-1.5 ml-auto">
                        {note.tags.map((tag) => (
                          <span key={tag} className="text-[10px] font-sans text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="columns-2 lg:columns-3 gap-3 [column-fill:_balance]">
              {filteredNotes.map((note, i) => {
                const colorClass = courseColors[note.course] || "bg-card border-border";
                return (
                  <div
                    key={note.id}
                    onClick={() => openNoteEditor(note)}
                    className={`break-inside-avoid mb-3 group rounded-xl border p-4 cursor-pointer animate-fade-in [animation-fill-mode:backwards] ${colorClass}`}
                    style={{
                      animationDelay: `${80 + i * 50}ms`,
                      transition: "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
                      e.currentTarget.style.boxShadow = "0 6px 20px -6px hsl(222 28% 14% / 0.1), 0 2px 6px -2px hsl(222 28% 14% / 0.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "";
                      e.currentTarget.style.boxShadow = "";
                    }}
                    onMouseDown={(e) => {
                      e.currentTarget.style.transform = "translateY(0) scale(0.98)";
                      e.currentTarget.style.transition = "transform 100ms cubic-bezier(0.22, 1, 0.36, 1)";
                    }}
                    onMouseUp={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px) scale(1.01)";
                      e.currentTarget.style.transition = "transform 350ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 350ms cubic-bezier(0.22, 1, 0.36, 1), border-color 250ms ease";
                    }}
                  >
                    <h3 className="font-serif text-[15px] text-foreground leading-snug mb-2">{note.title}</h3>
                    <p className="text-[12px] text-muted-foreground/75 font-sans leading-[1.7] mb-3 tracking-[-0.01em]">{note.snippet}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      {note.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-sans text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                          <Tag className="h-2.5 w-2.5" strokeWidth={1.5} />
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-2.5 border-t border-border/40">
                      <span className="text-[10px] font-sans text-muted-foreground/70 flex items-center gap-1 truncate">
                        <BookOpen className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                        <span className="truncate">{note.course}</span>
                      </span>
                      <span className="text-[10px] font-sans text-muted-foreground/80 ml-auto shrink-0">{note.date}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          {/* Vocab search */}
          <div className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/80" strokeWidth={1.5} />
              <input
                type="text"
                placeholder="Search vocabulary..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-10 pr-4 rounded-lg border border-input bg-background text-[13px] font-sans placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring/20 focus:border-ring/40 transition-all duration-200"
              />
            </div>
          </div>

          {/* Vocab inline editor */}
          {(newVocab || editingVocab) && (
            <div className="mb-6 rounded-xl border border-accent/20 bg-accent/5 p-5 animate-fade-in">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[13px] font-sans font-medium text-foreground">{newVocab ? "New Term" : "Edit Term"}</h3>
                <div className="flex items-center gap-2">
                  {editingVocab && (
                    <button onClick={() => handleDeleteVocab(editingVocab.id)} className="h-7 w-7 flex items-center justify-center rounded-md text-muted-foreground/70 hover:text-destructive hover:bg-destructive/5 transition-all duration-200">
                      <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                    </button>
                  )}
                  <button onClick={() => { setNewVocab(false); setEditingVocab(null); }} className="text-[11px] font-sans text-muted-foreground hover:text-foreground transition-colors">Cancel</button>
                  <button onClick={handleSaveVocab} className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-[11px] font-sans font-medium hover:bg-primary/90 transition-colors active:scale-[0.97]">Save</button>
                </div>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  value={vTerm}
                  onChange={(e) => setVTerm(e.target.value)}
                  placeholder="Term"
                  autoFocus
                  className="w-full bg-background rounded-lg border border-input px-3 py-2 text-[14px] font-serif font-medium text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <textarea
                  value={vDef}
                  onChange={(e) => setVDef(e.target.value)}
                  placeholder="Definition"
                  rows={2}
                  className="w-full bg-background rounded-lg border border-input px-3 py-2 text-[13px] font-sans text-foreground placeholder:text-muted-foreground/80 focus:outline-none focus:ring-2 focus:ring-ring/20 resize-none"
                />
                <input
                  type="text"
                  value={vExample}
                  onChange={(e) => setVExample(e.target.value)}
                  placeholder="Example usage (optional)"
                  className="w-full bg-background rounded-lg border border-input px-3 py-2 text-[13px] font-sans text-foreground/80 italic placeholder:text-muted-foreground/80 placeholder:not-italic focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
                <select
                  value={vCourse}
                  onChange={(e) => setVCourse(e.target.value)}
                  className="h-9 px-3 rounded-lg border border-input bg-background text-[12px] font-sans text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring/20"
                >
                  {courseOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Vocab list */}
          {filteredVocab.length === 0 ? (
            <div className="text-center py-24 animate-fade-in">
              <BookA className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
              <p className="text-muted-foreground/70 font-sans text-sm mb-4">Your vocabulary terms will appear here.</p>
              <button onClick={openNewVocab} className="text-[13px] font-sans text-accent hover:text-accent/80 transition-colors duration-200">
                Add your first term →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredVocab.map((v, i) => {
                const colorClass = courseColors[v.course] || "bg-card border-border";
                return (
                  <div
                    key={v.id}
                    onClick={() => openEditVocab(v)}
                    className={`group rounded-xl border p-5 cursor-pointer animate-fade-in [animation-fill-mode:backwards] hover:shadow-soft transition-all duration-200 ${colorClass}`}
                    style={{ animationDelay: `${80 + i * 50}ms` }}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-serif text-lg text-foreground leading-snug">{v.term}</h3>
                      <span className="text-[10px] font-sans text-muted-foreground/70 shrink-0">{v.date}</span>
                    </div>
                    <p className="text-[13px] font-sans text-muted-foreground/80 leading-relaxed mb-2">{v.definition}</p>
                    {v.example && (
                      <p className="text-[12px] font-sans text-accent/70 bg-accent/5 rounded-lg px-3 py-2 leading-relaxed italic mb-2">
                        "{v.example}"
                      </p>
                    )}
                    <div className="flex items-center gap-3 mt-2 pt-2 border-t border-border/40">
                      <span className="text-[10px] font-sans text-muted-foreground/80 flex items-center gap-1">
                        <BookOpen className="h-3 w-3" strokeWidth={1.5} />
                        {v.course}
                      </span>
                      {v.tags.length > 0 && (
                        <div className="flex gap-1.5 ml-auto">
                          {v.tags.map((tag) => (
                            <span key={tag} className="text-[10px] font-sans text-accent/70 bg-accent/8 px-2 py-0.5 rounded-full">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notebook;
