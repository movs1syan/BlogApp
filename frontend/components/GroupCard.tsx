"use client";

import React, {useState, useRef, useEffect, memo} from 'react';
import Image from "next/image";
import Button from "@/components/ui/Button";
import type { IGroup } from "@/shared/types"
import { Activity } from "react";
import { useUser } from "@/hooks/useUser";
import { useSocket } from "@/hooks/useSocket";
import {apiFetch} from "@/lib/apiFetch";
import { useRouter } from "next/navigation";
import Modal from "@/components/ui/Modal";

const GroupCard = ({ group }: { group: IGroup }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [friendsIds, setFriendsIds] = useState<number[]>([]);
  const [isDeleteGroupModalOpen, setIsDeleteGroupModalOpen] = useState(false);
  const [isGroupChatOpen, setIsGroupChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const { socket } = useSocket();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!socket) return;

    const onLoad = (msgs: any) => {
      setMessages(msgs);
    };

    const onReceive = (msg: any) => {
      setMessages(prev => {
        if (prev.some(message => message.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("oldGroupMessages", onLoad);
    socket.on("receiveGroupMessage", onReceive);

    return () => {
      socket.off("oldGroupMessages", onLoad);
      socket.off("receiveGroupMessage", onReceive);
    };
  }, [socket, messages]);

  useEffect(() => {
    const ids = group.users.map(user => {
      return user.id;
    });

    setFriendsIds(ids);
  }, [group]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) return;

    try {
      if (inputRef.current) {
        if (inputRef.current.value !== "") {
          socket.emit("sendGroupMessage", {
            friendsIds,
            message: inputRef.current.value,
            groupId: group.id
          });
        }

        inputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current) inputRef.current.value = e.target.value;
  };

  const handleClickMessages = () => {
    setIsGroupChatOpen(true);
    setMessages([]);

    if (!socket) return;

    socket.emit("joinGroupRoom", { friendsIds });
    socket.emit("getGroupMessages", { friendsIds, groupId: group.id });
  };

  const onDelete = async (groupId: number) => {
    setLoading(true);
    await apiFetch("DELETE", "users/group/delete", undefined, { groupId });
    setLoading(false);

    router.refresh();
  };

  return (
    <>
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
          <Button type={"link"} icon={"MessageCircleMore"} onClick={handleClickMessages}>Open Chat</Button>
        </div>
        <Activity mode={group.adminId === user?.id ? "visible": "hidden"}>
          <div className={"ml-auto"}>
            <Button type={"link"} color={"red"} icon={"Trash2"} onClick={() => setIsDeleteGroupModalOpen(true)}>Delete Group</Button>
          </div>
        </Activity>
      </article>

      <Modal title={"Delete Group"} isOpen={isDeleteGroupModalOpen} onClose={() => setIsDeleteGroupModalOpen(false)}>
        <div className="flex flex-col gap-5">
          <p>Are you sure you want to delete group &quot;{group.name}&quot; ?</p>
          <div className="flex gap-5 justify-end">
            <Button onClick={() => setIsDeleteGroupModalOpen(false)}>Cancel</Button>
            <Button type="primary" color="red" onClick={() => onDelete(group.id)} loading={loading}>Delete</Button>
          </div>
        </div>
      </Modal>

      <Modal title={"Group Chat"} isOpen={isGroupChatOpen} onClose={() => setIsGroupChatOpen(false)}>
        <main className={"flex flex-col gap-3"}>
          <div className={"h-120 w-200 max-w-200 bg-blue-100 rounded-lg overflow-y-auto p-4 flex flex-col gap-3"} ref={containerRef}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex ${msg.messageSender.id === user?.id ? "justify-end" : "justify-start"} gap-3`}>
                {msg.messageSender.id !== user?.id && msg.messageSender.avatar ? (
                  <Image src={`http://localhost:8000${msg.messageSender.avatar}`} alt={msg.messageSender.name} height={40} width={40} unoptimized className={"size-10 rounded-full object-cover"} />
                ) : msg.messageSender.id !== user?.id && (
                  <Image src={"/profile-picture.png"} alt={"Avatar"} width={40} height={40} unoptimized className="size-10 rounded-full object-cover"/>
                )}
                <div className={`py-1.5 px-3 rounded-lg  text-white h-fit max-w-[300px] break-words ${msg.messageSender.id === user?.id ? "rounded-tr-none bg-blue-700" : "rounded-tl-none bg-blue-400"}`}>
                  {msg.message}
                </div>
              </div>
            ))}
          </div>
          <form onSubmit={handleSubmit} className={"flex gap-4"}>
            <input
              className={"border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-700 w-full flex flex-1"}
              placeholder={"Type message . . ."}
              ref={inputRef}
              onChange={handleChange}
            />
            <Button htmlType={"submit"} type={"primary"} icon={"Send"}></Button>
          </form>
        </main>
      </Modal>
    </>
  );
};

export default memo(GroupCard);