import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";
import { validate } from "../middlewares/validator.ts";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.ts";
import protect from "../middlewares/authMiddleware.ts";

const router = Router();

router.get("/get", getPosts);
router.get("/get/:id", getPosts);

router.post("/create", validate(createPostSchema), protect, createPost);

router.put("/update/:id", validate(updatePostSchema), protect, updatePost);

router.delete("/delete/:id", protect, deletePost);

export default router;