import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import User from "../models/User.js";
import OverallStat from "../models/OverallStat.js";
import Transaction from "../models/Transaction.js";

export const getUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id).select("-password").lean();
  if (!user) throw ApiError.notFound("User not found");
  res.status(200).json(user);
});

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const currentMonth = "November";
  const currentYear = 2021;
  const currentDate = "2021-11-15";

  const transactions = await Transaction.find().limit(50).sort({ createdAt: -1 }).lean();
  const overall = await OverallStat.findOne({ year: currentYear }).lean();
  if (!overall) throw ApiError.notFound("Overall stats not found for the requested year");

  const { totalCustomers, yearlyTotalSoldUnits, yearlySalesTotal, monthlyData, salesByCategory } = overall;
  const thisMonthStats = overall.monthlyData?.find((m) => m.month === currentMonth);
  const todayStats = overall.dailyData?.find((d) => d.date === currentDate);

  res.status(200).json({
    totalCustomers, yearlyTotalSoldUnits, yearlySalesTotal, monthlyData,
    salesByCategory, thisMonthStats, todayStats, transactions,
  });
});
