import { useThemeColors } from "@/constants/Colors";
import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import React from "react";
import { Platform } from "react-native";

export default function TabsLayout() {
  const colors = useThemeColors();
  const showLabels = Platform.OS === "web";

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      iconColor={colors.textSecondary}
    >
      <NativeTabs.Trigger name="index">
        <Icon sf="house" drawable="ic_menu_home" />
        <Label hidden={!showLabels}>Home</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="forum">
        <Icon sf="person.3.sequence" drawable="ic_dialog_email" />
        <Label hidden={!showLabels}>Forum</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" drawable="ic_menu_search" />
        <Label hidden={!showLabels}>Search</Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="profile">
        <Icon sf="person" drawable="ic_menu_myplaces" />
        <Label hidden={!showLabels}>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
