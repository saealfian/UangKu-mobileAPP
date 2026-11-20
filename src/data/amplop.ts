// Model data UangKu versi offline.
// Semua data disimpan di perangkat (AsyncStorage), tidak ada server/auth.

export type Amplop = {
  id: string;
  nama: string;
  deskripsi: string;
  anggaran: number;
  warna: string;
  icon: string; // id ikon (teks), dipetakan ke gambar lewat getIcon()
};

export type Pengeluaran = {
  id: string;
  amplopId: string;
  catatan: string;
  nominal: number;
  tanggal: string; // format ISO: YYYY-MM-DD
};

export type DataKeuangan = {
  amplop: Amplop[];
  pengeluaran: Pengeluaran[];
};

// Empat amplop bawaan supaya aplikasi langsung bisa dipakai saat pertama dibuka.
export const AMPLOP_AWAL: Amplop[] = [
  {
    id: "makan",
    nama: "Makan & Minum",
    deskripsi: "Untuk makan enak setiap hari.",
    anggaran: 1200000,
    warna: "#FBEADC",
    icon: "makan",
  },
  {
    id: "transport",
    nama: "Transport",
    deskripsi: "Ongkos harian dan perjalanan.",
    anggaran: 600000,
    warna: "#E7EDF6",
    icon: "transport",
  },
  {
    id: "jajan",
    nama: "Jajan & Hiburan",
    deskripsi: "Sisihkan sedikit untuk senang-senang.",
    anggaran: 400000,
    warna: "#EDE9F6",
    icon: "jajan",
  },
  {
    id: "darurat",
    nama: "Darurat",
    deskripsi: "Dana siap pakai untuk kejadian tak terduga.",
    anggaran: 800000,
    warna: "#E7F0E9",
    icon: "darurat",
  },
];

export const NAMA_BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

// Paksa nilai dinamis menjadi angka aman (null/NaN -> 0).
export const num = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

// Helper formatting (digunakan kembali di layar frontend)
export const rupiah = (n: number) =>
  "Rp" + String(num(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const pad = (d: number) => String(d).padStart(2, "0");

export const namaBulan = (bulan: number) => NAMA_BULAN[bulan - 1] ?? "";

// Tanggal ISO lokal (bukan UTC) supaya "hari ini" sesuai tanggal di perangkat.
export const isoTanggal = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const tanggalHariIni = () => isoTanggal(new Date());

export const hariDariIso = (iso: string) => Number(iso.slice(8, 10));
export const bulanDariIso = (iso: string) => Number(iso.slice(5, 7));
export const tahunDariIso = (iso: string) => Number(iso.slice(0, 4));

const bulanDariTanggal = (tanggal: string) =>
  bulanDariIso(tanggal) || new Date(tanggal).getMonth() + 1;
const tahunDariTanggal = (tanggal: string) =>
  tahunDariIso(tanggal) || new Date(tanggal).getFullYear();

// Filter pengeluaran pada satu periode (bulan & tahun).
export function pengeluaranPeriode(
  pengeluaran: Pengeluaran[],
  bulan: number,
  tahun: number
) {
  return pengeluaran.filter(
    (p) =>
      bulanDariTanggal(p.tanggal) === bulan &&
      tahunDariTanggal(p.tanggal) === tahun
  );
}

export const totalNominal = (list: Pengeluaran[]) =>
  list.reduce((total, p) => total + num(p.nominal), 0);

// Total pengeluaran milik satu amplop pada satu periode.
export function terpakaiAmplop(
  pengeluaran: Pengeluaran[],
  amplopId: string,
  bulan: number,
  tahun: number
) {
  return totalNominal(
    pengeluaranPeriode(pengeluaran, bulan, tahun).filter(
      (p) => p.amplopId === amplopId
    )
  );
}
