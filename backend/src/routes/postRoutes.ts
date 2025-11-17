import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";

const router = Router();

router.get("/posts", getPosts);
router.get("/posts/:id", getPosts);

router.post("/posts", createPost);

router.put("/posts/:id", updatePost);

router.delete("/posts/:id", deletePost)

export default router;