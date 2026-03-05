import rateLimit from 'express-rate-limit';
import { env } from '../config/env.js';

export const contactLimiter = rateLimit({
  windowMs: env.contactRateLimitWindowMs,
  max: env.contactRateLimitMax,
  message: { ok: false, message: 'Too many contact requests. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

export const chatLimiter = rateLimit({
  windowMs: env.chatRateLimitWindowMs,
  max: env.chatRateLimitMax,
  message: { ok: false, message: 'Too many chat requests. Slow down and try again.' },
  standardHeaders: true,
  legacyHeaders: false,
});
