import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';

export default function PrivacySettingsScreen() {
  const [profileVisible, setProfileVisible] = useState(true);
  const [showOnlineStatus, setShowOnlineStatus] = useState(false);
  const [allowMessages, setAllowMessages] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Privacy Settings</Text>
      <Text style={styles.subtitle}>Control your privacy and visibility</Text>
      
      <View style={styles.settingsList}>
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Public Profile</Text>
            <Text style={styles.settingDescription}>Make your profile visible to everyone</Text>
          </View>
          <Switch
            value={profileVisible}
            onValueChange={setProfileVisible}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Show Online Status</Text>
            <Text style={styles.settingDescription}>Let others see when you're online</Text>
          </View>
          <Switch
            value={showOnlineStatus}
            onValueChange={setShowOnlineStatus}
          />
        </View>
        
        <View style={styles.settingItem}>
          <View style={styles.settingTextContainer}>
            <Text style={styles.settingTitle}>Allow Direct Messages</Text>
            <Text style={styles.settingDescription}>Receive messages from other users</Text>
          </View>
          <Switch
            value={allowMessages}
            onValueChange={setAllowMessages}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
  },
  settingsList: {
    gap: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#666',
  },
});