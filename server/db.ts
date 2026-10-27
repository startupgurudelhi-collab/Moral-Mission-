import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import {
  initialSiteSettings,
  initialProjects,
  initialActivities,
  initialGallery,
  initialBoardMembers,
  initialDonations,
  initialInquiries,
  initialPageContent,
} from '../src/data/initialData';

dotenv.config();

export interface DbConfig {
  host?: string;
  port?: number;
  user?: string;
  password?: string;
  database?: string;
}

// Global active MySQL pool
let pool: mysql.Pool | null = null;
let isConnectedToMysql = false;
let lastDbError: string | null = null;

// Local persistent file fallback path
const dataDir = path.join(process.cwd(), 'server', 'data');
const jsonDbPath = path.join(dataDir, 'store.json');

function ensureDataDir() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

export function readLocalStore(): any {
  ensureDataDir();
  if (fs.existsSync(jsonDbPath)) {
    try {
      const raw = fs.readFileSync(jsonDbPath, 'utf-8');
      return JSON.parse(raw);
    } catch (e) {
      console.error('Error reading local JSON store:', e);
    }
  }

  // Fallback initial data
  const initial = {
    settings: initialSiteSettings,
    projects: initialProjects,
    activities: initialActivities,
    gallery: initialGallery,
    boardMembers: initialBoardMembers,
    donations: initialDonations,
    inquiries: initialInquiries,
    pageContent: initialPageContent,
  };
  writeLocalStore(initial);
  return initial;
}

export function writeLocalStore(data: any): void {
  ensureDataDir();
  fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf-8');
}

export async function initMysql(config?: DbConfig): Promise<{ success: boolean; message: string }> {
  const host = config?.host || process.env.MYSQL_HOST || 'localhost';
  const port = Number(config?.port || process.env.MYSQL_PORT || 3306);
  const user = config?.user || process.env.MYSQL_USER || process.env.DB_USER || '';
  const password = config?.password || process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '';
  const database = config?.database || process.env.MYSQL_DATABASE || process.env.DB_NAME || '';

  if (!user || !database) {
    isConnectedToMysql = false;
    lastDbError = 'MySQL credentials not fully provided. Operating with persistent local storage.';
    return {
      success: false,
      message: 'MySQL USER or DATABASE is not set. Operating in resilient storage mode.',
    };
  }

  try {
    if (pool) {
      await pool.end();
    }

    pool = mysql.createPool({
      host,
      port,
      user,
      password,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test ping
    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();

    isConnectedToMysql = true;
    lastDbError = null;

    // Ensure MySQL tables exist and seed if empty
    await ensureMysqlTablesAndSeed();

    return {
      success: true,
      message: `Successfully connected to MySQL database: ${database}@${host}:${port}`,
    };
  } catch (err: any) {
    isConnectedToMysql = false;
    lastDbError = err.message || String(err);
    console.warn(`[MySQL Warning] Could not connect to MySQL: ${lastDbError}. Using persistent local fallback.`);
    return {
      success: false,
      message: `MySQL Connection Failed: ${lastDbError}. Local fallback active.`,
    };
  }
}

export async function ensureMysqlTablesAndSeed(): Promise<void> {
  if (!pool || !isConnectedToMysql) return;

  const conn = await pool.getConnection();
  try {
    // 1. Settings
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_site_settings\` (
        \`id\` INT PRIMARY KEY DEFAULT 1,
        \`data_json\` LONGTEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Projects
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_projects\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`short_desc\` TEXT,
        \`full_desc\` LONGTEXT,
        \`target_amount\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        \`raised_amount\` DECIMAL(15,2) NOT NULL DEFAULT 0.00,
        \`donors_count\` INT NOT NULL DEFAULT 0,
        \`beneficiaries\` VARCHAR(255),
        \`location\` VARCHAR(255),
        \`image_url\` TEXT,
        \`status\` VARCHAR(50) DEFAULT 'Active',
        \`start_date\` VARCHAR(50),
        \`featured\` TINYINT(1) DEFAULT 0,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Activities
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_activities\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`date\` VARCHAR(50) NOT NULL,
        \`location\` VARCHAR(255),
        \`volunteers_count\` INT DEFAULT 0,
        \`beneficiaries_count\` INT DEFAULT 0,
        \`summary\` TEXT,
        \`details\` LONGTEXT,
        \`image_url\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Gallery
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_gallery\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`title\` VARCHAR(255) NOT NULL,
        \`category\` VARCHAR(100) NOT NULL,
        \`image_url\` TEXT NOT NULL,
        \`location\` VARCHAR(255),
        \`date\` VARCHAR(50),
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Board Members
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_board_members\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`role\` VARCHAR(150),
        \`qualification\` VARCHAR(255),
        \`bio\` TEXT,
        \`image_url\` TEXT,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Donations
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_donations\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`receipt_number\` VARCHAR(100) NOT NULL UNIQUE,
        \`donor_name\` VARCHAR(255) NOT NULL,
        \`donor_email\` VARCHAR(150),
        \`donor_phone\` VARCHAR(50),
        \`donor_pan\` VARCHAR(20) NOT NULL,
        \`donor_address\` TEXT,
        \`donor_state\` VARCHAR(100),
        \`amount\` DECIMAL(15,2) NOT NULL,
        \`payment_method\` VARCHAR(100),
        \`transaction_id\` VARCHAR(150),
        \`project_id\` VARCHAR(64),
        \`project_name\` VARCHAR(255),
        \`date\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'Completed',
        \`tax_exemption_claimed\` TINYINT(1) DEFAULT 1,
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 7. Contact Inquiries
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_contact_inquiries\` (
        \`id\` VARCHAR(64) PRIMARY KEY,
        \`name\` VARCHAR(255) NOT NULL,
        \`email\` VARCHAR(150) NOT NULL,
        \`phone\` VARCHAR(50),
        \`subject\` VARCHAR(255),
        \`message\` LONGTEXT,
        \`date\` VARCHAR(50) NOT NULL,
        \`status\` VARCHAR(50) DEFAULT 'New',
        \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 8. Page Content
    await conn.query(`
      CREATE TABLE IF NOT EXISTS \`moral_page_content\` (
        \`id\` INT PRIMARY KEY DEFAULT 1,
        \`data_json\` LONGTEXT NOT NULL,
        \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // Check if initial seeding is needed
    const [settingsRows]: any = await conn.query('SELECT id FROM `moral_site_settings` WHERE id = 1');
    if (!settingsRows || settingsRows.length === 0) {
      console.log('[MySQL] Seeding initial data into moral_site_settings...');
      await conn.query('INSERT INTO `moral_site_settings` (id, data_json) VALUES (1, ?)', [
        JSON.stringify(initialSiteSettings),
      ]);
    }

    const [projRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_projects`');
    if (projRows[0]?.count === 0) {
      console.log('[MySQL] Seeding initial data into moral_projects...');
      for (const p of initialProjects) {
        await conn.query(
          `INSERT INTO \`moral_projects\` (id, title, category, short_desc, full_desc, target_amount, raised_amount, donors_count, beneficiaries, location, image_url, status, start_date, featured)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            p.id,
            p.title,
            p.category,
            p.shortDesc,
            p.fullDesc,
            p.targetAmount,
            p.raisedAmount,
            p.donorsCount,
            p.beneficiaries,
            p.location,
            p.imageUrl,
            p.status,
            p.startDate,
            p.featured ? 1 : 0,
          ]
        );
      }
    }

    const [actRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_activities`');
    if (actRows[0]?.count === 0) {
      for (const a of initialActivities) {
        await conn.query(
          `INSERT INTO \`moral_activities\` (id, title, category, date, location, volunteers_count, beneficiaries_count, summary, details, image_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            a.id,
            a.title,
            a.category,
            a.date,
            a.location,
            a.volunteersCount,
            a.beneficiariesCount,
            a.summary,
            a.details,
            a.imageUrl,
          ]
        );
      }
    }

    const [galRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_gallery`');
    if (galRows[0]?.count === 0) {
      for (const g of initialGallery) {
        await conn.query(
          `INSERT INTO \`moral_gallery\` (id, title, category, image_url, location, date)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [g.id, g.title, g.category, g.imageUrl, g.location, g.date]
        );
      }
    }

    const [boardRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_board_members`');
    if (boardRows[0]?.count === 0) {
      for (const b of initialBoardMembers) {
        await conn.query(
          `INSERT INTO \`moral_board_members\` (id, name, role, qualification, bio, image_url)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [b.id, b.name, b.role, b.qualification, b.bio, b.imageUrl]
        );
      }
    }

    const [donRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_donations`');
    if (donRows[0]?.count === 0) {
      for (const d of initialDonations) {
        await conn.query(
          `INSERT INTO \`moral_donations\` (id, receipt_number, donor_name, donor_email, donor_phone, donor_pan, donor_address, donor_state, amount, payment_method, transaction_id, project_id, project_name, date, status, tax_exemption_claimed)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            d.id,
            d.receiptNumber,
            d.donorName,
            d.donorEmail,
            d.donorPhone,
            d.donorPan,
            d.donorAddress,
            d.donorState,
            d.amount,
            d.paymentMethod,
            d.transactionId,
            d.projectId || '',
            d.projectName || '',
            d.date,
            d.status,
            d.taxExemptionClaimed ? 1 : 0,
          ]
        );
      }
    }

    const [inqRows]: any = await conn.query('SELECT COUNT(*) as count FROM `moral_contact_inquiries`');
    if (inqRows[0]?.count === 0) {
      for (const i of initialInquiries) {
        await conn.query(
          `INSERT INTO \`moral_contact_inquiries\` (id, name, email, phone, subject, message, date, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [i.id, i.name, i.email, i.phone, i.subject, i.message, i.date, i.status]
        );
      }
    }

    const [contentRows]: any = await conn.query('SELECT id FROM `moral_page_content` WHERE id = 1');
    if (!contentRows || contentRows.length === 0) {
      await conn.query('INSERT INTO `moral_page_content` (id, data_json) VALUES (1, ?)', [
        JSON.stringify(initialPageContent),
      ]);
    }

    console.log('[MySQL] All 8 tables verified & seeded successfully.');
  } finally {
    conn.release();
  }
}

export async function getFullData(): Promise<any> {
  if (pool && isConnectedToMysql) {
    const conn = await pool.getConnection();
    try {
      const [settingsRows]: any = await conn.query('SELECT data_json FROM `moral_site_settings` WHERE id = 1');
      const settings = settingsRows[0]?.data_json ? JSON.parse(settingsRows[0].data_json) : initialSiteSettings;

      const [projectsRows]: any = await conn.query('SELECT * FROM `moral_projects` ORDER BY created_at DESC');
      const projects = projectsRows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        shortDesc: r.short_desc,
        fullDesc: r.full_desc,
        targetAmount: Number(r.target_amount),
        raisedAmount: Number(r.raised_amount),
        donorsCount: Number(r.donors_count),
        beneficiaries: r.beneficiaries,
        location: r.location,
        imageUrl: r.image_url,
        status: r.status,
        startDate: r.start_date,
        featured: Boolean(r.featured),
      }));

      const [actRows]: any = await conn.query('SELECT * FROM `moral_activities` ORDER BY date DESC');
      const activities = actRows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        date: r.date,
        location: r.location,
        volunteersCount: Number(r.volunteers_count),
        beneficiariesCount: Number(r.beneficiaries_count),
        summary: r.summary,
        details: r.details,
        imageUrl: r.image_url,
      }));

      const [galRows]: any = await conn.query('SELECT * FROM `moral_gallery` ORDER BY id DESC');
      const gallery = galRows.map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        imageUrl: r.image_url,
        location: r.location,
        date: r.date,
      }));

      const [boardRows]: any = await conn.query('SELECT * FROM `moral_board_members` ORDER BY id ASC');
      const boardMembers = boardRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        role: r.role,
        qualification: r.qualification,
        bio: r.bio,
        imageUrl: r.image_url,
      }));

      const [donRows]: any = await conn.query('SELECT * FROM `moral_donations` ORDER BY date DESC');
      const donations = donRows.map((r: any) => ({
        id: r.id,
        receiptNumber: r.receipt_number,
        donorName: r.donor_name,
        donorEmail: r.donor_email,
        donorPhone: r.donor_phone,
        donorPan: r.donor_pan,
        donorAddress: r.donor_address,
        donorState: r.donor_state,
        amount: Number(r.amount),
        paymentMethod: r.payment_method,
        transactionId: r.transaction_id,
        projectId: r.project_id,
        projectName: r.project_name,
        date: r.date,
        status: r.status,
        taxExemptionClaimed: Boolean(r.tax_exemption_claimed),
      }));

      const [inqRows]: any = await conn.query('SELECT * FROM `moral_contact_inquiries` ORDER BY date DESC');
      const inquiries = inqRows.map((r: any) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        phone: r.phone,
        subject: r.subject,
        message: r.message,
        date: r.date,
        status: r.status,
      }));

      const [contentRows]: any = await conn.query('SELECT data_json FROM `moral_page_content` WHERE id = 1');
      const pageContent = contentRows[0]?.data_json ? JSON.parse(contentRows[0].data_json) : initialPageContent;

      return {
        settings,
        projects,
        activities,
        gallery,
        boardMembers,
        donations,
        inquiries,
        pageContent,
      };
    } finally {
      conn.release();
    }
  }

  // Fallback to local store
  return readLocalStore();
}

export async function saveFullData(data: any): Promise<void> {
  // Always update local store first
  writeLocalStore(data);

  // If MySQL is active, sync into MySQL
  if (pool && isConnectedToMysql) {
    const conn = await pool.getConnection();
    try {
      if (data.settings) {
        await conn.query('REPLACE INTO `moral_site_settings` (id, data_json) VALUES (1, ?)', [
          JSON.stringify(data.settings),
        ]);
      }
      if (data.pageContent) {
        await conn.query('REPLACE INTO `moral_page_content` (id, data_json) VALUES (1, ?)', [
          JSON.stringify(data.pageContent),
        ]);
      }
      if (Array.isArray(data.projects)) {
        await conn.query('DELETE FROM `moral_projects`');
        for (const p of data.projects) {
          await conn.query(
            `INSERT INTO \`moral_projects\` (id, title, category, short_desc, full_desc, target_amount, raised_amount, donors_count, beneficiaries, location, image_url, status, start_date, featured)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              p.id,
              p.title,
              p.category,
              p.shortDesc,
              p.fullDesc,
              p.targetAmount,
              p.raisedAmount,
              p.donorsCount,
              p.beneficiaries,
              p.location,
              p.imageUrl,
              p.status,
              p.startDate,
              p.featured ? 1 : 0,
            ]
          );
        }
      }
      if (Array.isArray(data.activities)) {
        await conn.query('DELETE FROM `moral_activities`');
        for (const a of data.activities) {
          await conn.query(
            `INSERT INTO \`moral_activities\` (id, title, category, date, location, volunteers_count, beneficiaries_count, summary, details, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              a.id,
              a.title,
              a.category,
              a.date,
              a.location,
              a.volunteersCount,
              a.beneficiariesCount,
              a.summary,
              a.details,
              a.imageUrl,
            ]
          );
        }
      }
      if (Array.isArray(data.gallery)) {
        await conn.query('DELETE FROM `moral_gallery`');
        for (const g of data.gallery) {
          await conn.query(
            `INSERT INTO \`moral_gallery\` (id, title, category, image_url, location, date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [g.id, g.title, g.category, g.imageUrl, g.location, g.date]
          );
        }
      }
      if (Array.isArray(data.boardMembers)) {
        await conn.query('DELETE FROM `moral_board_members`');
        for (const b of data.boardMembers) {
          await conn.query(
            `INSERT INTO \`moral_board_members\` (id, name, role, qualification, bio, image_url)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [b.id, b.name, b.role, b.qualification, b.bio, b.imageUrl]
          );
        }
      }
      if (Array.isArray(data.donations)) {
        await conn.query('DELETE FROM `moral_donations`');
        for (const d of data.donations) {
          await conn.query(
            `INSERT INTO \`moral_donations\` (id, receipt_number, donor_name, donor_email, donor_phone, donor_pan, donor_address, donor_state, amount, payment_method, transaction_id, project_id, project_name, date, status, tax_exemption_claimed)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              d.id,
              d.receiptNumber,
              d.donorName,
              d.donorEmail,
              d.donorPhone,
              d.donorPan,
              d.donorAddress,
              d.donorState,
              d.amount,
              d.paymentMethod,
              d.transactionId,
              d.projectId || '',
              d.projectName || '',
              d.date,
              d.status,
              d.taxExemptionClaimed ? 1 : 0,
            ]
          );
        }
      }
      if (Array.isArray(data.inquiries)) {
        await conn.query('DELETE FROM `moral_contact_inquiries`');
        for (const i of data.inquiries) {
          await conn.query(
            `INSERT INTO \`moral_contact_inquiries\` (id, name, email, phone, subject, message, date, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [i.id, i.name, i.email, i.phone, i.subject, i.message, i.date, i.status]
          );
        }
      }
    } finally {
      conn.release();
    }
  }
}

export function getDbStatus(): any {
  return {
    mode: isConnectedToMysql ? 'mysql' : 'local_storage',
    isConnectedToMysql,
    host: process.env.MYSQL_HOST || 'localhost',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'Not Configured',
    user: process.env.MYSQL_USER || process.env.DB_USER || 'Not Configured',
    lastError: lastDbError,
  };
}
