"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Drawer from "@/components/ui/Drawer";
import {FC, useEffect, useState} from "react";
import { UserCog } from "lucide-react";
import { handleLogoutFn } from "@/lib/actions";
import type {UserType} from "@/shared/types";
import {useUser} from "@/hooks/useUser";

interface INavbar {
  user?: Omit<UserType, "password" | "confirmPassword">;
}

const Navbar: FC<INavbar> = ({ user }) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { setUser } = useUser();

  useEffect(() => {
    setUser(user as Omit<UserType, "password" | "confirmPassword"> | null);
  }, [setUser, user]);

  const handleLogout = async () => {
    await handleLogoutFn();
    setUser(null);
    setOpenDrawer(false);

    router.push("/login");
  };

  const fullAvatarUrl = `http://localhost:8000${user?.avatar}`;

  return (
    <>
      <nav className="sticky top-0 shadow-md w-full z-10 bg-white">
        <div className="flex justify-between px-10 py-5 items-center xl:max-w-320 max-w-[1024px] mx-auto">
          <Link href="/" className={`${pathname ? "text-blue-700" : ""}`}>Home</Link>
          <div className="flex gap-4">
            {user ? (
              <div className="flex items-center">
                <div className={"flex items-center gap-3 cursor-pointer"} onClick={() => setOpenDrawer(true)}>
                  {user.avatar && (
                    <Image src={fullAvatarUrl} alt={fullAvatarUrl} width={40} height={40} unoptimized className="size-10 rounded-full object-cover"/>
                  )}
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

      <Drawer open={openDrawer} onClose={() => setOpenDrawer(false)} title={"My Profile"}>
        <div className="flex flex-col justify-between h-full">
          {user && (
            <main>
              <div className={"flex flex-col justify-center items-center gap-3"}>
                {user.avatar && (
                  <Image src={fullAvatarUrl} alt={fullAvatarUrl} unoptimized width={40} height={40} className="size-10 rounded-full object-cover"/>
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
                    <span>My Profile</span>
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