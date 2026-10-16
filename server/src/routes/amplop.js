const express = require("express");
const db = require("../db");
const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

// Ambil semua amplop milik pengguna yang login
router.get("/", authenticateToken, (req, res) => {
  db.all(
    `SELECT a.id, a.nama, a.deskripsi, a.anggaran, a.warna, a.icon,
            a.created_at, a.updated_at,
            COALESCE(SUM(p.nominal), 0) AS terpakai
     FROM amplop a
     LEFT JOIN pengeluaran p ON p.amplop_id = a.id AND p.user_id = a.user_id
     WHERE a.user_id = ?
     GROUP BY a.id
     ORDER BY a.created_at DESC`,
    [req.user.id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Gagal mengambil amplop." });
      }
      res.json({
        amplop: rows.map((r) => ({
          id: r.id,
          name: r.nama,
          desc: r.deskripsi,
          budget: r.anggaran,
          bg: r.warna,
          icon: r.icon,
          terpakai: r.terpakai,
          sisa: r.anggaran - r.terpakai,
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        })),
      });
    }
  );
});

// Ambil detail satu amplop beserta pengeluaran dalamnya
router.get("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.get(
    "SELECT * FROM amplop WHERE id = ? AND user_id = ?",
    [id, req.user.id],
    (err, amplop) => {
      if (err) {
        return res.status(500).json({ message: "Gagal mengambil amplop." });
      }
      if (!amplop) {
        return res.status(404).json({ message: "Amplop tidak ditemukan." });
      }

      db.all(
        "SELECT * FROM pengeluaran WHERE amplop_id = ? AND user_id = ? ORDER BY tanggal DESC, created_at DESC",
        [id, req.user.id],
        (err2, expenses) => {
          if (err2) {
            return res.status(500).json({ message: "Gagal mengambil pengeluaran." });
          }

          const terpakai = expenses.reduce((t, e) => t + e.nominal, 0);

          res.json({
            amplop: {
              id: amplop.id,
              name: amplop.nama,
              desc: amplop.deskripsi,
              budget: amplop.anggaran,
              bg: amplop.warna,
              icon: amplop.icon,
              terpakai,
              sisa: amplop.anggaran - terpakai,
              createdAt: amplop.created_at,
              updatedAt: amplop.updated_at,
            },
            expenses: expenses.map((e) => ({
              id: e.id,
              day: new Date(e.tanggal).getDate(),
              note: e.catatan,
              amount: e.nominal,
              tanggal: e.tanggal,
              createdAt: e.created_at,
            })),
          });
        }
      );
    }
  );
});

// Buat amplop baru
router.post("/", authenticateToken, (req, res) => {
  const { nama, deskripsi, anggaran, warna, icon } = req.body;

  if (!nama || anggaran == null) {
    return res.status(400).json({ message: "Nama dan anggaran wajib diisi." });
  }

  db.run(
    `INSERT INTO amplop (user_id, nama, deskripsi, anggaran, warna, icon)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [req.user.id, nama, deskripsi || "", Number(anggaran), warna || "#E7F0E9", icon || null],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Gagal membuat amplop." });
      }
      res.status(201).json({
        message: "Amplop berhasil dibuat.",
        amplop: { id: this.lastID, nama, deskripsi, anggaran: Number(anggaran), warna, icon },
      });
    }
  );
});

// Perbarui amplop
router.put("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { nama, deskripsi, anggaran, warna, icon } = req.body;

  db.run(
    `UPDATE amplop SET nama = COALESCE(?, nama), deskripsi = COALESCE(?, deskripsi),
      anggaran = COALESCE(?, anggaran), warna = COALESCE(?, warna), icon = COALESCE(?, icon),
      updated_at = CURRENT_TIMESTAMP
     WHERE id = ? AND user_id = ?`,
    [nama, deskripsi, anggaran == null ? undefined : anggaran, warna, icon, id, req.user.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Gagal memperbarui amplop." });
      }
      if (this.changes === 0) {
        return res.status(404).json({ message: "Amplop tidak ditemukan." });
      }
      res.json({ message: "Amplop berhasil diperbarui." });
    }
  );
});

// Hapus amplop (dan pengeluaran terkait karena ON DELETE CASCADE)
router.delete("/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM amplop WHERE id = ? AND user_id = ?", [id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ message: "Gagal menghapus amplop." });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Amplop tidak ditemukan." });
    }
    res.json({ message: "Amplop berhasil dihapus." });
  });
});

module.exports = router;
