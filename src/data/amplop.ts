import { ImageSourcePropType } from "react-native";
import { colors } from "../components/uangku";

export type Pengeluaran = { day: number; note: string; amount: number };
export type Amplop = {
  id: string;
  name: string;
  desc: string;
  budget: number;
  bg: string;
  icon?: ImageSourcePropType;
  expenses: Pengeluaran[];
};

// Helper
export const rupiah = (n: number) =>
  "Rp" + String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
export const pad = (d: number) => String(d).padStart(2, "0");
export const terpakai = (a: Amplop) =>
  a.expenses.reduce((t, e) => t + e.amount, 0);

// Data contoh.
export const amplopList: Amplop[] = [
  {
    id: "makan",
    name: "Makan & Minum",
    desc: "Untuk makan enak setiap hari.",
    budget: 1200000,
    bg: colors.peach,
    icon: require("../../assets/images/amplop/makan.png"), // ganti file ini dengan gambarmu (nama sama)
    expenses: [
      { day: 13, note: "Makan siang & kopi", amount: 65000 },
      { day: 11, note: "Sarapan & makan malam", amount: 55000 },
      { day: 8, note: "Makan siang & malam", amount: 60000 },
    ],
  },
  {
    id: "transport",
    name: "Transport",
    desc: "Ongkos harian ke kampus.",
    budget: 600000,
    bg: colors.blue,
    icon: require("../../assets/images/amplop/transport.png"), // ganti file ini dengan gambarmu (nama sama)
    expenses: [{ day: 12, note: "Ojek online", amount: 75000 }],
  },
  {
    id: "jajan",
    name: "Jajan & Hiburan",
    desc: "Jajan dan hiburan akhir pekan.",
    budget: 400000,
    bg: colors.lilac,
    icon: require("../../assets/images/amplop/jajan.png"), // ganti file ini dengan gambarmu (nama sama)
    expenses: [{ day: 10, note: "Nonton & camilan", amount: 100000 }],
  },
  {
    id: "darurat",
    name: "Darurat",
    desc: "Dana untuk kebutuhan mendadak.",
    budget: 800000,
    bg: colors.mint,
    icon: require("../../assets/images/amplop/darurat.png"), // ganti file ini dengan gambarmu (nama sama)
    expenses: [{ day: 9, note: "Servis motor", amount: 45000 }],
  },
];

// Semua pengeluaran dari semua amplop, terbaru di atas (untuk halaman Catatan)
export const semuaPengeluaran = amplopList
  .flatMap((a) => a.expenses.map((e) => ({ ...e, category: a.name })))
  .sort((x, y) => y.day - x.day);