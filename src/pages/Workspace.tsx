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

const courseData: Record<string, { title: string; module: string }> = {
  "1": { title: "Foundations of Machine Learning", module: "Week 4: Neural Networks" },
  "2": { title: "Advanced Statistical Methods", module: "Chapter 7: Bayesian Inference" },
  "3": { title: "Philosophy of Mind", module: "Section 12: Consciousness" },
};

export type PaneState = "expanded" | "mini";
export type SourcesMode = "mini" | "list" | "viewer";

/* ── Size constants (percentages of total width) ── */
const MINI = 3.2;           // ~56px on 1750px
const SOURCES_LIST = 15;    // ~260px
const SOURCES_VIEWER = 32;  // ~42%
const NOTEBOOK_EXPANDED = 18; // ~300px
const NEXI_MIN = 35;        // Nexi never gets smaller than this

const Workspace = () => {
  const { id } = useParams();
  const courseId = id || "1";
  const course = courseData[courseId] || courseData["1"];

  const [sourcesMode, setSourcesMode] = useState<SourcesMode>("list");
  const [notebookState, setNotebookState] = useState<PaneState>("mini");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [notebookBeforeViewer, setNotebookBeforeViewer] = useState<PaneState>("mini");

  const sourcesPanelRef = useRef<ImperativePanelHandle>(null);
  const notebookPanelRef = useRef<ImperativePanelHandle>(null);

  /* ── Programmatic resize when mode changes ── */
  const resizeSources = useCallback((mode: SourcesMode) => {
    const panel = sourcesPanelRef.current;
    if (!panel) return;
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
  }, []);

  const resizeNotebook = useCallback((state: PaneState) => {
    const panel = notebookPanelRef.current;
    if (!panel) return;
    panel.resize(state === "expanded" ? NOTEBOOK_EXPANDED : MINI);
  }, []);

  /* Sync panel sizes when mode/state changes */
  useEffect(() => { resizeSources(sourcesMode); }, [sourcesMode, resizeSources]);
  useEffect(() => { resizeNotebook(notebookState); }, [notebookState, resizeNotebook]);

  /* When entering viewer mode, compress notebook */
  useEffect(() => {
    if (sourcesMode === "viewer" && notebookState === "expanded") {
      setNotebookBeforeViewer("expanded");
      setNotebookState("mini");
    }
  }, [sourcesMode]);

  const handleSelectSource = (id: string | null) => {
    setSelectedSource(id);
    if (id) setSourcesMode("viewer");
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
    if (sourcesMode === "mini") {
      setSourcesMode("list");
    } else {
      setSourcesMode("mini");
      setSelectedSource(null);
    }
  };

  /* ── Determine if drag handles should be visible ── */
  const showSourcesHandle = sourcesMode !== "mini";
  const showNotebookHandle = notebookState !== "mini";

  /* ── Collapse boundaries ── */
  const sourcesMin = sourcesMode === "mini" ? MINI : 10;
  const sourcesMax = sourcesMode === "mini" ? MINI : 50;
  const notebookMin = notebookState === "mini" ? MINI : 10;
  const notebookMax = notebookState === "mini" ? MINI : 30;

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="h-full">
        {/* ── Sources Panel ── */}
        <ResizablePanel
          ref={sourcesPanelRef}
          defaultSize={SOURCES_LIST}
          minSize={sourcesMin}
          maxSize={sourcesMax}
          collapsible={false}
          order={1}
          className="border-r border-border bg-card"
          style={{ transition: "flex 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <SourcesPane
            mode={sourcesMode}
            onToggle={handleSourcesToggle}
            selectedSource={selectedSource}
            onSelectSource={handleSelectSource}
            onDeselectSource={handleDeselectSource}
            courseTitle={course.title}
          />
        </ResizablePanel>

        {/* ── Sources ↔ Nexi handle ── */}
        <ResizableHandle
          className={`transition-opacity duration-200 ${showSourcesHandle ? "opacity-100" : "opacity-0 pointer-events-none w-0"}`}
        />

        {/* ── Nexi Center Panel — always dominant ── */}
        <ResizablePanel
          defaultSize={100 - SOURCES_LIST - MINI}
          minSize={NEXI_MIN}
          order={2}
          className="min-w-0 flex flex-col"
        >
          <NexiPane courseId={courseId} courseTitle={course.title} currentModule={course.module} />
        </ResizablePanel>

        {/* ── Nexi ↔ Notebook handle ── */}
        <ResizableHandle
          withHandle={showNotebookHandle}
          className={`transition-opacity duration-200 ${showNotebookHandle ? "opacity-100" : "opacity-0 pointer-events-none w-0"}`}
        />

        {/* ── Notebook Panel ── */}
        <ResizablePanel
          ref={notebookPanelRef}
          defaultSize={MINI}
          minSize={notebookMin}
          maxSize={notebookMax}
          collapsible={false}
          order={3}
          className="border-l border-border bg-card"
          style={{ transition: "flex 280ms cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          <NotebookPane
            state={notebookState}
            onToggle={() => setNotebookState((s) => (s === "expanded" ? "mini" : "expanded"))}
            courseTitle={course.title}
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default Workspace;
