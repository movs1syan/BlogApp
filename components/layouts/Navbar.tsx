"use client";

import React from 'react';
import Link from "next/link"
import Button from "@/components/ui/Button";
import {usePathname} from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 shadow-md w-full z-10 bg-white">
      <div className="flex justify-between px-10 py-5 items-center xl:max-w-320 max-w-[1024px] mx-auto">
        <Link href="/public" className={`${pathname ? "text-blue-700" : ""}`}>Home</Link>
        <div className="flex gap-4">
          <Button>Sign in</Button>
          <Button type="primary">Register</Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;