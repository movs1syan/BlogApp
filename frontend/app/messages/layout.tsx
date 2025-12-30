import React from 'react';
import MessagesSidebar from "@/components/layouts/MessagesSidebar"
import {apiFetch} from "@/lib/apiFetch";

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  const groups = await apiFetch("GET", "users/group/get");

  return (
    <div className="flex h-[calc(100vh-114px)] my-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)]">
      <MessagesSidebar groups={groups} />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}