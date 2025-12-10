"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Drawer from "@/components/ui/Drawer";
import React, {FC, useState, useEffect} from "react";
import {Bell, UserCog, BookUser, Users, Check, X, BellOff} from "lucide-react";
import { handleLogoutFn } from "@/lib/actions";
import type {UserType} from "@/shared/types";
import { apiFetch } from "@/lib/apiFetch";
import NotificationsPortal from "@/components/NotificationsPortal";

interface INavbar {
  user?: {
    id: number;
    name: string;
    surname: string;
    email: string;
    avatar: string;
    friends: Omit<UserType, "password" | "confirmPassword">[];
    pendingToBeAccepted: Omit<UserType, "password" | "confirmPassword">[];
    pendingToAccept: Omit<UserType, "password" | "confirmPassword">[];
    notifications: { id: number; message: string; isRead: boolean }[],
  }
}

const Navbar: FC<INavbar> = ({ user }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  const [notifications, setNotifications] = useState<{ id: number; message: string; isRead: boolean }[] | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      setNotifications(user.notifications);
    }
  }, [user]);

  const handleLogout = async () => {
    await handleLogoutFn();
    setOpenDrawer(false);

    router.push("/login");
  };

  const handleNotify = async () => {
    setOpenNotifications(!openNotifications);

    if (!notifications) return;

    const notificationsId = notifications.map(not => {
      return not.id;
    });

    if (notifications.find(not => !not.isRead)) {
      await apiFetch("PUT", "users/read-notification", undefined, { notificationsId });

      router.refresh();
    }
  };

  const fullAvatarUrl = `http://localhost:8000${user?.avatar}`;

  return (
    <>
      <nav className="sticky top-0 shadow-md w-full z-20 bg-white">
        <div className="flex justify-between px-10 py-5 items-center xl:max-w-320 max-w-[1024px] mx-auto">
          <div className={"flex gap-10"}>
            <Link href="/" className={`${pathname === "/" ? "text-blue-700" : ""} font-bold hover:text-blue-700 transition-colors duration-300`}>Home</Link>
            {user && <Link href={"/contacts"} className={`${pathname === "/contacts" ? "text-blue-700" : ""} font-bold hover:text-blue-700 transition-colors duration-300`}>Contacts</Link>}
          </div>
          <div className="flex gap-4">
            {user ? (
              <div className="flex gap-5 items-center">
                <div className={"relative cursor-pointer active:text-gray-500"} onClick={handleNotify}>
                  <Bell size={25} />
                  {user.notifications.length > 0 && user.notifications.find(message => !message.isRead) && (
                    <div className={"w-2 h-2 rounded-full bg-red-600 absolute top-[-2px] left-4 z-20"}></div>
                  )}
                </div>
                <div className={"flex items-center gap-3 cursor-pointer"} onClick={() => setOpenDrawer(true)}>
                  <div className={"relative"}>
                    {user.pendingToAccept.length > 0 && (
                      <div className={"px-2 w-fit rounded-full bg-red-600 flex justify-center items-center text-white absolute top-[-8px] left-6 z-20"}>
                        {user.pendingToAccept.length}
                      </div>
                    )}

                    {user.avatar ? (
                      <Image src={fullAvatarUrl} alt={fullAvatarUrl} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
                    ) : (
                      <Image src={"/profile-picture.png"} alt={"Avatar"} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
                    )}
                  </div>
                  <div className={"flex flex-col justify-between text-gray-500 text-sm"}>
                    <span>{user.name} {user.surname}</span>
                    <span className={"mt-[2px]"}>{user.email}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Link href={"/login"}>
                  <Button>Sign in</Button>
                </Link>
                <Link href={"/register"}>
                  <Button type="primary">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {openNotifications && (
        <div className="fixed top-[82px] left-0 bottom-0 right-0 z-10">
          <div
            className="absolute inset-0 bg-black/10"
            onClick={() => setOpenNotifications(false)}
          />
          <NotificationsPortal>
            <div className="absolute bg-white text-black shadow-lg rounded-lg min-w-[350px] p-4 z-10 top-2 right-0 animate-[slideInTopNot_0.3s_ease_forwards]">
              <div className="flex items-center justify-between border-b pb-3 border-[#e0e0e0]">
                <h3 className="text-lg font-semibold">Notifications</h3>
                <button
                  onClick={() => setOpenNotifications(false)}
                  className="font-bold text-gray-500 px-1.5 hover:text-black hover:bg-gray-300 transition cursor-pointer"
                >
                  ✕
                </button>
              </div>
              <div className={"mt-2 flex flex-col gap-2"}>
                {notifications && notifications.length > 0 ? notifications.map((notif) => (
                  <div key={notif.id} className={`py-2 rounded-lg font-semibold flex items-center gap-3 ${notif.message.endsWith("!") ? "text-green-700" : "text-red-700"}`}>
                    {notif.message.endsWith("!") ? (
                      <Check size={20} />
                    ) : (
                      <X size={20} />
                    )}
                    {notif.message}
                  </div>
                )) : (
                  <div className="flex flex-col items-center justify-center text-center text-gray-600">
                    <BellOff size={25} className="mb-1 opacity-70 mt-2" />
                    <h2 className="font-semibold mt-2">Notifications are empty!</h2>
                  </div>
                )}
              </div>
            </div>
          </NotificationsPortal>
        </div>
      )}

      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} title={"My Profile"}>
        <div className="flex flex-col justify-between h-full">
          {user && (
            <main>
              <div className={"flex flex-col justify-center items-center gap-3"}>
                {user.avatar ? (
                  <Image src={fullAvatarUrl} alt={fullAvatarUrl} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
                ) : (
                  <Image src={"/profile-picture.png"} alt={"Avatar"} width={40} height={40} unoptimized className="size-10 rounded-full object-cover z-10"/>
                )}
                <div className={"flex flex-col justify-between"}>
                  <span className={"text-xl text-center"}>{user.name} {user.surname}</span>
                  <span className={"text-gray-500"}>{user.email}</span>
                </div>
              </div>
              <div className={"mt-5"}>
                <Link href={`/profile`} onClick={() => setOpenDrawer(false)}>
                  <div className={"flex items-center gap-3 text-blue-700 hover:bg-blue-100 active:bg-blue-200 duration-300 cursor-pointer px-3 py-2 rounded-lg"}>
                    <UserCog size={25} />
                    <span>Profile</span>
                  </div>
                </Link>
                <Link href={'/requests'} onClick={() => setOpenDrawer(false)}>
                  <div className={"flex items-center gap-3 text-blue-700 hover:bg-blue-100 active:bg-blue-200 duration-300 cursor-pointer px-3 py-2 rounded-lg"}>
                    <Users size={25} />
                    <span>Requests</span>
                    {user?.pendingToAccept.length > 0 && <div className={"px-2 w-fit rounded-full bg-blue-700 flex justify-center items-center text-white z-20"}>{user?.pendingToAccept.length}</div>}
                  </div>
                </Link>
                <Link href={'/friends'} onClick={() => setOpenDrawer(false)}>
                  <div className={"flex items-center gap-3 text-blue-700 hover:bg-blue-100 active:bg-blue-200 duration-300 cursor-pointer px-3 py-2 rounded-lg"}>
                    <BookUser size={25} />
                    <span>Friends</span>
                  </div>
                </Link>
              </div>
            </main>
          )}
          <div className={"border-t border-[#e0e0e0] py-2"}>
            <Button icon={"LogOut"} type={"link"} onClick={handleLogout}>Log Out</Button>
          </div>
        </div>
      </Drawer>
    </>
  );
};

export default Navbar;