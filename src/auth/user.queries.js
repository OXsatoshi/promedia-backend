const db = require("../db/client");
const { hashPassword, verifyPassword } = require("./hashing");

const crypto = require("crypto");
module.exports = {
  /**
   * Creates a new user with hashed password
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{user_id: string, username: string}>}
   */
  async createUser(username, password) {
    const passwordHash = await hashPassword(password);

    const result = await db.query(
      `INSERT INTO users (username, password_hash)
       VALUES ($1, $2)
       RETURNING user_id, username`,
      [username, passwordHash],
    );

    return result.rows[0];
  },

  /**
   * Verifies user credentials
   * @param {string} username
   * @param {string} password
   * @returns {Promise<{user_id: string} | null>}
   */
  async verifyUser(username, password) {
    const result = await db.query(
      `SELECT user_id, password_hash 
       FROM users 
       WHERE username = $1`,
      [username],
    );

    if (!result.rows[0]) {
      await hashPassword(crypto.randomBytes(16)); // Dummy hash
      return null;
    }

    const isValid = await verifyPassword(
      result.rows[0].password_hash,
      password,
    );

    return isValid ? { user_id: result.rows[0].user_id } : null;
  },
};
