"use client";

import { useContext } from "react";
import { SocketContext } from "@/providers/SocketProvider";

export const useSocket = () => {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error("useSocket must be used in SocketProvider.");
  }

  return socket;
};