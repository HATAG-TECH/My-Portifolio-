import app from './app.js';
import { env } from './config/env.js';
import { initializeStore } from './models/jsonStore.js';

async function startServer() {
  await initializeStore();

  if (env.trustProxy) {
    app.set('trust proxy', 1);
  }

  app.listen(env.port, () => {
    console.log(`Portfolio API listening on http://localhost:${env.port}`);
  });
}

startServer().catch((error) => {
  console.error('Server startup failed', error);
  process.exit(1);
});
