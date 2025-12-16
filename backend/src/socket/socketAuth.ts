import jwt from "jsonwebtoken";
import { User } from "../models/models.ts";
import { Socket } from "socket.io";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: number;
}

export const socketAuth = async (socket: Socket, next: any) => {
  const token = socket.handshake.auth?.token;

  if (!token) {
    throw new Error("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithId;

    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error ("User does not found");

    socket.user = user;

    next();
  } catch (error) {
    console.log(error)
    throw new Error("Invalid token");
  }
}