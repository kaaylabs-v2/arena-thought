import { useState } from "react";
import { MessageSquare, Send, ArrowLeft, Circle, Mail } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const Messages = () => {
  const { directMessages, addDirectMessage, markMessageRead, userProfile } = useWorkspace();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  // Messages relevant to this learner (to or from them)
  const myMessages = directMessages.filter(
    (m) => m.toUserId === "user-1" || (m.fromRole === "learner" && m.fromName === userProfile.name)
  );

  // Group by admin sender to create threads
  const threads = myMessages.reduce<Record<string, typeof myMessages>>((acc, msg) => {
    const key = msg.fromRole === "admin" ? msg.fromName : "Dr. Sarah Mitchell";
    if (!acc[key]) acc[key] = [];
    acc[key].push(msg);
    return acc;
  }, {});

  // Sort messages in thread by order
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

  return (
    <div className="w-full max-w-5xl mx-auto py-10 px-6 lg:px-12 xl:px-16 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Messages</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
          Direct messages from your instructors
        </p>
      </div>

      {threadKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24">
          <div className="rounded-2xl border-2 border-dashed border-border p-8 flex flex-col items-center max-w-sm">
            <div className="h-14 w-14 rounded-xl bg-muted/50 flex items-center justify-center mb-4">
              <Mail className="h-7 w-7 text-muted-foreground/40" strokeWidth={1.5} />
            </div>
            <h3 className="font-serif text-lg text-foreground font-medium mb-1.5">No conversations yet</h3>
            <p className="text-[13px] font-sans text-muted-foreground/70 text-center leading-relaxed">
              When your instructor sends you a message, it will appear here. You'll also be able to reply directly.
            </p>
          </div>
        </div>
      ) : (
        <div
          className="flex border border-border rounded-xl overflow-hidden bg-card animate-fade-in"
          style={{ animationDelay: "80ms", animationFillMode: "backwards", minHeight: "calc(100vh - 260px)" }}
        >
          {/* Thread list */}
          <div className="w-[280px] shrink-0 border-r border-border bg-muted/30 flex flex-col">
            <div className="p-3 border-b border-border">
              <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Conversations</p>
            </div>
            <ScrollArea className="flex-1">
              {threadKeys.map((key) => {
                const msgs = threads[key];
                const lastMsg = msgs[msgs.length - 1];
                const unread = unreadCount(msgs);
                return (
                  <button
                    key={key}
                    onClick={() => handleSelectThread(key)}
                    className={cn(
                      "w-full text-left px-4 py-3 border-b border-border/50 transition-colors",
                      activeThread === key ? "bg-secondary" : "hover:bg-secondary/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{key}</span>
                      {unread > 0 && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{lastMsg.content.slice(0, 60)}...</p>
                    <p className="text-[10px] text-muted-foreground/80 mt-1">{lastMsg.timestamp}</p>
                  </button>
                );
              })}
            </ScrollArea>
          </div>

          {/* Conversation view */}
          <div className="flex-1 flex flex-col min-w-0">
            {activeThread ? (
              <>
                <div className="px-5 py-4 border-b border-border">
                  <h3 className="font-serif text-lg text-foreground leading-snug">{activeThread}</h3>
                  <p className="text-[11px] font-sans text-muted-foreground/80 uppercase tracking-widest mt-0.5">Instructor</p>
                </div>
                <ScrollArea className="flex-1 p-5">
                  <div className="space-y-4">
                    {activeMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "max-w-[80%] rounded-xl px-4 py-3",
                          msg.fromRole === "admin"
                            ? "bg-secondary border border-border mr-auto"
                            : "bg-accent/15 border border-accent/25 ml-auto"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground">{msg.fromName}</span>
                          {!msg.read && msg.fromRole === "admin" && (
                            <Circle className="h-2 w-2 fill-accent text-accent" />
                          )}
                        </div>
                        {msg.subject && (
                          <p className="text-xs font-medium text-foreground mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-foreground leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] text-muted-foreground/80 mt-2">{msg.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="px-5 py-4 border-t border-border">
                  <div className="flex gap-2 items-end">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={1}
                      className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[44px] max-h-[120px]"
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
