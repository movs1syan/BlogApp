"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {useUser} from "@/hooks/useUser";

const Navbar = () => {
  const pathname = usePathname();
  const { user, setUser } = useUser();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };
  return (
    <nav className="sticky top-0 shadow-md w-full z-10 bg-white">
      <div className="flex justify-between px-10 py-5 items-center xl:max-w-320 max-w-[1024px] mx-auto">
        <Link href="/" className={`${pathname ? "text-blue-700" : ""}`}>Home</Link>
        <div className="flex gap-4">
          {user ? (
            <div className="flex items-center">
              <div className={"flex items-center gap-3 cursor-pointer"}>
                {user.avatar && (
                  <Image src={user.avatar} alt={user.avatar} width={40} height={40} className="size-10 rounded-full object-cover"/>
                )}
                <div className={"flex flex-col justify-between text-gray-500 text-sm"}>
                  <span>{user.name} {user.surname}</span>
                  <span>{user.email}</span>
                </div>
              </div>
              <Link href={"/login"}>
                <Button icon={"LogOut"} type={"link"} onClick={handleLogout}></Button>
              </Link>
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
  );
};

export default Navbar;