import { useThemeColors } from "@/constants/Colors";
import { useNotificationStore } from "@/store/notification";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ICON_MAP: Record<string, keyof typeof Ionicons.glyphMap> = {
  success: "checkmark-circle",
  info: "information-circle",
  warning: "alert-circle",
  message: "chatbubble-ellipses",
};

export default function TopNotificationBanner() {
  const colors = useThemeColors();
  const current = useNotificationStore((state) => state.current);
  const dismissNotification = useNotificationStore((state) => state.dismissNotification);
  const translateY = useRef(new Animated.Value(-120)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const iconName = useMemo(() => {
    if (!current?.icon) return "notifications" as const;
    return ICON_MAP[current.icon] ?? "notifications";
  }, [current?.icon]);

  useEffect(() => {
    if (current) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          friction: 9,
          tension: 70,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start();

      const timeout = setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -120,
            duration: 180,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 160,
            useNativeDriver: true,
          }),
        ]).start(({ finished }) => {
          if (finished) dismissNotification();
        });
      }, 3200);

      return () => clearTimeout(timeout);
    }

    translateY.setValue(-120);
    opacity.setValue(0);
  }, [current, dismissNotification, opacity, translateY]);

  if (!current) return null;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrapper,
        {
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.92}
        onPress={dismissNotification}
        style={[
          styles.banner,
          { backgroundColor: colors.cardBackground, borderColor: colors.border },
        ]}
      >
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "15" }]}>
          <Ionicons name={iconName} size={18} color={colors.primary} />
        </View>
        <View style={styles.textWrap}>
          <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
            {current.title}
          </Text>
          {current.message ? (
            <Text style={[styles.message, { color: colors.textSecondary }]} numberOfLines={2}>
              {current.message}
            </Text>
          ) : null}
        </View>
        <Ionicons name="close" size={18} color={colors.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    zIndex: 999,
    elevation: 20,
  },
  banner: {
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  textWrap: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  message: {
    marginTop: 2,
    fontSize: 12,
    lineHeight: 16,
  },
});
