import { Socket, Server } from "socket.io";
import { Message, User } from "../../models/models.ts";
import { Op } from "sequelize";

export const getMessagesHandler = (io: Server, socket: Socket) => {
  socket.on("getMessages", async ({ friendId }) => {
    const userId = socket.user!.id;
    const roomId = [userId, friendId].sort().join("_");

    const messages = await Message.findAll({
      where: {
        [Op.or]: [
          { senderId: userId, receiverId: friendId },
          { senderId: friendId, receiverId: userId },
        ],
      },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "sender",
          attributes: ["id", "name", "surname", "avatar"],
        },
      ],
    });

    io.to(roomId).emit("oldMessages", messages);
  });
};
