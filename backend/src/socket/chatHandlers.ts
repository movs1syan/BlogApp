import { Server, Socket } from "socket.io";
import { joinRoomHandler } from "./handlers/joinRoomHandler.ts";
import { getMessagesHandler } from "./handlers/getMessagesHandler.ts";
import { sendMessageHandler } from "./handlers/sendMessageHandler.ts";
import { disconnectHandler } from "./handlers/disconnectHandler.ts";

export const chatHandlers = (io: Server, socket: Socket) => {
  joinRoomHandler(socket);
  getMessagesHandler(io, socket);
  sendMessageHandler(io, socket);
  disconnectHandler(socket);
};
