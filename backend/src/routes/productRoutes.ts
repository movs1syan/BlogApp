import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.ts";
import {validate} from "../middlewares/validator.ts";
import {createProductSchema} from "../validators/productValidator.ts";
import {createProduct, getProducts} from "../controllers/productController.ts";
import {uploadProductImage} from "../middlewares/uploadProductImage.ts";

const router = Router();

router.get("/get", getProducts);

router.post("/create", authMiddleware, uploadProductImage.single("image"), validate(createProductSchema), createProduct);

export default router;