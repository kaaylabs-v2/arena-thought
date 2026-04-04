import { useState } from "react";
import { Send, Circle, MessageSquare, ArrowLeft } from "lucide-react";
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

  return (
    <div className="p-6 lg:p-8 max-w-[1200px] mx-auto animate-fade-in">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-[2rem] font-normal text-foreground">Messages</h1>
          <p className="text-sm mt-0.5 text-muted-foreground">Send direct messages to learners</p>
        </div>
      </div>

      <div className="border border-border rounded-xl overflow-hidden bg-card min-h-[520px]">
        {/* Desktop: grid layout, Mobile: conditional */}
        <div className="hidden md:grid grid-cols-[260px_1fr]">
          {/* Learner list */}
          <LearnerList
            threads={learnerThreads}
            selectedUserId={selectedUserId}
            onSelect={handleSelectUser}
          />
          {/* Conversation */}
          <ConversationPane
            activeThread={activeThread}
            directMessages={directMessages}
            subjectText={subjectText}
            setSubjectText={setSubjectText}
            messageText={messageText}
            setMessageText={setMessageText}
            handleSend={handleSend}
          />
        </div>

        {/* Mobile layout */}
        <div className="md:hidden">
          {!selectedUserId ? (
            <LearnerList
              threads={learnerThreads}
              selectedUserId={selectedUserId}
              onSelect={handleSelectUser}
            />
          ) : (
            <div className="flex flex-col min-h-[520px]">
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground hover:text-foreground border-b border-border transition-colors"
              >
                <ArrowLeft className="h-4 w-4" /> Back to learners
              </button>
              <ConversationPane
                activeThread={activeThread}
                directMessages={directMessages}
                subjectText={subjectText}
                setSubjectText={setSubjectText}
                messageText={messageText}
                setMessageText={setMessageText}
                handleSend={handleSend}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// Extracted components for reuse between desktop/mobile

function LearnerList({ threads, selectedUserId, onSelect }: {
  threads: { user: { id: string; name: string; email: string }; messages: any[]; unread: number }[];
  selectedUserId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="border-r border-border bg-muted/30">
      <div className="p-3 border-b border-border">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learners</p>
      </div>
      <ScrollArea className="h-[470px]">
        {threads.map(({ user, messages, unread }) => {
          const lastMsg = messages[messages.length - 1];
          return (
            <button
              key={user.id}
              onClick={() => onSelect(user.id)}
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
  );
}

function ConversationPane({ activeThread, directMessages, subjectText, setSubjectText, messageText, setMessageText, handleSend }: {
  activeThread: any;
  directMessages: any[];
  subjectText: string;
  setSubjectText: (v: string) => void;
  messageText: string;
  setMessageText: (v: string) => void;
  handleSend: () => void;
}) {
  if (!activeThread) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm min-h-[520px]">
        Select a learner to message
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
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
              .sort((a: any, b: any) => directMessages.indexOf(a) - directMessages.indexOf(b))
              .map((msg: any) => (
                <div
                  key={msg.id}
                  className={cn(
                    "max-w-[80%] rounded-xl px-4 py-3",
                    msg.fromRole === "admin"
                      ? "bg-accent/15 border border-accent/20 ml-auto"
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
    </div>
  );
}

export default AdminMessagesPage;
