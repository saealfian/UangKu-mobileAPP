import { Stack } from "expo-router";

// Stack di dalam tab Beranda: Beranda -> Detail Amplop,
// sehingga tab "Beranda" tetap menyala di halaman detail.
export default function BerandaLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
