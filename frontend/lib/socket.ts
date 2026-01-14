import { io, Socket } from "socket.io-client";

let socket: Socket;

export const connectSocket = () => {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      withCredentials: true,
    });
  }
  return socket;
};

export const getSocket = () => socket;
