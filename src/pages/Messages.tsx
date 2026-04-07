import { useState, useRef, useEffect } from "react";
import { Send, Circle, Mail } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

/** Map relative timestamp strings to fake clock times for display */
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

const Messages = () => {
  const { directMessages, addDirectMessage, markMessageRead, userProfile } = useWorkspace();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const myMessages = directMessages.filter(
    (m) => m.toUserId === "user-1" || (m.fromRole === "learner" && m.fromName === userProfile.name)
  );

  const threads = myMessages.reduce<Record<string, typeof myMessages>>((acc, msg) => {
    const key = msg.fromRole === "admin" ? msg.fromName : "Dr. Sarah Mitchell";
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  Object.values(threads).forEach(t => t.sort((a, b) => {
    const idxA = directMessages.indexOf(a);
    const idxB = directMessages.indexOf(b);
    return idxA - idxB;
  }));

  const threadKeys = Object.keys(threads);
  const activeThread = selectedThread || (threadKeys.length > 0 ? threadKeys[0] : null);
  const activeMessages = activeThread ? threads[activeThread] || [] : [];
  const unreadCount = (msgs: typeof myMessages) => msgs.filter(m => !m.read && m.fromRole === "admin").length;

  const handleSelectThread = (key: string) => {
    setSelectedThread(key);
    threads[key]?.forEach(m => {
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

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages.length, activeThread]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-6 lg:px-12 xl:px-16 pt-8 pb-4">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Messages</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
          Direct messages from your instructors
        </p>
      </div>

      {threadKeys.length === 0 ? (
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center max-w-sm">
            <div className="h-14 w-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
              <Mail className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg text-foreground font-medium mb-1.5">No conversations yet</h3>
            <p className="text-[13px] font-sans text-muted-foreground/70 text-center leading-relaxed">
              When your instructor sends you a message, it will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 mx-6 lg:mx-12 xl:mx-16 mb-6 border border-border rounded-xl overflow-hidden bg-card">
          {/* Conversation list */}
          <div className="w-72 flex-shrink-0 border-r border-border flex flex-col bg-muted/20">
            <div className="flex-shrink-0 px-4 py-3 border-b border-border">
              <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {threadKeys.map((key) => {
                const msgs = threads[key];
                const lastMsg = msgs[msgs.length - 1];
                const unread = unreadCount(msgs);
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectThread(key)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border/50 transition-colors cursor-pointer",
                      activeThread === key
                        ? "bg-accent/15 border-l-2 border-l-accent"
                        : "hover:bg-accent/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{key}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[11px] text-muted-foreground/70">{getListTime(lastMsg.timestamp)}</span>
                        {unread > 0 && (
                          <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-1.5">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.content.slice(0, 60)}…</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread area */}
          <div className="flex flex-col flex-1 min-w-0">
            {activeThread ? (
              <>
                {/* Thread header */}
                <div className="flex-shrink-0 px-6 py-4 border-b border-border">
                  <h3 className="font-serif text-lg text-foreground leading-snug">{activeThread}</h3>
                  <p className="text-[11px] font-sans text-muted-foreground/80 uppercase tracking-widest mt-0.5">Instructor</p>
                </div>

                {/* Messages scroll area */}
                <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
                  <div className="space-y-3">
                    {activeMessages.map((msg) => {
                      const isMe = msg.fromRole === "learner";
                      return (
                        <div key={msg.id} className={cn("flex flex-col", isMe ? "items-end" : "items-start")}>
                          <p className={cn("text-xs text-muted-foreground mb-1", isMe ? "text-right" : "text-left")}>
                            {!isMe && <>{msg.fromName} · </>}{getClockTime(msg.timestamp)}
                          </p>
                          <div
                            className={cn(
                              "max-w-[72%] px-4 py-2.5",
                              isMe
                                ? "bg-accent/20 text-foreground rounded-2xl rounded-tr-sm"
                                : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                            )}
                          >
                            {msg.subject && (
                              <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>
                            )}
                            <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                          </div>
                          {!msg.read && msg.fromRole === "admin" && (
                            <Circle className="h-2 w-2 fill-accent text-accent mt-1" />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Composer */}
                <div className="flex-shrink-0 px-6 py-4 border-t border-border">
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply…"
                      rows={1}
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus-visible:shadow-none focus-visible:ring-0 border border-border rounded-lg px-3 py-2.5 min-h-[44px] max-h-[120px]"
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
                      className="h-10 w-10 shrink-0 flex items-center justify-center rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
        </div>
      )}
    </div>
  );
};

export default Messages;
