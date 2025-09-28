import { Icon, Label, NativeTabs } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="index">
        <Label>Home</Label>
        <Icon
          // iOS uses SF Symbols (with selected variant), Android uses drawable
          sf={{ default: 'house', selected: 'house.fill' }}
          drawable="ic_menu_home" // already present drawable placeholder
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="forum">
        <Label>Forum</Label>
        <Icon
          sf={{ default: 'bubble.left.and.bubble.right', selected: 'bubble.left.and.bubble.right.fill' }}
          drawable="ic_dialog_info"
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="search">
        <Icon
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
          drawable="ic_menu_search"
        />
        <Label>Search</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="profile">
        <Icon
          sf={{ default: 'person', selected: 'person.fill' }}
          drawable="ic_menu_myplaces"
        />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="settings">
        <Icon
          sf={{ default: 'gearshape', selected: 'gearshape.fill' }}
          drawable="ic_menu_manage"
      
        />
        <Label>Settings</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
