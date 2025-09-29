// Forum Screen - Modern Instagram-like UI Design
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeColors } from '../../constants/Colors';
import { useAuth } from '../../contexts/AuthContext';
import { forumService } from '../../services/forumService';
import { ForumPost } from '../../types';

const COURSE_TAGS = [
  'Mathematics', 'Physics', 'Programming', 'Data Structures',
  'Algorithms', 'Database', 'Networks', 'Operating Systems',
  'Software Engineering', 'Machine Learning', 'Web Development',
  'Mobile Development', 'Computer Graphics', 'Cybersecurity'
];

// Removed unused Dimensions reference

export default function ForumScreen() {
  const { user } = useAuth();
  const colors = useThemeColors();
  const [questions, setQuestions] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    courseTags: [] as string[],
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unanswered' | 'answered'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const isAnswered = selectedFilter === 'answered' ? true : 
                        selectedFilter === 'unanswered' ? false : undefined;
      
      const fetchedQuestions = await forumService.getQuestions(undefined, isAnswered, 20);
      setQuestions(fetchedQuestions);
    } catch (error) {
      console.error('Error loading questions:', error);
      Alert.alert('Error', 'Failed to load questions');
    } finally {
      setLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadQuestions();
    setRefreshing(false);
  };

  const createQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setPosting(true);
      await forumService.createQuestion(
        newQuestion,
        user!.uid,
        user!.displayName
      );

      // Reset form and close modal
      setNewQuestion({ title: '', content: '', courseTags: [] });
      setShowCreateModal(false);
      await loadQuestions();
      
      // Show success message after modal is closed
      setTimeout(() => {
        Alert.alert('Success', 'Question posted successfully!');
      }, 300);
    } catch (error) {
      console.error('Error creating question:', error);
      Alert.alert('Error', 'Failed to post question');
    } finally {
      setPosting(false);
    }
  };

  const toggleCourseTag = (tag: string) => {
    setNewQuestion(prev => ({
      ...prev,
      courseTags: prev.courseTags.includes(tag)
        ? prev.courseTags.filter(t => t !== tag)
        : [...prev.courseTags, tag]
    }));
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

  const renderQuestionCard = ({ item }: { item: ForumPost }) => (
    <TouchableOpacity
      onPress={() => {
        // Auto-close the create modal if it's open when a discussion is clicked
        if (showCreateModal) setShowCreateModal(false);
        // TODO: Navigate to question details when implemented
      }}
      activeOpacity={0.9}
      style={{
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
      {/* Question Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <View style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: '#667eea',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 12,
        }}>
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
            {item.authorName?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: '600', fontSize: 16, color: colors.textPrimary }}>
            {item.authorName || 'Anonymous'}
          </Text>
          <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
            {getTimeAgo(new Date(item.createdAt))}
          </Text>
        </View>
        <View style={{
          backgroundColor: item.isAnswered ? '#10b981' : '#f59e0b',
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 12,
        }}>
          <Text style={{ color: 'white', fontSize: 10, fontWeight: '600' }}>
            {item.isAnswered ? 'ANSWERED' : 'OPEN'}
          </Text>
        </View>
      </View>

      {/* Question Content */}
      <Text style={{
        fontSize: 18,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 8,
        lineHeight: 24,
      }}>
        {item.title}
      </Text>
      
      <Text style={{
        fontSize: 14,
        color: colors.textSecondary,
        lineHeight: 20,
        marginBottom: 16,
      }}>
        {item.content}
      </Text>

      {/* Course Tags */}
      {item.courseTags && item.courseTags.length > 0 && (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
          {item.courseTags.map((tag, index) => (
            <View key={index} style={{
              backgroundColor: '#e0e7ff',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              marginRight: 8,
              marginBottom: 4,
            }}>
              <Text style={{ color: '#3730a3', fontSize: 12, fontWeight: '500' }}>
                {tag}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Interaction Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
            <Ionicons name="thumbs-up-outline" size={16} color="#6b7280" />
            <Text style={{ marginLeft: 4, color: '#6b7280', fontSize: 12, fontWeight: '500' }}>
              {item.upvotes || 0}
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
            <Ionicons name="chatbubble-outline" size={16} color="#6b7280" />
            <Text style={{ marginLeft: 4, color: '#6b7280', fontSize: 12, fontWeight: '500' }}>
              {item.answersCount || 0}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity>
          <Ionicons name="bookmark-outline" size={20} color="#6b7280" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderHeader = () => (
    <View>
      {/* Header */}
      <LinearGradient
        colors={['#667eea', '#764ba2']}
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
          Discussions
        </Text>
        <Text style={{
          fontSize: 16,
          color: 'rgba(255, 255, 255, 0.8)',
          marginBottom: 20,
        }}>
          Ask questions, share knowledge
        </Text>

        {/* Search Bar */}
        <View style={{
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 20,
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 12,
          marginBottom: 20,
        }}>
          <Ionicons name="search" size={20} color="rgba(255, 255, 255, 0.8)" />
          <TextInput
            placeholder="Search discussions..."
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

        {/* Filter Buttons */}
        <View style={{
          flexDirection: 'row',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 16,
          padding: 4,
        }}>
          {[
            { key: 'all', label: 'All' },
            { key: 'unanswered', label: 'Open' },
            { key: 'answered', label: 'Solved' },
          ].map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setSelectedFilter(filter.key as any)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: selectedFilter === filter.key ? 'rgba(255, 255, 255, 0.25)' : 'transparent',
              }}
            >
              <Text style={{
                textAlign: 'center',
                color: selectedFilter === filter.key ? 'white' : 'rgba(255, 255, 255, 0.8)',
                fontWeight: selectedFilter === filter.key ? '700' : '500',
                fontSize: 14,
              }}>
                {filter.label}
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#667eea' }}>
            {questions.length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            Total Questions
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
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#10b981' }}>
            {questions.filter(q => q.isAnswered).length}
          </Text>
          <Text style={{ fontSize: 12, color: '#6b7280', fontWeight: '500' }}>
            Solved
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <StatusBar style="light" />
      
      <FlatList
        data={questions}
        renderItem={renderQuestionCard}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListFooterComponent={loading ? (
          <View style={{ paddingVertical: 20 }}>
            <ActivityIndicator color="#667eea" />
          </View>
        ) : null}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#667eea']}
            tintColor="#667eea"
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setShowCreateModal(true)}
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

      {/* Create Question Modal */}
      <Modal
        visible={showCreateModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowCreateModal(false)}
      >
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
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
                Ask Question
              </Text>
              <TouchableOpacity
                onPress={createQuestion}
                disabled={posting}
                style={{
                  backgroundColor: posting ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {posting && (
                  <ActivityIndicator 
                    size="small" 
                    color="white" 
                    style={{ marginRight: 8 }} 
                  />
                )}
                <Text style={{ 
                  color: posting ? 'rgba(255, 255, 255, 0.7)' : 'white', 
                  fontWeight: '600' 
                }}>
                  {posting ? 'Posting...' : 'Post'}
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView style={{ flex: 1, padding: 20 }} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* Question Title */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
              Question Title
            </Text>
            <TextInput
              value={newQuestion.title}
              onChangeText={(text) => setNewQuestion(prev => ({ ...prev, title: text }))}
              placeholder="What's your question?"
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
              }}
              multiline
            />

            {/* Question Content */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 8 }}>
              Description
            </Text>
            <TextInput
              value={newQuestion.content}
              onChangeText={(text) => setNewQuestion(prev => ({ ...prev, content: text }))}
              placeholder="Provide more details about your question..."
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                height: 120,
                marginBottom: 20,
                backgroundColor: '#f9fafb',
                textAlignVertical: 'top',
              }}
              multiline
            />

            {/* Course Tags */}
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1f2937', marginBottom: 12 }}>
              Select Subjects
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {COURSE_TAGS.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => toggleCourseTag(tag)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 20,
                    marginRight: 8,
                    marginBottom: 8,
                    backgroundColor: newQuestion.courseTags.includes(tag) ? '#667eea' : '#f3f4f6',
                  }}
                >
                  <Text style={{
                    color: newQuestion.courseTags.includes(tag) ? 'white' : '#6b7280',
                    fontWeight: '500',
                    fontSize: 14,
                  }}>
                    {tag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}