import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
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
  AkunHighlightCard,
  AkunHint,
  AkunLabel,
  AkunNote,
  AkunRow,
  AkunSwitchRow,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";
import { useAkun } from "@/data/akun-context";

const perangkat =
  Platform.OS === "ios" ? "iOS" : Platform.OS === "android" ? "Android" : "Web";

export default function KeamananAkunScreen() {
  const router = useRouter();
  const { akun, simpanKeamanan } = useAkun();

  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const bukaPin = () => {
    setPin("");
    setPinError("");
    setPinOpen(true);
  };

  const handleSimpanPin = () => {
    if (pin.length !== 6) {
      setPinError("PIN harus 6 digit angka.");
      return;
    }
    simpanKeamanan({ pin });
    setPinOpen(false);
    Alert.alert("PIN tersimpan", "PIN aplikasi berhasil dibuat.");
  };

  const handleHapusPin = () => {
    Alert.alert("Hapus PIN", "Yakin ingin menghapus PIN aplikasi?", [
      { text: "Batal", style: "cancel" },
      {
        text: "Hapus",
        style: "destructive",
        onPress: () => {
          simpanKeamanan({ pin: null });
          setPinOpen(false);
        },
      },
    ]);
  };

  return (
    <>
      <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
        <AkunHeader title="Keamanan Akun" onBack={() => router.back()} />

        <AkunHint>
          Jaga akses akun dan data keuanganmu tetap aman.
        </AkunHint>

        <AkunHighlightCard
          icon="verified-user"
          title="Lindungi akunmu"
          description="Aktifkan PIN atau biometrik untuk perlindungan tambahan."
        />

        <AkunLabel>Akses &amp; verifikasi</AkunLabel>

        <Text style={styles.groupLabel}>Kata sandi</Text>
        <AkunRow
          title="Ubah kata sandi"
          onPress={() => router.push("/profil/ubah-kata-sandi")}
        />

        <Text style={styles.groupLabel}>PIN aplikasi</Text>
        <AkunRow
          title={akun.keamanan.pin ? "Ubah PIN 6 digit" : "Buat PIN 6 digit"}
          onPress={bukaPin}
        />

        <View style={{ marginTop: 12 }}>
          <AkunSwitchRow
            title="Masuk dengan biometrik"
            subtitle="Gunakan sidik jari atau pengenalan wajah."
            value={akun.keamanan.biometrik}
            onValueChange={(v) => simpanKeamanan({ biometrik: v })}
          />
          <AkunSwitchRow
            title="Verifikasi dua langkah"
            subtitle="Tambahkan kode verifikasi saat masuk."
            value={akun.keamanan.duaLangkah}
            onValueChange={(v) => simpanKeamanan({ duaLangkah: v })}
          />
          <AkunRow
            title="Perangkat saat ini"
            subtitle={`${perangkat} • Sesi aktif sekarang`}
            showChevron={false}
          />
        </View>

        <AkunNote>
          Jangan bagikan kata sandi, PIN, atau kode verifikasi kepada siapa pun.
        </AkunNote>
      </ScrollView>

      <Modal
        visible={pinOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setPinOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setPinOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>
              {akun.keamanan.pin ? "Ubah PIN aplikasi" : "Buat PIN aplikasi"}
            </Text>
            <Text style={styles.sheetHint}>
              Masukkan 6 digit angka untuk mengunci aplikasi.
            </Text>

            <TextInput
              style={styles.pinInput}
              value={pin}
              onChangeText={(v) => {
                setPin(v.replace(/\D/g, "").slice(0, 6));
                setPinError("");
              }}
              keyboardType="number-pad"
              maxLength={6}
              secureTextEntry
              placeholder="••••••"
              placeholderTextColor={colors.muted}
              autoFocus
            />

            {!!pinError && <Text style={styles.error}>{pinError}</Text>}

            <AkunButton label="Simpan PIN" onPress={handleSimpanPin} />

            {!!akun.keamanan.pin && (
              <AkunButton
                label="Hapus PIN"
                variant="outline"
                onPress={handleHapusPin}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  groupLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginTop: 14,
    marginBottom: 8,
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
  pinInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingVertical: 14,
    marginTop: 16,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: "center",
    color: colors.text,
  },
  error: { fontSize: 11, color: colors.danger, marginTop: 8 },
});
