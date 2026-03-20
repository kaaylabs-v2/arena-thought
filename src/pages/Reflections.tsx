import { Shield, Plus, Calendar, Lock } from "lucide-react";
import { useState } from "react";
import { useWorkspace } from "@/context/WorkspaceContext";

const Reflections = () => {
  const { reflections, addReflection } = useWorkspace();
  const [newReflection, setNewReflection] = useState("");

  const handleSave = () => {
    const text = newReflection.trim();
    if (!text) return;
    addReflection(text);
    setNewReflection("");
  };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-3xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1]">Reflections</h1>
        <div className="flex items-center gap-2 mt-2">
          <Lock className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
          <p className="text-muted-foreground/60 font-sans text-[11px] tracking-[-0.01em]">Private · Only you</p>
        </div>
      </div>

      {/* New reflection */}
      <div className="mb-12 rounded-xl border border-border bg-card p-5 shadow-soft animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <textarea
          placeholder="What's on your mind? Reflect on what you've learned..."
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          rows={4}
          className="w-full bg-transparent text-[13.5px] font-sans text-foreground placeholder:text-muted-foreground/45 resize-none focus:outline-none leading-[1.7]"
        />
        <div className="flex justify-end mt-3 pt-3 border-t border-border/60">
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

      {/* Reflections list */}
      {reflections.length === 0 ? (
        <div className="text-center py-24 animate-fade-in">
          <Shield className="h-10 w-10 text-muted-foreground/20 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground/60 font-sans text-sm">A quiet space for your thinking.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {reflections.map((ref, i) => (
            <div
              key={ref.id}
              className="group animate-fade-in [animation-fill-mode:backwards]"
              style={{ animationDelay: `${140 + i * 60}ms` }}
            >
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-3 w-3 text-muted-foreground/40" strokeWidth={1.5} />
                <span className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest">{ref.date}</span>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 hover:shadow-soft transition-all duration-250">
                <p className="text-[13.5px] font-sans text-foreground leading-[1.75]">{ref.content}</p>
                {ref.linkedCourse && (
                  <div className="mt-4 pt-3 border-t border-border/60">
                    <span className="text-[10px] font-sans text-muted-foreground/50 tracking-[-0.01em]">
                      Linked to {ref.linkedCourse}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Reflections;
