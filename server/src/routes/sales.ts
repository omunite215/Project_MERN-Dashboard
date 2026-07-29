import { Router } from "express";
import { getSales } from "../controllers/sales.js";

const router = Router();
router.get("/sales", getSales);
export default router;
