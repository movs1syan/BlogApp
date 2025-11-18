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

export interface UserType {
	id: number;
	name: string;
	surname: string;
	email: string;
	password: string;
}

export interface NotificationType {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	description: string;
}