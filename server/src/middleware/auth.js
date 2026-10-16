const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "uangku-rahasia-untuk-pengembangan";

/**
 * Middleware verifikasi JWT.
 * Menyisipkan decoded token ke req.user.
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer <TOKEN>

  if (!token) {
    return res.status(401).json({ message: "Token akses diperlukan. Silakan login terlebih dahulu." });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid atau kadaluarsa." });
    }
    req.user = user;
    next();
  });
}

module.exports = { authenticateToken, JWT_SECRET };
