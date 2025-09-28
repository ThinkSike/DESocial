// Home Feed Screen for DESocial - Modern UI Design with Instagram-like Swipe
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    Image,
    PanResponder,
    RefreshControl,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../contexts/AuthContext';
import '../../global.css';
import { postService } from '../../services/postService';
import { Post } from '../../types';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      const fetchedPosts = await postService.getPosts(20);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      Alert.alert('Error', 'Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadPosts();
    setRefreshing(false);
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) {
      Alert.alert('Error', 'Please enter some content for your post');
      return;
    }

    if (!user) return;

    try {
      await postService.createPost(
        { content: newPostContent.trim() },
        user.uid,
        user.displayName,
        user.profilePicture
      );
      
      setNewPostContent('');
      setShowCreatePost(false);
      await loadPosts(); // Refresh posts
      Alert.alert('Success', 'Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post');
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!user) return;

    try {
      await postService.toggleLike(postId, user.uid);
      // Update local state
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const isLiked = post.likes.includes(user.uid);
          return {
            ...post,
            likes: isLiked 
              ? post.likes.filter(id => id !== user.uid)
              : [...post.likes, user.uid]
          };
        }
        return post;
      }));
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const renderPost = (post: Post) => (
    <View 
      key={post.id} 
      style={{
        backgroundColor: '#ffffff',
        marginHorizontal: 16,
        marginBottom: 20,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
        elevation: 8,
        overflow: 'hidden',
      }}
    >
      {/* Post Header */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        paddingBottom: 16,
      }}>
        <View style={{
          width: 48,
          height: 48,
          borderRadius: 24,
          overflow: 'hidden',
          marginRight: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        }}>
          <Image
            source={
              post.authorProfilePicture
                ? { uri: post.authorProfilePicture }
                : require('../../assets/images/icon.png')
            }
            style={{ width: 48, height: 48 }}
            resizeMode="cover"
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{
            fontSize: 17,
            fontWeight: '700',
            color: '#1f2937',
            marginBottom: 2,
          }}>
            {post.authorName}
          </Text>
          <Text style={{
            fontSize: 14,
            color: '#6b7280',
          }}>
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        </View>
        <TouchableOpacity style={{
          padding: 8,
          borderRadius: 20,
          backgroundColor: '#f3f4f6',
        }}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#6b7280" />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
        <Text style={{
          fontSize: 16,
          lineHeight: 24,
          color: '#374151',
          letterSpacing: 0.2,
        }}>
          {post.content}
        </Text>
      </View>

      {/* Post Images */}
      {post.images && post.images.length > 0 && (
        <View style={{ paddingHorizontal: 20, paddingBottom: 16 }}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -4 }}
          >
            {post.images.map((image, index) => (
              <View
                key={index}
                style={{
                  width: 280,
                  height: 200,
                  marginHorizontal: 4,
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.1,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Image
                  source={{ uri: image }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Post Actions */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#e5e7eb',
      }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: post.likes.includes(user?.uid || '') ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 20,
          }}
          onPress={() => handleLikePost(post.id)}
        >
          <Ionicons
            name={post.likes.includes(user?.uid || '') ? 'heart' : 'heart-outline'}
            size={22}
            color={post.likes.includes(user?.uid || '') ? '#ef4444' : '#6b7280'}
          />
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontWeight: '600',
            color: post.likes.includes(user?.uid || '') ? '#ef4444' : '#6b7280',
          }}>
            {post.likes.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Ionicons name="chatbubble-outline" size={22} color="#6b7280" />
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontWeight: '600',
            color: '#6b7280',
          }}>
            {post.commentsCount}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
        }}>
          <Ionicons name="share-outline" size={22} color="#6b7280" />
          <Text style={{
            marginLeft: 8,
            fontSize: 14,
            fontWeight: '600',
            color: '#6b7280',
          }}>
            Share
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <>
      <StatusBar style="dark" />
      <SafeAreaView style={{ flex: 1, backgroundColor: '#f1f5f9' }}>
        {/* Beautiful Header */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          start={{ x: 0.0, y: 0.0 }}
          end={{ x: 1.0, y: 1.0 }}
          style={{
            paddingHorizontal: 20,
            paddingVertical: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 12,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="school" size={20} color="#ffffff" />
              </View>
              <View>
                <Text style={{
                  fontSize: 24,
                  fontWeight: '800',
                  color: '#ffffff',
                  letterSpacing: -0.5,
                }}>
                  DESocial
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: 'rgba(255, 255, 255, 0.8)',
                }}>
                  Welcome back, {user?.displayName || 'Student'}!
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={() => setShowCreatePost(!showCreatePost)}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons 
                  name={showCreatePost ? "close" : "add"} 
                  size={24} 
                  color="#ffffff" 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={handleLogout}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="log-out-outline" size={22} color="#ffffff" />
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>

        {/* Swipe Indicator for Instagram-like Navigation */}
        <View style={{
          backgroundColor: 'rgba(102, 126, 234, 0.1)',
          paddingHorizontal: 20,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(102, 126, 234, 0.1)',
        }}>
          <TouchableOpacity 
            onPress={() => router.push('/home/chat')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={16} color="#667eea" />
            <Text style={{
              fontSize: 14,
              color: '#667eea',
              fontWeight: '600',
              marginHorizontal: 8,
            }}>
              Swipe right or tap for Messages
            </Text>
            <Ionicons name="chatbubbles" size={16} color="#667eea" />
          </TouchableOpacity>
        </View>

        {/* Create Post Section */}
        {showCreatePost && (
          <View style={{
            backgroundColor: '#ffffff',
            marginHorizontal: 16,
            marginTop: 16,
            borderRadius: 20,
            padding: 24,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 8,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: '#f3f4f6',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}>
                <Ionicons name="create-outline" size={24} color="#667eea" />
              </View>
              <View>
                <Text style={{
                  fontSize: 20,
                  fontWeight: '700',
                  color: '#1f2937',
                }}>
                  Share your thoughts
                </Text>
                <Text style={{
                  fontSize: 14,
                  color: '#6b7280',
                }}>
                  What&apos;s happening in your world?
                </Text>
              </View>
            </View>
            
            <TextInput
              style={{
                borderWidth: 2,
                borderColor: '#e5e7eb',
                borderRadius: 16,
                padding: 16,
                fontSize: 16,
                color: '#374151',
                minHeight: 120,
                textAlignVertical: 'top',
                backgroundColor: '#f8fafc',
              }}
              placeholder="Share something with your community..."
              placeholderTextColor="#9ca3af"
              value={newPostContent}
              onChangeText={setNewPostContent}
              multiline
            />
            
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: 20,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                  marginRight: 12,
                }}>
                  <Ionicons name="image-outline" size={20} color="#6b7280" />
                  <Text style={{ marginLeft: 8, fontSize: 14, color: '#6b7280', fontWeight: '600' }}>
                    Photo
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: '#f3f4f6',
                }}>
                  <Ionicons name="location-outline" size={20} color="#6b7280" />
                  <Text style={{ marginLeft: 8, fontSize: 14, color: '#6b7280', fontWeight: '600' }}>
                    Location
                  </Text>
                </TouchableOpacity>
              </View>
              
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                  onPress={() => {
                    setShowCreatePost(false);
                    setNewPostContent('');
                  }}
                  style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    borderRadius: 25,
                    backgroundColor: '#f3f4f6',
                    marginRight: 12,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#6b7280' }}>
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleCreatePost}
                  style={{
                    paddingHorizontal: 24,
                    paddingVertical: 12,
                    borderRadius: 25,
                    backgroundColor: '#667eea',
                    shadowColor: '#667eea',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 12,
                    elevation: 6,
                  }}
                >
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                    Post
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Posts Feed */}
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={['#667eea']}
              progressBackgroundColor="#ffffff"
              tintColor="#667eea"
            />
          }
        >
          {loading ? (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 80,
            }}>
              <View style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 20,
              }}>
                <Ionicons name="refresh-outline" size={32} color="#667eea" />
              </View>
              <Text style={{
                fontSize: 18,
                fontWeight: '600',
                color: '#6b7280',
                marginBottom: 8,
              }}>
                Loading your feed...
              </Text>
              <Text style={{
                fontSize: 14,
                color: '#9ca3af',
                textAlign: 'center',
                paddingHorizontal: 40,
              }}>
                Getting the latest posts from your community
              </Text>
            </View>
          ) : posts.length === 0 ? (
            <View style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingVertical: 80,
              paddingHorizontal: 32,
            }}>
              <View style={{
                width: 120,
                height: 120,
                borderRadius: 60,
                backgroundColor: 'rgba(102, 126, 234, 0.1)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 24,
              }}>
                <Ionicons name="newspaper-outline" size={48} color="#667eea" />
              </View>
              <Text style={{
                fontSize: 24,
                fontWeight: '700',
                color: '#374151',
                marginBottom: 12,
                textAlign: 'center',
              }}>
                Welcome to DESocial!
              </Text>
              <Text style={{
                fontSize: 16,
                color: '#6b7280',
                textAlign: 'center',
                lineHeight: 24,
                marginBottom: 24,
              }}>
                Be the first to share something amazing with your DES Pune University community!
              </Text>
              <TouchableOpacity
                onPress={() => setShowCreatePost(true)}
                style={{
                  backgroundColor: '#667eea',
                  paddingHorizontal: 32,
                  paddingVertical: 16,
                  borderRadius: 25,
                  shadowColor: '#667eea',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 12,
                  elevation: 6,
                }}
              >
                <Text style={{
                  fontSize: 16,
                  fontWeight: '700',
                  color: '#ffffff',
                }}>
                  Create First Post
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            posts.map(renderPost)
          )}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}