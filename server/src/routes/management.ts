import { Router } from "express";
import { getAdmins, getUserPerformance } from "../controllers/management.js";
import { validate } from "../middlewares/validate.js";
import { objectIdParam } from "../validation/common.js";

const router = Router();
router.get("/admins", getAdmins);
router.get("/performance/:id", validate({ params: objectIdParam }), getUserPerformance);
export default router;
