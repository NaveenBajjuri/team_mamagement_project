import { pool } from "./db.js";
import createSuperAdmin from "../utils/createSuperAdmin.js";

const initializeDatabase = async () => {
  try {
    console.log("🔄 Checking database tables...");

    // ================= USERS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        role VARCHAR(50) NOT NULL,
        team_lead_id INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        password VARCHAR(255) NOT NULL,
        reset_token TEXT,
        reset_token_expiry TIMESTAMP
      );
    `);

    // ================= PROJECTS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        intern_id INTEGER,
        team_lead_id INTEGER,
        deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        start_date DATE,
        status VARCHAR(50),
        delayed BOOLEAN DEFAULT FALSE
      );
    `);

    // ================= SUBMISSIONS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS submissions (
        id SERIAL PRIMARY KEY,
        intern_id INTEGER,
        project_id INTEGER,
        title VARCHAR(200),
        description TEXT,
        pdf_url TEXT,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        status VARCHAR(20),
        feedback TEXT,
        serial_no INTEGER,
        additional_docs TEXT,
        reviewed_at TIMESTAMP,
        is_late BOOLEAN DEFAULT FALSE
      );
    `);

    // ================= NOTIFICATIONS =================
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER,
        message TEXT,
        type VARCHAR(50),
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ All tables verified/created");

    // Now create Super Admin
    await createSuperAdmin();

  } catch (error) {
    console.error("❌ Database Initialization Error:", error);
    process.exit(1);
  }
};

export default initializeDatabase;