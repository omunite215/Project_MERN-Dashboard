import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { apiGet } from "./http";
import { USER_ID } from "@/config/constants";
import type {
  User, Product, Customer, TransactionsResponse, GeographyDatum,
  Sales, Admin, UserPerformance, DashboardStats,
} from "./types";

export const useUser = (id: string = USER_ID) =>
  useQuery({ queryKey: ["user", id], queryFn: () => apiGet<User>(`general/user/${id}`) });

export const useProducts = () =>
  useQuery({ queryKey: ["products"], queryFn: () => apiGet<Product[]>("products") });

export const useCustomers = () =>
  useQuery({ queryKey: ["customers"], queryFn: () => apiGet<Customer[]>("client/customers") });

export const useTransactions = (args: {
  page: number; pageSize: number; sort: string | null; search: string;
}) =>
  useQuery({
    queryKey: ["transactions", args],
    queryFn: () =>
      apiGet<TransactionsResponse>("client/transactions", {
        page: args.page + 1, // DataGrid is 0-indexed; API is 1-indexed
        pageSize: args.pageSize,
        sort: args.sort,
        search: args.search,
      }),
    placeholderData: keepPreviousData,
  });

export const useGeography = () =>
  useQuery({ queryKey: ["geography"], queryFn: () => apiGet<GeographyDatum[]>("client/geography") });

export const useSales = () =>
  useQuery({ queryKey: ["sales"], queryFn: () => apiGet<Sales>("sales/sales") });

export const useAdmins = () =>
  useQuery({ queryKey: ["admins"], queryFn: () => apiGet<Admin[]>("management/admins") });

export const useUserPerformance = (id: string) =>
  useQuery({ queryKey: ["performance", id], queryFn: () => apiGet<UserPerformance>(`management/performance/${id}`) });

export const useDashboard = () =>
  useQuery({ queryKey: ["dashboard"], queryFn: () => apiGet<DashboardStats>("general/dashboard") });
