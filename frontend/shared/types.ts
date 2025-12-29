export interface PostType {
	id: number;
	title: string;
	subtitle: string;
	category: string;
	description: string;
	image: string | null;
	createdAt: string;
	updatedAt: string;
	author: {
		id?: number;
		name: string;
		surname: string;
		email: string;
		avatar: string | null;
	}
	userId: number;
}

export interface UserWithPostType {
	id: number;
	name: string;
	surname: string;
	email: string;
	password: string;
	confirmPassword: string;
	avatar: string | null;
	posts?: {
		title: string;
		subtitle: string;
		category: string;
		description: string;
		image: string | null;
		createdAt: string;
		updatedAt: string;
	}[];
}

export interface UpdatePostType {
	title: string;
	subtitle: string;
	category: string;
	description: string;
	image: File | string | null;
}

export interface CreatePostType {
	title: string;
	subtitle: string;
	category: string;
	description: string;
	image: File | null;
}

export interface RegisterFormType {
	name: string;
	surname: string;
	email: string;
	password: string;
	confirmPassword: string;
	avatar: File | null;
}

export interface UserType {
	id: number;
	name: string;
	surname: string;
	email: string;
	password: string;
	confirmPassword: string;
	avatar: string | null;
}

export interface IGroup {
	id: number;
	name: string;
	adminId: number;
	createdAt: Date;
	updatedAt: Date;
	users: Omit<UserType, "password" | "confirmPassword">[];
}

export interface ICartItem {
	id: number;
	quantity: number;
	product: {
		id: number;
		name: string;
		price: string;
		image: string;
	}
}

export interface IOrderProduct {
	id: number;
	quantity: number;
	price: number;
	product: {
		name: string;
		image: string;
	}
}

export interface IOrderItem {
	id: number;
	createdAt: number;
	orderedItems: IOrderProduct[],
}

export interface ProductType {
	id: number;
	userId: number;
	name: string;
	description: string;
	price: number;
	image: string | null;
	createdAt: Date;
	updatedAt: Date;
}

export interface ProductCreationType {
	name: string;
	description: string;
	price: string;
	image: File | null;
}

export interface NotificationType {
	id: string;
	type: "success" | "error" | "info" | "warning";
	message: string;
	description: string;
}