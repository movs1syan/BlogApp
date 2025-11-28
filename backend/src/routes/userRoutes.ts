import { Router } from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  updateUser,
  getUserInfo,
  getUserProfile
} from "../controllers/userController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
import { validate } from "../middlewares/validator.ts";
import {
  createUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema
} from "../validators/userValidator.ts";
import { uploadMiddleware } from "../middlewares/uploadMiddleware.ts";

const router = Router();

router.post("/register", uploadMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", authUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

router.put("/update", uploadMiddleware.single("avatar"), validate(updateUserSchema), authMiddleware, updateUser);

router.get("/me", authMiddleware, getUserInfo);
router.get("/profile", authMiddleware, getUserProfile);

export default router;