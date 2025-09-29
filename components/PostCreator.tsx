import { useThemeColors } from "@/constants/Colors";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface PostCreatorProps {
  user?: {
    name: string;
    avatar: string;
  };
  onCreatePost?: (content: string) => void;
}

export default function PostCreator({
  user = {
    name: "Tiya Bhavsar",
    avatar: "https://i.pravatar.cc/150?img=1",
  },
  onCreatePost,
}: PostCreatorProps) {
  const colors = useThemeColors();
  const [postText, setPostText] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const handlePostSubmit = () => {
    if (postText.trim()) {
      onCreatePost?.(postText);
      setPostText("");
      setIsFocused(false);
      Alert.alert("Success", "Your post has been created!");
    }
  };

  const handleMediaAction = (type: string) => {
    Alert.alert(type, `${type} functionality would be implemented here`);
  };

  return (
    <View style={styles(colors).container}>
      {/* Post Input Section */}
      <View style={styles(colors).inputSection}>
        <Image source={{ uri: user.avatar }} style={styles(colors).avatar} />
        <TouchableOpacity
          style={styles(colors).inputContainer}
          onPress={() => setIsFocused(true)}
        >
          {!isFocused ? (
            <Text style={styles(colors).placeholder}>Start a post</Text>
          ) : (
            <TextInput
              style={styles(colors).textInput}
              placeholder="What do you want to talk about?"
              placeholderTextColor={colors.textSecondary}
              multiline
              value={postText}
              onChangeText={setPostText}
              autoFocus
              onBlur={() => !postText && setIsFocused(false)}
            />
          )}
        </TouchableOpacity>
      </View>

      {/* Action Buttons */}
      <View style={styles(colors).actionsSection}>
        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Video")}
        >
          <Ionicons name="videocam" size={20} color="#5F9B41" />
          <Text style={styles(colors).actionText}>Video</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Photo")}
        >
          <Ionicons name="image" size={20} color="#378FE9" />
          <Text style={styles(colors).actionText}>Photo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles(colors).actionButton}
          onPress={() => handleMediaAction("Article")}
        >
          <Ionicons name="document-text" size={20} color="#C37D16" />
          <Text style={styles(colors).actionText}>Write article</Text>
        </TouchableOpacity>
      </View>

      {/* Post Button (shown when typing) */}
      {isFocused && (
        <View style={styles(colors).postButtonSection}>
          <View style={styles(colors).postOptions}>
            <TouchableOpacity style={styles(colors).optionButton}>
              <Ionicons name="time" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles(colors).optionButton}>
              <Ionicons name="add" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles(colors).optionButton}>
              <Ionicons name="happy" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={[
              styles(colors).postButton,
              !postText.trim() && styles(colors).postButtonDisabled,
            ]}
            onPress={handlePostSubmit}
            disabled={!postText.trim()}
          >
            <Text
              style={[
                styles(colors).postButtonText,
                !postText.trim() && styles(colors).postButtonTextDisabled,
              ]}
            >
              Post
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Options */}
      <View style={styles(colors).sortSection}>
        <View style={styles(colors).sortLeft}>
          <Text style={styles(colors).sortText}>Sort by: </Text>
          <TouchableOpacity>
            <Text style={styles(colors).sortOption}>Top</Text>
          </TouchableOpacity>
          <Ionicons
            name="chevron-down"
            size={14}
            color={colors.textSecondary}
            style={styles(colors).sortIcon}
          />
        </View>
      </View>
    </View>
  );
}

const styles = (colors: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: colors.surface || "#FFFFFF",
      borderRadius: 12,
      marginHorizontal: 16,
      marginBottom: 16,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    },
    inputSection: {
      flexDirection: "row",
      alignItems: "flex-start",
      padding: 16,
      paddingBottom: 12,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: 12,
    },
    inputContainer: {
      flex: 1,
      minHeight: 48,
      borderWidth: 1,
      borderColor: colors.border || "#E1E8ED",
      borderRadius: 24,
      paddingHorizontal: 16,
      paddingVertical: 12,
      justifyContent: "center",
    },
    placeholder: {
      fontSize: 16,
      color: colors.textSecondary,
    },
    textInput: {
      fontSize: 16,
      color: colors.text,
      minHeight: 24,
      maxHeight: 120,
    },
    actionsSection: {
      flexDirection: "row",
      paddingHorizontal: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 8,
      paddingHorizontal: 12,
      marginRight: 16,
      borderRadius: 6,
    },
    actionText: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.textSecondary,
      marginLeft: 6,
    },
    postButtonSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.border || "#E1E8ED",
    },
    postOptions: {
      flexDirection: "row",
      alignItems: "center",
    },
    optionButton: {
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    postButton: {
      backgroundColor: colors.primary,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 20,
    },
    postButtonDisabled: {
      backgroundColor: colors.textSecondary + "40",
    },
    postButtonText: {
      color: "#FFFFFF",
      fontSize: 14,
      fontWeight: "600",
    },
    postButtonTextDisabled: {
      color: colors.textSecondary,
    },
    sortSection: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingVertical: 12,
    },
    sortLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    sortText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    sortOption: {
      fontSize: 14,
      fontWeight: "500",
      color: colors.text,
    },
    sortIcon: {
      marginLeft: 4,
    },
  });