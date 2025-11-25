"use client";

import React, { useState, useEffect } from 'react';
import {apiFetch} from "@/lib/apiFetch";
import { PostType, UserWithPostType } from "@/shared/types";
import PostCard from "@/components/PostCard";
import Image from "next/image";
import {Bookmark} from "lucide-react";

const Page = () => {
  const [user, setUser] = useState<UserWithPostType | null>(null);
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    (async () => {
      const user = await apiFetch("GET", "users/profile");
      setUser(user);
      console.log(user);
      setPosts(user.posts);
    })();
  }, []);

  const fullAvatarUrl = `http://localhost:8000${user?.avatar}`;

  return user && (
    <main className={"flex flex-col py-10"}>
      <div className={"flex gap-10"}>
        {user.avatar && (
          <Image src={fullAvatarUrl} alt={fullAvatarUrl} width={150} height={150} unoptimized />
        )}
        <div className={"flex flex-col gap-3"}>
          <span className={"text-3xl"}>{user.name} {user.surname}</span>
          <span className={"text-gray-500"}>{user.email}</span>
        </div>
      </div>

      <div className={"flex items-center gap-2 mt-10"}>
        <Bookmark size={25} />
        <h1 className={"font-semibold text-2xl"}>My posts</h1>
      </div>
      {posts.length > 0 ? (
        <div className={"grid grid-cols-1 xl:grid-cols-3 md:grid-cols-2 gap-15 mt-3"}>
          {posts.map((post) => {
            post = {
              ...post,
              author: {
                name: user.name,
                surname: user.surname,
                email: user.surname,
                avatar: user.avatar,
              }
            };

            return (
              <PostCard key={post.id} post={post} />
            );
          })}
        </div>
      ) : (
        <p>No posts</p>
      )}
    </main>
  );
};

export default Page;