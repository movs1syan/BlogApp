import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";
import { validate } from "../middlewares/validator.ts";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = Router();

router.get("/get", getPosts);
router.get("/get/:id", getPosts);

router.post("/create", validate(createPostSchema), authMiddleware, createPost);

router.put("/update/:id", validate(updatePostSchema), authMiddleware, updatePost);

router.delete("/delete/:id", authMiddleware, deletePost);

export default router;