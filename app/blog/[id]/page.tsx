import React from "react";
import axios from "axios";
import {ArrowUpRight} from "lucide-react";
import type { PostType } from "@/shared/types";
import Image from "next/image";
import Link from "next/link";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;

	const { data: post } = await axios.get(`https://6910d3327686c0e9c20bce81.mockapi.io/blog/posts/${resolvedParams.id}`);
	
	if (!post) {
		return (
			<div className="max-w-3xl mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold text-red-600">Post not found</h1>
			</div>
		);
	}
	
	return (
		<article className="p-6 flex flex-col justify-between gap-7 md:max-w-200">
			<div className="flex flex-col justify-center gap-4">
				<Image src={post.post_pic} alt="Featured Image" width={400} height={400} className="md:h-100 w-full" />
				<span className="text-semibold text-blue-700">{post.category}</span>
				
				<Link href={`/blog/${post.id}`}>
					<div className="flex justify-between items-center cursor-pointer hover:text-blue-700 transition-colors duration-200">
						<h2 className="text-xl font-bold">{post.title}</h2>
						<div>
							<ArrowUpRight size={40} />
						</div>
					</div>
				</Link>
				<p className="text-gray-600">{post.subtitle}</p>
				<p>{post.description}</p>
			</div>
			
			<div className="flex items-center gap-3">
				<Image
					src={post.author_pic}
					alt={post.author_name}
					width={40}
					height={40}
					className="size-10 rounded-full object-cover"
				/>
				<div className="flex flex-col">
					<p>{post.author_name} {post.author_surname}</p>
					<p className="text-gray-600">{post.createdAt}</p>
				</div>
			</div>
		</article>
	);
}
