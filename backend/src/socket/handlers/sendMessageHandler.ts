import { Socket, Server } from "socket.io";
import { Message, Friend, GroupMessage } from "../../models/models.ts";

export const sendMessageHandler = (io: Server, socket: Socket) => {
  socket.on("sendMessage", async ({ receiverId, message }) => {
    const senderId = socket.user!.id;
    const roomId = [senderId, receiverId].sort().join(":");

    const areFriends = await Friend.findOne({
      where: {
        reqSenderId: senderId, reqTakerId: receiverId
      },
    });

    if (areFriends) {
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
    }
  });

  socket.on("sendGroupMessage", async ({ friendsIds, groupId, message }) => {
    const userId = socket.user!.id;
    const roomId = friendsIds.sort().join(":");

    const savedMessage = await GroupMessage.create({
      senderId: userId,
      groupId,
      message
    });

    const messageWithSender = {
      ...savedMessage.toJSON(),
      messageSender: {
        id: socket.user!.id,
        name: socket.user!.name,
        surname: socket.user!.surname,
        avatar: socket.user!.avatar,
      },
    };

    io.to(roomId).emit("receiveGroupMessage", messageWithSender);
  });
};
