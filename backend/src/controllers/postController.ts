import type { Request, Response } from "express";
import { Post } from "../models/Post.ts";

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.findAll();
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch posts" });
    }
};

export const createPost = async (req: Request, res: Response) => {
    try {
        const post = await Post.create(req.body);
        res.status(201).json(post);
    } catch (err) {
        res.status(500).json({ error: "Failed to create post" });
    }
};