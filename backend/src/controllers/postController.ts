import type { Request, Response } from "express";
import {
  createPostService,
  getAllPostsService,
  getSinglePostService,
  updatePostService,
  deletePostService
} from "../services/postService.ts";

export const getPosts = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (id) {
      const post = await getSinglePostService(id);
      if (!post) {
        return res.status(404).json({ message: `Post with the ID of ${id} was not found` });
      }

      return res.status(200).json(post);
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const search = String(req.query.search || "");
    const sortBy = String(req.query.sortBy || "createdAt");
    const orderBy = String(req.query.orderBy || "DESC");

    const posts = await getAllPostsService({ page, limit, search, sortBy, orderBy });
    if (!posts) {
      return res.status(404).json({ message: `No posts found` });
    }

    return res.json(posts);
  } catch (err) {
    res.status(500).json({ message: `Failed to fetch posts: ${err}` });
  }
};

export const createPost = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    const post = await createPostService(data);

    return res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: `Failed to create post: ${err}` });
  }
};

export const updatePost = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedPost = await updatePostService(id, data);

    if (updatedPost) {
      return res.status(200).json(updatedPost);
    }
  } catch (err) {
    res.status(500).json({ message: `Failed to update post: ${err}` });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await deletePostService(id);

    return res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: `Failed to delete post: ${err}` });
  }
};