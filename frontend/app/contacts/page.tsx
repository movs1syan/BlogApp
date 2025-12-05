import React from "react";
import { apiFetch } from "@/lib/apiFetch";
import ClientUsers from "@/components/pages/ClientUsers";

export default async function Contacts(props: PageProps<'/contacts'>) {
  const resolvedParams = await props.searchParams;
  const page = Number(resolvedParams?.page || 1);
  const search =  Array.isArray(resolvedParams?.search) ? resolvedParams.search[0] : resolvedParams?.search || "";

  const { totalUsersQuantity, users } = await apiFetch("GET", "users/all-users", { page, limit: 9, search });

  return (
    <main>
      {/* Header */}
      <section className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="px-3 py-1 rounded-3xl bg-gray-100 w-fit">Users</div>
        <h2 className="font-semibold md:text-5xl text-2xl">Connect with people across the community</h2>
        <p className="text-center">Explore profiles, discover new connections, and grow your network. Add users as friends<br /> to stay updated with their latest activity.</p>
      </section>

      {/* Blog Posts */}
      <section className="pb-10">
        <ClientUsers users={users} totalUsersQuantity={totalUsersQuantity} />
      </section>
    </main>
  );
}