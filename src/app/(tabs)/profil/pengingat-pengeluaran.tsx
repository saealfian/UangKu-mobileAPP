import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, View } from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunHighlightCard,
  AkunHint,
  AkunLabel,
  AkunNote,
  AkunRow,
  AkunSwitchRow,
  OptionModal,
  akunStyles,
} from "@/components/akun";
import { useAkun } from "@/data/akun-context";

const WAKTU = Array.from(
  { length: 19 },
  (_, i) => `${String(i + 5).padStart(2, "0")}:00 WIB`
);

const ULANGI = ["Setiap hari", "Hari kerja", "Akhir pekan"];

export default function PengingatPengeluaranScreen() {
  const router = useRouter();
  const { akun, simpanPengingat } = useAkun();

  const [pengingat, setPengingat] = useState(akun.pengingat);
  const [waktuOpen, setWaktuOpen] = useState(false);
  const [ulangiOpen, setUlangiOpen] = useState(false);

  const handleSave = () => {
    simpanPengingat(pengingat);
    Alert.alert(
      "Pengingat disimpan",
      pengingat.aktif
        ? `Kami akan mengingatkanmu pukul ${pengingat.waktu}, ${pengingat.ulangi.toLowerCase()}.`
        : "Pengingat harian dimatikan."
    );
  };

  return (
    <>
      <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
        <AkunHeader
          title="Pengingat Pengeluaran"
          onBack={() => router.back()}
        />

        <AkunHint>
          Bangun kebiasaan mencatat pengeluaran setiap hari.
        </AkunHint>

        <AkunHighlightCard
          icon="notifications-none"
          title="Jangan lewatkan catatanmu"
          description="Pengingat membantu kamu tahu ke mana uangmu pergi."
        />

        <View style={{ marginTop: 4 }}>
          <AkunSwitchRow
            title="Pengingat harian"
            subtitle="Ingatkan untuk mencatat pengeluaran."
            value={pengingat.aktif}
            onValueChange={(v) => setPengingat({ ...pengingat, aktif: v })}
          />
        </View>

        <AkunLabel>Waktu pengingat</AkunLabel>
        <AkunRow
          title={pengingat.waktu}
          onPress={() => setWaktuOpen(true)}
        />

        <AkunLabel>Ulangi</AkunLabel>
        <AkunRow
          title={pengingat.ulangi}
          onPress={() => setUlangiOpen(true)}
        />

        <View style={{ marginTop: 14 }}>
          <AkunSwitchRow
            title="Peringatan anggaran"
            subtitle="Beri tahu saat 80% anggaran terpakai."
            value={pengingat.peringatanAnggaran}
            onValueChange={(v) =>
              setPengingat({ ...pengingat, peringatanAnggaran: v })
            }
          />
          <AkunSwitchRow
            title="Ringkasan mingguan"
            subtitle="Kirim ringkasan setiap hari Minggu."
            value={pengingat.ringkasanMingguan}
            onValueChange={(v) =>
              setPengingat({ ...pengingat, ringkasanMingguan: v })
            }
          />
        </View>

        <AkunButton label="Simpan Pengingat" onPress={handleSave} />

        <AkunNote>
          Pastikan izin notifikasi UangKu aktif di pengaturan perangkatmu.
        </AkunNote>
      </ScrollView>

      <OptionModal
        visible={waktuOpen}
        title="Pilih waktu pengingat"
        options={WAKTU.map((w) => ({ label: w, value: w }))}
        value={pengingat.waktu}
        onSelect={(v) => {
          setPengingat({ ...pengingat, waktu: v });
          setWaktuOpen(false);
        }}
        onClose={() => setWaktuOpen(false)}
      />

      <OptionModal
        visible={ulangiOpen}
        title="Ulangi pengingat"
        options={ULANGI.map((u) => ({ label: u, value: u }))}
        value={pengingat.ulangi}
        onSelect={(v) => {
          setPengingat({ ...pengingat, ulangi: v });
          setUlangiOpen(false);
        }}
        onClose={() => setUlangiOpen(false)}
      />
    </>
  );
}
