import express from "express";
import { stripeWebhook } from "../controllers/stripeController.ts";
const router = express.Router();

router.post("/", express.raw({ type: "application/json" }), stripeWebhook);

export default router;
