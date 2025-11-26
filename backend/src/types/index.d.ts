import { UserInstance } from "../models/User.ts"

declare global {
  namespace Express {
    interface Request {
      user: UserInstance;
    }
  }
}

export interface PostCreationType {
  title: string;
  subtitle: string;
  category: string;
  description: string;
  imagePath: string | null;
  userId: number;
}

export interface UserType {
  id: number;
  name: string;
  surname: string;
  email: string;
  password: string;
  avatar: string | null;
}