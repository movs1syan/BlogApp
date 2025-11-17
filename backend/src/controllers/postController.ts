import type { Request, Response } from "express";
import { Op } from "sequelize";
import { Post } from "../models/Post.ts";

export const getPosts = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 9;
  const search = String(req.query.search || "");
  const sortBy = String(req.query.sortBy || "createdAt");
  const order = String(req.query.order || "DESC");

  const offset = (page - 1) * limit;

  const searchFilter  = search ? {
    [Op.or]: [
      { title: { [Op.iLike]: `%${search}%` } },
      { subtitle: { [Op.iLike]: `%${search}%` } },
    ]
  } : {};

  try {
    const posts = await Post.findAll({
      where: searchFilter,
      limit,
      offset,
      order: [[sortBy, order]],
    });

    const totalPostsQuantity = await Post.count({ where: searchFilter  });

    return res.json({ posts, totalPostsQuantity });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch posts" });
  }
};

export const getSinglePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    return res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch post" });
  }
};

export const createPost = async (req: Request, res: Response) => {
  try {
    const post = await Post.create(req.body);

    return res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.update(data);

    return res.status(200).json(post);
  } catch (err) {
    res.status(500).json({ error: "Failed to update post" });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const post = await Post.findByPk(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.destroy();

    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};