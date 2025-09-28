// Announcements Screen - Modern Instagram-like UI Design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    FlatList,
    RefreshControl,
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
  {
    id: '3',
    authorId: 'admin3',
    authorName: 'Placement Cell',
    title: 'Placement Drive - Microsoft',
    content: 'Microsoft is visiting our campus for recruitment! Eligible students from CSE, IT, and ECE can apply. Minimum CGPA: 7.5. Last date to apply: October 5th.',
    category: 'placement',
    priority: 'high',
    targetAudience: 'all',
    isActive: true,
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    eventDate: new Date('2024-10-20'),
    eventLocation: 'Placement Cell',
  },
];

const PRIORITY_COLORS = {
  high: { bg: '#fee2e2', text: '#dc2626', border: '#fca5a5' },
  medium: { bg: '#fef3c7', text: '#d97706', border: '#fcd34d' },
  low: { bg: '#ecfdf5', text: '#059669', border: '#6ee7b7' },
};

const CATEGORY_ICONS = {
  academic: 'school-outline',
  events: 'calendar-outline',
  placements: 'briefcase-outline',
  general: 'information-circle-outline',
  sports: 'football-outline',
  cultural: 'musical-notes-outline',
};

const { width } = Dimensions.get('window');

export default function AnnouncementsScreen() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { key: 'all', label: 'All', icon: 'grid-outline' },
    { key: 'academic', label: 'Academic', icon: 'school-outline' },
    { key: 'events', label: 'Events', icon: 'calendar-outline' },
    { key: 'placements', label: 'Placements', icon: 'briefcase-outline' },
    { key: 'sports', label: 'Sports', icon: 'football-outline' },
  ];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firebase service call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
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

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInDays > 0) return `${diffInDays}d ago`;
    if (diffInHours > 0) return `${diffInHours}h ago`;
    return 'Just now';
  };

  const formatEventDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredAnnouncements = selectedCategory === 'all' 
    ? announcements 
    : announcements.filter(a => a.category === selectedCategory);

  const renderAnnouncementCard = ({ item }: { item: Announcement }) => {
    const priorityStyle = PRIORITY_COLORS[item.priority as keyof typeof PRIORITY_COLORS];
    const categoryIcon = CATEGORY_ICONS[item.category as keyof typeof CATEGORY_ICONS] || 'information-circle-outline';

    return (
      <View style={{
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
      }}>
        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
          <View style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: '#667eea',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 12,
          }}>
            <Ionicons name={categoryIcon as any} size={22} color="white" />
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 16, color: '#1f2937' }}>
              {item.authorName}
            </Text>
            <Text style={{ color: '#6b7280', fontSize: 12 }}>
              {getTimeAgo(item.createdAt)}
            </Text>
          </View>

          <View style={{
            backgroundColor: priorityStyle.bg,
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: priorityStyle.border,
          }}>
            <Text style={{ 
              color: priorityStyle.text, 
              fontSize: 10, 
              fontWeight: '700',
              textTransform: 'uppercase'
            }}>
              {item.priority}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text style={{
          fontSize: 20,
          fontWeight: '800',
          color: '#111827',
          marginBottom: 8,
          lineHeight: 26,
        }}>
          {item.title}
        </Text>

        {/* Content */}
        <Text style={{
          fontSize: 15,
          color: '#4b5563',
          lineHeight: 22,
          marginBottom: 16,
        }}>
          {item.content}
        </Text>

        {/* Event Details */}
        {(item.eventDate || item.eventLocation) && (
          <View style={{
            backgroundColor: '#f3f4f6',
            borderRadius: 12,
            padding: 12,
            marginBottom: 16,
          }}>
            {item.eventDate && (
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="calendar-outline" size={16} color="#6b7280" />
                <Text style={{ marginLeft: 8, color: '#374151', fontSize: 14, fontWeight: '500' }}>
                  {formatEventDate(item.eventDate)}
                </Text>
              </View>
            )}
            {item.eventLocation && (
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="location-outline" size={16} color="#6b7280" />
                <Text style={{ marginLeft: 8, color: '#374151', fontSize: 14, fontWeight: '500' }}>
                  {item.eventLocation}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Category Badge */}
        <View style={{
          alignSelf: 'flex-start',
          backgroundColor: '#e0e7ff',
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 16,
        }}>
          <Text style={{ color: '#3730a3', fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
            {item.category}
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 16,
          paddingTop: 16,
          borderTopWidth: 1,
          borderTopColor: '#f3f4f6',
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
              marginRight: 12,
            }}>
              <Ionicons name="heart-outline" size={16} color="#6b7280" />
              <Text style={{ marginLeft: 4, color: '#6b7280', fontSize: 12, fontWeight: '500' }}>
                Like
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#f3f4f6',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 20,
            }}>
              <Ionicons name="share-outline" size={16} color="#6b7280" />
              <Text style={{ marginLeft: 4, color: '#6b7280', fontSize: 12, fontWeight: '500' }}>
                Share
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity>
            <Ionicons name="bookmark-outline" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <LinearGradient
        colors={['#f59e0b', '#d97706']}
        style={{
          paddingTop: 20,
          paddingHorizontal: 20,
          paddingBottom: 30,
        }}
      >
        <Text style={{
          fontSize: 32,
          fontWeight: '800',
          color: 'white',
          marginBottom: 8,
        }}>
          Announcements
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: 20,
        }}>
          Stay updated with latest news
        </Text>

        {/* Category Filter */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
          padding: 4,
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.key}
              onPress={() => setSelectedCategory(category.key)}
              style={{
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: selectedCategory === category.key ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
                marginRight: 4,
                marginBottom: 4,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons 
                name={category.icon as any} 
                size={16} 
                color={selectedCategory === category.key ? 'white' : 'rgba(255, 255, 255, 0.8)'} 
              />
              <Text style={{
                marginLeft: 6,
                color: selectedCategory === category.key ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: selectedCategory === category.key ? '700' : '500',
                fontSize: 13,
              }}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </LinearGradient>

      {/* Stats Cards */}
      <View style={{
        flexDirection: 'row',
        marginHorizontal: 16,
        marginTop: -15,
        marginBottom: 20,
      }}>
        <View style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginRight: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#f59e0b' }}>
            {filteredAnnouncements.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            Total Announcements
          </Text>
        </View>

        <View style={{
          flex: 1,
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          marginLeft: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#dc2626' }}>
            {announcements.filter(a => a.priority === 'high').length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            High Priority
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="light" />
      
      <FlatList
        data={filteredAnnouncements}
        renderItem={renderAnnouncementCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#f59e0b']}
            tintColor="#f59e0b"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
        ListEmptyComponent={() => (
          <View style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 40,
          }}>
            <Ionicons name="megaphone-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, color: '#6b7280', fontWeight: '600', marginTop: 16 }}>
              No announcements
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
              There are no announcements in this category yet. Check back later!
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}