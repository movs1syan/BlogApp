"use client";

import {useUser} from "@/hooks/useUser";
import FollowNotification from "@/components/ui/FollowNotification";
import { BellOff } from "lucide-react";
import Spinner from "@/components/ui/Spinner";

const NotificationsPage = () => {
  const { userWithFollowers } = useUser();

  return (
    <>
      {!userWithFollowers?.pendingToAccept ? (
        <div className={"mt-15 py-16"}>
          <Spinner size={"large"} tip={"Loading..."} />
        </div>
      ) : userWithFollowers.pendingToAccept.length > 0 ? (
        <div>
          <h1 className={"font-bold text-3xl mt-10"}>Notifications</h1>
          <div className={"flex flex-col gap-5 mt-4"}>
            {userWithFollowers?.pendingToAccept.map(user => (
              <FollowNotification key={user.id} user={user} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <BellOff size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">No Notifications Yet</h2>
          <p className="mt-2 max-w-sm">
            You’re all caught up! We’ll let you know when something new arrives.
          </p>
        </div>
      )}
    </>
  );
};

export default NotificationsPage;