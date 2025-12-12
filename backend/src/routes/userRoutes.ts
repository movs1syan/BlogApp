import { Router } from "express";
import {
  registerUser,
  authUser,
  forgotPassword,
  resetPassword,
  changePassword,
  updateUser,
  getUserProfile,
  getAllUsers,
  getUserInfo,
  acceptRequest,
  declineRequest,
  sendRequest,
  unfriendUser,
  checkResetToken,
  readNotification, getPendingToAcceptRequests, getPendingToBeAcceptedRequests, getNotificationsList, getFriendsList
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

router.get("/profile", authMiddleware, getUserProfile);
router.get("/me", authMiddleware, getUserInfo);
router.get("/all-users", authMiddleware, getAllUsers);
router.get("/pending-to-accept", authMiddleware, getPendingToAcceptRequests);
router.get("/pending-to-be-accepted", authMiddleware, getPendingToBeAcceptedRequests);
router.get("/friends", authMiddleware, getFriendsList);
router.get("/notifications", authMiddleware, getNotificationsList);
router.get("/reset-password", checkResetToken);

router.post("/register", uploadAvatarMiddleware.single("avatar"), validate(createUserSchema), registerUser);
router.post("/login", validate(authUserSchema), authUser);
router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validate(resetPasswordSchema), resetPassword);
router.post("/change-password", validate(changePasswordSchema), authMiddleware, changePassword);
router.post("/friend/request", authMiddleware, sendRequest);
router.post("/friend/accept", authMiddleware, acceptRequest);
router.post("/friend/decline", authMiddleware, declineRequest);

router.put("/update", uploadAvatarMiddleware.single("avatar"), validate(updateUserSchema), authMiddleware, updateUser);
router.put('/read-notification', authMiddleware, readNotification)

router.delete("/unfriend", authMiddleware, unfriendUser);

export default router;