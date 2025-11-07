import React from 'react';
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

const Post = ({ post }) => {
  return (
    <article className="rounded-xl p-6 shadow-xl hover:shadow-2xl flex flex-col justify-between gap-7 transition-shadow duration-200 max-w-90">
      <div className="flex flex-col justify-center gap-4">
        <Image src={post.featured_image} alt="Featured Image" width={400} height={400} className="h-50" />
        <span className="text-semibold text-blue-700">{post.category}</span>

        <div className="flex cursor-pointer hover:text-blue-700 transition-colors duration-200">
          <h2 className="text-xl font-bold">{post.title}</h2>
          <div>
            <ArrowUpRight size={40} />
          </div>
        </div>
        <p className="text-gray-600">{post.subtitle}</p>
      </div>

      <div className="flex items-center gap-3">
        <Image
          src={post.user.profile_pic}
          alt={post.user.first_name}
          width={40}
          height={40}
          className="size-10 rounded-full object-cover"
        />
        <div className="flex flex-col">
          <p>{post.user.first_name} {post.user.last_name}</p>
          <p className="text-gray-600">{post.created_at}</p>
        </div>
      </div>
    </article>
  );
};

export default Post;