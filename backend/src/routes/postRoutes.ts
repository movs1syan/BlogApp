import { Router } from "express";
import { getPosts, createPost, updatePost, deletePost } from "../controllers/postController.ts";
import { validate } from "../middlewares/validator.ts";
import { createPostSchema, updatePostSchema } from "../validators/postValidator.ts";

const router = Router();

router.get("/get", getPosts);
router.get("/get/:id", getPosts);

router.post("/create", validate(createPostSchema), createPost);

router.put("/update/:id", validate(updatePostSchema), updatePost);

router.delete("/delete/:id", deletePost);

export default router;