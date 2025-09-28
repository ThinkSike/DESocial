import { useThemeColors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function SearchScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Search</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Find users, posts, and discussions.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
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