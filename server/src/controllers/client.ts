import getCountryISO3 from "country-iso-2-to-3";
import _ from "lodash";
import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { transactionQuerySchema } from "../validation/transaction.js";
import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getProducts = asyncHandler(async (_req: Request, res: Response) => {
  const products = await Product.find().lean();
  const ids = products.map((p) => String(p._id));
  const stats = await ProductStat.find({ productId: { $in: ids } }).lean();
  const byProduct = _.groupBy(stats, "productId");
  const withStats = products.map((p) => ({ ...p, stat: byProduct[String(p._id)] ?? [] }));
  res.status(200).json(withStats);
});

export const getCustomers = asyncHandler(async (_req: Request, res: Response) => {
  const customers = await User.find({ role: "user" }).select("-password").lean();
  res.status(200).json(customers);
});

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const { page, pageSize, sort, search } = transactionQuerySchema.parse(req.query);
  const safeSearch = _.escapeRegExp(search);
  const filter = {
    $or: [
      { cost: { $regex: safeSearch, $options: "i" } },
      { userId: { $regex: safeSearch, $options: "i" } },
    ],
  };
  const sortFormatted = sort ? { [sort.field]: sort.sort === "asc" ? 1 : -1 } : {};

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort(sortFormatted as Record<string, 1 | -1>)
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .lean(),
    Transaction.countDocuments(filter),
  ]);

  res.status(200).json({ transactions, total });
});

export const getGeography = asyncHandler(async (_req: Request, res: Response) => {
  const users = await User.find().lean();
  const mapped = users.reduce<Record<string, number>>((acc, { country }) => {
    if (!country) return acc;
    const iso3 = getCountryISO3(country);
    acc[iso3] = (acc[iso3] ?? 0) + 1;
    return acc;
  }, {});
  const formatted = Object.entries(mapped).map(([id, value]) => ({ id, value }));
  res.status(200).json(formatted);
});
