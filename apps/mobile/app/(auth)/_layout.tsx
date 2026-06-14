import { useThemeColors } from "@/constants/Colors";
import { useAuthStore } from "@/store/auth";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";

export default function AuthLayout() {
  const colors = useThemeColors();
  const { width } = useWindowDimensions();
  const { user } = useAuthStore();

  // Guarding against layout blowout on wider displays/tablets
  const maxWidth = 480;
  const isLargeScreen = width > maxWidth;

  // Render a responsive contained frame
  return (
    <View style={[styles.outerContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.innerContent, isLargeScreen && { maxWidth, width: "100%" }]}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: colors.background },
          }}
        >
          {user?.mustChangePassword ? (
            // Force rendering a password management screen if marked true in seed state
            <Stack.Screen name="change-password" options={{ gestureEnabled: false }} />
          ) : (
            <>
              <Stack.Screen name="login" />
              <Stack.Screen name="forgot-password" />
            </>
          )}
        </Stack>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  innerContent: {
    flex: 1,
    alignSelf: "center",
    width: "100%",
  },
});