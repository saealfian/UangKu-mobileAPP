import { Image, ImageSourcePropType, View } from "react-native";

export const colors = {
  primary: "#2E6B4F",
  text: "#1B2B22",
  muted: "#7B8780",
  white: "#FFFFFF",
  mint: "#E7F0E9",
  peach: "#FBEADC",
  blue: "#E7EDF6",
  lilac: "#EDE9F6",
  border: "#E3E8E5",
  danger: "#D64545",
};

// Lingkaran putih untuk ikon kategori. Kalau `source` kosong, tampil kosong dulu.
export function IconCircle({
  source,
  size = 32,
}: {
  source?: ImageSourcePropType;
  size?: number;
}) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: colors.white,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {source && (
        <Image
          source={source}
          style={{ width: size * 0.55, height: size * 0.55 }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}

export function ProgressBar({
  percent,
  height = 6,
}: {
  percent: number;
  height?: number;
}) {
  return (
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: "rgba(0,0,0,0.08)",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          width: `${Math.min(percent, 100)}%`,
          height: "100%",
          borderRadius: height / 2,
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}
