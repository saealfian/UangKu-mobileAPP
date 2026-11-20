import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "@/components/uangku";
import { tanggalHariIni } from "@/data/amplop";
import { useAmplop } from "@/data/amplop-context";

export default function TambahPengeluaranScreen() {
  const router = useRouter();

  const { category } = useLocalSearchParams<{
    category?: string;
  }>();

  const { amplop, tambahPengeluaran, ready } = useAmplop();

  const [pilihan, setPilihan] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState("");

  // Amplop default: dari kategori yang dipilih di detail, atau amplop pertama.
  const defaultId =
    (category && amplop.some((a) => a.id === category) ? category : null) ??
    amplop[0]?.id ??
    null;

  const selected = pilihan ?? defaultId;

  const handleSave = () => {
    setError("");

    if (!selected) {
      setError("Pilih kategori terlebih dahulu.");
      return;
    }

    const nominal = Number(amount.replace(/\D/g, ""));

    if (!nominal || nominal <= 0) {
      setError("Isi jumlah pengeluaran dengan benar.");
      return;
    }

    // Tersimpan langsung di perangkat, tanpa koneksi internet.
    tambahPengeluaran({
      amplopId: selected,
      catatan: note.trim() || "Pengeluaran",
      nominal,
      tanggal: tanggalHariIni(),
    });

    router.back();
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="close" size={18} color={colors.text} />
        </Pressable>

        <Text style={styles.headerTitle}>Tambah Pengeluaran</Text>
      </View>

      {/* Kategori */}
      <Text style={styles.label}>Kategori</Text>

      {!ready ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.loadingText}>Memuat kategori...</Text>
        </View>
      ) : (
        <View style={styles.chips}>
          {amplop.map((a) => {
            const active = a.id === selected;

            return (
              <Pressable
                key={a.id}
                onPress={() => setPilihan(a.id)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text
                  style={[
                    styles.chipText,
                    active && styles.chipTextActive,
                  ]}
                >
                  {a.nama}
                </Text>
              </Pressable>
            );
          })}
        </View>
      )}

      {/* Nominal */}
      <Text style={styles.label}>Jumlah</Text>

      <TextInput
        style={styles.input}
        placeholder="Contoh: 25000"
        placeholderTextColor={colors.muted}
        keyboardType="numeric"
        value={amount}
        onChangeText={(value) => {
          setAmount(value);
          setError("");
        }}
      />

      {/* Catatan */}
      <Text style={styles.label}>Catatan</Text>

      <TextInput
        style={[styles.input, { height: 90, textAlignVertical: "top" }]}
        placeholder="Misal: makan siang"
        placeholderTextColor={colors.muted}
        multiline
        value={note}
        onChangeText={setNote}
      />

      {/* Error */}
      {!!error && <Text style={styles.error}>{error}</Text>}

      {/* Simpan */}
      <Pressable
        style={[styles.cta, { backgroundColor: colors.primary }]}
        onPress={handleSave}
        disabled={!ready}
      >
        <Text style={styles.ctaText}>Simpan</Text>
      </Pressable>
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
    paddingTop: 32,
    paddingBottom: 32,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },

  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
    marginTop: 20,
    marginBottom: 8,
  },

  loadingBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },

  loadingText: {
    fontSize: 12,
    color: colors.muted,
  },

  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
  },

  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  chipText: {
    fontSize: 12,
    color: colors.text,
  },

  chipTextActive: {
    color: colors.white,
    fontWeight: "600",
  },

  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
  },

  error: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 10,
  },

  cta: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  ctaText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
});
