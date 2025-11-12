import React from "react";
import { apiFetch } from "@/lib/apiFetch";
import ClientPost from "@/components/ClientPost";

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
	const resolvedParams = await params;
	const post = await apiFetch("GET", `posts/${resolvedParams.id}`);

	if (!post) {
		return (
			<div className="max-w-3xl mx-auto py-10 text-center">
				<h1 className="text-2xl font-bold text-red-600">Post not found</h1>
			</div>
		);
	}
	
	return <ClientPost post={post} />;
}
