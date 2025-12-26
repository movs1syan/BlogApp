import { Router } from "express";
import authMiddleware from "../middlewares/authMiddleware.ts";
import {validate} from "../middlewares/validator.ts";
import {createProductSchema} from "../validators/productValidator.ts";
import {createProduct, getProducts, addToCart, getCartItems, deleteCartItem, changeQuantity, makeOrder, getOrders} from "../controllers/productController.ts";
import {uploadProductImage} from "../middlewares/uploadProductImage.ts";

const router = Router();

router.get("/get", authMiddleware, getProducts);
router.get('/cart/get', authMiddleware, getCartItems);
router.get('/order/get', authMiddleware, getOrders)

router.post("/create", authMiddleware, uploadProductImage.single("image"), validate(createProductSchema), createProduct);
router.post('/cart/add', authMiddleware, addToCart);
router.post('/cart/order', authMiddleware, makeOrder);

router.put('/cart/change-quantity', authMiddleware, changeQuantity)

router.delete('/cart/delete', authMiddleware, deleteCartItem);

export default router;