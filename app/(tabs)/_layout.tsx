import { Icon, Label, NativeTabs } from "expo-router/unstable-native-tabs";
import { useThemeColors } from "@/constants/Colors";

export default function TabLayout() {
  const colors = useThemeColors();

  return (
    <NativeTabs
      backgroundColor={colors.surface}
      iconColor={colors.textSecondary}
    >
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
    </NativeTabs>
  );
}
