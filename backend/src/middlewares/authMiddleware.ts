import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import {User} from "../models/User.ts";

const protect = async (req: Request, res: Response, next: NextFunction) => {
  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      let token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findByPk(decoded.id);

      next();
    } catch (err) {
      res.status(400);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(400);
    throw new Error("Not authorized, no token");
  }
};

export default protect;