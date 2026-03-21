import { useState, useRef, useEffect, useCallback } from "react";
import {
  Send,
  BookmarkPlus,
  BookA,
  Copy,
  Check,
  Sparkles,
  FileText,
  HelpCircle,
  Lightbulb,
  ArrowRightLeft,
  ListChecks,
  Mic,
  MicOff,
  X,
} from "lucide-react";
import { useWorkspace, simulatedResponses } from "@/context/WorkspaceContext";
import { toast } from "sonner";

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
  const { chatMessages, addMessage, addNotebookEntry, addVocabulary, activeSource } = useWorkspace();
  const messages = chatMessages[courseId] || [];
  const [input, setInput] = useState("");
  const [savedMessages, setSavedMessages] = useState<Set<string>>(new Set());
  const [vocabSaved, setVocabSaved] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState("");
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
    }, 700 + Math.random() * 500);
  }, [courseId, addMessage]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    addMessage(courseId, { role: "user", content: text });
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
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
    toast.success("Saved to Notebook", { description: title.slice(0, 40) + "…" });
  };

  const handleSaveVocab = (msgId: string, content: string) => {
    if (vocabSaved.has(msgId)) return;
    setVocabSaved((prev) => new Set(prev).add(msgId));
    // Extract first bold term as the vocab term, rest as definition
    const boldMatch = content.match(/\*\*(.*?)\*\*/);
    const term = boldMatch ? boldMatch[1] : content.slice(0, 40).replace(/\n/g, " ").trim();
    const definition = content.slice(0, 200).replace(/\*\*/g, "").replace(/\n/g, " ").trim();
    addVocabulary({
      term,
      definition,
      course: courseTitle,
      tags: [],
      savedFrom: "nexi",
    });
    toast.success("Saved to Vocabulary", { description: term });
  };

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleChip = (label: string) => {
    addMessage(courseId, { role: "user", content: label });
    simulateResponse(label);
  };

  // Voice input simulation
  const handleVoiceToggle = () => {
    if (isListening) {
      // Stop listening — use transcript
      setIsListening(false);
      if (voiceTranscript.trim()) {
        setInput(voiceTranscript);
      }
      setVoiceTranscript("");
    } else {
      // Start listening
      setIsListening(true);
      setVoiceTranscript("");
      // Simulate transcription appearing
      const phrases = ["How does", "How does backpropagation", "How does backpropagation handle", "How does backpropagation handle vanishing gradients?"];
      let idx = 0;
      const interval = setInterval(() => {
        if (idx < phrases.length) {
          setVoiceTranscript(phrases[idx]);
          idx++;
        } else {
          clearInterval(interval);
        }
      }, 600);
    }
  };

  const handleVoiceCancel = () => {
    setIsListening(false);
    setVoiceTranscript("");
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-3.5 border-b border-border">
        <div className="min-w-0">
          <h2 className="font-serif text-[1.1rem] text-foreground leading-snug truncate font-medium">{courseTitle}</h2>
          <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5 tracking-[-0.01em]">
            {activeSource ? `Grounded in: ${activeSource.title}` : currentModule}
          </p>
        </div>
        <span className="text-[10px] font-sans text-accent/80 bg-accent/8 px-2.5 py-1 rounded-full flex items-center gap-1 shrink-0">
          <Sparkles className="h-3 w-3" strokeWidth={1.5} />
          Nexi
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-8 py-8 scrollbar-thin">
        <div className="max-w-[640px] mx-auto space-y-7">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`animate-fade-in-fast ${msg.role === "user" ? "flex justify-end" : ""} ${msg.role === "system" ? "flex justify-center" : ""}`}
            >
              {msg.role === "system" ? (
                <div className="text-[11px] font-sans text-muted-foreground/70 bg-muted/40 px-3 py-1.5 rounded-full">
                  {msg.content}
                </div>
              ) : msg.role === "user" ? (
                <div className="max-w-[480px] bg-primary text-primary-foreground rounded-2xl rounded-br-sm px-5 py-3.5 shadow-soft">
                  <p className="text-[13.5px] font-sans leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                <div className="max-w-full">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4 shadow-soft">
                    <div className="text-[13.5px] font-sans text-foreground leading-[1.7] whitespace-pre-line">
                      {msg.content.split(/(\*\*.*?\*\*|\*.*?\*)/g).map((part, i) => {
                        if (part.startsWith("**") && part.endsWith("**")) {
                          return <strong key={i} className="font-semibold text-foreground">{part.slice(2, -2)}</strong>;
                        }
                        if (part.startsWith("*") && part.endsWith("*")) {
                          return <em key={i} className="italic text-foreground/85">{part.slice(1, -1)}</em>;
                        }
                        return <span key={i}>{part}</span>;
                      })}
                    </div>

                    {msg.citations && msg.citations.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/60">
                        {msg.citations.map((cite, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-sans text-muted-foreground/70 bg-muted/50 px-2 py-0.5 rounded-full flex items-center gap-1 transition-colors hover:text-muted-foreground hover:bg-muted"
                          >
                            <FileText className="h-2.5 w-2.5" strokeWidth={1.5} />
                            {cite}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 mt-1.5 ml-1">
                    <button
                      onClick={() => handleSave(msg.id, msg.content)}
                      className={`flex items-center gap-1 text-[11px] font-sans px-2 py-1 rounded-md transition-all duration-200 ${
                        savedMessages.has(msg.id)
                          ? "text-accent"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {savedMessages.has(msg.id) ? (
                        <Check className="h-3 w-3" strokeWidth={2} />
                      ) : (
                        <BookmarkPlus className="h-3 w-3" strokeWidth={1.5} />
                      )}
                      {savedMessages.has(msg.id) ? "Saved" : "Save to Notebook"}
                    </button>
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="flex items-center gap-1 text-[11px] font-sans text-muted-foreground/60 hover:text-foreground hover:bg-muted/50 px-2 py-1 rounded-md transition-all duration-200"
                    >
                      {copiedId === msg.id ? (
                        <Check className="h-3 w-3" strokeWidth={2} />
                      ) : (
                        <Copy className="h-3 w-3" strokeWidth={1.5} />
                      )}
                      {copiedId === msg.id ? "Copied" : "Copy"}
                    </button>
                    <button
                      onClick={() => handleSaveVocab(msg.id, msg.content)}
                      className={`flex items-center gap-1 text-[11px] font-sans px-2 py-1 rounded-md transition-all duration-200 ${
                        vocabSaved.has(msg.id)
                          ? "text-accent"
                          : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {vocabSaved.has(msg.id) ? (
                        <Check className="h-3 w-3" strokeWidth={2} />
                      ) : (
                        <BookA className="h-3 w-3" strokeWidth={1.5} />
                      )}
                      {vocabSaved.has(msg.id) ? "Saved" : "Save as Vocab"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator */}
          {isTyping && (
            <div className="animate-fade-in-fast">
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-5 py-4 w-fit shadow-soft">
                <div className="flex gap-1.5 items-center h-4">
                  <span className="h-1.5 w-1.5 bg-muted-foreground/30 rounded-full animate-pulse" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/30 rounded-full animate-pulse [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 bg-muted-foreground/30 rounded-full animate-pulse [animation-delay:300ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Follow-up chips */}
          {!isTyping && messages.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {followUpChips.map((chip) => (
                <button
                  key={chip.label}
                  onClick={() => handleChip(chip.label)}
                  className="flex items-center gap-1.5 text-[12px] font-sans text-muted-foreground/70 border border-border/80 px-3 py-1.5 rounded-full hover:text-foreground hover:border-border hover:bg-muted/40 transition-all duration-200 active:scale-[0.96]"
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
      <div className="px-8 pb-6 pt-3">
        <div className="max-w-[640px] mx-auto">
          {/* Voice listening overlay */}
          {isListening && (
            <div className="mb-3 rounded-xl border border-accent/30 bg-accent/5 px-4 py-3 animate-fade-in-fast">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-[11px] font-sans text-accent font-medium">Listening...</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleVoiceCancel}
                    className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-accent/10 transition-colors"
                  >
                    <X className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                  </button>
                  <button
                    onClick={handleVoiceToggle}
                    className="h-6 px-2 flex items-center gap-1 rounded-md bg-accent text-accent-foreground text-[10px] font-sans font-medium hover:bg-accent/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </div>
              <p className="text-[13px] font-sans text-foreground/80 min-h-[20px]">
                {voiceTranscript || <span className="text-muted-foreground/40">Speak now…</span>}
              </p>
            </div>
          )}

          <div className="flex items-end gap-3 bg-card border border-border rounded-xl px-4 py-3 shadow-soft focus-within:shadow-lifted focus-within:border-ring/30 transition-all duration-200">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask Nexi about your course materials..."
              rows={1}
              className="flex-1 bg-transparent text-[13.5px] font-sans text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none leading-relaxed min-h-[24px] max-h-[120px]"
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = Math.min(target.scrollHeight, 120) + "px";
              }}
            />
            {/* Mic button */}
            <button
              onClick={handleVoiceToggle}
              className={`h-8 w-8 flex items-center justify-center rounded-lg transition-all duration-200 shrink-0 active:scale-95 ${
                isListening
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground/50 hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {isListening ? <MicOff className="h-3.5 w-3.5" strokeWidth={1.5} /> : <Mic className="h-3.5 w-3.5" strokeWidth={1.5} />}
            </button>
            {/* Send button */}
            <button
              onClick={handleSend}
              className="h-8 w-8 flex items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200 shrink-0 disabled:opacity-30 active:scale-95"
              disabled={!input.trim() || isTyping}
            >
              <Send className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </div>
          <p className="text-[10px] font-sans text-muted-foreground/50 mt-2.5 text-center tracking-[-0.01em]">
            Grounded in your course materials · Responses may not always be accurate
          </p>
        </div>
      </div>
    </div>
  );
}
