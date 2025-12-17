"use client";

import {useUser} from "@/hooks/useUser";
import Link from "next/link";
import { UserX } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import UserCard from "@/components/UserCard";
import Button from "@/components/ui/Button";


const FriendsPage = () => {
  const { friends } = useUser();

  return (
    <>
      {!friends ? (
        <div className={"mt-15 py-16"}>
          <Spinner size={"large"} tip={"Loading..."} />
        </div>
      ) : friends.length > 0 ? (
        <div>
          <h1 className={"font-bold text-3xl mt-10"}>My Friends</h1>
          <div className={"flex flex-col gap-5 mt-4"}>
            {friends.map(user => (
              <UserCard key={user.id} singleUser={user} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <UserX size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">No Friends Yet</h2>
          <p className="mt-2 max-w-sm">
            Your friends list is empty. Send some requests and start connecting.
          </p>

          <Link href={"/contacts"} className={"mt-7"}>
            <Button type={"primary"} icon={"Users"}>Contacts</Button>
          </Link>
        </div>
      )}
    </>
  );
};

export default FriendsPage;