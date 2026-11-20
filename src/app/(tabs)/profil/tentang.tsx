import { MaterialIcons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunRow,
  AkunSectionTitle,
  akunColors,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";

const versi = Constants.expoConfig?.version ?? "1.0.0";

export default function TentangScreen() {
  const router = useRouter();
  const [ratingOpen, setRatingOpen] = useState(false);
  const [rating, setRating] = useState(0);

  return (
    <>
      <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
        <AkunHeader title="Tentang UangKu" onBack={() => router.back()} />

        {/* Kartu logo */}
        <View style={styles.card}>
          <Image
            source={require("../../../../assets/images/icon1.png")}
            style={styles.logo}
            resizeMode="cover"
          />
          <Text style={styles.brand}>UangKu</Text>
          <Text style={styles.tagline}>
            Uang terencana, hidup lebih tenang.
          </Text>
          <Text style={styles.version}>Versi {versi}</Text>
        </View>

        <AkunSectionTitle>Teman mengatur keuanganmu</AkunSectionTitle>
        <Text style={styles.paragraph}>
          UangKu membantumu mencatat pengeluaran, membagi uang ke dalam amplop,
          dan menjaga anggaran dalam satu tempat.
        </Text>
        <Text style={styles.paragraph}>
          Mulai dari langkah kecil untuk membangun kebiasaan finansial yang
          lebih baik setiap hari.
        </Text>

        <View style={{ marginTop: 14 }}>
          <AkunRow
            title="Kebijakan Privasi"
            onPress={() => router.push("/profil/kebijakan-privasi")}
          />
          <AkunRow
            title="Syarat & Ketentuan"
            onPress={() => router.push("/profil/syarat-ketentuan")}
          />
          <AkunRow
            title="Beri Penilaian"
            onPress={() => {
              setRating(0);
              setRatingOpen(true);
            }}
          />
        </View>

        <Text style={styles.footer}>
          Dibuat untuk keuangan yang lebih terarah.{"\n"}© 2026 UangKu
        </Text>
      </ScrollView>

      <Modal
        visible={ratingOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setRatingOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setRatingOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Bagaimana pengalamanmu?</Text>
            <Text style={styles.sheetHint}>
              Penilaianmu membantu kami membuat UangKu lebih baik.
            </Text>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((n) => (
                <Pressable
                  key={n}
                  hitSlop={6}
                  onPress={() => setRating(n)}
                >
                  <MaterialIcons
                    name={n <= rating ? "star" : "star-border"}
                    size={34}
                    color={n <= rating ? colors.primary : akunColors.chevron}
                  />
                </Pressable>
              ))}
            </View>

            {rating > 0 && (
              <Text style={styles.thanks}>
                {rating >= 4
                  ? "Terima kasih! Senang UangKu membantu."
                  : "Terima kasih atas masukannya, kami akan terus memperbaiki."}
              </Text>
            )}

            <AkunButton
              label={rating > 0 ? "Kirim Penilaian" : "Tutup"}
              onPress={() => {
                if (rating > 0) {
                  setRatingOpen(false);
                } else {
                  setRatingOpen(false);
                }
              }}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: akunColors.mint,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 20,
  },
  brand: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 14,
  },
  tagline: { fontSize: 12, color: colors.muted, marginTop: 6 },
  version: { fontSize: 11, color: colors.muted, marginTop: 10 },

  paragraph: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
    marginTop: 10,
  },

  footer: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
    textAlign: "center",
    marginTop: 24,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(18,32,25,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sheet: { backgroundColor: colors.white, borderRadius: 20, padding: 20 },
  sheetTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  sheetHint: { fontSize: 12, color: colors.muted, marginTop: 4 },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
  },
  thanks: {
    fontSize: 12,
    color: colors.primary,
    textAlign: "center",
    marginTop: 14,
  },
});
