import { Socket, Server } from "socket.io";
import { Message, User, Friend, GroupMessage } from "../../models/models.ts";
import { Op } from "sequelize";

export const getMessagesHandler = (io: Server, socket: Socket) => {
  socket.on("getMessages", async ({ friendId }) => {
    const userId = socket.user!.id;
    const roomId = [userId, friendId].sort().join(":");

    const areFriends = await Friend.findOne({
      where: {
        reqSenderId: userId, reqTakerId: friendId,
      },
    });

    if (areFriends) {
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
    }
  });

  socket.on("getGroupMessages", async ({ friendsIds, groupId }) => {
    const roomId = friendsIds.sort().join(":");

    const messages = await GroupMessage.findAll({
      where: { groupId },
      order: [["createdAt", "ASC"]],
      include: [
        {
          model: User,
          as: "messageSender",
          attributes: ["id", "name", "surname", "avatar"],
        }
      ],
    });

    io.to(roomId).emit("oldGroupMessages", messages);
  });
};
