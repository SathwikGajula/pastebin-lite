const pool = require("../db");

const PasteModel = {
  create: async ({ id, content, created_at, expires_at, max_views }) => {
    const sql = `
      INSERT INTO pastes
      (id, content, created_at, expires_at, max_views, view_count)
      VALUES (?, ?, ?, ?, ?, 0)
    `;

    await pool.query(sql, [
      id,
      content,
      created_at,
      expires_at,
      max_views
    ]);
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM pastes WHERE id = ?",
      [id]
    );
    return rows[0];
  },

  incrementView: async (id) => {
    await pool.query(
      "UPDATE pastes SET view_count = view_count + 1 WHERE id = ?",
      [id]
    );
  }
};

module.exports = PasteModel;
