import { StyleSheet, Text, View } from 'react-native';

export default function ForumScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Forum</Text>
      <Text>Discuss and share ideas with the community.</Text>
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
});