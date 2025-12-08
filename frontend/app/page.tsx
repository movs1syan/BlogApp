import React from "react";
import { apiFetch } from "@/lib/apiFetch";
import ClientPosts from "@/components/pages/ClientPosts";

export default async function Home (props: PageProps<'/'>) {
  const resolvedParams = await props.searchParams;
  const page = Number(resolvedParams?.page || 1);
  const postSearch =  Array.isArray(resolvedParams?.postSearch) ? resolvedParams.postSearch[0] : resolvedParams?.postSearch || "";

  const { totalPostsQuantity, posts } = await apiFetch("GET", "posts/get", { page, limit: 9, postSearch });

  return (
    <main>
      {/* Header */}
      <section className="flex flex-col justify-center items-center md:py-15 py-10 md:gap-10 gap-6">
        <div className="px-3 py-1 rounded-3xl bg-gray-100 w-fit">Blog</div>
        <h2 className="font-semibold md:text-5xl text-3xl">Discover our latest news</h2>
        <p className="text-center">Discover the achievements that set us apart. From groundbreaking projects to industry accolades,<br /> we take pride in our accomplishments.</p>
      </section>

      {/* Blog Posts */}
      <section className="pb-10">
        <ClientPosts posts={posts} page={page} totalPostsQuantity={totalPostsQuantity} />
      </section>
    </main>
  );
}