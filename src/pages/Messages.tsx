import { useState } from "react";
import { MessageSquare, Send, ArrowLeft, Circle } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
    const threadKey = msg.fromRole === "admin" ? msg.fromName : (directMessages.find(d => d.id === msg.id)?.toUserId === "user-1" ? "admin" : msg.toUserId);
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
    // Mark all admin messages in this thread as read
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
    <div className="w-full max-w-5xl mx-auto py-10 px-4 animate-fade-in">
      <div className="mb-8">
        <h1 className="font-serif text-4xl text-foreground mb-1.5 leading-[1.1] font-medium">Messages</h1>
        <p className="text-muted-foreground font-sans text-sm tracking-[-0.01em]">
          Direct messages from your instructors
        </p>
      </div>

      {threadKeys.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <MessageSquare className="h-12 w-12 mb-4 opacity-30" />
          <p className="text-sm">No messages yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-[280px_1fr] gap-0 border border-border rounded-xl overflow-hidden bg-card min-h-[500px]">
          {/* Thread list */}
          <div className="border-r border-border bg-muted/30">
            <div className="p-3 border-b border-border">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Conversations</p>
            </div>
            <ScrollArea className="h-[450px]">
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
                      activeThread === key ? "bg-accent" : "hover:bg-accent/50"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground truncate">{key}</span>
                      {unread > 0 && (
                        <span className="flex items-center justify-center h-5 w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold">
                          {unread}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{lastMsg.content.slice(0, 60)}...</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{lastMsg.timestamp}</p>
                  </button>
                );
              })}
            </ScrollArea>
          </div>

          {/* Conversation view */}
          <div className="flex flex-col">
            {activeThread ? (
              <>
                <div className="p-4 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">{activeThread}</h3>
                  <p className="text-xs text-muted-foreground">Instructor</p>
                </div>
                <ScrollArea className="flex-1 p-4 h-[340px]">
                  <div className="space-y-4">
                    {activeMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className={cn(
                          "max-w-[80%] rounded-xl px-4 py-3",
                          msg.fromRole === "admin"
                            ? "bg-muted mr-auto"
                            : "bg-primary/10 ml-auto"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-foreground">{msg.fromName}</span>
                          {!msg.read && msg.fromRole === "admin" && (
                            <Circle className="h-2 w-2 fill-primary text-primary" />
                          )}
                        </div>
                        {msg.subject && (
                          <p className="text-xs font-medium text-foreground/80 mb-1">{msg.subject}</p>
                        )}
                        <p className="text-sm text-foreground/90 leading-relaxed">{msg.content}</p>
                        <p className="text-[10px] text-muted-foreground mt-2">{msg.timestamp}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-border">
                  <div className="flex gap-2">
                    <Textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      className="min-h-[44px] max-h-[120px] resize-none text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                    />
                    <Button
                      size="icon"
                      onClick={handleSendReply}
                      disabled={!replyText.trim()}
                      className="shrink-0 self-end"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
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
