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
  image: string | null;
  userId: number;
}