import { Router } from "express";
import { authUser, registerUser, updateUser, getUserInfo, getUserProfile } from "../controllers/userController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
import {validate} from "../middlewares/validator.ts";
import {createUserSchema, updateUserSchema} from "../validators/userValidator.ts";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.ts";

const router = Router();

router.post("/register", uploadMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", authUser);

router.put("/update", uploadMiddleware.single("avatar"), validate(updateUserSchema), authMiddleware, updateUser);

router.get("/me", authMiddleware, getUserInfo);
router.get("/profile", authMiddleware, getUserProfile);

export default router;