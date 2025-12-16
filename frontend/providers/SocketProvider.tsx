"use client";

import React, {createContext, useEffect, useState, useRef} from "react";
import io, { Socket } from "socket.io-client";
import { getToken } from "@/lib/cookies";

interface Props {
  user: {
    id: number;
  } | null;
  children: React.ReactNode;
}
interface SocketContext {
  socket: Socket | null
}

export const SocketContext = createContext<SocketContext | null>(null);

export const SocketProvider = ({ user, children }: Props) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user || socketRef.current) return;

    (async () => {
      const token = await getToken();
      if (!token) return;

      const newSocket = io("http://localhost:8000", { auth: { token } });

      socketRef.current = newSocket;
      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
      });

      newSocket.on("disconnect", () => {
        console.log("Socket disconnected:", newSocket.id);
      });

      return () => {
        socketRef.current?.disconnect();
        socketRef.current = null;
      }
    })()
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};