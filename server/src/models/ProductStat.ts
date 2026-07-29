import mongoose, { type InferSchemaType } from "mongoose";

const ProductStatSchema = new mongoose.Schema(
  {
    productId: String,
    yearlySalesTotal: Number,
    yearlyTotalSoldUnits: Number,
    year: Number,
    monthlyData: [{ month: String, totalSales: Number, totalUnits: Number }],
    dailyData: [{ date: String, totalSales: Number, totalUnits: Number }],
  },
  { timestamps: true }
);

export type IProductStat = InferSchemaType<typeof ProductStatSchema>;
export default mongoose.model("ProductStat", ProductStatSchema);
