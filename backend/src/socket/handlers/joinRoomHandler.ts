import { Socket } from "socket.io";

export const joinRoomHandler = (socket: Socket) => {
  socket.on("joinRoom", ({ friendId }) => {
    const userId = socket.user!.id;
    const roomId = [userId, friendId].sort().join("_");

    socket.join(roomId);
    console.log(`User ${userId} joined room ${roomId}`);
  });
};