"use client";

import React, {Activity, useEffect, useState} from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@/components/pages/ClientUsers";
import Button from './ui/Button';
import {useUser} from "@/hooks/useUser";
import {apiFetch} from "@/lib/apiFetch";

const UserCard = ({ singleUser }: { singleUser: User }) => {
  const { pendingToAccept, pendingToBeAccepted, friends } = useUser();
  const [areFriends, setAreFriends] = useState(false);
  const [isWaitingToBeAccepted, setIsWaitingToBeAccepted] = useState(false);
  const [isWaitingToAccept, setIsWaitingToAccept] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!pendingToAccept || !pendingToBeAccepted || !friends) return;

    if (friends.find(person => person.id === singleUser.id)) {
      setAreFriends(true);
    } else {
      setAreFriends(false)
    }

    if (pendingToBeAccepted.find(person => person.id === singleUser.id)) {
      setIsWaitingToBeAccepted(true)
    } else {
      setIsWaitingToBeAccepted(false)
    }

    if (pendingToAccept.find(person => person.id === singleUser.id)) {
      setIsWaitingToAccept(true)
    } else {
      setIsWaitingToAccept(false)
    }
  }, [singleUser, pendingToBeAccepted, pendingToAccept, friends]);

  const handleAddToFriends = async () => {
    if (areFriends || isWaitingToBeAccepted) return;

    try {
      setLoading(true);
      await apiFetch("POST", `users/friend/request`, undefined, { id: singleUser.id });
      setLoading(false);
      setIsWaitingToBeAccepted(true);
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleAccept = async (id: number) => {
    try {
      await apiFetch("POST", "users/friend/accept", undefined, { id });
      setIsWaitingToAccept(false);
      setAreFriends(true);

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleDecline = async (id: number) => {
    try {
      await apiFetch("POST", "users/friend/decline", undefined, { id });
      setIsWaitingToAccept(false);

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUnfriend = async (id: number) => {
    try {
      await apiFetch("DELETE", "users/unfriend", undefined, { id });
      setAreFriends(false);

      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };

  const fullAvatarURL = `http://localhost:8000${singleUser?.avatar}`;

  return singleUser && (
    <div className={"flex justify-between shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] px-7 py-5 rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] transition-shadow duration-200"}>
      <div className="flex items-center gap-6">
        {singleUser.avatar ? (
          <Image src={fullAvatarURL} alt={fullAvatarURL} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
        ) : (
          <Image src={"/profile-picture.png"} alt={"avatar"} width={40} height={40} className="size-10 rounded-full object-cover z-10"/>
        )}
        <div className={"flex flex-col justify-between text-gray-500"}>
          <span>{singleUser.name} {singleUser.surname}</span>
          <span className={"mt-[2px]"}>{singleUser.email}</span>
        </div>
      </div>

      <div className={"flex gap-3"}>
        <Activity mode={singleUser ? "visible" : "hidden"}>
          {!isWaitingToAccept ? (
            <>
              <Button
                type={"link"}
                icon={!areFriends && !isWaitingToBeAccepted ? "UserPlus" : "UserCheck"}
                onClick={handleAddToFriends}
                loading={loading}
              >
                {!areFriends && !isWaitingToBeAccepted ? "Add to friends" : !areFriends && isWaitingToBeAccepted ? "Request sent" : areFriends && "Friends"}
              </Button>

              {areFriends && (
                <Button type={"link"} color={"red"} icon={"UserMinusIcon"} onClick={() => handleUnfriend(singleUser.id)}>Remove friend</Button>
              )}
            </>
          ) : (
            <div className={"flex gap-3"}>
              <Button onClick={() => handleAccept(singleUser.id)}>Accept</Button>
              <Button color={"red"} onClick={() => handleDecline(singleUser.id)}>Decline</Button>
            </div>
          )}
        </Activity>
      </div>
    </div>
  );
};

export default UserCard;