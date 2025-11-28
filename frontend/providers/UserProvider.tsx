"use client";

import React, { createContext, useState, useEffect } from 'react';
import type { UserType } from "@/shared/types";
import { apiFetch } from '@/lib/apiFetch';

interface UserContextType {
  user: Omit<UserType, "password" | "confirmPassword"> | null;
  setUser: (user: Omit<UserType, "password" | "confirmPassword"> | null) => void;
  loading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<UserType, "password" | "confirmPassword"> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
     setLoading(false);
     return;
    }

    (async () => {
      setLoading(true);
      const authorizedUser = await apiFetch("GET", "users/me");
      setLoading(false);

      setUser(authorizedUser);
    })();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;