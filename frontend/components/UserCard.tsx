"use client";

import React, {Activity, useEffect, useState} from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getDate } from "@/helpers/getDate";
import type { UserType } from "@/shared/types";
import Button from './ui/Button';
import {useUser} from "@/hooks/useUser";
import {apiFetch} from "@/lib/apiFetch";

const UserCard = ({ user }: { user: Omit<UserType, "password" | "confirmPassword"> }) => {
  const { userWithFollowers } = useUser();
  const [areFriends, setAreFriends] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userWithFollowers) return;

    userWithFollowers.following.forEach(person => {
      if (person.id !== user.id) {
        setAreFriends(false);
      } else {
        setAreFriends(true);
      }
    });

    userWithFollowers.pendingToBeAccepted.forEach(person => {
      if (person.id === user.id) {
        setIsWaiting(true);
      } else {
        setIsWaiting(false);
      }
    });
  }, [userWithFollowers, user]);

  const handleAddToFriends = async () => {
    if (areFriends) return;
    if (isWaiting) return;

    try {
      setLoading(true);
      await apiFetch("POST", `users/follow/request`, undefined, { id: user.id });
      setLoading(false);
      setIsWaiting(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fullAvatarURL = `http://localhost:8000${user.avatar}`;

  return (
    <div className={"flex justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-7 py-5 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
      <div className="flex items-center gap-6">
        {user.avatar ? (
          <Image src={fullAvatarURL} alt={fullAvatarURL} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
        ) : (
          <Image src={"/profile-picture.png"} alt={"avatar"} width={40} height={40} className="size-10 rounded-full object-cover z-10"/>
        )}
        <div className={"flex flex-col justify-between text-gray-500"}>
          <span>{user.name} {user.surname}</span>
          <span className={"mt-[2px]"}>{user.email}</span>
        </div>
      </div>

      <div className={"flex gap-3"}>
        <Activity mode={user ? "visible" : "hidden"}>
          <Button
            type={"link"}
            icon={!areFriends && !isWaiting ? "UserPlus" : "UserCheck"}
            onClick={handleAddToFriends}
            loading={loading}
          >
            {!areFriends && !isWaiting ? "Add to friends" : !areFriends && isWaiting ? "Request sent" : areFriends && "Friends"}
          </Button>
        </Activity>
      </div>
    </div>
  );
};

export default UserCard;