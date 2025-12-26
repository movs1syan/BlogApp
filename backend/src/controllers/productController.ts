import type { Request, Response } from "express";
import { Product, CartItem, OrderItem, Order, User } from "../models/models.ts";
import stripe from "../config/stripe.ts";
import {Op} from "sequelize";

export const createProduct = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { name, description, price } = req.body;
  const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

  try {
    const product = await Product.create({
      userId: id,
      name,
      description,
      price,
      image: imagePath
    });

    if (product) {
      return res.status(201).json({ message: `Created product ${product.name}` });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.findAll({
      where: {
        userId: { [Op.ne]: req.user.id },
      },
      order: [["createdAt", "DESC"]]
    });

    if (!products) {
      return res.status(400).json({ message: "No product found." });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { productId, userId } = req.body;

  try {
    if (!productId || !userId) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    if (userId === id) {
      return res.status(400).json({ message: "Own product can't be added to cart" });
    }

    const [cartItem, created] = await CartItem.findOrCreate({
      where: { userId: id, productId },
      defaults: {
        quantity: 1
      }
    });

    if (created) {
      return res.status(201).json({ message: 'Product added to cart!' });
    } else {
      return res.status(400).json({ message: 'Product already in cart!' });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getCartItems = async (req: Request, res: Response) => {
  const { id } = req.user;

  try {
    const cartItems = await CartItem.findAll({
      where: { userId: id },
      attributes: ['id', 'quantity'],
      include: [
        {
          model: Product,
          as: 'product',
          attributes: ['id', 'name', 'price', 'image']
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    if (cartItems) {
      return res.status(200).json(cartItems);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { itemId } = req.body;

  try {
    const cartItem = await CartItem.destroy({
      where: { id: itemId, userId: id },
    });

    if (!cartItem) return res.status(400).json({ message: "Product does not found." });

    return res.status(200).json({ message: "Product has been deleted from cart!" })
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const changeQuantity = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { productId, productQty } = req.body;

  try {
    const cartItem = await CartItem.findOne({
      where: { userId: id, productId }
    });

    if (!cartItem) {
      return res.status(400).json({ message: "Product does not found." });
    }

    cartItem.quantity = productQty;
    await cartItem.save();

    return res.status(200).json({ message: "Product quantity was changed!" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const makeOrder = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { selectedItemsIds } = req.body;

  try {
    if (selectedItemsIds.length === 0) {
      return res.status(400).json({ message: "There is no product to order." });
    }

    const products = await CartItem.findAll({
      where: {
        userId: id,
        id: { [Op.in] : selectedItemsIds }
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: ['id', 'name', 'price']
        }
      ],
      attributes: ['quantity']
    });

    if (!products) {
      return res.status(400).json({ message: "Products does not found." });
    }

    let totalAmount = 0;
    let orderedProducts: Record<string, number>[] = [];

    products.forEach((product: any) => {
      totalAmount += product.quantity * Number(product.product.price);
      orderedProducts.push({
        productId: product.product.id,
        quantity: product.quantity,
        price: product.quantity * Number(product.product.price)
      });
    });

    let stripeCustomerId = req.user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        name: req.user.name,
        email: req.user.email,
      });

      stripeCustomerId = customer.id;

      await User.update(
        { stripeCustomerId },
        { where: { id: req.user.id } }
      );
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "usd",
      customer: stripeCustomerId,
      metadata: {
        userId: String(req.user.id),
        orderedProducts: JSON.stringify(orderedProducts),
      },
      automatic_payment_methods: { enabled: true },
    });

    return res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getOrders = async (req: Request, res: Response) => {
  const { id } = req.user;

  try {
    const orders = await Order.findAll({
      where: { userId: id },
      attributes: ["id", "userId"],
      include: [
        {
          model: OrderItem,
          as: 'orderedItems',
          attributes: ['id', 'quantity', 'price'],
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'image']
            }
          ],
        }
      ],
      order: [["createdAt", "DESC"]]
    });

    if (!orders) {
      return res.status(400).json({ message: 'No order found.' });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server error' });
  }
};