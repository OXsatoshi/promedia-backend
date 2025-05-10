const express = require("express");
const { login } = require("../controllers/auth");
const { logout } = require("../controllers/logout.js");
const router = express.Router();

router.post("/login", ...login);
router.post("/logout", logout);
module.exports = router;
