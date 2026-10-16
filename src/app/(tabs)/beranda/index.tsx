import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { rupiah } from "@/data/amplop";
import { getIcon } from "@/data/icons";
import { amplopService } from "@/api/amplop";
import { dashboardService } from "@/api/dashboard";
import { useAuth } from "@/context/AuthContext";

type AmplopItem = {
  id: number;
  name: string;
  desc: string;
  budget: number;
  bg: string;
  icon?: string;
  terpakai?: number;
  sisa?: number;
};

export default function BerandaScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [amplopList, setAmplopList] = useState<AmplopItem[]>([]);
  const [summary, setSummary] = useState<{
    totalAnggaran: number;
    totalTerpakai: number;
    sisa: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [amplopRes, summaryRes] = await Promise.all([
          amplopService.list(),
          dashboardService.summary(),
        ]);

        if (!cancelled) {
          setAmplopList((amplopRes.amplop || []).map((a: any) => ({
            id: a.id,
            name: a.name,
            desc: a.desc,
            budget: a.budget,
            bg: a.bg || colors.mint,
            icon: a.icon,
            terpakai: a.terpakai,
            sisa: a.sisa,
          })));
          setSummary({
            totalAnggaran: summaryRes.totalAnggaran,
            totalTerpakai: summaryRes.totalTerpakai,
            sisa: summaryRes.sisa,
          });
        }
      } catch (err: any) {
        if (!cancelled) {
          setError(
            err?.data?.message ||
              err?.message ||
              "Gagal memuat data beranda."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const totalAnggaran = summary
    ? summary.totalAnggaran
    : amplopList.reduce((t, a) => t + a.budget, 0);
  const totalTerpakai = summary
    ? summary.totalTerpakai
    : amplopList.reduce((t, a) => t + (a.terpakai ?? 0), 0);

  if (loading) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.small}>Memuat data...</Text>
        </View>
      </ScrollView>
    );
  }

  if (error) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <Pressable
            style={styles.retry}
            onPress={() => {
              setLoading(true);
              setError("");
              void router.replace("/beranda");
            }}
          >
            <Text style={styles.retryText}>Coba lagi</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brand}>UangKu</Text>
          <Text style={styles.greeting}>
            Halo, {user?.nama ? user.nama : "User"}!
          </Text>
        </View>
        <Pressable style={styles.avatar} onPress={() => router.push("/profil")}>
          <Text style={styles.avatarText}>
            {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
          </Text>
        </Pressable>
      </View>

      {/* Ringkasan bulan ini */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.small}>Total Bulan Ini</Text>
          <Text style={styles.small}>Oktober 2026</Text>
        </View>
        <Text style={styles.total}>{rupiah(totalAnggaran - totalTerpakai)}</Text>
        <Text style={styles.small}>Sisa uang bulan ini</Text>
        <View style={styles.divider} />
        <View style={styles.row}>
          <View>
            <Text style={styles.tiny}>Total anggaran</Text>
            <Text style={styles.summaryValue}>{rupiah(totalAnggaran)}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.tiny}>Sudah terpakai</Text>
            <Text style={styles.summaryValue}>{rupiah(totalTerpakai)}</Text>
          </View>
        </View>
      </View>

      {/* Amplop */}
      <View style={[styles.row, styles.sectionHeader]}>
        <Text style={styles.sectionTitle}>Amplop kamu</Text>
        <Text style={styles.small}>{amplopList.length} amplop</Text>
      </View>

      <View style={styles.grid}>
        {amplopList.map((a) => {
          const used = a.terpakai ?? 0;
          return (
            <Pressable
              key={a.id}
              style={({ pressed }) => [
                styles.card,
                { backgroundColor: a.bg, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/beranda/detail-amplop",
                  params: { id: String(a.id) },
                })
              }
            >
              <View style={styles.row}>
                <IconCircle source={getIcon(a.icon)} />
                <MaterialIcons name="north-east" size={14} color={colors.muted} />
              </View>
              <Text style={styles.cardName}>{a.name}</Text>
              <Text style={styles.cardAmount}>{rupiah(a.budget)}</Text>
              <ProgressBar percent={(used / a.budget) * 100} height={4} />
              <Text style={styles.tiny}>{rupiah(used)} terpakai</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer tip */}
      <View style={styles.tip}>
        <MaterialIcons name="eco" size={14} color={colors.primary} />
        <Text style={styles.small}>Sedikit dicatat, uang lebih terjaga.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 24 },
  row: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  brand: { fontSize: 12, fontWeight: "600", color: colors.primary },
  greeting: { fontSize: 24, fontWeight: "700", color: colors.text },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontWeight: "600", color: colors.primary },

  summary: { backgroundColor: colors.mint, borderRadius: 20, padding: 16 },
  total: { fontSize: 32, fontWeight: "700", color: colors.text, marginTop: 8 },
  divider: { height: 1, backgroundColor: "rgba(0,0,0,0.08)", marginVertical: 12 },
  summaryValue: { fontSize: 13, fontWeight: "700", color: colors.text },

  small: { fontSize: 12, color: colors.muted },
  tiny: { fontSize: 10, color: colors.muted },

  sectionHeader: { marginTop: 24, marginBottom: 12 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: colors.text },

  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", rowGap: 12 },
  card: { width: "48.5%", borderRadius: 16, padding: 12, gap: 6 },
  cardName: { fontSize: 12, color: colors.text, marginTop: 8 },
  cardAmount: { fontSize: 17, fontWeight: "700", color: colors.text },

  tip: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 20 },

  center: { alignItems: "center", justifyContent: "center", paddingVertical: 60 },
  errorText: { fontSize: 13, color: colors.danger, textAlign: "center", marginBottom: 12 },
  retry: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: colors.border },
  retryText: { fontSize: 12, fontWeight: "600", color: colors.text },
});
