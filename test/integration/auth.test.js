const request = require("supertest");
const app = require("../../src/app");
const db = require("../../src/db/client");

describe("POST /auth/login", () => {
  beforeAll(async () => {
    await db.query(
      `INSERT INTO users (username, password_hash)
                    VALUES ('testuser', $1)`,
      [
        "$argon2id$v=19$m=65536,t=3,p=1$x6FIYW1BrgGUBW0IjSvi2Q$O05fr/kJET1o/gVTsJfes3/MvqUfQxN4nlLFv0o3f0A",
      ],
    );
  });

  test("Successful login returns access token", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "nabil" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("accessToken");
  });

  test("Invalid credentials return 401", async () => {
    const res = await request(app)
      .post("/auth/login")
      .send({ username: "testuser", password: "wrong_password" });

    expect(res.statusCode).toBe(401);
  });
});
 
