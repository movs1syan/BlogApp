"use client";

import React, {createContext, useEffect, useState} from "react";
import io, { Socket } from "socket.io-client";
import { getToken } from "@/lib/cookies";

interface Props {
  user: { id: number } | null;
  children: React.ReactNode;
}
interface SocketContext {
  socket: Socket | null
}

export const SocketContext = createContext<SocketContext | null>(null);

export const SocketProvider = ({ user, children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user) return;

    (async () => {
      const token = await getToken();
      if (!token) return;

      const newSocket = io("http://localhost:8000", { auth: { token } });
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected:", newSocket.id);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      }
    })()
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};