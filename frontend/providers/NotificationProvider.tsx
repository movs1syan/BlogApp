"use client";

import React, {createContext, useState} from 'react';
import {createPortal} from "react-dom";
import { v4 as uuid } from "uuid";
import type { NotificationType } from "@/shared/types";

interface NotificationContextType {
  notify: (notification: Omit<NotificationType, "id">) => void;
}

export const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);

  const notify = (notification: Omit<NotificationType, "id">) => {
    const id = uuid();
    setNotifications((prev) => [...prev, {...notification, id}]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((notification) => notification.id !== id));
    }, 5000);
  };

  const remove = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return <NotificationContext.Provider value={{ notify }}>
    {notifications.length > 0 && createPortal (
      <div className="fixed top-25 right-4 flex flex-col gap-2 z-50">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`relative w-80 p-4 rounded-xl shadow-lg text-white animate-[slideInRight_0.4s_ease_forwards]
              ${notification.type === "success" ? "bg-green-500"
                : notification.type === "error" ? "bg-red-500" 
                : notification.type === "warning" ? "bg-yellow-500" 
                : "bg-blue-500"
              }
            `}
          >
            <div className="font-semibold">{notification.message}</div>
            {notification.description && <div className="text-sm opacity-90">{notification.description}</div>}
            <button
              onClick={() => remove(notification.id)}
              className="absolute top-2 right-4 text-white opacity-70 hover:opacity-100 cursor-pointer"
            >
              ✕
            </button>
          </div>
        ))}
      </div>,
      document.body
    )}
    { children }
  </NotificationContext.Provider>
};

export default NotificationProvider;