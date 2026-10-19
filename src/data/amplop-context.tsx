import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { Amplop, Pengeluaran, amplopList } from "./amplop";

type PengeluaranDenganKategori = Pengeluaran & { category: string };

type AmplopContextType = {
  amplop: Amplop[];
  semuaPengeluaran: PengeluaranDenganKategori[];
  tambahPengeluaran: (amplopId: string, data: Pengeluaran) => void;
};

const AmplopContext = createContext<AmplopContextType | null>(null);

// Penyimpan data bersama untuk semua halaman.
// Data masih di memori: hilang kalau aplikasi di-reload.
export function AmplopProvider({ children }: { children: ReactNode }) {
  const [amplop, setAmplop] = useState<Amplop[]>(amplopList);

  const tambahPengeluaran = (amplopId: string, data: Pengeluaran) => {
    setAmplop((prev) =>
      prev.map((a) =>
        a.id === amplopId ? { ...a, expenses: [data, ...a.expenses] } : a
      )
    );
  };

  // Semua pengeluaran dari semua amplop, tanggal terbaru di atas
  const semuaPengeluaran = useMemo(
    () =>
      amplop
        .flatMap((a) => a.expenses.map((e) => ({ ...e, category: a.name })))
        .sort((x, y) => y.day - x.day),
    [amplop]
  );

  return (
    <AmplopContext.Provider value={{ amplop, semuaPengeluaran, tambahPengeluaran }}>
      {children}
    </AmplopContext.Provider>
  );
}

export function useAmplop() {
  const ctx = useContext(AmplopContext);
  if (!ctx) throw new Error("useAmplop harus dipakai di dalam AmplopProvider");
  return ctx;
}