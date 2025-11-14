import React from 'react';
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { getDate } from "@/helpers/getDate";
import type { PostType } from "@/shared/types";

const PostCard = ({ post }: { post: PostType }) => {
  return (
    <article className="rounded-xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between gap-7 transition-shadow duration-200 md:max-w-90">
      <div className="flex flex-col justify-center gap-4">
        {post.post_pic && (
          <Image src={post.post_pic} alt="Featured Image" width={400} height={400} className="md:h-50 w-full" />
        )}
        <span className="text-semibold text-blue-700">{post.category}</span>

        <Link href={`/blog/${post.id}`}>
          <div className="flex justify-between items-center cursor-pointer hover:text-blue-700 transition-colors duration-200">
            <h2 className="text-xl font-bold">{post.title}</h2>
            <div><ArrowUpRight size={40} /></div>
          </div>
        </Link>
        <p className="text-gray-600">{post.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        {post.author_pic && (
          <Image src={post.author_pic} alt={post.author_name} width={40} height={40} className="size-10 rounded-full object-cover" />
        )}

        <div className="flex flex-col">
          <p>{post.author_name} {post.author_surname}</p>
          <p className="text-gray-600">{getDate(post.createdAt)}</p>
        </div>
      </div>
    </article>
  );
};

export default PostCard;