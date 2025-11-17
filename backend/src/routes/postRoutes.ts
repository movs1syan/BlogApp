import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";
import { validatePost } from "../middlewares/postValidate.ts";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.ts";

const router = Router();

router.get("/posts", getPosts);
router.get("/posts/:id", getPosts);

router.post("/posts", validatePost(createPostSchema), createPost);

router.put("/posts/:id", validatePost(updatePostSchema), updatePost);

router.delete("/posts/:id", deletePost)

export default router;