"use client";

import { useUser } from "@/hooks/useUser";
import FriendNotification from "@/components/ui/FriendNotification";
import {UserX} from "lucide-react";
import Spinner from "@/components/ui/Spinner";

const RequestsPage = () => {
  const { userWithFriends } = useUser();

  return (
    <>
      {!userWithFriends?.pendingToAccept ? (
        <div className={"mt-15 py-16"}>
          <Spinner size={"large"} tip={"Loading..."} />
        </div>
      ) : userWithFriends.pendingToAccept.length > 0 ? (
        <div>
          <h1 className={"font-bold text-3xl mt-10"}>Requests</h1>
          <div className={"flex flex-col gap-5 mt-4"}>
            {userWithFriends?.pendingToAccept.map(user => (
              <FriendNotification key={user.id} user={user} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <UserX size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">No Requests Yet</h2>
          <p className="mt-2 max-w-sm">
            You’re all caught up! We’ll let you know when something new arrives.
          </p>
        </div>
      )}
    </>
  );
};

export default RequestsPage;