import rateLimit from "express-rate-limit";

/**
 * Basic brute-force protection rate limiter:
 * 5 login attempts per 15 minutes per IP address.
 */
export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 login requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  statusCode: 429,
  message: {
    success: false,
    message: "Too many login attempts. Please try again after 15 minutes.",
  },
});

