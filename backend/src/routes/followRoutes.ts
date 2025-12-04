import { Router } from "express";
import { sendFollow, acceptFollow, declineFollow, unfollowUser, getFollowers, getFollowings } from "../controllers/followController.ts";
import authMiddleware from "../middlewares/authMiddleware.ts";

const router = Router();

router.post("/follow/request", authMiddleware, sendFollow);
router.post("/follow/accept", authMiddleware, acceptFollow);
router.post("/follow/decline", authMiddleware, declineFollow);

router.delete("/unfollow", authMiddleware, unfollowUser);

router.get("/followers/:id", getFollowers);
router.get("/following/:id", getFollowings);

export default router;