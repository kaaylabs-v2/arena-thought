import { User, BookOpen, StickyNote, Clock, Shield, Mail, MapPin, GraduationCap, Target, Pen } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useState } from "react";
import { toast } from "sonner";

const Profile = () => {
  const { userProfile, updateUserProfile, notebookEntries, reflections } = useWorkspace();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(editForm);
    setIsEditing(false);
    toast.success("Profile updated");
  };

  const handleCancel = () => {
    setEditForm(userProfile);
    setIsEditing(false);
  };

  return (
    <div className="h-full min-h-screen p-8 lg:p-12 xl:p-16 max-w-2xl mx-auto">
      <div className="mb-10 animate-fade-in">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.15] font-medium">Profile</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">Your learning identity.</p>
      </div>

      {/* Avatar + Name */}
      <div className="flex items-start justify-between mb-10 animate-fade-in [animation-delay:80ms] [animation-fill-mode:backwards]">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <span className="text-2xl font-serif font-medium text-primary/70">
              {userProfile.name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="font-serif text-xl text-foreground font-medium leading-snug">{userProfile.name}</h2>
            <div className="flex items-center gap-1.5 mt-1">
              <Shield className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
              <span className="text-[11px] font-sans text-muted-foreground/60">Private · Local only</span>
            </div>
          </div>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-[12px] font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97] shrink-0"
          >
            <Pen className="h-3 w-3" strokeWidth={1.5} />
            Edit
          </button>
        )}
      </div>

      {/* Edit mode */}
      {isEditing ? (
        <section className="mb-10 animate-fade-in">
          <div className="rounded-xl border border-border bg-card divide-y divide-border">
            <ProfileField label="Name" value={editForm.name} onChange={(v) => setEditForm({ ...editForm, name: v })} />
            <ProfileField label="Email" value={editForm.email} onChange={(v) => setEditForm({ ...editForm, email: v })} />
            <ProfileField label="Institution" value={editForm.institution} onChange={(v) => setEditForm({ ...editForm, institution: v })} />
            <ProfileField label="Bio" value={editForm.bio} onChange={(v) => setEditForm({ ...editForm, bio: v })} multiline />
            <ProfileField label="Learning goal" value={editForm.learningGoal} onChange={(v) => setEditForm({ ...editForm, learningGoal: v })} multiline />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-[12px] font-sans font-medium hover:bg-primary/90 transition-all duration-200 active:scale-[0.97]"
            >
              Save changes
            </button>
            <button
              onClick={handleCancel}
              className="px-4 py-2 rounded-lg border border-border text-[12px] font-sans text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200 active:scale-[0.97]"
            >
              Cancel
            </button>
          </div>
        </section>
      ) : (
        <>
          {/* Profile details */}
          <section className="mb-10 animate-fade-in [animation-delay:120ms] [animation-fill-mode:backwards]">
            <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-4">Details</h2>
            <div className="rounded-xl border border-border bg-card divide-y divide-border">
              <ProfileDetail icon={Mail} label="Email" value={userProfile.email} />
              <ProfileDetail icon={GraduationCap} label="Institution" value={userProfile.institution} />
              <ProfileDetail icon={MapPin} label="Timezone" value={userProfile.timezone.replace("_", " ").replace("America/", "")} />
              <div className="px-5 py-4">
                <p className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest mb-1.5">Bio</p>
                <p className="text-[13px] font-sans text-foreground/85 leading-relaxed">{userProfile.bio}</p>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Target className="h-3 w-3 text-muted-foreground/50" strokeWidth={1.5} />
                  <p className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest">Learning goal</p>
                </div>
                <p className="text-[13px] font-sans text-foreground/85 leading-relaxed">{userProfile.learningGoal}</p>
              </div>
            </div>
          </section>
        </>
      )}

      {/* Stats */}
      <section className="mb-10 animate-fade-in [animation-delay:200ms] [animation-fill-mode:backwards]">
        <h2 className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground mb-4">Learning summary</h2>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={BookOpen} label="Active courses" value="3" />
          <StatCard icon={Clock} label="Total study time" value="67h 50m" />
          <StatCard icon={StickyNote} label="Notes captured" value={String(notebookEntries.length)} />
          <StatCard icon={Shield} label="Reflections" value={String(reflections.length)} />
        </div>
      </section>

      {/* Privacy notice */}
      <div className="rounded-xl border border-border bg-card p-5 animate-fade-in [animation-delay:280ms] [animation-fill-mode:backwards]">
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

      <div className="h-16" />
    </div>
  );
};

function ProfileField({ label, value, onChange, multiline }: { label: string; value: string; onChange: (v: string) => void; multiline?: boolean }) {
  return (
    <div className="px-5 py-4">
      <label className="text-[10px] font-sans text-muted-foreground/50 uppercase tracking-widest mb-1.5 block">{label}</label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-muted/30 rounded-lg px-3 py-2 text-[13px] font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30 resize-none leading-relaxed"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-muted/30 rounded-lg px-3 py-2 text-[13px] font-sans text-foreground focus:outline-none focus:ring-1 focus:ring-ring/30"
        />
      )}
    </div>
  );
}

function ProfileDetail({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-2">
        <Icon className="h-3.5 w-3.5 text-muted-foreground/50" strokeWidth={1.5} />
        <span className="text-[12px] font-sans text-muted-foreground">{label}</span>
      </div>
      <span className="text-[13px] font-sans text-foreground">{value}</span>
    </div>
  );
}

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
