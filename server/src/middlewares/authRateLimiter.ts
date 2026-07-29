import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 20,
  message: { message: "Too many auth attempts, try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});
