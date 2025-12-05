"use client";

import React, {createContext, useEffect, useState} from 'react';
import type { UserType } from "@/shared/types";

interface UserContextType {
  user: Omit<UserType, "password" | "confirmPassword"> | null;
  setUser: (user: Omit<UserType, "password" | "confirmPassword"> | null) => void;
  userWithFollowers: {id: number; name: string; surname: string; email: string; avatar: string; followers: {id: number}[]; following: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[] } | null;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ userData, children }: { userData: {id: number; name: string; surname: string; email: string; avatar: string; followers: {id: number}[]; following: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[]} | null; children: React.ReactNode }) => {
  const [user, setUser] = useState<Omit<UserType, "password" | "confirmPassword"> | null>(null);
  const [userWithFollowers, setUserWithFollowers] = useState<{id: number; name: string; surname: string; email: string; avatar: string; followers: {id: number}[]; following: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[]} | null>(null);

  useEffect(() => {
    setUserWithFollowers(userData);
  }, [userData]);

  return (
    <UserContext.Provider value={{ user, setUser, userWithFollowers }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;