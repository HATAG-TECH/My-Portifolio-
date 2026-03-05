// server/routes/contactRoutes.js
import express from 'express';
import rateLimit from 'express-rate-limit';
import { contactController } from '../controllers/contactController.js';
import { env } from '../config/env.js';

const router = express.Router();

// Rate limiting for contact form
const contactLimiter = rateLimit({
  windowMs: env.rateLimits.contact.windowMs,
  max: env.rateLimits.contact.max,
  message: { error: 'Too many messages from this IP, please try again later.' },
  trustProxy: env.trustProxy,
  standardHeaders: true,
  legacyHeaders: false,
});

// Contact routes
router.post('/', contactLimiter, contactController.sendMessage);
router.get('/status', contactController.getStatus);

export default router;