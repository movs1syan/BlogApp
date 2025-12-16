import { Socket } from "socket.io";

export const disconnectHandler = (socket: Socket) => {
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.user?.id);
  });
};
