import bcrypt from 'bcryptjs';
import { User, Post } from "../models/index.ts";

export const getUserService = async (email: string) => {
  return User.findOne({ where: { email } });
};

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

export const getUserProfileService = async (id: number) => {
  return User.findByPk(id, {
    include: [
      {
        model: Post,
        as: "posts",
        attributes: ["id", "title", "subtitle", "description", "category", "image", "createdAt"],
      }
    ],
    attributes: { exclude: ["id", "password"] }
  });
};