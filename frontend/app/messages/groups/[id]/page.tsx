"use client";

import React, {useRef} from 'react';
import { apiFetch } from "@/lib/apiFetch";
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import {useSocket} from "@/hooks/useSocket";
import Image from "next/image";
import Button from "@/components/ui/Button";

const ChatPage = () => {
  const [friendsIds, setFriendsIds] = useState<number[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const { socket } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    (async () => {
      const groupFriends = await apiFetch("POST", "users/group/get-friends", undefined, { groupId: id });

      const ids = groupFriends.map(friend => {
        return friend.userId
      });

      setFriendsIds(ids);
    })()
  }, [id]);

  useEffect(() => {
    setMessages([]);

    if (!socket) return;

    socket.emit("joinGroupRoom", { friendsIds });
    socket.emit("getGroupMessages", { friendsIds, groupId: id });
  }, [friendsIds, id, socket]);

  useEffect(() => {
    if (!socket) return;

    const handleOldMessages = (msgs: any) => {
      setMessages(msgs);
    };

    const handleReceiveMessage = (msg: any) => {
      setMessages((prev) => {
        if (prev.some(message => message.id === msg.id)) return prev;
        return [...prev, msg];
      });
    };

    socket.on("oldGroupMessages", handleOldMessages);
    socket.on("receiveGroupMessage", handleReceiveMessage);

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    return () => {
      socket.off("oldGroupMessages", handleOldMessages);
      socket.off("receiveGroupMessage", handleReceiveMessage);
    };
  }, [socket, messages]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!socket) return;

    try {
      if (inputRef.current) {
        if (inputRef.current.value !== "") {
          socket.emit("sendGroupMessage", {
            friendsIds,
            message: inputRef.current.value,
            groupId: id
          });
        }

        inputRef.current.value = "";
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputRef.current) {
      inputRef.current.value = e.target.value;
    }
  };

  return (
    <main className={"flex flex-col h-full"}>
      <div className={"flex-1 overflow-y-auto p-4 flex flex-col gap-3 bg-blue-100 rounded-tr-xl"} ref={containerRef}>
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
      <form onSubmit={handleSubmit} className={"flex p-4 gap-4"}>
        <input
          className={"border-2 border-gray-200 rounded-lg py-2 px-4 focus:outline-none focus:border-blue-700 w-full flex flex-1"}
          placeholder={"Type message . . ."}
          ref={inputRef}
          onChange={handleChange}
        />
        <Button htmlType={"submit"} type={"primary"} icon={"Send"}></Button>
      </form>
    </main>
  );
};

export default ChatPage;