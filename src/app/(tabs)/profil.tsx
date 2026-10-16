import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../components/uangku";

export default function ProfilScreen() {
  return (
    <View style={styles.screen}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>U</Text>
      </View>
      <Text style={styles.name}>User</Text>
      <Text style={styles.small}>Halaman profil belum dibuat.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white, alignItems: "center", justifyContent: "center", gap: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: colors.mint, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 28, fontWeight: "700", color: colors.primary },
  name: { fontSize: 20, fontWeight: "700", color: colors.text },
  small: { fontSize: 12, color: colors.muted },
});
