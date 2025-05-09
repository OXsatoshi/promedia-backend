const db = require("../db/client");

module.exports = {
  storeRefreshToken: async (userId, token) => {
    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '7 days')`,
      [userId, await hashToken(token)],
    );
  },

  verifyRefreshToken: async (token) => {
    const result = await db.query(
      `DELETE FROM refresh_tokens
       WHERE token_hash = $1
       RETURNING user_id, expires_at > NOW() as valid`,
      [await hashToken(token)],
    );

    return result.rows[0]?.valid ? result.rows[0].user_id : null;
  },
};

async function hashToken(token) {
  const crypto = require("crypto");
  return crypto.createHash("sha512").update(token).digest("hex");
}
