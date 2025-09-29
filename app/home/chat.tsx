// Chat Screen - Real-time Firebase Messaging
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Chat, chatService } from '../../services/chatService';

// Local interface for UI-specific properties
interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
}

export default function ChatScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load real-time chats from Firebase with optimized loading
  useEffect(() => {
    if (!user?.uid) {
      setLoading(false);
      setError('Please log in to view chats');
      return;
    }

    setError(null);
    
    // Set a timeout to show loading state for minimum 500ms to prevent flicker
    const minLoadingTime = setTimeout(() => {
      setInitialLoad(false);
    }, 500);

    const unsubscribe = chatService.subscribeToUserChats((userChats) => {
      setChats(userChats);
      setLoading(false);
      setError(null);
      clearTimeout(minLoadingTime);
      setInitialLoad(false);
    });

    return () => {
      unsubscribe();
      clearTimeout(minLoadingTime);
    };
  }, [user?.uid]);

  // Convert Firebase Chat to UI ChatRoom format with memoization
  const convertChatToRoom = useCallback((chat: Chat): ChatRoom => {
    const currentUserId = user?.uid || '';
    const otherParticipants = Object.keys(chat.participants).filter(id => id !== currentUserId);
    const otherUserName = otherParticipants.length > 0 ? 
      chat.participantNames[otherParticipants[0]] || 'Unknown User' : 
      chat.groupName || 'Unknown Chat';

    return {
      id: chat.id,
      name: chat.type === 'private' ? otherUserName : chat.groupName || 'Group Chat',
      lastMessage: chat.lastMessage || 'No messages yet',
      timestamp: new Date(chat.lastMessageTime),
      unreadCount: chat.unreadCount[currentUserId] || 0,
      isOnline: true, // You can implement online status later
      avatar: chat.type === 'private' ? 
        (otherParticipants.length > 0 ? (chat.participantAvatars[otherParticipants[0]] || otherUserName.charAt(0)) : 'U') :
        (chat.groupName?.charAt(0) || 'G')
    };
  }, [user?.uid]);

  // Memoize filtered chats to prevent unnecessary recalculations
  const filteredChats = useMemo(() => {
    return chats
      .map(convertChatToRoom)
      .filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        room.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
      );
  }, [chats, searchQuery, convertChatToRoom]);

  // Memoize navigation handler to prevent unnecessary re-renders
  const handleChatPress = useCallback((chatId: string) => {
    router.push(`/home/conversation?chatId=${chatId}`);
  }, [router]);

  const getTimeAgo = useCallback((date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  }, []);

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity 
      onPress={() => handleChatPress(item.id)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: 'white',
        borderBottomWidth: 1,
        borderBottomColor: '#f3f4f6',
      }}
    >
      {/* Avatar */}
      <View style={{ position: 'relative', marginRight: 16 }}>
        <View style={{
          width: 50,
          height: 50,
          borderRadius: 25,
          backgroundColor: '#667eea',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
            {item.avatar}
          </Text>
        </View>
        {item.isOnline && (
          <View style={{
            position: 'absolute',
            bottom: 2,
            right: 2,
            width: 14,
            height: 14,
            borderRadius: 7,
            backgroundColor: '#10b981',
            borderWidth: 2,
            borderColor: 'white',
          }} />
        )}
      </View>

      {/* Chat Info */}
      <View style={{ flex: 1, marginRight: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
            {item.name}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280' }}>
            {getTimeAgo(item.timestamp)}
          </Text>
        </View>
        <Text style={{
          fontSize: 14,
          color: '#6b7280',
          lineHeight: 18,
        }} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {/* Unread Badge */}
      {item.unreadCount > 0 && (
        <View style={{
          backgroundColor: '#ef4444',
          minWidth: 20,
          height: 20,
          borderRadius: 10,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 6,
        }}>
          <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>
            {item.unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="light" />
      
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
        style={{
          paddingHorizontal: 20,
          paddingBottom: 20,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <Text style={{
            fontSize: 28,
            fontWeight: '800',
            color: 'white',
          }}>
            Messages
          </Text>
          <TouchableOpacity>
            <Ionicons name="create-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 16,
        }}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.8)" />
          <TextInput
            placeholder="Search messages..."
            placeholderTextColor="rgba(255, 255, 255, 0.8)"
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={{
              flex: 1,
              marginLeft: 12,
              color: 'white',
              fontSize: 16,
            }}
          />
        </View>

        {/* Tabs */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
          padding: 4,
        }}>
          <TouchableOpacity
            onPress={() => setActiveTab('chats')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeTab === 'chats' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
            }}
          >
            <Text style={{
              textAlign: 'center',
              color: activeTab === 'chats' ? 'white' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: activeTab === 'chats' ? '700' : '500',
              fontSize: 14,
            }}>
              Chats
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => setActiveTab('groups')}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 12,
              backgroundColor: activeTab === 'groups' ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
            }}
          >
            <Text style={{
              textAlign: 'center',
              color: activeTab === 'groups' ? 'white' : 'rgba(255, 255, 255, 0.8)',
              fontWeight: activeTab === 'groups' ? '700' : '500',
              fontSize: 14,
            }}>
              Groups
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Chat List */}
      {initialLoad ? (
        <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ 
            width: 40, 
            height: 40, 
            borderRadius: 20, 
            borderWidth: 3, 
            borderColor: '#667eea',
            borderTopColor: 'transparent',
            marginBottom: 16
          }} />
          <Text style={{ fontSize: 16, color: '#6b7280', fontWeight: '500' }}>Loading your chats...</Text>
        </View>
      ) : (
        <FlatList
          data={filteredChats}
          renderItem={renderChatRoom}
          keyExtractor={(item) => item.id}
          style={{ flex: 1, backgroundColor: 'white' }}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={5}
          getItemLayout={(data, index) => (
            { length: 82, offset: 82 * index, index }
          )}
        ListEmptyComponent={() => (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <Ionicons name={error ? "warning-outline" : "chatbubbles-outline"} size={64} color={error ? "#ef4444" : "#9CA3AF"} />
            <Text style={{ fontSize: 18, color: error ? '#ef4444' : '#6b7280', fontWeight: '600', marginTop: 16 }}>
              {loading ? 'Loading chats...' : error ? 'Connection Error' : 'No messages yet'}
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
              {loading ? 'Please wait while we load your conversations' : 
               error ? error : 
               'Start a conversation with your classmates and groups!'}
            </Text>
            {error && (
              <TouchableOpacity
                onPress={() => {
                  setError(null);
                  setLoading(true);
                  // Retry loading chats
                  if (user?.uid) {
                    chatService.subscribeToUserChats((userChats) => {
                      setChats(userChats);
                      setLoading(false);
                      setError(null);
                    });
                  }
                }}
                style={{
                  marginTop: 16,
                  paddingHorizontal: 20,
                  paddingVertical: 8,
                  backgroundColor: '#667eea',
                  borderRadius: 20,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Retry</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        />
      )}

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={async () => {
          try {
            // Create a test chat for demonstration
            const chatId = await chatService.createPrivateChat(
              'test-user-id', 
              'Test User'
            );
            
            // Send a test message
            await chatService.sendMessage(chatId, 'Hello! This is a test message from Firebase 🔥');
            
            Alert.alert('Success', 'Test chat created and message sent!');
          } catch (error) {
            Alert.alert('Error', 'Failed to create chat: ' + (error as Error).message);
          }
        }}
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          width: 60,
          height: 60,
          borderRadius: 30,
          backgroundColor: '#667eea',
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#667eea',
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.3,
          shadowRadius: 16,
          elevation: 12,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
