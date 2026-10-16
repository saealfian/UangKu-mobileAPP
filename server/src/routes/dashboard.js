const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Ringkasan dashboard pengguna yang login
router.get("/", authenticateToken, (req, res) => {
  const { bulan, tahun } = req.query;

  // Total anggaran dari semua amplop
  db.get(
    "SELECT COALESCE(SUM(anggaran), 0) AS totalAnggaran FROM amplop WHERE user_id = ?",
    [req.user.id],
    (err, budgetRow) => {
      if (err) {
        return res.status(500).json({ message: "Gagal menghitung total anggaran." });
      }

      // Total terpakai dalam bulan ini (atau filter bulan/tahun)
      let sql = `
        SELECT COALESCE(SUM(p.nominal), 0) AS totalTerpakai
        FROM pengeluaran p
        WHERE p.user_id = ?
      `;
      const params = [req.user.id];

      if (bulan && tahun) {
        sql += ` AND strftime('%m', p.tanggal) = ? AND strftime('%Y', p.tanggal) = ?`;
        params.push(String(bulan).padStart(2, "0"), String(tahun));
      }

      db.get(sql, params, (err2, usedRow) => {
        if (err2) {
          return res.status(500).json({ message: "Gagal menghitung total terpakai." });
        }

        const totalAnggaran = budgetRow.totalAnggaran;
        const totalTerpakai = usedRow.totalTerpakai;

        res.json({
          totalAnggaran,
          totalTerpakai,
          sisa: totalAnggaran - totalTerpakai,
          bulan: bulan || new Date().getMonth() + 1,
          tahun: tahun || new Date().getFullYear(),
        });
      });
    }
  );
});

module.exports = router;
