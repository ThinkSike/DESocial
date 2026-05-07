import { useThemeColors } from '@/constants/Colors';
import { Post } from '@/types/post';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface CommunityFeedProps {
  posts: Post[];
  selectedCommunity?: string;
}

export function CommunityFeed({ posts, selectedCommunity }: CommunityFeedProps) {
  const { width } = Dimensions.get('window');
  const isTablet = width > 768;
  const colors = useThemeColors();

  const formatTimeAgo = (timestamp: Date | string) => {
    const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d`;
    } else if (hours > 0) {
      return `${hours}h`;
    } else {
      return 'now';
    }
  };

  const formatEventDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    const now = new Date();
    const diffTime = d.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return `Today at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return `Tomorrow at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays > 0 && diffDays <= 7) {
      return `${d.toLocaleDateString([], { weekday: 'long' })} at ${d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return d.toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }
  };

  const renderPost = (post: Post) => (
    <View key={post.id} style={[styles.postCard, { 
      backgroundColor: colors.cardBackground,
      shadowColor: colors.textSecondary + '30',
    }]}>
      {/* Community Badge */}
      {post.community && (
        <View style={[styles.communityBadge, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons
            name={post.community.icon as any}
            size={16}
            color={colors.primary}
          />
          <Text style={[styles.communityName, { color: colors.primary }]}>{post.community.name}</Text>
        </View>
      )}

      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>{post.user.displayName}</Text>
              {post.user.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={16}
                  color={colors.primary}
                  style={styles.verifiedIcon}
                />
              )}
            </View>
            <Text style={[styles.username, { color: colors.textSecondary }]}>@{post.user.username}</Text>
          </View>
        </View>
        <View style={styles.timeAndOptions}>
          <Text style={[styles.timestamp, { color: colors.textSecondary }]}>{formatTimeAgo(post.timestamp)}</Text>
          <TouchableOpacity style={styles.optionsButton}>
            <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Post Content */}
      <View style={styles.postContent}>
        {post.content.text && (
          <Text style={[styles.postText, { color: colors.text }]}>{post.content.text}</Text>
        )}
        
        {/* Hashtags */}
        {post.content.hashtags && post.content.hashtags.length > 0 && (
          <View style={styles.hashtagsContainer}>
            {post.content.hashtags.map((hashtag, index) => (
              <TouchableOpacity key={index} style={[styles.hashtag, { backgroundColor: colors.primary + '15' }]}>
                <Text style={[styles.hashtagText, { color: colors.primary }]}>{hashtag}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Images */}
        {post.content.images && post.content.images.length > 0 && (
          <View style={styles.imagesContainer}>
            {post.content.images.map((imageUrl, index) => (
              <Image
                key={index}
                source={{ uri: imageUrl }}
                style={[
                  styles.postImage,
                  { backgroundColor: colors.border },
                  post.content.images!.length === 1
                    ? styles.singleImage
                    : styles.multipleImage,
                ]}
                resizeMode="cover"
              />
            ))}
          </View>
        )}

        {/* Event Card */}
        {post.event && (
          <TouchableOpacity 
            style={[styles.eventCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <View style={styles.eventHeader}>
              <View style={[styles.eventTypeIndicator, { 
                backgroundColor: post.event.type === 'upcoming' ? colors.primary + '15' : 
                                post.event.type === 'ongoing' ? '#4CAF50' + '15' : colors.textSecondary + '15' 
              }]}>
                <Ionicons 
                  name={post.event.type === 'upcoming' ? 'time-outline' : 
                       post.event.type === 'ongoing' ? 'play-circle-outline' : 'checkmark-circle-outline'} 
                  size={16} 
                  color={post.event.type === 'upcoming' ? colors.primary : 
                         post.event.type === 'ongoing' ? '#4CAF50' : colors.textSecondary} 
                />
                <Text style={[styles.eventTypeText, { 
                  color: post.event.type === 'upcoming' ? colors.primary : 
                         post.event.type === 'ongoing' ? '#4CAF50' : colors.textSecondary 
                }]}>
                  {post.event.type.charAt(0).toUpperCase() + post.event.type.slice(1)}
                </Text>
              </View>
              <Ionicons name="location-outline" size={16} color={colors.primary} />
            </View>
            
            <Text style={[styles.eventTitle, { color: colors.text }]}>{post.event.title}</Text>
            <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
              {new Date(post.event.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Text>
            
            <View style={styles.eventLocationInfo}>
              <Text style={[styles.eventLocationText, { color: colors.textSecondary }]}>
                Tap to view location on campus map
              </Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Post Actions */}
      <View style={[styles.postActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="heart-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.engagement.likes}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="chatbubble-outline" size={20} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>{post.engagement.comments}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const feedTitle = selectedCommunity === 'all' 
    ? 'All Communities' 
    : selectedCommunity 
      ? posts.length > 0 
        ? posts[0].community?.name 
        : 'Community Feed'
      : 'Your Communities Feed';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Feed Header */}
      <View style={[styles.feedHeader, { 
        borderBottomColor: colors.border, 
        backgroundColor: colors.cardBackground 
      }]}>
        <Text style={[styles.feedTitle, { color: colors.text }]}>{feedTitle}</Text>
        {/* <Text style={[styles.feedSubtitle, { color: colors.textSecondary }]}>
          {posts.length} {posts.length === 1 ? 'post' : 'posts'}
        </Text> */}
      </View>

      {/* Posts List */}
      {posts.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="chatbubbles-outline" size={64} color={colors.textSecondary} />
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts yet</Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            {selectedCommunity && selectedCommunity !== 'all'
              ? 'This community hasn\'t posted anything yet.'
              : 'Join some communities to see posts here.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          style={styles.postsContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.postsContent}
        >
          {posts.map(renderPost)}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  feedHeader: {
    marginTop:20,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  feedTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  feedSubtitle: {
    fontSize: 14,
  },
  postsContainer: {
    flex: 1,
  },
  postsContent: {
    paddingVertical: 8,
  },
  postCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  communityName: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  displayName: {
    fontSize: 16,
    fontWeight: '600',
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  username: {
    fontSize: 14,
    marginTop: 2,
  },
  timeAndOptions: {
    alignItems: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    marginBottom: 4,
  },
  optionsButton: {
    padding: 4,
  },
  postContent: {
    marginBottom: 12,
  },
  postText: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
  },
  hashtagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
  },
  hashtag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  hashtagText: {
    fontSize: 12,
    fontWeight: '600',
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  postImage: {
  },
  singleImage: {
    width: '100%',
    height: 200,
  },
  multipleImage: {
    width: '48%',
    height: 150,
    margin: '1%',
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionText: {
    fontSize: 14,
    marginLeft: 8,
    fontWeight: '500',
  },
  eventCard: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  eventTypeText: {
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  eventDate: {
    fontSize: 14,
    marginBottom: 12,
  },
  eventLocationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLocationText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});