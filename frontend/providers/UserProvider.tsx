"use client";

import React, {createContext} from 'react';

interface SingleUser {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  createdAt: Date,
}

interface UserContextType {
  user: SingleUser | null;
  friends: SingleUser[] | null,
  pendingToBeAccepted: SingleUser[] | null,
  pendingToAccept: SingleUser[] | null,
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({
  user,
  friends,
  pendingToBeAccepted,
  pendingToAccept,
  children
}: {
  user: SingleUser | null,
  friends: SingleUser[] | null,
  pendingToBeAccepted: SingleUser[] | null,
  pendingToAccept: SingleUser[] | null,
  children: React.ReactNode
}) => {
  return (
    <UserContext.Provider value={{ user, friends, pendingToBeAccepted, pendingToAccept }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;