const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Ambil semua pengeluaran pengguna (untuk halaman Catatan)
router.get("/", authenticateToken, (req, res) => {
  const { bulan, tahun } = req.query;

  let sql = `
    SELECT p.id, p.amplop_id, a.nama AS kategori, p.catatan, p.nominal, p.tanggal, p.created_at
    FROM pengeluaran p
    LEFT JOIN amplop a ON a.id = p.amplop_id AND a.user_id = p.user_id
    WHERE p.user_id = ?
  `;
  const params = [req.user.id];

  if (bulan && tahun) {
    sql += ` AND strftime('%m', p.tanggal) = ? AND strftime('%Y', p.tanggal) = ?`;
    params.push(String(bulan).padStart(2, "0"), String(tahun));
  }

  sql += ` ORDER BY p.tanggal DESC, p.created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ message: "Gagal mengambil pengeluaran." });
    }
    res.json({
      pengeluaran: rows.map((r) => ({
        id: r.id,
        amplopId: r.amplop_id,
        category: r.kategori,
        note: r.catatan,
        amount: r.nominal,
        day: new Date(r.tanggal).getDate(),
        tanggal: r.tanggal,
        createdAt: r.created_at,
      })),
    });
  });
});

// Buat pengeluaran baru
router.post("/", authenticateToken, (req, res) => {
  const { amplop_id, catatan, nominal, tanggal } = req.body;

  if (!amplop_id || !nominal) {
    return res.status(400).json({ message: "Amplop dan nominal wajib diisi." });
  }

  const tgl = tanggal || new Date().toISOString().split("T")[0];

  // Verifikasi amplop milik pengguna
  db.get(
    "SELECT id FROM amplop WHERE id = ? AND user_id = ?",
    [amplop_id, req.user.id],
    (err, amplop) => {
      if (err) {
        return res.status(500).json({ message: "Gagal memverifikasi amplop." });
      }
      if (!amplop) {
        return res.status(404).json({ message: "Amplop tidak ditemukan." });
      }

      db.run(
        `INSERT INTO pengeluaran (user_id, amplop_id, catatan, nominal, tanggal)
         VALUES (?, ?, ?, ?, ?)`,
        [req.user.id, amplop_id, catatan || "", Number(nominal), tgl],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Gagal menyimpan pengeluaran." });
          }
          res.status(201).json({
            message: "Pengeluaran berhasil disimpan.",
            pengeluaran: {
              id: this.lastID,
              amplopId: amplop_id,
              category: amplop.nama,
              note: catatan || "",
              amount: Number(nominal),
              tanggal: tgl,
            },
          });
        }
      );
    }
  );
});

// Perbarui pengeluaran
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { amplop_id, catatan, nominal, tanggal } = req.body;

  db.run(
    `UPDATE pengeluaran SET amplop_id = COALESCE(?, amplop_id), catatan = COALESCE(?, catatan),
      nominal = COALESCE(?, nominal), tanggal = COALESCE(?, tanggal)
     WHERE id = ? AND user_id = ?`,
    [amplop_id, catatan, nominal == null ? undefined : nominal, tanggal, id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Gagal memperbarui pengeluaran." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Pengeluaran tidak ditemukan." });
      }
      res.json({ message: "Pengeluaran berhasil diperbarui." });
    }
  );
});

// Hapus pengeluaran
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM pengeluaran WHERE id = ? AND user_id = ?", [id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Gagal menghapus pengeluaran." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Pengeluaran tidak ditemukan." });
    }
    res.json({ message: "Pengeluaran berhasil dihapus." });
  });
});

module.exports = router;
