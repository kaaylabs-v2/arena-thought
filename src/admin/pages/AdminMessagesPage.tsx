import { useState, useRef, useEffect } from "react";
import { Send, Circle, MessageSquare, ArrowLeft } from "lucide-react";
import { useWorkspace, mockUsers } from "@/context/WorkspaceContext";
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

const AdminMessagesPage = () => {
  const { directMessages, addDirectMessage, markMessageRead, studioCurrentAdmin } = useWorkspace();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(mockUsers[0]?.id || null);
  const [messageText, setMessageText] = useState("");
  const [subjectText, setSubjectText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const learnerThreads = mockUsers.map((user) => {
    const msgs = directMessages.filter(
      (m) =>
        (m.toUserId === user.id && m.fromRole === "admin") ||
        (m.fromRole === "learner" && m.fromName === user.name)
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

  const handleBack = () => setSelectedUserId(null);

  const sortedMessages = activeThread
    ? [...activeThread.messages].sort((a, b) => directMessages.indexOf(a) - directMessages.indexOf(b))
    : [];

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [sortedMessages.length, selectedUserId]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] animate-fade-in">
      {/* Header */}
      <div className="flex-shrink-0 px-6 lg:px-8 pt-6 pb-4">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Messages</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Send direct messages to learners</p>
      </div>

      {/* Messages panel */}
      <div className="flex flex-1 min-h-0 mx-6 lg:mx-8 mb-6 border border-border rounded-xl overflow-hidden bg-card">
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1 min-h-0">
          {/* Learner list */}
          <div className="w-72 flex-shrink-0 border-r border-border flex flex-col bg-muted/20">
            <div className="flex-shrink-0 px-4 py-3 border-b border-border">
              <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Learners</p>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {learnerThreads.map(({ user, messages, unread }) => {
                const lastMsg = messages[messages.length - 1];
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border/50 transition-colors cursor-pointer",
                      selectedUserId === user.id
                        ? "bg-accent/15 border-l-2 border-l-accent"
                        : "hover:bg-accent/10"
                    )}
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {lastMsg && <span className="text-[11px] text-muted-foreground/70">{getListTime(lastMsg.timestamp)}</span>}
                        {unread > 0 && (
                          <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-1.5">
                            {unread}
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    {lastMsg && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.content.slice(0, 50)}…</p>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Thread area */}
          <ThreadPane
            activeThread={activeThread}
            sortedMessages={sortedMessages}
            scrollRef={scrollRef}
            subjectText={subjectText}
            setSubjectText={setSubjectText}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
          />
        </div>

        {/* Mobile layout */}
        <div className="md:hidden flex flex-col flex-1 min-h-0">
          {!selectedUserId ? (
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              {learnerThreads.map(({ user, messages, unread }) => {
                const lastMsg = messages[messages.length - 1];
                return (
                  <button
                    key={user.id}
                    onClick={() => handleSelectUser(user.id)}
                    className="w-full text-left px-4 py-3 border-b border-border/50 transition-colors hover:bg-accent/10 cursor-pointer"
                  >
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                      {unread > 0 && (
                        <span className="flex items-center justify-center h-5 min-w-[20px] rounded-full bg-accent text-accent-foreground text-[10px] font-bold px-1.5">
                          {unread}
                        </span>
                      )}
                    </div>
                    {lastMsg && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{lastMsg.content.slice(0, 50)}…</p>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground border-b border-border transition-colors flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4" /> Back to learners
              </button>
              <ThreadPane
                activeThread={activeThread}
                sortedMessages={sortedMessages}
                scrollRef={scrollRef}
                subjectText={subjectText}
                setSubjectText={setSubjectText}
                messageText={messageText}
                setMessageText={setMessageText}
                handleSend={handleSend}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

function ThreadPane({
  activeThread,
  sortedMessages,
  scrollRef,
  subjectText,
  setSubjectText,
  messageText,
  setMessageText,
  handleSend,
}: {
  activeThread: any;
  sortedMessages: any[];
  scrollRef: React.RefObject<HTMLDivElement>;
  subjectText: string;
  setSubjectText: (v: string) => void;
  messageText: string;
  setMessageText: (v: string) => void;
  handleSend: () => void;
}) {
  if (!activeThread) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center text-muted-foreground text-sm">
        Select a learner to message
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-w-0 min-h-0">
      {/* Thread header */}
      <div className="flex-shrink-0 px-6 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">{activeThread.user.name}</h3>
        <p className="text-xs text-muted-foreground">{activeThread.user.email}</p>
      </div>

      {/* Messages scroll area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-6 py-4 scrollbar-thin">
        {sortedMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
            <p className="text-sm">No messages yet. Start the conversation.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedMessages.map((msg: any) => {
              const isAdmin = msg.fromRole === "admin";
              return (
                <div key={msg.id} className={cn("flex flex-col", isAdmin ? "items-end" : "items-start")}>
                  <p className={cn("text-xs text-muted-foreground mb-1", isAdmin ? "text-right" : "text-left")}>
                    {!isAdmin && <>{msg.fromName} · </>}{getClockTime(msg.timestamp)}
                  </p>
                  <div
                    className={cn(
                      "max-w-[72%] px-4 py-2.5",
                      isAdmin
                        ? "bg-accent/20 text-foreground rounded-2xl rounded-tr-sm"
                        : "bg-muted text-foreground rounded-2xl rounded-tl-sm"
                    )}
                  >
                    {msg.subject && (
                      <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>
                    )}
                    <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
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

      {/* Composer */}
      <div className="flex-shrink-0 px-6 py-4 border-t border-border">
        <input
          value={subjectText}
          onChange={(e) => setSubjectText(e.target.value)}
          placeholder="Subject (optional)"
          className="w-full border-0 border-b border-border bg-transparent text-sm text-foreground placeholder:text-muted-foreground px-0 py-2 focus:outline-none focus-visible:shadow-none focus-visible:ring-0 mb-2"
        />
        <div className="flex gap-2 items-end">
          <textarea
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message…"
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus-visible:shadow-none focus-visible:ring-0 border border-border rounded-lg px-3 py-2.5 min-h-[60px] max-h-[120px]"
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
    </div>
  );
}

export default AdminMessagesPage;
