import bcrypt from 'bcryptjs';
import { User } from "../models/User.ts";

export const getUserService = async (email: string) => {
  return User.findOne({ where: { email } });
};

export const createUserService = async (name: string, surname: string, email: string, password: string) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return User.create({
    name,
    surname,
    email,
    password: hashedPassword,
  });
};