import type { Request, Response } from "express";
import { Product } from "../models/models.ts";

export const createProduct = async (req: Request, res: Response) => {
  const { id } = req.user;
  const { name, description, price } = req.body;

  try {
    const product = await Product.create({
      userId: id,
      name,
      description,
      price
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