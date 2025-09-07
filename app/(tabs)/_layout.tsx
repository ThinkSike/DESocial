import COLORS from "@/constants/Colors";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function TabLayout() {
  return (
    <SafeAreaProvider>
      <Tabs screenOptions={{ tabBarShowLabel: false, headerShown: false }}>
        <Tabs.Screen
          name="index"
          options={{
            title: "Feed",
            tabBarIcon: ({}) => (
              <FontAwesome
                size={28}
                name="home"
                color={COLORS.light.textPrimary}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{
            title: "Create",
            tabBarIcon: ({}) => (
              <FontAwesome
                size={28}
                name="plus"
                color={COLORS.light.textPrimary}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({}) => (
              <FontAwesome
                size={28}
                name="user"
                color={COLORS.light.textPrimary}
              />
            ),
          }}
        />
      </Tabs>
    </SafeAreaProvider>
  );
}
