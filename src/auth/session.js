const db = require("../db/client");

module.exports = {
  storeRefreshToken: async (userId, token) => {
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [userId, await hashToken(token)],
    );
  },

  /**
   * Revokes a refresh token
   * @param {string} token - Raw refresh token
   * @returns {Promise<void>}
   */
  async revokeToken(token) {
    await db.query(
      `UPDATE refresh_tokens
       SET is_revoked = TRUE, revoked_at = NOW()
       WHERE token_hash = $1`,
      [hashToken(token)],
    );
  },

  /**
   * Verifies token validity
   * @param {string} token
   * @returns {Promise<boolean>}
   */
  async verifyRefreshToken(token) {
    const result = await db.query(
      `SELECT user_id FROM refresh_tokens
       WHERE token_hash = $1 
       AND is_revoked = FALSE
       AND expires_at > NOW()`,
      [hashToken(token)],
    );
    return result.rows[0]?.user_id;
  },
};

async function hashToken(token) {
  const crypto = require("crypto");
  return crypto.createHash("sha512").update(token).digest("hex");
}
