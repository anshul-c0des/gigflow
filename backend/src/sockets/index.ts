import { Server } from "socket.io";
import http from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import * as cookie from "cookie";

let io: Server | null = null;

export const initSocket = (server: http.Server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      credentials: true,
    },
  });

  io.use((socket, next) => {
    try {
      const rawCookieHeader = socket.request.headers.cookie;

      if (!rawCookieHeader) return next(new Error("Unauthorized"));

      const cookies = cookie.parse(rawCookieHeader);
      const token = cookies.token;

      if (!token) return next(new Error("Unauthorized"));   // check auth

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        throw new Error("JWT_SECRET is not defined");
      }

      const decoded = jwt.verify(token, secret) as JwtPayload;

      socket.data.user = decoded;
      next();
    } catch (err) {
      console.error("Socket auth error:", err);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const userId = socket.data.user.id;

    socket.join(userId);

    console.log(`User connected: ${userId}`);

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${userId}`);
    });
  });

  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) return;
  io.to(userId).emit(event, data);
};
