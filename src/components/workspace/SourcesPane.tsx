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
  Code,
  FileCode,
  ExternalLink,
  Play,
} from "lucide-react";
import type { SourcesMode } from "@/pages/Workspace";
import type { SourceType } from "@/context/WorkspaceContext";
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
      { id: "s12", title: "Course Syllabus", type: "docx" as const, completed: true },
    ],
  },
  {
    id: "m2",
    title: "Linear Models",
    items: [
      { id: "s3", title: "Linear Regression", type: "lecture" as const, completed: true },
      { id: "s4", title: "Logistic Regression", type: "lecture" as const, completed: true },
      { id: "s5", title: "Regularization Methods", type: "reading" as const, completed: false },
      { id: "s13", title: "sklearn_regression.py", type: "code" as const, completed: false },
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
      { id: "s14", title: "Week 4 Slides", type: "slides" as const, completed: false },
      { id: "s15", title: "Gradient Visualization Demo", type: "link" as const, completed: false },
      { id: "s16", title: "Lab Notes — Tensor Ops", type: "txt" as const, completed: false },
    ],
  },
  {
    id: "m4",
    title: "Optimization",
    items: [
      { id: "s10", title: "Gradient Descent Variants", type: "lecture" as const, completed: false },
      { id: "s11", title: "Learning Rate Schedules", type: "reading" as const, completed: false },
      { id: "s17", title: "Optimization Lecture Recording", type: "video" as const, completed: false },
    ],
  },
];

const typeIcon: Record<SourceType, React.ElementType> = {
  video: Video,
  lecture: BookOpen,
  reading: FileText,
  pdf: FileType,
  docx: FileText,
  txt: FileCode,
  code: Code,
  slides: Presentation,
  link: LinkIcon,
  note: StickyNote,
};

const typeLabel: Record<SourceType, string> = {
  video: "Video",
  lecture: "Lecture",
  reading: "Reading",
  pdf: "PDF Document",
  docx: "Word Document",
  txt: "Text File",
  code: "Source Code",
  slides: "Slide Deck",
  link: "External Link",
  note: "Note",
};

const typeReadTime: Record<SourceType, string> = {
  video: "18 min watch",
  lecture: "45 min",
  reading: "12 min read",
  pdf: "22 pages",
  docx: "15 pages",
  txt: "8 min read",
  code: "142 lines",
  slides: "34 slides",
  link: "External resource",
  note: "Quick note",
};

// Rich simulated content per source, with type-aware rendering
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
      { heading: "Batch Normalization", body: "Batch normalization normalizes the inputs to each layer to have zero mean and unit variance within each mini-batch. This reduces internal covariate shift, allows higher learning rates, and acts as a form of regularization." },
      { heading: "Residual Connections", body: "Skip connections allow gradients to flow directly through the network by adding the input of a block to its output: y = F(x) + x. This architecture, introduced in ResNet, enables training of very deep networks (100+ layers) by mitigating the vanishing gradient problem." },
    ],
  },
  s12: {
    sections: [
      { heading: "Course Syllabus — Foundations of Machine Learning", body: "Department of Computer Science\nFall 2025 · 4 Credits\nInstructor: Prof. Sarah Chen" },
      { heading: "Course Description", body: "This course covers the mathematical and computational foundations of modern machine learning. Students will develop both theoretical understanding and practical skills through weekly problem sets, a midterm project, and a final research paper." },
      { heading: "Grading Breakdown", body: "• Problem Sets (40%) — Weekly assignments combining theory and implementation\n• Midterm Project (25%) — Reproduce and extend a published ML result\n• Final Paper (25%) — Original research or comprehensive survey\n• Participation (10%) — In-class discussion and peer review" },
      { heading: "Weekly Schedule", body: "Week 1–2: Mathematical foundations (linear algebra, probability)\nWeek 3–4: Linear models and regularization\nWeek 5–7: Neural networks and backpropagation\nWeek 8–9: Optimization and training techniques\nWeek 10–11: Convolutional and recurrent architectures\nWeek 12–13: Generative models and advanced topics\nWeek 14: Final presentations" },
      { heading: "Required Texts", body: "• Bishop, C. Pattern Recognition and Machine Learning\n• Goodfellow, I. et al. Deep Learning\n• Supplementary readings posted weekly on course site" },
      { heading: "Academic Integrity", body: "All submitted work must be your own. You may discuss problem sets with classmates but must write solutions independently. Code submissions are checked for similarity. Violations will result in a failing grade." },
    ],
  },
  s13: {
    sections: [
      { heading: "sklearn_regression.py", body: "```python\nimport numpy as np\nfrom sklearn.linear_model import LinearRegression, Ridge, Lasso\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.metrics import mean_squared_error, r2_score\nimport matplotlib.pyplot as plt\n\n# Generate synthetic data\nnp.random.seed(42)\nX = np.random.randn(200, 5)\ntrue_weights = np.array([3.0, -1.5, 0.0, 2.0, 0.0])\ny = X @ true_weights + np.random.randn(200) * 0.5\n\n# Split data\nX_train, X_test, y_train, y_test = train_test_split(\n    X, y, test_size=0.2, random_state=42\n)\n```" },
      { heading: "Model Comparison", body: "```python\n# Train models\nmodels = {\n    'OLS': LinearRegression(),\n    'Ridge (α=1.0)': Ridge(alpha=1.0),\n    'Lasso (α=0.1)': Lasso(alpha=0.1),\n}\n\nresults = {}\nfor name, model in models.items():\n    model.fit(X_train, y_train)\n    y_pred = model.predict(X_test)\n    results[name] = {\n        'mse': mean_squared_error(y_test, y_pred),\n        'r2': r2_score(y_test, y_pred),\n        'weights': model.coef_\n    }\n    print(f'{name}:')\n    print(f'  MSE: {results[name][\"mse\"]:.4f}')\n    print(f'  R²:  {results[name][\"r2\"]:.4f}')\n    print(f'  Weights: {model.coef_.round(3)}')\n```" },
      { heading: "Visualization", body: "```python\n# Plot weight comparison\nfig, ax = plt.subplots(figsize=(10, 5))\nwidth = 0.25\nx_pos = np.arange(5)\n\nfor i, (name, res) in enumerate(results.items()):\n    ax.bar(x_pos + i * width, res['weights'],\n           width, label=name, alpha=0.8)\n\nax.bar(x_pos + 3 * width, true_weights,\n       width, label='True', alpha=0.4, color='black')\n\nax.set_xlabel('Feature Index')\nax.set_ylabel('Weight Value')\nax.set_title('Learned Weights vs True Weights')\nax.legend()\nplt.tight_layout()\nplt.savefig('weight_comparison.png', dpi=150)\n```" },
    ],
  },
  s14: {
    sections: [
      { heading: "Week 4: Neural Networks — Slide Overview", body: "34 slides covering the fundamentals of neural network architectures, from single perceptrons to multi-layer networks." },
      { heading: "Slide 1–8: From Perceptrons to MLPs", body: "• The perceptron: a linear classifier with a step activation\n• Limitations: cannot learn XOR or non-linear boundaries\n• Multi-layer perceptrons overcome these limitations\n• Universal approximation theorem: a single hidden layer can approximate any continuous function\n• But depth provides exponential expressiveness gains" },
      { heading: "Slide 9–18: Activation Functions", body: "• Sigmoid: σ(x) = 1/(1 + e^(-x)) — smooth, bounded, but saturates\n• Tanh: tanh(x) — zero-centered sigmoid variant\n• ReLU: max(0, x) — simple, fast, enables deep training\n• Leaky ReLU: prevents dead neurons with small negative slope\n• GELU, Swish: modern smooth activations used in transformers" },
      { heading: "Slide 19–28: Training with Backpropagation", body: "• Loss functions: MSE for regression, cross-entropy for classification\n• Gradient computation via chain rule\n• Weight update rule: w ← w − η · ∂L/∂w\n• Mini-batch stochastic gradient descent\n• Practical: learning rate warmup and cosine decay" },
      { heading: "Slide 29–34: Practical Architectures", body: "• Input/hidden/output layer sizing heuristics\n• Dropout as regularization\n• Batch normalization for training stability\n• Skip connections and residual learning\n• When to use CNNs vs MLPs vs attention" },
    ],
  },
  s15: {
    sections: [
      { heading: "Gradient Visualization Demo", body: "Interactive web demonstration showing how gradients flow through a neural network during backpropagation." },
      { heading: "Features", body: "• Real-time gradient magnitude visualization per layer\n• Adjustable network depth (2–20 layers)\n• Toggle between sigmoid, ReLU, and tanh activations\n• See vanishing/exploding gradients in action\n• Compare Xavier vs random initialization" },
      { heading: "Link", body: "https://gradient-viz.ml-demos.edu/backprop\n\nNote: Requires a modern browser with WebGL support. Best viewed on desktop." },
    ],
  },
  s16: {
    sections: [
      { heading: "Lab Notes — Tensor Operations", body: "Quick reference for common tensor operations in PyTorch and NumPy.\nLast updated: Week 4, after the backpropagation lab." },
      { heading: "Reshaping", body: "torch.reshape(x, (batch, -1))  # flatten spatial dims\nx.view(batch, channels, h, w)   # reshape with contiguous memory\nx.permute(0, 2, 3, 1)           # NCHW → NHWC\nnp.transpose(x, (0, 2, 1))      # swap last two axes" },
      { heading: "Broadcasting Rules", body: "1. If tensors differ in ndim, prepend 1s to the smaller shape\n2. Dimensions are compatible if equal OR one of them is 1\n3. The output shape takes the max along each dimension\n\nExample:\n  (3, 1, 5) + (1, 4, 5) → (3, 4, 5)" },
      { heading: "Gradient Gotchas", body: "• In-place operations break autograd: x += 1 is bad, x = x + 1 is fine\n• .detach() creates a tensor that shares storage but has no grad_fn\n• torch.no_grad() context manager disables gradient tracking (use for inference)\n• .item() extracts a scalar — use for logging, not in computation graph" },
    ],
  },
  s17: {
    sections: [
      { heading: "Optimization Lecture Recording", body: "Video recording of Professor Chen's lecture on gradient descent variants and learning rate scheduling. Duration: 52 minutes." },
      { heading: "Timestamps", body: "00:00 — Introduction and motivation\n08:15 — Vanilla gradient descent review\n15:30 — SGD with momentum\n24:00 — RMSprop and adaptive learning rates\n32:45 — Adam optimizer: combining momentum + RMSprop\n41:00 — Learning rate schedules (step, cosine, warmup)\n48:30 — Q&A and practical tips" },
      { heading: "Key Takeaways", body: "• Momentum smooths out oscillations in ravines\n• Adam is a good default but not always optimal\n• Learning rate is the most important hyperparameter\n• Warmup helps stabilize early training in deep networks\n• Cosine annealing often outperforms step decay" },
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
          {allItems.slice(0, 10).map((item) => {
            const Icon = typeIcon[item.type];
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => handleSelectSource(item.id)}
                    className={`h-8 w-8 flex items-center justify-center rounded-lg transition-colors duration-200 ${
                      selectedSource === item.id
                        ? "bg-secondary text-foreground"
                        : "hover:bg-secondary/80 text-muted-foreground/80"
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
    const isCode = sourceItem?.type === "code";
    const isVideo = sourceItem?.type === "video";
    const isLink = sourceItem?.type === "link";
    const isSlides = sourceItem?.type === "slides";

    return (
      <div className="h-full flex flex-col animate-fade-in-gentle">
        {/* Viewer header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-border shrink-0">
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
          <div className="px-5 py-2.5 border-b border-border/50 bg-muted/20 shrink-0">
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
                {typeReadTime[sourceItem.type]}
              </span>
            </div>
          </div>
        )}

        {/* Video player placeholder */}
        {isVideo && (
          <div className="mx-5 mt-5 mb-2 rounded-xl bg-foreground/5 border border-border aspect-video flex items-center justify-center shrink-0">
            <div className="flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Play className="h-5 w-5 text-primary/70 ml-0.5" strokeWidth={1.5} />
              </div>
              <span className="text-[11px] font-sans text-muted-foreground/80">{typeReadTime[sourceItem!.type]}</span>
            </div>
          </div>
        )}

        {/* Link external indicator */}
        {isLink && (
          <div className="mx-5 mt-5 mb-2 rounded-xl border border-accent/20 bg-accent/5 p-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <ExternalLink className="h-4 w-4 text-accent" strokeWidth={1.5} />
              </div>
              <div className="min-w-0">
                <p className="text-[12px] font-sans font-medium text-foreground truncate">{sourceItem?.title}</p>
                <p className="text-[11px] font-sans text-accent/70 truncate">gradient-viz.ml-demos.edu</p>
              </div>
            </div>
          </div>
        )}

        {/* Slides visual indicator */}
        {isSlides && (
          <div className="mx-5 mt-5 mb-2 shrink-0">
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-[16/10] rounded-lg bg-muted/40 border border-border/60 flex items-center justify-center">
                  <Presentation className="h-4 w-4 text-muted-foreground/70" strokeWidth={1.5} />
                </div>
              ))}
            </div>
            <p className="text-[10px] font-sans text-muted-foreground/70 mt-2 text-center">{typeReadTime[sourceItem!.type]}</p>
          </div>
        )}

        {/* Document reading surface */}
        <div className="flex-1 overflow-y-auto scrollbar-thin">
          <div className="px-6 py-5">
            {doc ? (
              <div className="space-y-5">
                {doc.sections.map((section, i) => (
                  <div key={i} className="animate-fade-in-fast" style={{ animationDelay: `${i * 30}ms` }}>
                    <h4 className={`text-[13px] font-sans font-semibold text-foreground mb-2 tracking-[-0.01em] ${isCode ? "font-mono text-[12px]" : ""}`}>
                      {section.heading}
                    </h4>
                    {section.body.includes("```") ? (
                      <div className="space-y-2">
                        {section.body.split("```").map((block, bi) => {
                          if (bi % 2 === 0) {
                            return block.trim() ? (
                              <p key={bi} className="text-[13px] font-sans text-foreground/85 leading-[1.8] whitespace-pre-line">{block.trim()}</p>
                            ) : null;
                          }
                          // Code block — strip language tag
                          const lines = block.split("\n");
                          const firstLine = lines[0]?.trim();
                          const hasLangTag = firstLine && /^[a-z]+$/.test(firstLine);
                          const codeContent = hasLangTag ? lines.slice(1).join("\n") : block;
                          return (
                            <pre key={bi} className="rounded-lg bg-foreground/[0.03] border border-border/60 px-4 py-3 overflow-x-auto">
                              <code className="text-[12px] font-mono text-foreground/80 leading-relaxed whitespace-pre">
                                {codeContent.trim()}
                              </code>
                            </pre>
                          );
                        })}
                      </div>
                    ) : (
                      <p className={`text-[13px] text-foreground/85 leading-[1.8] whitespace-pre-line ${isCode ? "font-mono text-[12px] leading-[1.6]" : "font-sans"}`}>
                        {section.body}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-xl border border-border/60 bg-muted/20 p-6 text-center">
                <Icon className="h-10 w-10 text-muted-foreground/70 mx-auto mb-3" strokeWidth={1} />
                <p className="text-[13px] font-sans text-foreground/70 leading-relaxed max-w-[320px] mx-auto">
                  This {typeLabel[sourceItem?.type || "reading"]?.toLowerCase()} is part of the {sourceItem?.moduleName} module.
                  Use Nexi to ask questions about its content.
                </p>
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
              <h3 className="text-[10px] font-sans font-medium text-muted-foreground/80 uppercase tracking-widest">
                {module.title}
              </h3>
            </div>
            <div className="space-y-px px-2">
              {module.items.map((item) => {
                const ItemIcon = typeIcon[item.type];
                const isSelected = selectedSource === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectSource(item.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-lg text-left transition-all duration-200 ${
                      isSelected
                        ? "bg-secondary text-foreground"
                        : "text-foreground/75 hover:bg-secondary/80 hover:text-foreground"
                    }`}
                  >
                    <ItemIcon className="h-3.5 w-3.5 text-muted-foreground/70 shrink-0" strokeWidth={1.5} />
                    <span className="text-[12px] font-sans flex-1 truncate">{item.title}</span>
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
