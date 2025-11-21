import { Op } from "sequelize";
import { Post, User } from "../models/index.ts";
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

export const getAllPostsService = async ({ page, limit, search, sortBy, orderBy }: { page: number; limit: number; search: string; sortBy: string; orderBy: string }) => {
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
    order: [[sortBy, orderBy]],
    include: [
      {
        model: User,
        as: "author",
        attributes: ["id", "name", "surname", "email", "avatar"],
      },
    ]
  });

  return { totalPostsQuantity, posts };
};

export const createPostService = async (data: PostCreationType) => {
  return Post.create(data);
};

export const updatePostService = async (id: number, data: PostCreationType, userId: number) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error(`Post with the ID of ${id} was not found`);
  }

  if (post.userId !== userId) {
    throw new Error(`Only owner of this post can make changes in this post`);
  }

  return post.update(data);
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