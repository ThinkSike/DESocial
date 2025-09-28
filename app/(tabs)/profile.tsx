import { useThemeColors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Profile</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        View and manage your profile information.
      </Text>
      <Button 
        title="Settings" 
        onPress={() => router.push('/settings' as any)} 
        color={colors.primary}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
  },
});