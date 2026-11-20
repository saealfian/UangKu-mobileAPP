import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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
  AkunHint,
  AkunLabel,
  akunColors,
  akunStyles,
} from "@/components/akun";
import { colors } from "@/components/uangku";
import { useAkun, type ProfilData } from "@/data/akun-context";

const AVATAR_COLORS = ["#337C65", "#2E6B4F", "#7B8780", "#4A6B8A"];

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTanggal(iso: string) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${BULAN[m - 1]} ${y}`;
}

export default function EditProfilScreen() {
  const { akun, ready } = useAkun();

  if (!ready) {
    return (
      <View style={[akunStyles.screen, akunStyles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return <EditProfilForm awal={akun.profil} />;
}

function EditProfilForm({ awal }: { awal: ProfilData }) {
  const router = useRouter();
  const { simpanProfil } = useAkun();

  const [nama, setNama] = useState(awal.nama);
  const [email, setEmail] = useState(awal.email);
  const [telepon, setTelepon] = useState(awal.telepon);
  const [tanggalLahir, setTanggalLahir] = useState(awal.tanggalLahir);
  const [warnaAvatar, setWarnaAvatar] = useState(awal.warnaAvatar);

  const [avatarOpen, setAvatarOpen] = useState(false);
  const [tanggalOpen, setTanggalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleSave = () => {
    setError("");

    if (!nama.trim()) {
      setError("Nama lengkap wajib diisi.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Alamat email belum valid.");
      return;
    }
    if (telepon.trim() && !/^[0-9+\s-]{8,}$/.test(telepon.trim())) {
      setError("Nomor telepon belum valid.");
      return;
    }

    simpanProfil({
      nama: nama.trim(),
      email: email.trim(),
      telepon: telepon.trim(),
      tanggalLahir,
      warnaAvatar,
    });

    Alert.alert("Tersimpan", "Perubahan profil berhasil disimpan.", [
      { text: "OK", onPress: () => router.back() },
    ]);
  };

  const inisial = (nama.trim() || "U").charAt(0).toUpperCase();

  return (
    <>
      <ScrollView
        style={akunStyles.screen}
        contentContainerStyle={akunStyles.content}
        keyboardShouldPersistTaps="handled"
      >
        <AkunHeader title="Edit Profil" onBack={() => router.back()} />

        {/* Kartu identitas */}
        <View style={styles.card}>
          <View style={[styles.avatar, { backgroundColor: warnaAvatar }]}>
            <Text style={styles.avatarText}>{inisial}</Text>
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={styles.cardName}>{nama.trim() || "User"}</Text>
            <Pressable hitSlop={8} onPress={() => setAvatarOpen(true)}>
              <Text style={styles.cardLink}>Ubah foto profil</Text>
            </Pressable>
          </View>
        </View>

        <View style={{ marginTop: 16 }}>
          <AkunHint>Perbarui data diri agar akunmu tetap sesuai.</AkunHint>
        </View>

        <AkunLabel>Nama lengkap</AkunLabel>
        <TextInput
          style={akunStyles.input}
          value={nama}
          onChangeText={setNama}
          placeholder="Nama lengkap"
          placeholderTextColor={colors.muted}
        />

        <AkunLabel>Alamat email</AkunLabel>
        <TextInput
          style={akunStyles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="user@email.com"
          placeholderTextColor={colors.muted}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Text style={styles.fieldHint}>
          Email hanya tersimpan di perangkat ini sebagai info profil.
        </Text>

        <AkunLabel>Nomor telepon</AkunLabel>
        <TextInput
          style={akunStyles.input}
          value={telepon}
          onChangeText={setTelepon}
          placeholder="Belum ditambahkan"
          placeholderTextColor={colors.muted}
          keyboardType="phone-pad"
        />

        <AkunLabel>Tanggal lahir</AkunLabel>
        <Pressable
          style={({ pressed }) => [
            styles.dateField,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => setTanggalOpen(true)}
        >
          <Text
            style={[styles.dateText, !tanggalLahir && { color: colors.muted }]}
          >
            {tanggalLahir ? formatTanggal(tanggalLahir) : "Pilih tanggal lahir"}
          </Text>
          <MaterialIcons name="calendar-today" size={18} color={colors.muted} />
        </Pressable>

        {!!error && <Text style={styles.error}>{error}</Text>}

        <AkunButton label="Simpan Perubahan" onPress={handleSave} />
      </ScrollView>

      {/* Pilihan foto profil */}
      <Modal
        visible={avatarOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setAvatarOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setAvatarOpen(false)}>
          <Pressable style={styles.sheet} onPress={() => {}}>
            <Text style={styles.sheetTitle}>Pilih foto profil</Text>
            <Text style={styles.sheetHint}>
              Pilih warna avatar yang mewakili akunmu.
            </Text>
            <View style={styles.colorRow}>
              {AVATAR_COLORS.map((c) => (
                <Pressable
                  key={c}
                  onPress={() => {
                    setWarnaAvatar(c);
                    setAvatarOpen(false);
                  }}
                  style={[
                    styles.colorDot,
                    { backgroundColor: c },
                    warnaAvatar === c && styles.colorDotActive,
                  ]}
                >
                  {warnaAvatar === c && (
                    <MaterialIcons name="check" size={20} color={colors.white} />
                  )}
                </Pressable>
              ))}
            </View>
            <AkunButton
              label="Tutup"
              variant="outline"
              onPress={() => setAvatarOpen(false)}
            />
          </Pressable>
        </Pressable>
      </Modal>

      <TanggalLahirModal
        visible={tanggalOpen}
        value={tanggalLahir}
        onClose={() => setTanggalOpen(false)}
        onSave={(iso) => {
          setTanggalLahir(iso);
          setTanggalOpen(false);
        }}
      />
    </>
  );
}

function TanggalLahirModal({
  visible,
  value,
  onClose,
  onSave,
}: {
  visible: boolean;
  value: string;
  onClose: () => void;
  onSave: (iso: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          {visible && (
            <TanggalLahirBody value={value} onSave={onSave} onClose={onClose} />
          )}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function TanggalLahirBody({
  value,
  onSave,
  onClose,
}: {
  value: string;
  onSave: (iso: string) => void;
  onClose: () => void;
}) {
  const tahunSekarang = new Date().getFullYear();
  const [y0, m0, d0] = value.split("-").map(Number);

  const [hari, setHari] = useState(d0 || 1);
  const [bulan, setBulan] = useState(m0 || 1);
  const [tahun, setTahun] = useState(y0 || tahunSekarang - 25);

  const tahunList = Array.from(
    { length: 81 },
    (_, i) => tahunSekarang - 10 - i
  );
  const jumlahHari = new Date(tahun, bulan, 0).getDate();
  const iso = `${tahun}-${String(bulan).padStart(2, "0")}-${String(
    Math.min(hari, jumlahHari)
  ).padStart(2, "0")}`;

  return (
    <>
      <Text style={styles.sheetTitle}>Tanggal lahir</Text>
      <View style={styles.columns}>
        <DateColumn
          label="Hari"
          data={Array.from({ length: jumlahHari }, (_, i) => i + 1)}
          selected={Math.min(hari, jumlahHari)}
          onSelect={setHari}
        />
        <DateColumn
          label="Bulan"
          data={BULAN.map((_, i) => i + 1)}
          selected={bulan}
          onSelect={setBulan}
          render={(v) => BULAN[v - 1]}
        />
        <DateColumn
          label="Tahun"
          data={tahunList}
          selected={tahun}
          onSelect={setTahun}
        />
      </View>
      <AkunButton label="Pilih tanggal" onPress={() => onSave(iso)} />
      <AkunButton label="Batal" variant="outline" onPress={onClose} />
    </>
  );
}

function DateColumn({
  label,
  data,
  selected,
  onSelect,
  render,
}: {
  label: string;
  data: number[];
  selected: number;
  onSelect: (v: number) => void;
  render?: (v: number) => string;
}) {
  return (
    <View style={{ flex: 1, gap: 6 }}>
      <Text style={styles.columnLabel}>{label}</Text>
      <ScrollView style={{ height: 170 }} showsVerticalScrollIndicator={false}>
        {data.map((v) => {
          const active = v === selected;
          return (
            <Pressable
              key={v}
              onPress={() => onSelect(v)}
              style={[styles.columnItem, active && styles.columnItemActive]}
            >
              <Text style={[styles.columnText, active && styles.columnTextActive]}>
                {render ? render(v) : v}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: akunColors.mint,
    borderRadius: 16,
    padding: 16,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 22, fontWeight: "700", color: colors.white },
  cardName: { fontSize: 15, fontWeight: "700", color: colors.text },
  cardLink: { fontSize: 12, color: colors.primary, fontWeight: "600" },

  fieldHint: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 6,
  },
  dateField: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    backgroundColor: colors.white,
  },
  dateText: { fontSize: 14, color: colors.text },

  error: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 12,
  },

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(18,32,25,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  sheetTitle: { fontSize: 15, fontWeight: "700", color: colors.text },
  sheetHint: { fontSize: 12, color: colors.muted, marginTop: 4 },
  colorRow: {
    flexDirection: "row",
    gap: 14,
    marginTop: 18,
    marginBottom: 4,
  },
  colorDot: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  colorDotActive: {
    borderWidth: 3,
    borderColor: colors.mint,
  },
  columns: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },
  columnLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.muted,
  },
  columnItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  columnItemActive: { backgroundColor: akunColors.mint },
  columnText: { fontSize: 13, color: colors.text },
  columnTextActive: { fontWeight: "700", color: colors.primary },
});
