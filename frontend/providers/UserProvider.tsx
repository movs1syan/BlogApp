"use client";

import React, {createContext, useEffect, useState} from 'react';
import type { UserType } from "@/shared/types";

interface UserContextType {
  userWithFriends: {
    id: number;
    name: string;
    surname: string;
    email: string;
    avatar: string;
    friends: Omit<UserType, "password" | "confirmPassword">[];
    pendingToBeAccepted: Omit<UserType, "password" | "confirmPassword">[];
    pendingToAccept: Omit<UserType, "password" | "confirmPassword">[];
    notifications: { id: number; message: string; isRead: boolean }[],
  } | null;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ userData, children }: { userData: {id: number; name: string; surname: string; email: string; avatar: string; friends: Omit<UserType, "password" | "confirmPassword">[]; pendingToBeAccepted: Omit<UserType, "password" | "confirmPassword">[]; pendingToAccept: Omit<UserType, "password" | "confirmPassword">[]; notifications: { id: number; message: string; isRead: boolean }[]} | null; children: React.ReactNode }) => {
  const [userWithFriends, setUserWithFollowers] = useState<{id: number; name: string; surname: string; email: string; avatar: string; friends: Omit<UserType, "password" | "confirmPassword">[]; pendingToBeAccepted: Omit<UserType, "password" | "confirmPassword">[]; pendingToAccept: Omit<UserType, "password" | "confirmPassword">[]; notifications: { id: number; message: string; isRead: boolean }[]} | null>(null);

  useEffect(() => {
    setUserWithFollowers(userData);
  }, [userData]);

  return (
    <UserContext.Provider value={{ userWithFriends }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;