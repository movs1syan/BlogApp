import { Op } from "sequelize";
import { Post, User } from "../models/models.ts";
import type { PostCreationType } from "../types";

export const getSinglePostService = async (id: number) => {
  return Post.findByPk(id, {
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "surname", "email", "avatar"],
      },
    ]
  });
};

export const getAllPostsService = async ({ page, limit, search }: { page: number; limit: number; search: string; }) => {
  const offset = (page - 1) * limit;

  const searchFilter = search ? {
      [Op.or]: [
        { title: { [Op.iLike]: `%${search}%` } },
        { subtitle: { [Op.iLike]: `%${search}%` } },
        { category: { [Op.iLike]: `%${search}%` } },
      ]
    } : {};

  const { count: totalPostsQuantity, rows: posts } = await Post.findAndCountAll({
    where: searchFilter,
    limit,
    offset,
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "surname", "email", "avatar"],
      },
    ]
  });

  if (offset > totalPostsQuantity) {
    throw new Error(`Page ${page} not found`);
  }

  return { totalPostsQuantity, posts };
};

export const createPostService = async (data: PostCreationType) => {
  const { title, subtitle, description, category, imagePath, userId } = data;

  return Post.create({
    title,
    subtitle,
    description,
    category,
    image: imagePath,
    userId,
  });
};

export const updatePostService = async (id: number, data: PostCreationType, imagePath: string | null, userId: number) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error(`Post with the ID of ${id} was not found`);
  }

  if (post.userId !== userId) {
    throw new Error(`Only owner of this post can make changes in this post`);
  }

  if (post.image !== null && imagePath === null) {
    return post.update({
      ...data,
    });
  }

    return post.update({
      ...data,
      image: imagePath
    });
};

export const deletePostService = async (id: number, userId: number) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error(`Post with the ID of ${id} was not found`);
  }

  if (post.userId !== userId ) {
    throw new Error(`Only owner of this post can delete this post`)
  }

  return post.destroy();
};