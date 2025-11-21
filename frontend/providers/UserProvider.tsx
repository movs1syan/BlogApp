"use client";

import React, { createContext, useState, useEffect } from 'react';
import type { UserType } from "@/shared/types";
import { apiFetch } from '@/lib/apiFetch';

interface UserContextType {
  user: Omit<UserType, "password"> | null;
  setUser: (user: Omit<UserType, "password"> | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<UserType, "password"> | null>(null);

  useEffect(() => {
    (async () => {
      if (localStorage.getItem("token")) {
        const authorizedUser = await apiFetch("GET", "users/profile");
        setUser(authorizedUser);
      } else {
        setUser(null);
      }
    })();
  }, []);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;