import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
} from "react-native";

import {
  AkunButton,
  AkunHeader,
  AkunHint,
  AkunLabel,
  AkunNote,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";

export default function UbahKataSandiScreen() {
  const router = useRouter();

  const [lama, setLama] = useState("");
  const [baru, setBaru] = useState("");
  const [konfirmasi, setKonfirmasi] = useState("");
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");

    if (!lama) {
      setError("Masukkan kata sandi saat ini.");
      return;
    }
    if (baru.length < 6) {
      setError("Kata sandi baru minimal 6 karakter.");
      return;
    }
    if (baru === lama) {
      setError("Kata sandi baru harus berbeda dari yang lama.");
      return;
    }
    if (baru !== konfirmasi) {
      setError("Konfirmasi kata sandi belum sama.");
      return;
    }

    setLama("");
    setBaru("");
    setKonfirmasi("");
    Alert.alert("Tersimpan", "Kata sandi berhasil diperbarui.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  return (
    <ScrollView
      style={akunStyles.screen}
      contentContainerStyle={akunStyles.content}
      keyboardShouldPersistTaps="handled"
    >
      <AkunHeader title="Ubah Kata Sandi" onBack={() => router.back()} />

      <AkunHint>
        Gunakan kata sandi yang kuat dan tidak dipakai di akun lain.
      </AkunHint>

      <AkunLabel>Kata sandi saat ini</AkunLabel>
      <TextInput
        style={akunStyles.input}
        value={lama}
        onChangeText={(v) => {
          setLama(v);
          setError("");
        }}
        secureTextEntry
        placeholder="••••••••"
        placeholderTextColor={colors.muted}
      />

      <AkunLabel>Kata sandi baru</AkunLabel>
      <TextInput
        style={akunStyles.input}
        value={baru}
        onChangeText={(v) => {
          setBaru(v);
          setError("");
        }}
        secureTextEntry
        placeholder="Minimal 6 karakter"
        placeholderTextColor={colors.muted}
      />

      <AkunLabel>Konfirmasi kata sandi baru</AkunLabel>
      <TextInput
        style={akunStyles.input}
        value={konfirmasi}
        onChangeText={(v) => {
          setKonfirmasi(v);
          setError("");
        }}
        secureTextEntry
        placeholder="Ulangi kata sandi baru"
        placeholderTextColor={colors.muted}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <AkunButton label="Simpan Kata Sandi" onPress={handleSave} />

      <AkunNote>
        Setelah kata sandi diubah, gunakan kata sandi baru saat masuk berikutnya.
      </AkunNote>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  error: { fontSize: 11, color: colors.danger, marginTop: 12 },
});
