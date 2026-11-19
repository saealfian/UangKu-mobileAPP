import { MaterialIcons } from "@expo/vector-icons";
import { ReactNode } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";

import { colors } from "./uangku";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

export const akunColors = {
  border: "#E5E8E4",
  chevron: "#C4D0CB",
  mint: "#EAF2EC",
  avatar: "#337C65",
  track: "#DDE5E3",
};

/** Header halaman: panah kembali + judul, sama seperti detail amplop. */
export function AkunHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        hitSlop={12}
        onPress={onBack}
        style={({ pressed }) => [{ opacity: pressed ? 0.5 : 1 }]}
      >
        <MaterialIcons name="arrow-back-ios" size={18} color={colors.text} />
      </Pressable>
      <Text style={styles.headerTitle}>{title}</Text>
    </View>
  );
}

export function AkunTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.title}>{children}</Text>;
}

export function AkunSectionTitle({ children }: { children: ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

export function AkunLabel({ children }: { children: ReactNode }) {
  return <Text style={styles.label}>{children}</Text>;
}

export function AkunHint({ children }: { children: ReactNode }) {
  return <Text style={styles.hint}>{children}</Text>;
}

export function AkunNote({ children }: { children: ReactNode }) {
  return <Text style={styles.note}>{children}</Text>;
}

/** Kartu hijau muda dengan ikon untuk pesan pengantar halaman. */
export function AkunHighlightCard({
  icon,
  title,
  description,
}: {
  icon: IconName;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.highlight}>
      <MaterialIcons name={icon} size={24} color={colors.primary} />
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={styles.highlightTitle}>{title}</Text>
        <Text style={styles.highlightDesc}>{description}</Text>
      </View>
    </View>
  );
}

/** Baris menu/kartu dengan judul, subjudul opsional, dan chevron. */
export function AkunRow({
  title,
  subtitle,
  onPress,
  right,
  showChevron = true,
  style,
}: {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  right?: ReactNode;
  showChevron?: boolean;
  style?: object;
}) {
  const body = (
    <>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      {right ??
        (showChevron ? (
          <MaterialIcons
            name="chevron-right"
            size={20}
            color={akunColors.chevron}
          />
        ) : null)}
    </>
  );

  if (!onPress) return <View style={[styles.row, style]}>{body}</View>;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        style,
        { opacity: pressed ? 0.6 : 1 },
      ]}
    >
      {body}
    </Pressable>
  );
}

export function AkunSwitchRow({
  title,
  subtitle,
  value,
  onValueChange,
}: {
  title: string;
  subtitle?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={{ flex: 1, gap: 3 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        {!!subtitle && <Text style={styles.rowSubtitle}>{subtitle}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: akunColors.track, true: colors.primary }}
        thumbColor={colors.white}
        ios_backgroundColor={akunColors.track}
      />
    </View>
  );
}

export function AkunButton({
  label,
  onPress,
  variant = "solid",
  style,
}: {
  label: string;
  onPress: () => void;
  variant?: "solid" | "outline";
  style?: object;
}) {
  const solid = variant === "solid";
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        solid ? styles.buttonSolid : styles.buttonOutline,
        { opacity: pressed ? 0.8 : 1 },
        style,
      ]}
    >
      <Text style={solid ? styles.buttonSolidText : styles.buttonOutlineText}>
        {label}
      </Text>
    </Pressable>
  );
}

/** Modal pilihan sederhana (waktu, ulangi, dsb). */
export function OptionModal({
  visible,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  options: { label: string; value: string }[];
  value: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <Text style={styles.sheetTitle}>{title}</Text>
          <ScrollView style={{ maxHeight: 320 }}>
            {options.map((o) => {
              const active = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => onSelect(o.value)}
                  style={({ pressed }) => [
                    styles.option,
                    active && styles.optionActive,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      active && styles.optionTextActive,
                    ]}
                  >
                    {o.label}
                  </Text>
                  {active && (
                    <MaterialIcons
                      name="check"
                      size={18}
                      color={colors.primary}
                    />
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

export const akunStyles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.white },
  content: {
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 32,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  input: {
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: colors.text,
    backgroundColor: colors.white,
  },
  labelField: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
});

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    lineHeight: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 24,
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    marginTop: 18,
    marginBottom: 8,
  },
  hint: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },
  note: {
    fontSize: 11,
    lineHeight: 17,
    color: colors.muted,
    marginTop: 14,
  },
  highlight: {
    flexDirection: "row",
    gap: 14,
    backgroundColor: akunColors.mint,
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    alignItems: "flex-start",
  },
  highlightTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  highlightDesc: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: akunColors.border,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
    marginTop: 10,
    backgroundColor: colors.white,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  rowSubtitle: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.muted,
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  buttonSolid: { backgroundColor: colors.primary },
  buttonSolidText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },
  buttonOutline: {
    borderWidth: 1,
    borderColor: akunColors.border,
    backgroundColor: colors.white,
  },
  buttonOutlineText: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.primary,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(18,32,25,0.35)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  sheet: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 20,
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  optionActive: { backgroundColor: akunColors.mint },
  optionText: { fontSize: 14, color: colors.text },
  optionTextActive: { fontWeight: "700", color: colors.primary },
});
