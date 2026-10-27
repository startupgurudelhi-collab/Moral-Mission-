import express from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { initMysql, getDbStatus, getFullData, saveFullData, ensureMysqlTablesAndSeed } from './server/db';
import { generateMysqlDump } from './src/services/mysqlExportService';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT || 3000);

async function startServer() {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Initialize MySQL if credentials exist in environment
  try {
    const initResult = await initMysql();
    console.log(`[Database Status] ${initResult.message}`);
  } catch (e) {
    console.warn('[Database] Initial MySQL check completed with fallback active.');
  }

  // --- REST API ENDPOINTS ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'Moral Mission Foundation API', time: new Date().toISOString() });
  });

  // DB Status
  app.get('/api/db/status', (req, res) => {
    res.json(getDbStatus());
  });

  // Test / Configure MySQL from Admin UI
  app.post('/api/db/connect', async (req, res) => {
    try {
      const { host, port, user, password, database } = req.body;
      const result = await initMysql({ host, port: Number(port), user, password, database });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message || 'Error connecting to MySQL' });
    }
  });

  // Re-run table setup & seed in MySQL
  app.post('/api/db/init-tables', async (req, res) => {
    try {
      await ensureMysqlTablesAndSeed();
      res.json({ success: true, message: 'MySQL tables created and seeded successfully.' });
    } catch (err: any) {
      res.status(500).json({ success: false, message: err.message });
    }
  });

  // Get all data
  app.get('/api/data', async (req, res) => {
    try {
      const data = await getFullData();
      res.json(data);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Save all data
  app.post('/api/data', async (req, res) => {
    try {
      await saveFullData(req.body);
      res.json({ success: true, message: 'Data saved successfully to database.' });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Direct SQL Dump Export download
  app.get('/api/export-sql', (req, res) => {
    try {
      const sql = generateMysqlDump();
      res.setHeader('Content-Type', 'text/sql');
      res.setHeader('Content-Disposition', 'attachment; filename="moral_mission_foundation.sql"');
      res.send(sql);
    } catch (err: any) {
      res.status(500).send('Error generating SQL dump: ' + err.message);
    }
  });

  // Frontend Serving: Development vs Production (Hostinger)
  if (!isProduction) {
    // Development mode with Vite Middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production Mode (Hostinger deployment)
    // Locate the dist folder whether running from root or from inside dist/
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      distPath = path.join(__dirname);
    }
    if (!fs.existsSync(distPath)) {
      distPath = path.join(__dirname, '..', 'dist');
    }

    console.log(`[Hostinger Production] Serving static frontend from: ${distPath}`);

    app.use(express.static(distPath));

    app.get('*', (req, res) => {
      const indexPath = path.join(distPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send('Application build not found. Please run npm run build.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Moral Mission Foundation] Server listening on http://0.0.0.0:${PORT} (Mode: ${isProduction ? 'Production' : 'Development'})`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error] Failed to start server:', err);
  process.exit(1);
});
