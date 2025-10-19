import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";

import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useAuthStore } from "@/store/auth";
// Auth state is managed by Zustand store

export default function RootLayout() {
  const { user, initializing, bootstrap } = useAuthStore();

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  if (initializing) {
    return (
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <StatusBar style="auto" />

        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator />
        </View>
      </SafeAreaProvider>
    );
  }

  const isLoggedIn = !!user;

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>

        {/* Expo Router includes all routes by default. Adding Stack.Protected creates exceptions for these screens. */}
      </Stack>
    </SafeAreaProvider>
  );
}
