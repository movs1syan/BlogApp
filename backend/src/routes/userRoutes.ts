import { Router } from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  getUserInfo,
  getUserProfile,
  getAllUsers,
  getUserWithFriends,
  acceptRequest,
  declineRequest,
  getFollowers,
  getFollowings,
  sendRequest,
  unfriendUser,
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

// router.get("/me", authMiddleware, getUserInfo);
router.get("/profile", authMiddleware, getUserProfile);
router.get("/me", authMiddleware, getUserWithFriends);
router.get("/all-users", authMiddleware, getAllUsers);
// router.get("/followers/:id", getFollowers);
// router.get("/following/:id", getFollowings);

router.post("/register", uploadAvatarMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", validate(authUserSchema), authUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", validate(changePasswordSchema), authMiddleware, changePassword);
router.post("/friend/request", authMiddleware, sendRequest);
router.post("/friend/accept", authMiddleware, acceptRequest);
router.post("/friend/decline", authMiddleware, declineRequest);

router.put("/update", uploadAvatarMiddleware.single("avatar"), validate(updateUserSchema), authMiddleware, updateUser);

router.delete("/unfriend", authMiddleware, unfriendUser);

export default router;