const request = require("supertest");
const crypto = require("crypto");
const app = require("../../src/app");
const db = require("../../src/db/client");

async function hashToken(token) {
  const crypto = require("crypto");
  return crypto.createHash("sha512").update(token).digest("hex");
}
const PASSWORD_HASH =
  "$argon2id$v=19$m=65536,t=3,p=1$x6FIYW1BrgGUBW0IjSvi2Q$O05fr/kJET1o/gVTsJfes3/MvqUfQxN4nlLFv0o3f0A";
const TEST_TOKEN = "test_refresh_token";
const TOKEN_HASH = hashToken(TEST_TOKEN);

describe("POST /auth/logout", () => {
  let userId;

  beforeAll(async () => {
    const res = await db.query(
      `INSERT INTO users (username, password_hash)
       VALUES ('testuser', $1) RETURNING user_id`,
      [PASSWORD_HASH],
    );
    userId = res.rows[0].user_id;

    await db.query(
      `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
       VALUES ($1, $2, NOW() + INTERVAL '1 day')`,
      [userId, TOKEN_HASH],
    );
  });

  afterAll(async () => {
    await db.query(`DELETE FROM refresh_tokens WHERE user_id = $1`, [userId]);
    await db.query(`DELETE FROM users WHERE user_id = $1`, [userId]);
  });

  test("Successfully revokes refresh token", async () => {
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", [`refreshToken=${TEST_TOKEN}`]);

    expect(res.statusCode).toBe(204);

    const { rows } = await db.query(
      `SELECT is_revoked FROM refresh_tokens WHERE token_hash = $1`,
      [TOKEN_HASH],
    );
    console.log(rows[0]);
    expect(rows[0]?.is_revoked).toBe(true);
  });

  test("Fails without refresh token", async () => {
    const res = await request(app).post("/auth/logout");

    expect(res.statusCode).toBe(401);
    expect(res.body).toEqual({ error: "Missing refresh token" });
  });
});
