import { useThemeColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

const ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home-outline',
  forum: 'people-outline',
  search: 'search-outline',
  profile: 'person-outline',
};

const BASE_ROUTES = ['index', 'forum', 'search', 'profile'];

export default function TopPillTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colors = useThemeColors();

  const getBase = (name: string) => name.split('/')[0];
  const routes = state.routes.filter(r => BASE_ROUTES.includes(getBase(r.name)));

  return (
    <View pointerEvents="box-none" style={styles.wrap}>
      <View style={[styles.pill, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        {routes.map((route) => {
          const isFocused = state.index === state.routes.indexOf(route);
          const base = getBase(route.name);
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name as never);
          };
          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={onPress}
              style={[styles.item, isFocused && { backgroundColor: colors.primary + '26' }]}
            >
              <Ionicons
                name={ICONS[base] ?? 'ellipse-outline'}
                size={18}
                color={isFocused ? colors.primary : colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 8,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 50,
  },
  pill: {
    flexDirection: 'row',
    borderRadius: 999,
    padding: 6,
    gap: 6,
    borderWidth: 1,
  },
  item: {
    width: 44,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});