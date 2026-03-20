import {
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Video,
  FileType,
  ArrowLeft,
  Check,
  Presentation,
  Link as LinkIcon,
  StickyNote,
} from "lucide-react";
import type { PaneState } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace, type SourceItem } from "@/context/WorkspaceContext";

interface SourcesPaneProps {
  state: PaneState;
  onToggle: () => void;
  selectedSource: string | null;
  onSelectSource: (id: string | null) => void;
  courseTitle: string;
}

const modules = [
  {
    id: "m1",
    title: "Introduction & Overview",
    items: [
      { id: "s1", title: "Course Introduction", type: "video" as const, completed: true },
      { id: "s2", title: "Mathematical Prerequisites", type: "reading" as const, completed: true },
    ],
  },
  {
    id: "m2",
    title: "Linear Models",
    items: [
      { id: "s3", title: "Linear Regression", type: "lecture" as const, completed: true },
      { id: "s4", title: "Logistic Regression", type: "lecture" as const, completed: true },
      { id: "s5", title: "Regularization Methods", type: "reading" as const, completed: false },
    ],
  },
  {
    id: "m3",
    title: "Neural Networks",
    items: [
      { id: "s6", title: "Perceptrons & MLPs", type: "lecture" as const, completed: true },
      { id: "s7", title: "Backpropagation", type: "lecture" as const, completed: false },
      { id: "s8", title: "Activation Functions", type: "reading" as const, completed: false },
      { id: "s9", title: "Training Deep Networks", type: "pdf" as const, completed: false },
    ],
  },
  {
    id: "m4",
    title: "Optimization",
    items: [
      { id: "s10", title: "Gradient Descent Variants", type: "lecture" as const, completed: false },
      { id: "s11", title: "Learning Rate Schedules", type: "reading" as const, completed: false },
    ],
  },
];

// Accurate icons per document type
const typeIcon = {
  video: Video,
  lecture: BookOpen,
  reading: FileText,
  pdf: FileType,
  slides: Presentation,
  link: LinkIcon,
  note: StickyNote,
};

const typeLabel = {
  video: "Video",
  lecture: "Lecture",
  reading: "Reading",
  pdf: "PDF",
};

const focusedSourceContent: Record<string, { title: string; type: string; preview: string }> = {
  s7: {
    title: "Backpropagation",
    type: "Lecture",
    preview: "Backpropagation is the core algorithm for training neural networks. It computes the gradient of the loss function with respect to each weight by applying the chain rule, propagating errors backward through the network layers.\n\nKey concepts covered:\n• Chain rule of calculus\n• Computational graphs\n• Forward and backward passes\n• Gradient flow and vanishing gradients\n• Practical implementation considerations",
  },
};

function findSourceItem(sourceId: string): SourceItem | null {
  for (const mod of modules) {
    const item = mod.items.find((i) => i.id === sourceId);
    if (item) return { id: item.id, title: item.title, type: item.type, moduleName: mod.title };
  }
  return null;
}

export function SourcesPane({ state, onToggle, selectedSource, onSelectSource, courseTitle }: SourcesPaneProps) {
  const isMini = state === "mini";
  const { setActiveSource } = useWorkspace();

  const handleSelectSource = (id: string) => {
    onSelectSource(id);
    const source = findSourceItem(id);
    if (source) setActiveSource(source);
  };

  const handleDeselectSource = () => {
    onSelectSource(null);
    setActiveSource(null);
  };

  if (isMini) {
    const allItems: { id: string; title: string; type: "video" | "lecture" | "reading" | "pdf" }[] = modules.flatMap((m) =>
      m.items.map((item) => ({ id: item.id, title: item.title, type: item.type }))
    );
      <div className="h-full flex flex-col items-center py-4 gap-1.5">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-sans text-xs">Sources</TooltipContent>
        </Tooltip>
        <div className="flex flex-col gap-1 mt-3">
          {allItems.slice(0, 8).map((item) => {
            const Icon = typeIcon[item.type];
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => {
                      handleSelectSource(item.id);
                      onToggle();
                    }}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                      selectedSource === item.id
                        ? "bg-secondary text-foreground"
                        : "hover:bg-secondary/70 text-muted-foreground/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="right" className="font-sans text-xs">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    );
  }

  // Focused source — Readwise Reader-inspired reading surface
  if (selectedSource) {
    const sourceItem = findSourceItem(selectedSource);
    const focused = focusedSourceContent[selectedSource] || {
      title: sourceItem?.title || "Source Material",
      type: sourceItem ? typeLabel[sourceItem.type] : "Document",
      preview: "Select a source to view its content and context. This material serves as grounding for your learning conversations with Nexi.",
    };

    return (
      <div className="h-full flex flex-col animate-fade-in-gentle">
        <div className="flex items-center gap-2 px-4 py-3.5 border-b border-border">
          <button
            onClick={handleDeselectSource}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-[13px] font-sans font-medium text-foreground truncate">{focused.title}</h3>
            <span className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-wider">{focused.type}</span>
          </div>
          <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>

        {/* Source metadata bar */}
        {sourceItem && (
          <div className="px-4 py-2.5 border-b border-border/60 bg-muted/30">
            <div className="flex items-center gap-2 text-[10px] font-sans text-muted-foreground/60">
              <span className="uppercase tracking-wider">{sourceItem.moduleName}</span>
              <span>·</span>
              <span>{typeLabel[sourceItem.type]}</span>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
          <p className="text-[13px] font-sans text-foreground/90 leading-[1.75] whitespace-pre-line">{focused.preview}</p>
        </div>
      </div>
    );
  }

  // Expanded module tree
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-border">
        <div className="min-w-0 flex-1">
          <h2 className="text-[10px] font-sans text-muted-foreground/70 uppercase tracking-widest mb-0.5">Sources</h2>
          <p className="text-[13px] font-sans font-medium text-foreground truncate">{courseTitle}</p>
        </div>
        <button
          onClick={onToggle}
          className="h-7 w-7 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200 shrink-0"
        >
          <ChevronLeft className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-3 scrollbar-thin">
        {modules.map((module) => (
          <div key={module.id} className="mb-1">
            <div className="px-4 py-2">
              <h3 className="text-[10px] font-sans font-medium text-muted-foreground/60 uppercase tracking-widest">
                {module.title}
              </h3>
            </div>
            <div className="space-y-px px-2">
              {module.items.map((item) => {
                const Icon = typeIcon[item.type];
                const isSelected = selectedSource === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSource(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-secondary text-foreground"
                        : "text-foreground/75 hover:bg-muted/50 hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground/50 shrink-0" strokeWidth={1.5} />
                    <span className="text-[12px] font-sans flex-1 truncate">{item.title}</span>
                    {item.completed && (
                      <Check className="h-3 w-3 text-accent/60 shrink-0" strokeWidth={2} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
