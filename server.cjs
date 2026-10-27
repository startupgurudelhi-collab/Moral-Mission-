// Universal Hostinger Root Entry Point
import('./dist/server.js').catch((err) => {
  console.error('[Hostinger Startup Error] Failed to start server:', err);
  process.exit(1);
});
