import { storageService } from './storageService';

function escapeSql(str: string | number | boolean | null | undefined): string {
  if (str === null || str === undefined) return 'NULL';
  if (typeof str === 'number') return String(str);
  if (typeof str === 'boolean') return str ? '1' : '0';
  const escaped = String(str)
    .replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, (char) => {
      switch (char) {
        case '\0': return '\\0';
        case '\x08': return '\\b';
        case '\x09': return '\\t';
        case '\x1a': return '\\z';
        case '\n': return '\\n';
        case '\r': return '\\r';
        case '"':
        case "'":
        case '\\':
        case '%':
          return '\\' + char;
        default:
          return char;
      }
    });
  return `'${escaped}'`;
}

export function generateMysqlDump(): string {
  const settings = storageService.getSettings();
  const projects = storageService.getProjects();
  const activities = storageService.getActivities();
  const gallery = storageService.getGallery();
  const board = storageService.getBoardMembers();
  const donations = storageService.getDonations();
  const inquiries = storageService.getInquiries();
  const content = storageService.getPageContent();

  const timestamp = new Date().toISOString();

  let sql = `-- ============================================================
-- Moral Mission Foundation (नैतिक मिशन फाउंडेशन)
-- Official MySQL Database Schema & Data Dump
-- Generated on: ${timestamp}
-- Compatible with: MySQL 5.7+, MySQL 8.0+, MariaDB 10.3+
-- Engine: InnoDB | Character Set: utf8mb4 | Collation: utf8mb4_unicode_ci
-- ============================================================

CREATE DATABASE IF NOT EXISTS \`moral_mission_db\` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE \`moral_mission_db\`;

SET FOREIGN_KEY_CHECKS = 0;

-- ------------------------------------------------------------
-- 1. Table structure for table \`moral_site_settings\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_site_settings\`;
CREATE TABLE \`moral_site_settings\` (
  \`id\` INT AUTO_INCREMENT PRIMARY KEY,
  \`org_name\` VARCHAR(255) NOT NULL,
  \`org_hindi_name\` VARCHAR(255) DEFAULT '',
  \`tagline\` TEXT,
  \`logo_url\` TEXT,
  \`phone\` VARCHAR(50),
  \`alt_phone\` VARCHAR(50),
  \`whatsapp\` VARCHAR(50),
  \`email\` VARCHAR(100),
  \`donation_email\` VARCHAR(100),
  \`registered_address\` TEXT,
  \`work_office_address\` TEXT,
  \`darpan_id\` VARCHAR(100),
  \`registration_number\` VARCHAR(100),
  \`section_12a\` VARCHAR(100),
  \`section_80g\` VARCHAR(100),
  \`csr_number\` VARCHAR(100),
  \`pan_number\` VARCHAR(50),
  \`beneficiary_name\` VARCHAR(255),
  \`bank_name\` VARCHAR(255),
  \`account_number\` VARCHAR(100),
  \`ifsc_code\` VARCHAR(50),
  \`branch_name\` VARCHAR(255),
  \`upi_id\` VARCHAR(100),
  \`upi_qr_note\` TEXT,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`moral_site_settings\` (
  \`org_name\`, \`org_hindi_name\`, \`tagline\`, \`logo_url\`, \`phone\`, \`alt_phone\`, \`whatsapp\`,
  \`email\`, \`donation_email\`, \`registered_address\`, \`work_office_address\`,
  \`darpan_id\`, \`registration_number\`, \`section_12a\`, \`section_80g\`, \`csr_number\`, \`pan_number\`,
  \`beneficiary_name\`, \`bank_name\`, \`account_number\`, \`ifsc_code\`, \`branch_name\`, \`upi_id\`, \`upi_qr_note\`
) VALUES (
  ${escapeSql(settings.orgName)},
  ${escapeSql(settings.orgHindiName)},
  ${escapeSql(settings.tagline)},
  ${escapeSql(settings.logoUrl)},
  ${escapeSql(settings.phone)},
  ${escapeSql(settings.altPhone)},
  ${escapeSql(settings.whatsapp)},
  ${escapeSql(settings.email)},
  ${escapeSql(settings.donationEmail)},
  ${escapeSql(settings.registeredAddress)},
  ${escapeSql(settings.workOfficeAddress)},
  ${escapeSql(settings.darpanId)},
  ${escapeSql(settings.registrationNumber)},
  ${escapeSql(settings.section12A)},
  ${escapeSql(settings.section80G)},
  ${escapeSql(settings.csrNumber)},
  ${escapeSql(settings.panNumber)},
  ${escapeSql(settings.beneficiaryName)},
  ${escapeSql(settings.bankName)},
  ${escapeSql(settings.accountNumber)},
  ${escapeSql(settings.ifscCode)},
  ${escapeSql(settings.branchName)},
  ${escapeSql(settings.upiId)},
  ${escapeSql(settings.upiQrNote)}
);

-- ------------------------------------------------------------
-- 2. Table structure for table \`moral_master_banners\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_master_banners\`;
CREATE TABLE \`moral_master_banners\` (
  \`page_key\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`subtitle\` TEXT,
  \`bg_image\` TEXT,
  \`breadcrumb\` VARCHAR(100),
  \`badge\` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  Object.entries(settings.banners).forEach(([key, b]) => {
    sql += `INSERT INTO \`moral_master_banners\` (\`page_key\`, \`title\`, \`subtitle\`, \`bg_image\`, \`breadcrumb\`, \`badge\`)
VALUES (${escapeSql(key)}, ${escapeSql(b.title)}, ${escapeSql(b.subtitle)}, ${escapeSql(b.bgImage)}, ${escapeSql(b.breadcrumb || '')}, ${escapeSql(b.badge || '')});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 3. Table structure for table \`moral_projects\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_projects\`;
CREATE TABLE \`moral_projects\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
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
  \`status\` ENUM('Active', 'Urgent', 'Completed') DEFAULT 'Active',
  \`start_date\` DATE,
  \`featured\` TINYINT(1) DEFAULT 0,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  projects.forEach((p) => {
    sql += `INSERT INTO \`moral_projects\` (\`id\`, \`title\`, \`category\`, \`short_desc\`, \`full_desc\`, \`target_amount\`, \`raised_amount\`, \`donors_count\`, \`beneficiaries\`, \`location\`, \`image_url\`, \`status\`, \`start_date\`, \`featured\`)
VALUES (${escapeSql(p.id)}, ${escapeSql(p.title)}, ${escapeSql(p.category)}, ${escapeSql(p.shortDesc)}, ${escapeSql(p.fullDesc)}, ${p.targetAmount}, ${p.raisedAmount}, ${p.donorsCount}, ${escapeSql(p.beneficiaries)}, ${escapeSql(p.location)}, ${escapeSql(p.imageUrl)}, ${escapeSql(p.status)}, ${escapeSql(p.startDate)}, ${p.featured ? 1 : 0});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 4. Table structure for table \`moral_activities\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_activities\`;
CREATE TABLE \`moral_activities\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`date\` DATE NOT NULL,
  \`location\` VARCHAR(255),
  \`volunteers_count\` INT DEFAULT 0,
  \`beneficiaries_count\` INT DEFAULT 0,
  \`summary\` TEXT,
  \`details\` LONGTEXT,
  \`image_url\` TEXT,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  activities.forEach((a) => {
    sql += `INSERT INTO \`moral_activities\` (\`id\`, \`title\`, \`category\`, \`date\`, \`location\`, \`volunteers_count\`, \`beneficiaries_count\`, \`summary\`, \`details\`, \`image_url\`)
VALUES (${escapeSql(a.id)}, ${escapeSql(a.title)}, ${escapeSql(a.category)}, ${escapeSql(a.date)}, ${escapeSql(a.location)}, ${a.volunteersCount}, ${a.beneficiariesCount}, ${escapeSql(a.summary)}, ${escapeSql(a.details)}, ${escapeSql(a.imageUrl)});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 5. Table structure for table \`moral_gallery\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_gallery\`;
CREATE TABLE \`moral_gallery\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`title\` VARCHAR(255) NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`image_url\` TEXT NOT NULL,
  \`location\` VARCHAR(255),
  \`date\` DATE,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  gallery.forEach((g) => {
    sql += `INSERT INTO \`moral_gallery\` (\`id\`, \`title\`, \`category\`, \`image_url\`, \`location\`, \`date\`)
VALUES (${escapeSql(g.id)}, ${escapeSql(g.title)}, ${escapeSql(g.category)}, ${escapeSql(g.imageUrl)}, ${escapeSql(g.location)}, ${escapeSql(g.date)});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 6. Table structure for table \`moral_donations\` (With Indian 80G PAN Data)
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_donations\`;
CREATE TABLE \`moral_donations\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
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
  \`project_id\` VARCHAR(50),
  \`project_name\` VARCHAR(255),
  \`date\` DATE NOT NULL,
  \`status\` ENUM('Completed', 'Pending Verification') DEFAULT 'Completed',
  \`tax_exemption_claimed\` TINYINT(1) DEFAULT 1,
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  donations.forEach((d) => {
    sql += `INSERT INTO \`moral_donations\` (\`id\`, \`receipt_number\`, \`donor_name\`, \`donor_email\`, \`donor_phone\`, \`donor_pan\`, \`donor_address\`, \`donor_state\`, \`amount\`, \`payment_method\`, \`transaction_id\`, \`project_id\`, \`project_name\`, \`date\`, \`status\`, \`tax_exemption_claimed\`)
VALUES (${escapeSql(d.id)}, ${escapeSql(d.receiptNumber)}, ${escapeSql(d.donorName)}, ${escapeSql(d.donorEmail)}, ${escapeSql(d.donorPhone)}, ${escapeSql(d.donorPan)}, ${escapeSql(d.donorAddress)}, ${escapeSql(d.donorState)}, ${d.amount}, ${escapeSql(d.paymentMethod)}, ${escapeSql(d.transactionId)}, ${escapeSql(d.projectId || '')}, ${escapeSql(d.projectName || '')}, ${escapeSql(d.date)}, ${escapeSql(d.status)}, ${d.taxExemptionClaimed ? 1 : 0});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 7. Table structure for table \`moral_contact_inquiries\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_contact_inquiries\`;
CREATE TABLE \`moral_contact_inquiries\` (
  \`id\` VARCHAR(50) PRIMARY KEY,
  \`name\` VARCHAR(255) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL,
  \`phone\` VARCHAR(50),
  \`subject\` VARCHAR(255),
  \`message\` LONGTEXT,
  \`date\` DATE NOT NULL,
  \`status\` ENUM('New', 'In Progress', 'Resolved') DEFAULT 'New',
  \`created_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

`;

  inquiries.forEach((inq) => {
    sql += `INSERT INTO \`moral_contact_inquiries\` (\`id\`, \`name\`, \`email\`, \`phone\`, \`subject\`, \`message\`, \`date\`, \`status\`)
VALUES (${escapeSql(inq.id)}, ${escapeSql(inq.name)}, ${escapeSql(inq.email)}, ${escapeSql(inq.phone)}, ${escapeSql(inq.subject)}, ${escapeSql(inq.message)}, ${escapeSql(inq.date)}, ${escapeSql(inq.status)});\n`;
  });

  sql += `\n-- ------------------------------------------------------------
-- 8. Table structure for table \`moral_page_content\`
-- ------------------------------------------------------------
DROP TABLE IF EXISTS \`moral_page_content\`;
CREATE TABLE \`moral_page_content\` (
  \`id\` INT PRIMARY KEY DEFAULT 1,
  \`about_story\` LONGTEXT,
  \`about_vision\` LONGTEXT,
  \`about_mission\` LONGTEXT,
  \`terms_content\` LONGTEXT,
  \`refund_content\` LONGTEXT,
  \`updated_at\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO \`moral_page_content\` (\`id\`, \`about_story\`, \`about_vision\`, \`about_mission\`, \`terms_content\`, \`refund_content\`)
VALUES (
  1,
  ${escapeSql(content.aboutStory)},
  ${escapeSql(content.aboutVision)},
  ${escapeSql(content.aboutMission)},
  ${escapeSql(content.termsContent)},
  ${escapeSql(content.refundContent)}
);

SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- End of MySQL Dump for Moral Mission Foundation
-- ============================================================
`;

  return sql;
}

export function downloadMysqlDumpFile(): void {
  const sqlContent = generateMysqlDump();
  const blob = new Blob([sqlContent], { type: 'text/sql;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `moral_mission_foundation_dump_${new Date().toISOString().slice(0, 10)}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
