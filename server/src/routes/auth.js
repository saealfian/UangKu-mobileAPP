const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");
const { JWT_SECRET, authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Daftar pengguna baru
router.post("/register", (req, res) => {
  const { nama, email, password } = req.body;

  if (!nama || !email || !password) {
    return res.status(400).json({ message: "Nama, email, dan password wajib diisi." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password minimal 6 karakter." });
  }

  // Cek apakah email sudah terdaftar
  db.get("SELECT id FROM users WHERE email = ?", [email], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Gagal memeriksa email." });
    }
    if (row) {
      return res.status(409).json({ message: "Email sudah terdaftar. Silakan login." });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    db.run(
      "INSERT INTO users (nama, email, password_hash) VALUES (?, ?, ?)",
      [nama, email, passwordHash],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Gagal mendaftarkan pengguna." });
        }

        const token = jwt.sign(
          { id: this.lastID, nama, email },
          JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
        );

        res.status(201).json({
          message: "Pendaftaran berhasil.",
          token,
          user: { id: this.lastID, nama, email },
        });
      }
    );
  });
});

// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email dan password wajib diisi." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mencari pengguna." });
    }
    if (!user) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const valid = bcrypt.compareSync(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah." });
    }

    const token = jwt.sign(
      { id: user.id, nama: user.nama, email: user.email },
      JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      message: "Login berhasil.",
      token,
      user: { id: user.id, nama: user.nama, email: user.email },
    });
  });
});

// Ambil profil pengguna yang login
router.get("/me", authenticateToken, (req, res) => {
  db.get(
    "SELECT id, nama, email, created_at FROM users WHERE id = ?",
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ message: "Gagal mengambil profil." });
      }
      if (!user) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan." });
      }
      res.json({ user });
    }
  );
});

module.exports = router;
