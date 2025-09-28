// Forum Screen - Modern Instagram-like UI Design
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Modal,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import { forumService } from '../../services/forumService';
import { ForumPost } from '../../types';

const COURSE_TAGS = [
  'Mathematics', 'Physics', 'Programming', 'Data Structures',
  'Algorithms', 'Database', 'Networks', 'Operating Systems',
  'Software Engineering', 'Machine Learning', 'Web Development',
  'Mobile Development', 'Computer Graphics', 'Cybersecurity'
];

export default function ForumScreen() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    content: '',
    courseTags: [] as string[],
  });
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'unanswered' | 'answered'>('all');

  useEffect(() => {
    loadQuestions();
  }, [selectedFilter]);

  const loadQuestions = async () => {
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
  };

  const handleCreateQuestion = async () => {
    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      Alert.alert('Error', 'Please fill in both title and content');
      return;
    }

    if (!user) return;

    try {
      await forumService.createQuestion(
        {
          title: newQuestion.title.trim(),
          content: newQuestion.content.trim(),
          courseTags: newQuestion.courseTags,
        },
        user.uid,
        user.displayName
      );

      setNewQuestion({ title: '', content: '', courseTags: [] });
      setShowCreateModal(false);
      await loadQuestions();
      Alert.alert('Success', 'Question posted successfully!');
    } catch (error) {
      console.error('Error creating question:', error);
      Alert.alert('Error', 'Failed to post question');
    }
  };

  const handleVote = async (questionId: string, voteType: 'upvote' | 'downvote') => {
    if (!user) return;

    try {
      await forumService.voteQuestion(questionId, user.uid, voteType);
      await loadQuestions(); // Refresh to show updated votes
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const toggleTag = (tag: string) => {
    setNewQuestion(prev => ({
      ...prev,
      courseTags: prev.courseTags.includes(tag)
        ? prev.courseTags.filter(t => t !== tag)
        : [...prev.courseTags, tag]
    }));
  };

  const renderQuestion = (question: ForumPost) => {
    const score = question.upvotes.length - question.downvotes.length;
    const hasUpvoted = question.upvotes.includes(user?.uid || '');
    const hasDownvoted = question.downvotes.includes(user?.uid || '');

    return (
      <View key={question.id} className="bg-white mb-4 mx-4 rounded-xl shadow-soft">
        <View className="p-4">
          {/* Question Header */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                {question.title}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-gray-600 text-sm">
                  by {question.authorName}
                </Text>
                <Text className="text-gray-400 text-sm ml-2">
                  • {new Date(question.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            
            {question.isAnswered && (
              <View className="bg-success-100 px-2 py-1 rounded-md">
                <Text className="text-success-700 text-xs font-medium">
                  Answered
                </Text>
              </View>
            )}
          </View>

          {/* Question Content */}
          <Text className="text-gray-700 text-base leading-relaxed mb-3">
            {question.content}
          </Text>

          {/* Course Tags */}
          {question.courseTags.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-3">
              {question.courseTags.map((tag, index) => (
                <View key={index} className="bg-primary-100 px-3 py-1 rounded-full mr-2">
                  <Text className="text-primary-700 text-xs font-medium">{tag}</Text>
                </View>
              ))}
            </ScrollView>
          )}

          {/* Question Actions */}
          <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
            <View className="flex-row items-center space-x-4">
              {/* Voting */}
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleVote(question.id, 'upvote')}
                  className="mr-1"
                >
                  <Ionicons
                    name={hasUpvoted ? 'arrow-up' : 'arrow-up-outline'}
                    size={20}
                    color={hasUpvoted ? '#22C55E' : '#6B7280'}
                  />
                </TouchableOpacity>
                <Text className="text-gray-700 font-medium text-sm min-w-6 text-center">
                  {score}
                </Text>
                <TouchableOpacity
                  onPress={() => handleVote(question.id, 'downvote')}
                  className="ml-1"
                >
                  <Ionicons
                    name={hasDownvoted ? 'arrow-down' : 'arrow-down-outline'}
                    size={20}
                    color={hasDownvoted ? '#EF4444' : '#6B7280'}
                  />
                </TouchableOpacity>
              </View>

              {/* Answer Count */}
              <View className="flex-row items-center">
                <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                <Text className="ml-1 text-gray-600 text-sm">
                  {question.answersCount} {question.answersCount === 1 ? 'answer' : 'answers'}
                </Text>
              </View>
            </View>

            <TouchableOpacity className="bg-primary-500 px-4 py-2 rounded-lg">
              <Text className="text-white text-sm font-medium">Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-gray-900">Q&A Forum</Text>
          <TouchableOpacity onPress={() => setShowCreateModal(true)}>
            <Ionicons name="add-circle" size={28} color="#0091F5" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View className="bg-white px-4 py-2 border-b border-gray-200">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {['all', 'unanswered', 'answered'].map((filter) => (
            <TouchableOpacity
              key={filter}
              onPress={() => setSelectedFilter(filter as any)}
              className={`px-4 py-2 rounded-full mr-3 ${
                selectedFilter === filter
                  ? 'bg-primary-500'
                  : 'bg-gray-100'
              }`}
            >
              <Text
                className={`text-sm font-medium capitalize ${
                  selectedFilter === filter
                    ? 'text-white'
                    : 'text-gray-600'
                }`}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Questions List */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="py-4">
          {loading ? (
            <View className="flex-1 justify-center items-center py-20">
              <Text className="text-gray-500 text-lg">Loading questions...</Text>
            </View>
          ) : questions.length === 0 ? (
            <View className="flex-1 justify-center items-center py-20">
              <Ionicons name="help-circle-outline" size={64} color="#9CA3AF" />
              <Text className="text-gray-500 text-lg mt-4 text-center">
                No questions yet
              </Text>
              <Text className="text-gray-400 text-sm text-center mt-2 px-8">
                Be the first to ask a question!
              </Text>
            </View>
          ) : (
            questions.map(renderQuestion)
          )}
        </View>
      </ScrollView>

      {/* Create Question Modal */}
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
            <Text className="text-lg font-semibold text-gray-900">Ask Question</Text>
            <TouchableOpacity onPress={handleCreateQuestion}>
              <Text className="text-primary-500 text-base font-medium">Post</Text>
            </TouchableOpacity>
          </View>

          <ScrollView className="flex-1 px-4 py-4">
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Question Title</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                placeholder="What's your question?"
                placeholderTextColor="#9CA3AF"
                value={newQuestion.title}
                onChangeText={(text) => setNewQuestion(prev => ({ ...prev, title: text }))}
              />
            </View>

            {/* Content Input */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Question Details</Text>
              <TextInput
                className="border border-gray-300 rounded-lg p-3 text-base text-gray-900"
                placeholder="Provide more details about your question..."
                placeholderTextColor="#9CA3AF"
                value={newQuestion.content}
                onChangeText={(text) => setNewQuestion(prev => ({ ...prev, content: text }))}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>

            {/* Course Tags */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-gray-700 mb-2">Course Tags</Text>
              <View className="flex-row flex-wrap">
                {COURSE_TAGS.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => toggleTag(tag)}
                    className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                      newQuestion.courseTags.includes(tag)
                        ? 'bg-primary-500'
                        : 'bg-gray-100'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        newQuestion.courseTags.includes(tag)
                          ? 'text-white'
                          : 'text-gray-600'
                      }`}
                    >
                      {tag}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}