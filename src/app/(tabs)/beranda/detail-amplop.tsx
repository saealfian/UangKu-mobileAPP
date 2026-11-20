import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { IconCircle, ProgressBar, colors } from "@/components/uangku";
import {
  hariDariIso,
  namaBulan,
  num,
  pad,
  pengeluaranPeriode,
  rupiah,
} from "@/data/amplop";
import { useAmplop } from "@/data/amplop-context";
import { getIcon } from "@/data/icons";

export default function DetailAmplopScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { amplop, pengeluaran, ready } = useAmplop();

  const sekarang = new Date();
  const bulan = sekarang.getMonth() + 1;
  const tahun = sekarang.getFullYear();

  const data = amplop.find((a) => a.id === id);

  const expenses = useMemo(() => {
    if (!data) return [];

    return pengeluaranPeriode(pengeluaran, bulan, tahun)
      .filter((p) => p.amplopId === data.id)
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal));
  }, [data, pengeluaran, bulan, tahun]);

  if (!ready) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScrollView>
    );
  }

  if (!data) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Text style={styles.errorText}>Data amplop tidak ditemukan.</Text>

          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>Kembali</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const budget = num(data.anggaran);
  const used = expenses.reduce((total, e) => total + num(e.nominal), 0);
  const sisa = budget - used;
  const percent = budget > 0 ? (used / budget) * 100 : 0;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={18} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Detail Amplop</Text>
      </View>

      {/* Info amplop */}
      <View style={styles.infoRow}>
        <View style={[styles.iconBox, { backgroundColor: data.warna }]}>
          <IconCircle source={getIcon(data.icon)} />
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{data.nama}</Text>
          <Text style={styles.small}>{data.deskripsi}</Text>
        </View>
      </View>

      {/* Periode */}
      <Pressable style={styles.pill}>
        <MaterialIcons
          name="calendar-today"
          size={13}
          color={colors.muted}
        />

        <Text style={styles.pillText}>
          {namaBulan(bulan)} {tahun}
        </Text>

        <MaterialIcons
          name="keyboard-arrow-down"
          size={16}
          color={colors.muted}
        />
      </Pressable>

      {/* Kartu sisa uang */}
      <View style={[styles.card, { backgroundColor: data.warna }]}>
        <Text style={styles.cardLabel}>Sisa uang</Text>

        <Text style={styles.remaining}>{rupiah(sisa)}</Text>

        <Text style={styles.small}>Dari anggaran {rupiah(budget)}</Text>

        <View style={styles.usageRow}>
          <Text style={styles.usageLabel}>Pemakaian anggaran</Text>

          <Text style={styles.percent}>{Math.round(percent)}%</Text>
        </View>

        <ProgressBar percent={percent} height={8} />

        <Text style={styles.cardTiny}>
          {rupiah(used)} sudah terpakai
        </Text>
      </View>

      {/* Pengeluaran terbaru */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pengeluaran terbaru</Text>

        <Text style={styles.small}>{expenses.length} catatan</Text>
      </View>

      <View style={styles.tableHeader}>
        <Text style={styles.tiny}>Tanggal</Text>
        <Text style={styles.tiny}>Jumlah</Text>
      </View>

      {expenses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Belum ada pengeluaran di amplop ini.
          </Text>
        </View>
      ) : (
        expenses.map((e) => (
          <View key={e.id} style={styles.recentRow}>
            <View>
              <Text style={styles.recentDate}>
                {pad(hariDariIso(e.tanggal))}{" "}
                {namaBulan(bulan).slice(0, 3)}
              </Text>

              <Text style={styles.tiny}>{e.catatan}</Text>
            </View>

            <Text style={styles.recentAmount}>{rupiah(e.nominal)}</Text>
          </View>
        ))
      )}

      {/* Tambah pengeluaran */}
      <Pressable
        style={styles.cta}
        onPress={() =>
          router.push({
            pathname: "/tambah-pengeluaran",
            params: { category: data.id },
          })
        }
      >
        <Text style={styles.ctaText}>Tambah pengeluaran</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 24,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },

  errorText: {
    fontSize: 13,
    color: colors.danger,
    textAlign: "center",
    marginBottom: 12,
  },

  back: {
    marginTop: 16,
  },

  backText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  name: {
    fontSize: 22,
    fontWeight: "700",
    color: colors.text,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 14,
    marginBottom: 16,
  },

  pillText: {
    fontSize: 11,
    color: colors.text,
  },

  card: {
    borderRadius: 20,
    padding: 16,
  },

  cardLabel: {
    fontSize: 13,
    color: colors.muted,
  },

  remaining: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginVertical: 4,
  },

  usageRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    marginBottom: 8,
  },

  usageLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },

  percent: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },

  cardTiny: {
    fontSize: 10,
    color: colors.muted,
    marginTop: 10,
  },

  small: {
    fontSize: 12,
    color: colors.muted,
  },

  tiny: {
    fontSize: 10,
    color: colors.muted,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  recentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  recentDate: {
    fontSize: 12,
    color: colors.text,
    marginBottom: 4,
  },

  recentAmount: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },

  empty: {
    alignItems: "center",
    paddingVertical: 30,
  },

  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },

  cta: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 24,
  },

  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
