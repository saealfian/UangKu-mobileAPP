import { Stack } from "expo-router";

// Stack di dalam tab Profil: Profil -> submenu akun,
// sehingga tab "Profil" tetap menyala di setiap halaman.
export default function ProfilLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
