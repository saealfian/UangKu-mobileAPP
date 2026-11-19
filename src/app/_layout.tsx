import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { AmplopProvider } from "@/data/amplop-context";
import { AkunProvider } from "@/data/akun-context";

// Tahan splash screen sampai status login selesai diperiksa,
// supaya aplikasi tidak sempat menampilkan layar kosong.
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppStack() {
  const { ready, user } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    SplashScreen.hide();
  }, [ready]);

  // Jaga arah navigasi: belum login -> login, sudah login -> beranda.
  useEffect(() => {
    if (!ready) return;
    const diHalamanLogin = segments[0] === "login";

    if (!user && !diHalamanLogin) {
      router.replace("/login");
    } else if (user && diHalamanLogin) {
      router.replace("/beranda");
    }
  }, [ready, user, segments, router]);

  // Tunggu sampai pemeriksaan token selesai
  if (!ready) return null;

  return (
    <AkunProvider>
      <AmplopProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen
            name="tambah-pengeluaran"
            options={{ presentation: "modal" }}
          />
        </Stack>
      </AmplopProvider>
    </AkunProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}
