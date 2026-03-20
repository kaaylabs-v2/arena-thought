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
    <div className="h-full min-h-screen p-8 lg:p-12 max-w-3xl animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1">Reflections</h1>
        <div className="flex items-center gap-2 mt-2">
          <Lock className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
          <p className="text-muted-foreground font-sans text-xs">Private · Only you</p>
        </div>
      </div>

      {/* New reflection */}
      <div className="mb-10 rounded-xl border border-border bg-card p-5">
        <textarea
          placeholder="What's on your mind? Reflect on what you've learned..."
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          rows={4}
          className="w-full bg-transparent text-sm font-sans text-foreground placeholder:text-muted-foreground resize-none focus:outline-none leading-relaxed"
        />
        <div className="flex justify-end mt-3 pt-3 border-t border-border">
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-sans font-medium hover:bg-primary/90 transition-colors duration-150 disabled:opacity-40 active:scale-[0.97]"
            disabled={!newReflection.trim()}
          >
            <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
            Save reflection
          </button>
        </div>
      </div>

      {/* Reflections list */}
      {reflections.length === 0 ? (
        <div className="text-center py-20">
          <Shield className="h-10 w-10 text-muted-foreground/40 mx-auto mb-3" strokeWidth={1} />
          <p className="text-muted-foreground font-sans text-sm">A quiet space for your thinking.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reflections.map((ref) => (
            <div key={ref.id} className="group animate-fade-in">
              <div className="flex items-center gap-2 mb-3">
                <Calendar className="h-3 w-3 text-muted-foreground" strokeWidth={1.5} />
                <span className="text-[11px] font-sans text-muted-foreground uppercase tracking-wider">{ref.date}</span>
              </div>
              <div className="rounded-xl border border-border bg-card p-5 hover:border-accent/20 transition-colors duration-200">
                <p className="text-sm font-sans text-foreground leading-relaxed">{ref.content}</p>
                {ref.linkedCourse && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <span className="text-[10px] font-sans text-muted-foreground">
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
