import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { colors } from "@/components/uangku";
import { pad, rupiah } from "@/data/amplop";
import { pengeluaranService } from "@/api/pengeluaran";

type Expense = {
  id: number;
  day: number;
  note: string;
  amount: number;
  category: string;
  tanggal: string;
};

export default function CatatanScreen() {
  const router = useRouter();

  const [pengeluaranList, setPengeluaranList] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await pengeluaranService.list({ bulan, tahun });
        if (!cancelled) {
          setPengeluaranList(
            (data.pengeluaran || []).map((e: any) => ({
              id: e.id,
              day: e.day,
              note: e.note,
              amount: e.amount,
              category: e.category || "-",
              tanggal: e.tanggal,
            }))
          );
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.data?.message || err?.message || "Gagal memuat catatan."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [bulan, tahun]);

  const total = pengeluaranList.reduce((t, e) => t + e.amount, 0);

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Catatan Pengeluaran{"\n"}Bulanan</Text>

      {/* Filter bulan */}
      <View style={[styles.row, styles.filterRow]}>
        <Pressable style={styles.pill}>
          <MaterialIcons name="calendar-today" size={13} color={colors.muted} />
          <Text style={styles.pillText}>{pad(bulan)}/{tahun}</Text>
          <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.muted} />
        </Pressable>
        <Text style={styles.small}>{pengeluaranList.length} pengeluaran</Text>
      </View>

      {/* Tabel */}
      <View style={styles.table}>
        <View style={[styles.tr, styles.thead]}>
          <Text style={[styles.th, styles.colDate]}>Tanggal</Text>
          <Text style={[styles.th, styles.colCat]}>Kategori</Text>
          <Text style={[styles.th, styles.colAmount]}>Jumlah</Text>
        </View>

        {pengeluaranList.length === 0 ? (
          <View style={[styles.tr, styles.trBody]}>
            <Text style={[styles.cell, styles.colDate]}>-</Text>
            <Text style={[styles.cell, styles.colCat]}>Belum ada catatan</Text>
            <Text style={[styles.cell, styles.colAmount]}>-</Text>
          </View>
        ) : (
          pengeluaranList.map((e) => (
            <View key={e.id} style={[styles.tr, styles.trBody]}>
              <Text style={[styles.dateText, styles.colDate]}>
                {pad(e.day)} Okt
              </Text>
              <Text style={[styles.cell, styles.colCat]}>{e.category}</Text>
              <Text style={[styles.cell, styles.colAmount]}>{rupiah(e.amount)}</Text>
            </View>
          ))
        )}

        <View style={[styles.tr, styles.tfoot]}>
          <Text style={styles.cell}>Total bulan ini</Text>
          <Text style={styles.totalText}>{rupiah(total)}</Text>
        </View>
      </View>

      {/* CTA tambah */}
      <Pressable
        style={styles.addWrap}
        onPress={() => router.push("/tambah-pengeluaran")}
      >
        <View style={styles.fab}>
          <MaterialIcons name="add" size={28} color={colors.white} />
        </View>
        <Text style={styles.addLabel}>Tambah pengeluaran</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  title: { fontSize: 24, fontWeight: "700", color: colors.text, lineHeight: 30 },
  small: { fontSize: 11, color: colors.muted },

  filterRow: { marginTop: 20, marginBottom: 16 },
  pill: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8 },
  pillText: { fontSize: 11, color: colors.text },

  table: { borderWidth: 1, borderColor: colors.border, borderRadius: 16, overflow: "hidden" },
  tr: { flexDirection: "row", alignItems: "center", paddingHorizontal: 12 },
  thead: { backgroundColor: colors.mint, height: 34 },
  th: { fontSize: 10, color: colors.text },
  trBody: { height: 48, borderBottomWidth: 1, borderBottomColor: colors.border },
  tfoot: { height: 48, justifyContent: "space-between" },

  colDate: { width: 46 },
  colCat: { flex: 1 },
  colAmount: { textAlign: "right" },

  dateText: { fontSize: 10, color: colors.muted },
  cell: { fontSize: 11, color: colors.text },
  totalText: { fontSize: 15, fontWeight: "700", color: colors.primary },

  addWrap: { alignItems: "center", marginTop: 24, gap: 8 },
  fab: { width: 52, height: 52, borderRadius: 26, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center" },
  addLabel: { fontSize: 12, color: colors.primary },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  errorText: { fontSize: 13, color: colors.danger, textAlign: "center" },
});
