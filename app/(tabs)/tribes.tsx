// Tribes Screen - Modern Instagram-like UI Design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { Tribe } from '../../types';

// Mock data for now - will be replaced with Firebase service
const mockTribes: Tribe[] = [
  {
    id: '1',
    name: 'Web Development Club',
    description: 'Learn modern web technologies, share projects, and collaborate on exciting web applications. Join us for workshops, hackathons, and project collaborations.',
    category: 'Technology',
    coverImage: undefined,
    adminIds: ['admin1'],
    memberIds: ['user1', 'user2', 'user3', 'user4', 'user5', 'user6'],
    isPrivate: false,
    maxMembers: 100,
    rules: ['Be respectful', 'Share knowledge', 'Help others learn'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Photography Club',
    description: 'Capture moments, share techniques, and explore the art of photography together. Weekly photo walks and contests.',
    category: 'Arts & Culture',
    coverImage: undefined,
    adminIds: ['admin2'],
    memberIds: ['user1', 'user4', 'user5', 'user6', 'user7', 'user8', 'user9'],
    isPrivate: false,
    maxMembers: 50,
    rules: ['Original content only', 'Constructive feedback', 'Respect copyrights'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Competitive Programming',
    description: 'Solve challenging problems, participate in contests, and enhance your algorithmic thinking skills.',
    category: 'Technology',
    coverImage: undefined,
    adminIds: ['admin3'],
    memberIds: ['user2', 'user3', 'user10', 'user11'],
    isPrivate: false,
    maxMembers: 75,
    rules: ['Regular practice', 'Share solutions', 'Help beginners'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
  },
  {
    id: '4',
    name: 'Music & Arts Society',
    description: 'Express your creativity through music, art, and cultural activities. Open to all forms of artistic expression.',
    category: 'Arts & Culture',
    coverImage: undefined,
    adminIds: ['admin4'],
    memberIds: ['user5', 'user6', 'user12', 'user13', 'user14'],
    isPrivate: false,
    maxMembers: 60,
    rules: ['Respect all art forms', 'Encourage creativity', 'Collaborate respectfully'],
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22'),
  },
];

const CATEGORY_COLORS = {
  'Technology': { bg: '#dbeafe', text: '#1d4ed8', icon: 'code-slash' },
  'Arts & Culture': { bg: '#fdf2f8', text: '#be185d', icon: 'color-palette' },
  'Sports': { bg: '#ecfdf5', text: '#059669', icon: 'football' },
  'Academic': { bg: '#fef3c7', text: '#d97706', icon: 'library' },
  'Social': { bg: '#f3e8ff', text: '#7c3aed', icon: 'people' },
};

const { width } = Dimensions.get('window');

export default function TribesScreen() {
  const { user } = useAuth();
  const colors = useThemeColors();
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTribe, setNewTribe] = useState({
    name: '',
    description: '',
    category: 'Technology',
    isPrivate: false,
    maxMembers: 50,
  });

  const categories = [
    'all', 'Technology', 'Arts & Culture', 'Sports', 'Academic', 'Social'
  ];

  useEffect(() => {
    loadTribes();
  }, []);

  const loadTribes = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firebase service call
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate loading
      setTribes(mockTribes);
    } catch (error) {
      console.error('Error loading tribes:', error);
      Alert.alert('Error', 'Failed to load tribes');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadTribes();
    setRefreshing(false);
  };

  const joinTribe = async (tribeId: string) => {
    if (!user) return;
    
    try {
      // TODO: Implement actual join functionality
      Alert.alert('Success', 'You have joined the tribe!');
      await loadTribes();
    } catch (error) {
      console.error('Error joining tribe:', error);
      Alert.alert('Error', 'Failed to join tribe');
    }
  };

  const createTribe = async () => {
    if (!newTribe.name.trim() || !newTribe.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      // TODO: Implement actual create functionality
      Alert.alert('Success', 'Tribe created successfully!');
      setNewTribe({
        name: '',
        description: '',
        category: 'Technology',
        isPrivate: false,
        maxMembers: 50,
      });
      setShowCreateModal(false);
      await loadTribes();
    } catch (error) {
      console.error('Error creating tribe:', error);
      Alert.alert('Error', 'Failed to create tribe');
    }
  };

  const getMemberAvatars = (memberIds: string[]) => {
    const displayCount = Math.min(memberIds.length, 3);
    const colors = ['#667eea', '#f093fb', '#f59e0b', '#10b981', '#ef4444'];
    
    return memberIds.slice(0, displayCount).map((memberId, index) => (
      <View
        key={memberId}
        style={{
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: colors[index % colors.length],
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: index > 0 ? -8 : 0,
          borderWidth: 2,
          borderColor: 'white',
        }}
      >
        <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>
          {memberId.charAt(0).toUpperCase()}
        </Text>
      </View>
    ));
  };

  const filteredTribes = selectedCategory === 'all' 
    ? tribes 
    : tribes.filter(t => t.category === selectedCategory);

  const renderTribeCard = ({ item }: { item: Tribe }) => {
    const categoryStyle = CATEGORY_COLORS[item.category as keyof typeof CATEGORY_COLORS] || CATEGORY_COLORS.Technology;
    const isJoined = user && item.memberIds.includes(user.uid);
    const isFull = item.memberIds.length >= (item.maxMembers ?? 0);

    return (
      <View style={{
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 5,
        overflow: 'hidden',
      }}>
        {/* Cover Image or Gradient */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={{
            height: 120,
            justifyContent: 'flex-end',
            padding: 20,
          }}
        >
          <View style={{
            backgroundColor: categoryStyle.bg,
            alignSelf: 'flex-start',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <Ionicons name={categoryStyle.icon as any} size={14} color={categoryStyle.text} />
            <Text style={{ 
              color: categoryStyle.text, 
              fontSize: 12, 
              fontWeight: '600',
              marginLeft: 4,
            }}>
              {item.category}
            </Text>
          </View>
        </LinearGradient>

        <View style={{ padding: 20 }}>
          {/* Tribe Info */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text style={{
                fontSize: 20,
                fontWeight: '800',
                color: '#111827',
                marginBottom: 6,
                lineHeight: 24,
              }}>
                {item.name}
              </Text>
            </View>

            {item.isPrivate && (
              <View style={{
                backgroundColor: '#fee2e2',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#dc2626', fontSize: 10, fontWeight: '600' }}>
                  PRIVATE
                </Text>
              </View>
            )}
          </View>

          <Text style={{
            fontSize: 14,
            color: '#4b5563',
            lineHeight: 20,
            marginBottom: 16,
          }}>
            {item.description}
          </Text>

          {/* Members */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 16,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {getMemberAvatars(item.memberIds)}
              </View>
              <Text style={{ marginLeft: 12, color: '#6b7280', fontSize: 14 }}>
                {item.memberIds.length} / {item.maxMembers} members
              </Text>
            </View>

            {isFull && (
              <View style={{
                backgroundColor: '#fef3c7',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={{ color: '#d97706', fontSize: 10, fontWeight: '600' }}>
                  FULL
                </Text>
              </View>
            )}
          </View>

          {/* Progress Bar */}
          <View style={{
            height: 4,
            backgroundColor: '#f3f4f6',
            borderRadius: 2,
            marginBottom: 16,
            overflow: 'hidden',
          }}>
            <View style={{
              height: '100%',
              width: `${(item.memberIds.length / (item.maxMembers ?? 1)) * 100}%`,
              backgroundColor: isFull ? '#f59e0b' : '#10b981',
              borderRadius: 2,
            }} />
          </View>

          {/* Action Button */}
          <TouchableOpacity
            onPress={() => joinTribe(item.id)}
            disabled={isJoined || isFull}
            style={{
              backgroundColor: isJoined ? '#10b981' : (isFull ? '#9ca3af' : '#667eea'),
              borderRadius: 16,
              paddingVertical: 14,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
          >
            <Ionicons 
              name={isJoined ? 'checkmark-circle' : (isFull ? 'close-circle' : 'add-circle')} 
              size={20} 
              color="white" 
            />
            <Text style={{
              color: 'white',
              fontSize: 16,
              fontWeight: '700',
              marginLeft: 8,
            }}>
              {isJoined ? 'Joined' : (isFull ? 'Full' : 'Join Tribe')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View>
      {/* Header */}
      <LinearGradient
        colors={['#10b981', '#059669']}
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
          Groups
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: 20,
        }}>
          Join communities, make connections
        </Text>

        {/* Category Filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', paddingBottom: 4 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={{
                  paddingVertical: 10,
                  paddingHorizontal: 16,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === category ? 'rgba(255, 255, 255, 0.25)' : 'rgba(255, 255, 255, 0.1)',
                  marginRight: 8,
                }}
              >
                <Text style={{
                  color: selectedCategory === category ? 'white' : 'rgba(255, 255, 255, 0.8)',
                  fontWeight: selectedCategory === category ? '700' : '500',
                  fontSize: 14,
                }}>
                  {category === 'all' ? 'All Groups' : category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#10b981' }}>
            {filteredTribes.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            Available Groups
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#667eea' }}>
            {user ? tribes.filter(t => t.memberIds.includes(user.uid)).length : 0}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            Joined Groups
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="light" />
      
      <FlatList
        data={filteredTribes}
        renderItem={renderTribeCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10b981']}
            tintColor="#10b981"
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
            <Ionicons name="people-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, color: '#6b7280', fontWeight: '600', marginTop: 16 }}>
              No groups found
            </Text>
            <Text style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', marginTop: 8, paddingHorizontal: 40 }}>
              Try selecting a different category or create a new group!
            </Text>
          </View>
        )}
      />

      {/* Floating Action Button */}
      {!showCreateModal && (
        <TouchableOpacity
          onPress={() => setShowCreateModal(true)}
          style={{
            position: 'absolute',
            bottom: 120, // Increased to account for tab bar
            right: 20,
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: '#10b981',
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#10b981',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.3,
            shadowRadius: 16,
            elevation: 12,
            zIndex: 1000,
          }}
        >
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      )}

      {/* Create Tribe Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <LinearGradient
            colors={['#10b981', '#059669']}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 20,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <TouchableOpacity onPress={() => setShowCreateModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={{ fontSize: 18, fontWeight: '700', color: 'white' }}>
                Create Group
              </Text>
              <TouchableOpacity
                onPress={createTribe}
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 16,
                }}
              >
                <Text style={{ color: 'white', fontWeight: '600' }}>Create</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Group Name */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
              Group Name *
            </Text>
            <TextInput
              value={newTribe.name}
              onChangeText={(text) => setNewTribe(prev => ({ ...prev, name: text }))}
              placeholder="Enter group name..."
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
              }}
            />

            {/* Description */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
              Description *
            </Text>
            <TextInput
              value={newTribe.description}
              onChangeText={(text) => setNewTribe(prev => ({ ...prev, description: text }))}
              placeholder="Describe your group..."
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                height: 100,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
                textAlignVertical: 'top',
              }}
              multiline
            />

            {/* Category */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
              Category
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
              {categories.slice(1).map((category) => (
                <TouchableOpacity
                  key={category}
                  onPress={() => setNewTribe(prev => ({ ...prev, category }))}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: newTribe.category === category ? '#10b981' : '#f3f4f6',
                  }}
                >
                  <Text style={{
                    color: newTribe.category === category ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: 14,
                  }}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Max Members */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
              Maximum Members
            </Text>
            <TextInput
              value={newTribe.maxMembers.toString()}
              onChangeText={(text) => setNewTribe(prev => ({ ...prev, maxMembers: parseInt(text) || 50 }))}
              placeholder="50"
              keyboardType="numeric"
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
              }}
            />

            {/* Privacy Toggle */}
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f9fafb',
              padding: 16,
              borderRadius: 16,
              marginBottom: 20,
            }}>
              <View>
                <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937' }}>
                  Private Group
                </Text>
                <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 2 }}>
                  Requires approval to join
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setNewTribe(prev => ({ ...prev, isPrivate: !prev.isPrivate }))}
                style={{
                  width: 50,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: newTribe.isPrivate ? '#10b981' : '#d1d5db',
                  justifyContent: 'center',
                  paddingHorizontal: 2,
                }}
              >
                <View style={{
                  width: 26,
                  height: 26,
                  borderRadius: 13,
                  backgroundColor: 'white',
                  alignSelf: newTribe.isPrivate ? 'flex-end' : 'flex-start',
                }} />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}