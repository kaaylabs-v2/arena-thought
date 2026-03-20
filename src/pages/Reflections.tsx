import { Shield, Plus, Calendar, Lock, Trash2, Sparkles, Mic, MicOff } from "lucide-react";
import { useState, useRef, useCallback, useEffect } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";
import type { ReflectionMood } from "@/context/WorkspaceContext";
import { useScrollReveal, revealProps } from "@/hooks/use-scroll-reveal";
import { toast } from "sonner";

// Extend Window for speech recognition support
/* eslint-disable @typescript-eslint/no-explicit-any */

const promptChips = [
  "What challenged me today",
  "A moment of clarity",
  "Something I'd revisit",
  "What I'm still unsure about",
];

const moodOptions: { value: ReflectionMood; label: string; emoji: string }[] = [
  { value: "focused", label: "Focused", emoji: "🎯" },
  { value: "curious", label: "Curious", emoji: "🔍" },
  { value: "energized", label: "Energized", emoji: "⚡" },
  { value: "calm", label: "Calm", emoji: "🌊" },
  { value: "confused", label: "Confused", emoji: "🌀" },
  { value: "drained", label: "Drained", emoji: "🪫" },
];

const moodDisplay: Record<ReflectionMood, { label: string; emoji: string }> = {
  focused: { label: "Focused", emoji: "🎯" },
  curious: { label: "Curious", emoji: "🔍" },
  energized: { label: "Energized", emoji: "⚡" },
  calm: { label: "Calm", emoji: "🌊" },
  confused: { label: "Confused", emoji: "🌀" },
  drained: { label: "Drained", emoji: "🪫" },
};

function groupByDate(reflections: { date: string }[]) {
  const groups: { label: string; indices: number[] }[] = [];
  const groupMap = new Map<string, number[]>();

  reflections.forEach((r, i) => {
    const d = r.date;
    const label =
      d === "Just now" || d === "Today" ? "Today" :
      d === "Yesterday" ? "Yesterday" : "Earlier";
    if (!groupMap.has(label)) groupMap.set(label, []);
    groupMap.get(label)!.push(i);
  });

  for (const [label, indices] of groupMap) {
    groups.push({ label, indices });
  }
  return groups;
}

const Reflections = () => {
  const { reflections, addReflection, deleteReflection } = useWorkspace();
  const [newReflection, setNewReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState<ReflectionMood | null>(null);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);

  // Speech recognition setup
  const toggleVoice = useCallback(() => {
    const SpeechRecognitionCtor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      toast.error("Speech recognition not supported in this browser");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognitionRef.current = recognition;

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + " ";
        } else {
          interim = transcript;
        }
      }
      setNewReflection((prev) => {
        const base = prev.replace(/\u200B.*$/, "").trimEnd();
        const combined = base + (base ? " " : "") + finalTranscript + (interim ? "\u200B" + interim : "");
        return combined;
      });
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      if (event.error !== "aborted") {
        toast.error("Voice input error: " + event.error);
      }
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Clean up zero-width space markers from interim results
      setNewReflection((prev) => prev.replace(/\u200B/g, ""));
    };

    recognition.start();
    setIsListening(true);
    toast.success("Listening... speak your reflection");
  }, [isListening]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const headerReveal = useScrollReveal();
  const composerReveal = useScrollReveal();

  const handleSave = () => {
    const text = newReflection.trim();
    if (!text) return;
    addReflection(text, undefined, selectedMood ?? undefined);
    setNewReflection("");
    setSelectedMood(null);
    toast.success("Reflection saved");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const handlePromptClick = (prompt: string) => {
    setNewReflection(prompt + " — ");
    textareaRef.current?.focus();
  };

  const handleDelete = (id: string) => {
    deleteReflection(id);
    toast.success("Reflection removed");
  };

  const groups = groupByDate(reflections);
  let globalDelay = 0;

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl mx-auto">
      {/* Header */}
      <div ref={headerReveal.ref} className={headerReveal.isVisible ? "mb-10 animate-fade-in" : "mb-10 opacity-0"}>
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1]">Reflections</h1>
        <div className="flex items-center gap-2 mt-2">
          <Lock className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="text-muted-foreground/60 font-sans text-[11px] tracking-[-0.01em]">Private · Only you</p>
        </div>
      </div>

      {/* Prompt chips */}
      <div ref={composerReveal.ref} className={composerReveal.isVisible ? "animate-fade-in [animation-delay:40ms] [animation-fill-mode:backwards]" : "opacity-0"}>
        <div className="flex items-center gap-1.5 mb-3 flex-wrap">
          <Sparkles className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.5} />
          {promptChips.map((chip) => (
            <button
              key={chip}
              onClick={() => handlePromptClick(chip)}
              className="px-2.5 py-1 rounded-full border border-border bg-card text-[11px] font-sans text-muted-foreground/70 hover:border-accent/30 hover:text-foreground transition-all duration-200 active:scale-[0.97]"
            >
              {chip}
            </button>
          ))}
        </div>

        {/* Composer card */}
        <div className="mb-12 rounded-xl border border-border bg-card p-5 shadow-soft">
          <textarea
            ref={textareaRef}
            placeholder="What's on your mind? Reflect on what you've learned..."
            value={newReflection}
            onChange={(e) => setNewReflection(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={4}
            className="w-full bg-transparent text-[13.5px] font-sans text-foreground placeholder:text-muted-foreground/45 resize-none focus:outline-none leading-[1.7]"
          />

          {/* Mood selector */}
          <div className="flex items-center gap-1.5 mt-2 mb-3 flex-wrap">
            <span className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest mr-1">Mood</span>
            {moodOptions.map((m) => (
              <button
                key={m.value}
                onClick={() => setSelectedMood(selectedMood === m.value ? null : m.value)}
                className={`px-2 py-0.5 rounded-full text-[11px] font-sans transition-all duration-200 active:scale-[0.95] ${
                  selectedMood === m.value
                    ? "bg-accent/15 text-accent border border-accent/30"
                    : "border border-border text-muted-foreground/60 hover:border-accent/20 hover:text-foreground"
                }`}
              >
                {m.emoji} {m.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border/60">
            <span className="text-[10px] font-sans text-muted-foreground/40">
              {newReflection.length > 0 ? `${newReflection.length} chars` : "Enter to save · Shift+Enter for newline"}
            </span>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 disabled:opacity-30 active:scale-[0.97]"
              disabled={!newReflection.trim()}
            >
              <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
              Save reflection
            </button>
          </div>
        </div>
      </div>

      {/* Reflections list grouped by date */}
      {reflections.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-10">
          {groups.map((group) => (
            <DateGroup key={group.label} label={group.label}>
              {group.indices.map((idx) => {
                const ref = reflections[idx];
                const d = globalDelay;
                globalDelay += 60;
                return (
                  <ReflectionCard
                    key={ref.id}
                    reflection={ref}
                    delay={d}
                    onDelete={handleDelete}
                  />
                );
              })}
            </DateGroup>
          ))}
        </div>
      )}
    </div>
  );
};

function EmptyState() {
  const reveal = useScrollReveal();
  return (
    <div
      ref={reveal.ref}
      className={`text-center py-24 ${reveal.isVisible ? "animate-fade-in" : "opacity-0"}`}
    >
      <Shield className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
      <p className="text-muted-foreground/60 font-sans text-sm">A quiet space for your thinking.</p>
    </div>
  );
}

function DateGroup({ label, children }: { label: string; children: React.ReactNode }) {
  const reveal = useScrollReveal();
  return (
    <div>
      <div
        ref={reveal.ref}
        className={`flex items-center gap-3 mb-4 ${reveal.isVisible ? "animate-fade-in" : "opacity-0"}`}
      >
        <span className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-[0.12em] font-medium">{label}</span>
        <div className="flex-1 h-px bg-border/60" />
      </div>
      <div className="space-y-5">{children}</div>
    </div>
  );
}

function ReflectionCard({
  reflection,
  delay,
  onDelete,
}: {
  reflection: import("@/context/WorkspaceContext").Reflection;
  delay: number;
  onDelete: (id: string) => void;
}) {
  const reveal = useScrollReveal();
  const { isVisible } = reveal;
  const props = revealProps(isVisible, delay);

  return (
    <div ref={reveal.ref} className={`group ${props.className}`} style={props.style}>
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.5} />
        <span className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest">{reflection.date}</span>
        {reflection.mood && (
          <span className="text-[10px] font-sans text-muted-foreground/60 ml-1">
            {moodDisplay[reflection.mood].emoji} {moodDisplay[reflection.mood].label}
          </span>
        )}
      </div>
      <div className="relative rounded-xl border border-border bg-card p-5 hover:shadow-soft hover:border-accent/15 transition-all duration-250">
        <p className="text-[13.5px] font-sans text-foreground leading-[1.75] pr-8">{reflection.content}</p>

        {/* Delete button */}
        <button
          onClick={() => onDelete(reflection.id)}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 active:scale-[0.95]"
          title="Delete reflection"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>

        {reflection.linkedCourse && (
          <div className="mt-4 pt-3 border-t border-border/60">
            <span className="text-[10px] font-sans text-muted-foreground/50 tracking-[-0.01em]">
              Linked to {reflection.linkedCourse}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default Reflections;
