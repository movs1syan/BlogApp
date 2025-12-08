"use client";

import React, {createContext, useEffect, useState} from 'react';

interface UserContextType {
  userWithFriends: {id: number; name: string; surname: string; email: string; avatar: string; friends: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[] } | null;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ userData, children }: { userData: {id: number; name: string; surname: string; email: string; avatar: string; friends: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[]} | null; children: React.ReactNode }) => {
  const [userWithFriends, setUserWithFollowers] = useState<{id: number; name: string; surname: string; email: string; avatar: string; friends: {id: number}[]; pendingToBeAccepted: {id: number}[]; pendingToAccept: {id: number}[]} | null>(null);

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