const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const JWT_CONFIG = {
  algorithm: "HS512",
  expiresIn: "15m",
  issuer: "ad-monitoring-api",
};

module.exports = {
  generateAccessToken: (userId) => {
    return jwt.sign({ sub: userId }, process.env.JWT_SECRET, JWT_CONFIG);
  },

  generateRefreshToken: () => crypto.randomBytes(64).toString("hex"),

  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS512"],
      issuer: "ad-monitoring-api",
    });
  },
};
