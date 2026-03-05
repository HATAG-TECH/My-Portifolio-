// server/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import contactRoutes from './routes/contactRoutes.js';

const app = express();

// Middleware
app.use(helmet());
app.use(cors({
  origin: env.clientOrigin,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/contact', contactRoutes);

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'Server is running!',
    environment: env.nodeEnv,
    emailConfigured: env.email.configured
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;