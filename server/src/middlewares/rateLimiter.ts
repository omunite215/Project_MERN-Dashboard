import rateLimit from "express-rate-limit";

export const rateLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 24 hours
  max: 200,
  message: { message: "You have exceeded the 200 requests in 24 hrs limit!" },
  standardHeaders: true,
  legacyHeaders: false,
});
