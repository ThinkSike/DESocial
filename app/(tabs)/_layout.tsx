import TopPillTabBar from '@/components/navigation/TopPillTabBar';
import { useThemeColors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  const colors = useThemeColors();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,        // remove the upper black bar
        tabBarShowLabel: false,
      }}
      tabBar={(props) => <TopPillTabBar {...props} />}
    >
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
      {/* Keep alerts but hide from the pill bar */}
      <Tabs.Screen
        name="notifications"
        options={{
          href: null,
          title: 'Alerts',
          tabBarIcon: ({ color, size }) => <Ionicons name="notifications-outline" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
