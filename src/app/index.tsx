import { Redirect } from "expo-router";

// Aplikasi offline: tanpa login, langsung masuk ke Beranda.
export default function Index() {
  return <Redirect href="/beranda" />;
}
