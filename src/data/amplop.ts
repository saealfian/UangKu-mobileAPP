export type Pengeluaran = {
  id: number;
  day: number;
  note: string;
  amount: number;
  tanggal?: string;
  category?: string;
  amplopId?: number;
  createdAt?: string;
};

export type Amplop = {
  id: number;
  name: string;
  desc: string;
  budget: number;
  bg: string;
  icon?: string; // id ikon (teks), disesuaikan ke gambar via getIcon di frontend
  terpakai?: number;
  sisa?: number;
  expenses?: Pengeluaran[];
};

// Paksa nilai dinamis dari backend menjadi angka aman.
// Nilai null/undefined/NaN (mis. user baru tanpa data) jadi 0,
// supaya tampilan selalu "Rp0" dan backend bebas mengirim field kosong.
export const num = (v: unknown): number =>
  typeof v === "number" && Number.isFinite(v) ? v : 0;

// Helper formatting (digunakan kembali di layar frontend)
export const rupiah = (n: number) =>
  "Rp" + String(num(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const pad = (d: number) => String(d).padStart(2, "0");
export const terpakai = (a: Amplop) =>
  (a.expenses?.reduce((t, e) => t + e.amount, 0) ?? a.terpakai ?? 0);
