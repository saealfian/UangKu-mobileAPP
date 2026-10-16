/* global __dirname */
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const dbPath = process.env.DB_PATH || path.join(__dirname, "../database/uangku.sqlite");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Gagal membuka database:", err.message);
  } else {
    console.log("Terhubung ke database SQLite:", dbPath);
  }
});

// Aktifkan mode eksternal key (foreign keys) untuk integritas data
db.run("PRAGMA foreign_keys = ON");

module.exports = db;
