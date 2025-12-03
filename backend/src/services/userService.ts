import bcrypt from 'bcryptjs';
import { User, Post } from "../models/models.ts";
import {Op} from "sequelize";
import crypto from "node:crypto";

export const createUserService = async (name: string, surname: string, email: string, password: string, avatarPath: string | null) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return User.create({
    name,
    surname,
    email,
    password: hashedPassword,
    avatar: avatarPath,
  });
};

export const getUserService = async (email: string) => {
  return User.findOne({ where: { email } });
};

export const updateUserService = async (name: string, surname: string, avatarPath: string | null, user: any) => {
  if (user.avatar !== null && avatarPath === null) {
    return user.update({
      name,
      surname
    });
  }

  return user.update({
    name,
    surname,
    avatar: avatarPath,
  });
};

export const getUserProfileService = async (id: number) => {
  return User.findByPk(id, {
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["id", "title", "subtitle", "description", "category", "image", "createdAt"],
        separate: true,
        order: [["createdAt", "DESC"]]
      }
    ],
    attributes: { exclude: ["id", "password"] },
  });
};

export const resetUserPassService = async (token: string, newPassword: string) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { [Op.gt]: new Date() },
    },
  });

  if (!user) {
    throw new Error("User does not exist.");
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;

  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;

  await user.save();
};

export const changeUserPassService = async (newPassword: string, confirmNewPassword: string, user: any) => {
  if (newPassword !== confirmNewPassword) {
    throw new Error("Passwords don't match")
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.password = hashedPassword;
  await user.save();
};