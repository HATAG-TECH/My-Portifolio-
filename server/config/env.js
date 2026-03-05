import dotenv from 'dotenv';

dotenv.config();

function toNumber(value, fallback) {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
}

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  dataDir: process.env.DATA_DIR || 'server/data',
  backupDir: process.env.BACKUP_DIR || 'server/backups',
  contactEmailUser: process.env.CONTACT_EMAIL_USER || '',
  contactEmailPass: process.env.CONTACT_EMAIL_PASS || '',
  contactEmailTo: process.env.CONTACT_EMAIL_TO || '',
  contactRateLimitMax: toNumber(process.env.CONTACT_RATE_LIMIT_MAX, 5),
  contactRateLimitWindowMs: toNumber(process.env.CONTACT_RATE_LIMIT_WINDOW_MS, 60 * 60 * 1000),
  chatRateLimitMax: toNumber(process.env.CHAT_RATE_LIMIT_MAX, 40),
  chatRateLimitWindowMs: toNumber(process.env.CHAT_RATE_LIMIT_WINDOW_MS, 15 * 60 * 1000),
  githubUsername: process.env.GITHUB_USERNAME || '',
  githubRepo: process.env.GITHUB_REPO || '',
  linkedinFollowers: process.env.LINKEDIN_FOLLOWERS || '',
  trustProxy: process.env.TRUST_PROXY === 'true',
};
