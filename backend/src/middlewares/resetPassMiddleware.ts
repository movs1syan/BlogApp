import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/models.ts";
import process from "node:process";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: number;
}

const resetPassMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithId;

    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "User does not exist" });
    }
    req.user = user;

    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" })
  }
};

export default resetPassMiddleware;