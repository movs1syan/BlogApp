"use client";

import React, { useState, useRef } from 'react';
import { useRouter } from "next/navigation";
import type { UserType} from "@/shared/types";
import { useUser } from "@/hooks/useUser";
import {SearchIcon} from "lucide-react";
import UserCard from "@/components/UserCard";

const ClientUsers = ({ totalUsersQuantity, users }: { totalUsersQuantity: number; users: Omit<UserType, "password" | "confirmPassword">[] }) => {
  const { userWithFollowers } = useUser();
  const [filteredUsers, setFilteredUsers] = useState<Omit<UserType, "password" | "confirmPassword">[]>(users.filter(user => user.id !== userWithFollowers?.id));
  console.log(filteredUsers, userWithFollowers?.id);
  const [loading, setLoading] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

  };

  return (
    <main>
      <div className={"relative mx-auto w-100 max-w-100"}>
        <input
          ref={inputRef}
          onChange={handleSearchChange}
          className={"border-2 border-gray-200 rounded-lg pl-11 pr-4 py-2 focus:outline-blue-700 w-full"}
          placeholder={"Search for users . . ."}
        />
        <SearchIcon size={20} className={"absolute top-1/2 left-4 -translate-y-1/2 text-gray-400"} />
      </div>

      {filteredUsers.length > 0 ? (
        <div className={"flex flex-col gap-8 mt-15"}>
          {filteredUsers.map((user: Omit<UserType, "password" | "confirmPassword">) => (
            <UserCard key={user.id} user={user}/>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No posts found.</p>
      )}
    </main>
  );
};

export default ClientUsers;