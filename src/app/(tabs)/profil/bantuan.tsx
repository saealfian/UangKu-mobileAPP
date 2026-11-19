import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunHint,
  AkunSectionTitle,
  AkunTitle,
  akunColors,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";

const FAQ = [
  {
    q: "Bagaimana cara mencatat pengeluaran?",
    a: "Buka Beranda, pilih Tambah Pengeluaran, isi nominal dan kategori, lalu simpan catatanmu.",
  },
  {
    q: "Bagaimana mengatur target anggaran?",
    a: "Buka menu Profil, pilih Target Anggaran, isi target bulanan, lalu tekan Simpan Target.",
  },
  {
    q: "Apa itu amplop anggaran?",
    a: "Amplop adalah wadah anggaran per kategori, misalnya Makan & Minum atau Transportasi, agar pengeluaran lebih terkendali.",
  },
  {
    q: "Bagaimana menjaga keamanan akun?",
    a: "Aktifkan PIN aplikasi dan biometrik di menu Keamanan Akun, serta jangan bagikan kode verifikasi kepada siapa pun.",
  },
];

const EMAIL_DUKUNGAN = "dukungan@uangku.app";

export default function BantuanScreen() {
  const router = useRouter();
  const [terbuka, setTerbuka] = useState(0);

  const hubungiDukungan = async () => {
    const url = `mailto:${EMAIL_DUKUNGAN}?subject=${encodeURIComponent(
      "Bantuan UangKu"
    )}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert("Hubungi Dukungan", `Kirim email ke ${EMAIL_DUKUNGAN}.`);
    }
  };

  return (
    <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
      <AkunHeader title="Bantuan & Dukungan" onBack={() => router.back()} />

      <AkunTitle>Ada yang bisa kami bantu?</AkunTitle>
      <View style={{ marginTop: 8 }}>
        <AkunHint>
          Temukan jawaban untuk mengelola uangmu dengan lebih mudah.
        </AkunHint>
      </View>

      <View style={styles.helpCard}>
        <MaterialIcons
          name="help-outline"
          size={24}
          color={colors.primary}
        />
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={styles.helpTitle}>Baru menggunakan UangKu?</Text>
          <Text style={styles.helpDesc}>
            Kenali cara mencatat, membuat amplop, dan mengatur anggaran.
          </Text>
        </View>
      </View>

      <AkunSectionTitle>Pertanyaan yang sering ditanyakan</AkunSectionTitle>

      {FAQ.map((item, index) => {
        const aktif = terbuka === index;
        return (
          <Pressable
            key={item.q}
            onPress={() => setTerbuka(aktif ? -1 : index)}
            style={({ pressed }) => [
              styles.faq,
              aktif && styles.faqActive,
              { opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <View style={styles.faqHeader}>
              <Text style={[styles.faqQ, aktif && styles.faqQActive]}>
                {item.q}
              </Text>
              {!aktif && (
                <MaterialIcons
                  name="chevron-right"
                  size={20}
                  color={akunColors.chevron}
                />
              )}
            </View>
            {aktif && <Text style={styles.faqA}>{item.a}</Text>}
          </Pressable>
        );
      })}

      <AkunSectionTitle>Masih butuh bantuan?</AkunSectionTitle>
      <AkunHint>
        Ceritakan kendalamu melalui menu hubungi dukungan.
      </AkunHint>

      <AkunButton label="Hubungi Dukungan" onPress={hubungiDukungan} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  helpCard: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
    backgroundColor: akunColors.mint,
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
  },
  helpTitle: { fontSize: 14, fontWeight: "700", color: colors.primary },
  helpDesc: { fontSize: 12, lineHeight: 18, color: colors.muted },

  faq: {
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: colors.white,
  },
  faqActive: {
    backgroundColor: akunColors.mint,
    borderColor: akunColors.mint,
  },
  faqHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  faqQ: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    lineHeight: 20,
  },
  faqQActive: { color: colors.text, fontWeight: "700" },
  faqA: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
    marginTop: 8,
  },
});
