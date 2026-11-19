import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunNote,
  akunColors,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";
import { useAkun } from "@/data/akun-context";

function InfoRow({
  label,
  value,
  last,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View style={[styles.infoRow, last && { borderBottomWidth: 0 }]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

export default function InformasiAkunScreen() {
  const router = useRouter();
  const { akun } = useAkun();

  return (
    <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
      <AkunHeader title="Informasi Akun" onBack={() => router.back()} />

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Akun pribadimu</Text>
        <Text style={styles.cardDesc}>
          Kelola identitas dan preferensi akun UangKu.
        </Text>
      </View>

      <View style={styles.list}>
        <InfoRow label="Nama pengguna" value={akun.profil.nama || "User"} />
        <InfoRow label="Alamat email" value={akun.profil.email || "-"} />
        <InfoRow
          label="Nomor telepon"
          value={akun.profil.telepon || "Belum ditambahkan"}
        />
        <InfoRow label="Mata uang" value="Rupiah (IDR)" />
        <InfoRow label="Bahasa aplikasi" value="Bahasa Indonesia" last />
      </View>

      <AkunButton
        label="Edit Informasi Akun"
        variant="outline"
        onPress={() => router.push("/profil/edit-profil")}
      />

      <AkunNote>
        Data pribadimu hanya digunakan untuk kebutuhan akun dan tidak
        ditampilkan kepada pengguna lain.
      </AkunNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: akunColors.mint,
    borderRadius: 16,
    padding: 16,
    gap: 4,
  },
  cardTitle: { fontSize: 14, fontWeight: "700", color: colors.primary },
  cardDesc: { fontSize: 12, color: colors.muted },

  list: {
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    marginTop: 22,
  },
  infoRow: {
    paddingVertical: 14,
    gap: 5,
    borderBottomWidth: 1,
    borderBottomColor: akunColors.border,
  },
  infoLabel: { fontSize: 12, color: colors.muted },
  infoValue: { fontSize: 14, fontWeight: "600", color: colors.text },
});
