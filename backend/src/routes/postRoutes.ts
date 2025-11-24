import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";
import { validate } from "../middlewares/validator.ts";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
import { uploadImageMiddleware } from "../middlewares/uploadImageMiddleware.ts";

const router = Router();

router.get("/get", getPosts);
router.get("/get/:id", getPosts);

router.post("/create", uploadImageMiddleware.single("image"), validate(createPostSchema), authMiddleware, createPost);

router.put("/update/:id", uploadImageMiddleware.single("image"), validate(updatePostSchema), authMiddleware, updatePost);

router.delete("/delete/:id", authMiddleware, deletePost);

export default router;