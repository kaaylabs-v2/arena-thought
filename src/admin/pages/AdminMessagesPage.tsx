import { useState } from "react";
import { Send, Circle, MessageSquare } from "lucide-react";
import { useWorkspace, mockUsers } from "@/context/WorkspaceContext";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const AdminMessagesPage = () => {
  const { directMessages, addDirectMessage, markMessageRead, studioCurrentAdmin } = useWorkspace();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(mockUsers[0]?.id || null);
  const [messageText, setMessageText] = useState("");
  const [subjectText, setSubjectText] = useState("");

  // Group messages by learner
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

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="font-serif text-[2rem] font-normal text-foreground">Messages</h1>
        <p className="text-sm mt-0.5 text-muted-foreground">Send direct messages to learners</p>
      </div>

      <div
        className="flex border border-border rounded-xl overflow-hidden bg-card animate-fade-in"
        style={{ animationDelay: "80ms", animationFillMode: "backwards", minHeight: "calc(100vh - 220px)" }}
      >
        {/* Learner list */}
        <div className="w-[260px] shrink-0 border-r border-border bg-muted/30 flex flex-col">
          <div className="p-3 border-b border-border">
            <p className="text-[11px] font-sans uppercase tracking-widest text-muted-foreground">Learners</p>
          </div>
          <ScrollArea className="flex-1">
            {learnerThreads.map(({ user, messages, unread }) => {
              const lastMsg = messages[messages.length - 1];
              return (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user.id)}
                  className={cn(
                    "w-full text-left px-4 py-3 border-b border-border/50 transition-colors",
                    selectedUserId === user.id ? "bg-secondary" : "hover:bg-secondary/50"
                  )}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-sm font-medium text-foreground truncate">{user.name}</span>
                    {unread > 0 && (
                      <span className="flex items-center justify-center h-5 w-5 rounded-full bg-accent text-accent-foreground text-[10px] font-bold">
                        {unread}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                  {lastMsg && (
                    <p className="text-xs text-muted-foreground truncate mt-1">{lastMsg.content.slice(0, 50)}...</p>
                  )}
                </button>
              );
            })}
          </ScrollArea>
        </div>

        {/* Conversation */}
        <div className="flex-1 flex flex-col min-w-0">
          {activeThread ? (
            <>
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-serif text-lg text-foreground leading-snug">{activeThread.user.name}</h3>
                <p className="text-[11px] font-sans text-muted-foreground/80 uppercase tracking-widest mt-0.5">{activeThread.user.email}</p>
              </div>
              <ScrollArea className="flex-1 p-5">
                {activeThread.messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-16">
                    <MessageSquare className="h-8 w-8 mb-2 opacity-30" />
                    <p className="text-sm">No messages yet. Start the conversation.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeThread.messages
                      .sort((a, b) => directMessages.indexOf(a) - directMessages.indexOf(b))
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className={cn(
                            "max-w-[80%] rounded-xl px-4 py-3",
                            msg.fromRole === "admin"
                              ? "bg-accent/15 border border-accent/25 ml-auto"
                              : "bg-secondary border border-border mr-auto"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground">{msg.fromName}</span>
                            {!msg.read && msg.fromRole === "learner" && (
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
                )}
              </ScrollArea>
              <div className="px-5 py-4 border-t border-border space-y-2">
                <input
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="Subject (optional)"
                  className="w-full bg-transparent border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex gap-2 items-end">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    rows={1}
                    className="flex-1 bg-transparent border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring resize-none min-h-[44px] max-h-[120px]"
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
    </div>
  );
};

export default AdminMessagesPage;
