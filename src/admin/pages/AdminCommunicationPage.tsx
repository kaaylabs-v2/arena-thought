import { useState, useRef, useEffect, useMemo } from "react";
import { Send, Circle, MessageSquare, ArrowLeft, Bell, X } from "lucide-react";
import { useWorkspace, mockUsers } from "@/context/WorkspaceContext";
import { type Announcement } from "@/admin/data/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/* ─── Timestamp helpers ─── */
const clockTimeMap: Record<string, string> = {
  "Just now": new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }),
  "1 hour ago": (() => { const d = new Date(); d.setHours(d.getHours() - 1); return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); })(),
  "2 hours ago": (() => { const d = new Date(); d.setHours(d.getHours() - 2); return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); })(),
  "Yesterday": "4:12 PM",
};
const getClockTime = (ts: string) => clockTimeMap[ts] || "3:00 PM";
const getListTime = (ts: string) => {
  if (ts === "Just now" || ts.includes("hour")) return getClockTime(ts);
  if (ts === "Yesterday") return "Yesterday";
  return ts;
};

type AdminTab = "messages" | "announcements" | "compose";

const AdminCommunicationPage = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>("messages");
  const { directMessages } = useWorkspace();

  const unreadDMs = useMemo(
    () => directMessages.filter((m) => !m.read && m.fromRole === "learner").length,
    [directMessages]
  );

  const tabs: { id: AdminTab; label: string; badge?: number }[] = [
    { id: "messages", label: "Direct Messages", badge: unreadDMs > 0 ? unreadDMs : undefined },
    { id: "announcements", label: "Announcements" },
    { id: "compose", label: "Compose" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in">
      <div className="flex-shrink-0 px-8 pt-8 pb-0">
        <h1 className="font-serif text-4xl text-foreground font-medium leading-[1.1]">Communication</h1>
        <p className="text-sm text-muted-foreground mt-1">Direct messages and announcements for your learners</p>
      </div>

      <div className="flex-shrink-0 border-b border-border px-8 mt-6">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative",
                activeTab === tab.id
                  ? "text-foreground border-b-2 border-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="flex items-center gap-1.5">
                {tab.label}
                {tab.badge && (
                  <span className="bg-accent text-accent-foreground rounded-full text-[10px] px-1.5 font-medium">
                    {tab.badge}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        {activeTab === "messages" && <AdminDMTab />}
        {activeTab === "announcements" && <AdminAnnouncementsTab onCompose={() => setActiveTab("compose")} />}
        {activeTab === "compose" && <ComposeTab onSent={() => setActiveTab("announcements")} />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab A — Direct Messages (Admin)
   ═══════════════════════════════════════════ */
function AdminDMTab() {
  const { directMessages, addDirectMessage, markMessageRead, studioCurrentAdmin } = useWorkspace();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(mockUsers[0]?.id || null);
  const [messageText, setMessageText] = useState("");
  const [subjectText, setSubjectText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const learnerThreads = mockUsers.map((user) => {
    const msgs = directMessages.filter(
      (m) => (m.toUserId === user.id && m.fromRole === "admin") || (m.fromRole === "learner" && m.fromName === user.name)
    );
    const unread = msgs.filter((m) => !m.read && m.fromRole === "learner").length;
    return { user, messages: msgs, unread };
  });

  const activeThread = learnerThreads.find((t) => t.user.id === selectedUserId);

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    const thread = learnerThreads.find((t) => t.user.id === userId);
    thread?.messages.forEach((m) => {
      if (!m.read && m.fromRole === "learner") markMessageRead(m.id);
    });
  };

  const handleSend = () => {
    if (!messageText.trim() || !selectedUserId) return;
    addDirectMessage({
      fromRole: "admin",
      fromName: studioCurrentAdmin.name,
      toUserId: selectedUserId,
      subject: subjectText.trim() || undefined,
      content: messageText.trim(),
    });
    setMessageText("");
    setSubjectText("");
  };

  const sortedMessages = activeThread
    ? [...activeThread.messages].sort((a, b) => directMessages.indexOf(a) - directMessages.indexOf(b))
    : [];

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [sortedMessages.length, selectedUserId]);

  return (
    <div className="flex flex-1 min-h-0 h-full">
      {/* Desktop: learner list */}
      <div className="hidden md:flex w-72 flex-shrink-0 border-r border-border flex-col overflow-hidden">
        <div className="flex-shrink-0 px-4 py-3 border-b border-border">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">Learners</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          {learnerThreads.map(({ user, messages, unread }) => {
            const lastMsg = messages[messages.length - 1];
            return (
              <button
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className={cn(
                  "w-full text-left px-4 py-3 border-l-2 transition-colors cursor-pointer",
                  selectedUserId === user.id
                    ? "border-accent bg-accent/8"
                    : "border-transparent hover:bg-accent/8"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                  <div className="flex items-center gap-2 shrink-0">
                    {lastMsg && <span className="text-[11px] text-muted-foreground/60">{getListTime(lastMsg.timestamp)}</span>}
                    {unread > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                {lastMsg && <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.content.slice(0, 50)}…</p>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Thread pane */}
      <div className="flex flex-col flex-1 min-w-0 min-h-0">
        {activeThread ? (
          <>
            <div className="flex-shrink-0 px-6 py-4 border-b border-border">
              <h3 className="text-base font-medium text-foreground">{activeThread.user.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{activeThread.user.email}</span>
                <span className="text-[11px] uppercase tracking-widest text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                  Learner
                </span>
              </div>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
              {sortedMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                  <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                  <p className="text-sm">No messages yet. Start the conversation.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedMessages.map((msg) => {
                    const isAdmin = msg.fromRole === "admin";
                    return (
                      <div key={msg.id} className={cn("flex flex-col", isAdmin ? "items-end" : "items-start")}>
                        <p className={cn("text-xs text-muted-foreground mb-1", isAdmin ? "text-right" : "text-left")}>
                          {!isAdmin && <>{msg.fromName} · </>}{getClockTime(msg.timestamp)}
                        </p>
                        <div
                          className={cn(
                            "max-w-[72%] px-4 py-2.5 text-sm",
                            isAdmin
                              ? "bg-accent/20 text-foreground rounded-2xl rounded-tr-sm"
                              : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                          )}
                        >
                          {msg.subject && <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>}
                          <p className="leading-relaxed">{msg.content}</p>
                        </div>
                        {!msg.read && msg.fromRole === "learner" && (
                          <Circle className="h-2 w-2 fill-accent text-accent mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="flex-shrink-0 px-6 py-4 border-t border-border">
              <input
                value={subjectText}
                onChange={(e) => setSubjectText(e.target.value)}
                placeholder="Subject (optional)"
                className="w-full border-0 border-b border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-0 py-2 focus:outline-none focus:ring-0 mb-2"
              />
              <div className="flex gap-2 items-end">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-0 border border-border rounded-lg px-3 py-2.5 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                />
                <button
                  onClick={handleSend}
                  disabled={!messageText.trim()}
                  className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            Select a learner to message
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Tab B — Announcements (Admin)
   ═══════════════════════════════════════════ */
function AdminAnnouncementsTab({ onCompose }: { onCompose: () => void }) {
  const { studioAnnouncements } = useWorkspace();

  return (
    <div className="overflow-y-auto h-full px-8 py-6">
      <div className="max-w-3xl">
        <div className="flex justify-between items-center mb-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground">All Announcements</p>
          <button onClick={onCompose} className="text-xs text-accent hover:underline cursor-pointer">
            ＋ New Announcement
          </button>
        </div>

        {studioAnnouncements.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Bell className="text-muted-foreground/30 w-8 h-8 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground italic">No announcements yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {studioAnnouncements.map((ann) => (
              <div key={ann.id} className="bg-card border border-border rounded-xl px-5 py-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{ann.title}</span>
                    <span className="text-[11px] bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">
                      {ann.audience}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[11px] text-muted-foreground/60">{ann.sentDate}</span>
                    <span className="text-[11px] bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 rounded-full px-2 py-0.5">
                      Sent
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{ann.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   Tab C — Compose (Admin)
   ═══════════════════════════════════════════ */
function ComposeTab({ onSent }: { onSent: () => void }) {
  const { studioDepartments, studioAnnouncements, setStudioAnnouncements } = useWorkspace();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [audienceType, setAudienceType] = useState<"all" | "department" | "course">("all");
  const [selectedAudience, setSelectedAudience] = useState("");

  const audienceOptions = [
    { value: "all", label: "All Members" },
    { value: "department", label: "By Department" },
    { value: "course", label: "By Course" },
  ];

  const getAudienceLabel = () => {
    if (audienceType === "all") return "All Members";
    return selectedAudience || (audienceType === "department" ? "Select department" : "Select course");
  };

  const handleSaveDraft = () => {
    if (!title.trim()) return;
    toast.success("Saved as draft");
  };

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    const audience = getAudienceLabel();
    const newAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title.trim(),
      body: body.trim(),
      audience,
      sentDate: new Date().toISOString().slice(0, 10),
      sentBy: "Jordan Reeves",
    };
    setStudioAnnouncements((prev) => [newAnn, ...prev]);
    toast.success(`Announcement sent to ${audience}`);
    setTitle("");
    setBody("");
    setAudienceType("all");
    setSelectedAudience("");
    onSent();
  };

  return (
    <div className="overflow-y-auto h-full px-8 py-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-serif text-2xl text-foreground">New Announcement</h2>
        <p className="text-sm text-muted-foreground mt-1 mb-8">Broadcast a message to your learners</p>

        <div className="space-y-6">
          {/* Title */}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Announcement title"
              className="w-full bg-transparent border-b border-border text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent py-2"
            />
          </div>

          {/* Audience */}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-2 block">Send to</label>
            <div className="flex rounded-lg border border-border overflow-hidden w-fit">
              {audienceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => {
                    setAudienceType(opt.value as typeof audienceType);
                    setSelectedAudience("");
                  }}
                  className={cn(
                    "px-3 py-1.5 text-sm transition-colors",
                    audienceType === opt.value
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {audienceType === "department" && (
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                className="mt-3 bg-muted rounded-lg px-3 py-2 text-sm text-foreground border border-border w-full focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="">Select department…</option>
                {studioDepartments.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Body */}
          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground mb-1 block">Message</label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Write your announcement..."
              className="w-full min-h-[160px] bg-transparent border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-accent mt-1"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-end mt-6">
            <button
              onClick={handleSaveDraft}
              className="bg-muted text-foreground rounded-lg px-4 py-2 text-sm hover:bg-muted/80 transition-colors"
            >
              Save as Draft
            </button>
            <button
              onClick={handleSend}
              disabled={!title.trim() || !body.trim()}
              className="bg-accent text-accent-foreground rounded-lg px-4 py-2 text-sm hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Send Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCommunicationPage;
