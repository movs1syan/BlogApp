import React from 'react';
import MessagesSidebar from "@/components/layouts/MessagesSidebar"

export default async function MessagesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-[85vh] my-4 rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.08),_0_-4px_12px_rgba(0,0,0,0.05)]">
      <MessagesSidebar />

      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}