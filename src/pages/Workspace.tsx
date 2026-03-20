import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { SourcesPane } from "@/components/workspace/SourcesPane";
import { NexiPane } from "@/components/workspace/NexiPane";
import { NotebookPane } from "@/components/workspace/NotebookPane";

const courseData: Record<string, { title: string; module: string }> = {
  "1": { title: "Foundations of Machine Learning", module: "Week 4: Neural Networks" },
  "2": { title: "Advanced Statistical Methods", module: "Chapter 7: Bayesian Inference" },
  "3": { title: "Philosophy of Mind", module: "Section 12: Consciousness" },
};

export type PaneState = "expanded" | "mini";
export type SourcesMode = "mini" | "list" | "viewer";

const Workspace = () => {
  const { id } = useParams();
  const courseId = id || "1";
  const course = courseData[courseId] || courseData["1"];

  const [sourcesMode, setSourcesMode] = useState<SourcesMode>("list");
  const [notebookState, setNotebookState] = useState<PaneState>("mini");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  // Store notebook state before viewer forced it to mini
  const [notebookBeforeViewer, setNotebookBeforeViewer] = useState<PaneState>("mini");

  // When entering viewer mode, compress notebook; when leaving, restore
  useEffect(() => {
    if (sourcesMode === "viewer" && notebookState === "expanded") {
      setNotebookBeforeViewer("expanded");
      setNotebookState("mini");
    }
  }, [sourcesMode]);

  const handleSelectSource = (id: string | null) => {
    setSelectedSource(id);
    if (id) {
      setSourcesMode("viewer");
    }
  };

  const handleDeselectSource = () => {
    setSelectedSource(null);
    setSourcesMode("list");
    // Restore notebook if it was expanded before
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

  // Dynamic width classes for sources pane
  const sourcesWidthClass =
    sourcesMode === "viewer"
      ? "w-[42%] min-w-[380px] max-w-[560px]"
      : sourcesMode === "list"
        ? "w-[260px]"
        : "w-14";

  // Notebook width — always mini when viewer is open
  const notebookWidthClass = notebookState === "expanded" ? "w-[300px]" : "w-14";

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sources Pane */}
      <div
        className={`shrink-0 border-r border-border bg-card pane-transition overflow-hidden ${sourcesWidthClass}`}
      >
        <SourcesPane
          mode={sourcesMode}
          onToggle={handleSourcesToggle}
          selectedSource={selectedSource}
          onSelectSource={handleSelectSource}
          onDeselectSource={handleDeselectSource}
          courseTitle={course.title}
        />
      </div>

      {/* Nexi Center Pane — always dominant */}
      <div className="flex-1 min-w-0 flex flex-col">
        <NexiPane courseId={courseId} courseTitle={course.title} currentModule={course.module} />
      </div>

      {/* Notebook Pane */}
      <div
        className={`shrink-0 border-l border-border bg-card pane-transition overflow-hidden ${notebookWidthClass}`}
      >
        <NotebookPane
          state={notebookState}
          onToggle={() => setNotebookState((s) => (s === "expanded" ? "mini" : "expanded"))}
          courseTitle={course.title}
        />
      </div>
    </div>
  );
};

export default Workspace;
