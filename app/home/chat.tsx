// Chat Screen - Modern Instagram-like Messages UI
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    FlatList,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  isFromUser: boolean;
  senderName: string;
}

interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unreadCount: number;
  isOnline: boolean;
  avatar: string;
}

const mockChatRooms: ChatRoom[] = [
  {
    id: '1',
    name: 'Web Dev Club',
    lastMessage: 'Hey everyone! New React tutorial is up',
    timestamp: new Date(),
    unreadCount: 3,
    isOnline: true,
    avatar: 'W',
  },
  {
    id: '2',
    name: 'Study Group - CS',
    lastMessage: 'Can someone share the notes?',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    unreadCount: 1,
    isOnline: false,
    avatar: 'S',
  },
  {
    id: '3',
    name: 'Photography Club',
    lastMessage: 'Amazing shots from yesterday!',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    unreadCount: 0,
    isOnline: true,
    avatar: 'P',
  },
];

export default function ChatScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return date.toLocaleDateString();
  };

  const renderChatRoom = ({ item }: { item: ChatRoom }) => (
    <TouchableOpacity style={{
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: 'white',
      borderBottomWidth: 1,
      borderBottomColor: '#f3f4f6',
    }}>
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
      <FlatList
        data={mockChatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item) => item.id}
        style={{ flex: 1, backgroundColor: 'white' }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 60,
          }}>
            <Ionicons name="chatbubbles-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, color: '#6b7280', fontWeight: '600', marginTop: 16 }}>
              No messages yet
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
              Start a conversation with your classmates and groups!
            </Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
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
