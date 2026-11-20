import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "@/components/uangku";
import {
  hariDariIso,
  namaBulan,
  num,
  pad,
  pengeluaranPeriode,
  rupiah,
} from "@/data/amplop";
import { useAmplop } from "@/data/amplop-context";

export default function CatatanScreen() {
  const router = useRouter();
  const { amplop, pengeluaran, ready } = useAmplop();

  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const labelBulan = namaBulan(bulan);

  // Gabungkan pengeluaran dengan nama amplopnya, urut dari tanggal terbaru.
  const pengeluaranList = useMemo(() => {
    const namaAmplop = new Map(amplop.map((a) => [a.id, a.nama]));

    return pengeluaranPeriode(pengeluaran, bulan, tahun)
      .slice()
      .sort((a, b) => b.tanggal.localeCompare(a.tanggal))
      .map((e) => ({
        id: e.id,
        day: hariDariIso(e.tanggal),
        note: e.catatan,
        amount: num(e.nominal),
        category: namaAmplop.get(e.amplopId) ?? "-",
      }));
  }, [amplop, pengeluaran, bulan, tahun]);

  const total = pengeluaranList.reduce((t, e) => t + num(e.amount), 0);

  if (!ready) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Judul */}
      <Text style={styles.title}>
        Catatan Pengeluaran{"\n"}Bulanan
      </Text>

      {/* Filter bulan */}
      <View style={[styles.row, styles.filterRow]}>
        <Pressable style={styles.pill}>
          <MaterialIcons
            name="calendar-today"
            size={13}
            color={colors.muted}
          />

          <Text style={styles.pillText}>
            {labelBulan} {tahun}
          </Text>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={16}
            color={colors.muted}
          />
        </Pressable>

        <Text style={styles.small}>
          {pengeluaranList.length} pengeluaran
        </Text>
      </View>

      {/* Tabel pengeluaran */}
      <View style={styles.table}>
        <View style={[styles.tr, styles.thead]}>
          <Text style={[styles.th, styles.colDate]}>Tanggal</Text>

          <Text style={[styles.th, styles.colCat]}>Kategori</Text>

          <Text style={[styles.th, styles.colAmount]}>Jumlah</Text>
        </View>

        {pengeluaranList.length === 0 ? (
          <View style={[styles.tr, styles.trBody]}>
            <Text style={[styles.cell, styles.colDate]}>-</Text>

            <Text style={[styles.cell, styles.colCat]}>
              Belum ada catatan
            </Text>

            <Text style={[styles.cell, styles.colAmount]}>-</Text>
          </View>
        ) : (
          pengeluaranList.map((e) => (
            <View key={e.id} style={[styles.tr, styles.trBody]}>
              <Text style={[styles.dateText, styles.colDate]}>
                {pad(e.day)} {labelBulan.substring(0, 3)}
              </Text>

              <Text
                style={[styles.cell, styles.colCat]}
                numberOfLines={1}
              >
                {e.category}
              </Text>

              <Text style={[styles.cell, styles.colAmount]}>
                {rupiah(e.amount)}
              </Text>
            </View>
          ))
        )}

        {/* Total */}
        <View style={[styles.tr, styles.tfoot]}>
          <Text style={styles.cell}>Total bulan ini</Text>

          <Text style={styles.totalText}>{rupiah(total)}</Text>
        </View>
      </View>

      {/* Tambah pengeluaran */}
      <View style={styles.addWrap}>
        <Pressable
          style={styles.fab}
          onPress={() => router.push("/tambah-pengeluaran")}
        >
          <MaterialIcons name="add" size={28} color={colors.white} />
        </Pressable>

        <Text style={styles.addLabel}>Tambah pengeluaran</Text>
      </View>
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

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 30,
  },

  small: {
    fontSize: 11,
    color: colors.muted,
  },

  filterRow: {
    marginTop: 20,
    marginBottom: 16,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  pillText: {
    fontSize: 11,
    color: colors.text,
  },

  table: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 16,
    overflow: "hidden",
  },

  tr: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },

  thead: {
    backgroundColor: colors.mint,
    height: 34,
  },

  th: {
    fontSize: 10,
    color: colors.text,
  },

  trBody: {
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  tfoot: {
    height: 48,
    justifyContent: "space-between",
  },

  colDate: {
    width: 46,
  },

  colCat: {
    flex: 1,
  },

  colAmount: {
    textAlign: "right",
  },

  dateText: {
    fontSize: 10,
    color: colors.muted,
  },

  cell: {
    fontSize: 11,
    color: colors.text,
  },

  totalText: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.primary,
  },

  addWrap: {
    alignItems: "center",
    marginTop: 24,
    gap: 8,
  },

  fab: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  addLabel: {
    fontSize: 12,
    color: colors.primary,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
});
