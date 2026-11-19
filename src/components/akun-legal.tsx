import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { AkunHeader, AkunHint, akunStyles } from "@/components/akun";
import { colors } from "@/components/uangku";

export type LegalSection = { judul: string; isi: string };

export function LegalScreen({
  title,
  intro,
  sections,
  updated,
}: {
  title: string;
  intro: string;
  sections: LegalSection[];
  updated: string;
}) {
  const router = useRouter();

  return (
    <ScrollView style={akunStyles.screen} contentContainerStyle={akunStyles.content}>
      <AkunHeader title={title} onBack={() => router.back()} />

      <AkunHint>{intro}</AkunHint>
      <Text style={styles.updated}>Terakhir diperbarui {updated}</Text>

      {sections.map((s) => (
        <View key={s.judul} style={styles.block}>
          <Text style={styles.sectionTitle}>{s.judul}</Text>
          <Text style={styles.body}>{s.isi}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  updated: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 10,
  },
  block: { marginTop: 20, gap: 6 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  body: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.muted,
  },
});
