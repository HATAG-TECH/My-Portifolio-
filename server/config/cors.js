import cors from 'cors';
import { env } from './env.js';

export const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin) return callback(null, true);
    if (origin === env.clientOrigin) return callback(null, true);
    return callback(new Error('CORS blocked for this origin'));
  },
  methods: ['GET', 'POST'],
  credentials: true,
});
