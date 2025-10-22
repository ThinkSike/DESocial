import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function Notifications() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.empty}>
        <Ionicons name="notifications-off-outline" size={32} color="#888" />
        <Text style={styles.emptyText}>You’re all caught up</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 16, paddingTop: 12 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { color: '#888' },
});