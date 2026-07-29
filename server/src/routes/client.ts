import { Router } from "express";
import { getProducts, getCustomers, getTransactions, getGeography } from "../controllers/client.js";
import { validate } from "../middlewares/validate.js";
import { transactionQuerySchema } from "../validation/transaction.js";

const router = Router();
router.get("/products", getProducts);
router.get("/customers", getCustomers);
router.get("/transactions", validate({ query: transactionQuerySchema }), getTransactions);
router.get("/geography", getGeography);
export default router;
