import { useEffect } from "react";
import { getSocket } from "../lib/socket";

export const useHireNotifications = () => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("gig:hired", (data) => {
      alert(`🎉 You were hired for gig ${data.gigId}!`);
    });

    return () => {socket.off("gig:hired");}
  }, []);
};
