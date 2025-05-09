const { hashPassword, verifyPassword } = require("../../src/auth/hashing");
const { createUser, verifyUser } = require("../../src/auth/user.queries");

const db = require("../../src/db/client.js");
describe("Password Hashing", () => {
  let testHash;

  beforeAll(async () => {
    testHash = await hashPassword("SecurePass123!");
  });

  test("Generates valid Argon2id hash", () => {
    expect(testHash).toMatch(/^\$argon2id\$v=19\$m=65536,t=3,p=1\$.+/);
  });

  test("Verifies correct password", async () => {
    expect(await verifyPassword(testHash, "SecurePass123!")).toBe(true);
  });

  test("Rejects wrong password", async () => {
    expect(await verifyPassword(testHash, "WrongPass!")).toBe(false);
  });
});

describe("Database Integration", () => {
  beforeEach(async () => {
    await db.query("TRUNCATE users RESTART IDENTITY CASCADE");
  });

  test("Creates user with hashed password", async () => {
    const user = await createUser("testuser", "MyPassword123");
    expect(user).toHaveProperty("username", "testuser");
  });

  test("Verifies valid login", async () => {
    await createUser("testuser", "MyPassword123");
    const auth = await verifyUser("testuser", "MyPassword123");
    expect(auth).toHaveProperty("user_id");
  });
});
