import TopPillTabBar from '@/components/navigation/TopPillTabBar';
import { useThemeColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';
import React from 'react';
import { Platform } from 'react-native';

export default function TabsLayout() {
  const colors = useThemeColors();

  // Native bottom tabs for iOS/Android
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
        {/* No trigger for notifications -> route is accessible but hidden from tab bar */}
      </NativeTabs>
    );
  }

  // Web uses your custom TopPillTabBar
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }} tabBar={(props) => <TopPillTabBar {...props} />}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: 'Forum',
          tabBarIcon: ({ color, size }) => <Ionicons name="people-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => <Ionicons name="search-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person-outline" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          href: null, // hide from tab bar on web
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
