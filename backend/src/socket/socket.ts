import { Server } from "socket.io";
import { socketAuth } from "./socketAuth.ts";
import { chatHandlers } from "./chatHandlers.ts";

export const initSocket = (io: Server) => {
  io.use(socketAuth);

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.user!.id);
    chatHandlers(io, socket);
  });
};
