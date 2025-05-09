const argon2 = require("argon2");
const crypto = require("crypto");

const HASH_CONFIG = {
  type: argon2.argon2id,
  memoryCost: 65536, // 64MB
  timeCost: 3,
  parallelism: 1,
  hashLength: 32,
};

async function hashPassword(password) {
  return await argon2.hash(password, {
    ...HASH_CONFIG,
  });
}

async function verifyPassword(hash, password) {
  try {
    return await argon2.verify(hash, password);
  } catch (err) {
    // Prevent timing attacks by running dummy hash
    await argon2.hash(crypto.randomBytes(16), HASH_CONFIG);
    return false;
  }
}

module.exports = { hashPassword, verifyPassword };
