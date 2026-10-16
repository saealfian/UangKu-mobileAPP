require("dotenv").config();

const express = require("express");
const cors = require("cors");
const db = require("./db");

const authRoutes = require("./routes/auth");
const amplopRoutes = require("./routes/amplop");
const pengeluaranRoutes = require("./routes/pengeluaran");
const dashboardRoutes = require("./routes/dashboard");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Inisialisasi tabel database saat server mulai
function initDatabase() {
  db.serialize(() => {
    // Tabel pengguna
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nama TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Tabel amplop (kategori / envelop)
    db.run(`
      CREATE TABLE IF NOT EXISTS amplop (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        nama TEXT NOT NULL,
        deskripsi TEXT DEFAULT '',
        anggaran INTEGER NOT NULL DEFAULT 0,
        warna TEXT DEFAULT '#E7F0E9',
        icon TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Tabel pengeluaran
    db.run(`
      CREATE TABLE IF NOT EXISTS pengeluaran (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        amplop_id INTEGER NOT NULL,
        catatan TEXT DEFAULT '',
        nominal INTEGER NOT NULL DEFAULT 0,
        tanggal TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (amplop_id) REFERENCES amplop(id) ON DELETE CASCADE
      )
    `);

    // Index untuk mempercepat query
    db.run(`CREATE INDEX IF NOT EXISTS idx_pengeluaran_user_tanggal ON pengeluaran(user_id, tanggal)`);
    db.run(`CREATE INDEX IF not EXISTS idx_amplop_user ON amplop(user_id)`);
  });
}

initDatabase();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/amplop", amplopRoutes);
app.use("/api/pengeluaran", pengeluaranRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "UangKu backend berjalan." });
});

// 404
app.use((req, res) => {
  res.status(404).json({ message: "Endpoint tidak ditemukan." });
});

// Error handler global
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Terjadi kesalahan pada server." });
});

app.listen(PORT, () => {
  console.log(`UangKu backend berjalan di http://localhost:${PORT}`);
});
