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

// Helper formatting (digunakan kembali di layar frontend)
export const rupiah = (n: number) =>
  "Rp" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const pad = (d: number) => String(d).padStart(2, "0");
export const terpakai = (a: Amplop) =>
  (a.expenses?.reduce((t, e) => t + e.amount, 0) ?? a.terpakai ?? 0);
