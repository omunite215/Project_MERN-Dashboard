import { Router } from "express";
import { getProducts, getCustomers, getTransactions, getGeography } from "../controllers/client.js";

const router = Router();
router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", getTransactions);
router.get("/geography", getGeography);
export default router;
