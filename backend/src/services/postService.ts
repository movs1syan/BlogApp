import { Op } from "sequelize";
import { Post } from "../models/Post.ts";

export const getSinglePostService = async (id: string) => {
  return Post.findByPk(id);
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

  const posts = await Post.findAll({
    where: searchFilter,
    limit,
    offset,
    order: [[sortBy, orderBy]]
  });

  const totalPostsQuantity = await Post.count({ where: searchFilter });

  return { posts, totalPostsQuantity };
};

export const createPostService = async (data: Record<string, string | number>) => {
  return Post.create(data);
};

export const updatePostService = async (id: string, data: Record<string, string | number>) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error(`Post with the ID of ${id} was not found`);
  }

  return post.update(data);
};

export const deletePostService = async (id: string) => {
  const post = await Post.findByPk(id);
  if (!post) {
    throw new Error(`Post with the ID of ${id} was not found`);
  }

  return post.destroy();
};