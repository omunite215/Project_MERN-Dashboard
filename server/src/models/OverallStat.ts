import mongoose, { type InferSchemaType } from "mongoose";

const OverallStatSchema = new mongoose.Schema(
  {
    totalCustomers: Number,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [{ month: String, totalSales: Number, totalUnits: Number }],
    dailyData: [{ date: String, totalSales: Number, totalUnits: Number }],
    salesByCategory: { type: Map, of: Number },
  },
  { timestamps: true }
);

export type IOverallStat = InferSchemaType<typeof OverallStatSchema>;
export default mongoose.model("OverallStat", OverallStatSchema);
