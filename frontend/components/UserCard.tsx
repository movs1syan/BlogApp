"use client";

import React, {Activity, useEffect, useState, useRef} from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { User } from "@/components/pages/ClientUsers";
import Button from './ui/Button';
import { useUser } from "@/hooks/useUser";
import { apiFetch } from "@/lib/apiFetch";
import Modal from "@/components/ui/Modal";
import {useSocket} from "@/hooks/useSocket";

const UserCard = ({ singleUser }: { singleUser: User }) => {
  const { user, pendingToAccept, pendingToBeAccepted, friends } = useUser();
  const [messages, setMessages] = useState<any[]>([]);
  const [areFriends, setAreFriends] = useState(false);
  const [isWaitingToBeAccepted, setIsWaitingToBeAccepted] = useState(false);
  const [isWaitingToAccept, setIsWaitingToAccept] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { socket } = useSocket();

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

    return () => {
      socket.off("oldMessages", handleOldMessages);
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, messages]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages]);

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (inputRef.current) {
        if (inputRef.current.value !== "") {
          socket?.emit("sendMessage", {
            receiverId: singleUser.id,
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
    if (inputRef.current) inputRef.current.value = e.target.value;
  };

  const handleClickMessages = () => {
    setIsChatOpen(true);
    setMessages([]);

    if (!socket) return;

    socket.emit("joinRoom", { friendId: singleUser.id });
    socket.emit("getMessages", { friendId: singleUser.id });
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
              {areFriends && (
                <>
                  <Button type={"link"} icon={"MessageCircleMore"} onClick={handleClickMessages}>Message</Button>

                  <div className={"h-10 w-[1px] border border-gray-200 my-auto"}></div>
                </>
              )}

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

      {areFriends && (
        <Modal title={"Friend Chat"} isOpen={isChatOpen} onClose={() => setIsChatOpen(false)}>
          <main className={"flex flex-col gap-3"}>
            <div className={"h-120 w-200 max-w-200 bg-blue-100 rounded-lg overflow-y-auto p-4 flex flex-col gap-3"} ref={containerRef}>
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
      )}
    </div>
  );
};

export default UserCard;