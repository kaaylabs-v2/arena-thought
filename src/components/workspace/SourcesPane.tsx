import {
  ChevronLeft,
  ChevronRight,
  FileText,
  BookOpen,
  Video,
  File,
  Pin,
  Clock,
  ArrowLeft,
  Check,
} from "lucide-react";
import type { PaneState } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

const typeIcon = {
  video: Video,
  lecture: BookOpen,
  reading: FileText,
  pdf: File,
};

const focusedSourceContent = {
  s7: {
    title: "Backpropagation",
    type: "Lecture",
    preview: "Backpropagation is the core algorithm for training neural networks. It computes the gradient of the loss function with respect to each weight by applying the chain rule, propagating errors backward through the network layers.\n\nKey concepts covered:\n• Chain rule of calculus\n• Computational graphs\n• Forward and backward passes\n• Gradient flow and vanishing gradients\n• Practical implementation considerations",
  },
};

export function SourcesPane({ state, onToggle, selectedSource, onSelectSource, courseTitle }: SourcesPaneProps) {
  const isMini = state === "mini";

  if (isMini) {
    return (
      <div className="h-full flex flex-col items-center py-4 gap-3">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={onToggle}
              className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="font-sans text-xs">Sources</TooltipContent>
        </Tooltip>
        <div className="flex flex-col gap-2 mt-2">
          {modules.map((m) => (
            <Tooltip key={m.id}>
              <TooltipTrigger asChild>
                <button className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors">
                  <BookOpen className="h-3.5 w-3.5 text-muted-foreground" strokeWidth={1.5} />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="font-sans text-xs">{m.title}</TooltipContent>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  }

  // Focused source mode
  if (selectedSource) {
    const focused = focusedSourceContent[selectedSource as keyof typeof focusedSourceContent] || {
      title: "Source Material",
      type: "Document",
      preview: "Select a source to view its content and context. This material serves as grounding for your learning conversations with Nexi.",
    };

    return (
      <div className="h-full flex flex-col">
        <div className="flex items-center gap-2 p-4 border-b border-border">
          <button
            onClick={() => onSelectSource(null)}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-sans font-medium text-foreground truncate">{focused.title}</h3>
            <span className="text-[10px] font-sans text-muted-foreground">{focused.type}</span>
          </div>
          <button
            onClick={onToggle}
            className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <p className="text-sm font-sans text-foreground leading-relaxed whitespace-pre-line">{focused.preview}</p>
        </div>
      </div>
    );
  }

  // Expanded module tree
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="min-w-0 flex-1">
          <h2 className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-0.5">Sources</h2>
          <p className="text-sm font-sans font-medium text-foreground truncate">{courseTitle}</p>
        </div>
        <button
          onClick={onToggle}
          className="h-7 w-7 flex items-center justify-center rounded-md hover:bg-secondary transition-colors shrink-0"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((module) => (
          <div key={module.id} className="mb-1">
            <div className="px-4 py-2">
              <h3 className="text-[11px] font-sans font-medium text-muted-foreground uppercase tracking-wider">
                {module.title}
              </h3>
            </div>
            <div className="space-y-0.5 px-2">
              {module.items.map((item) => {
                const Icon = typeIcon[item.type];
                return (
                  <button
                    key={item.id}
                    onClick={() => onSelectSource(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2 py-2 rounded-lg text-left transition-colors duration-150 ${
                      selectedSource === item.id
                        ? "bg-secondary text-foreground"
                        : "text-foreground/80 hover:bg-secondary/60"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 text-muted-foreground shrink-0" strokeWidth={1.5} />
                    <span className="text-xs font-sans flex-1 truncate">{item.title}</span>
                    {item.completed && (
                      <Check className="h-3 w-3 text-accent shrink-0" strokeWidth={2} />
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
