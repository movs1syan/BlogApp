import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.ts";
import {createUserService, getUserProfileService, getUserService} from "../services/userService.ts";

export const registerUser = async (req: Request, res: Response) => {
  const { name, surname, email, password, confirmPassword } = req.body;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    if (!name || !surname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const userExists = await getUserService(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const newUser = await createUserService(name, surname, email, password, avatarPath);
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
        avatar: user.avatar,
        token: generateToken(user.id)
      })
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: `Authentication failed: ${error}` });
  }
};

export const getUserInfo = async (req: Request, res: Response) => {
  const { id, name, surname, email, avatar } = req.user;

  return res.status(200).json({ id, name, surname, email, avatar});
};

export const getUserProfile = async (req: Request, res: Response) => {
  const user = await getUserProfileService(req.user.id);

  return res.status(200).json(user);
};