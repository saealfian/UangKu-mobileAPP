
import { Stack } from "expo-router";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AmplopProvider } from "@/data/amplop-context";

function AppStack() {
  const { ready, user } = useAuth();

  // Tunggu sampai pemeriksaan token selesai
  if (!ready) return null;

  return (
    <AmplopProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Jika belum login */}
        {!user && (
          <Stack.Screen name="login" />
        )}

        {/* Jika sudah login */}
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
    </AmplopProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
