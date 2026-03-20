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
  Clock,
  Layers,
} from "lucide-react";
import type { SourcesMode } from "@/pages/Workspace";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useWorkspace, type SourceItem } from "@/context/WorkspaceContext";

interface SourcesPaneProps {
  mode: SourcesMode;
  onToggle: () => void;
  selectedSource: string | null;
  onSelectSource: (id: string | null) => void;
  onDeselectSource: () => void;
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
  pdf: FileType,
  slides: Presentation,
  link: LinkIcon,
  note: StickyNote,
};

const typeLabel: Record<string, string> = {
  video: "Video",
  lecture: "Lecture",
  reading: "Reading",
  pdf: "PDF",
  slides: "Slides",
  link: "Link",
  note: "Note",
};

// Richer simulated document content for viewer mode
const sourceDocuments: Record<string, { sections: { heading: string; body: string }[] }> = {
  s1: {
    sections: [
      { heading: "Welcome", body: "This course provides a comprehensive introduction to machine learning, covering both theoretical foundations and practical applications. By the end of this course, you will understand the major paradigms of machine learning and be able to apply them to real-world problems." },
      { heading: "Course Objectives", body: "• Understand supervised, unsupervised, and reinforcement learning\n• Implement fundamental ML algorithms from scratch\n• Evaluate model performance using appropriate metrics\n• Apply ML techniques to structured and unstructured data" },
      { heading: "Prerequisites", body: "Linear algebra (matrices, vectors, eigendecomposition), probability and statistics, basic calculus, and programming experience in Python." },
    ],
  },
  s7: {
    sections: [
      { heading: "Introduction to Backpropagation", body: "Backpropagation is the core algorithm for training neural networks. It computes the gradient of the loss function with respect to each weight by applying the chain rule, propagating errors backward through the network layers." },
      { heading: "The Chain Rule", body: "The chain rule of calculus is the mathematical foundation of backpropagation. For a composite function f(g(x)), the derivative is f'(g(x)) · g'(x). In neural networks, this allows us to compute how each weight contributes to the final error by decomposing the computation into a series of local derivatives." },
      { heading: "Computational Graphs", body: "A computational graph represents the sequence of operations in a neural network as a directed acyclic graph. Each node represents an operation (addition, multiplication, activation function), and edges represent the flow of data. This abstraction makes it straightforward to apply the chain rule systematically." },
      { heading: "Forward Pass", body: "During the forward pass, input data flows through the network layer by layer. At each node, the incoming values are combined using the node's operation, and the result is passed to the next layer. The final output is compared to the target to compute the loss." },
      { heading: "Backward Pass", body: "The backward pass starts from the loss and propagates gradients back through the network. At each node, the incoming gradient (from the layer above) is multiplied by the local gradient of the node's operation. These gradients accumulate to give the total gradient for each weight." },
      { heading: "Vanishing & Exploding Gradients", body: "In deep networks, gradients can become extremely small (vanishing) or extremely large (exploding) as they propagate through many layers. This is because the gradient at each layer is the product of all the local gradients along the path. Solutions include careful initialization (Xavier, He), batch normalization, residual connections, and gradient clipping." },
      { heading: "Practical Considerations", body: "• Mini-batch gradient descent for computational efficiency\n• Learning rate selection and scheduling\n• Momentum and adaptive learning rate methods (Adam, RMSprop)\n• Regularization to prevent overfitting (L2, dropout)\n• Early stopping based on validation performance" },
    ],
  },
  s9: {
    sections: [
      { heading: "Abstract", body: "Training deep neural networks presents unique challenges that arise from the depth and complexity of modern architectures. This document surveys practical techniques for training deep networks reliably and efficiently." },
      { heading: "Weight Initialization", body: "Proper weight initialization is critical for training deep networks. Random initialization with the wrong scale can cause activations to vanish or explode through the layers. Xavier initialization sets weights to have variance 2/(n_in + n_out), while He initialization uses variance 2/n_in, which is better suited for ReLU networks." },
      { heading: "Batch Normalization", body: "Batch normalization normalizes the inputs to each layer to have zero mean and unit variance within each mini-batch. This reduces internal covariate shift, allows higher learning rates, and acts as a form of regularization. It is applied before or after the activation function." },
      { heading: "Residual Connections", body: "Skip connections, or residual connections, allow gradients to flow directly through the network by adding the input of a block to its output: y = F(x) + x. This architecture, introduced in ResNet, enables training of very deep networks (100+ layers) by mitigating the vanishing gradient problem." },
    ],
  },
};

function findSourceItem(sourceId: string): SourceItem | null {
  for (const mod of modules) {
    const item = mod.items.find((i) => i.id === sourceId);
    if (item) return { id: item.id, title: item.title, type: item.type, moduleName: mod.title };
  }
  return null;
}

export function SourcesPane({ mode, onToggle, selectedSource, onSelectSource, onDeselectSource, courseTitle }: SourcesPaneProps) {
  const { setActiveSource } = useWorkspace();

  const handleSelectSource = (id: string) => {
    onSelectSource(id);
    const source = findSourceItem(id);
    if (source) setActiveSource(source);
  };

  const handleDeselectSource = () => {
    onDeselectSource();
    setActiveSource(null);
  };

  // ─── Mini Rail ───
  if (mode === "mini") {
    const allItems = modules.flatMap((m) =>
      m.items.map((item) => ({ id: item.id, title: item.title, type: item.type }))
    );
    return (
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
                    onClick={() => handleSelectSource(item.id)}
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

  // ─── Viewer Mode ───
  if (mode === "viewer" && selectedSource) {
    const sourceItem = findSourceItem(selectedSource);
    const Icon = sourceItem ? typeIcon[sourceItem.type] : FileText;
    const doc = sourceDocuments[selectedSource];

    // Generic fallback content
    const fallbackContent = sourceItem
      ? `This ${typeLabel[sourceItem.type]?.toLowerCase() || "document"} is part of the ${sourceItem.moduleName} module. Open it in your preferred reader for the full experience, or use Nexi to ask questions about its content.`
      : "Select a source to view its content.";

    return (
      <div className="h-full flex flex-col animate-fade-in-gentle">
        {/* Viewer header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
          <button
            onClick={handleDeselectSource}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200 shrink-0"
          >
            <ArrowLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-serif font-medium text-foreground truncate">
              {sourceItem?.title || "Source Material"}
            </h3>
          </div>
          <button
            onClick={onToggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-secondary/70 transition-colors duration-200 shrink-0"
          >
            <ChevronLeft className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          </button>
        </div>

        {/* Source metadata strip */}
        {sourceItem && (
          <div className="px-5 py-2.5 border-b border-border/50 bg-muted/20">
            <div className="flex items-center gap-3 text-[11px] font-sans text-muted-foreground/70">
              <span className="flex items-center gap-1.5">
                <Icon className="h-3 w-3" strokeWidth={1.5} />
                {typeLabel[sourceItem.type]}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Layers className="h-3 w-3" strokeWidth={1.5} />
                {sourceItem.moduleName}
              </span>
              <span className="text-border">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3" strokeWidth={1.5} />
                12 min read
              </span>
            </div>
          </div>
        )}

        {/* Document reading surface */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-6">
            {doc ? (
              <div className="space-y-6">
                {doc.sections.map((section, i) => (
                  <div key={i} className="animate-fade-in-fast" style={{ animationDelay: `${i * 40}ms` }}>
                    <h4 className="text-[13px] font-sans font-semibold text-foreground mb-2 tracking-[-0.01em]">
                      {section.heading}
                    </h4>
                    <p className="text-[13px] font-sans text-foreground/85 leading-[1.8] whitespace-pre-line">
                      {section.body}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="rounded-xl border border-border/60 bg-muted/20 p-6 text-center">
                  <Icon className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" strokeWidth={1} />
                  <p className="text-[13px] font-sans text-foreground/70 leading-relaxed max-w-[320px] mx-auto">
                    {fallbackContent}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ─── List Mode ───
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
