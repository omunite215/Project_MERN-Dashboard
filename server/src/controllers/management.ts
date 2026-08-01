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
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  if (!mongoose.isValidObjectId(id)) throw ApiError.badRequest("Invalid user id");

  const userWithStats = await User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    { $project: { password: 0 } }, // aggregation ignores select:false — strip the hash explicitly
    {
      $lookup: {
        from: "affiliatestats",
        localField: "_id",
        foreignField: "userId",
        as: "affiliateStats",
      },
    },
    // preserveNullAndEmptyArrays: keep the user even with no affiliate stats so the
    // page renders an empty state (0 sales) instead of a 404 error.
    { $unwind: { path: "$affiliateStats", preserveNullAndEmptyArrays: true } },
  ]);

  const record = userWithStats[0];
  if (!record) throw ApiError.notFound("User not found");

  const saleIds: mongoose.Types.ObjectId[] = record.affiliateStats?.affiliateSales ?? [];
  let source: "affiliate" | "transactions" = "affiliate";
  let sales = saleIds.length
    ? await Transaction.find({ _id: { $in: saleIds } }).lean()
    : [];

  // Fallback: users without affiliate stats (e.g. admins) still get meaningful data —
  // their own purchase transactions — instead of an all-zero empty state.
  if (sales.length === 0) {
    source = "transactions";
    sales = await Transaction.find({ userId: id }).lean();
  }

  res.status(200).json({ user: record, sales, source });
});
