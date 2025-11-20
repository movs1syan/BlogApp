"use client";

import Link from "next/link";
import Button from "@/components/ui/Button";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import type { RootState } from "@/lib/redux/store";
import type { UserType } from "@/shared/types";
import { logoutUser } from "@/lib/redux/userSlice";
import Image from "next/image";

const Navbar = () => {
  const user: { data: UserType | null, loading: boolean } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logoutUser());
    localStorage.removeItem("token");
  };
  return (
    <nav className="sticky top-0 shadow-md w-full z-10 bg-white">
      <div className="flex justify-between px-10 py-5 items-center xl:max-w-320 max-w-[1024px] mx-auto">
        <Link href="/" className={`${pathname ? "text-blue-700" : ""}`}>Home</Link>
        <div className="flex gap-4">
          {user.data ? (
            <div className="flex items-center">
              <div className={"flex items-center gap-3 cursor-pointer"}>
                {user.data.avatar && (
                  <Image src={user.data.avatar} alt={user.data.avatar} width={40} height={40} className="size-10 rounded-full object-cover"/>
                )}
                <div className={"flex flex-col justify-between text-gray-500 text-sm"}>
                  <span>{user.data.name} {user.data.surname}</span>
                  <span>{user.data.email}</span>
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