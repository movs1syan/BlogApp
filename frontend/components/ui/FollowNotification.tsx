"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import Image from "next/image";
import Button from "@/components/ui/Button";
import {apiFetch} from "@/lib/apiFetch";

interface IFollowNotification {
  id: number;
  name: string;
  surname: string;
  email: string;
  avatar: string;
}

const FollowNotification = ({ user } : { user: IFollowNotification }) => {
  const router = useRouter();

  const handleAccept = async (id: number) => {
    try {
      await apiFetch("POST", "users/follow/accept", undefined, { id });

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await apiFetch("POST", "users/follow/decline", undefined, { id });

      router.refresh();
    } catch (error) {
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
        <Button onClick={() => handleAccept(user.id)}>Accept</Button>
        <Button color={"red"} onClick={() => handleDecline(user.id)}>Decline</Button>
      </div>
    </div>
  );
};

export default FollowNotification;