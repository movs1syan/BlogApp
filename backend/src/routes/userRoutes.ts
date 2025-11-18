import { Router } from "express";
import { authUser, registerUser, getUserProfile } from "../controllers/userController.ts";
import protect from "../middlewares/authMiddleware.ts";
import {validate} from "../middlewares/validator.ts";
import {createUserSchema} from "../validators/userValidator.ts";

const router = Router();

router.post("/register", validate(createUserSchema), registerUser);
router.post("/login", authUser);

router.get("/profile", protect, getUserProfile);

export default router;