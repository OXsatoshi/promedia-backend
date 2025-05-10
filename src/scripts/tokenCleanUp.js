const db = require("../db/client");
//Delete exired refreash tokens from the db
async function cleanupExpiredTokens() {
  await db.query(
    `DELETE FROM refresh_tokens 
     WHERE expires_at < NOW() 
     OR is_revoked = TRUE`,
  );
  console.log("Token cleanup completed");
}

// Run daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
