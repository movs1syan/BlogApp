export interface PostType {
	id: number;
	title: string;
	subtitle: string;
	category: string;
	description: string;
	author_name: string;
	author_surname: string;
	author_pic: string;
	post_pic: string;
	createdAt: string;
}

export interface NotificationType {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	description: string;
}