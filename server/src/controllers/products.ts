import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";

export const getProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find().lean();
  const ids = products.map((p) => String(p._id));
  const stats = await ProductStat.find({ productId: { $in: ids } }).lean();
  const byProduct = Object.groupBy(stats, (s) => String(s.productId)); // native (Bun/Node 21+)
  res.status(200).json(products.map((p) => ({ ...p, stat: byProduct[String(p._id)] ?? [] })));
});

export const createProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json(product.toObject());
});

export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).lean();
  if (!product) throw ApiError.notFound("Product not found");
  res.status(200).json(product);
});

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id).lean();
  if (!product) throw ApiError.notFound("Product not found");
  res.status(200).json({ _id: req.params.id });
});
