import type { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import OverallStat from "../models/OverallStat.js";

export const getSales = asyncHandler(async (_req: Request, res: Response) => {
  const overall = await OverallStat.findOne().lean();
  if (!overall) throw ApiError.notFound("No overall stats found");
  res.status(200).json(overall);
});
