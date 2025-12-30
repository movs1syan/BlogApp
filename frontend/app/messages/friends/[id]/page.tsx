"use client";

import React, {useRef} from 'react';
import { useState, useEffect } from "react";
import { useUser } from "@/hooks/useUser";
import { useParams } from "next/navigation";
import {useSocket} from "@/hooks/useSocket";
import Image from "next/image";
import Button from "@/components/ui/Button";

const ChatPage =  () => {
  const [messages, setMessages] = useState<any[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { id } = useParams();
  const { socket } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    setMessages([]);

    if (!socket) return;

    socket.emit("joinRoom", { friendId: id });
    socket.emit("getMessages", { friendId: id });
  }, [id, socket]);

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

    socket.on("oldMessages", handleOldMessages);
    socket.on("receiveMessage", handleReceiveMessage);

    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    return () => {
      socket.off("oldMessages", handleOldMessages);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, messages]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (inputRef.current) {
        if (inputRef.current.value !== "") {
          socket?.emit("sendMessage", {
            receiverId: id,
            message: inputRef.current.value,
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
          <div key={msg.id} className={`flex ${msg.sender.id === user?.id ? "justify-end" : "justify-start"} gap-3`}>
            {msg.sender.id !== user?.id && msg.sender.avatar ? (
              <Image src={`http://localhost:8000${msg.sender.avatar}`} alt={msg.sender.name} height={40} width={40} unoptimized className={"size-10 rounded-full object-cover"} />
            ) : msg.sender.id !== user?.id && (
              <Image src={"/profile-picture.png"} alt={"Avatar"} width={40} height={40} unoptimized className="size-10 rounded-full object-cover"/>
            )}
            <div className={`py-1.5 px-3 rounded-lg  text-white h-fit max-w-[300px] break-words ${msg.sender.id === user?.id ? "rounded-tr-none bg-blue-700" : "rounded-tl-none bg-blue-400"}`}>
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