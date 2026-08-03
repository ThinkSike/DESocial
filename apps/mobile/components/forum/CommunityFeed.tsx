import { useThemeColors } from '@/constants/Colors';
import { Post } from '@/types/post';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Image } from 'expo-image';

interface CurrentUser {
  id?: string;
  displayName?: string;
  username?: string;
  avatar?: string;
}

interface CommunityFeedProps {
  posts: Post[];
  selectedCommunity?: string;
  isJoinedCommunity?: boolean;
  currentUser?: CurrentUser | null;
  onLocalPost?: (post: Post) => void;
}

export function CommunityFeed({
  posts,
  selectedCommunity,
  isJoinedCommunity = false,
  currentUser,
  onLocalPost,
}: CommunityFeedProps) {
  const colors = useThemeColors();
  const [postText, setPostText] = useState('');
  const [posting, setPosting] = useState(false);

  const formatTimeAgo = (timestamp: Date | string) => {
    const date = typeof timestamp === 'string' ? new Date(timestamp) : timestamp;
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    return 'now';
  };

  const handlePost = async () => {
    const text = postText.trim();
    if (!text) return;
    if (!currentUser?.id) {
      Alert.alert('Sign in required', 'You must be logged in to post.');
      return;
    }

    setPosting(true);
    try {
      // Optimistic local post
      const newPost: Post = {
        id: `local-${Date.now()}`,
        user: {
          id: currentUser.id,
          displayName: currentUser.displayName ?? 'You',
          username: currentUser.username ?? 'me',
          avatar: currentUser.avatar ?? '',
          verified: false,
        },
        content: { text },
        engagement: { likes: 0, comments: 0 },
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        community: selectedCommunity
          ? { id: selectedCommunity, name: selectedCommunity, icon: 'ellipse' }
          : undefined,
      };
      setPostText('');
      onLocalPost?.(newPost);
    } catch {
      Alert.alert('Error', 'Could not submit your post. Please try again.');
    } finally {
      setPosting(false);
    }
  };

  const renderPostCard = ({ item: post }: { item: Post }) => (
    <View
      style={[
        styles.postCard,
        {
          backgroundColor: colors.cardBackground,
          shadowColor: colors.textSecondary + '30',
        },
      ]}
    >
      {/* Community Badge */}
      {post.community && (
        <View style={[styles.communityBadge, { backgroundColor: colors.primary + '15' }]}>
          <Ionicons name={post.community.icon as any} size={14} color={colors.primary} />
          <Text style={[styles.communityBadgeText, { color: colors.primary }]}>
            {post.community.name}
          </Text>
        </View>
      )}

      {/* Post Header */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <Image
            source={{ uri: post.user.avatar || 'https://i.pravatar.cc/80?img=1' }}
            style={styles.avatar}
            contentFit="cover"
          />
          <View style={styles.userDetails}>
            <View style={styles.nameRow}>
              <Text style={[styles.displayName, { color: colors.text }]}>
                {post.user.displayName}
              </Text>
              {post.user.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={15}
                  color={colors.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <Text style={[styles.username, { color: colors.textSecondary }]}>
              @{post.user.username} · {formatTimeAgo(post.timestamp)}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.optionsButton}>
          <Ionicons name="ellipsis-horizontal" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Post Content */}
      {post.content.text ? (
        <Text style={[styles.postText, { color: colors.text }]}>{post.content.text}</Text>
      ) : null}

      {/* Hashtags */}
      {post.content.hashtags && post.content.hashtags.length > 0 && (
        <View style={styles.hashtagsContainer}>
          {post.content.hashtags.map((tag, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.hashtag, { backgroundColor: colors.primary + '15' }]}
            >
              <Text style={[styles.hashtagText, { color: colors.primary }]}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Images */}
      {post.content.images && post.content.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {post.content.images.map((url, i) => (
            <Image
              key={i}
              source={{ uri: url }}
              style={[
                styles.postImage,
                post.content.images!.length === 1 ? styles.singleImage : styles.multipleImage,
                { backgroundColor: colors.border },
              ]}
              contentFit="cover"
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
            <View
              style={[
                styles.eventTypeBadge,
                {
                  backgroundColor:
                    post.event.type === 'upcoming'
                      ? colors.primary + '15'
                      : post.event.type === 'ongoing'
                      ? '#4CAF50' + '15'
                      : colors.textSecondary + '15',
                },
              ]}
            >
              <Ionicons
                name={
                  post.event.type === 'upcoming'
                    ? 'time-outline'
                    : post.event.type === 'ongoing'
                    ? 'play-circle-outline'
                    : 'checkmark-circle-outline'
                }
                size={14}
                color={
                  post.event.type === 'upcoming'
                    ? colors.primary
                    : post.event.type === 'ongoing'
                    ? '#4CAF50'
                    : colors.textSecondary
                }
              />
              <Text
                style={[
                  styles.eventTypeText,
                  {
                    color:
                      post.event.type === 'upcoming'
                        ? colors.primary
                        : post.event.type === 'ongoing'
                        ? '#4CAF50'
                        : colors.textSecondary,
                  },
                ]}
              >
                {post.event.type.charAt(0).toUpperCase() + post.event.type.slice(1)}
              </Text>
            </View>
            <Ionicons name="location-outline" size={14} color={colors.primary} />
          </View>

          <Text style={[styles.eventTitle, { color: colors.text }]}>{post.event.title}</Text>
          <Text style={[styles.eventDate, { color: colors.textSecondary }]}>
            {new Date(post.event.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
          <View style={styles.eventLocation}>
            <Text style={[styles.eventLocationText, { color: colors.textSecondary }]}>
              Tap to view location on campus map
            </Text>
            <Ionicons name="chevron-forward" size={14} color={colors.textSecondary} />
          </View>
        </TouchableOpacity>
      )}

      {/* Actions */}
      <View style={[styles.postActions, { borderTopColor: colors.border }]}>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="heart-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {post.engagement.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="chatbubble-outline" size={18} color={colors.textSecondary} />
          <Text style={[styles.actionText, { color: colors.textSecondary }]}>
            {post.engagement.comments}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const feedTitle =
    selectedCommunity === 'all'
      ? 'All Communities'
      : selectedCommunity
      ? posts.length > 0
        ? posts[0].community?.name ?? 'Community Feed'
        : 'Community Feed'
      : 'Your Communities Feed';

  const PostComposer = () => {
    if (!isJoinedCommunity || !selectedCommunity || selectedCommunity === 'all') return null;
    return (
      <View style={[styles.composer, { backgroundColor: colors.cardBackground, borderColor: colors.border }]}>
        <Image
          source={{ uri: currentUser?.avatar || 'https://i.pravatar.cc/80?img=1' }}
          style={styles.composerAvatar}
          contentFit="cover"
        />
        <View style={styles.composerInput}>
          <TextInput
            style={[styles.composerTextInput, { color: colors.text, borderColor: colors.border }]}
            placeholder={`Post in this community...`}
            placeholderTextColor={colors.textSecondary}
            value={postText}
            onChangeText={setPostText}
            multiline
            maxLength={500}
          />
          {postText.trim().length > 0 && (
            <TouchableOpacity
              style={[styles.postBtn, { backgroundColor: posting ? colors.border : colors.primary }]}
              onPress={handlePost}
              disabled={posting}
            >
              <Text style={styles.postBtnText}>{posting ? '...' : 'Post'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  const ListHeader = () => (
    <>
      <View
        style={[styles.feedHeader, { borderBottomColor: colors.border, backgroundColor: colors.cardBackground }]}
      >
        <Text style={[styles.feedTitle, { color: colors.text }]}>{feedTitle}</Text>
      </View>
      <PostComposer />
    </>
  );

  const EmptyComponent = () => (
    <View style={styles.emptyState}>
      <Ionicons name="chatbubbles-outline" size={56} color={colors.textSecondary} />
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No posts yet</Text>
      <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
        {selectedCommunity && selectedCommunity !== 'all'
          ? isJoinedCommunity
            ? 'Be the first to post in this community!'
            : "Join this community to see its posts."
          : 'Join some communities to see posts here.'}
      </Text>
    </View>
  );

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={renderPostCard}
      ListHeaderComponent={<ListHeader />}
      ListEmptyComponent={<EmptyComponent />}
      contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
      style={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  listContent: {
    paddingBottom: 24,
  },
  feedHeader: {
    marginTop: 16,
    marginHorizontal: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderRadius: 12,
    marginBottom: 8,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  // Post composer
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 10,
  },
  composerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  composerInput: {
    flex: 1,
    gap: 8,
  },
  composerTextInput: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    minHeight: 44,
    textAlignVertical: 'top',
  },
  postBtn: {
    alignSelf: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
  // Post card
  postCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 14,
    ...Platform.select({
      ios: { shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 6 },
      android: { elevation: 2 },
    }),
  },
  communityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    marginBottom: 10,
    gap: 4,
  },
  communityBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 10,
  },
  userDetails: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center' },
  displayName: { fontSize: 15, fontWeight: '600' },
  username: { fontSize: 13, marginTop: 1 },
  optionsButton: { padding: 4 },
  postText: { fontSize: 14, lineHeight: 21, marginBottom: 8 },
  hashtagsContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8, gap: 6 },
  hashtag: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  hashtagText: { fontSize: 12, fontWeight: '600' },
  imagesContainer: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, borderRadius: 10, overflow: 'hidden' },
  postImage: {},
  singleImage: { width: '100%', height: 200 },
  multipleImage: { width: '48%', height: 140, margin: '1%' },
  // Event
  eventCard: { marginTop: 10, padding: 14, borderRadius: 12, borderWidth: 1 },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  eventTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 4,
  },
  eventTypeText: { fontSize: 12, fontWeight: '600' },
  eventTitle: { fontSize: 15, fontWeight: '600', marginBottom: 6 },
  eventDate: { fontSize: 13, marginBottom: 10 },
  eventLocation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventLocationText: { fontSize: 12, fontStyle: 'italic' },
  // Actions
  postActions: {
    flexDirection: 'row',
    paddingTop: 10,
    borderTopWidth: 1,
    marginTop: 6,
    gap: 4,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    gap: 6,
  },
  actionText: { fontSize: 13, fontWeight: '500' },
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', marginTop: 14, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, textAlign: 'center', lineHeight: 22 },
});