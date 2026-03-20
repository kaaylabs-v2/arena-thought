import { useState } from "react";
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

const Workspace = () => {
  const { id } = useParams();
  const courseId = id || "1";
  const course = courseData[courseId] || courseData["1"];

  const [sourcesState, setSourcesState] = useState<PaneState>("expanded");
  const [notebookState, setNotebookState] = useState<PaneState>("mini");
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Sources Pane */}
      <div
        className={`shrink-0 border-r border-border bg-card pane-transition overflow-hidden ${
          sourcesState === "expanded" ? "w-[280px]" : "w-14"
        }`}
      >
        <SourcesPane
          state={sourcesState}
          onToggle={() => setSourcesState((s) => (s === "expanded" ? "mini" : "expanded"))}
          selectedSource={selectedSource}
          onSelectSource={setSelectedSource}
          courseTitle={course.title}
        />
      </div>

      {/* Nexi Center Pane — always dominant */}
      <div className="flex-1 min-w-0 flex flex-col">
        <NexiPane courseId={courseId} courseTitle={course.title} currentModule={course.module} />
      </div>

      {/* Notebook Pane */}
      <div
        className={`shrink-0 border-l border-border bg-card pane-transition overflow-hidden ${
          notebookState === "expanded" ? "w-[320px]" : "w-14"
        }`}
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
