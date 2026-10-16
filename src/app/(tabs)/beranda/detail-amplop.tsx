import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IconCircle, ProgressBar, colors } from "@/components/uangku";
import { pad, rupiah } from "@/data/amplop";
import { getIcon } from "@/data/icons";
import { amplopService } from "@/api/amplop";

type AmplopDetail = {
  id: number;
  name: string;
  desc: string;
  budget: number;
  bg: string;
  icon?: string;
  terpakai?: number;
  sisa?: number;
};

type Expense = {
  id: number;
  day: number;
  note: string;
  amount: number;
  tanggal: string;
  createdAt: string;
};

export default function DetailAmplopScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();

  const [amplop, setAmplop] = useState<AmplopDetail | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!id) return;
      try {
        const data = await amplopService.get(Number(id));
        if (!cancelled) {
          setAmplop({
            id: data.amplop.id,
            name: data.amplop.name,
            desc: data.amplop.desc,
            budget: data.amplop.budget,
            bg: data.amplop.bg || colors.mint,
            icon: data.amplop.icon,
            terpakai: data.amplop.terpakai,
            sisa: data.amplop.sisa,
          });
          setExpenses(
            (data.expenses || []).map((e: any) => ({
              id: e.id,
              day: e.day,
              note: e.note,
              amount: e.amount,
              tanggal: e.tanggal,
              createdAt: e.createdAt,
            }))
          );
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.data?.message || err?.message || "Gagal memuat detail amplop."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </ScrollView>
    );
  }

  if (error || !amplop) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Text style={styles.errorText}>
            {error || "Data amplop tidak ditemukan."}
          </Text>
          <Pressable style={styles.back} onPress={() => router.back()}>
            <Text style={styles.backText}>Kembali</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  const used = amplop.terpakai ?? 0;
  const sisa = amplop.sisa ?? amplop.budget - used;
  const percent = amplop.budget ? (used / amplop.budget) * 100 : 0;
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
  );

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
        <View style={[styles.iconBox, { backgroundColor: amplop.bg }]}>
          <IconCircle source={getIcon(amplop.icon)} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{amplop.name}</Text>
          <Text style={styles.small}>{amplop.desc}</Text>
        </View>
      </View>

      <Pressable style={styles.pill}>
        <MaterialIcons name="calendar-today" size={13} color={colors.muted} />
        <Text style={styles.pillText}>Oktober 2026</Text>
        <MaterialIcons name="keyboard-arrow-down" size={16} color={colors.muted} />
      </Pressable>

      {/* Kartu sisa uang */}
      <View style={[styles.card, { backgroundColor: amplop.bg }]}>
        <Text style={styles.cardLabel}>Sisa uang</Text>
        <Text style={styles.remaining}>{rupiah(sisa)}</Text>
        <Text style={styles.small}>Dari anggaran {rupiah(amplop.budget)}</Text>

        <View style={[styles.row, { marginTop: 16, marginBottom: 8 }]}>
          <Text style={styles.usageLabel}>Pemakaian anggaran</Text>
          <Text style={styles.percent}>{Math.round(percent)}%</Text>
        </View>
        <ProgressBar percent={percent} height={8} />
        <Text style={[styles.tiny, { marginTop: 10 }]}>
          {rupiah(used)} sudah terpakai
        </Text>
      </View>

      {/* Pengeluaran terbaru */}
      <View style={[styles.row, styles.sectionHeader]}>
        <Text style={styles.sectionTitle}>Pengeluaran terbaru</Text>
        <Text style={styles.small}>{sortedExpenses.length} catatan</Text>
      </View>
      <View style={[styles.row, { marginBottom: 8 }]}>
        <Text style={styles.tiny}>Tanggal</Text>
        <Text style={styles.tiny}>Jumlah</Text>
      </View>

      {sortedExpenses.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Belum ada pengeluaran di amplop ini.</Text>
        </View>
      ) : (
        sortedExpenses.map((e, i) => (
          <View key={e.id} style={styles.recentRow}>
            <View>
              <Text style={styles.recentDate}>{pad(e.day)} Okt</Text>
              <Text style={styles.tiny}>{e.note}</Text>
            </View>
            <Text style={styles.recentAmount}>{rupiah(e.amount)}</Text>
          </View>
        ))
      )}

      {/* CTA: tambah pengeluaran untuk amplop ini */}
      <Pressable
        style={styles.cta}
        onPress={() =>
          router.push({ pathname: "/tambah-pengeluaran", params: { category: String(amplop.id) } })
        }
      >
        <Text style={styles.ctaText}>Tambah pengeluaran</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  header: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  backButton: { width: 34, height: 34, borderRadius: 17, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 16, fontWeight: "600", color: colors.text },

  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 52, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  name: { fontSize: 22, fontWeight: "700", color: colors.text },

  pill: { flexDirection: "row", alignItems: "center", alignSelf: "flex-start", gap: 6, borderWidth: 1, borderColor: colors.border, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, marginTop: 14, marginBottom: 16 },
  pillText: { fontSize: 11, color: colors.text },

  card: { borderRadius: 20, padding: 16 },
  cardLabel: { fontSize: 13, color: colors.muted },
  remaining: { fontSize: 32, fontWeight: "700", color: colors.text, marginVertical: 4 },
  usageLabel: { fontSize: 12, fontWeight: "600", color: colors.text },
  percent: { fontSize: 15, fontWeight: "700", color: colors.primary },

  small: { fontSize: 12, color: colors.muted },
  tiny: { fontSize: 10, color: colors.muted },

  sectionHeader: { marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },

  recentRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border },
  recentDate: { fontSize: 12, color: colors.text, marginBottom: 4 },
  recentAmount: { fontSize: 14, fontWeight: "700", color: colors.text },

  cta: { height: 48, borderRadius: 12, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", marginTop: 24 },
  ctaText: { fontSize: 14, fontWeight: "700", color: colors.white },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  errorText: { fontSize: 13, color: colors.danger, textAlign: "center", marginBottom: 12 },
  back: { marginTop: 16 },
  backText: { fontSize: 14, color: colors.primary, fontWeight: "600" },

  empty: { alignItems: "center", paddingVertical: 30 },
  emptyText: { fontSize: 13, color: colors.muted },
});
