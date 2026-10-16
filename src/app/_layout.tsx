import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";

function AppStack() {
  const { ready, user } = useAuth();

  // Saat belum selesai memeriksa token, tampilkan layar kosong (loading)
  if (!ready) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Jika belum login, arahkan ke layar login */}
      {!user && <Stack.Screen name="login" />}

      {/* Jika sudah login, tampilkan tabs dan modal tambah pengeluaran */}
      {user && (
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="tambah-pengeluaran"
            options={{ presentation: "modal" }}
          />
        </>
      )}
    </Stack>
  );
}

export default function RootLayout() {
  return <AuthProvider><AppStack /></AuthProvider>;
}
