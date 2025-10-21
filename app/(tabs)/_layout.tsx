import { Platform } from "react-native";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { Tabs } from "expo-router";
import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colors = useThemeColors();

  // iOS and Android use native tabs
  if (Platform.OS === "ios" || Platform.OS === "android") {
    return (
      <NativeTabs
        backgroundColor={colors.surface}
        iconColor={colors.textSecondary}
      >
        <NativeTabs.Trigger name="index">
          <Label hidden />
          <Icon sf="house" drawable="ic_menu_home" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="forum">
          <Label hidden />
          <Icon sf="person.3.sequence" drawable="ic_dialog_email" />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="search">
          <Icon sf="magnifyingglass" drawable="ic_menu_search" />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="profile">
          <Icon sf="person" drawable="ic_menu_myplaces" />
          <Label hidden />
        </NativeTabs.Trigger>
      </NativeTabs>
    );
  }

  // Web uses styled expo tabs
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopWidth: 1,
          borderTopColor: colors.border + "40",
          height: 60,
          paddingTop: 8,
          paddingBottom: 8,
          boxShadow: "0 -2px 16px rgba(0,0,0,0.08)",
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
          marginTop: 4,
        },
        tabBarIconStyle: {
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: "Forum",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "people" : "people-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "Search",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "search" : "search-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
