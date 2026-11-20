import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AMPLOP_AWAL,
  type Amplop,
  type DataKeuangan,
  type Pengeluaran,
} from "./amplop";

const STORAGE_KEY = "uangku_data_v1";

export type InputPengeluaran = {
  amplopId: string;
  catatan: string;
  nominal: number;
  tanggal: string; // YYYY-MM-DD
};

type AmplopContextType = {
  amplop: Amplop[];
  pengeluaran: Pengeluaran[];
  ready: boolean;
  tambahPengeluaran: (input: InputPengeluaran) => void;
};

const AmplopContext = createContext<AmplopContextType | null>(null);

const buatId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

// Seluruh data keuangan disimpan di perangkat, jadi aplikasi tetap berjalan
// tanpa internet dan tanpa login.
export function AmplopProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<DataKeuangan>(() => ({
    amplop: AMPLOP_AWAL,
    pengeluaran: [],
  }));
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw) as Partial<DataKeuangan>;
          const amplop =
            Array.isArray(parsed.amplop) && parsed.amplop.length > 0
              ? parsed.amplop
              : AMPLOP_AWAL;
          const pengeluaran = Array.isArray(parsed.pengeluaran)
            ? parsed.pengeluaran
            : [];

          setData({ amplop, pengeluaran });
        }
      } catch {
        // Data rusak / belum ada: pakai data awal.
      } finally {
        if (!cancelled) setReady(true);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data)).catch(() => {});
  }, [data, ready]);

  const tambahPengeluaran = useCallback((input: InputPengeluaran) => {
    setData((prev) => ({
      ...prev,
      pengeluaran: [{ id: buatId(), ...input }, ...prev.pengeluaran],
    }));
  }, []);

  const value = useMemo(
    () => ({
      amplop: data.amplop,
      pengeluaran: data.pengeluaran,
      ready,
      tambahPengeluaran,
    }),
    [data.amplop, data.pengeluaran, ready, tambahPengeluaran]
  );

  return (
    <AmplopContext.Provider value={value}>{children}</AmplopContext.Provider>
  );
}

export function useAmplop() {
  const ctx = useContext(AmplopContext);
  if (!ctx) throw new Error("useAmplop harus dipakai di dalam AmplopProvider");
  return ctx;
}
