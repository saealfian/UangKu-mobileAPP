import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen
        name="tambah-pengeluaran"
        options={{ presentation: "modal" }}
      />
    </Stack>
  );
}
