// Announcements Screen for DESocial
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    RefreshControl,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Announcement } from '../../types';

// Mock data for now - will be replaced with Firebase service
const mockAnnouncements: Announcement[] = [
  {
    id: '1',
    authorId: 'admin1',
    authorName: 'DES Administration',
    title: 'Mid-term Examinations Schedule',
    content: 'The mid-term examinations for all engineering branches will commence from October 15th, 2024. Please check the detailed timetable on the university portal.',
    category: 'academic',
    priority: 'high',
    targetAudience: 'all',
    isActive: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    eventDate: new Date('2024-10-15'),
    eventLocation: 'Main Campus',
  },
  {
    id: '2',
    authorId: 'admin2',
    authorName: 'Student Council',
    title: 'Tech Fest 2024 - Register Now!',
    content: 'Join us for the biggest tech fest of the year! Competitions, workshops, and prizes worth ₹50,000. Registration deadline: September 30th.',
    category: 'events',
    priority: 'medium',
    targetAudience: 'all',
    isActive: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    eventDate: new Date('2024-11-01'),
    eventLocation: 'Tech Auditorium',
  },
];

const PRIORITY_COLORS = {
  low: 'bg-gray-100 text-gray-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  urgent: 'bg-red-100 text-red-700',
};

const CATEGORY_ICONS = {
  general: 'information-circle',
  academic: 'school',
  events: 'calendar',
  clubs: 'people',
  placement: 'briefcase',
} as const;

export default function AnnouncementsScreen() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firebase service call
      setAnnouncements(mockAnnouncements);
    } catch (error) {
      console.error('Error loading announcements:', error);
      Alert.alert('Error', 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadAnnouncements();
    setRefreshing(false);
  };

  const filteredAnnouncements = announcements.filter(announcement => {
    if (selectedCategory === 'all') return true;
    return announcement.category === selectedCategory;
  });

  const renderAnnouncement = (announcement: Announcement) => (
    <View key={announcement.id} className="bg-white mb-4 mx-4 rounded-xl shadow-soft">
      <View className="p-4">
        {/* Announcement Header */}
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1 mr-3">
            <View className="flex-row items-center mb-2">
              <Ionicons
                name={CATEGORY_ICONS[announcement.category as keyof typeof CATEGORY_ICONS] || 'information-circle'}
                size={18}
                color="#0091F5"
              />
              <Text className="text-primary-500 text-sm font-medium ml-2 capitalize">
                {announcement.category}
              </Text>
            </View>
            <Text className="text-lg font-semibold text-gray-900 mb-2">
              {announcement.title}
            </Text>
            <View className="flex-row items-center">
              <Text className="text-gray-600 text-sm">
                by {announcement.authorName}
              </Text>
              <Text className="text-gray-400 text-sm ml-2">
                • {new Date(announcement.createdAt).toLocaleDateString()}
              </Text>
            </View>
          </View>
          
          <View className={`px-2 py-1 rounded-md ${PRIORITY_COLORS[announcement.priority]}`}>
            <Text className="text-xs font-medium capitalize">
              {announcement.priority}
            </Text>
          </View>
        </View>

        {/* Announcement Content */}
        <Text className="text-gray-700 text-base leading-relaxed mb-3">
          {announcement.content}
        </Text>

        {/* Event Details */}
        {announcement.eventDate && (
          <View className="bg-primary-50 p-3 rounded-lg mb-3">
            <View className="flex-row items-center mb-1">
              <Ionicons name="calendar" size={16} color="#0091F5" />
              <Text className="text-primary-700 text-sm font-medium ml-2">
                Event Date: {new Date(announcement.eventDate).toLocaleDateString()}
              </Text>
            </View>
            {announcement.eventLocation && (
              <View className="flex-row items-center">
                <Ionicons name="location" size={16} color="#0091F5" />
                <Text className="text-primary-700 text-sm ml-2">
                  Location: {announcement.eventLocation}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Actions */}
        <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="bookmark-outline" size={18} color="#6B7280" />
            <Text className="ml-2 text-gray-600 text-sm">Save</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row items-center">
            <Ionicons name="share-outline" size={18} color="#6B7280" />
            <Text className="ml-2 text-gray-600 text-sm">Share</Text>
          </TouchableOpacity>

          {announcement.eventDate && (
            <TouchableOpacity className="bg-primary-500 px-4 py-2 rounded-lg">
              <Text className="text-white text-sm font-medium">Add to Calendar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Announcements</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Filter */}
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'general', 'academic', 'events', 'clubs', 'placement'].map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full mr-3 ${
                selectedCategory === category
                  ? 'bg-primary-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium capitalize ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
              >
                {category === 'all' ? 'All' : category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Announcements List */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View className="py-4">
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">Loading announcements...</Text>
            </View>
          ) : filteredAnnouncements.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="megaphone-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No announcements
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                Check back later for important updates from the university
              </Text>
            </View>
          ) : (
            filteredAnnouncements.map(renderAnnouncement)
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}