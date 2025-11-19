import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/index.ts";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: number;
}

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    let token;

    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithId;

      req.user = await User.findByPk(decoded.id);

      next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  } else {
    return res.status(401).json({ message: "Not authorized, no token" });
  }
};

export default protect;