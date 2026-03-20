import { User, BookOpen, StickyNote, Clock, Shield } from "lucide-react";

const Profile = () => {
  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-2xl">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Profile</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your learning identity.</p>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-center gap-5 mb-10 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <User className="h-7 w-7 text-primary/70" strokeWidth={1.5} />
        </div>
        <div>
          <h2 className="font-serif text-xl text-foreground font-medium leading-snug">Learner</h2>
          <div className="flex items-center gap-1.5 mt-1">
            <Shield className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
            <span className="text-[11px] font-sans text-muted-foreground/60">Private · Local only</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <section className="animate-fade-in [animation-delay:160ms] [animation-fill-mode:backwards]">
        <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-4">Learning summary</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={BookOpen} label="Active courses" value="4" />
          <StatCard icon={Clock} label="Total study time" value="67h 50m" />
          <StatCard icon={StickyNote} label="Notes captured" value="12" />
          <StatCard icon={Shield} label="Reflections" value="3" />
        </div>
      </section>

      {/* Privacy notice */}
      <div className="mt-10 rounded-xl border border-border bg-card p-5 animate-fade-in [animation-delay:240ms] [animation-fill-mode:backwards]">
        <div className="flex items-start gap-3">
          <Shield className="h-4 w-4 text-muted-foreground/50 mt-0.5 shrink-0" strokeWidth={1.5} />
          <div>
            <p className="text-[13px] font-sans font-medium text-foreground mb-1">Your data stays with you</p>
            <p className="text-[12px] font-sans text-muted-foreground/70 leading-relaxed">
              All learning data, notes, and reflections are stored locally on your device. Nothing is shared externally unless you choose to export.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

function StatCard({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
        <span className="text-[10px] font-sans text-muted-foreground/60 uppercase tracking-widest">{label}</span>
      </div>
      <span className="text-xl font-serif text-foreground font-medium tabular-nums">{value}</span>
    </div>
  );
}

export default Profile;
