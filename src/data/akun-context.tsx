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

const STORAGE_KEY = "uangku_akun_v1";

export type ProfilData = {
  nama: string;
  email: string;
  telepon: string;
  tanggalLahir: string; // format ISO: YYYY-MM-DD
  warnaAvatar: string;
};

export type PengingatData = {
  aktif: boolean;
  waktu: string;
  ulangi: string;
  peringatanAnggaran: boolean;
  ringkasanMingguan: boolean;
};

export type KeamananData = {
  pin: string | null;
  biometrik: boolean;
  duaLangkah: boolean;
};

export type AkunState = {
  profil: ProfilData;
  pengingat: PengingatData;
  keamanan: KeamananData;
  targetAnggaran: number | null;
};

const DEFAULT_STATE: AkunState = {
  profil: {
    nama: "Pengguna",
    email: "",
    telepon: "",
    tanggalLahir: "",
    warnaAvatar: "#337C65",
  },
  pengingat: {
    aktif: true,
    waktu: "20:00 WIB",
    ulangi: "Setiap hari",
    peringatanAnggaran: true,
    ringkasanMingguan: false,
  },
  keamanan: {
    pin: null,
    biometrik: false,
    duaLangkah: false,
  },
  targetAnggaran: null,
};

type AkunContextType = {
  akun: AkunState;
  ready: boolean;
  simpanProfil: (patch: Partial<ProfilData>) => void;
  simpanPengingat: (patch: Partial<PengingatData>) => void;
  simpanKeamanan: (patch: Partial<KeamananData>) => void;
  simpanTargetAnggaran: (nominal: number | null) => void;
};

const AkunContext = createContext<AkunContextType | null>(null);

// Pengaturan akun disimpan di perangkat (AsyncStorage) karena aplikasi
// berjalan offline tanpa akun server.
export function AkunProvider({ children }: { children: ReactNode }) {
  const [akun, setAkun] = useState<AkunState>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw && !cancelled) {
          const parsed = JSON.parse(raw);
          const profil = parsed?.profil ?? {};
          setAkun((prev) => ({
            profil: {
              ...prev.profil,
              ...profil,
              // Jangan biarkan data kosong menimpa nama/email tersimpan.
              nama: profil.nama || prev.profil.nama,
              email: profil.email || prev.profil.email,
            },
            pengingat: {
              ...DEFAULT_STATE.pengingat,
              ...(parsed?.pengingat ?? {}),
            },
            keamanan: {
              ...DEFAULT_STATE.keamanan,
              ...(parsed?.keamanan ?? {}),
            },
            targetAnggaran:
              typeof parsed?.targetAnggaran === "number"
                ? parsed.targetAnggaran
                : null,
          }));
        }
      } catch {
        // Abaikan data rusak, pakai nilai default.
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(akun)).catch(() => {});
  }, [akun, ready]);

  const simpanProfil = useCallback((patch: Partial<ProfilData>) => {
    setAkun((prev) => ({ ...prev, profil: { ...prev.profil, ...patch } }));
  }, []);

  const simpanPengingat = useCallback((patch: Partial<PengingatData>) => {
    setAkun((prev) => ({
      ...prev,
      pengingat: { ...prev.pengingat, ...patch },
    }));
  }, []);

  const simpanKeamanan = useCallback((patch: Partial<KeamananData>) => {
    setAkun((prev) => ({ ...prev, keamanan: { ...prev.keamanan, ...patch } }));
  }, []);

  const simpanTargetAnggaran = useCallback((nominal: number | null) => {
    setAkun((prev) => ({ ...prev, targetAnggaran: nominal }));
  }, []);

  const value = useMemo(
    () => ({
      akun,
      ready,
      simpanProfil,
      simpanPengingat,
      simpanKeamanan,
      simpanTargetAnggaran,
    }),
    [
      akun,
      ready,
      simpanProfil,
      simpanPengingat,
      simpanKeamanan,
      simpanTargetAnggaran,
    ]
  );

  return <AkunContext.Provider value={value}>{children}</AkunContext.Provider>;
}

export function useAkun() {
  const ctx = useContext(AkunContext);
  if (!ctx) throw new Error("useAkun harus dipakai di dalam AkunProvider");
  return ctx;
}
