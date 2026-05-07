import { Stack } from "expo-router";
import React from "react";
import { useThemeColors } from "@/constants/Colors";

export default function AuthLayout() {
  const colors = useThemeColors();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "fade",
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
