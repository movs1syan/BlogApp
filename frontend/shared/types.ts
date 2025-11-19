export interface PostType {
	id: number;
	title: string;
	subtitle: string;
	category: string;
	description: string;
	image: string;
	createdAt: string;
	updatedAt: string;
	author: {
		id: number;
		name: string;
		surname: string;
		email: string;
		avatar: string;
	}
	userId: number;
}

export interface UserType {
	id: number;
	name: string;
	surname: string;
	email: string;
	avatar: string;
	password: string;
}

export interface NotificationType {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	description: string;
}