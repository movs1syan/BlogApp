"use client";

import { TriangleAlert, Users } from "lucide-react";
import Button from "@/components/ui/Button";
import React, {useState, useEffect} from "react";
import { useUser } from "@/hooks/useUser";
import Modal from "@/components/ui/Modal";
import ModalInput from "@/components/ui/ModalInput";
import {apiFetch} from "@/lib/apiFetch";
import {useRouter} from "next/navigation";
import GroupCard from "@/components/GroupCard";
import type { IGroup } from "@/shared/types";
import {useNotification} from "@/hooks/useNotification";

const ClientGroupsPage = ({ groups }: { groups: IGroup[] }) => {
  const [groupsList, setGroupsList] = useState<IGroup[]>(groups);
  const [groupName, setGroupName] = useState<string>("");
  const [friendsList, setFriendsList] = useState<number[]>([]);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { friends } = useUser();
  const { notify } = useNotification();
  const router = useRouter();

  useEffect(() => {
    setGroupsList(groups);
  }, [groups]);

  const handleCheckboxChange = (userId: number, checked: boolean) => {
    if (checked) {
      setFriendsList(prev => [...prev, userId]);
    } else {
      setFriendsList(prev => prev.filter(id => id !== userId));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await apiFetch("POST", "users/group/create", undefined, {
        name: groupName,
        friends: friendsList
      });

      setGroupName("");
      setFriendsList([]);
      setIsGroupModalOpen(false);

      notify({
        type: "success",
        message: "Success!",
        description: response.message,
      });
    } catch (error: any) {
      console.log(error);
      setError(error.message)
    } finally {
      setLoading(false);
    }

    router.refresh();
  };

  return (
    <>
      {groupsList.length > 0 ? (
        <div>
          <h1 className={"font-bold text-3xl mt-10"}>Groups</h1>
          <div className={"mt-7"}>
            <Button icon={"Plus"} onClick={() => setIsGroupModalOpen(true)}>Create new group</Button>
          </div>
          <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-7"}>
            {groupsList.map((group: IGroup) => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center text-gray-600 mt-15">
          <Users size={85} className="mb-4 opacity-70" />
          <h2 className="text-3xl font-semibold mt-7">No Groups Yet</h2>
          <p className="mt-2 max-w-sm">
            Your groups list is empty. Create a group, include your friends and start connecting.
          </p>

          <div className={"mt-7"}>
            <Button type={"primary"} icon={"Users"} onClick={() => setIsGroupModalOpen(true)}>Create group</Button>
          </div>
        </div>
      )}

      <Modal title={"Create Group"} isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}>
        <form onSubmit={handleSubmit}>
          <ModalInput fieldName={"Group name"} inputName={"groupName"} handleChange={(e) => setGroupName(e.target.value)} />
          <div className={"flex flex-col gap-2 mt-3"}>
            <h2>Group members</h2>
            {friends?.map(friend => (
              <div key={friend.id} className={" w-full"}>
                <Button>
                  <label className={"flex items-center cursor-pointer"}>
                    <input type={"checkbox"} checked={friendsList.includes(friend.id)} className={"size-4"} onChange={(e) => handleCheckboxChange(friend.id, e.target.checked)} />
                    <span className={"ml-3"}>{friend.name} {friend.surname}</span>
                  </label>
                </Button>
              </div>
            ))}
          </div>

          <div className={"flex gap-3 justify-end mt-3"}>
            <Button onClick={() => setIsGroupModalOpen(false)}>Cancel</Button>
            <Button htmlType={"submit"} type={"primary"} loading={loading}>Create</Button>
          </div>

          {error && (
            <div className={"flex justify-center items-center gap-2 text-red-600 mt-3"}>
              <TriangleAlert size={20} />
              <p className={"text-sm"}>{error}</p>
            </div>
          )}
        </form>
      </Modal>
    </>
  );
};

export default ClientGroupsPage;