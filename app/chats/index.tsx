import { useRouter } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const mockChats = [
  { id: '1', name: 'Alice Johnson', lastMessage: 'Hey, how are you?', timestamp: '2m ago' },
  { id: '2', name: 'Bob Smith', lastMessage: 'See you tomorrow!', timestamp: '1h ago' },
  { id: '3', name: 'Carol Davis', lastMessage: 'Thanks for the help', timestamp: '3h ago' },
];

export default function ChatListScreen() {
  const router = useRouter();

  const renderChatItem = ({ item }: { item: typeof mockChats[0] }) => (
    <TouchableOpacity 
      style={styles.chatItem}
      onPress={() => router.push(`/chats/${item.id}` as any)}
    >
      <View>
        <Text style={styles.chatName}>{item.name}</Text>
        <Text style={styles.lastMessage}>{item.lastMessage}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chats</Text>
      <FlatList
        data={mockChats}
        renderItem={renderChatItem}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
      />
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
    marginBottom: 16,
  },
  chatList: {
    flex: 1,
  },
  chatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#f5f5f5',
    marginBottom: 8,
    borderRadius: 8,
  },
  chatName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
});