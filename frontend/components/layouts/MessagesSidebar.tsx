"use client";

import React from 'react';
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import Image from "next/image";
import {IGroup} from "@/shared/types";

const MessagesSidebar = ({ groups }: { groups: IGroup[] }) => {
  const router = useRouter();
  const { id } = useParams();
  const { friends } = useUser();

  return (
    <aside className={"overflow-y-auto rounded-l-xl h-full w-80 min-w-80 p-4 flex flex-col gap-3 bg-[#f9f9f9]"}>
      {friends?.map(friend => {
        const fullAvatarUrl = `http://localhost:8000${friend.avatar}`;

        return (
          <div
            key={friend.id}
            className={`${Number(id) === friend.id ? "bg-blue-300" : "bg-blue-100"} cursor-pointer p-4 rounded-xl hover:bg-blue-300 transition-colors duration-200`}
            onClick={() => router.push(`/messages/friends/${friend.id}`)}
          >
            <div className={"flex items-center gap-4"}>
              <Image src={friend.avatar ? fullAvatarUrl : '/profile-picture.png'} alt={"avatar"} unoptimized height={40} width={40} className={"size-10 object-cover rounded-full"} />
              <span className={`${Number(id) === friend.id ? "text-white" : ""} text-blue-700 font-semibold`}>{friend.name} {friend.surname}</span>
            </div>
          </div>
        )}
      )}

      {groups.map(group => (
        <div
          key={group.id}
          className={`${Number(id) === group.id ? "bg-blue-300" : "bg-blue-100"} cursor-pointer p-4 rounded-xl hover:bg-blue-300 transition-colors duration-200`}
          onClick={() => router.push(`/messages/groups/${group.id}`)}
        >
          <div className={"flex gap-3"}>
            {group.users.map(user => (
              <Image key={user.id} src={user.avatar ? `http://localhost:8000${user.avatar}` : '/profile-picture.png'} alt={"avatar"} unoptimized height={40} width={40} className={"size-10 object-cover rounded-full"} />
            ))}
          </div>
          <span className={`${Number(id) === group.id ? "text-white" : ""} text-blue-700 font-semibold`}>{group.name}</span>
        </div>
      ))}
    </aside>
  );
};

export default MessagesSidebar;