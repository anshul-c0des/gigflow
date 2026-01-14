"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  XCircle,
  MessageSquare,
  Sparkles,
  Inbox,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getSocket } from "@/lib/socket";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";

export type Notification = {   // type for session notifications
  id: string;
  type: "hired" | "rejected" | "new_bid";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);   // state for temp notifications
  const unreadCount = notifications.filter((n) => !n.read).length;   // track unread notifications

  useEffect(() => {   // socket init
    const socket = getSocket();
    if (!socket) return;

    socket.on("notification:new", (data) => {
      const newNotif: Notification = {
        ...data,
        id: Date.now().toString(),
        read: false,
        createdAt: new Date(),
      };
      setNotifications((prev) => [newNotif, ...prev]);
    });

    return () => {
      socket.off("notification:new");
    };
  }, []);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <Popover onOpenChange={(open) => open && markAllAsRead()}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl bg-slate-50 border border-slate-100 transition-all hover:bg-white hover:shadow-sm"
        >
          <Bell className="w-5 h-5 text-slate-600" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-96 p-0 mt-2 rounded-[2rem] border-slate-200 shadow-2xl overflow-hidden bg-white/95 backdrop-blur-xl"
        align="end"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-900">Notifications</h3>
            {unreadCount > 0 && (
              <span className="bg-emerald-950 text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                {unreadCount} New
              </span>
            )}
          </div>
          <button
            disabled={notifications.length === 0}
            className="cursor-pointer text-[11px] font-bold text-slate-400 hover:text-emerald-700 transition-colors"
          >
            Mark all as read
          </button>
        </div>

        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] p-8 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center mb-4">
                <Inbox className="w-8 h-8 text-slate-200" />
              </div>
              <p className="text-xs text-slate-500 max-w-[180px] leading-relaxed">
                You're all caught up.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-50">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`group relative flex gap-4 p-5 transition-all hover:bg-slate-50/80 ${
                    !n.read ? "bg-emerald-50/30" : ""
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`p-2.5 rounded-2xl shadow-sm border transition-transform group-hover:scale-110 ${
                        n.type === "hired"
                          ? "bg-emerald-50 border-emerald-100 text-emerald-600"
                          : n.type === "rejected"
                          ? "bg-rose-50 border-rose-100 text-rose-500"
                          : "bg-teal-50 border-teal-100 text-teal-600"
                      }`}
                    >
                      {n.type === "hired" && <Sparkles className="w-4 h-4" />}
                      {n.type === "rejected" && <XCircle className="w-4 h-4" />}
                      {n.type === "new_bid" && (
                        <MessageSquare className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-bold text-slate-900">
                        {n.title}
                      </p>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                        Just now
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed pr-4 font-medium">
                      {n.message}
                    </p>
                    {!n.read && (
                      <div className="absolute top-1/2 right-4 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
