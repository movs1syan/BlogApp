import "socket.io";
import { UserInstance } from "../models/User";

declare module "socket.io" {
  interface Socket {
    user?: UserInstance;
  }
}