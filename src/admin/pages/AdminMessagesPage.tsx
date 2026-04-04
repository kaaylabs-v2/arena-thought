import { useState } from "react";
import { Send, Circle, MessageSquare } from "lucide-react";
import { useWorkspace, mockUsers } from "@/context/WorkspaceContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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
    // Mark learner messages as read
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
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold text-foreground">Messages</h1>
        <p className="text-sm text-muted-foreground mt-1">Send direct messages to learners</p>
      </div>

      <div className="grid grid-cols-[260px_1fr] gap-0 border border-border rounded-xl overflow-hidden bg-card min-h-[520px]">
        {/* Learner list */}
        <div className="border-r border-border bg-muted/30">
          <div className="p-3 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learners</p>
          </div>
          <ScrollArea className="h-[470px]">
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
        <div className="flex flex-col">
          {activeThread ? (
            <>
              <div className="p-4 border-b border-border">
                <h3 className="text-sm font-medium text-foreground">{activeThread.user.name}</h3>
                <p className="text-xs text-muted-foreground">{activeThread.user.email}</p>
              </div>
              <ScrollArea className="flex-1 p-4 h-[340px]">
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
                              ? "bg-primary/10 ml-auto"
                              : "bg-muted mr-auto"
                          )}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-medium text-foreground">{msg.fromName}</span>
                            {!msg.read && msg.fromRole === "learner" && (
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
                )}
              </ScrollArea>
              <div className="p-4 border-t border-border space-y-2">
                <Input
                  value={subjectText}
                  onChange={(e) => setSubjectText(e.target.value)}
                  placeholder="Subject (optional)"
                  className="text-sm h-9"
                />
                <div className="flex gap-2">
                  <Textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type your message..."
                    className="min-h-[44px] max-h-[120px] resize-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                  />
                  <Button
                    size="icon"
                    onClick={handleSend}
                    disabled={!messageText.trim()}
                    className="shrink-0 self-end"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
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
