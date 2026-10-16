import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import { colors } from "@/components/uangku";

export default function LoginScreen() {
  const router = useRouter();
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        if (!nama || !email || !password) {
          setError("Nama, email, dan password wajib diisi.");
          setLoading(false);
          return;
        }
        await register(nama, email, password);
      } else {
        if (!email || !password) {
          setError("Email dan password wajib diisi.");
          setLoading(false);
          return;
        }
        await login(email, password);
      }
      router.replace("/beranda");
    } catch (err: any) {
      setError(
        err?.data?.message ||
        err?.message ||
        "Gagal masuk. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Text style={styles.brand}>UangKu</Text>
          <Text style={styles.subtitle}>
            {isRegister ? "Buat akun baru" : "Selamat datang kembali"}
          </Text>
        </View>

        {isRegister && (
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Nama lengkap</Text>
            <TextInput
              style={styles.input}
              placeholder="Contoh: Budi Santoso"
              value={nama}
              onChangeText={setNama}
              autoCapitalize="words"
            />
          </View>
        )}

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="contoh@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputWrap}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        {!!error && (
          <View style={styles.errorWrap}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.cta,
            { backgroundColor: loading ? colors.muted : colors.primary },
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.ctaText}>
              {isRegister ? "Daftar" : "Masuk"}
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.toggleWrap}
          onPress={() => {
            setError("");
            setIsRegister(!isRegister);
          }}
        >
          <Text style={styles.toggleText}>
            {isRegister
              ? "Sudah punya akun? "
              : "Belum punya akun? "}
            <Text style={styles.toggleLink}>
              {isRegister ? "Masuk" : "Daftar"}
            </Text>
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    justifyContent: "center",
    gap: 16,
    minHeight: "100%",
  },
  header: { alignItems: "center", marginBottom: 8 },
  brand: { fontSize: 32, fontWeight: "800", color: colors.primary },
  subtitle: { fontSize: 15, color: colors.muted, marginTop: 4 },

  inputWrap: { gap: 6 },
  label: { fontSize: 12, fontWeight: "600", color: colors.text },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },

  errorWrap: { marginTop: 4 },
  errorText: { fontSize: 11, color: colors.danger },

  cta: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
  },
  ctaText: { fontSize: 15, fontWeight: "700", color: colors.white },

  toggleWrap: { marginTop: 14 },
  toggleText: { fontSize: 12, color: colors.muted, textAlign: "center" },
  toggleLink: { color: colors.primary, fontWeight: "700" },
});
