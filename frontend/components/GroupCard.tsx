"use client";

import React from 'react';
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { IGroup } from "@/shared/types"
import Activity from "react";
import { useUser } from "@/hooks/useUser"

const GroupCard = ({ group }: { group: IGroup }) => {
  const { user } = useUser();

  console.log(group.adminId === user.id)
  return (
    <article key={group.id} className="rounded-xl p-6 shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15),_0_-4px_12px_rgba(0,0,0,0.10)] flex flex-col justify-between gap-7 transition-shadow duration-200 md:max-w-90">
      <h1 className={"text-center font-semibold text-2xl"}>{group.name}</h1>
      <div className={"flex flex-col gap-4"}>
        {group.users.map(user => (
          <div key={user.id} className={"flex items-center gap-6"}>
            {user.avatar ? (
              <Image src={`http://localhost:8000${user.avatar}`} alt={user.avatar} width={40} height={40} unoptimized className={"size-10 rounded-full object-cover"} />
            ) : (
              <Image src={`/profile-picture.png`} alt={"avatar"} width={40} height={40} className={"size-10 rounded-full object-cover"} />
            )}
            <span className={"text-gray-500"}>{user.name} {user.surname}</span>
          </div>
        ))}
      </div>
      <div className={"mx-auto"}>
        <Button type={"link"} icon={"MessageCircleMore"}>Open Chat</Button>
      </div>
    </article>
  );
};

export default GroupCard;