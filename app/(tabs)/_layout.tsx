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
        <Icon sf="house" drawable="custom_android_drawable" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="forum">
        <Label hidden />
        <Icon
          sf="person.3.sequence"
          drawable="custom_android_drawable"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon sf="magnifyingglass" drawable="custom_search_drawable" />
        <Label hidden />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon sf="person" drawable="custom_profile_drawable" />
        <Label hidden />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
