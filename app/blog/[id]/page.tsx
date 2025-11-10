import React from "react";
import axios from "axios";
import IndividualPagePost from "@/components/IndividualPagePost";

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
	
	return <IndividualPagePost post={post} />;
}
