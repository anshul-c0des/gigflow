"use client";

import { useEffect, useState } from "react";
import { Bell, CheckCircle2, XCircle, MessageSquare } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSocket } from "@/lib/socket";
import { ScrollArea } from "@/components/ui/scroll-area";

export type Notification = {
  id: string;
  type: "hired" | "rejected" | "new_bid";
  title: string;
  message: string;
  createdAt: Date;
  read: boolean;
};

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
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
      <PopoverTrigger className="relative p-2 rounded-full hover:bg-gray-100 transition-colors">
        <Bell className="w-5 h-5 text-gray-600" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] text-white font-bold border-2 border-white">
            {unreadCount}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-sm">Notifications</h3>
          {unreadCount > 0 && <span className="text-xs text-muted-foreground">{unreadCount} new</span>}
        </div>
        <ScrollArea className="h-[350px]">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-10 text-center opacity-50">
              <Bell className="w-8 h-8 mb-2" />
              <p className="text-xs">No notifications this session</p>
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-3 p-4 border-b hover:bg-gray-50 transition-colors ${
                  !n.read ? "bg-blue-50/30" : ""
                }`}
              >
                <div className="mt-0.5">
                  {n.type === "hired" && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                  {n.type === "rejected" && <XCircle className="w-5 h-5 text-red-500" />}
                  {n.type === "new_bid" && <MessageSquare className="w-5 h-5 text-blue-500" />}
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">{n.title}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{n.message}</p>
                  <p className="text-[10px] text-gray-400">Just now</p>
                </div>
              </div>
            ))
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}