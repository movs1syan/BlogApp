"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {useUser} from "@/hooks/useUser";
import Drawer from "@/components/ui/Drawer";
import {useState} from "react";
import { Folder } from "lucide-react";

const Navbar = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setOpenDrawer(false);
    setUser(null);
  };

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
                    <Image src={user.avatar} alt={user.avatar} width={40} height={40} className="size-10 rounded-full object-cover"/>
                  )}
                  <div className={"flex flex-col justify-between text-gray-500 text-sm"}>
                    <span>{user.name} {user.surname}</span>
                    <span>{user.email}</span>
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
                  <Image src={user.avatar} alt={user.avatar} width={40} height={40} className="size-10 rounded-full object-cover"/>
                )}
                <div className={"flex flex-col justify-between"}>
                  <span className={"text-xl"}>{user.name} {user.surname}</span>
                  <span className={"text-gray-500"}>{user.email}</span>
                </div>
              </div>
              <div className={"mt-5"}>
                <div className={"flex items-center gap-3 text-blue-700 hover:bg-blue-700 hover:text-white duration-100 cursor-pointer px-3 py-2 rounded-lg"}>
                  <Folder size={25} />
                  <span>My Posts</span>
                </div>
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