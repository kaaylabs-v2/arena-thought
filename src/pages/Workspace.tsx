import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { SourcesPane } from "@/components/workspace/SourcesPane";
import { NexiPane } from "@/components/workspace/NexiPane";
import { NotebookPane } from "@/components/workspace/NotebookPane";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import type { ImperativePanelHandle } from "react-resizable-panels";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChevronLeft, ChevronRight, GripVertical } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const courseData: Record<string, { title: string; module: string }> = {
  "1": { title: "Foundations of Machine Learning", module: "Week 4: Neural Networks" },
  "2": { title: "Advanced Statistical Methods", module: "Chapter 7: Bayesian Inference" },
  "3": { title: "Philosophy of Mind", module: "Section 12: Consciousness" },
};

export type PaneState = "expanded" | "mini";
export type SourcesMode = "mini" | "list" | "viewer";

/* ── Size constants (percentages of total width) ── */
const MINI = 3.2;
const SOURCES_LIST = 15;
const SOURCES_VIEWER = 32;
const NOTEBOOK_EXPANDED = 18;
const NEXI_MIN = 35;

/* ── Pixel-based constraints (approximate) ── */
const SOURCES_MIN_PX = 200;
const SOURCES_MAX_PX = 400;
const NOTEBOOK_MIN_PX = 220;
const NOTEBOOK_MAX_PX = 380;
const CONTENT_MIN_PX = 360;

function pxToPercent(px: number, containerWidth: number) {
  return Math.max(1, (px / containerWidth) * 100);
}

const Workspace = () => {
  const { id } = useParams();
  const courseId = id || "1";
  const course = courseData[courseId] || courseData["1"];
  const isMobile = useIsMobile();

  const [sourcesMode, setSourcesMode] = useState<SourcesMode>("list");
  const [notebookState, setNotebookState] = useState<PaneState>("mini");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [notebookBeforeViewer, setNotebookBeforeViewer] = useState<PaneState>("mini");

  // Collapse state
  const [sourcesCollapsed, setSourcesCollapsed] = useState(false);
  const [notebookCollapsed, setNotebookCollapsed] = useState(false);
  const [sourcesPreCollapseSize, setSourcesPreCollapseSize] = useState(SOURCES_LIST);
  const [notebookPreCollapseSize, setNotebookPreCollapseSize] = useState(NOTEBOOK_EXPANDED);

  // Mobile drawer state
  const [mobileSourcesOpen, setMobileSourcesOpen] = useState(false);
  const [mobileNotebookOpen, setMobileNotebookOpen] = useState(false);

  const sourcesPanelRef = useRef<ImperativePanelHandle>(null);
  const notebookPanelRef = useRef<ImperativePanelHandle>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic min/max based on container width
  const [containerWidth, setContainerWidth] = useState(1400);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── Programmatic resize when mode changes ── */
  const resizeSources = useCallback((mode: SourcesMode) => {
    const panel = sourcesPanelRef.current;
    if (!panel || sourcesCollapsed) return;
    switch (mode) {
      case "mini":
        panel.resize(MINI);
        break;
      case "list":
        panel.resize(SOURCES_LIST);
        break;
      case "viewer":
        panel.resize(SOURCES_VIEWER);
        break;
    }
  }, [sourcesCollapsed]);

  const resizeNotebook = useCallback((state: PaneState) => {
    const panel = notebookPanelRef.current;
    if (!panel || notebookCollapsed) return;
    panel.resize(state === "expanded" ? NOTEBOOK_EXPANDED : MINI);
  }, [notebookCollapsed]);

  useEffect(() => { resizeSources(sourcesMode); }, [sourcesMode, resizeSources]);
  useEffect(() => { resizeNotebook(notebookState); }, [notebookState, resizeNotebook]);

  useEffect(() => {
    if (sourcesMode === "viewer" && notebookState === "expanded") {
      setNotebookBeforeViewer("expanded");
      setNotebookState("mini");
    }
  }, [sourcesMode]);

  const handleSelectSource = (id: string | null) => {
    setSelectedSource(id);
    if (id) {
      if (isMobile) {
        // On mobile, sources are in a drawer — keep it open in viewer mode
      } else {
        setSourcesMode("viewer");
      }
    }
  };

  const handleDeselectSource = () => {
    setSelectedSource(null);
    setSourcesMode("list");
    if (notebookBeforeViewer === "expanded") {
      setNotebookState("expanded");
      setNotebookBeforeViewer("mini");
    }
  };

  const handleSourcesToggle = () => {
    if (isMobile) {
      setMobileSourcesOpen(!mobileSourcesOpen);
      return;
    }
    if (sourcesMode === "mini") {
      setSourcesMode("list");
      setSourcesCollapsed(false);
    } else {
      setSourcesMode("mini");
      setSelectedSource(null);
    }
  };

  // Collapse/expand handlers
  const collapseSources = () => {
    const panel = sourcesPanelRef.current;
    if (panel) {
      setSourcesPreCollapseSize(panel.getSize());
      panel.resize(0);
    }
    setSourcesCollapsed(true);
  };

  const expandSources = () => {
    setSourcesCollapsed(false);
    const panel = sourcesPanelRef.current;
    if (panel) {
      panel.resize(sourcesPreCollapseSize || SOURCES_LIST);
    }
  };

  const collapseNotebook = () => {
    const panel = notebookPanelRef.current;
    if (panel) {
      setNotebookPreCollapseSize(panel.getSize());
      panel.resize(0);
    }
    setNotebookCollapsed(true);
  };

  const expandNotebook = () => {
    setNotebookCollapsed(false);
    const panel = notebookPanelRef.current;
    if (panel) {
      panel.resize(notebookPreCollapseSize || NOTEBOOK_EXPANDED);
    }
  };

  /* ── Dynamic constraints ── */
  const sourcesMinPct = sourcesCollapsed ? 0 : sourcesMode === "mini" ? MINI : pxToPercent(SOURCES_MIN_PX, containerWidth);
  const sourcesMaxPct = sourcesCollapsed ? 0 : sourcesMode === "mini" ? MINI : pxToPercent(SOURCES_MAX_PX, containerWidth);
  const notebookMinPct = notebookCollapsed ? 0 : notebookState === "mini" ? MINI : pxToPercent(NOTEBOOK_MIN_PX, containerWidth);
  const notebookMaxPct = notebookCollapsed ? 0 : notebookState === "mini" ? MINI : pxToPercent(NOTEBOOK_MAX_PX, containerWidth);

  const showSourcesHandle = sourcesMode !== "mini" && !sourcesCollapsed;
  const showNotebookHandle = notebookState !== "mini" && !notebookCollapsed;

  // Check if at min width to show collapse button
  const [sourcesAtMin, setSourcesAtMin] = useState(false);
  const [notebookAtMin, setNotebookAtMin] = useState(false);

  const handleSourcesResize = (size: number) => {
    const minPct = pxToPercent(SOURCES_MIN_PX, containerWidth);
    setSourcesAtMin(Math.abs(size - minPct) < 1.5 && sourcesMode !== "mini");
  };

  const handleNotebookResize = (size: number) => {
    const minPct = pxToPercent(NOTEBOOK_MIN_PX, containerWidth);
    setNotebookAtMin(Math.abs(size - minPct) < 1.5 && notebookState !== "mini");
  };

  // ── Mobile Layout ──
  if (isMobile) {
    return (
      <div ref={containerRef} className="h-screen flex flex-col overflow-hidden bg-background">
        {/* Mobile top bar with pane toggles */}
        <div className="flex items-center justify-between px-3 py-2 border-b border-border bg-card shrink-0">
          <button
            onClick={() => setMobileSourcesOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-sans text-muted-foreground hover:bg-secondary transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
            Sources
          </button>
          <button
            onClick={() => setMobileNotebookOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-sans text-muted-foreground hover:bg-secondary transition-colors"
          >
            Notebook
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Full-width Nexi pane */}
        <div className="flex-1 min-h-0 flex flex-col">
          <NexiPane courseId={courseId} courseTitle={course.title} currentModule={course.module} />
        </div>

        {/* Sources drawer */}
        <Sheet open={mobileSourcesOpen} onOpenChange={setMobileSourcesOpen}>
          <SheetContent side="left" className="w-[85vw] max-w-[400px] p-0">
            <SourcesPane
              mode={selectedSource ? "viewer" : "list"}
              onToggle={() => setMobileSourcesOpen(false)}
              selectedSource={selectedSource}
              onSelectSource={handleSelectSource}
              onDeselectSource={handleDeselectSource}
              courseTitle={course.title}
            />
          </SheetContent>
        </Sheet>

        {/* Notebook drawer */}
        <Sheet open={mobileNotebookOpen} onOpenChange={setMobileNotebookOpen}>
          <SheetContent side="right" className="w-[85vw] max-w-[380px] p-0">
            <NotebookPane
              state="expanded"
              onToggle={() => setMobileNotebookOpen(false)}
              courseTitle={course.title}
            />
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  // ── Desktop Layout ──
  return (
    <div ref={containerRef} className="h-screen flex overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* ── Sources Panel ── */}
        <ResizablePanel
          ref={sourcesPanelRef}
          defaultSize={SOURCES_LIST}
          minSize={sourcesMinPct}
          maxSize={sourcesMaxPct}
          collapsible={sourcesCollapsed}
          collapsedSize={0}
          order={1}
          onResize={handleSourcesResize}
          className="border-r border-border bg-card"
          style={{ transition: "flex 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {!sourcesCollapsed && (
            <SourcesPane
              mode={sourcesMode}
              onToggle={handleSourcesToggle}
              selectedSource={selectedSource}
              onSelectSource={handleSelectSource}
              onDeselectSource={handleDeselectSource}
              courseTitle={course.title}
            />
          )}
        </ResizablePanel>

        {/* ── Sources ↔ Nexi handle ── */}
        <ResizableHandle
          className={`group/handle relative transition-all duration-200 ${
            showSourcesHandle
              ? "w-[1px] hover:w-[5px] cursor-col-resize"
              : "opacity-0 pointer-events-none w-0"
          }`}
        >
          {showSourcesHandle && (
            <div className="absolute inset-y-0 -left-[3px] -right-[3px] z-10 flex items-center justify-center">
              <div className="h-8 w-[5px] rounded-full bg-transparent group-hover/handle:bg-accent/15 group-active/handle:bg-accent/25 transition-colors duration-150 flex items-center justify-center">
                <GripVertical className="h-3 w-3 text-transparent group-hover/handle:text-muted-foreground/40 transition-colors duration-150" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </ResizableHandle>

        {/* ── Collapsed Sources expand button ── */}
        {sourcesCollapsed && (
          <div className="flex items-start pt-3 shrink-0">
            <button
              onClick={expandSources}
              className="h-7 w-7 flex items-center justify-center rounded-r-lg border border-l-0 border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Expand sources"
            >
              <ChevronRight className="h-3 w-3" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ── Nexi Center Panel ── */}
        <ResizablePanel
          defaultSize={100 - SOURCES_LIST - MINI}
          minSize={pxToPercent(CONTENT_MIN_PX, containerWidth)}
          order={2}
          className="min-w-0 flex flex-col"
        >
          <NexiPane courseId={courseId} courseTitle={course.title} currentModule={course.module} />
        </ResizablePanel>

        {/* ── Collapsed Notebook expand button ── */}
        {notebookCollapsed && (
          <div className="flex items-start pt-3 shrink-0">
            <button
              onClick={expandNotebook}
              className="h-7 w-7 flex items-center justify-center rounded-l-lg border border-r-0 border-border bg-card hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-200"
              title="Expand notebook"
            >
              <ChevronLeft className="h-3 w-3" strokeWidth={2} />
            </button>
          </div>
        )}

        {/* ── Nexi ↔ Notebook handle ── */}
        <ResizableHandle
          className={`group/handle relative transition-all duration-200 ${
            showNotebookHandle
              ? "w-[1px] hover:w-[5px] cursor-col-resize"
              : "opacity-0 pointer-events-none w-0"
          }`}
        >
          {showNotebookHandle && (
            <div className="absolute inset-y-0 -left-[3px] -right-[3px] z-10 flex items-center justify-center">
              <div className="h-8 w-[5px] rounded-full bg-transparent group-hover/handle:bg-accent/15 group-active/handle:bg-accent/25 transition-colors duration-150 flex items-center justify-center">
                <GripVertical className="h-3 w-3 text-transparent group-hover/handle:text-muted-foreground/40 transition-colors duration-150" strokeWidth={1.5} />
              </div>
            </div>
          )}
        </ResizableHandle>

        {/* ── Notebook Panel ── */}
        <ResizablePanel
          ref={notebookPanelRef}
          defaultSize={MINI}
          minSize={notebookMinPct}
          maxSize={notebookMaxPct}
          collapsible={notebookCollapsed}
          collapsedSize={0}
          order={3}
          onResize={handleNotebookResize}
          className="border-l border-border bg-card"
          style={{ transition: "flex 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {!notebookCollapsed && (
            <div className="h-full relative">
              {notebookAtMin && (
                <button
                  onClick={collapseNotebook}
                  className="absolute top-2 left-2 z-10 h-6 w-6 flex items-center justify-center rounded-md bg-secondary/80 hover:bg-secondary text-muted-foreground hover:text-foreground transition-all duration-150"
                  title="Collapse notebook"
                >
                  <ChevronRight className="h-3 w-3" strokeWidth={2} />
                </button>
              )}
              <NotebookPane
                state={notebookState}
                onToggle={() => setNotebookState((s) => (s === "expanded" ? "mini" : "expanded"))}
                courseTitle={course.title}
              />
            </div>
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Workspace;
