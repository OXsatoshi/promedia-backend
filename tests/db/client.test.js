const db = require("../../src/db/client.js");

describe("Database", () => {
  test("Should connect and execute query", async () => {
    const result = await db.query("SELECT $1::text as message", ["Hello DB"]);
    expect(result.rows[0].message).toBe("Hello DB");
  });

  test("Should reject invalid credentials", async () => {
    await expect(db.query("SELECT * FROM nonexistent_table")).rejects.toThrow();
  });
});
