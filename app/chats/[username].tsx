import { useThemeColors } from "@/constants/Colors";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const mockMessages = [
  {
    id: "1",
    text: "Hello! How are you doing?",
    sender: "other",
    timestamp: "10:30 AM",
  },
  {
    id: "2",
    text: "I'm doing great, thanks! How about you?",
    sender: "me",
    timestamp: "10:32 AM",
  },
  {
    id: "3",
    text: "Pretty good! Working on a new project.",
    sender: "other",
    timestamp: "10:35 AM",
  },
];

export default function ChatScreen() {
  const { username } = useLocalSearchParams();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState(mockMessages);
  const colors = useThemeColors();

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage = {
        id: String(messages.length + 1),
        text: message,
        sender: "me",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
    }
  };

  const renderMessage = ({ item }: { item: (typeof mockMessages)[0] }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === "me"
          ? { backgroundColor: colors.primary, alignSelf: "flex-end" }
          : { backgroundColor: colors.surface, alignSelf: "flex-start" },
      ]}
    >
      <Text
        style={[
          styles.messageText,
          {
            color:
              item.sender === "me" ? colors.background : colors.textPrimary,
          },
        ]}
      >
        {item.text}
      </Text>
      <Text
        style={[
          styles.messageTime,
          {
            color:
              item.sender === "me" ? colors.background : colors.textSecondary,
          },
        ]}
      >
        {item.timestamp}
      </Text>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <Text
        style={[
          styles.header,
          { color: colors.textPrimary, borderBottomColor: colors.border },
        ]}
      >
        {username}
      </Text>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={[styles.inputContainer, { borderTopColor: colors.border }]}>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.border,
              backgroundColor: colors.surface,
              color: colors.textPrimary,
            },
          ]}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />
        <Button title="Send" onPress={sendMessage} color={colors.primary} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    maxWidth: "80%",
  },
  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
});
