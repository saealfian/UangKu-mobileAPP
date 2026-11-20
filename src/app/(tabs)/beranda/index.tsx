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

import { IconCircle, ProgressBar, colors } from "@/components/uangku";
import { useAkun } from "@/data/akun-context";
import { namaBulan, num, pengeluaranPeriode, rupiah } from "@/data/amplop";
import { useAmplop } from "@/data/amplop-context";
import { getIcon } from "@/data/icons";

export default function BerandaScreen() {
  const router = useRouter();
  const { akun } = useAkun();
  const { amplop, pengeluaran, ready } = useAmplop();

  const sekarang = new Date();
  const bulan = sekarang.getMonth() + 1;
  const tahun = sekarang.getFullYear();

  // Ringkasan dihitung langsung dari data lokal yang tersimpan di perangkat.
  const amplopList = useMemo(() => {
    const bulanIni = pengeluaranPeriode(pengeluaran, bulan, tahun);

    return amplop.map((a) => {
      const terpakai = bulanIni
        .filter((p) => p.amplopId === a.id)
        .reduce((total, p) => total + num(p.nominal), 0);

      return { ...a, terpakai, sisa: a.anggaran - terpakai };
    });
  }, [amplop, pengeluaran, bulan, tahun]);

  const totalAnggaran = amplopList.reduce((total, a) => total + num(a.anggaran), 0);
  const totalTerpakai = amplopList.reduce((total, a) => total + num(a.terpakai), 0);

  const nama = akun.profil.nama.trim() || "Pengguna";

  if (!ready) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.small}>Memuat data...</Text>
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

          <Text style={styles.greeting}>Halo, {nama}!</Text>
        </View>

        <Pressable
          style={styles.avatar}
          onPress={() => router.push("/profil")}
        >
          <Text style={styles.avatarText}>
            {nama.charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      {/* Ringkasan bulan ini */}
      <View style={styles.summary}>
        <View style={styles.row}>
          <Text style={styles.small}>Total Bulan Ini</Text>
          <Text style={styles.small}>
            {namaBulan(bulan)} {tahun}
          </Text>
        </View>

        <Text style={styles.total}>
          {rupiah(totalAnggaran - totalTerpakai)}
        </Text>

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
          const used = num(a.terpakai);
          const budget = num(a.anggaran);

          return (
            <Pressable
              key={a.id}
              style={({ pressed }) => [
                styles.card,
                {
                  backgroundColor: a.warna,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/beranda/detail-amplop",
                  params: { id: a.id },
                })
              }
            >
              <View style={styles.row}>
                <IconCircle source={getIcon(a.icon)} />

                <MaterialIcons
                  name="north-east"
                  size={14}
                  color={colors.muted}
                />
              </View>

              <Text style={styles.cardName}>{a.nama}</Text>

              <Text style={styles.cardAmount}>{rupiah(budget)}</Text>

              <ProgressBar
                percent={budget > 0 ? (used / budget) * 100 : 0}
                height={4}
              />

              <Text style={styles.tiny}>{rupiah(used)} terpakai</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Footer tip */}
      <View style={styles.tip}>
        <MaterialIcons name="eco" size={14} color={colors.primary} />

        <Text style={styles.small}>
          Sedikit dicatat, uang lebih terjaga.
        </Text>
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  brand: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.primary,
  },

  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.text,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.mint,
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.primary,
  },

  summary: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 16,
  },

  total: {
    fontSize: 32,
    fontWeight: "700",
    color: colors.text,
    marginTop: 8,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.08)",
    marginVertical: 12,
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
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
    marginTop: 24,
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
  },

  card: {
    width: "48.5%",
    borderRadius: 16,
    padding: 12,
    gap: 6,
  },

  cardName: {
    fontSize: 12,
    color: colors.text,
    marginTop: 8,
  },

  cardAmount: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
  },

  tip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 20,
  },

  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: 8,
  },
});
