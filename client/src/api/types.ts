export interface User {
  _id: string;
  name: string;
  email: string;
  occupation?: string;
  phoneNumber?: string;
  country?: string;
  role?: string;
  city?: string;
  state?: string;
}
export interface MonthlyDatum { month: string; totalSales: number; totalUnits: number }
export interface DailyDatum { date: string; totalSales: number; totalUnits: number }
export interface Product {
  _id: string; name: string; price: number; description: string;
  category: string; rating: number; supply: number;
  stat: Array<{ yearlySalesTotal: number; yearlyTotalSoldUnits: number }>;
}
export type Customer = User;
export type Admin = User;
export interface Transaction { _id: string; userId: string; createdAt: string; products: string[]; cost: string }
export interface TransactionsResponse { transactions: Transaction[]; total: number }
export interface GeographyDatum { id: string; value: number }
export interface Sales {
  totalCustomers: number; yearlyTotalSoldUnits: number; yearlySalesTotal: number;
  monthlyData: MonthlyDatum[]; dailyData: DailyDatum[];
  salesByCategory: Record<string, number>;
}
export interface DashboardStats extends Sales {
  thisMonthStats: MonthlyDatum; todayStats: DailyDatum; transactions: Transaction[];
}
export interface UserPerformance { user: User & { affiliateStats: unknown }; sales: Transaction[] }
