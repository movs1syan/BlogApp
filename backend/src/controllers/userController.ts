import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.ts";
import {createUserService, getUserProfileService, getUserService, updateUserService} from "../services/userService.ts";
import { transporter } from "../utils/nodemailer.ts";
import {User} from "../models/index.ts";

interface JwtPayloadWithId extends jwt.JwtPayload {
  id: number;
}

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

export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await getUserService(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const resetToken = generateToken(user.id);
    const resetURL = `http://localhost:3000/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Reset Your Password",
      html: `
        <h3>Password Reset</h3>
        <p>Click below to reset your password:</p>
        <a href="${resetURL}">${resetURL}</a>
      `,
    });

    return res.json({ message: "Reset email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token } = req.params;
  const { newPassword, confirmNewPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.RESET_PASSWORD_SECRET!) as JwtPayloadWithId;
    console.log(decoded, "decoded")

    const user = await User.findByPk(decoded.id);

    console.log(user);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    user.password = newPassword;
    await user.save();

    return res.json({ message: "Password successfully updated" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, surname } = req.body;
  const user = req.user;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  if (!name || !surname) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const updatedUser = await updateUserService(name, surname, avatarPath, user);

    if (updatedUser) {
      return res.status(200).json(updatedUser);
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to update user: ${err}` });
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