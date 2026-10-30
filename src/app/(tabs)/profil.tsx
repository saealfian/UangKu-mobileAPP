import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { colors } from "@/components/uangku";
import { useAuth } from "@/context/AuthContext";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

// Warna khas layar ini mengikuti desain (hasil sampling piksel):
const menuGreen = "#39785E";
const avatarGreen = "#337C65";
const logoutCard = "#FBEFE4";
const logoutRed = "#DF6A58";
const chevronColor = "#DDE5E3";
const dimmedIcon = "#8AA09C";

const MENU: { icon: IconName; label: string; dimmed?: boolean }[] = [
  { icon: "badge", label: "Informasi Akun" },
  { icon: "track-changes", label: "Target Anggaran" },
  { icon: "notifications-none", label: "Pengingat Pengeluaran" },
  { icon: "lock-outline", label: "Keamanan Akun" },
  { icon: "headset-mic", label: "Bantuan & Dukungan" },
  { icon: "info-outline", label: "Tentang UangKu", dimmed: true },
];

export default function ProfilScreen() {
  const { user, logout } = useAuth();

  const comingSoon = (fitur: string) =>
    Alert.alert(fitur, "Fitur ini segera hadir.");

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profil Saya</Text>

      {/* Kartu identitas */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={34} color={colors.white} />
          </View>
          <View style={styles.identity}>
            <Text style={styles.name}>{user?.nama || "User"}</Text>
            <Text style={styles.email}>{user?.email || "-"}</Text>
          </View>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.editBtn,
            { opacity: pressed ? 0.75 : 1 },
          ]}
          onPress={() => comingSoon("Edit Profil")}
        >
          <MaterialIcons name="edit" size={13} color={menuGreen} />
          <Text style={styles.editText}>Edit Profil</Text>
        </Pressable>
      </View>

      {/* Menu */}
      <View style={styles.menu}>
        {MENU.map((m) => (
          <Pressable
            key={m.label}
            style={({ pressed }) => [
              styles.menuItem,
              { opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={() => comingSoon(m.label)}
          >
            <MaterialIcons
              name={m.icon}
              size={22}
              color={m.dimmed ? dimmedIcon : menuGreen}
            />
            <Text style={styles.menuLabel}>{m.label}</Text>
            <MaterialIcons
              name="chevron-right"
              size={22}
              color={chevronColor}
            />
          </Pressable>
        ))}
      </View>

      {/* Keluar */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutCard,
          { opacity: pressed ? 0.8 : 1 },
        ]}
        onPress={logout}
      >
        <MaterialIcons name="logout" size={20} color={logoutRed} />
        <Text style={styles.logoutText}>Keluar</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: { paddingHorizontal: 20, paddingTop: 56, paddingBottom: 32 },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    textAlign: "center",
  },

  card: {
    backgroundColor: colors.mint,
    borderRadius: 20,
    padding: 20,
    marginTop: 20,
  },
  profileRow: { flexDirection: "row", alignItems: "center", gap: 14 },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: avatarGreen,
    alignItems: "center",
    justifyContent: "center",
  },
  identity: { flex: 1, gap: 4 },
  name: { fontSize: 20, fontWeight: "700", color: colors.text },
  email: { fontSize: 13, color: colors.muted },

  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
    backgroundColor: colors.white,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 16,
  },
  editText: { fontSize: 13, fontWeight: "600", color: menuGreen },

  menu: { marginTop: 28 },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 16,
  },
  menuLabel: { flex: 1, fontSize: 14, color: colors.text },

  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: logoutCard,
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 18,
    marginTop: 24,
  },
  logoutText: { fontSize: 15, fontWeight: "600", color: logoutRed },
});
