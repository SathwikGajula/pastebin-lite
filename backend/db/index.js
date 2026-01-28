const mysql = require("mysql2/promise");

const pool = mysql.createPool(process.env.MYSQL_PUBLIC_URL);

(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS pastes (
        id VARCHAR(50) PRIMARY KEY,
        content TEXT NOT NULL,
        created_at DATETIME NOT NULL,
        expires_at DATETIME,
        max_views INT,
        view_count INT DEFAULT 0
      );
    `);
    console.log("DB ready: pastes table ensured");
  } catch (err) {
    console.error("DB init error:", err);
  }
})();

module.exports = pool;
