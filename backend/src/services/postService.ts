import { Op } from "sequelize";
import { Post, User } from "../models/index.ts";

export const getSinglePostService = async (id: string) => {
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

export const createPostService = async (data) => {
  return Post.create(data);
};

export const updatePostService = async (id, data) => {
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