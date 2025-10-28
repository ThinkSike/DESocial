import TopPillTabBar from '@/components/navigation/TopPillTabBar';
import { useThemeColors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const colors = useThemeColors();

  // Phones/Tablets → Native tabs
  if (Platform.OS === 'ios' || Platform.OS === 'android') {
    return (
      <NativeTabs backgroundColor={colors.surface} iconColor={colors.textSecondary}>
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
        {/* no trigger for notifications → route exists but hidden */}
      </NativeTabs>
    );
  }

  // Web → Top pill tab bar
  return (
    <Tabs
      screenOptions={{ headerShown: false, tabBarShowLabel: false }}
      tabBar={(props) => <TopPillTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="forum" options={{ title: 'Forum' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
      <Tabs.Screen name="notifications" options={{ href: null }} />
    </Tabs>
  );
}
