import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.ts";
import {
  createUserService,
  getUserProfileService,
  getUserService,
  changeUserPassService,
  updateUserService, resetUserPassService
} from "../services/userService.ts";
import { transporter } from "../utils/nodemailer.ts";
import * as crypto from "node:crypto";

export const registerUser = async (req: Request, res: Response) => {
  const { name, surname, email, password } = req.body;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

  try {
    const userExists = await getUserService(email);
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = await createUserService(name, surname, email, password, avatarPath);
    if (!newUser) {
      return res.status(400).json({ message: "Invalid user data" });
    }

    return res.status(201).json({ token: generateToken(newUser.id) });
  } catch (error) {
    res.status(500).json({ message: `Registration failed: ${error}` });
  }
};

export const authUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await getUserService(email);
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      return res.status(200).json({ token: generateToken(user.id) })
    } else {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error)
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

    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}`;

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

    return res.status(200).json({ message: "Reset email sent" });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  const { token, newPassword } = req.body;

  if (!token) return res.status(400).json({ message: "Token is required" });

  try {
    await resetUserPassService(token, newPassword);

    return res.json({ message: "Password successfully updated" });
  } catch (error) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { password, newPassword, confirmNewPassword } = req.body;
  const user = req.user;

  try {
    if (user && (await bcrypt.compare(password, user.password))) {
      await changeUserPassService(newPassword, confirmNewPassword, user);

      return res.status(200).json({ message: "Password changed successfully" });
    } else {
      return res.status(401).json({ message: "Invalid password" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  const { name, surname } = req.body;
  const user = req.user;
  const avatarPath = req.file ? `/uploads/avatars/${req.file.filename}` : null;

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