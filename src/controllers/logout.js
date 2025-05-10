const { revokeToken } = require("../auth/session");

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revoke refresh token
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       204:
 *         description: Successfully logged out
 *       401:
 *         description: No refresh token provided
 */
async function logout(req, res, next) {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ error: "Missing refresh token" });
    }

    await revokeToken(refreshToken);

    res
      .clearCookie("refreshToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      })
      .status(204)
      .end();
  } catch (e) {
    next(e);
  }
}

module.exports = {
  logout,
};
