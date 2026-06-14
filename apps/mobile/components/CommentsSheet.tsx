import ReportSheet from "@/components/ReportSheet";
import { useThemeColors } from "@/constants/Colors";
import { type Comment, useComments } from "@/hooks/useComments";
import { useAuthStore } from "@/store/auth";
import { getTimeAgo } from "@/utils/format";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import React, { useMemo, useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    KeyboardAvoidingView,
    ListRenderItem,
    Modal,
    Platform,
    Pressable,
    Image as RNImage,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface CommentsSheetProps {
  postId: string | null;
  visible: boolean;
  onClose: () => void;
  onCommentCountChange?: (postId: string, delta: number) => void;
}

export default function CommentsSheet({
  postId,
  visible,
  onClose,
  onCommentCountChange,
}: CommentsSheetProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const { user } = useAuthStore();
  const s = styles(colors);

  const { comments, loading, posting, addComment, deleteComment, toggleLike } =
    useComments(visible ? postId : null);

  const [text, setText] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);
  const [expandedThreads, setExpandedThreads] = useState<Record<number, boolean>>({});
  const [reportTarget, setReportTarget] = useState<number | null>(null);
  const inputRef = useRef<TextInput>(null);

  const QUICK_EMOJIS = [
    "😀",
    "😂",
    "😍",
    "🔥",
    "🙌",
    "👏",
    "🥲",
    "😮",
    "😢",
    "😡",
    "🎉",
    "✨",
  ];

  const threadedComments = useMemo(() => {
    const byId = new Map<number, Comment>();
    const childrenMap = new Map<number, Comment[]>();
    const roots: Comment[] = [];

    comments.forEach((c) => {
      byId.set(c.id, c);
      if (c.parentId) {
        const list = childrenMap.get(c.parentId) || [];
        list.push(c);
        childrenMap.set(c.parentId, list);
      } else {
        roots.push(c);
      }
    });

    const replyCounts = new Map<number, number>();

    const countReplies = (id: number): number => {
      if (replyCounts.has(id)) return replyCounts.get(id)!;
      const children = childrenMap.get(id) || [];
      let count = children.length;
      children.forEach((child) => {
        count += countReplies(child.id);
      });
      replyCounts.set(id, count);
      return count;
    };

    byId.forEach((_, id) => {
      countReplies(id);
    });

    const ordered: Array<Comment & { depth: number; parentUser?: string; replyCount?: number; hasChildren?: boolean }> = [];

    const walk = (node: Comment, depth: number) => {
      const parent = node.parentId ? byId.get(node.parentId) : undefined;
      const children = childrenMap.get(node.id);
      const hasChildren = !!children?.length;
      ordered.push({
        ...node,
        depth,
        parentUser: parent?.user?.username,
        replyCount: replyCounts.get(node.id),
        hasChildren,
      });

      if (children?.length && expandedThreads[node.id]) {
        children.forEach((child) => walk(child, depth + 1));
      }
    };

    roots.forEach((root) => walk(root, 0));
    return ordered;
  }, [comments, expandedThreads]);

  const selectImages = async (fromCamera = false) => {
    const request = fromCamera
      ? ImagePicker.requestCameraPermissionsAsync
      : ImagePicker.requestMediaLibraryPermissionsAsync;

    const { status } = await request();
    if (status !== "granted") {
      Alert.alert("Permission needed", "Please grant access");
      return;
    }

    const picker = fromCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await picker({
      mediaTypes: "images",
      allowsMultipleSelection: !fromCamera,
      selectionLimit: 4,
      quality: 0.8,
    });

    if (!result.canceled) {
      const uris = fromCamera
        ? [result.assets[0].uri]
        : result.assets.map((a) => a.uri);
      setImages((prev) => [...prev, ...uris].slice(0, 4));
    }
  };

  const showImageOptions = () => {
    if (Platform.OS === "web") return selectImages(false);
    Alert.alert("Add Photo", "", [
      { text: "Camera", onPress: () => selectImages(true) },
      { text: "Gallery", onPress: () => selectImages(false) },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleSend = async () => {
    if (!user) {
      Alert.alert("Sign in required", "Please sign in to comment.");
      return;
    }
    if ((!text.trim() && images.length === 0) || posting) return;
    const draft = text;
    setText("");
    try {
      await addComment({ text: draft, parentId: replyTo?.id, images });
      setImages([]);
      setReplyTo(null);
      if (postId) onCommentCountChange?.(postId, 1);
    } catch (err: any) {
      setText(draft); // restore on failure
      const message = err?.message || "Could not post comment. Please try again.";
      Alert.alert("Error", message);
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    Alert.alert("Delete comment", "Remove this comment?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteComment(comment.id);
            if (postId) {
              const descendants = new Set<number>();
              const stack = [comment.id];
              while (stack.length) {
                const current = stack.pop()!;
                descendants.add(current);
                comments
                  .filter((c) => c.parentId === current)
                  .forEach((c) => stack.push(c.id));
              }

              const delta = -descendants.size;
              onCommentCountChange?.(postId, delta);
            }
          } catch {
            Alert.alert("Error", "Could not delete comment. Please try again.");
          }
        },
      },
    ]);
  };

  const renderComment: ListRenderItem<Comment & { depth?: number; parentUser?: string; replyCount?: number; hasChildren?: boolean }> = ({ item }) => {
    const isOwn = item.user.id === user?.id;
    const isReply = !!item.parentId;
    const depth = item.depth ?? 0;
    const isExpanded = !!expandedThreads[item.id];
    const replyCount = item.replyCount ?? 0;
    return (
      <View style={[s.commentRow, isReply && s.replyRow, depth > 0 && { paddingLeft: 16 + depth * 18 }]}>
        <Image
          source={{ uri: item.user.avatar || "https://i.pravatar.cc/40" }}
          style={s.avatar}
          contentFit="cover"
          transition={150}
        />
        <View style={s.bubble}>
          {/* Author + time */}
          <View style={s.bubbleHeader}>
            <Text style={s.authorName}>{item.user.displayName}</Text>
            {item.user.verified && (
              <Ionicons
                name="checkmark-circle"
                size={13}
                color={colors.primary}
                style={{ marginLeft: 3 }}
              />
            )}
            <Text style={s.timestamp}> · {getTimeAgo(item.createdAt)}</Text>
          </View>

          {/* Comment text */}
          {item.parentUser && (
            <Text style={s.replyLink}>Replying to @{item.parentUser}</Text>
          )}
          <Text style={s.commentText}>{item.text}</Text>

          {!!item.images?.length && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.imageRow}
            >
              {item.images.map((uri, idx) => (
                <RNImage
                  key={`${item.id}-img-${idx}`}
                  source={{ uri }}
                  style={s.commentImage}
                />
              ))}
            </ScrollView>
          )}

          {/* Actions: like + delete */}
          <View style={s.commentActions}>
            <TouchableOpacity
              style={s.actionBtn}
              onPress={() => toggleLike(item.id)}
            >
              <Ionicons
                name={item.likedByMe ? "heart" : "heart-outline"}
                size={15}
                color={item.likedByMe ? "#E53935" : colors.textSecondary}
              />
              {item.likesCount > 0 && (
                <Text
                  style={[
                    s.actionCount,
                    item.likedByMe && { color: "#E53935" },
                  ]}
                >
                  {item.likesCount}
                </Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={s.actionBtn}
              onPress={() => {
                setReplyTo(item);
                inputRef.current?.focus();
              }}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={15}
                color={colors.textSecondary}
              />
            </TouchableOpacity>

            {item.hasChildren && (
              <TouchableOpacity
                style={s.replyToggle}
                onPress={() =>
                  setExpandedThreads((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id],
                  }))
                }
              >
                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={colors.textSecondary}
                />
                <Text style={s.replyToggleText}>
                  {isExpanded
                    ? "Hide replies"
                    : `View ${replyCount} ${replyCount === 1 ? "reply" : "replies"}`}
                </Text>
              </TouchableOpacity>
            )}

            {isOwn ? (
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => handleDeleteComment(item)}
              >
                <Ionicons
                  name="trash-outline"
                  size={15}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={s.actionBtn}
                onPress={() => setReportTarget(item.id)}
              >
                <Ionicons
                  name="flag-outline"
                  size={15}
                  color={colors.textSecondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={s.backdrop} onPress={onClose} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={[s.sheet, { paddingBottom: insets.bottom || 12 }]}
      >
        {/* Handle bar */}
        <View style={s.handleWrap}>
          <View style={[s.handle, { backgroundColor: colors.border }]} />
        </View>

        {/* Header */}
        <View style={[s.header, { borderBottomColor: colors.border }]}>
          <Text style={[s.headerTitle, { color: colors.text }]}>Comments</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Ionicons name="close" size={22} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Comment list */}
        {loading ? (
          <View style={s.center}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : (
          <FlatList
            data={threadedComments}
            keyExtractor={(item) => String(item.id)}
            renderItem={renderComment}
            contentContainerStyle={
              threadedComments.length === 0 ? s.emptyContainer : s.listContent
            }
            ListEmptyComponent={
              <View style={s.center}>
                <Ionicons
                  name="chatbubble-outline"
                  size={40}
                  color={colors.textSecondary}
                />
                <Text style={[s.emptyText, { color: colors.textSecondary }]}>
                  No comments yet. Be the first!
                </Text>
              </View>
            }
            showsVerticalScrollIndicator={false}
          />
        )}

        {/* Composer */}
        <View
          style={[
            s.composer,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.surface,
            },
          ]}
        >
          {replyTo && (
            <View style={s.replyBanner}>
              <Text style={s.replyText}>Replying to @{replyTo.user.username}</Text>
              <TouchableOpacity onPress={() => setReplyTo(null)}>
                <Ionicons name="close" size={16} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}

          {images.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.imagePreviewRow}
            >
              {images.map((uri, i) => (
                <View key={`${uri}-${i}`} style={s.previewBox}>
                  <RNImage source={{ uri }} style={s.previewImage} />
                  <TouchableOpacity
                    style={s.previewRemove}
                    onPress={() =>
                      setImages((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    <Ionicons name="close-circle" size={18} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {showEmoji && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={s.emojiRow}
            >
              {QUICK_EMOJIS.map((emoji) => (
                <TouchableOpacity
                  key={emoji}
                  style={s.emojiBtn}
                  onPress={() => setText((prev) => `${prev}${emoji}`)}
                >
                  <Text style={s.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={s.composerRow}>
            <Image
              source={{
                uri: (user as any)?.avatar || "https://i.pravatar.cc/36",
              }}
              style={s.composerAvatar}
              contentFit="cover"
            />
            <TextInput
              ref={inputRef}
              style={[
                s.composerInput,
                {
                  color: colors.text,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Write a comment…"
              placeholderTextColor={colors.textSecondary}
              value={text}
              onChangeText={setText}
              multiline
              maxLength={1000}
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity
              style={s.iconBtn}
              onPress={() => setShowEmoji((prev) => !prev)}
            >
              <Ionicons name="happy-outline" size={18} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={s.iconBtn}
              onPress={showImageOptions}
              disabled={images.length >= 4}
            >
              <Ionicons
                name="image"
                size={18}
                color={images.length >= 4 ? colors.textSecondary : colors.primary}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                s.sendBtn,
                {
                  backgroundColor:
                    (text.trim() || images.length) && !posting
                      ? colors.primary
                      : colors.border,
                },
              ]}
              onPress={handleSend}
              disabled={(!text.trim() && images.length === 0) || posting}
            >
              {posting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="send" size={16} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>

      <ReportSheet
        visible={reportTarget !== null}
        targetType="comment"
        targetId={reportTarget ?? 0}
        onClose={() => setReportTarget(null)}
      />
    </Modal>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.4)",
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      maxHeight: "80%",
      minHeight: "50%",
    },
    handleWrap: {
      alignItems: "center",
      paddingTop: 10,
      paddingBottom: 4,
    },
    handle: {
      width: 36,
      height: 4,
      borderRadius: 2,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
    },
    headerTitle: {
      fontSize: 17,
      fontWeight: "700",
    },
    center: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 40,
    },
    emptyContainer: {
      flexGrow: 1,
    },
    listContent: {
      paddingVertical: 8,
    },
    emptyText: {
      marginTop: 12,
      fontSize: 14,
    },
    // Comment rows
    commentRow: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingVertical: 10,
      alignItems: "flex-start",
    },
    replyRow: {
      paddingLeft: 32,
    },
    avatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: 10,
      marginTop: 2,
    },
    bubble: {
      flex: 1,
      backgroundColor: colors.background,
      borderRadius: 12,
      padding: 10,
      borderWidth: 1,
      borderColor: colors.border,
    },
    bubbleHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 4,
    },
    authorName: {
      fontSize: 13,
      fontWeight: "600",
      color: colors.text,
    },
    timestamp: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    commentText: {
      fontSize: 14,
      lineHeight: 20,
      color: colors.text,
    },
    replyLink: {
      fontSize: 12,
      color: colors.textSecondary,
      marginBottom: 4,
    },
    imageRow: {
      marginTop: 8,
    },
    commentImage: {
      width: 120,
      height: 120,
      borderRadius: 8,
      marginRight: 8,
    },
    commentActions: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      gap: 16,
    },
    actionBtn: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    actionCount: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    replyToggle: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
    },
    replyToggleText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
    // Composer
    composer: {
      flexDirection: "column",
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderTopWidth: 1,
      gap: 8,
    },
    composerRow: {
      flexDirection: "row",
      alignItems: "flex-end",
      gap: 8,
    },
    replyBanner: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 6,
      paddingVertical: 4,
    },
    replyText: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    imagePreviewRow: {
      paddingVertical: 4,
    },
    previewBox: {
      marginRight: 8,
    },
    previewImage: {
      width: 64,
      height: 64,
      borderRadius: 8,
    },
    previewRemove: {
      position: "absolute",
      top: -6,
      right: -6,
      backgroundColor: "rgba(0,0,0,0.6)",
      borderRadius: 10,
    },
    emojiRow: {
      paddingVertical: 4,
    },
    emojiBtn: {
      paddingHorizontal: 6,
      paddingVertical: 2,
    },
    emojiText: {
      fontSize: 20,
    },
    composerAvatar: {
      width: 32,
      height: 32,
      borderRadius: 16,
    },
    composerInput: {
      flex: 1,
      borderWidth: 1,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: Platform.OS === "ios" ? 10 : 8,
      fontSize: 14,
      maxHeight: 100,
    },
    iconBtn: {
      paddingHorizontal: 6,
      paddingVertical: 6,
    },
    sendBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
    },
  });
