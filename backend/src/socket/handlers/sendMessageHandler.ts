import { Socket, Server } from "socket.io";
import { Message } from "../../models/models.ts";

export const sendMessageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", async ({ receiverId, message }) => {
    const senderId = socket.user!.id;
    const roomId = [senderId, receiverId].sort().join("_");

    const savedMessage = await Message.create({
      senderId,
      receiverId,
      message,
      isRead: false,
    });

    const messageWithSender = {
      ...savedMessage.toJSON(),
      sender: {
        id: socket.user!.id,
        name: socket.user!.name,
        surname: socket.user!.surname,
        avatar: socket.user!.avatar,
      },
    };

    io.to(roomId).emit("receiveMessage", messageWithSender);
  });
};
