import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/index.ts";
import generateToken from "../utils/generateToken.ts";
import {createUserService, getUserService} from "../services/userService.ts";

export const registerUser = async (req: Request, res: Response) => {
  const { name, surname, email, password, avatar } = req.body;

  try {
    if (!name || !surname || !email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await getUserService(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await createUserService(name, surname, email, password, avatar);

    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    return res.status(201).json({
      id: newUser.id,
      name: newUser.name,
      surname: newUser.surname,
      email: newUser.email,
      avatar: newUser.avatar,
      token: generateToken(newUser.id)
    });
  } catch (error) {
    res.status(500).json({ message: `Registration failed: ${error}` });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await getUserService(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({
        id: user.id,
        name: user.name,
        surname: user.surname,
        email: user.email,
        token: generateToken(user.id)
      })
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: `Authentication failed: ${error}` });
  }
};

export const getUserProfile = async (req: Request, res: Response) => {
  if (!req.user) {
    return res.status(400).json({ message: "User does not logged in" });
  }

  const user = await User.findByPk(req.user.id);

  if (!user) {
    return res.status(400).json({ message: "User does not exist" });
  }

  return res.status(200).json({
    id: user.id,
    name: user.name,
    surname: user.surname,
    email: user.email
  })
};