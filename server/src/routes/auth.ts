import { Router } from "express";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/authenticate.js";
import { authRateLimiter } from "../middlewares/authRateLimiter.js";
import { registerSchema, loginSchema } from "../validation/auth.js";
import { register, login, refresh, logout, me } from "../controllers/auth.js";

const router = Router();
router.post("/register", authRateLimiter, validate({ body: registerSchema }), register);
router.post("/login", authRateLimiter, validate({ body: loginSchema }), login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authenticate, me);
export default router;
