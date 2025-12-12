"use client";

import React, {useState, useRef, Activity, useEffect} from 'react';
import { useRouter } from "next/navigation";
import {SearchIcon} from "lucide-react";
import UserCard from "@/components/UserCard";
import Button from "@/components/ui/Button";

export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
  createdAt: Date;
}

const ClientUsers = ({ totalUsersQuantity, users, page }: { totalUsersQuantity: number; users: User[], page: number }) => {
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const router = useRouter();

  const handleSearchChange = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      if (inputRef.current) {
        const query = inputRef.current.value.toLowerCase();

        const params = new URLSearchParams(window.location.search);
        if (query) {
          params.set("userSearch", query);
          params.set("page", "1");
        } else {
          params.delete("userSearch");
        }

        router.replace(`/contacts/?${params.toString()}`, { scroll: false });
      }
    }, 1000);
  };

  const goToPage = async (newPage: number) => {
    router.push(`/contacts/?page=${newPage}`);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

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
          {filteredUsers.map((user: User) => (
            <UserCard key={user.id} singleUser={user} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-6">No users found.</p>
      )}

      <div className="flex justify-center items-center gap-2 mt-6">
        <Activity mode={page > 1 ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowLeft"} onClick={() => goToPage(page - 1)}>Prev</Button>
        </Activity>
        <Activity mode={page > 1 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(1)}>1</Button>
        </Activity>
        <Activity mode={page > 2 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(2)}>2</Button>
        </Activity>
        <Activity mode={page > 3 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(3)}>3</Button>
        </Activity>
        <Activity mode={page > 4 ? "visible" : "hidden"}>
          <span className={"font-bold"}>. . .</span>
        </Activity>
        <span className={"font-bold"}>{page}</span>
        <Activity mode={totalUsersQuantity - (page * 6) > 0 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 1)}>{page + 1}</Button>
        </Activity>
        <Activity mode={totalUsersQuantity - (page * 6) > 6 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 2)}>{page + 2}</Button>
        </Activity>
        <Activity mode={totalUsersQuantity - (page * 6) > 12 ? "visible" : "hidden"}>
          <Button type={"link"} onClick={() => goToPage(page + 3)}>{page + 3}</Button>
        </Activity>
        <Activity mode={page * 6 < totalUsersQuantity ? "visible" : "hidden"}>
          <Button type={"link"} icon={"ArrowRight"} iconPosition={"end"} onClick={() => goToPage(page + 1)}>Next</Button>
        </Activity>
      </div>
    </main>
  );
};

export default ClientUsers;