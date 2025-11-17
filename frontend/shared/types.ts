export interface PostType {
	id: number;
	title: string;
	subtitle: string;
	category: string;
	description: string;
	authorName: string;
	authorSurname: string;
	authorImage: string;
	postImage: string;
	createdAt: string;
}

export interface NotificationType {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	description: string;
}