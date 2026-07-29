import mongoose from "mongoose";
import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = asyncHandler(async (_req: Request, res: Response) => {
  const admins = await User.find({ role: "admin" }).select("-password").lean();
  res.status(200).json(admins);
});

export const getUserPerformance = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest("Invalid user id");

  const userWithStats = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    {
      $lookup: {
        from: "affiliatestats",
        localField: "_id",
        foreignField: "userId",
        as: "affiliateStats",
      },
    },
    { $unwind: "$affiliateStats" },
  ]);

  const record = userWithStats[0];
  if (!record) throw ApiError.notFound("No performance stats for this user");

  const saleIds: mongoose.Types.ObjectId[] = record.affiliateStats.affiliateSales ?? [];
  const sales = await Transaction.find({ _id: { $in: saleIds } }).lean();

  res.status(200).json({ user: record, sales });
});
