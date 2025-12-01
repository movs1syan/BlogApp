import { Router } from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  getUserInfo,
  getUserProfile
} from "../controllers/userController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";
import { validate } from "../middlewares/validator.ts";
import {
  createUserSchema,
  authUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  updateUserSchema,
  changePasswordSchema
} from "../validators/userValidator.ts";
import { uploadAvatarMiddleware } from "../middlewares/uploadAvatarMiddleware.ts";

const router = Router();

router.get("/me", authMiddleware, getUserInfo);
router.get("/profile", authMiddleware, getUserProfile);

router.post("/register", uploadAvatarMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", validate(authUserSchema), authUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", validate(changePasswordSchema), authMiddleware, changePassword);

router.put("/update", uploadAvatarMiddleware.single("avatar"), validate(updateUserSchema), authMiddleware, updateUser);

export default router;