import { Router } from "express";
import { getPosts, createPost } from "../controllers/postController.ts";

const router = Router();

router.get("/posts", getPosts);
router.post("/posts", createPost);

export default router;