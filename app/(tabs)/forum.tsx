import { useThemeColors } from '@/constants/Colors';
import { StyleSheet, Text, View } from 'react-native';

export default function ForumScreen() {
  const colors = useThemeColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.textPrimary }]}>Forum</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Discuss and share ideas with the community.
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