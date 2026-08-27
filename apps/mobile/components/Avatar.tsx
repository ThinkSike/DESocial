import { useThemeColors } from "@/constants/Colors";
import { Image } from "expo-image";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface AvatarProps {
  uri?: string | null;
  name?: string | null;
  size?: number;
  verified?: boolean;
  onPress?: () => void;
  style?: object;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

// A deterministic color from a name string
function getAvatarColor(name?: string | null): string {
  const palette = [
    "#6366f1", "#8b5cf6", "#ec4899", "#f97316",
    "#10b981", "#3b82f6", "#f59e0b", "#ef4444",
  ];
  if (!name) return palette[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return palette[Math.abs(hash) % palette.length];
}

export default function Avatar({
  uri,
  name,
  size = 40,
  verified,
  onPress,
  style,
}: AvatarProps) {
  const colors = useThemeColors();
  const [imgError, setImgError] = useState(false);
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  const badgeSize = Math.max(12, Math.round(size * 0.3));
  const badgeOffset = Math.round(size * 0.04);

  const showImage = !!uri && !imgError;

  const inner = (
    <View style={[{ width: size, height: size }, style]}>
      {showImage ? (
        <Image
          source={{ uri }}
          style={[styles.img, { width: size, height: size, borderRadius: size / 2 }]}
          contentFit="cover"
          transition={150}
          onError={() => setImgError(true)}
        />
      ) : (
        <View
          style={[
            styles.fallback,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              backgroundColor: bgColor,
            },
          ]}
        >
          <Text style={[styles.initials, { fontSize: size * 0.38, color: "#fff" }]}>
            {initials}
          </Text>
        </View>
      )}

      {verified && (
        <View
          style={[
            styles.badge,
            {
              width: badgeSize,
              height: badgeSize,
              borderRadius: badgeSize / 2,
              bottom: badgeOffset,
              right: badgeOffset,
              backgroundColor: colors.surface,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={badgeSize} color={colors.primary} />
        </View>
      )}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
        {inner}
      </TouchableOpacity>
    );
  }
  return inner;
}

const styles = StyleSheet.create({
  img: {},
  fallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  badge: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
});
