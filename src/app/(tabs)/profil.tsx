import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "@/components/uangku";
import { useAuth } from "@/context/AuthContext";

export default function ProfilScreen() {
  const { user, logout } = useAuth();

  return (
    <View style={styles.screen}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
        </Text>
      </View>
      <Text style={styles.name}>{user?.nama || "User"}</Text>
      <Text style={styles.email}>{user?.email || "-"}</Text>
      <View style={styles.divider} />
      <View style={styles.row}>
        <Text style={styles.small}>Versi aplikasi</Text>
        <Text style={styles.small}>1.0.0</Text>
      </View>
      <Pressable style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutText}>Keluar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", gap: 10, paddingHorizontal: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  avatarText: { fontSize: 30, fontWeight: "700", color: colors.primary },
  name: { fontSize: 22, fontWeight: "700", color: colors.text },
  email: { fontSize: 14, color: colors.muted, marginBottom: 16 },
  divider: { width: "100%", height: 1, backgroundColor: colors.border, marginVertical: 12 },
  row: { flexDirection: "row", justifyContent: "space-between", width: "100%" },
  small: { fontSize: 12, color: colors.text },
  logoutBtn: { marginTop: 10 },
  logoutText: { fontSize: 14, fontWeight: "600", color: colors.danger },
});
