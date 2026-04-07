import { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Send, Circle, Mail, Bell, X, ArrowLeft } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
/* ─── Dynamic timestamp helpers ─── */
function formatClockTime(ts: string): string {
  const now = new Date();
  if (ts === "Just now") return now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const hourMatch = ts.match(/^(\d+) hours? ago$/);
  if (hourMatch) {
    const d = new Date(now);
    d.setHours(d.getHours() - parseInt(hourMatch[1]));
    return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  }
  if (ts === "Yesterday") return "4:12 PM";
  return "3:00 PM";
}

function formatListTime(ts: string): string {
  if (ts === "Just now" || ts.includes("hour")) return formatClockTime(ts);
  if (ts === "Yesterday") return "Yesterday";
  // Try to parse as a date for day-of-week
  const d = new Date(ts);
  if (!isNaN(d.getTime())) {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays < 1) return formatClockTime(ts);
    if (diffDays < 7) return d.toLocaleDateString([], { weekday: "short" });
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  }
  return ts;
}

function formatDateSeparator(ts: string): string {
  if (ts === "Just now" || ts.includes("hour") || ts.includes("minute")) return "Today";
  if (ts === "Yesterday") return "Yesterday";
  const d = new Date(ts);
  if (!isNaN(d.getTime())) {
    return d.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
  }
  return ts;
}

type Tab = "messages" | "announcements";

const Communication = () => {
  const [activeTab, setActiveTab] = useState<Tab>("messages");
  const { directMessages, studioAnnouncements } = useWorkspace();

  const unreadDMs = useMemo(
    () => directMessages.filter((m) => !m.read && m.fromRole === "admin" && m.toUserId === "user-1").length,
    [directMessages]
  );

  const tabs: { id: Tab; label: string; badge?: number }[] = [
    { id: "messages", label: "Direct Messages", badge: unreadDMs > 0 ? unreadDMs : undefined },
    { id: "announcements", label: "Announcements" },
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-8 pt-8 pb-0">
        <h1 className="font-serif text-4xl text-foreground font-medium leading-[1.1]">Communication</h1>
        <p className="text-sm text-muted-foreground mt-1">Messages and announcements from your institution</p>
      </div>

      {/* Tab bar */}
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

      {/* Tab content — keyed for animation */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <div key={activeTab} className="animate-fade-in h-full flex flex-col">
          {activeTab === "messages" && <DirectMessagesTab />}
          {activeTab === "announcements" && <AnnouncementsTab />}
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════
   Tab A — Direct Messages (Learner)
   ═══════════════════════════════════════════ */
function DirectMessagesTab() {
  const { directMessages, addDirectMessage, markMessageRead, userProfile } = useWorkspace();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const [prevMsgCount, setPrevMsgCount] = useState(0);

  const myMessages = directMessages.filter(
    (m) => m.toUserId === "user-1" || (m.fromRole === "learner" && m.fromName === userProfile.name)
  );

  const threads = myMessages.reduce<Record<string, typeof myMessages>>((acc, msg) => {
    const key = msg.fromRole === "admin" ? msg.fromName : "Dr. Sarah Mitchell";
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  Object.values(threads).forEach((t) =>
    t.sort((a, b) => directMessages.indexOf(a) - directMessages.indexOf(b))
  );

  const threadKeys = Object.keys(threads);
  const activeThread = selectedThread || (threadKeys.length > 0 ? threadKeys[0] : null);
  const activeMessages = activeThread ? threads[activeThread] || [] : [];
  const unreadCount = (msgs: typeof myMessages) => msgs.filter((m) => !m.read && m.fromRole === "admin").length;

  // Mark first auto-selected thread as read on mount
  useEffect(() => {
    if (!selectedThread && threadKeys.length > 0) {
      const firstKey = threadKeys[0];
      threads[firstKey]?.forEach((m) => {
        if (!m.read && m.fromRole === "admin") markMessageRead(m.id);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectThread = (key: string) => {
    setSelectedThread(key);
    threads[key]?.forEach((m) => {
      if (!m.read && m.fromRole === "admin") markMessageRead(m.id);
    });
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    addDirectMessage({
      fromRole: "learner",
      fromName: userProfile.name,
      toUserId: "admin-1",
      content: replyText.trim(),
    });
    setReplyText("");
  };

  // Track message count for entrance animation
  useEffect(() => {
    setPrevMsgCount(activeMessages.length);
  }, [activeMessages.length]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [activeMessages.length, activeThread]);

  const handleBack = useCallback(() => setSelectedThread(null), []);

  // Mobile: show list or thread, not both
  const showList = isMobile ? !selectedThread : true;
  const showThread = isMobile ? !!selectedThread || !!activeThread : true;

  // Group messages by date for separators
  const groupedMessages = useMemo(() => {
    const groups: { date: string; messages: typeof activeMessages }[] = [];
    let currentDate = "";
    activeMessages.forEach((msg) => {
      const dateLabel = formatDateSeparator(msg.timestamp);
      if (dateLabel !== currentDate) {
        currentDate = dateLabel;
        groups.push({ date: dateLabel, messages: [msg] });
      } else {
        groups[groups.length - 1].messages.push(msg);
      }
    });
    return groups;
  }, [activeMessages]);

  if (threadKeys.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center max-w-sm animate-fade-in">
          <div className="h-14 w-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
            <Mail className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.5} />
          </div>
          <h3 className="font-serif text-lg text-foreground font-medium mb-1.5">No conversations yet</h3>
          <p className="text-[13px] font-sans text-muted-foreground/70 text-center leading-relaxed">
            When your instructor sends you a message, it will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 min-h-0 h-full">
      {/* Conversation list */}
      {showList && (
        <div className={cn(
          "flex-shrink-0 border-r border-border flex flex-col overflow-hidden",
          isMobile ? "w-full" : "w-72"
        )}>
          <div className="flex-shrink-0 px-4 py-3 border-b border-border">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Conversations</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {threadKeys.map((key) => {
              const msgs = threads[key];
              const lastMsg = msgs[msgs.length - 1];
              const unread = unreadCount(msgs);
              return (
                <button
                  key={key}
                  onClick={() => handleSelectThread(key)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-l-2 transition-all duration-150 cursor-pointer",
                    activeThread === key
                      ? "border-accent bg-accent/10"
                      : "border-transparent hover:bg-accent/10 hover:translate-x-0.5"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-foreground truncate">{key}</span>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-muted-foreground/60">{formatListTime(lastMsg.timestamp)}</span>
                      {unread > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.content.slice(0, 60)}…</p>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Thread area */}
      {showThread && (
        <div className="flex flex-col flex-1 min-w-0">
          {activeThread ? (
            <>
              <div className="flex-shrink-0 px-6 py-4 border-b border-border flex items-center gap-3">
                {isMobile && (
                  <button onClick={handleBack} className="text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-5 w-5" />
                  </button>
                )}
                <div>
                  <h3 className="text-base font-medium text-foreground">{activeThread}</h3>
                  <span className="text-[11px] uppercase tracking-widest text-muted-foreground bg-muted rounded-full px-2 py-0.5 inline-block mt-1">
                    Instructor
                  </span>
                </div>
              </div>

              <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-5">
                <div className="space-y-1">
                  {groupedMessages.map((group, gi) => (
                    <div key={gi}>
                      {/* Date separator */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border" />
                        <span className="text-[11px] text-muted-foreground shrink-0">{group.date}</span>
                        <div className="flex-1 h-px bg-border" />
                      </div>
                      <div className="space-y-3">
                        {group.messages.map((msg, mi) => {
                          const isMe = msg.fromRole === "learner";
                          const isNew = gi === groupedMessages.length - 1 && mi >= prevMsgCount - 1 && prevMsgCount > 0;
                          return (
                            <div
                              key={msg.id}
                              className={cn(
                                "flex flex-col",
                                isMe ? "items-end" : "items-start",
                                isNew && "animate-fade-in"
                              )}
                            >
                              <p className={cn("text-xs text-muted-foreground mb-1", isMe ? "text-right" : "text-left")}>
                                {!isMe && <>{msg.fromName} · </>}{formatClockTime(msg.timestamp)}
                              </p>
                              <div
                                className={cn(
                                  "max-w-[72%] px-4 py-2.5 text-sm",
                                  isMe
                                    ? "bg-accent/20 text-foreground rounded-2xl rounded-tr-sm"
                                    : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                                )}
                              >
                                {msg.subject && <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>}
                                <p className="leading-relaxed">{msg.content}</p>
                              </div>
                              {!msg.read && msg.fromRole === "admin" && (
                                <Circle className="h-2 w-2 fill-accent text-accent mt-1" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-shrink-0 border-t border-border px-6 py-4">
                <div className="flex gap-2 items-end">
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply..."
                    rows={1}
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none border border-border rounded-lg px-3 py-2.5 min-h-[60px] max-h-[120px] focus:outline-none focus:border-accent transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendReply();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendReply}
                    disabled={!replyText.trim()}
                    className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              Select a conversation
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   Tab B — Announcements (Learner — read-only)
   ═══════════════════════════════════════════ */
function AnnouncementsTab() {
  const { studioAnnouncements, dismissedAnnouncementIds, dismissAnnouncement } = useWorkspace();

  const sorted = useMemo(() => {
    const items = studioAnnouncements.map((a) => ({
      ...a,
      dismissed: dismissedAnnouncementIds.has(a.id),
    }));
    items.sort((a, b) => {
      if (a.dismissed !== b.dismissed) return a.dismissed ? 1 : -1;
      return new Date(b.sentDate).getTime() - new Date(a.sentDate).getTime();
    });
    return items;
  }, [studioAnnouncements, dismissedAnnouncementIds]);

  const allDismissed = sorted.every((n) => n.dismissed);

  return (
    <div className="overflow-y-auto h-full px-8 py-6">
      <div className="max-w-3xl">
        <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">From your institution</p>

        {allDismissed ? (
          <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
            <Bell className="text-muted-foreground/30 w-8 h-8 mb-3" strokeWidth={1.5} />
            <p className="text-sm text-muted-foreground italic">You're all caught up.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sorted.map((ann) => (
              <div
                key={ann.id}
                className={cn(
                  "bg-card border border-border rounded-xl px-5 py-4 border-l-4 transition-all duration-300",
                  ann.dismissed ? "border-l-transparent opacity-60 scale-[0.99]" : "border-l-accent"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-sm font-semibold text-foreground truncate">{ann.title}</span>
                    <span className="text-[11px] bg-muted text-muted-foreground rounded-full px-2 py-0.5 shrink-0">
                      {ann.audience}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span className="text-[11px] text-muted-foreground/60">{ann.sentDate}</span>
                    {!ann.dismissed && (
                      <button
                        onClick={() => dismissAnnouncement(ann.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors active:scale-90"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
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

export default Communication;
