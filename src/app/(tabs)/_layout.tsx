import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { Text } from "react-native";
import { colors } from "../../components/uangku";

type IconName = React.ComponentProps<typeof MaterialIcons>["name"];

const tab = (title: string, name: IconName) => ({
  tabBarLabel: ({ focused, color }: { focused: boolean; color: string }) => (
    <Text style={{ fontSize: 10, color, fontWeight: focused ? "700" : "400" }}>
      {title}
    </Text>
  ),
  tabBarIcon: ({ color }: { color: string }) => (
    <MaterialIcons name={name} size={22} color={color} />
  ),
});

export default function TabsLayout() {
  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.muted,
        tabBarStyle: {
          height: 64,
          paddingTop: 6,
          paddingBottom: 8,
          backgroundColor: colors.white,
          borderTopColor: colors.border,
        },
      }}
    >
      <Tabs.Screen name="beranda" options={tab("Beranda", "grid-view")} />
      <Tabs.Screen name="catatan" options={tab("Catatan", "description")} />
      <Tabs.Screen name="profil" options={tab("Profil", "person-outline")} />
    </Tabs>
  );
}
