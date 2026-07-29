import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

class ProductStatMonthlyDatum {
  @prop() public month?: string;
  @prop() public totalSales?: number;
  @prop() public totalUnits?: number;
}

class ProductStatDailyDatum {
  @prop() public date?: string;
  @prop() public totalSales?: number;
  @prop() public totalUnits?: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class ProductStat {
  @prop() public productId?: string;
  @prop() public yearlySalesTotal?: number;
  @prop() public yearlyTotalSoldUnits?: number;
  @prop() public year?: number;
  @prop({ type: () => [ProductStatMonthlyDatum], default: [] }) public monthlyData?: ProductStatMonthlyDatum[];
  @prop({ type: () => [ProductStatDailyDatum], default: [] }) public dailyData?: ProductStatDailyDatum[];
}

export default getModelForClass(ProductStat);
