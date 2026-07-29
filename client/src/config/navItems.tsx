import type { ReactNode } from "react";
import {
  HomeOutlined, ShoppingCartOutlined, Groups2Outlined, ReceiptLongOutlined,
  PublicOutlined, PointOfSaleOutlined, TodayOutlined, CalendarMonthOutlined,
  AdminPanelSettingsOutlined, TrendingUpOutlined, PieChartOutlined,
} from "@mui/icons-material";

export interface NavItem { text: string; path: string | null; icon: ReactNode | null }

export const navItems: NavItem[] = [
  { text: "Dashboard", path: "dashboard", icon: <HomeOutlined /> },
  { text: "Client Facing", path: null, icon: null },
  { text: "Products", path: "products", icon: <ShoppingCartOutlined /> },
  { text: "Customers", path: "customers", icon: <Groups2Outlined /> },
  { text: "Transactions", path: "transactions", icon: <ReceiptLongOutlined /> },
  { text: "Geography", path: "geography", icon: <PublicOutlined /> },
  { text: "Sales", path: null, icon: null },
  { text: "Overview", path: "overview", icon: <PointOfSaleOutlined /> },
  { text: "Daily", path: "daily", icon: <TodayOutlined /> },
  { text: "Monthly", path: "monthly", icon: <CalendarMonthOutlined /> },
  { text: "Breakdown", path: "breakdown", icon: <PieChartOutlined /> },
  { text: "Management", path: null, icon: null },
  { text: "Admin", path: "admin", icon: <AdminPanelSettingsOutlined /> },
  { text: "Performance", path: "performance", icon: <TrendingUpOutlined /> },
];
