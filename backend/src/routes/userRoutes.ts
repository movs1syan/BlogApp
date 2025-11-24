import { Router } from "express";
import { authUser, registerUser, getUserInfo } from "../controllers/userController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
import {validate} from "../middlewares/validator.ts";
import {createUserSchema} from "../validators/userValidator.ts";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.ts";

const router = Router();

router.post("/register", uploadMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", authUser);

router.get("/me", authMiddleware, getUserInfo);

export default router;