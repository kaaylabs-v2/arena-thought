import { useState } from "react";
import { Bell, X, Check, CheckCheck } from "lucide-react";
import { useWorkspace } from "@/context/WorkspaceContext";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}


export function AdminTopBar() {
  const { studioOrganization: organization, studioActivity: recentActivity } = useWorkspace();
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(() => recentActivity.map(a => ({ id: a.id, text: a.text, time: a.time, read: false })));

  const unreadCount = notifications.filter(n => !n.read).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
    setOpen(false);
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border bg-background">
      <span className="text-sm font-medium text-muted-foreground">
        {organization.name}
      </span>
      <div className="relative">
        <button
          className="p-1.5 rounded-md transition-colors text-muted-foreground hover:text-foreground relative"
          onClick={() => setOpen(!open)}
        >
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.5} />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-accent text-accent-foreground text-[9px] font-bold flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>

        {open && (
          <>
            <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
            <div className="absolute right-0 top-full mt-2 w-80 z-40 rounded-xl shadow-lg border border-border bg-card animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-[13px] font-semibold text-foreground">Notifications</h3>
                <div className="flex items-center gap-1">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="toolbar-btn p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-150" title="Mark all read">
                      <CheckCheck className="h-3.5 w-3.5" />
                    </button>
                  )}
                  <button onClick={() => setOpen(false)} className="toolbar-btn p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-150">
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="max-h-[320px] overflow-y-auto scrollbar-thin">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="h-5 w-5 mx-auto mb-2 text-muted-foreground/30" strokeWidth={1.5} />
                    <p className="text-[13px] text-muted-foreground">No notifications</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors duration-150 border-b border-border/50 last:border-0",
                        n.read ? "hover:bg-muted/30" : "bg-accent/5 hover:bg-accent/8"
                      )}
                    >
                      <div className={cn("mt-1.5 h-2 w-2 rounded-full shrink-0 transition-opacity duration-200", n.read ? "opacity-0" : "bg-accent")} />
                      <div className="flex-1 min-w-0">
                        <p className={cn("text-[12px] leading-snug", n.read ? "text-muted-foreground" : "text-foreground/80")}>{n.text}</p>
                        <p className="text-[10px] mt-0.5 text-muted-foreground/60">{n.time}</p>
                      </div>
                      {!n.read && (
                        <button
                          onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                          className="shrink-0 p-0.5 rounded text-muted-foreground/40 hover:text-accent transition-colors duration-150"
                          title="Mark as read"
                        >
                          <Check className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-border">
                  <button onClick={clearAll} className="w-full text-[12px] text-center font-medium text-muted-foreground hover:text-foreground transition-colors duration-150">
                    Clear all
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
