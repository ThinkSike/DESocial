import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  Button,
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
        item.sender === "me" ? styles.myMessage : styles.otherMessage,
      ]}
    >
      <Text style={styles.messageText}>{item.text}</Text>
      <Text style={styles.messageTime}>{item.timestamp}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>{username}</Text>

      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          multiline
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
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
  myMessage: {
    backgroundColor: "#007AFF",
    alignSelf: "flex-end",
  },
  otherMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
  },
  messageText: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 12,
    color: "#fff",
    opacity: 0.7,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
});