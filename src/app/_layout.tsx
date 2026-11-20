import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AmplopProvider, useAmplop } from "@/data/amplop-context";
import { AkunProvider } from "@/data/akun-context";

// Tahan splash screen sampai data lokal selesai dibaca,
// supaya aplikasi tidak sempat menampilkan layar kosong.
SplashScreen.preventAutoHideAsync().catch(() => {});

function AppStack() {
  const { ready } = useAmplop();

  useEffect(() => {
    if (ready) SplashScreen.hide();
  }, [ready]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="tambah-pengeluaran"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AkunProvider>
      <AmplopProvider>
        <AppStack />
      </AmplopProvider>
    </AkunProvider>
  );
}
