import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Adjust your preferences</Text>
      
      <View style={styles.optionsList}>
        <TouchableOpacity 
          style={styles.option}
          onPress={() => router.push('/settings/account' as any)}
        >
          <Text style={styles.optionText}>Account Settings</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={() => router.push('/settings/privacy' as any)}
        >
          <Text style={styles.optionText}>Privacy Settings</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.option}
          onPress={() => router.push('/settings/notifications' as any)}
        >
          <Text style={styles.optionText}>Notification Settings</Text>
          <Text style={styles.arrow}>→</Text>
        </TouchableOpacity>
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
  optionsList: {
    gap: 12,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 18,
    color: '#007AFF',
  },
});
