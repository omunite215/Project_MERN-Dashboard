import type { ReactElement } from "react";
import {
  createRootRoute, createRoute, createRouter, redirect, Outlet,
} from "@tanstack/react-router";
import Layout from "@/scenes/layout";
import Dashboard from "@/scenes/dashboard";
import Products from "@/scenes/products";
import Customers from "@/scenes/customers";
import Transactions from "@/scenes/transactions";
import Geography from "@/scenes/geography";
import Overview from "@/scenes/overview";
import Daily from "@/scenes/daily";
import Monthly from "@/scenes/monthly";
import Breakdown from "@/scenes/breakdown";
import Admin from "@/scenes/admin";
import Performance from "@/scenes/performance";

const rootRoute = createRootRoute({ component: Outlet });

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "layout",
  component: Layout,
});

const indexRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: "/",
  beforeLoad: () => { throw redirect({ to: "/dashboard" as "/" }); },
});

function child(path: string, component: () => ReactElement) {
  return createRoute({ getParentRoute: () => layoutRoute, path, component });
}

const routes = [
  indexRoute,
  child("/dashboard", Dashboard),
  child("/products", Products),
  child("/customers", Customers),
  child("/transactions", Transactions),
  child("/geography", Geography),
  child("/overview", Overview),
  child("/daily", Daily),
  child("/monthly", Monthly),
  child("/breakdown", Breakdown),
  child("/admin", Admin),
  child("/performance", Performance),
];

const routeTree = rootRoute.addChildren([layoutRoute.addChildren(routes)]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register { router: typeof router }
}
