// Tribes Screen for DESocial
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { Tribe } from '../../types';

// Mock data for now - will be replaced with Firebase service
const mockTribes: Tribe[] = [
  {
    id: '1',
    name: 'Web Development Club',
    description: 'Learn modern web technologies, share projects, and collaborate on exciting web applications.',
    category: 'Technology',
    coverImage: undefined,
    adminIds: ['admin1'],
    memberIds: ['user1', 'user2', 'user3'],
    isPrivate: false,
    maxMembers: 100,
    rules: ['Be respectful', 'Share knowledge', 'Help others learn'],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    name: 'Photography Enthusiasts',
    description: 'Capture moments, share techniques, and explore the art of photography together.',
    category: 'Arts & Culture',
    coverImage: undefined,
    adminIds: ['admin2'],
    memberIds: ['user1', 'user4', 'user5', 'user6'],
    isPrivate: false,
    maxMembers: 50,
    rules: ['Original content only', 'Constructive feedback', 'Respect copyrights'],
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    name: 'Competitive Programming',
    description: 'Solve algorithmic challenges, participate in contests, and improve problem-solving skills.',
    category: 'Technology',
    coverImage: undefined,
    adminIds: ['admin3'],
    memberIds: ['user2', 'user7', 'user8'],
    isPrivate: false,
    maxMembers: 75,
    rules: ['Share solutions after contests', 'Help beginners', 'Practice regularly'],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
  },
];

const TRIBE_CATEGORIES = [
  'All', 'Technology', 'Arts & Culture', 'Sports', 'Academic', 'Social', 'Career'
];

export default function TribesScreen() {
  const { user } = useAuth();
  const [tribes, setTribes] = useState<Tribe[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTribe, setNewTribe] = useState({
    name: '',
    description: '',
    category: 'Technology',
    isPrivate: false,
    maxMembers: 50,
  });

  useEffect(() => {
    loadTribes();
  }, []);

  const loadTribes = async () => {
    try {
      setLoading(true);
      // TODO: Replace with actual Firebase service call
      setTribes(mockTribes);
    } catch (error) {
      console.error('Error loading tribes:', error);
      Alert.alert('Error', 'Failed to load tribes');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTribe = async (tribeId: string) => {
    if (!user) return;

    try {
      // TODO: Implement tribe join logic with Firebase
      Alert.alert('Success', 'You have joined the tribe!');
      // Refresh tribes to show updated member status
      await loadTribes();
    } catch (error) {
      console.error('Error joining tribe:', error);
      Alert.alert('Error', 'Failed to join tribe');
    }
  };

  const handleLeaveTribe = async (tribeId: string) => {
    if (!user) return;

    Alert.alert(
      'Leave Tribe',
      'Are you sure you want to leave this tribe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Leave',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Implement tribe leave logic with Firebase
              Alert.alert('Success', 'You have left the tribe');
              await loadTribes();
            } catch (error) {
              console.error('Error leaving tribe:', error);
              Alert.alert('Error', 'Failed to leave tribe');
            }
          },
        },
      ]
    );
  };

  const handleCreateTribe = async () => {
    if (!newTribe.name.trim() || !newTribe.description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!user) return;

    try {
      // TODO: Implement create tribe logic with Firebase service
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

  const filteredTribes = tribes.filter(tribe => {
    const matchesCategory = selectedCategory === 'All' || tribe.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      tribe.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tribe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });

  const renderTribe = (tribe: Tribe) => {
    const isMember = tribe.memberIds.includes(user?.uid || '');
    const isAdmin = tribe.adminIds.includes(user?.uid || '');

    return (
      <View key={tribe.id} className="bg-white mb-4 mx-4 rounded-xl shadow-soft">
        {/* Tribe Cover */}
        <View className="h-32 bg-gradient-to-r from-primary-400 to-primary-600 rounded-t-xl justify-center items-center">
          {tribe.coverImage ? (
            <Image
              source={{ uri: tribe.coverImage }}
              className="w-full h-full rounded-t-xl"
              resizeMode="cover"
            />
          ) : (
            <View className="items-center">
              <Ionicons name="people" size={40} color="white" />
              <Text className="text-white text-lg font-semibold mt-2">
                {tribe.name}
              </Text>
            </View>
          )}
        </View>

        <View className="p-4">
          {/* Tribe Info */}
          <View className="mb-3">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-semibold text-gray-900 flex-1">
                {tribe.name}
              </Text>
              <View className="flex-row items-center">
                {tribe.isPrivate && (
                  <Ionicons name="lock-closed" size={16} color="#6B7280" className="mr-2" />
                )}
                <Text className="text-primary-500 text-sm font-medium">
                  {tribe.category}
                </Text>
              </View>
            </View>
            
            <Text className="text-gray-600 text-base leading-relaxed mb-3">
              {tribe.description}
            </Text>

            {/* Stats */}
            <View className="flex-row items-center space-x-4">
              <View className="flex-row items-center">
                <Ionicons name="people-outline" size={16} color="#6B7280" />
                <Text className="text-gray-600 text-sm ml-1">
                  {tribe.memberIds.length}{tribe.maxMembers ? `/${tribe.maxMembers}` : ''} members
                </Text>
              </View>
              
              {isAdmin && (
                <View className="bg-primary-100 px-2 py-1 rounded-md">
                  <Text className="text-primary-700 text-xs font-medium">Admin</Text>
                </View>
              )}
            </View>
          </View>

          {/* Action Buttons */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center space-x-3">
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                <Text className="ml-1 text-gray-600 text-sm">Chat</Text>
              </TouchableOpacity>
              
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="calendar-outline" size={18} color="#6B7280" />
                <Text className="ml-1 text-gray-600 text-sm">Events</Text>
              </TouchableOpacity>
            </View>

            {isMember ? (
              <TouchableOpacity
                onPress={() => handleLeaveTribe(tribe.id)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                <Text className="text-gray-700 text-sm font-medium">Leave</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleJoinTribe(tribe.id)}
                className="bg-primary-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-sm font-medium">Join</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-2xl font-bold text-gray-900">Tribes</Text>
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add-circle" size={28} color="#0091F5" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-lg px-3 py-2">
          <Ionicons name="search" size={20} color="#6B7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-900 text-base"
            placeholder="Search tribes..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#6B7280" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {TRIBE_CATEGORIES.map((category) => (
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
                className={`text-sm font-medium ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tribes List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">Loading tribes...</Text>
            </View>
          ) : filteredTribes.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="people-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                {searchQuery ? 'No tribes found' : 'No tribes available'}
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                {searchQuery 
                  ? 'Try a different search term'
                  : 'Create the first tribe to get started!'
                }
              </Text>
            </View>
          ) : (
            filteredTribes.map(renderTribe)
          )}
        </View>
      </ScrollView>

      {/* Create Tribe Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200">
            <TouchableOpacity onPress={() => setShowCreateModal(false)}>
              <Text className="text-primary-500 text-base font-medium">Cancel</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-gray-900">Create Tribe</Text>
            <TouchableOpacity onPress={handleCreateTribe}>
              <Text className="text-primary-500 text-base font-medium">Create</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            {/* Name Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Tribe Name *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                placeholder="Enter tribe name"
                placeholderTextColor="#9CA3AF"
                value={newTribe.name}
                onChangeText={(text) => setNewTribe(prev => ({ ...prev, name: text }))}
              />
            </View>

            {/* Description Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Description *</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                placeholder="Describe what your tribe is about..."
                placeholderTextColor="#9CA3AF"
                value={newTribe.description}
                onChangeText={(text) => setNewTribe(prev => ({ ...prev, description: text }))}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>

            {/* Category Selection */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {TRIBE_CATEGORIES.slice(1).map((category) => (
                  <TouchableOpacity
                    key={category}
                    onPress={() => setNewTribe(prev => ({ ...prev, category }))}
                    className={`px-4 py-2 rounded-full mr-3 ${
                      newTribe.category === category
                        ? 'bg-primary-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        newTribe.category === category
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Max Members */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Max Members</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                placeholder="50"
                placeholderTextColor="#9CA3AF"
                value={newTribe.maxMembers.toString()}
                onChangeText={(text) => setNewTribe(prev => ({ 
                  ...prev, 
                  maxMembers: parseInt(text) || 50 
                }))}
                keyboardType="numeric"
              />
            </View>

            {/* Privacy Setting */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Privacy</Text>
              <View className="flex-row">
                <TouchableOpacity
                  onPress={() => setNewTribe(prev => ({ ...prev, isPrivate: false }))}
                  className={`flex-1 py-3 px-4 rounded-l-lg border ${
                    !newTribe.isPrivate
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      !newTribe.isPrivate ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    Public
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setNewTribe(prev => ({ ...prev, isPrivate: true }))}
                  className={`flex-1 py-3 px-4 rounded-r-lg border ${
                    newTribe.isPrivate
                      ? 'bg-primary-500 border-primary-500'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  <Text
                    className={`text-center font-medium ${
                      newTribe.isPrivate ? 'text-white' : 'text-gray-700'
                    }`}
                  >
                    Private
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}