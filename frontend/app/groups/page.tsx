"use client";

import {Users} from "lucide-react";
import Button from "@/components/ui/Button";
import {useState} from "react";
import Modal from "@/components/ui/Modal";

const GroupsPage = () => {
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);

  return (
    <>
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

      <Modal title={"Create Group"} isOpen={isGroupModalOpen} onClose={() => setIsGroupModalOpen(false)}></Modal>
    </>
  );
};

export default GroupsPage;