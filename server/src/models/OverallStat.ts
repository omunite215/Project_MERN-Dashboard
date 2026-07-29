import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose";

class OverallStatMonthlyDatum {
  @prop() public month?: string;
  @prop() public totalSales?: number;
  @prop() public totalUnits?: number;
}

class OverallStatDailyDatum {
  @prop() public date?: string;
  @prop() public totalSales?: number;
  @prop() public totalUnits?: number;
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class OverallStat {
  @prop() public totalCustomers?: number;
  @prop() public yearlySalesTotal?: number;
  @prop() public yearlyTotalSoldUnits?: number;
  @prop() public year?: number;
  @prop({ type: () => [OverallStatMonthlyDatum], default: [] }) public monthlyData?: OverallStatMonthlyDatum[];
  @prop({ type: () => [OverallStatDailyDatum], default: [] }) public dailyData?: OverallStatDailyDatum[];
  @prop({ type: () => Number }) public salesByCategory?: Map<string, number>;
}

export default getModelForClass(OverallStat);
