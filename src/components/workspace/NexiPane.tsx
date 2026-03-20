import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  BookmarkPlus,
  Copy,
  Check,
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  ArrowRightLeft,
  ListChecks,
} from "lucide-react";
import { useWorkspace, simulatedResponses } from "@/context/WorkspaceContext";

interface NexiPaneProps {
  courseId: string;
  courseTitle: string;
  currentModule: string;
}

const followUpChips = [
  { label: "Explain simply", icon: Lightbulb },
  { label: "Quiz me", icon: HelpCircle },
  { label: "Extract key ideas", icon: ListChecks },
  { label: "Compare concepts", icon: ArrowRightLeft },
];

export function NexiPane({ courseId, courseTitle, currentModule }: NexiPaneProps) {
  const { chatMessages, addMessage, addNotebookEntry, activeSource } = useWorkspace();
  const messages = chatMessages[courseId] || [];
  const [input, setInput] = useState("");
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages.length, isTyping]);

  const simulateResponse = useCallback((prompt: string) => {
    setIsTyping(true);
    const chipMatch = followUpChips.find((c) => c.label === prompt);
    const responseData = chipMatch
      ? simulatedResponses[chipMatch.label] || simulatedResponses.default
      : simulatedResponses.default;

    setTimeout(() => {
      addMessage(courseId, {
        role: "nexi",
        content: responseData.content,
        citations: responseData.citations,
      });
      setIsTyping(false);
    }, 800 + Math.random() * 600);
  }, [courseId, addMessage]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage(courseId, { role: "user", content: text });
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    simulateResponse(text);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSave = (msgId: string, content: string) => {
    if (savedMessages.has(msgId)) return;
    setSavedMessages((prev) => new Set(prev).add(msgId));
    const title = content.slice(0, 60).replace(/\*\*/g, "").replace(/\n/g, " ").trim();
    addNotebookEntry({
      title: title.length < content.length ? title + "…" : title,
      snippet: content.slice(0, 200).replace(/\*\*/g, "").replace(/\n/g, " "),
      course: courseTitle,
      tags: [],
      source: "Nexi response",
      savedFrom: "nexi",
    });
  };

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleChip = (label: string) => {
    addMessage(courseId, { role: "user", content: label });
    simulateResponse(label);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border">
        <div>
          <h2 className="font-serif text-lg text-foreground">{courseTitle}</h2>
          <p className="text-[11px] font-sans text-muted-foreground">
            {activeSource ? `Grounded in: ${activeSource.title}` : currentModule}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-sans text-accent bg-accent/10 px-2.5 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="h-3 w-3" strokeWidth={1.5} />
            Nexi
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-fade-in ${msg.role === "user" ? "flex justify-end" : ""} ${msg.role === "system" ? "flex justify-center" : ""}`}
            >
              {msg.role === "system" ? (
                <div className="text-[11px] font-sans text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                  {msg.content}
                </div>
              ) : msg.role === "user" ? (
                <div className="max-w-lg bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3.5">
                  <p className="text-sm font-sans leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4">
                    <div className="text-sm font-sans text-foreground leading-relaxed whitespace-pre-line">
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
                  <div className="flex items-center gap-2 mt-2 ml-1">
                    <button
                      onClick={() => handleSave(msg.id, msg.content)}
                      className={`flex items-center gap-1 text-[11px] font-sans px-2 py-1 rounded-md transition-colors duration-150 ${
                        savedMessages.has(msg.id)
                          ? "text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                      }`}
                    >
                      {savedMessages.has(msg.id) ? (
                        <Check className="h-3 w-3" strokeWidth={1.5} />
                      ) : (
                        <BookmarkPlus className="h-3 w-3" strokeWidth={1.5} />
                      )}
                      {savedMessages.has(msg.id) ? "Saved" : "Save to Notebook"}
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground hover:text-foreground hover:bg-secondary px-2 py-1 rounded-md transition-colors duration-150"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3" strokeWidth={1.5} />
                      ) : (
                        <Copy className="h-3 w-3" strokeWidth={1.5} />
                      )}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="animate-fade-in">
              <div className="bg-card border border-border rounded-2xl rounded-bl-md px-5 py-4 max-w-[120px]">
                <div className="flex gap-1.5 items-center">
                  <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-pulse" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/40 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Follow-up chips */}
          {!isTyping && messages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {followUpChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChip(chip.label)}
                  className="flex items-center gap-1.5 text-xs font-sans text-muted-foreground border border-border px-3 py-1.5 rounded-full hover:text-foreground hover:border-accent/30 hover:bg-secondary/50 transition-all duration-150 active:scale-[0.97]"
                >
                  <chip.icon className="h-3 w-3" strokeWidth={1.5} />
                  {chip.label}
                </button>
              ))}
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input area */}
      <div className="px-6 pb-6 pt-2">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-end gap-3 bg-card border border-border rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background transition-shadow">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
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
              onClick={handleSend}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150 shrink-0 disabled:opacity-40 active:scale-95"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-[10px] font-sans text-muted-foreground mt-2 text-center">
            Grounded in your course materials · Responses may not always be accurate
          </p>
        </div>
      </div>
    </div>
  );
}
