import type { Request, Response } from "express";
import { Product } from "../models/models.ts";
import stripe from "../config/stripe.ts";

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
    const products = await Product.findAll();
    if (!products) {
      return res.status(400).json({ message: "No product found." });
    }

    return res.status(200).json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  const { amount } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    automatic_payment_methods: { enabled: true },
  });

  return res.status(200).json({ clientSecret: paymentIntent.client_secret });
};