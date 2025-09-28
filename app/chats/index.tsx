import { useThemeColors } from "@/constants/Colors";
import { useRouter } from "expo-router";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockChats = [
  {
    username: "alice_johnson",
    name: "Alice Johnson",
    lastMessage: "Hey, how are you?",
    timestamp: "2m ago",
  },
  {
    username: "bob_smith",
    name: "Bob Smith",
    lastMessage: "See you tomorrow!",
    timestamp: "1h ago",
  },
  {
    username: "carol_davis",
    name: "Carol Davis",
    lastMessage: "Thanks for the help",
    timestamp: "3h ago",
  },
];

export default function ChatListScreen() {
  const router = useRouter();
  const colors = useThemeColors();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <View style={styles.container}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Chats</Text>

        <FlatList
          data={mockChats}
          keyExtractor={(item) => item.username}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.chat, { backgroundColor: colors.surface }]}
              onPress={() => router.push(`/chats/${item.username}` as any)}
            >
              <View style={styles.content}>
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>
                <Text style={[styles.message, { color: colors.textSecondary }]}>
                  {item.lastMessage}
                </Text>
              </View>
              <Text style={[styles.time, { color: colors.textSecondary }]}>
                {item.timestamp}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 16,
  },
  chat: {
    flexDirection: "row",
    padding: 16,
    marginBottom: 8,
    borderRadius: 8,
  },
  content: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
  },
  time: {
    fontSize: 12,
  },
});
