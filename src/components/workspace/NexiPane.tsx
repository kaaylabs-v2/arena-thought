import { useState } from "react";
import {
  Send,
  BookmarkPlus,
  Copy,
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  ArrowRightLeft,
  ListChecks,
} from "lucide-react";

interface NexiPaneProps {
  courseTitle: string;
  currentModule: string;
}

interface Message {
  id: string;
  role: "user" | "nexi";
  content: string;
  citations?: string[];
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "nexi",
    content:
      "Welcome to your workspace for **Neural Networks**. I'm grounded in your course materials and ready to help you build understanding.\n\nYou're currently working through backpropagation. Would you like me to explain how the chain rule enables gradient computation through network layers?",
    citations: ["Lecture: Perceptrons & MLPs", "Reading: Activation Functions"],
  },
  {
    id: "2",
    role: "user",
    content: "Yes, explain backpropagation step by step. Start with a simple example.",
  },
  {
    id: "3",
    role: "nexi",
    content:
      "Let me walk through backpropagation with a minimal network — a single neuron with one input, one weight, and a squared error loss.\n\n**Forward pass:**\nGiven input *x = 2*, weight *w = 0.5*, and target *y = 1*:\n- Output: ŷ = w · x = 0.5 × 2 = 1.0\n- Loss: L = (y - ŷ)² = (1 - 1)² = 0\n\n**Now suppose w = 0.3:**\n- Output: ŷ = 0.3 × 2 = 0.6\n- Loss: L = (1 - 0.6)² = 0.16\n\n**Backward pass (the gradient):**\nWe need ∂L/∂w to know how to adjust the weight.\n\nBy the chain rule:\n∂L/∂w = ∂L/∂ŷ · ∂ŷ/∂w = 2(ŷ - y) · x = 2(0.6 - 1) · 2 = **-1.6**\n\nThe negative sign tells us to *increase* w — which makes sense, since we need a larger output.\n\n**Key insight:** Backpropagation simply applies this chain rule systematically through every layer, accumulating gradients from the output back to the input. In deeper networks, each layer contributes a local gradient that gets multiplied along the path.",
    citations: ["Lecture: Backpropagation", "Lecture: Perceptrons & MLPs"],
  },
];

const followUpChips = [
  { label: "Explain simply", icon: Lightbulb },
  { label: "Quiz me", icon: HelpCircle },
  { label: "Extract key ideas", icon: ListChecks },
  { label: "Compare concepts", icon: ArrowRightLeft },
];

export function NexiPane({ courseTitle, currentModule }: NexiPaneProps) {
  const [messages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());

  const handleSave = (id: string) => {
    setSavedMessages((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div>
          <h2 className="font-serif text-lg text-foreground">{courseTitle}</h2>
          <p className="text-[11px] font-sans text-muted-foreground">{currentModule}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-sans text-accent bg-accent/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            Nexi
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`animate-fade-in ${msg.role === "user" ? "flex justify-end" : ""}`}
          >
            {msg.role === "user" ? (
              <div className="max-w-lg bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3.5">
                <p className="text-sm font-sans leading-relaxed">{msg.content}</p>
              </div>
            ) : (
              <div className="max-w-2xl">
                <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4">
                  <div className="text-sm font-sans text-foreground leading-relaxed whitespace-pre-line prose-content">
                    {msg.content.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
                      if (part.startsWith("**") && part.endsWith("**")) {
                        return <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>;
                      }
                      if (part.startsWith("*") && part.endsWith("*")) {
                        return <em key={i} className="italic">{part.slice(1, -1)}</em>;
                      }
                      return <span key={i}>{part}</span>;
                    })}
                  </div>

                  {/* Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-border">
                      {msg.citations.map((cite, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-sans text-muted-foreground bg-secondary px-2 py-0.5 rounded-full flex items-center gap-1"
                        >
                          <FileText className="h-2.5 w-2.5" strokeWidth={1.5} />
                          {cite}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action row */}
                <div className="flex items-center gap-2 mt-2 ml-1">
                  <button
                    onClick={() => handleSave(msg.id)}
                    className={`flex items-center gap-1 text-[11px] font-sans px-2 py-1 rounded-md transition-colors duration-150 ${
                      savedMessages.has(msg.id)
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    <BookmarkPlus className="h-3 w-3" strokeWidth={1.5} />
                    {savedMessages.has(msg.id) ? "Saved" : "Save to Notebook"}
                  </button>
                  <button
                    onClick={() => navigator.clipboard.writeText(msg.content)}
                    className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground hover:text-foreground hover:bg-secondary px-2 py-1 rounded-md transition-colors duration-150"
                  >
                    <Copy className="h-3 w-3" strokeWidth={1.5} />
                    Copy
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Follow-up chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {followUpChips.map((chip) => (
            <button
              key={chip.label}
              className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:text-foreground hover:border-accent/30 hover:bg-secondary/50 transition-all duration-150"
            >
              <chip.icon className="h-3 w-3" strokeWidth={1.5} />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input area */}
      <div className="px-6 pb-6 pt-2">
        <div className="flex items-end gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-shadow">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Nexi about your course materials..."
            rows={1}
            className="flex-1 bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-[120px]"
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = "auto";
              target.style.height = Math.min(target.scrollHeight, 120) + "px";
            }}
          />
          <button
            className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 shrink-0 disabled:opacity-40"
            disabled={!input.trim()}
          >
            <Send className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <p className="text-[10px] font-sans text-muted-foreground mt-2 text-center">
          Grounded in your course materials · Responses may not always be accurate
        </p>
      </div>
    </div>
  );
}
