"use client";

import React, { createContext, useState } from 'react';
import type { UserType } from "@/shared/types";

interface UserContextType {
  user: Omit<UserType, "password" | "confirmPassword"> | null;
  setUser: (user: Omit<UserType, "password" | "confirmPassword"> | null) => void;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<UserType, "password" | "confirmPassword"> | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;