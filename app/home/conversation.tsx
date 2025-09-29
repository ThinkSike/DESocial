import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Chat, chatService, Message } from '../../services/chatService';

export default function ConversationScreen() {
  const { chatId } = useLocalSearchParams<{ chatId: string }>();
  const { user } = useAuth();
  const router = useRouter();
  
  const [chat, setChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  // Get chat details and messages
  useEffect(() => {
    if (!chatId || !user?.uid) {
      setLoading(false);
      return;
    }

    // Get chat details
    const loadChat = async () => {
      try {
        const chatData = await chatService.getChatById(chatId);
        setChat(chatData);
      } catch (error) {
        console.error('Failed to load chat:', error);
        Alert.alert('Error', 'Failed to load chat details');
        router.back();
      }
    };

    loadChat();

    // Subscribe to messages
    const unsubscribe = chatService.subscribeToMessages(chatId, (newMessages) => {
      setMessages(newMessages);
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, [chatId, user?.uid, router]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !chatId || sending) return;

    setSending(true);
    try {
      await chatService.sendMessage(chatId, newMessage.trim());
      setNewMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  // Get chat title
  const getChatTitle = () => {
    if (!chat || !user?.uid) return 'Chat';
    
    if (chat.type === 'group') {
      return chat.groupName || 'Group Chat';
    } else {
      // Private chat - get the other participant's name
      const otherParticipants = Object.keys(chat.participants).filter(id => id !== user.uid);
      return otherParticipants.length > 0 ? 
        chat.participantNames[otherParticipants[0]] || 'Unknown User' : 
        'Private Chat';
    }
  };

  // Render individual message
  const renderMessage = ({ item }: { item: Message }) => {
    const isMyMessage = item.senderId === user?.uid;
    
    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
        paddingHorizontal: 16,
        paddingVertical: 4,
      }}>
        <View style={{
          maxWidth: '75%',
          backgroundColor: isMyMessage ? '#667eea' : '#f3f4f6',
          borderRadius: 18,
          paddingHorizontal: 16,
          paddingVertical: 10,
          borderBottomRightRadius: isMyMessage ? 4 : 18,
          borderBottomLeftRadius: isMyMessage ? 18 : 4,
        }}>
          {!isMyMessage && (
            <Text style={{
              fontSize: 12,
              fontWeight: '600',
              color: '#667eea',
              marginBottom: 4,
            }}>
              {item.senderName}
            </Text>
          )}
          <Text style={{
            fontSize: 16,
            color: isMyMessage ? 'white' : '#1f2937',
            lineHeight: 22,
          }}>
            {item.content}
          </Text>
          <Text style={{
            fontSize: 12,
            color: isMyMessage ? 'rgba(255,255,255,0.7)' : '#9ca3af',
            marginTop: 4,
            textAlign: 'right',
          }}>
            {new Date(item.timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
        <StatusBar style="light" />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 16, color: '#6b7280' }}>Loading conversation...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <TouchableOpacity 
          onPress={() => router.back()}
          style={{ marginRight: 16 }}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 20,
            fontWeight: '700',
            color: 'white',
          }}>
            {getChatTitle()}
          </Text>
          {chat?.type === 'group' && (
            <Text style={{
              fontSize: 14,
              color: 'rgba(255,255,255,0.8)',
            }}>
              {Object.keys(chat.participants).length} members
            </Text>
          )}
        </View>
        
        <TouchableOpacity>
          <Ionicons name="call-outline" size={24} color="white" />
        </TouchableOpacity>
      </LinearGradient>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        {/* Messages List */}
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, backgroundColor: 'white' }}
          contentContainerStyle={{ paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
          inverted={false}
          ListEmptyComponent={() => (
            <View style={{
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 60,
            }}>
              <Ionicons name="chatbubble-ellipses-outline" size={64} color="#9CA3AF" />
              <Text style={{ fontSize: 18, color: '#6b7280', fontWeight: '600', marginTop: 16 }}>
                No messages yet
              </Text>
              <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8 }}>
                Send the first message to start the conversation!
              </Text>
            </View>
          )}
        />

        {/* Message Input */}
        <View style={{
          backgroundColor: 'white',
          paddingHorizontal: 16,
          paddingVertical: 12,
          flexDirection: 'row',
          alignItems: 'flex-end',
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
        }}>
          <TextInput
            value={newMessage}
            onChangeText={setNewMessage}
            placeholder="Type a message..."
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 24,
              paddingHorizontal: 16,
              paddingVertical: 12,
              marginRight: 12,
              fontSize: 16,
              maxHeight: 100,
            }}
            multiline
            textAlignVertical="center"
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim() || sending}
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              backgroundColor: newMessage.trim() && !sending ? '#667eea' : '#e5e7eb',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons 
              name={sending ? "hourglass-outline" : "send"} 
              size={24} 
              color={newMessage.trim() && !sending ? 'white' : '#9ca3af'} 
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}