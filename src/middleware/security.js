const helmet = require("helmet");

module.exports = [
  helmet(),
  (req, res, next) => {
    res.set({
      "Strict-Transport-Security":
        "max-age=63072000; includeSubDomains; preload",
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "DENY",
    });
    next();
  },
];
