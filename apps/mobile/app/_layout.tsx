import TopNotificationBanner from "@/components/TopNotificationBanner";
import { useAuthStore } from "@/store/auth";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, useWindowDimensions } from "react-native";
import {
    SafeAreaProvider,
    initialWindowMetrics,
} from "react-native-safe-area-context";

export default function RootLayout() {
  const { user, initializing, hydrate } = useAuthStore();

  useEffect(() => {
    hydrate();
  }, []);

  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <StatusBar style="auto" />
      {initializing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <RootNavigationEngine user={user} />
      )}
    </SafeAreaProvider>
  );
}

// Inner Engine component to safely handle path monitoring and redirection states
function RootNavigationEngine({ user }: { user: any }) {
  const segments = useSegments();
  const router = useRouter();
  const { width } = useWindowDimensions();

  const mustChange = !!user && !!user.mustChangePassword;
  const inAuthGroup = segments[0] === "(auth)";
  const isChangingPassword = segments[1] === "change-password";

  useEffect(() => {
    // 1. If not authenticated, force them into the login flow group
    if (!user) {
      router.replace("/(auth)/login");
    } 
    // 2. If authenticated but flagged to change password, intercept and force them to change-password
    else if (mustChange) {
      if (!isChangingPassword) {
        router.replace("/(auth)/change-password");
      }
    } 
    // 3. Fully authenticated with a set password, unlock the app and kick out of auth screens
    else if (user && !mustChange && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, mustChange, segments]);

  // Layout protection: Prevent widescreen stretching across tablets or web view configurations
  const maxWidth = 480;
  const isLargeScreen = width > maxWidth;

  return (
    <View style={[styles.outerContainer, isLargeScreen && styles.centeredWrapper]}>
      <View style={[styles.innerContent, isLargeScreen && { maxWidth, width: "100%" }]}>
        <TopNotificationBanner />
        <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
          {/* Group allocations match the clean file movement setup */}
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="settings" />
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  outerContainer: {
    flex: 1,
  },
  centeredWrapper: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#111", // Dark accent framing backgrounds for large viewports
  },
  innerContent: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
});