import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunHint,
  AkunLabel,
  AkunSectionTitle,
  akunColors,
  akunStyles,
} from "@/components/akun";
import { ProgressBar, colors } from "@/components/uangku";
import { num, pengeluaranPeriode, rupiah } from "@/data/amplop";
import { useAkun } from "@/data/akun-context";
import { useAmplop } from "@/data/amplop-context";

const formatRibuan = (digits: string) =>
  digits ? digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "";

export default function TargetAnggaranScreen() {
  const router = useRouter();
  const { akun, ready: akunReady, simpanTargetAnggaran } = useAkun();
  const { amplop, pengeluaran, ready } = useAmplop();

  const now = new Date();
  const namaBulan = now.toLocaleDateString("id-ID", { month: "long" });
  const tahun = now.getFullYear();
  const bulan = now.getMonth() + 1;

  // null = ikuti nilai tersimpan / total anggaran amplop.
  const [draft, setDraft] = useState<string | null>(null);

  const totalAnggaran = amplop.reduce((t, a) => t + num(a.anggaran), 0);
  const terpakai = pengeluaranPeriode(pengeluaran, bulan, tahun).reduce(
    (t, p) => t + num(p.nominal),
    0
  );

  const nominalTersimpan = akun.targetAnggaran ?? totalAnggaran;
  const target =
    draft ??
    (akunReady && nominalTersimpan ? formatRibuan(String(nominalTersimpan)) : "");

  const targetNominal = Number(target.replace(/\D/g, "")) || 0;
  const persen = targetNominal > 0 ? (terpakai / targetNominal) * 100 : 0;
  const sisa = targetNominal - terpakai;

  const handleSave = () => {
    if (targetNominal <= 0) {
      Alert.alert("Target belum valid", "Isi target anggaran bulanan dulu.");
      return;
    }
    simpanTargetAnggaran(targetNominal);
    setDraft(formatRibuan(String(targetNominal)));
    Alert.alert(
      "Tersimpan",
      `Target anggaran ${rupiah(targetNominal)} disimpan.`
    );
  };

  if (!ready || !akunReady) {
    return (
      <View style={[akunStyles.screen, akunStyles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={akunStyles.screen}
      contentContainerStyle={akunStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <AkunHeader title="Target Anggaran" onBack={() => router.back()} />

      <AkunHint>
        Atur batas pengeluaran agar keuanganmu tetap terjaga.
      </AkunHint>

      {/* Kartu ringkasan */}
      <View style={styles.card}>
        <Text style={styles.cardLabel}>
          ANGGARAN {namaBulan.toUpperCase()} {tahun}
        </Text>
        <Text style={styles.cardTotal}>{rupiah(targetNominal)}</Text>
        <Text style={styles.cardDesc}>
          Terpakai {rupiah(terpakai)} dari target bulanan
        </Text>

        <View style={{ marginTop: 12 }}>
          <ProgressBar percent={persen} height={6} />
        </View>

        <Text style={styles.cardSisa}>
          {sisa >= 0
            ? `Sisa anggaran ${rupiah(sisa)}`
            : `Melebihi target ${rupiah(Math.abs(sisa))}`}
        </Text>
      </View>

      <AkunLabel>Target anggaran bulanan</AkunLabel>
      <View style={styles.inputRow}>
        <Text style={styles.inputPrefix}>Rp</Text>
        <TextInput
          style={styles.input}
          value={target}
          onChangeText={(v) => setDraft(formatRibuan(v.replace(/\D/g, "")))}
          placeholder="3.000.000"
          placeholderTextColor={colors.muted}
          keyboardType="numeric"
        />
      </View>

      <AkunLabel>Periode anggaran</AkunLabel>
      <Pressable style={styles.periodRow} disabled>
        <Text style={styles.periodText}>
          Bulanan · Tanggal 1 – akhir bulan
        </Text>
      </Pressable>

      <AkunSectionTitle>Alokasi per kategori</AkunSectionTitle>

      {amplop.length === 0 ? (
        <Text style={styles.empty}>
          Belum ada amplop. Tambahkan amplop dulu di Beranda.
        </Text>
      ) : (
        amplop.map((a) => (
          <View key={a.id} style={styles.allocRow}>
            <Text style={styles.allocName}>{a.nama}</Text>
            <Text style={styles.allocAmount}>{rupiah(a.anggaran)}</Text>
          </View>
        ))
      )}

      <AkunButton label="Simpan Target" onPress={handleSave} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: akunColors.mint,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
  },
  cardLabel: {
    fontSize: 11,
    letterSpacing: 0.4,
    color: colors.primary,
    fontWeight: "700",
  },
  cardTotal: {
    fontSize: 30,
    fontWeight: "700",
    color: colors.text,
    marginTop: 6,
  },
  cardDesc: { fontSize: 12, color: colors.muted, marginTop: 4 },
  cardSisa: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
    marginTop: 12,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputPrefix: { fontSize: 14, color: colors.muted },
  input: {
    flex: 1,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.text,
  },

  periodRow: {
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  periodText: { fontSize: 13, color: colors.text },

  empty: { fontSize: 13, color: colors.muted },

  allocRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: akunColors.border,
  },
  allocName: { fontSize: 13, color: colors.text },
  allocAmount: { fontSize: 13, fontWeight: "700", color: colors.text },
});
