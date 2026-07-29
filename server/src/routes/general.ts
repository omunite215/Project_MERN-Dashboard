import { Router } from "express";
import { getUser, getDashboardStats } from "../controllers/general.js";
import { validate } from "../middlewares/validate.js";
import { objectIdParam } from "../validation/common.js";

const router = Router();
router.get("/user/:id", validate({ params: objectIdParam }), getUser);
router.get("/dashboard", getDashboardStats);
export default router;
